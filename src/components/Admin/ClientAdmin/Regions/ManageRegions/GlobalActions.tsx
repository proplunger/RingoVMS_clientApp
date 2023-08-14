import * as React from "react";
import auth from "../../../../Auth";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faFileExcel,
    faList,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../../../Shared/GridComponents/CommonComponents";
import { ReqStatus } from "../../../../Shared/AppConstants";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { dateFormatter } from "../../../../../HelperMethods";
import { GridDetailRow } from "@progress/kendo-react-grid";

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
        filename="Manage Regions"
    >
        <ExcelSheet data={data} name="Manage Regions">
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Zone" value="zone" />
            <ExcelColumn label="Region" value="name" />
            <ExcelColumn label="Description" value="description" />
            <ExcelColumn label="Created Date" value={(col) => col.createdDate ? dateFormatter(col.createdDate) : ""} />
            <ExcelColumn label="Created By" value="createdByName" />
            <ExcelColumn label="Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddNewRegion = (Add) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick = {Add}>
            
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Region{" "}
        </div>
    );
};

export const CustomMenu = (excelData , Add) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
            {auth.hasPermissionV2(AppPermissions.CLIENT_DIV_CREATE) && <MenuItem render={() => AddNewRegion(Add)} />}
                <MenuItem render={() => ExportExcel(excelData)} />
            </MenuItem>
        </Menu>
    );
};


export function DefaultActions(props, clientId) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Edit",
            permCode: AppPermissions.CLIENT_REGION_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
        },
        {
            action: "Remove",
            permCode: AppPermissions.CLIENT_REGION_DELETE,
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
        {
            action: "Manage Divisions",
            permCode: AppPermissions.CLIENT_DIV_UPDATE,
            nextState: "",
            icon: "faMapMarkerAlt",
            linkUrl: `/admin/client/${clientId}/region/${dataItem.id}/divisions?name=${dataItem.client}`,
        }, 
        {
            action: `${dataItem.status=="Active" ? "Inactivate" : "Activate"}`,
            permCode: AppPermissions.CLIENT_REGION_DELETE, 
            nextState: "",
            icon: `${dataItem.status=="Active"?"faTimesCircle":"faCheckCircle"}`,
        },
    ];
    return defaultActions;
}