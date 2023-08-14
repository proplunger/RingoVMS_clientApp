import * as React from "react";
import { GridCell, GridHeaderCell } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { faPlusCircle, faTrash, faPencilAlt, faSave, faUndo, faPlus, faFileExcel, faTimesCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";



export function CustomHeaderActionCell({ add, ExportMenu, criteriaId }) {
    return class extends GridHeaderCell {
        handleHeaderMenuClick = (actionValue: number) => {
            console.log("Action Taken " + actionValue);
        };
 
        render() {
            const contentAddRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => add(props.dataItem)}>
                        <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"} />
                        Add Criteria
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
                        <MenuItem render={ExportMenu} disabled={criteriaId ? false : true}/> 
                    </MenuItem>
                </Menu>
            );

        }
    };
}

export function MyCommandCell({ edit, remove,  update,  cancel, editField, add, discard, inactive }) {
  return class extends GridCell {
    render() {
  const { dataItem, dataIndex } = this.props;
  const inEdit = dataItem[editField];
  const isNewItem = dataItem.id ==undefined;
  return inEdit ? (
      <td className="k-command-cell  k-command-cell-icon" contextMenu="Action">
       <div className="txt-clr-blue">
        <span
        className={"font-medium"+ ((dataItem.name && dataItem.name.trim() && dataItem.name.length <= 100)  ? " " : " disable-opacity")}
        style={{ marginRight: "12px", cursor: "pointer" }}
        title={isNewItem ? "Add" : "Update"}
        onClick={() => (isNewItem ? add(dataItem, dataIndex) : update(dataItem))}
      >
        <FontAwesomeIcon icon={isNewItem ? faSave : faSave} />
        {/* {isNewItem ? "Add" : "Update"} */}
      </span>
      <span
        className="font-medium "
        style={{ paddingRight: "12px", cursor: "pointer" }}
        title={isNewItem ? "Discard" : "Cancel"}
        onClick={() => (isNewItem ? discard(dataItem) : cancel(dataItem))}
      >
        <FontAwesomeIcon icon={isNewItem ? faTrash : faUndo} />
        {/* {isNewItem ? "Discard" : "Cancel"} */}
      </span>
      {/* {isNewItem && dataItem.status=="Draft" ? null  :
        <span
        className={"font-medium" }
        style={{ paddingRight: "12px", cursor: "pointer" }}
        title={dataItem.status=="Active" ? "Inactivate" : "Activate"}
        onClick={() => (dataItem.status=="Active" ? inactive(dataItem,0) : inactive(dataItem,1))}
      >
        <FontAwesomeIcon icon={dataItem.status=="Active" ? faTimesCircle : faCheckCircle} />
      </span>
    } */}
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
      {/* {isNewItem && dataItem.status=="Draft" ? null :
      <span
        className={"font-medium" }
        style={{ paddingRight: "12px", cursor: "pointer" }}
        title={dataItem.status=="Active" ? "Inactivate" : "Activate"}
        onClick={() => (dataItem.status=="Active" ? inactive(dataItem,0) : inactive(dataItem,1))}
      >
        <FontAwesomeIcon icon={dataItem.status=="Active" ? faTimesCircle : faCheckCircle} />
      </span>} */}
      </div>
    </td>
      );
    }
  };
}


