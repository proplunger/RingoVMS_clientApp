import * as React from "react";
import { dateFormatter, dateFormatter2, errorToastr } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faColumns
} from "@fortawesome/free-solid-svg-icons";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { Link } from "react-router-dom";
import { VIEW_VENDOR_INVOICE } from "../../Shared/ApiUrls";
import { NOT_DOWNLOADABLE } from "../../Shared/AppMessages";
import axios from "axios";

export const PayPeriodStartCell = (props) => {
    var pageUrl = "/timesheet/" + props.dataItem.tsWeekId + "/edit";
    var fieldValue = ""
    if (props.dataItem.payPeriodStartDate !=null) {
        fieldValue = dateFormatter(new Date(props.dataItem.payPeriodStartDate));
    }
    return (
        <td contextMenu="Pay Period">
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
                {" "}
                {(fieldValue)}{" "}
            </Link>
        </td>
    );
};

export const PayPeriodEndCell = (props) => {
    var pageUrl = "/timesheet/" + props.dataItem.tsWeekId + "/edit";
    return (
        <td contextMenu="Pay Period">
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
                {" "}
                {(props.dataItem.payPeriodEndDate)}{" "}
            </Link>
        </td>
    );
};

export const VendorInvoiceNumberCell = (props) => {
    var pageUrl = `${VIEW_VENDOR_INVOICE}${props.dataItem.expenseVendorInvoiceId}`;
    return (
        <td contextMenu="Vendor Invoice Number">
            <Link
                className="vendorInvoiceNumberTd orderNumberTdBalck"
                to={pageUrl}
            >
                {props.dataItem.expenseVendorInvoiceNumber}
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
    var expense_docs = JSON.parse(props.documentName)
    return (
        <div className="row">
            <div className="col-12 col-lg-11 text-dark">
                <div className="row ml-0 mr-0 mt-1">
                    <div className="col-12 pl-0 text-right">

                        {/* <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Service Type :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.serviceType}
                                </label>
                            </div>
                        </div> */}
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Documents :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {expense_docs && expense_docs.map((parent, index) => (
                                        <>
                                        <span
                                            title={parent.fileName}
                                            onClick={() => downloadFile(parent.Path)}
                                            className="valid-file"
                                        >
                                            {parent.Name}
                                        </span>
                                        <br/>
                                        </>
                                    ))}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Notes :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.notes ? props.notes : "-"}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>No of days :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.noOfDays ? props.noOfDays : "-"}
                                </label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Stage Added :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.stageAdded ? props.stageAdded : "-"}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const downloadFile = (filePath) => {
    if (filePath ==undefined) {
        errorToastr(NOT_DOWNLOADABLE);
    } else {
        axios
            .get(`/api/candidates/documents/download?filePath=${filePath}`)
            .then((res: any) => {
                if (res) {
                    let fileExt = filePath.split('.')[1].toLowerCase();
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
};