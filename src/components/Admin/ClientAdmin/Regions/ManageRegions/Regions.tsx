import * as React from "react";
import auth from "../../../../Auth";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords, GridToolbar } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import axios from "axios";
import CompleteSearch from "../../../../Shared/Search/CompleteSearch";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { CustomMenu, DefaultActions } from "./GlobalActions";
import { State, toODataString } from "@progress/kendo-data-query";
import CreateRegion from "../CreateRegion/CreateRegion";
import { Dialog } from "@progress/kendo-react-dialogs";
import { history, initialDataState, successToastr } from "../../../../../HelperMethods";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { ACTIVE_CLIENT_REGION_CONFIRMATION_MSG, CLIENT_REGION_ACTIVE_SUCCESS_MSG, CLIENT_REGION_INACTIVE_SUCCESS_MSG, CLIENT_REGION_REMOVE_SUCCESS_MSG, INACTIVE_CLIENT_REGION_CONFIRMATION_MSG, REMOVE_CLIENT_REGION_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface RegionsProps {
    match: any;
    onCloseModal: any;
    location: any;
}

export interface RegionsState {
    regions: any;
    //locations: any;
    clientName?: string;
    clientId?: string;
    onFirstLoad: boolean;
    totalCount?: number;
    totalRegion?: any;
    showLoader?: boolean;
    showAddNewRegionModal?: any;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    showInactivateModal?: boolean;
    showActivateModal?: boolean;
    showDeleteModal?: boolean;
    showInActiveRegionModal?: boolean;
    dataState: any;
}

class Regions extends React.Component<RegionsProps, RegionsState> {
    public dataItem: any;
    public divId: string;
    constructor(props: RegionsProps) {
        super(props);
        const { id } = this.props.match.params;
        var params = new URLSearchParams(this.props.location.search);
        this.state = {
            regions: [],
            //locations: [],
            dataState: initialDataState,
            clientId: id,
            clientName: params.get("name"),
            onFirstLoad: true,
            showLoader: true,
        };
    }

    componentDidMount() {
        if (this.state.clientId) {
            this.getRegions(this.state.dataState);

        } else {
            this.setState({ showLoader: false });
        }
    }

    getRegions = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        axios.get(`api/clients/${this.state.clientId}/region?${queryStr}`).then((res) => {
            this.setState({
                regions: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getRegionCount(dataState);
        });
    }

    getRegionCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;

        axios.get(`api/clients/${this.state.clientId}/region?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalRegion: res.data,
            });
        });
    };

    onDataStateChange = (changeEvent) => {
        this.getRegions(changeEvent.data);
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
        this.setState({ showAddNewRegionModal: true })
    }

    deleteDivision = (id, statusId, msg) => {
        this.setState({ showDeleteModal: false, showRemoveModal: false, showInactivateModal: false, showActivateModal: false });
        axios.delete(`/api/admin/region/${id}/${statusId}`).then((res) => {
            successToastr(msg);
            this.getRegions(this.state.dataState);
            this.dataItem = undefined;
        });
    };

    openModal = (prop, dataItem) => {
        this.setState({ showDeleteModal: true });
    };

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-10 fonFifteen paddingLeftandRight">
                        <BreadCrumbs globalData={{clientId:this.state.clientId}} ></BreadCrumbs>
                        </div>
                        <div className="col-2">
                            {auth.hasPermissionV2(AppPermissions.CLIENT_REGION_CREATE) && (
                                <span className="float-right text-dark cusrsor-pointer "
                                    onClick={() => this.setState({ showAddNewRegionModal: true })}>
                                    <FontAwesomeIcon icon={faPlusCircle} className={"mr-2 text-dark"} />
                                    Add New Region
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageRegion"
                        entityType={"Region"}
                        placeholder="Search text here!"
                        handleSearch={this.getRegions}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageDivisionContainer global-action-grid-lastchild">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.regions}
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
                                field="zone"
                                title="Zone"
                                cell={(props) => CellRender(props, "Zone")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="name"
                                title="Region Name"
                                cell={(props) => CellRender(props, "Region Name")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="description"
                                title="Description"
                                cell={(props) => CellRender(props, "Description")}
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
                                headerCell={() => CustomMenu(this.state.totalRegion, this.AddNewModal)}
                            />
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
                    message={REMOVE_CLIENT_REGION_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteDivision(this.dataItem.id, 2, CLIENT_REGION_REMOVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                <ConfirmationModal
                    message={ACTIVE_CLIENT_REGION_CONFIRMATION_MSG()}
                    showModal={this.state.showActivateModal}
                    handleYes={() => this.deleteDivision(this.dataItem.id, 1, CLIENT_REGION_ACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showActivateModal: false });
                    }}
                />

                <ConfirmationModal
                    message={INACTIVE_CLIENT_REGION_CONFIRMATION_MSG()}
                    showModal={this.state.showInactivateModal}
                    handleYes={() => this.deleteDivision(this.dataItem.id, 0, CLIENT_REGION_INACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showInactivateModal: false });
                    }}
                />


                {this.state.showAddNewRegionModal && (
                    <div id="add-division">
                        <Dialog className="col-12 For-all-responsive-height">
                            <CreateRegion
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showAddNewRegionModal: false }, () => { this.dataItem = undefined; this.getRegions(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showAddNewRegionModal: true })}
                                clientId={this.state.clientId}
                                clientName={this.state.clientName}
                            />
                        </Dialog>
                    </div>
                )}

                {this.state.showEditModal && (
                    <div id="Edit-division">
                        <Dialog className="col-12 For-all-responsive-height">
                            <CreateRegion
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showEditModal: false }, () => { this.dataItem = undefined; this.getRegions(this.state.dataState) })}
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

export default Regions;