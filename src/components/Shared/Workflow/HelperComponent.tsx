import * as React from "react";
import { GridCell, GridHeaderCell } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { faPlusCircle, faTrash, faPencilAlt, faSave, faUndo, faPlus } from "@fortawesome/free-solid-svg-icons";


//export function CustomHeaderActionCell({ add, removeSelected, canRemove, resetChanges }) {
export function CustomHeaderActionCell({ add }) {
    return class extends GridHeaderCell {
        handleHeaderMenuClick = (actionValue: number) => {
            console.log("Action Taken " + actionValue);
            // GlobalActionClick(1);
            //history.push(`/EditOrder/${dataItem.orderid}`);
        };
 
        render() {
            const contentAddRender = (props) => {
                console.log("props from approval grid", props)
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => add(props.dataItem)}>
                        <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"} />
                        Add New Transition
                    </div>
                );
            };

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


export function MyCommandCell({ edit, remove,  update,  cancel, editField, add, discard }) {
  return class extends GridCell {
    render() {
  const { dataItem } = this.props;
  const inEdit = dataItem[editField];
  const isNewItem = dataItem.transitionId ==undefined;
  
  return inEdit ? (
      <td className="k-command-cell  k-command-cell-icon" contextMenu="Action">
       <div className="txt-clr-blue">
        <span
        className="font-medium"
        style={{ paddingRight: "12px", cursor: "pointer" }}
        title={isNewItem ? "Add" : "Update"}
        onClick={() => (isNewItem ? add(dataItem) : update(dataItem))}
      >
        <FontAwesomeIcon icon={isNewItem ? faPlus : faSave} />
        {/* {isNewItem ? "Add" : "Update"} */}
      </span>
      <span
        className="font-medium"
        style={{ paddingRight: "5px", cursor: "pointer" }}
        title={isNewItem ? "Discard" : "Cancel"}
        onClick={() => (isNewItem ? discard(dataItem) : cancel(dataItem))}
      >
        <FontAwesomeIcon icon={isNewItem ? faTrash : faUndo} />
        {/* {isNewItem ? "Discard" : "Cancel"} */}
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
        style={{ paddingRight: "5px", cursor: "pointer" }}
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
