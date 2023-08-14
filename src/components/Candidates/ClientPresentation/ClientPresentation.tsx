import * as React from "react";
import Collapsible from "react-collapsible";
import axios from "axios";
import PageTitle from "../../Shared/Title";
import CandidateInformation from "../../Shared/CandidateInformation/CandidateInformation";
import { candTriggerName } from "../../ReusableComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comment } from "../../Shared/Comment/Comment";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import {
    PRESENTATION_REJECTED_SUCCESS_MSG,
    PRESENTATION_HIRING_SUBMIT_SUCCESS_MSG,
    REQUEST_INTERVIEW_CONFIRMATION_MSG,
    REQUEST_INTERVIEW_SUCCESS_MSG,
    REJECT_PRESENTATION_CONFIRMATION_MSG,
    SUBMIT_PRESENTATION_CONFIRMATION_MSG,
    REJECT_CANDIDATE,
    REJECT_CANDIDATE_SUCCESS_MSG,
    REQUEST_AN_OFFER_SUCCESS_MSG,
    REQUEST_AN_OFFER_CONFIRMATION_MSG,
    INTERVIEW_REQUESTED_SUCCESS_MSG,
    SCHEDULE_INTERVIEW_CONFIRMATION_MSG,
    SUBMIT_AN_OFFER_SUCCESS_MSG,
    SUBMIT_AN_OFFER_CONFIRMATION_MSG,
    WITHDRAW_CANDIDATE,
    WITHDRAW_CANDIDATE_SUCCESS_MSG
} from "../../Shared/AppMessages";
import {
    EntityType,
    CandidateWorkflow,
    CandSubStatusIds
} from "../../Shared/AppConstants";
import { ConfirmationModal } from "../../Shared/ConfirmationModal";
import { history, localDateTime, successToastr } from "../../../HelperMethods";
import { RejectModal } from "../../Shared/RejectModal";
import { NameClearConfirmationModal } from "../../Shared/NameClearConfirmationModal";
import CandSubPresentationInfo from "../../Shared/CandSubPresentationInfo/CandSubPresentationInfo";
import { Dialog } from "@progress/kendo-react-dialogs";
import SendPresentation from "../SendPresentation/SendPresentation";
import FormActions from "../../Shared/Workflow/FormActions";
import BillRateAndExpenses from "../BillRateAndExpenses/BillRateAndExpenses";
import { CAND_SUB_MANAGE_URL } from "../../Shared/ApiUrls";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";

export interface ClientPresentationProps {
    match: any;
}

export interface ClientPresentationState {
    candidateId?: string;
    candidateName?: string;
    candidateEmail?: string;
    candidatePhoneNumber?: string;
    candidateMobileNumber?: string;
    candSubmissionId?: string;
    location?: string;
    reqNo?: string;
    reqId?: string;
    positionId?: string;
    jobPositionId?: string;
    locationId?: string;
    divisionId?: string;
    status?: string;
    jobWfTypeId?: string;
    candSubDetails?: any;
    showLoader?: boolean;
    openCommentBox?: boolean;
    showSubmitToHiringManagerModal?: boolean;
    showRejectPresentationModal?: boolean;
    showSendPresentationModal?: boolean;
    showRequestAnInterviewModal?: boolean;
    showRejectCandidateModal?: boolean;
    showReadyforOfferModal?: boolean;
    showScheduleInterviewModal?: boolean;
    nameClearNoFee?: boolean; // TODO to be removed
    showWithdrawModal?: boolean;
    statusIntId?: any;
    reqStartDate?:any;
}

class ClientPresentation extends React.Component<ClientPresentationProps, ClientPresentationState> {
    constructor(props: ClientPresentationProps) {
        super(props);
        this.state = {};
    }

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
                reqStartDate:res.data.reqStartDate,
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
                showLoader: false,
            });
        });
    }

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

    candInfoCallback = (candidateInfo) => {
        this.setState({
            candidateEmail: candidateInfo.email,
            candidateName: candidateInfo.name,
            candidatePhoneNumber: candidateInfo.phoneNumber,
            candidateMobileNumber: candidateInfo.mobileNumber,
        });
    };

    updatePresentationStatus = (successMsg, modal, props?) => {
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
            // history.push(`${CAND_SUB_MANAGE_URL}${this.state.reqId}`);
            history.goBack()
        });

        // close the modal
        let change = {};
        change[modal] = false;
        this.setState(change);
    };

    handleOnBillRateLoad = () => {
        var ele = document.getElementById("SubmitToHiringManager");
        if (ele) {
            ele.setAttribute("disabled", "true");
        }
    };

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
            if (modal=="showScheduleInterviewModal" && AppPermissions.CAND_INTVW_SCHEDULE) {
                history.push(`/candidate/manage/scheduleinterview/${this.state.candSubmissionId}`)
            }
            else {
                history.goBack();
            }
            // history.push("/candidate/manage/" + this.state.reqId);
        });
        // close the modal
        let change = {};
        change[modal] = false;
        this.setState(change);
    };

    closeSendPresentation = () => {
        this.setState({ showSendPresentationModal: false });
    };

    updateCandidatePresentationStatus = () => {
        if(this.state.statusIntId==CandSubStatusIds.VENDORPRESENTATIONSUBMITTED){
        this.setState({ showLoader: true });
        const data = {
            candSubmissionId: this.state.candSubmissionId,
            statusId: this.statusId,
            eventName: this.eventName,
            actionId: this.actionId,
            statusIntId: this.state.statusIntId
        };

        axios.put("api/candidates/workflow/status", JSON.stringify(data)).then((res) => {
            this.setState({ showLoader: false });
            // history.push(`${CAND_SUB_MANAGE_URL}${this.state.reqId}`);
            history.goBack()
            });
        }
    };

    render() {
        return (
            <React.Fragment>
                <div className="col-11 mx-auto pl-0 pr-0 mt-3">
                    <div className="col-12 p-0 shadow pt-1 pb-1">
                        <PageTitle title="Client Presentation" reqNumber={this.state.reqNo} candSubmissionId={this.state.candSubmissionId} pageUrl={`/requisitions/view/${this.state.reqId}`} />
                        <div className="col-12">
                            <Collapsible trigger={candTriggerName("Candidate Information", this.state.status)} open={true}>
                                {!this.state.showLoader && this.state.candSubDetails && this.state.candidateId && (
                                    <CandidateInformation
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
                                            isEnable={false} 
                                            candidateSubStatusIntId={this.state.statusIntId}
                                            reqStartDate={localDateTime(this.state.reqStartDate)}
                                            />
                                    )}
                            </Collapsible>
                            {/* {this.state.candidateId &&
                            <JobSummary candidateId={this.state.candidateId}></JobSummary>} */}
                        </div>
                        <hr />
                        <div className="col-12 col-sm-4 col-lg-4 mt-2 mb-2 mb-sm-0  mt-sm-0">
                            <label className="mb-0 font-weight-bold ">Comments</label>
                            <span onClick={() => this.setState({ openCommentBox: true })} className="text-underline cursorElement align-middle">
                                <FontAwesomeIcon icon={faClock} className="ml-1 active-icon-blue ClockFontSize" />
                            </span>
                            <Comment entityType={EntityType.CANDSUBMISSION} entityId={this.state.candSubmissionId} />
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
                        handleClick={this.handleActionClick}
                        // cancelUrl={`${CAND_SUB_MANAGE_URL}${this.state.reqId}`}
                        handleClose={() => history.goBack()}
                    />
                )}
                {this.state.showRejectPresentationModal && this.actionId && (
                    <RejectModal
                        actionId={this.actionId}
                        message={REJECT_PRESENTATION_CONFIRMATION_MSG(this.state.candidateName)}
                        showModal={this.state.showRejectPresentationModal}
                        handleYes={(data) => this.updatePresentationStatus(PRESENTATION_REJECTED_SUCCESS_MSG, "showRejectPresentationModal", data)}
                        handleNo={() => {
                            this.setState({ showRejectPresentationModal: false });
                        }}
                    />
                )}
                {this.state.showRejectCandidateModal && this.actionId && (
                    <RejectModal
                        action={"Reject Candidate"}
                        actionId={this.actionId}
                        message={REJECT_CANDIDATE(this.state.candidateName)}
                        showModal={this.state.showRejectCandidateModal}
                        handleYes={(data) => this.candidateStatusUpdate(REJECT_CANDIDATE_SUCCESS_MSG, "showRejectCandidateModal", data)}
                        handleNo={() => {
                            this.setState({ showRejectCandidateModal: false });
                        }}
                    />
                )}
                <NameClearConfirmationModal
                    message={SUBMIT_PRESENTATION_CONFIRMATION_MSG(this.state.candidateName)}
                    showModal={this.state.showSubmitToHiringManagerModal}
                    handleYes={(data) =>
                        this.updatePresentationStatus(PRESENTATION_HIRING_SUBMIT_SUCCESS_MSG, "showSubmitToHiringManagerModal", data)
                    }
                    handleNo={() => {
                        this.setState({ showSubmitToHiringManagerModal: false });
                    }}
                    commentTitle={"Summary"}
                    commentsRequired={true}
                    enterComments={true}
                    radioSelection={true}
                    radioBtnTitle={"Send Mail To Hiring Manager"}
                    radioBtnYesTitle={"Yes"}
                    radioBtnNoTitle={"No"}
                />
                <div id="advancesearchCompoent-popup">
                    {this.state.showSendPresentationModal && (
                        <div className="col-12">
                            <Dialog className="For-all-responsive-height">
                                <SendPresentation
                                    candSubmissionId={this.state.candSubmissionId}
                                    candidateId={this.state.candidateId}
                                    candidateName={this.state.candidateName}
                                    handleClose={() => this.closeSendPresentation()}
                                    updateCandidateStatus={() => this.updateCandidatePresentationStatus()}
                                ></SendPresentation>
                            </Dialog>
                        </div>
                    )}
                </div>
                <ConfirmationModal
                    message={REQUEST_INTERVIEW_CONFIRMATION_MSG}
                    showModal={this.state.showRequestAnInterviewModal}
                    handleYes={(e) => this.updatePresentationStatus(REQUEST_INTERVIEW_SUCCESS_MSG, "showRequestAnInterviewModal")}
                    handleNo={() => {
                        this.setState({ showRequestAnInterviewModal: false });
                    }}
                />
                <ConfirmationModal
                    message={REQUEST_AN_OFFER_CONFIRMATION_MSG}
                    showModal={this.state.showReadyforOfferModal}
                    handleYes={(e) => this.candidateStatusUpdate(REQUEST_AN_OFFER_SUCCESS_MSG, "showReadyforOfferModal")}
                    handleNo={() => {
                        this.setState({ showReadyforOfferModal: false });
                    }}
                />
                <ConfirmationModal
                    message={SCHEDULE_INTERVIEW_CONFIRMATION_MSG}
                    showModal={this.state.showScheduleInterviewModal}
                    handleYes={(e) => this.candidateStatusUpdate(INTERVIEW_REQUESTED_SUCCESS_MSG, "showScheduleInterviewModal")}
                    handleNo={() => {
                        this.setState({ showScheduleInterviewModal: false });
                    }}
                />
                {
                    //<ConfirmationModal
                    //    message={SUBMIT_AN_OFFER_CONFIRMATION_MSG}
                    //    showModal={this.state.showReadyforOfferModal}
                    //    handleYes={(e) => this.candidateStatusUpdate(SUBMIT_AN_OFFER_SUCCESS_MSG, "showReadyforOfferModal")}
                    //    handleNo={() => {
                    //        this.setState({ showReadyforOfferModal: false });
                    //    }}
                    ///>
                }
                {this.state.showWithdrawModal && this.actionId &&
                    <RejectModal
                        action={"Withdraw"}
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

export default ClientPresentation;
