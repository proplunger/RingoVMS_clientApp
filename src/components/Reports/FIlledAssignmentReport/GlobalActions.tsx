import * as React from "react";
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
import { TimesheetStatuses } from "../../Shared/AppConstants";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="TimeSheet_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm" title="Export to Excel">
                <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon>{" "}
            </div>
        }
        filename="Filled Assignment Report"
    >
        <ExcelSheet data={data} name="Filled Assignment Report">
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Zone" value="zone" />
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Hiring Manager" value="hiringManager" />
            <ExcelColumn label="Provider" value="candidateName" />
            <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
            <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
            <ExcelColumn label="Approved Hours" value={(col) => amountFormatter(col.totalApprovedHours)} />
            <ExcelColumn label="Total Billable ($)" value={(col) => amountFormatter(col.totalBillableAmount)} />
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="Vendor" value="vendor" />
            {/* <ExcelColumn label="Reason" value="reason" />
            <ExcelColumn label="Hiring Manager" value="hiringManager" />
            <ExcelColumn label="Created Date" value={(col) => dateFormatter(col.createdDate)} />
            <ExcelColumn label="Job Workflow" value="jobwF" />
            <ExcelColumn label="Job Category" value="jobCategory" />
            <ExcelColumn label="Shift Start Time" value={(col) => col.shiftStartTime ?  convertShiftDateTime(col.shiftStartTime) : "-"} />
            <ExcelColumn label="Shift End Time" value={(col) => col.shiftEndTime ? convertShiftDateTime(col.shiftEndTime) : "-"} />
            <ExcelColumn label="Skills" value="skills" />
            <ExcelColumn label="Bill Rate" value={(col) => currencyFormatter(col.billRate)} />
            <ExcelColumn label="Budget" value={(col) => currencyFormatter(col.budget)} />
            <ExcelColumn label="Position Description" value="positionDesc" /> */}
        </ExcelSheet>
    </ExcelFile>
);

export const ProviderCell = (props) => {
    var pageUrl = "/candidate/view/" + props.dataItem.candSubmissionId;
    return (
        <td contextMenu="Provider">
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
                {" "}
                {props.dataItem.candidateName}{" "}
            </Link>
        </td>
    );
};
export const ApprovedHoursCell = (props, title ? ) => {
    var pageUrl = `/timesheet/provider/${props.dataItem.candSubmissionId}?filter=status eq '${TimesheetStatuses.APPROVED}'`;
    return (
        <td contextMenu={title ? title : "Provider"} className="pr-4"
            style={{ textAlign: "right" }}>
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
                {" "}
                {props.dataItem.totalApprovedHours ? props.dataItem.totalApprovedHours.toFixed(2) : "0.00"}{" "}
            </Link>
        </td>
    );
};
export const TotalBillableCell = (props, title ?) => {
    var pageUrl = "/timesheet/provider/" + props.dataItem.candSubmissionId;
    return (
        <td contextMenu={title ? title : "Provider"} className="pr-4"
            style={{ textAlign: "right" }}>
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
                {" $"}
                {props.dataItem.totalBillableAmount ? props.dataItem.totalBillableAmount.toFixed(2) : "0.00"}{" "}
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
                                <label className='mb-0'>Hiring Manager :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.hiringManager}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Location:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.location}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Position :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.position}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Req# :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.reqNumber}
                                </label>
                            </div>
                        </div>

                    </div>
                    {/* <div className="mt-1 mb-2 text-overflow_helper">Hiring Manager :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Location :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Position :</div>
                    <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.hiringManager}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.location}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.position}</label>
                        </div>

                    </div> */}
                </div>
            </div>
        </div>
    );
};