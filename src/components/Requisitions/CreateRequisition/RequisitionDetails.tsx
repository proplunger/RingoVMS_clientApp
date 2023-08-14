import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../Shared/withValueField";
import { Comment } from "../../Shared/Comment/Comment";
import axios from "axios";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import { ErrorComponent, FormatPhoneNumber } from "../../ReusableComponents";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton from "react-loading-skeleton";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import auth from "../../Auth";
import { AuthRole, AuthRoleType, isRoleType, isVendorRoleType } from "../../Shared/AppConstants";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select...", id: null };

export interface RequisitionDetailsProps {
    data: any;
    clientId: string;
    handleChange: any;
    handleObjChange: any;
    handleDropdownChange: any;
    formikProps: any;
    disableDivAndLoc?: boolean;
    disableReg?: boolean;
    handleChangePurchaseOrder: any;
}

export interface RequisitionDetailsState {
    divisions: Array<IDropDownModel>;
    originaldivisions?: Array<IDropDownModel>;
    locations: Array<IDropDownModel>;
    departments: Array<IDropDownModel>;
    originallocations?: Array<IDropDownModel>;
    divisionContacts: Array<IDropDownModel>;
    originaldivisionContacts?: Array<IDropDownModel>;
    reasonForReq: Array<IDropDownModel>;
    originalreasonForReq?: Array<IDropDownModel>;
    originaldepartments?: Array<IDropDownModel>;
    showLoader?: boolean;
    openCommentBox?: boolean;
    isPrivate?: boolean;
    comments?: [];
    total?: 0;
    state?: string;
    city?: string;
    mobileNumber?: string;
    phoneNumber?: string;
    address1?: string;
    address2?: string;
    postalCode?: string;
    country?: string;
    divisionState: boolean;
}

class RequisitionDetails extends React.Component<RequisitionDetailsProps, RequisitionDetailsState> {
    constructor(props: RequisitionDetailsProps) {
        super(props);
        this.state = {
            divisions: [],
            locations: [],
            divisionContacts: [],
            reasonForReq: [],
            originaldivisions: [],
            originallocations: [],
            originaldivisionContacts: [],
            originalreasonForReq: [],
            originaldepartments: [],
            departments: [],
            showLoader: true,
            divisionState: false
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        const { clientId } = this.props;
        if (clientId) {
            this.getDivisions(clientId);
            this.getDivisionContacts(clientId);
            this.getReasonsForReq(clientId);
        } else {
            this.setState({ showLoader: false });
        }
        this.getDepartments();
    }

    getDivisions(clientId) {
        let queryParams = `status eq 'Active'&$orderby=name`;
        if (this.props.data.reqId && this.props.data.clientDivisionId) {
            queryParams = `status eq 'Active' or id eq ${this.props.data.clientDivisionId} &$orderby=name `;
        }
        axios.get(`api/clients/${clientId}/divisions?$filter=${queryParams}`).then((res) => {
            this.setState({ divisions: res.data, originaldivisions: res.data });
        });
    }

    getDepartments() {
        let queryParams = `status eq 'Active'&$orderby=name`;
        axios.get(`api/admin/departments?$filter=${queryParams}`).then((res) => {
            this.setState({ departments: res.data, originaldepartments: res.data });
        });
    }

    // handling division cascase dropdown change
    handleDivisionChange = (e) => {
        const divisionId = e.target.value;
        this.props.handleObjChange({
            clientDivisionId: divisionId,
            divisionLocationId: null,
        });
        if (divisionId !=null) {
            this.getLocations(divisionId);
            this.setState({ 
                state: e.value.state || '', city: e.value.city || '',
                divisionState: e.value.state && e.value.city ? true: false,
                phoneNumber: e.value.phoneNumber || '', address1: e.value.address1 || '', address2: e.value.address2 || '',
                postalCode: e.value.postalCode || ''
            });

            this.props.handleChangePurchaseOrder(e.value.purchaseOrder || this.props.data.purchaseOrder);
        } else {
            this.setState({ locations: [], state: '', city: '', divisionState: false,
            phoneNumber: '', address1: '', address2: '', postalCode: ''});

            this.props.handleChangePurchaseOrder(this.props.data.purchaseOrder || '');
        }
    };

    getLocations(divisionId) {
        let queryParams = `status eq 'Active' and divId eq ${divisionId} &$orderby=name`;
        if (this.props.data.reqId && this.props.data.divLocId) {
            queryParams = `(status eq 'Active' or id eq ${this.props.data.divLocId}) and divId eq ${divisionId}&$orderby=name `;
        }
        axios.get(`api/clients/divisions/locations?$filter=${queryParams}`).then((res) => {
            this.setState({ locations: res.data, originallocations: res.data });
        });
    }

    // get location details
    handleLocationChange = (e) => {
        const locationId = e.target.value;
        this.props.handleObjChange({
            divisionLocationId: locationId,
            //divisionLocationId: null,
        });

        const { divisionState } = this.state;

        if (locationId !=null) {
            this.setState({
                state: divisionState ? this.state.state : e.value.state || '',
                city: divisionState ? this.state.city : e.value.city || '',
                phoneNumber: divisionState ? this.state.phoneNumber: e.value.phoneNumber || '',
                address1: divisionState ? this.state.address1: e.value.address1 || '',
                address2: divisionState ? this.state.address2: e.value.address2 || '',
                postalCode: divisionState ? this.state.postalCode: e.value.postalCode || ''
            });
        } else {
            this.setState({
                state: divisionState ? this.state.state : '',
                city: divisionState ? this.state.city : '',
                phoneNumber: divisionState ? this.state.phoneNumber : '',
                address1: divisionState ? this.state.address1 : '',
                address2: divisionState ? this.state.address2 : '',
                postalCode: divisionState ? this.state.postalCode : ''
            });
        }
    };

    updateLocationInfo(location) {
        this.setState({ 
            state: location.state,
            city: location.city,
            phoneNumber: location.phoneNumber,
            address1: location.address1,
            address2: location.address2,
            postalCode: location.postalCode
        });
    }

    getDivisionContacts(clientId) {
        axios.get(`api/clients/${clientId}/approvers?$filter=permCode eq '${AppPermissions.REQ_CREATE}' and role ne '${AuthRole.MSP}'&$orderby=name`).then((res) => {
            this.setState({
                divisionContacts: res.data,
                originaldivisionContacts: res.data,
            });
        });
    }

    getReasonsForReq(clientId) {
        axios.get(`api/clients/${clientId}/reqreasons?$orderby=name`).then((res) => {
            this.setState({ reasonForReq: res.data, originalreasonForReq: res.data, showLoader: false });
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
        const { data, formikProps, disableDivAndLoc, disableReg } = this.props;
        const role = JSON.parse(localStorage.getItem("user")).role;
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
                                <div className="row mx-auto">
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-sm-0  mt-2">
                                        <label className="mb-1 font-weight-bold required">Division </label>
                                        <CustomDropDownList
                                            className="form-control disabled "
                                            name={`clientDivisionId`}
                                            disabled={!data.clientId || disableDivAndLoc || disableReg}
                                            data={this.state.divisions}
                                            textField="name"
                                            valueField="id"
                                            id="divisions"
                                            value={data.clientDivisionId}
                                            defaultItem={defaultItem}
                                            onChange={this.handleDivisionChange}
                                            filterable={this.state.originaldivisions.length > 5 ? true : false}
                                            onFilterChange={this.handleFilterChange}
                                        />
                                        {formikProps.errors.clientDivisionId && <ErrorComponent message={formikProps.errors.clientDivisionId} />}
                                    </div>
                                    {data.isEnableDepartment &&
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-sm-0 mt-2">
                                            <label className="mb-1 font-weight-bold required">Department</label>
                                            <CustomDropDownList
                                                className="form-control disabled"
                                                name={`departmentId`}
                                                data={this.state.departments}
                                                textField="name"
                                                valueField="id"
                                                id="departments"
                                                defaultItem={defaultItem}
                                                value={data.departmentId}
                                                onChange={(e) => this.props.handleDropdownChange(e)}
                                                filterable={this.state.originaldepartments.length > 5 ? true : false}
                                                onFilterChange={this.handleFilterChange}
                                            />
                                            {formikProps.errors.departmentId && <ErrorComponent message={formikProps.errors.departmentId} />}
                                        </div> 
                                    }
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-sm-0 mt-2">
                                        <label className="mb-1 font-weight-bold required">Location</label>
                                        <CustomDropDownList
                                            className="form-control disabled"
                                            name={`divisionLocationId`}
                                            disabled={!data.clientDivisionId || disableDivAndLoc || disableReg}
                                            data={this.state.locations}
                                            textField="name"
                                            valueField="id"
                                            id="locations"
                                            defaultItem={defaultItem}
                                            value={data.divisionLocationId}
                                            onChange={this.handleLocationChange}
                                            filterable={this.state.originallocations.length > 5 ? true : false}
                                            onFilterChange={this.handleFilterChange}
                                        />
                                        {formikProps.errors.divisionLocationId && <ErrorComponent message={formikProps.errors.divisionLocationId} />}
                                    </div>
                                    <div className={data.isEnableDepartment ? "col-12 col-sm-6 col-md-4 col-lg-4 mt-3" : "col-12 col-sm-6 col-md-4 col-lg-4 mt-2 mt-sm-0"}>
                                        <label className="mb-1 font-weight-bold ">Phone Number</label>
                                        <MaskedTextBox
                                            mask="(000) 000-0000"
                                            name="phoneNumber"
                                            className="form-control k-textbox-disabled"
                                            value={FormatPhoneNumber(this.state.phoneNumber)}
                                            maskValidation
                                            disabled={true}
                                        />
                                    </div>

                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                        <label className="mb-1 font-weight-bold ">Address 1</label>
                                        <input
                                            type="text"
                                            className="form-control "
                                            value={this.state.address1}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                        <label className="mb-1 font-weight-bold">Address 2</label>
                                        <input
                                            type="text"
                                            className="form-control "
                                            value={this.state.address2}
                                            disabled={true}
                                        />
                                    </div>

                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                        <label className="mb-1 font-weight-bold">City</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={this.state.city}
                                            disabled={true}
                                        />
                                    </div>

                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                        <label className="mb-1 font-weight-bold">State</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={this.state.state}
                                            disabled={true}
                                        />
                                    </div>

                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                        <label className="mb-1 font-weight-bold ">Postal Code</label>
                                        <input
                                            type="number"
                                            className="form-control no-spinner"
                                            name="postalCode"
                                            value={this.state.postalCode}
                                            // maxLength={9}
                                            disabled={true}
                                        />
                                    </div>

                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                        <label className="mb-1 font-weight-bold">Purchase Order</label>
                                        <input
                                            type="text"
                                            name="purchaseOrder"
                                            className="form-control"
                                            placeholder="Enter Purchase Order"
                                            value={data.purchaseOrder}
                                            maxLength={50}
                                            onChange={(e) => this.props.handleChange(e)}
                                        />
                                    </div>

                                    {!isRoleType(AuthRoleType.Vendor) &&
                                        <React.Fragment>
                                            <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                                <label className="mb-1 text-dark required font-weight-bold">Client Contact Number</label>
                                                <MaskedTextBox
                                                    mask="(000) 000-0000"
                                                    name="clientContactNum"
                                                    value={data.clientContactNum}
                                                    onChange={(e) => this.props.handleChange(e)}
                                                    className="form-control  k-textbox-disabled "
                                                />
                                                {formikProps.errors.clientContactNum && (
                                                    <ErrorComponent message={formikProps.errors.clientContactNum} />
                                                )}
                                            </div>

                                        </React.Fragment>
                                    }

                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                        <label className="mb-1 font-weight-bold">Division Contact</label>
                                        <CustomDropDownList
                                            className="form-control"
                                            name="divisionContactId"
                                            disabled={false}
                                            data={this.state.divisionContacts}
                                            textField="name"
                                            valueField="id"
                                            id="divisionContacts"
                                            value={data.divisionContactId}
                                            defaultItem={defaultItem}
                                            onChange={(e) => this.props.handleDropdownChange(e)}
                                            filterable={this.state.originaldivisionContacts.length > 5 ? true : false}
                                            onFilterChange={this.handleFilterChange}
                                        />
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                        <label className="mb-1 required font-weight-bold">Reason For Requisition</label>
                                        <CustomDropDownList
                                            className="form-control"
                                            name="reasonId"
                                            disabled={false}
                                            data={this.state.reasonForReq}
                                            textField="name"
                                            valueField="id"
                                            id="reasonForReq"
                                            value={data.reasonId}
                                            defaultItem={defaultItem}
                                            onChange={(e) => this.props.handleDropdownChange(e)}
                                            filterable={this.state.originalreasonForReq.length > 5 ? true : false}
                                            onFilterChange={this.handleFilterChange}
                                        />
                                        {formikProps.errors.reasonId && <ErrorComponent message={formikProps.errors.reasonId} />}
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                        <label className="mb-1 required font-weight-bold">Business Justification</label>
                                        <textarea
                                            name="justification"
                                            onChange={(e) => this.props.handleChange(e)}
                                            value={data.justification}
                                            maxLength={5000}
                                            className="form-control area-textarea"
                                            placeholder="Enter Business Justification"
                                        />
                                        {formikProps.errors.justification && <ErrorComponent message={formikProps.errors.justification} />}
                                    </div>

                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                        <label className="mb-1 font-weight-bold">Additional Details</label>
                                        <textarea
                                            name="additionalDetails"
                                            onChange={(e) => this.props.handleChange(e)}
                                            value={data.additionalDetails}
                                            maxLength={5000}
                                            className="form-control area-textarea"
                                            placeholder="Enter Addtional Details"
                                        />
                                        {formikProps.errors.justification && <ErrorComponent message={formikProps.errors.justification} />}
                                    </div>

                                    {data.reqId && auth.hasPermissionV2(AppPermissions.REQ_COMMENT_CREATE) &&
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                        <label className="mb-0 font-weight-bold">Client/Vendor Comments</label>
                                        <span
                                            onClick={() => this.setState({ openCommentBox: true, isPrivate: null })}
                                            className="text-underline cursorElement align-middle"
                                        >
                                            <FontAwesomeIcon icon={faClock} className="ml-1 active-icon-blue ClockFontSize" />
                                        </span>
                                        <Comment entityType={"Requisition"} entityId={data.reqId} />
                                    </div>}

                                    {data.reqId && auth.hasPermissionV2(AppPermissions.REQ_PRIVATE_COMMENT_CREATE) &&
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-3">
                                        <label className="mb-0 font-weight-bold">Private Comments</label>
                                        <span
                                            onClick={() => this.setState({ openCommentBox: true, isPrivate: true })}
                                            className="text-underline cursorElement align-middle"
                                        >
                                            <FontAwesomeIcon icon={faClock} className="ml-1 active-icon-blue ClockFontSize" />
                                        </span>
                                        <Comment entityType={"Requisition"} entityId={data.reqId} isPrivate={true} />
                                    </div>}
                            
                                </div>

                                <div className="row">
                                    <div className="col-12 mt-1 mt-lg-3">
                                        <div className="row mx-auto">
                                            
                                            {data.reqId && this.state.openCommentBox && (
                                                <CommentHistoryBox
                                                    entityType={"Requisition"}
                                                    entityId={data.reqId}
                                                    showDialog={this.state.openCommentBox}
                                                    handleNo={() => {
                                                        this.setState({ openCommentBox: false });
                                                        document.body.style.position = "";
                                                    }}
                                                    isPrivate={this.state.isPrivate}
                                                />
                                            )}
                                        </div>
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

export default RequisitionDetails;
