import { faPaperclip, faSave, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import * as React from "react";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import axios from "axios";
import {  allowedFileExtentions, allowedMymeTypes, BillRateStatus, BillTypeFilters, } from "../../Shared/AppConstants";
import { ADD_EXPENSE_SUCCESS_MSG,UPDATE_BILL_RATE_SUCCESS_MSG, UPDATE_EXPENSE_SUCCESS_MSG } from "../../Shared/AppMessages";
import { successToastr, toLocalDateTime } from "../../../HelperMethods";
import { ErrorComponent, KendoFilter } from "../../ReusableComponents";
import Skeleton from "react-loading-skeleton";
import { DownloadDocument } from "./GlobalActions";
import withValueField from "../../Shared/withValueField";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { includes } from "lodash";
import _ from "lodash";
import { toODataString } from "@progress/kendo-data-query";
import AlertBox from "../../Shared/AlertBox";

const CustomDropDownList = withValueField(DropDownList);
export interface AddExpenseProps {
    dataItem?: any;
    onCloseModal?: any;
    onSaveAndNew?: any;
    onSaveAndClose?: any;
    tsWeekId: string;
    candidateName: string;
    candSubmissionId: string;
    positionId?: string;
    locationId?: string;
    filters?: any;
    startDate?: any;
    endDate?: any;
}

export interface AddExpenseState {
    clientId?: any;
    positionId?: any;
    divisionId?: any;
    locationId?: any;
    expenseId?: string;
    serviceTypes: Array<any>;
    serviceTypeId?: string;
    serviceTypeName?: string;
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
    expenses?: any[];
    dataState: any;
    openAlert?: boolean;
    payPeriodStart?: any;
    payPeriodEnd?: any;
}
const initialDataState = {
    skip: 0,
    take: 50,
};
const defaultItem = { serviceTypeName: "Select...", serviceTypeId: null };
class AddExpense extends React.Component<AddExpenseProps, AddExpenseState>{
    validAmount = 0;
    isInvalidAmmount = false;
    public isSaveClicked = false;
    public alertMessage;
    uploadControl: HTMLInputElement;
    constructor(props: AddExpenseProps) {
        super(props);
        this.state = {
            serviceTypes: [],
            showLoader: false,
            fileArray: [],
            billType: "-",
            maxAmount: "-",
            expenses: [],
            dataState: initialDataState,
        };

    }

    componentDidMount() {
        if(this.props.dataItem && this.props.dataItem.serviceTypeId){
            this.setState({date:new Date(this.props.dataItem.date)});
            this.getExpenseServiceTypes(this.props.tsWeekId, true);
        }

        if (this.props.dataItem && this.props.dataItem.startDate && this.props.dataItem.endDate){
            this.setState({
                payPeriodStart: this.props.dataItem.startDate,
                payPeriodEnd: this.props.dataItem.endDate});
        }else{
            
            this.setState({
                payPeriodStart: this.props.startDate,
                payPeriodEnd: this.props.endDate});
        }
        this.getExpenses();
    }

    numberRestrictionFunction = (evt) => {
        (evt.key =="e" || evt.key =="+" || evt.key =="-" || evt.key ==".") &&
            evt.preventDefault();
    };
    numberRestrictionFunctionOnPaste = (evt) =>
        //(evt.key =="e" || evt.key =="+" || evt.key =="-" || evt.key ==".") &&
        evt.preventDefault();

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
        this.getExpenseServiceTypes(this.props.tsWeekId, false);
    };

    handleServiceTypeChange = (event) => {
        if (this.ifServiceTypeExists(event.value.serviceTypeId)) {
            this.alertMessage = event.value.serviceTypeName + " already added in expense.";
            this.setState({ openAlert: true });
            return false;
        }
        else {
            if (event.value.serviceTypeId==null) {
                this.setState({ serviceTypeId: event.value.serviceTypeId, billType: "-", maxAmount: "-" });
            }
            else {
                this.setState({ serviceTypeId: event.value.serviceTypeId, serviceTypeName: event.value.serviceTypeName, billType: event.value.billTypeName, billTypeFilter: event.value.billTypeFilter, maxAmount: event.value.billRate, quantity: event.value.billTypeFilter==BillTypeFilters.ONETIME ? 0 : this.state.quantity });
            }
        }
    }

    ifServiceTypeExists = (value) => {
        return _.find(this.state.expenses, ["serviceTypeId", value]);
    }

    // getCandSubDetails = (candSubmissionId) => {
    //     axios.get(`api/ts/jobsummary?id=${candSubmissionId}`).then((res) => {
    //         this.setState({
    //             clientId: res.data.clientId,
    //             positionId: res.data.positionId,
    //             divisionId: res.data.divisionId,
    //             locationId: res.data.locationId
    //         }, () => {
    //             this.getExpenseServiceTypes();
    //         });
    //     });
    // }
    //axios.get(`api/ts/week/expense/servicetype?${queryParams}`)
    /// to do

    getExpenseServiceTypes = (tsWeekId, inEdit) => {
        this.setState({serviceTypes:[], serviceTypeId:null});
        const queryParams = `tsWeekId=${tsWeekId}`;
        axios.get(`api/ts/week/expense/servicetype?${queryParams}&$filter=status ne '${BillRateStatus.REJECTED}'`).then((res) => {
            let services = this.dateWiseServiceTypes(res.data, this.state.date || this.props.dataItem.date);
            // let rateCardParms = `clientId=${this.props.filters.clientId}&divisionId=${this.props.filters.divisionId}&locationId=${this.props.filters.locationId}&positionId=${this.props.filters.positionId}`;
            // if(this.state.date){
            //     rateCardParms = `clientId=${this.props.filters.clientId}&divisionId=${this.props.filters.divisionId}&locationId=${this.props.filters.locationId}&positionId=${this.props.filters.positionId}&expenseDate=${this.state.date.toISOString()}`;
            // }
            // axios.get(`api/ts/week/expense/ratecard/servicetype?${rateCardParms}`).then(rcRes => {
            //     let filtered = rcRes.data.filter(c => !services.find(e => (e.serviceTypeId ==c.serviceTypeId)));
                this.setState({ serviceTypes: [...services] },
                    () => {
                        if (this.props.dataItem && inEdit) {
                            const { serviceTypeId, amount, quantity, date, notes, expenseId } = this.props.dataItem;
                            let serviceType = this.state.serviceTypes.find(x => x.serviceTypeId==serviceTypeId);
                            if (serviceType) {
                                this.setState({ expenseId: expenseId, serviceTypeId: serviceTypeId, amount: amount, quantity: quantity, date: new Date(date), notes: notes, maxAmount: serviceType.billRate, billType: serviceType.billTypeName, billTypeFilter: serviceType.billTypeFilter, serviceTypeName: serviceType.serviceTypeName });
                                console.log(this.props.dataItem);
                                this.getDocuments(expenseId);
                            }
                        }
                    });
                document.getElementsByName('date')[0]['disabled'] = true;
            //})
        })
    }

    dateWiseServiceTypes = (allServices, startDate) => {
        let distinctServices = [];
        let boundryData = allServices.filter(x => new Date(x.startDate).setHours(0,0,0,0) <= new Date(startDate).setHours(0,0,0,0) && new Date(x.endDate).setHours(0,0,0,0) >= new Date(startDate).setHours(0,0,0,0));
        boundryData.forEach(element => {
            if(distinctServices.findIndex(x => x.serviceTypeId== element.serviceTypeId)==-1){
                distinctServices.push(element);
            }
        });
        return distinctServices;
    }

    getExpenses = () => {
        var queryStr = `${toODataString(this.state.dataState, { utcDates: true })}`;
        const queryParams = `tsWeekId eq ${this.props.tsWeekId}`;
        var finalQueryString = KendoFilter(this.state.dataState, queryStr, queryParams);

        axios.get(`api/ts/week/expense?${finalQueryString}`).then((res) => {
            this.setState({
                expenses: res.data,
            });
        });
    };

    getDocuments = (entityId) => {
        axios.get(`api/ts/documents?tsWeekId=${entityId}`).then((res) => {
            if (res.data) {
                let fileArray = [...this.state.fileArray];
                res.data.forEach(doc => {
                    fileArray.push({ candDocumentsId: doc.candDocumentsId, fileName: doc.fileName, file: undefined, isValid: true, path: doc.filePath });
                });
                this.setState({ fileArray: fileArray });
            }
        });
    };

    select = (event) => {
        let fileArray = [...this.state.fileArray]
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
                fileArray.push({ expenseId: undefined, fileName: file.name, file: file, isValid: isfileValid, path: undefined });
            })
            this.setState({ fileArray: fileArray });
        }
    }

    removeFile = (index) => {
        let fileArray = this.state.fileArray;
        if(fileArray[index].candDocumentsId){
            axios.put(`/api/candidates/documents/${fileArray[index].candDocumentsId}`).then((res: any) => {
                if (res.data) {
                    successToastr('Document(s) deleted successfully!');
                }
            });
        }
        this.state.fileArray.splice(index, 1);
        this.setState({ fileArray: fileArray });
        
    }

    validate = () => {
        if ((this.state.amount==undefined || this.state.amount==0)
            || (this.state.serviceTypeId==null || this.state.serviceTypeId==undefined)
            || (this.state.date==undefined || this.state.date==null)
            || (this.state.billTypeFilter !=BillTypeFilters.ONETIME && ((this.state.quantity==undefined || this.state.quantity==0) || !this.isAmountValid()))) {
            return false;
        }
        
        if(this.state.billTypeFilter==BillTypeFilters.ONETIME){
            let isvalid = true;
            if ((this.state.amount !=undefined && this.state.amount !=0) && !isNaN(parseFloat(this.state.maxAmount))) {
                this.validAmount = parseFloat(this.state.maxAmount);
                if (this.state.amount > parseFloat(this.state.maxAmount)) {
                    this.isInvalidAmmount = true
                    isvalid = false;
                }
            }
            return isvalid;
        }

        else {
            return true;
        }
    }

    isAmountValid = () => {
        let isvalid = true;
        if ((this.state.quantity !=undefined && this.state.quantity !=0)
            && (this.state.amount !=undefined && this.state.amount !=0) && !isNaN(parseFloat(this.state.maxAmount))) {
            this.validAmount = parseInt(this.state.quantity) * parseFloat(this.state.maxAmount);
            if (this.state.amount > (parseInt(this.state.quantity) * parseFloat(this.state.maxAmount))) {
                this.isInvalidAmmount = true
                isvalid = false;
            }
        }
        return isvalid;
    }
    addExpense = (addnew) => {
        this.isSaveClicked = true;
        let checkNewFile =
            this.state.fileArray != undefined
                ? this.state.fileArray.filter((i) => i.candDocumentsId ==undefined)
                : [];

        if (checkNewFile.some((d) => d.isValid ==false)) {
            alert("Invalid file is attached. Please remove invalid file or attach another valid file.");
            return false;
        }
        else {
            if (this.validate()) {
                const { serviceTypeId, date, amount, notes, expenseId, quantity } = this.state;
                if (!expenseId) {
                    const data = {
                        tsWeekId: this.props.tsWeekId,
                        serviceTypeId: serviceTypeId,
                        date: toLocalDateTime(date),
                        quantity: quantity,
                        amount: amount,
                        notes: notes
                    }
                    axios.post("/api/ts/week/expense", JSON.stringify(data)).then((res) => {
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
                                            this.props.onSaveAndNew();
                                        }
                                        else {
                                            this.props.onSaveAndClose();
                                        }
                                    });
                            }
                            else {
                                successToastr(ADD_EXPENSE_SUCCESS_MSG);
                                if (addnew) {
                                    this.props.onSaveAndNew();
                                }
                                else {
                                    this.props.onSaveAndClose();
                                }
                            }
                        }
                    });
                }
                else {
                    const data = {
                        expenseId: expenseId,
                        serviceTypeId: serviceTypeId,
                        date: toLocalDateTime(date),
                        quantity: quantity,
                        amount: amount,
                        notes: notes
                    }
                    axios.put("/api/ts/week/expense", JSON.stringify(data)).then((res) => {
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
                                            this.props.onSaveAndNew();
                                        }
                                        else {
                                            this.props.onSaveAndClose();
                                        }
                                    });
                            }
                            else {
                                successToastr(UPDATE_EXPENSE_SUCCESS_MSG);
                                if (addnew) {
                                    this.props.onSaveAndNew();
                                }
                                else {
                                    this.props.onSaveAndClose();
                                }
                            }
                        }
                    });
                }
            }
            else {
                this.setState(this.state);
                return false;
            }
        }

    }

    render() {
        
    document.getElementsByName("date").length>0 && (document.getElementsByName("date")[0]["disabled"]=true);
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">{this.props.dataItem != undefined ? "Edit Expense" : "Add Expenses"} - <span> {this.props.candidateName} </span></h4>
                        <button type="button" className="close text-white close_opacity"
                            data-dismiss="modal" onClick={this.props.onCloseModal}>
                            &times;
                        </button>
                    </div>

                    {this.state.showLoader &&
                        Array.from({ length: 2 }).map((item, i) => (
                            <div className="row col-12 mx-auto mt-2" key={i}>
                                {Array.from({ length: 3 }).map((item, j) => (
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
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
                                        <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0" id="ShowDatePickerIcon">
                                            <label className="mb-1 font-weight-bold required">Date</label>
                                            <DatePicker
                                                className="form-control release-date-ddl kendo-Tabledatepicker"
                                                format="MM/dd/yyyy"
                                                name="date"
                                                value={this.state.date}
                                                onChange={(e) => this.handleChange(e)}
                                                formatPlaceholder="formatPattern"
                                                min={new Date(this.state.payPeriodStart)}
                                                max={new Date(this.state.payPeriodEnd)}
                                            />
                                            {
                                                this.isSaveClicked && (this.state.date==undefined || this.state.date==null) && <ErrorComponent />
                                            }
                                        </div>
                                        <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
                                            <label className="mb-1 font-weight-bold required">Service Type</label>
                                            <CustomDropDownList
                                                className="form-control"
                                                data={this.state.serviceTypes}
                                                name="serviceTypeId"
                                                textField="serviceTypeName"
                                                valueField="serviceTypeId"
                                                defaultItem={defaultItem}
                                                value={this.state.serviceTypeId}
                                                onChange={(e) => this.handleServiceTypeChange(e)}
                                                id="serviceTypes"
                                            />
                                            {
                                                this.isSaveClicked && (this.state.serviceTypeId==null || this.state.serviceTypeId==undefined) && <ErrorComponent />
                                            }
                                        </div>
                                        {this.state.billTypeFilter !=BillTypeFilters.ONETIME && (
                                        <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0">
                                            <label className="mb-1 font-weight-bold required">{this.state.billType=="Weekly" ? "No. of Weeks" : this.state.billType=="Hourly" ? "No. of Hours" : "No. of Days"}</label>
                                            <NumericTextBox
                                                className="form-control"
                                                placeholder={`Enter ${this.state.billType=="Weekly" ? "No. of Weeks" : this.state.billType=="Hourly" ? "No. of Hours" : "No. of Days"}`}
                                                value={isNaN(this.state.quantity) ? 0 : this.state.quantity}
                                                min={0}
                                                max={999}
                                                format="#"
                                                name="quantity"
                                                onChange={(e) => this.handleChangeNumeric(e)}

                                            />
                                            {
                                                this.isSaveClicked && this.state.billTypeFilter !=BillTypeFilters.ONETIME && (this.state.quantity==undefined || this.state.quantity==0) && <ErrorComponent />
                                            }
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-12 mt-0">
                                    <div className="row">

                                        <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0">
                                            <label className="mb-1 font-weight-bold required">Total Amount</label>
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
                                            {
                                                this.isSaveClicked && (this.state.amount==undefined || this.state.amount==0) && <ErrorComponent />
                                            }
                                            {
                                                this.isSaveClicked && this.isInvalidAmmount && <span role="alert" className="k-form-error k-text-start">
                                                    Total amount for {(this.state.billTypeFilter !=BillTypeFilters.ONETIME) && this.state.quantity} {this.state.billType=="Weekly" ? "week(s)" : this.state.billType=="Hourly" ? "hour(s)" : this.state.billType== "Daily" ? "day(s)" : this.state.serviceTypeName} cannot be more than ${this.validAmount}.
                                                    </span>
                                            }
                                        </div>
                                        <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0">
                                            <label className="mb-1 font-weight-bold">Notes</label>
                                            <textarea rows={2}
                                                id="noteHistoryBox"
                                                value={this.state.notes}
                                                maxLength={2000}
                                                className="form-control noteHistory mt-1"
                                                onChange={(event) => {
                                                    this.setState({ notes: event.target.value });
                                                }}
                                            />
                                        </div>
                                        <div className="col-12 col-sm-4 col-lg-4 mt-2 mb-2 mb-sm-0  mt-sm-0">
                                            <input id="myInput"
                                                type="file"
                                                multiple
                                                accept="image/jpeg,image/png,application/pdf,application/doc,application/docx,application/xls,application/xlsx"
                                                ref={(ref) => this.uploadControl = ref}
                                                style={{ display: 'none' }}
                                                onChange={(e) => this.select(e)}
                                            />
                                            <label className="mb-0 font-weight-bold ">Upload Documents
                                                <span onClick={() => { this.uploadControl.click() }} className="text-underline cursorElement align-middle">
                                                    <FontAwesomeIcon icon={faPaperclip} className="ml-1 active-icon-blue ClockFontSize" />
                                                </span>
                                            </label>

                                            <div className="file-list">
                                                {this.state.fileArray.length > 0 && this.state.fileArray.map((file, i) =>
                                                    <span><span title={file.fileName} onClick={() => file.candDocumentsId && DownloadDocument(file.path)} className={file.isValid ? "valid-file" : "invalid-file"}>{file.fileName}</span>
                                                        <span title="Remove" className="remove" onClick={() => this.removeFile(i)}>X</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                    <div className="col-12">
                        <div className="col-sm-12 col-12 p-2">
                            <div className="row text-center">
                                <div className="col-12 mt-4 mb-4 heello">
                                    <div className="row ml-sm-0 mr-sm-0 justify-content-center">
                                        <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                            onClick={() => this.addExpense(true)}
                                        >
                                            <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save &amp; Add Another
                                        </button>
                                        <button
                                            type="button"
                                            className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                            onClick={() => this.addExpense(false)}
                                        >
                                            <FontAwesomeIcon icon={faSave} className={"mr-1"} />Save &amp; Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AlertBox
                    handleNo={() => { this.setState({ openAlert: false }) }}
                    message={this.alertMessage}
                    showModal={this.state.openAlert}
                ></AlertBox>
            </div>
        );
    }
}
export default AddExpense;
