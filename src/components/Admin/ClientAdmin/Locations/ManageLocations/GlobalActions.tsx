import auth from "../../../../Auth";
import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faFileExcel,
    faList,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../../../Shared/GridComponents/CommonComponents";
import { ReqStatus } from "../../../../Shared/AppConstants";
import { history } from "../../../../../HelperMethods";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { FormatPhoneNumber } from "../../../../ReusableComponents";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Manage Locations"
    >
        <ExcelSheet data={data} name="Manage Locations">
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Description" value="description" />
            <ExcelColumn label="Mobile Number" value={(col) => FormatPhoneNumber(col.mobileNumber)} />
            <ExcelColumn label="Phone Number" value={(col) => FormatPhoneNumber(col.phoneNumber)} />
            <ExcelColumn label="Address1" value="address1" />
            <ExcelColumn label="Address2" value="address2" />
            <ExcelColumn label="City" value="city" />
            <ExcelColumn label="State" value="state" />
            <ExcelColumn label="Postal Code" value="postalCode" />
            <ExcelColumn label="Country" value="country" />
            <ExcelColumn label="Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddNewLocation = (clientId, clientName, divisionId) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick = {() => clientId && divisionId ? history.push(`/admin/client/${clientId}/division/${divisionId}/location/create?name=${clientName}`) : history.push(`/admin/client/${clientId}/location/create?name=${clientName}`)}>
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Location{" "}
        </div>
    );
};

export const CustomMenu = (excelData, clientId, clientName, divisionId) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                {auth.hasPermissionV2(AppPermissions.CLIENT_LOC_CREATE) && <MenuItem render={() => AddNewLocation(clientId, clientName, divisionId)} />}
                <MenuItem render={() => ExportExcel(excelData)} />
            </MenuItem>
        </Menu>
    );
};


export function DefaultActions(props, clientId, clientName, divisionId) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Edit",
            permCode: AppPermissions.CLIENT_LOC_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: clientId && divisionId ? `/admin/client/${clientId}/division/${divisionId}/location/edit/${dataItem.clientDivLocId}?name=${clientName}` : `/admin/client/${clientId}/location/edit/${dataItem.clientDivLocId}?name=${clientName}`,
        },
        {
            action: "Remove",
            permCode: AppPermissions.CLIENT_LOC_DELETE,
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
        {
            action: `${dataItem.status=="Active" ? "Inactivate" : "Activate"}`,
            permCode: AppPermissions.CLIENT_LOC_DELETE,
            nextState: "",
            icon: `${dataItem.status=="Active" ? "faTimesCircle" : "faCheckCircle"}`,
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
                                    {FormatPhoneNumber(props.phoneNumber)}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Address 2 :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.address2}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Postal Code :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.postalCode}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Country :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.country}</label>
                            </div>
                        </div>
                    </div>
                   
                </div>
                {/* <div className="mt-1 mb-2 text-overflow_helper">Phone Number :</div>
                    <div className="mt-1 mb-2 text-overflow_helper">Address 2 :</div>
                    <div className="mt-1 mb-2 text-overflow_helper">Postal Code :</div>
                    <div className="mt-1 mb-2 text-overflow_helper">Country :</div>
                <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
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
                </div> */}
            </div>
        </div>
    
    );
};