import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimesCircle,
    faPlusCircle,
    faList,
    faFileExcel,
    faFileImport,
    faColumns,
    faDownload,
    faTrashAlt,
    faCheckCircle,
    faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../Shared/GridComponents/CommonComponents";
import { AuthRole, RecordStatus, RegistrationStatus, ReqStatus } from "../../Shared/AppConstants";
import { dateFormatter, history } from "../../../HelperMethods";
import { Link } from "react-router-dom";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { convertShiftDateTime, FormatPhoneNumber } from "../../ReusableComponents";
import { NOTIFICATION_SETTING } from "../../Shared/ApiUrls";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Manage Users"
    >

        <ExcelSheet data={data} name="Manage Users">
            <ExcelColumn label="Last Name" value="lastName" />
            <ExcelColumn label="First Name" value="firstName" />
            <ExcelColumn label="Username" value="userName" />
            <ExcelColumn label="Role" value="role" />
            <ExcelColumn label="Mobile Number" value={(col) => FormatPhoneNumber(col.contactNum1)} />
            <ExcelColumn label="Phone Number" value={(col) => FormatPhoneNumber(col.address && col.address.contactNum2)} />
            <ExcelColumn label="Email" value="email" />
            <ExcelColumn label="Address 1" value={(col) => (col.address && col.address.addressLine1)} />
            <ExcelColumn label="Address 2" value={(col) => (col.address && col.address.addressLine2)} />
            <ExcelColumn label="Postal Code" value={(col) => (col.address && col.address.pinCodeId)} />
            <ExcelColumn label="Country" value="countryName" />
            <ExcelColumn label="State" value="stateName" />
            <ExcelColumn label="City" value="cityName" />
            <ExcelColumn label="Registration Status" value="registrationStatus" />
            <ExcelColumn label="Account Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddUser = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => history.push('/admin/users/create')}>
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add User{" "}
        </div>
    );
};

export const ResetUser = (reset) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => reset()}>
            <FontAwesomeIcon icon={faUndo} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Reset Terms & Conditions{" "}
        </div>
    );
};

export const CustomMenu = (excelData, reset) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                <MenuItem render={AddUser} />
                <MenuItem render={() => ResetUser(reset)} />
                <MenuItem render={() => ExportExcel(excelData)} />
            </MenuItem>
        </Menu>
    );
};


export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Edit",
            permCode: AppPermissions.USER_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/admin/users/edit/${dataItem.userId}`,
        },
        {
            action: "Auto Register User",
            permCode: AppPermissions.USER_AUTO_REGISTER,
            nextState: "",
            icon: "faUserPlus",
            cssStyle: { display: (!dataItem.lastLogin && dataItem.role !=AuthRole.MSP && dataItem.userRegistered != RegistrationStatus.AUTOREGISTER) ? "block" : "none" },
        },
        {
            action: "Invite User",
            permCode: AppPermissions.USER_INVITE,
            nextState: "",
            icon: "faEnvelope",
            cssStyle: { display: !dataItem.lastLogin ? "block" : "none" },
        },
        {
            action: "Notification Settings",
            permCode: AppPermissions.USER_NOTIFICIATION_SETING_UPDATE,
            nextState: "",
            icon: "faBell",
            linkUrl: `/admin/user/${dataItem.userId}/notification/settings`,
        },
        {
            action: "Remove",
            permCode: AppPermissions.USER_DELETE,
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.userRegistered==RegistrationStatus.PENDING ? "block" : "none" },
        },
        {
            action: `${dataItem.status=="Active" ? "Deactivate" : "Activate"}`,
            permCode: AppPermissions.USER_DELETE,
            nextState: "",
            icon: `${dataItem.recordStatus==RecordStatus.ACTIVE ? "faTimesCircle" : "faCheckCircle"}`,
            cssStyle: { display: dataItem.status=="Pending" ? "none" : "block" },
            //linkUrl: `/client/${dataItem.id}/divisions`,
        },
        {
            action: "Reset Terms & Conditions",
            permCode: AppPermissions.ADMIN_RESET_USER_TERM,
            nextState: "",
            icon: "faUndo",
            cssStyle: { display: dataItem.userRegistered==RegistrationStatus.COMPLETE ? "block" : "none" },
        },
        {
            action: "View Events",
            permCode: AppPermissions.EVENT_VIEW,
            nextState: "",
            icon: "faEye",
            linkUrl:`/admin/eventslogs/manage/${dataItem.userId}`,
        },
    ];
    return defaultActions;
}

export class DetailColumnCell extends React.Component<{ dataItem: any; expandChange: any }> {
    render() {
        let dataItem = this.props.dataItem;
        return (
            <td contextMenu="View More" style={{ textAlign: "center" }}>
                <FontAwesomeIcon
                    icon={faList}
                    style={{ marginLeft: "0px!important", marginTop: "0", fontSize: "16px" }}
                    className={"active-icon-blue left-margin cursorPointer"}
                    onClick={() => this.props.expandChange(dataItem)}
                />
            </td>
        );
    }
}

export class ViewMoreComponent extends GridDetailRow {
    render() {
        const dataItem = this.props.dataItem;
        return <DialogBox {...dataItem} />;
    }
}

export const DialogBox = (props) => {
    return (
        <div className="row">
            <div className="col-12 col-lg-11 text-dark">
                <div className="row ml-0 mr-0 mt-1">
                    <div className="col-12 pl-0 text-right">
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Client:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.clientNames}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>LOB:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.lob}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Phone Number:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.address && props.address.contactNum2}
                                </label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Address 1:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.address && props.address.addressLine1}
                                </label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Address 2:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.address && props.address.addressLine2}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>City:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.cityName}
                                </label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>State:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.stateName}
                                </label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Postal Code:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.address && props.address.pinCodeId}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Country:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.countryName}
                                </label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Last Login:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.lastLogin && dateFormatter(new Date(props.lastLogin))} {props.lastLogin && convertShiftDateTime(props.lastLogin)}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>T&C Accepted:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.tncStatus}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Auto Registered:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.autoRegisterStatus}
                                </label>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};