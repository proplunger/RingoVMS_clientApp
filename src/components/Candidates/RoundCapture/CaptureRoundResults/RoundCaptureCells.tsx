import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faPencilAlt,
  faTrash,
  faUndo,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  GridCell,
  GridHeaderCell,
} from "@progress/kendo-react-grid";

export function CustomHeaderActionCell({ AddCriteria, checkStatus }) {
  return class extends GridHeaderCell {
    handleHeaderMenuClick = (dataItem) => {
      AddCriteria(dataItem);
    };

    render() {
      const contentApproveRender = (props) => {
        return (
          <div
            className="pb-1 pt-1 w-100 myorderGlobalicons"
            onClick={() => this.handleHeaderMenuClick(props.dataItem)}
          >
            <FontAwesomeIcon
              icon={faPlusCircle}
              className={"nonactive-icon-color mr-2"}
            />
            Add Criteria
          </div>
        );
      };

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
          key={checkStatus}
          openOnClick={true}
          className="actionItemMenu actionItemMenuThreeDots"
        >
          <MenuItem render={menuRender} key={"parentMenu"}>
            {checkStatus && (
              <MenuItem render={contentApproveRender} key={"approveBtn"} />
            )}
          </MenuItem>
        </Menu>
      );
    }
  };
}

export function MyCommandCell({
  edit,
  remove,
  add,
  update,
  discard,
  cancel,
  editField,
  checkStatus,
}) {
  return class extends GridCell {
    render() {
      const { dataItem } = this.props;
      const inEdit = dataItem[editField];
      const isNewItem = dataItem.candSubInterviewResultId ==undefined;
      return inEdit ? 
        <td key={checkStatus} contextMenu="Action" className="k-command-cell">
          {checkStatus && 
            <div className="my-task-desciption-not">
              <button
                disabled={
                  (dataItem.rating ==undefined || dataItem.rating ==null || dataItem.rating =="" || dataItem.ratingId ==null) ||
                  (dataItem.criteria ==undefined || dataItem.criteria ==null || dataItem.criteria =="")
                    ? true
                    : false
                }
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
                  <FontAwesomeIcon icon={faTimes} color={"#4987ec"} />
                 : 
                  <FontAwesomeIcon icon={faUndo} color={"#4987ec"} />
                }
              </button>
            </div>
          }
        </td>
       : 
        <td className="k-command-cell" contextMenu="Action">
          {checkStatus && 
            <div className="my-task-desciption">
              <button
                className="k-primary k-button k-grid-edit-command round-capture-editbtn"
                onClick={() => edit(dataItem)}
              >
                <FontAwesomeIcon icon={faPencilAlt} color={"#4987ec"} />
              </button>
              <button
                className="k-button border-none k-grid-remove-command round-capture-deletebtn"
                onClick={() =>
                  remove(dataItem)
                }
              >
                <FontAwesomeIcon icon={faTrash} color={"#4987ec"} />
              </button>
            </div>
          }
        </td>
      ;
    }
  };
}

