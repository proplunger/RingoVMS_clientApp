import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { dateFormatter, history, currencyFormatter } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faFileExcel, faColumns, faEye } from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../Shared/GridComponents/CommonComponents";
import { GridCell, GridDetailRow } from "@progress/kendo-react-grid";
import auth from "../../Auth";
import { convertShiftDateTime } from "../../ReusableComponents";
import { Link } from "react-router-dom";
import {
    CAND_SUB_MANAGE_URL, CAND_SUB_WORKFLOW_URL,
} from "../../Shared/ApiUrls";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";

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
        filename="Candidate Submissions"
    >
        <ExcelSheet data={data} name="Candidate Submissions">
            <ExcelColumn label="Req Number" value="reqNumber" />
            <ExcelColumn label="Client" value="client" />
            <ExcelColumn label="Division" value="division" />
            <ExcelColumn label="Location" value="location" />
            <ExcelColumn label="Reason" value="reason" />
            <ExcelColumn label="Status" value="status" />
            <ExcelColumn label="Created Date" value={(col) => dateFormatter(new Date(col.createdDate))} />
            <ExcelColumn label="Position" value="position" />
            <ExcelColumn label="Job Workflow" value="jobWf" />
            <ExcelColumn label="Job Category" value="jobCategory" />
            <ExcelColumn label="Hiring Manager" value="hiringManager" />
            <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.startDate)} />
            <ExcelColumn label="End Date" value={(col) => dateFormatter(col.endDate)} />
            <ExcelColumn label="Shift Start Time" value={(col) => convertShiftDateTime(col.shiftStartTime)} />
            <ExcelColumn label="Shift End Time" value={(col) => convertShiftDateTime(col.shiftEndTime)} />
            <ExcelColumn label="Created By" value="creator" />
            <ExcelColumn label="Skills" value="skills" />
            <ExcelColumn label="Bill Rate" value={(col) => currencyFormatter(col.billRate)} />
            <ExcelColumn label="Budget" value={(col) => currencyFormatter(col.budget)} />
            <ExcelColumn label="Position Description" value="positionDesc" />
        </ExcelSheet>
    </ExcelFile>
);

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
                {/* <MenuItem render={Columns} /> */}
            </MenuItem>
        </Menu>
    );
};

export function CustomCell({ openConfirm }) {
    return class extends GridCell {
        _documentRef;
        private isVisible: boolean = false;

        handleViewClick = (dataItem) => {
            history.push(`${CAND_SUB_WORKFLOW_URL}${dataItem.reqId}`);
        };

        render() {
            const { dataItem } = this.props;
            const self = this;

            const contentViewRender = (props) => {
                return (
                    <div className="pb-1 pt-1 w-100 myorderactionicons d-flex align-items-center " onClick={() => this.handleViewClick(dataItem)}>
                        <FontAwesomeIcon icon={faEye} className={"nonactive-icon-color ml-2 mr-2"} />
                        View
                    </div>
                );
            };

            const menuRender = (props) => {
                return <span className="k-icon k-i-more-horizontal active-icon-blue"></span>;
            };

            return (
                <td contextMenu="Action">
                    <Menu openOnClick={true} key={dataItem.reqNumber} className="actionItemMenu ">
                        <MenuItem render={menuRender} key={"parentMenu" + dataItem.reqNumber}>
                            {auth.hasPermissionV2(AppPermissions.REQ_VIEW) && (
                                <MenuItem
                                    render={contentViewRender}
                                    key={"viewBtn" + dataItem.reqNumber}
                                    cssStyle={{ display: dataItem.status !="Draft" ? "block" : "none" }}
                                />
                            )}
                        </MenuItem>
                    </Menu>
                </td>
            );
        }
    };
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
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Hiring Manager :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.hiringManager}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Start Date :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {dateFormatter(props.startDate)}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>End Date :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {dateFormatter(props.endDate)}
                                </label>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Shift Start Time :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {convertShiftDateTime(props.shiftStartTime)}
                                </label>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <label className='mb-0'>Shift End Time :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {convertShiftDateTime(props.shiftEndTime)}
                                </label>
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
                                <label className='mb-0'>Position Descriptions :</label>
                            </div>
                            <div className="col-6 text-left pl-0 pr-0">
                                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                                    {props.positionDesc}
                                </label>
                            </div>
                        </div>
                        {/* <div className="mt-1 mb-2 text-overflow_helper">Job Workflow :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Job Category :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Hiring Manager :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Start Date :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">End Date :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Shift Start Time :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Shift End Time :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Created By :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Skills :</div>
                        <div className="mt-1 mb-2 text-overflow_helper">Position Descriptions :</div> */}
                    </div>
                    {/* <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.jobWf}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.jobCategory}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.hiringManager}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{dateFormatter(props.startDate)}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{dateFormatter(props.endDate)}</label>
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
                            <label className="mb-0">{props.skills}</label>
                        </div>
                        <div className="mt-1 mb-2 text-overflow_helper">
                            <label className="mb-0">{props.positionDesc}</label>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export const CandNumberCell = (props) => {
    return (
        <td contextMenu="Req #">
            {auth.hasPermissionV2(AppPermissions.REQ_VIEW) &&
                <Link className="orderNumberTd orderNumberTdBalck" to={"/requisitions/view/" + props.dataItem.reqId} style={{ color: "#007bff" }}>
                    {props.dataItem.reqNumber}
                </Link>
            }
            {!auth.hasPermissionV2(AppPermissions.REQ_VIEW) &&
                props.dataItem.reqNumber
            }
        </td>
    );
};
