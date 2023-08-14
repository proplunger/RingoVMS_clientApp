import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { CompositeFilterDescriptor, State, toODataString } from "@progress/kendo-data-query";
import ReactExport from "react-data-export";
import { amountFormatter, currencyFormatter, dateFormatter, initialDataState, updateFilteredArray } from "../../../HelperMethods";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { errorToastr, successToastr } from "../../../HelperMethods";

import { CustomHeaderActionCell, ReqNumberCell, CustomActionCell, ApprovalGridCheckCell, CheckAllCells } from "./CustomCells";
import {
    APPROVE_ORDER_CONFIRM_MSG,
    REJECT_ORDER_CONFIRM_MSG,
    HOLD_ORDER_CONFIRM_MSG,
    PENDING_APPROVAL_STATUS,
    HOLD_APPROVAL_STATUS,
    APPROVE_ORDER_CONFIRM_MSG_MULTIPLE,
    REJECT_ORDER_CONFIRM_MSG_MULTIPLE,
    HOLD_ORDER_CONFIRM_MSG_MULTIPLE,
    APPROVE_ORDER_ACTION,
    REJECT_ORDER_ACTION,
    HOLD_ORDER_ACTION,
    APPROVE_ORDER_SUCCESS_MSG,
    REJECT_ORDER_SUCCESS_MSG,
    HOLD_ORDER_SUCCESS_MSG,
    HOLD_ORDER_SUCCESS_MSG_M,
    REJECT_ORDER_SUCCESS_MSG_M,
    APPROVE_ORDER_SUCCESS_MSG_M,
    REMOVE_HOLD_ORDER_ACTION,
    REMOVE_HOLD_ORDER_SUCCESS_MSG,
    REMOVE_HOLD_ORDER_CONFIRM_MSG,
    REMOVE_HOLD_ORDER_SUCCESS_MSG_M,
    REMOVE_HOLD_ORDER_CONFIRM_MSG_MULTIPLE,
} from "../../Shared/AppMessages";
import { DetailColumnCell, ViewMoreComponent } from "../ManageRequisitions/GlobalActions";
import { convertShiftDateTime, KendoFilter, kendoLoadingPanel, NumberCell } from "../../ReusableComponents";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export interface PendingRequisitionsProps { }

export interface PendingRequisitionsState {
    search: string;
    data: any;
    dataState: any;
    clientId: string;
    globalConfirmMsg?: string;
    globalActionType?: number;
    openGlobalConfirm?: boolean;
    enableHoldBtn?: boolean;
    IsAllChecked?: boolean;
    approverComments?: string;
    approverCommentError?: boolean;
    holdConfirmMsg?: string;
    enableOffHoldBtn?: boolean;
    openApproveConfirm?: boolean;
    openRejectConfirm?: boolean;
    openHoldConfirm?: boolean;
    isDataLoaded?: boolean;
    totalCount?: number;
    totalPendingReq?: number;
    onFirstLoad: boolean;
    showLoader?: boolean;
}

class PendingRequisitions extends React.Component<PendingRequisitionsProps, PendingRequisitionsState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public reqId: string;
    public CustomHeaderActionCellTemplate: any;
    private currentReqId;
    private currentOrderStatus: any;

    constructor(props: PendingRequisitionsProps) {
        super(props);
        this.state = {
            search: "",
            data: [],
            dataState: initialDataState,
            clientId: auth.getClient(),
            enableHoldBtn: true,
            enableOffHoldBtn: false,
            globalConfirmMsg: APPROVE_ORDER_CONFIRM_MSG_MULTIPLE,
            openApproveConfirm: false,
            openHoldConfirm: false,
            openRejectConfirm: false,
            isDataLoaded: true,
            onFirstLoad: true,
            showLoader: true,
        };
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
            ExportMenu: this.ExportExcel,
            EnableHold: this.state.enableHoldBtn,
            GlobalActionClick: this.handleGlobalActionClick.bind(this),
            IsOrderSelected: this.state.data.filter((o) => o.isChecked==true).length > 0,
            EnableOffHold: this.state.enableOffHoldBtn,
        });
    }

    getPendingRequisitions = (dataState) => {
        this.setState({ onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        const queryParams = `clientId eq ${this.state.clientId}`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/requisitions/approvals?${finalQueryString}`).then((res) => {
            this.setState({
                dataState: dataState,
                data: res.data,
                showLoader: false,
            });
            this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
                ExportMenu: this.ExportExcel,
                EnableHold: false,
                GlobalActionClick: this.handleGlobalActionClick.bind(this),
                IsOrderSelected: false,
                EnableOffHold: false,
            });
                        this.getPendingReqCount(dataState);
        });
    };

    openModal = (prop, reqId) => {
        let change = {};
        change[prop] = true;
        this.setState(change);
        this.reqId = reqId;
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    handleGlobalActionClick(actionValue: number) {
        var confirmMsg = this.state.globalConfirmMsg;
        switch (actionValue) {
            case 1:
                confirmMsg = APPROVE_ORDER_CONFIRM_MSG_MULTIPLE;
                break;
            case 2:
                confirmMsg = REJECT_ORDER_CONFIRM_MSG_MULTIPLE;
                break;
            case 3:
                confirmMsg = HOLD_ORDER_CONFIRM_MSG_MULTIPLE;
                break;
            case 4:
                confirmMsg = REMOVE_HOLD_ORDER_CONFIRM_MSG_MULTIPLE;
                break;
        }

        this.setState({
            globalConfirmMsg: confirmMsg,
            globalActionType: actionValue,
            openGlobalConfirm: true,
        });
    }

    openConfirmBox = (dataItem: any, propertyToUpdate) => {
        this.currentReqId = dataItem.reqId;
        this.currentOrderStatus = dataItem.status;
        var stateObj = this.state;
        var holdMsg = this.state.holdConfirmMsg;
        if (dataItem.status==HOLD_APPROVAL_STATUS) {
            holdMsg = REMOVE_HOLD_ORDER_CONFIRM_MSG;
        } else {
            holdMsg = HOLD_ORDER_CONFIRM_MSG;
        }
        stateObj[propertyToUpdate] = true;
        //this.setState(stateObj);
        this.setState({
            ...stateObj,
            holdConfirmMsg: holdMsg,
        });
    };

    handleCheckOrder = (dataItem) => {
        var checkAllStatus = this.state.IsAllChecked;
        var slicedOrders = this.state.data.slice();
        var targetOrderIndex = slicedOrders.findIndex((o) => o.reqId==dataItem.reqId);
        if (targetOrderIndex !=-1) {
            slicedOrders[targetOrderIndex].isChecked = !slicedOrders[targetOrderIndex].isChecked;
            var checkItems = slicedOrders.filter((c) => c.isChecked==true);
            var uncheckedItems = slicedOrders.filter((c) => c.isChecked==false);
            if (checkItems.length==slicedOrders.length || uncheckedItems.length==slicedOrders.length) {
                checkAllStatus = slicedOrders[targetOrderIndex].isChecked;
            } else {
                checkAllStatus = false;
            }

            var checkHoldStatus = this.shouldHoldBtnEnable(slicedOrders);
            var enableHoldOff = this.shouldOffHoldBtnEnable(slicedOrders);

            this.setState({
                data: slicedOrders,
                IsAllChecked: checkAllStatus,
                enableHoldBtn: checkHoldStatus,
                enableOffHoldBtn: enableHoldOff,
            });
        }

        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
            ExportMenu: this.ExportExcel,
            EnableHold: checkHoldStatus,
            GlobalActionClick: this.handleGlobalActionClick.bind(this),
            IsOrderSelected: slicedOrders.filter((o) => o.isChecked==true).length > 0,
            EnableOffHold: enableHoldOff,
        });
    };

    handleCheckAll = (isChecked) => {
        var orderList = this.state.data.slice();
        orderList.forEach((element) => {
            element.isChecked = isChecked;
        });

        var enableHold = this.shouldHoldBtnEnable(orderList);
        var enableHoldOff = this.shouldOffHoldBtnEnable(orderList);

        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
            ExportMenu: this.ExportExcel,
            EnableHold: enableHold,
            GlobalActionClick: this.handleGlobalActionClick.bind(this),
            IsOrderSelected: orderList.filter((o) => o.isChecked==true).length > 0,
            EnableOffHold: enableHoldOff,
        });

        this.setState({
            data: orderList,
            IsAllChecked: isChecked,
            enableHoldBtn: enableHold,
            enableOffHoldBtn: enableHoldOff,
        });
    };

    commentsChange = (e) => this.setState({ approverComments: e.target.value, approverCommentError: e.target.value.replace(/ +/g, "")=="" });

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.getPendingRequisitions(changeEvent.data);
    };

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0">
                <div className="container-fluid mt-2 d-md-block d-none mb-3">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight"><BreadCrumbs></BreadCrumbs></div>
                    </div>
                </div>
                <div className="container-fluid">
                    {/* <AdvanceSearch search={this.state.search} /> */}
                    <CompleteSearch
                        entityType="Requisition"
                        page="PendingRequisitions"
                        onFirstLoad={this.state.onFirstLoad}
                        handleSearch={this.getPendingRequisitions}
                    />
                    <div className="myOrderContainer gridshadow global-action-grid global-action-grid-pending table_responsive-TABcandidates">
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
                            className="kendo-grid-custom"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                            <GridColumn
                                width="40px"
                                cell={(props) => ApprovalGridCheckCell(props, this.handleCheckOrder)}
                                title="Check"
                                field="isChecked"
                                headerCell={(props) =>
                                    CheckAllCells({
                                        CheckOrder: this.handleCheckAll.bind(this),
                                        IsAllChecked: this.state.IsAllChecked,
                                    })
                                }
                            ></GridColumn>
                            <GridColumn field="reqNumber" width="130px" title="Req#" cell={ReqNumberCell} columnMenu={ColumnMenu} />
                            <GridColumn
                                field="division"

                                title="Division"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Division")}
                            />
                            <GridColumn
                                field="location"

                                title="Location"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Location")}
                            />
                            <GridColumn
                                field="position"

                                title="Position"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Position")}
                            />
                            <GridColumn
                                field="reason"

                                title="Reason"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Reason")}
                            />
                            <GridColumn field="status" width="200px" title="Status" columnMenu={ColumnMenu} cell={StatusCell} />
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
                                field="filledRate"
                                headerClassName="text-right pr-4"
                                title="Filled Rate"
                                columnMenu={ColumnMenu}
                                cell={(props) => NumberCell(props, "Filled Rate", true)}
                            />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                headerClassName="tab-action"
                                width="50px"
                                cell={CustomActionCell({
                                    openConfirmBox: this.openConfirmBox,
                                })}
                                headerCell={this.CustomHeaderActionCellTemplate}
                            />
                            <GridColumn sortable={false} filterable={false} field="expanded" width="80px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>
                <ConfirmationModal
                    message={APPROVE_ORDER_CONFIRM_MSG}
                    showModal={this.state.openApproveConfirm}
                    handleYes={() => this.updateSingleOrder(1)}
                    enterComments
                    commentsChange={this.commentsChange}
                    comments={this.state.approverComments}
                    handleNo={() => {
                        this.setState({ openApproveConfirm: false, approverComments: "" });
                    }}
                />

                <ConfirmationModal
                    message={REJECT_ORDER_CONFIRM_MSG}
                    showModal={this.state.openRejectConfirm}
                    showError={this.state.approverCommentError}
                    handleYes={() => this.updateSingleOrder(2)}
                    enterComments
                    commentsRequired
                    commentsChange={this.commentsChange}
                    comments={this.state.approverComments}
                    handleNo={() => {
                        this.setState({ openRejectConfirm: false, approverComments: "", approverCommentError: false });
                    }}
                />

                <ConfirmationModal
                    message={this.state.holdConfirmMsg}
                    showModal={this.state.openHoldConfirm}
                    showError={this.state.approverCommentError}
                    enterComments
                    commentsRequired
                    commentsChange={this.commentsChange}
                    comments={this.state.approverComments}
                    handleYes={() => this.updateSingleOrder(3)}
                    handleNo={() => {
                        this.setState({ openHoldConfirm: false, approverComments: "", approverCommentError: false });
                    }}
                />

                <ConfirmationModal
                    message={this.state.globalConfirmMsg}
                    showModal={this.state.openGlobalConfirm}
                    enterComments
                    showError={this.state.approverCommentError}
                    commentsChange={this.commentsChange}
                    comments={this.state.approverComments}
                    commentsRequired={this.state.globalActionType !=1}
                    handleYes={() => this.updateOrderAction(this.state.globalActionType)}
                    handleNo={() => {
                        this.setState({ openGlobalConfirm: false, approverComments: "" });
                    }}
                />
            </div>
        );
    }

    updateSingleOrder(actionLevel) {
        if (actionLevel !=1 && (this.state.approverComments=="" || !this.state.approverComments)) {
            this.setState({
                approverCommentError: true,
            });
        } else {
            this.setState({
                isDataLoaded: false,
                openApproveConfirm: false,
                openRejectConfirm: false,
                openHoldConfirm: false,
                approverCommentError: false,
            });

            var orderAction = APPROVE_ORDER_ACTION;
            var successMsg = APPROVE_ORDER_SUCCESS_MSG;

            switch (actionLevel) {
                case 1:
                    orderAction = APPROVE_ORDER_ACTION;
                    successMsg = APPROVE_ORDER_SUCCESS_MSG;
                    break;
                case 2:
                    orderAction = REJECT_ORDER_ACTION;
                    successMsg = REJECT_ORDER_SUCCESS_MSG;
                    break;
                case 3:
                    orderAction = this.currentOrderStatus==HOLD_APPROVAL_STATUS ? REMOVE_HOLD_ORDER_ACTION : HOLD_ORDER_ACTION;
                    successMsg = this.currentOrderStatus==HOLD_APPROVAL_STATUS ? REMOVE_HOLD_ORDER_SUCCESS_MSG : HOLD_ORDER_SUCCESS_MSG;
                    break;
            }

            var ordersData = [
                {
                    reqId: this.currentReqId,
                    ActionStatus: orderAction,
                },
            ];

            var finalData = {
                requisitions: ordersData,
                Comment: this.state.approverComments,
            };

            axios.put("/api/requisitions/status", finalData).then((response) => {
                this.setState({
                    isDataLoaded: true,
                    approverComments: "",
                });

                var responseData = response.data;

                if (responseData.filter((c) => !c.isUpdated).length > 0) {
                    var errorArray = [];
                    responseData
                        .filter((c) => !c.isUpdated)
                        .forEach((element) => {
                            var orderList = this.state.data.filter((o) => o.reqId==element.reqId);
                            if (orderList.length > 0) {
                                var orderObj = orderList[0];
                                errorArray.push("The requisition " + orderObj.ordernumber + " is no longer in your queue.");
                            }
                        });

                    successMsg = errorArray.join(", ");
                    errorToastr(successMsg);
                } else {
                    successToastr(successMsg);
                }
                this.getPendingRequisitions(this.state.dataState);
            });
        }
    }

    updateOrderAction(actionLevel: number) {
        if (actionLevel !=1 && (this.state.approverComments=="" || !this.state.approverComments)) {
            this.setState({
                approverCommentError: true,
            });
        } else {
            this.setState({
                isDataLoaded: false,
                openGlobalConfirm: false,
                approverCommentError: false,
            });

            var orderAction = APPROVE_ORDER_ACTION;
            var successMsg = APPROVE_ORDER_SUCCESS_MSG_M;

            switch (actionLevel) {
                case 1:
                    orderAction = APPROVE_ORDER_ACTION;
                    successMsg = APPROVE_ORDER_SUCCESS_MSG_M;
                    break;
                case 2:
                    orderAction = REJECT_ORDER_ACTION;
                    successMsg = REJECT_ORDER_SUCCESS_MSG_M;
                    break;
                case 3:
                    orderAction = HOLD_ORDER_ACTION;
                    successMsg = HOLD_ORDER_SUCCESS_MSG_M;
                    break;
                case 4:
                    orderAction = REMOVE_HOLD_ORDER_ACTION;
                    successMsg = REMOVE_HOLD_ORDER_SUCCESS_MSG_M;
                    break;
            }

            var ordersData = this.getOrdersUpdateObject(orderAction);

            var finalData = {
                requisitions: ordersData,
                Comment: this.state.approverComments,
            };

            axios.put("/api/requisitions/status", finalData).then((response) => {
                this.setState({
                    isDataLoaded: true,
                    approverComments: "",
                });

                var responseData = response.data;

                if (responseData.filter((c) => !c.isUpdated).length > 0) {
                    var errorArray = [];
                    responseData
                        .filter((c) => !c.isUpdated)
                        .forEach((element) => {
                            var orderList = this.state.data.filter((o) => o.reqId==element.reqId);
                            if (orderList.length > 0) {
                                var orderObj = orderList[0];
                                errorArray.push("The requisition " + orderObj.reqNumber + " is no longer in your queue.");
                            }
                        });

                    successMsg = errorArray.join(", ");
                    errorToastr(successMsg);
                } else {
                    successToastr(successMsg);
                }

                this.getPendingRequisitions(this.state.dataState);
            });
        }
    }

    getOrdersUpdateObject(status: string) {
        var selectedOrders = this.state.data.filter((c) => c.isChecked);
        var ordersArray: any[] = [];
        selectedOrders.forEach((element) => {
            ordersArray.push({
                reqId: element.reqId,
                ActionStatus: status,
            });
        });

        return ordersArray;
    }

    private shouldHoldBtnEnable(orderList): boolean {
        var enableHold: boolean = true;
        var selectedHoldOrders = orderList.filter((o) => o.isChecked && o.status.indexOf("Hold") > -1);
        if (selectedHoldOrders.length > 0) {
            enableHold = false;
        }
        return enableHold;
    }

    private shouldOffHoldBtnEnable(orderList): boolean {
        var enableHoldOff: boolean = false;

        var selectedOrders = orderList.filter((o) => o.isChecked);
        var selectedHoldOrders = selectedOrders.filter((o) => o.status.indexOf("Hold") > -1);

        if (selectedHoldOrders.length==selectedOrders.length) {
            enableHoldOff = true;
        }
        return enableHoldOff;
    }

    ExportExcel = () => (
        <ExcelFile
            element={
                <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                    <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
                </div>
            }
            filename="My Pending Approvals"
        >
            <ExcelSheet data={this.state.totalPendingReq} name="My Pending Approvals">
                <ExcelColumn label="Req Number" value="reqNumber" />
                <ExcelColumn label="Client" value="client" />
                <ExcelColumn label="Division" value="division" />
                <ExcelColumn label="Location" value="location" />
                <ExcelColumn label="Reason" value="reason" />
                <ExcelColumn label="Status" value="status" />
                <ExcelColumn label="Created Date" value={(col) => dateFormatter(new Date(col.createdDate))} />
                <ExcelColumn label="Position" value="position" />
                <ExcelColumn label="Reason" value="reason" />
                <ExcelColumn label="Job Workflow" value="jobWf" />
                <ExcelColumn label="Job Category" value="jobCategory" />
                <ExcelColumn label="Hiring Manager" value="hiringManager" />
                <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
                <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
                <ExcelColumn label="Shift Start Time" value={(col) => convertShiftDateTime(col.shiftStartTime)} />
                <ExcelColumn label="Shift End Time" value={(col) => convertShiftDateTime(col.shiftEndTime)} />
                <ExcelColumn label="Bill Rate ($)" value={(col) => amountFormatter(col.billRate)} />
                <ExcelColumn label="Budget ($)" value={(col) => amountFormatter(col.budget)} />
                <ExcelColumn label="Created By" value="creator" />
                <ExcelColumn label="Position Description" value="positionDesc" />
            </ExcelSheet>
        </ExcelFile>
    );

    // To be removed
    getPendingReqCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        const queryParams = `clientId eq ${this.state.clientId}`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/requisitions/approvals?${finalQueryString}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalPendingReq: res.data,
            });
        });
    };
}
export default PendingRequisitions;
