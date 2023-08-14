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
import { MenuRender } from "../../../Shared/GridComponents/CommonComponents";
import { ReqStatus, roleTypeName } from "../../../Shared/AppConstants";
import { dateFormatter, history } from "../../../../HelperMethods";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import { CREATE_ROLES } from "../../../Shared/ApiUrls";
import auth from "../../../Auth";

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
        filename="Manage Role"
    >
        <ExcelSheet data={data} name="Manage Role">
            <ExcelColumn label="User Type" value={(value) => roleTypeName(value.roleType)} />
            <ExcelColumn label="Role" value="name" />
            <ExcelColumn label="Description" value="description" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddNewRole = (Add) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => history.push(CREATE_ROLES)}>

            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Role{" "}
        </div>
    );
};


export const CustomMenu = (excelData, Add, Remove?) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
            {auth.hasPermissionV2(AppPermissions.AUTHENTICATED) && <MenuItem render={() => AddNewRole(Add)} /> }
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
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/admin/role/edit/${dataItem.id}`,
        },
        {
            action: "Copy",
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: "faCopy",
        },
        {
            action: "Delete",
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
        {
            action: "Users",
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: "faUserPlus",
            linkUrl: `/admin/users/role/${dataItem.id}`
        }

    ];
    return defaultActions;
}

