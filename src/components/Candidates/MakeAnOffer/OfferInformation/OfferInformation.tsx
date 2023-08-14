import * as React from "react";
import axios from "axios";
import auth from "../../../Auth";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageTitle from "../../../Shared/Title";
import CandidateInformation from "../../../Shared/CandidateInformation/CandidateInformation";
import Collapsible from "react-collapsible";
import SkeletonWidget from "../../../Shared/Skeleton";
import { candTriggerName, hideLoader, KendoFilter, showLoader } from "../../../ReusableComponents";
import { CAND_SUB_MANAGE_URL } from "../../../Shared/ApiUrls";
import BillRateAndExpenses from "../../BillRateAndExpenses/BillRateAndExpenses";
import FormActions from "../../../Shared/Workflow/FormActions";
import {
  SUBMIT_TO_VENDOR_SUCCESS_MSG,
  REJECT_CANDIDATE_SUCCESS_MSG,
  REJECT_OFFER,
  SUBMIT_TO_VENDOR_MSG,
  ACCEPT_OFFER_MSG,
  REJECT_CANDIDATE,
  ACCEPT_OFFER_SUCCESS_MSG,
  REJECT_OFFER_SUCCESS_MSG,
  WITHDRAW_CANDIDATE_SUCCESS_MSG,
  WITHDRAW_CANDIDATE,
  MAKE_OFFER_CONTRACT_VALIDATION_MSG,
  OVERRIDE_EXISTING_PROJECTION_GENERATE_CONFIRMATION_MSG,
  GENERATE_PROJECTION_SUCCESS_MSG,
  WARNING_MESSAGE_FOR_TARGET_DATES,
} from "../../../Shared/AppMessages";
import {
  BillRateStatus,
  CandidateWorkflow,
  CandidateWorkflowActions,
  CandSubStatusIds,
  DocStatus,
  DocType,
  EntityType,
  SettingCategory,
  SETTINGS
} from "../../../Shared/AppConstants";
import { ConfirmationModal } from "../../../Shared/ConfirmationModal";
import RejectModal from "../../../Shared/RejectModal";
import { Comment } from "../../../Shared/Comment/Comment";
import { clientSettingsData, errorToastr, history, localDateTime, successToastr, warningToastr } from "../../../../HelperMethods";
import { toODataString } from "@progress/kendo-data-query";
import AlertBox from "../../../Shared/AlertBox";
import CommentHistoryBox from "../../../Shared/Comment/CommentHistoryBox";
import ConfirmationLetter from "./ConfirmationLetter";
import { DocumentsVm } from "../../../Shared/DocumentsPortfolio/IDocumentsPortfolioGridState";
import ProjectionTargetDates from "../../Projection/ProjectionTargetDates";
import AssignmentProjections from "../../Projection/AssignmentProjection/AssignmentProjections";

export interface OfferInformationProps {
  match: any;
}

export interface OfferInformationState {
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
  positionId?: any;
  jobPositionId?: string;
  showRejectOfferModal?: boolean;
  showSubmitOfferModal?: boolean;
  showAcceptOfferModal?: boolean;
  showRejectCandidateModal?: boolean;
  locationId?: any;
  divisionId?: string;
  candidateName?: string;
  showWithdrawModal?: boolean;
  jobWfTypeId?: string;
  openAlert?: boolean;
  showConfirmationLetterModal?: boolean;
  isConfirmationPdfRequired?: boolean;
  clientId: string;
  candidateAddress?: string;
  candidateCity?: string;
  clientSignature: string;
  vendorSignature: string;
  candDocumentId: string;
  documentName: string;
  clientSignatureNotValid: boolean;
  vendorSignatureNotValid: boolean;
  offerSubmittedStatus: boolean;
  targetStartDate?: any;
  targetEndDate?: any;
  projectedStartDate?: any;
  projectedEndDate?: any;
  hours?: any;
  isDirty?: boolean;
  showAssignmentProjectionModal?: boolean;
  isAssignmentProjections?: boolean;
  serviceType?: any;
  reqEndDate?: any;
  reqStartDate?: any;
  statusIntId?: any;
  notAllowSignature?: any;
  docPortfolioData?: any;
}

class OfferInformation extends React.Component<
  OfferInformationProps,
  OfferInformationState
> {
  action: string;
  statusId: string;
  eventName: string;
  actionId: string;
  alertMessage: string;
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  public confirmationLetter;
  public candidateInfo;
  constructor(props: OfferInformationProps) {
    super(props);
    this.state = {
      reqId: "",
      reqNo: "",
      location: "",
      candSubDetails: {},
      targetStartDate: null,
      targetEndDate: null,
      projectedStartDate: null,
      projectedEndDate: null,
      hours: null,
      clientId: auth.getClient(),
      clientSignature: this.userObj.userFullName,
      vendorSignature: this.userObj.userFullName,
      candDocumentId: "",
      documentName: "",
      clientSignatureNotValid: false,
      vendorSignatureNotValid: false,
      offerSubmittedStatus: false,
      notAllowSignature: false
    };
  }

  componentDidMount() {
    const { subId } = this.props.match.params;
    this.setState({ candSubmissionId: subId });
    this.getClientSettings(this.state.clientId);
    this.getCandidateSubmissionDetails(subId);
  }

  candInfoCallback = (candidateInfo) => {
    this.setState({
      candidateName: candidateInfo.name,
      candidateAddress: candidateInfo.address,
      candidateCity: candidateInfo.city
    });
  };

  async getCandidateSubmissionDetails(candSubmissionId) {
    this.setState({ showLoader: true });
    await axios
      .get(`api/candidates/workflow/${candSubmissionId}`)
      .then((res) => {
        this.setState({
          reqNo: res.data.reqNumber,
          reqId: res.data.reqId,
          candSubDetails: res.data,
          locationId: res.data.locationId,
          positionId: res.data.positionId,
          candidateId: res.data.candidateId,
          location: res.data.location,
          jobPositionId: res.data.jobPositionId,
          divisionId: res.data.divisionId,
          jobWfTypeId: res.data.jobWfTypeId,
          status: res.data.status,
          statusIntId: res.data.statusIntId,
          targetStartDate: res.data.targetStartDate,
          targetEndDate: res.data.targetEndDate,
          projectedStartDate: res.data.targetStartDate,
          projectedEndDate: res.data.targetEndDate,
          reqStartDate: localDateTime(res.data.reqStartDate),
          reqEndDate: localDateTime(res.data.reqEndDate),
          showLoader: false,
        }, () => this.getDocPortfolio(candSubmissionId));
      });
  }

  getProviderContractCount = async () => {
    let eligibleContractCount;
    var finalState = {
      take: null,
      skip: 0,
    };
    var queryStr = `${toODataString(finalState, { utcDates: true })}`;
    const queryParams = `candSubId eq ${this.state.candSubmissionId} and serviceCategory eq 'Time' and status eq '${BillRateStatus.APPROVED}'`;

    var finalQueryString = KendoFilter(finalState, queryStr, queryParams);
    await axios.get(`api/candidates/billrate?${finalQueryString}`).then((res) => {
      console.log("Data", res.data);
      eligibleContractCount = res.data.length;
    });
    return eligibleContractCount;
  };

  handleActionClick = async (action, nextStateId?, eventName?, actionId?) => {
    if (action==CandidateWorkflowActions.SUBMIT_TO_VENDOR) {
      let eligibleContractCount = await this.getProviderContractCount();
      if (eligibleContractCount==0) {
        this.alertMessage = MAKE_OFFER_CONTRACT_VALIDATION_MSG;
        this.setState({ openAlert: true });
        return false;
      }
    }

    let change = {};
    var property = `show${action.replace(/ +/g, "")}Modal`;

    var docAlreadyExecuted = this.docAlreadyExecuted();

    if ((action==CandidateWorkflowActions.SUBMIT_TO_VENDOR || action==CandidateWorkflowActions.ACCEPT_OFFER) && 
        this.state.isConfirmationPdfRequired && !docAlreadyExecuted) {

      if(this.state.statusIntId==CandSubStatusIds.PENDINGOFFER){
        if (this.state.targetStartDate==null || this.state.targetStartDate==null){
          warningToastr(WARNING_MESSAGE_FOR_TARGET_DATES);
          return false;
        }

        if (!this.docAlreadyActive()){
          this.confirmationLetter.getConfirmationLetter("");
        }else{
          change[property] = true;
          this.setState(change);
        }
      }
  
      if(this.state.statusIntId==CandSubStatusIds.OFFERSUBMITTED){
        this.confirmationLetter.getDocumentPortfolio()
      }

      this.confirmationLetter.handleSetAction(eventName, actionId, nextStateId)
    }else{
      change[property] = true;
      this.setState(change);
    }

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
      history.push("/candidates/submitted/" + this.state.reqId);
    })
    .catch(error => {
      this.setState({ showLoader: false });
    });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  getDocPortfolio = (candSubmissionId) => {
    var submission = candSubmissionId;
    var queryParams = '';
    if (submission !="" && submission !=null && submission !=undefined) {
        queryParams = "?candSubmissionId=" + candSubmissionId + "&$filter=docType eq 'Confirmation Letter' and (status eq 'Executed' or status eq 'Client Signed')"
    }
    axios.get(`/api/candidates/${this.state.candidateId}/documents` + queryParams).then((res: any) => {
        if (res) {
          this.setState({ docPortfolioData: res.data })
        }
    });
  }

  docAlreadyExecuted = () => {
    var data = this.state.docPortfolioData.filter((i) => i.status ==DocStatus.EXECUTED && i.candidateId==this.state.candSubmissionId && i.docType==DocType.CONFIRMATIONLETTER);
    if (data.length > 0 || this.candidateInfo.state.isAlreadyExecuted) {
      return true;
    }else{
      return false;
    }
  }

  docAlreadyActive = () => {
    var data = this.state.docPortfolioData.filter((i) => i.status ==DocStatus.CLIENTSIGNED && i.candidateId==this.state.candSubmissionId && i.description !=null && i.docType==DocType.CONFIRMATIONLETTER);
    if (data.length > 0) {
      return true;
    }else{
      return false;
    }
  }

  candidateTaskUpdate = (successMsg, modal, props?) => {
    this.setState({ showLoader: true });
    const data = {
      candSubmissionId: this.state.candSubmissionId,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      ...props,
    };
    axios.put("api/candidates/candsubonboardingtask/status", JSON.stringify(data)).then((res) => {
      successToastr(successMsg);
      this.setState({ showLoader: false });
      // history.push("/candidate/manage/" + this.state.reqId);
      history.goBack();
    })
    .catch(error => {
      this.setState({ showLoader: false });
    });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  handleDisable = () => { }
  handleEnable = () => { }

  handleChange = (e) => {
    let change = { isDirty: true };
    change[e.target.name] = e.target.value;
    this.setState(change);
    if(e.target.name=="targetStartDate"){
      this.setState({ projectedStartDate: e.target.value });
    }else if(e.target.name=="targetEndDate"){
      this.setState({ projectedEndDate: e.target.value });
    }
  };

  generateProjections = (isOverrideProjection = false) => {
    this.setState({ showLoader: true });
    const data = {
      candSubmissionId: this.state.candSubmissionId,
      targetStartDate: localDateTime(this.state.targetStartDate),
      targetEndDate: localDateTime(this.state.targetEndDate),
      projectedStartDate: localDateTime(this.state.projectedStartDate),
      projectedEndDate: localDateTime(this.state.projectedEndDate),
      hours: this.state.hours,
      isOverrideProjection: isOverrideProjection,
      isGenerateGlobalProjection: true
    };
    axios.post("api/candidates/generateprojections", JSON.stringify(data)).then((res) => {
      if (res.data && !res.data.isSuccess) {
        errorToastr(res.data.statusMessage);
        this.setState({
          showLoader: false,
          serviceType: res.data.responseCode,
          showAssignmentProjectionModal: true
        });
      } else {
        successToastr(GENERATE_PROJECTION_SUCCESS_MSG);
        this.setState({ showLoader: false, hours: null, projectedStartDate: this.state.targetStartDate, projectedEndDate: this.state.targetEndDate });
      }
    }).catch(error => {
      this.setState({
        showLoader: false
      });
    });
  };

  getClientSettings = (clientId) => {
    clientSettingsData(clientId, SettingCategory.REPORT, SETTINGS.ASSIGNMENT_PROJECTION, (response) => {
      this.setState({ isAssignmentProjections : response });
    });

    clientSettingsData(clientId, SettingCategory.CANDIDATE, SETTINGS.CONFIRMATION_OF_ASSIGNMENT, (response) => {
      this.setState({ isConfirmationPdfRequired: response, showLoader: false });
    });
  };

  render() {
    const {
      candSubDetails,
      candidateId,
      candSubmissionId,
      status,
      showSubmitOfferModal,
      showAcceptOfferModal,
      showRejectOfferModal,
      reqId,
      reqNo,
      showLoader,
      location,
      positionId,
      jobPositionId,
      locationId,
      divisionId,
      showRejectCandidateModal,
      targetStartDate,
      targetEndDate,
      projectedStartDate,
      projectedEndDate,
      hours,
      isAssignmentProjections
    } = this.state;

    const projectionInfo = {
      targetStartDate,
      targetEndDate,
      projectedStartDate,
      projectedEndDate,
      candSubDetails,
      hours
    };
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3">
          <div className="col-12 p-0 shadow pt-1 pb-1">
            <PageTitle
              title="Offer Information"
              candSubmissionId={candSubmissionId}
              reqNumber={reqNo}
              pageUrl={`/requisitions/view/${reqId}`}
            />
            <div className="col-12">
              <Collapsible
                trigger={candTriggerName(
                  "Candidate Information",
                  this.state.status
                )}
                open={true}
              >
                {showLoader && <SkeletonWidget />}
                {!showLoader && candSubDetails && candidateId && (
                  <CandidateInformation
                    ref={(instance) => this.candidateInfo = instance }
                    candidateId={candidateId}
                    location={location}
                    callbackFromParent={this.candInfoCallback}
                    submissionData={this.state.candSubDetails}
                    getDocPortfolio={this.getDocPortfolio}
                  />
                )}
              </Collapsible>
              <Collapsible
                trigger={candTriggerName("Bill Rates and Expenses")}
                open={true}
              >
                {!showLoader &&
                  candSubmissionId &&
                  candSubDetails &&
                  locationId &&
                  positionId &&
                  jobPositionId && (
                    <BillRateAndExpenses
                      candSubmissionId={candSubmissionId}
                      candidateName={this.state.candidateName}
                      positionId={jobPositionId}
                      locationId={locationId}
                      divisionId={divisionId}
                      candidateSubStatus={status}
                      handleDisable={() => this.handleDisable()}
                      handleEnable={() => this.handleEnable()}
                    />
                  )}
              </Collapsible>
              {candSubDetails.statusIntId==CandSubStatusIds.OFFERSUBMITTED && isAssignmentProjections==true && (
              <Collapsible
                trigger={candTriggerName("Assignment Target Dates")}
                open={true}
              >
                {!showLoader &&
                  candSubmissionId && candSubDetails.statusIntId==CandSubStatusIds.OFFERSUBMITTED && isAssignmentProjections==true && (
                    <ProjectionTargetDates
                      data={projectionInfo}
                      handleChange={this.handleChange}
                      showLoader={showLoader}
                      generateProjection={true}
                      handleGenerateProjections={this.generateProjections}
                      reqDates={{reqStartDate:this.state.reqStartDate, reqEndDate:this.state.reqEndDate}}
                    />
                  )}
              </Collapsible>
              )}
              {candSubDetails.statusIntId==CandSubStatusIds.OFFERSUBMITTED && isAssignmentProjections==true && (
              <Collapsible
                trigger={candTriggerName("Assignment Forecast")}
                open={true}
              >
                {!showLoader &&
                  candSubmissionId && candSubDetails.statusIntId==CandSubStatusIds.OFFERSUBMITTED && isAssignmentProjections==true && (
                    <AssignmentProjections
                      candSubmissionId={candSubmissionId}
                      targetStartDate={this.state.targetStartDate}
                      targetEndDate={this.state.targetEndDate}
                    />
                  )}
              </Collapsible>
              )}
              <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0 px-0">
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
          </div>
        </div>
        {this.state.status && this.state.jobWfTypeId && (
          <FormActions
            wfCode={CandidateWorkflow.CANDIDATE}
            jobWfTypeId={this.state.jobWfTypeId}
            entityId={this.state.candSubmissionId}
            currentState={status}
            handleClick={this.handleActionClick}
            // cancelUrl={`${CAND_SUB_MANAGE_URL}${reqId}`}
            handleClose={() => history.goBack()}
          />
        )}
        <ConfirmationModal
          message={SUBMIT_TO_VENDOR_MSG}
          showModal={showSubmitOfferModal}
          handleYes={(e) =>
            this.candidateStatusUpdate(
              SUBMIT_TO_VENDOR_SUCCESS_MSG,
              "showSubmitOfferModal"
            )
          }
          handleNo={() => {
            this.setState({ showSubmitOfferModal: false });
          }}
        />
        {showRejectOfferModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={REJECT_OFFER(null)}
            showModal={showRejectOfferModal}
            handleYes={(data) =>
              this.candidateStatusUpdate(
                REJECT_OFFER_SUCCESS_MSG,
                "showRejectOfferModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showRejectOfferModal: false });
            }}
          />
        )}
        {showRejectCandidateModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={REJECT_CANDIDATE(null)}
            showModal={showRejectCandidateModal}
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
          message={ACCEPT_OFFER_MSG}
          showModal={showAcceptOfferModal}
          handleYes={(e) =>
            this.candidateTaskUpdate(
              ACCEPT_OFFER_SUCCESS_MSG,
              "showAcceptOfferModal"
            )
          }
          handleNo={() => {
            this.setState({ showAcceptOfferModal: false });
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

        {this.state.openAlert && (
          <AlertBox
            handleNo={() => {
              this.setState({ openAlert: false });
            }}
            message={this.alertMessage}
            showModal={this.state.openAlert}
          ></AlertBox>
        )}

        <ConfirmationLetter
            ref={(instance) => {
                this.confirmationLetter = instance;
            }
            }
            candSubmissionId={this.state.candSubmissionId}
            candidateId={candidateId}
            vendor={this.state.candSubDetails.vendor}
            updateCandWf={true}
            reqNumber={this.state.reqNo}
            reqId={this.state.reqId}
            createDocPortfolio={this.state.statusIntId==CandSubStatusIds.PENDINGOFFER ? true : false}
            getDocPortfolio={this.getDocPortfolio}
        />
        
        <ConfirmationModal
          message={OVERRIDE_EXISTING_PROJECTION_GENERATE_CONFIRMATION_MSG(this.state.serviceType)}
          showModal={this.state.showAssignmentProjectionModal}
          handleYes={() => {
            this.setState({ showAssignmentProjectionModal: false });
            this.generateProjections(true)
          }}
          handleNo={() => {
            this.setState({ showAssignmentProjectionModal: false });
          }}
        />
      </React.Fragment>
    );
  }
}

export default OfferInformation;
