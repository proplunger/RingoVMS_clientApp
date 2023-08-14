import React from "react";
import { GridCell, GridHeaderCell, GridDetailRow } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { faPlusCircle, faTrash, faPencilAlt, faSave, faUndo } from "@fortawesome/free-solid-svg-icons";

export function CustomHeaderActionCell({ add, canAdd, removeSelected, canRemove, resetChanges }) {
    return class extends GridHeaderCell {
        handleHeaderMenuClick = (actionValue: number) => {
            console.log("Action Taken " + actionValue);
            // GlobalActionClick(1);
            //history.push(`/EditOrder/${dataItem.orderid}`);
        };

        render() {
            const contentAddRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => add(props.dataItem)}>
                        <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"} />
                        Add New Level
                    </div>
                );
            };

            const contentRemoveRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => removeSelected(props.dataItem)}>
                        <FontAwesomeIcon icon={faTrash} className={"nonactive-icon-color ml-2 mr-2"} />
                        Remove Selected
                    </div>
                );
            };

            const contentResetRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => resetChanges()}>
                        <FontAwesomeIcon icon={faUndo} className={"nonactive-icon-color ml-2 mr-2"} />
                        Reset
                    </div>
                );
            };

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}></span>;
            };

            return (
                <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
                    <MenuItem render={menuRender} key={"parentMenu"}>
                        <MenuItem disabled={!canAdd} render={contentAddRender} key={"addBtn"} />
                        <MenuItem disabled={!canRemove} render={contentRemoveRender} key={"removeBtn"} />
                        <MenuItem render={contentResetRender} key={"resetBtn"} />
                    </MenuItem>
                </Menu>
            );
        }
    };
}

export function MyCommandCell({ edit, remove, add, update, discard, cancel, editField, canEdit, canEditDefault, disableActiveLevel }) {
    return class extends GridCell {
        render() {
            const { dataItem } = this.props;
            const inEdit = dataItem[editField];
            const isNewItem = dataItem.wfApprovalLevelId ==undefined;
            return inEdit ? (
                <td className="k-command-cell  k-command-cell-icon" contextMenu="Action">
                    <div className="txt-clr-blue">
                        <span
                            className={"font-medium " + (dataItem.role && dataItem.approverIds ? " " : "disable-opacity")}
                            style={{ paddingRight: "12px", cursor: "pointer" }}
                            title={"Update"}
                            onClick={() => update(dataItem)}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </span>
                        <span
                            className="font-medium"
                            style={{ paddingRight: "5px", cursor: "pointer" }}
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
                        <span className={"font-medium " + ((disableActiveLevel && dataItem.isLevelActive !=null) ? "disable-opacity" : "")} style={{ paddingRight: "12px", cursor: "pointer" }} title="Edit" onClick={() => edit(dataItem)}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                        <span
                            key={dataItem.order}
                            className={"font-medium " + (((!canEditDefault && dataItem.isDefault) || (disableActiveLevel && dataItem.isLevelActive !=null)) ? "disable-opacity" : "")}
                            style={{ paddingRight: "5px", cursor: "pointer" }}
                            title="Remove"
                            onClick={() => remove(dataItem)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                    </div>
                </td>
            );
        }
    };
}
