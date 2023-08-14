import * as React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { CREATE_COMMUNICATION_CENTER, CREATE_MESSAGE_CENTER } from "../../../../Shared/ApiUrls";
import CompleteSearch from "../../../../Shared/Search/CompleteSearch";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { State, toODataString } from "@progress/kendo-data-query";
import { PhoneNumberCell } from "../../../../ReusableComponents";
import { CustomMenu, DetailColumnCell, DefaultActions, ViewMoreComponent } from "./GlobalActions";
import { initialDataState, pageSizes } from "../../../../../HelperMethods";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import Auth from "../../../../Auth";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface MessageCenterProps {

}

export interface MessageCenterState {
    onFirstLoad: boolean;
    showLoader?: boolean;
    data: any;
    totalCount?: number;
    dataState: any;
    totalVendor?: any;

}

class MessageCenter extends React.Component<MessageCenterProps, MessageCenterState> {
    public dataItem: any;
    // pageSizes: number[] = [5, 10, 20, 50, 100];

    constructor(props: MessageCenterProps) {
        super(props);
        this.state = {
            onFirstLoad: true,
            showLoader: true,
            data: [],
            dataState: initialDataState,

        };
    }
    componentDidMount() {

    }

    getCommunicationCenter = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        axios.get(`api/vendor?${queryStr}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getCommunicationCenterCount(dataState);
        });
    }

    getCommunicationCenterCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        axios.get(`api/vendor?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalVendor: res.data,
            });
        });
    };

    deleteCommunicationCenter = (id, statusId, msg) => {

    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getCommunicationCenter(changeEvent.data);
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
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
                        <div className="col-12 fonFifteen paddingLeftandRight">
                            <BreadCrumbs></BreadCrumbs>
                            {Auth.hasPermissionV2(AppPermissions.VENDOR_CREATE) && (
                                <Link to={CREATE_COMMUNICATION_CENTER}>
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                        Add New Communication Center
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageCommunicationCenter"
                        entityType={"CommunicationCenter"}
                        placeholder="Search text here!"
                        handleSearch={this.getCommunicationCenter}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageUserContainer global-action-grid">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: pageSizes }}
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
                                title="Message"
                                cell={(props) => CellRender(props, "Vendor")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="email"
                                title="Start Date Time"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Email")}
                                filter="text"
                            />
                            <GridColumn
                                field="mobileNumber"
                                // width="150px"
                                title="End Date Time"
                                sortable={false}
                                filterable={false}
                                cell={(props) => PhoneNumberCell(props, "Mobile Number")}
                            />
                            <GridColumn
                                field="address1"
                                title="Attachment"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Address 1")}
                            />
                            <GridColumn
                                field="city"
                                title="Viewed On"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "City")}
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
                                        rowId={props.dataItem.messageCenterId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalVendor)}
                            />
                            <GridColumn sortable={false} field="expanded" width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>

            </div>
        )

    }


}
export default MessageCenter;