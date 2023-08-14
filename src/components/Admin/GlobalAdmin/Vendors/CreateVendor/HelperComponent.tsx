import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faTrash, 
    faPencilAlt, 
    faSave,  
    faUndo, 
    faPlus,
    faList,
} from "@fortawesome/free-solid-svg-icons";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { GridCell, GridHeaderCell } from "@progress/kendo-react-grid";


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

export class ViewMoreComponent extends GridDetailRow {
    // render() {
    //     const dataItem = this.props.dataItem;
    //     return <DialogBox {...dataItem} />;
    // }
}

export const DialogBox = (props) => {
    // return (
    //     <div className="row">
    //         <div className="col-12 col-lg-11 text-dark">
    //             <div className="row ml-0 mr-0 mt-1">
    //                 <div className="col-6 col-md-3 pl-0 text-right">
    //                     <div className="mt-1 mb-2 text-overflow_helper">Vendor :</div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">Mobile Number :</div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">Phone Number :</div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">Address 1 :</div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">Address 2 :</div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">Email :</div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">City :</div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">State :</div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">Postal Code :</div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">Country :</div>  
    //                     <div className="mt-1 mb-2 text-overflow_helper">Inv. Adjustments Email Address :</div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">Vendor Logo Filename :</div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">Associated Master Vendor :</div>  
    //                 </div>

    //                 <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.vendor}</label>
    //                     </div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.mobileNumber}</label>
    //                     </div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.phoneNumber}</label>
    //                     </div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.address1}</label>
    //                     </div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.address2}</label>
    //                     </div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.email}</label>
    //                     </div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.city}</label>
    //                     </div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.state}</label>
    //                     </div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.postalCode}</label>
    //                     </div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.country}</label>
    //                     </div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.invAdjustmentsEmailAddress}</label>
    //                     </div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.vendorLogoFileName}</label>
    //                     </div>
    //                     <div className="mt-1 mb-2 text-overflow_helper">
    //                         <label className="mb-0">{props.associatedMasterVendor}</label>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
};


export function CustomHeaderActionCell({ add }) {
    return class extends GridHeaderCell {
        handleHeaderMenuClick = (actionValue: number) => {
            console.log("Action Taken " + actionValue);
        }; 
 
        render() {
            const contentAddRender = (props) => {
                console.log("props from approval grid", props)
                return (
                    <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => add(props.dataItem)}>
                        <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"} />
                        Add New
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
  const isNewItem = dataItem.id ==undefined;
  
  return inEdit ? (
      <td className="k-command-cell  k-command-cell-icon" contextMenu="Action">
       <div className="txt-clr-blue">
        <span
        className={"font-medium"}
        style={{ marginRight: "12px", cursor: "pointer" }}
        title={isNewItem ? "Add" : "Update"}
        onClick={() => (isNewItem ? add(dataItem) : update(dataItem))}
      >
        <FontAwesomeIcon icon={isNewItem ? faSave : faSave} />
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
