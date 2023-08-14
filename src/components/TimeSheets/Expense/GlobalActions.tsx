import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faPencilAlt,
    faTrashAlt,
    faList,
} from "@fortawesome/free-solid-svg-icons";
import { GridCell, GridDetailRow, GridHeaderCell } from "@progress/kendo-react-grid";
import axios from "axios";
import { data } from "../../Admin/ClientAdmin/ClientSetting/data";
import { VendorInvoiceServiceTypeId } from "../../Shared/AppConstants";
import { VIEW_VENDOR_INVOICE } from "../../Shared/ApiUrls";
import { Link } from "react-router-dom";
import { currencyFormatter } from "../../../HelperMethods";


export function CustomHeaderActionCell({ addNew, canAdd }) {
    return class extends GridHeaderCell {
        handleHeaderMenuClick = (actionValue: number) => {
            console.log("Action Taken " + actionValue);
            // GlobalActionClick(1);
            //history.push(`/EditOrder/${dataItem.orderid}`);
        };

        render() {
            const contentAddRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => addNew()}>
                        <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-1 mr-2"} />
                        Add New Expense
                    </div>
                );
            };

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}></span>;
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
export function CommandCell({ edit, remove }) {
    return class extends GridCell {
        uploadControl: HTMLInputElement;
        render() {
            const { dataItem } = this.props;
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
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => remove(dataItem)}>
                        <FontAwesomeIcon icon={faTrashAlt} className={"nonactive-icon-color ml-1 mr-2"} />
                        Remove
                    </div>
                );
            };

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal"></span>;
            };
            const isNewItem = dataItem.tsDayServTypeId ==undefined;
            return (
                <td>
                    <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
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

export const VendorInvoiceNumberCell = (props) => {
    var pageUrl = `${VIEW_VENDOR_INVOICE}${props.dataItem.invoiceId}`;
    return (
        <td contextMenu="Invoice Number" title={props.dataItem.invoiceNumber}>
            <Link
                className="vendorInvoiceNumberTd orderNumberTdBalck"
                to={pageUrl}
            >
                {props.dataItem.invoiceNumber}
            </Link>
        </td>
    );
};

export const TotalAmountCell = (props, data) => {
    let total = 0;

    const totalWithoutDebitAmountData = data.filter((i) => i.serviceTypeIntId != 6);
    const totalAmoutithoutDebit = totalWithoutDebitAmountData.reduce((acc, current) => acc + current[props.field], 0);
    const totalDebitData = data.filter((i) => i.serviceTypeIntId==VendorInvoiceServiceTypeId.DEBIT);
    const debitDataAmount = totalDebitData.reduce((acc, current) => acc + current[props.field], 0);
    total = totalAmoutithoutDebit - debitDataAmount;
    return (
        <td className="expenses-total" colSpan={8} style={props.style}>
            <div className="row mx-0 d-flex justify-content-center align-items-center">
                <div className="col-auto col-lg-auto font-weight-bold pl-0 pr-2">
                    Total Expenses:
                    {/* <span className="tfoot ml-2 tfoot-vendor"> {this.getTotal("totalHours").toFixed(2)}</span> */}
                </div>
                <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0"> {currencyFormatter(total.toFixed(2))}</div>
            </div>
            {/* Total Expenses: <span className="total-hours"> {currencyFormatter(total.toFixed(2))}</span> */}
        </td>
    );
};

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
                    </div>
                </div>
            </div>
        </div>
    );
};