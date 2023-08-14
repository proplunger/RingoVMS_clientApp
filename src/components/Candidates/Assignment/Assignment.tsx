import * as React from "react";
import Collapsible from "react-collapsible";
import axios from "axios";
import auth from "../../Auth";
import PageTitle from "../../Shared/Title";
import CandidateInformation from "../../Shared/CandidateInformation/CandidateInformation";
import { candTriggerName } from "../../ReusableComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comment } from "../../Shared/Comment/Comment";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import {
  REJECT_OFFER_MSG,
  REJECT_OFFER_SUCCESS_MSG,
  ASSIGNMENT_CREATED_SUCCESS_MSG,
  ASSIGN_CANDIDATE_MSG,
  ASSIGN_START_DATE_LESS_THAN_REQ_END_DATE,
  ASSIGN_REQ_DATE_GREATER_THAN_START_DATE,
  REJECT_ASSIGNMENT,
  REJECT_ASSIGNMENT_SUCCESS_MSG,
  ASSIGN_END_DATE_LESS_THAN_REQ_END_DATE,
  ASSIGN_REQ_DATE_GREATER_THAN_END_DATE,
  ASSIGN_END_DATE_GREATER_THAN_START_DATE,
  ASSIGN_START_DATE_LESS_THAN_END_DATE,
} from "../../Shared/AppMessages";
import {
  EntityType,
  CandidateWorkflow,
  CandidateWorkflowActionBtns
} from "../../Shared/AppConstants";
import { history, successToastr, dateFormatter, localDateTime } from "../../../HelperMethods";
import FormActions from "../../Shared/Workflow/FormActions";
import { CAND_SUB_MANAGE_URL } from "../../Shared/ApiUrls";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import RejectModal from "../../Shared/RejectModal";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { ErrorComponent } from "../../ReusableComponents";
import BillRateAndExpenses from "../BillRateAndExpenses/BillRateAndExpenses";
import CandSubPresentationInfo from "../../Shared/CandSubPresentationInfo/CandSubPresentationInfo";
import TasksComponent from "../CandidateOnBoarding/Task/TasksComponent";

export interface AssignmentProps {
  match: any;
}

export interface AssignmentState {
  candidateId?: string;
  locationId?: string;
  divisionId?: string;
  jobPositionId?: string;
  candSubmissionId?: string;
  location?: string;
  candidateEmail?: string;
  candidateName?: string;
  reqNo?: string;
  reqId?: string;
  status?: string;
  candSubDetails?: any;
  showLoader?: boolean;
  openCommentBox?: boolean;
  providerEmail?: string;
  startDate?: any;
  endDate?: any;
  reqEndDate?: any;
  reqStartDate?: any;
  subStatusId?: any;
  showRejectCandidateModal?: boolean;
  showAssignModal?: boolean;
  showError?: boolean;
  assign?: boolean;
  jobWfTypeId?: string;
  hideBtn: any;
  statusIntId?: any;
  candidatePhoneNumber?: string;
  candidateMobileNumber?: string;
  targetEndDate?: any;
}

const refCand = React.createRef<CandidateInformation>();

class Assignment extends React.Component<AssignmentProps, AssignmentState> {
  constructor(props: AssignmentProps) {
    super(props);
    this.state = {
      providerEmail: "",
      assign: false,
      hideBtn: [CandidateWorkflowActionBtns.SENDCREDENTIAL, CandidateWorkflowActionBtns.FULLYCREDENTIAL]
    };
  }

  action: string;
  statusId: string;
  eventName: string;
  actionId: string;

  componentDidMount() {
    const { subId } = this.props.match.params;
    this.setState({ candSubmissionId: subId });
    this.getCandidateSubmissionDetails(subId);
  }

  candInfoCallback = (candidateInfo) => {
    this.setState({
      candidateEmail: candidateInfo.email,
      candidateName: candidateInfo.name,
    });
  };

  async getCandidateSubmissionDetails(candSubmissionId) {
    await axios
      .get(`api/candidates/workflow/${candSubmissionId}`)
      .then((res) => {
        this.setState({
          reqNo: res.data.reqNumber,
          reqId: res.data.reqId,
          location: res.data.location,
          candSubDetails: res.data,
          candidateId: res.data.candidateId,
          status: res.data.status,
          startDate:
            res.data.startDate !=null && res.data.startDate !=undefined && res.data.startDate !=""
              ? localDateTime(res.data.startDate)
              : (res.data.targetStartDate !=null && res.data.targetStartDate !=undefined && res.data.targetStartDate !=""
              ? localDateTime(res.data.targetStartDate) : res.data.startDate),
          endDate:
            res.data.endDate !=null && res.data.endDate !=undefined && res.data.endDate !=""
              ? localDateTime(res.data.endDate)
              : (res.data.targetEndDate !=null && res.data.targetEndDate !=undefined && res.data.targetEndDate !=""
              ? localDateTime(res.data.targetEndDate) : res.data.endDate),
          reqStartDate: localDateTime(res.data.reqStartDate),
          reqEndDate: localDateTime(res.data.reqEndDate),
          targetEndDate: res.data.targetEndDate !=null && res.data.targetEndDate !=undefined && res.data.targetEndDate !="" 
          ? localDateTime(res.data.targetEndDate) : res.data.targetEndDate,
          subStatusId: res.data.subStatusId,
          showLoader: false,
          jobWfTypeId: res.data.jobWfTypeId,
          locationId: res.data.locationId,
          divisionId: res.data.divisionId,
          jobPositionId: res.data.jobPositionId,
          statusIntId: res.data.statusIntId,
        });
      });
  }

  handleActionClick = (action, nextStateId?, eventName?, actionId?) => {
    let change = {};
    let property = `show${action.replace(/ +/g, "")}Modal`;

    if (action=="Assign") {
      let error =
        this.state.startDate==null
          ? true
          : this.state.reqEndDate < this.state.startDate
            ? true
            : this.state.endDate < this.state.startDate
              ? true
              : false;

      this.setState({ showError: error, assign: true });

      change[property] = !error;

    } else {
      change[property] = true;
    }

    this.setState(change);
    this.statusId = nextStateId;
    this.eventName = eventName;
    this.actionId = actionId;

  };

  handleDisable = () => {
      var ele = document.getElementById("SubmitToHiringManager");
      if (ele) {
          ele.setAttribute("disabled", "true");
      }
  };

  handleEnable = () => {
      var ele = document.getElementById("SubmitToHiringManager");
      if (ele) {
          ele.removeAttribute("disabled");
      }
  };


  candidateStatusUpdate = (successMsg, modal, props?) => {
    this.setState({ showLoader: true, assign: true });
    const data = {
      candSubmissionId: this.state.candSubmissionId,
      startDate: localDateTime(this.state.startDate),
      endDate: localDateTime(this.state.endDate),
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      ...props,
    };

    axios
      .put("api/candidates/workflow/status", JSON.stringify(data))
      .then((res) => {
        successToastr(successMsg);
        this.setState({ showLoader: false, assign: false });
        // history.push("/candidate/manage/" + this.state.reqId);
        history.goBack();
      });

    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  handleChange = (e) => {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  render() {
    document.getElementsByName('startDate').length > 0 &&
      (document.getElementsByName('startDate')[0]['disabled'] = true);
      document.getElementsByName('endDate').length > 0 &&
      (document.getElementsByName('endDate')[0]['disabled'] = true)

    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3">
          <div className="col-12 p-0 shadow pt-1 pb-1">
            <PageTitle
              title="Assignment Creation"
              reqNumber={this.state.reqNo}
              candSubmissionId={this.state.candSubmissionId}
              pageUrl={`/requisitions/view/${this.state.reqId}`}
            />
            <div className="col-12">
              <Collapsible
                trigger={candTriggerName(
                  "Candidate Information",
                  this.state.status,
                  "",
                  this.state.subStatusId
                )}
                open={true}
              >
                {!this.state.showLoader &&
                  this.state.candSubDetails &&
                  this.state.candidateId && (
                    <CandidateInformation
                      ref={refCand}
                      callbackFromParent={this.candInfoCallback}
                      candidateId={this.state.candidateId}
                      location={this.state.location}
                      submissionData={this.state.candSubDetails}
                    />
                  )}
              </Collapsible>
              <Collapsible trigger={candTriggerName("Bill Rates and Expenses")} open={true}>
                  {this.state.candSubmissionId && this.state.candidateName && this.state.locationId && this.state.jobPositionId && (
                      <BillRateAndExpenses
                          candSubmissionId={this.state.candSubmissionId}
                          candidateName={this.state.candidateName}
                          locationId={this.state.locationId}
                          positionId={this.state.jobPositionId}
                          candidateSubStatusIntId={this.state.statusIntId}
                          divisionId={this.state.divisionId}
                          candidateSubStatus={this.state.status}
                          handleDisable={() => this.handleDisable()}
                          handleEnable={() => this.handleEnable()}
                      ></BillRateAndExpenses>
                  )}
              </Collapsible>
              <Collapsible trigger={candTriggerName("Presentation Information")} open={true}>
                  {this.state.candSubmissionId &&
                      this.state.candidateName &&
                      (
                          <CandSubPresentationInfo
                              candidatePhoneNumber={this.state.candidateMobileNumber ? this.state.candidateMobileNumber : this.state.candidatePhoneNumber}
                              candidateEmail={this.state.candidateEmail}
                              candSubmissionId={this.state.candSubmissionId}
                              isEnable={false} />
                      )}
              </Collapsible>
              <Collapsible trigger={candTriggerName("Onboarding")} open={true}>
                {!this.state.showLoader &&
                  this.state.candSubDetails &&
                  this.state.candidateId &&
                  this.state.reqId && (
                    <TasksComponent
                      clientId={localStorage.getItem("UserClientId")}
                      // ref={this.childRef}
                      reqId={this.state.reqId}
                      candidateId={this.state.candidateId}
                      candSubmissionId={this.state.candSubmissionId}
                      status={this.state.status}
                      statusIntId={this.state.statusIntId}
                      statusId={this.statusId}
                      eventName={this.eventName}
                      getAllTaskData={() => []}
                      // candidateTaskUpdate={this.candidateTaskUpdate}
                      getCandidateSubmissionDetails={() => this.getCandidateSubmissionDetails(this.state.candSubmissionId)}
                    />
                  )}
                {/* {(this.state.candSubOnboardingTaskIds.length==0 &&
                  this.state.showSendCredentialsModal) ? (
                  <ErrorComponent message={SELECT_ONE_TASK_TO_SEND} />
                ) : null} */}
              </Collapsible>

              <Collapsible
                trigger={candTriggerName("Assignment Information")}
                open={true}
              >
                <div className="row text-dark">
                  <div className="col-12 pl-0 pr-0">
                    <div className="row mx-auto">
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color">
                        <label className="mb-2 text-dark required font-weight-bold">
                          Start Date
                        </label>
                        <DatePicker
                          className="form-control"
                          format="MM/dd/yyyy"
                          name="startDate"
                          value={this.state.startDate}
                          onChange={(e) => this.handleChange(e)}
                          formatPlaceholder="formatPattern"
                          min={this.state.reqStartDate}
                          max={this.state.reqEndDate}
                        />
                        {this.state.assign &&
                          this.state.showError &&
                          this.state.startDate ==null ? (
                          <ErrorComponent />
                        ) : (this.state.assign && this.state.showError &&
                          this.state.startDate > this.state.reqEndDate) ? (
                          <ErrorComponent
                            message={ASSIGN_START_DATE_LESS_THAN_REQ_END_DATE}
                          />
                        ) : (
                          this.state.assign && this.state.showError &&
                          this.state.startDate < this.state.reqStartDate && (
                            <ErrorComponent
                              message={ASSIGN_REQ_DATE_GREATER_THAN_START_DATE}
                            />
                          )
                        ) ? (
                          this.state.assign && this.state.showError &&
                          this.state.startDate > this.state.endDate && (
                            <ErrorComponent
                              message={ASSIGN_START_DATE_LESS_THAN_END_DATE}
                            />
                          )
                        ) : this.state.assign && this.state.showError &&
                        this.state.startDate > this.state.endDate && (
                          <ErrorComponent
                            message={ASSIGN_START_DATE_LESS_THAN_END_DATE}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color">
                        <label className="mb-2 text-dark required font-weight-bold">
                          End Date
                        </label>
                        <DatePicker
                          className="form-control"
                          format="MM/dd/yyyy"
                          name="endDate"
                          value={this.state.endDate}
                          onChange={(e) => this.handleChange(e)}
                          formatPlaceholder="formatPattern"
                          min={this.state.reqStartDate}
                          max={this.state.reqEndDate}
                        />
                        {this.state.assign &&
                          this.state.showError &&
                          this.state.endDate ==null ? (
                          <ErrorComponent />
                        ) : (this.state.assign && this.state.showError &&
                          this.state.endDate > this.state.reqEndDate) ? (
                          <ErrorComponent
                            message={ASSIGN_END_DATE_LESS_THAN_REQ_END_DATE}
                          />
                        ) : (
                          this.state.assign && this.state.showError &&
                          this.state.endDate < this.state.reqStartDate && (
                            <ErrorComponent
                              message={ASSIGN_REQ_DATE_GREATER_THAN_END_DATE}
                            />
                          )
                        ) ? (
                          this.state.assign && this.state.showError &&
                          this.state.endDate < this.state.startDate && (
                            <ErrorComponent
                              message={ASSIGN_END_DATE_GREATER_THAN_START_DATE}
                            />
                          )
                        ) : this.state.assign && this.state.showError &&
                        this.state.endDate < this.state.startDate && (
                          <ErrorComponent
                            message={ASSIGN_END_DATE_GREATER_THAN_START_DATE}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 flex mt-2 mb-2 mb-sm-0 mt-sm-0">
                        <label className="mb-0 font-weight-bold ">
                          Comments
                        </label>
                        <span
                          onClick={() =>
                            this.setState({ openCommentBox: true })
                          }
                          className="text-underline cursorElement align-middle"
                        >
                          <FontAwesomeIcon
                            icon={faClock}
                            className="ml-1 active-icon-blue ClockFontSize"
                          />
                        </span>
                        <Comment
                          entityType={EntityType.CANDSUBMISSION}
                          entityId={this.state.candSubmissionId}
                        />
                      </div>

                      {this.state.openCommentBox && (
                        <CommentHistoryBox
                          entityType={EntityType.CANDSUBMISSION}
                          entityId={this.state.candSubmissionId}
                          showDialog={this.state.openCommentBox}
                          handleNo={() => {
                            this.setState({ openCommentBox: false });
                            document.body.style.position = "";
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Collapsible>
            </div>
            <hr />
          </div>
        </div>
        {this.state.status && this.state.jobWfTypeId && (
          <FormActions
            wfCode={CandidateWorkflow.CANDIDATE}
            jobWfTypeId={this.state.jobWfTypeId}
            currentState={this.state.status}
            handleClick={this.handleActionClick}
            // cancelUrl={`${CAND_SUB_MANAGE_URL}${this.state.reqId}`}
            handleClose={() => history.goBack()}
            hideBtn={this.state.hideBtn}
          />
        )}
        <ConfirmationModal
          message={ASSIGN_CANDIDATE_MSG}
          showModal={this.state.showAssignModal}
          handleYes={(e) =>
            this.candidateStatusUpdate(
              ASSIGNMENT_CREATED_SUCCESS_MSG,
              "showAssignModal"
            )
          }
          handleNo={() => {
            this.setState({ showAssignModal: false });
          }}
        />
        {this.state.showRejectCandidateModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={REJECT_ASSIGNMENT(null)}
                    showModal={this.state.showRejectCandidateModal}
            handleYes={(data) =>
              this.candidateStatusUpdate(
                  REJECT_ASSIGNMENT_SUCCESS_MSG,
                "showRejectModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showRejectCandidateModal: false });
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Assignment;
