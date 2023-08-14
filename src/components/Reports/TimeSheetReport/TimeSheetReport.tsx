import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell, TsStatusCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State } from "@progress/kendo-data-query";
import { DetailColumnCell, ViewMoreComponent, PayPeriodCell, ReqNumberCell } from "./GlobalActions";
import { CreateQueryString } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { currencyFormatter, downloadExcel, initialDataState, successToastr } from "../../../HelperMethods";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { EXCEL_DOWNLOAD_INPROGRESS } from "../../Shared/AppMessages";
import reportServices from "../../Shared/Services/ReportServices";
import { AuthRole } from "../../Shared/AppConstants";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface TimeSheetReportProps { }

export interface TimeSheetReportState {
    searchString: string;
    data: any;
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

class TimeSheetReport extends React.Component<TimeSheetReportProps, TimeSheetReportState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    private userClients: any = JSON.parse(localStorage.getItem("UserClientLob"));
    public reqId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: TimeSheetReportProps) {
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
   
    getTimeSheetReport = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
        
        let finalQueryString = CreateQueryString(dataState, this.state.clientId, this.state.vendorId);
        axios.get(`api/report/timesheet?${`$count=true&`}${finalQueryString}`).then((res) => {
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
        this.getTimeSheetReport(changeEvent.data);
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
                                <div className="TimeSheet_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm" title="Export to Excel">
                                    <span
                                        title="Excel"
                                        onClick={() => this.downloadTimesheeteportExcel()} >
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
                        handleSearch={this.getTimeSheetReport}
                        entityType={"Timesheet"}
                        onFirstLoad={this.state.onFirstLoad}
                        page="TimesheetReport"
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
                            <GridColumn field="reqNumber" 
                            width="130px" 
                            title="Req#" 
                            cell={ReqNumberCell} columnMenu={ColumnMenu} />
                            {auth.hasPermissionV2(AppPermissions.REPORT_MULTI_CLIENT_VIEW) && this.userClients.length > 1 &&
                            <GridColumn
                                field="client"
                                title="Client"
                                cell={(props) => CellRender(props, "Client")}
                                columnMenu={ColumnMenu}
                            />}
                            <GridColumn
                                field="candidateName"
                                title="Provider"                                
                                cell={(props) => CellRender(props, "Provider")}
                                columnMenu={ColumnMenu}
                            />
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
                            />
                            <GridColumn
                                field="position"                                
                                title="Position"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Position")}
                            />
                            <GridColumn
                                field="hiringManager"
                                width="140px"
                                title="Hiring Manager"
                                cell={(props) => CellRender(props, "Hiring Manager")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                title="Pay Period"
                                columnMenu={ColumnMenu}
                                cell={(props) => PayPeriodCell(props)}
                                filter="text"
                            />
                            <GridColumn
                                field="hours"
                                title="Hours"
                                width="90px"
                                headerClassName="text-right pr-4"
                                filter={"numeric"}
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    return (
                                        <td contextMenu={"Hours"}
                                            className="pr-4 text-right"
                                            title={props.dataItem.hours}
                                        >
                                            {props.dataItem.hours ? props.dataItem.hours.toFixed(2) : "0.00"}
                                        </td>
                                    );
                                }}
                            />
                            <GridColumn
                                field="totalAmount"
                                title="Billable"
                                headerClassName="text-right pr-4"
                                width="110px"
                                filter={"numeric"}
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    return (
                                        <td contextMenu={"Billable"}
                                            className="pr-4 text-right"
                                            title={props.dataItem.totalAmount}
                                        >
                                            {currencyFormatter(props.dataItem.totalAmount)}
                                        </td>
                                    );
                                }}
                            />
                            <GridColumn 
                            field="status" 
                            width="170px"
                            title="Status"
                            columnMenu={ColumnMenu}
                            cell={TsStatusCell} 
                            />
                            <GridColumn sortable={false} field="expanded" width="80px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }

    downloadTimesheeteportExcel = () => {
        var finalState: State = {
          ...this.state.dataState,
          take: null,
          skip: 0,
        };
        successToastr(EXCEL_DOWNLOAD_INPROGRESS);
        reportServices.getTimesheetReportForExcel(this.state.clientId, this.state.vendorId, finalState).then((res: any) => {
            if (res) {
                downloadExcel("TimesheetReport.xlsx", res.data);
            }
        });
    }
}
export default TimeSheetReport;
