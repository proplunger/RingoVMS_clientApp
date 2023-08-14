import * as React from "react";
import { history } from "../../../../../HelperMethods";
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
import { currencyFormatter, dateFormatter } from "../../../../../HelperMethods";

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
        filename="Manage Client Rate Card"
    >
        <ExcelSheet data={data} name="Manage Client Rate Card">
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Service Type" value="serviceType" />
            <ExcelColumn label="Bill Type" value="billType" />
            <ExcelColumn label="Max. Bill Rate ($)" value="maxBillRate" />
            {/* <ExcelColumn label="Shift Type" value="shiftType" /> */}
            <ExcelColumn label="% Suppress" value="suppressPer" />
            <ExcelColumn label="Max. Holiday Bill Rate ($)" value="maxHolidayBillRate" />
            <ExcelColumn label="Valid from" value={(col) => dateFormatter(col.validFrom)} />
            <ExcelColumn label="Valid To" value={(col) => dateFormatter(col.validTo)} />
            <ExcelColumn label="Tags" value="tags" />
        </ExcelSheet>
    </ExcelFile>
);

export const AddNewRateCard = () => { 
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons"  onClick={() => history.push('/admin/clientratecard/create')}>
            
            <FontAwesomeIcon icon={faPlusCircle} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Add New Rate Card{" "}
        </div>
    );
};

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
            {auth.hasPermissionV2(AppPermissions.CLIENT_RATE_CARD_CREATE) && <MenuItem render={AddNewRateCard} />}
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
            permCode: AppPermissions.CLIENT_RATE_CARD_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/admin/clientratecard/edit/${dataItem.id}`,
        },
        {
            action: "Remove",
            permCode: AppPermissions.CLIENT_RATE_CARD_DELETE,
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
    const perc = (props.suppressPer / 100) * props.maxBillRate;
    const supressionAmount = props.maxBillRate - perc
    return (
        <div className="row">
            <div className="col-12 col-lg-11 text-dark">
                <div className="row ml-0 mr-0 mt-1">
                    <div className="col-12 pl-0 text-right">
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>% Suppress :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {props.suppressPer}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Suppression Amount :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {currencyFormatter(supressionAmount)}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Max. Holiday Bill Rate :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                {currencyFormatter(props.maxHolidayBillRate)}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Tags :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.tags || "-"}</label>
                            </div>
                        </div>
                        {/* <div className="mt-1 mb-2 text-overflow_helper">Shift Type :</div> */}
                        
                    </div>
                    {/* <div className="mt-1 mb-2 text-overflow_helper">Max. Holiday Bill Rate :</div>
                    <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">
                                {currencyFormatter(props.maxHolidayBillRate)}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};