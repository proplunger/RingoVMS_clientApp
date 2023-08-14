import { faFileExcel, faList, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import * as React from "react";
import { dateFormatter, history } from "../../../../../HelperMethods";
import Auth from "../../../../Auth";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

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

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Manage Action Reason"
    >
        <ExcelSheet data={data} name="Manage Action Reason">
            <ExcelColumn label="Reason" value="reason" />
            <ExcelColumn label="Description" value="description" />
            <ExcelColumn label="Created Date" value={(col) => col.createdDate ? dateFormatter(col.createdDate) : ""} />
            <ExcelColumn label="Created By" value="createdBy" />
            <ExcelColumn label="Actions" value="actions" />
        </ExcelSheet>
    </ExcelFile>
);
export const AddNewActionReason = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => history.push('/admin/globalactionreason/create')}>

            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Action Reason{" "}
        </div>
    );
};
export const MenuRender = (props) => {
    return <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}></span>;
};
export const CustomMenu = (excelData, Add) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                {Auth.hasPermissionV2(AppPermissions.AUTHENTICATED) &&
                    <MenuItem render={() => AddNewActionReason()} />}
                <MenuItem render={() => ExportExcel(excelData)} />
            </MenuItem>
        </Menu>
    );

};

export class ViewMoreComponent extends GridDetailRow {
    render() {
        const dataItem = this.props.dataItem;
        return <DialogBox {...dataItem} />;
    }
}
export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Edit",
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/admin/globalactionreason/edit/${dataItem.id}`,
        },

    ];
    return defaultActions;
}

export const DialogBox = (props) => {
    return (
        <div className="row">
            <div className="col-12 col-lg-11 text-dark">
                <div className="row ml-0 mr-0 mt-1">
                    <div className="col-12 pl-0 text-right">
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Actions:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.actions || "-"}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}