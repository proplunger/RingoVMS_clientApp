import * as React from "react";
import auth from "../../../../Auth";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../../../Shared/GridComponents/CommonComponents";
import { ReqStatus } from "../../../../Shared/AppConstants";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { dateFormatter } from "../../../../../HelperMethods";
import { history} from "../../../../../HelperMethods";

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
        filename="Manage Onboarding Configuration"
    >
        <ExcelSheet data={data} name="Manage Onboarding Configuration">
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Tags" value="tags" />
            <ExcelColumn label="Created Date" value={(col) => col.createdDate ? dateFormatter(col.createdDate) : ""} />
            <ExcelColumn label="Created By" value="createdBy" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddOnboardingProfile = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick = {() => history.push('/admin/onboarding/create')}>    
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add Onboarding Profile{" "}
        </div>
    );
};

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
            {auth.hasPermissionV2(AppPermissions.ADMIN_ONBOARD_TASK_CREATE) && <MenuItem render={() => AddOnboardingProfile()} />}
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
            permCode: AppPermissions.ADMIN_ONBOARD_TASK_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/admin/onboarding/edit/${dataItem.taskProfileGroupId}`,
        },
        {
            action: "Remove",
            permCode: AppPermissions.ADMIN_ONBOARD_TASK_DELETE,
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
    ];
    return defaultActions;
}