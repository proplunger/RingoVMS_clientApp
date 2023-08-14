import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";

import { currencyFormatter, dateFormatter, dateFormatter2 } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faFileExcel,
    faColumns,
    faCheckSquare,
} from "@fortawesome/free-solid-svg-icons";
import { GridDetailRow, GridHeaderCell } from "@progress/kendo-react-grid";

import { Link } from "react-router-dom";
import { AuthRole, ReqStatus, TimesheetStatus, TimesheetStatuses } from "../../Shared/AppConstants";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";



export function CustomHeaderActionCell({ submitSelected, isDisabled, showColumn, ExportExcel }) {
    return class extends GridHeaderCell {
        handleHeaderMenuClick = (actionValue: number) => {
            console.log("Action Taken " + actionValue);
            // GlobalActionClick(1);
            //history.push(`/EditOrder/${dataItem.orderid}`);
        };

        render() {
            const contentSubmitRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => submitSelected(props.dataItem)}>
                        <FontAwesomeIcon icon={faCheckSquare} className={"nonactive-icon-color ml-2 mr-2"} />
                        Submit Selected
                    </div>
                );
            };

            const contentColunmsRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => showColumn()}>
                        <FontAwesomeIcon icon={faColumns} className={"nonactive-icon-color ml-2 mr-2"} />
                        Columns
                    </div>
                );
            };

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}></span>;
            };

            return (
                <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
                    <MenuItem render={menuRender} key={"parentMenu"}>
                        <MenuItem render={contentSubmitRender} disabled={isDisabled} key={"submitBtn"} />
                        <MenuItem render={ExportExcel} key={"exportBtn"} />
                        {/* <MenuItem render={contentColunmsRender} disabled key={"columnBtn"} /> */}
                    </MenuItem>
                </Menu>
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
                                <label className='mb-0'>Division:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.division}</label>
                            </div>
                        </div>

                        
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Req #:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>{props.reqNumber}</label>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export const PayPeriodCell = (props) => {
    var pageUrl = "/timesheet/" + props.dataItem.tsWeekId + "/edit";
    let data=  dateFormatter2(props.dataItem.startDate) + " - " + dateFormatter2(props.dataItem.endDate)
    return (
        <td contextMenu="Pay Period" title={data}>
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }} title={data}>
                {" "}
                {data}{" "}
            </Link>
        </td>
    );
};

export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Edit Timesheet",
            permCode: AppPermissions.TS_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/timesheet/${dataItem.tsWeekId}/edit`,
            cssStyle: { display: [TimesheetStatuses.ACTIVE, TimesheetStatuses.REJECTED].indexOf(dataItem.status) !=-1 ? "block" : "none" },
        },
        {
            action: "View Timesheet",
            permCode: AppPermissions.TS_VIEW,
            nextState: "",
            icon: "faEye",
            linkUrl: `/timesheet/${dataItem.tsWeekId}/edit`,
            cssStyle: { display: [TimesheetStatuses.ACTIVE, TimesheetStatuses.REJECTED].indexOf(dataItem.status)==-1 ? "block" : "none" },
        },
        {
            action: "Print Timesheet",
            permCode: AppPermissions.TS_VIEW,
            nextState: "",
            icon: "faPrint",
            linkUrl: `/timesheet/${dataItem.tsWeekId}/edit?print=true`,
        },
        {
            action: "Add Expense",
            permCode: AppPermissions.EXPENSE_CREATE,
            nextState: "",
            icon: "faPlusCircle",
            //linkUrl: `/timesheets/week/${dataItem.tsWeekId}/expense`,
            cssStyle: { display: dataItem.status==TimesheetStatuses.ACTIVE || dataItem.status==TimesheetStatuses.REJECTED ? "block" : "none" },
        },
        {
            action: "Reset Timesheet",
            permCode: AppPermissions.TS_RESET,
            nextState: "",
            icon: "faUndo",
            cssStyle: { display: dataItem.statusIntId !=TimesheetStatus.ACTIVE ? "block" : "none" },
        },
        {
            action: "TS History",
            permCode: AppPermissions.TS_VIEW,
            nextState: "",
            icon: "faClock",
        },
        {
            action: "Job Summary",
            permCode: AppPermissions.TS_SUBMIT,
            nextState: "",
            icon: "faUserMd",
            //cssStyle: { display: dataItem.statusIntId !=TimesheetStatus.ACTIVE ? "block" : "none" },
        },
        {
            action: "View Events",
            permCode: AppPermissions.EVENT_VIEW,
            nextState: "",
            icon: "faEye",
            linkUrl: `/admin/eventslogs/manage/${dataItem.tsWeekId}`,
        },
    ];
    return defaultActions;
}
