import * as React from 'react';
import { MaskedTextBox, NumericTextBox } from "@progress/kendo-react-inputs";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { ErrorComponent, FormatPhoneNumber } from "../../ReusableComponents";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import axios from "axios";
import withValueField from "../../Shared/withValueField";
import { filterBy } from '@progress/kendo-data-query';
import { restrictValue } from '../../../HelperMethods';
import { AuthRoleType } from '../AppConstants';

const CustomDropDownList = withValueField(DropDownList);
const defaultCity = { name: "Select City", id: null };
const defaultState = { name: "Select State", id: null };

export interface AddressProps {
    formikProps?: any;
    address?: any;
    onChange?: any;
    disabled?: boolean;
    setAddress?: any;
    userId?: any;
    userTypeId?: any;
}

export interface AddressState {
    addressId?: string;
    email?: string;
    addressLine1?: string;
    addressLine2?: string;
    cityId?: string;
    stateId?: string;
    countryId?: string;
    pinCodeId?: number;
    contactNum1?: string;
    contactNum2?: string;
    city?: Array<IDropDownModel>;
    originalcity?: Array<IDropDownModel>;
    country?: Array<IDropDownModel>;
    originalcountry?: Array<IDropDownModel>;
    states?: Array<IDropDownModel>;
    originalstates?: Array<IDropDownModel>;
}

class Address extends React.Component<AddressProps, AddressState> {
    constructor(props: AddressProps) {
        super(props);
        this.state = {
            ...props.address,
            originalcity: [],
            originalcountry: [],
            originalstates: []
        };
    }

    componentDidMount() {
        this.getCountry();
        if (this.state.countryId) {
            this.getState();
        }
        if (this.state.stateId) {
            this.getCity();
        }
    }

    getCity = () => {
        const { stateId } = this.state;
        axios.get(`api/admin/state/${stateId}/city`)
            .then(async res => {
                this.setState({ city: res.data, originalcity: res.data });
            });
    }

    getCountry = () => {
        axios.get(`api/admin/country`)
            .then(async res => {
                let data = res.data.filter((i) => i.name =="United States")
                this.setState({ country: res.data, originalcountry: res.data, countryId: data[0].countryId }, () => this.getState());
            });
    }

    handleCountryChange = (e) => {
        const Id = e.value.countryId;
        this.setState({ countryId: Id, stateId: null, cityId: null }, () => {
            this.getState();
            if (this.props.onChange)
                this.props.onChange(this.state);
        });
    }

    getState = () => {
        const { countryId } = this.state;
        axios.get(`api/admin/country/${countryId}/state`)
            .then(async res => {
                this.setState({ states: res.data, originalstates: res.data });
            });
    }

    handleStateChange = (e) => {
        const id = e.value.stateId;
        this.setState({ stateId: id, cityId: null }, () => {
            if (id) {
                this.getCity();
            }
            else {
                this.setState({ city: [] });
            }
            if (this.props.onChange)
                this.props.onChange(this.state);
        });
    }

    handleFilterChange = (event) => {
        var name = event.target.props.id;
        var originalArray = "original" + name;
        this.state[name] = this.filterData(event.filter, originalArray);
        this.setState(this.state);
    }

    handleDropdownChange = (e) => {
        let change = {};
        change[e.target.props.name] = e.target.value;
        this.setState(change, () => {
            if (this.props.onChange)
                this.props.onChange(this.state);
        });
    };

    filterData = (filter, originalArray) => {
        const data1 = this.state[originalArray];
        return filterBy(data1, filter);
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        }, () => {
            if (this.props.onChange)
                this.props.onChange(this.state);
        });
    }

    setAddress = (data) => {
        let change = { ...data };
        this.setState(change);
    }

    render() {
        const { formikProps } = this.props;
        return (
            <div>
                <div className="row mt-2">
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                        <label className="mb-1 font-weight-bold required">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control "
                            placeholder="Enter Email"
                            // maxLength={100}
                            value={this.state.email}
                            onChange={this.handleChange}
                            maxLength={50}
                            disabled={(this.props.userId && this.props.userTypeId==AuthRoleType.Provider) ? this.props.disabled : false}
                            //disabled={this.props.disabled}
                        />
                        {formikProps.errors.address && formikProps.errors.address.email && <ErrorComponent message={formikProps.errors.address.email} />}
                    </div>
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                        <label className="mb-1 font-weight-bold required">Mobile Number</label>
                        <MaskedTextBox
                            mask="(000) 000-0000"
                            name="contactNum1"
                            className="form-control"
                            placeholder="Enter Mobile Number"
                            value={this.state.contactNum1}
                            onChange={this.handleChange}
                            disabled={(this.props.userId && this.props.userTypeId==AuthRoleType.Provider) ? this.props.disabled : false}
                            //disabled={this.props.disabled}
                        />
                        {formikProps.errors.address && formikProps.errors.address.contactNum1 && <ErrorComponent message={formikProps.errors.address.contactNum1} />}
                    </div>
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                        <label className="mb-1 font-weight-bold ">Phone Number</label>
                        <MaskedTextBox
                            mask="(000) 000-0000"
                            name="contactNum2"
                            className="form-control"
                            placeholder="Enter Phone Number"
                            value={this.state.contactNum2}
                            onChange={this.handleChange}
                            disabled={this.props.disabled}
                        />
                        {formikProps.errors.address && formikProps.errors.address.contactNum2 && <ErrorComponent message={formikProps.errors.address.contactNum2} />}
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                        <label className="mb-1 font-weight-bold ">Address 1</label>
                        <input
                            type="text"
                            className="form-control "
                            name="addressLine1"
                            placeholder="Enter Address 1"
                            value={this.state.addressLine1}
                            onChange={this.handleChange}
                            maxLength={100}
                            disabled={this.props.disabled}
                        />
                    </div>
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                        <label className="mb-1 font-weight-bold ">Address 2</label>
                        <input
                            type="text"
                            className="form-control "
                            placeholder="Enter Address 2"
                            name="addressLine2"
                            value={this.state.addressLine2}
                            onChange={this.handleChange}
                            maxLength={100}
                            disabled={this.props.disabled}
                        />
                    </div>
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                        <label className="mb-1 font-weight-bold ">State</label>
                        <CustomDropDownList
                            className={"form-control disabled"}
                            disabled={!this.state.countryId || this.props.disabled}
                            data={this.state.states}
                            name="state"
                            textField="name"
                            valueField="stateId"
                            id="states"
                            defaultItem={defaultState}
                            value={this.state.stateId}
                            onChange={(e) => this.handleStateChange(e)}
                            filterable={this.state.originalstates.length > 5 ? true : false}
                            onFilterChange={this.handleFilterChange}
                        />
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                        <label className="mb-1 font-weight-bold ">City</label>
                        <CustomDropDownList
                            className={"form-control disabled"}
                            disabled={!this.state.stateId || this.props.disabled}
                            data={this.state.city}
                            name="cityId"
                            textField="name"
                            valueField="cityId"
                            id="city"
                            defaultItem={defaultCity}
                            value={this.state.cityId}
                            onChange={this.handleDropdownChange}
                            filterable={this.state.originalcity.length > 5 ? true : false}
                            onFilterChange={this.handleFilterChange}
                        />
                    </div>
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                        <label className="mb-1 font-weight-bold ">Postal Code</label>
                        {/* <NumericTextBox
                            className="form-control text-right"
                            name="pinCodeId"
                            placeholder="Enter Postal Code"
                            value={this.state.pinCodeId}
                            onChange={this.handleChange}
                            max={99999}
                            min={0}
                            format="#"
                            spinners={false}
                            disabled={this.props.disabled}
                        /> */}

                        <input
                            type="number"
                            className="form-control no-spinner"
                            name="pinCodeId"
                            placeholder="Enter Postal Code"
                            value={this.state.pinCodeId}
                            // maxLength={9}
                            onChange={this.handleChange}
                            onWheel={(e) => e.currentTarget.blur()}
                            onKeyPress={(e) => restrictValue(e)}
                            disabled={this.props.disabled}
                        />
                        {formikProps.errors.address && formikProps.errors.address.pinCodeId && <ErrorComponent message={formikProps.errors.address.pinCodeId} />}
                    </div>
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                        <label className="mb-1 font-weight-bold ">Country</label>
                        <CustomDropDownList
                            className={"form-control disabled"}
                            data={this.state.country}
                            valueField="countryId"
                            name="countryId"
                            textField="name"
                            id="country"
                            value={this.state.countryId}
                            onChange={(e) => this.handleCountryChange(e)}
                            filterable={this.state.originalcountry.length > 5 ? true : false}
                            onFilterChange={this.handleFilterChange}
                            disabled={this.props.disabled}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Address;
