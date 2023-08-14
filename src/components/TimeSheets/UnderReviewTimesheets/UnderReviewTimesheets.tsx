import { State, toODataString } from "@progress/kendo-data-query";
import { Grid, GridNoRecords, GridColumn } from "@progress/kendo-react-grid";
import axios from "axios";
import * as React from "react";
import { currencyFormatter, dateFormatter, initialDataState, newPageSizes, successToastr } from "../../../HelperMethods";
import { KendoFilter } from "../../ReusableComponents";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { PositionItemTemplate } from "../SubmittedTimesheets/TimesheetCell";
import auth from "../../Auth";
import { TimesheetStatus } from "../../Shared/AppConstants";
import { TS_PENDING_APPROVAL_CONFIRMATION_MSG, TS_REJECTED_CONFIRMATION_MSG, TS_UPDATED_SUCCESS_MSG } from "../../Shared/AppMessages";
import { CustomMenu, DefaultActions, DetailColumnCell, ExportExcel, ViewMoreComponent } from "./GlobalActions";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import RowActions from "../../Shared/Workflow/RowActions";

export interface UnderReviewTimesheetsProps { }

export interface UnderReviewTimesheetsState {
    selectAll?: any;
    onFirstLoad?: any;
    data: any;
    excelData: any;
    showLoader?: boolean;
    dataState?: any;
    showConfirmationModal?: any;
    showRejectModal?: any;
    approverComments?: any;
    approverCommentError?: any;
    clientId?: any;
    disableBtn?: any;
    totalCount?: any;
    selectedIds: any;
    ifAllSelected?: boolean;
}

class UnderReviewTimesheets extends React.Component<UnderReviewTimesheetsProps, UnderReviewTimesheetsState> {
    PositionItemCellTemplate;
    public dataItem: any;
    constructor(props: UnderReviewTimesheetsProps) {
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

    getUnderReviewTimesheets = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var queryParams = `clientId eq ${this.state.clientId}`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/ts/underreview?${finalQueryString}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState
            });
        });
        this.getUnderReviewTimesheetsCount(dataState);
    };

    getUnderReviewTimesheetsCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
      
          var queryStr = `${toODataString(finalState, { utcDates: true })}`;
          var queryParams = `clientId eq ${this.state.clientId}`;
          var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        axios.get(`api/ts/underreview?${finalQueryString}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                excelData: res.data
            });
        });
    };

    handleSelectionChange(e, weekId?) {
        const data = [...this.state.data];
        const updateData = data.map((item) => {
            item.tsWeek.map((x) => {
                if (x.tsWeekId ==weekId) {
                    x.isSelected = e.target.checked;
                }
                return x;
            });
            return item;
        });
        let flag = this.checkIfSelected();
        this.setState({ data: updateData, disableBtn: !flag[0], selectAll: flag[0] && flag[1] });
    }

    checkIfSelected() {
        let selectedIds = [];
        let totalDataCount = 0;
        this.state.data.forEach((item) => {
            let ids = item.tsWeek.filter((x) => x.isSelected==true).map((x) => x.tsWeekId);
            selectedIds.push(...ids);
            totalDataCount += item.tsWeek.length;
        });
        if (!selectedIds.length) {
            return [false, false];
        }
        return [true, selectedIds.length==totalDataCount];
    }

    selectionChange = (event) => {
        var checked = event.syntheticEvent.target.checked;
        let ids = this.state.selectedIds;
        const data = this.state.data.map((item) => {
          if (item.tsWeekId ==event.dataItem.tsWeekId) {
            item.selected = !event.dataItem.selected;
              if (checked==true) {
                ids.push(item.tsWeekId);
                this.setState({
                    disableBtn:false
                })
              }
              else if(checked==false){
                ids = ids.filter((o) => o !=item.tsWeekId);
              }           
          }
          return item;
        });
        this.setState({data,selectedIds: ids});
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
                ids.push(item.tsWeekId);
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
        this.setState({ data,selectedIds: ids, ifAllSelected: !this.state.ifAllSelected });
        if (ids.length==0) {
            this.setState({
                disableBtn: true
            })
        }
    };  
  
    updateTimesheetStatus = (status) => {
        if (status==TimesheetStatus.REJECT && !this.state.approverComments.replace(/^\s+|\s+$/g, "")) {
            this.setState({ approverCommentError: true });
            return;
        }
        let selectedIds = [];
        this.state.data.forEach((item) => {
            if (item.selected==true) {
                selectedIds.push(item.tsWeekId);
            }
        });
        if (!selectedIds.length) {
            return;
        }
        let data = {
            id: selectedIds,
            statusId: status,
            comment: this.state.approverComments
        };
        axios.patch(`api/ts`, data).then((res) => {
            successToastr(TS_UPDATED_SUCCESS_MSG);
            this.setState({ showRejectModal: false, showConfirmationModal: false, data: [], dataState: initialDataState, selectAll: false });
            this.getUnderReviewTimesheets(initialDataState);
        });
    };

    commentsChange = (e) => this.setState({ approverComments: e.target.value, approverCommentError: e.target.value=="" });

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;
    
    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getUnderReviewTimesheets(changeEvent.data);
        localStorage.setItem("TSUnderReview-GridDataState", JSON.stringify(changeEvent.data));
    };

    render() {
        return (
            <React.Fragment>
                <div className="col-12 mx-auto" id="searchCard">
                    {/* <div className="mt-3 mb-3 d-md-block d-none">
                        <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                            <div className="col-12 fonFifteen paddingLeftandRight">
                                Timesheet Under Review
                            </div>
                        </div>
                    </div> */}
                    <div className="row mt-3">
                        <div className="col-md-12 pl-0 pr-0">
                            <div className="input-group mt-0">
                                <div className="container-fluid">
                                    <CompleteSearch
                                        placeholder="Search text here!"
                                        handleSearch={this.getUnderReviewTimesheets}
                                        entityType={"Timesheet"}
                                        onFirstLoad={this.state.onFirstLoad}
                                        page="TSUnderReview"
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
                                                            className="btn button button-reject mr-3 shadow"
                                                            disabled={this.state.disableBtn}
                                                            onClick={() => this.setState({ showRejectModal: true })}
                                                        >
                                                            Reject
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn button button-approved shadow"
                                                            disabled={this.state.disableBtn}
                                                            onClick={() => this.setState({ showConfirmationModal: true })}
                                                        >
                                                            Set To Pending Approval
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="manageUserContainer global-action-grid">
                                    <Grid
                                        style={{ height: "auto" }}
                                        sortable={true}
                                        onDataStateChange={this.onDataStateChange}
                                        pageable={{ pageSizes: newPageSizes }}
                                        data={this.state.data}
                                        {...this.state.dataState}
                                        detail={ViewMoreComponent}
                                        expandField="expanded"
                                        selectedField="selected"
                                        total={this.state.totalCount}
                                        className="kendo-grid-custom lastchild"
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
                                            field="vendor"
                                            title="Vendor"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Vendor")}
                                        />
                                        <GridColumn
                                            field="provider"
                                            title="Provider"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Provider")}
                                        />
                                        <GridColumn
                                            field="position"
                                            title="Position"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Position")}
                                            filter="text"
                                        />
                                        <GridColumn
                                            field="division"
                                            title="Division"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Division")}
                                            filter="text"
                                        />
                                        <GridColumn
                                            field="location"
                                            title="Location"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Location")}
                                            filter="text"
                                        />
                                        <GridColumn
                                            field="jobEndDate"
                                            title="Job End Date"
                                            filter="date"
                                            format="{0:d}"
                                            editor="date"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Job End Date")}
                                        />
                                        <GridColumn
                                            field="totalAmount"
                                            title="Total Amount"
                                            filter={"numeric"}
                                            headerClassName="text-right pr-4"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => (
                                                <td 
                                                contextMenu={"Total Amount"}
                                                style={{ textAlign: "right" }}
                                                className="pr-4">
                                                    {currencyFormatter(props.dataItem.totalAmount)}
                                                </td>
                                            )}
                                        />
                                        <GridColumn
                                            field="totalHours"
                                            title="Total Hours"
                                            filter={"numeric"}
                                            headerClassName="text-right pr-4"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => (
                                                <td 
                                                contextMenu={"Total Hours"}
                                                style={{ textAlign: "right" }}
                                                className="pr-4">
                                                    {props.dataItem.totalHours.toFixed(2)}
                                                </td>
                                            )}
                                        />
                                        <GridColumn
                                            field="startDate"
                                            title="Start Date"
                                            filter="date"
                                            format="{0:d}"
                                            editor="date"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => (
                                                <td>
                                                    {dateFormatter(props.dataItem.startDate)}
                                                </td>
                                            )}
                                        />
                                        <GridColumn
                                            field="endDate"
                                            title="End Date"
                                            filter="date"
                                            format="{0:d}"
                                            editor="date"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => (
                                                <td>
                                                    {dateFormatter(props.dataItem.endDate)}
                                                </td>
                                            )}
                                        />
                                        <GridColumn
                                            field="reviewReason"
                                            title="Review Reason"
                                            columnMenu={ColumnMenu}
                                            cell={(props) => CellRender(props, "Review Reason")}
                                            filter="text"
                                        />
                                        <GridColumn
                                            title="Action"
                                            sortable={false}
                                            width="50px"
                                            cell={(props) => (
                                                <RowActions
                                                    dataItem={props.dataItem}
                                                    currentState={""}
                                                    rowId={props.dataItem.clientId}
                                                    handleClick={this.handleActionClick}
                                                    defaultActions={DefaultActions(props)}
                                                />
                                            )}
                                            headerCell={() => CustomMenu()}
                                        />
                                        <GridColumn sortable={false} field="expanded"  width="100px" title="View More" cell={this.ExpandCell} />
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
                                            className="btn button button-reject mr-3 shadow"
                                            disabled={this.state.disableBtn}
                                            onClick={() => this.setState({ showRejectModal: true })}
                                        >
                                            Reject
                                        </button>
                                        <button
                                            type="button"
                                            className="btn button button-approved shadow"
                                            disabled={this.state.disableBtn}
                                            onClick={() => this.setState({ showConfirmationModal: true })}
                                        >
                                            Set To Pending Approval
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
                            message={TS_REJECTED_CONFIRMATION_MSG()}
                            showModal={this.state.showRejectModal}
                            handleYes={() => this.updateTimesheetStatus(TimesheetStatus.REJECT)}
                            enterComments
                            commentsRequired
                            commentsChange={this.commentsChange}
                            comments={this.state.approverComments}
                            handleNo={() => {
                                this.setState({ approverComments: "", showRejectModal: false });
                            }}
                            showError={this.state.approverCommentError}
                        />
                        <ConfirmationModal
                            message={TS_PENDING_APPROVAL_CONFIRMATION_MSG()}
                            showModal={this.state.showConfirmationModal}
                            handleYes={() => this.updateTimesheetStatus(TimesheetStatus.PENDINGAPPROVAL)}
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

export default UnderReviewTimesheets;
