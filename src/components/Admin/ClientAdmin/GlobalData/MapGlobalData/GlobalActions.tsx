import * as React from "react";
import auth from "../../../../Auth";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../../../Shared/GridComponents/CommonComponents";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";

export const MapAssignmentTypes = (Map) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick = {Map}>
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Map Assignment Types{" "}
        </div>
    );
};

export const MapRequisitionReasons = (Map) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick = {Map}>
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Map Requisition Reasons{" "}
        </div>
    );
};

export const CustomMenu = (Map) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
            {auth.hasPermissionV2(AppPermissions.ADMIN_CLIENT_VIEW) && <MenuItem render={() => MapAssignmentTypes(Map)} />}
            </MenuItem>
        </Menu>
    );
};

export const ReqCustomMenu = (Map) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
            {auth.hasPermissionV2(AppPermissions.ADMIN_CLIENT_VIEW) && <MenuItem render={() => MapRequisitionReasons(Map)} />}
            </MenuItem>
        </Menu>
    );
};

export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Unmap",
            permCode: AppPermissions.ADMIN_CLIENT_VIEW,
            nextState: "",
            icon: "faTrashAlt",
        },
    ];
    return defaultActions;
}
