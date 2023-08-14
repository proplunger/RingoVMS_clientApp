import * as React from "react";
import auth from "../../../../Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import CompleteSearch from "../../../../Shared/Search/CompleteSearch";
import { State, toODataString } from "@progress/kendo-data-query"
import { CustomMenu, DefaultActions} from "./GlobalActions";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { initialDataState, successToastr } from "../../../../../HelperMethods";
import { CREATE_NOTIFICATION } from "../../../../Shared/ApiUrls";
import { ACTIVE_GLOBAL_NOTIFICATION_CONFIRMATION_MSG, GLOBAL_NOTIFICATION_ACTIVE_SUCCESS_MSG, GLOBAL_NOTIFICATION_INACTIVE_SUCCESS_MSG, GLOBAL_NOTIFICATION_REMOVE_SUCCESS_MSG, INACTIVE_GLOBAL_NOTIFICATION_CONFIRMATION_MSG, REMOVE_GLOBAL_NOTIFICATION_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface NotificationTemplatesProps {
    match: any;
    onCloseModal: any;
    location: any;
}

export interface NotificationTemplatesState {
    data: any;
    onFirstLoad: boolean;
    totalCount?: number;
    totalNotification?: any;
    showLoader?: boolean;
    showDeleteModal?: boolean;
    showDeactivateModal?: boolean;
    showActivateModal?: boolean;
    dataState: any;
    clientName?: string;
    serviceId?: string;
}

class NotificationTemplates extends React.Component<NotificationTemplatesProps, NotificationTemplatesState> {
    public serviceId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: NotificationTemplatesProps) {
        super(props);
        this.state = {
            data: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true,
        };
    }

    getNotificationTemplates = (dataState) => {
        var queryStr = `${toODataString(dataState)}`;
        axios.get(`api/admin/notificationtemplate?${queryStr}`).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
                onFirstLoad: false,
            });
            this.getNotificationTemplateCount(dataState);
        });
        
    }

    getNotificationTemplateCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;

        axios.get(`api/admin/notificationtemplate?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalNotification: res.data,
            });
        });
    };

    // deleteNotification = (id, statusId, msg) => {
    //     this.setState({showDeleteModal: false, showDeactivateModal: false, showActivateModal: false });
    //     axios.delete(`/api/admin/notificationtemplate/${id}/${statusId}`).then((res) => {
    //         this.getNotificationTemplates(this.state.dataState);
    //     });
    //     successToastr(msg);
    // };

    onDataStateChange = (changeEvent) => {
        this.getNotificationTemplates(changeEvent.data);
    };

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        if (action=="Reset Terms & Conditions") {
            property = `showResetModal`
        }
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
                                {/* {auth.hasPermissionV2(AppPermissions.CLIENT_REGION_CREATE) && (
                                    <Link to={CREATE_NOTIFICATION}>
                                        <span className="float-right text-dark">
                                            <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                            Add New Notification
                                        </span>
                                    </Link>
                                )} */}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageNotifications"
                        entityType={"Notifications"}
                        placeholder="Search text here!"
                        handleSearch={this.getNotificationTemplates}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageUserContainer global-action-grid">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.data}
                            {...this.state.dataState}
                            expandField="expanded"
                            total={this.state.totalCount}
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>

                            <GridColumn
                                field="notificationType"
                                title="Notification"
                                cell={(props) => CellRender(props, "Notification")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="notificationCategory"
                                title="Category"
                                cell={(props) => CellRender(props, "Category")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="subject"
                                title="Subject"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Subject")}
                                filter="text"
                            />
                            {/* <GridColumn
                                field="status"
                                title="Status"
                                columnMenu={ColumnMenu}
                                cell={StatusCell}
                            /> */}
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="50px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.id}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalNotification)}
                            />
                        </Grid>
                    </div>
                </div>

                {/* <ConfirmationModal
                    message={REMOVE_GLOBAL_NOTIFICATION_CONFIRMATION_MSG()}
                    showModal={this.state.showDeleteModal}
                    handleYes={() => this.deleteNotification(this.dataItem.notificationTemplateId, 2, GLOBAL_NOTIFICATION_REMOVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showDeleteModal: false });
                    }}
                />

                <ConfirmationModal
                    message={ACTIVE_GLOBAL_NOTIFICATION_CONFIRMATION_MSG()}
                    showModal={this.state.showActivateModal}
                    handleYes={() => this.deleteNotification(this.dataItem.notificationTemplateId, 1, GLOBAL_NOTIFICATION_ACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showActivateModal: false });
                    }}
                />

                <ConfirmationModal
                    message={INACTIVE_GLOBAL_NOTIFICATION_CONFIRMATION_MSG()}
                    showModal={this.state.showDeactivateModal}
                    handleYes={() => this.deleteNotification(this.dataItem.notificationTemplateId, 0, GLOBAL_NOTIFICATION_INACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showDeactivateModal: false });
                    }}
                /> */}
            </div>
        );
    }
}
export default NotificationTemplates;