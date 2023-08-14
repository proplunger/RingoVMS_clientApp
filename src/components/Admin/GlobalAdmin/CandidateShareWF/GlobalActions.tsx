import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import { GridCell, GridDetailRow, GridHeaderCell } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { dateFormatter } from "../../../../HelperMethods";


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


export const ExportExcel = (data?) => {
    return <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Candidate Share Requests"
    >
        <ExcelSheet data={data} name="Manage Requisitions">
            <ExcelColumn label="Candidate Name" value="candidateName" />
            <ExcelColumn label="Vendor Name" value="vendorName" />
            <ExcelColumn label="Action By" value="actionBy" />
            <ExcelColumn label="Action Date" value={(col)=>dateFormatter(col.actionDate)} />
            <ExcelColumn label="Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
};



export function CustomHeaderActionCell(excelData) {
    return class extends GridHeaderCell {
        render() {
            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal" style={{ color: "white" }}></span>;
            };
            return (
                <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
                    <MenuItem render={menuRender} key={"parentMenu"}>
                    <MenuItem render={() => ExportExcel(excelData)} />
                    </MenuItem>
                    
                </Menu>
            );
        }
    };
}

export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "View",
            permCode: AppPermissions.CAND_SHARE_APPROVE,
            nextState: "",
            icon: "faEye",
            linkUrl: `/candidate/share/${dataItem.candShareRequestId}`,
        }
    ];
    return defaultActions;
}
