import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuRender } from "../../Shared/GridComponents/CommonComponents";
import ReactExport from "react-data-export";
import {
    faPlusCircle,
    faFileExcel,
    faList,
} from "@fortawesome/free-solid-svg-icons";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
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
        filename="OwnerShip History"
    >
        <ExcelSheet data={data} name="Manage Divisions">
            <ExcelColumn label="Requisition#" value="reqNumber" />
            <ExcelColumn label="Submitted By Vendor" value="submittedVendorName" />
            <ExcelColumn label="Ownership Type" value="ownershipType" />
            <ExcelColumn label="Ownership Date" value="ownershipDate" />
            <ExcelColumn label="Ownership Days" value="ownershipDays" />
            <ExcelColumn label="Ownership Expiration" value="expirationDate" />
            <ExcelColumn label="Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
);

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                <MenuItem render={() => ExportExcel(excelData)} />
            </MenuItem>
        </Menu>
    );
};

export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "End Ownership",
            permCode: AppPermissions.CAND_OWNERSHIP_END,
            nextState: "",
            icon: "faTimes",
            cssStyle: { display: dataItem.status=="Active" ? "block" : "none" }
        }
    ];
    return defaultActions;
}