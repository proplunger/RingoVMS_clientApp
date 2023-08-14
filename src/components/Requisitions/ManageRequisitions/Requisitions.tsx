import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { CellRender, GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString, CompositeFilterDescriptor } from "@progress/kendo-data-query";
import { CustomMenu, DetailColumnCell, ViewMoreComponent, ReqNumberCell, DefaultActions } from "./GlobalActions";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { clientSettingData, initialDataState, successToastr, updateFilteredArray } from "../../../HelperMethods";
import { KendoFilter, kendoLoadingPanel, NumberCell } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import "./Requisition.css";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import { Dialog } from "@progress/kendo-react-dialogs";
import HoldPosition from "./HoldPosition/HoldPositon";
import ReqHistory from "../RequisitionHistory/ReqHistory";
import RowActions from "../../Shared/Workflow/RowActions";
import Skeleton from "react-loading-skeleton";
import { VIEW_VENDOR_INVOICE } from "../../Shared/ApiUrls";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import PatchRequisition from '../PatchRequisition/PatchRequisition'
import {  ReqStatus } from "../../Shared/AppConstants";
import { CANCEL_ACTION, CANCEL_ORDER_SUCCESS_MSG,CANCEL_MSG, HOLD_ORDER_ACTION, HOLD_ORDER_CONFIRM_MSG, HOLD_ORDER_SUCCESS_MSG, REMOVE_HOLD_ORDER_ACTION, REMOVE_HOLD_ORDER_CONFIRM_MSG, REMOVE_HOLD_ORDER_SUCCESS_MSG, CLOSE_REQ_SUCCESS_MSG, CLOSE_REQ_WITH_NOTE_MSG } from "../../Shared/AppMessages";
import NameClearConfirmationModal from "../../Shared/NameClearConfirmationModal";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface RequisitionsProps { }

export interface RequisitionsState {
    searchString: string;
    data: any;
    clientId: string;
    dataState: any;
    showRemoveModal?: boolean;
    showCopyModal?: boolean;
    showHoldModal?: boolean;
    showCancelModal?: boolean;
    showCloseModal?: boolean;
    showRemoveHoldModal?: boolean;
    showLoader?: boolean;
    totalCount?: number;
    totalReq?: any;
    showHoldPositionModal?: any;
    showReqHistoryModal?: any;
    onFirstLoad: boolean;
    showEditReqModal?: boolean;
    vendorId?: string;
    comment?: string;
    isEnableDepartment: boolean;
}

class Requisitions extends React.Component<RequisitionsProps, RequisitionsState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public reqId: string;
    public dataItem: any;
    public openModal: any;
    constructor(props: RequisitionsProps) {
        super(props);
        this.state = {
            searchString: "",
            data: [],
            dataState: initialDataState,
            clientId: auth.getClient(),
            vendorId: auth.getVendor(),
            onFirstLoad: true,
            showLoader: true,
            isEnableDepartment: false
        };
    }

    // getRequisitions = (dataState) => {
    //     debugger 
    //     this.setState({ showLoader: true, onFirstLoad: false });
    //     var queryStr = `${toODataString(dataState, { utcDates: true })}`;
    //     let filterProps = this.getFilter();
    //     const url = filterProps[0];
    //     var finalQueryString = KendoFilter(dataState, queryStr, filterProps[1]);        

    //     axios.get(`${url}?${finalQueryString}`).then((res) => {
    //         this.setState({
    //             data: res.data,
    //             showLoader: false,
    //             dataState: dataState,
    //         });
    //         this.getRequisitionsCount(dataState);
    //     });
    // };

    getRequisitions = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        let filterProps = this.getFilter();
        const url = filterProps[0];
        var finalQueryString = KendoFilter(dataState, queryStr, filterProps[1]);

        var config = {
            headers: {
                'Content-Type': 'text/plain'
            },
        };
        
        axios.post(`${url}`, (finalQueryString), config).then((res) => {
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
            }, () => this.getClientSetting(this.state.clientId));
            this.getRequisitionsCount(dataState);
        });
    };

    getClientSetting = (id) => {
        this.setState({ showLoader: true })
        clientSettingData(id, (response) => {
            this.setState({ isEnableDepartment: response });
        });
    };

    deleteRequisition = () => {
        this.setState({ showRemoveModal: false });
        axios.delete(`/api/requisitions/${this.reqId}`).then((res) => {
            successToastr("Selected requisition deleted successfully");
            this.getRequisitions(this.state.dataState);
        });
    };

    duplicateRequisition = () => {
        this.setState({ showCopyModal: false });
        const data = {
            reqId: this.reqId,
        };
        axios.post(`/api/requisitions/duplicate`, JSON.stringify(data)).then((res) => {
            successToastr("A copy of the selected requisition has been created successfully");
            this.getRequisitions(this.state.dataState);
        });
    };

    updateReqStatus = (status, message, comment) => {
        this.setState({ showHoldModal: false, showRemoveHoldModal: false, showCancelModal: false });
        const data = {
            requisitions: [{
                reqId: this.dataItem.reqId,
                actionStatus: status,
                reqStatus: this.dataItem.status
            }],
            comment: comment,
            ignoreUserAssigned: true
        };
        axios.put("/api/requisitions/status", data).then((res) => {
            successToastr(message);
            this.getRequisitions(this.state.dataState);
        });
    }

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        dataItem['isEnableDepartment'] = this.state.isEnableDepartment;
        this.forceUpdate();
    };

    onDataStateChange = (changeEvent) => {
        this.getRequisitions(changeEvent.data);
        localStorage.setItem("MyRequisitions-GridDataState", JSON.stringify(changeEvent.data));
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    advancedSearchStates = () => {
        let states = {
            division: "",
            originalDivision: [],
            location: "",
        };
        return states;
    };

    // dynamic action click
    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
        this.reqId = dataItem.reqId;
    };

    handleChange = (e) => {
        let change = {};
        change[e.target.name] = e.target.value;
        this.setState(change);
    };

    closeReq = (message, comment) => {
        this.setState({ showCloseModal: false });
        const data = {
            reqId: this.dataItem.reqId,
            comment: comment
        };
        axios.put(`api/requisitions/${this.dataItem.reqId}/close`, data).then((res) => {
            successToastr(message);
            this.getRequisitions(this.state.dataState);
        });
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
                            {auth.hasPermissionV2(AppPermissions.REQ_CREATE) && (
                                <Link to="/requisitions/create">
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-2 text-dark"} />
                                        Add New Requisition
                                    </span>
                                </Link>
                            )}
                            </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        placeholder="Search text here!"
                        handleSearch={this.getRequisitions}
                        entityType={"Requisition"}
                        onFirstLoad={this.state.onFirstLoad}
                        page="MyRequisitions"
                        persistSearchData={true}
                        enableDepartment={this.state.isEnableDepartment}
                    /> 
                    <div className="myOrderContainer global-action-grid table_responsive-TABcandidates frozen-column">
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
                            <GridColumn field="reqNumber" width="140px" title="Req#" cell={ReqNumberCell} columnMenu={ColumnMenu} />
                            <GridColumn
                                field="division"
                                width={150}
                                title="Division"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Division")}
                                filter="text"
                            />
                            <GridColumn
                                field="location"
                                width={150}
                                title="Location"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Location")}
                            />
                            <GridColumn
                                field="position"
                                width={150}
                                title="Position"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Position")}
                            />
                            <GridColumn
                                field="startDate"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                width="100px"
                                title="Start Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Start Date")}
                            />
                            <GridColumn
                                field="endDate"
                                filter="date"
                                width="100px"
                                format="{0:d}"
                                editor="date"
                                title="End Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "End Date")}
                            />
                            <GridColumn
                                field="totalRequired"
                                title="Required"
                                filter="numeric"
                                width="100px"
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => NumberCell(props, "Required")}
                            />
                            {this.state.vendorId &&
                                <GridColumn
                                    field="submitted"
                                    title="Submitted"
                                    filter="numeric"
                                    columnMenu={ColumnMenu}
                                    cell={(props) => NumberCell(props, "Submitted")}
                                />
                            }
                            {!this.state.vendorId &&
                                <GridColumn
                                    field="filledRate"
                                    width="100px"
                                    title="Filled Rate"
                                    headerClassName="text-right pr-4"
                                    filter="text"
                                    columnMenu={ColumnMenu}
                                    cell={(props) => NumberCell(props, "Filled Rate", true)}
                                />
                            }
                            <GridColumn
                                field="region"
                                width={100}
                                title="Region"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Region")}
                            />
                            <GridColumn
                                field="state"
                                width={100}
                                title="State"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "State")}
                            />
                            <GridColumn
                                field="city"
                                width={100}
                                title="City"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "City")}
                            />
                            <GridColumn field="status" locked
                            width="220px" 
                            title="Status" columnMenu={ColumnMenu} cell={StatusCell} />
                            <GridColumn
                                locked
                                title="Action"
                                sortable={false}                                
                                headerClassName="tab-action"
                                width="30px"
                                cell={(props) => (
                                    <RowActions
                                        props={props}
                                        wfCode="WF_CAND"
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.reqId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.totalReq, this.state.isEnableDepartment)}
                            />
                            <GridColumn locked sortable={false} width="80px" field="expanded" title="View More" cell={this.ExpandCell} />
                        </Grid>
                    </div>
                </div>
                <ConfirmationModal
                    message={"Are you sure you want to remove this requisition?"}
                    showModal={this.state.showRemoveModal}
                    handleYes={this.deleteRequisition}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />
                <ConfirmationModal
                    message={"Are you sure you want to create a copy of this requisition?"}
                    showModal={this.state.showCopyModal}
                    handleYes={this.duplicateRequisition}
                    handleNo={() => {
                        this.setState({ showCopyModal: false });
                    }}
                />
                {this.state.showHoldModal &&
                    <NameClearConfirmationModal
                        message={HOLD_ORDER_CONFIRM_MSG}
                        showModal={this.state.showHoldModal}
                        handleYes={(data) => this.updateReqStatus(HOLD_ORDER_ACTION, HOLD_ORDER_SUCCESS_MSG, data.comments)}
                        handleNo={() => {
                            this.setState({ showHoldModal: false });
                        }}
                        radioSelection={false}
                        enterComments={true}
                        commentsRequired={true}
                        hideIcon={true}
                    />
                }
                {this.state.showRemoveHoldModal &&
                    <NameClearConfirmationModal
                        message={REMOVE_HOLD_ORDER_CONFIRM_MSG}
                        showModal={this.state.showRemoveHoldModal}
                        handleYes={(data) => this.updateReqStatus(REMOVE_HOLD_ORDER_ACTION, REMOVE_HOLD_ORDER_SUCCESS_MSG, data.comments)}
                        handleNo={() => {
                            this.setState({ showRemoveHoldModal: false });
                        }}
                        radioSelection={false}
                        enterComments={true}
                        commentsRequired={true}
                        hideIcon={true}
                    />
                }
                {this.state.showCancelModal &&
                    <NameClearConfirmationModal
                        message={CANCEL_MSG}
                        showModal={this.state.showCancelModal}
                        handleYes={(data) => this.updateReqStatus(CANCEL_ACTION, CANCEL_ORDER_SUCCESS_MSG, data.comments)}
                        handleNo={() => {
                            this.setState({ showCancelModal: false });
                        }}
                        radioSelection={false}
                        enterComments={true}
                        commentsRequired={true}
                        hideIcon={true}
                    />
                }
                {this.state.showCloseModal &&
                    <NameClearConfirmationModal
                        message={CLOSE_REQ_WITH_NOTE_MSG()}
                        showModal={this.state.showCloseModal}
                        handleYes={(data) => this.closeReq(CLOSE_REQ_SUCCESS_MSG, data.comments)}
                        handleNo={() => {
                            this.setState({ showCloseModal: false });
                        }}
                        radioSelection={false}
                        enterComments={true}
                        commentsRequired={true}
                        hideIcon={true}
                    />
                }
                {this.state.showHoldPositionModal && (
                    <div id="hold-position">
                        <Dialog className="col-12 For-all-responsive-height">
                            <HoldPosition
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showHoldPositionModal: false }, () => this.getRequisitions(this.state.dataState))}
                            />
                        </Dialog>
                    </div>
                )}
                {this.state.showReqHistoryModal && (
                    <div id="hold-position">
                        <Dialog className="col-12 width-requisitions-manager For-all-responsive-height">
                            <ReqHistory
                                entityId={this.dataItem.reqId}
                                dataItem={this.dataItem}
                                title={"Requisition History - " + this.dataItem.reqNumber}
                                handleClose={() => this.setState({ showReqHistoryModal: false })}
                                statusLevel={1}
                                candidateName={"Cand Name"}
                            />
                        </Dialog>
                    </div>
                )}

                {this.state.showEditReqModal && (
                    <div id="hold-position">
                        <Dialog className="col-12 For-all-responsive-height">
                            <PatchRequisition
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showEditReqModal: false }, () => this.getRequisitions(this.state.dataState))}
                            />
                        </Dialog>
                    </div>
                )}
            </div>
        );
    }

    getRequisitionsCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        let filterProps = this.getFilter();
        const url = filterProps[0];
        var finalQueryString = KendoFilter(dataState, queryStr, filterProps[1]);

        // axios.get(`${url}?${finalQueryString}`).then((res) => {
        //     this.setState({
        //         totalCount: res.data.length,
        //         totalReq: res.data,
        //     });
        // });

        var config = {
            headers: {
                'Content-Type': 'text/plain'
            },
        };

        axios.post(`${url}`, (finalQueryString), config).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalReq: res.data,
            });
        });
    };

    getFilter() {
        let queryParams = `clientId eq ${this.state.clientId}`;
        //let apiUrl = "api/requisitions";
        let apiUrl = "api/requisitions/$query";
        if (this.state.vendorId) {
            //apiUrl = 'api/requisitions/candidatesubmissions';
            apiUrl = 'api/requisitions/candidatesubmissions/$query';
            queryParams = `${queryParams} and vendorUserId eq ${this.state.vendorId}
             and (status eq '${ReqStatus.RELEASED}' or status eq '${ReqStatus.CANDIDATEUNDERREVIEW}'
             or status eq '${ReqStatus.FILLED}' or status eq '${ReqStatus.ONHOLD}')`;
        }
        return [apiUrl, queryParams];
    }
}
export default Requisitions;
