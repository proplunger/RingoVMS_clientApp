import * as React from "react";
import auth from "../../Auth";
import { initialDataState } from "../../../HelperMethods";
import { Grid, GridNoRecords, GridColumn } from "@progress/kendo-react-grid";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { GridNoRecord, CellRender, WHStatusCell } from "../../Shared/GridComponents/CommonComponents";
import { toODataString } from "@progress/kendo-data-query";
import axios from "axios";
import { KendoFilter } from "../../ReusableComponents";
import RowActions from "../../Shared/Workflow/RowActions";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { CandNameCell } from "../../Candidates/ManageCandidateWF/WFCells";
import { CandNumberCell } from "../../Candidates/ManageCandidateSubmission/CandidateCells";
import { AuthRoleType, CandSubStatusIds, isRoleType } from "../../Shared/AppConstants";
import { JOB_DETAIL, ONBOARDING_DETAIL, PROVIDER_TIMESHEET } from "../../Shared/ApiUrls";
import JobSummary from "../JobSummary/JobSummary";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface WorkHistoryProps {
    match?: any;
}

export interface WorkHistoryState {
    dataItem?:any;
    data: any;
    dataState?: any;
    showLoader?: boolean;
    total?: number;
    candidateId?: string;
    vendorId: string;
    showJobSummaryModal?:boolean;
    clientId: string;
}

function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "View Timesheet",
            permCode: AppPermissions.TS_VIEW,
            nextState: "",
            icon: "faEye",
            linkUrl: `${PROVIDER_TIMESHEET}${dataItem.candSubmissionId}`,
        },
        {
            action: "View Job Details",
            permCode: AppPermissions.TS_JOB_DETAIL,
            nextState: "",
            icon: "faEye",
            linkUrl: `${JOB_DETAIL}${dataItem.candSubmissionId}`,
        },
        {
            action: "View Onboarding Details",
            permCode: AppPermissions.TS_ONBOARDING_DETAIL,
            nextState: "",
            icon: "faEye",
            linkUrl: `${ONBOARDING_DETAIL}${dataItem.candSubmissionId}`,
        },
        {
            action: "Job Summary",
            permCode: AppPermissions.TS_SUBMIT,
            nextState: "",
            icon: "faUserMd",
            //cssStyle: { display: dataItem.statusIntId !=TimesheetStatus.ACTIVE ? "block" : "none" },
        },
    ];
    return defaultActions;
}

class WorkHistory extends React.Component<WorkHistoryProps, WorkHistoryState> {
    constructor(props: WorkHistoryProps) {
        super(props);
        this.state = { data: [], dataState: initialDataState, vendorId: auth.getVendor(), showLoader: true, clientId: auth.getClient(), };
    }

    componentDidMount() {
        let { id } = this.props.match.params;
        if (!id) {
            id = localStorage.getItem("candidateId");
        }
        this.setState({ candidateId: id }, () => {
            this.getWorkHistory(initialDataState);
        });
    }
// dynamic action click
    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = { dataItem: dataItem };
        let property = `show${action.replace(/ +/g, "")}Modal`;
        change[property] = true;
        this.setState(change);
    };
    getWorkHistory = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        let queryParams = '';        
        queryParams += `candidateId eq ${this.state.candidateId} and (statusIntId eq ${CandSubStatusIds.ASSIGNMENTCREATED} or statusIntId eq ${CandSubStatusIds.ASSIGNMENTINPROGRESS} or statusIntId eq ${CandSubStatusIds.ASSIGNMENTEXTENDED} or statusIntId eq ${CandSubStatusIds.ASSIGNMENTCOMPLETED})`;
        if (this.state.clientId) {
            queryParams += ` and clientId eq ${this.state.clientId}`
        }
        if (this.state.vendorId) {
            queryParams += ` and submittedVendorId eq ${this.state.vendorId}`;
        }

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        this.setState({ showLoader: true });
        axios.get(`api/ts/provider/workhistory?${finalQueryString}`).then((res) => {
            console.log("Data", res.data);
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getWorkHistoryCount(dataState);
        });
    };
    close=()=>{
        this.setState({showJobSummaryModal:false});
    }
    onDataStateChange = (changeEvent) => {
        this.getWorkHistory(changeEvent.data);
    };

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight"><BreadCrumbs globalData={{candidateId:this.state.candidateId}}></BreadCrumbs></div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="myOrderContainer global-action-grid-onlyhead">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            pageable={{ pageSizes: true }}
                            onDataStateChange={this.onDataStateChange}
                            data={this.state.data}
                            {...this.state.dataState}
                            className="kendo-grid-custom lastchild"
                            total={this.state.total}
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>
                            {!isRoleType(AuthRoleType.Provider) &&
                                <GridColumn
                                    field="reqNumber"
                                    title="Req#"
                                    width="150px"
                                    cell={CandNumberCell}
                                    columnMenu={ColumnMenu}
                                />
                            }
                            <GridColumn
                                field="vendor"
                              
                                title="Vendor"
                                cell={(props) => CellRender(props, "Vendor")}
                                columnMenu={ColumnMenu}
                            />
                            {!isRoleType(AuthRoleType.Provider) &&
                                <GridColumn
                                    field="candidateName"
                                    //width="150px"
                                    title="Provider"
                                    cell={CandNameCell}
                                    columnMenu={ColumnMenu}
                                />
                            }
                            <GridColumn field="client" title="Client"  cell={(props) => CellRender(props, "Client")} columnMenu={ColumnMenu} />
                            <GridColumn field="reqPosition" title="Position" columnMenu={ColumnMenu} cell={(props) => CellRender(props, "Position")} />
                            <GridColumn
                                field="assignmentStartDate"
                                title="Start Date"
                                columnMenu={ColumnMenu}
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                cell={(props) => CellRender(props, "Start Date")}
                            />

                            <GridColumn
                                field="assignmentEndDate"
                                title="End Date"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "End Date")}
                            />
                            <GridColumn field="workStatus" title="Status" width="200px" columnMenu={ColumnMenu} cell={WHStatusCell} />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="60px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={props.dataItem.status}
                                        rowId={props.dataItem.subBillRateId}
                                        defaultActions={DefaultActions(props)}
                                        handleClick={this.handleActionClick}
                                    />
                                )}
                            />
                        </Grid>
                    </div>
                </div>
                {this.state.showJobSummaryModal && (
                    <JobSummary candSubmissionId={this.state.dataItem.candSubmissionId} onClose={this.close}></JobSummary>
                )}
            </div>
        );
    }

    getWorkHistoryCount = (dataState) => {
        var finalState = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        let queryParams = '';
        
        queryParams += `candidateId eq ${this.state.candidateId} and (statusIntId eq ${CandSubStatusIds.ASSIGNMENTCREATED} or statusIntId eq ${CandSubStatusIds.ASSIGNMENTINPROGRESS} or statusIntId eq ${CandSubStatusIds.ASSIGNMENTEXTENDED} or statusIntId eq ${CandSubStatusIds.ASSIGNMENTCOMPLETED})`;
        if (this.state.vendorId) {
            queryParams += ` and submittedVendorId eq ${this.state.vendorId}`;
        }
        if (this.state.clientId) {
            queryParams += ` and clientId eq ${this.state.clientId}`
        }
        var finalQueryString = KendoFilter(finalState, queryStr, queryParams);
        axios.get(`api/ts/provider/workhistory?${finalQueryString}`).then((res) => {
            console.log("Data", res.data);
            this.setState({
                total: res.data.length,
            });
        });
    };
}

export default WorkHistory;
