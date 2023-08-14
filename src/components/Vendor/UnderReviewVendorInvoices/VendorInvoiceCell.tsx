import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { GridCell } from "@progress/kendo-react-grid";
import { dateFormatter, currencyFormatter } from "../../../HelperMethods";
import { Link } from "react-router-dom";

export function PositionItemTemplate({ check }) {
    return class extends GridCell {
        render() {
            const { dataItem } = this.props;
            return (
                <td className="positionItemRow pl-0 pr-0 " style={{ background: "white" }}>
                    <div className="pl-0 pr-0" key={"posReportee"}>
                        <div className="col-12 px-0">
                            <div className="row mx-0">
                                <div className="col-6 col-md-6">
                                    <span className="mobileBlock">Vendor Invoice Number: </span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0">{dataItem.vendorInvoiceNumber}</span>
                                </div>
                                <div className="col-6 col-md-6 text-right ">
                                    <span className="mobileBlock">Vendor: </span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0">{dataItem.vendorName}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="row mx-0">
                                <div className="col-6 col-md-6 mx-auto pr-0">
                                    <span className="mobileBlock">Billing Period: </span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0">{dataItem.billingPeriod}</span>
                                </div>
                                <div className="col-6 col-md-6 text-right pl-0">
                                    <span className="mobileBlock">Hours: </span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0">{dataItem.hours.toFixed(2)}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="row mx-0">
                                <div className="col-6 col-md-6 mx-auto pr-0">
                                    <span className="mobileBlock">Amount:</span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0"> {currencyFormatter(dataItem.amount)}</span>
                                </div>
                                <div className="col-6 col-md-6 text-right pl-0">
                                    <span className="mobileBlock">Open Days:</span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0"> {dataItem.openDays}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="row mx-0">
                                <div className="col-6 col-md-6 mx-auto pr-0">
                                    <span className="mobileBlock">Authorized Date:</span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0"> {dataItem.clientAuthorizedDate !=null ? dateFormatter(dataItem.clientAuthorizedDate) : "-"}</span>
                                </div>
                                <div className="col-6 col-md-6 mx-auto d-flex justify-content-end">
                                    <div className="d-none d-md-block mr-0">
                                        <Link to={`/vendor/invoices/${dataItem.vendorInvoiceId}/expenses`} className="icon-clr-blue ml-3 mt-2">
                                            <FontAwesomeIcon icon={faFileAlt} className={"lead"} />
                                        </Link>
                                    </div>
                                    <div className=" d-none d-md-block">
                                        <label className="container-R d-flex col-12">
                                            <input
                                                //disabled={dataItem.isLetterExist==false ? true : false}
                                                type="checkbox"
                                                checked={dataItem.isSelected}
                                                onChange={(event) => check(event, dataItem.vendorInvoiceId)}
                                            />
                                            <span className="checkmark-R"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 k-grid-shadow pb-2 mb-0" key={dataItem.vendorName}>
                            <div className="row mt-3 pt-2 pb-2 align-items-center">
                                <div className="col-sm-6 col-md-6">
                                    <div className="row align-items-center">
                                        <div className="col-12 col-lg-auto">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            );
        }
    };
}