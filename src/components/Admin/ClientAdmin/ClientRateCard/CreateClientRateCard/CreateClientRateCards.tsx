import { faChevronCircleDown, faChevronCircleUp, faSave } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../../Auth";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import withValueField from "../../../../Shared/withValueField";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import * as React from "react";
import { clientRateCardValidation } from "./validations/validations";
import { errorToastr, history, successToastr, toLocalDateTime } from "../../../../../HelperMethods";
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
import CommonInfoMultiselect from "../../OnBoardingConfiguration/CreateOnBoardingConfiguration/CommonInfoMultiselect";
import RateCardGroupTask from "../Common/RateCardGroupTasks";
import { EDIT_CLIENT_RATE_CARD } from "../../../../Shared/ApiUrls";
import { BillTypeFilters, BillTypeIntIds } from "../../../../Shared/AppConstants";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select..", id: null };

export interface CreateClientRateCardProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateClientRateCardState {
    clientRateCardId?: string;
    clientRateCardGroupId?: string;
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
    billTypeFilter?: any;
    maxBillRate?: number;
    suppress?: number;
    supressionAmount?: number;
    maxHolidayBillRate?: number;
    validFrom?: Date;
    validTo?: Date;
    submitted: boolean;
    showLoader?: boolean;
    selectedDivisions: any;
    isAllDivSelected: boolean;
    selectedLocations: any;
    isAllLocSelected: boolean;
    selectedJobCategory: any;
    selectedPositions: any;
    isAllJobCatSelected: any;
    isAllJobPosSelected: any;
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
    toggleAll: boolean;
    toggelFirst: boolean;
    //openExistingTasksGrid: any;
    exisitingGroupIds: any;
    IsSaveAndRemove: boolean;
    isProfileUpdate: boolean;
}

class CreateClientRateCard extends React.Component<CreateClientRateCardProps, CreateClientRateCardState> {
    public rateCardChild: any;
    constructor(props: CreateClientRateCardProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            clientRateCardId: "",
            clientRateCardGroupId: id,
            clientId: auth.getClient(),
            clientName: auth.getClientName(),
            selectedDivisions: [],
            selectedLocations: [],
            selectedJobCategory: [],
            selectedPositions: [],
            isAllDivSelected: false,
            isAllLocSelected: false,
            isAllJobCatSelected: false,
            isAllJobPosSelected: false,
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
            toggleAll: false,
            toggelFirst: true,
            //openExistingTasksGrid: false,
            exisitingGroupIds: [],
            IsSaveAndRemove: false,
            isProfileUpdate: false,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.getServiceCategories();

        if (this.state.clientRateCardGroupId==undefined || this.state.clientRateCardGroupId==null) {
            this.getBillTypes(BillTypeFilters.ALLBILLTYPES);
        }

        if (this.state.clientRateCardGroupId) {
            this.getClientRateCardProfileDetails(this.state.clientRateCardGroupId);
        }

        if (this.state.clientRateCardGroupId) {
            this.getClientRateCardDetail(this.state.clientRateCardGroupId);
        }
    }

    getServiceCategories = () => {
        axios.get(`api/candidates/servicecat?$orderby=name`).then((res) => {
            this.setState({ serviceCategory: res.data, originalserviceCategory: res.data, showLoader: false });
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

    handleServiceTypesChange = (e) => {
        const BillTypeFilter = e.value.billTypeFilter;
        let change = { isDirty: true };
        change[e.target.props.name] = e.target.value;
        this.setState(change);
            if (BillTypeFilter) {
                this.getBillTypes(BillTypeFilter)
            } else {
                this.setState({ billTypes: [] })
            }
    }

    getBillTypes = (BillTypeFilter) => {
        if(BillTypeFilter==BillTypeFilters.ALLBILLTYPES){
            this.setState({ billTypeId: null })
            axios.get(`api/admin/billtypes?$filter=intId ne ${BillTypeIntIds.ONETIME}`)
                .then(async res => {
                    this.setState({ billTypes: res.data, originalbillTypes: res.data });
                });
        }else{
            this.setState({ billTypeId: null })
            axios.get(`api/admin/billtypes?$filter=intId eq ${BillTypeIntIds.ONETIME}`)
                .then(async res => {
                    this.setState({ billTypes: res.data, originalbillTypes: res.data });
                });
        }
    }

    handleDropdownsChange = (e) => {
        let change = { isDirty: true };
        change[e.target.props.name] = e.target.value;
        this.setState(change);
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

    handleObjChange = (change) => {
        change["isDirty"] = true;
        this.setState(change);
    };

    handleDropdownChange = (e) => {

    };

    handleCheckboxChange(e, modelProp) {
        var stateObj = {};
        stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
        this.setState(stateObj);
      }

    saveClientRateCard(isSubmit: boolean) {
        let data = {
            client: this.state.clientId,
            Divisions: this.state.selectedDivisions.map((div) => div.id),
            Locations: this.state.selectedLocations.map((loc) => loc.id),
            Positions: this.state.selectedPositions.map((pos) => pos.id),
            serviceType: this.state.serviceTypeId,
            billType: this.state.billTypeId,
            maxBillRate: this.state.maxBillRate,
            suppress: this.state.suppress,
            maxHolidayBillRate: this.state.maxHolidayBillRate,
            validFrom: toLocalDateTime(this.state.validFrom),
            validTo: toLocalDateTime(this.state.validTo),
            rateCardProfileGroupId: this.state.clientRateCardGroupId,
            isProfileUpdate: this.state.isProfileUpdate

        };
        data["isSubmit"] = isSubmit;
        if (this.state.clientRateCardGroupId) {
            const { clientRateCardGroupId } = this.state;
            clientAdminService.putClientRateCard(clientRateCardGroupId, data).then((res) => {
                if (res.data && !res.data.isSuccess) {
                    errorToastr(res.data.statusMessage);
                    this.setState({
                      //openExistingTasksGrid: true,
                      exisitingGroupIds: res.data.data,
                    });
                  } else {
                    successToastr(CLIENT_RATE_CARD_UPDATE_SUCCESS_MSG);
                    history.goBack();
                  }
            });
        } else {
            data['tags'] = this.rateCardChild.tagRef.state.selectedValues
            // data['entityTypeId'] = this.rateCardChild.tagRef.props.entityTypeId

            clientAdminService.postClientRateCard(data).then((res) => {
                if (res.data && !res.data.isSuccess) {
                    errorToastr(res.data.statusMessage);
                    this.setState({
                        //openExistingTasksGrid: true,
                        exisitingGroupIds: res.data.data,
                    });
                } else {
                    successToastr(CLIENT_RATE_CARD_CREATE_SUCCESS_MSG);
                    history.push('/admin/clientratecard/manage');
                }
            });
        }
    }

    getClientRateCardProfileDetails(clientRateCardGroupId: string) {
        axios.get(`api/admin/ratecard/profile/${clientRateCardGroupId}`).then((res) => {
            const { data } = res;
            var divs = [];
            data.divisionIds.map((x) =>
                divs.filter((a) => a.id==x.id).length > 0
                    ? null
                    : divs.push({ id: x.id, name: x.name })
            );
            var locs = [];
            data.locationIds.map((x) =>
                locs.filter((a) => a.id==x.id).length > 0
                    ? null
                    : locs.push({ id: x.id, name: x.name })
            );
            var cats = [];
            data.jobCategoryIds.map((x) =>
                cats.filter((a) => a.id==x.id).length > 0
                    ? null
                    : cats.push({ id: x.id, name: x.name })
            );
            var pos = [];
            data.positionIds.map((x) =>
                pos.filter((a) => a.name==x.id).length > 0
                    ? null
                    : pos.push({ id: x.id, name: x.name })
            );
            this.setState({
                clientId: data.clientId,
                selectedDivisions: divs,
                selectedLocations: locs,
                selectedJobCategory: cats,
                selectedPositions: pos,
            }, () => {
                this.state.selectedDivisions &&
                    this.state.selectedDivisions.length > 0 &&
                    this.rateCardChild.getLocations(
                        this.state.selectedDivisions.map((div) => div.id)
                    );
                this.state.selectedJobCategory &&
                    this.state.selectedJobCategory.length > 0 &&
                    this.rateCardChild.getPositions(
                        this.state.selectedJobCategory.map((cat) => cat.id)
                    );
            });
        });
    }

    getClientRateCardDetail(clientRateCardId: string) {
        axios.get(`api/admin/ratecard/${clientRateCardId}`).then((res) => {
            const { data } = res;
            this.getBillTypes(data.billTypeFilter);
            this.setState({
                clientRateCardId: data.id,
                clientRateCardGroupId: data.rateCardProfileGroupId,
                serviceCategoryId: data.serviceCategoryId,
                serviceTypeId: data.serviceTypeId,
                billTypeId: data.billTypeId,
                billTypeFilter: data.billTypeFilter,
                maxBillRate: data.maxBillRate,
                suppress: data.suppressPer,
                maxHolidayBillRate: data.maxHolidayBillRate,
                validFrom: data.validFrom,
                validTo: data.validTo
            }, () => { this.getServiceTypes(this.state.serviceCategoryId); });
        });
    }

    onCollapseOpen = () => {
        this.setState({
            toggleAll: true,
            toggelFirst: true,
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggleAll: false,
            toggelFirst: false,
        });
    };

    render() {
        const controlsToShow = ['CLIENT', 'DIVISION', 'LOCATION', 'POSITION', 'JOB CATEGORY']
        const perc = (this.state.suppress / 100) * this.state.maxBillRate;
        const supressionAmount = this.state.maxBillRate - perc;
        const {
            toggleAll,
            toggelFirst,
        } = this.state;
        const reqTriggerName = (
            <span>
                Rate Card Details
            </span>
        );
        const {
            clientRateCardGroupId,
            clientId,
            selectedDivisions,
            selectedLocations,
            selectedJobCategory,
            selectedPositions,
            isAllDivSelected,
            isAllLocSelected,
            isAllJobCatSelected,
            isAllJobPosSelected,
        } = this.state;
        const commonInfo = {
            clientRateCardGroupId,
            clientId,
            selectedDivisions,
            selectedLocations,
            selectedJobCategory,
            selectedPositions,
            isAllDivSelected,
            isAllLocSelected,
            isAllJobCatSelected,
            isAllJobPosSelected,
        };
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-12 col-md-12 fonFifteen paddingLeftandRight">
                            <div className="row mx-0 align-items-center">
                                <div><BreadCrumbs globalData={{rateCardProfileGroupId:this.state.clientRateCardGroupId}}></BreadCrumbs>
                                </div>
                                {this.state.clientRateCardGroupId && (<div className="col pr-0 d-flex align-items-center justify-content-end">
                                    <span className=" d-none d-sm-inline">
                                    <label className="container-R d-flex mb-0 pb-0 dispaly-ssn-inline">
                                        <span className="Introduction-line-height pl-0">
                                            Edit Profile
                                        </span>
                                        <input
                                            type="checkbox"
                                            onChange={(e) =>
                                            this.handleCheckboxChange(e, "isProfileUpdate")
                                            }
                                        />
                                        <span
                                            className="checkmark-R checkPosition checkPositionTop"
                                            style={{ left: "0px" }}
                                        ></span>
                                    </label>
                                    </span>
                                </div>)}
                            </div>
                        </div>
                    </div>
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
                        <Form
                            onSubmit={(e) => { e.preventDefault(); formikProps.handleSubmit(); }}
                            className="col-12 ml-0 mr-0"
                            id="collapsiblePadding"
                            //translate="yes"
                            onChange={formikProps.handleChange}
                        //autoComplete="false"
                        >
                            

                                {this.state.showLoader &&
                                    Array.from({ length: 5 }).map((item, i) => (
                                        <div className="row mx-auto mt-2" key={i}>
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
                                    <div>
                                        {((clientRateCardGroupId && selectedDivisions) ||
                                            !clientRateCardGroupId) && (
                                                <CommonInfoMultiselect
                                                    ref={(instance) => {
                                                        this.rateCardChild = instance;
                                                    }}
                                                    data={commonInfo}
                                                    Id={clientRateCardGroupId}
                                                    handleObjChange={this.handleObjChange}
                                                    handleDropdownChange={this.handleDropdownChange}
                                                    formikProps={formikProps}
                                                    controlsToShow={controlsToShow}
                                                    isInEdit={this.state.clientRateCardGroupId ? (this.state.isProfileUpdate ? false : true) : false}
                                                    isTagsAllowed={true}
                                                />
                                            )}

                            <Collapsible
                                trigger={reqTriggerName}
                                open={toggelFirst}
                                accordionPosition="1"
                                onTriggerOpening={() =>
                                    this.setState({ toggelFirst: true })
                                }
                                onTriggerClosing={() =>
                                    this.setState({ toggelFirst: false })
                                }
                            >
                                        <div className="row">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-0">
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
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-2 mt-sm-0">
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
                                                    onChange={(e) => this.handleServiceTypesChange(e)}
                                                    filterable={this.state.originalserviceTypes.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.serviceTypeId && <ErrorComponent message={formikProps.errors.serviceTypeId} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0   mt-2 mt-sm-0">
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
                                                    onChange={(e) => this.handleDropdownsChange(e)}
                                                    filterable={this.state.originalbillTypes.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.billTypeId && <ErrorComponent message={formikProps.errors.billTypeId} />}
                                            </div>
                                        </div>

                                        <div className="row mt-2">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-0">
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

                                            <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
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
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0 area-merged">
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
                                        </div>

                                        <div className="row mt-2">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-0">
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
                                            <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
                                                <label className="mb-1 font-weight-bold">Valid From</label>
                                                <DatePicker
                                                    className="form-control"
                                                    format="MM/dd/yyyy"
                                                    name="validFrom"
                                                    value={this.state.validFrom ? new Date(this.state.validFrom) : null}
                                                    onChange={(event) => {
                                                        this.setState({ validFrom: event.target.value });
                                                    }}
                                                    formatPlaceholder="formatPattern"
                                                />
                                                {formikProps.errors.validFrom && <ErrorComponent message={formikProps.errors.validFrom} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
                                                <label className="mb-1 font-weight-bold">Valid To</label>
                                                <DatePicker
                                                    className="form-control"
                                                    format="MM/dd/yyyy"
                                                    name="validTo"
                                                    value={this.state.validTo !=undefined && this.state.validTo != null ? new Date(this.state.validTo) : null}
                                                    onChange={(event) => {
                                                        this.setState({ validTo: event.target.value });
                                                    }}
                                                    formatPlaceholder="formatPattern"
                                                />
                                                {formikProps.errors.validTo && <ErrorComponent message={formikProps.errors.validTo} />}
                                            </div>
                                        </div>
                            </Collapsible>
                                    </div>
                                )}
                            

                            <div className="modal-footer justify-content-center border-0">
                                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                    <button
                                        type="button"
                                        className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                                        onClick={() => history.goBack()}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTimesCircle}
                                            className={"mr-1"}
                                        />{" "}
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                        onClick={() => this.setState({ submitted: true })}
                                    >
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} />{" "}
                                        Save
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                />
                {/* {this.state.openExistingTasksGrid && this.state.exisitingGroupIds && (
                    <RateCardGroupTask
                        exisitingGroupIds={this.state.exisitingGroupIds}
                        clientId={this.state.clientId}
                        showDialog={this.state.openExistingTasksGrid}
                        handleNo={() => {
                            this.setState({ openExistingTasksGrid: false });
                            document.body.style.position = "";
                        }}
                        handleYes={() => {
                            this.setState({ openExistingTasksGrid: false });
                            this.saveClientRateCard(true, true)
                        }}
                        Title={"Overlapping Client Rate Card"}
                        Url={EDIT_CLIENT_RATE_CARD}
                    />
                )} */}
            </div>
        );
    }
}
export default CreateClientRateCard;