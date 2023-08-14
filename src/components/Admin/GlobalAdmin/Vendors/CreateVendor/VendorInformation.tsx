import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { MaskedTextBox, NumericTextBox } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../../../Shared/withValueField";
import { Comment } from "../../../../Shared/Comment/Comment";
import axios from "axios";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import { ErrorComponent, FormatPhoneNumber } from "../../../../ReusableComponents";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { CompositeFilterDescriptor, toODataString, State } from "@progress/kendo-data-query";
import { restrictValue } from "../../../../../HelperMethods";

const CustomDropDownList = withValueField(DropDownList);

const defaultItem = { name: "Select...", id: null };
const defaultState = { name: "Select...", stateId: null };

export interface VendorInformationProps {
    data: any;
    clientId: string;
    handleChange: any;
    handleObjChange: any;
    handleDropdownChange: any;
    formikProps: any;
}

export interface VendorInformationState {
    city: Array<IDropDownModel>;
    originalcity: Array<IDropDownModel>;
    country: Array<IDropDownModel>;
    originalcountry: Array<IDropDownModel>;
    state: Array<IDropDownModel>;
    originalstate: Array<IDropDownModel>;
    showLoader?: boolean;
}

class VendorInformation extends React.Component<VendorInformationProps, VendorInformationState> {
    constructor(props: VendorInformationProps) {
        super(props);
        this.state = {
            city: [],
            country: [],
            state: [],
            originalcity: [],
            originalcountry: [],
            originalstate: [],
            showLoader: true,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.getCountry();
    }

    getCountry = () => {
        axios.get(`api/admin/country`)
            .then(async res => {
                let data = res.data.filter((i) => i.name =="United States")
                this.setState({ country: res.data, originalcountry: res.data, showLoader:false}) // , countryId: data[0].countryId });//, () => this.getState());
                
                this.props.handleObjChange({
                    countryId: data[0].countryId,
                    stateId: null,
                    cityId: null,
                });   
                if (this.props.data.countryId !=null) { 
                this.getState(this.props.data.countryId);
                }else {
                    this.setState({ state: [], city: [] });
                }

            
            });  
    }

    handleCountryChange = (e) => {
        const countryId = e.target.value;
        this.props.handleObjChange({
            countryId: countryId,
            stateId: null,
            cityId: null,
        });
        if (countryId !=null) {
            this.getState(countryId);
        } else {
            this.setState({ state: [], city: [] });
        }
    };


    getState = (countryId) => {
        axios.get(`api/admin/country/${countryId}/state`)
            .then(async res => {
                this.setState({ state: res.data, originalstate: res.data });
            });
    }

    handleStateChange = (e) => {
        const stateId = e.target.value;
        this.props.handleObjChange({
            stateId: stateId,
            cityId: null,
        });
        if (stateId !=null) {
            this.getCity(stateId);
        } else {
            this.setState({ city: [] });
        }
    };

    getCity = (stateId) => {
        axios.get(`api/admin/state/${stateId}/city`)
            .then(async res => {
                this.setState({ city: res.data, originalcity: res.data });
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

    render() {
        const { data, formikProps } = this.props;
        return (
            <div className="">
                <div className="row">
                    <div className="col-12 pl-0 pr-0">
                        {this.state.showLoader &&
                                    Array.from({ length: 3 }).map((item, i) => (
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
                                        <div className="row mt-2 mx-0">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold required">Vendor Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    placeholder="Enter Vendor Name"
                                                    value={data.name}
                                                    name="name"
                                                    maxLength={100}
                                                    onChange={(e) => this.props.handleChange(e)}
                                                />
                                                {formikProps.errors.name && <ErrorComponent message={formikProps.errors.name} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control "
                                                    placeholder="Enter Email"
                                                    value={data.email}
                                                    name="email"
                                                    maxLength={100}
                                                    onChange={(e) => this.props.handleChange(e)}
                                                />
                                                {formikProps.errors.email && <ErrorComponent message={formikProps.errors.email} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Mobile Number</label>
                                                <MaskedTextBox
                                                    mask="(000) 000-0000"
                                                    name="mobileNumber"
                                                    className="form-control"
                                                    placeholder="Enter Mobile Number"
                                                    value={data.mobileNumber}
                                                    maskValidation
                                                    onChange={(e) => this.props.handleChange(e)}
                                                />
                                               {formikProps.errors.mobileNumber && (
                                                    <ErrorComponent message={formikProps.errors.mobileNumber} />
                                                )}
                                            </div>
                                        </div>

                                        <div className="row mt-3 mx-0">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Phone Number</label>
                                                <MaskedTextBox
                                                    mask="(000) 000-0000"
                                                    name="phoneNumber"
                                                    className="form-control"
                                                    placeholder="Enter Phone Number"
                                                    value={data.phoneNumber}
                                                    maskValidation
                                                    onChange={(e) => this.props.handleChange(e)}
                                                />
                                                {formikProps.errors.phoneNumber && (
                                                    <ErrorComponent message={formikProps.errors.phoneNumber} />
                                                )}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Address 1</label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    placeholder="Enter Address 1"
                                                    value={data.address1}
                                                    maxLength={100}
                                                    name="address1"
                                                    onChange={(e) => this.props.handleChange(e)}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Address 2</label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    placeholder="Enter Address 2"
                                                    value={data.address2}
                                                    maxLength={100}
                                                    name="address2"
                                                    onChange={(e) => this.props.handleChange(e)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row mt-3 mx-0">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                                                <label className="mb-1 font-weight-bold ">State</label>
                                                 <CustomDropDownList
                                                    className={"form-control disabled"}
                                                    disabled={!data.countryId}
                                                    data={this.state.state}
                                                    name="stateId"
                                                    textField="name"
                                                    valueField="stateId"
                                                    id="state"
                                                    defaultItem={defaultState}
                                                    value={data.stateId}
                                                    onChange={(e) => this.handleStateChange(e)}
                                                    filterable={this.state.originalstate.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">City</label>
                                                <CustomDropDownList
                                                    className={"form-control disabled"}
                                                    disabled={!data.stateId}
                                                    data={this.state.city}
                                                    name="cityId"
                                                    textField="name"
                                                    valueField="cityId"
                                                    id="city"
                                                    defaultItem={defaultItem}
                                                    value={data.cityId}
                                                    onChange={(e) => this.props.handleDropdownChange(e)}
                                                    filterable={this.state.originalcity.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Postal Code</label>
                                                {/* <NumericTextBox
                                                    className="form-control text-right"
                                                    name="postalCode"
                                                    placeholder="Enter Postal Code"
                                                    value={data.postalCode}
                                                    onChange={(e) => this.props.handleChange(e)}
                                                    max={999999999}
                                                    min={0}
                                                    format="#"
                                                    spinners={false}
                                                /> */}

                                                <input
                                                    type="number"
                                                    className="form-control no-spinner"
                                                    name="postalCode"
                                                    placeholder="Enter Postal Code"
                                                    value={data.postalCode}
                                                    // maxLength={9}
                                                    onChange={(e) => this.props.handleChange(e)}
                                                    onWheel={(e) => e.currentTarget.blur()}
                                                    onKeyPress={(e) => restrictValue(e)}
                                                />
                                                {formikProps.errors.postalCode && <ErrorComponent message={formikProps.errors.postalCode} />}
                                            </div>
                                        </div>

                                        <div className="row mt-3 mx-0">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                                                <label className="mb-1 font-weight-bold ">Country</label>
                                                <CustomDropDownList
                                                    className={"form-control disabled"}
                                                    data={this.state.country}
                                                    valueField="countryId"
                                                    name={`countryId`}
                                                    textField="name"
                                                    id="country"
                                                    value={data.countryId}
                                                    //onChange={(e) => this.props.handleDropdownChange(e)}
                                                    onChange={(e) => this.handleCountryChange(e)}
                                                    filterable={this.state.originalcountry.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                    </div>
                </div>
            </div>
        );
    }
}

export default VendorInformation;