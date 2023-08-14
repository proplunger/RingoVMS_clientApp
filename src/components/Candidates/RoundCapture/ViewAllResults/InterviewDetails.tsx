import * as React from "react";
import axios from "axios";
import auth from "../../../Auth";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageTitle from "../../../Shared/Title";
import CandidateInformation from "../../../Shared/CandidateInformation/CandidateInformation";
import Collapsible from "react-collapsible";
import SkeletonWidget from "../../../Shared/Skeleton";
import { candTriggerName } from "../../../ReusableComponents";
import { APP_HOME_URL, CAND_SUB_MANAGE_URL } from "../../../Shared/ApiUrls";
import FormActions from "../../../Shared/Workflow/FormActions";
import {
  MAKE_AN_OFFER_CONFIRMATION_MSG,
  MAKE_AN_OFFER_SUCCESS_MSG,
  REJECT_CANDIDATE,
  REJECT_CANDIDATE_SUCCESS_MSG,
  WITHDRAW_CANDIDATE,
  WITHDRAW_CANDIDATE_SUCCESS_MSG,
} from "../../../Shared/AppMessages";
import { CandidateWorkflow, EntityType } from "../../../Shared/AppConstants";
import CloseLink from "../../../Shared/CloseLink";
import { ConfirmationModal } from "../../../Shared/ConfirmationModal";
import { history, successToastr } from "../../../../HelperMethods";
import AllRoundResultView from "./ViewAllResultsGrid";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import CommentHistoryBox from "../../../Shared/Comment/CommentHistoryBox";
import RejectModal from "../../../Shared/RejectModal";

export interface InterviewDetailsProps {
  match: any;
}

export interface InterviewDetailsState {
  reqId: string;
  reqNo: string;
  location: string;
  candSubDetails: any;
  showLoader?: boolean;
  openCommentBox?: boolean;
  candSubmissionId?: string;
  candidateId?: string;
  status?: string;
  statusIntId?: string;
  showCandidateOwnershipModal?: boolean;
  showReadyforOfferModal?: boolean;
  showRejectCandidateModal?: boolean;
  showWithdrawModal?: boolean;
  hideBtns: any;
  jobWfTypeId?: string;
}

class InterviewDetails extends React.Component<
  InterviewDetailsProps,
  InterviewDetailsState
> {
  constructor(props: InterviewDetailsProps) {
    super(props);
    this.state = {
      reqId: "",
      reqNo: "",
      location: "",
      candSubDetails: {},
      hideBtns: ["ProceedToNextRound", "ScheduleInterview", "ScheduleInterviewRequest"]
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

  async getCandidateSubmissionDetails(candSubmissionId) {
    this.setState({ showLoader: true });
    await axios.get(`api/candidates/workflow/${candSubmissionId}`).then((res) => {
      this.setState({
        reqId: res.data.reqId,
        reqNo: res.data.reqNumber,
        candSubDetails: res.data,
        candidateId: res.data.candidateId,
        location: res.data.location,
        status: res.data.status,
        statusIntId: res.data.statusIntId,
        showLoader: false,
        jobWfTypeId: res.data.jobWfTypeId
      });
    });
  }

  handleActionClick = (action, nextStateId?, eventName?, actionId?) => {
    let change = {};
    let property = `show${action.replace(/ +/g, "")}Modal`;
    change[property] = true;
    this.setState(change);
    this.statusId = nextStateId;
    this.eventName = eventName;
    this.actionId = actionId;
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
    axios.put("api/candidates/workflow/status", JSON.stringify(data)).then((res) => {
      successToastr(successMsg);
      this.setState({ showLoader: false });
      if (auth.hasPermissionV2(AppPermissions.CAND_SUB_NAME_CLEAR)) {
        // history.push(
        //   `${CAND_SUB_MANAGE_URL}${this.state.reqId}`
        // );
        history.goBack();
      } else {
        window.location.href = APP_HOME_URL;
      }
    });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);

  };

  render() {
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3">
          <div className="col-12 p-0 shadow pt-1 pb-1">
            <PageTitle
              title="Interview Details"
              candSubmissionId={this.state.candSubmissionId}
              reqNumber={this.state.reqNo}
              pageUrl={`/requisitions/view/${this.state.reqId}`}
            />
            <div className="col-12">
              <Collapsible
                trigger={candTriggerName(
                  "Candidate Information",
                  this.state.status
                )}
                open={true}
              >
                {this.state.showLoader && <SkeletonWidget />}
                {!this.state.showLoader &&
                  this.state.candSubDetails &&
                  this.state.candidateId && (
                    <CandidateInformation
                      candidateId={this.state.candidateId}
                      location={this.state.location}
                      submissionData={this.state.candSubDetails}
                    />
                  )}
                <div className="col-12 col-sm-4 col-lg-4 mt-2 mb-2 mb-sm-0  mt-sm-0">
                  <label className="mb-0 font-weight-bold ">Comments</label>
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
              </Collapsible>
              <Collapsible
                trigger={candTriggerName("Interview Details")}
                open={true}
              >
                {!this.state.showLoader &&
                  this.state.candSubDetails &&
                  this.state.candidateId &&
                  this.state.reqId && (
                    <AllRoundResultView
                      CandidateSubmissionId={this.state.candSubmissionId}
                      reqId={this.state.reqId}
                      statusIntId={this.state.statusIntId}
                    />
                  )}
              </Collapsible>
            </div>
          </div>
        </div>
        {this.state.status && this.state.jobWfTypeId ? (
          <FormActions
            wfCode={CandidateWorkflow.CANDIDATE}
            currentState={this.state.status}
            jobWfTypeId={this.state.jobWfTypeId}
            entityId={this.state.candSubmissionId}
            handleClick={this.handleActionClick}
            // cancelUrl={`${CAND_SUB_MANAGE_URL}${this.state.reqId}`}
            handleClose={() => history.goBack()}
            hideBtn={this.state.hideBtns}
          />
        ) : (
          <CloseLink
            title={"Close"}
            pageUrl={`${CAND_SUB_MANAGE_URL}${this.state.reqId}`}
          />
        )}
        <ConfirmationModal
          message={MAKE_AN_OFFER_CONFIRMATION_MSG}
          showModal={this.state.showReadyforOfferModal}
          handleYes={(e) =>
            this.candidateStatusUpdate(
              MAKE_AN_OFFER_SUCCESS_MSG,
              "showReadyforOfferModal"
            )
          }
          handleNo={() => {
            this.setState({ showReadyforOfferModal: false });
          }}
        />
        {this.state.showRejectCandidateModal && this.actionId && (
          <RejectModal
            action={"Reject Candidate"}
            actionId={this.actionId}
            message={REJECT_CANDIDATE(null)}
            showModal={this.state.showRejectCandidateModal}
            handleYes={(data) =>
              this.candidateStatusUpdate(
                REJECT_CANDIDATE_SUCCESS_MSG,
                "showRejectCandidateModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showRejectCandidateModal: false });
            }}
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
      </React.Fragment>
    );
  }
}

export default InterviewDetails;
