import * as React from "react";
import auth from "../../../../Auth";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords, GridToolbar } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord } from "../../../../Shared/GridComponents/CommonComponents";
import CreateGlobalJobCatalog from "../CreateGlobalJobCatalog/CreateGlobalJobCatalog";
import CompleteSearch from "../../../../Shared/Search/CompleteSearch";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { CustomMenu, DetailColumnCell, DefaultActions, ViewMoreComponent } from "./GlobalActions";
import { State, toODataString } from "@progress/kendo-data-query";
import { initialDataState, successToastr } from "../../../../../HelperMethods";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import globalAdminService from "../../Service/DataService";
import { GLOBAL_JOB_CATALOG_REMOVE_SUCCESS_MSG, REMOVE_GLOBAL_JOB_CATALOG_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import { Dialog } from "@progress/kendo-react-dialogs";
import axios from "axios";
import WithoutFilterColumnMenu from "../../../../Shared/GridComponents/WithoutFilterColumnMenu";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface GlobalJobCatalogProps {
    match: any;
    onCloseModal: any;
}

export interface GlobalJobCatalogState {
    data: any;
    onFirstLoad: boolean;
    totalCount?: number;
    totalJobCatalog?: any;
    showLoader?: boolean;
    showAddNewJobCatalogModal?: boolean;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    dataState: any; 
}

class GlobalJobCatalog extends React.Component<GlobalJobCatalogProps, GlobalJobCatalogState> {
    public dataItem: any;
    constructor(props: GlobalJobCatalogProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    getGlobalJobCatalog = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState)}`;

        globalAdminService.getGlobalJobCatalog(queryStr).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getGlobalJobCatalogCount(dataState);
        });
    }

    getGlobalJobCatalogCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;

        globalAdminService.getGlobalJobCatalog(queryStr).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalJobCatalog: res.data,
            });
        });
    };

    deleteGlobalJobCatalog = (id) => {
        this.setState({ showRemoveModal: false});
        globalAdminService.deleteGlobalJobCatalog(id).then((res) => {
            successToastr(GLOBAL_JOB_CATALOG_REMOVE_SUCCESS_MSG);
            this.getGlobalJobCatalog(this.state.dataState);
            this.dataItem = undefined;
        });
    };

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getGlobalJobCatalog(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    AddNewModal = () => {
        this.dataItem = undefined
        this.setState({ showAddNewJobCatalogModal: true })
    }

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-10 fonFifteen paddingLeftandRight">
                        <BreadCrumbs></BreadCrumbs>
                        </div>
                        <div className="col-2">
                            {auth.hasPermissionV2(AppPermissions.GLOBAL_JOB_CAT_CREATE) && (
                                <span className="float-right text-dark cusrsor-pointer "
                                    onClick={() => this.setState({ showAddNewJobCatalogModal: true })}>
                                    <FontAwesomeIcon icon={faPlusCircle} className={"mr-2 text-dark"} />
                                    Add New Catalog
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageGlobalJobCatalog"
                        entityType={"Global Job Catalog"}
                        placeholder="Search text here!"
                        handleSearch={this.getGlobalJobCatalog}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageGlobalJobCatalogContainer global-action-grid">
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
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>

                            {/* <GridColumn
                                field="jobFlow"
                                title="Job Flow"
                                cell={(props) => CellRender(props, "Job Flow")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            /> */}
                            <GridColumn
                                field="jobCategory"
                                title="Job Category"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Job Category")}
                                filter="text"
                            />
                            <GridColumn
                                field="position"
                                title="Position"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Position")}
                                filter="text"
                            />
                            <GridColumn
                                field="description"
                                width="500px"
                                title="Position Description"
                                cell={(props) => CellRender(props, "Position Description")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="isNpi"
                                title="Is NPI Required"
                                cell={(props) => CellRender(props, "Is NPI Required")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="50px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.clientDivId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalJobCatalog, this.AddNewModal)}
                            />
                            <GridColumn sortable={false} field="expanded"  width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={REMOVE_GLOBAL_JOB_CATALOG_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteGlobalJobCatalog(this.dataItem.id)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />


                {this.state.showAddNewJobCatalogModal && (
                    <div id="add-GlobalJobCatalog">
                        <Dialog className="col-12 For-all-responsive-height">
                            <CreateGlobalJobCatalog
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showAddNewJobCatalogModal: false }, () => { this.dataItem = undefined; this.getGlobalJobCatalog(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showAddNewJobCatalogModal: true })}
                            />
                        </Dialog>
                    </div>
                )}

                {this.state.showEditModal && (
                    <div id="Edit-GlobalJobCatalog">
                        <Dialog className="col-12 For-all-responsive-height">
                            <CreateGlobalJobCatalog
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showEditModal: false }, () => { this.dataItem = undefined; this.getGlobalJobCatalog(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showEditModal: false })}
                            />
                        </Dialog>
                    </div>
                )}
            </div>
        );
    }
}

export default GlobalJobCatalog;