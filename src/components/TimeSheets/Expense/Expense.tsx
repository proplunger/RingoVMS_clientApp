import * as React from "react";
import axios from "axios";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { KendoFilter } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faFilePdf, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { dateFormatter, successToastr, infoToastr, history, initialDataState } from "../../../HelperMethods";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import { toODataString } from "@progress/kendo-data-query";
import { CommandCell, CustomHeaderActionCell, DownloadDocument, TotalAmountCell, VendorInvoiceNumberCell } from "./GlobalActions";
import AddExpense from "./AddExpense";
import { Dialog } from "@progress/kendo-react-dialogs";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { TimesheetStatus } from "../../Shared/AppConstants";
import auth from "../../Auth";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

export interface ExpenseProps {
  match: any;
}

export interface ExpenseState {
  data: any;
  status?: string;
  dataState: any;
  provider?: string;
  candidateId?: string;
  startDate?: string;
  endDate?: string;
  division?: string;
  location?: string;
  tsStatus?: string;
  tsStatusIntId?: number;
  showLoader?: boolean;
  tsWeekId?: string;
  showAddExpenseDialog?: boolean;
  showEditModal?: boolean;
  showRemoveModal?: boolean;
  candSubmissionId?: string;
  filters?: any;
}

class Expense extends React.Component<ExpenseProps, ExpenseState> {
  CustomHeaderActionCellTemplate: any;
  CommandCell;
  public dataItem: any;
  public expenseId: any;
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  constructor(props: ExpenseProps) {
    super(props);
    this.state = {
      data: [],
      dataState: initialDataState,
      provider: "-",
      status: "-",
      showLoader: true
    };
    this.initializeHeaderCell(true);
    this.initializeActionCell();
  }

  initializeHeaderCell = (canAdd) => {
    this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
      addNew: this.openNew,
      canAdd: canAdd
    })
  };

  initializeActionCell = () => {
    this.CommandCell = CommandCell({
      edit: this.edit,
      remove: this.remove,
    })

  };

  close = () => {
    this.setState({ showAddExpenseDialog: false });
    this.dataItem = undefined;
  };

  openNew = () => {
    this.dataItem = undefined;
    this.setState({ showAddExpenseDialog: true });
  };

  edit = (dataItem) => {
    this.dataItem = dataItem;
    this.setState({ showAddExpenseDialog: true });
  }

  remove = (dataItem) => {
    this.dataItem = dataItem;
    this.setState({ showRemoveModal: true });
  }

  deleteExpense = () => {
    this.setState({ showRemoveModal: false });
    axios.delete(`/api/ts/week/expense/${this.dataItem.expenseId}`).then((res) => {
      successToastr("Expense deleted successfully");
      this.getExpenses(this.state.dataState, this.state.tsWeekId);
    });
  };

  getWeekDetails = (tsWeekId) => {
    //this.setState({ showLoader: true });
    axios.get(`api/ts/week/${tsWeekId}/details`).then((res) => {
      this.setState({
        candidateId: res.data.candidateId,
        candSubmissionId: res.data.candSubmissionId,
        provider: res.data.provider,
        startDate: res.data.startDate,
        endDate: res.data.endDate,
        division: res.data.division,
        location: res.data.location,
        tsStatus: res.data.status,
        tsStatusIntId: res.data.statusIntId,
        filters: {
          clientId: auth.getClient(), divisionId: res.data.divisionId,
          locationId: res.data.locationId,
          positionId: res.data.positionId
        }
        //showLoader: false,
      });
    });
  };

  getExpenses = (dataState, tsWeekId) => {
    this.setState({ showLoader: true });
    var queryStr = `${toODataString(dataState, { utcDates: true })}`;
    const queryParams = `tsWeekId eq ${tsWeekId}`;
    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

    axios.get(`api/ts/week/expense?${finalQueryString}`).then((res) => {
      this.setState({
        data: res.data,
        showLoader: false,
        dataState: dataState,
      });
    });
  };

  downloadDoc = (dataItem) => {
    axios.get(`api/ts/documents?tsWeekId=${dataItem.expenseId}`).then((res) => {
      if (res.data) {
        if (res.data.length > 0) {
          res.data.forEach(doc => {
            DownloadDocument(doc.filePath)
          });
        }
        else {
          infoToastr("No documents uploaded.")
        }

      }
    });
  }

  stageAddedText = (stage, columnName) => {
    let text = "-";
    switch (stage) {
      case 0:
        text = "Timesheet";
        break;
      case 1:
        text = "Vendor Invoice";
        break;
      case 2:
        text = "Global level";
        break;
    }

    return (<td contextMenu={columnName} title={text}>
      {text}
    </td>);
  }

  onSaveAndNew = () => {
    this.close();
    setTimeout(() => {
      this.openNew();
    }, 50);
    this.getExpenses(this.state.dataState, this.state.tsWeekId);
  };

  onSaveAndClose = () => {
    this.close();
    this.getExpenses(this.state.dataState, this.state.tsWeekId);
  };

  onDataStateChange = (changeEvent) => {
    this.setState({ dataState: changeEvent.data });
    this.getExpenses(changeEvent.data, this.state.tsWeekId);
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.setState({ tsWeekId: id });
    this.getWeekDetails(id);
    this.getExpenses(this.state.dataState, id);
  }

  render() {
    const { provider, division, location, startDate, endDate, tsWeekId, candidateId, candSubmissionId } = this.state;
    return (
      <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
        <div className="container-fluid mt-3 mb-3">
          <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
            <div className="col-9 fonFifteen paddingLeftandRight">
            <BreadCrumbs globalData={{candSubmissionId:this.state.candSubmissionId,tsWeekId:this.state.tsWeekId}}></BreadCrumbs>
            </div>
            <div className="col-3 float-right text-dark d-flex justify-content-end">
                <span
                  onClick={() =>
                    history.goBack()
                  }
                  className="cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="nonactive-icon-color mr-2"
                  ></FontAwesomeIcon>
                  Timesheet
                </span>
                <span className="font-weight-normal">| Provider : </span>{" "}
                <span className="mr-1">{provider}</span>
              </div>
          </div>
          <div className="row mt-3">
            <div className="col-12 col-sm-4 pr-sm-0">
              <div className="row">
                <div className="col-auto text-right font-weight-normal pr-2">
                  Pay Period :
                </div>
                <div className="col font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                  {(startDate &&
                    dateFormatter(new Date(startDate)) +
                    " - " +
                    dateFormatter(new Date(endDate))) ||
                    "-"}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="row">
                <div className="col-auto col-sm-7 text-right font-weight-normal pr-2">
                  Division :
                </div>
                <div className="col col-sm-5 font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                  {division || "-"}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-4 pl-0">
              <div className="row justify-content-end ml-0 mr-0">
                <div className="col-auto col-sm text-right font-weight-normal pr-2 pl-lg-0">
                  Location :
                </div>
                <div className="col col-sm-auto font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                  {location || "-"}
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
                field="serviceType"
                title="Service Type"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Service Type")}
                filter="text"
              />
              <GridColumn
                field="date"
                filter="date"
                format="{0:d}"
                editor="date"
                title="Date"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Date")}
              />
              <GridColumn
                field="amount"
                title="Amount"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Amount", true)}
                footerCell={(props) =>
                  this.state.data.length > 0 &&
                  TotalAmountCell(props, this.state.data)
                }
              />
              <GridColumn
                field="invoiceNumber"
                title="Invoice Number"
                columnMenu={ColumnMenu}
                cell={(props) =>
                  props.dataItem.invoiceId ? VendorInvoiceNumberCell(props) : <td contextMenu="Invoice Number" title={props.dataItem.invoiceNumber}>-</td>
                }

              />
              <GridColumn
                field="stageAdded"
                title="Stage Added"
                columnMenu={ColumnMenu}
                cell={(props) => this.stageAddedText(props.dataItem.stageAdded, "Stage Added")}

              />
              <GridColumn
                field="attachedDocuments"
                title="Attached Documents"
                columnMenu={ColumnMenu}
                cell={(props) => (
                  <td contextMenu="Attached Documents">
                    <FontAwesomeIcon
                      className="nonactive-icon-color mr-2 cursor-pointer"
                      title="Download Document(s)"
                      icon={faFilePdf}
                      onClick={() => this.downloadDoc(props.dataItem)}
                    />
                  </td>
                )}
              />
              <GridColumn
                field="notes"
                title="Comment"
                headerClassName="text-left"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Comment")}
              />
              {(this.state.tsStatusIntId==TimesheetStatus.ACTIVE || this.state.tsStatusIntId==TimesheetStatus.REJECT) && (
                <GridColumn
                  title="Action"
                  headerClassName="status-active"
                  sortable={false}
                  width={70}
                  cell={this.CommandCell}
                  headerCell={this.CustomHeaderActionCellTemplate}
                />
              )}
            </Grid>
          </div>
          {this.state.showAddExpenseDialog && (
            <div id="hold-position">
              <Dialog className="col-12 For-all-responsive-height">
                <AddExpense
                  candSubmissionId={candSubmissionId}
                  candidateName={provider}
                  tsWeekId={tsWeekId}
                  dataItem={this.dataItem}
                  onCloseModal={this.close}
                  onSaveAndNew={this.onSaveAndNew}
                  onSaveAndClose={this.onSaveAndClose}
                  filters={this.state.filters}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                />
              </Dialog>
            </div>
          )}
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
            </div>
          </div>
        </div>
        <ConfirmationModal
          message={"Are you sure you want to delete the expense?"}
          showModal={this.state.showRemoveModal}
          handleYes={() => this.deleteExpense()}
          handleNo={() => {
            this.setState({ showRemoveModal: false });
          }}
        />
      </div>
    );
  }

}
export default Expense;
