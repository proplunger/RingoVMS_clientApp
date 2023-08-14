import * as React from "react";
import ReactExport from "react-data-export";
import { amountFormatter } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileExcel, faList,
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { ServiceCategory, ServiceCategoryIds } from "../../Shared/AppConstants";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

export const ExportExcel = (data) => (
    <ExcelFile
        element={
                <span title="Export to Excel" className="mr-2 float-right text-dark shadow invoice cursor-pointer">
                <FontAwesomeIcon icon={faFileExcel} style={{ color: "white" }} className={"faclock_size d-block"}></FontAwesomeIcon>
            </span>
        }
        filename="Spend Forecast Report"
    >
        <ExcelSheet data={data.filter((i) => i.serviceCategory != "" && i.serviceCategory != null)} name="Spend Forecast Report">
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Associate" value="provider" />
            <ExcelColumn label="Service Category" value="serviceCategory"/>
            <ExcelColumn label="Month" value="month" />
            <ExcelColumn label="Bill Rate ($)" value={(col) => col.maxBillRate ==0 ? null : col.serviceCategory !=ServiceCategory.EXPENSE ? amountFormatter(col.maxBillRate): null}/>
            <ExcelColumn label="Billable Hours" value="billableHours" />
            <ExcelColumn label="Base Forecast ($)" value={(col) => amountFormatter(col.clientBillable)} />
            <ExcelColumn label="Loaded Forecast ($)" value={(col) => amountFormatter(col.loadedForecast)}  />
        </ExcelSheet>
    </ExcelFile>
);

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
