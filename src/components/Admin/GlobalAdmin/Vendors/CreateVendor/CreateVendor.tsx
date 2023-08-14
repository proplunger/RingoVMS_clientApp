import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faUserCircle, faChevronCircleDown, faChevronCircleUp, faClock, faSave, faTimesCircle, faHistory, faEye } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../../Auth";
import axios from "axios";
import VendorInformation from "./VendorInformation";
import LocationDetails from "./LocationDetails";
import ContactDetails from "./ContactDetails";
import { history, successToastr } from "../../../../../HelperMethods";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { vendorValidation } from "./validations/validation";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import withValueField from "../../../../Shared/withValueField";
import { FormatPhoneNumber } from "../../../../ReusableComponents";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

const CustomDropDownList = withValueField(DropDownList);


export interface CreateVendorProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateVendorState {
    clientId?: string;
    vendorId?: string;
    vendorNumber: string;
    name?: string;
    addressId?: string;
    email?: string;
    mobileNumber?: string;
    phoneNumber?: string;
    address1?: string;
    address2?: string;
    status?: string;
    cityId?: string;
    stateId?: string;
    countryId?: string;
    postalCode?: string;
    submitted: boolean;
    toggleAll: boolean;
    isPrivate?: boolean;
    showLoader?: boolean;
    isDirty?: boolean;
    toggleFirst: boolean;
    toggleSecond: boolean;
    toggleThird: boolean;
    city: Array<IDropDownModel>;
    originalcity: Array<IDropDownModel>;
    country: Array<IDropDownModel>;
    originalcountry: Array<IDropDownModel>;
    state: Array<IDropDownModel>;
    originalstate: Array<IDropDownModel>;
}

class CreateVendor extends React.Component<CreateVendorProps, CreateVendorState> {
    public vendorChild: any;
    public vendorLocation: any;
    public vendorContact: any;
    constructor(props: CreateVendorProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            clientId: "",
            vendorId: id,
            vendorNumber: "",
            //addressId: "",
            cityId: "",
            stateId: "",
            countryId: "",
            submitted: false,
            toggleAll: false,
            isDirty: false,
            toggleFirst: true,
            toggleSecond: false,
            toggleThird: false,
            showLoader: true,
            city: [],
            originalcity: [],
            country: [],
            originalcountry: [],
            state: [],
            originalstate: [],
        };
    }

    componentDidMount() {
        if (this.state.vendorId) {
            this.getVendorDetails(this.state.vendorId);
        } 
    }

    handleChange = (e) => {
        let change = { isDirty: true };
        change[e.target.name] = e.target.value;

        this.setState(change);
    };

    handleObjChange = (change) => {
        change["isDirty"] = true;
        this.setState(change);
    };

    handleDropdownChange = (e) => {
        let change = { isDirty: true };
        change[e.target.props.name] = e.target.value;
        this.setState(change);
    };

    saveVendor(isSubmit: boolean) {
        let data = {
            vendorId: this.state.vendorId,
            vendorName: this.state.name,
            emailId: this.state.email,
            mobileNumber: this.state.mobileNumber,
            phoneNumber: this.state.phoneNumber,
            address1: this.state.address1,
            address2: this.state.address2,
            city: this.state.cityId,
            state: this.state.stateId,
            postalCode: this.state.postalCode,
            country: this.state.countryId,
            addressId: this.state.addressId,
            // locations: this.vendorLocation.getLocationData(),
            // contacts: this.vendorContact.getContactData(),
        };
        data["isSubmit"] = isSubmit;
        data["phoneNumber"] = data["phoneNumber"] ? data["phoneNumber"].replace(/\D+/g, "") : "";
        data["mobileNumber"] = data["mobileNumber"] ? data["mobileNumber"].replace(/\D+/g, "") : "";

        if (this.state.vendorId) {
            const { vendorId } = this.state;
            axios.put(`api/vendor/${this.state.vendorId}`, JSON.stringify(data)).then((res) => {
                successToastr("Vendor updated successfully");
                history.goBack();
            });
        } else {
            axios.post("api/vendor", JSON.stringify(data)).then((res) => {
                successToastr("Vendor created successfully");
                history.push('/admin/vendor/manage');

            });
        }
    }

    getVendorDetails(vendorId: string) {
        axios.get(`api/vendor/${vendorId}`).then((res) => {
            const { data } = res;
            this.setState({
                vendorId: data.vendorId,
                //vendorNumber: data.vendorNumber,
                name: data.name,
                email: data.email,
                address1: data.address1,
                address2: data.address2,
                countryId: data.countryId,
                stateId: data.stateId,
                cityId: data.cityId,
                postalCode: data.pinCodeId,
                mobileNumber: FormatPhoneNumber(data.mobileNumber),
                phoneNumber: FormatPhoneNumber(data.phoneNumber),
                addressId: data.addressId,
                status: data.status,
                showLoader: false,
            });
            if (data.countryId) {
                this.vendorChild.getState(data.countryId);
            }
            if (data.stateId) {
                this.vendorChild.getCity(data.stateId);
            }
        });
    }

    onCollapseOpen = () => {
        this.setState({
            toggleAll: true,
            toggleFirst: true,
            toggleSecond: true,
            toggleThird: true,
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggleAll: false,
            toggleFirst: false,
            toggleThird: false,
            toggleSecond: false,
        });
    };

    render() {
        console.log(this.state.vendorId)
        const {
            clientId,
            vendorId,
            vendorNumber,
            name,
            email,
            mobileNumber,
            phoneNumber,
            address1,
            address2,
            cityId,
            stateId,
            countryId,
            postalCode,
            toggleAll,
            toggleFirst,
            toggleSecond,
            toggleThird,
        } = this.state;
        const vendorInfo = {
            vendorId,
            clientId,
            vendorNumber,
            name,
            email,
            mobileNumber,
            phoneNumber,
            address1,
            address2,
            cityId,
            stateId,
            countryId,
            postalCode,
        };
        const vendorTriggerName = (
            <span>
                Vendor Information
                <span
                    className="d-none d-sm-block"
                    style={{ float: "right", marginRight: "25px" }}
                >
                    {this.state.vendorId ? this.state.status : ""}
                </span>
            </span>
        );
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-10 col-md-8 fonFifteen paddingLeftandRight">
                            <div className="d-none d-md-block">
                            <BreadCrumbs globalData={{vendorId: this.state.vendorId && this.state.vendorId}}></BreadCrumbs>
                             </div>
                        </div>

                        <div className="col-2 col-md-4 text-right mt-sm-1 mt-md-0 txt-orderno text-underline paddingRight d-flex align-items-center justify-content-end ">

                            {/* {this.state.vendorId &&
                            <span className="float-right text-dark">
                                <FontAwesomeIcon icon={faUserCircle} className={"mr-1 text-dark font-sizelarge"} />
                                    <span>Vendor# : <span className="font-weight-bold"> {this.state.vendorNumber} </span></span>
                                    </span>} */}

                            {(toggleFirst && toggleSecond && toggleThird) ||
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
                    validationSchema={vendorValidation}
                    validateOnBlur={false}
                    onSubmit={(fields) => this.saveVendor(true)}
                    render={(formikProps) => (
                        <Form className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onChange={formikProps.handleChange}>
                            <Collapsible
                                trigger={vendorTriggerName}
                                open={toggleFirst}
                                accordionPosition="1"
                                onTriggerOpening={() => this.setState({ toggleFirst: true })}
                                onTriggerClosing={() => this.setState({ toggleFirst: false })}
                            >
                                <VendorInformation
                                    ref={(instance) => {
                                        this.vendorChild = instance;
                                    }}
                                    data={vendorInfo}
                                    clientId={clientId}
                                    handleChange={this.handleChange}
                                    handleObjChange={this.handleObjChange}
                                    handleDropdownChange={this.handleDropdownChange}
                                    formikProps={formikProps}
                                />
                            </Collapsible>

                            <div>
                                {/*
                            <Collapsible
                                lazyRender={vendorId ? true : false}
                                trigger= "Location Details"
                                open={toggleSecond}
                                onTriggerOpening={() => this.setState({ toggleSecond: true })}
                                onTriggerClosing={() => this.setState({ toggleSecond: false })}
                            >
                                <LocationDetails
                                    ref={(instance) => {
                                        this.vendorLocation = instance;
                                    }}
                                    data={vendorInfo}
                                    //entityId={reqId}
                                    entityType="Vendor"
                                    vendorId={vendorId}
                                    //permission="PatchReqStatus"
                                    canEdit={true}
                                    key="Vendor"
                                    //handleLocationsChange={this.handleLocationsChange}
                                />
                            </Collapsible>
*/}
                                <Collapsible
                                    lazyRender={true}
                                    trigger="Associated Users"
                                    open={toggleThird}
                                    onTriggerOpening={() => this.setState({ toggleThird: true })}
                                    onTriggerClosing={() => this.setState({ toggleThird: false })}
                                >
                                    <ContactDetails
                                        ref={(instance) => {
                                            this.vendorContact = instance;
                                        }}
                                        //entityId={reqId}
                                        entityType="Vendor"
                                        vendorId={vendorId}
                                        //permission="PatchReqStatus"
                                        canEdit={true}
                                        key="Vendor"
                                    //handleLocationsChange={this.handleLocationsChange}
                                    />
                                </Collapsible>
                            </div>

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

export default CreateVendor;