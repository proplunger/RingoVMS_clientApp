import * as React from "react";
import axios from "axios";
import auth from "../../../Auth";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageTitle from "../../../Shared/Title";
import CandidateInformation from "../../../Shared/CandidateInformation/CandidateInformation";
import Collapsible from "react-collapsible";
import {
  MAKE_AN_OFFER_CONFIRMATION_MSG,
  MAKE_AN_OFFER_SUCCESS_MSG,
  REJECT_CANDIDATE_SUCCESS_MSG,
  REJECT_CANDIDATE,
  CAPTURE_ROOUND_STATUS as CAPTURE_ROUND_STATUS,
  NEXT_ROUND_CONFIRMATION_MSG,
  NEXT_ROUND_SUCCESS_MSG,
  CREATE_CRITERIA_CONFIRMATION,
  WITHDRAW_CANDIDATE,
  WITHDRAW_CANDIDATE_SUCCESS_MSG,
  SAVE_UNSAVED_INTERVIEW_RESULT,
  SELECT_REQUIRED_FIELDS_ROUND_RESULT,
} from "../../../Shared/AppMessages";
import {
  EntityType,
  CandidateWorkflow,
  CandSubInterviewStatusIds,
  CandidateWorkflowActions
} from "../../../Shared/AppConstants";
import SkeletonWidget from "../../../Shared/Skeleton";
import { candTriggerName, ErrorComponent } from "../../../ReusableComponents";
import { CAND_SUB_MANAGE_URL, APP_HOME_URL } from "../../../Shared/ApiUrls";
import FormActions from "../../../Shared/Workflow/FormActions";
import { ConfirmationModal } from "../../../Shared/ConfirmationModal";
import CloseLink from "../../../Shared/CloseLink";
import { history, initialDataState, successToastr, warningToastr } from "../../../../HelperMethods";
import { Comment } from "../../../Shared/Comment/Comment";
import RoundResultView from "./RoundGrid";
import { Rating } from "@progress/kendo-react-inputs";
import RejectModal from "../../../Shared/RejectModal";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import CommentHistoryBox from "../../../Shared/Comment/CommentHistoryBox";

export interface CaptureRoundResultProps {
  match: any;
}

export interface CaptureRoundResultState {
  reqId: string;
  reqNo: string;
  location: string;
  candSubDetails: any;
  showLoader?: boolean;
  openCommentBox?: boolean;
  candSubmissionId?: string;
  candidateId?: string;
  status?: string;
  showCandidateOwnershipModal?: boolean;
  interviewId: any;
  ratingValue: any;
  round?: any;
  hiringManager: string;
  Notes: string;
  interviewRoundStatusIntId?: boolean;
  showError: boolean
  allCriteriaData: any
  allInterviewResultData: any
  showProceedToNextRoundModal?: boolean;
  showRejectCandidateModal?: boolean;
  showReadyforOfferModal?: boolean;
  showWithdrawModal?: boolean;
  showUnSavedInterviewResultModal?: boolean;
  hideBtns: any;
  jobWfTypeId?: string;
}


class CaptureRoundResult extends React.Component<
  CaptureRoundResultProps,
  CaptureRoundResultState
> {
  refCand: any;
  private unSavedInterviewResults;
  constructor(props: CaptureRoundResultProps) {
    super(props);
    this.state = {
      reqId: "",
      reqNo: "",
      location: "",
      candSubDetails: {},
      interviewId: "",
      ratingValue: null,
      hiringManager: "",
      Notes: "",
      showError: false,
      allCriteriaData: [],
      allInterviewResultData: [],
      hideBtns: ["ScheduleInterview", "ScheduleInterviewRequest"],
    };
  }

  action: string;
  statusId: string;
  eventName: string;
  actionId: string;

  componentDidMount() {
    const { subId, interviewId } = this.props.match.params;
    this.setState({ candSubmissionId: subId, interviewId: interviewId });
    this.getCandidateSubmissionDetails(subId);
    this.getCandidateInterviewDetails(interviewId);
  }

  async getCandidateSubmissionDetails(candSubmissionId) {
    this.setState({ showLoader: true });
    await axios
      .get(`api/candidates/workflow/${candSubmissionId}`)
      .then((res) => {
        this.setState({
          reqId: res.data.reqId,
          reqNo: res.data.reqNumber,
          candSubDetails: res.data,
          candidateId: res.data.candidateId,
          location: res.data.location,
          status: res.data.status,
          showLoader: false,
          jobWfTypeId: res.data.jobWfTypeId,
        });
      });
  }

  async getCandidateInterviewDetails(candSubInterviewId) {
    this.setState({ showLoader: true });
    await axios
      .get(`api/candidates/candsubinterview/${candSubInterviewId}`)
      .then((res) => {
        this.setState({
          round: res.data.roundNumber,
          ratingValue: res.data.rating,
          hiringManager: res.data.hiringManagerName,
          Notes: res.data.notes,
          interviewRoundStatusIntId:
            res.data.statusIntId ==CandSubInterviewStatusIds.SCHEDULED
              ? true
              : false,
          hideBtns: !res.data.isNextRound
            ? [
              "ProceedToNextRound",
              "ScheduleInterview",
              "ScheduleInterviewRequest",
            ]
            : ["ScheduleInterview", "ScheduleInterviewRequest"],
          showLoader: false,
        });
      });
  }

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
        if (auth.hasPermissionV2(AppPermissions.CAND_SUB_NAME_CLEAR)) {
          history.push(`${CAND_SUB_MANAGE_URL}`);
        } else {
          window.location.href = APP_HOME_URL;
        }
      });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  updateRoundStatus = (
    successMsg,
    modal,
    props?,
    updateCandidateStatus = false
  ) => {
    let ids = [];
    ids.push(this.state.interviewId);
    const data = {
      CandSubInterviewIds: ids,
      candSubmissionId: this.state.candSubmissionId,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      statusIntId: CandSubInterviewStatusIds.COMPLETED,
      rating: this.state.ratingValue,
      notes: this.state.Notes,
      ...props,
    };
    axios
      .put("api/candidates/candsubinterview/status", JSON.stringify(data))
      .then((res) => {
        if (!updateCandidateStatus) {
          successToastr(successMsg);
          history.goBack();
        } else {
          this.candidateStatusUpdate(
            MAKE_AN_OFFER_SUCCESS_MSG,
            "showReadyforOfferModal",
            ""
          );
        }
      });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  validateFields = (action) => {
    const { ratingValue, Notes, allCriteriaData } = this.state;
    let property = `show${action.replace(/ +/g, "")}Modal`;
    return action ==CandidateWorkflowActions.PROCEED_TO_NEXT_ROUND ||
      action==CandidateWorkflowActions.READY_FOR_OFFER
      ? ((ratingValue==null || ratingValue =="") ||
        (Notes ==null || Notes =="" || Notes==undefined)) ||
        allCriteriaData.length ==0
        ? "showError"
        : property
      : property;
  };

  handleActionClick = (action, nextStateId?, eventName?, actionId?) => {
    let change = {};
    if (action==CandidateWorkflowActions.REJECT_CANDIDATE) {
      this.setState({ showRejectCandidateModal: true });
    } else if (action==CandidateWorkflowActions.WITHDRAW) {
      this.setState({ showWithdrawModal: true });
    } else {
      var interviewResults = this.refCand.getInterviewResultData();

      if (interviewResults !=null && interviewResults.length > 0) {
        var unSavedInterviewResults = interviewResults.filter((o) => o.inEdit);
        if (
          unSavedInterviewResults !=null &&
          unSavedInterviewResults.length > 0
        ) {
          var invalidResults = unSavedInterviewResults.filter(
            (o) =>
              o.rating==null ||
              o.rating==undefined ||
              o.rating=="" ||
              o.criteria==null ||
              o.criteria==undefined ||
              o.criteria==""
          );

          if (invalidResults !=null && invalidResults.length > 0) {
            this.setState({ showUnSavedInterviewResultModal: false });
            warningToastr(SELECT_REQUIRED_FIELDS_ROUND_RESULT);
            return false;
          } else {
            this.unSavedInterviewResults = unSavedInterviewResults;
            this.setState({ showUnSavedInterviewResultModal: true });
          }
        }
      }

      let property = this.validateFields(action);
      change[property] = true;
      this.setState(change);
    }
    this.statusId = nextStateId;
    this.eventName = eventName;
    this.actionId = actionId;
  };

  SaveInterviewResults = async () => {
    this.setState({ showLoader: true });
    if (
      this.unSavedInterviewResults !=null &&
      this.unSavedInterviewResults.length > 0
    ) {
      let resultTotalCount = this.unSavedInterviewResults.length;
      let resultCount = 0;
      for await (var interviewResult of this.unSavedInterviewResults) {
        await this.SaveNewCriteria(interviewResult);
        resultCount = resultCount + 1;
      }

      if (resultCount==resultTotalCount) {
        let interviewRoundStatusIntId = this.state.interviewRoundStatusIntId;
        this.setState({ interviewRoundStatusIntId: null });
        this.setState({ showLoader: false });
        this.setState({ interviewRoundStatusIntId: interviewRoundStatusIntId });
      }
    }
    this.setState({ showUnSavedInterviewResultModal: false });
  };

  SaveNewCriteria = async (dataItem) => {

    if (dataItem.candSubInterviewResultId==undefined) {
      let data = {
        Criteria: dataItem.criteria,
        RatingId: dataItem.ratingId,
        Comment: dataItem.comment,
        CandSubInterviewId: this.state.interviewId,
      };

      await axios.post(
        `api/candidates/candsubinterviewresult`,
        JSON.stringify(data)
      )
      // .then(() => this.refCand.getAllCriteria(initialDataState));
    } else {
      let data = {
        CandSubInterviewResultId: dataItem.candSubInterviewResultId,
        Criteria: dataItem.criteria,
        RatingId: dataItem.ratingId,
        Comment: dataItem.comment,
        CandSubInterviewId: this.state.interviewId,
      };
      axios
        .put(`api/candidates/candsubinterviewresult`, JSON.stringify(data))
      // .then(() => this.refCand.getAllCriteria(initialDataState))
    }
  };

  render() {
    const {
      showLoader,
      reqNo,
      reqId,
      status,
      candSubmissionId,
      showProceedToNextRoundModal,
      hiringManager,
      ratingValue,
      interviewId,
      Notes,
      interviewRoundStatusIntId,
      candSubDetails,
      candidateId,
      location,
      round,
      showError,
      allCriteriaData,
    } = this.state;
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3">
          <div className="col-12 p-0 shadow pt-1 pb-1">
            <PageTitle
              title="Capture Round Result"
              candSubmissionId={candSubmissionId}
              candSubInterviewId={interviewId}
              reqNumber={reqNo}
              pageUrl={`/requisitions/view/${reqId}`}
            />
            <div className="col-12">
              <Collapsible
                trigger={candTriggerName("Candidate Information", status)}
                open={true}
              >
                {showLoader && <SkeletonWidget />}
                {!showLoader && candSubDetails && candidateId && (
                  <CandidateInformation
                    candidateId={candidateId}
                    location={location}                 
                    submissionData={candSubDetails}
                  />
                )}
              </Collapsible>
              <Collapsible
                trigger={candTriggerName(
                  "Capture Round Result",
                  "",
                  CAPTURE_ROUND_STATUS(round)
                )}
                open={true}
              >
                {
                  <div>
                    {!showLoader &&
                      candSubDetails &&
                      candidateId &&
                      reqId &&
                      interviewRoundStatusIntId != undefined &&
                      interviewRoundStatusIntId != null && (
                        <RoundResultView
                          ref={(instance) => {
                            this.refCand = instance;
                          }}
                          candSubmissionId={candSubmissionId}
                          reqId={reqId}
                          interviewId={interviewId}
                          interviewStatusId={interviewRoundStatusIntId}
                          getAllCriteriaData={(data) =>
                            this.setState({ allCriteriaData: data })
                          }
                        />
                      )}
                    {allCriteriaData.length ==0 && showError && (
                      <ErrorComponent message={CREATE_CRITERIA_CONFIRMATION} />
                    )}
                    <div className="mt-2 row change-rating-color">
                      <div className="col-auto">
                        <span className="required">Overall Rating:</span>
                        {(ratingValue ==null ||
                          ratingValue =="" ||
                          ratingValue ==undefined) &&
                          showError && <ErrorComponent />}
                      </div>
                      <div className="col-auto pl-0">
                        <span>
                          <Rating
                            value={ratingValue}
                            onChange={(e) =>
                              this.setState({ ratingValue: e.value })
                            }
                            required
                            disabled={!interviewRoundStatusIntId}
                          />
                        </span>
                      </div>

                      <div className="col-auto ml-auto font-weight-bold">
                        <span>Interviewer: </span>
                        <span className="ml-1">{hiringManager}</span>
                      </div>
                    </div>
                  </div>
                }
              </Collapsible>
              {candSubmissionId && (
                <div className="row">
                  <div className="col-12 col-sm-6 col-lg-4 mt-1 mt-sm-0 block">
                    <div>
                      <label className="mb-0 font-weight-bold required">
                        Overall Notes
                      </label>
                    </div>
                    <div>
                      <textarea
                        required
                        disabled={!interviewRoundStatusIntId}
                        className="form-control noteHistory mt-1"
                        value={this.state.Notes}
                        onChange={(e) =>
                          this.setState({ Notes: e.target.value })
                        }
                        maxLength={1000}
                      />
                      {(Notes ==null ||
                        Notes =="" ||
                        Notes ==undefined) &&
                        showError && <ErrorComponent />}
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-4 mt-1 mt-sm-0">
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
              )}
            </div>
          </div>
        </div>
        {status && interviewRoundStatusIntId && this.state.jobWfTypeId ? (
          <FormActions
            wfCode={CandidateWorkflow.CANDIDATE}
            currentState={status}
            jobWfTypeId={this.state.jobWfTypeId}
            entityId={this.state.candSubmissionId}
            handleClick={this.handleActionClick}
            handleClose={() => history.goBack()}
            hideBtn={this.state.hideBtns}
          />
        ) : (
          <CloseLink
            title={"Close"}
            pageUrl={`${CAND_SUB_MANAGE_URL}${reqId}`}
          />
        )}
        <ConfirmationModal
          message={NEXT_ROUND_CONFIRMATION_MSG}
          showModal={showProceedToNextRoundModal}
          handleYes={(e) =>
            this.updateRoundStatus(
              NEXT_ROUND_SUCCESS_MSG,
              "showProceedToNextRoundModal"
            )
          }
          handleNo={() => {
            this.setState({ showProceedToNextRoundModal: false });
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
        <ConfirmationModal
          message={MAKE_AN_OFFER_CONFIRMATION_MSG}
          showModal={this.state.showReadyforOfferModal}
          handleYes={(e) => {
            this.updateRoundStatus(
              NEXT_ROUND_SUCCESS_MSG,
              "showProceedToNextRoundModal",
              null,
              true
            );
          }}
          handleNo={() => {
            this.setState({ showReadyforOfferModal: false });
          }}
        />
        {this.state.showWithdrawModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={WITHDRAW_CANDIDATE(null)}
            showModal={this.state.showWithdrawModal}
            handleYes={(data) =>
              this.candidateStatusUpdate(
                WITHDRAW_CANDIDATE_SUCCESS_MSG,
                "showWithdrawModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showWithdrawModal: false });
            }}
          />
        )}
        <ConfirmationModal
          message={SAVE_UNSAVED_INTERVIEW_RESULT}
          showModal={this.state.showUnSavedInterviewResultModal}
          handleYes={async (e) => {
            await this.SaveInterviewResults();
          }}
          handleNo={() => {
            this.setState({ showUnSavedInterviewResultModal: false });
          }}
        />
      </React.Fragment>
    );
  }
}

export default CaptureRoundResult;
