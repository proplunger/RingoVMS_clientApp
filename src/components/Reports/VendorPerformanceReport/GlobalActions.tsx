import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { currencyFormatter, dateFormatter, dateFormatter2 } from "../../../HelperMethods";
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
import reportServices from "../../Shared/Services/ReportServices";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

export const ExportExcel = (clientId, vendorId, dataState) => (  

    <ExcelFile
        element={
            <div className="TimeSheet_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm" title="Export to Excel">
                <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon>
            </div>
        }
        filename="Vendor Performance Report"
    >           
        <ExcelSheet data={()=>reportServices.getVendorPerformanceReportForExcel(clientId, vendorId, dataState)} name="Vendor Performance Report">
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Req Number" value="reqNumber" />
            <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
            <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
            <ExcelColumn label="Required" value="required" />
            <ExcelColumn label="Release to Vendor" value="vendor" />
            <ExcelColumn label="Release Date" value={(col) => dateFormatter(col.releaseDate)} />
            <ExcelColumn label="Submittal" value="submittal" />
            <ExcelColumn label="Distribution" value="distribution" />

            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Tier" value="tier" />
            <ExcelColumn label="Time to fill" value={(col) => col.filledInDays ? col.filledInDays : "-"} />
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
    if (props.rowType=="groupHeader") {
        return <td colSpan={0} className="d-none"></td>;
    }
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

// export const CustomMenu = (excelData) => {
//     return (
//         <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
//             <MenuItem render={MenuRender}>
//                 <MenuItem render={() => ExportExcel(excelData)} />
//                 <MenuItem render={Columns} />
//             </MenuItem>
//         </Menu>
//     );
// };

export class DetailColumnCell extends React.Component<{ dataItem: any; expandChange: any, rowType: any }> {
    render() {
        let dataItem = this.props.dataItem;
        if (this.props.rowType=="groupHeader") {
            return <td colSpan={0} className="d-none"></td>;
        }
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
                                <label className='mb-0'>Distribution :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.distribution}
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
                                <label className='mb-0'>Tier :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.tier}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Time To Fill :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.filledInDays ? props.filledInDays : "-"}
                                </label>
                            </div>
                        </div>


                    </div>
                    {/* <div className="mt-1 mb-2 text-overflow_helper"> Distribution :</div>

                        <div className="mt-1 mb-2 text-overflow_helper">Position :</div>

                        <div className="mt-1 mb-2 text-overflow_helper">Tier :</div>

                        <div className="mt-1 mb-2 text-overflow_helper">Time To Fill :</div>
                    <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.distribution}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.position}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.tier}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.filledInDays ? props.filledInDays : "-"}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};