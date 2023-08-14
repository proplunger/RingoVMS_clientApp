import { faFileExcel, faList, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import axios from "axios";
import * as React from "react";
import ReactExport from "react-data-export";
import { dateFormatter, errorToastr, history } from "../../../HelperMethods";
import Auth from "../../Auth";
import { ContentLibStatus } from "../../Shared/AppConstants";
import { NOT_DOWNLOADABLE } from "../../Shared/AppMessages";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export class DetailColumnCell extends React.Component<{ dataItem: any; expandChange: any; rowType: any }> {
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

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Manage Content Library"
    >
        <ExcelSheet data={data} name="Manage Content Library">
            <ExcelColumn label="Title" value="title" />
            <ExcelColumn label="ContentType" value="contentType" />
            <ExcelColumn label="Expiration Date" value={(col) => col.validTo ? dateFormatter(col.validTo) : ""} />
            <ExcelColumn label="Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddNewActionReason = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => history.push('/admin/contentlib/create')}>

            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Content{" "}
        </div>
    );
};

export const MenuRender = (props) => {
    return <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}></span>;
};

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                {Auth.hasPermissionV2(AppPermissions.AUTHENTICATED) &&
                    <MenuItem render={() => AddNewActionReason()} />}
                <MenuItem render={() => ExportExcel(excelData)} />
            </MenuItem>
        </Menu>
    );

};

export class ViewMoreComponent extends GridDetailRow {
    render() {
        const dataItem = this.props.dataItem;
        return <DialogBox {...dataItem} />;
    }
}

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

export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "View",
            permCode: AppPermissions.CONTENT_LIBRARY_VIEW,
            nextState: "",
            icon: "faEye",
            linkUrl: `/admin/contentlib/view/${dataItem.id}`,
        },
        {
            action: "Edit",
            permCode: AppPermissions.CONTENT_LIBRARY_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/admin/contentlib/edit/${dataItem.id}`,
        },
        {
            action: "Delete",
            permCode: AppPermissions.CONTENT_LIBRARY_DELETE,
            nextState: "",
            icon: "faTrashAlt",
        },
        {
            action: `Publish`,
            permCode: AppPermissions.CONTENT_LIBRARY_UPDATE,
            nextState: "",
            icon: "faCheckCircle",
            cssStyle: { display: dataItem.statusIntId !=ContentLibStatus.PUBLISHED ? "block" : "none" }
        },
        {
            action: `Archive`,
            permCode: AppPermissions.CONTENT_LIBRARY_UPDATE,
            nextState: "",
            icon: "faArchive",
            cssStyle: { display: dataItem.statusIntId==ContentLibStatus.PUBLISHED ? "block" : "none" }
        },
        {
            action: "View Events",
            permCode: AppPermissions.EVENT_VIEW,
            nextState: "",
            icon: "faEye",
            linkUrl:`/admin/eventslogs/manage/${dataItem.id}`,
        },

    ];
    return defaultActions;
}

export const DialogBox = (props) => {
    return (
        <div className="row">
            <div className="col-12 col-lg-11 text-dark">
                <div className="row ml-0 mr-0 mt-1">
                    <div className="col-12 pl-0 text-right">
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Attachment:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    <span
                                        title={props.fileName}
                                        onClick={() => downloadFile(props.path)}
                                        className="valid-file"
                                    >
                                        {props.fileName}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}