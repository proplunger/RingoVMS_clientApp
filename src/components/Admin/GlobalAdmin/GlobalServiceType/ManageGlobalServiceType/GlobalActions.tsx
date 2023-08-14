import { faFileExcel, faList, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, MenuItem } from '@progress/kendo-react-layout';
import * as React from 'react';
import ReactExport from "react-data-export";
import { dateFormatter } from '../../../../../HelperMethods';
import { MenuRender } from '../../../../Shared/GridComponents/CommonComponents';
import { AppPermissions } from '../../../../Shared/Constants/AppPermissions';
import Auth from '../../../../Auth';
import { ReqStatus, ROWACTIONS } from '../../../../Shared/AppConstants';
import { GridDetailRow } from '@progress/kendo-react-grid';


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
        filename="Manage Service Types"
    >
        <ExcelSheet data={data} name="Manage Service">
            <ExcelColumn label="Service Category" value="serviceCategory" />
            <ExcelColumn label="Service Type" value="serviceType" />
            <ExcelColumn label="Description" value="description" />
            <ExcelColumn label="Is Fee Applied" value="isFeeApply" />
            <ExcelColumn label="Created Date" value={(col) => col.createdDate ? dateFormatter(col.createdDate) : ""} />
            <ExcelColumn label="Created By" value="createdBy" />
            <ExcelColumn label="Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddNewServiceType = (Add) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={Add}>

            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Service Type{" "}
        </div>
    );
};

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
                                <label className='mb-0'>Description:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.description}
                                </label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Bill Type:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.billTypeFilterValue}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
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

export const CustomMenu = (excelData, Add) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                {Auth.hasPermissionV2(AppPermissions.GLOBAL_SERV_TYPE_CREATE) &&
                    <MenuItem render={() => AddNewServiceType(Add)} />}
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
            permCode: AppPermissions.GLOBAL_SERV_TYPE_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
        },
        {
            action: ROWACTIONS.DELETE,
            permCode: AppPermissions.GLOBAL_SERV_TYPE_DELETE,
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
        {
            action: `${dataItem.status=="Active" ? ROWACTIONS.DEACTIVATE : "Activate"}`,
            permCode: AppPermissions.GLOBAL_SERV_TYPE_DELETE,
            nextState: "",
            icon: `${dataItem.status=="Active" ? "faTimesCircle" : "faCheckCircle"}`,
        },

    ];
    return defaultActions;
}