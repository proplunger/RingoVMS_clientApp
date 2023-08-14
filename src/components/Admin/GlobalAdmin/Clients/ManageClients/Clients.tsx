import * as React from "react";
import axios from "axios";
import auth from "../../../../Auth";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import { Grid, GridCellProps, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import CompleteSearch from "../../../../Shared/Search/CompleteSearch";
import { State, toODataString } from "@progress/kendo-data-query";
import { CustomMenu, DetailColumnCell, DefaultActions, ViewMoreComponent } from "./GlobalActions";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { initialDataState, successToastr } from "../../../../../HelperMethods";
import { PhoneNumberCell } from "../../../../ReusableComponents";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { INACTIVE_CLIENT_CONFIRMATION_MSG, CLIENT_INACTIVE_SUCCESS_MSG, CLIENT_ACTIVE_SUCCESS_MSG, CLIENT_REMOVE_SUCCESS_MSG, ACTIVE_CLIENT_CONFIRMATION_MSG, REMOVE_CLIENT_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface ClientsProps {

}

export interface ClientsState {
    data: any;
    onFirstLoad: boolean;
    totalCount?: number;
    showLoader?: boolean;
    showRemoveModal?: boolean;
    showInactivateModal?: boolean;
    showActivateModal?: boolean;
    showDeleteModal?: boolean;
    dataState: any;
    totalClient?: any;
}

class Clients extends React.Component<ClientsProps, ClientsState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public clientId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: ClientsProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    componentDidMount() {
    }

    getClients = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState)}`;

        axios.get(`api/clients?${queryStr}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getClientCount(dataState);
        });
    }

    getClientCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;

        axios.get(`api/clients?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalClient: res.data,
            });
        });
    };

    deleteClient = (id, statusId, msg) => {
        this.setState({ showDeleteModal: false, showRemoveModal: false, showInactivateModal: false, showActivateModal: false });
        axios.delete(`/api/clients/${id}/${statusId}`).then((res) => {
            successToastr(msg);
            this.getClients(this.state.dataState);
        });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getClients(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    DashRender = (props: GridCellProps) => {
        if (props.dataItem[props.field]==undefined) {
            return <td style={{ textAlign: "left" }}>{"-"}</td>
        } else {
            return <td>{props.dataItem[props.field]}</td>
        }
    }


    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-10 fonFifteen paddingLeftandRight">
                        <BreadCrumbs ></BreadCrumbs>
                        </div>
                         <div className="col-2">
                            {auth.hasPermissionV2(AppPermissions.CLIENT_CREATE) && (
                                <Link to="/admin/client/create">
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                        Add New Client
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageClient"
                        entityType={"Client"}
                        placeholder="Search text here!"
                        handleSearch={this.getClients}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageClientContainer global-action-grid">
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
                                field="email"
                                title="Email"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Email")}
                                filter="text"
                            />
                            <GridColumn
                                field="mobileNumber"
                                title="Phone Number"
                             //   width="140px"
                                sortable={false}
                                filterable={false}
                                cell={(props) => PhoneNumberCell(props, "Phone Number")}
                            />
                            <GridColumn
                                field="address1"
                                title="Address 1"
                              //  width="140px"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Address 1")}
                            />
                            <GridColumn
                                field="city"
                                title="City"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "City")}
                            />
                            <GridColumn
                                field="state"
                                title="State"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "State")}
                            />
                            <GridColumn
                                field="status"
                                width="180px"
                                title="Status"
                                columnMenu={ColumnMenu}
                                cell={StatusCell}
                            />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="50px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.clientId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalClient)}
                            />
                            <GridColumn sortable={false} field="expanded" width="80px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={REMOVE_CLIENT_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteClient(this.dataItem.id, 2, CLIENT_REMOVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                <ConfirmationModal
                    message={ACTIVE_CLIENT_CONFIRMATION_MSG()}
                    showModal={this.state.showActivateModal}
                    handleYes={() => this.deleteClient(this.dataItem.id, 1, CLIENT_ACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showActivateModal: false });
                    }}
                />

                <ConfirmationModal
                    message={INACTIVE_CLIENT_CONFIRMATION_MSG()}
                    showModal={this.state.showInactivateModal}
                    handleYes={() => this.deleteClient(this.dataItem.id, 0, CLIENT_INACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showInactivateModal: false });
                    }}
                />
            </div>
        );
    }
}
export default Clients;