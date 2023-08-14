import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faUserCircle, faChevronCircleDown, faChevronCircleUp, faClock, faSave, faTimesCircle, faHistory, faEye, faRemoveFormat, faTrash, faEnvelope, faBell, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { errorToastr, history, successToastr } from "../../../HelperMethods";
import { Form, Formik } from "formik";
import { ErrorComponent, FormatPhoneNumber, hideLoader, showLoader } from "../../ReusableComponents";
import { userValidation } from "./validations/validation";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import withValueField from "../../Shared/withValueField";
import Skeleton from "react-loading-skeleton";
import { AuthRole, AuthRoleType } from "../../Shared/AppConstants";
import { filterBy } from "@progress/kendo-data-query";
import Address from "../../Shared/Address/Address";
import { NOTIFICATION_SETTING } from "../../Shared/ApiUrls";
import { Link } from "react-router-dom";
import userService from "../DataService";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { USER_AUTO_REGISTER_CONFIRMATION_MSG, USER_AUTO_REGISTER_SUCCESS_MSG } from "../../Shared/AppMessages";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";
import auth from "../../Auth";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select..", id: null };

export interface CreateUserProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateUserState {
    userId?: string;
    userTypeId?: number;
    userName: string;
    lastName?: string;
    firstName?: string;
    roleId?: string;
    email?: string;
    clientIds: any;
    vendorId?: string;
    candidateId?: string;
    address?: any;
    sendInvite: boolean;
    autoRegister: boolean;
    lastLogin?: any;
    submitted: boolean;
    showLoader?: boolean;
    clients: Array<IDropDownModel>;
    originalclients: Array<IDropDownModel>;
    roles: Array<any>;
    originalroles: Array<any>;
    vendors: Array<IDropDownModel>;
    originalvendors: Array<IDropDownModel>;
    candidates: Array<IDropDownModel>;
    originalcandidates: Array<IDropDownModel>;
    showAutoRegisterUserModal?: boolean;
    isNotiEnabled?: boolean;
    userTypes: {
        name: string;
        id: AuthRoleType;
    }[],
    userDetails?: any;
}

class CreateUser extends React.Component<CreateUserProps, CreateUserState> {
    public addressChild: any;
    constructor(props: CreateUserProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            userId: id,
            userName: "",
            clientIds: [],
            submitted: false,
            sendInvite: false,
            autoRegister: false,
            showLoader: true,
            clients: [],
            originalclients: [],
            roles: [],
            originalroles: [],
            vendors: [],
            originalvendors: [],
            candidates: [],
            originalcandidates: [],
            showAutoRegisterUserModal: false,
            isNotiEnabled: true,
            userTypes: [],
            userDetails: auth.getUser()
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.getUserTypes();
        this.getClients();
        this.getRole();
        this.getVendors();
        this.getCandidates();
    }

    getUserTypes= () => {
        let userTypes = [{ name: "System Admin", id: AuthRoleType.SystemAdmin }, { name: "Client", id: AuthRoleType.Client }, { name: "Vendor", id: AuthRoleType.Vendor }, { name: "Provider", id: AuthRoleType.Provider }];

        if(this.state.userDetails.roleType== AuthRoleType.SuperAdmin){
             userTypes = [{ name: "Super Admin", id: AuthRoleType.SuperAdmin }, { name: "System Admin", id: AuthRoleType.SystemAdmin }, { name: "Client", id: AuthRoleType.Client }, { name: "Vendor", id: AuthRoleType.Vendor }, { name: "Provider", id: AuthRoleType.Provider }];
        }
        this.setState({ userTypes: userTypes });
    }

    getRole = () => {
        axios.get(`api/admin/role`)
            .then(async res => {
                this.setState({ roles: res.data, originalroles: res.data });
            });
    }

    getClients = () => {
        axios.get(`api/clients`).then(async res => {
            // let data = res.data.map(x => x.id);
            this.setState({ clients: res.data, originalclients: res.data });
            const { id } = this.props.match.params;
            if (id) {
                this.getUserDetails(id);

            } else {
                this.setState({ showLoader: false });
            }
            this.setState({ userId: id });
        });
    }

    handleClientsChange = (e) => {
        if (e.value.hasOwnProperty('length')) {
            this.setState({ clientIds: e.value });
        }
        else {
            this.setState({ clientIds: [e.value] });
        }
    }

    getVendors = () => {
        axios.get(`api/vendor?$filter=hasClientMap eq true`)
            .then(async res => {
                this.setState({ vendors: res.data, originalvendors: res.data });
            });
    }

    getCandidates = () => {
        let url = `api/candidates?$filter=status eq 'Allocated'`;
        if (this.state.userId) {
            url = `api/candidates?$filter=userId eq ${this.state.userId}`;
        }
        axios.get(url).then((res) => {
            this.setState({
                candidates: res.data, originalcandidates: res.data
            });
        });
    }

    handleCandidateChange = (e) => {
        let address = {
            addressId: e.value.addressId,
            email: e.value.email,
            addressLine1: e.value.address1,
            addressLine2: e.value.address2,
            contactNum1: FormatPhoneNumber(e.value.mobileNumber),
            contactNum2: FormatPhoneNumber(e.value.phoneNumber),
            pinCodeId: e.value.postalCode,
            cityId: e.value.cityId,
            stateId: e.value.stateId,
            countryId: e.value.countryId
        }
        this.setState({
            candidateId: e.value.id,
            firstName: e.value.firstName,
            lastName: e.value.lastName,
            address: address
        });
        this.addressChild.setAddress(address);
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

    saveUser() {
        let data = {
            userId: this.state.userId,
            userType: this.state.userTypeId,
            lastName: this.state.lastName,
            firstName: this.state.firstName,
            clientIds: this.state.clientIds.map(x => x.id),
            roleId: this.state.roleId,
            vendorId: this.state.vendorId,
            candidateId: this.state.candidateId,
            address: this.state.address,
            sendInvite: this.state.sendInvite,
            autoRegister: this.state.autoRegister,
            isNotiEnabled: this.state.isNotiEnabled
        };

        data.address.contactNum1 = data.address.contactNum1.replace(/\D+/g, "");
        data.address.contactNum2 = data.address.contactNum2 ? data.address.contactNum2.replace(/\D+/g, "") : "";
        if (this.state.userId) {
            const { userId } = this.state;
            console.log("update user ", data, userId)
            userService.putUser(userId, data).then((res) => {
                if (res.data.succeeded) {
                    successToastr("User updated successfully");
                    history.goBack();
                } else {
                    errorToastr(res.data.errors[0]);
                }
            });
        } else {
            console.log("create user ", data)
            userService.postUser(data).then((res) => {
                if (res.data.succeeded) {
                    successToastr("User created successfully");
                    history.goBack();
                } else {
                    errorToastr(res.data.errors[0]);
                }
            });
        }

    }

    getUserDetails = (userId: string) => {
        userService.getUserDetails(userId).then((res) => {
            const { data } = res;
            if (data.address) {
                data.address.contactNum1 = FormatPhoneNumber(data.address.contactNum1);
                data.address.contactNum2 = FormatPhoneNumber(data.address.contactNum2);
            }
            let clients = this.state.clients.filter(x => data.clientIds.some(i => i==x.id));
            this.setState({
                ...data,
                clientIds: clients,
                userTypeId: data.roleType,
                showLoader: false,
            });
        });
    }

    inviteUser = () => {
        showLoader();
        axios.get(`/api/accounts/invite/${this.state.userId}`)
            .then(res => {
                hideLoader();
                successToastr("Invitation Sent");
            });
    }

    handleChange = (e) => {
        let change = {};
        change[e.target.name] = e.target.value;
        this.setState(change);
    };

    handleDropdownChange = (e) => {
        let change = {};
        change[e.target.props.name] = e.target.value;
        this.setState(change);
    };

    handleUserTypeChange = (e) => {
        const roles = this.state.originalroles.filter(x => x.roleType==e.target.value);
        let address = {
            email: '',
            addressLine1: '',
            addressLine2: '',
            contactNum1: '',
            contactNum2: '',
            pinCodeId: null,
            cityId: null,
            stateId: null,
            countryId: null
        }
        let change = { firstName: '', lastName: '', roles: roles, roleId: null, vendorId: null, clientIds: [], candidateId: null, address: address };
        change[e.target.props.name] = e.target.value;
        this.setState(change);
        this.addressChild.setAddress(address);
    };

    handleAddressChange = data => {
        this.setState({ address: data });
    }

    handleNotificationChange = e => {
        this.setState({ isNotiEnabled: !e.target.checked })
    }

    autoRegisterUser = () => {
        this.setState({ showAutoRegisterUserModal: false });
        if ((this.state.userId==undefined || this.state.userId==null) && this.state.autoRegister) {
            let btn = document.getElementById("autoregisterbtn");
            btn.click();
        } else if (this.state.userId && this.state.autoRegister) {
            let btn = document.getElementById("autoregisterbtn");
            btn.click();
        } else {
            let data = {
                userId: this.state.userId,
                userType: this.state.userTypeId,
                candidateId: this.state.candidateId,
                vendorId: this.state.vendorId,
                clientIds: this.state.clientIds.map(x => x.id),
            };
            showLoader();
            axios.put(`/api/users/${this.state.userId}/autoregister`, JSON.stringify(data)).then((res) => {
                hideLoader();
                successToastr(USER_AUTO_REGISTER_SUCCESS_MSG);
            });
        }
    }

    render() {
        console.log("cIds", this.state.clientIds)
        const userTriggerName = (
            <span>
                Personal Details
            </span>
        );
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-8 col-md-8 fonFifteen paddingLeftandRight">
                            <div className="d-none d-md-block">
                            <BreadCrumbs globalData={{userId:this.state.userId}}></BreadCrumbs>
                            </div>
                        </div>
                    </div>
                </div>

                <Formik
                    validateOnMount={this.state.submitted}
                    initialValues={this.state}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={userValidation}
                    validateOnBlur={false}
                    onSubmit={(fields) => this.saveUser()}
                    render={(formikProps) => (
                        <Form className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onChange={formikProps.handleChange}>
                            <Collapsible
                                trigger={userTriggerName}
                                accordionPosition="1"
                                open={true}
                            >
                                <div className="row pt-2 pb-2  mx-auto mb-1 mt-1">
                                    <div className="col-6 col-md-4 fonFifteen paddingLeftandRight pl-0">
                                        {this.state.userId &&
                                            <div className="row mx-0 align-items-center ">
                                                <FontAwesomeIcon icon={faUserCircle} className={"mr-1 text-dark font-sizelarge"} />
                                                <span>Username : <span className="font-weight-bold"> {this.state.userName} </span></span>
                                            </div>}
                                    </div>
                                    <div className="col-6 col-sm-6 col-md-8 pl-0 pr-0" id="viewController">
                                        <div className="row">
                                            <div className="col-12 text-left">
                                                <div className="row d-flex align-items-center justify-content-end mx-0">

                                                    {this.state.userId && (
                                                        <>
                                                            {!this.state.lastLogin && !this.state.showLoader && (this.state.userTypeId !=AuthRoleType.SystemAdmin) && (
                                                                <React.Fragment>
                                                                    <div className="col-auto mb-2 mb-sm-0">
                                                                        <div className="float-right text-dark ml-0 d-flex align-items-center cursorElement" onClick={() => this.setState({ showAutoRegisterUserModal: true })}>
                                                                            <span className="User_Notification mr-1">
                                                                                <FontAwesomeIcon icon={faUserPlus} className={"mr-0 text-dark User_Notification_icon"} />
                                                                            </span>
                                                                            Auto Register
                                                                        </div>
                                                                    </div>
                                                                </React.Fragment>
                                                            )}
                                                            {!this.state.lastLogin && !this.state.showLoader && (
                                                                <React.Fragment>
                                                                    <div className="col-auto mb-2 mb-sm-0">
                                                                        <div className="float-right text-dark ml-0 d-flex align-items-center cursorElement" onClick={this.inviteUser}>
                                                                            <span className="User_Notification mr-1">
                                                                                <FontAwesomeIcon icon={faEnvelope} className={"mr-0 text-dark User_Notification_icon"} />
                                                                            </span>
                                                                            Invite User
                                                                        </div>
                                                                    </div>
                                                                </React.Fragment>
                                                            )}
                                                            <Link to={`/admin/user/${this.state.userId}/notification/settings`}>

                                                                <div className="col-auto px-0">
                                                                    <div className="float-right text-dark d-flex align-items-center cursorElement">
                                                                        <span className="User_Notification mr-1">
                                                                            <FontAwesomeIcon icon={faBell} className={"text-dark User_Notification_icon"} />
                                                                        </span>
                                                                        Notification Settings
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </>
                                                    )
                                                    }
                                                    <>
                                                        <div className="col-auto mb-2 mb-sm-0 pr-0">
                                                            <div className="float-right text-dark ml-0 d-flex align-items-center cursorElement ml-3">
                                                                <label className="container-R d-flex mb-0">
                                                                    <span className="cursorElement" style={{ fontSize: "14px" }}>Disable Notification</span>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={!this.state.isNotiEnabled}
                                                                        name={'notification'}
                                                                        onChange={(e) => this.handleNotificationChange(e)}
                                                                        value="false"
                                                                    />
                                                                    <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {this.state.showLoader &&
                                    Array.from({ length: 5 }).map((item, i) => (
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
                                                <label className="mb-1 font-weight-bold required">User Type</label>
                                                <CustomDropDownList
                                                    className={"form-control disabled "}
                                                    data={this.state.userTypes}
                                                    disabled={!!this.state.userId}
                                                    textField="name"
                                                    valueField="id"
                                                    name="userTypeId"
                                                    defaultItem={defaultItem}
                                                    value={this.state.userTypeId}
                                                    onChange={(e) => this.handleUserTypeChange(e)}
                                                />
                                                {formikProps.errors.userTypeId && <ErrorComponent message={formikProps.errors.userTypeId} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold required">Last Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    placeholder="Enter Last Name"
                                                    name="lastName"
                                                    value={this.state.lastName}
                                                    maxLength={250}
                                                    disabled={!!this.state.candidateId}
                                                    onChange={(event) => {
                                                        this.setState({ lastName: event.target.value });
                                                    }}
                                                />
                                                {formikProps.errors.lastName && <ErrorComponent message={formikProps.errors.lastName} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold required">First Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    placeholder="Enter First Name"
                                                    name="firstName"
                                                    value={this.state.firstName}
                                                    maxLength={250}
                                                    disabled={!!this.state.candidateId}
                                                    onChange={(event) => {
                                                        this.setState({ firstName: event.target.value });
                                                    }}
                                                />
                                                {formikProps.errors.firstName && <ErrorComponent message={formikProps.errors.firstName} />}
                                            </div>

                                        </div>

                                        <div className="row mt-2">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold required">Role</label>
                                                <CustomDropDownList
                                                    className={"form-control disabled "}
                                                    data={this.state.roles}
                                                    //disabled={!this.state.clientId}
                                                    name="roleId"
                                                    //name={`roleId`}
                                                    textField="name"
                                                    valueField="id"
                                                    id="roles"
                                                    defaultItem={defaultItem}
                                                    value={this.state.roleId}
                                                    onChange={this.handleDropdownChange}
                                                    filterable={this.state.originalroles.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.roleId && <ErrorComponent message={formikProps.errors.roleId} />}
                                            </div>

                                            {(this.state.userTypeId==AuthRoleType.SuperAdmin || this.state.userTypeId==AuthRoleType.SystemAdmin || this.state.userTypeId==AuthRoleType.Client) &&
                                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 area-merged">
                                                    <label className="mb-1 font-weight-bold required">Client</label>
                                                    <MultiSelect
                                                        className="form-control disabled"
                                                        textField="client"
                                                        dataItemKey="id"
                                                        data={this.state.clients}
                                                        name="clientIds"
                                                        value={this.state.clientIds}
                                                        onChange={(e) => this.handleClientsChange(e)}
                                                        placeholder="Select Client..."
                                                    />
                                                    {formikProps.errors.clientIds && <ErrorComponent message={formikProps.errors.clientIds} />}
                                                </div>
                                            }

                                            {this.state.userTypeId==AuthRoleType.Vendor &&
                                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                                                    <label className="mb-1 font-weight-bold required">Vendors</label>
                                                    <CustomDropDownList
                                                        className="form-control disabled"
                                                        data={this.state.vendors}
                                                        textField="vendor"
                                                        valueField="vendorId"
                                                        dataItemKey="vendorId"
                                                        name="vendorId"
                                                        id="vendors"
                                                        value={this.state.vendorId}
                                                        defaultItem={{ vendor: "Select..", vendorId: null }}
                                                        onChange={this.handleDropdownChange}
                                                        filterable={this.state.originalvendors.length > 5 ? true : false}
                                                        onFilterChange={this.handleFilterChange}
                                                    />
                                                    {formikProps.errors.vendorId && <ErrorComponent message={formikProps.errors.vendorId} />}
                                                </div>
                                            }
                                            {this.state.userTypeId==AuthRoleType.Provider &&
                                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                                                    <label className="mb-1 font-weight-bold required">Candidates</label>
                                                    <CustomDropDownList
                                                        className="form-control disabled"
                                                        data={this.state.candidates}
                                                        disabled={!!this.state.userId}
                                                        textField="name"
                                                        valueField="id"
                                                        dataItemKey="id"
                                                        name="candidateId"
                                                        id="candidates"
                                                        value={this.state.candidateId}
                                                        defaultItem={{ name: "Select..", id: null }}
                                                        onChange={this.handleCandidateChange}
                                                        filterable={this.state.originalcandidates.length > 5 ? true : false}
                                                        onFilterChange={this.handleFilterChange}
                                                    />
                                                    {formikProps.errors.candidateId && <ErrorComponent message={formikProps.errors.candidateId} />}
                                                </div>
                                            }
                                        </div>

                                        <Address
                                            ref={(instance) => { this.addressChild = instance; }}
                                            address={this.state.address}
                                            formikProps={formikProps}
                                            onChange={this.handleAddressChange}
                                            disabled={!!this.state.candidateId}
                                            userId={this.state.userId}
                                            userTypeId={this.state.userTypeId}
                                        />
                                    </div>
                                )}
                            </Collapsible>

                            <div className="modal-footer justify-content-center border-0">
                                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                    <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                        <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                    </button>
                                    <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true, sendInvite: false, autoRegister: false })}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                    </button>
                                    {!this.state.lastLogin && !this.state.showLoader && <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true, sendInvite: true, autoRegister: false })}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save and Invite
                                    </button>}
                                    <button type="submit" hidden className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" id="autoregisterbtn" onClick={() => this.setState({ submitted: true, sendInvite: false, autoRegister: true })}>
                                    </button>
                                    {!this.state.lastLogin && !this.state.showLoader && (this.state.userTypeId !=AuthRoleType.SystemAdmin) && <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ showAutoRegisterUserModal: true, autoRegister: true })}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save and Register
                                    </button>}
                                </div>
                            </div>
                        </Form>
                    )}
                />
                <ConfirmationModal
                    message={USER_AUTO_REGISTER_CONFIRMATION_MSG()}
                    showModal={this.state.showAutoRegisterUserModal}
                    handleYes={() => this.autoRegisterUser()}
                    handleNo={() => {
                        this.setState({ showAutoRegisterUserModal: false });
                    }}
                />
            </div>
        );
    }
}

export default CreateUser;