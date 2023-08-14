import React from "react";
import { GridCell, GridHeaderCell, GridDetailRow } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import loadingImage from '../../../assets/images/loading.gif'
import { faPlusCircle, faTrash, faPencilAlt, faSave, faUndo, faUpload, faEye, faCross, faTimes } from "@fortawesome/free-solid-svg-icons";
import RowActions from "../Workflow/RowActions";
import { AppPermissions } from "../Constants/AppPermissions";
import { CandSubStatusIds, DocStatus, DocType, isAssignmentInProgress } from "../AppConstants";

export function CustomHeaderActionCell({ add, save, removeSelected, canRemove, enableSave }) {
    return class extends GridHeaderCell {
        handleHeaderMenuClick = (actionValue: number) => {
            console.log("Action Taken " + actionValue);
            // GlobalActionClick(1);
            //history.push(`/EditOrder/${dataItem.orderid}`);
        };
        uploadControl: HTMLInputElement;
        contentAddRender = () => {
            return (<div>
                {/* <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,application/pdf,application/doc,application/docx,application/xls,application/xlsx"
                    ref={(ref) => this.uploadControl = ref}
                    style={{ display: 'none' }}
                    onChange={(e) => add(e)}
                /> */}
                <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => { this.uploadControl.click() }}>
                    <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"} />
                    Upload Documents
                </div>
            </div>
            );
        };

        render() {
            const saveAll = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => save()}>
                        <FontAwesomeIcon icon={faSave} className={"nonactive-icon-color ml-2 mr-2"} />
                        Save All
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

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}></span>;
            };

            return (
                <>
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,application/pdf,application/doc, application/docx, application/xls,application/xlsx, .docx, .xlsx, .xls"
                        ref={(ref) => this.uploadControl = ref}
                        style={{ display: 'none' }}
                        onChange={(e) => add(e)}
                    />
                    <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
                        <MenuItem render={menuRender} key={"parentMenu"}>
                            <MenuItem render={this.contentAddRender} key={"addBtn"} />
                            <MenuItem disabled={!enableSave} render={saveAll} key={"saveBtn"} />
                            <MenuItem disabled={!canRemove} render={contentRemoveRender} key={"removeBtn"} />
                        </MenuItem>
                    </Menu>
                </>
            );
        }
    };
}

export function DefaultActions(dataItem, view, candWfStatus, isAdminRole, isClientRole, isVendorRole) {
    var defaultActions = [
        {
            action: "Edit",
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: "faPencilAlt",
            cssStyle: {
                display:
                  dataItem.docType !=DocType.CONFIRMATIONLETTER
                    ? "block"
                    : "none",
              },
        },
        {
            action: "View",
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: "faEye",
        },
        {
            action: "Sign",
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: "faFileSignature",
            cssStyle: {
              display:
                //(dataItem.docType==DocType.CONFIRMATIONLETTER && dataItem.status==DocStatus.ACTIVE && dataItem.description==null && candWfStatus==CandSubStatusIds.PENDINGOFFER) ||
                (dataItem.docType==DocType.CONFIRMATIONLETTER && dataItem.status==DocStatus.CLIENTSIGNED && dataItem.description !=null && candWfStatus==CandSubStatusIds.OFFERSUBMITTED) || 
                (dataItem.docType==DocType.CONFIRMATIONLETTER && dataItem.status==DocStatus.PENDINGSIGNATURE && dataItem.description==null && isAssignmentInProgress(candWfStatus) && (isAdminRole || isClientRole)) || 
                (dataItem.docType==DocType.CONFIRMATIONLETTER && dataItem.status==DocStatus.CLIENTSIGNED && dataItem.description !=null && isAssignmentInProgress(candWfStatus) && (isAdminRole || isVendorRole))
                  ? "block"
                  : "none",
            },
        },
        {
            action: "Show Audit Log",
            permCode: AppPermissions.AUDIT_LOG,
            nextState: "",
            icon: "faHistory",
            cssStyle: {
                display:
                  dataItem.docType==DocType.CONFIRMATIONLETTER && 
                    (dataItem.status !=DocStatus.ACTIVE || dataItem.status !=DocStatus.INACTIVE)
                    ? "block"
                    : "none",
              }
        },
        // {
        //     action: "Inactivate",
        //     permCode: AppPermissions.DEACTIVATE_CONFIRMATION_LETTER,
        //     nextState: "",
        //     icon: "faTimesCircle",
        //     cssStyle: {
        //         display:
        //           dataItem.docType==DocType.CONFIRMATIONLETTER && dataItem.status==DocStatus.EXECUTED
        //             ? "block"
        //             : "none",
        //       }
        // },
    ];
    return defaultActions;
}

export function MyCommandCell({ edit, view, upload, update, discard, deleteDoc, editField, handleActionClick, candidateId, candWfStatus, isAdminRole, isClientRole, isVendorRole }) {
    return class extends GridCell {
        uploadControl: HTMLInputElement;
        render() {
            const { dataItem } = this.props;
            const inEdit = dataItem[editField];
            const isUploading = dataItem.isUploading;
            const isNewItem = dataItem.candDocumentsId ==undefined;
            return isUploading ? <td className="k-command-cell  k-command-cell-icon" contextMenu="Action">
                <img width="40" src={loadingImage}></img>
            </td> : inEdit ? (
                <td className="k-command-cell  k-command-cell-icon" contextMenu="Action">
                    <div className="txt-clr-blue">
                        {/* <input id="myInput"
                        type="file"
                        multiple
                        ref={(ref) => this.uploadControl = ref}
                        style={{display: 'none'}}
                        onChange={(e)=>select(e,dataItem)}
                        />
                        <span
                            //className={"font-medium " + (dataItem.role && dataItem.approverIds ? " " : "disable-opacity")}
                            style={{ paddingRight: "12px", cursor: "pointer" }}
                            title={"Select"}
                            onClick={()=>{this.uploadControl.click()}}
                        >
                            <FontAwesomeIcon icon={faUpload} />
                        </span> */}
                        <span
                            //className={"font-medium " + (dataItem.role && dataItem.approverIds ? " " : "disable-opacity")}
                            style={{ paddingRight: "12px", cursor: "pointer" }}
                            title={"Upload"}
                            onClick={() => dataItem.candDocumentsId==undefined ? upload(dataItem) : update(dataItem)}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </span>
                        <span
                            className="font-medium"
                            style={{ paddingRight: "5px", cursor: "pointer" }}
                            title={isNewItem ? "Discard" : "Delete"}
                            onClick={() => (isNewItem ? discard(dataItem) : deleteDoc(dataItem))}
                        >
                            <FontAwesomeIcon icon={isNewItem ? faTimes : faTrash} />
                        </span>
                    </div>
                </td>
            ) :
                // (
                //     <td className="k-command-cell k-command-cell-icon" contextMenu="Action">
                //         <div className="txt-clr-blue">
                //             <span className="font-medium" style={{ paddingRight: "12px", cursor: "pointer" }} title="Edit" onClick={() => edit(dataItem)}>
                //                 <FontAwesomeIcon icon={faPencilAlt} />
                //             </span>
                //             <span
                //                 //key={dataItem.order}
                //                 className={"font-medium " + (dataItem.isDefault==true ? "disable-opacity" : "") +(dataItem.documentId==null ? "disable-opacity" : "")}
                //                 style={{ paddingRight: "5px", cursor: "pointer" }}
                //                 title="View Document"
                //                 onClick={() => dataItem.documentId != null && view(dataItem.filePath)}
                //             >
                //                 <FontAwesomeIcon icon={faEye} />
                //             </span>
                //         </div>
                //     </td>
                // );
                <RowActions
                    dataItem={dataItem}
                    currentState={dataItem.status}
                    rowId={candidateId}
                    handleClick={handleActionClick}
                        defaultActions={DefaultActions(dataItem, view, candWfStatus, isAdminRole, isClientRole, isVendorRole)}
                />
        }
    };
}
