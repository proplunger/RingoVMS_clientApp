import * as React from "react";
import auth from "../../../../Auth";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords, GridToolbar } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord } from "../../../../Shared/GridComponents/CommonComponents";
import EditClientJobCatalog from "../EditClientJobCatalog/EditClientJobCatalog";
import MapClientJobCatalog from "../MapClientJobCatalog/MapClientJobCatalog";
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
import clientAdminService from "../../Service/DataService";
import { CLIENT_JOB_CATALOG_REMOVE_SUCCESS_MSG, REMOVE_CLIENT_JOB_CATALOG_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import { Dialog } from "@progress/kendo-react-dialogs";
import { KendoFilter } from "../../../../ReusableComponents";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface ClientJobCatalogProps {
    match: any;
    onCloseModal: any;
}

export interface ClientJobCatalogState {
    clientId: string;
    data: any;
    onFirstLoad: boolean;
    totalCount?: number;
    totalClientJobCatalog?: any;
    showLoader?: boolean;
    showMapClientCatalogModal?: boolean;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    dataState: any; 
}

class ClientJobCatalog extends React.Component<ClientJobCatalogProps, ClientJobCatalogState> {
    public dataItem: any;
    constructor(props: ClientJobCatalogProps) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            data: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    getClientJobCatalog = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState)}`;
        let queryParams = `clientId eq ${this.state.clientId}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        clientAdminService.getClientJobCatalog(finalQueryString).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getClientJobCatalogCount(dataState);
        });
    }

    getClientJobCatalogCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;
        let queryParams = `clientId eq ${this.state.clientId}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        clientAdminService.getClientJobCatalog(finalQueryString).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalClientJobCatalog: res.data,
            });
        });
    };

    deleteClientJobCatalog = (id) => {
        this.setState({ showRemoveModal: false});
        clientAdminService.deleteClientJobCatalog(id).then((res) => {
            successToastr(CLIENT_JOB_CATALOG_REMOVE_SUCCESS_MSG);
            this.getClientJobCatalog(this.state.dataState);
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
        this.getClientJobCatalog(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    MapModal = () => {
        this.dataItem = undefined
        this.setState({ showMapClientCatalogModal: true })
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
                            {auth.hasPermissionV2(AppPermissions.AUTHENTICATED) && (
                                <span className="float-right text-dark cusrsor-pointer "
                                    onClick={() => this.setState({ showMapClientCatalogModal: true })}>
                                    <FontAwesomeIcon icon={faPlusCircle} className={"mr-2 text-dark"} />
                                    Map Client Catalog
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageClientJobCatalog"
                        entityType={"Client Job Catalog"}
                        placeholder="Search text here!"
                        handleSearch={this.getClientJobCatalog}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageClientJobCatalogContainer global-action-grid">
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

                            <GridColumn
                                field="jobCategory"
                                title="Global Job Category"
                                cell={(props) => CellRender(props, "Global Job Category")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="globalPosition"
                                title="Global Position"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Global Position")}
                                filter="text"
                            />
                            <GridColumn
                                field="clientPosition"
                                title="Client Position"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Client Position")}
                                filter="text"
                            />
                            <GridColumn
                                field="description"
                                width="450px"
                                title="Client Position Description"
                                cell={(props) => CellRender(props, "Client Position Description")}
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
                                headerCell={() => CustomMenu(this.state.totalClientJobCatalog, this.MapModal)}
                            />
                            <GridColumn sortable={false} field="expanded"  width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={REMOVE_CLIENT_JOB_CATALOG_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteClientJobCatalog(this.dataItem.id)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                {this.state.showMapClientCatalogModal && (
                    <div id="add-ClientJobCatalog">
                        <Dialog className="col-12 For-all-responsive-height">
                            <MapClientJobCatalog
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showMapClientCatalogModal: false }, () => { this.dataItem = undefined; this.getClientJobCatalog(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showMapClientCatalogModal: true })}
                            />
                        </Dialog>
                    </div>
                )}

                {this.state.showEditModal && (
                    <div id="Edit-ClientJobCatalog">
                        <Dialog className="col-12 For-all-responsive-height">
                            <EditClientJobCatalog
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showEditModal: false }, () => { this.dataItem = undefined; this.getClientJobCatalog(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showEditModal: false })}
                            />
                        </Dialog>
                    </div>
                )}
            </div>
        );
    }
}

export default ClientJobCatalog;