import * as React from "react";
import axios from "axios";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { KendoFilter } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { successToastr, history, initialDataState, currencyFormatter } from "../../../HelperMethods";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { toODataString } from "@progress/kendo-data-query";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { ExpenseStatuses, VendorInvoiceServiceTypeId, VendorInvoiceStatusIds } from "../../Shared/AppConstants"
import { TS_VENDOR_AUTHORIZE_CONFIRMATION_MSG, VI_ACTIVE_CONFIRMATION_MSG } from "../../Shared/AppMessages";

export interface UnderReviewExpensesDetailsProps {
  match: any;
}

export interface UnderReviewExpensesDetailsState {
  data: any;
  dataState: any;
  showLoader?: boolean;
  vendorInvoiceId?: string;
  vendorInvoiceNumber?: string;
  vendor?: string;
  showConfirmationModal?: any;
  showActiveModal?: any;
  approverComments?: any;
  approverCommentError?: any;
}

class UnderReviewExpensesDetails extends React.Component<UnderReviewExpensesDetailsProps, UnderReviewExpensesDetailsState> {
  CustomHeaderActionCellTemplate: any;
  CommandCell;
  public dataItem: any;
  public expenseId: any;
  private userClientLobId: any = localStorage.getItem("UserClientLobId");
  constructor(props: UnderReviewExpensesDetailsProps) {
    super(props);
    this.state = {
      data: [],
      dataState: initialDataState,
      showLoader: true,
      approverComments: "",
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.setState({ vendorInvoiceId: id });
    this.getVIExpenses(this.state.dataState, id);
  }

  getVIExpenses = (dataState, vendorInvoiceId) => {
    this.setState({ showLoader: true });
    var queryStr = `${toODataString(dataState, { utcDates: true })}`;
    const queryParams = `expenseId ne null and expenseStatus eq '${ExpenseStatuses.UNDERREVIEW}'`;
    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

    axios.get(`api/vendor/invoice/${vendorInvoiceId}?${finalQueryString}`).then((res) => {
      this.setState({
        data: res.data,
        vendorInvoiceNumber: res.data[0].vendorInvoiceNumber,
        vendor: res.data[0].vendorName,
        showLoader: false,
        dataState: dataState,
      });
    });
  };

  commentsChange = (e) => this.setState({ approverComments: e.target.value, approverCommentError: e.target.value=="" });

  updateVIStatus = (status) => {
    if (status==VendorInvoiceStatusIds.ACTIVE && !this.state.approverComments.replace(/^\s+|\s+$/g, "")) {
      this.setState({ approverCommentError: true });
      return;
    }
    let data = {
      id: [this.state.vendorInvoiceId],
      statusId: status,
      clientLobId: this.userClientLobId,
      comment: this.state.approverComments
    };
    axios.patch(`api/vendor/invoices/status`, data).then((res) => {
      successToastr("Vendor Invoice updated successfully!");
      history.goBack();
    });
  };

  onDataStateChange = (changeEvent) => {
    this.setState({ dataState: changeEvent.data });
    this.getVIExpenses(changeEvent.data, this.state.vendorInvoiceId);
  };

  TotalAmountCell = (props, data) => {
    let total = 0;

    const totalWithoutDebitAmountData = data.filter((i) => i.serviceTypeIntId != 6);
    const totalAmoutithoutDebit = totalWithoutDebitAmountData.reduce((acc, current) => acc + current[props.field], 0);
    const totalDebitData = data.filter((i) => i.serviceTypeIntId==VendorInvoiceServiceTypeId.DEBIT);
    const debitDataAmount = totalDebitData.reduce((acc, current) => acc + current[props.field], 0);
    total = totalAmoutithoutDebit - debitDataAmount;
    return (
      <td className="expenses-total" colSpan={8} style={props.style}>
        <div className="row mx-0 d-flex justify-content-center align-items-center">
          <div className="col-auto col-lg-auto font-weight-bold pl-0 pr-2">
            Total Expenses:
          </div>
          <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0"> {currencyFormatter(total.toFixed(2))}</div>
        </div>
      </td>
    );
  };

  render() {
    const { vendor, vendorInvoiceNumber } = this.state;
    return (
      <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
        <div className="container-fluid mt-3 mb-3">
          <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
            <div className="col-12 fonFifteen paddingLeftandRight">
              Expenses
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12 col-sm-6 pr-sm-0">
              <div className="row">
                <div className="col-auto text-right font-weight-normal pr-2">
                  Vendor Invoice Number :
                </div>
                <div className="col font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                  {vendorInvoiceNumber || "-"}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 pl-0">
              <div className="row justify-content-end ml-0 mr-0">
                <div className="col-auto col-sm text-right font-weight-normal pr-2 pl-lg-0">
                  Vendor :
                </div>
                <div className="col col-sm-auto font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                  {vendor || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="myOrderContainer expense-grid-responsive global-action-grid-status-active expenses-timesheet">
            <Grid
              style={{ height: "auto" }}
              sortable={true}
              onDataStateChange={this.onDataStateChange}
              data={this.state.data}
              {...this.state.dataState}
              className="kendo-grid-custom lastchild"
              selectedField="selected"
            >
              <GridNoRecords>
                {GridNoRecord(this.state.showLoader)}
              </GridNoRecords>
              <GridColumn
                field="vendorInvoiceNumber"
                title="Invoice Number"
                width="180px"
                // cell={(props) =>
                //   VendorInvoiceNumberCell(props, this.state.clientInvoiceId)
                //}
                columnMenu={ColumnMenu}
              />
              <GridColumn
                field="serviceType"
                title="Service Type"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Service Type")}
                filter="text"
              />
              <GridColumn
                field="expenseDate"
                filter="date"
                format="{0:d}"
                editor="date"
                title="Date"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Date")}
              />
              <GridColumn
                field="amount"
                //width="110px"
                title="Amount"
                headerClassName="text-right pr-4"
                filter="numeric"
                cell={(props) => {
                  return (
                    <td
                      contextMenu={"Amount"}
                      className="pr-4"
                      style={{ textAlign: "right" }}
                      title={props.dataItem.amount}
                    >
                      {currencyFormatter(props.dataItem.amount)}
                    </td>
                  );
                }}
                columnMenu={ColumnMenu}
                footerCell={(props) =>
                  this.state.data.length > 0 &&
                  this.TotalAmountCell(props, this.state.data)
                }
              />
            </Grid>
          </div>
          <div className="row mb-2 mb-lg-4 ml-sm-0 mr-sm-0">
            <div className="col-12 mt-5 text-sm-center text-center font-regular">
              <button
                onClick={() => history.goBack()}
                type="button"
                className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
              >
                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                Close
              </button>
              <button
                type="button"
                onClick={() => this.setState({ showActiveModal: true })}
                className="btn button button-active-green mr-2 shadow mb-2 mb-xl-0"
              >
                <FontAwesomeIcon icon={faThumbsDown} className={"mr-2"} />
                Set To Active
              </button>
              <button
                type="button"
                onClick={() => this.setState({ showConfirmationModal: true })}
                className="btn button button-regular font-weight-bold mr-3 rounded shadow mb-2 mb-xl-0"
              >
                <FontAwesomeIcon icon={faThumbsUp} className={"mr-2"} />
                Set To Vendor Authorized
              </button>
            </div>
          </div>
        </div>
        <ConfirmationModal
          message={VI_ACTIVE_CONFIRMATION_MSG()}
          showModal={this.state.showActiveModal}
          handleYes={() => this.updateVIStatus(VendorInvoiceStatusIds.ACTIVE)}
          enterComments
          commentsRequired
          commentsChange={this.commentsChange}
          comments={this.state.approverComments}
          handleNo={() => {
            this.setState({ approverComments: "", showActiveModal: false });
          }}
          showError={this.state.approverCommentError}
        />
        <ConfirmationModal
          message={TS_VENDOR_AUTHORIZE_CONFIRMATION_MSG()}
          showModal={this.state.showConfirmationModal}
          handleYes={() => this.updateVIStatus(VendorInvoiceStatusIds.VENDORAUTHORIZED)}
          enterComments
          commentsChange={this.commentsChange}
          comments={this.state.approverComments}
          handleNo={() => {
            this.setState({ approverComments: "", showConfirmationModal: false });
          }}
        />
      </div>
    );
  }

}
export default UnderReviewExpensesDetails;