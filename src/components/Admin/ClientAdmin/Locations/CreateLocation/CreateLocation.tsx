import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faUserCircle, faChevronCircleDown, faChevronCircleUp, faClock, faSave, faTimesCircle, faHistory, faEye } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../../Auth";
import axios from "axios";
import { history, restrictValue, successToastr } from "../../../../../HelperMethods";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { ErrorComponent, FormatPhoneNumber } from "../../../../ReusableComponents";
import { locationValidation } from "./validations/validation";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import withValueField from "../../../../Shared/withValueField";
import Skeleton from "react-loading-skeleton";
import { MaskedTextBox, NumericTextBox } from "@progress/kendo-react-inputs";
import { filterBy } from "@progress/kendo-data-query";
import commonService from "../../../../Shared/Services/CommonDataService";
import clientAdminService from "../../Service/DataService";
import { DIVISION_LOC_CREATE_SUCCESS_MSG, DIVISION_LOC_UPDATE_SUCCESS_MSG } from "../../../../Shared/AppMessages";
import { ALLSELECTED } from "../../OnBoardingConfiguration/CreateOnBoardingConfiguration/CommonInfoMultiselect";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select...", id: null };
const defaultCity = { name: "Select City", id: null };
const defaultState = { name: "Select State", stateId: null };

export interface CreateLocationProps {
    props: any;
    match: any;
    location: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateLocationState {
    clientId?: string;
    divisionId?: string;
    clientName?: string;
    selectedDivisions?: any[];
    locationId?: string;
    locationName?: string;
    description?: string;
    addressId?: string;
    email?: string;
    mobileNumber?: string;
    phoneNumber?: string;
    status?: string;
    address1?: string;
    address2?: string;
    cityId?: string;
    stateId?: string;
    countryId?: string;
    postalCode?: any;
    submitted: boolean;
    toggleAll: boolean;
    isPrivate?: boolean;
    showLoader?: boolean;
    isDirty?: boolean;
    toggelFirst: boolean;
    isAllDivSelected?: boolean;
    divisions: Array<any>;
    originaldivisions: Array<IDropDownModel>;
    city: Array<IDropDownModel>;
    originalcity: Array<IDropDownModel>;
    country: Array<IDropDownModel>;
    originalcountry: Array<IDropDownModel>;
    state: Array<IDropDownModel>;
    originalstate: Array<IDropDownModel>;
}

class CreateLocation extends React.Component<CreateLocationProps, CreateLocationState> {

    constructor(props: CreateLocationProps) {
        super(props);
        const { locId } = this.props.match.params;
        const { clientId } = this.props.match.params;
        const { id } = this.props.match.params;
        var params = new URLSearchParams(this.props.location.search)
        this.state = {
            clientId: clientId,
            divisionId: id,
            clientName: params.get("name"),
            selectedDivisions: [],
            locationId: locId,
            addressId: "",
            cityId: "",
            stateId: "",
            countryId: "",
            submitted: false,
            toggleAll: false,
            isDirty: false,
            toggelFirst: true,
            showLoader: true,
            divisions: [],
            originaldivisions: [],
            city: [],
            originalcity: [],
            country: [],
            originalcountry: [],
            state: [],
            originalstate: [],
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.getDivisions();
        this.getCountry();

        const { locationId } = this.state;
        if (locationId) {
            this.getLocationDetails(locationId);
        }
    }

    getDivisions = () => {
        const { clientId } = this.state;
        let queryParams = `status eq 'Active'&$orderby=name`;
        // if(this.state.locationId && this.state.divisionId){
        //     queryParams = `status eq 'Active' or id eq ${this.state.divisionId} &$orderby=name `;
        // }
        commonService.getClientDivision(clientId, queryParams).then((res) => {
            if(this.state.divisionId){
                var defaultDivisions = res.data.filter(x => x.id==this.state.divisionId)
                this.setState({selectedDivisions: defaultDivisions})
            }
            res.data.unshift({ name: ALLSELECTED.ALLDIVISIONS, divisionIntId: 9999 });
            this.setState({ divisions: res.data, originaldivisions: res.data, showLoader: false,isAllDivSelected:this.state.selectedDivisions.length==this.state.divisions.length - 1, });
        });
    }

    handleDivisionChange = (e) => {
        var isAllSelected = false;
        var selectedDiv = e.value.filter(
            (x) => x.id !=undefined && x.id !=null && x.divisionIntId !=9999
          );
        if (e.nativeEvent.target.innerText.trim() ==ALLSELECTED.ALLDIVISIONS
            || (e.nativeEvent.target.nextSibling !=null && e.nativeEvent.target.nextSibling.nextSibling !=null
                && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=null && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=undefined
                && e.nativeEvent.target.nextSibling.nextSibling.wholeText.trim() ==ALLSELECTED.ALLDIVISIONS)) {
            if (!this.state.isAllDivSelected) {
                isAllSelected = true;
                selectedDiv = this.state.divisions;
            } else {
                selectedDiv = [];
                
            }
        } else {
            if (selectedDiv.length==(this.state.divisions.length - 1)) {
                selectedDiv.unshift({ name: ALLSELECTED.ALLDIVISIONS, divisionIntId: 9999 });
                isAllSelected = true;
            }
        }

        this.setState({ selectedDivisions: selectedDiv, isAllDivSelected:isAllSelected });
    };

    getCountry = () => {
        commonService.getCountry()
            .then(async res => {
                let data = res.data.filter((i) => i.name =="United States")
                this.setState({ country: res.data, originalcountry: res.data, countryId: data[0].countryId }, () => this.getState());
            });
    }

    handleCountryChange = (e) => {
        const Id = e.value.countryId;
        this.setState({ countryId: Id, stateId: null, cityId: null }, () => this.getState());
    }

    getState = () => {
        const { countryId } = this.state;
        commonService.getState(countryId)
            .then(async res => {
                this.setState({ state: res.data, originalstate: res.data });
            });
    }

    handleStateChange = (e) => {
        const id = e.value.stateId;
        this.setState({ stateId: id, cityId: null }, () => {
            if (id) {
                this.getCity(id);
            }
            else {
                this.setState({ city: [] });
            }
        });
    }

    getCity = (id) => {
        const { stateId } = this.state;
        commonService.getCity(stateId)
            .then(async res => {
                this.setState({ city: res.data, originalcity: res.data });
            });
    }

    handleCityChange = (e) => {
        const Id = e.value.cityId;
        this.setState({ cityId: Id });
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

    saveLocation(isSubmit: boolean) {
        let data = {
            clientId:this.state.clientId,
            locationId: this.state.locationId,
            locationName: this.state.locationName,
            description: this.state.description,
            selectedDivisions: this.state.selectedDivisions.filter(x => x.divisionIntId !=9999),
            email: this.state.email,
            mobileNumber: this.state.mobileNumber,
            phoneNumber: this.state.phoneNumber,
            address1: this.state.address1,
            address2: this.state.address2,
            city: this.state.cityId,
            state: this.state.stateId,
            postalCode: this.state.postalCode,
            country: this.state.countryId,
            addressId: this.state.addressId
        };
        data["isSubmit"] = isSubmit;
        data["phoneNumber"] = data["phoneNumber"] ? data["phoneNumber"].replace(/\D+/g, "") : "";
        data["mobileNumber"] = data["mobileNumber"] ? data["mobileNumber"].replace(/\D+/g, "") : "";
        if (this.state.locationId) {
            const { locationId } = this.state;
            clientAdminService.putLocation(locationId, data).then((res) => {
                successToastr(DIVISION_LOC_UPDATE_SUCCESS_MSG);
                history.goBack();
                // history.push('/admin/location/manage');
            });
        } else {
            //axios.post("api/clients/divisions/locations", JSON.stringify(data)).then((res) => {
            clientAdminService.postLocation(data).then((res) => {
                successToastr(DIVISION_LOC_CREATE_SUCCESS_MSG);
                history.goBack();
                // history.push('/admin/location/manage');
            });
        }
    }

    getLocationDetails(locationId: string) {
        clientAdminService.getLocationDetail(locationId).then((res) => {
            const { data } = res;
            this.setState({
                
                selectedDivisions: data.divisions,
                locationId: data.id,
                locationName: data.name,
                description: data.description,
                addressId: data.addressId,
                email: data.email,
                address1: data.address1,
                address2: data.address2,
                cityId: data.cityId,
                countryId: data.countryId,
                stateId: data.stateId,
                postalCode: data.pinCodeId,
                mobileNumber: FormatPhoneNumber(data.mobileNumber),
                phoneNumber: FormatPhoneNumber(data.phoneNumber),
                status: data.status,
                showLoader: false,
            }, () => { this.getDivisions() });

            if (data.stateId) {
                this.getCity(data.stateId);
            }
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

    itemRender = (li, itemProps) => {
        const itemChildren = (
            <span>
                <input
                    type="checkbox"
                    checked={itemProps.dataItem.name==ALLSELECTED.ALLDIVISIONS ? this.state.isAllDivSelected : itemProps.selected}
                    onChange={(e) => itemProps.onClick(itemProps.index, e)}
                />
                &nbsp;{li.props.children}
            </span>
        );
        return React.cloneElement(li, li.props, itemChildren);
    };

    render() {
        const {
            toggleAll,
            toggelFirst,
        } = this.state;
        const locationTriggerName = (
            <span>
                Basic Information
                <span
                    className="d-none d-sm-block"
                    style={{ float: "right", marginRight: "25px" }}
                >
                    Status :  {this.state.locationId ? <span className="font-weight-bold"> {this.state.status} </span> : "Draft"}
                </span>
            </span>
        );

        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-10 col-md-10 fonFifteen paddingLeftandRight">
                            <div className="d-none d-md-block">
                                <BreadCrumbs globalData={{clientId:this.state.clientId, locationId: this.state.locationId,divisionId:this.state.divisionId}}></BreadCrumbs>
                            </div>
                        </div>

                        <div className="col-2 col-md-2 text-right mt-sm-1 mt-md-0 txt-orderno text-underline paddingRight d-flex align-items-center justify-content-end ">

                            {toggelFirst ||
                                toggleAll ? (
                                <FontAwesomeIcon
                                    className="ml-2 mt-1 text-primary collapseExpandIcon globalExpandCursor"
                                    icon={faChevronCircleUp}
                                    onClick={
                                        toggleAll ? this.onCollapseClose : this.onCollapseOpen
                                    }
                                ></FontAwesomeIcon>
                            ) : (
                                <FontAwesomeIcon
                                    className="ml-2 mt-1 text-primary collapseExpandIcon globalExpandCursor"
                                    icon={faChevronCircleDown}
                                    onClick={
                                        toggleAll ? this.onCollapseClose : this.onCollapseOpen
                                    }
                                ></FontAwesomeIcon>
                            )}
                        </div>
                    </div>
                </div>

                <Formik
                    validateOnMount={this.state.submitted}
                    initialValues={this.state}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={locationValidation}
                    validateOnBlur={false}
                    onSubmit={(fields) => this.saveLocation(true)}
                    render={(formikProps) => (
                        <Form className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onChange={formikProps.handleChange}>
                            <Collapsible
                                trigger={locationTriggerName}
                                open={toggelFirst}
                                accordionPosition="1"
                                onTriggerOpening={() => this.setState({ toggelFirst: true })}
                                onTriggerClosing={() => this.setState({ toggelFirst: false })}
                            >
                                {this.state.showLoader &&
                                    Array.from({ length: 4 }).map((item, i) => (
                                        <div className="row mx-auto mt-2" key={i}>
                                            {Array.from({ length: 3 }).map((item, j) => (
                                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
                                                    <Skeleton width={100} />
                                                    <Skeleton height={30} />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                {!this.state.showLoader && (
                                    <div>
                                        <div className="row mt-2">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Client</label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    disabled={true}
                                                    value={this.state.clientName}
                                                // onChange={(event) => {
                                                //     this.setState({ locationName: event.target.value });
                                                // }}
                                                />
                                                {/* {formikProps.errors.clientName && <ErrorComponent message={formikProps.errors.clientName} />} */}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 multiselect">
                                                <label className="mb-1 font-weight-bold required">Division</label>
                                                <MultiSelect
                                                    className="form-control disabled"
                                                    data={this.state.divisions}
                                                    textField="name"
                                                    dataItemKey="id"
                                                    id="divisions"
                                                    itemRender={this.itemRender}
                                                    autoClose={false}
                                                    value={this.state.selectedDivisions.filter((x) => x.divisionIntId !=9999)}
                                                    onChange={(e) => this.handleDivisionChange(e)}
                                                    placeholder="Select Divisions..."
                                                    filterable={
                                                        this.state.originaldivisions.length > 5 ? true : false
                                                    }
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.selectedDivisions && <ErrorComponent message={formikProps.errors.selectedDivisions} />}
                                                {/* <CustomDropDownList
                                                    className={"form-control disabled "}
                                                    data={this.state.divisions}
                                                    name={`clientDivisionId`}
                                                    textField="name"
                                                    valueField="id"
                                                    id="divisions"
                                                    defaultItem={defaultItem}
                                                    value={this.state.divisionId}
                                                    onChange={(e) => this.handleDivisionChange(e)}
                                                    filterable={this.state.originaldivisions.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                /> */}

                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold required">Location Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    placeholder="Enter Location Name"
                                                    value={this.state.locationName}
                                                    maxLength={100}
                                                    onChange={(event) => {
                                                        this.setState({ locationName: event.target.value });
                                                    }}
                                                />
                                                {formikProps.errors.locationName && <ErrorComponent message={formikProps.errors.locationName} />}
                                            </div>
                                        </div>

                                        <div className="row mt-2">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-0 font-weight-bold required">Description</label>
                                                <textarea
                                                    rows={2}
                                                    id=""
                                                    maxLength={2000}
                                                    value={this.state.description}
                                                    className="form-control mt-1"
                                                    placeholder="Enter Description"
                                                    onChange={(event) => {
                                                        this.setState({ description: event.target.value });
                                                    }}
                                                />
                                                {formikProps.errors.description && <ErrorComponent message={formikProps.errors.description} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Mobile Number</label>
                                                <MaskedTextBox
                                                    mask="(000) 000-0000"
                                                    name="mobileNumber"
                                                    className="form-control"
                                                    placeholder="Enter Mobile Number"
                                                    value={this.state.mobileNumber}
                                                    maskValidation
                                                    onChange={(event) => {
                                                        this.setState({ mobileNumber: event.target.value });
                                                    }}
                                                />
                                                {formikProps.errors.mobileNumber && (
                                                    <ErrorComponent message={formikProps.errors.mobileNumber} />
                                                )}
                                            </div>

                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Phone Number</label>
                                                <MaskedTextBox
                                                    mask="(000) 000-0000"
                                                    name="phoneNumber"
                                                    className="form-control"
                                                    placeholder="Enter Phone Number"
                                                    value={this.state.phoneNumber}
                                                    maskValidation
                                                    onChange={(event) => {
                                                        this.setState({ phoneNumber: event.target.value });
                                                    }}
                                                />
                                                {formikProps.errors.phoneNumber && (
                                                    <ErrorComponent message={formikProps.errors.phoneNumber} />
                                                )}
                                            </div>
                                        </div>

                                        <div className="row mt-2">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Address 1</label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    placeholder="Enter Address 1"
                                                    value={this.state.address1}
                                                    maxLength={100}
                                                    onChange={(event) => {
                                                        this.setState({ address1: event.target.value });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Address 2</label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    placeholder="Enter Address 2"
                                                    value={this.state.address2}
                                                    maxLength={100}
                                                    onChange={(event) => {
                                                        this.setState({ address2: event.target.value });
                                                    }}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                                                <label className="mb-1 font-weight-bold ">State</label>
                                                <CustomDropDownList
                                                    className={"form-control disabled"}
                                                    disabled={!this.state.countryId}
                                                    data={this.state.state}
                                                    name="name"
                                                    textField="name"
                                                    valueField="stateId"
                                                    id="state"
                                                    defaultItem={defaultState}
                                                    value={this.state.stateId}
                                                    onChange={(e) => this.handleStateChange(e)}
                                                    filterable={this.state.originalstate.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="row mt-2">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">City</label>
                                                <CustomDropDownList
                                                    className={"form-control disabled"}
                                                    disabled={!this.state.stateId}
                                                    data={this.state.city}
                                                    name="name"
                                                    textField="name"
                                                    valueField="cityId"
                                                    id="city"
                                                    defaultItem={defaultCity}
                                                    value={this.state.cityId}
                                                    onChange={(e) => this.handleCityChange(e)}
                                                    filterable={this.state.originalcity.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Postal Code</label>
                                                
                                                <input
                                                    type="number"
                                                    className="form-control no-spinner"
                                                    name="postalCode"
                                                    placeholder="Enter Postal Code"
                                                    value={this.state.postalCode}
                                                    // maxLength={9}
                                                    onChange={(event) => {
                                                        this.setState({ postalCode: event.target.value });
                                                    }}
                                                    onWheel={(e) => e.currentTarget.blur()}
                                                    onKeyPress={(e) => restrictValue(e)}
                                                />
                                                {formikProps.errors.postalCode && <ErrorComponent message={formikProps.errors.postalCode} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                                                <label className="mb-1 font-weight-bold ">Country</label>
                                                <CustomDropDownList
                                                    className={"form-control disabled"}
                                                    data={this.state.country}
                                                    valueField="countryId"
                                                    name="name"
                                                    textField="name"
                                                    id="country"
                                                    value={this.state.countryId}
                                                    onChange={(e) => this.handleCountryChange(e)}
                                                    filterable={this.state.originalcountry.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.countryId && <ErrorComponent message={formikProps.errors.countryId} />}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Collapsible>

                            <div className="modal-footer justify-content-center border-0">
                                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                    <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                        <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                    </button>
                                    <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true })}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                />
            </div>
        );
    }
}

export default CreateLocation;