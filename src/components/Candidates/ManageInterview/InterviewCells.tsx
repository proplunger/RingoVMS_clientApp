import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import ReactExport from "react-data-export";
import { dateFormatter } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faFileExcel,
  faColumns,
  faCalendarAlt,
  faTimesCircle,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { MenuRender } from "../../Shared/GridComponents/CommonComponents";
import { CandSubInterviewStatusIds } from "../../Shared/AppConstants";
import {
  Controllers,
  CandidateControllerActions,
} from "../../Shared/AppPermissions";
import { GridDetailRow } from "@progress/kendo-react-grid";
import auth from "../../Auth";
import { history } from "../../../HelperMethods";
import {
  CAND_SUB_SCHEDULE_INTERVIEW_URL,
  CAND_SUB_BOOK_TIMESLOT_URL,
  CAND_SUB_SCHEDULE_EDIT_INTERVIEW_URL,
} from "../../Shared/ApiUrls";
import { convertShiftDateTime } from "../../ReusableComponents";
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
      <ExcelColumn label="Start Time" value="startTime" />
      <ExcelColumn label="End Time" value="endTime" />
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

export const CustomMenu = (
  excelData,
  candSubId,
  enableCancelSelectedInterviews,
  cancelSelectedInterviewsFunction
) => {
  return (
    <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
      <MenuItem render={MenuRender}>
        {auth.hasPermissionV2(AppPermissions.CAND_SUB_NAME_CLEAR) && <MenuItem render={() => SchdeuleInterview(candSubId)} />}
        {auth.hasPermissionV2(AppPermissions.CAND_SUB_CREATE) && (
          <MenuItem
            disabled={!enableCancelSelectedInterviews}
            render={() =>
              CancelSelectedInterviews(cancelSelectedInterviewsFunction)
            }
          />
        )}
        <MenuItem render={() => ExportExcel(excelData)} />
        {/* <MenuItem render={Columns} /> */}
      </MenuItem>
    </Menu>
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
          <div className="col-12 pl-0 text-right">
            <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Duration :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                  {props.duration}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>Start Time :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                  {(props.startTime)}
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label className='mb-0'>End Time :</label>
              </div>
              <div className="col-6 text-left pl-0 pr-0">
                <label className='text-overflow_helper-label-modile-desktop mb-0'>
                  {(props.endTime)}
                </label>
              </div>
            </div>
            {/* <div className="mt-1 mb-2 text-overflow_helper">Duration :</div>
            <div className="mt-1 mb-2 text-overflow_helper">Start Time :</div>
            <div className="mt-1 mb-2 text-overflow_helper">End Time :</div> */}
          </div>
          {/* <div className="col-6 col-md-7 pl-0 pr-0 col-sm-auto font-weight-bold text-left">
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{props.duration}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{(props.startTime)}</label>
            </div>
            <div className="mt-1 mb-2 text-overflow_helper">
              <label className="mb-0">{(props.endTime)}</label>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export function DefaultActions(props) {
  const { dataItem } = props;
  var defaultActions = [
    {
      action: "View Timeslots",
      permCode: AppPermissions.CAND_INTVW_SLOT_VIEW,
      nextState: "",
      icon: "faEye",
      linkUrl: `${CAND_SUB_BOOK_TIMESLOT_URL}${dataItem.candSubInterviewId}/${dataItem.candSubmissionId}`,
      cssStyle: { display: dataItem.statusIntId==CandSubInterviewStatusIds.PENDINGCONFIRMATION ? "block" : "none" },
    },
    {
      action: "Edit",
      permCode: AppPermissions.CAND_INTVW_UPDATE,
      nextState: "",
      icon: "faPencilAlt",
      linkUrl: `${CAND_SUB_SCHEDULE_EDIT_INTERVIEW_URL}${dataItem.candSubInterviewId}/${dataItem.candSubmissionId}`,
      cssStyle: { display: dataItem.statusIntId==CandSubInterviewStatusIds.DRAFT ? "block" : "none" },
    },
    {
      action: "Remove",
      permCode: AppPermissions.CAND_INTVW_DELETE,
      nextState: "",
      icon: "faTrashAlt",
      cssStyle: {
        display: dataItem.statusIntId==CandSubInterviewStatusIds.CANCELLED
          || dataItem.statusIntId==CandSubInterviewStatusIds.DRAFT ? "block" : "none"
      },
    },
    {
      action: "Cancel Interview",
      permCode: AppPermissions.CAND_INTVW_CANCEL,
      nextState: "",
      icon: "faTimes",
      cssStyle: {
        display: dataItem.statusIntId==CandSubInterviewStatusIds.PENDINGCONFIRMATION
          || dataItem.statusIntId==CandSubInterviewStatusIds.SCHEDULED
          || dataItem.statusIntId==CandSubInterviewStatusIds.RESCHEDULED ? "block" : "none"
      },
    },
    {
      action: "Resend To Vendor",
      permCode: AppPermissions.CAND_INTVW_REQUEST,
      nextState: "",
      icon: "faArrowLeft",
      cssStyle: { display: dataItem.statusIntId==CandSubInterviewStatusIds.CANCELLED ? "block" : "none" },
    },
  ];
  return defaultActions;
}
