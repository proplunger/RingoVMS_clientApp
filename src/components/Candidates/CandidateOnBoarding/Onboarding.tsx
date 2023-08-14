import * as React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageTitle from "../../Shared/Title";
import CandidateInformation from "../../Shared/CandidateInformation/CandidateInformation";
import Collapsible from "react-collapsible";
import SkeletonWidget from "../../Shared/Skeleton";
import { candTriggerName, ErrorComponent } from "../../ReusableComponents";
import TasksComponent from "./Task/TasksComponent";
import {
  NO_DOC_FOR_CREDENTIALING,
  REJECT_CANDIDATE,
  REJECT_CANDIDATE_SUCCESS_MSG,
  SAVE_UNSAVED_INTERVIEW_RESULT,
  SELECT_ATLEAST_ONE_SUBMITTED,
  SELECT_ATLEAST_ONE_TASK,
  SELECT_ONE_TASK_TO_SEND,
  SELECT_ONLY_SUBMITTED_TASK,
  SELECT_SUBMITTED_TASK,
  TASK_WARNING_MSG,
  TEMP_CRED_MSG,
  WITHDRAW_CANDIDATE,
  WITHDRAW_CANDIDATE_SUCCESS_MSG,
} from "../../Shared/AppMessages";
import {
  AuthRoleType,
  CandidateWorkflow,
  CandidateWorkflowActionBtns,
  EntityType,
  isRoleType
} from "../../Shared/AppConstants";
import { Comment } from "../../Shared/Comment/Comment";
import FormActions from "../../Shared/Workflow/FormActions";
import { CAND_SUB_MANAGE_URL } from "../../Shared/ApiUrls";
import CloseLink from "../../Shared/CloseLink";
import { ConfirmationModal } from "../../Shared/ConfirmationModal";
import {
  SUBMIT_ONBOARD_MSG,
  FULLY_CREDENTIALS_ONBOARD_MSG,
  TEMP_CRED_ONBOARD_SUCCESS_MSG,
  FULLY_CRED_ONBOARD_SUCCESS_MSG,
  SEND_BACK_SUCCESS_MSG,
  SEND_BACK_MSG,
  SUBMIT_ONBOARD_SUCCESS_MSG,
} from "../../Shared/AppMessages";
import {
  NotificationTypeIds,
  CandSubOnBoardTaskStatusIds
} from "../../Shared/AppConstants";
import { Dialog } from "@progress/kendo-react-dialogs";
import SendCredentials from "./SendCredentials/SendCredentials";
import { errorToastr, history, successToastr, warningToastr } from "../../../HelperMethods";
import RejectModal from "../../Shared/RejectModal";
import TemporaryModal from "./Task/TemparoryModal";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import BillRateAndExpenses from "../BillRateAndExpenses/BillRateAndExpenses";
import CandSubPresentationInfo from "../../Shared/CandSubPresentationInfo/CandSubPresentationInfo";
export interface ViewOnboardingProps {
  match: any;
}

export interface ViewOnboardingState {
  reqId: string;
  reqNo: string;
  location: string;
  candidateEmail?: string;
  candidatePhoneNumber?: string;
  candidateMobileNumber?: string;
  candSubDetails: any;
  showLoader?: boolean;
  openCommentBox?: boolean;
  candSubmissionId?: string;
  candSubOnboardingTaskIds?: any;
  candidateId?: string;
  status?: string;
  statusIntId?: any;
  subStatusId?: string;
  candidateName?: string;
  showCandidateOwnershipModal?: boolean;
  showSubmitModal?: boolean;
  showSendCredentialsModal?: boolean;
  showSendBackModal?: boolean;
  showFullyCredentialModal?: boolean;
  showTemporaryCredentialModal?: boolean;
  hideBtn?: any;
  showRejectCandidateModal?: boolean;
  showWithdrawModal?: boolean;
  jobWfTypeId?: string;
  showUnsavedTasksModal?: boolean
  isVendorRole?: any;
  positionId?: string;
  locationId?: string;
  divisionId?: string;
  jobPositionId?: string;
}

class ViewOnboarding extends React.Component<
  ViewOnboardingProps,
  ViewOnboardingState
> {
  childRef: React.RefObject<TasksComponent> = React.createRef();
  action: string;
  actionId: string;
  statusId: string;
  eventName: string;
  hasUnsavedData: [];
  constructor(props: ViewOnboardingProps) {
    super(props);
    this.state = {
      reqId: "",
      reqNo: "",
      location: "",
      candSubDetails: {},
      candSubOnboardingTaskIds: [],
      hideBtn: [],
      isVendorRole: isRoleType(AuthRoleType.Vendor),
    };
  }

  componentDidMount() {
    const { subId } = this.props.match.params;
    this.setState({ candSubmissionId: subId });
    this.getCandidateSubmissionDetails(subId);
  }

  async getCandidateSubmissionDetails(candSubmissionId) {
    this.setState({ showLoader: true, status: "" });
    await axios
      .get(`api/candidates/workflow/${candSubmissionId}`)
      .then((res) => {
        this.setState({
          reqNo: res.data.reqNumber,
          reqId: res.data.reqId,
          candSubDetails: res.data,
          candidateId: res.data.candidateId,
          location: res.data.location,
          status: res.data.status,
          statusIntId: res.data.statusIntId,
          subStatusId: res.data.subStatusId,
          showLoader: false,
          jobWfTypeId: res.data.jobWfTypeId,
          locationId: res.data.locationId,
          divisionId: res.data.divisionId,
          positionId: res.data.positionId,
          jobPositionId: res.data.jobPositionId,
        });
      });
  }

  candInfoCallback = (candidateInfo) => {
    this.setState({
      candidateEmail: candidateInfo.email,
      candidateName: candidateInfo.name,
      candidatePhoneNumber: candidateInfo.phoneNumber,
      candidateMobileNumber: candidateInfo.mobileNumber,
    });
  };

  getAllTaskData = (data) => {
    this.checkTemporaryAndApproved(data);
  };

  checkTemporaryAndApproved = (data) => {
    let mandatoryTasks = data.filter(i => i.isMandatory==true)
    let pendingTask = mandatoryTasks.filter((i) => i.statusIntId==CandSubOnBoardTaskStatusIds.PENDINGSUBMISSION || i.statusIntId==CandSubOnBoardTaskStatusIds.SENTBACK);
    let totalPendingTask = data.filter((i) => i.statusIntId==CandSubOnBoardTaskStatusIds.PENDINGSUBMISSION || i.statusIntId==CandSubOnBoardTaskStatusIds.SENTBACK);
    let underReviewAndApprovedTask = mandatoryTasks.filter(
      (i) =>
        i.statusIntId != CandSubOnBoardTaskStatusIds.UNDERREVIEW &&
        i.statusIntId != CandSubOnBoardTaskStatusIds.APPROVED
    );
    let underReviewTasks = mandatoryTasks.filter(
      (i) => i.statusIntId ==CandSubOnBoardTaskStatusIds.UNDERREVIEW
    );
    if (totalPendingTask.length !=0) {
      if (pendingTask.length==0) {
        if (underReviewAndApprovedTask.length > 0) {
          this.setState({ hideBtn: ["TemporaryCredential", "FullyCredential", CandidateWorkflowActionBtns.ASSIGN] });
        } else {
          if (underReviewTasks.length > 0) {
            this.setState({ hideBtn: ["FullyCredential", CandidateWorkflowActionBtns.ASSIGN] });
          }
          else {
            this.setState({ hideBtn: ["TemporaryCredential", CandidateWorkflowActionBtns.ASSIGN] });
          }
        }
      }
      else {
        this.setState({ hideBtn: ["TemporaryCredential", "FullyCredential", CandidateWorkflowActionBtns.ASSIGN] });
      }
    } else {
      if (underReviewAndApprovedTask.length > 0) {
        this.setState({ hideBtn: ["TemporaryCredential", "FullyCredential", "Submit", CandidateWorkflowActionBtns.ASSIGN] });
      } else {
        if (underReviewTasks.length > 0) {
          this.setState({ hideBtn: ["FullyCredential", "Submit", CandidateWorkflowActionBtns.ASSIGN] });
        }
        else {
          this.setState({ hideBtn: ["TemporaryCredential, Submit", CandidateWorkflowActionBtns.ASSIGN] });
        }
      }
    }
  }

  handleActionClick = (action, nextStateId?, eventName?, actionId?) => {
    let change = {};
    let property = `show${action.replace(/ +/g, "")}Modal`;
    let selectedDataFromGrid = this.childRef.current.getSelectedItems(true);
    const { selectedIds, selectedItems, shouldOpen } = selectedDataFromGrid;
    if (action =="Submit") {
      if (this.childRef.current.OnFormaDataSubmit()==true) {
        this.setState({ showSubmitModal: true })
      }
    } else if (action =="Send Credentials") {
      if (shouldOpen && selectedItems.length > 0) {
        this.setState({
          candSubOnboardingTaskIds: selectedDataFromGrid.selectedIds,
        });
        change[property] = true;
      }
      else if (shouldOpen && selectedItems.length==0) {
        errorToastr(NO_DOC_FOR_CREDENTIALING);
      } else {
        selectedItems.length > 0
          ? errorToastr(SELECT_ONLY_SUBMITTED_TASK)
          : errorToastr(SELECT_ATLEAST_ONE_SUBMITTED);
      }
    } else if (action =="Send Back") {
      if (selectedIds.length > 0 && shouldOpen) {
        this.setState({
          candSubOnboardingTaskIds: selectedDataFromGrid.selectedIds,
        });
        change[property] = true;
      } else {
        selectedDataFromGrid.selectedIds.length > 0
          ? errorToastr(SELECT_SUBMITTED_TASK)
          : errorToastr(SELECT_ATLEAST_ONE_TASK);
      }
    } else {
      change[property] = true;
    }
    this.setState(change);
    this.statusId = nextStateId;
    this.eventName = eventName;
    this.actionId = actionId;
    this.action = action;
  };

  candidateStatusUpdate = (successMsg, modal, props?) => {
    this.setState({ showLoader: true });
    const data = {
      candSubmissionId: this.state.candSubmissionId,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      ...props,
    };
    axios
      .put("api/candidates/workflow/status", JSON.stringify(data))
      .then((res) => {
        successToastr(successMsg);
        this.setState({ showLoader: false });
        history.goBack()
        // history.push("/candidates/submitted/" + this.state.reqId);
      });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
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

  candidateTaskUpdate = (successMsg, modal, props?, statusIntId?) => {
    this.setState({ showLoader: true });
    const data = {
      candSubmissionId: this.state.candSubmissionId,
      candSubOnboardingTaskIds: this.state.candSubOnboardingTaskIds,
      statusIntId: statusIntId,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      actionName: this.action,
      ...props,
    };
    axios
      .put("api/candidates/candsubonboardingtask/status", JSON.stringify(data))
      .then((res) => {
        successToastr(successMsg);
        this.setState({ showLoader: false });
        // history.push("/candidate/manage/" + this.state.reqId);
        // history.push("/candidates/submitted/" + this.state.reqId);
        history.goBack()
      }, () => { this.setState({ showLoader: false }); });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  render() {
    const { candSubmissionId, reqId, status } = this.state;
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3">
          <div className="col-12 p-0 shadow pt-1 pb-1">
            <PageTitle
              title="Candidate Onboarding"
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
                {this.state.showLoader && <SkeletonWidget />}
                {!this.state.showLoader &&
                  this.state.candSubDetails &&
                  this.state.candidateId && (
                    <CandidateInformation
                      callbackFromParent={this.candInfoCallback}
                      candidateId={this.state.candidateId}
                      location={this.state.location}
                      submissionData={this.state.candSubDetails}
                    />
                  )}

                <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0">
                  <label className="mb-0 font-weight-bold">Comments</label>
                  <span
                    onClick={() => this.setState({ openCommentBox: true })}
                    className="text-underline cursorElement align-middle"
                  >
                    <FontAwesomeIcon
                      icon={faClock}
                      className="ml-1 active-icon-blue ClockFontSize"
                    />
                  </span>
                </div>
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
                      ref={this.childRef}
                      reqId={this.state.reqId}
                      candidateId={this.state.candidateId}
                      candSubmissionId={candSubmissionId}
                      status={this.state.status}
                      statusIntId={this.state.statusIntId}
                      statusId={this.statusId}
                      eventName={this.eventName}
                      getAllTaskData={this.getAllTaskData}
                      candidateTaskUpdate={this.candidateTaskUpdate}
                      getCandidateSubmissionDetails={() => this.getCandidateSubmissionDetails(this.state.candSubmissionId)}
                    />
                  )}
                {(this.state.candSubOnboardingTaskIds.length==0 &&
                  this.state.showSendCredentialsModal) ? (
                  <ErrorComponent message={SELECT_ONE_TASK_TO_SEND} />
                ) : null}
              </Collapsible>
              <div className="col-12 col-sm-4 col-lg-4 mt-1 mb-2 mt-sm-0 px-0">
                <label className="mb-0 font-weight-bold">Comments</label>
                <span
                  onClick={() => this.setState({ openCommentBox: true })}
                  className="text-underline cursorElement align-middle"
                >
                  <FontAwesomeIcon
                    icon={faClock}
                    className="ml-1 active-icon-blue ClockFontSize"
                  />
                </span>
                <Comment
                  entityType={EntityType.CANDSUBMISSION}
                  entityId={candSubmissionId}
                />
              </div>
              {this.state.openCommentBox && (<CommentHistoryBox
                entityType={EntityType.CANDSUBMISSION}
                entityId={candSubmissionId}
                showDialog={this.state.openCommentBox}
                handleNo={() => {
                  this.setState({ openCommentBox: false });
                  document.body.style.position = "";
                }}
              />)}
            </div>
          </div>
        </div>
        {status ? (
          <FormActions
            wfCode={CandidateWorkflow.CANDIDATE}
            jobWfTypeId={this.state.jobWfTypeId}
            entityId={this.state.candSubmissionId}
            currentState={status}
            handleClick={this.handleActionClick}
            // cancelUrl={`${CAND_SUB_MANAGE_URL}${reqId}`}
            handleClose={() => history.goBack()}
            disabBtn={this.state.hideBtn}
          />
        ) : (
          <CloseLink
            title={"Close"}
            pageUrl={`${CAND_SUB_MANAGE_URL}${reqId}`}
          />
        )}
        <ConfirmationModal
          message={SUBMIT_ONBOARD_MSG}
          showModal={this.state.showSubmitModal}
          handleYes={(e) =>
            this.candidateTaskUpdate(
              SUBMIT_ONBOARD_SUCCESS_MSG,
              "showSubmitModal",
              null,
              CandSubOnBoardTaskStatusIds.SUBMITTED
            )
          }
          handleNo={() => {
            this.setState({ showSubmitModal: false });
          }}
        />

        {this.state.showTemporaryCredentialModal && this.actionId && (
          <TemporaryModal
            action={this.action}
            actionId={this.actionId}
            message={TEMP_CRED_MSG(this.state.candidateName)}
            showModal={this.state.showTemporaryCredentialModal}
            handleYes={(data) =>
              this.candidateStatusUpdate(
                TEMP_CRED_ONBOARD_SUCCESS_MSG,
                "showTemporaryCredentialModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showTemporaryCredentialModal: false });
            }}
          />
        )}
        <ConfirmationModal
          message={FULLY_CREDENTIALS_ONBOARD_MSG(this.state.candidateName)}
          showModal={this.state.showFullyCredentialModal}
          handleYes={(e) =>
            this.candidateStatusUpdate(
              FULLY_CRED_ONBOARD_SUCCESS_MSG,
              "showFullyCredentialModal"
            )
          }
          handleNo={() => {
            this.setState({ showFullyCredentialModal: false });
          }}
        />
        <div id="advancesearchCompoent-popup">
          {this.state.showSendCredentialsModal && (
            <div className="col-12">
              <Dialog className="For-all-responsive-height">
                <SendCredentials
                  filesData={
                    this.childRef.current.getSelectedItems(true).selectedItems
                  }
                  candSubmissionId={this.state.candSubmissionId}
                  candSubOnboardingTaskIds={this.state.candSubOnboardingTaskIds}
                  notificationTypeId={NotificationTypeIds.SENDCREDENTIAL}
                  candidateName={this.state.candidateName}
                  statusId={this.statusId}
                  eventName={this.eventName}
                  handleClose={() => {
                    this.setState({ showSendCredentialsModal: false });
                  }}
                  handleYes={() => {
                    this.setState({ showSendCredentialsModal: false });
                    this.childRef.current.getAllTasks();
                    this.getCandidateSubmissionDetails(this.state.candSubmissionId);
                  }}
                ></SendCredentials>
              </Dialog>
            </div>
          )}
        </div>
        {this.state.showSendBackModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={SEND_BACK_MSG}
            showModal={this.state.showSendBackModal}
            handleYes={(data) =>
              this.candidateTaskUpdate(
                SEND_BACK_SUCCESS_MSG,
                "showSendBackModal",
                data,
                CandSubOnBoardTaskStatusIds.SENTBACK
              )
            }
            handleNo={() => {
              this.setState({ showSendBackModal: false });
            }}
          />
        )}
        {this.state.showRejectCandidateModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={REJECT_CANDIDATE(null)}
            showModal={this.state.showRejectCandidateModal}
            handleYes={(data) => this.candidateStatusUpdate(REJECT_CANDIDATE_SUCCESS_MSG, "showRejectCandidateModal", data)}
            handleNo={() => { this.setState({ showRejectCandidateModal: false }); }}
          />
        )}
        {this.state.showWithdrawModal && this.actionId &&
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={WITHDRAW_CANDIDATE(null)}
            showModal={this.state.showWithdrawModal}
            handleYes={(data) => this.candidateStatusUpdate(WITHDRAW_CANDIDATE_SUCCESS_MSG, "showWithdrawModal", data)}
            handleNo={() => {
              this.setState({ showWithdrawModal: false });
            }}
          />
        }
        {/* <ConfirmationModal
          message={SAVE_UNSAVED_INTERVIEW_RESULT}
          showModal={this.state.showUnsavedTasksModal}
          handleYes={async (e) => {
            this.SaveTasks()
          }}
          handleNo={() => {
            this.setState({ showUnsavedTasksModal: false });
          }}
        /> */}
      </React.Fragment>
    );
  }
}

export default ViewOnboarding;
