import * as React from "react";
import axios from "axios";
import auth from "../../../../Auth";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import CompleteSearch from "../../../../Shared/Search/CompleteSearch";
import { State, toODataString } from "@progress/kendo-data-query";
import { CustomMenu, DetailColumnCell, DefaultActions, ViewMoreComponent } from "./GlobalActions";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { initialDataState, successToastr } from "../../../../../HelperMethods";
import { PhoneNumberCell } from "../../../../ReusableComponents";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { ACTIVE_VENDOR_CONFIRMATION_MSG, INACTIVE_VENDOR_CONFIRMATION_MSG, REMOVE_VENDOR_CONFIRMATION_MSG, VENDOR_ACTIVE_SUCCESS_MSG, VENDOR_INACTIVE_SUCCESS_MSG, VENDOR_REMOVE_SUCCESS_MSG } from "../../../../Shared/AppMessages";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface VendorsProps {
    
}

export interface VendorsState {
    data: any;
    onFirstLoad: boolean;
    totalCount?: number;
    totalVendor?: any;
    showLoader?: boolean;
    showRemoveModal?: boolean;
    showInactivateModal?: boolean;
    showActivateModal?: boolean;
    showDeleteModal?: boolean;
    dataState: any; 
}

class Vendors extends React.Component<VendorsProps, VendorsState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public vendId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: VendorsProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    componentDidMount(){
       // this.getVendors(this.state.dataState)
    }

    getVendors = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        //var queryStr = `${toODataString(dataState)}`;
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        axios.get(`api/vendor?${queryStr}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getVendorsCount(dataState);
        });
    }
    
    getVendorsCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        //var queryStr = `${toODataString(finalState)}`;
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        axios.get(`api/vendor?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalVendor: res.data,
            });
        });
    };

    deleteVendor = (id, statusId, msg) => {
         this.setState({ showDeleteModal: false,showRemoveModal:false , showInactivateModal:false, showActivateModal:false });
         axios.delete(`/api/vendor/${id}/${statusId}`).then((res) => {
             successToastr(msg);
             this.getVendors(this.state.dataState);
         });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getVendors(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    handleActionClick= (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
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
                        <div className="col-10 fonFifteen paddingLeftandRight">
                        <BreadCrumbs></BreadCrumbs>
                        </div>
                        <div className="col-2">
                            {auth.hasPermissionV2(AppPermissions.VENDOR_CREATE) && (
                                <Link to="/admin/vendor/create">
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                        Add New Vendor
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageVendor"
                        entityType={"Vendor"}
                        placeholder="Search text here!"
                        handleSearch={this.getVendors}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageVendorContainer global-action-grid">
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
                                field="vendor"
                                title="Vendor"
                                cell={(props) => CellRender(props, "Vendor")}
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
                               // width="150px"
                                title="Mobile Number"
                                sortable={false}
                                filterable={false}
                                cell={(props) => PhoneNumberCell(props, "Mobile Number")}
                            />
                            <GridColumn
                                field="address1"
                                title="Address 1"
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
                                //width="210px" 
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
                                        rowId={props.dataItem.vendorId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalVendor )}
                            />
                            <GridColumn sortable={false} field="expanded"  width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={REMOVE_VENDOR_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteVendor(this.dataItem.vendorId, 2, VENDOR_REMOVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                <ConfirmationModal
                    message={ACTIVE_VENDOR_CONFIRMATION_MSG()}
                    showModal={this.state.showActivateModal}
                    handleYes={() => this.deleteVendor(this.dataItem.vendorId, 1, VENDOR_ACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showActivateModal: false });
                    }}
                />

                <ConfirmationModal
                    message={INACTIVE_VENDOR_CONFIRMATION_MSG()}
                    showModal={this.state.showInactivateModal}
                    handleYes={() => this.deleteVendor(this.dataItem.vendorId, 0, VENDOR_INACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showInactivateModal: false });
                    }}
                />
            </div>
        );
    }
}
export default Vendors;

