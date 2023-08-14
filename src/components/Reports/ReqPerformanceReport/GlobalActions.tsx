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
        }
        filename="Requisition Performance Report"
    >
        <ExcelSheet data={data} name="Requisition Performance Report">
            <ExcelColumn label="Req Number" value="reqNumber" />
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Zone" value="zone" />
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Open Position" value="totalRequired" />
            <ExcelColumn label="Filled Rate" value="filledRate" />
            <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
            <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
            <ExcelColumn label="Filled In Days" value="filledInDays" />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Hiring Manager" value="hiringManager" />
            <ExcelColumn label="Shift Start Time" value={(col) => col.shiftStartTime ? convertShiftDateTime(col.shiftStartTime) : "-"} />
            <ExcelColumn label="Shift End Time" value={(col) => col.shiftEndTime ? convertShiftDateTime(col.shiftEndTime) : "-"} />
            <ExcelColumn label="Created By" value="creator" />
            <ExcelColumn label="Skills" value="skills" />
            <ExcelColumn label="Bill Rate ($)" value={(col) => amountFormatter(col.billRate)} />
            <ExcelColumn label="Budget ($)" value={(col) => amountFormatter(col.budget)} />
            <ExcelColumn label="Position Description" value="positionDesc" />
        </ExcelSheet>
    </ExcelFile>
);

export const ExportExcelNew = (data?) => (
    <ExcelFile
        element={
            <div className="TimeSheet_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm" title="Export to Excel">
                <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon> {" "}
            </div>
        }
        filename="Requisition Performance Report"
    >
        <ExcelSheet data={data} name="Requisition Performance Report">
            <ExcelColumn label="Req Number" value="reqNumber" />
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Zone" value="zone" />
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Department" value="departmentName" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Open Position" value="totalRequired" />
            <ExcelColumn label="Filled Rate" value="filledRate" />
            <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
            <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
            <ExcelColumn label="Filled In Days" value="filledInDays" />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Hiring Manager" value="hiringManager" />
            <ExcelColumn label="Shift Start Time" value={(col) => col.shiftStartTime ? convertShiftDateTime(col.shiftStartTime) : "-"} />
            <ExcelColumn label="Shift End Time" value={(col) => col.shiftEndTime ? convertShiftDateTime(col.shiftEndTime) : "-"} />
            <ExcelColumn label="Created By" value="creator" />
            <ExcelColumn label="Skills" value="skills" />
            <ExcelColumn label="Bill Rate ($)" value={(col) => amountFormatter(col.billRate)} />
            <ExcelColumn label="Budget ($)" value={(col) => amountFormatter(col.budget)} />
            <ExcelColumn label="Position Description" value="positionDesc" />
        </ExcelSheet>
    </ExcelFile>
);
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
                                <label className='mb-0'>Reason :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.reason}
                                </label>
                            </div>
                        </div>
                        {props.isEnableDepartment && 
                            <div className="row mb-2">
                                <div className="col-6">
                                    <label className='mb-0'>Department :</label>
                                </div>
                                <div className="col-6 text-left pl-0 pr-0">
                                    <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                        {props.departmentName || '-'}
                                    </label>
                                </div>
                            </div>
                        }
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
                                <label className='mb-0'>Created Date :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {dateFormatter(props.createdDate)}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Job Workflow :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.jobWf}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Job Category :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.jobCategory}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Shift Start Time :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.shiftStartTime ? convertShiftDateTime(props.shiftStartTime) : "-"}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Shift End Time :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.shiftEndTime ? convertShiftDateTime(props.shiftEndTime) : "-"}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Skills :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.skills}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Bill Rate :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {currencyFormatter(props.billRate)}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Budget Amount  :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {currencyFormatter(props.budget)}
                                </label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Position Description :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.positionDesc}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Fill Rate :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.filledRate}%
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Filled In Days :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.filledInDays ? props.filledInDays : "-"}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Region :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.region }
                                </label>
                            </div>
                        </div>
                        {/* <div className="mt-1 mb-2 text-overflow_helper">Reason :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Hiring Manager :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Created Date :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Job Workflow :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Job Category :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Shift Start Time :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Shift End Time :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Skills :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Bill Rate :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Budget Amount :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Position Description :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Fill Rate :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Filled In Days :</div> */}
                    </div>
                    {/* <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.reason}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.hiringManager}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{dateFormatter(props.createdDate)}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.jobWf}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.jobCategory}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.shiftStartTime ? convertShiftDateTime(props.shiftStartTime) : "-"}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.shiftEndTime ? convertShiftDateTime(props.shiftEndTime) : "-"}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.skills}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">
                                {currencyFormatter(props.billRate)}
                                </label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">
                                {currencyFormatter(props.budget)}
                                </label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0 position-textellipse">
                                {props.positionDesc}
                                </label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0 position-textellipse">
                                {props.filledRate}
                                </label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0 position-textellipse">
                                {props.filledInDays ? props.filledInDays : "-"}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};