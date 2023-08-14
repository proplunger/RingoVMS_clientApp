import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faEye,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  GridHeaderCell,
} from "@progress/kendo-react-grid";
import auth from "../../../Auth";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import { CandSubStatusIds } from "../../../Shared/AppConstants";

export function CustomHeaderActionCell(
  AddNewTask,
  underReview,
  Approve,
  isApproveSelected,
  isUnderReviewSelected,
  isVendorRole,
  statusIntId) {
  return class extends GridHeaderCell {
    handleHeaderMenuClick = () => {
      AddNewTask();
    };

    render() {
      const contentApproveRender = (props) => {
        return (
          <div
            className="pb-1 pt-1 w-100 myorderGlobalicons"
            onClick={() => this.handleHeaderMenuClick()}
          >
            <FontAwesomeIcon
              icon={faPlusCircle}
              className={"nonactive-icon-color ml-2 mr-2"}
            />
            Add New
          </div>
        );
      };
      const underReviewRender = (props) => {
        return (
          <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={underReview}>
            <FontAwesomeIcon
              icon={faEye}
              className={"nonactive-icon-color ml-2 mr-2"}
            />
            Under Review
          </div>
        );
      };
      const TaskApproveRender = () => {
        return (
          <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={Approve}>
            <FontAwesomeIcon
              icon={faThumbsUp}
              className={"nonactive-icon-color ml-2 mr-2"}
            />
            Approve Selected
          </div>
        );
      };

      const menuRender = () => {
        return (
          <span
            className="k-icon k-i-more-horizontal"
            style={{ color: "white" }}
          ></span>
        );
      };
      return (
        <Menu
          openOnClick={true}
          className="actionItemMenu actionItemMenuThreeDots"
        >
          <MenuItem render={menuRender} key={"parentMenu"}>
            {auth.hasPermissionV2(AppPermissions.CAND_ONBOARD_TASK_UPDATE) &&
              !isVendorRole &&
              statusIntId < CandSubStatusIds.ASSIGNMENTCREATED && (
                <MenuItem render={contentApproveRender} key={"approveBtn"} />
              )}
            {auth.hasPermissionV2(AppPermissions.CAND_ONBOARD_TASK_UPDATE) &&
              !isVendorRole &&
              statusIntId < CandSubStatusIds.ASSIGNMENTCREATED && (
                <MenuItem
                  render={underReviewRender}
                  key={"approveBtn"}
                  disabled={!isUnderReviewSelected}
                />
              )}
            {auth.hasPermissionV2(AppPermissions.CAND_ONBOARD_TASK_UPDATE) &&
              !isVendorRole &&
              statusIntId < CandSubStatusIds.ASSIGNMENTCREATED && (
                <MenuItem
                  render={TaskApproveRender}
                  key={"approveBtn"}
                  disabled={!isApproveSelected}
                />
              )}
          </MenuItem>
        </Menu>
      );
    }
  };
}
