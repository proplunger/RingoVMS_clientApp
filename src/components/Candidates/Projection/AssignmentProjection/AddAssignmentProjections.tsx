import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import axios from "axios";
import { IDropDownModel } from "../../../Shared/Models/IDropDownModel";
import Skeleton from "react-loading-skeleton";
import _ from "lodash";
import withValueField from "../../../Shared/withValueField";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { CREATE_PROJECTION_SUCCESS_MSG, OVERRIDE_EXISTING_PROJECTION_GENERATE_CONFIRMATION_MSG, UPDATE_PROJECTION_SUCCESS_MSG } from "../../../Shared/AppMessages";
import { errorToastr, localDateTime, successToastr } from "../../../../HelperMethods";
import { BillRateStatus, ServiceCategory } from "../../../Shared/AppConstants";
import { filterBy } from "@progress/kendo-data-query";
import { ErrorComponent } from "../../../ReusableComponents";
import ConfirmationModal from "../../../Shared/ConfirmationModal";

const CustomDropDownList = withValueField(DropDownList);

export interface AddAssignmentProjectionsProps {
    candSubmissionId: string;
    targetStartDate: any;
    targetEndDate: any;
    dataItem?: any;
    onCloseModal?: any;
    onOpenModal: any;
}

export interface AddAssignmentProjectionsState {
    candSubProjectionId: string;
    serviceCategories: Array<IDropDownModel>;
    serviceTypes: Array<any>;
    originalserviceTypes: Array<any>;
    isServiceCatTime: boolean;
    isServiceCatExpense: boolean;
    startDate?: any;
    endDate?: any;
    serviceCatId: string;
    serviceTypeId?: string;
    billRate?: number;
    hours?: any;
    amount?: any;
    // isPercentage?: boolean;
    // percentage?: any;
    showLoader?: boolean;
    isDirty?: boolean;
    submitted: boolean;
    isHidden: boolean;
    showAssignmentProjectionModal?: boolean;
    serviceType?: any;
}

const defaultItem = { serviceType: "Select...", serviceTypeId: null };
class AssignmentProjections extends React.Component<AddAssignmentProjectionsProps, AddAssignmentProjectionsState>{
    public isSaveClicked = false;
    public alertMessage;
    constructor(props: AddAssignmentProjectionsProps) {
        super(props);
        this.state = {
            candSubProjectionId: "",
            serviceCategories: [],
            serviceTypes: [],
            originalserviceTypes: [],
            billRate: undefined,
            hours: 0,
            amount: null,
            isServiceCatTime: true,
            isServiceCatExpense: false,
            serviceCatId: "",
            showLoader: true,
            startDate: null,
            endDate: null,
            submitted: false,
            isHidden: false,
        };
    }

    componentDidMount() {
        this.getServiceCategories();
        if (this.props.dataItem) {
            this.setState({
                candSubProjectionId: this.props.dataItem.candSubProjectionId,
                startDate: this.props.dataItem.startDate,
                endDate: this.props.dataItem.endDate,
                serviceTypeId: this.props.dataItem.serviceTypeId,
                billRate: this.props.dataItem.billRate,
                hours: this.props.dataItem.hours,
                amount: this.props.dataItem.expenseAmount
                // isPercentage: this.props.dataItem.isPercentage,
                // percentage: this.props.dataItem.percentageValue
            });
        }
    }

    getServiceCategories = () => {
        axios.get(`api/candidates/servicecat?$orderby=name`).then((res) => {
            this.setState({ serviceCategories: res.data, showLoader: false });
            if (this.props.dataItem) {
                this.setState({
                    isServiceCatTime: this.props.dataItem.serviceCategory=='Time' ? true : false,
                    isServiceCatExpense: this.props.dataItem.serviceCategory=='Expenses' ? true : false,
                    isHidden: this.props.dataItem.serviceCategory==ServiceCategory.EXPENSE ? true : false
                })
            }
            if (this.state.isServiceCatTime || this.props.dataItem.serviceCategory=='Time') {
                this.getServiceTypes(this.state.serviceCategories.find(x => x.name=="Time").id);
            }
            else {
                this.getServiceTypes(this.state.serviceCategories.find(x => x.name=="Expenses").id);
            }
        });
    }

    onServiceCatChange = (event) => {
        this.setState({
            isServiceCatTime: !this.state.isServiceCatTime,
            serviceTypeId: null,
            billRate: undefined,
            isHidden: event.target.name==ServiceCategory.EXPENSE ? true : false,
            hours: null,
            amount: null,
        });
        this.getServiceTypes(event.target.id);
    }

    distinctServiceTypes = (allServices) => {  //, startDate) => {
        let distinctServices = [];
        let boundryData = allServices  //.filter(x => new Date(x.startDate).setHours(0, 0, 0, 0) <= new Date(startDate).setHours(0, 0, 0, 0) && new Date(x.endDate).setHours(0, 0, 0, 0) >= new Date(startDate).setHours(0, 0, 0, 0));
    
        boundryData.forEach(element => {
          if (distinctServices.findIndex(x => x.serviceTypeId==element.serviceTypeId)==-1) {
            distinctServices.push(element);
          }
        });
        return distinctServices;
    }

    getServiceTypes = (id) => {
        axios.get(`api/candidates/billrate?$filter=candSubId eq ${this.props.candSubmissionId} and serviceCatId eq ${id} and status eq '${BillRateStatus.APPROVED}'&$orderby=serviceType`).then((res) => {
            let services = this.distinctServiceTypes(res.data);//, this.state.date);
            this.setState({
                serviceTypes: services,
                originalserviceTypes: services,
            }, () => {
                if (document.getElementsByName('startDate') && document.getElementsByName('startDate')[0]) {
                    document.getElementsByName('startDate')[0]['disabled'] = true;
                    document.getElementsByName('endDate')[0]['disabled'] = true;
                }
            });
        });
    }

    handleServiceTypeChange = (event) => {
        let billRate = event.value.billRate ? event.value.billRate : event.value.overrideBillRate;
        this.setState({
            serviceTypeId: event.value.serviceTypeId,
            billRate: billRate
        });
    }

    handleCheckboxChange(e, modelProp) {
        var stateObj = {};
        stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
        this.setState(stateObj);
    }

    openNew = () => {
        this.props.onOpenModal();
    };

    handleSave = (isOverrideProjection = false, isSaveAddAnother?) => {
        this.setState({ submitted: true })
        const { candSubProjectionId } = this.state;
        let data = {
            candSubmissionId: this.props.candSubmissionId,
            candSubProjectionId: candSubProjectionId,
            projectedStartDate: localDateTime(this.state.startDate),
            projectedEndDate: localDateTime(this.state.endDate),
            serviceTypeId: this.state.serviceTypeId,
            billRate: this.state.billRate,
            hours: this.state.isHidden==false ? this.state.hours : null,
            amount: this.state.amount,
            isOverrideProjection: isOverrideProjection,
            isGenerateGlobalProjection: false
            // isPercentage: this.state.isPercentage,
            // percentage: this.state.percentage != undefined ? this.state.percentage : null
        };

        if (candSubProjectionId) {
            if ((this.state.startDate !=undefined && this.state.startDate !=null)
                && (this.state.endDate !=undefined && this.state.endDate !=null)
                && (this.state.serviceTypeId !=undefined && this.state.serviceTypeId !=null)
                && (this.state.billRate !=undefined && this.state.billRate !=null)
                && (this.state.isHidden==false ? (this.state.hours !=undefined && this.state.hours !=null && this.state.hours >= 0) : (this.state.hours==null || this.state.hours < 0))) {
                axios.put(`api/candidates/projection/${candSubProjectionId}`, JSON.stringify(data)).then((res) => {
                    successToastr(UPDATE_PROJECTION_SUCCESS_MSG);
                    this.props.onCloseModal();
                    if (isSaveAddAnother==true) {
                        setTimeout(() => {
                            this.openNew();
                        }, 50);
                    }
                });
            }
        } else {
            if ((this.state.startDate !=undefined && this.state.startDate !=null)
                && (this.state.endDate !=undefined && this.state.endDate !=null)
                && (this.state.serviceTypeId !=undefined && this.state.serviceTypeId !=null)
                && (this.state.billRate !=undefined && this.state.billRate !=null)
                && (this.state.isHidden==false ? (this.state.hours !=undefined && this.state.hours !=null && this.state.hours >= 0) : this.state.hours==null || this.state.hours < 0)) {
                axios.post(`api/candidates/generateprojections`, JSON.stringify(data)).then((res) => {
                    if (res.data && !res.data.isSuccess) {
                        errorToastr(res.data.statusMessage);
                        this.setState({
                            showLoader: false,
                            serviceType: res.data.responseCode,
                            showAssignmentProjectionModal: true
                        });
                    } else {
                        successToastr(CREATE_PROJECTION_SUCCESS_MSG);
                        this.setState({ showLoader: false });
                        this.props.onCloseModal();
                        if (isSaveAddAnother==true) {
                            setTimeout(() => {
                                this.openNew();
                            }, 50);
                        }
                    }
                });
            }
        }
    }

    handleFilterChange(event) {
        var name = event.target.props.id;
        var originalArray = "original" + name;
        this.state[name] = this.filterData(event.filter, originalArray);
        this.setState(this.state);
    }

    filterData(filter, originalArray) {
        const data1 = this.state[originalArray];
        return filterBy(data1, filter);
    }

    render() {
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">{this.props.dataItem != undefined ? "Edit " : "Add "}Assignment Forecast</h4>
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
                                <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2 cal-icon-color">
                                    <label className="mb-1 font-weight-bold required">{this.props.dataItem ==undefined ? "Forecast " : "Pay Period "}Start Date</label>
                                    <DatePicker
                                        disabled={this.props.dataItem}
                                        className="form-control"
                                        format="MM/dd/yyyy"
                                        name="startDate"
                                        value={this.state.startDate !=undefined && this.state.startDate != null ? new Date(this.state.startDate) : null}
                                        formatPlaceholder="formatPattern"
                                        onChange={(e) => this.setState({ startDate: e.target.value })}
                                        min={new Date(new Date(this.props.targetStartDate).setDate(new Date(this.props.targetStartDate).getDate()))}
                                        max={this.props.targetEndDate ? new Date(new Date(this.props.targetEndDate).setDate(new Date(this.props.targetEndDate).getDate())) :
                                            new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                                        }
                                    />
                                    {this.state.submitted && (this.state.startDate==undefined || this.state.startDate==null) && <ErrorComponent />}
                                </div>
                                <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2 cal-icon-color">
                                    <label className="mb-1 font-weight-bold required">{this.props.dataItem ==undefined ? "Forecast " : "Pay Period "}End Date</label>
                                    <DatePicker
                                        disabled={this.props.dataItem}
                                        className="form-control"
                                        format="MM/dd/yyyy"
                                        name="endDate"
                                        value={this.state.endDate !=undefined && this.state.endDate != null ? new Date(this.state.endDate) : null}
                                        formatPlaceholder="formatPattern"
                                        onChange={(e) => this.setState({ endDate: e.target.value })}
                                        min={new Date(new Date(this.state.startDate).setDate(new Date(this.state.startDate).getDate() + 1))}
                                        max={this.props.targetEndDate ? new Date(new Date(this.props.targetEndDate).setDate(new Date(this.props.targetEndDate).getDate())) :
                                            new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                                        }
                                    />
                                    {this.state.submitted && (this.state.endDate==undefined || this.state.endDate==null) && <ErrorComponent />}
                                </div>
                                <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2 font-weight-bold">
                                    <label className="required">Service Category</label>
                                    <div className="d-flex mb-2 mb-sm-0">
                                        <label className="container container_checkboxandradio radioBtnCustom font-weight-normal col-auto">
                                            Time
                                            <input
                                                disabled={this.props.dataItem}
                                                type="radio"
                                                name="serviceCategory"
                                                value={"true"}
                                                id={this.state.serviceCategories.find(x => x.name=="Time") !=undefined ? this.state.serviceCategories.find(x => x.name=="Time").id : undefined}
                                                checked={this.state.isServiceCatTime}
                                                onChange={(e) => this.onServiceCatChange(e)}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="container container_checkboxandradio radioBtnCustom font-weight-normal">
                                            Expenses
                                            <input
                                                disabled={this.props.dataItem}
                                                type="radio"
                                                name="Expenses"
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
                                        disabled={this.props.dataItem}
                                        className="form-control"
                                        data={this.state.serviceTypes}
                                        name="serviceType"
                                        textField="serviceType"
                                        valueField="serviceTypeId"
                                        defaultItem={defaultItem}
                                        value={this.state.serviceTypeId}
                                        id="serviceTypes"
                                        onChange={(e) => this.handleServiceTypeChange(e)}
                                        filterable={this.state.originalserviceTypes.length > 5 ? true : false}
                                        onFilterChange={this.handleFilterChange}
                                    />
                                    {this.state.submitted && (this.state.serviceTypeId==undefined || this.state.serviceTypeId==null) && <ErrorComponent />}
                                </div>
                                {this.props.dataItem && (
                                <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                    <label className="mb-1 font-weight-bold required">Bill Rate</label>
                                    <NumericTextBox
                                        disabled={true}
                                        className="form-control"
                                        placeholder="Enter Bill Rate"
                                        value={isNaN(this.state.billRate) ? 0 : this.state.billRate}
                                        format="c2"
                                        min={0}
                                        max={99999}
                                        name="billRate"
                                    />
                                    {this.state.submitted && (this.state.billRate==undefined || this.state.billRate==null) && <ErrorComponent />}
                                </div>
                                )}
                                {/* {(!this.state.isHidden==true &&
                                    <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2 font-weight-bold">
                                        <label>Type</label>
                                        <div className="d-flex mb-2 mb-sm-0">
                                            <label className="container container_checkboxandradio radioBtnCustom font-weight-normal col-auto">
                                                Hours
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="1"
                                                    onChange={(event) => {
                                                        this.setState({ type: event.target.value, amount: null });
                                                    }}
                                                    checked={this.state.type==1 ? true : false}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label className="container container_checkboxandradio radioBtnCustom font-weight-normal">
                                                Amount
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="2"
                                                    onChange={(event) => {
                                                        this.setState({ type: event.target.value, hours: null });
                                                    }}
                                                    checked={this.state.type==2 ? true : false}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                )} */}

                                {(!this.state.isHidden &&
                                    <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                        <label className="mb-1 font-weight-bold required">Hours</label>
                                        <NumericTextBox
                                            // disabled={this.state.type==2}
                                            className="form-control"
                                            value={(isNaN(this.state.hours)) ? 0 : this.state.hours}
                                            min={0}
                                            max={99999}
                                            name="hours"
                                            onChange={(e) => this.setState({ hours: e.target.value })}
                                        />
                                        {this.state.submitted && !this.state.isHidden && (this.state.hours==undefined || this.state.hours==null || this.state.hours < 0) && <ErrorComponent message="Hours cannot be less than 0" />}
                                    </div>
                                )}

                                {(this.state.isHidden &&
                                    <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                        <label className="mb-1 font-weight-bold ">Amount</label>
                                        <NumericTextBox
                                            // disabled={this.state.type==1}
                                            className="form-control"
                                            placeholder="Enter Amount"
                                            value={(isNaN(this.state.amount) || this.state.amount==null) ? 0 : this.state.amount}
                                            format="c2"
                                            min={0}
                                            max={99999}
                                            name="billRate"
                                            onChange={(e) => this.setState({ amount: e.target.value })}
                                        />
                                    </div>
                                )}

                                {/* <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                    <label className="mb-1 font-weight-bold ">Is Percentage</label>
                                    <label className="container-R d-flex mb-0 pb-3">
                                        <input
                                            type="checkbox"
                                            value="false"
                                            onChange={(e) => this.handleCheckboxChange(e, "isPercentage")}
                                            checked={this.state.isPercentage}
                                            name="isPercentage"
                                        />
                                        <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                    </label>
                                </div>
                                <div className="col-12 col-sm-6 col-lg-4 mt-2 mt-sm-2">
                                    <label className="mb-1 font-weight-bold ">Percentage (%)</label>
                                    <NumericTextBox
                                        className="form-control"
                                        value={isNaN(this.state.percentage) ? 0 : this.state.percentage}
                                        // format="c2"
                                        min={0}
                                        max={99999}
                                        name="billRate"
                                        onChange={(e) => this.setState({ percentage: e.target.value })}
                                    />
                                </div> */}
                            </div>
                        </div>)}
                    <div className="modal-footer justify-content-center border-0 mt-3 mb-3">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                            </button>
                            <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => { this.handleSave(false, true) }}>
                                <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save & Add Another
                            </button>
                            <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => { this.handleSave(false, false) }}>
                                <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save & Close
                            </button>
                        </div>
                    </div>
                    <ConfirmationModal
                        message={OVERRIDE_EXISTING_PROJECTION_GENERATE_CONFIRMATION_MSG(this.state.serviceType)}
                        showModal={this.state.showAssignmentProjectionModal}
                        handleYes={() => {
                            this.setState({ showAssignmentProjectionModal: false });
                            this.handleSave(true)
                        }}
                        handleNo={() => {
                            this.setState({ showAssignmentProjectionModal: false });
                        }}
                    />
                </div>
            </div>
        );
    }
}
export default AssignmentProjections;
