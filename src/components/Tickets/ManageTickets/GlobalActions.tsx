import * as React from "react";
import auth from "../../Auth";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faFileExcel,
    faList,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../Shared/GridComponents/CommonComponents";
import { ROWACTIONS, TicketStatus } from "../../Shared/AppConstants";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { history } from "../../../HelperMethods";
import { dateFormatter } from "../../../HelperMethods";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { CREATE_SUPPORT_TICKETS, TICKET_VIEW_URL } from "../../Shared/ApiUrls";
import { Link } from "react-router-dom";
import { convertShiftDateTime } from "../../ReusableComponents";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Customer Service Management"
    >
        <ExcelSheet data={data} name="Customer Service Management">
            <ExcelColumn label="Ticket #" value="ticketNumber" />
            <ExcelColumn label="Created Date" value={(col) => col.createdDate ? dateFormatter(col.createdDate) : ""} />
            <ExcelColumn label="Title" value="ticketTitle" />
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Function Area" value="tktFuncArea" />
            <ExcelColumn label="Assigned To" value="currentAssignedTo" />
            <ExcelColumn label="Queue" value="tktQue" />
            <ExcelColumn label="Request Type" value="tktReqType" />
            <ExcelColumn label="Priority" value="tktPrio" />
            <ExcelColumn label="Aging" value="aging" />
            <ExcelColumn label="Resolution Date" value={(col) => col.resDate ? dateFormatter(col.resDate) : ""} />
            <ExcelColumn label="Status" value="tktStatus" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddNewTicket = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick = {() => history.push(CREATE_SUPPORT_TICKETS)}>
            
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Ticket{" "}
        </div>
    );
};

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
            {auth.hasPermissionV2(AppPermissions.SUP_TKT_CREATE) && <MenuItem render={() => AddNewTicket()} />}
                <MenuItem render={() => ExportExcel(excelData)} />
            </MenuItem>
        </Menu>
    );
};


export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "View",
            permCode: AppPermissions.SUP_TKT_VIEW,
            nextState: "",
            icon: "faEye",
            linkUrl: `/ticket/view/${dataItem.ticketId}`,
            // cssStyle: { display: dataItem.tktStatus != TicketStatus.NEW ? "block" : "none" },
        },
        {
            action: "Edit",
            permCode: AppPermissions.SUP_TKT_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/ticket/edit/${dataItem.ticketId}`,
            cssStyle: { display: dataItem.tktStatus !=TicketStatus.CLOSED ? "block" : "none" },
        },
        {
            action: ROWACTIONS.DELETE,
            permCode: AppPermissions.SUP_TKT_DELETE,
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.tktStatus==TicketStatus.NEW ? "block" : "none" },
        },
        {
            action: "Ticket History",
            permCode: AppPermissions.SUP_TKT_VIEW,
            nextState: "",
            icon: "faArrowLeft",
        },
        {
            action: "View Events",
            permCode: AppPermissions.EVENT_VIEW,
            nextState: "",
            icon: "faEye",
            linkUrl:`/admin/eventslogs/manage/${dataItem.ticketId}`,
        },
    ];
    return defaultActions;
}

export class DetailColumnCell extends React.Component<{ dataItem: any; expandChange: any; style:any;rowType: any}> {
    render() {
        let dataItem = this.props.dataItem;
        if (this.props.rowType=="groupHeader") {
            return <td colSpan={0} className="d-none"></td>;
        }
        return (
            <td contextMenu="View More" style={this.props && this.props.style} className={'k-grid-content-sticky text-center'}>
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
                        {/* <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Assigned To:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0' title={props.currentAssignedTo}>{props.currentAssignedTo}</label>
                            </div>
                        </div> */}
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Tags:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0' title={props.tags}>{props.tags}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TicketNumberCell = (props) => {
    var pageUrl = `${TICKET_VIEW_URL}${props.dataItem.ticketId}`;
    if (props.rowType=="groupHeader") {
        return <td colSpan={0} className="d-none"></td>;
    }
    return (
        <td contextMenu="Ticket #">
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
                {props.dataItem.ticketNumber}
            </Link>
        </td>
    );
};