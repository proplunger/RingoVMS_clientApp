import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { currencyFormatter, dateFormatter, dateFormatter2, RemoveSecFromTime } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faList,
    faFileExcel,
    faPencilAlt,
    faTrashAlt,
    faSave,
    faUndo,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { GridCell, GridDetailRow, GridHeaderCell } from "@progress/kendo-react-grid";
import { convertShiftDateTime } from "../../ReusableComponents";
import { Link } from "react-router-dom";
import axios from "axios";

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
        filename="My Requisitions"
    >
        <ExcelSheet data={data} name="My Requisitions">
            <ExcelColumn label="Req Number" value="reqNumber" />
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Reason" value="reason" />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Created Date" value={(col) => dateFormatter(new Date(col.createdDate))} />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Job Workflow" value="jobWf" />
            <ExcelColumn label="Job Category" value="jobCategory" />
            <ExcelColumn label="Hiring Manager" value="hiringManager" />
            <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
            <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
            <ExcelColumn label="Shift Start Time" value={(col) => convertShiftDateTime(col.shiftStartTime)} />
            <ExcelColumn label="Shift End Time" value={(col) => convertShiftDateTime(col.shiftEndTime)} />
            <ExcelColumn label="Created By" value="creator" />
            <ExcelColumn label="Skills" value="skills" />
            <ExcelColumn label="Bill Rate" value={(col) => currencyFormatter(col.billRate)} />
            <ExcelColumn label="Budget" value={(col) => currencyFormatter(col.budget)} />
            <ExcelColumn label="Position Description" value="positionDesc" />
        </ExcelSheet>
    </ExcelFile>
);

export function CustomHeaderActionCell({ addNew, canAdd, index }) {
    return class extends GridHeaderCell {
        handleHeaderMenuClick = (actionValue: number) => {
            console.log("Action Taken " + actionValue);
            // GlobalActionClick(1);
            //history.push(`/EditOrder/${dataItem.orderid}`);
        };

        render() {
            const contentAddRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => addNew(index)}>
                        <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-1 mr-2"} />
                        Add New
                    </div>
                );
            };

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal"></span>;
            };

            return (
                <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
                    <MenuItem render={menuRender} key={"parentMenu"}>
                        {canAdd && <MenuItem render={contentAddRender} key={"addBtn"} />}
                    </MenuItem>
                </Menu>
            );
        }
    };
}
export function CommandCell({ edit, remove, save, discard, editField, parentIndex }) {
    return class extends GridCell {
        uploadControl: HTMLInputElement;
        render() {
            const { dataItem, dataIndex } = this.props;
            const inEdit = dataItem[editField];
            const contentEditRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => edit(dataItem)}>
                        <FontAwesomeIcon icon={faPencilAlt} className={"nonactive-icon-color ml-1 mr-2"} />
                        Edit
                    </div>
                );
            };
            const contentDeleteRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => remove(dataItem, parentIndex)}>
                        <FontAwesomeIcon icon={faTrashAlt} className={"nonactive-icon-color ml-1 mr-2"} />
                        Remove
                    </div>
                );
            };

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal"></span>;
            };
            const isNewItem = dataItem.tsDayServTypeId ==undefined;
            return inEdit ? (
                <td className="k-command-cell  k-command-cell-icon" contextMenu="Action">
                    <div className="txt-clr-blue">
                        <span
                            //className={"font-medium " + (dataItem.role && dataItem.approverIds ? " " : "disable-opacity")}
                            style={{ paddingRight: "12px", cursor: "pointer" }}
                            title={"Save"}
                            onClick={() => save(dataItem, dataIndex, parentIndex)}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </span>
                        <span
                            className="font-medium"
                            style={{ paddingRight: "5px", cursor: "pointer" }}
                            title={isNewItem ? "Remove" : "Reset"}
                            onClick={() => (isNewItem ? remove(dataItem, parentIndex) : discard(dataItem, parentIndex))}
                        >
                            <FontAwesomeIcon icon={isNewItem ? faTrash : faUndo} />
                        </span>
                    </div>
                </td>
            ) : (
                <td>
                    <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots d-print-none">
                        <MenuItem render={menuRender} key={"parentMenu"}>
                            {<MenuItem render={contentEditRender} key={"editBtn"} />}
                            {<MenuItem render={contentDeleteRender} key={"deleteBtn"} />}
                        </MenuItem>
                    </Menu>
                </td>
            );
        }
    };
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
                                <label className='mb-0'>Provider:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.provider}</label>
                            </div>

                        </div>

                        <div className="row mb-2">

                            <div className="col-6">
                                <label className='mb-0'>Pay Period:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>{dateFormatter2(props.startDate) + " - " + dateFormatter2(props.endDate)}</label>
                            </div>

                        </div>

                        <div className="row mb-2">

                            <div className="col-6">
                                <label className='mb-0'>Start Date:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>{dateFormatter(props.startDate)}</label>
                            </div>

                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>End Date:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>{dateFormatter(props.endDate)}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Division:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.division}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Location:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.location}</label>
                            </div>
                        </div>
                    </div>

                    {/* <div className="mt-1 mb-2 text-overflow_helper">Provider :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Pay Period :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Start Date :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">End Date :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Division :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Location :</div> */}

                    {/* <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0 white-space-break">{props.provider}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0 white-space-break">{dateFormatter2(props.startDate) + " - " + dateFormatter2(props.endDate)}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0 white-space-break">{dateFormatter(props.startDate)}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0 white-space-break">{dateFormatter(props.endDate)}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.division}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.location}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export const ProviderCell = (props) => {
    var pageUrl = "/timesheet/provider/" + props.dataItem.candidateId;
    return (
        <td contextMenu="Provider">
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
                {" "}
                {props.dataItem.candidateName}{" "}
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

export const TotalHoursCell = (isHoliday, data, index, isProvider?: boolean) => {
    let totalHours = 0;
    let totalBillable = 0;
    if (data && data.tsDayVms[index].serviceTypes) {
        data.tsDayVms[index].tsDayServTypeVms.forEach((item) => {
            let serviceType = data.tsDayVms[index].serviceTypes.find((x) => x.id==item.serviceTypeId);
            let gHours = item.gauranteedHours ? item.gauranteedHours : 0;
            let rate = 0;
            if (item.rate) {
                rate = item.rate;

                let timeOut = RemoveSecFromTime(item.timeOut);
                let timeIn = RemoveSecFromTime(item.timeIn);
                //let timeOut = new Date(item.timeOut).valueOf();
                //let timeIn = new Date(item.timeIn).valueOf();
                let hour = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5 > 24 ? ((timeOut - timeIn) / 36e5) - 24 : (timeOut - timeIn) / 36e5==0 ? 24 : (timeOut - timeIn) / 36e5;
                let breakHours = parseInt(item.breakHour) + parseFloat((parseInt(item.breakMinutes) / 60).toString());
                let workHrs = 0;
                if ((hour - breakHours) < 0) {
                    workHrs = 0;
                }
                else {
                    workHrs = hour - breakHours;
                }

                if (item.billType=="Hourly") {
                    totalHours += workHrs + gHours;
                    totalBillable += (workHrs + gHours) * rate;
                }
                else {
                    totalHours += workHrs + gHours;
                    totalBillable += rate;
                }
            }
            else {

                if (serviceType) {
                    if (isHoliday) {
                        rate = serviceType.holidayBillRate ? serviceType.holidayBillRate : serviceType.billRate;
                    }
                    else {
                        rate = serviceType.billRate;
                    }
                    let timeOut = RemoveSecFromTime(item.timeOut);
                    let timeIn = RemoveSecFromTime(item.timeIn);
                    //let timeOut = new Date(item.timeOut).valueOf();
                    //let timeIn = new Date(item.timeIn).valueOf();
                    let hour = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5 > 24 ? ((timeOut - timeIn) / 36e5) - 24 : (timeOut - timeIn) / 36e5==0 ? 24 : (timeOut - timeIn) / 36e5;
                    let breakHours = parseInt(item.breakHour) + parseFloat((parseInt(item.breakMinutes) / 60).toString());
                    let workHrs = 0;
                    if ((hour - breakHours) < 0) {
                        workHrs = 0;
                    }
                    else {
                        workHrs = hour - breakHours;
                    }

                    if (serviceType.billType=="Hourly") {
                        totalHours += workHrs + gHours;
                        totalBillable += (workHrs + gHours) * rate;
                    }
                    else {
                        totalHours += workHrs + gHours;
                        totalBillable += rate;
                    }
                }
            }
            // if g hours alreay aaded

        });
        data.tsDayVms[index].totalHours = totalHours.toFixed(2);
        data.tsDayVms[index].totalAmount = totalBillable.toFixed(2);
    }
    //var fieldValue = props.dataItem[props.field];
    return (
        <td contextMenu={"Total Hours"} key={"row" + index} title={""} colSpan={200} className="text-center font-weight-bold">
            <div className="row justify-content-center">
                <div className="col col-sm-auto mt-2 mt-sm-0">
                    <div className="row mx-0 align-items-center justify-content-center">
                        <div className="col-12 col-sm-auto col-lg-auto font-weight-bold pr-lg-2">Total Hours :</div>
                        <div className="col-auto col-lg-auto total-hours-amount-timesheet total-hours-font-size pr-0 font-weight-bold text-left pl-0 total-hours total-hours-font-size total-hours-amount-timesheet timeSheet-break-hours-amount">{totalHours.toFixed(2)}</div>
                    </div>
                </div>
                {/* <div className="col-auto d-flex align-items-center pr-0 ">
                    <span>Total Hours</span> <span className="total-hours total-hours-font-size pl-2"> {totalHours.toFixed(2)}</span>
                </div> */}
                {!isProvider &&
                    <div className="col col-sm-auto mt-2 mt-sm-0">
                        <div className="row mx-0 align-items-center justify-content-center">
                            <div className="col-12 col-sm-auto col-lg-auto font-weight-bold pr-lg-2">Total Billable :</div>
                            <div className="col-auto col-lg-auto total-hours-amount-timesheet total-hours-font-size pr-0 font-weight-bold text-left pl-0 total-hours total-hours-font-size total-hours-amount-timesheet timeSheet-break-hours-amount">{currencyFormatter(totalBillable.toFixed(2))}</div>
                        </div>
                    </div>
                    // <div className="col-auto d-flex align-items-center">
                    //     <span>Total Billable</span> <span className="total-hours total-hours-font-size pl-2"> {currencyFormatter(totalBillable.toFixed(2))}</span>
                    // </div>
                }

            </div>
        </td>
    );
};

export const GrandTotalCell = (data, isNotProvider, gHrs, gRate) => {
    let grandTotalHours = 0;
    let grandTotalBillable = 0;
    if (data) {
        data.tsDayVms.forEach((tsDay) => {
            if (tsDay.isWorking) {
                tsDay.tsDayServTypeVms.forEach((tsdayServ) => {
                    let gHours = tsdayServ.gauranteedHours ? tsdayServ.gauranteedHours : 0;
                    gHours = parseFloat(gHours);
                    let rate = 0;
                    if (tsdayServ.rate) {
                        rate = tsdayServ.rate;

                        let timeOut = RemoveSecFromTime(tsdayServ.timeOut);
                        let timeIn = RemoveSecFromTime(tsdayServ.timeIn);
                        //let timeOut = new Date(tsdayServ.timeOut).valueOf();
                        //let timeIn = new Date(tsdayServ.timeIn).valueOf();
                        let hour = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5 > 24 ? ((timeOut - timeIn) / 36e5) - 24 : (timeOut - timeIn) / 36e5==0 ? 24 : (timeOut - timeIn) / 36e5;
                        let breakHours = parseInt(tsdayServ.breakHour) + parseFloat((parseInt(tsdayServ.breakMinutes) / 60).toString());
                        let workHrs = 0;
                        if ((hour - breakHours) < 0) {
                            workHrs = 0;
                        }
                        else {
                            workHrs = hour - breakHours;
                        }
                        if (tsdayServ.billType=="Hourly") {
                            grandTotalHours += workHrs + gHours;
                            grandTotalBillable += Number((workHrs + gHours).toFixed(2)) * rate;
                        }
                        else {
                            grandTotalHours += workHrs + gHours;
                            grandTotalBillable += rate;
                        }

                    }
                    else {
                        let serviceType = tsDay.serviceTypes && tsDay.serviceTypes.find((x) => x.id==tsdayServ.serviceTypeId);
                        if (serviceType) {
                            if (tsDay.isHoliday) {
                                rate = serviceType.holidayBillRate ? serviceType.holidayBillRate : serviceType.billRate;
                            }
                            else {
                                rate = serviceType.billRate;
                            }
                            let timeOut = RemoveSecFromTime(tsdayServ.timeOut);
                            let timeIn = RemoveSecFromTime(tsdayServ.timeIn);
                            //let timeOut = new Date(tsdayServ.timeOut).valueOf();
                            //let timeIn = new Date(tsdayServ.timeIn).valueOf();
                            let hour = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5 > 24 ? ((timeOut - timeIn) / 36e5) - 24 : (timeOut - timeIn) / 36e5==0 ? 24 : (timeOut - timeIn) / 36e5;
                            let breakHours = parseInt(tsdayServ.breakHour) + parseFloat((parseInt(tsdayServ.breakMinutes) / 60).toString());
                            let workHrs = 0;
                            if ((hour - breakHours) < 0) {
                                workHrs = 0;
                            }
                            else {
                                workHrs = hour - breakHours;
                            }
                            if (serviceType.billType=="Hourly") {
                                grandTotalHours += workHrs + gHours;
                                grandTotalBillable += (hour + gHours - breakHours) * rate;
                            }
                            else {
                                grandTotalHours += workHrs + gHours;
                                grandTotalBillable += rate;
                            }
                        }
                    }


                    //     // let billRate = serviceTypes.find((x) => x.id==tsdayServ.serviceTypeId)
                    //     //     ? serviceTypes.find((x) => x.id==tsdayServ.serviceTypeId).billRate
                    //     //     : 0;
                    //     // let timeOut = RemoveSecFromTime(tsdayServ.timeOut);
                    //     // let timeIn = RemoveSecFromTime(tsdayServ.timeIn);
                    //     // //let timeOut = new Date(tsdayServ.timeOut).valueOf();
                    //     // //let timeIn = new Date(tsdayServ.timeIn).valueOf();
                    //     // let hour = ((timeOut - timeIn) / 36e5) < 0 ? (24 + (timeOut - timeIn) / 36e5):(timeOut - timeIn) / 36e5;
                    //     // //let hour = (timeOut - timeIn) / 36e5;
                    //     // let breakHours = parseInt(tsdayServ.breakHour) + parseFloat((parseInt(tsdayServ.breakMinutes)/60).toString());
                    //     // grandTotalHours += hour - breakHours;
                    //     // grandTotalBillable += (hour - breakHours) * billRate;
                });
            }
        });
        
        grandTotalHours = grandTotalHours + gHrs;
        grandTotalBillable = grandTotalBillable + (gHrs * gRate);
        data.totalHours = grandTotalHours.toFixed(2);
        data.totalAmount = grandTotalBillable.toFixed(2);
    }

    //var fieldValue = props.dataItem[props.field];
    return (
        <div className="col-12 col-sm-12 col-lg-12 mt-3 mb-3 text-center font-weight-bold d-flex align-items-center justify-content-center">
            <div className="row align-items-center justify-content-center mx-0">
                <div className="col-12 col-sm-auto mt-2 mt-sm-0">
                    <div className="row mx-0 align-items-center justify-content-center">
                        <div className="col-12 col-sm-auto col-lg-auto font-weight-bold pr-2">Grand Total Hours  :</div>
                        <div className="col-auto col-lg-auto total-hours-amount-timesheet total-hours-font-size pr-0 font-weight-bold text-left pl-0 total-hours total-hours-font-size total-hours-amount-timesheet timeSheet-break-hours-amount">{grandTotalHours.toFixed(2)}</div>
                    </div>
                </div>
                {/* <div>Grand Total Hours <span className="total-hours total-hours-font-size pl-2 pr-3">{grandTotalHours.toFixed(2)}</span></div> */}
                {isNotProvider &&
                    <div className="col-12 col-sm-auto mt-2 mt-sm-0">
                        <div className="row mx-0 align-items-center justify-content-center">
                            <div className="col-12 col-sm-auto col-lg-auto font-weight-bold pr-2">Grand Total Billable  :</div>
                            <div className="col-auto col-lg-auto total-hours-amount-timesheet total-hours-font-size pr-0 font-weight-bold text-left pl-0 total-hours total-hours-font-size total-hours-amount-timesheet timeSheet-break-hours-amount">{currencyFormatter(grandTotalBillable.toFixed(2))}</div>
                        </div>
                    </div>
                    // <div>Grand Total Billable <span className="total-hours total-hours-font-size pl-2">{currencyFormatter(grandTotalBillable.toFixed(2))}</span></div>
                }
            </div>

        </div>
    );
};

export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Edit Timesheet",
            controllerName: "TS",
            methodName: "GetTimeSheets",
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/timesheet/${dataItem.tsWeekId}/edit/`,
            //cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
        {
            action: "View Timesheet",
            controllerName: "TS",
            methodName: "GetTimeSheets",
            nextState: "",
            icon: "faEye",
            linkUrl: `/timesheet/${dataItem.tsWeekId}/view/`,
            disabled: true,
            //cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
        {
            action: "Add Expense",
            controllerName: "TS",
            methodName: "GetTimeSheets",
            nextState: "",
            icon: "faPlusCircle",
            linkUrl: `/timesheet/${dataItem.tsWeekId}/expense/`,
            //cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
    ];
    return defaultActions;
}

export function DownloadDocument(filePath) {
    axios.get(`/api/candidates/documents/download?filePath=${filePath}`).then((res: any) => {
        if (res) {
            let fileExt = filePath.split(".")[1].toLowerCase();
            let fileType;
            if (fileExt=="jpg" || fileExt=="png" || fileExt=="jpeg") {
                fileType = "image";
            } else {
                fileType = "application";
            }
            const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
            const downloadLink = document.createElement("a");
            let fileName = filePath.split("/")[2];

            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        }
    });
}
