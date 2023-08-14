import auth from "../../../Auth";
import {
  faClock,
  faDollarSign,
  faFlagCheckered,
  faMinusCircle,
  faPaperclip,
  faPlusCircle,
  faReceipt,
  faSearchDollar,
  faShare,
  faTimes,
  faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactFragment } from "react";
import { Link } from "react-router-dom";
import {
  GridNoRecord,
} from "../../../Shared/GridComponents/CommonComponents";
import CompleteSearch from "../../../Shared/Search/CompleteSearch";
import RowActions from "../../../Shared/Workflow/RowActions";
import {
  Grid,
  GridColumn as Column,
  GridColumn,
  GridNoRecords,
} from "@progress/kendo-react-grid";
import { process, State, toODataString } from "@progress/kendo-data-query";
import "jquery";
import "@progress/kendo-ui";
import ColumnMenu from "../../../Shared/GridComponents/ColumnMenu";
import { DefaultActions } from "./WFCells";
import {
  CustomMenu,
  DetailColumnCell,
  ViewMoreComponent,
} from "./GlobalActions";
import { Dialog } from "@progress/kendo-react-dialogs";
import FormActions from "../../../Shared/Workflow/FormActions";
import {
  CandidateWorkflow,
  EntityType,
  VendorInvoiceServiceTypeId,
  VendorInvoiceStatusIds,
  ServiceCategoryIds,
  AuthRoleType,
  isRoleType,
  ClientInvoiceStatusIds,
  allowedMymeTypes,
  allowedFileExtentions,
} from "../../../Shared/AppConstants";
import { CAND_SUB_VIEW_URL, MANAGE_CBI, MANAGE_VENDOR_INVOICES } from "../../../Shared/ApiUrls";
import CloseLink from "../../../Shared/CloseLink";
import { Comment } from "../../../Shared/Comment/Comment";
import InvoiceDocumentDetailsGrid from "./InvoiceDocViewGrid";
import {
  getClientInvoicesServiceByInvoiceId,
  getVendorInvoicesService,
  getVendorInvoicesServiceByInvoiceId,
  patchVendorInvoicesService,
} from "../../VendorService/Services";
import AddExpense from "./AddEditExpenseModal";
import {
  currencyFormatter,
  errorToastr,
  successToastr,
  history,
  initialDataState,
  padLeadingZeros,
} from "../../../../HelperMethods";
import RejectModal from "../../../Shared/RejectModal";
import {
  MOVE_TIMESEET_SUCCESS,
  REMOVE_EXPENSE_CONFIRMATION_MSG,
  REMOVE_TS_DOCUMENT_CONFIRMATION_MSG,
  RESET_TIMESEET_SUCCESS,
  RESET_TIMESHEET_MSG,
  TWO_COLUMNS_GROUPED,
  VENDOR_INVOICE_AUTHORIZE_CONFIRMATION_MSG,
  VENDOR_INVOICE_AUTHORIZE_SUCCESS_MSG,
  VENDOR_INVOICE_CLOSE_VI_CONFIRMATION_MSG,
  VENDOR_INVOICE_CLOSE_VI_SUCCESS_MSG,
  VENDOR_INVOICE_MAKE_REMITTANCE_CONFIRMATION_MSG,
  VENDOR_INVOICE_MAKE_REMITTANCE_SUCCESS_MSG,
  VENDOR_INVOICE_MOVETS_CONFIRMATION_MSG,
  VENDOR_INVOICE_REJECTION_MSG,
  VENDOR_INVOICE_REJECT_CONFIRMATION_MSG,
  VENDOR_INVOICE_RESET_CONFIRMATION_MSG,
  VENDOR_INVOICE_RESET_SUCCESS_MSG,
  VENDOR_INVOICE_RE_AUTHORIZE_CONFIRMATION_MSG,
  VENDOR_INVOICE_RE_AUTHORIZE_SUCCESS_MSG,
  VENDOR_INVOICE_UNDER_AUDIT_REVIEW_CONFIRMATION_MSG,
  VENDOR_INVOICE_UNDER_AUDIT_REVIEW_SUCCESS_MSG,
  VENDOR_INVOICE_UNDER_REVIEW_SUCCESS_MSG,
  VENDOR_INVOICE_UNDER_VENDOR_REVIEW_CONFIRMATION_MSG,
  VENDOR_INVOICE_UNDER_VENDOR_REVIEW_SUCCESS_MSG,
  VI_UNDERREVIEW_CONFIRMATION_MSG,
} from "../../../Shared/AppMessages";
import NameClearConfirmationModal from "../../../Shared/NameClearConfirmationModal";
import CommentHistoryBox from "../../../Shared/Comment/CommentHistoryBox";
import axios from "axios";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { KendoFilter } from "../../../ReusableComponents";
import MakePaymentForm from "../../Payment/MakePaymentForm";
import { postVendorRemittance } from "../../../Clients/ClientInvoice/CBIServices/CBIServices";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import moment from "moment"
import { includes } from "lodash";
import MarkRemittance from "../MarkRemittance/MarkRemittance";
import PaymentHistory from "../../../Clients/ClientInvoice/Manage/PaymentHistory";
import BreadCrumbs from "../../../Shared/BreadCrumbs/BreadCrumbs";
import WithoutFilterColumnMenu from "../../../Shared/GridComponents/WithoutFilterColumnMenu";


export interface VendorInvoiceDetailsProps { }

export interface VendorInvoiceDetailsProps {
  match: any;
}

export interface VendorInvoiceDetailsState {
  showLoader?: boolean;
  take?: any;
  group?: any;
  result?: any;
  dataState?: any;
  showInvoiceModal?: boolean;
  showAddExpensesModal?: boolean;
  showDebitCreditAdjustmentModal?: boolean;
  candSubmissionId?: any;
  openCommentBox?: boolean;
  status?: any;
  dataItem?: any;
  vendorInvoiceId?: any;
  showRemoveModal?: any;
  showRemoveDocModal?: any;
  tsWeekId?: any;
  billingPeriod?: any;
  invoiceNumber?: any;
  global?: boolean;
  Edit?: boolean;
  showVendorAuthorizeModal?: boolean;
  showVendorReauthorizeModal?: boolean;
  showClientAuthorizeModal?: boolean;
  showRejectModal?: boolean;
  showUnderAuditReviewModal?: boolean;
  showUnderVendorReviewModal?: boolean;
  showCloseVIModal?: boolean;
  showMoveTimesheetModal?: boolean;
  showResetTimesheetModal?: boolean;
  isVendorRole: boolean;
  isAdminRole: boolean;
  onFirstLoad?: boolean;
  statusIntId?: any;
  total?: any;
  data?: any;
  test?: any;
  clientInvoiceId?: any;
  markRemmitance?: boolean;
  paymentAmount?: any;
  paymentDate?: any;
  notes?: any;
  showRemitPaymentModal?: any;
  showResetVendorInvoiceModal?: any;
  totalData?: any;
  vendor?: string;
  ciStatusIntId?: number;
  vendorInvoicesForMove?: any;
  fileArray?: any[];
  showInvalidFileAlert?: boolean;
  clientInvoiceNumber?: string;
  clientStatusIntId?: any;
  totalPaymentReceived?: any;
  totalBalance?: any;
  client?: string;
  totalPaymentAmount?: any;
  clientId?: string;
  markRemittanceConfirmationModal?: any;
  paymentData?: any;
  showRemittanceHistoryModal?: any;
  clientInvoiceRunDate?: any;
  expenseLockdownDays?: any;
  approverComments?: any;
  approverCommentError?: any;
  showUnderReviewModal?: any;
}

class VendorInvoiceDetails extends React.Component<
  VendorInvoiceDetailsProps,
  VendorInvoiceDetailsState
> {
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  private userClientLobId: any = localStorage.getItem("UserClientLobId");
  childRef: React.RefObject<MakePaymentForm> = React.createRef();
  CustomHeaderActionCellTemplate;
  uploadControl: HTMLInputElement;
  public fileArrayGlobal: any[];
  public dataItem: any;
  invalidFileList: any[];
  alertMessage = "";
  globalFileId: any;

  reqId;
  aggregates = [
    { field: "amount", aggregate: "sum" },
    { field: "hours", aggregate: "sum" },
    { field: "timesheetAmount", aggregate: "sum" },
    { field: "timesheetDebitAmount", aggregate: "sum" },
  ];
  dataState;
  public vendorInvoiceId: string;
  data = [];
  totalAmount = 0;
  constructor(props) {
    super(props);

    this.dataState = {
      ...initialDataState,
      group: [{ field: "associate" }],
    };

    this.state = {
      showLoader: false,
      test: this.dataState,
      data: [],
      total: 0,
      dataState: this.dataState,
      showInvoiceModal: false,
      showAddExpensesModal: false,
      showDebitCreditAdjustmentModal: false,
      candSubmissionId: "",
      openCommentBox: false,
      dataItem: [],
      status: "",
      global: false,
      onFirstLoad: true,
      Edit: false,
      isVendorRole: isRoleType(AuthRoleType.Vendor),
      isAdminRole: isRoleType(AuthRoleType.SystemAdmin),
      fileArray: [],
      client: localStorage.getItem("UserClient"),
      approverComments: "",
    };
  }

  action: string;
  statusId: string;
  eventName: string;
  actionId: string;

  componentDidMount() {
    const { id, clientId } = this.props.match.params;
    this.setState({ vendorInvoiceId: id, clientInvoiceId: clientId });
    this.createAppState(this.state.dataState);
    if (clientId !=undefined){
      this.getClientInvoicesService(clientId);
    }
  }

  getInvoiceDetails = (dataQuery?, dataState?) => {
    this.setState({ showLoader: true });
    var queryStr = `${toODataString(dataQuery, { utcDates: true })}`;
    var finalQueryString = KendoFilter(
      dataQuery,
      queryStr,
      `vendorInvoiceId eq ${this.state.vendorInvoiceId}`
    );

    this.getVendorInvoices();

    getVendorInvoicesServiceByInvoiceId(
      this.state.vendorInvoiceId,
      finalQueryString
    ).then((res) => {
      this.data = res.data;
      let dataStateCopy =
        this.state.onFirstLoad && dataState==undefined
          ? this.dataState
          : !this.state.onFirstLoad && dataState==undefined
            ? {
              ...initialDataState,
              group: this.state.dataState.group,
            }
            : {
              skip:
                dataState.take==dataState.skip ||
                  dataState.take < dataState.skip
                  ? 0
                  : dataState.skip,
              take: dataState.take,
              group: dataState.group,
            };

      this.setState(
        {
          data: res.data,
          result: process(res.data, dataStateCopy),
          showLoader: false,
          onFirstLoad: false,
        },
        () => {
          this.getInvoiceDetailCount(this.state.vendorInvoiceId, dataQuery)
          this.getVendorInvoiceDocuments(this.state.vendorInvoiceId)
        }
      );
    });
  };

  getVendorInvoices = () => {
    var dataState = {
      // ...this.state.dataState,
      skip: 0,
      filter: null,
    };
    var queryStr = `${toODataString(dataState, { utcDates: true })}`;
    var queryParams = `vendorInvoiceId eq ${this.state.vendorInvoiceId}`;
    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
    getVendorInvoicesService(finalQueryString).then((res) => {
      if(res.data[0]){
        res.data[0] && this.setState({
          status: res.data[0].status,
          statusIntId: res.data[0].statusIntId,
          billingPeriod: res.data[0].billingPeriod,
          invoiceNumber: res.data[0].vendorInvoiceNumber,
          vendorInvoiceId: res.data[0].vendorInvoiceId,
          vendor: res.data[0].vendorName,
          paymentAmount:res.data[0].amount,
          ciStatusIntId: res.data[0].ciStatusIntId,
        });

        this.dataItem = res.data[0];
      }else{
        if(this.state.clientInvoiceId){
          history.push(MANAGE_CBI);
        }else{
          history.push(MANAGE_VENDOR_INVOICES);
        }
      }
    });
  };

  getInvoiceDetailCount = (id, dataState) => {
    var finalState: State = {
      ...dataState,
      take: null,
      skip: 0,
    };
    var queryStr = `${toODataString(finalState, { utcDates: true })}`;
    var finalQueryString = KendoFilter(
      dataState,
      queryStr,
      `vendorInvoiceId eq ${this.state.vendorInvoiceId}`
    );
    getVendorInvoicesServiceByInvoiceId(id, finalQueryString).then((res) => {
      this.setState({
        total: res.data.length,
        totalData: res.data,
      });
    });
  };

  ExpandCell = (props) => (
    <DetailColumnCell
      {...props}
      expandChange={this.expandDetailsChange.bind(this)}
    />
  );

  // dynamic form action click
  handleFormActionClick = (action, nextStateId?, eventName?, actionId?) => {
    let change = {};
    let property;
    if (action=="Mark Remittance Sent") {
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
    }
    else{
      property = `show${action.replace(/ +/g, "")}Modal`;

    }
    change[property] = true;
    this.setState(change);
    this.statusId = nextStateId;
    this.eventName = eventName;
    this.actionId = actionId;
  };

  getClientInvoicesService = (id) => {
    getClientInvoicesServiceByInvoiceId(id).then((res) =>
    {
      if(res.data){
        res.data && this.setState({
            // clientInvoiceStatus: res.data.status,
            clientInvoiceRunDate: res.data.cbiRunDate,
            clientInvoiceNumber: res.data.clientInvoiceNumber,
            // clientInvoiceId: res.data.clientInvoiceId,
            totalPaymentAmount: res.data.amount,
            clientStatusIntId: res.data.statusIntId,
            totalPaymentReceived: res.data.received,
            totalBalance: res.data.balance,
            client: res.data.client,
            clientId: res.data.clientId
          })
        }else{
          history.push(MANAGE_CBI);
        }
    });
  }

  handleActionClick = (
    action,
    actionId,
    rowId,
    nextStateId?,
    eventName?,
    dataItem?
  ) => {
    let property = "";
    if (action =="Debit/Credit Adjustment") {
      property = "showDebitCreditAdjustmentModal";
    } else if (
      action=="Edit" &&
      (dataItem.serviceTypeIntId ==VendorInvoiceServiceTypeId.DEBIT ||
        dataItem.serviceTypeIntId ==VendorInvoiceServiceTypeId.CREDIT) &&
      dataItem.serviceTypeIntId != null
    ) {
      this.setState({ Edit: true });
      property = "showDebitCreditAdjustmentModal";
    } else if (
      action=="Edit" &&
      dataItem.serviceTypeIntId != VendorInvoiceServiceTypeId.DEBIT &&
      dataItem.serviceTypeIntId != VendorInvoiceServiceTypeId.CREDIT &&
      dataItem.serviceTypeIntId != null
    ) {
      this.setState({ Edit: true });
      property = "showAddExpensesModal";
    } else {
      property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
    }
    let change = {};

    change[property] = true;
    this.action = action;
    this.actionId = actionId;
    this.statusId = nextStateId;
    this.eventName = eventName;
    this.vendorInvoiceId = rowId;
    this.setState(change);
    this.setState({ dataItem: dataItem }, () => {
      if (action=="Move Timesheet") {
        this.getVendorInvoicesForMove();
      }
    });

  };

  getTotal = (field) => {
    const totalWithoutDebitAmountData =
      this.state.totalData !=undefined &&
      this.state.totalData !=null &&
      this.state.totalData.length > 0 &&
      this.state.totalData.filter((i) => i.serviceTypeIntId != 6);
    const totalAmoutithoutDebit =
      totalWithoutDebitAmountData !=undefined &&
        totalWithoutDebitAmountData !=null &&
        totalWithoutDebitAmountData.length > 0
        ? totalWithoutDebitAmountData.reduce(
          (acc, current) => acc + current[field],
          0
        )
        : 0;
    const totalDebitData =
      this.state.totalData !=undefined &&
      this.state.totalData !=null &&
      this.state.totalData.length > 0 &&
      this.state.totalData.filter(
        (i) => i.serviceTypeIntId==VendorInvoiceServiceTypeId.DEBIT
      );
    const debitDataAmount =
      totalDebitData.length > 0 &&
      totalDebitData.reduce((acc, current) => acc + current[field], 0);
    let total = totalAmoutithoutDebit - debitDataAmount;
    this.totalAmount = total;
    return total;
  };

  amountTotal = (props) => {
    let total = this.getTotal("amount");
    const hourTotal =
      this.state.totalData !=undefined && this.state.totalData !=null && this.state.totalData.length > 0
        ? this.state.totalData.reduce((acc, current) => acc + current["hours"], 0)
        : 0;
    return (
      <td className="t-foot-vendor" colSpan={18} style={props.style}>
        <div className="row mx-0 d-flex justify-content-center justify-content-xl-center align-items-center">
          {/* <div className="col-12 col-sm-auto text-center text-sm-right">
            Total Hours:{" "}
            <span className="tfoot ml-2 tfoot-vendor">
              {" "}
              {Number(hourTotal).toFixed(2)}
            </span>
          </div> */}
          <div className="col-auto col-lg-auto font-weight-bold pl-0 pr-0">Grand Total Hours:{" "}</div>
          <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">
            {" "}{Number(hourTotal).toFixed(2)}
          </div>
          <div className="ml-3 col-auto col-lg-auto font-weight-bold pl-0 pr-2">Grand Total Billable:</div>
          <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">{currencyFormatter(total)}</div>
          {/* <div className="col-12 col-sm-auto text-center text-sm-left">
            <span className="ml-0"> Total Billable: </span>
            <span className="tfoot ml-2 tfoot-vendor">
              {currencyFormatter(total)}
            </span>
          </div> */}

          {(this.state.isVendorRole || this.state.isAdminRole) && (
            <React.Fragment>
            <div className="ml-3 col-auto col-lg-auto font-weight-bold pl-0 pr-2">Total Remit Amount:</div>
            <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">
                     {" "} {currencyFormatter(this.getTotal("netAdjBalance"))}
            </div>
            </React.Fragment>
            // <div className="col-12 col-sm-auto text-center text-sm-left">
            //   <span>
            //     <span className="ml-0"> Net Adj Total: </span>
            //     <span className="tfoot ml-2">
            //       {" "}
            //       {currencyFormatter(this.getTotal("netAdjBalance"))}
            //     </span>
            //   </span>
            // </div>
          )}
        </div>
      </td>
    );
  };

  close = () => {
    this.setState({
      showAddExpensesModal: false,
      showDebitCreditAdjustmentModal: false,
      dataItem: [],
      global: false,
      Edit: false,
    });
  };

  openNew = (newModal) => {
    this.state.global && this.setState({ dataItem: [] });
    let change = {};
    change[newModal] = true;
    this.setState(change);
  };

  deleteExpense = () => {
    axios
      .delete(`/api/ts/week/expense/${this.state.dataItem.expenseId}`)
      .then((res) => {
        successToastr("Expense deleted successfully");
        this.setState({ showRemoveModal: false });
        this.getInvoiceDetails(this.state.dataState, this.state.dataState);
      });
  };

  onSaveAndNew = () => {
    let openNewModal = "";
    if (this.state.showAddExpensesModal==true) {
      openNewModal = "showAddExpensesModal";
    } else {
      openNewModal = "showDebitCreditAdjustmentModal";
    }
    let change = {};
    change[openNewModal] = false;
    this.setState(change);
    setTimeout(() => {
      this.openNew(openNewModal);
    }, 50);
    this.getInvoiceDetails(this.state.dataState, this.state.dataState);
  };

  onSaveAndClose = () => {
    this.close();
    this.getInvoiceDetails(this.state.dataState, this.state.dataState);
  };

  expandDetailsChange = (dataItem) => {
    dataItem.expanded = !dataItem.expanded;
    this.forceUpdate();
  };

  commentsChange = (e) => this.setState({ approverComments: e.target.value, approverCommentError: e.target.value=="" });

  vendorInvoiceStatusUpdate = (successMsg?, modal?, props?, isUnderReview = false) => {
    if (this.state.showUnderReviewModal==true && !this.state.approverComments.replace(/^\s+|\s+$/g, "")) {
      this.setState({ approverCommentError: true });
      return;
    }
    this.setState({ showLoader: true });
    const data = {
      vendorInvoiceId: this.state.vendorInvoiceId,
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
        this.setState({ showUnderReviewModal: true, expenseLockdownDays: res.data.responseCode, showLoader: false });
      }
      else{
        successToastr(successMsg);
        this.setState({ showLoader: false, showUnderReviewModal: false });
        history.goBack();
        // history.push(this.state.clientInvoiceId != undefined ? `${MANAGE_VENDOR_INVOICES}/${this.state.clientInvoiceId}` : `${MANAGE_VENDOR_INVOICES}`);
      }
    }, err => {
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
            Total Hours:{" "}
            {Number(cellProps.dataItem.aggregates.hours.sum).toFixed(2)}, Total
            Billable:{" "}
            {currencyFormatter(
              cellProps.dataItem.aggregates.timesheetAmount.sum -
              cellProps.dataItem.aggregates.timesheetDebitAmount.sum
            )}
          </div>
        );
      }
    }
    return <span></span>;
  }

  handleChange = (e) => {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  markRemittancePayment = (successMsg, modal, props?) => {
    this.setState({ showLoader: true, data: [] });
    const data = {
      vendorInvoiceId: this.state.vendorInvoiceId,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      clientLobId: this.userClientLobId,
      amount: props.amount,
      payDate: props.date,
      comments: props.comments,
      ...props,
    };

    postVendorRemittance(data).then((res) => {
      successToastr(successMsg);
      this.setState({ showLoader: false });
      history.push(
        this.state.clientInvoiceId != undefined
          ? `${MANAGE_VENDOR_INVOICES}/${this.state.clientInvoiceId}`
          : `${MANAGE_VENDOR_INVOICES}`
      );
    });

    let change = {};
    change[modal] = false;
    this.setState(change);
    this.setState({ showRemitPaymentModal: false });
  };

  getVendorInvoicesForMove() {
    const { clientId, vendorId, billingPeriod, clientInvoiceId } = this.state.dataItem;
    var queryParams = `clientId eq ${clientId} and vendorId eq ${vendorId} and billingPeriod gt '${billingPeriod}' and (statusIntId eq 37 or statusIntId eq 52)`;// and &$select=vendorInvoiceNumber,vendorInvoiceId`;
    axios.get(`api/vendor/invoice?$filter=${queryParams}`).then((res) => {
      this.setState({ vendorInvoicesForMove: res.data });
    });
  }

  moveTimesheet(vendorInvoiceId) {
    this.setState({ showMoveTimesheetModal: false });
    const { tsWeekId } = this.state.dataItem;
    const data = {
      vendorInvoiceId,
      tsWeekId
    }
    axios.patch(`api/ts/move/${tsWeekId}`, data).then(res => {
      successToastr(MOVE_TIMESEET_SUCCESS);
      this.getInvoiceDetails(this.state.dataState, this.state.dataState);
    })
  }

  getVendorInvoiceDocuments = (vendorInvoiceId) => {
      axios.get(`api/ts/documents?tsWeekId=${vendorInvoiceId}`).then((res) => {
          if (res.data) {
              let fileArray = [];
              res.data.forEach((doc) => {
                  fileArray.push({
                      candDocumentsId: doc.candDocumentsId,
                      fileName: doc.fileName,
                      file: undefined,
                      isValid: true,
                      path: doc.filePath,
                  });
              });
              this.setState({ fileArray: fileArray });
          }
      });
  };

  select = (event) => {
    let fileArray = [...this.state.fileArray];
    event.preventDefault();
    if (event.target.files.length > 0) {
        Array.from(event.target.files).forEach((file: any) => {
            let isfileValid = false;
            if (includes(allowedMymeTypes, file.type)) {
                isfileValid = true;
            } else if (file.type=="") {
                if (includes(allowedFileExtentions, file.name.split(".")[1])) {
                    isfileValid = true;
                }
            }
            fileArray.push({ candDocumentsId: undefined, fileName: file.name, file: file, isValid: isfileValid, path: undefined });
        });
        this.fileArrayGlobal = fileArray;
        //this.setState({ fileArray: fileArray })
        if (fileArray.some((d) => d.isValid ==false)) {
            this.invalidFileList = fileArray.filter(x => x.isValid ==false);
            this.alertMessage = this.invalidFileList.map(x => x.fileName).join(", ") + " is invalid and will not be uploaded."
            this.setState({ showInvalidFileAlert: true });
            return false;
        }
        else {
            this.uploadDocuments(fileArray);
        }
    }
};

download = (filePath) => {
  axios.get(`/api/candidates/documents/download?filePath=${filePath}`).then((res: any) => {
      if (res) {
          let fileExt = filePath.split('.')[1].toLowerCase();
          let fileType;
          if (fileExt=="jpg" || fileExt=="png" || fileExt=="jpeg") {
              fileType = "image";
          } else {
              fileType = "application";
          }
          const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
          const downloadLink = document.createElement("a");
          let fileName = filePath.split("/")[2];

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
      }
  });
};

uploadDocuments = (fileArray) => {
    this.setState({ showInvalidFileAlert: false });
    let checkNewFile = fileArray != undefined ? fileArray.filter((i) => i.candDocumentsId ==undefined && i.isValid ==true) : [];
    if (checkNewFile.length > 0) {
        let formData = new FormData();
        checkNewFile.map((item) => {
            formData.append("FormFiles", item.file);
        });
        formData.append("entityId", this.state.vendorInvoiceId);
        formData.append("entityName", "vendorInvoice");
        axios
            .post(`/api/ts/documents`, formData)
            .then((response) => response)
            .then((data) => {
                successToastr("Document(s) uploaded successfully.");
                this.getVendorInvoiceDocuments(this.state.vendorInvoiceId);

                // history.push("/timesheet/provider/" + this.state.candSubmissionId);
                //history.goBack();
            });
    }
}

  makeRemittancePaymentSent = (successMsg, modal, props?) => {
    this.setState({ showLoader: true, data: [] });

    var data = {
      clientInvoiceId: this.state.clientInvoiceId,
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
        this.setState({ showLoader: false });
        history.push(
          this.state.clientInvoiceId != undefined
            ? `${MANAGE_VENDOR_INVOICES}/${this.state.clientInvoiceId}`
            : `${MANAGE_VENDOR_INVOICES}`
        );
      }, (err) => {
        this.setState({ showLoader: false });
    })
      
    let change = {};
    change[modal] = false;
    this.setState(change);
    // this.setState({ showMarkRemittanceGlobalModal: false });
    this.setState({ showRemitPaymentModal: false });
  };

  resetTimesheet = () => {
    this.setState({ showResetTimesheetModal: false });
    const { tsWeekId } = this.state.dataItem;
    let data = { id: tsWeekId };
    axios.patch(`/api/ts/reset/${tsWeekId}`, JSON.stringify(data)).then((res) => {
      successToastr(RESET_TIMESEET_SUCCESS);
      this.getInvoiceDetails(this.state.dataState, this.state.dataState);
    });
  };

  deleteFile = () => {
    this.setState({ showRemoveDocModal: false });
    axios.delete(`/api/admin/documents/${this.globalFileId}`).then((res) => {
        successToastr("Document deleted successfully");
        this.getVendorInvoiceDocuments(this.state.vendorInvoiceId);
    });
  };

  removeFile = (index) => {
      if (this.state.fileArray[index].candDocumentsId) {
          this.globalFileId = this.state.fileArray[index].candDocumentsId
          this.setState({ showRemoveDocModal: true })
      }
  };

  render() {
    const {
      dataItem,
      dataState,
      showDebitCreditAdjustmentModal,
      showAddExpensesModal,
      showInvoiceModal,
      status,
    } = this.state;

    return (
      <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
        <div className="container-fluid mt-3 mb-3 d-md-block d-none">
          <div className="row pt-1 pb-1 mt-3 accordianTitleClr mx-auto mb-2">
            <div className="col-12 fonFifteen paddingLeftandRight">
              <div className="row mx-0 align-items-center">
                {/* <div>Vendor Invoice Details</div> */}
                <div className="col-6 p-0 m-0 fonFifteen paddingLeftandRight">
                  <BreadCrumbs globalData={{ vendorInvoiceId: this.state.vendorInvoiceId, clientInvoiceId: this.state.clientInvoiceId }}></BreadCrumbs>
                </div>
                <div className="col-6 p-0 m-0">
                  <div className="float-right text-dark">                    
                    <span
                      className="cursor-pointer mr-2"
                      style={{ fontSize: "12px" }}
                    >
                     <span className="mr-2 shadow invoice float-left">
                      {" "}
                      <FontAwesomeIcon
                        className="faclock_size d-block"
                        icon={faReceipt}
                        style={{ color: "white" }}
                      />{" "}
                    </span>
                      <span>Invoice#: {this.state.invoiceNumber}</span>
                    </span>
                    <span
                      className="cursor-pointer mr-2"
                      style={{ fontSize: "12px" }}
                    >
                      | Vendor: {this.state.vendor}
                    </span>
                  </div>
                  <div className="float-right text-dark">
                    <span
                      className="cursor-pointer mr-2"
                      style={{ fontSize: "12px" }}
                    >
                      {" "}
                      Billing Period: {this.state.billingPeriod}
                    </span>
                    <span
                      className="cursor-pointer mr-2"
                      style={{ fontSize: "12px" }}
                    >
                      | Status: {this.state.status}
                    </span>
                  </div>
                  {/* <div className="col pr-0 d-flex align-items-center justify-content-end">
                    <span className="mr-2 float-right text-dark shadow invoice">
                      {" "}
                      <FontAwesomeIcon
                        className="faclock_size d-block"
                        icon={faReceipt}
                        style={{ color: "white" }}
                      />{" "}
                    </span>
                    <span
                      className="float-right text-dark"
                      style={{ fontSize: "12px" }}
                    >
                      Invoice#: {this.state.invoiceNumber}
                    </span>
                    <span
                      className="float-right text-dark"
                      style={{ fontSize: "12px" }}
                    >
                      | Vendor: {this.state.vendor}
                    </span>
                    <span
                      className="float-right text-dark"
                      style={{ fontSize: "12px" }}
                    >
                      {" "}
                      | Billing Period: {this.state.billingPeriod}
                    </span>
                    <span
                      className="float-right text-dark"
                      style={{ fontSize: "12px" }}
                    >
                      | Status: {this.state.status}
                    </span>
                  </div> */}
                </div>                
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <CompleteSearch
            page="VendorInvoicingDetails"
            entityType="VendorInvoice"
            handleSearch={this.getInvoiceDetails}
            onFirstLoad={this.state.onFirstLoad}
          />

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
              pageable={{ pageSizes: true }}
              groupable={{ footer: "none", enabled: true }}
              data={this.state.result}
              total={this.state.total}
              onDataStateChange={this.dataStateChange}
              {...this.state.dataState}
              className="kendo-grid-custom lastchild"
              onExpandChange={this.expandChange}
              expandField="expanded"
              // cellRender={
              //   this.getTotal("amount") != undefined &&
              //     this.getTotal("amount") != null
              //     ? this.cellRender
              //     : null
              // }
              detail={ViewMoreComponent}
            >
              <GridNoRecords>
                {GridNoRecord(this.state.showLoader)}
              </GridNoRecords>
              <GridColumn
                field="associate"
                filterable={false}
                title="Associate"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td
                      contextMenu="Associate"
                      title={props.dataItem.associate}
                    >
                      <Link
                        className="orderNumberTd orderNumberTdBalck"
                        to={CAND_SUB_VIEW_URL + props.dataItem.candSubmissionId}
                        style={{ color: "#007bff" }}
                      >
                        {props.dataItem.associate}
                      </Link>
                    </td>
                  );
                }}
              />
              <GridColumn
                field="position"
                title="Position"
                filter="text"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu="Position" title={props.dataItem.position}>
                      <Link
                        className="orderNumberTd orderNumberTdBalck"
                        to={"/requisitions/view/" + props.dataItem.reqId}
                        style={{ color: "#007bff" }}
                      >
                        {props.dataItem.position}
                      </Link>
                    </td>
                  );
                }}
              />
              {/* <GridColumn
                field="zone"
                title="Zone"
                filter="text"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu="Zone" title={props.dataItem.zone}>
                      {props.dataItem.zone}
                    </td>
                  );
                }}
              /> */}
              <GridColumn
                field="region"
                title="Region"
                filter="text"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu="Region" title={props.dataItem.region}>
                      {props.dataItem.region}
                    </td>
                  );
                }}
              />
              <GridColumn
                field="division"
                title="Division"
                filter="text"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu="Division" title={props.dataItem.division}>
                      {props.dataItem.division}
                    </td>
                  );
                }}
              />
              <GridColumn
                field="location"
                title="Location"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu="Location" title={props.dataItem.location}>
                      {props.dataItem.location}
                    </td>
                  );
                }}
              />
              <GridColumn
                field="payPeriod"
                title="Pay Period"
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td
                      contextMenu="Pay Period"
                      title={props.dataItem.payPeriod}
                    >
                      <Link
                        className="vendorInvoiceNumberTd orderNumberTdBalck"
                        to={props.dataItem.serviceCatIntId ==ServiceCategoryIds.EXPENSE ?
                          `/timesheets/week/${props.dataItem.tsWeekId}/expense` :
                          `/timesheet/${props.dataItem.tsWeekId}/edit`
                        }
                      >
                        {props.dataItem.payPeriod}
                      </Link>
                    </td>
                  );
                }}
                columnMenu={WithoutFilterColumnMenu}
              />
              <GridColumn
                field="serviceType"
                title="Type"
                width={"210px"}
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu="Type">
                      {props.dataItem.serviceCatIntId ==
                        ServiceCategoryIds.TIME ? (
                        <div
                          title="Timesheet"
                          className="d-flex   align-items-center justify-content-end justify-content-xl-start"
                        >
                          <span>
                            {" "}
                            <FontAwesomeIcon
                              className="faclock_size mr-1"
                              icon={faClock}
                              style={{ color: "grey" }}
                            />
                          </span>

                          {" Timesheet "}
                        </div>
                      ) : props.dataItem.serviceTypeIntId ==
                        VendorInvoiceServiceTypeId.DEBIT ? (
                        <div
                          title={props.dataItem.adjustmentServiceType}
                          className="d-flex   align-items-center justify-content-end justify-content-xl-start"
                        >
                          <FontAwesomeIcon
                            className="faclock_size font-weight-bold mr-1"
                            icon={faMinusCircle}
                            style={{ color: "#DE350B" }}
                          />

                          <span className="span-my-task-desciption">
                            {props.dataItem.adjustmentServiceType}
                          </span>
                        </div>
                      ) : props.dataItem.serviceTypeIntId ==
                        VendorInvoiceServiceTypeId.CREDIT ? (
                        <div
                          title={props.dataItem.adjustmentServiceType}
                          className="d-flex   align-items-center justify-content-end justify-content-xl-start"
                        >
                          {" "}
                          <FontAwesomeIcon
                            className="faclock_size d-block font-weight-bold mr-1"
                            icon={faPlusCircle}
                            style={{ color: "#108E64" }}
                          />
                          <span className="span-my-task-desciption">
                            {props.dataItem.adjustmentServiceType}
                          </span>
                        </div>
                      ) : (
                        props.dataItem.serviceTypeId &&
                        Number.isInteger(props.dataItem.serviceTypeIntId) && (
                          <div
                            title={props.dataItem.serviceType}
                            className="d-flex   align-items-center justify-content-end justify-content-xl-start"
                          >
                            <span
                              className="dollar_Sign_items"
                              title={"Click here to view invoice documents!"}
                            >
                              <FontAwesomeIcon
                                className="mr-1"
                                onClick={() =>
                                  this.setState({
                                    showInvoiceModal: true,
                                    dataItem: props.dataItem,
                                  })
                                }
                                icon={faDollarSign}
                                style={{ color: "grey", cursor: "grab" }}
                              />
                            </span>
                            {props.dataItem.expenseIsDuplicate && (
                              <span>
                                <FontAwesomeIcon
                                  className="mr-1"
                                  icon={faFlagCheckered}
                                  style={{ color: "red" }}
                                  title={"Possible Duplicate"}
                                />
                              </span>
                            )}

                            <span className="span-my-task-desciption">
                              {props.dataItem.serviceType}
                            </span>
                          </div>
                        )
                      )}
                    </td>
                  );
                }}
              />
              <GridColumn
                field="amount"
                title="Billable"
                filter={"numeric"}
                columnMenu={ColumnMenu}
                headerClassName="text-right pr-4"
                headerSelectionValue={true}
                footerCell={this.amountTotal}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    // return <td colSpan={0} className="d-none"></td>;
                    return (
                      <td colSpan={0} className="vendor-details-with-zero">
                        {this.getTotal("amount") != undefined &&
                          this.getTotal("amount") != null
                          ? this.cellRender(props)
                          : null}
                      </td>
                    );
                  }
                  return (
                    <td
                      contextMenu="Amount"
                      style={{ textAlign: "right", paddingRight: "15px" }}
                    >
                      {props.dataItem != undefined &&
                        props.dataItem.amount != undefined &&
                        props.dataItem.amount != null &&
                        props.dataItem.amount > 0
                        ? currencyFormatter(props.dataItem.amount)
                        : "-"}
                    </td>
                  );
                }}
              />
              <GridColumn
                field="hours"
                title="Hours"
                filter={"numeric"}
                headerClassName="text-right pr-4"
                columnMenu={ColumnMenu}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return props.dataItem.hours != undefined &&
                    props.dataItem.hours != null &&
                    props.dataItem.hours > 0 ? (
                    <td
                      contextMenu="Hours"
                      className="text-right pr-4"
                    >
                      {Number(props.dataItem.hours).toFixed(2)}
                    </td>
                  ) : (
                    <td contextMenu="Hours" className="text-right pr-4">
                      {"-"}
                    </td>
                  );
                }}
              />
              {(this.state.isVendorRole || this.state.isAdminRole) && (
                <GridColumn
                  field="transFee"
                  title="Fees"
                  filter={"numeric"}
                  headerClassName="text-right pr-4"
                  columnMenu={ColumnMenu}
                  cell={(props) => {
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="d-none"></td>;
                    }
                    return props.dataItem.transFee != undefined &&
                      props.dataItem.transFee != null &&
                      props.dataItem.transFee > 0 ? (
                      <td
                        contextMenu="Trans Fee"
                        style={{ textAlign: "right", paddingRight: "15px" }}
                        title={props.dataItem.transFee}
                      >
                        {currencyFormatter(props.dataItem.transFee)}
                      </td>
                    ) : (
                      <td
                        contextMenu="Trans Fee"
                        style={{ textAlign: "center" }}
                      >
                        {"-"}
                      </td>
                    );
                  }}
                />
              )}
              {(this.state.isVendorRole || this.state.isAdminRole) && (
                <GridColumn
                  field="netAdjBalance"
                  title="Remit Amount"
                  filter={"numeric"}
                  headerClassName="text-right pr-4"
                  columnMenu={ColumnMenu}
                  cell={(props) => {
                    if (props.rowType=="groupHeader") {
                      return <td colSpan={0} className="d-none"></td>;
                    }
                    return props.dataItem.netAdjBalance > 0 &&
                      props.dataItem.netAdjBalance != undefined &&
                      props.dataItem.netAdjBalance != null ? (
                      <td
                        contextMenu="Net Adj "
                        style={{ textAlign: "right", paddingRight: "15px" }}
                        title={props.dataItem.netAdjBalance}
                      >
                        {currencyFormatter(props.dataItem.netAdjBalance)}
                      </td>
                    ) : (
                      props.dataItem.netAdjBalance==0 && (
                        <td
                          contextMenu="Net Adj "
                          style={{ textAlign: "center" }}
                        >
                          {"-"}
                        </td>
                      )
                    );
                  }}
                />
              )}

              <GridColumn
                field="purchaseOrder"
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <td contextMenu="PO">{props.dataItem.purchaseOrder}</td>
                  );
                }}
                title="PO"
                columnMenu={ColumnMenu}
              />
              <GridColumn
                title=""
                width="40px"
                sortable={false}
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return (
                    <RowActions
                      dataItem={props.dataItem}
                      currentState={"Submitted"}
                      rowId={"1"}
                      handleClick={this.handleActionClick}
                      defaultActions={DefaultActions(props.dataItem, false)}
                    />
                  );
                }}
                headerCell={(props) =>
                  CustomMenu(
                    this.state.statusIntId,
                    this.state.totalData,
                    () =>
                      this.setState({
                        showAddExpensesModal: true,
                        global: true,
                      }),
                    () =>
                      this.setState({
                        showDebitCreditAdjustmentModal: true,
                        global: true,
                      })
                  )
                }
              />
              <GridColumn
                sortable={false}
                field="expanded"
                title="View More"
                cell={(props) => {
                  if (props.rowType=="groupHeader") {
                    return <td colSpan={0} className="d-none"></td>;
                  }
                  return this.ExpandCell(props);
                }}
              />
            </Grid>
          </div>
          {/* {auth.hasPermissionV2(AppPermissions.VENDOR_INVOICE_REMIT) &&
            this.state.clientInvoiceId != undefined &&
            this.state.ciStatusIntId==ClientInvoiceStatusIds.PAYMENTRECEIVED &&
            this.state.statusIntId != VendorInvoiceStatusIds.REMITTANCESENT && (
              <MakePaymentForm
                ref={this.childRef}
                assign={this.state.markRemmitance}
                paymentAmount={this.state.paymentAmount}
                paymentDate={this.state.paymentDate}
                handleChange={this.handleChange}
                fieldTitle={{
                  amount: "Remittance Amount",
                  date: "Remittance Date",
                }}
                disabledFields={false}
              />
            )} */}
          <div className="row mt-2 mb-2">
            <div className="col-12 col-sm-4 col-lg-4 mt-2 mb-2 mt-sm-0  mb-sm-0">
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
              <div className="col-12 pl-0">
                <Comment
                  entityType={EntityType.VENDORINVOICE}
                  entityId={this.state.vendorInvoiceId}
                />
              </div>
            </div>

            <div className="col-12 col-sm-4 col-lg-4 mt-2 mb-2 mb-sm-0  mt-sm-0"></div>
            <div className="col-12 col-sm-4 col-lg-4 mt-2 mb-2 mb-sm-0  mt-sm-0">
                <input
                    id="myInput"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,application/pdf,application/doc,application/docx,application/xls,application/xlsx"
                    ref={(ref) => (this.uploadControl = ref)}
                    style={{ display: "none" }}
                    onChange={(e) => this.select(e)}
                />
                {(this.state.statusIntId==VendorInvoiceStatusIds.ACTIVE || 
                  this.state.statusIntId==VendorInvoiceStatusIds.REJECTED ||
                  this.state.statusIntId==VendorInvoiceStatusIds.UNDERVENDORREVIEW ) ? (
                  <label className="mb-0 font-weight-bold ">
                      Upload Documents
                      <span
                          onClick={() => {
                              this.uploadControl.click();
                          }}
                          className="text-underline cursorElement align-middle"
                      >
                          <FontAwesomeIcon icon={faPaperclip} className="ml-1 active-icon-blue ClockFontSize" />
                      </span>
                  </label>
                ) : (
                  <label className="mb-0 font-weight-bold ">Uploaded Documents</label>
                )}
                <div className="file-list">
                    {this.state.fileArray.length > 0 &&
                        this.state.fileArray.map((file, i) => (
                            <span>
                                <span
                                    title={file.fileName}
                                    onClick={() => file.candDocumentsId && this.download(file.path)}
                                    className={file.isValid ? "valid-file" : "invalid-file"}
                                >
                                    {file.fileName}
                                </span>
                                {( this.state.statusIntId==VendorInvoiceStatusIds.ACTIVE || 
                                  this.state.statusIntId==VendorInvoiceStatusIds.REJECTED ||
                                  this.state.statusIntId==VendorInvoiceStatusIds.UNDERVENDORREVIEW ) && (
                                  <span title="Remove" className="remove" onClick={() => this.removeFile(i)}>
                                      X
                                  </span>
                                )}
                            </span>
                        ))}
                </div>
            </div>
            {this.state.openCommentBox && (

              <CommentHistoryBox
                entityType={EntityType.VENDORINVOICE}
                entityId={this.state.vendorInvoiceId}
                showDialog={this.state.openCommentBox}
                handleNo={() => {
                  this.setState({ openCommentBox: false });
                  document.body.style.position = "";
                }}
              />

            )}
          </div>
          {status ? (
            <FormActions
              wfCode={CandidateWorkflow.VENDORINVOICE}
              currentState={this.state.status}
              handleClick={this.handleFormActionClick}
              handleClose={() => history.goBack()}
              hideBtn={
                this.state.statusIntId==VendorInvoiceStatusIds.ACTIVE &&
                  this.state.data.length > 0
                  ? ["CloseVI"]
                  : this.state.clientInvoiceId !=undefined &&
                    (this.state.ciStatusIntId==ClientInvoiceStatusIds.PAYMENTRECEIVED ||
                    this.state.ciStatusIntId==ClientInvoiceStatusIds.REMITTANCEINPROCESS)
                  ? []
                  : ["RemitPayment"]
                  // : this.state.statusIntId==VendorInvoiceStatusIds.PAIDINFULLREMITTANCE
                  // ? ["MarkRemittanceSent"]
                  // : []
              }
            />
          ) : (
            <CloseLink title={"Close"} />
          )}
        </div>
        {this.state.showInvoiceModal ? (
          <div id="dialog_open_InvoiceDocumentDetailsGrid">
            <Dialog className="For-all-responsive-height">
              <InvoiceDocumentDetailsGrid
                handleClose={() => this.setState({ showInvoiceModal: false })}
                data={dataItem}
                candidateId={dataItem.associateId}
              />
            </Dialog>
          </div>
        ) : null}

        {(showAddExpensesModal || showDebitCreditAdjustmentModal) && (
          <div id="hold-position">
            <Dialog className="col-12 For-all-responsive-height">
              <AddExpense
                candSubmissionId={this.state.dataItem.candSubmissionId}
                candidateId={this.state.dataItem.associateId}
                candidateName={this.state.dataItem.associate}
                tsWeekId={this.state.dataItem.tsWeekId}
                dataItem={this.state.dataItem}
                optionName={
                  showAddExpensesModal ? "AddExpenses" : "DebitCredit"
                }
                onCloseModal={this.close}
                onSaveAndNew={this.onSaveAndNew}
                onSaveAndClose={this.onSaveAndClose}
                global={this.state.global}
                Edit={this.state.Edit}
                invoiceNumber={this.state.invoiceNumber}
                invoiceId={global ? this.state.vendorInvoiceId : null}
              />
            </Dialog>
          </div>
        )}
        {this.state.showMoveTimesheetModal && (<NameClearConfirmationModal
          message={VENDOR_INVOICE_MOVETS_CONFIRMATION_MSG({
            payPeriod: this.state.dataItem.payPeriodYear,
          })}
          showModal={this.state.showMoveTimesheetModal}
          handleYes={(data) => {
            this.moveTimesheet(data.dropDownId);
          }}
          handleNo={() => {
            this.setState({ showMoveTimesheetModal: false });
          }}
          radioSelection={false}
          icon={faShare}
          enterComments={true}
          dropdownData={this.state.vendorInvoicesForMove}
          showDropdown={true}
        />)}
        {this.state.showResetTimesheetModal && (
          <NameClearConfirmationModal
            message={RESET_TIMESHEET_MSG(this.state.dataItem)}
            showModal={this.state.showResetTimesheetModal}
            handleYes={() => this.resetTimesheet()}
            handleNo={() => {
              this.setState({ showResetTimesheetModal: false });
            }}
            radioSelection={false}
          />
        )}
        <NameClearConfirmationModal
          message={VENDOR_INVOICE_AUTHORIZE_CONFIRMATION_MSG({
            vendorInvoiceNumber: this.state.invoiceNumber,
            billingPeriod: this.state.billingPeriod,
          })}
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
          message={VENDOR_INVOICE_AUTHORIZE_CONFIRMATION_MSG({
            vendorInvoiceNumber: this.state.invoiceNumber,
            billingPeriod: this.state.billingPeriod,
          })}
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
            message={VENDOR_INVOICE_UNDER_AUDIT_REVIEW_CONFIRMATION_MSG({
              vendorInvoiceNumber: this.state.invoiceNumber,
              billingPeriod: this.state.billingPeriod,
            })}
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
            message={VENDOR_INVOICE_REJECT_CONFIRMATION_MSG({
              vendorInvoiceNumber: this.state.invoiceNumber,
              billingPeriod: this.state.billingPeriod,
            })}
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
        <ConfirmationModal
          message={REMOVE_EXPENSE_CONFIRMATION_MSG}
          showModal={this.state.showRemoveModal}
          handleYes={() => this.deleteExpense()}
          handleNo={() => {
            this.setState({ showRemoveModal: false });
          }}
        />

        <ConfirmationModal
            message={REMOVE_TS_DOCUMENT_CONFIRMATION_MSG()}
            showModal={this.state.showRemoveDocModal}
            handleYes={() => this.deleteFile()}
            handleNo={() => {
                this.setState({ showRemoveDocModal: false });
            }}
        />
        {this.state.showRemitPaymentModal && (
          // <NameClearConfirmationModal
          //   message={VENDOR_INVOICE_MAKE_REMITTANCE_CONFIRMATION_MSG({
          //     vendorInvoiceNumber: this.state.invoiceNumber,
          //     billingPeriod: this.state.billingPeriod,
          //   })}
          //   showModal={this.state.showMarkRemittanceSentModal}
          //   handleYes={(props) =>
          //     this.markRemittancePayment(
          //       VENDOR_INVOICE_MAKE_REMITTANCE_SUCCESS_MSG,
          //       "showMarkRemittanceSentModal",
          //       {
          //         amount: this.state.paymentAmount,
          //         payDate: this.state.paymentDate,
          //         comments: this.state.notes,
          //       }
          //     )
          //   }
          //   handleNo={() => {
          //     this.setState({ showMarkRemittanceSentModal: false });
          //   }}
          //   radioSelection={false}
          // />
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
                      cbiRunDate: this.state.clientInvoiceRunDate,
                      clientInvoiceNumber: this.state.clientInvoiceNumber,
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
                    handlePaymentHistory={() => {
                      this.setState({ showRemittanceHistoryModal: true })
                    }}
                    getVendorInvoicesGrid={() => this.createAppState(this.state.dataState)}
                />
              </Dialog>
            </div>
        )}

        {this.state.showRemittanceHistoryModal && (
          <div id="payment-history">
            <Dialog className="col-12 For-all-responsive-height">
              <PaymentHistory
                title={"Remittance History"}
                handleClose={() =>
                  this.setState({ showRemittanceHistoryModal: false })
                }
                data={{
                  invoiceId: this.state.vendorInvoiceId,
                  invoiceNumber: this.state.invoiceNumber,
                  clientInvoiceNumber: this.state.clientInvoiceNumber,
                  billingPeriod: this.state.billingPeriod,
                  client: this.state.client,
                  amount: this.state.totalPaymentAmount
                }}
                dataApi={"vendor"}
              />
            </Dialog>
          </div>
        )}

        {this.state.markRemittanceConfirmationModal ? (
          <NameClearConfirmationModal
            message={VENDOR_INVOICE_MAKE_REMITTANCE_CONFIRMATION_MSG({
              vendorInvoiceNumber: this.state.invoiceNumber,
              billingPeriod: this.state.billingPeriod,
            })}
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

        {this.state.showResetVendorInvoiceModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={VENDOR_INVOICE_RESET_CONFIRMATION_MSG({
              vendorInvoiceNumber: this.state.invoiceNumber,
              billingPeriod: this.state.billingPeriod,
            })}
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
            message={VENDOR_INVOICE_UNDER_VENDOR_REVIEW_CONFIRMATION_MSG({
              vendorInvoiceNumber: this.state.invoiceNumber,
              billingPeriod: this.state.billingPeriod,
            })}
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
            message={VENDOR_INVOICE_CLOSE_VI_CONFIRMATION_MSG({
              vendorInvoiceNumber: this.state.invoiceNumber,
              billingPeriod: this.state.billingPeriod,
            })}
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
          message={VENDOR_INVOICE_RE_AUTHORIZE_CONFIRMATION_MSG({
            vendorInvoiceNumber: this.state.invoiceNumber,
            billingPeriod: this.state.billingPeriod,
          })}
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
          entityId={this.state.vendorInvoiceId}
        />
      </div>
    );
  }

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

  dataStateChange = (event) => {
    let dataState2;
    if (event.dataState.filter) {
      dataState2 = {
        filter: event.dataState.filter,
        skip: event.dataState.skip,
        take: event.dataState.take,
        group: event.dataState.group,
      };
    }
    if (event.dataState.sort) {
      dataState2 = {
        sort: event.dataState.sort,
        skip: event.dataState.skip,
        take: event.dataState.take,
        group: event.dataState.group,
      };
    }
    if (
      event.dataState.sort==undefined &&
      event.dataState.filter==undefined
    ) {
      dataState2 = {
        skip: event.dataState.skip,
        take: event.dataState.take,
        group: event.dataState.group,
      };
    }
    if (this.state.dataState.group.length==event.dataState.group.length) {
      return this.setState(
        {
          dataState: dataState2,
        },
        () => this.getInvoiceDetails(this.state.dataState, dataState2)
      );
    } else {
      event.dataState.group.length <= 2 && event.dataState.group.length >= 0
        ? this.setState(this.createAppState(event.dataState))
        : errorToastr(TWO_COLUMNS_GROUPED);
    }
  };

  expandChange = (event) => {
    event.dataItem[event.target.props.expandField] = event.value;
    this.setState({
      dataState: this.state.dataState,
    });
  };
}

export default VendorInvoiceDetails;