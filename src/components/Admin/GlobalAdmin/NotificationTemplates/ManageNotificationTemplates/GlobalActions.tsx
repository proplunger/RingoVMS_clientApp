import * as React from "react";
import auth from "../../../../Auth";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { history } from "../../../../../HelperMethods";
import { MenuRender } from "../../../../Shared/GridComponents/CommonComponents";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { CREATE_NOTIFICATION } from "../../../../Shared/ApiUrls";

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
        filename="Manage Notifications"
    >
        <ExcelSheet data={data} name="Manage Notifications">
            <ExcelColumn label="Notification" value="notificationType" />
            <ExcelColumn label="Category" value="notificationCategory" />
            <ExcelColumn label="Subject" value="subject" />
            {/* <ExcelColumn label="Status" value="status" /> */}
        </ExcelSheet>
    </ExcelFile>
);

// export const AddNewNotification = () => {
//     return (
//         <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => history.push(CREATE_NOTIFICATION)}>
//             <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Notification{" "}
//         </div>
//     );
// };

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
            {/* {auth.hasPermissionV2(AppPermissions.NOTIFICATION_TEMPLATE_CREATE) && <MenuItem render={() => AddNewNotification()} />} */}
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
            permCode: AppPermissions.NOTIFICATION_TEMPLATE_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/admin/notification/edit/${dataItem.notificationTemplateId}`
        },
        // {
        //     action: `${dataItem.status=="Active" ? "Deactivate" : "Activate"}`,
        //     permCode: AppPermissions.NOTIFICATION_TEMPLATE_DELETE, 
        //     nextState: "",
        //     icon: `${dataItem.status=="Active"?"faTimesCircle":"faCheckCircle"}`,
        // },
        // {
        //     action: "Delete",
        //     permCode: AppPermissions.NOTIFICATION_TEMPLATE_DELETE,
        //     nextState: "",
        //     icon: "faTrashAlt",
        // }
    ];
    return defaultActions;
}