import * as React from "react";
import auth from "../../../../Auth";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faFileExcel,
    faList,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../../../Shared/GridComponents/CommonComponents";
import { ReqStatus } from "../../../../Shared/AppConstants";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { dateFormatter } from "../../../../../HelperMethods";
import { GridDetailRow } from "@progress/kendo-react-grid";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Manage Divisions"
    >
        <ExcelSheet data={data} name="Manage Divisions">
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Zone" value="zone" />
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Description" value="description" />
            <ExcelColumn label="Created Date" value={(col) => col.createdDate ? dateFormatter(col.createdDate) : ""} />
            <ExcelColumn label="Created By" value="createdByName" />
            <ExcelColumn label="Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddNewDivision = (Add) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick = {Add}>
            
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Division{" "}
        </div>
    );
};

export const CustomMenu = (excelData , Add) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
            {auth.hasPermissionV2(AppPermissions.CLIENT_DIV_CREATE) && <MenuItem render={() => AddNewDivision(Add)} />}
                <MenuItem render={() => ExportExcel(excelData)} />
            </MenuItem>
        </Menu>
    );
};


export function DefaultActions(props, clientId) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Edit",
            permCode: AppPermissions.CLIENT_DIV_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
        },
        {
            action: "Remove",
            permCode: AppPermissions.CLIENT_DIV_DELETE,
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
        {
            action: "Manage Locations",
            permCode: AppPermissions.CLIENT_LOC_UPDATE,
            nextState: "",
            icon: "faMapMarkerAlt",
            linkUrl: `/admin/client/${clientId}/division/${dataItem.id}/locations?name=${dataItem.client}`,
        }, 
        {
            action: `${dataItem.status=="Active" ? "Inactivate" : "Activate"}`,
            permCode: AppPermissions.CLIENT_DIV_DELETE, 
            nextState: "",
            icon: `${dataItem.status=="Active"?"faTimesCircle":"faCheckCircle"}`,
        },
    ];
    return defaultActions;
}

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
    render() {
        const dataItem = this.props.dataItem;
        return <DialogBox {...dataItem} />;
    }
}

export const DialogBox = (props) => {
    return (
        <div className="row">
            <div className="col-12 col-lg-11 text-dark">
                <div className="row ml-0 mr-0 mt-1">
                    <div className="col-12 pl-0 text-right">
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Purchase Order:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.purchaseOrder}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}