import auth from "../../../Auth";
import {
  faMinusCircle,
  faPaperclip,
  faPlusCircle,
  faSave,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import * as React from "react";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import axios from "axios";
import {

  allowedFileExtentions,
  allowedMymeTypes,
  BillRateStatus,
  BillTypeFilters,
  VendorInvoiceServiceTypeId,
  
} from "../../../Shared/AppConstants";
import { localDateTime, successToastr } from "../../../../HelperMethods";
import { ErrorComponent } from "../../../ReusableComponents";
import Skeleton from "react-loading-skeleton";
import { DownloadDocument } from "../../../TimeSheets/Expense/GlobalActions";
import withValueField from "../../../Shared/withValueField";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { includes } from "lodash";
import {
  checkDuplicateExpense,
  getDebitCreditServiceTypes,
  getPayPeriodsByCandidate,
  getSubmittedCandidates,
} from "../../VendorService/Services";
import DuplicateConfirmationModal from "./DuplicateExpenseWarningModal";
import { ADD_EXPENSE_SUCCESS_MSG, UPDATE_EXPENSE_SUCCESS_MSG, VENDOR_INVOICE_DUPLICATE_CONFIRMATION_MSG } from "../../../Shared/AppMessages";
import { filterBy } from "@progress/kendo-data-query";
import { IDropDownModel } from "../../../Shared/Models/IDropDownModel";

const CustomDropDownList = withValueField(DropDownList);
export interface AddExpenseProps {
  dataItem?: any;
  onCloseModal?: any;
  onSaveAndNew?: any;
  onSaveAndClose?: any;
  tsWeekId?: string;
  candidateName?: string;
  candidateId?: string;
  positionId?: string;
  locationId?: string;
  optionName?: any;
  global?: boolean;
  Edit?: boolean;
  invoiceNumber?: any;
  candSubmissionId?: any;
  invoiceId?: any;
}

export interface AddExpenseState {
  clientId?: any;
  vendorId?: any;
  positionId?: any;
  divisionId?: any;
  locationId?: any;
  expenseId?: string;
  serviceTypes: Array<any>;
  serviceTypeId?: string;
  serviceTypeName?: string;
  adjServiceTypes: Array<any>;
  adjServiceTypeId?: string;
  adjServiceType?: any;
  adjServiceCategory: Array<any>;
  adjServiceCatId?: string;
  date?: any;
  amount?: any;
  notes?: any;
  billType: string;
  billTypeFilter?: any;
  maxAmount: string;
  quantity?: any;
  showLoader?: boolean;
  status?: string;
  showConfirmModal?: boolean;
  showAddModal?: boolean;
  openCommentBox?: boolean;
  fileArray?: any[];
  location?: any;
  division?: string;
  invoiceNumber?: any;
  payPeriod?: any;
  associateName?: any;
  selectedAssociate?: any;
  payPeriods?: any;
  payPeriodId?: any;
  associates: Array<IDropDownModel>;
  filteredassociates: Array<IDropDownModel>;
  tsWeekId?: any;
  showDuplicateWarningModal?: any;
  serviceType?: any;
  addAnother?: boolean;
  debitServiceTypeId?: string;
}

const defaultCatItem = { name: "Select...", id: null };
const defaultItem = { serviceTypeName: "Select...", serviceTypeId: null };
class AddExpense extends React.Component<AddExpenseProps, AddExpenseState> {
  validAmount = 0;
  isInvalidAmmount = false;
  public isSaveClicked = false;
  uploadControl: HTMLInputElement;
  constructor(props: AddExpenseProps) {
    super(props);
    this.state = {
      serviceTypes: [],
      adjServiceTypes: [],
      adjServiceCategory: [],
      associates: [],
      filteredassociates: [],
      showLoader: false,
      fileArray: [],
      billType: "-",
      maxAmount: "-",
      vendorId: auth.getVendor(),
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    const {
      optionName,
      dataItem,
      candidateId,
      global,
      candSubmissionId,
    } = this.props;
    this.getCandidates();
    if (optionName=="DebitCredit") {
      this.getServiceForDebitCredit();
      if (!global) {
        this.getAdjustmentServiceCategory();
      }
      this.initialSetData();
    } else {
      if (!global) {
        this.getCandSubDetails(candSubmissionId);
        this.initialSetData();
      } else {
        this.setState({ invoiceNumber: this.props.invoiceNumber });
      }
    }
  }

  initialSetData = () => {
    if (this.props.dataItem != undefined) {
      const { dataItem } = this.props;
      this.setState({
        division: dataItem.division,
        location: dataItem.location,
        payPeriod: dataItem.payPeriod,

        date:
          dataItem.expenseDate ==undefined || dataItem.expenseDate ==null
            ? null
            : new Date(dataItem.expenseDate),
        serviceType: this.props.Edit
          ? this.props.dataItem.serviceTypeId
          : "Debit",
        invoiceNumber: dataItem.vendorInvoiceNumber,
        amount: this.props.Edit ? dataItem.amount : 0,
        associateName: dataItem.associate,
        selectedAssociate: dataItem.associateId,
        payPeriodId: dataItem.tsWeekId,
        notes: dataItem.expenseNotes,
        quantity: dataItem.expenseQuantity,
        expenseId: dataItem.expenseId,
        adjServiceCatId: dataItem.adjServiceCatId,
        adjServiceTypeId: dataItem.adjServiceTypeId,
      }, () => {
         dataItem.adjServiceCatId && this.getAdjustmentServiceTypes(this.props.tsWeekId || this.state.tsWeekId, dataItem.adjServiceCatId)
     });
    }
  };

  getCandidates = () => {
    var queryParams = `invoiceId=${this.props.invoiceId}`;
    getSubmittedCandidates(queryParams).then((res) =>
      this.setState({
        associates: res.data,
        filteredassociates: res.data,
        invoiceNumber: this.props.invoiceNumber,
        tsWeekId: this.props.tsWeekId,
      })
    );
  };

  getPayPeriod = (associateId) => {
    if (associateId) {
      getPayPeriodsByCandidate(associateId, this.props.invoiceId).then((res) =>
        this.setState({
          payPeriods: res.data,
        })
      );
    }
  };

  getServiceForDebitCredit = () => {
    getDebitCreditServiceTypes().then((res) => {
      this.setState(
        {
          serviceTypes: res.data,
          serviceTypeId: this.props.Edit
            ? this.props.dataItem.serviceTypeId
            : res.data[res.data.length-1].id,                       //"a11506d3-5f37-40b3-9353-0231695de4bc", // Debit
          serviceType: this.props.Edit
            ? this.props.dataItem.serviceType
            : "Debit",
          debitServiceTypeId: res.data[res.data.length-1].id,
        },
        () => {
          this.initialSetData();
        }
      );
    });
  };

  getAdjustmentServiceCategory = () => {
    axios.get(`api/candidates/servicecat?$orderby=name`).then((res) => {
        this.setState({ adjServiceCategory: res.data });
    });
  }

  handleAdjustmentServiceCategoryChange = (e) => {
    const Id = e.value.id;
    this.setState({ adjServiceCatId: Id, adjServiceTypeId: null }, () => {
        if (Id !=null) {
            this.getAdjustmentServiceTypes(this.props.tsWeekId || this.state.tsWeekId, Id);
        } else {
            this.setState({ adjServiceTypes: [] })
        }
    });
  }

  getAdjustmentServiceTypes = (tsWeekId, adjServiceCategoryId) => {
    //this.setState({ adjServiceTypes: [], adjServiceTypeId: null });
    let apiUrl;
    apiUrl = "api/vendor/adjservicetype?";
    const queryParams = `tsWeekId=${tsWeekId}`;
    axios.get(`${apiUrl}${queryParams}&$filter=serviceCatId eq ${adjServiceCategoryId}&status ne '${BillRateStatus.REJECTED}'`).then((res) => {
      let services = this.dateWiseServiceTypes(res.data, this.state.date);
          //this.setState({ adjServiceTypes: res.data });
          this.setState({ adjServiceTypes: services });
    });
  };

  handleAdjustmentServiceTypeChange = (event) => {
    if (event.value.serviceTypeId==null) {
      this.setState({
        adjServiceTypeId: event.value.serviceTypeId,
        adjServiceType: event.value.serviceTypeName
      });
    } else {
      this.setState({
        adjServiceTypeId: event.value.serviceTypeId,
        adjServiceType: event.value.serviceTypeName
      });
    }
  };

  handleChangeNumeric = (e) => {
    let { name, value, type } = e.target;
    this.state[name] = value;
    this.setState(this.state);
    this.isInvalidAmmount = false;
  };

  handleChange = (e) => {
    let { name, value, type } = e.target;
    this.state[name] = value;
    this.setState(this.state);
    if (!(this.props.optionName=="DebitCredit")) {
      this.getExpenseServiceTypes(this.props.tsWeekId || this.state.tsWeekId);
    }
  };

  handleServiceTypeChange = (event) => {
    if (event.value.serviceTypeId==null) {
      this.setState({
        serviceTypeId: event.value.serviceTypeId,
        serviceType: event.value.serviceTypeName,
        billType: "-",
        maxAmount: "-",
      });
    } else {
      this.setState({
        serviceTypeId: event.value.serviceTypeId,
        serviceTypeName: event.value.serviceTypeName,
        billType: event.value.billTypeName,
        billTypeFilter: event.value.billTypeFilter,
        serviceType: event.value.serviceTypeName,
        maxAmount: event.value.billRate,
        quantity: event.value.billTypeFilter==BillTypeFilters.ONETIME ? 0 : this.state.quantity,
      });
    }
  };

  handlePayPeriodChange = (event) => {
    if (event.value.tsWeekId) {
      this.setState({
        payPeriodId: event.value.tsWeekId,
        division: event.value.division,
        location: event.value.location,
        tsWeekId: event.value.tsWeekId,
      });

      this.getCandSubDetails(event.value.candSubmissionId);
      if ((this.props.optionName=="DebitCredit")) {
        this.getAdjustmentServiceCategory();
      }
    } else {
      this.setState({
        payPeriodId: null,
      });
    }

  };

  candidateChange = (props) => {
    this.setState({ selectedAssociate: props.target.value, payPeriodId: null, serviceTypeId: this.state.debitServiceTypeId !=null ? this.state.debitServiceTypeId : null, date: null, quantity: 0, amount: 0, notes: "", fileArray: [] }, () => {
      props.target.value != null && props.target.value != undefined &&
        (this.getPayPeriod(props.target.value));
    });
  };

  getCandSubDetails = (candSubmissionId) => {
    axios.get(`api/ts/jobsummary?id=${candSubmissionId}`).then((res) => {
      this.setState(
        {
          clientId: res.data.clientId,
          positionId: res.data.positionId,
          divisionId: res.data.divisionId,
          locationId: res.data.locationId,
        },
        () => {
          this.props.optionName=="AddExpenses" &&
            this.getExpenseServiceTypes(this.props.tsWeekId || this.state.tsWeekId);
        }
      );
    });
  };

  getExpenseServiceTypes = (tsWeekId) => {
    this.setState({ serviceTypes: [], serviceTypeId: null });
    let apiUrl;
    apiUrl = "api/ts/week/expense/servicetype?";
    const queryParams = `tsWeekId=${tsWeekId}`;
    axios.get(`${apiUrl}${queryParams}&$filter=status ne '${BillRateStatus.REJECTED}'`).then((res) => {
      let services = this.dateWiseServiceTypes(res.data, this.state.date);
      // let rateCardParms = `clientId=${this.state.clientId}&divisionId=${this.state.divisionId}&locationId=${this.state.locationId}&positionId=${this.state.positionId}`;
      //       if(this.state.date){
      //           rateCardParms = `clientId=${this.state.clientId}&divisionId=${this.state.divisionId}&locationId=${this.state.locationId}&positionId=${this.state.positionId}&expenseDate=${this.state.date.toISOString()}`;
      //       }
      // axios
      //   .get(
      //     `api/ts/week/expense/ratecard/servicetype??${rateCardParms}`)
      //   .then((rcRes) => {
      //     let filtered = rcRes.data.filter(
      //       (c) => !services.find((e) => e.serviceTypeId ==c.serviceTypeId)
      //     );
          this.setState({ serviceTypes: [...services] }, () => {
            if (this.props.dataItem) {
              const {
                serviceTypeId,
                expenseId,
                associateId,
              } = this.props.dataItem;
              let serviceType = this.state.serviceTypes.find(x=> x.serviceTypeId==serviceTypeId
              );
              if (serviceType) {
                this.setState({
                  // expenseId: expenseId,
                  maxAmount: serviceType.billRate,
                  billType: serviceType.billTypeName,
                  billTypeFilter: serviceType.billTypeFilter,
                  serviceTypeName: serviceType.serviceTypeName
                });
              }
              if (this.props.optionName != "DebitCredit" && this.props.Edit) {
                this.getDocuments(expenseId);
                this.setState({
                  serviceTypeId: this.props.Edit
                    ? this.props.dataItem.serviceTypeId
                    : this.state.debitServiceTypeId                                                  //"a11506d3-5f37-40b3-9353-0231695de4bc"
                })
              }

            }
          });
        //});
    });
  };

  dateWiseServiceTypes = (allServices, startDate) => {
    let distinctServices = [];
    let boundryData = allServices.filter(x => new Date(x.startDate).setHours(0, 0, 0, 0) <= new Date(startDate).setHours(0, 0, 0, 0) && new Date(x.endDate).setHours(0, 0, 0, 0) >= new Date(startDate).setHours(0, 0, 0, 0));

    boundryData.forEach(element => {
      if (distinctServices.findIndex(x => x.serviceTypeId==element.serviceTypeId)==-1) {
        distinctServices.push(element);
      }
    });
    return distinctServices;
  }
  getDocuments = (entityId) => {
    axios.get(`api/ts/documents?tsWeekId=${entityId}`).then((res) => {
      if (res.data) {
        let fileArray = [...this.state.fileArray];
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
        fileArray.push({
          expenseId: undefined,
          fileName: file.name,
          file: file,
          isValid: isfileValid,
          path: undefined,
        });
      });
      this.setState({ fileArray: fileArray });
    }
  };

  removeFile = (index) => {
    let fileArray = this.state.fileArray;
    this.state.fileArray.splice(index, 1);
    this.setState({ fileArray: fileArray });
  };

  validate = () => {
    if (this.props.optionName=="DebitCredit") {
      if (
        this.state.amount==undefined ||
        this.state.amount==0 ||
        this.state.serviceTypeId==null ||
        this.state.serviceTypeId==undefined ||
        this.state.adjServiceTypeId==null ||
        this.state.adjServiceTypeId==undefined ||
        this.state.adjServiceCatId==null ||
        this.state.adjServiceCatId==undefined ||
        this.state.date==undefined ||
        this.state.date==null ||
        this.state.selectedAssociate==undefined ||
        this.state.selectedAssociate==null ||
        this.state.payPeriodId==undefined ||
        this.state.payPeriodId==null
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      if (
        this.state.amount==undefined ||
        this.state.amount==0 ||
        this.state.selectedAssociate==undefined ||
        this.state.selectedAssociate==null ||
        this.state.payPeriodId==undefined ||
        this.state.payPeriodId==null ||
        this.state.serviceTypeId==null ||
        this.state.serviceTypeId==undefined ||
        this.state.date==undefined ||
        this.state.date==null ||
        (this.state.billTypeFilter !=BillTypeFilters.ONETIME && (this.state.quantity==undefined ||
        this.state.quantity==0 ||
        !this.isAmountValid()))
      ) {
        return false;
      } if(this.state.billTypeFilter==BillTypeFilters.ONETIME){
        let isvalid = true;
        if ((this.state.amount !=undefined && this.state.amount !=0) && !isNaN(parseFloat(this.state.maxAmount))) {
            this.validAmount = parseFloat(this.state.maxAmount);
            if (this.state.amount > parseFloat(this.state.maxAmount)) {
                this.isInvalidAmmount = true
                isvalid = false;
            }
        }
        return isvalid;
      } else {
        return true;
      }
    }
  };

  isAmountValid = () => {
    let isvalid = true;
    if (this.state.amount > 0 && this.props.optionName=="DebitCredit") {
      return isvalid;
    } else {
      if (
        this.state.amount==0 ||
        (this.state.quantity !=undefined &&
          this.state.quantity !=0 &&
          this.state.amount !=undefined &&
          this.state.amount !=0 &&
          !isNaN(parseFloat(this.state.maxAmount)))
      ) {
        this.validAmount =
          parseInt(this.state.quantity) * parseFloat(this.state.maxAmount);
        if (
          this.state.amount >
          parseInt(this.state.quantity) * parseFloat(this.state.maxAmount)
        ) {
          this.isInvalidAmmount = true;
          isvalid = false;
        }
      }
    }
    return isvalid;
  };

  checkDuplicateExpense = (addNew) => {
    this.setState({ addAnother: addNew });
    if (this.validate() && this.props.Edit==false) {
      checkDuplicateExpense(
        this.state.serviceTypeId,
        this.state.tsWeekId
      ).then((res) =>
        res.data.length > 0
          ? this.setState({ showDuplicateWarningModal: true })
          : this.addExpense(addNew)
      );
    } else if (this.validate()) {
      this.addExpense(addNew);
    } else {
      this.isSaveClicked = true;
      this.setState(this.state);
    }
  };

  addExpense = (addnew) => {
    this.isSaveClicked = true;
    let checkNewFile =
      this.state.fileArray != undefined
        ? this.state.fileArray.filter((i) => i.candDocumentsId ==undefined)
        : [];

    if (
      checkNewFile.some((d) => d.isValid ==false) &&
      this.props.optionName != "DebitCredit"
    ) {
      alert(
        "Invalid file is attached. Please remove invalid file or attach another valid file."
      );
      return false;
    } else {
      if (this.validate()) {
        const {
          serviceTypeId,
          adjServiceTypeId,
          date,
          amount,
          notes,
          expenseId,
          quantity,
        } = this.state;
        if (this.props.dataItem.expenseId==null && this.props.Edit==false) {
          const data = {
            tsWeekId: this.state.tsWeekId,
            serviceTypeId: serviceTypeId,
            adjServiceTypeId: adjServiceTypeId,
            date: localDateTime(date),
            quantity: quantity,
            amount: amount,
            notes: notes,
            isDuplicate: this.state.showDuplicateWarningModal,
            invoiceId: this.props.global ? this.props.invoiceId : null,
            stageAdded: this.props.global ? 2 : 1
          };
          axios
            .post("/api/ts/week/expense", JSON.stringify(data))
            .then((res) => {
              if (res.data) {
                if (checkNewFile.length > 0) {
                  let formData = new FormData();
                  checkNewFile.map((item) => {
                    formData.append("FormFiles", item.file);
                  });
                  formData.append("entityId", res.data);
                  formData.append("entityName", res.data);
                  axios
                    .post(`/api/ts/documents`, formData)
                    .then((response) => response)
                    .then((data) => {
                      successToastr(ADD_EXPENSE_SUCCESS_MSG);
                      if (addnew) {
                        this.setState(
                          { showDuplicateWarningModal: false },
                          () => this.props.onSaveAndNew()
                        );
                      } else {
                        this.setState(
                          { showDuplicateWarningModal: false },
                          () => this.props.onSaveAndClose()
                        );
                      }
                    });
                } else {
                  successToastr(ADD_EXPENSE_SUCCESS_MSG);
                  if (addnew) {
                    this.setState({ showDuplicateWarningModal: false }, () =>
                      this.props.onSaveAndNew()
                    );
                  } else {
                    this.setState({ showDuplicateWarningModal: false }, () =>
                      this.props.onSaveAndClose()
                    );
                  }
                }
              }
            });
        } else {
          const data = {
            expenseId: expenseId,
            serviceTypeId: serviceTypeId,
            adjServiceTypeId: adjServiceTypeId,
            date: localDateTime(date),
            quantity: quantity,
            amount: amount,
            notes: notes,
            isDuplicate: this.props.Edit
              ? this.props.dataItem.expenseIsDuplicate
              : this.state.showDuplicateWarningModal,
          };
          axios
            .put("/api/ts/week/expense", JSON.stringify(data))
            .then((res) => {
              if (res.data) {
                if (checkNewFile.length > 0) {
                  let formData = new FormData();
                  checkNewFile.map((item) => {
                    formData.append("FormFiles", item.file);
                  });
                  formData.append("entityId", expenseId);
                  formData.append("entityName", "CandExpense");
                  axios
                    .post(`/api/ts/documents`, formData)
                    .then((response) => response)
                    .then((data) => {
                      successToastr(UPDATE_EXPENSE_SUCCESS_MSG);
                      if (addnew) {
                        this.setState(
                          { showDuplicateWarningModal: false },
                          () => this.props.onSaveAndNew()
                        );
                      } else {
                        this.setState(
                          { showDuplicateWarningModal: false },
                          () => this.props.onSaveAndClose()
                        );
                      }
                    });
                } else {
                  successToastr(UPDATE_EXPENSE_SUCCESS_MSG);
                  if (addnew) {
                    this.setState({ showDuplicateWarningModal: false }, () =>
                      this.props.onSaveAndNew()
                    );
                  } else {
                    this.setState({ showDuplicateWarningModal: false }, () =>
                      this.props.onSaveAndClose()
                    );
                  }
                }
              }
            });
        }
      } else {
        this.setState(this.state);
        return false;
      }
    }
  };

  handleFilterChange(event) {
    var name = event.target.props.id;
    var originalArray = "filtered" + name;
    this.state[name] = this.filterData(event.filter, originalArray);
    this.setState(this.state);
  }

  filterData(filter, originalArray) {
    const originalData = this.state[originalArray];
    return filterBy(originalData, filter);
  }

  render() {
    document.getElementsByName("date").length > 0 && (document.getElementsByName("date")[0]["disabled"] = true);
    return (
      <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
        <div className="modal-content border-0">
          <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
            <h4 className="modal-title text-white fontFifteen">
              {this.props.optionName=="AddExpenses"
                ? "Add Expenses"
                : "Debit / Credit Adjustment"}
              {!this.props.global && " -"}
              <span> {this.props.candidateName} </span>
            </h4>
            <button
              type="button"
              className="close text-white close_opacity"
              data-dismiss="modal"
              onClick={this.props.onCloseModal}
            >
              &times;
            </button>
          </div>

          {this.state.showLoader &&
            Array.from({ length: 2 }).map((item, i) => (
              <div className="row col-12 mx-auto mt-2" key={i}>
                {Array.from({ length: 3 }).map((item, j) => (
                  <div
                    className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1"
                    key={j}
                  >
                    <Skeleton width={100} />
                    <Skeleton height={30} />
                  </div>
                ))}
              </div>
            ))}
          {!this.state.showLoader && (
            <div className="col-12 mt-3">
              <div className="row">
                <div className="col-12 mt-0">
                  <div className="row">
                    <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
                      <label
                        className={`mb-1 font-weight-bold ${this.props.global ? "required" : ""
                          }`}
                      >
                        Associate Name
                      </label>
                      {this.state.associateName != "" &&
                        this.state.associateName != undefined ? (
                        <input
                          type="text"
                          className="form-control"
                          disabled
                          value={this.state.associateName}
                        ></input>
                      ) : (
                        <CustomDropDownList
                          className="form-control disabled"
                          data={this.state.associates}
                          name={`associateId`}
                          id="associates"
                          textField="name"
                          valueField="id"
                          defaultItem={{
                            name: "Select Associate Name",
                            id: null,
                          }}
                          value={this.state.selectedAssociate}
                          onChange={(e) => this.candidateChange(e)}
                          filterable={
                            this.state.filteredassociates.length > 5
                              ? true
                              : false
                          }
                          onFilterChange={this.handleFilterChange}
                        />
                      )}
                      {this.isSaveClicked &&
                        (this.state.selectedAssociate==null ||
                          this.state.selectedAssociate==undefined) && (
                          <ErrorComponent />
                        )}
                    </div>
                    <div
                      className={`col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0`}
                      id="ShowDatePickerIcon"
                    >
                      <label
                        className={`mb-1 font-weight-bold ${this.props.global ? "required" : ""
                          }`}
                      >
                        Pay Period
                      </label>
                      {this.state.payPeriod != "" &&
                        this.state.payPeriod != undefined ? (
                        <input
                          type="text"
                          className="form-control"
                          disabled
                          value={this.state.payPeriod}
                        ></input>
                      ) : (
                        <CustomDropDownList
                          className="form-control disabled"
                          data={this.state.payPeriods}
                          name="payPeriodId"
                          textField="payPeriod"
                          disabled={
                            this.state.selectedAssociate==undefined
                              ? true
                              : false
                          }
                          valueField="tsWeekId"
                          defaultItem={{
                            payPeriod: "Select...",
                            id: null,
                          }}
                          value={this.state.payPeriodId}
                          onChange={(e) => this.handlePayPeriodChange(e)}
                          id="payPeriod"
                        />
                      )}
                      {this.isSaveClicked &&
                        (this.state.payPeriodId==null ||
                          this.state.payPeriodId==undefined) && (
                          <ErrorComponent />
                        )}
                    </div>

                    {this.props.optionName=="DebitCredit" && (
                      <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold">
                          Division
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          disabled
                          value={this.state.division}
                        ></input>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-12 mt-0">
                  <div className="row">
                    {/* {this.props.optionName=="AddExpenses" && (
                      <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold">
                          Bill Type
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          disabled
                          value={this.state.billType}
                        ></input>
                      </div>
                    )} */}
                    {this.props.optionName=="DebitCredit" && (
                      <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold">
                          Location
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          disabled
                          value={this.state.location}
                        ></input>
                      </div>
                    )}
                    {this.props.optionName=="DebitCredit" && (
                      <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold">
                          Invoice#
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          disabled
                          value={this.state.invoiceNumber}
                        ></input>
                      </div>
                    )}
                    {this.props.optionName=="AddExpenses" && (
                      <div
                        className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0"
                        id="ShowDatePickerIcon"
                      >
                        <label className="mb-1 font-weight-bold required">
                          Date
                        </label>
                        <DatePicker
                          className="form-control release-date-ddl kendo-Tabledatepicker"
                          format="MM/dd/yyyy"
                          name="date"
                          value={this.state.date}
                          onChange={(e) => this.handleChange(e)}
                          formatPlaceholder="formatPattern"
                          max={new Date()}
                          disabled={!this.state.tsWeekId}
                        />
                        {this.isSaveClicked &&
                          (this.state.date==undefined ||
                            this.state.date==null) && <ErrorComponent />}
                      </div>
                    )}
                    {this.props.optionName=="AddExpenses" && (
                      <React.Fragment>
                        <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
                          <label className={`mb-1 font-weight-bold required`}>
                            Service Type
                          </label>
                          {this.props.optionName=="AddExpenses" && (
                            <CustomDropDownList
                              className="form-control"
                              data={this.state.serviceTypes}
                              disabled={
                                this.state.date==undefined ? true : false
                              }
                              name="serviceTypeId"
                              textField="serviceTypeName"
                              valueField="serviceTypeId"
                              defaultItem={defaultItem}
                              value={this.state.serviceTypeId}
                              onChange={(e) => this.handleServiceTypeChange(e)}
                              id="serviceTypes"
                            />
                          )}
                          {this.isSaveClicked &&
                            (this.state.serviceTypeId==null ||
                              this.state.serviceTypeId==undefined) && (
                              <ErrorComponent />
                            )}
                        </div>
                        {this.state.billTypeFilter !=BillTypeFilters.ONETIME && (
                        <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0">
                          <label className="mb-1 font-weight-bold required">
                            {this.state.billType=="Weekly" ? "No. of Weeks" : this.state.billType=="Hourly" ? "No. of Hours" : "No. of Days"}
                          </label>
                          <NumericTextBox
                            className="form-control"
                            value={
                              isNaN(this.state.quantity) ? 0 : this.state.quantity > 999 ? 999 : this.state.quantity
                            }
                            min={0}
                            max={999}
                            name="quantity"
                            onChange={(e) => this.handleChangeNumeric(e)}
                          />
                          {this.isSaveClicked && this.state.billTypeFilter !=BillTypeFilters.ONETIME &&
                            (this.state.quantity==undefined ||
                              this.state.quantity==0) && <ErrorComponent />}
                        </div>
                        )}
                      </React.Fragment>
                    )}
                    {this.props.optionName=="DebitCredit" && (
                      <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0">
                        <label className="mb-1 font-weight-bold required">
                          Adjustment Type
                        </label>
                        <div className="d-flex">
                          {this.state.serviceTypes != undefined &&
                            this.state.serviceTypes.map((i, index) => (
                              <label className="container container_checkboxandradio radioBtnCustom font-weight-normal col-auto ml-0 mr-0">
                                {i.name} {i.intId==VendorInvoiceServiceTypeId.CREDIT ? <FontAwesomeIcon className="faclock_size font-weight-bold mx-1" icon={faPlusCircle} style={{ color: "#108E64" }}/> 
                                                                                       : <FontAwesomeIcon className="faclock_size font-weight-bold mx-1" icon={faMinusCircle} style={{ color: "#DE350B" }}/>}
                                {
                                  <input
                                    type="radio"
                                    name={i.name}
                                    defaultChecked={index==0}
                                    onChange={(e) =>
                                      this.setState({
                                        serviceTypeId: e.target.value,
                                      })
                                    }
                                    value={i.id}
                                    checked={this.state.serviceTypeId==i.id}
                                  />
                                }
                                <span className="checkmark"></span>
                              </label>
                            ))}

                          <br />
                        </div>
                        {this.isSaveClicked &&
                          (this.state.serviceTypeId==null ||
                            this.state.serviceTypeId==undefined) && (
                            <ErrorComponent />
                          )}
                      </div>
                    )}
                  </div>

                  <div className="row"></div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-12">
                  <div className="row">
                    {this.props.optionName=="DebitCredit" && (
                    <React.Fragment>
                      <div
                        className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0"
                        id="ShowDatePickerIcon"
                      >
                        <label className="mb-1 font-weight-bold required">
                          Date
                        </label>
                        <DatePicker
                          className="form-control release-date-ddl kendo-Tabledatepicker"
                          format="MM/dd/yyyy"
                          name="date"
                          value={this.state.date}
                          onChange={(e) => this.handleChange(e)}
                          formatPlaceholder="formatPattern"
                        />
                        {this.isSaveClicked &&
                          (this.state.date==undefined ||
                            this.state.date==null) && <ErrorComponent />}
                      </div>

                      <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
                          <label className={`mb-1 font-weight-bold required`}>
                            Service Category
                          </label>
                            <CustomDropDownList
                              className="form-control"
                              disabled={
                                this.state.date==undefined ? true : false
                              }
                              data={this.state.adjServiceCategory}
                              name="serviceTypeId"
                              textField="name"
                              valueField="id"
                              defaultItem={defaultCatItem}
                              value={this.state.adjServiceCatId}
                              onChange={(e) => this.handleAdjustmentServiceCategoryChange(e)}
                              id="serviceCategory"
                            />
                          {this.isSaveClicked &&
                            (this.state.adjServiceCatId==null ||
                              this.state.adjServiceCatId==undefined) && (
                              <ErrorComponent />
                            )}
                      </div>

                      <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
                          <label className={`mb-1 font-weight-bold required`}>
                            Service Type
                          </label>
                            <CustomDropDownList
                              className="form-control"
                              data={this.state.adjServiceTypes}
                              disabled={!this.state.adjServiceCatId}
                              name="serviceTypeId"
                              textField="serviceTypeName"
                              valueField="serviceTypeId"
                              defaultItem={defaultItem}
                              value={this.state.adjServiceTypeId}
                              onChange={(e) => this.handleAdjustmentServiceTypeChange(e)}
                              id="serviceTypes"
                            />
                          {this.isSaveClicked &&
                            (this.state.adjServiceTypeId==null ||
                              this.state.adjServiceTypeId==undefined) && (
                              <ErrorComponent />
                            )}
                      </div>
                    </React.Fragment>
                    )}
                    <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0">
                      <label className="mb-1 font-weight-bold required">
                        {this.props.optionName=="AddExpenses"
                          ? "Total Amount"
                          : "Amount"}
                      </label>
                      <NumericTextBox
                        className="form-control"
                        placeholder="Enter Total Amount"
                        value={isNaN(this.state.amount) ? 0 : this.state.amount}
                        format="c2"
                        min={0}
                        max={99999}
                        name="amount"
                        onChange={(e) => this.handleChangeNumeric(e)}
                      />
                      {this.isSaveClicked &&
                        (this.state.amount==undefined ||
                          this.state.amount==0) && <ErrorComponent />}
                      {this.isSaveClicked && this.isInvalidAmmount && (
                        <span
                          role="alert"
                          className="k-form-error k-text-start"
                        >
                          Total amount for {(this.state.billTypeFilter !=BillTypeFilters.ONETIME) && this.state.quantity} {this.state.billType=="Weekly" ? "week(s)" : this.state.billType=="Hourly" ? "hour(s)" : this.state.billType== "Daily" ? "day(s)" : this.state.serviceTypeName} cannot be
                          more than ${this.validAmount}.
                        </span>
                      )}
                    </div>
                    <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0">
                      <label className="mb-1 font-weight-bold">Notes</label>
                      <textarea
                        rows={2}
                        id="noteHistoryBox"
                        maxLength={2000}
                        value={this.state.notes}
                        className="form-control noteHistory mt-0"
                        onChange={(event) => {
                          this.setState({ notes: event.target.value });
                        }}
                      />
                    </div>
                    {this.props.optionName=="AddExpenses" && (
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
                        <label className="mb-1 font-weight-bold ">
                          Upload Documents
                          <span
                            onClick={() => {
                              this.uploadControl.click();
                            }}
                            className="text-underline cursorElement align-middle"
                          >
                            <FontAwesomeIcon
                              icon={faPaperclip}
                              className="ml-1 active-icon-blue ClockFontSize"
                            />
                          </span>
                        </label>

                        <div className="file-list">
                          {this.state.fileArray.length > 0 &&
                            this.state.fileArray.map((file, i) => (
                              <span>
                                <span
                                  title={file.fileName}
                                  onClick={() =>
                                    file.candDocumentsId &&
                                    DownloadDocument(file.path)
                                  }
                                  className={
                                    file.isValid ? "valid-file" : "invalid-file"
                                  }
                                >
                                  {file.fileName}
                                </span>
                                <span
                                  title="Remove"
                                  className="remove"
                                  onClick={() => this.removeFile(i)}
                                >
                                  X
                                </span>
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="col-12">
            <div className="col-sm-12 col-12 p-2">
              <div className="row text-center">
                <div className="col-12 mt-4 mb-4 heello">
                  <div className="row ml-sm-0 mr-sm-0 justify-content-center">
                    <button
                      type="button"
                      className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                      onClick={this.props.onCloseModal}
                    >
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className={"mr-1"}
                      />
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                      onClick={() =>
                        this.props.optionName=="AddExpenses"
                          ? this.checkDuplicateExpense(true)
                          : this.addExpense(true)
                      }
                    >
                      <FontAwesomeIcon icon={faSave} className={"mr-1"} />
                      Save &amp; Add Another
                    </button>
                    <button
                      type="button"
                      className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                      onClick={() =>
                        this.props.optionName=="AddExpenses"
                          ? this.checkDuplicateExpense(false)
                          : this.addExpense(false)
                      }
                    >
                      <FontAwesomeIcon icon={faSave} className={"mr-1"} />
                      Save &amp; Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.showDuplicateWarningModal && (
          <DuplicateConfirmationModal
            message={VENDOR_INVOICE_DUPLICATE_CONFIRMATION_MSG(this.state)}
            showModal={this.state.showDuplicateWarningModal}
            handleYes={(e) => this.addExpense(this.state.addAnother)}
            data={this.state}
            handleNo={() => {
              this.setState({ showDuplicateWarningModal: false });
            }}
          />
        )}
      </div>
    );
  }
}
export default AddExpense;
