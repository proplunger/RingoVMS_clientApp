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
  VendorInvoiceStatus,
  VendorInvoiceStatusCellClient,
} from "../../../Shared/GridComponents/CommonComponents";
import ColumnMenu from "../../../Shared/GridComponents/ColumnMenu";
import { AggregateDescriptor, GroupDescriptor, State, toODataString, process } from "@progress/kendo-data-query";
import {
  CustomMenu,
  DefaultActions,
  VendorInvoiceNumberCell,
} from "./GlobalActions";
import {
  getClientInvoicesServiceByInvoiceId,
  getVendorInvoicesService,
  patchVendorInvoicesService,
} from "../../VendorService/Services";
import {
  getCIAccountingReport,
  getCISummaryReport,
  getTsDetailReport,
  patchClientsInvoicesService,
  resetCBI,
} from "../../../Clients/ClientInvoice/CBIServices/CBIServices";
import {
  initialDataState,
  CandidateWorkflow,
  EntityType,
  ClientInvoiceStatusIds,
  VendorInvoiceStatusIds,
  isRoleType,
  AuthRoleType,
} from "../../../Shared/AppConstants";
import {
  VENDOR_INVOICE_UNDER_AUDIT_REVIEW_CONFIRMATION_MSG,
  VENDOR_INVOICE_AUTHORIZE_CONFIRMATION_MSG,
  VENDOR_INVOICE_AUTHORIZE_SUCCESS_MSG,
  VENDOR_INVOICE_UNDER_AUDIT_REVIEW_SUCCESS_MSG,
  VENDOR_INVOICE_REJECT_CONFIRMATION_MSG,
  VENDOR_INVOICE_REJECTION_MSG,
  CLIENT_INVOICE_MAKEPAYMENT_CONFIRMATION_MSG,
  CLIENT_INVOICE_MAKE_PAYMENT_SUCCESS_MSG,
  CLIENT_INVOICE_MAKE_PAYMENT_CONFIRMATION_MSG,
  VENDOR_INVOICE_MAKE_REMITTANCE_CONFIRMATION_MSG,
  CLIENT_INVOICE_AUTHORIZE_CONFIRMATION_MSG,
  CLIENT_INVOICE_AUTHORIZE_SUCCESS_MSG,
  VENDOR_INVOICE_MAKE_REMITTANCE_SUCCESS_MSG,
  RESET_CBI_MSG,
  CLIENT_CBI_RESET_SUCCESS_MSG,
  VENDOR_INVOICE_RESET_CONFIRMATION_MSG,
  VENDOR_INVOICE_RESET_SUCCESS_MSG,
  VENDOR_INVOICE_UNDER_VENDOR_REVIEW_CONFIRMATION_MSG,
  VENDOR_INVOICE_UNDER_VENDOR_REVIEW_SUCCESS_MSG,
  VENDOR_INVOICE_CLOSE_VI_CONFIRMATION_MSG,
  VENDOR_INVOICE_CLOSE_VI_SUCCESS_MSG,
  VENDOR_INVOICE_RE_AUTHORIZE_CONFIRMATION_MSG,
  VENDOR_INVOICE_RE_AUTHORIZE_SUCCESS_MSG,
  VENDOR_INVOICE_MAKE_GLOBAL_REMITTANCE_CONFIRMATION_MSG,
  VI_UNDERREVIEW_CONFIRMATION_MSG,
  VENDOR_INVOICE_UNDER_REVIEW_SUCCESS_MSG,
} from "../../../Shared/AppMessages";
import RowActions from "../../../Shared/Workflow/RowActions";
import PageTitle from "../../../Shared/Title";
import CompleteSearch from "../../../Shared/Search/CompleteSearch";
import {
  hideLoader,
  KendoFilter,
  NumberCell,
  showLoader,
  TitleDetails,
} from "../../../ReusableComponents";
import NameClearConfirmationModal from "../../../Shared/NameClearConfirmationModal";
import RejectModal from "../../../Shared/RejectModal";
import {
  successToastr,
  currencyFormatter,
  history,
  errorToastr,
  padLeadingZeros,
  dateFormatter,
  infoToastr,
  datetimeFormatter,
} from "../../../../HelperMethods";
import { Dialog } from "@progress/kendo-react-dialogs";
import VendorActivityHistory from "../ActivityHistory/ActivityHistory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faLock, faLockOpen, faSearchDollar, faTimes, faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import CommentHistoryBox from "../../../Shared/Comment/CommentHistoryBox";

import { Comment } from "../../../Shared/Comment/Comment";
import FormActions from "../../../Shared/Workflow/FormActions";
import CloseLink from "../../../Shared/CloseLink";
import { MANAGE_CBI, MANAGE_VENDOR_INVOICES } from "../../../Shared/ApiUrls";
import MakePaymentForm from "../../Payment/MakePaymentForm";
import IconConfimationModal from "../../../Shared/IconConfimationModal";
import {
  postClientPaymentData,
  postVendorRemittance,
} from "../../../Clients/ClientInvoice/CBIServices/CBIServices";
import PaymentHistory from "../../../Clients/ClientInvoice/Manage/PaymentHistory";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import moment from "moment";
import { CISummaryExportExcel, ClientInvoiceNumberCell, excelExport } from "../../../Clients/ClientInvoice/Manage/GlobalActions";
import MarkRemittance from "../MarkRemittance/MarkRemittance";
import axios from "axios";
import ConfirmationModal from "../../../Shared/ConfirmationModal";

export interface ManageInvoicesProps {
  match?: any;
  location?: any;
}

export interface ManageInvoicesState {
  data: any;
  onFirstLoad: boolean;
  totalCount?: number;
  showLoader?: boolean;
  dataState: any;
  showRejectModal?: boolean;
  showUnderAuditReviewModal?: boolean;
  showUnderVendorReviewModal?: boolean;
  showCloseVIModal?: boolean;
  showVendorAuthorizeModal?: boolean;
  showVendorReauthorizeModal?: boolean;
  showClientAuthorizeModal?: boolean;
  showResetVendorInvoiceModal?: boolean;
  showAuthorizeModal?: boolean;
  showActivityHistoryModal?: boolean;
  showRemitPaymentGlobalModal?: boolean;
  clientId?: any;
  vendorId?: any;
  paymentAmount?: any;
  paymentDate?: any;
  status?: any;
  openCommentBox?: boolean;
  clientInvoiceRunDate?: any;
  clientInvoiceId?: any;
  clientInvoiceStatus?: any;
  clientInvoiceNumber?: any;
  clientStatusId?: any;
  approved?: any;
  notes?: any;
  makePaymentConfirmationModal?: any;
  showRemitPaymentModal?: any;
  paymentData?: any;
  markRemittanceConfirmationModal?: any;
  markRemittanceGlobalConfirmationModal?: any;
  totalPaymentAmount?: any;
  showReceivePaymentModal?: any;
  showRemittanceHistoryModal?: any;
  showClientPaymentHistoryModal?: any;
  showResetCBIModal?: any;
  clientStatusIntId?: any;
  totalInvoiceData?: any;
  ciAccountingData?: any;
  ciSummaryData?: any;
  tsDetailData?: any;
  totalBalance?: any;
  totalPaymentReceived?: any;
  client?: string;
  expenseLockdownDays?: any;
  approverComments?: any;
  approverCommentError?: any;
  showUnderReviewModal?: any;
  clientCbiRunDate?: any;
  result?: any;
}

const aggregates: AggregateDescriptor[] = [{ field: 'adjustmentAmount', aggregate: 'sum' }];

const group: GroupDescriptor[] = [{
  field: 'vendor',
  aggregates: aggregates
}];

class ManageInvoices extends React.Component<
  ManageInvoicesProps,
  ManageInvoicesState
> {
  public vendorInvoiceId: string;
  public dataItem: any;
  dataState;
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  private userClientLobId: any = localStorage.getItem("UserClientLobId");
  childRef: React.RefObject<MakePaymentForm> = React.createRef();
  data = [];
  aggregates = [
    { field: "amount", aggregate: "sum" },
    { field: "hours", aggregate: "sum" },
  ];
  constructor(props: ManageInvoicesProps) {
    super(props);
    this.dataState = {
      skip: 0,
      take: 10,
      group: [{ field: "billingPeriod", dir: "desc"}],
    };
    this.state = {
      data: [],
      dataState: this.dataState,
      onFirstLoad: true,
      showLoader: true,
      clientId: auth.getClient(),
      vendorId: auth.getVendor(),
      openCommentBox: false,
      client: localStorage.getItem("UserClient"),
      approverComments: "",
    };
  }

  action: string;
  statusId: string;
  eventName: string;
  actionId: string;

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id != undefined) {
      this.setState({ clientInvoiceId: id });
      this.getClientInvoicesService(id);
      this.downloadCIAccounting(id);
      this.downloadCISummary(id);
      this.downloadTsDetailReport(id);
    } else {
      this.setState({ clientInvoiceId: undefined });
    }
    this.createAppState(this.state.dataState);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.path != this.props.match.path) {
      this.setState({ clientInvoiceId: nextProps.match.params.id, ciAccountingData: nextProps.match.params.id ? this.state.ciAccountingData : null },
        () => (nextProps.match.params.id && this.getClientInvoicesService(nextProps.match.params.id), this.getVendorInvoices(this.state.dataState), nextProps.match.params.id && this.downloadCIAccounting(nextProps.match.params.id),
          nextProps.match.params.id && this.downloadCISummary(nextProps.match.params.id)));
    }
  }
  getClientInvoicesService = (id) => {
    getClientInvoicesServiceByInvoiceId(id).then((res) => {
      if (res.data) {
        console.log(res.data)
        res.data && this.setState({
            clientInvoiceStatus: res.data.status,
            clientInvoiceRunDate: dateFormatter(res.data.cbiRunDate),
            clientCbiRunDate: res.data.cbiRunDate,
            clientInvoiceNumber: res.data.clientInvoiceNumber,
            clientInvoiceId: res.data.clientInvoiceId,
            totalPaymentAmount: res.data.amount,
            clientStatusId: res.data.statusId,
            clientStatusIntId: res.data.statusIntId,
            totalPaymentReceived: res.data.received,
            totalBalance: res.data.balance,
            client: res.data.client
          })
        }else{
          history.push(MANAGE_CBI);
        }
    });
  }
  getVendorInvoices = (dataQuery?, dataState?) => {
    this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
    this.state.dataState.filter = dataQuery.filter;
    var queryStr = `${toODataString(dataQuery, { utcDates: true })}`;
    var queryParams = this.vendorInvoiceQuery();
    var finalQueryString = KendoFilter(dataQuery, queryStr, queryParams);
    getVendorInvoicesService(finalQueryString).then((res) => {
      this.data = res.data;
      let dataStateCopy = (this.state.onFirstLoad && dataState==undefined)
        ? this.dataState
        : (!this.state.onFirstLoad && dataState==undefined)
          ? {
            skip: 0,
            take: 10,
            group: this.state.dataState.group
          } :
          {
            skip: dataState.take==dataState.skip || dataState.take < dataState.skip ? 0 : dataState.skip,
            take: dataState.take,
            group: dataState.group
          };
      this.setState({
        data: res.data,
        result: process(res.data, dataStateCopy),
        showLoader: false,
      });
      this.getVendorInvoicesCount(dataQuery);
    });
  };

  getVendorInvoicesCount = (dataState) => {
    var finalState: State = {
      ...dataState,
      take: null,
      skip: 0,
    };

    var queryStr = `${toODataString(finalState, { utcDates: true })}`;
    var queryParams = this.vendorInvoiceQuery();
    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
    getVendorInvoicesService(finalQueryString).then((res) => {
      this.setState({
        totalCount: res.data.length,
        totalInvoiceData: res.data
      });
    });
  };

  downloadCIAccounting(ciId) {
    getCIAccountingReport(ciId).then(res => {
      this.setState({ ciAccountingData: res.data });
    });
  }

  downloadTsDetailReport(ciId) {
    getTsDetailReport(ciId).then(res => {
      this.setState({ tsDetailData: res.data });
    });
  }

  downloadCISummary(ciId) {
    getCISummaryReport(ciId).then(res => {
      var groupedData = process(res.data, {
        group: group
      }).data;
      this.setState({ ciSummaryData: groupedData });
    });
    }

  expandChange = (event) => {
    event.dataItem[event.target.props.expandField] = event.value;
    this.setState({
      dataState: this.state.dataState,
    });
  };

  onDataStateChange = (changeEvent) => {
    let dataState2;
    if (changeEvent.data.filter) {
      dataState2 = {
        filter: changeEvent.data.filter,
        skip: changeEvent.data.skip,
        take: changeEvent.data.take,
        group: changeEvent.data.group,
      };
    }
    if (changeEvent.data.sort) {
      dataState2 = {
        sort: changeEvent.data.sort,
        skip: changeEvent.data.skip,
        take: changeEvent.data.take,
        group: changeEvent.data.group,
      };
    }
    if (changeEvent.data.sort==undefined && changeEvent.data.filter==undefined) {
      dataState2 = {
        skip: changeEvent.data.skip,
        take: changeEvent.data.take,
        group: changeEvent.data.group,
      };
    }
    if (this.state.dataState.group.length==changeEvent.data.group.length) {
      return this.setState(
        {
          dataState: dataState2,
        },
        () => this.getVendorInvoices(this.state.dataState, dataState2)
      );
    } else {
      changeEvent.data.group.length <= 2 && changeEvent.data.group.length >= 0
        ? this.setState(this.createAppState(changeEvent.data))
        : errorToastr("Only two columns can be grouped at once!");
    }
  };

  createAppState(dataState) {
    const groups = dataState.group;
    if (groups) {
      groups.map((group) => (group.aggregates = this.aggregates));
    }
    let dataState2 = {
      skip: dataState.skip,
      take: dataState.take,
      group: dataState.group,
    };
    return {
      result: process(this.data, dataState2),
      dataState: dataState2,
    };
  }

  handleRowActionClick = (
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
    this.vendorInvoiceId = rowId;
    this.dataItem = dataItem;
  };

  handleGlobalClick = (
    action
  ) => {
    let change = {};
    let property = `show${action.replace(/ +/g, "")}Modal`;

    if (action=='Receive Payment') {
      axios.get(`api/workflow/transitions/${this.state.clientStatusId}`).then((res) => {
        this.statusId = res.data.nextStateId
        this.eventName = res.data.eventName
        this.actionId = res.data.actionId
      });
    }
    change[property] = true;
    this.setState(change);
  }

  commentsChange = (e) => this.setState({ approverComments: e.target.value, approverCommentError: e.target.value=="" });

  vendorInvoiceStatusUpdate = (successMsg?, modal?, props?, isUnderReview = false) => {
    if (this.state.showUnderReviewModal==true && !this.state.approverComments.replace(/^\s+|\s+$/g, "")) {
      this.setState({ approverCommentError: true });
      return;
    }
    this.setState({ showLoader: true, data: [] });
    const data = {
      vendorInvoiceId: this.vendorInvoiceId,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      clientLobId: this.userClientLobId,
      isUnderReview: isUnderReview,
      comments: this.state.approverComments,
      ...props,
    };
    patchVendorInvoicesService(data).then((res) => {
      if (res.data && !res.data.isSuccess && res.data.statusMessage=="Under Review") {
        this.getVendorInvoices(this.state.dataState);
        this.setState({ showUnderReviewModal: true, expenseLockdownDays: res.data.responseCode, showLoader: false });
      } else {
        successToastr(successMsg);
        this.getVendorInvoices(this.state.dataState);
        this.setState({ showLoader: false, showUnderReviewModal: false });
      }
    }, (err) => {
      this.getVendorInvoices(this.state.dataState);
      this.setState({ showLoader: false });
    });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  markRemittancePayment = (successMsg, modal, props?) => {
    this.setState({ showLoader: true, data: [] });

    var data = {
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      clientLobId: this.userClientLobId,
      amount: props.amount,
      payDate: props.date,
      comments: props.comments,
      ...props,
    };


    modal=="markRemittanceConfirmationModal"
      ? (data.vendorInvoiceId = this.vendorInvoiceId)
      : (data.clientInvoiceId = this.state.clientInvoiceId);

    modal=="markRemittanceConfirmationModal"
      ? postVendorRemittance(data).then((res) => {
        successToastr(successMsg);
        this.getVendorInvoices(this.state.dataState);
        this.setState({ showLoader: false });
      }, (err) => {
        this.setState({ showLoader: false });
      })
      : postClientPaymentData(data).then((res) => {
        successToastr(successMsg);
        history.push(MANAGE_CBI);
        this.setState({ showLoader: false });
      }, (err) => {
        this.setState({ showLoader: false });
      });
    let change = {};
    change[modal] = false;
    this.setState(change);
    this.setState({ showRemitPaymentGlobalModal: false });
    this.setState({ showRemitPaymentModal: false });
    this.setState({ showReceivePaymentModal: false });
  };

  makeRemittancePaymentSent = (successMsg, modal, props?) => {
    this.setState({ showLoader: true, data: [] });

    var data = {
      clientInvoiceId: this.state.clientInvoiceId,
      clientLobId: this.userClientLobId,
    }

    var postData = []
    for (var i = 0; i < props.length; i++) {
      const vendorsList = {
        ...props[i]
      };
      postData.push(vendorsList)

    }
    data['vendorList'] = postData

    postVendorRemittance(data).then((res) => {
      successToastr(successMsg);
      this.getVendorInvoices(this.state.dataState);
      this.setState({ showLoader: false });
    }, (err) => {
      this.getVendorInvoices(this.state.dataState);
      this.setState({ showLoader: false });
    })

    let change = {};
    change[modal] = false;
    this.setState(change);
    this.setState({ showRemitPaymentGlobalModal: false });
    this.setState({ showRemitPaymentModal: false });
    this.setState({ markRemittanceGlobalConfirmationModal: false });
  };

  handleFormActionClick = (action, nextStateId?, eventName?, actionId?) => {
    this.setState({ approved: true });
    let change = {};
    let property;
    if (action=="Receive Payment") {
      //   let data = this.childRef.current.getPaymentData(true);
      //   if (data.validationSuccess) {
      //     this.setState({
      //       notes: data.notes,
      //       paymentAmount: data.paymentAmount,
      //       paymentDate: data.paymentDate,
      //     });
      //     property = `show${action.replace(/ +/g, "")}Modal`;
      //   }
      // } else {
      property = `show${action.replace(/ +/g, "")}Modal`;
    } else {
      property = `show${action.replace(/ +/g, "")}Modal`;
    }
    change[property] = true;
    this.setState(change);
    this.statusId = nextStateId;
    this.eventName = eventName;
    this.actionId = actionId;
  };

  setDataItemHistory = (props) => {
    this.dataItem = props.dataItem;
    this.setState({ showRemittanceHistoryModal: true });
  }

  clientInvoiceStatusUpdate = (successMsg, modal, props?) => {
    this.setState({ showLoader: true, data: [] });
    const data = {
      clientInvoiceId: this.state.clientInvoiceId,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      clientLobId: this.userClientLobId,
      ...props,
    };
    patchClientsInvoicesService(data).then((res) => {
      successToastr(successMsg);
      history.push(MANAGE_CBI);
      this.setState({ showLoader: false });
    }, (err) => {
      this.setState({ showLoader: false });
    });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  cellRender(cellProps) {
    if (cellProps.rowType =="groupHeader") {
      if (cellProps.field =="amount") {
        return (
          <div className="vendor-totalhours-totalamount">
            Total Hours: {cellProps.dataItem.aggregates.hours.sum.toFixed(2)},
            <span className="ml-1">
              Total Amount:{" "}
              {currencyFormatter(cellProps.dataItem.aggregates.amount.sum)}
            </span>
          </div>
        );
      }
    }
    return <td></td>;
  }

  amountTotal = (props) => {
    let total =
      this.state.totalInvoiceData !=undefined &&
        this.state.totalInvoiceData !=null &&
        this.state.totalInvoiceData.length > 0
        ? this.state.totalInvoiceData.reduce((acc, current) => acc + current["amount"], 0)
        : 0;
    const hourTotal =
      this.state.totalInvoiceData !=undefined &&
        this.state.totalInvoiceData !=null &&
        this.state.totalInvoiceData.length > 0
        ? this.state.totalInvoiceData.reduce((acc, current) => acc + current["hours"], 0)
        : 0;
    return (
      <td className="t-foot-vendor" colSpan={9} style={props.style}>
        <div className="row mx-0 d-flex justify-content-center justify-content-xl-center align-items-center">
          <div className="col-auto col-lg-auto font-weight-bold pl-0 pr-0">Grand Total Hours:{" "}</div>
          <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">
            {" "}
            {Number(hourTotal).toFixed(2)}
          </div>
          {/* Total Hours:{" "} */}
          {/* <span
            className="tfoot ml-2"
            style={{ color: "#4987EC", fontSize: "16px" }}
          >
            {" "}
            {Number(hourTotal).toFixed(2)}
          </span> */}
          <div className="ml-3 col-auto col-lg-auto font-weight-bold pl-0 pr-2">Grand Total Amount:</div>
          <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">
            {currencyFormatter(total)}
          </div>
          {/* <span className="ml-4"> Total Amount: </span> */}
          {/* <span
            className="tfoot ml-2"
            style={{ color: "#4987EC", fontSize: "16px" }}
          >
            {currencyFormatter(total)}
          </span> */}
        </div>
      </td>
    );
  };
  resetCBI = (successMsg, modal, props?) => {
    this.setState({ showLoader: true, data: [] });
    const data = {
      clientInvoiceId: this.state.clientInvoiceId,
      clientLobId: this.userClientLobId,
      ...props,
    };
    resetCBI(data).then((res) => {
      successToastr(res.data.statusMessage);
      history.push(MANAGE_CBI);
      this.setState({ showLoader: false });
    });

    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  render() {
    const {
      clientInvoiceRunDate,
      clientInvoiceNumber,
      clientInvoiceStatus,
    } = this.state;
    let titleData = {
      invoiceNumber: clientInvoiceNumber,
      billingPeriod: clientInvoiceRunDate,
      status: clientInvoiceStatus,
    };
    return (
      <div className="col-11 mx-auto mt-3 mt-md-0 remove_padd_invoice ">
        {this.state.clientInvoiceId==undefined ? (
          <PageTitle title="Vendor Invoicing" />
        ) : (
          TitleDetails("Client Invoice Detail", titleData,this.state.clientInvoiceId)
        )}
        {auth.hasPermissionV2(AppPermissions.REPORT_CI_SUMMARY) && this.state.ciSummaryData && CISummaryExportExcel(this.state.ciSummaryData, this.state.clientInvoiceNumber)}
        <CompleteSearch
          page="VendorInvoicing"
          entityType="VendorInvoice"
          handleSearch={this.getVendorInvoices}
          onFirstLoad={this.state.onFirstLoad}
        />
        <div className="container-fluid pl-0 pr-0">
          <div className="vendorInvoiceContainer global-action-grid-lastchild ClientActivityReport-Tfootresponsive table_responsive-TABcandidates table-footer-vendor frozen-column">
          <div
            className="myOrderContainer gridshadow VendorInvoiceDetails-showresponsive-notuse 
          table-footer-vendor
          global-action-grid"
            id="grouping-performance-grid"
          >
            <Grid
              resizable={false}
              reorderable={false}
              sortable={true}
              onDataStateChange={this.onDataStateChange}
              pageable={{ pageSizes: true }}
              data={this.state.clientInvoiceId ? this.state.data : this.state.result}
              groupable={this.state.clientInvoiceId ? false : {footer: "none"}}
              {...this.state.dataState}
              expandField="expanded"
              total={this.state.totalCount}
              className="kendo-grid-custom lastchild"
              onExpandChange={this.expandChange}
            >
              <GridNoRecords>
                {GridNoRecord(this.state.showLoader)}
              </GridNoRecords>
              <GridColumn
                field="vendorInvoiceNumber"
                title="Vendor Invoice#"
                width="180px"
                cell={(props) =>
                  VendorInvoiceNumberCell(props, this.state.clientInvoiceId,true)
                }
                columnMenu={ColumnMenu}
              />
              <GridColumn
                field="vendorName"
                width="120px"
                title="Vendor"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu={"Vendor"} title={props.dataItem.vendorName}>
                      {props.dataItem.vendorName}
                    </td>
                  );
                }}
                filter="text"
              />
              <GridColumn
                field="billingPeriod"
                width="180px"
                title="Billing Period"
                cell={(props) => CellRender(props, "Billing Period")}
                columnMenu={ColumnMenu}
              />
              <GridColumn
                field="hours"
                width="90px"
                title="Hours"
                headerClassName="text-right pr-4"
                filter="numeric"
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none" style={{ width: "0px" }}></td>;
                  }
                  return props.dataItem.hours != undefined
                    && props.dataItem.hours != null && props.dataItem.hours > 0
                    ? <td contextMenu={"Hours"} className="text-right pr-4">{parseFloat(props.dataItem.hours).toFixed(2)}</td>
                    : <td contextMenu={"Hours"} style={{ textAlign: "center" }}>{""}</td>
                }}
                columnMenu={ColumnMenu}
                footerCell={
                  this.state.clientInvoiceId ? this.amountTotal : null
                }
              />
               <GridColumn
               field="amount"
               width="110px"
               title="Billable"
               headerClassName="text-right pr-4"
               filter="numeric"
               cell={(props) => {
                if (props.rowType=="groupHeader") {
                  return <td colSpan={0} className="vendor-details-with-zero">{this.cellRender(props)}</td>;
                }
                return <td contextMenu={"Billable"} className="text-right pr-4">{props.dataItem.amount != undefined
                  && props.dataItem.amount != null && props.dataItem.amount > 0
                  ? currencyFormatter(props.dataItem.amount)
                  : ""}</td>
              }}
               columnMenu={ColumnMenu}
             />
              {this.state.clientInvoiceId==undefined && (
                <GridColumn
                  field="openDays"
                  width="110px"
                  headerClassName="text-right pr-4"
                  title="Open Days"
                  filter="numeric"
                  cell={(props) => NumberCell(props, "Open Days")}
                  columnMenu={ColumnMenu}
                />
              )}
               <GridColumn
                field="clientAuthorizedDate"
                width="160px"
                filter="date"
                format="{0:d}"
                editor="date"
                title="Client Authorized Date"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Client Authorized Date",null,true)}
              />
              {this.state.clientInvoiceId==undefined ?
                  <GridColumn
                    field="clientInvoiceNumber"
                    width="155px"
                    title="Client Invoice#"
                    columnMenu={ColumnMenu}
                    cell={(props) => CellRender(props, "Client Invoice#")}
                  />
                : null}
                    
              {this.state.clientInvoiceId==undefined ?
                  <GridColumn
                    field="cbiRunDate"
                    filter="date"
                    format="{0:d}"
                    width="155px"
                    editor="date"
                    title="Run Date"
                    columnMenu={ColumnMenu}
                    cell={(props) => CellRender(props,"Run Date",null,true)}
                  /> 
                : null}
                
              {!isRoleType(AuthRoleType.Vendor) && <GridColumn
                field="clientInvoiceNumber"
                title="CBI"
                width="50px"
                sortable={false}
                cell={(props) =>{ 
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return <td contextMenu="CBI" className="text-center" title={props.dataItem.clientInvoiceNumber ? `Client Invoice#: ${props.dataItem.clientInvoiceNumber} | Run Date: ${props.dataItem.cbiRunDate !=null ? datetimeFormatter(props.dataItem.cbiRunDate) : "-"}` : ""}>
                  {props.dataItem.clientInvoiceNumber && <FontAwesomeIcon icon={faLock} className={"ml-2 mr-2"} style={{ color: "#808080", cursor: !this.state.clientInvoiceId && "pointer" }} onClick={() => !this.state.clientInvoiceId && history.push(`${MANAGE_VENDOR_INVOICES}/${props.dataItem.clientInvoiceId}`)}></FontAwesomeIcon>
                  } </td>}}
              // columnMenu={ColumnMenu}
              />}
              <GridColumn
                locked={this.state.clientInvoiceId ? false: true}
                field="status"
                width="200px"
                title="Status"
                columnMenu={ColumnMenu}
                cell={this.state.clientInvoiceId ?  VendorInvoiceStatusCellClient : VendorInvoiceStatus}
              />
              <GridColumn
                locked={this.state.clientInvoiceId ? false:true}
                title="Action"
                headerClassName="tab-action"
                sortable={false}
                width="50px"
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return(
                  <RowActions
                    props={props}
                    wfCode={CandidateWorkflow.VENDORINVOICE}
                    dataItem={props.dataItem}
                    currentState={props.dataItem.status}
                    rowId={props.dataItem.vendorInvoiceId}
                    handleClick={this.handleRowActionClick}
                    defaultActions={DefaultActions(
                      props,
                      this.state.clientInvoiceId
                    )}
                    hideBtn={
                      props.dataItem.statusIntId ==
                        VendorInvoiceStatusIds.ACTIVE &&
                        props.dataItem.amount
                        ? ["CloseVI"]
                        : this.state.clientInvoiceId !=undefined &&
                          (props.dataItem.ciStatusIntId==ClientInvoiceStatusIds.PAYMENTRECEIVED ||
                            props.dataItem.ciStatusIntId==ClientInvoiceStatusIds.REMITTANCEINPROCESS)
                          ? []
                          : ["RemitPayment"]
                    }
                  />
                  )}}
                headerCell={() => CustomMenu(this.handleGlobalClick, this.state.totalInvoiceData,
                  this.state.ciAccountingData, this.state.clientInvoiceNumber, excelExport,
                  this.state.tsDetailData, this.state.clientStatusIntId, this.state.totalBalance)}
              />
            </Grid>
            </div>
          </div>
          {this.state.clientInvoiceId !=undefined && (
            <div>
              {/* {auth.hasPermissionV2(AppPermissions.CLIENT_INVOICE_PAY) &&
                (this.state.clientStatusIntId==ClientInvoiceStatusIds.CBIAUTHORIZED || 
                this.state.clientStatusIntId==ClientInvoiceStatusIds.PAYMENTRECEIVED) && 
                this.state.totalBalance != 0 && (
                  <MakePaymentForm
                    ref={this.childRef}
                    assign={this.state.approved}
                    fieldTitle={{
                      amount: "Payment Amount",
                      date: "Payment Date",
                      received: "Payment Received"
                    }}
                    paymentAmount={this.state.totalBalance? this.state.totalBalance : this.state.totalPaymentAmount}
                    paymentDate={new Date()}
                    disabledFields={{ date: false, amount: true }}
                    receivedPayment={this.state.totalPaymentReceived}
                  />
                )} */}

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
                    amount: this.state.totalPaymentAmount,
                    balance: this.state.totalBalance ? this.state.totalBalance : this.state.totalPaymentAmount,
                    date: new Date(),
                  }}
                  handlePaymentHistory={() =>
                    this.setState({ showClientPaymentHistoryModal: true })
                  }
                />
              ) : null}

              <div className="row">
                <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0">
                  <label className="mb-0 font-weight-bold">Comments</label>
                  <span
                    onClick={() => this.setState({ openCommentBox: true })}
                    className="text-underline cursorElement align-middle"
                  >
                    <FontAwesomeIcon
                      icon={faClock}
                      className="ml-1 active-icon-blue ClockFontSize"
                    />
                  </span>
                  <Comment
                    entityType={EntityType.CLIENTINVOICE}
                    entityId={this.state.clientInvoiceId}
                  />
                  {this.state.openCommentBox && (
                    <CommentHistoryBox
                      entityType={EntityType.CLIENTINVOICE}
                      entityId={this.state.clientInvoiceId}
                      showDialog={this.state.openCommentBox}
                      handleNo={() => {
                        this.setState({ openCommentBox: false });
                        document.body.style.position = "";
                      }}
                    />
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
        {this.state.makePaymentConfirmationModal ? (
          <NameClearConfirmationModal
            message={CLIENT_INVOICE_MAKE_PAYMENT_CONFIRMATION_MSG({
              clientInvoiceNumber: this.state.clientInvoiceNumber,
              billingPeriod: this.state.clientInvoiceRunDate,
            })}
            showModal={this.state.makePaymentConfirmationModal}
            handleYes={(props) =>
              this.markRemittancePayment(
                CLIENT_INVOICE_MAKE_PAYMENT_SUCCESS_MSG,
                "makePaymentConfirmationModal",
                this.state.paymentData
                // {
                //   comments: this.state.notes,
                //   amount: this.state.paymentAmount,
                //   date: this.state.paymentDate,
                // }
              )
            }
            handleNo={() => {
              this.setState({ makePaymentConfirmationModal: false });
            }}
            radioSelection={false}
          />
        ) : null}
        {/* {this.state.showMakePaymentModal ? (
          <NameClearConfirmationModal
            message={CLIENT_INVOICE_MAKE_PAYMENT_CONFIRMATION_MSG({
              clientInvoiceNumber: this.state.clientInvoiceNumber,
              billingPeriod: this.state.clientInvoiceRunDate,
            })}
            showModal={this.state.showMakePaymentModal}
            handleYes={(props) =>
              this.markRemittancePayment(
                CLIENT_INVOICE_MAKE_PAYMENT_SUCCESS_MSG,
                "showMakePaymentModal",
                {
                  comments: this.state.notes,
                  amount: this.state.paymentAmount,
                  date: this.state.paymentDate,
                }
              )
            }
            handleNo={() => {
              this.setState({ showMakePaymentModal: false });
            }}
            radioSelection={false}
          />
        ) : null} */}
        {this.state.clientInvoiceId != undefined ? (
          this.state.clientInvoiceStatus ? (
            <FormActions
              wfCode={CandidateWorkflow.CLIENTINVOICE}
              currentState={this.state.clientInvoiceStatus}
              handleClick={this.handleFormActionClick}
              handleClose={() => history.goBack()}
              hideBtn={this.state.totalBalance==0 ? ["ReceivePayment"] : []}
            // cancelUrl={`${MANAGE_CBI}`}
            />
          ) : (
            <CloseLink title={"Close"} pageUrl={`${MANAGE_CBI}`} />
          )
        ) : null}
        <NameClearConfirmationModal
          message={
            this.state.clientInvoiceId && this.state.clientInvoiceRunDate
              ? CLIENT_INVOICE_AUTHORIZE_CONFIRMATION_MSG({
                cbiRunDate: this.state.clientInvoiceRunDate,
                clientInvoiceNumber: this.state.clientInvoiceNumber,
              })
              : VENDOR_INVOICE_AUTHORIZE_CONFIRMATION_MSG(this.dataItem)
          }
          showModal={this.state.showAuthorizeModal}
          handleYes={() =>
            this.state.clientInvoiceId
              ? this.clientInvoiceStatusUpdate(
                CLIENT_INVOICE_AUTHORIZE_SUCCESS_MSG,
                "showAuthorizeModal"
              )
              : this.vendorInvoiceStatusUpdate(
                VENDOR_INVOICE_AUTHORIZE_SUCCESS_MSG,
                "showAuthorizeModal"
              )
          }
          handleNo={() => {
            this.setState({ showAuthorizeModal: false });
          }}
          radioSelection={false}
        />
        <NameClearConfirmationModal
          message={VENDOR_INVOICE_AUTHORIZE_CONFIRMATION_MSG(this.dataItem)}
          showModal={this.state.showVendorAuthorizeModal}
          handleYes={() =>
            this.vendorInvoiceStatusUpdate(
              VENDOR_INVOICE_AUTHORIZE_SUCCESS_MSG,
              "showVendorAuthorizeModal"
            )
          }
          handleNo={() => {
            this.setState({ showVendorAuthorizeModal: false });
          }}
          radioSelection={false}
        />
        <NameClearConfirmationModal
          message={VENDOR_INVOICE_AUTHORIZE_CONFIRMATION_MSG(this.dataItem)}
          showModal={this.state.showClientAuthorizeModal}
          handleYes={() =>
            this.vendorInvoiceStatusUpdate(
              VENDOR_INVOICE_AUTHORIZE_SUCCESS_MSG,
              "showClientAuthorizeModal"
            )
          }
          handleNo={() => {
            this.setState({ showClientAuthorizeModal: false });
          }}
          radioSelection={false}
        />
        {this.state.showUnderAuditReviewModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={VENDOR_INVOICE_UNDER_AUDIT_REVIEW_CONFIRMATION_MSG(
              this.dataItem
            )}
            showModal={this.state.showUnderAuditReviewModal}
            handleYes={(data) =>
              this.vendorInvoiceStatusUpdate(
                VENDOR_INVOICE_UNDER_AUDIT_REVIEW_SUCCESS_MSG,
                "showUnderAuditReviewModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showUnderAuditReviewModal: false });
            }}
            icon={faSearchDollar}
          />
        )}
        {this.state.showRejectModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={VENDOR_INVOICE_REJECT_CONFIRMATION_MSG(this.dataItem)}
            showModal={this.state.showRejectModal}
            handleYes={(data) =>
              this.vendorInvoiceStatusUpdate(
                VENDOR_INVOICE_REJECTION_MSG,
                "showRejectModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showRejectModal: false });
            }}
          />
        )}
        {this.state.showActivityHistoryModal && (
          <div id="hold-position">
            <Dialog className="col-12 width For-all-responsive-height">
              <VendorActivityHistory
                dataItem={this.dataItem}
                handleClose={() =>
                  this.setState({ showActivityHistoryModal: false })
                }
                statusLevel={1}
                candidateName={"Cand Name"}
              />
            </Dialog>
          </div>
        )}
        {this.state.showRemitPaymentModal && (
            <div id="payment-history">
              <Dialog className="col-12 For-all-responsive-height" style={{ "zIndex": 10000 }}>
                <MarkRemittance
                    handleClose={() => {
                      this.setState({showRemitPaymentModal: false})
                    }}
                    clientData={{
                      received: this.state.totalPaymentReceived,
                      amount: this.state.totalPaymentAmount,
                      balance: this.state.totalBalance ? this.state.totalBalance: this.state.totalPaymentAmount,
                      clientInvoiceNumber: this.state.clientInvoiceNumber,
                      cbiRunDate: this.state.clientCbiRunDate,
                      client: this.state.client,
                      date: new Date(),
                    }}
                    dataItem={this.dataItem}
                    clientInvoiceId={this.state.clientInvoiceId}
                    clientId={this.state.clientId}
                    handleYes={(props) =>
                      this.setState({
                        markRemittanceConfirmationModal: true,
                        paymentData: props,
                      })
                    }
                    handlePaymentHistory={() =>
                      this.setState({ showRemittanceHistoryModal: true })
                    }
                    getVendorInvoicesGrid={() => this.getVendorInvoices(this.state.dataState)}
                />
              </Dialog>
            </div>
          // <IconConfimationModal
          //   message={VENDOR_INVOICE_MAKE_REMITTANCE_CONFIRMATION_MSG(
          //     this.dataItem
          //   )}
          //   showModal={this.state.showMarkRemittanceSentModal}
          //   handleYes={(props) =>
          //     this.setState({
          //       markRemittanceConfirmationModal: true,
          //       paymentData: props,
          //     })
          //   }
          //   modalTitle={`Payment Confirmation - ${this.dataItem != undefined && this.dataItem.vendorName
          //     }`}
          //   handleNo={() => {
          //     this.setState({ showMarkRemittanceSentModal: false });
          //   }}
          //   fieldTitle={{
          //     date: "Remittance Date",
          //     amount: "Remittance Amount",
          //   }}
          //   isDisable={false}
          //   disableFields={{ date: false, amount: false }}
          //   data={{
          //     amount: this.dataItem && this.dataItem.amount,
          //     date: new Date(),
          //   }}
          // />
        )}

        {this.state.showRemitPaymentGlobalModal ?
          <div id="payment-history">
            <Dialog className="col-12 For-all-responsive-height" style={{ "zIndex": 10000 }}>
              <MarkRemittance
                  handleClose={() => {
                    this.setState({showRemitPaymentGlobalModal: false})
                  }}
                  clientData={{
                    received: this.state.totalPaymentReceived,
                    amount: this.state.totalPaymentAmount,
                    balance: this.state.totalBalance ? this.state.totalBalance: this.state.totalPaymentAmount,
                    clientInvoiceNumber: this.state.clientInvoiceNumber,
                    cbiRunDate: this.state.clientCbiRunDate,
                    client: this.state.client,
                    date: new Date(),
                  }}
                  handleYes={(props) =>
                    this.setState({
                      markRemittanceGlobalConfirmationModal: true,
                      paymentData: props,
                    })
                  }
                  clientInvoiceId={this.state.clientInvoiceId}
                  clientId={this.state.clientId}
                  handleGlobalPaymentHistory={(props) =>
                    this.setDataItemHistory(props)
                  }
                  getVendorInvoicesGrid={() => this.getVendorInvoices(this.state.dataState)}
              />
            </Dialog>
          </div>
          : null}

        {this.state.markRemittanceGlobalConfirmationModal ? (
          <NameClearConfirmationModal
            message={VENDOR_INVOICE_MAKE_GLOBAL_REMITTANCE_CONFIRMATION_MSG()}
            showModal={this.state.markRemittanceGlobalConfirmationModal}
            handleYes={(props) =>
              this.makeRemittancePaymentSent(
                VENDOR_INVOICE_MAKE_REMITTANCE_SUCCESS_MSG,
                "markRemittanceConfirmationModal",
                this.state.paymentData
              )
            }
            handleNo={() => {
              this.setState({ markRemittanceGlobalConfirmationModal: false });
            }}
            radioSelection={false}
          />
        ) : null}

        {this.state.markRemittanceConfirmationModal ? (
          <NameClearConfirmationModal
            message={VENDOR_INVOICE_MAKE_REMITTANCE_CONFIRMATION_MSG(
              this.dataItem
            )}
            showModal={this.state.markRemittanceConfirmationModal}
            handleYes={(props) =>
              this.makeRemittancePaymentSent(
                VENDOR_INVOICE_MAKE_REMITTANCE_SUCCESS_MSG,
                "markRemittanceConfirmationModal",
                this.state.paymentData
              )
            }
            handleNo={() => {
              this.setState({ markRemittanceConfirmationModal: false });
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
                  invoiceId: this.dataItem.vendorInvoiceId,
                  invoiceNumber: this.dataItem.vendorInvoiceNumber,
                  clientInvoiceNumber: this.dataItem.clientInvoiceNumber,
                  billingPeriod: this.dataItem.billingPeriod,
                  amount: this.dataItem.amount,
                  client: this.state.client
                }}
                dataApi={"vendor"}
              />
            </Dialog>
          </div>
        )}

        {this.state.showClientPaymentHistoryModal && (
          <div id="payment-history">
            <Dialog className="col-12 For-all-responsive-height">
              <PaymentHistory
                title={"Payment History"}
                handleClose={() =>
                  this.setState({ showClientPaymentHistoryModal: false })
                }
                data={{
                  invoiceId: this.state.clientInvoiceId,
                  invoiceNumber: this.state.clientInvoiceNumber,
                  billingPeriod: this.state.clientInvoiceRunDate,
                  amount: this.state.totalPaymentAmount,
                  client: this.state.client
                }}
                dataApi={"client"}
              />
            </Dialog>
          </div>
        )}

        {this.state.showResetCBIModal ? (
          <NameClearConfirmationModal
            message={RESET_CBI_MSG({
              clientInvoiceNumber: this.state.clientInvoiceNumber,
              cbiRunDate: clientInvoiceRunDate,
            })}
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
        {this.state.showResetVendorInvoiceModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={VENDOR_INVOICE_RESET_CONFIRMATION_MSG(this.dataItem)}
            showModal={this.state.showResetVendorInvoiceModal}
            handleYes={(data) =>
              this.vendorInvoiceStatusUpdate(
                VENDOR_INVOICE_RESET_SUCCESS_MSG,
                "showResetVendorInvoiceModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showResetVendorInvoiceModal: false });
            }}
          />
        )}
        {this.state.showUnderVendorReviewModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={VENDOR_INVOICE_UNDER_VENDOR_REVIEW_CONFIRMATION_MSG(
              this.dataItem
            )}
            showModal={this.state.showUnderVendorReviewModal}
            handleYes={(data) =>
              this.vendorInvoiceStatusUpdate(
                VENDOR_INVOICE_UNDER_VENDOR_REVIEW_SUCCESS_MSG,
                "showUnderVendorReviewModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showUnderVendorReviewModal: false });
            }}
            icon={faSearchDollar}
          />
        )}
        {this.state.showCloseVIModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={VENDOR_INVOICE_CLOSE_VI_CONFIRMATION_MSG(this.dataItem)}
            showModal={this.state.showCloseVIModal}
            handleYes={(data) =>
              this.vendorInvoiceStatusUpdate(
                VENDOR_INVOICE_CLOSE_VI_SUCCESS_MSG,
                "showCloseVIModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showCloseVIModal: false });
            }}
            icon={faTimes}
          />
        )}
        <NameClearConfirmationModal
          message={VENDOR_INVOICE_RE_AUTHORIZE_CONFIRMATION_MSG(this.dataItem)}
          showModal={this.state.showVendorReauthorizeModal}
          handleYes={() =>
            this.vendorInvoiceStatusUpdate(
              VENDOR_INVOICE_RE_AUTHORIZE_SUCCESS_MSG,
              "showVendorReauthorizeModal"
            )
          }
          handleNo={() => {
            this.setState({ showVendorReauthorizeModal: false });
          }}
          radioSelection={false}
        />

        <ConfirmationModal
          message={VI_UNDERREVIEW_CONFIRMATION_MSG(this.state.expenseLockdownDays)
          }
          showModal={this.state.showUnderReviewModal}
          handleYes={() => this.vendorInvoiceStatusUpdate(VENDOR_INVOICE_UNDER_REVIEW_SUCCESS_MSG, null, null, true )}
          enterComments
          commentsRequired
          commentsChange={this.commentsChange}
          comments={this.state.approverComments}
          handleNo={() => {
            this.setState({ approverComments: "", showUnderReviewModal: false });
          }}
          showError={this.state.approverCommentError}
          isDocRequired={true}
          entityId={this.vendorInvoiceId}
        />
      </div>
    );
  }

  private vendorInvoiceQuery(): string {
    const { clientId, vendorId, clientInvoiceId } = this.state;

    var queryParams = `clientId eq ${clientId}`;
    if (clientInvoiceId) {
      queryParams =
        queryParams + ` and clientInvoiceId eq ${this.state.clientInvoiceId}`;
    }
    if (vendorId) {
      queryParams = queryParams + ` and vendorId eq ${vendorId}`;
    }
    return queryParams;
  }
}

export default ManageInvoices;
