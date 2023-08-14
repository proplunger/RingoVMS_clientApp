import auth from "../../../../Auth";
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
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../../../Shared/GridComponents/CommonComponents";
import { ReqStatus } from "../../../../Shared/AppConstants";
import { history } from "../../../../../HelperMethods";
import { Link } from "react-router-dom";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { FormatPhoneNumber } from "../../../../ReusableComponents";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";

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
        filename="Manage Vendors"
    >

        <ExcelSheet data={data} name="Manage Vendors">
            <ExcelColumn label="Vendor" value="vendor" />
            <ExcelColumn label="Email" value="email" />
            <ExcelColumn label="Mobile Number" value={(col) => FormatPhoneNumber(col.mobileNumber)} />
            <ExcelColumn label="Phone Number" value={(col) => FormatPhoneNumber(col.phoneNumber)} />
            <ExcelColumn label="Address 1" value="address1" />
            <ExcelColumn label="Address 2" value="address2" />
            <ExcelColumn label="Postal Code" value="postalCode" />
            <ExcelColumn label="Country" value="country" />
            <ExcelColumn label="State" value="state" />
            <ExcelColumn label="City" value="city" />
            <ExcelColumn label="Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddNewVendor = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => history.push('/admin/vendor/create')}>
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Vendor{" "}
        </div>
    );
};

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                {auth.hasPermissionV2(AppPermissions.VENDOR_CREATE) && <MenuItem render={AddNewVendor} />}
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
            permCode: AppPermissions.VENDOR_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/admin/vendor/edit/${dataItem.vendorId}`,
        },
        {
            action: "Remove",
            permCode: AppPermissions.VENDOR_DELETE,
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
        {
            action: `${dataItem.status=="Active" ? "Inactivate" : "Activate"}`,
            permCode: AppPermissions.VENDOR_DELETE,
            nextState: "",
            icon: `${dataItem.status=="Active" ? "faTimesCircle" : "faCheckCircle"}`,
            //linkUrl: `/client/${dataItem.id}/divisions`,
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
                                <label className='mb-0'>Phone Number :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {FormatPhoneNumber(props.phoneNumber)}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Address 2 :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.address2}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Postal Code :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.postalCode}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Country :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.country}
                                </label>
                            </div>
                        </div>
                        {/* <div className="mt-1 mb-2 text-overflow_helper">Phone Number :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Address 2 :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Postal Code :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Country :</div>   */}
                        {/* <div className="mt-1 mb-2 text-overflow_helper">Inv. Adjustments Email Address :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Vendor Logo Filename :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Associated Master Vendor :</div>   */}
                    </div>

                    {/* <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{FormatPhoneNumber(props.phoneNumber)}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.address2}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.postalCode}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.country}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.invAdjustmentsEmailAddress}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.vendorLogoFileName}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.associatedMasterVendor}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};