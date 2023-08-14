import * as React from "react";
import auth from "../../../../Auth";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords, GridToolbar } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import axios from "axios";
import CompleteSearch from "../../../../Shared/Search/CompleteSearch";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { CustomMenu, DefaultActions, DetailColumnCell, ViewMoreComponent } from "./GlobalActions";
import { State, toODataString } from "@progress/kendo-data-query";
import CreateDivision from "../CreateDivision/CreateDivision";
import { Dialog } from "@progress/kendo-react-dialogs";
import { history, initialDataState, successToastr } from "../../../../../HelperMethods";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { ACTIVE__CLIENT_DIVISION_CONFIRMATION_MSG, CLIENT_DIV_ACTIVE_SUCCESS_MSG, CLIENT_DIV_INACTIVE_SUCCESS_MSG, CLIENT_DIV_REMOVE_SUCCESS_MSG, INACTIVE_CLIENT_DIVISION_CONFIRMATION_MSG, REMOVE_CLIENT_DIVISION_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import { KendoFilter } from "../../../../ReusableComponents";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface DivisionsProps {
    match: any;
    onCloseModal: any;
    location: any;
}

export interface DivisionsState {
    divisions: any;
    locations: any;
    clientName?: string;
    clientId?: string;
    regionId?: string;
    onFirstLoad: boolean;
    totalCount?: number;
    totalDivision?: any;
    showLoader?: boolean;
    showAddNewDivisionModal?: any;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    showInactivateModal?: boolean;
    showActivateModal?: boolean;
    showDeleteModal?: boolean;
    showInActiveDivisionModal?: boolean;
    dataState: any;
    toggleFirst: boolean;
    toggleSecond: boolean;
    toggleAll: boolean;
}

class Divisions extends React.Component<DivisionsProps, DivisionsState> {
    public dataItem: any;
    public divId: string;
    constructor(props: DivisionsProps) {
        super(props);
        const { id } = this.props.match.params;
        const { regionId } = this.props.match.params;
        var params = new URLSearchParams(this.props.location.search);
        this.state = {
            divisions: [],
            locations: [],
            dataState: initialDataState,
            clientId: id,
            regionId: regionId,
            clientName: params.get("name"),
            onFirstLoad: true,
            showLoader: true,
            toggleFirst: true,
            toggleSecond: true,
            toggleAll: false,
        };
    }

    componentDidMount() {
        if (this.state.clientId) {
            this.getClientDivisions(this.state.dataState);

        } else {
            this.setState({ showLoader: false });
        }
    }

    getClientDivisions = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var url = `api/clients/${this.state.clientId}/divisions?${queryStr}`

        if (this.state.regionId) {
            let queryParams = `regionId eq ${this.state.regionId}`;

            var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
            var url = `api/clients/${this.state.clientId}/divisions?${finalQueryString}`
        }

        axios.get(url).then((res) => {
            this.setState({
                divisions: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getDivisionCount(dataState);
        });
    }

    getDivisionCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        var url = `api/clients/${this.state.clientId}/divisions?${queryStr}`

        if (this.state.regionId) {
            let queryParams = `regionId eq ${this.state.regionId}`;

            var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
            var url = `api/clients/${this.state.clientId}/divisions?${finalQueryString}`
        }

        axios.get(url).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalDivision: res.data,
            });
        });
    };

    onDataStateChange = (changeEvent) => {
        this.getClientDivisions(changeEvent.data);
    };

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    AddNewModal = () => {
        this.dataItem = undefined
        this.setState({ showAddNewDivisionModal: true })
    }

    deleteDivision = (id, statusId, msg) => {
        this.setState({ showDeleteModal: false, showRemoveModal: false, showInactivateModal: false, showActivateModal: false });
        axios.delete(`/api/admin/division/${id}/${statusId}`).then((res) => {
            successToastr(msg);
            this.getClientDivisions(this.state.dataState);
            this.dataItem = undefined;
        });
    };

    openModal = (prop, dataItem) => {
        this.setState({ showDeleteModal: true });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-10 fonFifteen paddingLeftandRight">
                            <BreadCrumbs globalData={{ clientId: this.state.clientId, regionId: this.state.regionId }} ></BreadCrumbs>
                        </div>
                        <div className="col-2">
                            {auth.hasPermissionV2(AppPermissions.CLIENT_DIV_CREATE) && (
                                <span className="float-right text-dark cusrsor-pointer "
                                    onClick={() => this.setState({ showAddNewDivisionModal: true })}>
                                    <FontAwesomeIcon icon={faPlusCircle} className={"mr-2 text-dark"} />
                                    Add New Division
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageDivision"
                        entityType={"Division"}
                        placeholder="Search text here!"
                        handleSearch={this.getClientDivisions}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageDivisionContainer global-action-grid-lastchild">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.divisions}
                            {...this.state.dataState}
                            detail={ViewMoreComponent}
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
                                field="zone"
                                title="Zone"
                                cell={(props) => CellRender(props, "Zone")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="region"
                                title="Region"
                                cell={(props) => CellRender(props, "Region")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="division"
                                title="Division Name"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Division Name")}
                                filter="text"
                            />
                            <GridColumn
                                field="description"
                                title="Description"
                                cell={(props) => CellRender(props, "Description")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="city"
                                title="City"
                                cell={(props) => CellRender(props, "City")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="state"
                                title="State"
                                cell={(props) => CellRender(props, "State")}
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
                            <GridColumn
                                field="status"
                                //width="230px"
                                title="Status"
                                columnMenu={ColumnMenu}
                                cell={StatusCell}
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
                                        defaultActions={DefaultActions(props, this.state.clientId)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalDivision, this.AddNewModal)}
                            />
                            <GridColumn sortable={false} field="expanded"  width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                    <div className="modal-footer justify-content-center border-0">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                            </button>
                        </div>
                    </div>
                </div>

                <ConfirmationModal
                    message={REMOVE_CLIENT_DIVISION_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteDivision(this.dataItem.id, 2, CLIENT_DIV_REMOVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                <ConfirmationModal
                    message={ACTIVE__CLIENT_DIVISION_CONFIRMATION_MSG()}
                    showModal={this.state.showActivateModal}
                    handleYes={() => this.deleteDivision(this.dataItem.id, 1, CLIENT_DIV_ACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showActivateModal: false });
                    }}
                />

                <ConfirmationModal
                    message={INACTIVE_CLIENT_DIVISION_CONFIRMATION_MSG()}
                    showModal={this.state.showInactivateModal}
                    handleYes={() => this.deleteDivision(this.dataItem.id, 0, CLIENT_DIV_INACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showInactivateModal: false });
                    }}
                />


                {this.state.showAddNewDivisionModal && (
                    <div id="add-division">
                        <Dialog className="col-12 For-all-responsive-height">
                            <CreateDivision
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showAddNewDivisionModal: false }, () => { this.dataItem = undefined; this.getClientDivisions(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showAddNewDivisionModal: true })}
                                clientId={this.state.clientId}
                                clientName={this.state.clientName}
                            />
                        </Dialog>
                    </div>
                )}

                {this.state.showEditModal && (
                    <div id="Edit-division">
                        <Dialog className="col-12 For-all-responsive-height">
                            <CreateDivision
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showEditModal: false }, () => { this.dataItem = undefined; this.getClientDivisions(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showEditModal: false })}
                                clientId={this.state.clientId}
                                clientName={this.state.clientName}
                            />
                        </Dialog>
                    </div>
                )}
            </div>
        );
    }
}

export default Divisions;