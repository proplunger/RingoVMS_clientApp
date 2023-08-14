import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { orderBy, SortDescriptor, State, toODataString } from '@progress/kendo-data-query';
import { Grid, GridColumn, GridNoRecords, GridPageChangeEvent, GridSortChangeEvent } from '@progress/kendo-react-grid';
import axios from 'axios';
import * as React from 'react';
import { initialDataState, numberFormatter, successToastr } from '../../../../../HelperMethods';
import Auth from '../../../../Auth';
import { AppPermissions } from '../../../../Shared/Constants/AppPermissions';
import ColumnMenu from '../../../../Shared/GridComponents/ColumnMenu';
import { CellRender, GridNoRecord, StatusCell } from '../../../../Shared/GridComponents/CommonComponents';
import CompleteSearch from '../../../../Shared/Search/CompleteSearch';
import RowActions from '../../../../Shared/Workflow/RowActions';
import { CustomMenu, DefaultActions, DetailColumnCell, ViewMoreComponent } from './GlobalActions';
import { history } from '../../../../../HelperMethods';
import ConfirmationModal from '../../../../Shared/ConfirmationModal';
import CreateGlobalServiceType from '../CreateGlobalServiceType/CreateGlobalServiceType';
import { Dialog } from '@progress/kendo-react-dialogs';
import { ACTIVE_SERVICE_TYPE_CONFIRMATION_MSG, INACTIVE_SERVICE_TYPE_CONFIRMATION_MSG, REMOVE_SERVICE_TYPE_CONFIRMATION_MSG, SERVICE_TYPE_ACTIVE_SUCCESS_MSG, SERVICE_TYPE_INACTIVE_SUCCESS_MSG, SERVICE_TYPE_REMOVE_SUCCESS_MSG } from '../../../../Shared/AppMessages';
import BreadCrumbs from '../../../../Shared/BreadCrumbs/BreadCrumbs';


export interface GlobalServiceTypeProps {
    match: any;
    onCloseModal: any;
    location: any;
}

export interface GlobalServiceTypeState {
    services: any;
    clientName?: string;
    clientId?: string;
    onFirstLoad: boolean;
    totalCount?: number;
    totalServices?: any;
    showLoader?: boolean;
    showAddNewServiceTypeModal?: any;
    showEditModal?: boolean;
    showDeleteModal?: boolean;
    showDeactivateModal?: boolean;
    showActivateModal?: boolean;
    showInActiveServiceModal?: boolean;
    dataState: any;
    skip: number;
    data: any;
    sort: SortDescriptor[]
}

export default class GlobalServiceType extends React.Component<GlobalServiceTypeProps, GlobalServiceTypeState> {
    public dataItem: any;
    public divId: string;
    constructor(props: GlobalServiceTypeProps) {
        super(props);
        const { id } = this.props.match.params;
        var params = new URLSearchParams(this.props.location.search);
        this.state = {
            services: [],
            dataState: "",
            clientId: id,
            clientName: params.get("name"),
            onFirstLoad: true,
            showLoader: true,
            skip: 0,
            data: "",
            sort: []

        };
    }

    componentDidMount() {
        this.getServiceType(this.state.dataState)
    }

    getServiceType = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;

        axios.get(`api/admin/globalservicetypes?${queryStr}`).then((res) => {
            this.setState({
                services: res.data,
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getServiceTypeCount(dataState);
        });
    }

    getServiceTypeCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;

        axios.get(`api/admin/globalservicetypes?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalServices: res.data,
            });
        });
    };

    onDataStateChange = (changeEvent) => {
        this.getServiceType(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    AddNewModal = () => {
        this.dataItem = undefined
        this.setState({ showAddNewServiceTypeModal: true })
    }

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };
    pageChange = (event: GridPageChangeEvent) => {
        this.setState({
            skip: event.page.skip
        });
    }

    deleteServiceType = (id, statusId, msg) => {
        this.setState({ showDeleteModal: false, showDeactivateModal: false, showActivateModal: false });
        axios.delete(`api/admin/servicetypes/${id}/${statusId}`).then((res) => {
            successToastr(msg);
            this.getServiceType(this.state.dataState);
            this.dataItem = undefined;
        });
    };

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-9 fonFifteen paddingLeftandRight">
                        <BreadCrumbs></BreadCrumbs>
                        </div>
                        <div className="col-3">
                            {Auth.hasPermissionV2(AppPermissions.GLOBAL_JOB_CAT_CREATE) && (
                                <span className="float-right text-dark cusrsor-pointer "
                                    onClick={() => this.setState({ showAddNewServiceTypeModal: true })}>
                                    <FontAwesomeIcon icon={faPlusCircle} className={"mr-2 text-dark"} />
                                    Add New Service Type
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageServiceType"
                        entityType={"Service Type"}
                        placeholder="Search text here!"
                        handleSearch={this.getServiceType}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageDivisionContainer global-action-grid-lastchild">
                        <Grid
                            style={{ maxHeight: "425px", overflow: "clip" }}
                            rowHeight={40}
                            sortable={true}
                            sort={this.state.sort}
                            onPageChange={this.pageChange}
                            data={orderBy(this.state.data.slice(this.state.skip, this.state.skip + 9), this.state.sort)}
                            expandField="expanded"
                            pageSize={9}
                            total={this.state.data.length}
                            scrollable={'virtual'}
                            skip={this.state.skip}
                            className="kendo-grid-custom lastchild"
                            detail={ViewMoreComponent}
                            onSortChange={(e: GridSortChangeEvent) => {
                                this.setState({
                                    sort: e.sort
                                });
                            }}

                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>

                            <GridColumn
                                field="serviceCategory"
                                title="Service Category"
                                cell={(props) => CellRender(props, "Category")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="serviceType"
                                title="Service Type"
                                cell={(props) => CellRender(props, "Service Type")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="isFeeApply"
                                title="Is Fee Applied"
                                cell={(props) => CellRender(props, "IsFeeApplied")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="createdDate"
                                title="Created Date"
                                format="{0:d}"
                                editor="date"
                                cell={(props) => CellRender(props, "Created Date")}
                                columnMenu={ColumnMenu}
                                filter="date"
                            />
                            <GridColumn
                                field="createdBy"
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
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalServices, this.AddNewModal)}
                            />
                            <GridColumn sortable={false} field="expanded" width="100px" title="View More" cell={this.ExpandCell} />

                        </Grid>
                        <div className="modal-footer justify-content-center border-0">
                            <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                </button>
                            </div>
                        </div>
                    </div>
                    <ConfirmationModal
                        message={REMOVE_SERVICE_TYPE_CONFIRMATION_MSG()}
                        showModal={this.state.showDeleteModal}
                        handleYes={() => this.deleteServiceType(this.dataItem.id, 2, SERVICE_TYPE_REMOVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showDeleteModal: false });
                        }}
                    />

                    <ConfirmationModal
                        message={ACTIVE_SERVICE_TYPE_CONFIRMATION_MSG()}
                        showModal={this.state.showActivateModal}
                        handleYes={() => this.deleteServiceType(this.dataItem.id, 1, SERVICE_TYPE_ACTIVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showActivateModal: false });
                        }}
                    />

                    <ConfirmationModal
                        message={INACTIVE_SERVICE_TYPE_CONFIRMATION_MSG()}
                        showModal={this.state.showDeactivateModal}
                        handleYes={() => this.deleteServiceType(this.dataItem.id, 0, SERVICE_TYPE_INACTIVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showDeactivateModal: false });
                        }}
                    />

                    {this.state.showAddNewServiceTypeModal && (
                        <div id="add-division">
                            <Dialog className="col-12 For-all-responsive-height">
                                <CreateGlobalServiceType
                                    props={this.dataItem}
                                    onCloseModal={() => this.setState({ showAddNewServiceTypeModal: false }, () => { this.dataItem = undefined; this.getServiceType(this.state.dataState) })}
                                    onOpenModal={() => this.setState({ showAddNewServiceTypeModal: true })}
                                    clientName={this.state.clientName}
                                />
                            </Dialog>
                        </div>
                    )}

                    {this.state.showEditModal && (
                        <div id="Edit-division">
                            <Dialog className="col-12 For-all-responsive-height">
                                <CreateGlobalServiceType
                                    props={this.dataItem}
                                    onCloseModal={() => this.setState({ showEditModal: false }, () => { this.dataItem = undefined; this.getServiceType(this.state.dataState) })}
                                    onOpenModal={() => this.setState({ showEditModal: false })}
                                    clientName={this.state.clientName}
                                />
                            </Dialog>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}