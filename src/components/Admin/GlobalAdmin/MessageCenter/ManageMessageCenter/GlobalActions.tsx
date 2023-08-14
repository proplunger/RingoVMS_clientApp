import auth from "../../../../Auth";
import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faList,
    faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../../../Shared/GridComponents/CommonComponents";
import { MessageStatus, ReqStatus } from "../../../../Shared/AppConstants";
import { dateFormatter, datetimeFormatter, history } from "../../../../../HelperMethods";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { FormatPhoneNumber } from "../../../../ReusableComponents";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { EDIT_COMMUNICATION_CENTER } from "../../../../Shared/ApiUrls";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Manage Communication Center"
    >
        <ExcelSheet data={data} name="Manage Communication Center">
            <ExcelColumn label="Topic" value="title" />
            <ExcelColumn label="Message" value="msgDesc" />
            <ExcelColumn label="Priority" value="msgPrio" />
            <ExcelColumn label="Category" value="msgCat" />
            <ExcelColumn label="Start Date" value={(value) => value.startDate !=null ? datetimeFormatter(value.startDate) : ''}/>
            <ExcelColumn label="End Date" value={(value) => datetimeFormatter(value.endDate)}/>
            <ExcelColumn label="Created Date" value={(value) => datetimeFormatter(value.createdDate)}/>
            <ExcelColumn label="Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
);

export const CreateCommunicationCenter = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => history.push('/admin/communicationcenter/create')}>
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Message{" "}
        </div>
    );
};

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                {auth.hasPermissionV2(AppPermissions.VENDOR_CREATE) && <MenuItem render={CreateCommunicationCenter} />}
                <MenuItem render={() => ExportExcel(excelData)} />
            </MenuItem>
        </Menu>
    );
};


export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Edit",
            permCode: AppPermissions.MSG_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/admin/communicationcenter/edit/${dataItem.msgId}`,
        },
        {
            action: "Delete",
            permCode: AppPermissions.MSG_DELETE,
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.status !=MessageStatus.ARCHIVED ? "block" : "none"}
        },
        {
            action: `Publish`,
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: `faCheckCircle`,
            cssStyle: { display: dataItem.status !=MessageStatus.PUBLISHED ? "block" : "none" }
        },
        {
            action: `Archive`,
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: `faArchive`,
            cssStyle: { display: dataItem.status==MessageStatus.PUBLISHED ? "block" : "none" }
        },
    ];
    return defaultActions;
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
                                <label className='mb-0'>Message :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.msgDesc || '-'}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};