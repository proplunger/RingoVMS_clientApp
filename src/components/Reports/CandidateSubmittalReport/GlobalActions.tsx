import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { currencyFormatter, dateFormatter, dateFormatter2 } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faFileExcel,
    faColumns
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../Shared/GridComponents/CommonComponents";
import { GridDetailRow } from "@progress/kendo-react-grid";
import { convertShiftDateTime, FormatPhoneNumber } from "../../ReusableComponents";
import { Link } from "react-router-dom";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));

export const ExportExcel = (data?) => (
    <ExcelFile
        element={
            <div className="TimeSheet_Excel myorderGlobalicons bg-dark d-flex align-items-center justify-content-center rounded-circle shadow-sm" title="Export to Excel">
                <FontAwesomeIcon icon={faFileExcel} className={"text-white ml-2 mr-2"}></FontAwesomeIcon>{" "}
            </div>
        }
        filename="Candidate Submittal Report"
    >
        <ExcelSheet data={data} name="Candidate Submittal Report">
            <ExcelColumn label="Req Number" value="reqNumber" />
            <ExcelColumn label="Provider" value="candidateName" />
            <ExcelColumn label="NPI#" value="npi" />
            <ExcelColumn label="Contact" value="contactNum1" />
            <ExcelColumn label="Email" value="email" />
            <ExcelColumn label="Submitted On" value={(col) => dateFormatter(col.submittedOn)} />
            <ExcelColumn label="Submitted By" value="vendor" />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Zone" value="zone" />
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Skills" value="candSkills" />
            <ExcelColumn label="Address 1" value="addressLine1" />
            <ExcelColumn label="Address 2" value="addressLine2" />
            <ExcelColumn label="City" value="city" />
            <ExcelColumn label="State" value="state" />
            <ExcelColumn label="Postal Code" value="postalCode" />
            <ExcelColumn label="Country" value="country" />
            <ExcelColumn label="Tags" value="candTags" />
        </ExcelSheet>
    </ExcelFile>
);
export const PayPeriodCell = (props) => {
    var pageUrl = "/timesheet/" + props.dataItem.tsWeekId + "/edit";
    return (
        <td contextMenu="Pay Period">
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
                {" "}
                {dateFormatter2(props.dataItem.startDate) + " - " + dateFormatter2(props.dataItem.endDate)}{" "}
            </Link>
        </td>
    );
};
export const ProviderCell = (props) => {
    var pageUrl = "/candidate/view/" + props.dataItem.candSubmissionId;
    return (
        <td contextMenu="Candidate Name">
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
                {" "}
                {props.dataItem.candidateName}{" "}
            </Link>
        </td>
    );
};
export const ReqNumberCell = (props) => {
    var pageUrl = props.dataItem.status=="Draft" ? "/requisitions/edit/" : "/requisitions/view/";
    return (
        <td contextMenu="Req #">
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl + props.dataItem.reqId} style={{ color: "#007bff" }}>
                {props.dataItem.reqNumber}
            </Link>
        </td>
    );
};
export const Columns = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons">
            <FontAwesomeIcon icon={faColumns} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Columns{" "}
        </div>
    );
};

export const CustomMenu = (excelData) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                <MenuItem render={() => ExportExcel(excelData)} />
                <MenuItem render={Columns} />
            </MenuItem>
        </Menu>
    );
};

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
                                <label className="mb-0">NPI#:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.npi}>{props.npi}</label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Contact#:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.contactNum1}>{props.contactNum1}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Position:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.position}>{props.position}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Zone:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.zone}>{props.zone}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Region:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.region}>{props.region}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Division:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.division}>{props.division}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Location:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.location}>{props.location}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Hiring Manager:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.hiringManager}>{props.hiringManager}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Skills:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.candSkills}>{props.candSkills}</label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">SSN#:</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0">On File</label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Address 1 :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.addressLine1}>{props.addressLine1}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Address 2 :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.addressLine2}>{props.addressLine2}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">City :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.city}>{props.city}</label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">State :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.state}>{props.state}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Postal Code :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.postalCode}>{props.postalCode}</label>
                            </div>
                        </div>

                        
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Country :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.country}>{props.country}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className="mb-0">Tags :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className="text-overflow_helper-label-modile-desktop mb-0" title={props.candTags} >{props.candTags}</label>
                            </div>
                        </div>
                    </div>
                   
      
                </div>
            </div>
        </div>
    );
};