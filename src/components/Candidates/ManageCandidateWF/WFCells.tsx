import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { dateFormatter } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faList,
  faFileExcel,
  faColumns,
  faCheckCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../Shared/GridComponents/CommonComponents";
import {
  AuthRoleType,
  CandSubmissionSubStatusIds,
  CandSubStatusIds,
  isRoleType
} from "../../Shared/AppConstants";
import { GridCell, GridDetailRow } from "@progress/kendo-react-grid";
import auth from "../../Auth";
import { history } from "../../../HelperMethods";
import { FormatPhoneNumber, PhoneNumberCell } from "../../ReusableComponents";
import { Link } from "react-router-dom";
import {
  CAND_SUB_RISK_ATTESTATION_URL,
  CAND_SUB_RISK_CLEARANCE_URL,
  CAND_PRESENTATION_URL,
  CAND_SUBMISSION_FORM_URL,
  CAND_SUB_NAME_CLEAR_URL,
  CAND_SUBMIT_PRESENTATION_URL,
  CAND_SUB_VIEW_URL,
  ADD_CANDIDATE_URL,
  INTERVIEW_DETAILS,
  CAPTURE_ROUND_RESULT,
  OFFER_INFORMATION,
  VIEW_ONBOARDING,
  CREATE_ASSIGNMENT,
  CAND_SUB_SCHEDULE_INTERVIEW_URL,
  CANDIDATE_PRESENTATION_INFO,
} from "../../Shared/ApiUrls";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ExportExcel = (data?) => (
  <ExcelFile
    element={
      <div className="pb-1 pt-1 w-100 myorderGlobalicons">
        <FontAwesomeIcon
          icon={faFileExcel}
          className={"nonactive-icon-color ml-2 mr-2"}
        ></FontAwesomeIcon>
        Export to Excel
      </div>
    }
    filename="Submitted Candidates"
  >
    <ExcelSheet data={data} name="Submitted Candidates">
      <ExcelColumn label="Req#" value="reqNumber" />
      <ExcelColumn label="Vendor" value="vendor" />
      <ExcelColumn label="Candidate Name" value="candidateName" />
      <ExcelColumn label="Position" value="position" />
      <ExcelColumn label="Location" value="location" />
      <ExcelColumn label="NPI#" value="npi" />
      <ExcelColumn label="SSN#" value="ssn" />
      <ExcelColumn
        label="Submitted On"
        value={(col) =>
          col.submittedOn !=null &&
            col.submittedOn !="" &&
            col.submittedOn !=undefined
            ? dateFormatter(col.submittedOn)
            : ""
        }
      />
      <ExcelColumn label="Open Days" value="openDays" />
      <ExcelColumn label="Email" value="email" />
      <ExcelColumn label="Mobile Number" value={(col) => FormatPhoneNumber(col.contactNum1)} />
      <ExcelColumn label="Phone Number" value={(col) => FormatPhoneNumber(col.contactNum2)} />
      <ExcelColumn label="Address 1" value="addressLine1" />
      <ExcelColumn label="Address 2" value="addressLine2" />
      <ExcelColumn label="City" value="city" />
      <ExcelColumn label="State" value="state" />
      <ExcelColumn label="Country" value="country" />
      <ExcelColumn label="Candidate Skills" value="candSkills" />
      <ExcelColumn label="Status" value="status" />
    </ExcelSheet>
  </ExcelFile>
);

export const ExportExcelForVendor = (data?) => (
  <ExcelFile
    element={
      <div className="pb-1 pt-1 w-100 myorderGlobalicons">
        <FontAwesomeIcon
          icon={faFileExcel}
          className={"nonactive-icon-color ml-2 mr-2"}
        ></FontAwesomeIcon>
        Export to Excel
      </div>
    }
    filename="Submitted Candidates"
  >
    <ExcelSheet data={data} name="Submitted Candidates">
      <ExcelColumn label="Req#" value="reqNumber" />
      <ExcelColumn label="Candidate Name" value="candidateName" />
      <ExcelColumn label="Position" value="position" />
      <ExcelColumn label="Location" value="location" />
      <ExcelColumn label="NPI#" value="npi" />
      <ExcelColumn label="SSN#" value="ssn" />
      <ExcelColumn
        label="Submitted On"
        value={(col) =>
          col.submittedOn !=null &&
            col.submittedOn !="" &&
            col.submittedOn !=undefined
            ? dateFormatter(col.submittedOn)
            : ""
        }
      />
      <ExcelColumn label="Open Days" value="openDays" />
      <ExcelColumn label="Email" value="email" />
      <ExcelColumn label="Mobile Number" value={(col) => FormatPhoneNumber(col.contactNum1)} />
      <ExcelColumn label="Phone Number" value={(col) => FormatPhoneNumber(col.contactNum2)} />
      <ExcelColumn label="Address 1" value="addressLine1" />
      <ExcelColumn label="Address 2" value="addressLine2" />
      <ExcelColumn label="City" value="city" />
      <ExcelColumn label="State" value="state" />
      <ExcelColumn label="Country" value="country" />
      <ExcelColumn label="Candidate Skills" value="candSkills" />
      <ExcelColumn label="Status" value="status" />
    </ExcelSheet>
  </ExcelFile>
);

export const Columns = () => {
  return (
    <div className="pb-1 pt-1 w-100 myorderGlobalicons">
      <FontAwesomeIcon
        icon={faColumns}
        className={"nonactive-icon-color ml-2 mr-2"}
      ></FontAwesomeIcon>
      Columns
    </div>
  );
};

export const SubmitSelectedCandidate = (submiteSelectionFunction) => {
  return (
    <div
      className="pb-1 pt-1 w-100 myorderGlobalicons"
      onClick={() => submiteSelectionFunction()}
    >
      <FontAwesomeIcon
        icon={faCheckCircle}
        className={"nonactive-icon-color ml-2 mr-2"}
      ></FontAwesomeIcon>
      Submit Selected
    </div>
  );
};

export const BatchSubmissionCandidate = (submiteSelectionFunction) => {
  return (
    <div
      className="pb-1 pt-1 w-100 myorderGlobalicons"
      onClick={() => submiteSelectionFunction()}
    >
      <FontAwesomeIcon
        icon={faCheckCircle}
        className={"nonactive-icon-color ml-2 mr-2"}
      ></FontAwesomeIcon>
      Batch Submission
    </div>
  );
};

export const BatchInterviewCandidate = (submiteSelectionFunction) => {
  return (
    <div
      className="pb-1 pt-1 w-100 myorderGlobalicons"
      onClick={() => submiteSelectionFunction()}
    >
      <FontAwesomeIcon
        icon={faCheckCircle}
        className={"nonactive-icon-color ml-2 mr-2"}
      ></FontAwesomeIcon>
      Request Batch Interviews
    </div>
  );
};


export const SubmitCandidate = (reqId) => {
  return (
    <div
      className="pb-1 pt-1 w-100 myorderGlobalicons"
      onClick={() =>
        history.push(`${CAND_SUBMISSION_FORM_URL}${reqId}`)
      }
    >
      <FontAwesomeIcon
        icon={faCheckCircle}
        className={"nonactive-icon-color ml-2 mr-2"}
      ></FontAwesomeIcon>
      Submit Candidate
    </div>
  );
};

export const AddNewCandidate = () => {
  return (
    <div className="pb-1 pt-1 w-100 myorderGlobalicons"
      onClick={() =>
        history.push(`${ADD_CANDIDATE_URL}`)
      }
    >
      <FontAwesomeIcon
        icon={faPlusCircle}
        className={"nonactive-icon-color ml-2 mr-2"}
      ></FontAwesomeIcon>
      Add New Candidate
    </div>
  );
};

export const SubmitSelected = () => {
  return (
    <div className="pb-1 pt-1 w-100 myorderGlobalicons">
      <FontAwesomeIcon
        icon={faCheckCircle}
        className={"nonactive-icon-color ml-2 mr-2"}
      ></FontAwesomeIcon>
      Submit Selected
    </div>
  );
};

export const CustomMenu = (
  excelData,
  reqId,
  role,
  submiteSelectionFunction,
  enableSelected,
  enableBatchSelected,
  batchSelectionFunction,
  enableBatchInteriewSelected,
  batchInterviewSelectionFunction
) => {
  return (
    <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
      <MenuItem render={MenuRender}>
        {auth.hasPermissionV2(AppPermissions.CAND_SUB_CREATE) && reqId && <MenuItem render={() => SubmitCandidate(reqId)} />}
        {auth.hasPermissionV2(AppPermissions.CANDIDATE_CREATE) && <MenuItem render={AddNewCandidate} />}
        {auth.hasPermissionV2(AppPermissions.CAND_SUB_CREATE) && (
          <MenuItem
            disabled={!enableSelected}
            render={() =>
              SubmitSelectedCandidate(submiteSelectionFunction)
            }
          />
        )}
        {auth.hasPermissionV2(AppPermissions.CAND_SUB_SUBMIT) && (
          <MenuItem
            disabled={!enableBatchSelected}
            render={() =>
              BatchSubmissionCandidate(batchSelectionFunction)
            }
          />
        )}
        {auth.hasPermissionV2(AppPermissions.CAND_INTVW_CREATE) && (
          <MenuItem
            disabled={!enableBatchInteriewSelected}
            render={() =>
              BatchInterviewCandidate(batchInterviewSelectionFunction)
            }
          />
        )}
        <MenuItem render={() => !isRoleType(AuthRoleType.Vendor)?ExportExcel(excelData):ExportExcelForVendor(excelData)} />
        {/* <MenuItem render={Columns} /> */}
      </MenuItem>
    </Menu>
  );
};

export class DetailColumnCell extends React.Component<{
  dataItem: any;
  expandChange: any;
  style:any;
}> {
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
            {/* <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Position :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.position}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Location :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.location}
                </label>
              </div>
            </div> */}

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">SSN# :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.ssn}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">NPI# :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.npi}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Mobile Number :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {FormatPhoneNumber(props.contactNum1)}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Phone Number:</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {FormatPhoneNumber(props.contactNum2)}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Address 1 :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.addressLine1}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Address 2 :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.addressLine2}
                </label>
              </div>
            </div>

            {/* <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">City :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.city}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">State :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.state}
                </label>
              </div>
            </div> */}

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Country :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.country}
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
                <label className="mb-0">Skills :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.candSkills}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">Start Date :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.startDate && dateFormatter(props.startDate)}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className="mb-0">End Date :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className="text-overflow_helper-label-modile-desktop mb-0">
                  {props.endDate && dateFormatter(props.endDate)}
                </label>
              </div>
            </div>
            {props.subStatusId !=
              CandSubmissionSubStatusIds.Default &&
              props.subStatusId !=
              CandSubmissionSubStatusIds.FULLY && (
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
                  <div className="row mb-2">
                    <div className="col-6">
                      <label className="mb-0">
                        Temp Credential Expiration Date :
                      </label>
                    </div>
                    <div className="col-6 text-left pl-0 pr-0">
                      <label className="text-overflow_helper-label-modile-desktop mb-0">
                        {props.endDate &&
                          dateFormatter(props.expirationDate)}
                      </label>
                    </div>
                  </div>
                </>
              )}
            {/* 

            <div className="mt-1 mb-2 text-overflow_helper"> :</div>
            <div className="mt-1 mb-2 text-overflow_helper"> :</div>
            <div className="mt-1 mb-2 text-overflow_helper"> :</div>
            <div className="mt-1 mb-2 text-overflow_helper"> :</div>
            <div className="mt-1 mb-2 text-overflow_helper">Contact# 1 :</div>
            <div className="mt-1 mb-2 text-overflow_helper">Contact# 2 :</div>
            <div className="mt-1 mb-2 text-overflow_helper">Address 1 :</div>
            <div className="mt-1 mb-2 text-overflow_helper">Address 2 :</div>
            <div className="mt-1 mb-2 text-overflow_helper">City :</div>
            <div className="mt-1 mb-2 text-overflow_helper">State :</div>
            <div className="mt-1 mb-2 text-overflow_helper">Country :</div>
            <div className="mt-1 mb-2 text-overflow_helper">Skills :</div>
            <div className="mt-1 mb-2 text-overflow_helper">Start Date :</div>
            <div className="mt-1 mb-2 text-overflow_helper">End Date :</div> */}
          </div>
          {/* <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.position}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.location}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.ssn}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.npi}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">
                {FormatPhoneNumber(props.contactNum1)}
              </label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">
                {FormatPhoneNumber(props.contactNum2)}
              </label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.addressLine1}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.addressLine2}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.city}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.state}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.country}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.candSkills}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">
                {props.assignmentStartDate !=null &&
                  props.assignmentStartDate !="" &&
                  props.assignmentStartDate !=undefined &&
                  dateFormatter(props.assignmentStartDate)}
              </label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">
                {props.endDate !=null &&
                  props.endDate !="" &&
                  props.endDate !=undefined &&
                  dateFormatter(props.endDate)}
              </label>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export const CandNameCell = (props) => {
  var pageUrl = CAND_SUB_VIEW_URL;

  if (props.dataItem.statusIntId==CandSubStatusIds.PENDINGSUBMISSION && auth.hasPermissionV2(AppPermissions.CAND_SUB_UPDATE)) {
    pageUrl = `${CAND_SUBMISSION_FORM_URL}${props.dataItem.reqId}/`; //Edit
  }
  else if ((props.dataItem.statusIntId==CandSubStatusIds.SUBMITTEDFORNAMECLEAR) && auth.hasPermissionV2(AppPermissions.CAND_SUB_NAME_CLEAR)) {
    pageUrl = `${CAND_SUB_NAME_CLEAR_URL}${props.dataItem.reqId}/`; //"View Name Clear
  }
  else if ((props.dataItem.statusIntId==CandSubStatusIds.PENDINGFORNAMECLEAR) && auth.hasPermissionV2(AppPermissions.CAND_SUB_NAME_CLEAR_CLIENT)) {
    pageUrl = `${CAND_SUB_NAME_CLEAR_URL}${props.dataItem.reqId}/`; //"View Name Clear - Delegated
  }
  else if (props.dataItem.statusIntId==CandSubStatusIds.PENDINGFORRISKATTESTATION && auth.hasPermissionV2(AppPermissions.CAND_SUB_RISK_CREATE)) {
    pageUrl = `${CAND_SUB_RISK_ATTESTATION_URL}${props.dataItem.reqId}/`; //Submit Risk Attestation
  }
  else if (props.dataItem.statusIntId==CandSubStatusIds.PENDINGFORRISKCLEARANCE && auth.hasPermissionV2(AppPermissions.CAND_SUB_RISK_VIEW)) {
    pageUrl = `${CAND_SUB_RISK_CLEARANCE_URL}${props.dataItem.reqId}/`; //View Risk Attestation
  }
  else if (props.dataItem.statusIntId==CandSubStatusIds.PENDINGFORVENDORPRESENTATION && auth.hasPermissionV2(AppPermissions.CAND_SUB_VENDOR_PRESENT_CREATE)) {
    pageUrl = `${CAND_SUBMIT_PRESENTATION_URL}`; //Submit Presentation
  }
  //else if (props.dataItem.statusIntId==CandSubStatusIds.VENDORPRESENTATIONSUBMITTED && auth.hasPermissionV2(AppPermissions.CAND_SUB_BILL_RATE_CREATE)) {
  //    pageUrl = `${CAND_SUBMIT_PRESENTATION_URL}${props.dataItem.reqId}/${props.dataItem.candSubmissionId}`; //View Bill Rate Status
  //}
  else if ((props.dataItem.statusIntId==CandSubStatusIds.VENDORPRESENTATIONSUBMITTED ||
    props.dataItem.statusIntId==CandSubStatusIds.PENDINGFORCLIENTPRESENTATION) && (auth.hasPermissionV2(AppPermissions.CAND_SUB_VENDOR_PRESENT_VIEW)
      || auth.hasPermissionV2(AppPermissions.CAND_SUB_CLIENT_PRESENT_VIEW))) {
    pageUrl = `${CAND_PRESENTATION_URL}`; //View Presentation ,View Client Presentation
  }
  else if ((props.dataItem.statusIntId==CandSubStatusIds.PENDINGSCHEDULEINTERVIEW ||
    props.dataItem.statusIntId==CandSubStatusIds.INTERVIEWINPROGRESS) && (auth.hasPermissionV2(AppPermissions.CAND_INTVW_SCHEDULE)
      || auth.hasPermissionV2(AppPermissions.CAND_INTVW_VIEW))) {
    pageUrl = `${INTERVIEW_DETAILS}`; //View Interview Details
  }
  else if ((props.dataItem.statusIntId==CandSubStatusIds.PENDINGOFFER
    || props.dataItem.statusIntId==CandSubStatusIds.OFFERSUBMITTED) && (auth.hasPermissionV2(AppPermissions.CAND_SUB_OFFER_CREATE)
      || auth.hasPermissionV2(AppPermissions.CAND_SUB_OFFER_VIEW))) {
    pageUrl = `${OFFER_INFORMATION}`; //Submit Offer,View Offer
  }
  else if ((props.dataItem.statusIntId >= 29 && props.dataItem.statusIntId <= 35 && props.dataItem.statusIntId !=32 && props.dataItem.statusIntId !=33)
    && auth.hasPermissionV2(AppPermissions.CAND_ONBOARD_TASK_VIEW)) {
    pageUrl = `${VIEW_ONBOARDING}`; //View Onboarding
  }
  else if ((props.dataItem.statusIntId==CandSubStatusIds.ASSIGNMENTCREATED &&
    props.dataItem.subStatusId ==CandSubmissionSubStatusIds.Temporary) && auth.hasPermissionV2(AppPermissions.CAND_ONBOARD_TASK_VIEW)) {
    pageUrl = `${VIEW_ONBOARDING}`; //View Onboarding
  }
  else if (props.dataItem.statusIntId==CandSubStatusIds.READYTOWORK && auth.hasPermissionV2(AppPermissions.CAND_SUB_ASSIGNMENT_CREATE)) {
    pageUrl = `${CREATE_ASSIGNMENT}`; //Create Assignment
  }

  return (
    <td contextMenu="Candidate Name">
      <Link
        className="orderNumberTd orderNumberTdBalck"
        to={pageUrl + props.dataItem.candSubmissionId}
        style={{ color: "#007bff" }}
      >
        {props.dataItem.candidateName}
      </Link>
    </td>
  );
};

export function DefaultActions(props, isVendorRole) {
  const { dataItem } = props;
  var defaultActions = [
    {
      action: "View Name Clear",
      permCode: AppPermissions.CAND_SUB_NAME_CLEAR,
      nextState: "",
      icon: "faEye",
      linkUrl: `${CAND_SUB_NAME_CLEAR_URL}${dataItem.reqId}/${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.SUBMITTEDFORNAMECLEAR
            ? "block"
            : "none",
      },
    },
    {
      action: "View Name Clear",
      permCode: AppPermissions.CAND_SUB_NAME_CLEAR_CLIENT,
      nextState: "",
      icon: "faEye",
      linkUrl: `${CAND_SUB_NAME_CLEAR_URL}${dataItem.reqId}/${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.PENDINGFORNAMECLEAR
            ? "block"
            : "none",
      },
    },
    {
      action: "Edit",
      permCode: AppPermissions.CAND_SUB_UPDATE,
      nextState: "",
      icon: "faPencilAlt",
      linkUrl: `${CAND_SUBMISSION_FORM_URL}${dataItem.reqId}/${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.PENDINGSUBMISSION
            ? "block"
            : "none",
      },
    },
    {
      action: "Remove",
      permCode: AppPermissions.CAND_SUB_DELETE,
      nextState: "",
      icon: "faTrashAlt",
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.PENDINGSUBMISSION
            ? "block"
            : "none",
      },
    },
    {
      action: "Submit Risk Attestation",
      permCode: AppPermissions.CAND_SUB_RISK_CREATE,
      nextState: "",
      icon: "faCheckCircle",
      linkUrl: `${CAND_SUB_RISK_ATTESTATION_URL}${dataItem.reqId}/${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.PENDINGFORRISKATTESTATION
            ? "block"
            : "none",
      },
    },
    {
      action: "View Risk Attestation",
      permCode: AppPermissions.CAND_SUB_RISK_VIEW,
      nextState: "",
      icon: "faEye",
      linkUrl: `${CAND_SUB_RISK_CLEARANCE_URL}${dataItem.reqId}/${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.PENDINGFORRISKCLEARANCE
            ? "block"
            : "none",
      },
    },
    {
      action: "Submit Presentation",
      permCode: AppPermissions.CAND_SUB_VENDOR_PRESENT_CREATE,
      nextState: "",
      icon: "faCheckSquare",
      linkUrl: `${CAND_SUBMIT_PRESENTATION_URL}${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.PENDINGFORVENDORPRESENTATION
            ? "block"
            : "none",
      },
    },
    {
      action: "View Presentation",
      permCode: AppPermissions.CAND_SUB_VENDOR_PRESENT_VIEW,
      nextState: "",
      icon: "faEye",
      linkUrl: `${CAND_PRESENTATION_URL}${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.VENDORPRESENTATIONSUBMITTED
            ? "block"
            : "none",
      },
    },
    {
      action: "View Client Presentation",
      permCode: AppPermissions.CAND_SUB_CLIENT_PRESENT_VIEW,
      nextState: "",
      icon: "faEye",
      linkUrl: `${CAND_PRESENTATION_URL}${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.PENDINGFORCLIENTPRESENTATION
            ? "block"
            : "none",
      },
    },
    {
      action: "Schedule Interview",
      permCode: AppPermissions.CAND_INTVW_SCHEDULE,
      nextState: "",
      icon: "faCalendarAlt",
      linkUrl: `${CAND_SUB_SCHEDULE_INTERVIEW_URL}${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.PENDINGSCHEDULEINTERVIEW ||
            dataItem.statusIntId==CandSubStatusIds.INTERVIEWINPROGRESS
            ? "block"
            : "none",
      },
    },
    {
      action: "Capture Round Result",
      permCode: AppPermissions.CAND_INTVW_RESULT_CREATE,
      nextState: "",
      icon: "faFileSignature",
      linkUrl: `${CAPTURE_ROUND_RESULT}${dataItem.candSubmissionId}/${dataItem.interviewId}`,
      cssStyle: {
        display:
          dataItem.interviewId !=null &&
            dataItem.statusIntId==CandSubStatusIds.INTERVIEWINPROGRESS
            ? "block"
            : "none",
      },
    },
    {
      action: "View Interview Details",
      permCode: AppPermissions.CAND_INTVW_VIEW,
      nextState: "",
      icon: "faEye",
      linkUrl: `${INTERVIEW_DETAILS}${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.INTERVIEWINPROGRESS || dataItem.statusIntId==CandSubStatusIds.PENDINGSCHEDULEINTERVIEW
            ? "block"
            : "none",
      },
    },
    // {
    //   action: "Cancel Interview",
    //   permCode: AppPermissions.CAND_INTVW_CANCEL,
    //   nextState: "",
    //   icon: "faTimesCircle",
    //   cssStyle: {
    //     display:
    //       dataItem.interviewId !=null &&
    //         dataItem.statusIntId==CandSubStatusIds.INTERVIEWINPROGRESS
    //         ? "block"
    //         : "none",
    //   },
    // },
    {
      action: "Submit Offer",
      permCode: AppPermissions.CAND_SUB_OFFER_CREATE,
      nextState: "",
      icon: "faFileSignature",
      linkUrl: `${OFFER_INFORMATION}${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.PENDINGOFFER
            ? "block"
            : "none",
      },
    },
    {
      action: "View Offer",
      permCode: AppPermissions.CAND_SUB_OFFER_VIEW,
      nextState: "",
      icon: "faFileSignature",
      linkUrl: `${OFFER_INFORMATION}${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.OFFERSUBMITTED
            ? "block"
            : "none",
      },
    },
    {
      action: "View Onboarding",
      permCode: AppPermissions.CAND_ONBOARD_TASK_VIEW,
      nextState: "",
      icon: "faEye",
      linkUrl: `${VIEW_ONBOARDING}${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.PENDINGONBOARDING ||
            dataItem.statusIntId==CandSubStatusIds.ONBOARDINGSUBMITTED ||
            dataItem.statusIntId ==CandSubStatusIds.PENDINGCREDENTIALING ||
            (dataItem.subStatusId ==CandSubmissionSubStatusIds.Temporary &&
              dataItem.statusIntId ==CandSubStatusIds.READYTOWORK &&
              !isVendorRole) ||
            (dataItem.subStatusId ==CandSubmissionSubStatusIds.Temporary &&
              dataItem.statusIntId ==CandSubStatusIds.ASSIGNMENTCREATED &&
              !isVendorRole)
            ? "block"
            : "none",
      },
    },
    {
      action: "Start Assignment",
      permCode: AppPermissions.CAND_SUB_ASSIGNMENT_CREATE,
      nextState: "",
      icon: "faFileSignature",
      linkUrl: `${CREATE_ASSIGNMENT}${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubStatusIds.READYTOWORK
            ? "block"
            : "none",
      },
    },
    {
      action: "Edit Presentation Info",
      permCode: AppPermissions.EDIT_PRESENTATION_INFO,
      nextState: "",
      icon: "faPencilAlt",
      linkUrl: `${CANDIDATE_PRESENTATION_INFO}${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          (dataItem.statusIntId==CandSubStatusIds.VENDORPRESENTATIONSUBMITTED ||
          dataItem.statusIntId==CandSubStatusIds.PENDINGFORCLIENTPRESENTATION ||
          dataItem.statusIntId==CandSubStatusIds.INTERVIEWINPROGRESS ||
          dataItem.statusIntId==CandSubStatusIds.PENDINGOFFER)
            ? "block"
            : "none",
      },
    },
    {
      // Last Action
      action: "Candidate Status",
      permCode: AppPermissions.CAND_SUB_VIEW,
      nextState: "",
      icon: "faArrowLeft",
    },
    {
      action: "View Events",
      permCode: AppPermissions.EVENT_VIEW,
      nextState: "",
      icon: "faEye",
      linkUrl:`/admin/eventslogs/manage/${dataItem.candSubmissionId}`,
    },
  ];
  return defaultActions;
}
