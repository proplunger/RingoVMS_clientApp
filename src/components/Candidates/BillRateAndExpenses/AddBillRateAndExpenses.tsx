import { faCircle, faClock, faHistory, faMapPin, faSave, faSearch, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import {
    faTimesCircle,
    faArrowAltCircleDown
} from "@fortawesome/free-solid-svg-icons";
import auth from "../../Auth";
import * as React from "react";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import axios from "axios";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import {
    ADD_BILL_RATE_SUCCESS_MSG, BILLRATE_APPROVE_CONFIRMATION_MSG,
    BILLRATE_APPROVE_SUCCESS_MSG, BILLRATE_REJECTED_SUCCESS_MSG, BILLRATE_SENT_NEGOTIATION_SUCCESS_MSG,
    NEGOTIATE_BILLRATE_CONFIRMATION_MSG, REJECT_BILLRATE_CONFIRMATION_MSG,
    UPDATE_BILL_RATE_SUCCESS_MSG, BILLRATE_SUBMIT, DRAFT, SAVE_ANOTHER, SAVE_CLOSE, SINGE_GHRS_ERR_MSG, CONTRACT_SUBMITTED_TIMESHEET_WITH_NOTE_MSG, CONTRACT_SUBMITTED_TIMESHEET_MSG
} from "../../Shared/AppMessages";
import { errorToastr, localDateTime, successToastr } from "../../../HelperMethods";
import { ErrorComponent } from "../../ReusableComponents";
import Skeleton from "react-loading-skeleton";
import FormActions from "../../Shared/Workflow/FormActions";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import RejectModal from "../../Shared/RejectModal";
import WFHistoryBox from '../../Shared/Workflow/History';
import _ from "lodash";
import AlertBox from "../../Shared/AlertBox";
import { BillRateAndExpenseGuids, BillRateStatus, CandidateWorkflow, CandSubStatusIds, isAssignmentInProgress } from "../../Shared/AppConstants";
import Auth from "../../Auth";
import withValueField from "../../Shared/withValueField";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import IconMessageModal from "../../Shared/IconMessageModal";

const CustomDropDownList = withValueField(DropDownList);

export interface AddBillRateAndExpensesProps {
    dataItem?: any;
    onCloseModal?: any;
    onSaveAndNew?: any;
    onSaveAndClose?: any;
    candSubmissionId: string;
    candidateName: string;
    positionId?: string;
    locationId?: string;
    divisionId?: string;
    candSubStatus?: string;
    candidateSubStatusIntId?: number;
    billRates?: any;
    AssignmentStartDate?: any;
    AssignmentEndDate?: any;
    isPayRateEnabled?: boolean;
    candSubExtId?: string; 
}

export interface AddBillRateAndExpensesState {
    serviceCategories: Array<IDropDownModel>;
    serviceTypes: Array<any>;
    billTypes: Array<any>;
    isServiceCatTime: boolean;
    isOvertimeDaily: boolean
    isGuarnteedDaily: boolean;
    subBillRateId?: string;
    serviceCatId: string;
    serviceType?: any;
    clientId?: string;
    serviceTypeId?: string;
    billType: string;
    billRate?: number;
    payRate?: number;
    holidayBillRate?: number;
    overtimeHours?: number;
    overtimeBillTypeId?: string;
    guaranteedBillTypeId?: string;
    overrideComment?: string;
    guaranteedHours?: number;
    //changeHistory?:string;
    maxGuaranteedHours?: number;
    overrideBillRate?: number;
    minOverrideBillRate?: number;
    isOverrideBillRate?: boolean;
    overrideHolidayBillRate?: number;
    minOverrideHolidayBillRate?: number;
    isOverrideHolidayBillRate?: boolean;
    maxBillRate?: number;
    maxHolidayBillRate?: number;
    showLoader?: boolean;
    status?: string;
    showApproveModal?: boolean;
    showRejectModal?: boolean;
    showNegotiateModal?: boolean;
    isFormAcionLoaded?: boolean;
    openCommentBox?: boolean;
    openAlert?: boolean;
    rateCardId?: string;
    startDate?: any;
    endDate?: any;
    showContractValidationModal?: boolean;
    contractSubmittedTimeSheetData?: any;
    comment?: any;
}
const defaultItem = { name: "Select...", id: null };
class AddBillRateAndExpenses extends React.Component<AddBillRateAndExpensesProps, AddBillRateAndExpensesState>{
    public isSaveClicked = false;
    public alertMessage;
    constructor(props: AddBillRateAndExpensesProps) {
        super(props);
        this.state = {
            serviceCategories: [],
            serviceTypes: [],
            billTypes: [],
            clientId: Auth.getClient(),
            billRate: undefined,
            payRate: undefined,
            isServiceCatTime: true,
            maxGuaranteedHours: 24,
            isOvertimeDaily: true,
            isGuarnteedDaily: true,
            isOverrideBillRate: false,
            serviceCatId: "",
            billType: "",
            maxBillRate: 10000,
            showLoader: false,
            startDate: null,
            endDate: null
        };

    }
    statusId: string;
    eventName: string;
    actionId: string;
    action: string;

    handleChange = (e) => {
        let { name, value, type } = e.target;
        this.state[name] = isNaN(value) ? value : Math.abs(value);
        this.setState(this.state);
    };

    handleDateChange = (e) => {
        let change = {};
        change[e.target.name] = e.target.value;
        this.setState(change);
      };

    // handleBlur = () =>{
    //     let remark = "";
    //     if(this.state.overrideBillRate && this.state.overrideHolidayBillRate){
    //         remark = `Bill Rate overridden to $${this.state.overrideBillRate} and Holiday Bill Rate overridden to $${this.state.overrideHolidayBillRate}`;
    //     }
    //     if(this.state.overrideBillRate && !this.state.overrideHolidayBillRate){
    //         remark = `Bill Rate overridden to $${this.state.overrideBillRate}`;
    //     }
    //     if(!this.state.overrideBillRate && this.state.overrideHolidayBillRate){
    //         remark = `Holiday Bill Rate overridden to $${this.state.overrideHolidayBillRate}`;
    //     }
    //     this.setState({changeHistory:remark});
    // }

    handleOverrideChange = (e) => {
        let { name, value, type } = e.target;
        this.state[name] = e.target.checked;
        if (name=='isOverrideBillRate') {
            this.setState({ billRate: undefined, overrideBillRate: undefined });
        }
        if (name=='isOverrideHolidayBillRate') {
            this.setState({ holidayBillRate: undefined, overrideHolidayBillRate: undefined });
        }
        if (e.target.checked==false) {
            this.state[name] = undefined;
            this.setState({ overrideComment: "" });
        }
        
        //this.setState(this.state);
    }

    handleServiceTypeChange = (event) => {
        if (this.ifServiceTypeExists(event.value.id) && !isAssignmentInProgress(this.props.candidateSubStatusIntId)) {
            this.alertMessage = event.value.name + " already added.";
            this.setState({ openAlert: true, serviceType: defaultItem });
            return false;
        }
        else {
            this.setState({
                serviceType: event.value,
                serviceTypeId: event.value.id,
                billType: event.value.billType==undefined ? "" : event.value.billType,
                rateCardId: event.value.rateCardId
            });
            if (event.value.id !=null) {
                let maxBillrate;
                let maxHolidayBillRate;
                if (event.value.suppressPer && event.value.suppressPer > 0) {
                    maxBillrate = event.value.billRate - (event.value.suppressPer / 100) * event.value.billRate;
                    maxHolidayBillRate = event.value.holidayBillRate - (event.value.suppressPer / 100) * event.value.holidayBillRate;
                }
                else {
                    maxBillrate = event.value.billRate;
                    maxHolidayBillRate = event.value.holidayBillRate;
                }
                this.setState({
                    maxBillRate: maxBillrate,
                    maxHolidayBillRate: maxHolidayBillRate,
                    minOverrideBillRate: maxBillrate + 1,
                    minOverrideHolidayBillRate: maxHolidayBillRate + 1
                });
                //this.getClientServiceMap();
            }
            if (event.value.billType=="Daily") {
                this.setState({ isGuarnteedDaily: true })
            }
        }

    }

    ifServiceTypeExists = (value) => {
        var billRates = this.props.billRates.filter(x => x.status !=BillRateStatus.REJECTED);
        return _.find(billRates, ["serviceTypeId", value]);
    }
    // getClientServiceMap = () => {
    //     this.setState({serviceTypeId:this.props.dataItem.serviceTypeId});
    // }

    getServiceCategories = () => {
        axios.get(`api/candidates/servicecat`).then((res) => {
            this.setState({ serviceCategories: res.data });
            if (this.props.dataItem) {
                this.setState({ isServiceCatTime: this.props.dataItem.serviceCategory=='Time' ? true : false })
            }
            if (this.state.isServiceCatTime || this.props.dataItem.serviceCategory=='Time') {
                console.log(this.state.serviceCategories.find(x => x.name=="Time"))
                this.getServiceTypes(this.state.serviceCategories.find(x => x.name=="Time").id, this.state.clientId, this.props.divisionId, this.props.locationId, this.props.positionId);
            }
            else {
                this.getServiceTypes(this.state.serviceCategories.find(x => x.name=="Expenses").id, this.state.clientId, this.props.divisionId, this.props.locationId, this.props.positionId);
            }
        });
    }
    onFormActionLoaded = () => {
        this.setState({ isFormAcionLoaded: false });
    }

    onServiceCatChange = (event) => {
        this.setState({ isServiceCatTime: !this.state.isServiceCatTime, serviceTypeId: null, billType: '' });
        this.getServiceTypes(event.target.id, this.state.clientId, this.props.divisionId, this.props.locationId, this.props.positionId);
        
       var serviceType = this.state.serviceCategories.find(x => x.id==event.target.id).name;

        if(isAssignmentInProgress(this.props.candidateSubStatusIntId) && (this.state.subBillRateId==null || this.state.subBillRateId==undefined))
        {
            if(serviceType=='Expenses'){
                this.setState({ startDate: new Date(this.props.AssignmentStartDate), endDate: new Date(this.props.AssignmentEndDate)});
            }else if(serviceType=='Time'){
                this.setState({ startDate: null, endDate: null});
            }
        }
    }

    handleGuaranteedChange = (event) => {
        this.setState({
            guaranteedBillTypeId: event.target.id,
            isGuarnteedDaily: !this.state.isGuarnteedDaily,
            maxGuaranteedHours: !this.state.isGuarnteedDaily ? 24 : 60
        });
    }

    handleOvertimeChange = (event) => {
        this.setState({ overtimeBillTypeId: event.target.id, isOvertimeDaily: !this.state.isGuarnteedDaily })
    }

    getServiceTypes = (id, clientId, divisionId, locationId, positionId) => {
        axios.get(`api/candidates/servicetype?serviceCatId=${id}&clientId=${clientId}&divisionId=${divisionId}&locationId=${locationId}&positionId=${positionId}`).then((res) => {
            this.setState({ serviceTypes: res.data });
        }).then(() => {
            axios.get(`api/candidates/billtype`).then((res) => {
                this.setState({ billTypes: res.data });
                if (this.props.dataItem) {
                    //this.getClientServiceMap(this.props.dataItem.serviceTypeId);
                    this.setState({
                        //isServiceCatTime:this.props.dataItem.ServiceCategory=='Time' ? true:false,
                        showLoader: false,
                        subBillRateId: this.props.dataItem.subBillRateId,
                        billType: this.props.dataItem.billType,
                        serviceTypeId: this.props.dataItem.serviceTypeId,
                        serviceType: this.props.dataItem.serviceTypeVm,
                        overtimeBillTypeId: this.props.dataItem.overtimeBillTypeId,
                        guaranteedBillTypeId: this.props.dataItem.guaranteedBillTypeId,
                        billRate: this.props.dataItem.billRate,
                        payRate: this.props.dataItem.payRate,
                        holidayBillRate: this.props.dataItem.holidayBillRate,
                        overtimeHours: this.props.dataItem.overtimeHours,
                        overrideComment: this.props.dataItem.overrideComment,
                        overrideBillRate: this.props.dataItem.overrideBillRate,
                        overrideHolidayBillRate: this.props.dataItem.overrideHolidayBillRate,
                        guaranteedHours: this.props.dataItem.guaranteedHours,
                        status: this.props.dataItem.status,
                        comment: this.props.dataItem.comment,
                        isOverrideBillRate: this.props.dataItem.overrideBillRate !=null ? true : false,
                        isOverrideHolidayBillRate: this.props.dataItem.overrideHolidayBillRate !=null ? true : false,
                        //isOvertimeDaily: this.state.billTypes.find(x => x.id==this.props.dataItem.overtimeBillTypeId).name=="Daily" ? true : false,
                        isGuarnteedDaily: !this.props.dataItem.guaranteedBillTypeId ? true : this.state.billTypes.find(x => x.id==this.props.dataItem.guaranteedBillTypeId).name=="Daily" ? true : false,
                        startDate: this.props.dataItem.startDate !=null && this.props.dataItem.startDate !=undefined && this.props.dataItem.startDate !=""
                        ? (this.props.dataItem.startDate)
                        : this.props.dataItem.startDate,
                        endDate: this.props.dataItem.endDate !=null && this.props.dataItem.endDate !=undefined && this.props.dataItem.endDate !=""
                        ? (this.props.dataItem.endDate)
                        : this.props.dataItem.endDate,
                    },()=>{
                        let maxBillrate;
                        let maxHolidayBillRate;
                        let selectedService = this.state.serviceTypes.find(x => x.id==this.state.serviceTypeId);
                        if (selectedService) {
                            if (selectedService.suppressPer && selectedService.suppressPer > 0) {
                                maxBillrate = selectedService.billRate - (selectedService.suppressPer / 100) * selectedService.billRate;
                                maxHolidayBillRate = selectedService.holidayBillRate - (selectedService.suppressPer / 100) * selectedService.holidayBillRate;
                            }
                            else {
                                maxBillrate = selectedService.billRate;
                                maxHolidayBillRate = selectedService.holidayBillRate;
                            }
                            this.setState({ maxBillRate : maxBillrate, 
                                maxHolidayBillRate : maxHolidayBillRate,
                                minOverrideBillRate : maxBillrate + 1,
                                minOverrideHolidayBillRate : maxHolidayBillRate + 1,
                                rateCardId:selectedService.rateCardId,
                                maxGuaranteedHours:this.state.isGuarnteedDaily ? 24 : 60
                             });
                        }

                    })
                }
            })
        });
    }

    componentDidMount() {
        this.getServiceCategories();
        if (this.props.dataItem) {
            this.setState({ showLoader: true })
        }
        else {
            this.setState({ status: DRAFT });
        }
    }

    validate = () => {
        if ((!this.state.isOverrideBillRate && (this.state.billRate==undefined ||this.state.billRate==null)) || 
        (this.state.serviceTypeId=="" || this.state.serviceTypeId==undefined) || 
        (this.state.isOverrideBillRate && (this.state.overrideBillRate==undefined || this.state.overrideBillRate==null))||
        (this.state.isOverrideHolidayBillRate && (this.state.overrideComment=="" || this.state.overrideComment==undefined))|| 
        (this.state.isOverrideBillRate && (this.state.overrideComment=="" || this.state.overrideComment==undefined)) || 
        this.state.billRate > this.state.maxBillRate ||
        this.state.holidayBillRate > this.state.maxHolidayBillRate ||
        this.state.guaranteedHours > this.state.maxGuaranteedHours ||
        (this.state.isServiceCatTime && (!this.state.holidayBillRate && !this.state.overrideHolidayBillRate)) ||
        (this.state.overrideHolidayBillRate && this.state.overrideHolidayBillRate < this.state.minOverrideHolidayBillRate) || 
        (this.state.overrideBillRate && this.state.overrideBillRate < this.state.minOverrideBillRate)||
        (this.props.billRates.some(x =>x.guaranteedHours && x.subBillRateId !=this.state.subBillRateId) && this.state.guaranteedHours) ||
        (this.state.isServiceCatTime && (isAssignmentInProgress(this.props.candidateSubStatusIntId) && (this.state.startDate && this.state.startDate > this.state.endDate))) ||
        (this.state.isServiceCatTime && (isAssignmentInProgress(this.props.candidateSubStatusIntId) && (this.state.endDate && this.state.startDate > this.state.endDate))) ||
        (this.state.isServiceCatTime && (isAssignmentInProgress(this.props.candidateSubStatusIntId) && (this.state.startDate==null || this.state.startDate==undefined || this.state.startDate==""))) ||
        (this.state.isServiceCatTime && (isAssignmentInProgress(this.props.candidateSubStatusIntId) && (this.state.endDate==null || this.state.endDate==undefined || this.state.endDate=="")))
        ) {
            return false;
        }
        else {
            return true;
        }
    }

    addBillRate = (addnew) => {
        this.isSaveClicked = true;
        if (this.validate()) {

            const { subBillRateId, serviceTypeId, billRate, holidayBillRate, 
                overtimeHours, overrideComment, overrideBillRate, overrideHolidayBillRate, 
                guaranteedHours, guaranteedBillTypeId, rateCardId,
                startDate, endDate, payRate, comment } = this.state;
            if (!subBillRateId) {
                const data = {
                    candSubId: this.props.candSubmissionId,
                    serviceTypeId: serviceTypeId,
                    billRate: billRate,
                    holidayBillRate: holidayBillRate,
                    overtimeHours: overtimeHours,
                    overrideComment: overrideComment,
                    overrideBillRate: overrideBillRate,
                    overrideHolidayBillRate: overrideHolidayBillRate,
                    guaranteedHours: guaranteedHours,
                    //overtimeBillTypeId: overtimeBillTypeId==undefined ? this.state.billTypes.find(x => x.name=="Daily").id : overtimeBillTypeId,
                    guaranteedBillTypeId: guaranteedHours ? guaranteedBillTypeId==undefined ? this.state.billTypes.find(x => x.name=="Daily").id : guaranteedBillTypeId :undefined,
                    statusId: this.statusId,
                    rateCardId: rateCardId,
                    payRate: payRate,
                    startDate: localDateTime(startDate),
                    endDate: localDateTime(endDate),
                    candSubExtId: this.props.candSubExtId ? this.props.candSubExtId : null,
                    comment: comment
                }
                axios.post("/api/candidates/billrate", JSON.stringify(data)).then((res) => {
                    if (res.data && res.data.isSuccess) {
                        var updateConfirmLetter = res.data.responseCode=='CSU' || res.data.responseCode=='UPDATED';
                        if (
                            this.props.candSubStatus=="Ready for Offer" || this.props.candidateSubStatusIntId==CandSubStatusIds.VENDORPRESENTATIONSUBMITTED ||
                            (isAssignmentInProgress(this.props.candidateSubStatusIntId) && !(this.state.isOverrideBillRate || this.state.isOverrideHolidayBillRate))
                        ) {
                            const billRateData = {
                                StatusId: BillRateAndExpenseGuids.APPROVED,
                                subBillRateId: [res.data.data],
                                updateConfirmLetter: updateConfirmLetter
                            };
                            axios
                                .put(
                                    "api/candidates/billrate/status",
                                    JSON.stringify(billRateData)
                                )
                                .then((res) => {
                                    if (addnew) {
                                        this.props.onSaveAndNew();
                                    }
                                    else {
                                        this.props.onSaveAndClose();
                                    }
                                });
                        } else if (
                            this.props.candSubStatus !="Risk Cleared" &&
                            this.props.candidateSubStatusIntId !=CandSubStatusIds.PENDINGFORVENDORPRESENTATION
                        ) {
                            // const billRateData = {
                            //     //candSubmissionIds: this.state.selectedIds,
                            //     subBillRateId: [res.data],
                            // };
                            // axios.put("api/candidates/billrate/status", JSON.stringify(billRateData)).then((res) => {
                            // });
                        }
                        if(isAssignmentInProgress(this.props.candidateSubStatusIntId) && (this.state.isOverrideBillRate || this.state.isOverrideHolidayBillRate)){
                            const billRateData = {
                                subBillRateId: [res.data.data],
                                updateConfirmLetter: updateConfirmLetter
                            };
                            axios
                                .put(
                                    "api/candidates/billrate/status",
                                    JSON.stringify(billRateData)
                                )
                                .then((res) => { });
                        }
                        successToastr(ADD_BILL_RATE_SUCCESS_MSG);

                        if (addnew) {
                            this.props.onSaveAndNew();
                        }
                        else {
                            this.props.onSaveAndClose(res.data.responseCode);
                        }
                    }else if(res.data && !res.data.isSuccess){
                        this.setState({ showContractValidationModal: true, contractSubmittedTimeSheetData: res.data.data });
                    }
                });
            }
            else {
                const data = {
                    subBillRateId: subBillRateId,
                    candSubId: this.props.candSubmissionId,
                    serviceTypeId: serviceTypeId,
                    billRate: billRate,
                    holidayBillRate: holidayBillRate,
                    overtimeHours: overtimeHours,
                    overrideComment: overrideComment,
                    overrideBillRate: overrideBillRate,
                    overrideHolidayBillRate: overrideHolidayBillRate,
                    guaranteedHours: guaranteedHours,
                    //overtimeBillTypeId: overtimeBillTypeId==undefined ? this.state.billTypes.find(x => x.name=="Daily").id : overtimeBillTypeId,
                    guaranteedBillTypeId: guaranteedHours ? guaranteedBillTypeId==undefined ? this.state.billTypes.find(x => x.name=="Daily").id : guaranteedBillTypeId : undefined,
                    statusId: this.statusId,
                    rateCardId: rateCardId,
                    payRate: payRate,
                    startDate: localDateTime(startDate),
                    endDate: localDateTime(endDate),
                    comment: comment
                }

                axios.put("/api/candidates/billrate", JSON.stringify(data)).then((res) => {

                    if (res.data && res.data.isSuccess) {
                        var responseCode = res.data.responseCode;
                        var updateConfirmLetter = responseCode=='CSU' || responseCode=='UPDATED';
                         if (res.data) {
                        if (
                            this.props.candSubStatus=="Ready for Offer" ||
                            (isAssignmentInProgress(this.props.candidateSubStatusIntId) && !(this.state.isOverrideBillRate || this.state.isOverrideHolidayBillRate))
                        ) {
                            const billRateData = {
                                StatusId: BillRateAndExpenseGuids.APPROVED,
                                subBillRateId: [res.data.data],
                                updateConfirmLetter: updateConfirmLetter
                            };
                            axios
                                .put(
                                    "api/candidates/billrate/status",
                                    JSON.stringify(billRateData)
                                )
                                .then((res) => {
                                    if (addnew) {
                                        this.props.onSaveAndNew();
                                    }
                                    else {
                                        this.props.onSaveAndClose(responseCode);
                                    }
                                    successToastr(UPDATE_BILL_RATE_SUCCESS_MSG);
                                 });
                        } else if (
                            this.props.candSubStatus !="Risk Cleared" &&
                            this.props.candidateSubStatusIntId !=CandSubStatusIds.PENDINGFORVENDORPRESENTATION
                             && !(this.state.isOverrideBillRate || this.state.isOverrideHolidayBillRate)
                        ) {
                            const billRateData = {
                                //candSubmissionIds: this.state.selectedIds,
                                subBillRateId: [res.data.data],
                            };

                            axios
                                .put(
                                    "api/candidates/billrate/status",
                                    JSON.stringify(billRateData)
                                )
                                .then((res) => { if (addnew) {
                                    this.props.onSaveAndNew();
                                }
                                else {
                                    this.props.onSaveAndClose(responseCode);
                                }
                                successToastr(UPDATE_BILL_RATE_SUCCESS_MSG);
                            });
                        }
                    else if(isAssignmentInProgress(this.props.candidateSubStatusIntId) && (this.state.isOverrideBillRate || this.state.isOverrideHolidayBillRate)){
                            const billRateData = {
                                subBillRateId: [res.data.data],
                                updateConfirmLetter: updateConfirmLetter
                            };

                            axios
                                .put(
                                    "api/candidates/billrate/status",
                                    JSON.stringify(billRateData)
                                )
                                .then((res) => { 
                                    if (addnew) {
                                        this.props.onSaveAndNew();
                                    }
                                    else {
                                        this.props.onSaveAndClose(responseCode);
                                    }
                                    successToastr(UPDATE_BILL_RATE_SUCCESS_MSG);
                                });
                        }else{
                        if (addnew) {
                            this.props.onSaveAndNew();
                        }
                        else {
                            this.props.onSaveAndClose(responseCode);
                        }
                        }
                    }
                }else if(res.data && !res.data.isSuccess){
                    this.setState({ showContractValidationModal: true, contractSubmittedTimeSheetData: res.data.data });;
                }
                });
            }
        }
        else {
            this.setState(this.state);
            return false;
        }

    }

    handleActionClick = (action, nextStateId?, eventName?, actionId?) => {
        this.statusId = nextStateId;
        this.eventName = eventName;
        this.actionId = actionId;
        this.action = action;
        if (action==SAVE_ANOTHER) {
            this.addBillRate(true);
        }
        else if (action==SAVE_CLOSE || action==BILLRATE_SUBMIT) {
            this.addBillRate(false);
        }
        else {
            let change = {};
            let property = `show${action.replace(/ +/g, "")}Modal`;
            change[property] = true;
            this.setState(change);

        }
    };

    billRateStatusUpdate = (successMsg, modal, props?) => {
        this.setState({ showLoader: true });
        const data = {
            //candSubmissionIds: this.state.selectedIds,
            subBillRateId: [this.state.subBillRateId],
            statusId: this.statusId,
            eventName: this.eventName,
            actionId: this.actionId,
            action: this.action,
            billRateComment: this.state.comment,
            updateConfirmLetter: true,
            ...props,
        };
        axios.put("api/candidates/billrate/status", JSON.stringify(data)).then((res) => {
            successToastr(successMsg);
            //this.getCandidateWFs(this.state.dataState);
            this.setState({ showLoader: false });
            this.props.onSaveAndClose();
        });
        // close the modal
        let change = {};
        change[modal] = false;
        this.setState(change);

    };

    render() {
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">Bill Rates and Expenses - <span> {this.props.candidateName} </span></h4>
                        <button type="button" className="close text-white close_opacity"
                            data-dismiss="modal" onClick={this.props.onCloseModal}>
                            &times;
                        </button>
                    </div>

                    {this.state.showLoader &&
                        Array.from({ length: 3 }).map((item, i) => (
                            <div className="row col-12 mx-auto mt-2" key={i}>
                                {Array.from({ length: 3 }).map((item, j) => (
                                    <div className="col-12 col-sm-6 col-lg-4 mt-sm-0  mt-1" key={j}>
                                        <Skeleton width={100} />
                                        <Skeleton height={30} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    {!this.state.showLoader && (
                        <div className="col-12">
                            <div className="row">
                                <div className="col-12 mt-2 text-right">
                                    {this.props.dataItem && (this.props.dataItem.status !=DRAFT &&
                                        <span
                                            className=" text-underline cursorElement align-middle holdPosition-icon shadow"
                                            onClick={() => this.setState({ openCommentBox: true })}
                                        >
                                            <FontAwesomeIcon icon={faHistory} color={"white"} />
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                {/* <div className="col-12 mt-1">
                                    <div className="row"> */}
                                <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2 font-weight-bold">
                                    <label>Service Category</label>
                                    <div className="d-flex mb-2 mb-sm-0">
                                        <label className="container container_checkboxandradio radioBtnCustom font-weight-normal col-auto">
                                            Time
                                            <input
                                                disabled={this.state.status !=DRAFT}
                                                type="radio"
                                                name="serviceCategory"
                                                value="true"
                                                id={this.state.serviceCategories.find(x => x.name=="Time") !=undefined ? this.state.serviceCategories.find(x => x.name=="Time").id : undefined}
                                                checked={this.state.isServiceCatTime}
                                                onChange={(e) => this.onServiceCatChange(e)}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="container container_checkboxandradio radioBtnCustom font-weight-normal">
                                            Expenses
                                            <input
                                                disabled={this.state.status !=DRAFT}
                                                type="radio"
                                                name="serviceCategory"
                                                value="false"
                                                id={this.state.serviceCategories.find(x => x.name=="Expenses") !=undefined ? this.state.serviceCategories.find(x => x.name=="Expenses").id : undefined}
                                                checked={!this.state.isServiceCatTime}
                                                onChange={(e) => this.onServiceCatChange(e)}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                    <label className="mb-1 font-weight-bold required">Service Type</label>
                                    <CustomDropDownList
                                        disabled={this.state.status !=DRAFT}
                                        className="form-control"
                                        data={this.state.serviceTypes}
                                        name="serviceType"
                                        textField="name"
                                        valueField="id"
                                        defaultItem={defaultItem}
                                        value={this.state.serviceTypeId}
                                        onChange={(e) => this.handleServiceTypeChange(e)}
                                        id="serviceTypes"
                                    //filterable={this.state.originaldressCodes.length > 5 ? true : false}
                                    //onFilterChange={this.handleFilterChange}
                                    />
                                    {
                                        this.isSaveClicked && (this.state.serviceTypeId=="" || this.state.serviceTypeId==undefined) && <ErrorComponent />
                                    }
                                </div>
                                <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                    <label className="mb-1 font-weight-bold">Bill Type</label>
                                    <input
                                        type="text"
                                        name="billType"
                                        className="form-control"
                                        disabled
                                        placeholder="Bill Type"
                                        value={this.state.billType}
                                        maxLength={100}
                                    //onChange={(e) => this.props.handleChange(e)}
                                    />
                                </div>
                                {/* </div>
                                </div> */}
                                {/* </div>
                            <div className="row">
                                <div className="col-12 mt-2">
                                    <div className="row"> */}
                                <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                    <label className="mb-1 font-weight-bold required">Bill Rate</label>
                                    <NumericTextBox
                                        disabled={this.state.isOverrideBillRate}
                                        className="form-control"
                                        placeholder="Enter Bill Rate"
                                        value={isNaN(this.state.billRate) ? 0 : this.state.billRate}
                                        //value={this.state.billRate}
                                        format="c2"
                                        min={0}
                                        max={99999}
                                        name="billRate"
                                        onChange={(e) => this.handleChange(e)}
                                    />
                                    {
                                        this.isSaveClicked && !this.state.isOverrideBillRate && this.state.billRate==undefined && <ErrorComponent />
                                    }
                                    {
                                        this.isSaveClicked && this.state.billRate > this.state.maxBillRate && <span role="alert" className="k-form-error k-text-start">
                                            Bill rate cannot be more than ${this.state.maxBillRate}. Please check Override Bill Rate to add more than ${this.state.maxBillRate}.
                                        </span>
                                    }
                                </div>
                                {this.state.isServiceCatTime &&
                                    <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                        <label className="mb-1 font-weight-bold required">Holiday Bill Rate</label>
                                        <NumericTextBox
                                            className="form-control"
                                            disabled={this.state.isOverrideHolidayBillRate}
                                            placeholder="Enter Holiday Bill Rate"
                                            value={isNaN(this.state.holidayBillRate) ? 0 : this.state.holidayBillRate}
                                            //value={this.state.billRate}
                                            format="c2"
                                            min={0}
                                            max={99999}
                                            name="holidayBillRate"
                                            onChange={(e) => this.handleChange(e)}
                                        />
                                        {
                                            this.isSaveClicked && !this.state.isOverrideHolidayBillRate && this.state.holidayBillRate==undefined && <ErrorComponent />
                                        }
                                        {
                                            this.isSaveClicked && this.state.holidayBillRate > this.state.maxHolidayBillRate && <span role="alert" className="k-form-error k-text-start">
                                                Holiday Bill rate cannot be more than ${this.state.maxHolidayBillRate}. Please check Override Holiday Bill Rate to add more than ${this.state.maxHolidayBillRate}.
                                            </span>
                                        }
                                    </div>
                                } 
                                {isAssignmentInProgress(this.props.candidateSubStatusIntId) &&                               
                                    <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2" id="ShowDatePickerIcon">
                                        <label className="mb-1 font-weight-bold required">Valid From</label>
                                        <DatePicker
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="startDate"
                                            value={this.state.startDate ? new Date(this.state.startDate) : ((this.state.subBillRateId==null || this.state.subBillRateId==undefined) && !this.state.isServiceCatTime ? new Date(this.props.AssignmentStartDate) : null)}
                                            min={this.props.AssignmentStartDate ? new Date(this.props.AssignmentStartDate) : null}
                                            max={this.props.AssignmentEndDate ? new Date(this.props.AssignmentEndDate) : null}
                                            formatPlaceholder="formatPattern"
                                            onChange={(e) => this.handleDateChange(e)}
                                        />
                                        {
                                            this.isSaveClicked && !this.state.startDate && this.state.startDate==undefined && <ErrorComponent />
                                        }
                                        {
                                            this.isSaveClicked && this.state.startDate && this.state.startDate > this.state.endDate && <span role="alert" className="k-form-error k-text-start">
                                                valid from should be less than end date.
                                            </span>
                                        }
                                    </div>
                                 }
                                    {/* </div>
                                </div>
                            </div> */}
                                {/* <div className="row">
                                <div className="col-12 mt-2">
                                    <div className="row"> */}
                                <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                    <div className="d-flex mb-2 mb-sm-0">
                                        <label className="mb-2 mb-sm-1 font-weight-bold">Override Bill Rate</label>
                                        <label className="container-R d-flex mb-0">
                                            <input
                                                type="checkbox"
                                                checked={this.state.isOverrideBillRate}
                                                name="isOverrideBillRate"
                                                onChange={(e) => this.handleOverrideChange(e)}
                                                className="mr-1"
                                            />

                                            <span className="checkmark-R checkPosition checkPositionTop"></span>
                                        </label>
                                    </div>

                                    <NumericTextBox
                                        disabled={!this.state.isOverrideBillRate}
                                        className="form-control"
                                        placeholder="Enter Override Bill Rate"
                                        value={isNaN(this.state.overrideBillRate) ? 0 : this.state.overrideBillRate}
                                        format="c2"
                                        min={0}
                                        max={99999}
                                        name="overrideBillRate"
                                        onChange={(e) => this.handleChange(e)}
                                       
                                    />
                                    {
                                        this.isSaveClicked && this.state.isOverrideBillRate && this.state.overrideBillRate==undefined && <ErrorComponent />
                                    }
                                    {
                                        this.isSaveClicked && this.state.isOverrideBillRate && this.state.overrideBillRate < this.state.minOverrideBillRate && <span role="alert" className="k-form-error k-text-start">
                                            Override Bill rate cannot be less than ${this.state.minOverrideBillRate}. Please uncheck Override Bill Rate to add less than ${this.state.minOverrideBillRate}.
                                        </span>
                                    }
                                </div>
                                {this.state.isServiceCatTime &&
                                    <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                        <div className="d-flex mb-2 mb-sm-0">
                                            <label className="mb-2 mb-sm-1 font-weight-bold">Override Holiday Bill Rate</label>
                                            <label className="container-R d-flex mb-0">
                                                <input
                                                    type="checkbox"
                                                    checked={this.state.isOverrideHolidayBillRate}
                                                    name="isOverrideHolidayBillRate"

                                                    onChange={(e) => this.handleOverrideChange(e)}
                                                    className="mr-1"
                                                />

                                                <span className="checkmark-R checkPosition checkPositionTop"></span>
                                            </label>
                                        </div>

                                        <NumericTextBox
                                            disabled={!this.state.isOverrideHolidayBillRate}
                                            className="form-control"
                                            placeholder="Enter Override Holiday Bill Rate"
                                            value={isNaN(this.state.overrideHolidayBillRate) ? 0 : this.state.overrideHolidayBillRate}
                                            format="c2"
                                            min={0}
                                            max={99999}

                                            name="overrideHolidayBillRate"
                                            onChange={(e) => this.handleChange(e)}
                                            
                                        />
                                        {
                                            this.isSaveClicked && this.state.isOverrideHolidayBillRate && this.state.overrideHolidayBillRate==undefined && <ErrorComponent />
                                        }
                                        {
                                            this.isSaveClicked && this.state.isOverrideHolidayBillRate && this.state.overrideHolidayBillRate < this.state.minOverrideHolidayBillRate && <span role="alert" className="k-form-error k-text-start">
                                                Override Holiday Bill rate cannot be less than ${this.state.minOverrideHolidayBillRate}. Please uncheck Override Holiday Bill Rate to add less than ${this.state.minOverrideHolidayBillRate}.
                                            </span>
                                        }
                                    </div>
                                }    
                                {this.state.isServiceCatTime && isAssignmentInProgress(this.props.candidateSubStatusIntId) && 
                                    <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2" id="ShowDatePickerIcon">
                                        <label className="mb-1 font-weight-bold required">Valid To</label>
                                        <DatePicker
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="endDate"
                                            value={this.state.endDate ? new Date(this.state.endDate) : null}
                                            min={this.props.AssignmentStartDate ? new Date(this.props.AssignmentStartDate) : null}
                                            max={this.props.AssignmentEndDate ? new Date(this.props.AssignmentEndDate) : null}
                                            formatPlaceholder="formatPattern"
                                            onChange={(e) => this.handleDateChange(e)}
                                        />
                                        {
                                            this.isSaveClicked && !this.state.endDate && this.state.endDate==undefined && <ErrorComponent />
                                        }
                                    </div>
                                }
                                <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                    <label className="mb-1 font-weight-bold">Override Comment</label>
                                    <textarea
                                        disabled={!this.state.isOverrideBillRate && !this.state.isOverrideHolidayBillRate}
                                        className="form-control"
                                        name="overrideComment"
                                        placeholder="Enter Override Comment"
                                        value={this.state.overrideComment || ""}
                                        maxLength={2000}
                                        onChange={(e) => this.handleChange(e)}
                                    ></textarea>
                                    {
                                        this.isSaveClicked && (this.state.isOverrideBillRate || this.state.isOverrideHolidayBillRate) && (this.state.overrideComment=="" || this.state.overrideComment==undefined) && <ErrorComponent />
                                    }
                                </div>
                                {!this.state.isServiceCatTime && isAssignmentInProgress(this.props.candidateSubStatusIntId) && 
                                    <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2" id="ShowDatePickerIcon">
                                        <label className="mb-1 font-weight-bold required">Valid To</label>
                                        <DatePicker
                                            className="form-control"
                                            format="MM/dd/yyyy"
                                            name="endDate"
                                            value={this.state.endDate ? new Date(this.state.endDate) : ((this.state.subBillRateId==null || this.state.subBillRateId==undefined) && !this.state.isServiceCatTime ? new Date(this.props.AssignmentEndDate) : null)}
                                            min={this.props.AssignmentStartDate ? new Date(this.props.AssignmentStartDate) : null}
                                            max={this.props.AssignmentEndDate ? new Date(this.props.AssignmentEndDate) : null}
                                            formatPlaceholder="formatPattern"
                                            onChange={(e) => this.handleDateChange(e)}
                                        />
                                        {
                                            this.isSaveClicked && !this.state.endDate && this.state.endDate==undefined && <ErrorComponent />
                                        }
                                    </div>
                                }
                                {(this.state.isServiceCatTime && this.state.billType=="Hourly") &&
                                    <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                        <div className="d-flex d-sm-inline-flex d-lg-flex mb-2 mb-sm-0">
                                            <label className="mb-1 font-weight-bold pr-2">Guaranteed Hours</label>
                                            <label className="mb-0 container container_checkboxandradio radioBtnCustom font-weight-normal col-auto">
                                                Daily
                                                <input
                                                    disabled={!this.state.isServiceCatTime}
                                                    type="radio"
                                                    name="Guaranteed"
                                                    value="true"
                                                    id={this.state.billTypes.find(x => x.name=="Daily") !=undefined ? this.state.billTypes.find(x => x.name=="Daily").id : undefined}
                                                    checked={this.state.isGuarnteedDaily}
                                                    onChange={(e) => this.handleGuaranteedChange(e)}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label className="mb-0 container container_checkboxandradio radioBtnCustom font-weight-normal col-auto">
                                                Weekly
                                                <input
                                                    //disabled={!this.state.isServiceCatTime || this.state.billType=="Daily"}
                                                    type="radio"
                                                    name="Guaranteed"
                                                    value="false"
                                                    id={this.state.billTypes.find(x => x.name=="Weekly") !=undefined ? this.state.billTypes.find(x => x.name=="Weekly").id : undefined}
                                                    checked={!this.state.isGuarnteedDaily}
                                                    onChange={(e) => this.handleGuaranteedChange(e)}
                                                />
                                                <span className="checkmark"></span>
                                            </label>

                                            </div>
                                            <NumericTextBox
                                                disabled={!this.state.isServiceCatTime}
                                                className="form-control"
                                                placeholder="Guaranteed Hours"
                                                //defaultValue={data.billRate}
                                                value={isNaN(this.state.guaranteedHours) ? 0 : this.state.guaranteedHours}
                                                //value={this.state.guaranteedHours}
                                                min={0}
                                                max={99999}
                                                name="guaranteedHours"
                                                onChange={(e) => this.handleChange(e)}
                                            />
                                            {                   
                                                this.isSaveClicked && this.state.guaranteedHours > this.state.maxGuaranteedHours && <span role="alert" className="k-form-error k-text-start">Guaranteed hours cannot be more than {this.state.maxGuaranteedHours}.</span>
                                            }
                                            {
                                                (this.isSaveClicked && this.props.billRates.filter(x => x.subBillRateId !=this.state.subBillRateId).some(x =>x.guaranteedHours) && this.state.guaranteedHours !=0)
                                                && <span role="alert" className="k-form-error k-text-start">{SINGE_GHRS_ERR_MSG}</span>
                                            }
                                        </div>
                                        }
                                { this.props.isPayRateEnabled && 
                                    <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                        <label className="mb-1 font-weight-bold">Pay Rate</label>
                                        <NumericTextBox
                                            className="form-control"
                                            placeholder="Enter Pay Rate"
                                            value={isNaN(this.state.payRate) ? 0 : this.state.payRate}
                                            //value={this.state.billRate}
                                            format="c2"
                                            min={0}
                                            max={99999}
                                            name="payRate"
                                            onChange={(e) => this.handleChange(e)}
                                        />
                                    </div>
                                }

                                <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                    <label className="mb-1 font-weight-bold">Comments</label>
                                    <textarea
                                        className="form-control"
                                        name="comment"
                                        placeholder="Enter Comments"
                                        value={this.state.comment || ""}
                                        maxLength={2000}
                                        onChange={(e) => this.setState({comment: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                            {/* </div> */}
                            {/* </div> */}

                            {this.state.openCommentBox && (
                                <WFHistoryBox
                                    entityId={this.state.subBillRateId}
                                    showDialog={this.state.openCommentBox}
                                    handleNo={() => {
                                        this.setState({ openCommentBox: false });
                                        document.body.style.position = "";
                                    }}
                                />
                            )}
                        </div>)}
                    
                    {this.state.status && (
                        <FormActions
                            isloaded={this.onFormActionLoaded}
                            wfCode={CandidateWorkflow.BILLRATE}
                            currentState={this.state.status}
                            handleClick={this.handleActionClick}
                            handleClose={this.props.onCloseModal}
                        />
                    )}

                </div>
                {this.state.showRejectModal && this.actionId &&
                    <RejectModal
                        action="Reject"
                        actionId={this.actionId}
                        message={REJECT_BILLRATE_CONFIRMATION_MSG(null)}
                        showModal={this.state.showRejectModal}
                        handleYes={(data) => this.billRateStatusUpdate(BILLRATE_REJECTED_SUCCESS_MSG, "showRejectModal", data)}
                        handleNo={() => {
                            this.setState({ showRejectModal: false });
                        }}
                    />
                }
                {this.state.showNegotiateModal && this.actionId &&
                    <RejectModal
                        action="Negotiate"
                        actionId={this.actionId}
                        message={NEGOTIATE_BILLRATE_CONFIRMATION_MSG(null)}
                        showModal={this.state.showNegotiateModal}
                        handleYes={(data) => this.billRateStatusUpdate(BILLRATE_SENT_NEGOTIATION_SUCCESS_MSG, "showNegotiateModal", data)}
                        handleNo={() => {
                            this.setState({ showNegotiateModal: false });
                        }}
                    />
                }
                <ConfirmationModal
                    message={BILLRATE_APPROVE_CONFIRMATION_MSG}
                    showModal={this.state.showApproveModal}
                    handleYes={(e) => this.billRateStatusUpdate(BILLRATE_APPROVE_SUCCESS_MSG, "showApproveModal")}
                    handleNo={() => {
                        this.setState({ showApproveModal: false });
                    }}
                />
                {this.state.showContractValidationModal && 
                    <IconMessageModal
                        title={"Bill Rate Update"}
                        icon={faTimesCircle}
                        iconClass={"circle-red"}
                        message={CONTRACT_SUBMITTED_TIMESHEET_MSG(this.state.contractSubmittedTimeSheetData)}
                        showModal={this.state.showContractValidationModal}
                        handleNo={() => {
                            this.setState({ showContractValidationModal: false, contractSubmittedTimeSheetData: [] });
                        }}
                   />
                }
                <AlertBox
                    handleNo={() => { this.setState({ openAlert: false }) }}
                    message={this.alertMessage}
                    showModal={this.state.openAlert}
                ></AlertBox>
            </div>
        );
    }
}
export default AddBillRateAndExpenses;
