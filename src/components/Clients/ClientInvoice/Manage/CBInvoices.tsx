import * as React from "react";
import auth from "../../../Auth";
import {
  Grid,
  GridColumn as Column,
  GridColumn,
  GridNoRecords,
} from "@progress/kendo-react-grid";
import {
  CellRender,
  GridNoRecord,
} from "../../../Shared/GridComponents/CommonComponents";
import { CIAccountingExportExcel, CIDetailExportExcel, CISummaryExportExcel, clientInvoiceStatusCell, excelExport, TsDetailExportExcel } from './GlobalActions'
import ColumnMenu from "../../../Shared/GridComponents/ColumnMenu";
import { AggregateDescriptor, GroupDescriptor, State, toODataString, process } from "@progress/kendo-data-query";
import {
  ClientInvoiceNumberCell,
  CustomMenu,
  DefaultActions,
  DetailColumnCell,
  ViewMoreComponent,
} from "./GlobalActions";
import {
  getClientsInvoicesService,
  patchClientsInvoicesService,
  postClientPaymentData,
  postClientsInvoicesService,
  resetCBI,
  getCIAccountingReport,
  getCISummaryReport,
  getTsDetailReport,
  postVendorRemittance
} from "../CBIServices/CBIServices";
import {
  initialDataState,
  CandidateWorkflow,
  CIAccountingReport,
  isRoleType,
  AuthRoleType,
  CIDetailReport,
  CISummaryReport,
  TimesheetDetailReport,
} from "../../../Shared/AppConstants";
import RowActions from "../../../Shared/Workflow/RowActions";
import PageTitle from "../../../Shared/Title";
import CompleteSearch from "../../../Shared/Search/CompleteSearch";
import {
  convertShiftDateTime,
  hideLoader,
  KendoFilter, NumberCell, showLoader
} from "../../../ReusableComponents";
import { successToastr, currencyFormatter, padLeadingZeros, dateFormatter, infoToastr, datetimeFormatter } from "../../../../HelperMethods";
import { Dialog } from "@progress/kendo-react-dialogs";
import NameClearConfirmationModal from "../../../Shared/NameClearConfirmationModal";
import PaymentHistory from './PaymentHistory'
import {
  CLIENT_CBI_RESET_SUCCESS_MSG,
  CLIENT_INVOICE_AUTHORIZE_CONFIRMATION_MSG, CLIENT_INVOICE_AUTHORIZE_SUCCESS_MSG,
  CLIENT_INVOICE_MAKE_PAYMENT_CONFIRMATION_MSG, CLIENT_INVOICE_MAKE_PAYMENT_SUCCESS_MSG,
  CLIENT_RUN_CBI_CONFIRMATION_MSG, RESET_CBI_MSG, VENDOR_INVOICE_MAKE_GLOBAL_REMITTANCE_CONFIRMATION_MSG, VENDOR_INVOICE_MAKE_REMITTANCE_CONFIRMATION_MSG, VENDOR_INVOICE_MAKE_REMITTANCE_SUCCESS_MSG
} from "../../../Shared/AppMessages";
import IconConfimationModal from "../../../Shared/IconConfimationModal";
import ConfirmationMessageModal from "../../../Shared/MessageOverlay";
import moment from "moment";
import { ExcelExport, ExcelExportColumn, ExcelExportGroupHeaderProps } from '@progress/kendo-react-excel-export';
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import MarkRemittance from "../../../Vendor/Invoice/MarkRemittance/MarkRemittance";

export interface ManageCBInvoicesProps { match?: any }

export interface ManageCBInvoicesState {
  data?: any;
  onFirstLoad: boolean;
  totalCount?: number;
  showLoader?: boolean;
  dataState?: any;
  showRejectModal?: boolean;
  showUnderAuditReviewModal?: boolean;
  showAuthorizeModal?: boolean;
  showReceivePaymentModal?: boolean;
  showActivityHistoryModal?: boolean;
  clientId?: any;
  showRunCBIModal?: boolean;
  showPaymentHistoryModal?: boolean;
  showSuccessfulInfoModal?: boolean;
  makePaymentConfirmationModal?: boolean;
  paymentData?: any;
  showResetCBIModal?: any;
  cbiGenMessages?: any
  totalInvoiceData?: any;
  ciAccountingData?: any;
  tsDetailData?: any;
  ciSummaryData?: any;
  showRemitPaymentModal?: any;
  showRemittanceHistoryModal?: any;
  confirmationRemitPaymentModal?: any;
}

const aggregates: AggregateDescriptor[] = [{ field: 'adjustmentAmount', aggregate: 'sum' }];

const group: GroupDescriptor[] = [{
  field: 'vendor',
  aggregates: aggregates
}];

class ManageCBInvoices extends React.Component<
  ManageCBInvoicesProps,
  ManageCBInvoicesState
> {
  public clientInvoiceId: string;
  public dataItem: any;
  public historyItem: any;
  private userClientLobId: any = localStorage.getItem("UserClientLobId");
  private client: any = localStorage.getItem("UserClient");

  constructor(props: ManageCBInvoicesProps) {
    super(props);
    this.state = {
      data: [],
      totalInvoiceData: [],
      dataState: initialDataState(),
      onFirstLoad: true,
      showLoader: true,
      clientId: auth.getClient(),
      showRunCBIModal: false,
    };
  }

  action: string;
  statusId: string;
  eventName: string;
  actionId: string;

  getClientInvoices = (dataState) => {

    this.setState({ showLoader: true, onFirstLoad: false });
    var queryStr = `${toODataString(dataState, { utcDates: true })}`;

    var queryParams = this.clientInvoiceQuery();

    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

    getClientsInvoicesService(finalQueryString).then((res) => {
      this.setState({
        data: res.data,
        showLoader: false,
        dataState: dataState,
      });
      this.getClientInvoicesCount(dataState);
    });
  };

  getClientInvoicesCount = (dataState) => {
    var finalState: State = {
      ...dataState,
      take: null,
      skip: 0,
    };

    var queryStr = `${toODataString(finalState, { utcDates: true })}`;
    var queryParams = this.clientInvoiceQuery();

    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

    getClientsInvoicesService(finalQueryString).then((res) => {
      this.setState({
        totalCount: res.data.length,
        totalInvoiceData: res.data,
      });
    });
  };

  expandChange = (dataItem) => {
    dataItem.expanded = !dataItem.expanded;
    this.forceUpdate();
  };

  onDataStateChange = (changeEvent) => {
    this.setState({ dataState: changeEvent.data });
    this.getClientInvoices(changeEvent.data);
  };

  amountTotal = (props) => {
    let total =
      this.state.data !=undefined && this.state.data !=null && this.state.data.length > 0
        ? this.state.data.reduce((acc, current) => acc + current["amount"], 0)
        : 0;;
    const hourTotal =
      this.state.data !=undefined && this.state.data !=null && this.state.data.length > 0
        ? this.state.data.reduce((acc, current) => acc + current["hours"], 0)
        : 0;
    return (
      <td colSpan={4} style={props.style}>
        <div className="row mx-0 d-flex  align-items-center">
          Total Hours: <span className="tfoot ml-2" style={{ color: "#4987ec", fontSize: "16px", }}> {hourTotal}</span>
          <span className="ml-4"> Total Amount: </span>
          <span className="tfoot ml-2" style={{ color: "#4987ec", fontSize: "16px", }}>{currencyFormatter(total)}</span>

        </div>
      </td>
    );
  };

  makeRemittancePaymentSent = (successMsg, modal, props?) => {
    this.setState({ showLoader: true, data: [] });
  
    var data = {
      clientInvoiceId: this.clientInvoiceId,
      clientLobId: this.userClientLobId,
    }

    var postData = []
    for(var i=0; i < props.length ; i++){
      const vendorsList = {
        ...props[i]
      };
      postData.push(vendorsList)
    }
    data['vendorList'] = postData

    postVendorRemittance(data).then((res) => {
        successToastr(successMsg);
        // this.getVendorInvoices(this.state.dataState);
        this.getClientInvoices(this.state.dataState)
        this.setState({ showLoader: false });
      }, (err) => {
        this.getClientInvoices(this.state.dataState)
        this.setState({ showLoader: false });
    })
      
    let change = {};
    change[modal] = false;
    this.setState(change);
    this.setState({ confirmationRemitPaymentModal: false });
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
    this.clientInvoiceId = rowId;
    this.dataItem = dataItem;

    if (action==CIAccountingReport || action==CIDetailReport) {
      this.downloadCIAccounting(action);
    }
    
    if (action==TimesheetDetailReport) {
      this.downloadTsDetailReport();
    }

    if (action==CISummaryReport) {
      this.downloadCISummary();
    }
  };

  downloadCISummary() {
    showLoader();
    getCISummaryReport(this.clientInvoiceId).then(res => {
      var groupedData = process(res.data, {
        group: group
      }).data;
      this.setState({ ciSummaryData: groupedData });
      excelExport(this.dataItem.clientInvoiceNumber);
      hideLoader();
    });
  }

  downloadTsDetailReport() {
    showLoader();
    getTsDetailReport(this.clientInvoiceId).then(res => {
      this.setState({ tsDetailData: res.data });
      document.getElementById('tsDetailReportBtn').click();
      hideLoader();
    });
  }

  downloadCIAccounting(action) {
    showLoader();
    getCIAccountingReport(this.clientInvoiceId).then(res => {
      this.setState({ ciAccountingData: res.data });
      if (action==CIAccountingReport) {
        document.getElementById('ciAccountingBtn').click();
      } else {
        document.getElementById('ciDetailBtn').click();
      }
      hideLoader();
    });
  }

  clientInvoiceStatusUpdate = (successMsg, modal, props?) => {
    this.setState({ showLoader: true, data: [] });
    const data = {
      clientInvoiceId: this.clientInvoiceId,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      clientLobId: this.userClientLobId,
      ...props,
    };
    patchClientsInvoicesService(data).then((res) => {
      successToastr(successMsg);
      this.getClientInvoices(this.state.dataState);
      this.setState({ showLoader: false });
    }, err => {
      this.setState({ showLoader: false });
    });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  sendPayment = (successMsg, modal, props?) => {
    this.setState({ showLoader: true, data: [] });
    const data = {
      clientInvoiceId: this.clientInvoiceId,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      clientLobId: this.userClientLobId,
      amount: props.amount,
      payDate: props.date,
      comments: props.comments,
      ...props,
    };
    postClientPaymentData(data).then((res) => {
      successToastr(successMsg);
      this.getClientInvoices(this.state.dataState);
      this.setState({ showLoader: false });

    });

    let change = {};
    change[modal] = false;
    this.setState(change);
    this.setState({ showReceivePaymentModal: false })
  };

  handleRunCbi = () => {
    this.setState({ showRunCBIModal: true })
  }

  handleRunCbiConfirmation = () => {
    this.setState({ showLoader: true });
    const data = {
      clientId: this.state.clientId,
      clientLobId: this.userClientLobId,
    };

    postClientsInvoicesService(data).then((res) => {
      successToastr(res.data);
      this.getClientInvoices(this.state.dataState);
      this.setState({ showLoader: false, showRunCBIModal: false, showSuccessfulInfoModal: true, cbiGenMessages: res.data });
    });
  }

  resetCBI = (successMsg, modal, props?) => {
    this.setState({ showLoader: true, data: [] });
    const data = {
      clientInvoiceId: this.clientInvoiceId,
      clientLobId: this.userClientLobId,
      ...props,
    };
    resetCBI(data).then((res) => {
      successToastr(res.data.statusMessage);
      this.getClientInvoices(this.state.dataState);
      this.setState({ showLoader: false });

    });

    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  ExpandCell = (props) => (
    <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />
  );

  setDataItemHistory = (props) => {
    this.historyItem = props.dataItem;
    this.setState({ showRemittanceHistoryModal: true });
  }

  render() {
    return (
      <div className="col-11 mx-auto mt-3  mt-md-0 remove_padd_invoice">
        {isRoleType(AuthRoleType.SystemAdmin) && this.state.ciAccountingData && CIAccountingExportExcel(this.state.ciAccountingData, this.dataItem.clientInvoiceNumber, true)}
        {(isRoleType(AuthRoleType.SystemAdmin) || isRoleType(AuthRoleType.Client)) && this.state.ciAccountingData && CIDetailExportExcel(this.state.ciAccountingData, this.dataItem.clientInvoiceNumber, true)}
        {auth.hasPermissionV2(AppPermissions.REPORT_TS_DETAIL) && this.state.tsDetailData && TsDetailExportExcel(this.state.tsDetailData, this.dataItem.clientInvoiceNumber, true)}
        
        {auth.hasPermissionV2(AppPermissions.REPORT_CI_SUMMARY) && this.state.ciSummaryData && CISummaryExportExcel(this.state.ciSummaryData, this.dataItem.clientInvoiceNumber)}
        <PageTitle title="Consolidated Billing Invoice" />
        <CompleteSearch
          page="ClientInvoicing"
          entityType="ClientInvoicing"
          handleSearch={this.getClientInvoices}
          onFirstLoad={this.state.onFirstLoad}
        />
        <div className="container-fluid pl-0 pr-0">
          <div className="vendorInvoiceContainer global-action-grid">
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
              <GridNoRecords>
                {GridNoRecord(this.state.showLoader)}
              </GridNoRecords>
              <GridColumn
                field="clientInvoiceNumber"
                title="Client Invoice Number"
                 width="180px"
                cell={ClientInvoiceNumberCell}
                columnMenu={ColumnMenu}
              />
              <GridColumn
                field="cbiReRunDate"
                filter="date"
                format="{0:d}"
                // width="140px"
                editor="date"
                title="Run Date"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  return (
                    <td contextMenu="Run Date">
                      {datetimeFormatter(props.dataItem.cbiReRunDate)}
                    </td>
                  )
                }}
              />
              <GridColumn
                field="hours"
                width="100px"
                title="Hours"
                headerClassName="text-right pr-4"
                cell={(props) =>
                  props.dataItem.hours != undefined &&
                    props.dataItem.hours != null &&
                    props.dataItem.hours > 0 ? (
                    <td
                      className="text-right pr-4"
                      contextMenu={"Hours"}
                    >
                      {Number(props.dataItem.hours).toFixed(2)}
                    </td>
                  ) : (
                    <td style={{ textAlign: "right" }}>{"-"}</td>
                  )
                }
                filter="numeric"
                columnMenu={ColumnMenu}
              />
              <GridColumn
                field="amount"
                title="Amount"
                // width="180px"
                filter="numeric"
                headerClassName="text-right pr-4"
                cell={(props) => {
                  return (
                    <td
                      contextMenu={"Amount"}
                      style={{ textAlign: "right" }}
                      title={props.dataItem.transFee}
                      className="pr-4"
                    >
                      {currencyFormatter(props.dataItem.amount)}
                    </td>
                  );
                }}
                columnMenu={ColumnMenu}
              />
              <GridColumn
                field="dueToRingoDate"
                filter="date"
                format="{0:d}"
                // width="140px"
                editor="date"
                title="Due To Ringo"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Due To Ringo")}
              />

              {auth.hasPermissionV2(AppPermissions.REMIT_TO_VENDOR) &&
                <GridColumn
                  field="remitToVendorDate"
                  filter="date"
                  format="{0:d}"
                  // width="140px"
                  editor="date"
                  title="Remit To Vendor"
                  columnMenu={ColumnMenu}
                  cell={(props) => CellRender(props, "Remit To Vendor")}
                />
              }
              <GridColumn
                field="status"
                width="200px"
                title="Status"
                columnMenu={ColumnMenu}
                cell={clientInvoiceStatusCell}
              />
              <GridColumn
                title="Action"
                width="30px"
                sortable={false}
                cell={(props) => (
                  <RowActions
                    wfCode={CandidateWorkflow.CLIENTINVOICE}
                    dataItem={props.dataItem}
                    currentState={props.dataItem.status}
                    rowId={props.dataItem.clientInvoiceId}
                    hideBtn={props.dataItem.balance==0? ["ReceivePayment"]: []}
                    handleClick={this.handleActionClick}
                    defaultActions={DefaultActions(props)}
                  />
                )}
                headerCell={() =>
                  CustomMenu(this.state.totalInvoiceData, this.handleRunCbi)
                }
              />
              <GridColumn
                sortable={false}
                field="expanded"
                width="100px"
                title="View More"
                cell={this.ExpandCell}
              />
            </Grid>
          </div>
        </div>
        {this.state.showPaymentHistoryModal && (
          <div id="payment-history">
            <Dialog className="col-12 For-all-responsive-height">
              <PaymentHistory
                title={"Payment History"}
                handleClose={() =>
                  this.setState({ showPaymentHistoryModal: false })
                }
                data={{
                  invoiceId: this.dataItem.clientInvoiceId,
                  invoiceNumber: this.dataItem.clientInvoiceNumber,
                  billingPeriod: `${dateFormatter(this.dataItem.cbiRunDate)} ${convertShiftDateTime(this.dataItem.cbiRunDate)}`,
                  amount: this.dataItem && this.dataItem.amount,
                  client: this.dataItem && this.dataItem.client
                }}
                dataApi={"client"}
              />
            </Dialog>
          </div>
        )}
        <NameClearConfirmationModal
          message={CLIENT_INVOICE_AUTHORIZE_CONFIRMATION_MSG(this.dataItem)}
          showModal={this.state.showAuthorizeModal}
          handleYes={() =>
            this.clientInvoiceStatusUpdate(
              CLIENT_INVOICE_AUTHORIZE_SUCCESS_MSG,
              "showAuthorizeModal"
            )
          }
          handleNo={() => {
            this.setState({ showAuthorizeModal: false });
          }}
          radioSelection={false}
        />

        <NameClearConfirmationModal
          message={CLIENT_RUN_CBI_CONFIRMATION_MSG(this.dataItem)}
          showModal={this.state.showRunCBIModal}
          handleYes={() => this.handleRunCbiConfirmation()}
          handleNo={() => {
            this.setState({ showRunCBIModal: false });
          }}
          radioSelection={false}
          title={"Run CBI Confirmation"}
        />

        {this.state.cbiGenMessages && this.state.showSuccessfulInfoModal && (
          <ConfirmationMessageModal
            message={this.state.cbiGenMessages.statusMessage}
            showModal={this.state.showSuccessfulInfoModal}
            handleClose={() =>
              this.setState({ showSuccessfulInfoModal: false })
            }
            title={
              this.state.cbiGenMessages.isSuccess
                ? "CBI Generated!"
                : "Warning!"
            }
          />
        )}

        {this.state.showReceivePaymentModal ? (
          <IconConfimationModal
            message={''}
            showModal={this.state.showReceivePaymentModal}
            handleYes={(props) =>
              this.setState({
                makePaymentConfirmationModal: true,
                paymentData: props,
              })
            }
            modalTitle={"Payment Confirmation"}
            handleNo={() => {
              this.setState({
                showReceivePaymentModal: false,
                makePaymentConfirmationModal: false,
              });
            }}
            fieldTitle={{ date: "Payment Date", amount: "Payment Received", totalAmount: "CBI Amount" }}
            isDisable={true}
            disableFields={{ date: false, amount: true }}
            data={{
              amount: this.dataItem && this.dataItem.amount,
              balance: this.dataItem && this.dataItem.balance ? this.dataItem.balance : this.dataItem.amount,
              date: new Date(),
            }}
            handlePaymentHistory={() => {
              this.setState({ showPaymentHistoryModal: true });
            }}
          />
        ) : null}
        {this.state.makePaymentConfirmationModal ? (
          <NameClearConfirmationModal
            message={CLIENT_INVOICE_MAKE_PAYMENT_CONFIRMATION_MSG(
              this.dataItem
            )}
            showModal={this.state.makePaymentConfirmationModal}
            handleYes={(props) =>
              this.sendPayment(
                CLIENT_INVOICE_MAKE_PAYMENT_SUCCESS_MSG,
                "makePaymentConfirmationModal",
                this.state.paymentData
              )
            }
            handleNo={() => {
              this.setState({ makePaymentConfirmationModal: false });
            }}
            radioSelection={false}
          />
        ) : null}

        {this.state.showRemitPaymentModal ? 
          <div id="payment-history">
            <Dialog className="col-12 For-all-responsive-height" style={{ "zIndex": 10000 }}>
              <MarkRemittance
                  handleClose={() => {
                    this.setState({showRemitPaymentModal: false})
                  }}
                  clientData={{
                    received: this.dataItem.received,
                    amount: this.dataItem.amount,
                    balance: this.dataItem.balance ? this.dataItem.balance: this.dataItem.amount,
                    clientInvoiceNumber: this.dataItem.clientInvoiceNumber,
                    cbiRunDate: datetimeFormatter(this.dataItem.cbiRunDate),
                    client: this.dataItem.client,
                    date: new Date(),
                  }}
                  handleYes={(props) =>
                    this.setState({
                      confirmationRemitPaymentModal: true,
                      paymentData: props,
                    })
                  }
                  clientInvoiceId={this.dataItem.clientInvoiceId}
                  clientId={this.state.clientId}
                  handleGlobalPaymentHistory={(props) =>
                    this.setDataItemHistory(props)
                  }
                  getVendorInvoicesGrid={() => this.getClientInvoices(this.state.dataState)}
              />
            </Dialog>
          </div>
        : null}

        {this.state.confirmationRemitPaymentModal ? (
          <NameClearConfirmationModal
            message={VENDOR_INVOICE_MAKE_GLOBAL_REMITTANCE_CONFIRMATION_MSG()}
            showModal={this.state.confirmationRemitPaymentModal}
            handleYes={(props) =>
              this.makeRemittancePaymentSent(
                VENDOR_INVOICE_MAKE_REMITTANCE_SUCCESS_MSG,
                "showRemitPaymentModal",
                this.state.paymentData
              )
            }
            handleNo={() => {
              this.setState({ confirmationRemitPaymentModal: false });
            }}
            radioSelection={false}
          />
        ) : null}

        {this.state.showRemittanceHistoryModal && (
          <div id="payment-history">
            <Dialog className="col-12 For-all-responsive-height">
              <PaymentHistory
                title={"Remittance History"}
                handleClose={() =>
                  this.setState({ showRemittanceHistoryModal: false })
                }
                data={{
                  invoiceId: this.historyItem.vendorInvoiceId,
                  invoiceNumber: this.historyItem.vendorInvoiceNumber,
                  clientInvoiceNumber: this.historyItem.clientInvoiceNumber,
                  billingPeriod: this.historyItem.billingPeriod,
                  amount: this.historyItem.amount,
                  client: this.client
                }}
                dataApi={"vendor"}
              />
            </Dialog>
          </div>
        )}

        {this.state.showResetCBIModal ? (
          <NameClearConfirmationModal
            message={RESET_CBI_MSG(this.dataItem)}
            showModal={this.state.showResetCBIModal}
            handleYes={(props) =>
              this.resetCBI(CLIENT_CBI_RESET_SUCCESS_MSG, "showResetCBIModal")
            }
            handleNo={() => {
              this.setState({ showResetCBIModal: false });
            }}
            radioSelection={false}
          />
        ) : null}
      </div>
    );
  }

  private clientInvoiceQuery(): string {
    // CLIENT
    var queryParams = `clientId eq ${this.state.clientId}`;
    return queryParams;
  }
}

export default ManageCBInvoices;