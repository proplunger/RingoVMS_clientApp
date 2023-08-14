
import * as React from "react";
import { CAND_SUB_BOOK_TIMESLOT_URL, CAND_SUB_SCHEDULE_EDIT_INTERVIEW_URL, CAND_SUB_SCHEDULE_INTERVIEW_URL, CAPTURE_ROUND_RESULT } from "../../../Shared/ApiUrls";
import { CandSubInterviewStatusIds, CandSubStatusIds } from "../../../Shared/AppConstants";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { GridCell, GridDetailRow, GridHeaderCell, } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faFileExcel, faList, faShare } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../Auth";
import ReactExport from "react-data-export";
import { history, dateFormatter } from "../../../../HelperMethods";
import { MenuRender } from "../../../Shared/GridComponents/CommonComponents";
import { convertShiftDateTime } from "../../../ReusableComponents";

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
    filename="Schedule Interview"
  >
    <ExcelSheet data={data} name="Schedule Interview">
      <ExcelColumn label="Round" value="round" />
      <ExcelColumn label="Title" value="title" />
      <ExcelColumn label="Medium" value="medium" />
      <ExcelColumn label="Interviewer" value="hiringManager" />
      <ExcelColumn
        label="Interview Date"
        value={(col) => col.interviewDate != null ? dateFormatter(col.interviewDate) : ''}
      />
      <ExcelColumn label="Status" value="status" />
      <ExcelColumn label="Start Time" value="interviewStartTime" />
      <ExcelColumn label="End Time" value="interviewEndTime" />
    </ExcelSheet>
  </ExcelFile>
);

export const CustomeHeaderCell = (
  excelData,
  candSubId,
  enableCancelSelectedInterviews,
  cancelSelectedInterviewsFunction,
  statusIntId
) => {
  return (
    <Menu
      openOnClick={true}
      className="actionItemMenu actionItemMenuThreeDots"
    >
      <MenuItem render={MenuRender}>
        {auth.hasPermissionV2(AppPermissions.CAND_INTVW_CREATE) &&
          statusIntId < CandSubStatusIds.ASSIGNMENTCREATED && (
            <MenuItem render={() => SchdeuleInterview(candSubId)} />
          )}
        {auth.hasPermissionV2(AppPermissions.CAND_INTVW_CANCEL) &&
          statusIntId < CandSubStatusIds.ASSIGNMENTCREATED && (
            <MenuItem
              disabled={!enableCancelSelectedInterviews}
              render={() =>
                CancelSelectedInterviews(cancelSelectedInterviewsFunction)
              }
            />
          )}
        <MenuItem render={() => ExportExcel(excelData)} />
      </MenuItem>
    </Menu>
  );
};

export const SchdeuleInterview = (candSubId) => {
  return (
    <div
      className="pb-1 pt-1 w-100 myorderGlobalicons"
      onClick={() => history.push(`${CAND_SUB_SCHEDULE_INTERVIEW_URL}${candSubId}`)}
    >
      <FontAwesomeIcon
        icon={faCalendarAlt}
        className={"nonactive-icon-color ml-2 mr-2"}
      ></FontAwesomeIcon>
        Schedule Interview
    </div>
  );
};

export const CancelSelectedInterviews = (cancelSelectedInterviewsFunction) => {
  return (
    <div
      className="pb-1 pt-1 w-100 myorderGlobalicons"
      onClick={() => cancelSelectedInterviewsFunction()}
    >
      <FontAwesomeIcon
        icon={faShare}
        className={"nonactive-icon-color ml-2 mr-2"}
      ></FontAwesomeIcon>
        Cancel Selected Interviews
    </div>
  );
};

export class DetailColumnCell extends React.Component<{
  dataItem: any;
  expandChange: any;
}> {
  render() {
    let dataItem = this.props.dataItem;
    return (
      <td contextMenu="View More" style={{ textAlign: "center" }}>
        <FontAwesomeIcon
          icon={faList}
          style={{
            marginLeft: "0px!important",
            marginTop: "0",
            fontSize: "16px",
          }}
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
          <div className="col-6 col-md-3 pl-0 text-right">
            <div className="mt-1 mb-2 text-overflow_helper">Duration :</div>
            <div className="mt-1 mb-2 text-overflow_helper">Start Time :</div>
            <div className="mt-1 mb-2 text-overflow_helper">End Time :</div>
          </div>
          <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.duration}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.interviewStartTime !=null &&
                props.interviewStartTime !="" &&
                props.interviewStartTime !=undefined &&
                (props.interviewStartTime)}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.interviewEndTime !=null &&
                props.interviewEndTime !="" &&
                props.interviewEndTime !=undefined &&
                (props.interviewEndTime)}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function DefaultActions(props, reqId) {
  const { dataItem } = props;
  var defaultActions = [
    {
      action: "View Round Result",
      permCode: AppPermissions.CAND_INTVW_RESULT_VIEW,
      nextState: "",
      icon: "faEye",
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubInterviewStatusIds.COMPLETED ||
            dataItem.statusIntId==CandSubInterviewStatusIds.ACTIVE
            ? "block"
            : "none",
      },
      linkUrl: `${CAPTURE_ROUND_RESULT}${dataItem.candSubmissionId}/${dataItem.candSubInterviewId}`,
    },
    {
      action: "Capture Round Result",
      permCode: AppPermissions.CAND_INTVW_RESULT_CREATE,
      nextState: "",
      icon: "faFileSignature",
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubInterviewStatusIds.SCHEDULED
            ? "block"
            : "none",
      },
      linkUrl: `${CAPTURE_ROUND_RESULT}${dataItem.candSubmissionId}/${dataItem.candSubInterviewId}`,
    },
    // Manage Interview grid default action
    {
      action: "View Timeslots",
      permCode: AppPermissions.CAND_INTVW_SLOT_VIEW,
      nextState: "",
      icon: "faEye",
      linkUrl: `${CAND_SUB_BOOK_TIMESLOT_URL}${dataItem.candSubInterviewId}/${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId ==
            CandSubInterviewStatusIds.PENDINGCONFIRMATION || dataItem.statusIntId ==
            CandSubInterviewStatusIds.RESCHEDULED
            ? "block"
            : "none",
      },
    },
    {
      action: "Edit",
      permCode: AppPermissions.CAND_INTVW_UPDATE,
      nextState: "",
      icon: "faPencilAlt",
      linkUrl: `${CAND_SUB_SCHEDULE_EDIT_INTERVIEW_URL}${dataItem.candSubInterviewId}/${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubInterviewStatusIds.DRAFT ||
            dataItem.statusIntId==CandSubInterviewStatusIds.PENDINGCONFIRMATION
            ? "block"
            : "none",
      },
    },
    {
      action: "Remove",
      permCode: AppPermissions.CAND_INTVW_DELETE,
      nextState: "",
      icon: "faTrashAlt",
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubInterviewStatusIds.CANCELLED ||
            dataItem.statusIntId==CandSubInterviewStatusIds.DRAFT
            ? "block"
            : "none",
      },
    },
    {
      action: "Cancel Interview",
      permCode: AppPermissions.CAND_INTVW_CANCEL,
      nextState: "",
      icon: "faTimes",
      cssStyle: {
        display:
          dataItem.statusIntId ==
            CandSubInterviewStatusIds.PENDINGCONFIRMATION ||
            dataItem.statusIntId==CandSubInterviewStatusIds.SCHEDULED ||
            dataItem.statusIntId==CandSubInterviewStatusIds.RESCHEDULED
            ? "block"
            : "none",
      },
    },
    {
      action: "Resend To Vendor",
      permCode: AppPermissions.CAND_INTVW_REQUEST,
      nextState: "",
      icon: "faArrowLeft",
      linkUrl: `${CAND_SUB_SCHEDULE_EDIT_INTERVIEW_URL}${dataItem.candSubInterviewId}/${dataItem.candSubmissionId}`,
      cssStyle: {
        display:
          dataItem.statusIntId==CandSubInterviewStatusIds.CANCELLED
            ? "block"
            : "none",
      },
    },
  ];
  return defaultActions;
}