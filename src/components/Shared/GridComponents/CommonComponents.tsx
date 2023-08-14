import { GridCellProps, GridDetailRow, GridNoRecords } from "@progress/kendo-react-grid";
import { currencyFormatter, dateFormatter, datetimeFormatter } from "../../../HelperMethods";
import * as React from "react";
import ReactTooltip from "react-tooltip";
import ReqStatusCard from "../ReqStatusCard/ReqStatusCard";
import Skeleton from "react-loading-skeleton";
import CandStatusCard from "../CandStatusCard/CandStatusCard";
import loadingImage from "../../../assets/images/loading.gif";
import {
    StatusLegendDictionary,
    CandidateStatusLegendDictionary,
    CandidateInterviewStatusLegendDictionary,
    VendorInvoiceStatusLegendDictionary,
    TicketStatusLegendDictionary,
    ContentLibStatusLegendDictionary,
} from "../../Shared/ReqStatusCard/HelperComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faExclamationTriangle, faList, faUserLock } from "@fortawesome/free-solid-svg-icons";
import { CandidateStatus, CandSubmissionSubStatusIds, EntityType, EntityTypeId, ReqStatus } from "../AppConstants";
import auth from "../../Auth";
import { DivisionsProps } from "../../Admin/ClientAdmin/Divisions/ManageDivisions/Divisions";
import { convertShiftDateTime } from "../../ReusableComponents";
import TagControl from "../TagControl/TagControl";

export const GridNoRecord = (showLoader, hideRows?) => {
    return (
        <div>
            {showLoader && (
                <div>
                    <div style={{ backgroundColor: "#f2f7fe" }}>
                        <Skeleton count={10} width={"8%"} style={{ margin: "12px 10px" }} height={15} />
                    </div>
                    <div style={{ backgroundColor: "#fff" }}>
                        <Skeleton count={10} width={"8%"} style={{ margin: "12px 10px" }} height={15} />
                    </div>
                    {!hideRows && (
                        <React.Fragment>
                            <div style={{ backgroundColor: "#f2f7fe" }}>
                                <Skeleton count={10} width={"8%"} style={{ margin: "12px 10px" }} height={15} />
                            </div>
                            <div style={{ backgroundColor: "#fff" }}>
                                <Skeleton count={10} width={"8%"} style={{ margin: "12px 10px" }} height={15} />
                            </div>
                            <div style={{ backgroundColor: "#f2f7fe" }}>
                                <Skeleton count={10} width={"8%"} style={{ margin: "12px 10px" }} height={15} />
                            </div>
                        </React.Fragment>
                    )}
                </div>
            )}
            {!showLoader && <span>No records found!</span>}
        </div>
    );
};

export const CellRender = (props: GridCellProps, titleValue, isCurrency?, isDateTime?) => {
    var fieldValue = props.dataItem[props.field];
    if (props.field.indexOf(".") > -1) {
        var fieldArray = props.field.split(".");
        if (props.dataItem[fieldArray[0]]) {
            fieldValue = props.dataItem[fieldArray[0]][fieldArray[1]];
        }
    }
    if (props.editor=="date") {
        if (fieldValue !=null) {
            if (titleValue=="Authorized Date" || isDateTime==true) {
                fieldValue = `${dateFormatter(new Date(fieldValue))} ${convertShiftDateTime(fieldValue)}`;
            } else {
                fieldValue = dateFormatter(new Date(fieldValue));
            }
        } else {
            fieldValue = "-";
        }
    }
    if (isCurrency) {
        if (fieldValue !=null) {
            fieldValue = currencyFormatter(fieldValue);
        }
        else {
            fieldValue = "-"
        }
    }
    if (props.rowType=="groupHeader") {
        return <td colSpan={0} className="d-none"></td>;
    }
    else {

        return (
            <td contextMenu={titleValue} title={fieldValue}>
                {fieldValue || <div className="text-right text-xl-left">{"-"}</div>}
            </td>
        );
    }
};

export const TotalHoursCell = (props, data) => {
    let total = data.reduce((acc, current) => acc + current[props.field], 0);
    total = total.toFixed(2);
    return (
        <td colSpan={props.colSpan} style={props.style}>
            <div className="row align-items-center justify-content-center mx-0">
                <div className="col-auto col-lg-auto font-weight-bold pl-0 pr-0">Total Hours:</div>
                <div className="col-auto col-lg-auto txt-clr total-hours-font-size pr-0 font-weight-bold text-left pl-0">{total}</div>
            </div>
            {/* Total Hours: <span className="total-hours total-hours-font-size"> {total}</span> */}
        </td>
    );
};

export const DateTimeRender = (props: GridCellProps, titleValue) => {
    var fieldValue = props.dataItem[props.field];
    if (fieldValue !=null) {
        fieldValue = datetimeFormatter(new Date(fieldValue));
    }
    return (
        <td contextMenu={titleValue} title={fieldValue}>
            {" "}
            {fieldValue}{" "}
        </td>
    );
};

export const MenuRender = (props) => {
    return <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}></span>;
};

export const TsStatusCell = (props) => {
    props.dataItem.reqId = null;
    return StatusCell(props);
}

export const StatusCell = (props) => {
    var reqId = props.dataItem.reqId;
    var tsWeekId = props.dataItem.tsWeekId;
    var entityId = reqId || tsWeekId;
    var legendClass = "legend-grey";
    var filteredRows = StatusLegendDictionary.filter((s) => s.status==props.dataItem.status);
    if (filteredRows.length > 0) {
        legendClass = filteredRows[0].className;
    }
    return props.dataItem.inProgress ? (
        <td className="k-command-cell  k-command-cell-icon" contextMenu="Action">
            <img width="40" src={loadingImage}></img>
            <img width="40" src={loadingImage} className="second-loader"></img>
        </td>
    ) : (
        <td contextMenu="Status" style={props.style} className={'k-grid-content-sticky'}>
            {[ReqStatus.APPROVED, ReqStatus.REJECTED, ReqStatus.PENDINGAPPROVAL,
            ReqStatus.ONHOLD].indexOf(props.dataItem.status) !=-1 && entityId && (
                    <ReactTooltip
                        place={"left"}
                        effect={"solid"}
                        multiline={true}
                        backgroundColor={"white"}
                        type={"success"}
                        border={true}
                        className=""
                        borderColor={"#FE988D"}
                        textColor="black"
                        id={entityId}
                     
                    >
            
                        <ReqStatusCard orderId={entityId} orderStatus={props.dataItem.status} entityType={reqId ? EntityType.REQUISITION : EntityType.TIMESHEET} />
                    </ReactTooltip>
                )}
            <div className="d-none d-xl-block">
                <div className="d-flex">
                    <div data-tip data-for={entityId} style={{ margin: "0" }}>
                        <div className={legendClass + " legend-forall"}  ></div>
                    </div>
                    <div className="gridStatusSpan-Candidate-fullName" title={props.dataItem[props.field]} style={{ paddingLeft: "6px" }}>{props.dataItem[props.field]}</div>
                </div>
            </div>

            <div className="d-block d-xl-none">
                <div data-tip data-for={entityId} style={{ margin: "0" }}>
                    <span className={legendClass} style={{ margin: "0" }}></span>
                    <span className="gridStatusSpan">
                        {props.dataItem[props.field]}
                    </span>
                </div>
            </div>
        </td>
    );
};

export const CandidateStatusCell = (props) => {
    var candSubmissionId = props.dataItem.candSubmissionId;
    var legendClass = "legend-grey";
    var filteredRows = CandidateStatusLegendDictionary.filter((s) => s.levelNumber==props.dataItem.statusIntId);
    if (filteredRows.length > 0) {
        legendClass = filteredRows[0].className;
    }
    return (
        <td contextMenu="Status" style={props.style} className={'k-grid-content-sticky'}>
            <div className="d-none d-xl-block">
                <div className="d-flex">
                    <div data-tip data-for={candSubmissionId} style={{ margin: "0" }} >
                        <div className={legendClass + " legend-forall"}  ></div>
                    </div>
                    <div className="gridStatusSpan-Candidate-fullName" title={props.dataItem[props.field]} style={{ paddingLeft: "6px" }}>
                        {props.dataItem[props.field]}
                        {props.dataItem.subStatusId==CandSubmissionSubStatusIds.Temporary && (
                            <FontAwesomeIcon title={"Temporary Credential"} icon={faClock} className={"ml-2"} style={{ color: "grey" }} />
                        )}
                        {props.dataItem.subStatusId==CandSubmissionSubStatusIds.EXPIRED && (
                            <FontAwesomeIcon title={"Temporary Credential Expired"} icon={faClock} className={"ml-2"} style={{ color: "red" }} />
                        )}
                        {props.dataItem.isAnyTaskExpired && (
                            <FontAwesomeIcon title={"Candidate Task Expired"} icon={faExclamationTriangle} className={"ml-2"} style={{ color: "red" }} />
                        )}
                    </div>
                </div>
            </div>

            <div className="d-block d-xl-none">
                <div data-tip data-for={candSubmissionId} style={{ margin: "0" }}>
                    <span className={legendClass} style={{ margin: "0" }}></span>
                    <span className="gridStatusSpan-Candidate">
                        {props.dataItem[props.field]}
                        {props.dataItem.subStatusId==CandSubmissionSubStatusIds.Temporary && (
                            <FontAwesomeIcon title={"Temporary Credential"} icon={faClock} className={"ml-2"} style={{ color: "grey" }} />
                        )}
                        {props.dataItem.subStatusId==CandSubmissionSubStatusIds.EXPIRED && (
                            <FontAwesomeIcon title={"Temporary Credential Expired"} icon={faClock} className={"ml-2"} style={{ color: "red" }} />
                        )}
                        {props.dataItem.isAnyTaskExpired && (
                            <FontAwesomeIcon title={"Candidate Task Expired"} icon={faExclamationTriangle} className={"ml-2"} style={{ color: "red" }} />
                        )}
                    </span>
                </div>
            </div>
        </td>
    );
};

export const ReqStatusWithoutStatusCardCell = (props) => {
    var reqId = props.dataItem.reqId ? props.dataItem.reqId : props.dataItem.reqId;
    var legendClass = "legend-grey";
    var filteredRows = StatusLegendDictionary.filter((s) => s.status==props.dataItem.status);
    if (filteredRows.length > 0) {
        legendClass = filteredRows[0].className;
    }
    return (
        <td contextMenu="Requisition Status">
            <div className="d-none d-xl-block">
                <div className="d-flex">
                    <div data-tip data-for={reqId} style={{ margin: "0" }} >
                        <div className={legendClass + " legend-forall"}  ></div>
                    </div>
                    <div className="gridStatusSpan-Candidate-fullName" title={props.dataItem[props.field]} style={{ paddingLeft: "6px" }}>
                        {props.dataItem[props.field]}
                    </div>
                </div>

                {/* <div data-tip data-for={reqId} style={{ margin: "0" }} className={legendClass}>
                    <span className="gridStatusSpan" title={props.dataItem[props.field]} style={{ paddingLeft: "20px" }}>
                        {props.dataItem[props.field]}
                    </span>
                </div> */}
            </div>

            <div className="d-block d-xl-none">
                <div data-tip data-for={reqId} style={{ margin: "0" }}>
                    <span className={legendClass} style={{ margin: "0" }}></span>
                    <span title={props.dataItem[props.field]}
                        className="gridStatusSpan">
                        {props.dataItem[props.field]}
                    </span>
                </div>
            </div>
        </td>
    );
};

export const CandidateInterviewStatusCell = (props) => {
    var candSubInterviewId = props.dataItem.candSubInterviewId;
    var legendClass = "legend-grey";
    var filteredRows = CandidateInterviewStatusLegendDictionary.filter((s) => s.levelNumber==props.dataItem.statusIntId);
    if (filteredRows.length > 0) {
        legendClass = filteredRows[0].className;
    }
    return (
        <td contextMenu="Status">
            <div className="d-none d-xl-block">
                <div className="d-flex">
                    <div data-tip data-for={candSubInterviewId} style={{ margin: "0" }}>
                        <div className={legendClass + " legend-forall"}  ></div>
                    </div>
                    <div className="gridStatusSpan-Candidate-fullName" title={props.dataItem[props.field]} style={{ paddingLeft: "6px" }}>
                        {props.dataItem[props.field]}
                    </div>
                </div>
            </div>

            <div className="d-block d-xl-none">
                <div data-tip data-for={candSubInterviewId} style={{ margin: "0" }}>
                    <span className={legendClass} style={{ margin: "0" }}></span>
                    <span className="gridStatusSpan-Candidate" >
                        {props.dataItem[props.field]}
                    </span>
                </div>
            </div>
        </td>
    );
};

export const VendorInvoiceStatusCellClient = (props) => {
    var vendorInvoiceId = props.dataItem.vendorInvoiceId;
    var legendClass = "legend-grey";
    var filteredRows = VendorInvoiceStatusLegendDictionary.filter((s) => s.levelNumber==props.dataItem.statusIntId);
    if (filteredRows.length > 0) {
        legendClass = filteredRows[0].className;
    }
    return (
        <td contextMenu="Status">
            <div className="d-none d-xl-block">
                <div className="d-flex">
                    <div data-tip data-for={vendorInvoiceId} style={{ margin: "0" }}>
                        <div className={legendClass + " legend-forall"}  ></div>
                    </div>
                    <div title={props.dataItem[props.field]} className="gridStatusSpan-vendorinvoice" style={{ paddingLeft: "6px" }}>
                        {props.dataItem[props.field]}
                    </div>
                </div>
            </div>

            <div className="d-block d-xl-none">
                <div data-tip data-for={vendorInvoiceId} style={{ margin: "0" }}>
                    <span className={legendClass} style={{ margin: "0" }}></span>
                    <span
                        className="gridStatusSpan-vendor-invoice">
                        {props.dataItem[props.field]}
                    </span>
                </div>
            </div>
        </td>
    );
}
export const VendorInvoiceStatus = (props) => {
    var vendorInvoiceId = props.dataItem.vendorInvoiceId;
    var legendClass = "legend-grey";
    var filteredRows = VendorInvoiceStatusLegendDictionary.filter((s) => s.levelNumber==props.dataItem.statusIntId);
    if (filteredRows.length > 0) {
        legendClass = filteredRows[0].className;
    }
    if (props.rowType=="groupHeader") {
        return <td colSpan={0} className="d-none"></td>;
      }
    return (
        <td style={props && props.style} className={'k-grid-content-sticky vendorInvoiceStatus'}>
            <div className="d-none d-xl-block">
                <div className="d-flex">
                    <div data-tip data-for={vendorInvoiceId} style={{ margin: "0" }}>
                        <div className={legendClass + " legend-forall"}  ></div>
                    </div>
                    <div title={props.dataItem[props.field]} className="gridStatusSpan-vendorinvoice" style={{ paddingLeft: "6px" }}>
                        {props.dataItem[props.field]}
                    </div>
                </div>
            </div>

            <div className="d-block d-xl-none">
                <div data-tip data-for={vendorInvoiceId} style={{ margin: "0" }}>
                    <span className={legendClass} style={{ margin: "0" }}></span>
                    <span
                        className="gridStatusSpan-vendor-invoice">
                        {props.dataItem[props.field]}
                    </span>
                </div>
            </div>
        </td>
    );
}

export const ManageCandidateStatusCell = (props) => {
    var vendorId = auth.getVendor()
    var status = props.dataItem.status;
    var legendClass = "legend-grey";
    if (status=="Available") {
        legendClass = "legend-grn"
    }
    else {
        legendClass = "legend-cand-under-review"
    }
    return (
        <td contextMenu="Status">
            <div className="d-none d-xl-block">
                <div className="d-flex">
                    <div data-tip data-for={status} style={{ margin: "0" }}>
                        <div className={legendClass + " legend-forall"}  ></div>
                    </div>
                    <div className="gridStatusSpan-vendor-invoice" title={props.dataItem[props.field]} style={{ paddingLeft: "6px" }}>
                        {props.dataItem[props.field]}
                        {(vendorId !="" && vendorId !=undefined && vendorId !=null) && props.dataItem.status==CandidateStatus.ALLOCATED && props.dataItem.submittedVendorId !=vendorId && (
                            <FontAwesomeIcon title={"Candidate Locked"} icon={faUserLock} className={"ml-2"} style={{ color: "grey" }} />
                        )}
                    </div>
                </div>
            </div>

            <div className="d-block d-xl-none">
                <div data-tip data-for={status} style={{ margin: "0" }}>
                    <span className={legendClass} style={{ margin: "0" }}></span>
                    <span
                        className="gridStatusSpan-vendor-invoice">
                        {props.dataItem[props.field]}
                    </span>
                </div>
            </div>
        </td>
    );
};

export const WHStatusCell = (props) => {
    var status = props.dataItem.workStatus;
    var legendClass = "legend-grey";
    if (status=="Completed") {
        legendClass = "legend-closed"
    }
    else {
        legendClass = "legend-grn"
    }
    return (
        <td contextMenu="Status">
            <div className="d-none d-xl-block">
                <div className="d-flex">
                    <div data-tip data-for={status} style={{ margin: "0" }}>
                        <div className={legendClass + " legend-forall"}  ></div>
                    </div>
                    <div className="gridStatusSpan-vendor-invoice" title={props.dataItem[props.field]} style={{ paddingLeft: "6px" }}>
                        {props.dataItem[props.field]}
                    </div>
                </div>
            </div>

            <div className="d-block d-xl-none">
                <div data-tip data-for={status} style={{ margin: "0" }}>
                    <span className={legendClass} style={{ margin: "0" }}></span>
                    <span
                        className="gridStatusSpan-vendor-invoice">
                        {props.dataItem[props.field]}
                    </span>
                </div>
            </div>
        </td>
    );
};

export class DetailColumnCell extends React.Component<{ dataItem: any; expandChange: any }> {
    render() {
        let dataItem = this.props.dataItem;
        let candDocumentsId = this.props.dataItem.candDocumentsId;
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

export const StatusBadgeCellRender = (props: GridCellProps, titleValue, isCurrency?) => {
    var fieldValue = props.dataItem[props.field];
    return <td className="badge badge-success">{fieldValue}</td>;
}

export const TicketStatusCell = (props) => {
    var ticketId = props.dataItem.ticketId;
    var legendClass = "legend-grey";
    var filteredRows = TicketStatusLegendDictionary.filter((s) => s.status==props.dataItem.tktStatus);
    if (filteredRows.length > 0) {
        legendClass = filteredRows[0].className;
    }
    if (props.rowType=="groupHeader") {
        return <td colSpan={0} className="d-none"></td>;
    }
    return (
        <td contextMenu="Status" style={props.style} className={'k-grid-content-sticky ticketStatus'}>
            <div className="d-none d-xl-block">
                <div className="d-flex">
                    <div data-tip data-for={ticketId} style={{ margin: "0" }} >
                        <div className={legendClass + " legend-forall"}  ></div>
                    </div>
                    <div className="gridStatusSpan-Candidate-fullName" title={props.dataItem[props.field]} style={{ paddingLeft: "6px" }}>
                        {props.dataItem[props.field]}
                    </div>
                </div>
            </div>

            <div className="d-block d-xl-none">
                <div data-tip data-for={ticketId} style={{ margin: "0" }}>
                    <span className={legendClass} style={{ margin: "0" }}></span>
                    <span className="gridStatusSpan-Candidate">
                        {props.dataItem[props.field]}
                    </span>
                </div>
            </div>
        </td>
    );
};

export const ContentStatusCell = (props) => {
    var ContentLibId = props.dataItem.id;
    var legendClass = "legend-grey";
    var filteredRows = ContentLibStatusLegendDictionary.filter((s) => s.status==props.dataItem.status);
    if (filteredRows.length > 0) {
        legendClass = filteredRows[0].className;
    }
    if (props.rowType=="groupHeader") {
        return <td colSpan={0} className="d-none"></td>;
    }
    return (
        <td contextMenu="Status" style={props.style}>
            <div className="d-none d-xl-block">
                <div className="d-flex">
                    <div data-tip data-for={ContentLibId} style={{ margin: "0" }} >
                        <div className={legendClass + " legend-forall"}  ></div>
                    </div>
                    <div className="gridStatusSpan-Candidate-fullName" title={props.dataItem[props.field]} style={{ paddingLeft: "6px" }}>
                        {props.dataItem[props.field]}
                    </div>
                </div>
            </div>

            <div className="d-block d-xl-none">
                <div data-tip data-for={ContentLibId} style={{ margin: "0" }}>
                    <span className={legendClass} style={{ margin: "0" }}></span>
                    <span className="gridStatusSpan-Candidate">
                        {props.dataItem[props.field]}
                    </span>
                </div>
            </div>
        </td>
    );
};