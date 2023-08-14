/*This file contains all the reusable components being used in various use case pages.*/
import * as React from "react";
import { GridCell, GridCellProps } from "@progress/kendo-react-grid";
import { dateFormatter } from "../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faCopy,
    faList,
    faReceipt,
    faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { CandSubmissionSubStatusIds } from "./Shared/AppConstants";
import Shimmer from 'react-shimmer-effect'
import { deburr } from "lodash";
import { toODataString } from "@progress/kendo-data-query";
import BreadCrumbs from "./Shared/BreadCrumbs/BreadCrumbs";

export function CustomCellForMobile() {
    return class extends GridCell {
        _documentRef;

        handleEditClick = (dataItem) => {
            console.log("Edit " + dataItem);
        };

        handleDeleteClick = (dataItem) => {
            console.log("Delete " + dataItem);
        };

        handleViewClick = (dataItem) => {
            console.log("View " + dataItem);
        };

        handleDuplicateClick = (dataItem) => {
            console.log("Duplicate " + dataItem);
        };

        render() {
            const { dataItem } = this.props;
            const self = this;

            const contentViewRender = (props) => {
                return (
                    <div
                        className="bg-gray pb-1 pt-1 w-100"
                        onClick={() => this.handleViewClick(dataItem)}
                    >
                        <span className="k-icon k-i-eye ml-2 mr-2"></span>View
                    </div>
                );
            };

            const contentEditRender = (props) => {
                return (
                    <div
                        className="pb-1 pt-1 w-100"
                        onClick={() => this.handleEditClick(dataItem)}
                    >
                        <span className="k-icon k-i-pencil ml-2 mr-2"></span>Edit
                    </div>
                );
            };

            const contentDuplicateRender = (props) => {
                return (
                    <div
                        className="pb-1 pt-1 w-100"
                        onClick={() => this.handleDuplicateClick(dataItem)}
                    >
                        <FontAwesomeIcon
                            icon={faCopy}
                            className={"nonactive-icon-color ml-2 mr-2"}
                        />
            Duplicate
                    </div>
                );
            };

            const contentDeleteRender = (props) => {
                return (
                    <div
                        className="pb-1 pt-1 w-100"
                        onClick={() => this.handleDeleteClick(dataItem)}
                    >
                        <span className="k-icon k-i-close ml-2 mr-2"></span>Remove
                    </div>
                );
            };

            const menuRender = (props) => {
                return (
                    <span className="k-icon k-i-more-horizontal active-icon-blue expandMenuIconCls"></span>
                );
            };

            return (
                <Menu
                    openOnClick={true}
                    key={dataItem.orderNumber}
                    className="actionItemMenu"
                >
                    <MenuItem
                        render={menuRender}
                        key={"parentMenu" + dataItem.orderNumber}
                    >
                        <MenuItem
                            render={contentEditRender}
                            key={"editBtn" + dataItem.orderNumber}
                        />
                        <MenuItem
                            render={contentViewRender}
                            key={"viewBtn" + dataItem.orderNumber}
                        />
                        <MenuItem
                            render={contentDuplicateRender}
                            key={"duplicateBtn" + dataItem.orderNumber}
                        />
                        <MenuItem
                            render={contentDeleteRender}
                            key={"deleteBtn" + dataItem.orderNumber}
                        />
                    </MenuItem>
                </Menu>
            );
        }
    };
}

export const KendoDataValueRender = (props: GridCellProps, titleValue) => {
    var fieldValue = props.dataItem[props.field];
    if (props.field.indexOf(".") > -1) {
        var fieldArray = props.field.split(".");
        if (props.dataItem[fieldArray[0]]) {
            fieldValue = props.dataItem[fieldArray[0]][fieldArray[1]];
        }
    }
    if (props.editor=="date") {
        fieldValue = dateFormatter(new Date(fieldValue));
    }
    return (
        <td contextMenu={titleValue} title={fieldValue}>
            {" "}
            {fieldValue}{" "}
        </td>
    );
};

export const KendoTes = (props: GridCellProps, titleValue) => {
    var fieldValue = props.dataItem[props.field];
    var CustomCellBtn = CustomCellForMobile();
    if (props.editor=="date") {
        fieldValue = dateFormatter(new Date(fieldValue));
    }
    return (
        <td contextMenu={titleValue} className="positionCellCls">
            <label className="d-none d-md-block">{fieldValue} </label>
            <div className="row d-md-none accordionTableHead text-white">
                <div className="col-12 d-flex">
                    <div className="col-auto text-left">Position: {fieldValue}</div>
                    <div className="col-auto d-flex justify-content-end">
                        {" "}
                        <FontAwesomeIcon icon={faList} className={"mr-1"} />{" "}
                        <CustomCellBtn {...props} />{" "}
                    </div>
                </div>
            </div>
        </td>
    );
};

export const kendoLoadingPanel = (
    <div className="k-loading-mask">
        <span className="k-loading-text">Loading</span>
        <div className="k-loading-image"></div>
        <div className="k-loading-color"></div>
    </div>
);

export const showLoader = () => {
    document.body.classList.add("loading-indicator");
}

export const hideLoader = () => {
    document.body.classList.remove("loading-indicator");
}

export const ErrorComponent = (message?: any) => {
    return (
        <div role="alert" className="k-form-error k-text-start">
            {Object.keys(message).length != 0
                ? message.message
                : "This field is required"}
      .
        </div>
    );
};

export const ErrorComponentNoDecimal = (message?: any) => {
    return (
        <div role="alert" className="k-form-error k-text-start">
            {Object.keys(message).length != 0
                ? message.message
                : "This field is required"}
        </div>
    );
};

export const HrsErrorComponent = (message?: any) => {
    return (
        <div
            role="alert"
            className="k-form-error k-text-start"
            style={{ display: "block" }}
        >
            {message ? message : "This field is required"}.
        </div>
    );
};

export const NumberCell = (props, title, isPercent?) => {
    if (props.rowType=="groupHeader") {
        return <td colSpan={0} className="d-none"></td>;
    }else {
        return (
            <td
                className="pr-4"
                contextMenu={title}
                title={props.dataItem[props.field]}
                style={{ textAlign: "right" }}
            >
                {props.dataItem[props.field]} {isPercent && " %"}
            </td>
        );
    }
};

export const FormatPhoneNumber = (value) => {
    if (value !=null && value.length==10) {
        let phone = `(${value.substr(0, 3)}) ${value.substr(3, 3)}-${value.substr(
            6,
            4
        )}`;
        return phone;
    } else {
        return "";
    }
};

export const FormatSSNNumber = (value) => {
    if (value !=null && value.length==9) {
        let phone = `${value.substr(0, 3)}-${value.substr(3, 2)}-${value.substr(
            5,
            4
        )}`;
        return phone;
    } else {
        return "";
    }
};

export const convertShiftDateTime = (date) => {
    if (date) {
        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    } else {
        return "-";
    }
};
export const eventdateFormatter = (date) => {
    if (date){
        return new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(date));
    } else {
        return "-"
    }  
};
export const PhoneNumberCell = (props, title) => {
    var fieldValue = props.dataItem[props.field];
    if (props.field.indexOf(".") > -1) {
        var fieldArray = props.field.split(".");
        if (props.dataItem[fieldArray[0]]) {
            fieldValue = props.dataItem[fieldArray[0]][fieldArray[1]];
        }
    }
    return (
        <td className="pr-4" contextMenu={title} style={{ textAlign: "left" }}>
            {FormatPhoneNumber(fieldValue) || (
                <div className="text-center">{"-"}</div>
            )}
        </td>
    );
};

export const KendoFilter = (dataState, queryStr, queryParams) => {
    let finalQueryString = `$filter=${queryParams}&${queryStr}`;
    if (dataState.filter) {
        if (dataState.filter.filters.length > 0) {
            var splitQueryArr = queryStr.split("$filter=");
            splitQueryArr[1] = queryParams + " and " + splitQueryArr[1];
            finalQueryString = splitQueryArr.join("$filter=");
        }
    }
    return finalQueryString;
};

export const CreateQueryString = (dataState, clientId, vendorId) =>{
    var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var finalQueryString = queryStr;
        var queryParams = '';
        if (!dataState.filter) {
            queryParams = `clientId eq ${clientId}`;
            if (vendorId) {
                queryParams += ` and vendorId eq ${vendorId}`;
            }
            finalQueryString = KendoFilter(
                dataState,
                queryStr,
                queryParams
            );
       
        }
        else{
            if (vendorId) {
                queryParams = `vendorId eq ${vendorId}`;
                finalQueryString = KendoFilter(
                    dataState,
                    queryStr,
                    queryParams
                );
            }
        }
        return finalQueryString;
}

export const candTriggerName = (title, status?, status_msg?, subStatus?, revert?, onRevert?) => {
    return (
        <>
            <span>
                {title}
                {status_msg && (
                    <span
                        className="d-none d-sm-block"
                        style={{ float: "right", marginRight: "15px", marginTop: "1px" }}
                    >
                        {status_msg}
                    </span>
                )}
                {revert && (
                    <span
                        className="d-none d-sm-block"
                        style={{ float: "right", marginRight: "15px", marginTop: "1px", zIndex: 100 }}
                        onClick={() => onRevert(title)}
                    >
                        <FontAwesomeIcon
                            title={"Undo All"}
                            icon={faUndo}
                            className={"mr-2"}
                        />
                    </span>
                )}
                {subStatus==CandSubmissionSubStatusIds.Temporary && (
                    <span
                        className="d-none d-sm-block"
                        style={{ float: "right", marginRight: "15px", marginTop: "1px" }}
                    >
                        <FontAwesomeIcon
                            title={"Temporary Credential"}
                            icon={faClock}
                            className={"mr-2"}
                        />
                    </span>
                )}
                {status && (
                    <span
                        className="d-none d-sm-block"
                        style={{ float: "right", marginRight: "25px" }}
                    >
                        Status : <span className="font-weight-bold">{status}</span>
                    </span>
                )}
            </span>
        </>
    );
};

export const TitleDetails = (pageTitle, data,clientInvoiceId) => {
    return (
        <div className="row pt-1 pb-1 mt-3 accordianTitleClr mx-auto mb-2">
            <div className="col-12 fonFifteen paddingLeftandRight">
                <div className="row mx-0 align-items-center">
                    <div><BreadCrumbs globalData={{clientInvoiceId:clientInvoiceId}} ></BreadCrumbs>
                        <span className=" d-inline d-sm-none ml-1">
                            <span className="mr-2 float-right text-dark shadow invoice">
                                {" "}
                                <FontAwesomeIcon
                                    className="faclock_size d-block"
                                    icon={faReceipt}
                                    style={{ color: "white" }}
                                />{" "}
                            </span>
                        </span>
                    </div>
                    <div className="col pr-0 d-flex align-items-center justify-content-end">
                        <span className=" d-none d-sm-inline">
                            <span className="mr-2 float-right text-dark shadow invoice">
                                {" "}
                                <FontAwesomeIcon
                                    className="faclock_size d-block"
                                    icon={faReceipt}
                                    style={{ color: "white" }}
                                />{" "}
                            </span>
                        </span>
                        <span
                            className="float-right text-dark"
                            style={{ fontSize: "12px" }}
                        >
                            Client Invoice#: {data.invoiceNumber}
                        </span>
                        <span
                            className="float-right text-dark"
                            style={{ fontSize: "12px" }}
                        >
                            {" "}
              | Run Date: {data.billingPeriod}
                        </span>
                        <span
                            className="float-right text-dark"
                            style={{ fontSize: "12px" }}
                        >
                            | Status: {data.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Icons For Caraousal on Dashboard

export const leftChivron = () => {
    return (
        <a
            role="button"
            data-slide="prev"
            className={`carousel-control-prev cusrsor-pointer `}
        >
            <span
                className="carousel-control-prev-icon cusrsor-pointer-icon carousel-control-prev_icon"
                aria-hidden="true"
            >
                <div className="d-flex align-items-center justify-content-center  carousel-control-next_inside shadow-sm">
                    <i
                        className="fal fa-angle-left"
                        style={{
                            fontSize: "24px",
                            color: "#2971a6",
                            marginTop: "0px",
                            marginLeft: "-0px",
                        }}
                    ></i>
                </div>
            </span>
            <span className="sr-only">Previous</span>
        </a>
    );
};

// To be Changed Icons
export const rightChivron = () => {
    return (
        <a
            className="carousel-control-next cusrsor-pointer"
            role="button"
            data-slide="next"
        >
            <span
                className="carousel-control-next-icon carousel-control-next_icon"
                aria-hidden="true"
            >
                <div className="d-flex align-items-center justify-content-center carousel-control-next_inside shadow-sm">
                    <i
                        className="fal fa-angle-right"
                        style={{ fontSize: "24px", color: "#2971a6" }}
                    ></i>
                </div>
            </span>
            <span className="sr-only">Next</span>
        </a>
    );
};

export const NorecordFoundCard = () => {
    return (
        <div className="row ml-mr mx-0">
            <div className="col-12 px-2">
                <div className="card h-100 pt-2 pl-0 pr-0 pb-2 shadow-sm">
                    <div className="card-body p-1 pt-0 pb-0">
                        <div className="row mx-0 mt-3 mb-3">
                            <div className="card-title col-12 text-dark text-left pl-2 pr-0 mb-0 d-flex align-items-center">
                                <h3 className="mb-0  h3_font-size slider-elliipse w-100 text-center slider-icon">
                                    <i className="fad fa-telescope nonactive-icon-color"></i>
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="card-body mt-2 p-1">
                        <div className="row mx-0 text-center mb-2">
                            <div className="font-size_item pr-0 pl-0 text-center slider-elliipse text-center w-100">
                                No Records found
              </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ShimmerEffectTab = () => {
    return <div className="col-12 px-1 pb-2">
        <div className="containershimmer col-12 px-0 shadow-sm">
            <div className="row mx-0 p-3 justify-content-between">
                <Shimmer>
                    <div className="line2"></div>
                    <div className="square"></div>
                    <div className="line w-100 ml-0 mb-0"></div>
                </Shimmer>
            </div>
        </div>
    </div>
}


export const ShimmerEffectTabChart = () => {
    return <div className="col-12 px-1 pb-2">
        <div className="containershimmer col-12 px-0 ">
            <div className="row mx-0 p-3 justify-content-center align-items-center">
                {/* <Shimmer> */}
                <div className="cardshimmer cardshimmer-newchart br">
                    <div className="wrapper justify-content-center align-items-center">
                        <div className="profilePic animate"> <div className="segment"></div></div>
                        <div className="legendContainer">
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div className=" animate legendGroup"></div>
                                <div className="comment br animate w80"></div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div className=" animate legendGroup"></div>
                                <div className="comment br animate w80"></div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div className=" animate legendGroup"></div>
                                <div className="comment br animate w80"></div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div className=" animate legendGroup"></div>
                                <div className="comment br animate w80"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* </Shimmer> */}
            </div>
        </div>
    </div>
}


export const ShimmerEffectTabChartReq = () => {
    return <div className="col-12 px-1 pb-2">
        <div className="containershimmer cardshimmer cardshimmer-newchart br">
            <div className="wrapper justify-content-center  align-items-center">

                <div className="d-flex justify-content-center w-100 align-items-end">

                    <div className="comment-vl-chart br-none animate w800"></div>

                    <div className="comment-new-v2-chart br-none animate w800"></div>

                    <div className="comment-new-v3-chart br-none animate w800"></div>

                    <div className="comment-new-v4-chart br-none animate w800"></div>

                </div>
            </div>
        </div>
        {/* <div className="containershimmer col-12 px-0 d-none">
            <div className="row mx-0 p-3 justify-content-center align-items-center">
               
                <div className="rotate-chart animate" style={{ display: "flex" }}>

                    <div className="vl-chart animate"></div>
                    <div className="v2-chart animate"></div>
                    <div className="v3-chart animate"></div>
                    <div className="v4-chart animate"></div>

                </div>
              
            </div>

        </div> */}
    </div>

}