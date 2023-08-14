import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { history } from "../../../../../HelperMethods";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faList,
    faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../../../Shared/GridComponents/CommonComponents";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";

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
        filename="Manage Vendor Tiers"
    >

        <ExcelSheet data={data} name="Manage Vendor Tiers">
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            {/* <ExcelColumn label="Position" value="position" /> */}
            <ExcelColumn label="Vendor" value="vendor" />
            <ExcelColumn label="Vendor Tier" value="tier" />
            <ExcelColumn label="Tags" value="tags" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddNewVendorTier = (Add) => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => history.push('/admin/vendortiers/create')}>
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Vendor Tier{" "}
        </div>
    );
};

export const CustomMenu = (excelData, Add) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                <MenuItem render={() => AddNewVendorTier(Add)} />
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
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/admin/vendortiers/edit/${dataItem.id}`,
        },
        {
            action: "Remove",
            permCode: AppPermissions.AUTHENTICATED,
            nextState: "",
            icon: "faTrashAlt",
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
                                <label className='mb-0'>Client :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.client}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Division :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.division}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Location :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.location}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Vendor :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.vendor}</label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Vendor Tier:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.tier}</label>
                            </div>
                        </div>

                    </div>
                    {/* <div className="mt-1 mb-2 text-overflow_helper">Client :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Division :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Location :</div>
                       
                        <div className="mt-1 mb-2 text-overflow_helper">Vendor :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Vendor Tier :</div> */}
                    {/* <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.client}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.division}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.location}</label>
                        </div>
                     
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.vendor}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.tier}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};