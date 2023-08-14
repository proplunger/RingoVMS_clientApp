import { faSave } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../../Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import withValueField from "../../../../Shared/withValueField";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import * as React from "react";
import { clientRateCardValidation } from "./validations/validations";
import { successToastr, toLocalDateTime } from "../../../../../HelperMethods";
import { ErrorComponent } from "../../../../ReusableComponents";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton from "react-loading-skeleton";
import commonService from "../../../../Shared/Services/CommonDataService";
import globalAdminService from "../../../GlobalAdmin/Service/DataService";
import clientAdminService from "../../Service/DataService";
import { CLIENT_RATE_CARD_CREATE_SUCCESS_MSG, CLIENT_RATE_CARD_UPDATE_SUCCESS_MSG, GLOBAL_JOB_CATALOG_CREATE_SUCCESS_MSG, GLOBAL_JOB_CATALOG_UPDATE_SUCCESS_MSG } from "../../../../Shared/AppMessages";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { Form } from "reactstrap";
import { Formik } from "formik";
import axios from "axios";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select..", id: null };

export interface CreateClientRateCardProps {
    props: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateClientRateCardState {
    clientId?: string;
    clientName: string;
    divisionId?: string;
    locationId?: string;
    jobCategoryId?: string;
    positionId?: string;
    shiftId?: string;
    serviceCategoryId?: string;
    serviceTypeId?: string;
    billTypeId?: string;
    rateCardId?: string;
    maxBillRate?: number;
    suppress?: number;
    supressionAmount?: number;
    maxHolidayBillRate?: number;
    validFrom?: Date;
    validTo?: Date;
    submitted: boolean;
    showLoader?: boolean;
    divisions: Array<IDropDownModel>;
    originaldivisions: Array<IDropDownModel>;
    locations: Array<IDropDownModel>;
    originallocations: Array<IDropDownModel>;
    jobCategories: Array<IDropDownModel>;
    originaljobCategories: Array<IDropDownModel>;
    positions: Array<IDropDownModel>;
    originalpositions: Array<IDropDownModel>;
    shifts: Array<IDropDownModel>;
    originalshifts: Array<IDropDownModel>;
    serviceCategory: Array<IDropDownModel>;
    originalserviceCategory: Array<IDropDownModel>;
    serviceTypes: Array<IDropDownModel>;
    originalserviceTypes: Array<IDropDownModel>;
    billTypes: Array<IDropDownModel>;
    originalbillTypes: Array<IDropDownModel>;
    isDirty?: boolean;
    addNew?: boolean;
}

class CreateClientRateCard extends React.Component<CreateClientRateCardProps, CreateClientRateCardState> {
    constructor(props: CreateClientRateCardProps) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            clientName: auth.getClientName(),
            divisions: [],
            originaldivisions: [],
            locations: [],
            originallocations: [],
            jobCategories: [],
            originaljobCategories: [],
            positions: [],
            originalpositions: [],
            shifts: [],
            originalshifts: [],
            billTypes: [],
            originalbillTypes: [],
            serviceCategory: [],
            originalserviceCategory: [],
            serviceTypes: [],
            originalserviceTypes: [],
            suppress: 0,
            showLoader: true,
            submitted: false,
            isDirty: false,
            validFrom: new Date(),
            validTo: new Date(new Date().setDate(new Date().getDate() + 1)),
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.getDivisions();
        this.getJobCategory();
        //this.getShifts();
        this.getServiceCategories();
        this.getBillTypes();
        if (this.props.props) {
            this.setState({
                rateCardId: this.props.props.id,
                divisionId: this.props.props.divisionId,
                locationId: this.props.props.locationId,
                jobCategoryId: this.props.props.jobCategoryId,
                positionId: this.props.props.positionId,
                //shiftId: this.props.props.shiftTypeId,
                serviceCategoryId: this.props.props.serviceCategoryId,
                serviceTypeId: this.props.props.serviceTypeId,
                billTypeId: this.props.props.billTypeId,
                maxBillRate: this.props.props.maxBillRate,
                suppress: this.props.props.suppressPer,
                maxHolidayBillRate: this.props.props.maxHolidayBillRate,
                validFrom: this.props.props.validFrom,
                validTo: this.props.props.validTo
            }, () => {
                this.state.divisionId && this.getLocations(this.state.divisionId);
                this.state.jobCategoryId && this.getPositions(this.state.jobCategoryId);
                this.state.serviceCategoryId && this.getServiceTypes(this.state.serviceCategoryId)
            })
        }
    }

    getDivisions = () => {
        const { clientId } = this.state;
        let queryParams = `status eq 'Active'&$orderby=name`;
        if(this.props.props && this.props.props.divisionId){
            queryParams = `status eq 'Active' or id eq ${this.props.props.divisionId} &$orderby=name `;
        }
        commonService.getClientDivision(clientId, queryParams).then((res) => {
            this.setState({ divisions: res.data, originaldivisions: res.data, showLoader: false });
        });
    }

    handleDivisionChange = (e) => {
        const Id = e.value.id;
        this.setState({ divisionId: Id, locationId: null });
        if (Id) {
            this.getLocations(Id);
        }
        else {
            this.setState({ locations: [] });
        }
    }

    getLocations = (Id) => {
        let queryParams = `status eq 'Active' and divId eq ${Id} &$orderby=name`;
        if(this.props.props && this.props.props.locationId){
            //queryParams = `status eq 'Active' and divId eq ${Id} or id eq ${this.props.props.locationId} &$orderby=name `;
            queryParams = `(status eq 'Active' or id eq ${this.props.props.locationId}) and divId eq ${Id}&$orderby=name `;
        }
        commonService.getDivisionLocations(queryParams).then((res) => {
            this.setState({ locations: res.data, originallocations: res.data });
        });
    }

    handleDropdownChange = (e) => {
        let change = { isDirty: true };
        change[e.target.props.name] = e.target.value;
        this.setState(change);
    }

    getJobCategory = () => {
        const { clientId } = this.state;
        const queryParams = `status eq 'Active'&$orderby=name`;
        globalAdminService.getClientPositionCategories(clientId, queryParams)
            .then(async res => {
                this.setState({ jobCategories: res.data, originaljobCategories: res.data });
            });
    }

    handleJobCategoryChange = (e) => {
        const Id = e.value.id;
        this.setState({ jobCategoryId: Id, positionId: null }, () => {
            if (Id !=null) {
                this.getPositions(Id)
            } else {
                this.setState({ positions: [] })
            }
        });
    }

    getPositions = (Id) => {
        axios.get(`api/clients/${this.state.clientId}/jobcategories/${Id}/jobpositions?$orderby=name`)
            .then(async res => {
                this.setState({ positions: res.data, originalpositions: res.data });
            });
    }

    // getShifts = () => {
    //     commonService.getShiftTypes()
    //         .then(async res => {
    //             this.setState({ shifts: res.data, originalshifts: res.data });
    //         });
    // }

    getServiceCategories = () => {
        axios.get(`api/candidates/servicecat?$orderby=name`).then((res) => {
            this.setState({ serviceCategory: res.data, originalserviceCategory: res.data });
        });
    }

    handleServiceCategoriesChange = (e) => {
        const Id = e.value.id;
        this.setState({ serviceCategoryId: Id, serviceTypeId: null }, () => {
            if (Id !=null) {
                this.getServiceTypes(Id)
            } else {
                this.setState({ serviceTypes: [] })
            }
        });
    }

    getServiceTypes = (Id) => {
        axios.get(`api/admin/servicetypes?$filter=serviceCatId eq ${Id}&$orderby=name`)
            .then(async res => {
                this.setState({ serviceTypes: res.data, originalserviceTypes: res.data });
            });
    }

    getBillTypes = () => {
        commonService.getBillTypes()
            .then(async res => {
                this.setState({ billTypes: res.data, originalbillTypes: res.data });
            });
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

    openNew = () => {
        this.props.onOpenModal();
    };

    saveClientRateCard(isSubmit: boolean) {
        let data = {
            client: this.state.clientId,
            division: this.state.divisionId,
            location: this.state.locationId,
            position: this.state.positionId,
            // shift: this.state.shiftId,
            serviceType: this.state.serviceTypeId,
            billType: this.state.billTypeId,
            maxBillRate: this.state.maxBillRate,
            suppress: this.state.suppress,
            maxHolidayBillRate: this.state.maxHolidayBillRate,
            validFrom: toLocalDateTime(this.state.validFrom),
            validTo: toLocalDateTime(this.state.validTo),
            rateCardId: this.state.rateCardId
        };
        data["isSubmit"] = isSubmit;
        if (this.state.rateCardId) {
            const { rateCardId } = this.state;
            clientAdminService.putClientRateCard(rateCardId, data).then((res) => {
                successToastr(CLIENT_RATE_CARD_UPDATE_SUCCESS_MSG);
                this.props.onCloseModal();
            });
        } else {
            clientAdminService.postClientRateCard(data).then((res) => {
                if (this.state.addNew) {
                    successToastr(CLIENT_RATE_CARD_CREATE_SUCCESS_MSG);
                    this.props.onCloseModal();
                    setTimeout(() => {
                        this.openNew();
                    }, 50);
                }
                else {
                    successToastr(CLIENT_RATE_CARD_CREATE_SUCCESS_MSG);
                    this.props.onCloseModal();
                }
            });
        }
    }
    render() {
        const perc = (this.state.suppress / 100) * this.state.maxBillRate;
        const supressionAmount = this.state.maxBillRate - perc
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                        <BreadCrumbs></BreadCrumbs>
                        </h4>
                        <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.onCloseModal}>
                            &times;
                        </button>
                    </div>
                    <Formik
                        validateOnMount={this.state.submitted}
                        initialValues={this.state}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validationSchema={clientRateCardValidation}
                        validateOnBlur={false}
                        onSubmit={(fields) => this.saveClientRateCard(true)}
                        render={(formikProps) => (
                            <Form onSubmit={(e) => { e.preventDefault(); formikProps.handleSubmit(); }} className="col-12 ml-0 mr-0" id="collapsiblePadding" onChange={formikProps.handleChange}>
                                {this.state.showLoader &&
                                    Array.from({ length: 5 }).map((item, i) => (
                                        <div className="row mx-auto mt-2" key={i}>
                                            {Array.from({ length: 3 }).map((item, j) => (
                                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
                                                    <Skeleton width={230} />
                                                    <Skeleton height={30} />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                {!this.state.showLoader && (
                                    <div>
                                        <div className="row mt-2 mx-0">
                                            <div className="col-sm-4">
                                                <label className="mb-0 font-weight-bold">Client</label>
                                                <input
                                                    type="text"
                                                    className="form-control mt-1"
                                                    disabled={true}
                                                    value={this.state.clientName}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-2">
                                                <label className="mb-1 font-weight-bold required">Division</label>
                                                <CustomDropDownList
                                                    className={"form-control disabled "}
                                                    data={this.state.divisions}
                                                    name={`divisionId`}
                                                    textField="name"
                                                    valueField="id"
                                                    id="divisions"
                                                    defaultItem={defaultItem}
                                                    value={this.state.divisionId}
                                                    onChange={(e) => this.handleDivisionChange(e)}
                                                    filterable={this.state.originaldivisions.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.divisionId && <ErrorComponent message={formikProps.errors.divisionId} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-2">
                                                <label className="mb-1 font-weight-bold required">Location</label>
                                                <CustomDropDownList
                                                    className="form-control disabled"
                                                    name={`locationId`}
                                                    disabled={!this.state.divisionId}
                                                    data={this.state.locations}
                                                    textField="name"
                                                    valueField="id"
                                                    id="locations"
                                                    defaultItem={defaultItem}
                                                    value={this.state.locationId}
                                                    onChange={(e) => this.handleDropdownChange(e)}
                                                    filterable={this.state.originallocations.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.locationId && <ErrorComponent message={formikProps.errors.locationId} />}
                                            </div>
                                        </div>
                                        <div className="row mt-2 mx-0">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-0">
                                                <label className="mb-1 font-weight-bold required">Job Category</label>
                                                <CustomDropDownList
                                                    className={"form-control disabled "}
                                                    data={this.state.jobCategories}
                                                    disabled={!this.state.clientId}
                                                    name="jobCategory"
                                                    //name={`jobCategoryId`}
                                                    textField="name"
                                                    valueField="id"
                                                    id="jobCategories"
                                                    defaultItem={defaultItem}
                                                    value={this.state.jobCategoryId}
                                                    onChange={(e) => this.handleJobCategoryChange(e)}
                                                    filterable={this.state.originaljobCategories.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.jobCategoryId && <ErrorComponent message={formikProps.errors.jobCategoryId} />}
                                            </div>
                                            <div className="col-sm-4 text-box-disbaled mt-sm-0 mt-2">
                                                <label className="mb-1 font-weight-bold required">Position</label>
                                                <CustomDropDownList
                                                    className="form-control disabled"
                                                    disabled={!this.state.jobCategoryId}
                                                    name={`positionId`}
                                                    data={this.state.positions}
                                                    textField="name"
                                                    valueField="id"
                                                    id="positions"
                                                    defaultItem={defaultItem}
                                                    value={this.state.positionId}
                                                    onChange={(e) => this.handleDropdownChange(e)}
                                                    filterable={this.state.originalpositions.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.positionId && <ErrorComponent message={formikProps.errors.positionId} />}
                                            </div>
                                            <div className="col-sm-4 mt-sm-0 mt-2">
                                                <label className="mb-1 font-weight-bold required">Service Category</label>
                                                <CustomDropDownList
                                                    className="form-control disabled"
                                                    name={`serviceTypeId`}
                                                    data={this.state.serviceCategory}
                                                    textField="name"
                                                    valueField="id"
                                                    id="serviceCategory"
                                                    defaultItem={defaultItem}
                                                    value={this.state.serviceCategoryId}
                                                    onChange={(e) => this.handleServiceCategoriesChange(e)}
                                                    filterable={this.state.originalserviceCategory.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.serviceCategoryId && <ErrorComponent message={formikProps.errors.serviceCategoryId} />}
                                            </div>

                                        </div>
                                        <div className="row mt-2 mx-0">
                                            <div className="col-sm-4 text-box-disbaled mt-sm-0 mt-0">
                                                <label className="mb-1 font-weight-bold required">Service Type</label>
                                                <CustomDropDownList
                                                    className="form-control disabled"
                                                    disabled={!this.state.serviceCategoryId}
                                                    name={`serviceTypeId`}
                                                    data={this.state.serviceTypes}
                                                    textField="name"
                                                    valueField="id"
                                                    id="serviceTypes"
                                                    defaultItem={defaultItem}
                                                    value={this.state.serviceTypeId}
                                                    onChange={(e) => this.handleDropdownChange(e)}
                                                    filterable={this.state.originalserviceTypes.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.serviceTypeId && <ErrorComponent message={formikProps.errors.serviceTypeId} />}
                                            </div>
                                            <div className="col-sm-4 mt-sm-0 mt-2">
                                                <label className="mb-1 font-weight-bold required">Bill Type</label>
                                                <CustomDropDownList
                                                    className="form-control disabled"
                                                    name={`billTypeId`}
                                                    data={this.state.billTypes}
                                                    textField="name"
                                                    valueField="id"
                                                    id="billTypes"
                                                    defaultItem={defaultItem}
                                                    value={this.state.billTypeId}
                                                    onChange={(e) => this.handleDropdownChange(e)}
                                                    filterable={this.state.originalbillTypes.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.billTypeId && <ErrorComponent message={formikProps.errors.billTypeId} />}
                                            </div>
                                            <div className="col-sm-4 mt-sm-0 mt-2" id="removemargin-border">
                                                <label className="mb-1 font-weight-bold required">Max. Bill Rate</label>
                                                <NumericTextBox
                                                    className="form-control text-right"
                                                    name="maxBillrate"
                                                    placeholder="Enter Amount"
                                                    value={isNaN(this.state.maxBillRate) ? 0 : this.state.maxBillRate}
                                                    onChange={(event) => {
                                                        this.setState({ maxBillRate: event.target.value });
                                                    }}
                                                    title="Maximum value could be 99999."
                                                    max={99999}
                                                    min={0}
                                                    format="c2"
                                                />
                                                {formikProps.errors.maxBillRate && <ErrorComponent message={formikProps.errors.maxBillRate} />}
                                            </div>
                                        </div>

                                        <div className="row mt-2 mx-0">
                                            <div className="col-sm-4" id="removemargin-border">
                                                <label className="mb-1 font-weight-bold ">% Suppress</label>
                                                <NumericTextBox
                                                    className="form-control text-right"
                                                    name="supress"
                                                    placeholder="Enter Percentage"
                                                    value={isNaN(this.state.suppress) ? 0 : this.state.suppress}
                                                    onChange={(event) => {
                                                        this.setState({ suppress: event.target.value==undefined ? 0 : event.target.value });
                                                    }}
                                                    title="Maximum value could be 99."
                                                    max={99}
                                                    min={0}
                                                    format="#"
                                                />
                                                {formikProps.errors.suppress && <ErrorComponent message={formikProps.errors.suppress} />}
                                                {/* {this.state.submitted && (this.state.suppress==undefined || this.state.suppress==null ) ? <ErrorComponent /> : this.state.suppress < 0 && <ErrorComponent message="Suppress value should be greater than 0"/>} */}
                                            </div>
                                            <div className="col-sm-4 mt-sm-0 mt-2" id="removemargin-border">
                                                <label className="mb-1 font-weight-bold">Suppression Amount</label>
                                                <NumericTextBox
                                                    className="form-control text-right"
                                                    disabled={true}
                                                    name="supressionAmount"
                                                    placeholder="Enter Amount"
                                                    value={isNaN(supressionAmount) ? this.state.maxBillRate : supressionAmount}
                                                    title="Maximum value could be 99999."
                                                    max={99999}
                                                    min={0}
                                                    format="c2"
                                                />
                                            </div>
                                            <div className="col-sm-4 mt-sm-0 mt-2" id="removemargin-border">
                                                <label className="mb-1 font-weight-bold required">Max. Holiday Bill Rate</label>
                                                <NumericTextBox
                                                    className="form-control text-right"
                                                    name="maxHolidayBillRate"
                                                    placeholder="Enter Amount"
                                                    value={isNaN(this.state.maxHolidayBillRate) ? 0 : this.state.maxHolidayBillRate}
                                                    onChange={(event) => {
                                                        this.setState({ maxHolidayBillRate: event.target.value });
                                                    }}
                                                    title="Maximum value could be 99999."
                                                    max={99999}
                                                    min={0}
                                                    format="c2"
                                                />
                                                {formikProps.errors.maxHolidayBillRate && <ErrorComponent message={formikProps.errors.maxHolidayBillRate} />}
                                            </div>
                                        </div>
                                        <div className="row mt-2 mx-0">
                                            <div className="col-sm-4" id="ShowDatePickerIcon">
                                                <label className="mb-1 font-weight-bold">Valid From</label>
                                                <DatePicker
                                                    className="form-control"
                                                    format="MM/dd/yyyy"
                                                    name="validFrom"
                                                    value={this.state.validFrom ? new Date(this.state.validFrom) : null}
                                                    //value={this.state.validFrom && new Date(this.state.validFrom) }
                                                    //max={this.state.validTo && new Date(new Date(this.state.validTo).setDate(new Date(this.state.validTo).getDate() - 1))}
                                                    onChange={(event) => {
                                                        this.setState({ validFrom: event.target.value });
                                                    }}
                                                    formatPlaceholder="formatPattern"
                                                />
                                                {formikProps.errors.validFrom && <ErrorComponent message={formikProps.errors.validFrom} />}
                                            </div>
                                            <div className="col-sm-4 mt-sm-0 mt-2" id="ShowDatePickerIcon">
                                                <label className="mb-1 font-weight-bold">Valid To</label>
                                                <DatePicker
                                                    className="form-control"
                                                    format="MM/dd/yyyy"
                                                    name="validTo"
                                                    value={this.state.validTo !=undefined && this.state.validTo != null ? new Date(this.state.validTo) : null}
                                                    //value={(this.state.validTo !=undefined && this.state.validTo != null ) && new Date(this.state.validTo)}
                                                    //min={this.state.validFrom && new Date(new Date(this.state.validFrom).setDate(new Date(this.state.validFrom).getDate() + 1))}
                                                    onChange={(event) => {
                                                        this.setState({ validTo: event.target.value });
                                                    }}
                                                    formatPlaceholder="formatPattern"
                                                />
                                                {formikProps.errors.validTo && <ErrorComponent message={formikProps.errors.validTo} />}
                                            </div>
                                        </div>
                                    </div>
                                )}


                                <div className="modal-footer justify-content-center border-0 mt-3 mb-3">
                                    <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                        <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                        </button>
                                        {this.props.props != undefined
                                            ?
                                            <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true })}>
                                                <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                            </button>
                                            :
                                            <React.Fragment>
                                                <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true, addNew: true })}>
                                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save & Add Another
                                                </button>
                                                <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" >
                                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save & Close
                                                </button>
                                            </React.Fragment>
                                        }
                                    </div>
                                </div>
                            </Form>
                        )}
                    />
                </div>
            </div>
        );
    }
}
export default CreateClientRateCard;