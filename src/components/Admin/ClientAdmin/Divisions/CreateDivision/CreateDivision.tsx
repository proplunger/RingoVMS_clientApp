import auth from "../../../../Auth";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import withValueField from "../../../../Shared/withValueField";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import * as React from "react";
import axios from "axios";
import { authHeader, restrictValue, successToastr } from "../../../../../HelperMethods";
import { ErrorComponent, FormatPhoneNumber } from "../../../../ReusableComponents";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton from "react-loading-skeleton";
import Address from "../../../../Shared/Address/Address";
import commonService from "../../../../Shared/Services/CommonDataService";
import { MaskedTextBox } from "@progress/kendo-react-inputs";


const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select..", id: null };
const defaultCity = { name: "Select City", id: null };
const defaultState = { name: "Select State", stateId: null };

export interface CreateDivisionProps {
    props: any;
    onCloseModal: any;
    onOpenModal: any;
    clientId: string;
    clientName: string;
}

export interface CreateDivisionState {
    name?: string;
    addressId?: string;
    clientName: string;
    description?: string;
    divisionId?: string;
    regionId?: string;
    cityId?: string;
    stateId?: string;
    countryId?: string;
    mobileNumber? : string;
    phoneNumber?: string;
    region?: string;
    address1?: string;
    address2?: string;
    submitted: boolean;
    postalCode?: any;
    showLoader?: boolean;
    regions: Array<IDropDownModel>;
    originalregions: Array<IDropDownModel>;
    city: Array<IDropDownModel>;
    originalcity: Array<IDropDownModel>;
    country: Array<IDropDownModel>;
    originalcountry: Array<IDropDownModel>;
    state: Array<IDropDownModel>;
    originalstate: Array<IDropDownModel>;
    purchaseOrder?: string;
}

class CreateDivision extends React.Component<CreateDivisionProps, CreateDivisionState> {
    constructor(props: CreateDivisionProps) {
        super(props);
        this.state = {
            clientName: auth.getClientName(),
            addressId: "",
            submitted: false,
            regions: [],
            originalregions: [],
            showLoader: true,
            city: [],
            originalcity: [],
            state: [],
            originalstate: [],
            country: [],
            originalcountry: []
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.getRegions();

        if (this.props.props) {

            this.setState({ 
                description: this.props.props.description, name: this.props.props.name,
                divisionId: this.props.props.id, regionId: this.props.props.regionId,
                region: this.props.props.region, stateId: this.props.props.stateId, cityId: this.props.props.cityId,
                countryId: this.props.props.countryId, address1: this.props.props.address1, address2: this.props.props.address2,
                mobileNumber: FormatPhoneNumber(this.props.props.mobileNumber), phoneNumber: FormatPhoneNumber(this.props.props.phoneNumber),
                postalCode: this.props.props.postalCode, purchaseOrder: this.props.props.purchaseOrder
            })
        }
        this.getCountry();

    }

    getRegions = () => {
        let queryParams = `$filter=status eq 'Active'&$orderby=name`;
        if(this.props.props && this.props.props.regionId){
            queryParams = `$filter=status eq 'Active' or id eq ${this.props.props.regionId} &$orderby=name `;
        }
        axios.get(`api/clients/${this.props.clientId}/region?${queryParams}`)
            .then(async res => {
                this.setState({ regions: res.data, originalregions: res.data, showLoader: false });
            });
    }

    handleRegionChange = (e) => {
        const Id = e.target.value;
        this.setState({ regionId: Id });
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

    handleSaveAndAddAnother = () => {
        this.setState({ submitted: true })
        const { clientId } = this.props;
        let data = {
            clientId: this.props.clientId,
            divisionName: this.state.name,
            description: this.state.description,
            region: this.state.regionId,
            addressId: this.state.addressId,
            city: this.state.cityId,
            state: this.state.stateId,
            country: this.state.countryId,
            mobileNumber: this.state.mobileNumber,
            phoneNumber: this.state.phoneNumber,
            address1: this.state.address1,
            address2: this.state.address2,
            postalCode: this.state.postalCode,
            purchaseOrder: this.state.purchaseOrder
        };
        data["phoneNumber"] = data["phoneNumber"] ? data["phoneNumber"].replace(/\D+/g, "") : "";
        data["mobileNumber"] = data["mobileNumber"] ? data["mobileNumber"].replace(/\D+/g, "") : "";
        if(this.state.postalCode && this.state.postalCode !=null && (this.state.postalCode.length !=5 && this.state.postalCode.length !=9)){
            return false;
        }

        if ((this.state.name !=undefined && this.state.name !=null && this.state.name !="") && (this.state.regionId !=undefined && this.state.regionId !=null)) {
            axios.post(`api/admin/client/${clientId}/divisions`, JSON.stringify(data)).then((res) => {
                successToastr("Division created successfully");
                this.props.onCloseModal();
                setTimeout(() => {
                    this.openNew();
                }, 50);
            });
        }
    }

    handleUpdate = () => {
        this.setState({ submitted: true })
        const { divisionId } = this.state;
        let data = {
            clientId: this.props.clientId,
            divisionId: this.state.divisionId,
            divisionName: this.state.name,
            description: this.state.description,
            region: this.state.regionId,
            addressId: this.state.addressId,
            city: this.state.cityId,
            state: this.state.stateId,
            country: this.state.countryId,
            mobileNumber: this.state.mobileNumber,
            phoneNumber: this.state.phoneNumber,
            address1: this.state.address1,
            address2: this.state.address2,
            postalCode: this.state.postalCode,
            purchaseOrder: this.state.purchaseOrder
        };
        
        data["phoneNumber"] = data["phoneNumber"] ? data["phoneNumber"].replace(/\D+/g, "") : "";
        data["mobileNumber"] = data["mobileNumber"] ? data["mobileNumber"].replace(/\D+/g, "") : "";

        if(this.state.postalCode && this.state.postalCode !=null && (this.state.postalCode.length !=5 && this.state.postalCode.length !=9)){
            return false;
        }
        if ((this.state.name !=undefined && this.state.name !=null && this.state.name !="") && (this.state.regionId !=undefined && this.state.regionId !=null)) {
            axios.put(`api/admin/division/${divisionId}`, JSON.stringify(data)).then((res) => {
                successToastr("Division updated successfully");
                this.props.onCloseModal();
            });
        }
    }

    handleSaveAndClose = () => {
        this.setState({ submitted: true })
        const { clientId } = this.props;
        let data = {
            clientId: this.props.clientId,
            divisionName: this.state.name,
            description: this.state.description,
            region: this.state.regionId,
            city: this.state.cityId,
            state: this.state.stateId,
            country: this.state.countryId,
            addressId: this.state.addressId,
            mobileNumber: this.state.mobileNumber,
            phoneNumber: this.state.phoneNumber,
            address1: this.state.address1,
            address2: this.state.address2,
            postalCode: this.state.postalCode,
            purchaseOrder: this.state.purchaseOrder
        };
        data["phoneNumber"] = data["phoneNumber"] ? data["phoneNumber"].replace(/\D+/g, "") : "";
        data["mobileNumber"] = data["mobileNumber"] ? data["mobileNumber"].replace(/\D+/g, "") : "";

        if(this.state.postalCode && this.state.postalCode !=null && (this.state.postalCode.length !=5 && this.state.postalCode.length !=9)){
            return false;
        }

        if ((this.state.name !=undefined && this.state.name !=null && this.state.name !="") && (this.state.regionId !=undefined && this.state.regionId !=null)) {
            axios.post(`api/admin/client/${clientId}/divisions`, JSON.stringify(data)).then((res) => {
                successToastr("Division created successfully");
                this.props.onCloseModal();
            });
        }
    }

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

        if(this.state.stateId){
            this.getCity(this.state.stateId)
        }
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
    render() {
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            {this.props.props != undefined ? "Edit Division" : "Add New Division"}
                        </h4>
                        <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.onCloseModal}>
                            &times;
                        </button>
                    </div>
                    {this.state.showLoader &&
                        Array.from({ length: 2 }).map((item, i) => (
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
                            <div className="row mt-3 mx-0">
                                <div className="col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-0 font-weight-bold">Client</label>
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        disabled={true}
                                        value={(this.props.clientName==null || this.props.clientName==undefined || this.props.clientName=="") ? this.state.clientName : this.props.clientName}
                                    //value={this.props.props!= undefined ? this.props.props.client : ""}
                                    />
                                </div>
                                <div className="col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-0 font-weight-bold required">Division Name</label>
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Division Name"
                                        value={this.state.name}
                                        maxLength={100}
                                        onChange={(event) => {
                                            this.setState({ name: event.target.value });
                                        }}
                                    />
                                    {this.state.submitted && (this.state.name==undefined || this.state.name==null || this.state.name=="") && <ErrorComponent />}
                                </div>
                                <div className="col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-0 font-weight-bold">Description</label>
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
                                </div>
                                {/* </div>
                    <div className="row mt-3 mx-0"> */}
                                <div className="col-12 col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-0 font-weight-bold required">Region</label>
                                    <CustomDropDownList
                                        className="form-control mt-1"
                                        data={this.state.regions}
                                        textField="name"
                                        valueField="id"
                                        id="regions"
                                        name="id"
                                        value={this.state.regionId}
                                        defaultItem={defaultItem}
                                        onChange={(e) => this.handleRegionChange(e)}
                                        filterable={this.state.originalregions.length > 5 ? true : false}
                                        onFilterChange={this.handleFilterChange}
                                    />
                                    {this.state.submitted && (this.state.regionId==undefined || this.state.regionId==null) && <ErrorComponent />}
                                </div>
                                <div className="col-12 col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-1 font-weight-bold">Purchase Order</label>
                                    <input
                                        type="text"
                                        name="purchaseOrder"
                                        className="form-control"
                                        placeholder="Enter Purchase Order"
                                        value={this.state.purchaseOrder}
                                        maxLength={50}
                                        onChange={(e) => this.setState({ purchaseOrder: e.target.value })}
                                    />
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
                                        value={this.state.phoneNumber}
                                        maskValidation
                                        onChange={(event) => {
                                            this.setState({ phoneNumber: event.target.value });
                                        }}
                                    />
                                </div>
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
                                
                            </div>

                            <div className="row mt-3 mx-0">
                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                                    <label className="mb-1 font-weight-bold ">State</label>
                                    <CustomDropDownList
                                        className={"form-control disabled"}
                                        // disabled={!this.state.countryId}
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
                                    {this.state.postalCode && this.state.postalCode !=undefined && this.state.postalCode !=null && (this.state.postalCode.length !=5 && this.state.postalCode.length !=9) && <ErrorComponent message="Postal Code must be 5 or 9 digits long" />}
                                </div>
                                
                            </div>
                            <div className="row mt-3 mx-0">
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
                                ? <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleUpdate}>
                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                              </button>
                                : <React.Fragment>
                                    <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSaveAndAddAnother}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save & Add Another
                            </button>
                                    <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSaveAndClose}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save & Close
                            </button>
                                </React.Fragment>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default CreateDivision;