import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faUserCircle, faChevronCircleDown, faChevronCircleUp, faClock, faSave, faTimesCircle, faHistory, faEye, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import BasicInformation from "./BasicInformation";
import LineOfBusiness from "./LineOfBusiness";
import Regions from "./Regions";
import Zones from "./Zones";
import axios from "axios";
import { errorToastr, history, preventSubmitOnEnter, successToastr, warningToastr } from "../../../../../HelperMethods";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { clientValidation } from "./validations/validation";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import withValueField from "../../../../Shared/withValueField";
import { FormatPhoneNumber } from "../../../../ReusableComponents";
import AssociatedVendors from "./AssociatedVendors";
import { CLIENT_ASS_VENDOR_WARNING_MSG, CLIENT_LOB_WARNING_MSG, CLIENT_REGION_WARNING_MSG, CLIENT_ZONE_WARNING_MSG, LOB_ERROR_MSG } from "../../../../Shared/AppMessages";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

const CustomDropDownList = withValueField(DropDownList);


export interface CreateClientProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateClientState {
    clientId?: string;
    clientNumber: string;
    name?: string;
    addressId?: string;
    email?: string;
    phoneNumber?: string;
    address1?: string;
    address2?: string;
    cityId?: string;
    stateId?: string;
    countryId?: string;
    postalCode?: string;
    status?: string;
    statusId?: number;
    submitted: boolean;
    toggleAll: boolean;
    isPrivate?: boolean;
    showLoader?: boolean;
    isDirty?: boolean;
    toggleFirst: boolean;
    toggleSecond: boolean;
    toggleThird: boolean;
    toggleFourth: boolean;
    city: Array<IDropDownModel>;
    originalcity: Array<IDropDownModel>;
    country: Array<IDropDownModel>;
    originalcountry: Array<IDropDownModel>;
    state: Array<IDropDownModel>;
    originalstate: Array<IDropDownModel>;
    fax?: string;
    website?: string;
}

class CreateClient extends React.Component<CreateClientProps, CreateClientState> {
    public clientChild: any;
    public clientLob: any;
    //public clientRegion: any;
    public clientZone: any;
    public clientAssociatedVendor: any;
    constructor(props: CreateClientProps) {
        super(props);
        this.state = {
            clientId: "",
            clientNumber: "",
            cityId: "",
            stateId: "",
            countryId: "",
            submitted: false,
            toggleAll: false,
            isDirty: false,
            toggleFirst: true,
            toggleSecond: false,
            toggleThird: false,
            toggleFourth: false,
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
        const { id } = this.props.match.params;
        if (id) {
            this.setState({ clientId: id, toggleSecond: true, toggleThird: true, toggleFourth: true });
            this.getClientDetails(id);

        } else {
            this.setState({ showLoader: false });
        }
        this.setState({ clientId: id });

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

    saveClient(isSubmit: boolean) {
        let isValid = this.checkValidations();
        if (isValid) {
            let data = {
                clientId: this.state.clientId,
                clientName: this.state.name,
                emailId: this.state.email,
                phoneNumber: this.state.phoneNumber,
                address1: this.state.address1,
                address2: this.state.address2,
                city: this.state.cityId,
                state: this.state.stateId,
                postalCode: this.state.postalCode,
                country: this.state.countryId,
                addressId: this.state.addressId,
                lobs: this.clientLob.getLobData().data,
                //regions: this.clientRegion.getRegionData().data,
                zones: this.clientZone.getZoneData().data,
                associatedVendors: this.clientAssociatedVendor.getAssociatedVendorData().data,
                fax: this.state.fax,
                website: this.state.website,
            };
            data["isSubmit"] = isSubmit;
            data["phoneNumber"] = data["phoneNumber"] ? data["phoneNumber"].replace(/\D+/g, "") : "";
            data["fax"] = data["fax"] ? data["fax"].replace(/\D+/g, "") : "";

            if (this.state.clientId) {
                const { clientId } = this.state;
                axios.put(`api/clients/${this.state.clientId}`, JSON.stringify(data)).then((res) => {
                    successToastr("Client updated successfully");
                    history.goBack();
                });
            } else {
                axios.post("api/clients", JSON.stringify(data)).then((res) => {
                    successToastr("Client created successfully");
                    history.push('/admin/client/manage');
                });
            }
        }
    }

    checkValidations() {
        let lobs = this.clientLob.getLobData();
        
        if(lobs.hasLob){
            errorToastr(LOB_ERROR_MSG);
            return false;
        }

        if (lobs.hasError) {
            warningToastr(CLIENT_LOB_WARNING_MSG);
            return false;
        }

        let zones = this.clientZone.getZoneData();
        if (zones.hasError) {
            warningToastr(CLIENT_ZONE_WARNING_MSG);
            return false;
        }

        // let regions = this.clientRegion.getRegionData();
        // if (regions.hasError) {
        //     warningToastr(CLIENT_REGION_WARNING_MSG);
        //     return false;
        // }

        let associatedVendors = this.clientAssociatedVendor.getAssociatedVendorData();
        if (associatedVendors.hasError) {
            warningToastr(CLIENT_ASS_VENDOR_WARNING_MSG);
            return false;
        }
        return true;
    }

    getClientDetails(clientId: string) {
        axios.get(`api/clients/${clientId}`).then((res) => {
            const { data } = res;
            this.setState({
                clientId: data.id,
                name: data.name,
                email: data.email,
                phoneNumber: FormatPhoneNumber(data.mobileNumber),
                address1: data.address1,
                address2: data.address2,
                stateId: data.stateId,
                cityId: data.cityId,
                postalCode: data.pinCodeId,
                countryId: data.countryId,
                status: data.status,
                statusId: data.recordStatus,
                addressId: data.addressId,
                fax: data.fax,
                website: data.website,
                showLoader: false,
            });
            if (data.countryId) {
                this.clientChild.getState(data.countryId);
            }
            if (data.stateId) {
                this.clientChild.getCity(data.stateId);
            }
        });
    }

    onCollapseOpen = () => {
        this.setState({
            toggleAll: true,
            toggleFirst: true,
            toggleSecond: true,
            toggleThird: true,
            toggleFourth: true,
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggleAll: false,
            toggleFirst: false,
            toggleSecond: false,
            toggleThird: false,
            toggleFourth: false,
        });
    };

    render() {
        const {
            clientId,
            clientNumber,
            name,
            email,
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
            toggleFourth,
            fax,
            website
        } = this.state;
        const basicInfo = {
            clientId,
            clientNumber,
            name,
            email,
            phoneNumber,
            address1,
            address2,
            cityId,
            stateId,
            countryId,
            postalCode,
            fax,
            website
        };
        const clientTriggerName = (
            <span>
                Basic Information
                <span
                    className="d-none d-sm-block"
                    style={{ float: "right", marginRight: "25px" }}
                >
                    {this.state.clientId ? this.state.status : ""}
                </span>
            </span>
        );
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-10 fonFifteen paddingLeftandRight">
                            <div className="d-none d-md-block">
                                <BreadCrumbs globalData={{ clientId: this.state.clientId}}></BreadCrumbs>
                             </div>
                        </div>

                        <div className="col-2 text-right mt-sm-1 mt-md-0 txt-orderno text-underline paddingRight d-flex align-items-center justify-content-end ">
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
                    validationSchema={clientValidation}
                    validateOnBlur={false}
                    onSubmit={(fields) => this.saveClient(true)}
                    render={(formikProps) => (
                        <Form className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onKeyDown={preventSubmitOnEnter} onChange={formikProps.handleChange}>
                            <Collapsible
                                trigger={clientTriggerName}
                                open={toggleFirst}
                                accordionPosition="1"
                                onTriggerOpening={() => this.setState({ toggleFirst: true })}
                                onTriggerClosing={() => this.setState({ toggleFirst: false })}
                            >
                                <BasicInformation
                                    ref={(instance) => {
                                        this.clientChild = instance;
                                    }}
                                    data={basicInfo}
                                    clientId={clientId}
                                    handleChange={this.handleChange}
                                    handleObjChange={this.handleObjChange}
                                    handleDropdownChange={this.handleDropdownChange}
                                    formikProps={formikProps}
                                />
                            </Collapsible>

                            <div>
                                <Collapsible
                                    lazyRender={clientId ? true : false}
                                    trigger="Line Of Business"
                                    open={toggleSecond}
                                    onTriggerOpening={() => this.setState({ toggleSecond: true })}
                                    onTriggerClosing={() => this.setState({ toggleSecond: false })}
                                >

                                    <LineOfBusiness
                                        ref={(instance) => {
                                            this.clientLob = instance;
                                        }}
                                        entityType="Client"
                                        clientId={clientId}
                                        canEdit={true}
                                        key="Lob"
                                    />
                                </Collapsible>

                                <Collapsible
                                    lazyRender={clientId ? true : false}
                                    trigger="Zones"
                                    open={toggleThird}
                                    onTriggerOpening={() => this.setState({ toggleThird: true })}
                                    onTriggerClosing={() => this.setState({ toggleThird: false })}
                                >
                                    <Zones
                                        ref={(instance) => {
                                            this.clientZone = instance;
                                        }}
                                        entityType="Client"
                                        clientId={clientId}
                                        canEdit={true}
                                        key="Zone"
                                    />
                                </Collapsible>

                                {/* <Collapsible
                                    lazyRender={clientId ? true : false}
                                    trigger="Regions"
                                    open={toggleThird}
                                    onTriggerOpening={() => this.setState({ toggleThird: true })}
                                    onTriggerClosing={() => this.setState({ toggleThird: false })}
                                >
                                    <Regions
                                        ref={(instance) => {
                                            this.clientRegion = instance;
                                        }}
                                        entityType="Client"
                                        clientId={clientId}
                                        canEdit={true}
                                        key="Region"
                                    />
                                </Collapsible> */}

                                <Collapsible
                                    lazyRender={clientId ? true : false}
                                    trigger="Associated Vendors"
                                    open={toggleFourth}
                                    onTriggerOpening={() => this.setState({ toggleFourth: true })}
                                    onTriggerClosing={() => this.setState({ toggleFourth: false })}
                                >
                                    <AssociatedVendors
                                        ref={(instance) => {
                                            this.clientAssociatedVendor = instance;
                                        }}
                                        entityType="Client"
                                        clientId={clientId}
                                        canEdit={true}
                                        key="Vendors"
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

export default CreateClient;