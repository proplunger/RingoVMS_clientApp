import * as React from "react";
import auth from "../../Auth";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { dateFormatter } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faFileExcel,
  faEye,
  faHistory,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { CellRender, MenuRender } from "../../Shared/GridComponents/CommonComponents";
import { GridCell, GridDetailRow } from "@progress/kendo-react-grid";
import { history } from "../../../HelperMethods";
import { convertShiftDateTime } from "../../ReusableComponents";
import { Link } from "react-router-dom";
import { CAND_SUB_VIEW_URL, JOB_DETAIL, ONBOARDING_DETAIL, PROVIDER_TIMESHEET, PROVIDER_TIMESHEETS, REQ_VIEW_URL, VIEW_ONBOARDING } from "../../Shared/ApiUrls";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { CandSubmissionSubStatusIds, CandSubStatusIds, isAssignmentInProgress } from "../../Shared/AppConstants";

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
    filename="Manage Jobs"
  >
    <ExcelSheet data={data} name="Manage Jobs">
      <ExcelColumn label="ReqNumber" value="reqNumber" />
      <ExcelColumn label="Position" value="position" />
      <ExcelColumn label="Division" value="division" />
      <ExcelColumn label="Location" value="location" />
      <ExcelColumn label="Provider" value="candidateName" />
      <ExcelColumn label="Start Date" value={(col) => dateFormatter(col.jobStartDate)} />
      <ExcelColumn label="End Date" value={(col) => dateFormatter(col.jobEndDate)} />
      <ExcelColumn label="Vendor" value="vendor" />
      <ExcelColumn label="Client" value="client" />
      <ExcelColumn label="Hiring Manager" value="hiringManager" />
      <ExcelColumn label="Shift Start Time" value={(col) => convertShiftDateTime(col.startTime)} />
      <ExcelColumn label="Shift End Time" value={(col) => convertShiftDateTime(col.endTime)} />
      <ExcelColumn label="Status" value="candSubStatus" />
    </ExcelSheet>
  </ExcelFile>
);

export const View = (providerId) => {
  return (
    <div
      className="pb-1 pt-1 w-100 myorderGlobalicons"
      onClick={() => {
        history.push("/timesheet/provider/" + providerId);
      }}
    >
      <FontAwesomeIcon icon={faEye} className={"nonactive-icon-color ml-2 mr-2"}></FontAwesomeIcon> View Timesheet{" "}
    </div>
  );
};

export const CustomMenu = (excelData) => {
  return (
    <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
      <MenuItem render={MenuRender} key={"parentMenu"}>
        <MenuItem render={() => ExportExcel(excelData)} key={"exportBtn"} />
      </MenuItem>
    </Menu>
  );
};

export const RowMenu = (props) => {
  return (
    <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
      <MenuItem render={MenuRender}>
        <MenuItem render={View(props.dataItem.candidateId)} />
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
                <label className="mb-0">Vendor:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.vendor}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Zone:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.zone}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Region:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.region}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Client:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.client}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Hiring Manager :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.hiringManager}
                </label>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Requisition Start Date:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {dateFormatter(props.startDate)}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Requisition End Date :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {dateFormatter(props.endDate)}
                </label>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Shift Start Time:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {convertShiftDateTime(props.startTime)}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Shift End Time :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {convertShiftDateTime(props.endTime)}
                </label>
              </div>
            </div>
            {props.tempCredExpirationDate &&
              props.subStatusId &&
              (props.subStatusId==CandSubmissionSubStatusIds.Temporary ||
                props.subStatusId==CandSubmissionSubStatusIds.EXPIRED) && (
                <>
                  <div className="row mb-2">
                    <div className="col-6">
                      <label className="mb-0">
                        Temp Credential Expiration Date :
                      </label>
                    </div>
                    <div className="col-6 text-left pl-0 pr-0">
                      <label className="text-overflow_helper-label-modile-desktop mb-0">
                        {dateFormatter(props.tempCredExpirationDate)}
                      </label>
                    </div>
                  </div>
                  {props.tempCredExpirationDays > 0 && (
                    <>
                      <div className="row mb-2">
                        <div className="col-6">
                          <label className="mb-0">
                            Temp Credential Expiration Days :
                          </label>
                        </div>
                        <div className="col-6 text-left pl-0 pr-0">
                          <label className="text-overflow_helper-label-modile-desktop mb-0">
                            {props.tempCredExpirationDays}
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
          </div>
          {/* <div className="mt-1 mb-2 text-overflow_helper"> Vendor :</div>
                    <div className="mt-1 mb-2 text-overflow_helper">Client :</div>
                    <div className="mt-1 mb-2 text-overflow_helper">Hiring Manager :</div>
                    <div className="mt-1 mb-2 text-overflow_helper">Shift Start Time :</div>
                    <div className="mt-1 mb-2 text-overflow_helper">Shift End Time :</div> */}

          {/* <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
                    <div className="mt-1 mb-2 text-overflow_helper">
                        <label className="mb-0">{props.vendor}</label>
                    </div>
                    <div className="mt-1 mb-2 text-overflow_helper">
                        <label className="mb-0">{props.client}</label>
                    </div>
                    <div className="mt-1 mb-2 text-overflow_helper">
                        <label className="mb-0">{props.hiringManager}</label>
                    </div>
                    <div className="mt-1 mb-2 text-overflow_helper">
                        <label className="mb-0">{convertShiftDateTime(props.startTime)}</label>
                    </div>
                    <div className="mt-1 mb-2 text-overflow_helper">
                        <label className="mb-0">{convertShiftDateTime(props.endTime)}</label>
                    </div>
                </div> */}
        </div>
      </div>
    </div>
  );
};

export const RequisitionCell = (props) => {
  var pageUrl = REQ_VIEW_URL + props.dataItem.reqId;
  return (
    <td contextMenu="Req #">
      <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
        {" "}
        {props.dataItem.reqNumber}{" "}
      </Link>
    </td>
  );
};

export const CandidateCell = (props) => {
  var pageUrl = CAND_SUB_VIEW_URL;
  if (
    isAssignmentInProgress(props.dataItem.statusIntId) &&
    (props.dataItem.subStatusId ==
      CandSubmissionSubStatusIds.Temporary ||
      props.dataItem.subStatusId ==
      CandSubmissionSubStatusIds.EXPIRED) &&
    auth.hasPermissionV2(AppPermissions.CAND_ONBOARD_TASK_VIEW)
  ) {
    pageUrl = `${VIEW_ONBOARDING}`; //View Onboarding
  }
  return (
    <td contextMenu="Provider">
      <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl + props.dataItem.candSubmissionId} style={{ color: "#007bff" }}>
        {props.dataItem.candidateName}
      </Link>
    </td>
  );
};

export const PositionCell = (props) => {
  var pageUrl = PROVIDER_TIMESHEET + props.dataItem.candSubmissionId;
  return (
    <td contextMenu="Position">
      <Link className="orderNumberTd orderNumberTdBalck" to={pageUrl} style={{ color: "#007bff" }}>
        {" "}
        {props.dataItem.position}{" "}
      </Link>
    </td>
  );
};

export function CommandCell({ editField }, statusClick?, auditLogClick?) {
  return class extends GridCell {
    uploadControl: HTMLInputElement;
    render() {
      const { dataItem, dataIndex } = this.props;
      const viewTSRender = (props) => {
        return (
          <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => history.push(`${PROVIDER_TIMESHEET}${dataItem.candSubmissionId}`)}>
            <FontAwesomeIcon icon={faEye} className={"nonactive-icon-color ml-1 mr-2"} />
            View Timesheet
          </div>
        );
      };

      const viewWHRender = (props) => {
        return (
          <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => history.push(`${PROVIDER_TIMESHEETS}${dataItem.candidateId}/workhistory`)}>
            <FontAwesomeIcon icon={faHistory} className={"nonactive-icon-color ml-1 mr-2"} />
            Work History
          </div>
        );
      };

      const viewJobDetailsRender = (props) => {
        return (
          <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => history.push(`${JOB_DETAIL}${dataItem.candSubmissionId}`)}>
            <FontAwesomeIcon icon={faEye} className={"nonactive-icon-color ml-1 mr-2"} />
            View Job Details
          </div>
        );
      };
 
      const viewOnboardingDetailsRender = (props) => {
        return (
          <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => history.push(`${ONBOARDING_DETAIL}${dataItem.candSubmissionId}`)}>
            <FontAwesomeIcon icon={faEye} className={"nonactive-icon-color ml-1 mr-2"} />
            View Onboarding Details
          </div>
        );
      };

      const candidateStatus = ( onClickStatus) => {
        return (
          <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => onClickStatus(dataItem)}>
            <FontAwesomeIcon icon={faArrowLeft} className={"nonactive-icon-color ml-1 mr-2"} />
                       Candidate Status
          </div>
        );
      };

      const auditLogs = (auditLogClick) => {
        return (
          <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => auditLogClick(dataItem)}>
            <FontAwesomeIcon icon={faHistory} className={"nonactive-icon-color ml-1 mr-2"} />
                Audit Log
          </div>
        );
      };

      const menuRender = (props) => {
        return <span className="k-icon k-i-more-horizontal"></span>;
      };
      const isNewItem = dataItem.tsDayServTypeId ==undefined;
      return (
        <td contextMenu="Action">
          <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
            <MenuItem render={menuRender} key={"parentMenu"}>
              {<MenuItem render={viewTSRender} key={"editBtn"} />}
              {auth.hasPermissionV2(AppPermissions.TS_JOB_DETAIL) && <MenuItem render={viewJobDetailsRender} key={"jobDetailsBtn"} />}
              {auth.hasPermissionV2(AppPermissions.TS_ONBOARDING_DETAIL) && <MenuItem render={viewOnboardingDetailsRender} key={"onboardingDetailsBtn"} />}
              {auth.hasPermissionV2(AppPermissions.AUDIT_LOG) && <MenuItem render={()=>auditLogs(auditLogClick)} key={"auditLogs"} />}
              {<MenuItem render={viewWHRender} key={"deleteBtn"} />}
              {<MenuItem render={()=>candidateStatus(statusClick)} key={"deleteBtn"} />}
            </MenuItem>
          </Menu>
        </td>
      );
    }
  };
}

