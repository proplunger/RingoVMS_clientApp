import * as React from "react";
import auth from "../../../../Auth";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import CompleteSearch from "../../../../Shared/Search/CompleteSearch";
import { State, toODataString } from "@progress/kendo-data-query";
import { CustomMenu, DefaultActions } from "./GlobalActions";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { initialDataState, successToastr } from "../../../../../HelperMethods";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import clientAdminService from "../../Service/DataService";
import { ACTIVE_INTERVIEW_CRITERIA_CONFIRMATION_MSG, INACTIVE_INTERVIEW_CRITERIA_CONFIRMATION_MSG, INTERVIEW_CRITERIA_ACTIVE_SUCCESS_MSG, INTERVIEW_CRITERIA_INACTIVE_SUCCESS_MSG, INTERVIEW_CRITERIA_REMOVE_SUCCESS_MSG, REMOVE_INTERVIEW_CRITERIA_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import { KendoFilter } from "../../../../ReusableComponents";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface InterviewCriteriaProps {
    match: any;
    onCloseModal: any;
}

export interface InterviewCriteriaState {
    clientId: string;
    data: any;
    onFirstLoad: boolean;
    totalCount?: number;
    showLoader?: boolean;
    showRemoveModal?: boolean;
    showInactivateModal?: boolean;
    showActivateModal?: boolean;
    dataState: any;
}

class InterviewCriteria extends React.Component<InterviewCriteriaProps, InterviewCriteriaState> {
    public dataItem: any;
    constructor(props: InterviewCriteriaProps) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            data: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    getInterviewCriteria = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        let queryParams = `clientId eq ${this.state.clientId}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        clientAdminService.getInterviewCriteria(this.state.clientId, finalQueryString).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getInterviewCriteriaCount(dataState);
        });
    }

    getInterviewCriteriaCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        let queryParams = `clientId eq ${this.state.clientId}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        clientAdminService.getInterviewCriteriaCount(this.state.clientId).then((res) => {
            this.setState({
                totalCount: res.data,
            });
        });
    };

    deleteInterviewCriteria = (id, statusId, msg) => {
        this.setState({ showRemoveModal: false, showInactivateModal: false, showActivateModal: false });
        clientAdminService.deleteInterviewCriteria(id, statusId).then((res) => {
            successToastr(msg);
            this.getInterviewCriteria(this.state.dataState);
        });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getInterviewCriteria(changeEvent.data);
    };

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-9 fonFifteen paddingLeftandRight">
                            <BreadCrumbs></BreadCrumbs>
                        </div>
                        <div className="col-3">
                            {auth.hasPermissionV2(AppPermissions.ADMIN_CLIENT_VIEW) && (
                                <Link to="/admin/interviewcriteria/create">
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                        Add Interview Criteria 
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageInterviewCriteriaConfiguration"
                        entityType={"Interview Criteria Configuration"}
                        placeholder="Search text here!"
                        handleSearch={this.getInterviewCriteria}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageInterviewCriteriaConfigurationContainer global-action-grid-lastchild">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.data}
                            {...this.state.dataState}
                            //detail={ViewMoreComponent}
                            expandField="expanded"
                            total={this.state.totalCount}
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>

                            <GridColumn
                                field="client"
                                title="Client"
                                cell={(props) => CellRender(props, "Client")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="division"
                                title="Division"
                                cell={(props) => CellRender(props, "Division")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="location"
                                title="Location"
                                cell={(props) => CellRender(props, "Location")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="position"
                                title="Position"
                                cell={(props) => CellRender(props, "Position")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="tags"
                                title="Tags"
                                cell={(props) => CellRender(props, "Tags")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="createdDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Created Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Created Date")}
                            />
                            <GridColumn
                                field="createdByName"
                                title="Created By"
                                cell={(props) => CellRender(props, "Created By")}
                                columnMenu={ColumnMenu}
                            />
                            {/* <GridColumn
                                field="status"
                                width="230px"
                                title="Status"
                                columnMenu={ColumnMenu}
                                cell={StatusCell}
                            /> */}
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="80px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.clientDivId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.data)}
                            />
                        </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={REMOVE_INTERVIEW_CRITERIA_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteInterviewCriteria(this.dataItem.id, 2, INTERVIEW_CRITERIA_REMOVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                <ConfirmationModal
                    message={ACTIVE_INTERVIEW_CRITERIA_CONFIRMATION_MSG()}
                    showModal={this.state.showActivateModal}
                    handleYes={() => this.deleteInterviewCriteria(this.dataItem.id, 1, INTERVIEW_CRITERIA_ACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showActivateModal: false });
                    }}
                />

                <ConfirmationModal
                    message={INACTIVE_INTERVIEW_CRITERIA_CONFIRMATION_MSG()}
                    showModal={this.state.showInactivateModal}
                    handleYes={() => this.deleteInterviewCriteria(this.dataItem.id, 0, INTERVIEW_CRITERIA_INACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showInactivateModal: false });
                    }}
                />
            </div>
        );
    }
}
export default InterviewCriteria;