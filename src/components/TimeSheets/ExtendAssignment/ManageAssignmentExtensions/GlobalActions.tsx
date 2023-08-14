import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faList } from "@fortawesome/free-solid-svg-icons";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { MenuRender } from "../../../Shared/GridComponents/CommonComponents";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import auth from "../../../Auth";
import { AuthRoleType, CandSubStatusIds, ExtensionStatuses, isRoleType } from "../../../Shared/AppConstants";

export const RequestExtension = (extension) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={extension}>
            <FontAwesomeIcon icon={faExpand} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Request for Extension{" "}
        </div>
    );
};

export const CustomMenu = (extension, statusIntId) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                {(CandSubStatusIds.ASSIGNMENTINPROGRESS==statusIntId || CandSubStatusIds.ASSIGNMENTEXTENDED==statusIntId) && auth.hasPermissionV2(AppPermissions.ASSIGNMENT_EXTEND_REQUEST) && (
                    <MenuItem render={() => RequestExtension(extension)} />)}
            </MenuItem>
        </Menu>
    );
};

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

export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Edit",
            permCode: AppPermissions.ASSIGNMENT_EXTEND_REQUEST,
            nextState: "",
            icon: "faPencilAlt",
            cssStyle: { display: dataItem.status==ExtensionStatuses.PENDINGAPPROVAL ? "block" : "none" },
            linkUrl: `/candsub/${dataItem.candSubmissionId}/extassignment/${dataItem.candSubExtId}/edit`,
        },
        {
            action: "View",
            permCode: AppPermissions.ASSIGNMENT_EXTEND_VIEW,
            nextState: "",
            icon: "faEye",
            cssStyle: { display: (dataItem.status==ExtensionStatuses.APPROVED || dataItem.status==ExtensionStatuses.REJECTED || isRoleType(AuthRoleType.Client)) ? "block" : "none" },
            linkUrl: `/candsub/${dataItem.candSubmissionId}/extassignment/${dataItem.candSubExtId}/view`,
        },
        {
            action: "Extension History",
            permCode: AppPermissions.ASSIGNMENT_EXTEND_VIEW,
            nextState: "",
            icon: "faHistory",
        },
    ];
    return defaultActions;
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
            <div className="col-12 col-lg-12 text-dark">
                <div className="row ml-0 mr-0 mt-1">
                    <div className="col-12 pl-0 text-right">
                    </div>
                </div>
            </div>
        </div>
    );
};
