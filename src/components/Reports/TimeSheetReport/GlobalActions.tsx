import * as React from "react";
import auth from "../../Auth";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { amountFormatter, currencyFormatter, dateFormatter, dateFormatter2 } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faFileExcel,
    faColumns
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../Shared/GridComponents/CommonComponents";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { convertShiftDateTime, FormatPhoneNumber } from "../../ReusableComponents";
import { Link } from "react-router-dom";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="TimeSheet_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm" title="Export to Excel">
                <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon> {" "}
            </div>
            //     <div className="TimeSheet_Excel" 
            //     class="bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm">
            //     <i class="fas fa-file-pdf text-white"></i>

            // </div>
        }
        filename="Timesheet Report"
    >
        <ExcelSheet data={data} name="Timesheet Report">
            <ExcelColumn label="Req Number" value="reqNumber" />
            <ExcelColumn label="Provider" value="candidateName" />
            <ExcelColumn label="Zone" value="zone" />
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Hiring Manager" value="hiringManager" />
            <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
            <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
            <ExcelColumn label="Hours" value="hours" />
            <ExcelColumn label="Billable ($)" value={(col) => amountFormatter(col.totalAmount)} />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Vendor" value="vendorName" />
            <ExcelColumn label="TimeSheet Approvers" value="timesheetApprovers" />
            <ExcelColumn label="Client Invoice Number" value="clientInvoiceNumber" />
        </ExcelSheet>
    </ExcelFile>
);
export const PayPeriodCell = (props) => {
    var pageUrl = "/timesheet/" + props.dataItem.tsWeekId + "/edit";
    return (
        <td contextMenu="Pay Period">
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
                {" "}
                {dateFormatter2(props.dataItem.startDate) + " - " + dateFormatter2(props.dataItem.endDate)}{" "}
            </Link>
        </td>
    );
};

export const ReqNumberCell = (props) => {
    var pageUrl = props.dataItem.status=="Draft" ? "/requisitions/edit/" : "/requisitions/view/";
    return (
        <td contextMenu="Req #">
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl + props.dataItem.reqId} style={{ color: "#007bff" }}>
                {props.dataItem.reqNumber}
            </Link>
        </td>
    );
};
export const Columns = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons">
            <FontAwesomeIcon icon={faColumns} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Columns{" "}
        </div>
    );
};

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                <MenuItem render={() => ExportExcel(excelData)} />
                <MenuItem render={Columns} />
            </MenuItem>
        </Menu>
    );
};

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
                                <label className='mb-0'>Client :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.client}
                                </label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Vendor :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.vendorName}
                                </label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Timesheet Approvers :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.timesheetApprovers}
                                </label>
                            </div>
                        </div>
                        {auth.hasPermissionV2(AppPermissions.REPORT_TS_CBI_NUMBER_VIEW) &&
                        (
                            <div className="row mb-2">
                                <div className="col-6">
                                    <label className='mb-0'>Client Invoice Number :</label>
                                </div>
                                <div className="col-6 text-left pl-0 pr-0">
                                    <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                        {props.clientInvoiceNumber}
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* <div className="mt-1 mb-2 text-overflow_helper">Client :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Vendor :</div>
                    <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.client}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.vendorName}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};