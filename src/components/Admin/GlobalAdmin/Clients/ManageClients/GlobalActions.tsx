import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faList,
    faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../../../Shared/GridComponents/CommonComponents";
import { history } from "../../../../../HelperMethods";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { FormatPhoneNumber } from "../../../../ReusableComponents";
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
        filename="Manage Clients"
    >

        <ExcelSheet data={data} name="Manage Clients">
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Email" value="email" />
            <ExcelColumn label="Phone Number" value={(col) => FormatPhoneNumber(col.mobileNumber)} />
            <ExcelColumn label="Address 1" value="address1" />
            <ExcelColumn label="Address 2" value="address2" />
            <ExcelColumn label="Postal Code" value="postalCode" />
            <ExcelColumn label="Country" value="country" />
            <ExcelColumn label="State" value="state" />
            <ExcelColumn label="City" value="city" />
            <ExcelColumn label="Status" value="status" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddNewClient = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons" onClick={() => history.push('/admin/client/create')}>
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Client{" "}
        </div>
    );
};

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                <MenuItem render={AddNewClient} />
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
            permCode: AppPermissions.CLIENT_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/admin/client/edit/${dataItem.id}`,
        },
        {
            action: "Remove",
            permCode: AppPermissions.CLIENT_DELETE,
            nextState: "",
            icon: "faTrashAlt",
            //cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
        {
            action: "Manage Divisions",
            permCode: AppPermissions.CLIENT_DIV_UPDATE,
            nextState: "",
            icon: "faMapMarker",
            linkUrl: `/admin/client/${dataItem.id}/divisions?name=${dataItem.client}`,
        },
        {
            action: "Manage Locations",
            permCode: AppPermissions.CLIENT_LOC_UPDATE,
            nextState: "",
            icon: "faMapMarkerAlt",
            linkUrl: `/admin/client/${dataItem.id}/locations?name=${dataItem.client}`,
        },
        // {
        //     action: "Client Settings",
        //     permCode: AppPermissions.AUTHENTICATED,
        //     nextState: "",
        //     icon: "faUsersCog",
        //     //linkUrl: `/client/${dataItem.id}/divisions`,
        // },
        {
            action: `${dataItem.status=="Active" ? "Inactivate" : "Activate"}`,
            permCode: AppPermissions.CLIENT_DELETE,
            nextState: "",
            icon: `${dataItem.status=="Active" ? "faTimesCircle" : "faCheckCircle"}`,
            //linkUrl: `/client/${dataItem.id}/divisions`,
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
                                <label className='mb-0'>Address 2:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.address2}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Postal Code:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.postalCode}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Country:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.country}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Fax:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.fax}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Website:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.website}</label>
                            </div>
                        </div>
                      
                    </div>
                    {/* <div className="mt-1 mb-2 text-overflow_helper">Address 2 :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Postal Code :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Country :</div>
                    <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.address2}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.postalCode}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.country}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};