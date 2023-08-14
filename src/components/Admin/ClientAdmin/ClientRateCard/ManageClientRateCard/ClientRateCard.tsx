import * as React from "react";
import auth from "../../../../Auth";
import { Grid, GridCellProps, GridColumn as Column, GridColumn, GridNoRecords, GridToolbar } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord } from "../../../../Shared/GridComponents/CommonComponents";
import CompleteSearch from "../../../../Shared/Search/CompleteSearch";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { CustomMenu, DetailColumnCell, DefaultActions, ViewMoreComponent } from "./GlobalActions";
import { State, toODataString } from "@progress/kendo-data-query";
import { currencyFormatter, initialDataState, successToastr } from "../../../../../HelperMethods";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import clientAdminService from "../../Service/DataService";
import { CLIENT_RATE_CARD_REMOVE_SUCCESS_MSG, REMOVE_CLIENT_RATE_CARD_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import { Dialog } from "@progress/kendo-react-dialogs"
import CreateClientRateCard from "../CreateClientRateCard/CreateClientRateCard";
import axios from "axios";
import { KendoFilter } from "../../../../ReusableComponents";
import { Link } from "react-router-dom";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface ClientRateCardProps {
    match: any;
    onCloseModal: any;
}

export interface ClientRateCardState {
    clientId?: string;
    data: any;
    onFirstLoad: boolean;
    totalCount?: number;
    totalClientRatecard?: any;
    showLoader?: boolean;
    showAddNewClientRateCardModal?: boolean;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    dataState: any;
}

class ClientRateCard extends React.Component<ClientRateCardProps, ClientRateCardState> {
    public dataItem: any;
    constructor(props: ClientRateCardProps) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            data: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    getClientRateCard = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState)}`;
        let queryParams = `clientId eq ${this.state.clientId}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        clientAdminService.getClientRateCard(finalQueryString).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getClientRateCardCount(dataState);
        });
    }

    getClientRateCardCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;
        let queryParams = `clientId eq ${this.state.clientId}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        clientAdminService.getClientRateCard(finalQueryString).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalClientRatecard: res.data,
            });
        });
    };

    deleteClientRateCard = (id) => {
        this.setState({ showRemoveModal: false });
        clientAdminService.deleteClientRateCard(id).then((res) => {
            successToastr(CLIENT_RATE_CARD_REMOVE_SUCCESS_MSG);
            this.getClientRateCard(this.state.dataState);
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
        this.getClientRateCard(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    AddNewModal = () => {
        this.dataItem = undefined
        this.setState({ showAddNewClientRateCardModal: true })
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
                            {auth.hasPermissionV2(AppPermissions.CLIENT_RATE_CARD_CREATE) && (
                                <Link to="/admin/clientratecard/create">
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                        Add New Rate Card
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageClientRateCard"
                        entityType={"Client Rate Card"}
                        placeholder="Search text here!"
                        handleSearch={this.getClientRateCard}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageClientRateCardContainer global-action-grid">
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
                                field="client"
                                title="Client"
                                cell={(props) => CellRender(props, "Client")}
                                columnMenu={ColumnMenu}
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
                                field="serviceType"
                                title="Service Type"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Service Type")}
                                filter="text"
                                width="140px"
                            />
                            <GridColumn
                                field="billType"
                                title="Bill Type"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Bill Type")}
                                filter="text"
                                width="100px"
                            />
                            <GridColumn
                                field="maxBillRate"
                                title="Max Bill Rate"
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    return (
                                        <td contextMenu="Max Bill Rate"
                                            className="pr-4 text-right"
                                            title={props.dataItem.maxBillRate}
                                        >
                                            {currencyFormatter(props.dataItem.maxBillRate)}
                                        </td>
                                    );
                                }}
                                width="120px"
                                filter="numeric"
                            />
                            <GridColumn
                                field="validFrom"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Valid From"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Valid From")}
                                width="100px"
                            />
                            <GridColumn
                                field="validTo"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Valid To"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Valid To")}
                                width="100px"
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
                                headerCell={() => CustomMenu(this.state.totalClientRatecard)}
                            />
                            <GridColumn sortable={false} field="expanded" width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={REMOVE_CLIENT_RATE_CARD_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteClientRateCard(this.dataItem.id)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                {this.state.showAddNewClientRateCardModal && (
                    <div id="add-ClientRateCard">
                        <Dialog className="col-12 For-all-responsive-height">
                            <CreateClientRateCard
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showAddNewClientRateCardModal: false }, () => { this.dataItem = undefined; this.getClientRateCard(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showAddNewClientRateCardModal: true })}
                            />
                        </Dialog>
                    </div>
                )}

                {this.state.showEditModal && (
                    <div id="Edit-ClientRateCard">
                        <Dialog className="col-12 For-all-responsive-height">
                            <CreateClientRateCard
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showEditModal: false }, () => { this.dataItem = undefined; this.getClientRateCard(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showEditModal: false })}
                            />
                        </Dialog>
                    </div>
                )}
            </div>
        );
    }
}

export default ClientRateCard;