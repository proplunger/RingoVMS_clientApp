import { State, toODataString } from "@progress/kendo-data-query";
import { Grid, GridNoRecords, GridColumn } from "@progress/kendo-react-grid";
import axios from "axios";
import * as React from "react";
import { currencyFormatter, initialDataState, newPageSizes, successToastr } from "../../../HelperMethods";
import { KendoFilter, NumberCell } from "../../ReusableComponents";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { PositionItemTemplate } from "./VendorInvoiceCell";
import auth from "../../Auth";
import { VendorInvoiceStatusIds, VIStatuses } from "../../Shared/AppConstants";
import { TS_VENDOR_AUTHORIZE_CONFIRMATION_MSG, VI_ACTIVE_CONFIRMATION_MSG, VI_UPDATED_SUCCESS_MSG } from "../../Shared/AppMessages";
import {CustomMenu, DefaultActions, DetailColumnCell, ExportExcel, ViewMoreComponent } from "./GlobalActions";
import RowActions from "../../Shared/Workflow/RowActions";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";

export interface UnderReviewVendorInvoicesProps { }

export interface UnderReviewVendorInvoicesState {
    selectAll?: any;
    onFirstLoad?: any;
    data: any;
    excelData: any;
    showLoader?: boolean;
    dataState?: any;
    showConfirmationModal?: any;
    showActiveModal?: any;
    approverComments?: any;
    approverCommentError?: any;
    clientId?: any;
    disableBtn?: any;
    totalCount?: number;
    selectedIds: any;
    ifAllSelected?: boolean;
}

class UnderReviewVendorInvoices extends React.Component<UnderReviewVendorInvoicesProps, UnderReviewVendorInvoicesState> {
    PositionItemCellTemplate;
    public dataItem: any;
    private userClientLobId: any = localStorage.getItem("UserClientLobId");
    constructor(props: UnderReviewVendorInvoicesProps) {
        super(props);
        this.state = {
            data: [],
            excelData: [],
            onFirstLoad: true,
            showLoader: true,
            approverComments: "",
            clientId: auth.getClient(),
            dataState: initialDataState,
            disableBtn: true,
            selectedIds:[],
            ifAllSelected:false,
        };

        this.PositionItemCellTemplate = PositionItemTemplate({
            check: this.handleSelectionChange.bind(this),
        });
    }

    componentDidMount() {
    }

    getUnderReviewVendorInvoices = (dataState, concat?) => {
        const { clientId } = this.state;
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var queryParams = `clientId eq ${clientId} and status eq '${VIStatuses.UNDERREVIEWQUEUE}'`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/vendor/invoice?${finalQueryString}`).then((res) => {
            this.setState({
                showLoader: false,
                dataState: dataState,
                data: concat ? this.state.data.concat(res.data) : res.data,
            });
            this.getUnderReviewVendorInvoiceCount(dataState);
        });
    };

    getUnderReviewVendorInvoiceCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        const { clientId } = this.state;
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        var queryParams = `clientId eq ${clientId} and status eq '${VIStatuses.UNDERREVIEWQUEUE}'`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/vendor/invoice?${finalQueryString}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                excelData: res.data
            });
        });
    };

    handleSelectionChange(e, vendorInvoiceId?) {
        const data = [...this.state.data];
        const updateData = data.map((x) => {
            if (x.vendorInvoiceId ==vendorInvoiceId) {
                x.isSelected = e.target.checked;
            }
            return x;
        });
        let flag = this.checkIfSelected();
        this.setState({ data: updateData, disableBtn: !flag[0], selectAll: flag[0] && flag[1] });
    }

    checkIfSelected() {
        let selectedIds = [];
        let totalDataCount = 0;
        this.state.data.forEach((item) => {
            if (item.isSelected==true) {
                selectedIds.push(item.vendorInvoiceId);
            }
            totalDataCount += 1;
        });
        if (!selectedIds.length) {
            return [false, false];
        }
        return [true, selectedIds.length==totalDataCount];
    }

    updateVIStatus = (status) => {
        if (status==VendorInvoiceStatusIds.ACTIVE && !this.state.approverComments.replace(/^\s+|\s+$/g, "")) {
            this.setState({ approverCommentError: true });
            return;
        }
        let selectedIds = [];
        this.state.data.forEach((item) => {
            if (item.isSelected==true || item.selected==true) {
                selectedIds.push(item.vendorInvoiceId);
            }
        });
        if (!selectedIds.length) {
            return;
        }
        let data = {
            id: selectedIds,
            statusId: status,
            clientLobId: this.userClientLobId,
            comment: this.state.approverComments
        };
        axios.patch(`api/vendor/invoices/status`, data).then((res) => {
            successToastr(VI_UPDATED_SUCCESS_MSG);
            this.setState({ showActiveModal: false, showConfirmationModal: false, data: [], dataState: initialDataState, selectAll: false });
            this.getUnderReviewVendorInvoices(initialDataState);
        });
    };

    onDataStateChange = (changeEvent) => {
        this.getUnderReviewVendorInvoices(changeEvent.data);
        localStorage.setItem("VIUnderReview-GridDataState", JSON.stringify(changeEvent.data));
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    selectionChange = (event) => {
        var checked = event.syntheticEvent.target.checked;
        let ids = this.state.selectedIds;
        const data = this.state.data.map((item) => {
          if (item.vendorInvoiceId ==event.dataItem.vendorInvoiceId) {
            item.selected = !event.dataItem.selected;
              if (checked==true) {
                ids.push(item.vendorInvoiceId);
                this.setState({
                    disableBtn:false
                })
              }
              else if(checked==false){
                ids = ids.filter((o) => o !=item.vendorInvoiceId);
              }
              
          }
          return item;
        });
        this.setState({ data, selectedIds: ids});
        if(this.state.data.length==this.state.data.filter(x=> x.selected).length){
            this.setState({ ifAllSelected: true });
        }else{
            this.setState({ ifAllSelected: false });
        }
        if(ids.length==0){
            this.setState({
                disableBtn:true
            })
        }
      };

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        let ids = [];
        const data = this.state.data.map((item) => {
            item.selected = checked;
            if (checked==true) {
                ids.push(item.vendorInvoiceId);
                this.setState({
                    disableBtn: false
                })
            }
            else
                if (checked==false) {
                    this.setState({
                        disableBtn: true
                    })
                }
            return item;
        });
        this.setState({ data, selectedIds: ids, ifAllSelected: !this.state.ifAllSelected });
        if (ids.length==0) {
            this.setState({
                disableBtn: true
            })
        }
    };  

    commentsChange = (e) => this.setState({ approverComments: e.target.value, approverCommentError: e.target.value=="" });

    render() {
        return (
            <React.Fragment>
                <div className="col-12 " id="searchCard">
                    {/* <div className="mt-3 mb-3 d-md-block d-none">
                        <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                            <div className="col-12 fonFifteen paddingLeftandRight">
                                Vendor Invoice Under Review
                            </div>
                        </div>
                    </div> */}
                    <div className="row mt-3">
                        <div className="col-md-12 pl-0 pr-0">
                            <div className="input-group mt-0">
                                <div className="container-fluid">
                                    <CompleteSearch
                                        placeholder="Search text here!"
                                        handleSearch={this.getUnderReviewVendorInvoices}
                                        entityType={"VendorInvoice"}
                                        onFirstLoad={this.state.onFirstLoad}
                                        page="VIUnderReview"
                                        persistSearchData={true}
                                    />
                                    <div className="shadow">
                                        <div className="row ml-0 mr-0  pb-2 pt-2 align-items-center mb-2">
                                            <div className="col-auto  export-to-excel"
                                            >
                                                {ExportExcel(this.state.excelData)}
                                            </div>
                                            <div className="col pl-0 ml-auto col-md text-right">
                                                <div className="row justify-content-end align-items-center">
                                                    <div className="col-auto">
                                                        <button
                                                            type="button"
                                                            className="btn button button-active-green mr-3 shadow"
                                                            disabled={this.state.disableBtn}
                                                            onClick={() => this.setState({ showActiveModal: true })}
                                                        >
                                                            Set To Active
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn button button-approved shadow"
                                                            disabled={this.state.disableBtn}
                                                            onClick={() => this.setState({ showConfirmationModal: true })}
                                                        >
                                                            Set To Vendor Authorized
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="candidateWFContainer" id="CandidateWF-Responsive">
                                        <Grid
                                            style={{ height: "auto" }}
                                            sortable={true}
                                            onDataStateChange={this.onDataStateChange}
                                            pageable={{ pageSizes: newPageSizes }}
                                            data={this.state.data}
                                            {...this.state.dataState}
                                            detail={ViewMoreComponent}
                                            expandField="expanded"
                                            total={this.state.totalCount}
                                            className="kendo-grid-custom lastchild"
                                            selectedField="selected"
                                            onSelectionChange={this.selectionChange}
                                            onHeaderSelectionChange={this.headerSelectionChange}
                                        >
                                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                                            <GridColumn
                                                field="selected"
                                                width="40px"
                                                headerSelectionValue={this.state.ifAllSelected}
                                            />
                                            <GridColumn
                                                field="vendorInvoiceNumber"
                                                title="Invoice Number"
                                                cell={(props) => CellRender(props, "Invoice Number")}
                                                columnMenu={ColumnMenu}
                                            />
                                            <GridColumn
                                                field="vendorName"
                                                title="Vendor"
                                                cell={(props) => CellRender(props, "Vendor Name")}
                                                columnMenu={ColumnMenu}
                                                filter="text"
                                            />
                                             <GridColumn
                                                field="billingPeriodStart"
                                                filter="date"
                                                format="{0:d}"
                                                editor="date"
                                                title="Billing Start Date"
                                                cell={(props) => CellRender(props, "Billing Period Start", null, true)}
                                                columnMenu={ColumnMenu}
                                            />
                                            <GridColumn
                                                field="billingPeriodEnd"
                                                filter="date"
                                                format="{0:d}"
                                                editor="date"
                                                title="Billing End date"
                                                cell={(props) => CellRender(props, "Billing Period End", null, true)}
                                                columnMenu={ColumnMenu}
                                            />
                                             <GridColumn
                                                field="hours"
                                                title="Hours"
                                                headerClassName="text-right pr-4"
                                                width="80px"
                                                columnMenu={ColumnMenu}
                                                cell={(props) => {
                                                    return (
                                                        <td contextMenu={"hours"}
                                                            className="pr-4 text-right"
                                                            title={props.dataItem.hours ? props.dataItem.hours.toFixed(2) : "-"}
                                                        >
                                                            {props.dataItem.hours ? props.dataItem.hours.toFixed(2) : "-"}
                                                        </td>
                                                    );
                                                }}
                                                filter="numeric"
                                            />
                                             <GridColumn
                                                field="amount"
                                                title="Amount"
                                                headerClassName="text-right pr-4"
                                                cell={(props) => {
                                                    return (
                                                      <td
                                                        contextMenu={"Amount"}
                                                        style={{ textAlign: "right" }}
                                                        title={props.dataItem.amount}
                                                        className="pr-4"
                                                      >
                                                        {currencyFormatter(props.dataItem.amount)}
                                                      </td>
                                                    );
                                                  }}
                                                columnMenu={ColumnMenu}
                                                filter="numeric"
                                            />
                                             <GridColumn
                                                field="openDays"
                                                headerClassName="text-right pr-4"
                                                title="Open Days"
                                                filter="numeric"
                                                cell={(props) => NumberCell(props, "Open Days")}
                                                columnMenu={ColumnMenu}
                                            />
                                            <GridColumn
                                                title="Action"
                                                sortable={false}
                                                width="70px"
                                                cell={(props) => (
                                                    <RowActions
                                                        dataItem={props.dataItem}
                                                        currentState={""}
                                                        rowId={props.dataItem.clientDivId}
                                                        handleClick={this.handleActionClick}
                                                        defaultActions={DefaultActions(props)}
                                                    />
                                                )}
                                            headerCell={() => CustomMenu(this.state.excelData)}
                                            />
                                            <GridColumn sortable={false} field="expanded" width="100px" title="View More" cell={this.ExpandCell} />
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="shadow">
                        <div className="row ml-0 mr-0  pb-2 pt-2 align-items-center mt-2">
                            <div className="col-auto  export-to-excel"
                            >
                                {ExportExcel(this.state.excelData)}
                            </div>
                            <div className="col pl-0 ml-auto col-md text-right">
                                <div className="row justify-content-end align-items-center">
                                    <div
                                        className="col-auto text-right txt-clr-green-select 
                                        font-weight-bold select-all text-right pr-0"
                                    >
                                        {this.state.selectAll ? "Select None" : "Select All"}
                                        <span className="grn-bg-icon-checkbox">
                                            <label className="container-R d-flex col-12">
                                                <input
                                                    name="selectAll"
                                                    type="checkbox"
                                                    value={this.state.selectAll}
                                                    onClick={(e) => {
                                                        this.handleChange(e);
                                                    }}
                                                    checked={this.state.selectAll}
                                                />
                                                <span className="checkmark-R ml-3 ml-xl-3"></span>
                                            </label>
                                        </span>
                                    </div>
                                    <div className="col-auto">
                                        <button
                                            type="button"
                                            className="btn button button-active-green mr-3 shadow"
                                            disabled={this.state.disableBtn}
                                            onClick={() => this.setState({ showActiveModal: true })}
                                        >
                                            Set To Active
                                        </button>
                                        <button
                                            type="button"
                                            className="btn button button-approved shadow"
                                            disabled={this.state.disableBtn}
                                            onClick={() => this.setState({ showConfirmationModal: true })}
                                        >
                                            Set To Vendor Authorized
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <div className="row ml-0 mr-0">
                        {/* <div className="col-12 mx-auto mt-3 pl-0 pr-0" id="timesheetDataGrid">
                            <Grid
                                style={{ margin: "0", height: "62vh" }}
                                onScroll={this.scrollHandler.bind(this)}
                                className="timesheetTblGrid"
                                data={this.state.data}
                            >
                                <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                                <GridColumn field="position" title="Position" cell={this.PositionItemCellTemplate} headerClassName="positionHeader" />
                            </Grid>
                        </div> */}
                        <ConfirmationModal
                            message={VI_ACTIVE_CONFIRMATION_MSG()}
                            showModal={this.state.showActiveModal}
                            handleYes={() => this.updateVIStatus(VendorInvoiceStatusIds.ACTIVE)}
                            enterComments
                            commentsRequired
                            commentsChange={this.commentsChange}
                            comments={this.state.approverComments}
                            handleNo={() => {
                                this.setState({ approverComments: "", showActiveModal: false });
                            }}
                            showError={this.state.approverCommentError}
                        />
                        <ConfirmationModal
                            message={TS_VENDOR_AUTHORIZE_CONFIRMATION_MSG()}
                            showModal={this.state.showConfirmationModal}
                            handleYes={() => this.updateVIStatus(VendorInvoiceStatusIds.VENDORAUTHORIZED)}
                            enterComments
                            commentsChange={this.commentsChange}
                            comments={this.state.approverComments}
                            handleNo={() => {
                                this.setState({ approverComments: "", showConfirmationModal: false });
                            }}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UnderReviewVendorInvoices;