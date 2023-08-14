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
import { CustomMenu, DetailColumnCell, DefaultActions, ViewMoreComponent } from "./GlobalActions";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { initialDataState, successToastr } from "../../../../../HelperMethods";
import { KendoFilter, PhoneNumberCell } from "../../../../ReusableComponents";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { ACTIVE__DIVISION_LOC_CONFIRMATION_MSG, DIVISION_LOC_ACTIVE_SUCCESS_MSG, DIVISION_LOC_INACTIVE_SUCCESS_MSG, DIVISION_LOC_REMOVE_SUCCESS_MSG, INACTIVE_DIVISION_LOC_CONFIRMATION_MSG, REMOVE_DIVISION_LOC_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import clientAdminService from "../../Service/DataService";
import { history} from "../../../../../HelperMethods";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface LocationsProps {
    match: any;
    onCloseModal: any;
    location: any;
}

export interface LocationsState {
    clientId: string;
    clientName?: string;
    divisionId: string;
    locations: any;
    onFirstLoad: boolean;
    totalCount?: number;
    totalLocations?: any;
    showLoader?: boolean;
    showRemoveModal?: boolean;
    showInactivateModal?: boolean;
    showActivateModal?: boolean;
    dataState: any; 
}

class Locations extends React.Component<LocationsProps, LocationsState> {
    public dataItem: any;
    constructor(props: LocationsProps) {
        super(props);
        const { id } = this.props.match.params;
        const { clientId } = this.props.match.params;
        var params = new URLSearchParams(this.props.location.search)
        this.state = {
            clientId: clientId,
            clientName: params.get("name"),
            divisionId: id,
            locations: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    getLocations = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });

        // var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        // var finalQueryString = queryStr;

        if(this.state.divisionId){
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        let queryParams = `contains(divId,'${this.state.divisionId}')`;

        finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        } else {
            var queryStr = `${toODataString(dataState, { utcDates: true })}`;
            let queryParams = `clientId eq ${this.state.clientId}`
            var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        }

        clientAdminService.getLocations(finalQueryString).then((res) => {
            this.setState({
                locations: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getLocationsCount(dataState);
        });
    }

    getLocationsCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };

        if(this.state.divisionId){
            var queryStr = `${toODataString(finalState, { utcDates: true })}`;
            let queryParams = `contains(divId,'${this.state.divisionId}')`;
            finalQueryString = KendoFilter(dataState, queryStr, queryParams);
            } 
        else {
                var queryStr = `${toODataString(finalState, { utcDates: true })}`;
                let queryParams = `clientId eq ${this.state.clientId}`
                var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
            }
        
        clientAdminService.getLocations(finalQueryString).then((res) => {this.setState({
                totalCount: res.data.length,
                totalLocations: res.data,
            });
        });
    };
    
    deleteLocation = (id, statusId, msg) => {
         this.setState({ showRemoveModal:false , showInactivateModal:false, showActivateModal:false });
         clientAdminService.deleteClientDivisionLocation(id,statusId).then((res) => {
             successToastr(msg);
             this.getLocations(this.state.dataState);
         });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getLocations(changeEvent.data);
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
                        <BreadCrumbs globalData={{clientId:this.state.clientId, divisionId:this.state.divisionId}} ></BreadCrumbs>
                         </div>
                         <div className="col-2">
                            {auth.hasPermissionV2(AppPermissions.CLIENT_LOC_CREATE) && (
                                <Link to= {this.state.clientId && this.state.divisionId ? `/admin/client/${this.state.clientId}/division/${this.state.divisionId}/location/create?name=${this.state.clientName}` : `/admin/client/${this.state.clientId}/location/create?name=${this.state.clientName}`}>
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                        Add New Location
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageLocation"
                        entityType={"Location"}
                        placeholder="Search text here!"
                        handleSearch={this.getLocations}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageLocationContainer global-action-grid">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.locations}
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
                                field="mobileNumber"
                                title="Mobile Number"
                                sortable={true}
                                filterable={true}
                                columnMenu={ColumnMenu}
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
                                title="Status" 
                                columnMenu={ColumnMenu} 
                                cell={StatusCell} 
                            /> 
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="40px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.clientDivLocId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props, this.state.clientId, this.state.clientName, this.state.divisionId)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalLocations , this.state.clientId, this.state.clientName, this.state.divisionId)}
                            /> 
                            <GridColumn sortable={false} field="expanded" title="View More"  width="100px" cell={this.ExpandCell} />
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
                    message={REMOVE_DIVISION_LOC_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteLocation(this.dataItem.clientDivLocId, 2, DIVISION_LOC_REMOVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                <ConfirmationModal
                    message={ACTIVE__DIVISION_LOC_CONFIRMATION_MSG()}
                    showModal={this.state.showActivateModal}
                    handleYes={() => this.deleteLocation(this.dataItem.clientDivLocId, 1, DIVISION_LOC_ACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showActivateModal: false });
                    }}
                />

                <ConfirmationModal
                    message={INACTIVE_DIVISION_LOC_CONFIRMATION_MSG()}
                    showModal={this.state.showInactivateModal}
                    handleYes={() => this.deleteLocation(this.dataItem.clientDivLocId, 0, DIVISION_LOC_INACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showInactivateModal: false });
                    }}
                />
            </div>
        );
    }
}
export default Locations;

