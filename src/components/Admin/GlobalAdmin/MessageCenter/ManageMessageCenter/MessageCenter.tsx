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
import { PhoneNumberCell, convertShiftDateTime } from "../../../../ReusableComponents";
import { CustomMenu, DetailColumnCell, DefaultActions, ViewMoreComponent } from "./GlobalActions";
import { dateFormatter, datetimeFormatter, initialDataState, pageSizes, successToastr } from "../../../../../HelperMethods";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import Auth from "../../../../Auth";
import globalAdminService from "../../../GlobalAdmin/Service/DataService";
import MessageCenterDataService from "../Service/DataService";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { ACTIVE_MESSAGE_CONFIRMATION_MSG, ARCHIVE_MESSAGE_CONFIRMATION_MSG, DEACTIVATE_MESSAGE_CONFIRMATION_MSG, DELETE_MESSAGE_CONFIRMATION_MSG, MESSAGE_ACTIVE_SUCCESS_MSG, MESSAGE_ARCHIVED_SUCCESS_MSG, MESSAGE_DEATCIVATE_SUCCESS_MSG, MESSAGE_PUBLISH_SUCCESS_MSG, MSG_DELETE_SUCCESS_MSG, PUBLISH_MESSAGE_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import { RecordStatus } from "../../../../Shared/AppConstants";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

export interface MessageCenterProps {

}

export interface MessageCenterState {
    onFirstLoad: boolean;
    showLoader?: boolean;
    message: any;
    totalCount?: number;
    dataState: any;
    totalMessage?: any;
    showDeleteModal?: boolean;
    showActivateModal?: boolean;
    showDeactivateModal?: boolean;
    showPublishModal?: boolean;
    showArchiveModal?: boolean;
}

class MessageCenter extends React.Component<MessageCenterProps, MessageCenterState> {
    public dataItem: any;

    constructor(props: MessageCenterProps) {
        super(props);
        this.state = {
            onFirstLoad: true,
            showLoader: true,
            message: [],
            dataState: initialDataState,

        };
    }
    componentDidMount() {
        this.getCommCenter(this.state.dataState);

    }

    getCommCenter = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        MessageCenterDataService.getCommCenter(queryStr).then((res) => {
            this.setState({
                message: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getCommCenterCount(dataState);
        });
    }

    getCommCenterCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        MessageCenterDataService.getCommCenter(queryStr).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalMessage: res.data,
            });
        });
    };

    deleteCommunicationCenter = (id, statusId, msg) => {
        this.setState({ showDeleteModal: false, showActivateModal: false, showDeactivateModal: false });
        MessageCenterDataService.deleteCommCenter(id, statusId).then((res) => {
            successToastr(msg);
            this.getCommCenter(this.state.dataState);
        })
    };

    actionOnMessage = (id, statusId, msg) => {
        this.setState({ showPublishModal: false, showArchiveModal: false, showDeactivateModal: false });
        var data = {
            statusId: statusId
        }
        MessageCenterDataService.patchMessage(id, data).then((res) => {
            successToastr(msg);
            this.getCommCenter(this.state.dataState);
        })
    }

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getCommCenter(changeEvent.data);
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
                        <div className="col-10 fonFifteen paddingLeftandRight">
                            <BreadCrumbs></BreadCrumbs>
                            </div>
                            <div className="col-2">
                            {Auth.hasPermissionV2(AppPermissions.MSG_CREATE) && (
                                <Link to={CREATE_COMMUNICATION_CENTER}>
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                        Add New Message
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageCommunicationCenter"
                        entityType={"ManageCommunicationCenter"}
                        placeholder="Search text here!"
                        handleSearch={this.getCommCenter}
                        onFirstLoad={this.state.onFirstLoad}
                    />
                    <div className="manageUserContainer global-action-grid">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: pageSizes }}
                            data={this.state.message}
                            {...this.state.dataState}
                            detail={ViewMoreComponent}
                            expandField="expanded"
                            total={this.state.totalCount}
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                            <GridColumn
                                field="title"
                                title="Topic"
                                cell={(props) => CellRender(props, "Topic")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="msgPrio"
                                title="Priority"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Priority")}
                                filter="text"
                            />
                            <GridColumn
                                field="msgCat"
                                title="Category"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Category")}
                                filter="text"
                            />
                            <GridColumn
                                field="startDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Start Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => <td contextMenu="Start Date" className="text-left">
                                    {props.dataItem.startDate && dateFormatter(props.dataItem.startDate)} {props.dataItem.startDate && convertShiftDateTime(props.dataItem.startDate)}
                                </td>}
                            />
                            <GridColumn
                                field="endDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="End Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => <td contextMenu="End Date" className="text-left">
                                    {props.dataItem.endDate && dateFormatter(props.dataItem.endDate)} {props.dataItem.endDate && convertShiftDateTime(props.dataItem.endDate)}
                                </td>}
                            />
                            <GridColumn
                                field="createdDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Created Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => <td contextMenu="Created Date" className="text-left">
                                    {props.dataItem.createdDate && dateFormatter(props.dataItem.createdDate)} {props.dataItem.createdDate && convertShiftDateTime(props.dataItem.createdDate)}
                                </td>}
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
                                headerCell={() => CustomMenu(this.state.totalMessage)}
                            />
                            <GridColumn sortable={false} field="expanded" width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>
                <ConfirmationModal
                    message={DELETE_MESSAGE_CONFIRMATION_MSG()}
                    showModal={this.state.showDeleteModal}
                    handleYes={() => this.deleteCommunicationCenter(this.dataItem.msgId, 2, MSG_DELETE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showDeleteModal: false });
                    }}
                />

                {/* <ConfirmationModal
                    message={ACTIVE_MESSAGE_CONFIRMATION_MSG()}
                    showModal={this.state.showActivateModal}
                    handleYes={() => this.deleteCommunicationCenter(this.dataItem.msgId, 1, MESSAGE_ACTIVE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showActivateModal: false });
                    }}
                /> */}

                <ConfirmationModal
                    message={PUBLISH_MESSAGE_CONFIRMATION_MSG()}
                    showModal={this.state.showPublishModal}
                    handleYes={() => this.actionOnMessage(this.dataItem.msgId, 1, MESSAGE_PUBLISH_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showPublishModal: false });
                    }}
                />

                <ConfirmationModal
                    message={ARCHIVE_MESSAGE_CONFIRMATION_MSG()}
                    showModal={this.state.showArchiveModal}
                    handleYes={() => this.actionOnMessage(this.dataItem.msgId, 2, MESSAGE_ARCHIVED_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showArchiveModal: false });
                    }}
                />

                {/* <ConfirmationModal
                    message={DEACTIVATE_MESSAGE_CONFIRMATION_MSG()}
                    showModal={this.state.showDeactivateModal}
                    handleYes={() => this.deleteCommunicationCenter(this.dataItem.msgId,0, MESSAGE_DEATCIVATE_SUCCESS_MSG)}
                    handleNo={() => {
                        this.setState({ showDeactivateModal: false });
                    }}
                /> */}

            </div>
        )

    }


}
export default MessageCenter;