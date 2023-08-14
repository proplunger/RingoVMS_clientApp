import * as React from "react";
import auth from "../../../../Auth";
import axios from "axios";
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
import { authHeader, initialDataState, successToastr } from "../../../../../HelperMethods";
import { Dialog } from "@progress/kendo-react-dialogs";
import CreateVendorTier from "../CreateVendorTier/CreateVendorTier";
import { Link } from "react-router-dom";
import { REMOVE_VENDOR_TIER_CONFIRMATION_MSG, VENDOR_TIER_REMOVE_SUCCESS_MSG } from "../../../../Shared/AppMessages";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface VendorTiersProps {

}

export interface VendorTiersState {
    clientId?: string;
    // clientName?: string;
    data: any;
    onFirstLoad: boolean;
    totalCount?: number;
    showLoader?: boolean;
    showAddNewVendorTierModal?: any;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    showDeleteModal?: boolean;
    dataState: any;
}

class VendorTiers extends React.Component<VendorTiersProps, VendorTiersState> {
    public vendorTierFeeId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: VendorTiersProps) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            data: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    componentDidMount() {
        this.setState({ showLoader: false });
    }

    getVendorTiers = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState)}`;

        axios.get(`api/vendor/client/${this.state.clientId}/vendortiers?${queryStr}`).then((res) => {
            this.setState({
                // clientName: res.data.length > 0 ? res.data[0].client : "",
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getVendorTiersCount(dataState);
        });
    }

    getVendorTiersCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };

        axios.get(`api/grid/client/${this.state.clientId}/vendortierscount`).then((res) => {
            this.setState({
                totalCount: res.data,
            });
        });
    };

    deleteVendorTier = (id) => {
        this.setState({ showDeleteModal: false, showRemoveModal: false });
        axios.delete(`/api/vendor/vendortier/${id}`).then((res) => {
            successToastr(VENDOR_TIER_REMOVE_SUCCESS_MSG);
            this.getVendorTiers(this.state.dataState);
            this.dataItem = undefined;
        });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getVendorTiers(changeEvent.data);
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
        this.setState({ showAddNewVendorTierModal: true })
    }

    AllRender = (props: GridCellProps) => {
        if (props.dataItem[props.field]==undefined) {
            return <td style={{ textAlign: "left" }}>{"All"}</td>
        } else {
            return <td contextMenu={`${this.capitalizeFirstLetter(props.field)}`} title={props.dataItem[props.field]}>{props.dataItem[props.field]}</td>
        }
    }
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
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

                            <Link to="/admin/vendortiers/create">
                                <span className="float-right text-dark cusrsor-pointer">
                                    <FontAwesomeIcon icon={faPlusCircle} className={"mr-2 text-dark"} />
                                    Add New Vendor Tier
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageVendorTiers"
                        entityType={"Vendor"}
                        placeholder="Search text here!"
                        handleSearch={this.getVendorTiers}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageVendorTierFeesContainer">
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
                            className="kendo-grid-custom lastchild global-action-grid-lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>

                            <GridColumn
                                field="client"
                                title="Client"
                                cell={(props) => this.AllRender(props)}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="division"
                                title="Division"
                                cell={(props) => this.AllRender(props)}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="location"
                                title="Location"
                                columnMenu={ColumnMenu}
                                cell={(props) => this.AllRender(props)}
                                filter="text"
                            />
                            {/* <GridColumn
                                field="position"
                                title="Position"
                                cell={(props) => this.AllRender(props)}
                                columnMenu={ColumnMenu}
                                filter="text"
                            /> */}
                            <GridColumn
                                field="vendor"
                                title="Vendor"
                                columnMenu={ColumnMenu}
                                cell={(props) => this.AllRender(props)}
                                filter="text"
                            />
                            <GridColumn
                                field="tier"
                                title="Vendor Tier"
                                columnMenu={ColumnMenu}
                                cell={(props) => this.AllRender(props)}
                                filter="text"
                            />
                            <GridColumn
                                field="tags"
                                title="Tags"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Tags")}
                                filter="text"
                            />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="60px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.vendorTierFeeId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.data, this.AddNewModal)}
                            />
                        </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={REMOVE_VENDOR_TIER_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteVendorTier(this.dataItem.id)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                {/* {this.state.showAddNewVendorTierModal && (
                    <div id="add-vendorTierFee">
                        <Dialog className="col-12 For-all-responsive-height">
                            <CreateVendorTier
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showAddNewVendorTierModal: false }, () => { this.dataItem = undefined; this.getVendorTiers(this.state.dataState) })}
                                //onCloseModal={() => this.setState({ showAddNewVendorTierFeeModal: false }, () =>  this.getVendorTiersFees(this.state.dataState))}
                                onOpenModal={() => this.setState({ showAddNewVendorTierModal: true })}
                                clientId={this.state.clientId}
                            // clientName = {this.state.clientName}
                            />
                        </Dialog>
                    </div>
                )} */}

                {/* {this.state.showEditModal && (
                    <div id="Edit-VendorTierFee">
                        <Dialog className="col-12 For-all-responsive-height">
                            <CreateVendorTier
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showEditModal: false }, () => { this.dataItem = undefined; this.getVendorTiers(this.state.dataState) })}
                                onOpenModal={() => this.setState({ showEditModal: true })}
                                clientId={this.state.clientId}
                            // clientName = {this.state.clientName}
                            />
                        </Dialog>
                    </div>
                )} */}

            </div>
        );
    }
}
export default VendorTiers;