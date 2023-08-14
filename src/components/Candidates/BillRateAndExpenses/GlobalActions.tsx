import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { currencyFormatter, dateFormatter } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faTimes,
    faPlusCircle,
    faList,
    faFileExcel,
    faColumns,
    faEye,
    faPencilAlt,
    faCopy,
    faTrashAlt,
    faCheckCircle,
    faThumbsUp,
    faThumbsDown,
    faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { CellRender, GridNoRecord, MenuRender } from "../../Shared/GridComponents/CommonComponents";
import { GridCell, GridDetailRow, GridHeaderCell } from "@progress/kendo-react-grid";
import auth from "../../Auth";
import { history } from "../../../HelperMethods";
import { convertShiftDateTime, FormatPhoneNumber } from "../../ReusableComponents";
import { Link } from "react-router-dom";
import { CandSubStatusIds, isAssignmentInProgress } from "../../Shared/AppConstants";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export function CustomHeaderActionCell({ AddBillClick, status, hideAddBillRate, statusIntId, Approve, isApproveSelected }) {
    return class extends GridHeaderCell {
        handleHeaderMenuClick = () => {
            AddBillClick();
        };

        render() {

            const contentApproveRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => this.handleHeaderMenuClick()}>
                        <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"} />
                        Add Rates
                    </div>
                );
            };

            const BillRateApproveRender = () => {
                return (
                    <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={Approve}>
                        <FontAwesomeIcon
                            icon={faThumbsUp}
                            className={"nonactive-icon-color ml-2 mr-2"}
                        />
                        Approve Selected
                    </div>
                );
            };

            // const BillRateRejectRender = (props) => {
            //     return (
            //         <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={Reject}>
            //             <FontAwesomeIcon
            //                 icon={faThumbsDown}
            //                 className={"nonactive-icon-color ml-2 mr-2"}
            //             />
            //             Reject Selected
            //         </div>
            //     );
            // };

            // const BillRateNegotiateRender = (props) => {
            //     return (
            //         <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={Negotiate}>
            //             <FontAwesomeIcon
            //                 icon={faArrowLeft}
            //                 className={"nonactive-icon-color ml-2 mr-2"}
            //             />
            //             Negotiate Selected
            //         </div>
            //     );
            // };

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}></span>;
            };

            return (
                <Menu
                    openOnClick={true}
                    className="actionItemMenu actionItemMenuThreeDots"
                >
                    <MenuItem render={menuRender} key={"parentMenu"}>
                        {(status=="Risk Cleared" ||
                            status=="Pending Vendor Presentation" ||
                            status=="Vendor Presentation Submitted" ||
                            status =="Ready for Offer" ||
                            isAssignmentInProgress(statusIntId)) &&
                            !hideAddBillRate && (
                                <MenuItem
                                    render={contentApproveRender}
                                    key={"approveBtn"}
                                />
                            )}
                                <MenuItem
                                    render={BillRateApproveRender}
                                    key={"approveBtn"}
                                    disabled={!isApproveSelected}
                                />
                                {/* <MenuItem
                                    render={BillRateRejectRender}
                                    key={"approveBtn"}
                                    disabled={!isRejectSelected}
                                />
                                <MenuItem
                                    render={BillRateNegotiateRender}
                                    key={"approveBtn"}
                                    disabled={!isNegotiateSelected}
                                /> */}
                    </MenuItem>
                </Menu>
            );
        }
    };
}

export function CustomCell({ openDeleteConfirm, openNew, openEdit }) {
    return class extends GridCell {
        _documentRef;
        private isVisible: boolean = false;

        handleAddClick = (dataItem) => {
            openNew(dataItem);
        };

        handleEditClick = (dataItem) => {
            openEdit(dataItem);
        };

        handleDeleteClick = (dataItem) => {
            openDeleteConfirm("showDeleteModal", dataItem);
        };

        render() {
            const { dataItem } = this.props;
            const self = this;

            const contentEditRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100 myorderactionicons" onClick={() => this.handleEditClick(dataItem)}>
                        <FontAwesomeIcon icon={faPencilAlt} className={"nonactive-icon-color ml-2 mr-2"} />
                        Edit
                    </div>
                );
            };

            const contentDeleteRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100 myorderactionicons" onClick={() => this.handleDeleteClick(dataItem)}>
                        <FontAwesomeIcon icon={faTrashAlt} className={"nonactive-icon-color ml-2 mr-2"} />
                        Remove
                    </div>
                );
            };

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal active-icon-blue"></span>;
            };

            return (
                <td contextMenu="Action">
                    <Menu openOnClick={true} key={dataItem.billRateId} className="actionItemMenu ">
                        <MenuItem render={menuRender} key={"parentMenu" + dataItem.billRateId}>
                            <MenuItem
                                render={contentEditRender}
                                key={"editBtn" + dataItem.billRateId}
                            //cssStyle={{ display: dataItem.status=="Draft" ? "block" : "none" }}
                            />
                            <MenuItem
                                render={contentDeleteRender}
                                key={"deleteBtn" + dataItem.billRateId}
                            //cssStyle={{ display: dataItem.status=="Draft" ? "block" : "none" }}
                            />
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
            <div className="col-12 col-lg-12 text-dark">
                <div className="row ml-0 mr-0 mt-1">
                    <div className="col-12 pl-0 text-right">
                        <div className="row mb-2">
                            <div className="col-7">
                                <label className='mb-0'>Override Rate :</label>
                            </div>
                            <div className="col-5 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.overrideBillRate ? currencyFormatter(props.overrideBillRate) : "-"}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-7">
                                <label className='mb-0'>Override Holiday Rate :</label>
                            </div>
                            <div className="col-5 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.overrideHolidayBillRate ? currencyFormatter(props.overrideHolidayBillRate) : "-"}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-7">
                                <label className='mb-0'>Guaranteed Hours :</label>
                            </div>
                            <div className="col-5 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.guaranteedHours ? props.guaranteedHours : "-"}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-7">
                                <label className='mb-0'>Guaranteed Bill Type :</label>
                            </div>
                            <div className="col-5 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.guaranteedBillType ? props.guaranteedBillType : "-"}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-7">
                                <label className='mb-0'>Action By :</label>
                            </div>
                            <div className="col-5 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.actionBy ? props.actionBy : "-"}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-7">
                                <label className='mb-0'>Action Date :</label>
                            </div>
                            <div className="col-5 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.actionDate ? dateFormatter(props.actionDate) : "-"}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-7">
                                <label className='mb-0'>Override Comment :</label>
                            </div>
                            <div className="col-5 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.overrideComment ? props.overrideComment : "-"}</label>
                            </div>
                        </div>
                        {props.isPayRateEnabled && 
                            <div className="row mb-2">
                                <div className="col-7">
                                    <label className='mb-0'>Pay Rate :</label>
                                </div>
                                <div className="col-5 text-left pl-0 pr-0">
                                    <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                        {props.payRate ? currencyFormatter(props.payRate) : "-"}</label>
                                </div>
                            </div>
                        }
                        <div className="row mb-2">
                            <div className="col-7">
                                <label className='mb-0'>Comment :</label>
                            </div>
                            <div className="col-5 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.comment ? props.comment : "-"}</label>
                            </div>
                        </div>
                    </div>

                    {/* <div className="col-7 col-sm-9 pl-0 text-left">
                        <div className="mt-0 text-overflow_helper">
                            <label className="mb-0 font-weight-bold text-overflow-ellipse">{props.guaranteedHours ? props.guaranteedHours : "-"}</label>
                        </div>
                        <div className="mt-0 text-overflow_helper">
                            <label className="mb-0 font-weight-bold text-overflow-ellipse">{props.guaranteedBillType ? props.guaranteedBillType : "-"}</label>
                        </div>
                        <div className="mt-0 text-overflow_helper">
                            <label className="mb-0 font-weight-bold text-overflow-ellipse">{props.actionBy ? props.actionBy : "-"}</label>
                        </div>
                        <div className="mt-0 text-overflow_helper">
                            <label className="mb-0 font-weight-bold text-overflow-ellipse">{props.actionDate ? dateFormatter(props.actionDate) : "-"}</label>
                        </div>
                        <div className="mt-1 text-overflow_helper">
                            <label className="mb-0 font-weight-bold text-overflow-ellipse">{props.overrideComment ? props.overrideComment : "-"}</label>
                        </div>

                    </div> */}
                </div>
            </div>
        </div>
    );
};
