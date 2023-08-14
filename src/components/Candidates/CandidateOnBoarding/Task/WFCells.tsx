import {
  faSave,
  faTrashAlt,
  faUndo,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GridCell, GridHeaderCell } from "@progress/kendo-react-grid";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import React from "react";
import { CandSubOnBoardTaskStatusIds, isAssignmentInProgress, TaskActions } from "../../../Shared/AppConstants";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import RowActions from "../../../Shared/Workflow/RowActions";

export function DefaultActions(dataItem, isVendorRole, statusIntId) {
  var defaultActions = [
    {
      action: "Edit",
      permCode: AppPermissions.CAND_ONBOARD_TASK_UPDATE,
      nextState: "",
      icon: "faPencilAlt",
      cssStyle: {
        display:
          dataItem.statusIntId ==
            CandSubOnBoardTaskStatusIds.PENDINGSUBMISSION ||
          dataItem.statusIntId ==
            CandSubOnBoardTaskStatusIds.SENTBACK ||
            isAssignmentInProgress(statusIntId) ||
          (!isVendorRole &&
            dataItem.statusIntId==CandSubOnBoardTaskStatusIds.SUBMITTED)
            ? "block"
            : "none",
      },
    },
    {
      action: TaskActions.UNDERREVIEW,
      permCode: AppPermissions.CAND_ONBOARD_TASK_UNDER_REVIEW,
      nextState: "",
      icon: "faEye",
      cssStyle: {
        display:
          !isVendorRole &&
            dataItem.statusIntId==CandSubOnBoardTaskStatusIds.SUBMITTED
            ? "block"
            : "none",
      },
    },
    {
      action: TaskActions.APPROVE,
      permCode: AppPermissions.CAND_ONBOARD_TASK_APPROVE,
      nextState: "",
      icon: "faThumbsUp",
      cssStyle: {
        display:
          !isVendorRole &&
            dataItem.statusIntId==CandSubOnBoardTaskStatusIds.UNDERREVIEW
            ? "block"
            : "none",
      },
    },
    {
      action: "Remove",
      permCode: AppPermissions.CAND_ONBOARD_TASK_DELETE,
      nextState: "",
      icon: "faTrashAlt",
      cssStyle: {
        display:
          !isVendorRole &&
            dataItem.statusIntId !=CandSubOnBoardTaskStatusIds.UNDERREVIEW &&
            dataItem.statusIntId !=CandSubOnBoardTaskStatusIds.APPROVED && dataItem.isMandatory != true
            ? "block"
            : "none",
      },
    },
    {
      action: "Submit",
      permCode: AppPermissions.CAND_ONBOARD_SUBMIT,
      nextState: "",
      icon: "faSave",
      cssStyle: {
        display:
          !isVendorRole &&
            (dataItem.statusIntId ==
            CandSubOnBoardTaskStatusIds.PENDINGSUBMISSION || 
            dataItem.statusIntId ==
            CandSubOnBoardTaskStatusIds.SENTBACK) &&
            //dataItem.candDocuments.length > 0
            (dataItem.isDocumentMandatory && dataItem.candDocuments.length > 0 || dataItem.isValidity && dataItem.validFrom || dataItem.isValidToMandatory && dataItem.validTo
              || (dataItem.isDocumentMandatory==false && dataItem.isValidity==false && dataItem.isValidToMandatory==false && (dataItem.candDocuments.length > 0 || dataItem.validFrom || dataItem.validTo)))
            ? "block"
            : "none",
      },
    },
    {
      action: "History",
      permCode: AppPermissions.CAND_ONBOARD_TASK_VIEW,
      nextState: "",
      icon: "faHistory",
      cssStyle: {
        display:"block",
      },
    },
  ];
  return defaultActions;
}

export function MyCommandCell({
  upload,
  add,
  update,
  discard,
  cancel,
  editField,
  checkStatus,
  candSubmissionId,
  handleActionClick,
  deleteNew,
  isVendorRole,
  warning,
  statusIntId, 
  controlClick,
}) {
  return class extends GridCell {
    // uploadControl: HTMLInputElement;
    // uploadControl2: HTMLInputElement;
    // debugger;
    render() {
      const { dataItem } = this.props;
      // let item=[{}];
      const inEdit = dataItem[editField];
      const isNewItem = dataItem.candSubOnboardingTaskId ==undefined;
      let candDocumentCheck =
        dataItem.candDocuments ==undefined ? [] : dataItem.candDocuments;
      return inEdit ? 
        <td key={checkStatus} contextMenu={"Action"} className="k-command-cell">
          {checkStatus && 
            <div className="my-task-desciption-not">
              <button
                className="k-button k-grid-save-command roundcapture-save"
                onClick={() => (isNewItem ? add(dataItem) : update(dataItem))}
              >
                {isNewItem ? 
                  <FontAwesomeIcon icon={faSave} color={"#4987ec"} />
             : 
                  <FontAwesomeIcon icon={faSave} color={"#4987ec"} />
                }
              </button>
              <button
                className="k-button k-grid-cancel-command roundcapture-undo"
                onClick={() =>
                  isNewItem ? discard(dataItem) : cancel(dataItem)
                }
              >
                {isNewItem ? 
                  <FontAwesomeIcon icon={faUndo} color={"#4987ec"} />
                 : 
                  <FontAwesomeIcon icon={faUndo} color={"#4987ec"} />
                }
              </button>
              {/* <input
                id={ `${Math.random().toString(36)}`}
                type="file"
                onBeforeInputCapture={(e)=>console.log("testsssss", e)}
                onClick={e => console.log("test ", e)}
                multiple={dataItem.isMultipleDoc}
                accept="image/jpeg,image/png,application/pdf,application/doc,application/docx,application/xls,application/xlsx"
                ref={(ref) => (this.uploadControl = ref)}
                style={{ display: "none" }}
                onChange={(e) => {console.log(e, "+++++++++++++++++");upload(e, this.props.dataItem, "document"); return e.target= this.uploadControl2 }}
              /> */}
              {/* <input
                 id={ `${Math.random().toString(36)}`}
                type="file"
                multiple={dataItem.isMultipleDoc}
                accept="image/jpeg,image/png,application/pdf,application/doc,application/docx,application/xls,application/xlsx"
                ref={(ref) => (this.uploadControl2 = ref)}
                style={{ display: "none" }}
                onChange={(e) => upload(e, this.props.dataItem, "document")}
              /> */}
              <button
                className="k-button k-grid-cancel-command roundcapture-undo"
                onClick={() =>
                  dataItem.isMultipleDoc ||
                    dataItem.isMultipleDoc ==undefined ||
                    dataItem.candDocuments ==undefined ||
                    candDocumentCheck.length ==0
                    ? controlClick(this.props.dataItem)
                    : warning()
                }
              >
                {isNewItem ? 
                  <FontAwesomeIcon icon={faUpload} color={"#4987ec"} />
                 : 
                  <FontAwesomeIcon icon={faUpload} color={"#4987ec"} />
                }
              </button>
              {isNewItem && 
                <button
                  className="k-button k-grid-cancel-command roundcapture-undo"
                  onClick={() => deleteNew(dataItem)}
                >
                  
                  <FontAwesomeIcon icon={faTrashAlt} color={"#4987ec"} />
                </button>
              }
            </div>
          }
        </td>
       : 
        <RowActions
          dataItem={dataItem}
          currentState={dataItem.status}
          rowId={candSubmissionId}
          handleClick={handleActionClick}
          defaultActions={DefaultActions(dataItem, isVendorRole, statusIntId)}
        />
      ;
    }
  };
}
export function customeHeaderCell() {
  return class extends GridHeaderCell {
    render() {
      const menuRender = (props) => {
        return (
          <span
            className="k-icon k-i-more-horizontal"
            style={{ color: "white" }}
          ></span>
        );
      };
      return (
        <Menu
          openOnClick={false}
          className="actionItemMenu actionItemMenuThreeDots"
        >
          <MenuItem render={menuRender} key={"parentMenu"}></MenuItem>
        </Menu>
      );
    }
  };
}
