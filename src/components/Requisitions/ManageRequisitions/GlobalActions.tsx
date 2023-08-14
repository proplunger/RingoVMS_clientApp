import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { amountFormatter, candidateUnderReview, currencyFormatter, dateFormatter } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faTimes,
    faPlusCircle,
    faList,
    faFileExcel,
    faColumns,
    faEye,
    faPencilAlt,
    faCopy,
    faTrashAlt,
    faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { CellRender, GridNoRecord, MenuRender } from "../../Shared/GridComponents/CommonComponents";
import { GridCell, GridDetailRow } from "@progress/kendo-react-grid";
import auth from "../../Auth";
import { history } from "../../../HelperMethods";
import { convertShiftDateTime, FormatPhoneNumber } from "../../ReusableComponents";
import { Link } from "react-router-dom";
import { AuthRoleType, isRoleType, isVendorRoleType, ReqStatus } from "../../Shared/AppConstants";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { CAND_SUBMISSION_FORM_URL, CAND_SUB_WORKFLOW_URL, REQ_RELEASE_URL, REQ_VIEW_URL } from "../../Shared/ApiUrls";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const userObj = JSON.parse(localStorage.getItem("user"));
export const ExportExcel = (data?, isEnableDepartment?) => {

    return <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Manage Requisitions"
        
    >
        <ExcelSheet data={data} name="Manage Requisitions">
            <ExcelColumn label="Req Number" value="reqNumber" />
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Zone" value="zone" />
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="State" value="state" />
            <ExcelColumn label="City" value="city" />
            <ExcelColumn label="Job Workflow" value="jobWf" />
            <ExcelColumn label="Job Category" value="jobCategory" />
            <ExcelColumn label="Hiring Manager" value="hiringManager" />
            <ExcelColumn label="Reason" value="reason" />
            <ExcelColumn label="Required" value="totalRequired" />
            <ExcelColumn label="Submitted" value="submitted" />
            <ExcelColumn label="Filled Rate" value={(col) => Number(col.filledRate)} />
            <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
            <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
            <ExcelColumn label="Shift Start Time" value={(col) => convertShiftDateTime(col.shiftStartTime)} />
            <ExcelColumn label="Shift End Time" value={(col) => convertShiftDateTime(col.shiftEndTime)} />
            <ExcelColumn label="Created By" value="creator" />
            <ExcelColumn label="Created Date" value={(col) => dateFormatter(new Date(col.createdDate))} />
            <ExcelColumn label="Skills" value="skills" />
            <ExcelColumn label="Bill Rate ($)" value={(col) => amountFormatter(col.billRate)} />
            <ExcelColumn label="Budget ($)" value={(col) => amountFormatter(col.budget)} />
            <ExcelColumn label="Position Description" value="positionDesc" />
        </ExcelSheet>
    </ExcelFile>
};

export const ExportExcelVendor = (data?, isEnableDepartment?) => {
    return <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Manage Requisitions"
    >
        <ExcelSheet data={data} name="Manage Requisitions">
            <ExcelColumn label="Req Number" value="reqNumber" />
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Zone" value="zone" />
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="State" value="state" />
            <ExcelColumn label="City" value="city" />
            <ExcelColumn label="Job Workflow" value="jobWf" />
            <ExcelColumn label="Job Category" value="jobCategory" />
            <ExcelColumn label="Reason" value="reason" />
            <ExcelColumn label="Required" value="totalRequired" />
            <ExcelColumn label="Submitted" value="submitted" />
            <ExcelColumn label="Filled Rate" value={(col) => Number(col.filledRate)}  />
            <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
            <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
            <ExcelColumn label="Shift Start Time" value={(col) => convertShiftDateTime(col.shiftStartTime)} />
            <ExcelColumn label="Shift End Time" value={(col) => convertShiftDateTime(col.shiftEndTime)} />
            <ExcelColumn label="Created By" value="creator" />
            <ExcelColumn label="Created Date" value={(col) => dateFormatter(new Date(col.createdDate))} />
            <ExcelColumn label="Skills" value="skills" />
            <ExcelColumn label="Bill Rate ($)" value={(col) => amountFormatter(col.billRate)} />
            <ExcelColumn label="Position Description" value="positionDesc" />
        </ExcelSheet>
    </ExcelFile>
};

export const ExportExcelNew = (data?) => {

    return <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Manage Requisitions"
        
    >
        <ExcelSheet data={data} name="Manage Requisitions">
            <ExcelColumn label="Req Number" value="reqNumber" />
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Department" value="departmentName" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Zone" value="zone" />
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="State" value="state" />
            <ExcelColumn label="City" value="city" />
            <ExcelColumn label="Job Workflow" value="jobWf" />
            <ExcelColumn label="Job Category" value="jobCategory" />
            <ExcelColumn label="Hiring Manager" value="hiringManager" />
            <ExcelColumn label="Reason" value="reason" />
            <ExcelColumn label="Required" value="totalRequired" />
            <ExcelColumn label="Submitted" value="submitted" />
            <ExcelColumn label="Filled Rate" value={(col) => Number(col.filledRate)} />
            <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
            <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
            <ExcelColumn label="Shift Start Time" value={(col) => convertShiftDateTime(col.shiftStartTime)} />
            <ExcelColumn label="Shift End Time" value={(col) => convertShiftDateTime(col.shiftEndTime)} />
            <ExcelColumn label="Created By" value="creator" />
            <ExcelColumn label="Created Date" value={(col) => dateFormatter(new Date(col.createdDate))} />
            <ExcelColumn label="Skills" value="skills" />
            <ExcelColumn label="Bill Rate ($)" value={(col) => amountFormatter(col.billRate)} />
            <ExcelColumn label="Budget ($)" value={(col) => amountFormatter(col.budget)} />
            <ExcelColumn label="Position Description" value="positionDesc" />
        </ExcelSheet>
    </ExcelFile>
};

export const ExportExcelVendorNew = (data?) => {
    return <ExcelFile
        element={
            <div className="pb-1 pt-1 w-100 myorderGlobalicons">
                <FontAwesomeIcon icon={faFileExcel} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Export to Excel{" "}
            </div>
        }
        filename="Manage Requisitions"
    >
        <ExcelSheet data={data} name="Manage Requisitions">
            <ExcelColumn label="Req Number" value="reqNumber" />
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Department" value="departmentName" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Zone" value="zone" />
            <ExcelColumn label="Region" value="region" />
            <ExcelColumn label="State" value="state" />
            <ExcelColumn label="City" value="city" />
            <ExcelColumn label="Job Workflow" value="jobWf" />
            <ExcelColumn label="Job Category" value="jobCategory" />
            <ExcelColumn label="Reason" value="reason" />
            <ExcelColumn label="Required" value="totalRequired" />
            <ExcelColumn label="Submitted" value="submitted" />
            <ExcelColumn label="Filled Rate" value={(col) => Number(col.filledRate)}  />
            <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
            <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
            <ExcelColumn label="Shift Start Time" value={(col) => convertShiftDateTime(col.shiftStartTime)} />
            <ExcelColumn label="Shift End Time" value={(col) => convertShiftDateTime(col.shiftEndTime)} />
            <ExcelColumn label="Created By" value="creator" />
            <ExcelColumn label="Created Date" value={(col) => dateFormatter(new Date(col.createdDate))} />
            <ExcelColumn label="Skills" value="skills" />
            <ExcelColumn label="Bill Rate ($)" value={(col) => amountFormatter(col.billRate)} />
            <ExcelColumn label="Position Description" value="positionDesc" />
        </ExcelSheet>
    </ExcelFile>
};


export const Columns = () => {
    return (
        <div className="pb-1 pt-1 w-100 myorderGlobalicons">
            <FontAwesomeIcon icon={faColumns} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> Columns{" "}
        </div>
    );
};

export const CustomMenu = (excelData, isEnableDepartment) => {
    return (
        <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={MenuRender}>
                {isEnableDepartment ?
                   <MenuItem render={() => !isRoleType(AuthRoleType.Vendor) ? ExportExcelNew(excelData) : ExportExcelVendorNew(excelData)} />
                : <MenuItem render={() => !isRoleType(AuthRoleType.Vendor) ? ExportExcel(excelData) : ExportExcelVendor(excelData)} />}
                {auth.hasPermissionV2(AppPermissions.REQ_BATCH_RELEASE) && (
                    <MenuItem render={() =>  BatchRelease()} />
                )}
            </MenuItem>
        </Menu>
    );
};

export const BatchRelease = () => {
    return (
        <div
            className="pb-1 pt-1 w-100 myorderGlobalicons"
            onClick={() => history.push('/requisitions/batchRelease')}
        >
            <FontAwesomeIcon
                icon={faCheckCircle}
                className={"nonactive-icon-color ml-2 mr-2"}
            ></FontAwesomeIcon>
            Batch Release
        </div>
    );
}

export class DetailColumnCell extends React.Component<{ dataItem: any; expandChange: any; style:any }> {
    render() {
        let dataItem = this.props.dataItem;
        return (
            <td contextMenu="View More" style={this.props && this.props.style} className={'k-grid-content-sticky text-center'}>
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
                                <label className='mb-0'>Zone :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>

                                    {props.zone || "-"}</label>
                            </div>
                        </div>

                        {props.isEnableDepartment && 
                            <div className="row mb-2">
                                <div className="col-6">
                                    <label className='mb-0'>Department :</label>
                                </div>
                                <div className="col-6 text-left pl-0 pr-0">
                                    <label className='text-overflow_helper-label-modile-desktop mb-0'
                                        title={props.positionDesc}>{props.departmentName || '-'}</label>
                                </div>
                            </div>
                        }

                        {/* <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Region :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.region || "-"}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>State :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>

                                    {props.state || "-"}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>City :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.city || "-"}</label>
                            </div>
                        </div> */}


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Job Workflow :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.jobWf}
                                </label>
                            </div>
                        </div>



                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Job Category :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.jobCategory}
                                </label>
                            </div>
                        </div>
                        {!isRoleType(AuthRoleType.Vendor) &&
                            <div className="row mb-2">
                                <div className="col-6">
                                    <label className='mb-0'>Hiring Manager :</label>
                                </div>
                                <div className="col-6 text-left pl-0 pr-0">
                                    <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                        {props.hiringManager}</label>
                                </div>
                            </div>
                        }
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Reason :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.reason}</label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Shift Start Time  :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {convertShiftDateTime(props.shiftStartTime)}</label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Shift End Time  :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {convertShiftDateTime(props.shiftEndTime)}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Created By :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.creator}
                                </label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Created Date :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {dateFormatter(props.createdDate)} {convertShiftDateTime(props.createdDate)}</label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Skills :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.skills}
                                </label>
                            </div>
                        </div>


                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Bill Rate :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {currencyFormatter(props.billRate)}</label>
                            </div>
                        </div>

                        {!isRoleType(AuthRoleType.Vendor) && (
                            <div className="row mb-2">
                                <div className="col-6">
                                    <label className='mb-0'>Budget :</label>
                                </div>
                                <div className="col-6 text-left pl-0 pr-0">
                                    <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                        {currencyFormatter(props.budget)}</label>
                                </div>
                            </div>
                        )}

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Position Description :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'
                                    title={props.positionDesc}>{props.positionDesc}</label>
                            </div>
                        </div>
                    

                        {/* <div className="mt-1 mb-2 text-overflow_helper">State :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">City :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Job Workflow :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Job Category :</div>
                        {!isRoleType(AuthRoleType.Vendor) && <div className="mt-1 mb-2 text-overflow_helper">Hiring Manager :</div>}
                        <div className="mt-1 mb-2 text-overflow_helper">Reason :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Shift Start Time :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Shift End Time :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Created By :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Created Date :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Skills :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Bill Rate :</div>
                        {!isRoleType(AuthRoleType.Vendor) && (
                            <div className="mt-1 mb-2 text-overflow_helper">Budget :</div>
                        )}
                        <div className="mt-1 mb-2 text-overflow_helper">Position Description :</div> */}
                    </div>
                    {/* <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.state || "-"}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.city || "-"}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.jobWf}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.jobCategory}</label>
                        </div>
                        {!isRoleType(AuthRoleType.Vendor) && <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.hiringManager}</label>
                        </div>}
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.reason}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{convertShiftDateTime(props.shiftStartTime)}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{convertShiftDateTime(props.shiftEndTime)}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.creator}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{dateFormatter(props.createdDate)}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.skills}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{currencyFormatter(props.billRate)}</label>
                        </div>
                        {!isRoleType(AuthRoleType.Vendor) && (
                            <div className="mt-1 mb-2 text-overflow_helper">
                                <label className="mb-0">{currencyFormatter(props.budget)}</label>
                            </div>
                        )}
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0 position-textellipse position-textellipse-twolines"
                                title={props.positionDesc}>{props.positionDesc}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export const ReqNumberCell = (props) => {
    var pageUrl = `${REQ_VIEW_URL}${props.dataItem.reqId}`;
    //if (candidateUnderReview(props.dataItem.status) && auth.hasPermissionV2(AppPermissions.CAND_SUB_VIEW)) {
    if (props.dataItem.status==ReqStatus.CANDIDATEUNDERREVIEW && auth.hasPermissionV2(AppPermissions.CAND_SUB_VIEW)) {
        //pageUrl = `${CAND_SUB_WORKFLOW_URL}${props.dataItem.reqId}`;
        pageUrl = `${REQ_RELEASE_URL}${props.dataItem.reqId}`;
    }
    //else if (candidateUnderReview(props.dataItem.status) && auth.hasPermissionV2(AppPermissions.REQ_RELEASE)) {
    else if (props.dataItem.status==ReqStatus.RELEASED && auth.hasPermissionV2(AppPermissions.REQ_RELEASE)) {
        pageUrl = `${REQ_RELEASE_URL}${props.dataItem.reqId}`;
    }
    else if (props.dataItem.status==ReqStatus.DRAFT && (auth.hasPermissionV2(AppPermissions.REQ_CREATE)
        || auth.hasPermissionV2(AppPermissions.REQ_UPDATE))) {
        pageUrl = `/requisitions/edit/${props.dataItem.reqId}`;
    }
    else if (props.dataItem.status==ReqStatus.APPROVED && auth.hasPermissionV2(AppPermissions.REQ_RELEASE)) {
        pageUrl = `${REQ_RELEASE_URL}${props.dataItem.reqId}`;
    }
    return (
        <td contextMenu="Req #">
            <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
                {props.dataItem.reqNumber}
            </Link>
        </td>
    );
};

export function DefaultActions(props) {
    const { dataItem } = props;
    var defaultActions = [
        {
            action: "View",
            permCode: AppPermissions.REQ_VIEW,
            nextState: "",
            icon: "faEye",
            linkUrl: `/requisitions/view/${dataItem.reqId}`,
            cssStyle: {
                display: (dataItem.status==ReqStatus.PENDINGAPPROVAL || dataItem.status==ReqStatus.REJECTED
                    || dataItem.status==ReqStatus.CLOSED || dataItem.status==ReqStatus.CANCELLED || dataItem.status==ReqStatus.FILLED
                    || dataItem.status==ReqStatus.ONHOLD) ? "block" : "none"
            },
        },
        {
            // Edit Requisition page
            action: "Edit Req",
            permCode: AppPermissions.REQ_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/requisitions/edit/${dataItem.reqId}`,
            cssStyle: { display: [ReqStatus.DRAFT, ReqStatus.PENDINGAPPROVAL, ReqStatus.ONHOLD, ReqStatus.APPROVED].indexOf(dataItem.status) !=-1 ? "block" : "none" },
        },
        // {
        //     // Edit Requisition Popup
        //     action: "Edit Req",
        //     permCode: AppPermissions.REQ_UPDATE,
        //     nextState: "",
        //     icon: "faPencilAlt",
        //     cssStyle: { display: [ReqStatus.RELEASED, ReqStatus.CANDIDATEUNDERREVIEW, ReqStatus.FILLED, ReqStatus.CLOSED].indexOf(dataItem.status) !=-1 ? "block" : "none" },
        // },
        {
            // Edit Req page
            action: "Edit Req",
            permCode: AppPermissions.REQ_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/requisition/edit/${dataItem.reqId}`,
            cssStyle: { display: [ReqStatus.RELEASED, ReqStatus.CANDIDATEUNDERREVIEW, ReqStatus.FILLED, ReqStatus.CLOSED].indexOf(dataItem.status) !=-1 ? "block" : "none" },
        },
        {
            action: "Copy",
            permCode: AppPermissions.REQ_COPY,
            nextState: "",
            icon: "faCopy",
            cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },
        {
            action: "Remove",
            permCode: AppPermissions.REQ_DELETE,
            nextState: "",
            icon: "faTrashAlt",
            cssStyle: { display: dataItem.status==ReqStatus.DRAFT ? "block" : "none" },
        },
        {
            action: "Release",
            permCode: AppPermissions.REQ_RELEASE_VIEW,
            nextState: "",
            icon: "faCheckCircle",
            linkUrl: `/requisitions/release/${dataItem.reqId}`,
            cssStyle: { display: dataItem.status==ReqStatus.APPROVED ? "block" : "none" },
        },
        {
            action: "Edit Release",
            permCode: AppPermissions.REQ_RELEASE_UPDATE,
            nextState: "",
            icon: "faPencilAlt",
            linkUrl: `/requisitions/release/${dataItem.reqId}`,
            cssStyle: { display: [ReqStatus.RELEASED, ReqStatus.CANDIDATEUNDERREVIEW].indexOf(dataItem.status) !=-1 ? "block" : "none" },
        },
        {
            action: "Hold",
            permCode: AppPermissions.REQ_HOLD,
            nextState: "",
            icon: "faHandPaper",
            //cssStyle: { display: dataItem.status==ReqStatus.PENDINGAPPROVAL ? "block" : "none" },
            cssStyle: { display: [ReqStatus.PENDINGAPPROVAL, ReqStatus.APPROVED,ReqStatus.RELEASED, ReqStatus.CANDIDATEUNDERREVIEW].indexOf(dataItem.status) !=-1 ? "block" : "none" },
        },
        {
            action: "Remove Hold",
            permCode: AppPermissions.REQ_OFFHOLD,
            nextState: "",
            icon: "faHandPaper",
            cssStyle: { display: dataItem.status==ReqStatus.ONHOLD ? "block" : "none" },
        },
        {
            action: "Hold Position",
            permCode: AppPermissions.REQ_POSITION_HOLD,
            nextState: "",
            icon: "faHandPaper",
            cssStyle: { display: [ReqStatus.RELEASED, ReqStatus.CANDIDATEUNDERREVIEW].indexOf(dataItem.status) !=-1 ? "block" : "none" },
        },
        {
            action: "Req. History",
            permCode: AppPermissions.REQ_HISTORY_VIEW,
            nextState: "",
            icon: "faClock",
            cssStyle: { display: dataItem.status !=ReqStatus.DRAFT ? "block" : "none" },
        },

        {
            action: "Submit Candidate",
            permCode: AppPermissions.CAND_SUB_CREATE,
            nextState: "",
            icon: "faCheckCircle",
            linkUrl: `${CAND_SUBMISSION_FORM_URL}${dataItem.reqId}`,
            cssStyle: { display: [ReqStatus.RELEASED, ReqStatus.CANDIDATEUNDERREVIEW].indexOf(dataItem.status) !=-1 ? "block" : "none" },
        },
        {
            action: "Cancel",
            permCode: AppPermissions.REQ_CANCEL,
            nextState: "",
            icon: "faCheckCircle",
            cssStyle: { display: dataItem.noOfFilledStaff > 0 || ([ReqStatus.DRAFT, ReqStatus.CLOSED, ReqStatus.CANCELLED].indexOf(dataItem.status) !=-1) ? "none" : "block" },
        },
        {
            action: "Close",
            permCode: AppPermissions.REQ_CLOSE,
            nextState: "",
            icon: "faTimesCircle",
            cssStyle: { display: [ReqStatus.DRAFT, ReqStatus.CLOSED, ReqStatus.CANCELLED].indexOf(dataItem.status) !=-1 ? "none" : "block" },
        },
        {
            action: "View Events",
            permCode: AppPermissions.EVENT_VIEW,
            nextState: "",
            icon: "faEye",
            linkUrl:`/admin/eventslogs/manage/${dataItem.reqId}`,
          },
    ];
    return defaultActions;
}

export const BatchReleaseLog = (data?) => (
    <ExcelFile
      element={
        <span
          title="Export to Excel"
          className="mr-2 float-right invoice_excel-icon cursor-pointer"
        >
          <FontAwesomeIcon
            icon={faFileExcel}
            className={"nonactive-icon-color ml-2 mr-2"}
          ></FontAwesomeIcon>
        </span>
      }
      filename="Batch Release Log"
    >
      <ExcelSheet data={data} name="batch release log">
        <ExcelColumn label="Req Number" value='reqNumber' />
        <ExcelColumn label="Vendor" value='vendor' />
        <ExcelColumn label="Batch Release Status" value='status' />
      </ExcelSheet>
    </ExcelFile>
  );
