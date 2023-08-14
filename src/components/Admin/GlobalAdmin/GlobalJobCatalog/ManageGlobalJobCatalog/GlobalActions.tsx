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
import { GridDetailRow } from "@progress/kendo-react-grid";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Manage Global Job Catalog"
    >
        <ExcelSheet data={data} name="Manage Global Job Catalog">
            {/* <ExcelColumn label="Job Flow" value="jobFlow" /> */}
            <ExcelColumn label="Job Category" value="jobCategory" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Position Description" value="description" />
            <ExcelColumn label="Is NPI Required" value="isNpi" />
            <ExcelColumn label="Skills" value={(col) => (col.skills.map((skill) => skill.name).join(","))} />
        </ExcelSheet>
    </ExcelFile>
);

export const AddNewGlobalJobCatalog = (Add) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={Add}>

            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Catalog{" "}
        </div>
    );
};

export const CustomMenu = (excelData, Add) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                {auth.hasPermissionV2(AppPermissions.GLOBAL_JOB_CAT_CREATE) && <MenuItem render={() => AddNewGlobalJobCatalog(Add)} />}
                <MenuItem render={() => ExportExcel(excelData)} />
            </MenuItem>
        </Menu>
    );
};


export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "Edit",
            permCode: AppPermissions.GLOBAL_JOB_CAT_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
        },
        {
            action: "Remove",
            permCode: AppPermissions.GLOBAL_JOB_CAT_DELETE,
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
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
                                <label className='mb-0'>Skills:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0' title={props.skills.map((skill) => skill.name).join(",")}>{props.skills.map((skill) => skill.name).join(",")}</label>
                            </div>
                        </div>



                    </div>
                    {/* <div className="mt-1 mb-2 text-overflow_helper">Skills :</div>
                    <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 col-12 pl-0">
                            <label className="mb-0 text-overflow_helper-label" title={props.skills.map((skill) => skill.name).join(",")}>{props.skills.map((skill) => skill.name).join(",")}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};