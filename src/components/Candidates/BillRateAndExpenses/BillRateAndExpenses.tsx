import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import {
    CellRender,
    GridNoRecord,
    StatusCell,
} from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import {
    State,
    toODataString,
    CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import {
    CustomHeaderActionCell,
    CustomCell,
    DetailColumnCell,
    ViewMoreComponent,
} from "./GlobalActions";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { currencyFormatter, initialDataState, successToastr, updateFilteredArray } from "../../../HelperMethods";
import {
    ErrorComponent,
    KendoFilter,
    NumberCell,
} from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import { Dialog } from "@progress/kendo-react-dialogs";
import AddBillRateAndExpenses from "./AddBillRateAndExpenses";
import {
    ADD_BILL_RATE_SUCCESS_MSG,
    BILLRATE_APPROVE_CONFIRMATION_MSG,
    BILLRATE_APPROVE_SUCCESS_MSG,
    BILLRATE_REJECTED_SUCCESS_MSG,
    BILLRATE_SENT_NEGOTIATION_SUCCESS_MSG,
    INFO_MSG_FOR_BILLRATES_DATE_UPDATE,
    NEGOTIATE_BILLRATE_CONFIRMATION_MSG,
    REJECT_BILLRATE_CONFIRMATION_MSG,
} from "../../Shared/AppMessages";
import RejectModal from "../../Shared/RejectModal";
import RowActions from "../../Shared/Workflow/RowActions";
import { DefaultActions } from "./WFCells";
import { AuthRole, BillRateStatus, ENABLE_PAY_RATE, isAssignmentInProgress, SettingCategory } from "../../Shared/AppConstants";
import { ServiceCategory } from "../../Shared/AppConstants";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { data } from "../../Admin/ClientAdmin/ClientSetting/data";
import AlertBox from "../../Shared/AlertBox";

export interface BillRateAndExpensesProps {
    candSubmissionId: string;
    candSubExtId?: string;
    candidateName: string;
    positionId?: string;
    locationId?: string;
    divisionId?: string;
    candidateSubStatus?: string;
    handleEnable?: any;
    handleDisable?: any;
    canAddBillRate?: boolean;
    candidateSubStatusIntId?: number;
    AssignmentStartDate?: any;
    AssignmentEndDate?: any;
    handleAlert?: any;
}

export interface BillRateAndExpensesState {
    data: any;
    clientId: string;
    showDeleteModal?: boolean;
    showLoader?: boolean;
    selectedIds: any;
    selectedItems: any;
    showAddBillDialog?: boolean;
    dataItem?: any;
    dataState: any;
    showRejectModal?: boolean;
    showApproveModal?: boolean;
    showNegotiateModal?: boolean;
    showViewModal?: boolean;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    ifForApproveSelected?: boolean;
    ifAllSelected?: boolean;
    // ifForRejectSelected?: boolean;
    // ifForNegotiateSelected?: boolean;
    changing?: boolean;
    showError?: boolean;
    totalCount?: number;
    isPayRateEnabled?: boolean;
    showAlert: boolean;
}

class BillRateAndExpenses extends React.Component<
    BillRateAndExpensesProps,
    BillRateAndExpensesState
> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public billRateId: string;
    public CustomHeaderActionCellTemplate: any;
    public dataItem: any;
    constructor(props: BillRateAndExpensesProps) {
        super(props);
        this.state = {
            data: [],
            selectedIds: [],
            selectedItems: [],
            clientId: auth.getClient(),
            showAddBillDialog: false,
            dataState: initialDataState,
            ifForApproveSelected: false,
            ifAllSelected: false,
            // ifForRejectSelected: false,
            // ifForNegotiateSelected: false,
            showLoader: true,
            isPayRateEnabled: false,
            showAlert: false
        };
        this.initializeActionCell();
    }
    action: string;
    actionId: string;
    statusId: string;
    eventName: string;
    subBillRateId: string;
    componentDidMount() {
        this.getBillRates(this.state.dataState);
        this.getClientSetting(this.state.clientId);
    }

    initializeActionCell = () => {
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
            AddBillClick: this.openNew,
            status: this.props.candidateSubStatus,
            hideAddBillRate: !auth.hasPermissionV2(AppPermissions.CAND_SUB_BILL_RATE_CREATE),
            statusIntId: this.props.candidateSubStatusIntId,
            Approve: () => {
                this.setState({ showApproveModal: true });
                this.dataItem = null;
              },
            // Reject: () => {
            //     this.setState({ showRejectModal: true });
            //     this.wfState = BillRateStatus.REJECTED;
            //     this.dataItem = null;
            //   },
            // Negotiate: () => {
            //     this.setState({ showNegotiateModal: true });
            //     this.wfState = BillRateStatus.RELEASED;
            //     this.dataItem = null;
            //   },
            isApproveSelected: this.state.ifForApproveSelected,
            // isRejectSelected: this.state.ifForRejectSelected,
            // isNegotiateSelected: this.state.ifForNegotiateSelected,
        });
    }

    getBillRates = (dataState) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var queryParams = `candSubId eq ${this.props.candSubmissionId} and candSubExtId eq null`;

        if (this.props.candSubExtId) {
            queryParams = `candSubId eq ${this.props.candSubmissionId} and candSubExtId eq ${this.props.candSubExtId}`;
        }

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        this.setState({ showLoader: true });
        axios.get(`api/candidates/billrate?${finalQueryString}`).then((res) => {
            console.log("res.data", res.data);
            this.setState({
                data: res.data,
                showLoader: false,
                dataState: dataState,
                changing: false,
            });
            this.getBillRatesCount(dataState);
            if (this.dataItem) {
                this.dataItem.inProgress = false;
            }
            // if (
            //     res.data.filter((x) => x.status=="Pending Approval").length > 0 ||
            //     res.data.filter((x) => x.status=="Pending Negotiation").length > 0
            // ) {
            //     this.props.handleDisable();}
            else {
                this.props.handleEnable();
            }
        });
    };

    getClientSetting = (id) => {
        this.setState({ showLoader: true })
        axios.get(`api/admin/client/${id}/settings`).then(res => {
          const settings = res.data.filter(
            (i) => i.name ==SettingCategory.TIMESHEET
          )[0];
          if(settings && settings.settings){
          const result = settings.settings.filter(
            (i) => i.settingCode ==ENABLE_PAY_RATE
          );
          if (result.length > 0) {
            this.setState({ isPayRateEnabled: result[0].value=='true'? true: false });
          }
        }
        })
    };

    getBillRatesCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };

        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        var queryParams = `candSubId eq ${this.props.candSubmissionId} and candSubExtId eq null`;

        if (this.props.candSubExtId) {
            queryParams = `candSubId eq ${this.props.candSubmissionId} and candSubExtId eq ${this.props.candSubExtId}`;
        }

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/candidates/billrate?${finalQueryString}`).then((res) => {
            this.setState({
                totalCount: res.data.length
            });
        });
    };

    // show error if no Time Service Category Bill is added
    validateBillRatesData = () => {
        let isTimeSC = this.state.data.some(x => x.serviceCategory==ServiceCategory.TIME);
        this.setState({ showError: !isTimeSC });
        return !isTimeSC;
    };

    deleteBillRate = () => {
        this.setState({ showDeleteModal: false, showRemoveModal: false });
        axios
            .delete(`/api/candidates/billrate/${this.subBillRateId}`)
            .then((res) => {
                if (res.data && res.data.responseCode=="CSU"){
                    this.setState({showAlert: true});
                  }
                successToastr("Bill Rate deleted successfully");
                this.getBillRates(this.state.dataState);
            });
    };

    openModal = (prop, dataItem) => {
        this.billRateId = dataItem.subBillRateId;
        this.setState({ showDeleteModal: true });
    };
    close = () => {
        this.setState({
            showAddBillDialog: false,
            showViewModal: false,
            showEditModal: false,
        });
        this.dataItem = undefined;
    };

    openNew = () => {
        this.dataItem = undefined;
        this.setState({ showAddBillDialog: true });
    };

    onSaveAndNew = () => {
        this.close();
        setTimeout(() => {
            this.openNew();
        }, 50);
        this.getBillRates(this.state.dataState);
    };

    onSaveAndClose = (responseCode?) => {
        this.close();
        if(responseCode && this.props.handleAlert){
            this.props.handleAlert(responseCode);
        }
        this.getBillRates(this.state.dataState);
    };

    // openEdit = (dataItem) => {
    //     this.dataItem = dataItem;
    //     this.setState({showAddBillDialog:true})
    // };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        dataItem.isPayRateEnabled = this.state.isPayRateEnabled;
        this.forceUpdate();
    };
    onDataStateChange = (changeEvent) => {
        this.getBillRates(changeEvent.data);
    };

    billRateStatusUpdate = (successMsg, modal, props?) => {
        if(this.dataItem){
            this.dataItem.inProgress = true;
        }
        this.setState({ showLoader: true, changing: true });
        const data = {
            //candSubmissionIds: this.state.selectedIds,
            subBillRateId: this.dataItem ? [this.subBillRateId] : this.state.selectedIds,
            statusId: this.statusId,
            eventName: this.eventName,
            actionId: this.actionId,
            multipleApproveSelected: this.dataItem ? false : true,
            updateConfirmLetter: true,
            ...props,
        };
        axios
            .put("api/candidates/billrate/status", JSON.stringify(data))
            .then((res) => {
                successToastr(successMsg);
                //this.getCandidateWFs(this.state.dataState);
                this.setState({ showLoader: false , ifAllSelected: false});
                this.getBillRates(this.state.dataState);
            });
        // close the modal
        let change = {};
        change[modal] = false;
        this.setState(change);
    };
    handleActionClick = (
        action,
        actionId,
        rowId,
        nextStateId?,
        eventName?,
        dataItem?
    ) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.action = action;
        this.actionId = actionId;
        this.statusId = nextStateId;
        this.eventName = eventName;
        this.subBillRateId = rowId;
        this.dataItem = dataItem;
        this.state.selectedIds.push(dataItem.subBillRateId);
    };

    selectionChange = (event) => {
        var checked = event.syntheticEvent.target.checked;
        let ids = this.state.selectedIds;
        let selectedItems = this.state.selectedItems;
        const data = this.state.data.map((item) => {
          if (
            item.subBillRateId ==event.dataItem.subBillRateId
          ) {
            item.selected = !event.dataItem.selected;
            if (checked==true) {
              ids.push(item.subBillRateId);
            } else if (checked==false) {
              ids = ids.filter((o) => o !=item.subBillRateId);
            }
          }
    
          return item;
        });
        this.setState(
          { data, selectedIds: ids, selectedItems: selectedItems },
          () => this.shouldSendBtnEnable(this.state.data)
        );
        if(this.state.data.length==this.state.data.filter(x=> x.selected).length){
            this.setState({ ifAllSelected: true });
        }else{
            this.setState({ ifAllSelected: false });
        }
    };

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        let ids = [];
        let selectedItems = [];
        const data = this.state.data.map((item) => {
          if (checked==true) {
            ids.push(item.subBillRateId);
            selectedItems = [...selectedItems];
          }
          item.selected = checked;
          return item;
        });
        this.setState(
          { data, selectedIds: ids, selectedItems: selectedItems, ifAllSelected: !this.state.ifAllSelected },
          () => this.shouldSendBtnEnable(this.state.data)
        );
    };

    getSelectedItems = (open) => {
        // used as Ref in onboarding (Parent Component)
        return {
            selectedItems: this.state.selectedItems,
            selectedIds: this.state.selectedIds,
          };
    };

    ExpandCell = (props) => (
        <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />
    );

    render() {
        this.initializeActionCell();
        return (
            <div className="row mt-3 mt-md-0">
                <div className="container-fluid">
                    <div className="cand-bill-rate" id="cand-bill-rate-responsive">
                        <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.data}
                            {...this.state.dataState}
                            total={this.state.totalCount}
                            detail={ViewMoreComponent}
                            expandField="expanded"
                            className="kendo-grid-custom lastchild"
                            selectedField="selected"
                            onSelectionChange={this.selectionChange}
                            onHeaderSelectionChange={this.headerSelectionChange}
                        >
                            <GridNoRecords>
                                {GridNoRecord(this.state.showLoader)}
                            </GridNoRecords>
                            <GridColumn
                                field="selected"
                                width="50px"
                                headerSelectionValue={this.state.ifAllSelected}
                            />
                            <GridColumn
                                field="serviceCategory"
                                title="Service Category"
                                cell={(props) => CellRender(props, "Service Category")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="serviceType"
                                width="120px"
                                title="Service Type"
                                cell={(props) => CellRender(props, "Service Type")}
                                columnMenu={ColumnMenu}
                            />
                            <GridColumn
                                field="billType"
                                width="100px"
                                title="Bill Type"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Bill Type")}
                            />
                            <GridColumn
                                field="gridBillRate"
                                width="80px"
                                title="Bill Rate"
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    return (
                                        <td contextMenu="Bill Rate"
                                            className="pr-4 text-right"
                                            title={props.dataItem.gridBillRate}
                                        >
                                            {currencyFormatter(props.dataItem.gridBillRate)}
                                        </td>
                                    );
                                }}
                            />
                            {/* <GridColumn
                                field="overrideBillRate"
                                title="Override Rate"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Override Rate", true)}
                            /> */}
                            <GridColumn
                                field="gridHolidayBillRate"
                                // width="105px"
                                title="Holiday Rate"
                                headerClassName="text-right pr-4"
                                columnMenu={ColumnMenu}
                                cell={(props) => {
                                    return (
                                        <td contextMenu="Holiday Rate"
                                            className="pr-4 text-right"
                                            title={props.dataItem.gridHolidayBillRate}
                                        >
                                            {currencyFormatter(props.dataItem.gridHolidayBillRate)}
                                        </td>
                                    );
                                }}
                            />
                            {/* <GridColumn
                                field="overrideHolidayBillRate"
                                width="170px"
                                title="Override Holiday Rate"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Override Holiday Rate", true)}
                            />  */}
                            {isAssignmentInProgress(this.props.candidateSubStatusIntId) &&
                                <GridColumn
                                    field="startDate"
                                    filter="date"
                                    format="{0:d}"
                                    editor="date"
                                    title="Valid From"
                                    columnMenu={ColumnMenu}
                                    cell={(props) => CellRender(props, "Valid From")}
                                />
                            }
                            {isAssignmentInProgress(this.props.candidateSubStatusIntId) &&
                                <GridColumn
                                    field="endDate"
                                    filter="date"
                                    format="{0:d}"
                                    editor="date"
                                    title="Valid To"
                                    columnMenu={ColumnMenu}
                                    cell={(props) => CellRender(props, "Valid To")}
                                />
                            }
                            <GridColumn
                                field="status"
                                width="170px"
                                title="Status"
                                columnMenu={ColumnMenu}
                                cell={StatusCell}
                            />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="30px"
                                cell={(props) => (
                                    <RowActions
                                        wfCode="WF_BILL_RATE"
                                        dataItem={props.dataItem}
                                        currentState={props.dataItem.status}
                                        rowId={props.dataItem.subBillRateId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(
                                            props,
                                            this.props.candidateSubStatus,
                                            this.props.candidateSubStatusIntId
                                        )}
                                    />
                                )}
                                //cell={CustomCell({ openDeleteConfirm: this.openModal, openEdit:this.openEdit, openNew:this.openNew  })}
                                headerCell={this.CustomHeaderActionCellTemplate}
                            />
                            <GridColumn
                                sortable={false}
                                field="expanded"
                                title="View More"
                                cell={this.ExpandCell}
                            />
                        </Grid>
                        {this.state.showError && this.state.data.length==0 && (
                            <ErrorComponent message={`Please add bill rate of any ${ServiceCategory.TIME} service Category before submitting.`} />
                        )}
                    </div>
                </div>
                <ConfirmationModal
                    message={"Are you sure you want to remove this bill rate?"}
                    showModal={this.state.showRemoveModal}
                    handleYes={this.deleteBillRate}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                {(this.state.showAddBillDialog ||
                    this.state.showViewModal ||
                    this.state.showEditModal) && (
                        <div id="hold-position">
                            <Dialog className="col-12 For-all-responsive-height">
                                <AddBillRateAndExpenses
                                    candSubStatus={this.props.candidateSubStatus}
                                    candidateSubStatusIntId={this.props.candidateSubStatusIntId}
                                    dataItem={this.dataItem}
                                    candSubmissionId={this.props.candSubmissionId}
                                    onCloseModal={this.close}
                                    onSaveAndNew={this.onSaveAndNew}
                                    onSaveAndClose={this.onSaveAndClose}
                                    candidateName={this.props.candidateName}
                                    positionId={this.props.positionId}
                                    locationId={this.props.locationId}
                                    divisionId={this.props.divisionId}
                                    billRates={this.state.data}
                                    AssignmentEndDate={this.props.AssignmentEndDate}
                                    AssignmentStartDate={this.props.AssignmentStartDate}
                                    isPayRateEnabled={this.state.isPayRateEnabled}
                                    candSubExtId={this.props.candSubExtId}
                                ></AddBillRateAndExpenses>
                            </Dialog>
                        </div>
                    )}
                {this.state.showRejectModal && this.actionId && (
                    <RejectModal
                        action="Reject"
                        actionId={this.actionId}
                        message={REJECT_BILLRATE_CONFIRMATION_MSG(null)}
                        showModal={this.state.showRejectModal}
                        handleYes={(data) =>
                            this.billRateStatusUpdate(
                                BILLRATE_REJECTED_SUCCESS_MSG,
                                "showRejectModal",
                                data
                            )
                        }
                        handleNo={() => {
                            this.setState({ showRejectModal: false });
                        }}
                    />
                )}
                {this.state.showNegotiateModal && this.actionId && (
                    <RejectModal
                        action="Negotiate"
                        actionId={this.actionId}
                        message={NEGOTIATE_BILLRATE_CONFIRMATION_MSG(null)}
                        showModal={this.state.showNegotiateModal}
                        handleYes={(data) =>
                            this.billRateStatusUpdate(
                                BILLRATE_SENT_NEGOTIATION_SUCCESS_MSG,
                                "showNegotiateModal",
                                data
                            )
                        }
                        handleNo={() => {
                            this.setState({ showNegotiateModal: false });
                        }}
                    />
                )}
                <ConfirmationModal
                    message={BILLRATE_APPROVE_CONFIRMATION_MSG}
                    showModal={this.state.showApproveModal}
                    handleYes={(e) =>
                        this.billRateStatusUpdate(
                            BILLRATE_APPROVE_SUCCESS_MSG,
                            "showApproveModal"
                        )
                    }
                    handleNo={() => {
                        this.setState({ showApproveModal: false });
                    }}
                />
                
                <AlertBox
                    handleNo={() => this.setState({ showAlert: false })}
                    message={INFO_MSG_FOR_BILLRATES_DATE_UPDATE()}
                    showModal={this.state.showAlert}
                >
                </AlertBox>
            </div>
        );
    }

    private shouldSendBtnEnable(billRate) {
        this.setState({
          ifForApproveSelected: false,
        //   ifForRejectSelected: false,
        //   ifForNegotiateSelected: false,
        });

        var selectedBillRates = billRate.filter((o) => o.selected);

        var selectedFor = selectedBillRates.filter(
            (o) => o.status ==BillRateStatus.PENDINGAPPROVAL
        );

        if (selectedBillRates.length > 0 && selectedFor.length > 0) {
            if (selectedFor.length ==selectedBillRates.length) {
              this.setState({ ifForApproveSelected: true
                //  ifForRejectSelected: true,
                //  ifForNegotiateSelected: true 
                });
            }
        }
      }
}
export default BillRateAndExpenses;
