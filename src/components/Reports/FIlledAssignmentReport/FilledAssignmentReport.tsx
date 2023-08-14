import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import { DetailColumnCell, ViewMoreComponent, ExportExcel, ProviderCell, ApprovedHoursCell, TotalBillableCell } from "./GlobalActions";
import { CreateQueryString, KendoFilter, NumberCell } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { currencyFormatter, initialDataState, successToastr, downloadExcel } from "../../../HelperMethods";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { EXCEL_DOWNLOAD_INPROGRESS } from "../../Shared/AppMessages";
import reportServices from "../../Shared/Services/ReportServices";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface FilledAssignmentReportProps { }

export interface FilledAssignmentReportState {
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

class FilledAssignmentReport extends React.Component<FilledAssignmentReportProps, FilledAssignmentReportState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    private userClients: any = JSON.parse(localStorage.getItem("UserClientLob"));
    public reqId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: FilledAssignmentReportProps) {
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
   
    getFilledAssignmentReport = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
        
        let finalQueryString = CreateQueryString(dataState, this.state.clientId, this.state.vendorId);
        axios.get(`api/report/fa?${`$count=true&`}${finalQueryString}`).then((res) => {
            this.setState({
                data: res.data.items,
                showLoader: false,
                dataState: dataState,
                totalCount: res.data.count
            });
        });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getFilledAssignmentReport(changeEvent.data);
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
                                <div className="FilledAssignment_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm" title="Export to Excel">
                                    <span
                                        title="Excel"
                                        onClick={() => this.downloadFilledAssignmentReportExcel()} >
                                        <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon>
                                    </span>
                                </div>
                            </span> 
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        placeholder="Search text here!"
                        handleSearch={this.getFilledAssignmentReport}
                        entityType={"Timesheet"}
                        onFirstLoad={this.state.onFirstLoad}
                        page="FilledAssignmentReport"
                    />
                    <div className="myOrderContainer gridshadow global-action-grid-onlyhead">
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
                            />}
                            <GridColumn
                                field="zone"
                                title="Zone"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Zone")}
                                filter="text"
                            />
                            <GridColumn
                                field="region"
                                title="Region"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Region")}
                                filter="text"
                            />
                            <GridColumn
                                field="division"
                                // width="90px"
                                title="Division"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Division")}
                                filter="text"
                            />
                            <GridColumn
                                field="vendor"
                                //  width="145px"
                                title="Vendor"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Vendor")}
                            />
                            <GridColumn
                                field="candidateName"
                                //  width="165px"
                                title="Provider"
                                columnMenu={ColumnMenu}
                                cell={(props) => ProviderCell(props)}
                            />
                            <GridColumn
                                field="startDate"
                                //width="110px"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Start Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Start Date")}
                            />
                            <GridColumn
                                field="endDate"
                                //  width="110px"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="End Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "End Date")}
                            />
                            <GridColumn
                                field="totalApprovedHours"
                                // width="165px"
                                title="Approved Hours"
                                filter={"numeric"}
                                columnMenu={ColumnMenu}
                                cell={(props) => ApprovedHoursCell(props, "Approved Hours")}
                            />
                            <GridColumn
                                field="totalBillableAmount"
                                //  width="165px"
                                title="Total Billable"
                                filter={"numeric"}
                                columnMenu={ColumnMenu}
                                cell={(props) => TotalBillableCell(props, "Total Billable")}
                            />
                            <GridColumn sortable={false} field="expanded" width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }

    downloadFilledAssignmentReportExcel = () => {
        var finalState: State = {
          ...this.state.dataState,
          take: null,
          skip: 0,
        };
        successToastr(EXCEL_DOWNLOAD_INPROGRESS);
        reportServices.getFilledAssignmentReportForExcel(this.state.clientId, this.state.vendorId, finalState).then((res: any) => {
            if (res) {
                downloadExcel("Filled Assignemnt Report.xlsx", res.data);
            }
        });
    }
}
export default FilledAssignmentReport;
