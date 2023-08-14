import * as React from "react";
import clientAdminService from "../../Service/DataService";
import auth from "../../../../Auth";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import CompleteSearch from "../../../../Shared/Search/CompleteSearch";
import { State, toODataString } from "@progress/kendo-data-query";
import { CustomMenu, DefaultActions } from "./GlobalActions";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { initialDataState, successToastr } from "../../../../../HelperMethods";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { RELEASE_CONFIG_REMOVE_SUCCESS_MSG, REMOVE_RELEASE_CONFIG_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import { KendoFilter } from "../../../../ReusableComponents";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface ReleaseConfigurationProps {
    match: any;
    onCloseModal: any;
}

export interface ReleaseConfigurationState {
    clientId: string;
    data: any;
    onFirstLoad: boolean;
    totalCount?: number;
    totaldata?: any;
    showLoader?: boolean;
    showRemoveModal?: boolean;
    dataState: any; 
}

class ReleaseConfiguration extends React.Component<ReleaseConfigurationProps, ReleaseConfigurationState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public releaseConfigId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: ReleaseConfigurationProps) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            data: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }
    
    getReleaseConfiguration = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });

        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        let queryParams = `clientId eq ${this.state.clientId}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        clientAdminService.getReleaseConfiguration(finalQueryString).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getReleaseConfigurationCount(dataState);
        });
    }
    
    getReleaseConfigurationCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        let queryParams = `clientId eq ${this.state.clientId}`;

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        clientAdminService.getReleaseConfiguration(finalQueryString)
        .then((res) => {
            this.setState({
                totalCount: res.data.length,
                totaldata: res.data,
            });
        });
    };

    deleteReleaseConfiguration = (id) => {
         this.setState({ showRemoveModal:false });
         clientAdminService.deleteReleaseConfiguration(id).then((res) => {
             successToastr(RELEASE_CONFIG_REMOVE_SUCCESS_MSG);
             this.getReleaseConfiguration(this.state.dataState);
         });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getReleaseConfiguration(changeEvent.data);
    };

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
                            {auth.hasPermissionV2(AppPermissions.ADMIN_REQ_RELEASE_CREATE) && (
                                <Link to="/admin/releaseconfig/create">
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                        Add New Release
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageReleaseConfiguration"
                        entityType={"Release Configuration"}
                        placeholder="Search text here!"
                        handleSearch={this.getReleaseConfiguration}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageReleaseConfigurationContainer global-action-grid-lastchild">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.data}
                            {...this.state.dataState}
                            // detail={ViewMoreComponent}
                            // expandField="expanded"
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
                                field="position"
                                title="Position"
                                cell={(props) => CellRender(props, "Position")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="tags"
                                title="Tags"
                                cell={(props) => CellRender(props, "Tags")}
                                columnMenu={ColumnMenu}
                                filter="text"
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
                                field="createdBy"
                                title="Created By"
                                cell={(props) => CellRender(props, "Created By")}
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
                                        rowId={props.dataItem.vendorId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totaldata )}
                            />
                        </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={REMOVE_RELEASE_CONFIG_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteReleaseConfiguration(this.dataItem.id)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />
            </div>
        );
    }
}
export default ReleaseConfiguration;

