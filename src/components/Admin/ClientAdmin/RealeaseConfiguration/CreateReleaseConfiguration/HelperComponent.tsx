import React from "react";
import { GridCell, GridHeaderCell, GridDetailRow } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuItem } from '@progress/kendo-react-layout';
import {
    faPlusCircle,
    faTrash,
    faPencilAlt,
    faSave,
    faUndo
} from "@fortawesome/free-solid-svg-icons";

export function CustomHeaderActionCell({ add }) {

    return class extends GridHeaderCell {

        handleHeaderMenuClick = (actionValue: number) => {
            console.log("Action Taken " + actionValue);
            // GlobalActionClick(1);
            //history.push(`/EditOrder/${dataItem.orderid}`);
        }

        render() {
            const contentAddRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => add(props.dataItem)}><FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"} />Add New Release</div>
                );
            };


            // const contentRemoveRender = (props) => {
            //     return (
            //         <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => removeSelected(props.dataItem)}><FontAwesomeIcon icon={faTrash} className={"nonactive-icon-color ml-2 mr-2"} />Remove Selected</div>
            //     );
            // };

            const menuRender = (props) => {
                return (
                    <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}
                    ></span>
                );
            };

            return (
                <Menu openOnClick={true} className="actionItemMenu" >
                    <MenuItem render={menuRender} key={"parentMenu"} >
                        <MenuItem render={contentAddRender} key={"addBtn"} />
                        {/* <MenuItem render={contentRemoveRender} key={"removeBtn"} /> */}
                    </MenuItem>
                </Menu>
            );
        }
    };
}

export function MyCommandCell({ edit, remove, add, update, discard, cancel, editField }) {
    return class extends GridCell {
        render() {
            const { dataItem } = this.props;
            const inEdit = dataItem[editField];
            const isNewItem = dataItem.releaseId ==undefined;

            return inEdit ? (
                <td className="k-command-cell  k-command-cell-icon" contextMenu="Action">
                    <div className="txt-clr-blue">
                        {isNewItem && <span className="font-medium" style={{ paddingRight: "5px", cursor: "pointer" }} title={'Update'} onClick={() => update(dataItem)}>
                            <FontAwesomeIcon icon={faSave} />
                        </span>}
                        <span className="font-medium" style={{ paddingRight: "5px", cursor: "pointer" }} title={isNewItem ? 'Discard' : 'Cancel'} onClick={() => isNewItem ? discard(dataItem) : cancel(dataItem)}>
                            <FontAwesomeIcon icon={isNewItem ? faTrash : faUndo} />
                        </span>
                    </div>
                </td>
            ) : (
                    <td className="k-command-cell k-command-cell-icon">
                        <div className="txt-clr-blue">
                            <span className="font-medium" style={{ paddingRight: "5px", cursor: "pointer" }} title='Edit' onClick={() => edit(dataItem)}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                            <span className="font-medium" style={{ paddingRight: "5px", cursor: "pointer"}} title='Remove' onClick={() => remove(dataItem)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                        </div>
                    </td>
                );
        }
    }
};