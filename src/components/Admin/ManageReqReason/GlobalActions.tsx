import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faFileExcel,
    faFileImport,
    faColumns,
    faDownload,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import {MenuRender } from "../../Shared/GridComponents/CommonComponents";
import { ReqStatus } from "../../Shared/AppConstants";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

export const ExportExcel = () => {
    return (
    <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
    );
};

export const Columns = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons">
            <FontAwesomeIcon icon={faColumns} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Columns{" "}
        </div>
    );
};

export const Import = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons">
            <FontAwesomeIcon icon={faFileImport} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Import{" "}
        </div>
    );
};

export const DownloadTemplate = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons">
            <FontAwesomeIcon icon={faDownload} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Download Template{" "}
        </div>
    );
};

export const RemoveSelected = (Remove) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick = {Remove}>
            <FontAwesomeIcon icon={faTrashAlt} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Remove Selected{" "}
        </div>
    );
};

export const AddReqReason = (Add) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick = {Add}>
            
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add Reason{" "}
        </div>
    );
};

export const CustomMenu = (excelData , Add, Remove) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                <MenuItem render={() => AddReqReason(Add)} />
                <MenuItem render={Import} disabled/>
                <MenuItem render={DownloadTemplate} disabled />
                <MenuItem render={() => RemoveSelected(Remove)}/>
                <MenuItem render={ExportExcel} disabled/>
                <MenuItem render={Columns} disabled/>
            </MenuItem>
        </Menu>
    );
};


export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Edit",
            controllerName: "Requisition",
            methodName: "DuplicateRequisition", 
            nextState: "",
            icon: "faPencilAlt",
        },
        {
            action: "Remove",
            controllerName: "Requisition",
            methodName: "GetRequisition",
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
    ];
    return defaultActions;
}

