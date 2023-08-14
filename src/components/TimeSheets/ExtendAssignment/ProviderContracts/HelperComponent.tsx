import * as React from "react";
import { GridCell, GridHeaderCell } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { faPlusCircle, faTrash, faPencilAlt, faSave, faUndo } from "@fortawesome/free-solid-svg-icons";
import { ServiceCategory } from "../../../Shared/AppConstants";

export function CustomHeaderActionCell({ add }) {
  return class extends GridHeaderCell {
    handleHeaderMenuClick = (actionValue: number) => {
      console.log("Action Taken " + actionValue);
    };

    render() {
      const contentAddRender = (props) => {
        return (
          <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => add(props.dataItem)}>
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add Bill Rate{" "}
          </div>
        );
      }

      const menuRender = (props) => {
        return <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}></span>;
      };

      return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
          <MenuItem render={menuRender} key={"parentMenu"}>
            <MenuItem render={contentAddRender} key={"addBtn"} />
          </MenuItem>
        </Menu>
      );

    }
  };
}


export function MyCommandCell({ edit, remove, update, cancel, editField, add, discard }) {
  return class extends GridCell {
    render() {
      const { dataItem, dataIndex } = this.props;
      const inEdit = dataItem[editField];
      const isNewItem = dataItem.subBillRateId ==undefined;
      return inEdit ? (
        <td className="k-command-cell  k-command-cell-icon" contextMenu="Action">
          <div className="txt-clr-blue">
            <span
              className={"font-medium" + (dataItem.serviceCategory==ServiceCategory.EXPENSE ? (dataItem.gridBillRate && dataItem.gridBillRate > 0) && (dataItem.serviceCatId && dataItem.serviceCatId != null) && (dataItem.serviceTypeId && dataItem.serviceTypeId != null) ? " " : " disable-opacity" : (dataItem.gridBillRate && dataItem.gridBillRate > 0) && (dataItem.gridHolidayBillRate && dataItem.gridHolidayBillRate > 0) && (dataItem.serviceCatId && dataItem.serviceCatId != null) && (dataItem.serviceTypeId && dataItem.serviceTypeId != null) ? " " : " disable-opacity")}
              style={{ marginRight: "12px", cursor: "pointer" }}
              title={isNewItem ? "Add" : "Update"}
              onClick={() => (isNewItem ? add(dataItem, dataIndex) : update(dataItem))}
            >
              <FontAwesomeIcon icon={isNewItem ? faSave : faSave} />
            </span>
            <span
              className="font-medium "
              style={{ paddingRight: "12px", cursor: "pointer" }}
              title={isNewItem ? "Discard" : "Cancel"}
              onClick={() => (isNewItem ? discard(dataItem) : cancel(dataItem))}
            >
              <FontAwesomeIcon icon={isNewItem ? faTrash : faUndo} />
            </span>
          </div>
        </td>
      ) : (
        <td className="k-command-cell k-command-cell-icon" contextMenu="Action">
          <div className="txt-clr-blue">
            <span
              className="font-medium"
              style={{ paddingRight: "12px", cursor: "pointer" }}
              onClick={() => edit(dataItem)}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </span>
            <span
              className="font-medium"
              style={{ paddingRight: "12px", cursor: "pointer" }}
              onClick={() => remove(dataItem)
              }
            >
              <FontAwesomeIcon icon={faTrash} />
            </span>
          </div>
        </td>
      );
    }
  };
}