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
import { VIEW_VENDOR_INVOICE } from "../../Shared/ApiUrls";
import { AuthRole, AuthRoleType, isRoleType } from "../../Shared/AppConstants";
import _ from "lodash";
import { ExportExcelforClientAndAdmin } from "../../Vendor/Invoice/InvoiceDetails/GlobalActions";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div title="Export to Excel" className="TimeSheet_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm">
                <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon>
            </div>
        }
        filename="Client Statement Report"
    >
        <ExcelSheet data={data} name="Client Statement Report">
            <ExcelColumn label="Invoice #" value="vendorInvoiceNumber" />
            <ExcelColumn label="Vendor" value="vendorName" />
            <ExcelColumn label="Billing Period" value="billingPeriod" />
            <ExcelColumn label="Hours" value="hours" />
            <ExcelColumn label="Amount ($)" value={(col) => amountFormatter(col.amount)} />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Trans Fee ($)" value={(col) => amountFormatter(col.transFee)} />
            <ExcelColumn label="Net Adj Balance ($)" value={(col) => amountFormatter(col.netAdjBalance)} />
            <ExcelColumn label="Total Expense ($)" value={(col) => amountFormatter(col.totalExpenseAmount)} />
            <ExcelColumn label="Total Time ($)" value={(col) => amountFormatter(col.totalTimeAmount)} /> 
        </ExcelSheet>
    </ExcelFile>
);
export const ExportExcelClienAndAdmin = (data?) => (
    <ExcelFile
        element={
            <div title="Export to Excel" className="TimeSheet_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm">
                <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon>
            </div>
        }
        filename="Client Statement Report"
    >
        <ExcelSheet data={data} name="Client Statement Report">
            <ExcelColumn label="Invoice #" value="vendorInvoiceNumber" />
            <ExcelColumn label="Vendor" value="vendorName" />
            <ExcelColumn label="Billing Period" value="billingPeriod" />
            <ExcelColumn label="Hours" value="hours" />
            <ExcelColumn label="Amount" value={(col) => currencyFormatter(col.amount)} />
            <ExcelColumn label="Status" value="status" />
            {/* <ExcelColumn label="Trans Fee" value={(col) => currencyFormatter(col.transFee)} />
            <ExcelColumn label="Net Adj Balance" value={(col) => currencyFormatter(col.netAdjBalance)} /> */}
        </ExcelSheet>
    </ExcelFile>
);

export const VendorInvoiceNumberCell = (props) => {
    var pageUrl = `${VIEW_VENDOR_INVOICE}${props.dataItem.vendorInvoiceId}`;
    return (
        <td contextMenu="Vendor Invoice Number">
            <Link
                className="vendorInvoiceNumberTd orderNumberTdBalck"
                to={pageUrl}
            >
                {props.dataItem.vendorInvoiceNumber}
            </Link>
        </td>
    );
};
export const PayPeriodCell = (props) => {
    var pageUrl = VIEW_VENDOR_INVOICE + props.dataItem.vendorInvoiceId;
    return (
        <td contextMenu="Billing Period">
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
                <MenuItem render={() => isRoleType(AuthRoleType.Vendor) ? ExportExcel(excelData) : ExportExcelClienAndAdmin(excelData)} />
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
                        {(isRoleType(AuthRoleType.SystemAdmin) || isRoleType(AuthRoleType.Vendor)) && (
                            <>
                            <div className="row mb-2">
                                <div className="col-6">
                                    <label className='mb-0'>Trans Fee :</label>
                                </div>
                                <div className="col-6 text-left pl-0 pr-0">
                                    <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                        {currencyFormatter(props.transFee)}</label>
                                </div>
                            </div>
                        
                            <div className="row mb-2">
                                <div className="col-6">
                                    <label className='mb-0'>Net Adj Balance :</label>
                                </div>
                                <div className="col-6 text-left pl-0 pr-0">
                                    <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                        {currencyFormatter(props.netAdjBalance)}</label>
                                </div>
                            </div>
                       
                            <div className="row mb-2">
                                <div className="col-6">
                                    <label className='mb-0'>Total Expense :</label>
                                </div>
                                <div className="col-6 text-left pl-0 pr-0">
                                    <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                        {currencyFormatter(props.totalExpenseAmount)}</label>
                                </div>
                            </div>
                        
                            <div className="row mb-2">
                                <div className="col-6">
                                    <label className='mb-0'>Total Time :</label>
                                </div>
                                <div className="col-6 text-left pl-0 pr-0">
                                    <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                        {currencyFormatter(props.totalTimeAmount)}</label>
                                </div>
                            </div>
                            </>
                        )}


                        {/* <div className="mt-1 mb-2 text-overflow_helper">Provider :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Position :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Service Type :</div>
                        {[AuthRole.Client_7, AuthRole.HR, AuthRole.HiringManager].indexOf(userObj.role)==-1 &&
                            <div className="mt-1 mb-2 text-overflow_helper">Trans Fee :</div>
                        }
                        {[AuthRole.Client_7, AuthRole.HR, AuthRole.HiringManager].indexOf(userObj.role)==-1 &&
                            <div className="mt-1 mb-2 text-overflow_helper">Net Adj Balance :</div>
                        } */}
                    </div>
                    {/* <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.associate}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.position}</label>
                        </div>

                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.serviceType}</label>
                        </div>
                        {[AuthRole.Client_7, AuthRole.HR, AuthRole.HiringManager].indexOf(userObj.role)==-1 &&
                            <div className="mt-1 mb-2 text-overflow_helper">
                                <label className="mb-0">{currencyFormatter(props.transFee)}</label>
                            </div>
                        }

                        {[AuthRole.Client_7, AuthRole.HR, AuthRole.HiringManager].indexOf(userObj.role)==-1 &&
                            <div className="mt-1 mb-2 text-overflow_helper">
                                <label className="mb-0">{currencyFormatter(props.netAdjBalance)}</label>
                            </div>
                        }

                    </div> */}
                </div>
            </div>
        </div>
    );
};