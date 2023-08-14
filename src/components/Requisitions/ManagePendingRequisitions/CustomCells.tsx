import { GridCell, GridCellProps, GridHeaderCell } from "@progress/kendo-react-grid";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import * as React from "react";
import { Link } from "react-router-dom";
import ReactExport from "react-data-export";
import { dateFormatter } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPaper, faThumbsUp, faThumbsDown, faEye, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { HOLD_APPROVAL_STATUS } from "../../Shared/AppMessages";
import { history } from "../../../HelperMethods";
import { Checkbox } from "@progress/kendo-react-inputs";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import auth from "../../Auth";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ReqNumberCell = (props) => {
    var pageUrl = "/requisitions/review/";
    return (
        <td contextMenu="Req Number">
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl + props.dataItem.reqId} style={{ color: "#007bff" }}>
                {props.dataItem.reqNumber}
            </Link>
        </td>
    );
};

export const ExportExcel = (excelData) => (
    <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="My Pending Approvals"
    >
        <ExcelSheet data={excelData} name="My Pending Approvals">
            <ExcelColumn label="Req Number" value="reqNumber" />
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Reason" value="reason" />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Created Date" value={(col) => dateFormatter(new Date(col.createdDate))} />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Reason" value="reason" />
            <ExcelColumn label="Job Type" value="jobType" />
            <ExcelColumn label="Job Category" value="jobCategory" />
            <ExcelColumn label="Reports To" value="reportsTo" />
            <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
            <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
            <ExcelColumn label="Shift Start Time" value={(col) => col.shiftStartTime} />
            <ExcelColumn label="Shift End Time" value={(col) => col.shiftEndTime} />
            <ExcelColumn label="Created By" value="creator" />
            <ExcelColumn label="Skills" value="skills" />
            <ExcelColumn label="Position Description" value="positionDesc" />
        </ExcelSheet>
    </ExcelFile>
);

export function CustomHeaderActionCell({ ExportMenu, GlobalActionClick, EnableHold, IsOrderSelected, EnableOffHold }) {
    return class extends GridHeaderCell {
        handleHeaderMenuClick = (actionValue: number) => {
            GlobalActionClick(actionValue);
        };

        render() {
            const contentHoldRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => this.handleHeaderMenuClick(3)}>
                        <FontAwesomeIcon icon={faHandPaper} className={"nonactive-icon-color ml-2 mr-2"} />
                        Hold Selected
                    </div>
                );
            };

            const contentApproveRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => this.handleHeaderMenuClick(1)}>
                        <FontAwesomeIcon icon={faThumbsUp} className={"nonactive-icon-color ml-2 mr-2"} />
                        Approve Selected
                    </div>
                );
            };

            const contentRejectRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => this.handleHeaderMenuClick(2)}>
                        <FontAwesomeIcon icon={faThumbsDown} className={"nonactive-icon-color ml-2 mr-2"} />
                        Reject Selected
                    </div>
                );
            };

            const contentOffHoldRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => this.handleHeaderMenuClick(4)}>
                        <FontAwesomeIcon icon={faHandPaper} className={"nonactive-icon-color ml-2 mr-2"} />
                        Remove Hold Selected
                    </div>
                );
            };

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}></span>;
            };
            debugger;
            return (
                <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
                    <MenuItem render={menuRender} key={"parentMenu"}>
                        {auth.hasPermissionV2(AppPermissions.REQ_APPROVE) && <MenuItem disabled={!EnableHold || !IsOrderSelected} render={contentApproveRender} key={"approveBtn"} />}
                        {auth.hasPermissionV2(AppPermissions.REQ_REJECT) && <MenuItem disabled={!EnableHold || !IsOrderSelected} render={contentRejectRender} key={"rejectBtn"} />}
                        {auth.hasPermissionV2(AppPermissions.REQ_HOLD) && <MenuItem disabled={!EnableHold || !IsOrderSelected} render={contentHoldRender} key={"holdBtn"} />}
                        {auth.hasPermissionV2(AppPermissions.REQ_OFFHOLD) && <MenuItem disabled={!EnableOffHold || !IsOrderSelected} render={contentOffHoldRender} key={"holdoffBtn"} />}
                        <MenuItem render={ExportMenu} />
                    </MenuItem>
                </Menu>
            );
        }
    };
}

export function CustomActionCell({ openConfirmBox }) {
    return class extends GridCell {
        _documentRef;
        private isVisible: boolean = false;

        handleViewBtnClick = (dataItem) => {
            history.push(`/requisitions/review/${dataItem.reqId}`);
        };

        handleApproveBtnClick = (dataItem) => {
            openConfirmBox(dataItem, "openApproveConfirm");
            //history.push(`/EditOrder/${dataItem.orderid}`);
        };

        handleRejectBtnClick = (dataItem) => {
            openConfirmBox(dataItem, "openRejectConfirm");
        };

        handleHoldBtnClick = (dataItem) => {
            localStorage.setItem("orderId", dataItem.orderId);
            openConfirmBox(dataItem, "openHoldConfirm");
        };

        render() {
            const { dataItem } = this.props;
            const self = this;

            const contentHoldRender = (props) => {
                const labelText = dataItem.status==HOLD_APPROVAL_STATUS ? "Remove Hold" : "Hold";
                return (
                    <div className="pb-1 pt-1 w-100 approvalGridIcons" onClick={() => this.handleHoldBtnClick(dataItem)}>
                        <FontAwesomeIcon icon={faHandPaper} className={"nonactive-icon-color ml-2 mr-2"} />
                        {labelText}
                    </div>
                );
            };

            const contentApproveRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  approvalGridIcons" onClick={() => this.handleApproveBtnClick(dataItem)}>
                        <FontAwesomeIcon icon={faThumbsUp} className={"nonactive-icon-color ml-2 mr-2"} />
                        Approve
                    </div>
                );
            };

            const contentRejectRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100 approvalGridIcons" onClick={() => this.handleRejectBtnClick(dataItem)}>
                        <FontAwesomeIcon icon={faThumbsDown} className={"nonactive-icon-color ml-2 mr-2"} />
                        Reject
                    </div>
                );
            };

            const contentViewRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100 approvalGridIcons" onClick={() => this.handleViewBtnClick(dataItem)}>
                        <FontAwesomeIcon icon={faEye} className={"nonactive-icon-color ml-2 mr-2"} />
                        View
                    </div>
                );
            };

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal active-icon-blue"></span>;
            };

            return (
                <td contextMenu="Action">
                    <Menu openOnClick={true} key={dataItem.reqNumber} className="actionItemMenu">
                        <MenuItem render={menuRender} key={"parentMenu" + dataItem.reqNumber}>
                            {auth.hasPermissionV2(AppPermissions.REQ_VIEW) && <MenuItem render={contentViewRender} key={"viewBtn" + dataItem.reqNumber} />}
                            {auth.hasPermissionV2(AppPermissions.REQ_APPROVE) && <MenuItem
                                disabled={dataItem.status==HOLD_APPROVAL_STATUS}
                                render={contentApproveRender}
                                key={"approveBtn" + dataItem.reqNumber}
                            />}
                            {auth.hasPermissionV2(AppPermissions.REQ_REJECT) && <MenuItem
                                disabled={dataItem.status==HOLD_APPROVAL_STATUS}
                                render={contentRejectRender}
                                key={"rejectBtn" + dataItem.reqNumber}
                            />}
                            {(auth.hasPermissionV2(AppPermissions.REQ_HOLD) || auth.hasPermissionV2(AppPermissions.REQ_OFFHOLD)) && <MenuItem render={contentHoldRender} key={"holdBtn" + dataItem.reqNumber} />}
                        </MenuItem>
                    </Menu>
                </td>
            );
        }
    };
}

export const ApprovalGridCheckCell = (props: GridCellProps, CheckOrder) => {
    const dataItem = props.dataItem;
    return (
        <td contextMenu="Check Item">
            <Checkbox value={dataItem.isChecked} className="gridCellCheckbox" onChange={(event) => CheckOrder(dataItem)} />
        </td>
    );
};

export const CheckAllCells = ({ CheckOrder, IsAllChecked }) => {
    return <Checkbox value={IsAllChecked} className="gridHeaderCheckbox" onChange={(event) => CheckOrder(event.value)} />;
};
