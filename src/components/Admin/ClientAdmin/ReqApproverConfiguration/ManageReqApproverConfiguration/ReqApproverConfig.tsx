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
import { REMOVE_REQ_APPROVER_CONFIGURATION_CONFIRMATION_MSG, REQ_APPROVER_CONFIGURATION_REMOVE_SUCCESS_MSG } from "../../../../Shared/AppMessages";
import { KendoFilter } from "../../../../ReusableComponents";
import { EntityType } from "../../../../Shared/AppConstants";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface ReqApproverConfigConfigProps {
    match: any;
    onCloseModal: any;
}

export interface ReqApproverConfigState {
    clientId: string;
    entityType: string;
    data: any;
    onFirstLoad: boolean;
    totalCount?: number;
    showLoader?: boolean;
    showRemoveModal?: boolean;
    dataState: any;
}

class ReqApproverConfig extends React.Component<ReqApproverConfigConfigProps, ReqApproverConfigState> {
    public dataItem: any;
    constructor(props: ReqApproverConfigConfigProps) {
        super(props);
        const { entityType } = this.props.match.params;
        this.state = {
            clientId: auth.getClient(),
            entityType: entityType,
            data: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    getWfApproverConfig = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        let queryParams = `clientId eq ${this.state.clientId} and entityType eq '${this.state.entityType}'`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        clientAdminService.getWfApprovalConfig(this.state.clientId, this.state.entityType, finalQueryString).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getWfApproverConfigCount(dataState);
        });
    }

    getWfApproverConfigCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        let queryParams = `clientId eq ${this.state.clientId} and entityType eq '${this.state.entityType}'`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        clientAdminService.getWfApprovalConfiCount(this.state.clientId, this.state.entityType).then((res) => {
            this.setState({
                totalCount: res.data,
            });
        });
    };

    deleteWfApproverConfig = (id) => {
        this.setState({ showRemoveModal: false });
        clientAdminService.deleteWfApprovalConfig(id).then((res) => {
            successToastr(REQ_APPROVER_CONFIGURATION_REMOVE_SUCCESS_MSG);
            this.getWfApproverConfig(this.state.dataState);
        });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getWfApproverConfig(changeEvent.data);
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
                            {/* {this.state.entityType} Approver Configuration  */}
                            <BreadCrumbs></BreadCrumbs>
                        </div>
                        <div className="col-3">
                            {auth.hasPermissionV2(AppPermissions.REQ_APPROVER_CREATE) && (
                                <Link to={`/admin/${this.state.entityType}/approver/create`}>
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                        Add New Configuration
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageRequisitionApproverConfiguration"
                        entityType={"Req Approver Configuration"}
                        placeholder="Search text here!"
                        handleSearch={this.getWfApproverConfig}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageReqApproverConfigurationContainer global-action-grid-lastchild">
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
                                filter="text"
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
                                        defaultActions={DefaultActions(props, this.state.entityType)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.data, this.state.entityType)}
                            />
                        </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={REMOVE_REQ_APPROVER_CONFIGURATION_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteWfApproverConfig(this.dataItem.id)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />
            </div>
        );
    }
}
export default ReqApproverConfig;