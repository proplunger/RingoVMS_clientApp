import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell,VendorInvoiceStatusCellClient } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import { DetailColumnCell, ViewMoreComponent, PayPeriodCell, ExportExcel, VendorInvoiceNumberCell, ExportExcelClienAndAdmin } from "./GlobalActions";
import { CreateQueryString, KendoFilter, NumberCell } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { currencyFormatter, initialDataState } from "../../../HelperMethods";
import { isRoleType, AuthRoleType } from "../../Shared/AppConstants";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";


export interface ClientStatementReportProps { }

export interface ClientStatementReportState {
    searchString: string;
    data: any;
    allData?: any;
    clientId?: string;
    vendorId?: string;
    dataState: any;
    showRemoveModal?: boolean;
    showCopyModal?: boolean;
    showLoader?: boolean;
    totalCount?: number;
    showHoldPositionModal?: any;
    showReqHistoryModal?: any;
    onFirstLoad: boolean;
}

class ClientStatementReport extends React.Component<ClientStatementReportProps, ClientStatementReportState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    private userClients: any = JSON.parse(localStorage.getItem("UserClientLob"));
    public reqId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: ClientStatementReportProps) {
        super(props);
        this.state = {
            searchString: "",
            data: [],
            dataState: initialDataState,
            clientId: auth.getClient(),
            vendorId: auth.getVendor(),
            onFirstLoad: true,
            showLoader: true,
        };
    }
    // componentDidMount(){
    //     this.getVendorId();
    // }
    // getVendorId=()=>{
    //     axios.get(`api/ts/vendor`).then((res) => {
    //         this.setState({vendorId:res.data});
    //         this.getClientStatementReport(this.state.dataState);
    //     });
    // }
    getClientStatementReport = (dataState) => {
        dataState = { sort: [{ field: "vendorInvoiceNumber", dir: "desc" }], ...dataState };
        this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
        let finalQueryString = CreateQueryString(dataState,this.state.clientId, this.state.vendorId);

        axios.get(`api/report/statement?${finalQueryString}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getClientStatementReportCount(dataState);
        });
    };


    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getClientStatementReport(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    advancedSearchStates = () => {
        let states = {
            division: "",
            originalDivision: [],
            location: "",
        };
        return states;
    };

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-block">
                    <div className="row pt-1 pb-1 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight d-flex justify-content-between align-items-center">
                            <BreadCrumbs></BreadCrumbs>
                            <span className="float-right text-dark cursor-pointer">
                                {(isRoleType(AuthRoleType.SystemAdmin) || isRoleType(AuthRoleType.Vendor)) ? ExportExcel(this.state.data) : ExportExcelClienAndAdmin(this.state.data)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        placeholder="Search text here!"
                        handleSearch={this.getClientStatementReport}
                        page="ClientStatementReport"
                        entityType="ClientStatementReport"
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="myOrderContainer gridshadow global-action-grid-onlyhead table_responsive-TABcandidates">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.data}
                            {...this.state.dataState}
                            detail={ViewMoreComponent}
                            expandField="expanded"
                            total={this.state.totalCount}
                            className="kendo-grid-custom lastchild report-grid"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                            {auth.hasPermissionV2(AppPermissions.REPORT_MULTI_CLIENT_VIEW) && this.userClients.length > 1 &&
                            <GridColumn
                                field="client"
                                title="Client"
                                cell={(props) => CellRender(props, "Client")}
                                columnMenu={ColumnMenu}
                            />
    }
                            <GridColumn
                                field="vendorInvoiceNumber"
                             //   width="190px"
                                title="Invoice Number"
                                cell={VendorInvoiceNumberCell}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="vendorName"
                               // width="140px"
                                title="Vendor"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Vendor Name")}
                                filter="text"
                            />
                            <GridColumn
                                field="billingPeriod"
                              //  width="200px"
                                title="Billing Period"
                                cell={(props) => CellRender(props, "Billing Period")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="hours"
                                title="Hours"
                                headerClassName="text-right pr-4"
                                width="140px"
                                filter={"numeric"}
                                cell={(props) => NumberCell(props, "Hours")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="amount"
                                width="180px"
                                title="Amount"
                                headerClassName="text-right pr-4"
                                filter={"numeric"}
                                cell={(props) => {
                                    return (
                                        <td contextMenu="Amount"
                                            className="pr-4 text-right"
                                            title={props.dataItem.amount}
                                        >
                                            {currencyFormatter(props.dataItem.amount)}
                                        </td>
                                    );
                                }}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="status"
                                //width="180px"
                                title="Status"
                                columnMenu={ColumnMenu}
                                cell={VendorInvoiceStatusCellClient}
                            />

                            {/* <GridColumn field="status" width="170px" title="Status" columnMenu={ColumnMenu} cell={StatusCell} /> */}
                            <GridColumn sortable={false} field="expanded" width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
    getClientStatementReportCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        let finalQueryString = CreateQueryString(finalState,this.state.clientId, this.state.vendorId);
        axios.get(`api/report/statement?${finalQueryString}`).then((res) => {
            this.setState({
                allData: res.data,
                totalCount: res.data.length,
            });
        });
    };
}
export default ClientStatementReport;
