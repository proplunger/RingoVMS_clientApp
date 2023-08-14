import * as React from "react";
import Collapsible from "react-collapsible";
import axios from "axios";
import auth from "../../Auth";
import PageTitle from "../../Shared/Title";
import CandidateInformation from "../../Shared/CandidateInformation/CandidateInformation";
import CandSubPresentationInfo from "../../Shared/CandSubPresentationInfo/CandSubPresentationInfo";
import { candTriggerName } from "../../ReusableComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comment } from "../../Shared/Comment/Comment";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import {
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import {
  PRESENTATION_CONFIRMATION_MSG,
  PRESENTATION_SAVE_SUCCESS_MSG,
  PRESENTATION_SUBMIT_SUCCESS_MSG,
  REJECT_CANDIDATE,
  REJECT_CANDIDATE_SUCCESS_MSG,
  WITHDRAW_CANDIDATE,
  WITHDRAW_CANDIDATE_SUCCESS_MSG,
} from "../../Shared/AppMessages";
import {
  EntityType,
  CandidateWorkflow,
  CandSubStatusIds,
  SettingCategory,
  SETTINGS
} from "../../Shared/AppConstants";
import { ConfirmationModal } from "../../Shared/ConfirmationModal";
import { clientSettingsData, history, localDateTime, successToastr } from "../../../HelperMethods";
import BillRateAndExpenses from "../BillRateAndExpenses/BillRateAndExpenses";
import FormActions from "../../Shared/Workflow/FormActions";
import {
  APP_HOME_URL,
  CAND_SUB_MANAGE_URL,
} from "../../Shared/ApiUrls";
import RejectModal from "../../Shared/RejectModal";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import ProjectionTargetDates from "../Projection/ProjectionTargetDates";

export interface SubmitPresentationFormProps {
  match: any;
}

export interface SubmitPresentationFormState {
  candidateId?: string;
  candSubmissionId?: string;
  location?: string;
  candidateEmail?: string;
  candidateName?: string;
  candidatePhoneNumber?: string;
  candidateMobileNumber?: any;
  reqNo?: string;
  reqId?: string;
  status?: string;
  positionId?: string;
  jobPositionId?: string;
  locationId?: string;
  divisionId?: string;
  jobWfTypeId?: string;
  candSubDetails?: any;
  showLoader?: boolean;
  openCommentBox?: boolean;
  showSubmitModal?: boolean;
  isSubmit?: boolean;
  showWithdrawModal?: boolean;
  showRejectCandidateModal?: boolean;
  statusIntId?: any;
  reqStartDate?:any;
  targetStartDate?: any;
  targetEndDate?: any;
  isDirty?: boolean;
  clientId?: string;
  isAssignmentProjections?: boolean;
  reqEndDate?: any;
  targetDateError: boolean;
}

const refCand = React.createRef<CandidateInformation>();
const refCandSubPresentation = React.createRef<CandSubPresentationInfo>();
const billRateRef = React.createRef<BillRateAndExpenses>();
class SubmitPresentationForm extends React.Component<
  SubmitPresentationFormProps,
  SubmitPresentationFormState
> {
  constructor(props: SubmitPresentationFormProps) {
    super(props);
    this.state = {
      targetStartDate: null,
      targetEndDate: null,
      clientId: auth.getClient(),
      targetDateError: false
    };
  }

  action: string;
  statusId: string;
  eventName: string;
  actionId: string;
  componentDidMount() {
    const { subId } = this.props.match.params;
    this.setState({ candSubmissionId: subId });
    this.getClientSettings(this.state.clientId);
    this.getCandidateSubmissionDetails(subId);
  }

  candInfoCallback = (candidateInfo) => {
    this.setState({
      candidateEmail: candidateInfo.email,
      candidateName: candidateInfo.name,
      candidatePhoneNumber: candidateInfo.phoneNumber,
      candidateMobileNumber: candidateInfo.mobileNumber,
    });
  };

  async getCandidateSubmissionDetails(candSubmissionId) {
    this.setState({ showLoader: true });
    await axios
      .get(`api/candidates/workflow/${candSubmissionId}`)
      .then((res) => {
        this.setState({
          reqId: res.data.reqId,
          reqStartDate:localDateTime(res.data.reqStartDate),
          candSubDetails: res.data,
          candidateId: res.data.candidateId,
          status: res.data.status,
          statusIntId: res.data.statusIntId,
          positionId: res.data.positionId,
          jobPositionId: res.data.jobPositionId,
          locationId: res.data.locationId,
          divisionId: res.data.divisionId,
          reqNo: res.data.reqNumber,
          location: res.data.location,
          jobWfTypeId: res.data.jobWfTypeId,
          //targetStartDate: res.data.targetStartDate,
          //targetEndDate: res.data.targetEndDate,
          reqEndDate: localDateTime(res.data.reqEndDate),
          showLoader: false,
          targetStartDate: res.data.targetStartDate !=null && res.data.targetStartDate !=undefined && res.data.targetStartDate !="" 
          ? localDateTime(res.data.targetStartDate) : res.data.targetStartDate,
          targetEndDate: res.data.targetEndDate !=null && res.data.targetEndDate !=undefined && res.data.targetEndDate !="" 
          ? localDateTime(res.data.targetEndDate) : res.data.targetEndDate,
        }
        );
      });
  }

  handleDisable = () => { }

  handleEnable = () => { }

  validateTargetDates = () => {
    var showError = this.state.isAssignmentProjections==true && (this.state.targetStartDate ==null ||
                  this.state.targetEndDate ==null) ? true : false;
    this.setState({ targetDateError: showError });
    return showError;
  }

  validateSubmission = (action, nextStateId?, eventName?, actionId?) => {
    this.action = action;
    this.statusId = nextStateId;
    this.eventName = eventName;
    this.actionId = actionId;
    const {
      showErrors,
      presentationInfoDetails,
    } = refCandSubPresentation.current.validateField();
    let billRateValidate = billRateRef.current.validateBillRatesData();
    let targetDateError = this.validateTargetDates();
    if (action=="Submit") {
      if (showErrors || billRateValidate || targetDateError) return false;
    }

    if (action=="Submit") {

      if (!billRateValidate && !showErrors) {
        this.setState({ showSubmitModal: true });
        this.action = action;
        this.statusId = nextStateId;
        this.eventName = eventName;
      }
    }
    else if (action=="Withdraw") {
      this.setState({ showWithdrawModal: true })
    }
    else if (action=="Reject Candidate") {
      this.setState({ showRejectCandidateModal: true })
    }
    else {
      this.savePresentation(action, nextStateId, eventName);
    }
  };

  savePresentation = (action, nextStateId?, eventName?) => {
    const {
      showErrors,
      presentationInfoDetails,
    } = refCandSubPresentation.current.validateField();
    let targetDateError = this.validateTargetDates();

    if (action=="Submit") {
      if (showErrors || targetDateError) return false;
    }

    if (presentationInfoDetails.potentialStartDate !=null && presentationInfoDetails.potentialStartDate !=undefined) {
      presentationInfoDetails.potentialStartDate = localDateTime(presentationInfoDetails.potentialStartDate);
    }

    let data = {
      candSubmissionId: this.state.candSubmissionId,
      statusId: nextStateId,
      isSubmit: false,
      eventName: eventName,
      actionId: this.actionId,
      targetStartDate: null,
      targetEndDate: null,
      ...presentationInfoDetails,
    };

    if (this.state.targetStartDate !=null && this.state.targetStartDate !=undefined) {
      data.targetStartDate = localDateTime(this.state.targetStartDate);
    }

    if (this.state.targetEndDate !=null && this.state.targetEndDate !=undefined) {
      data.targetEndDate = localDateTime(this.state.targetEndDate);
    }

    data["isSubmit"] = action=="Submit" ? true : false;
    const successMsg = data["isSubmit"]
      ? PRESENTATION_SUBMIT_SUCCESS_MSG
      : PRESENTATION_SAVE_SUCCESS_MSG;
    let httpVerb = data.candSubPresentationInfoId ? "put" : "post";
    axios[httpVerb](
      "api/candidates/presentationinfo",
      JSON.stringify(data)
    ).then((res) => {
      successToastr(successMsg);
      if (auth.hasPermissionV2(AppPermissions.CANDIDATE_UPDATE)) {
        this.setState({showSubmitModal:false})
        // history.push(`${CAND_SUB_MANAGE_URL}${this.state.reqId}`);
        history.goBack()
      } else {
        window.location.href = APP_HOME_URL;
      }
    });
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
      if (auth.hasPermissionV2(AppPermissions.CANDIDATE_UPDATE)) {
        // history.push(`${CAND_SUB_MANAGE_URL}${this.state.reqId}`);
        history.goBack()

      } else {
        window.location.href = APP_HOME_URL;
      }
    });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);

  };

  handleChange = (e) => {
    let change = { isDirty: true };
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  getClientSettings = (clientId) => {
    clientSettingsData(clientId, SettingCategory.REPORT, SETTINGS.ASSIGNMENT_PROJECTION, (response) => {
      this.setState({ isAssignmentProjections : response });
    });
  };

  render() {
    const {
      candSubDetails,
      targetStartDate,
      targetEndDate,
      isAssignmentProjections,
      targetDateError
    } = this.state;

    const projectionInfo = {
      targetStartDate,
      targetEndDate,
      candSubDetails,
      targetDateError
  };
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3">
          <div className="col-12 p-0 shadow pt-1 pb-1">
            <PageTitle
              title="Vendor Presentation"
              reqNumber={this.state.reqNo}
              candSubmissionId={this.state.candSubmissionId}
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
              <Collapsible
                trigger={candTriggerName("Bill Rates and Expenses")}
                open={true}
              >
                {this.state.candSubmissionId &&
                  this.state.candidateName &&
                  this.state.locationId &&
                  this.state.positionId && (
                    <BillRateAndExpenses
                      ref={billRateRef}
                      candSubmissionId={this.state.candSubmissionId}
                      candidateName={this.state.candidateName}
                      locationId={this.state.locationId}
                      positionId={this.state.jobPositionId}
                      divisionId={this.state.divisionId}
                      candidateSubStatusIntId={this.state.statusIntId}
                      candidateSubStatus={this.state.status}
                      handleDisable={() => this.handleDisable()}
                      handleEnable={() => this.handleEnable()}
                    ></BillRateAndExpenses>
                  )}
              </Collapsible>
              <Collapsible
                trigger={candTriggerName("Presentation Information")}
                open={true}
              >
                {this.state.candSubmissionId &&
                  this.state.candidateName && this.state.reqStartDate&&
                  (
                    <CandSubPresentationInfo
                      candidatePhoneNumber={this.state.candidateMobileNumber ? this.state.candidateMobileNumber : this.state.candidatePhoneNumber}
                      candidateEmail={this.state.candidateEmail}
                      ref={refCandSubPresentation}
                      candSubmissionId={this.state.candSubmissionId}
                      isEnable={true}
                      reqStartDate={(this.state.reqStartDate)}
                    />
                  )}
              </Collapsible>
              {this.state.statusIntId==CandSubStatusIds.PENDINGFORVENDORPRESENTATION && isAssignmentProjections==true && (
              <Collapsible
                trigger={candTriggerName("Assignment Target Dates")}
                open={true}
              >
                {this.state.candSubmissionId && this.state.statusIntId==CandSubStatusIds.PENDINGFORVENDORPRESENTATION && isAssignmentProjections==true && (
                    <ProjectionTargetDates
                      data={projectionInfo}
                      handleChange={this.handleChange}
                      showLoader={false}
                      generateProjection={false}
                      reqDates={{reqStartDate:this.state.reqStartDate, reqEndDate:this.state.reqEndDate}}
                    />
                  )}
              </Collapsible>
              )}
            </div>
            <hr />
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
        {this.state.status && this.state.jobWfTypeId && (
          <FormActions
            wfCode={CandidateWorkflow.CANDIDATE}
            jobWfTypeId={this.state.jobWfTypeId}
            entityId={this.state.candSubmissionId}
            currentState={this.state.status}
            handleClick={this.validateSubmission}
            // cancelUrl={`${CAND_SUB_MANAGE_URL}${this.state.reqId}`}
            handleClose={() => history.goBack()}
          />
        )}
        <ConfirmationModal
          message={PRESENTATION_CONFIRMATION_MSG}
          showModal={this.state.showSubmitModal}
          handleYes={(e) =>
            this.savePresentation(this.action, this.statusId, this.eventName)
          }
          handleNo={() => {
            this.setState({ showSubmitModal: false });
          }}
        />

        {this.state.showWithdrawModal && this.actionId && (
          <RejectModal
            action={"Withdraw"}
            actionId={this.actionId}
            message={WITHDRAW_CANDIDATE(this.state.candidateName)}
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
      </React.Fragment>
    );
  }
}

export default SubmitPresentationForm;
