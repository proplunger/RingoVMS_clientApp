import * as React from "react";
import Collapsible from "react-collapsible";
import axios from "axios";
import PageTitle from "../../Shared/Title";
import CandidateInformation from "../../Shared/CandidateInformation/CandidateInformation";
import CandidateRiskInfo from "../../Shared/CandidateRiskInfo/CandidateRiskInfo";
import { candTriggerName } from "../../ReusableComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comment } from "../../Shared/Comment/Comment";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import {
    RISK_REJECTED_SUCCESS_MSG,
    RISK_CLEARED_SUCCESS_MSG,
    CLEAR_RISK_CONFIRMATION_MSG,
    REJECT_RISK_CONFIRMATION_MSG,
    REJECT_CANDIDATE,
    REJECT_CANDIDATE_SUCCESS_MSG,
    WITHDRAW_CANDIDATE,
    WITHDRAW_CANDIDATE_SUCCESS_MSG,
} from "../../Shared/AppMessages";
import {
    EntityType,
    CandidateWorkflow
} from "../../Shared/AppConstants";
import { ConfirmationModal } from "../../Shared/ConfirmationModal";
import { history, successToastr } from "../../../HelperMethods";
import { RejectModal } from "../../Shared/RejectModal";
import FormActions from "../../Shared/Workflow/FormActions";
import {
    CAND_SUB_MANAGE_URL,
} from "../../Shared/ApiUrls";

export interface RiskClearanceFormProps {
    match: any;
}

export interface RiskClearanceFormState {
    candidateId?: string;
    candSubmissionId?: string;
    location?: string;
    reqNo?: string;
    reqId?: string;
    status?: string;
    jobWfTypeId?: string;
    candSubDetails?: any;
    showLoader?: boolean;
    openCommentBox?: boolean;
    showClearRiskModal?: boolean;
    showRejectRiskModal?: boolean;
    showRejectCandidateModal?: boolean;
    showWithdrawModal?: boolean;
}

class RiskClearanceForm extends React.Component<RiskClearanceFormProps, RiskClearanceFormState> {
    constructor(props: RiskClearanceFormProps) {
        super(props);
        this.state = {};
    }

    statusId: string;
    eventName: string;
    actionId: string;
    componentDidMount() {
        const { id, subId } = this.props.match.params;
        this.setState({ reqId: id, candSubmissionId: subId });
        this.getCandidateSubmissionDetails(subId);
    }

    async getCandidateSubmissionDetails(candSubmissionId) {
        this.setState({ showLoader: true });
        await axios.get(`api/candidates/workflow/${candSubmissionId}`).then((res) => {
            this.setState({
                reqNo: res.data.reqNumber,
                location: res.data.location,
                candSubDetails: res.data,
                candidateId: res.data.candidateId,
                status: res.data.status,
                jobWfTypeId: res.data.jobWfTypeId,
                showLoader: false,
            });
        });
    }

    candidateStatusUpdate = (successMsg, modal, props?) => {
        const data = {
            candSubmissionId: this.state.candSubmissionId,
            statusId: this.statusId,
            eventName: this.eventName,
            actionId: this.actionId,
            ...props,
        };
        axios.put("api/candidates/workflow/status", JSON.stringify(data)).then((res) => {
            successToastr(successMsg);
            // history.push(`${CAND_SUB_MANAGE_URL}${this.state.reqId}`);
            history.goBack();
        });
        // close the modal
        let change = {};
        change[modal] = false;
        this.setState(change);
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

    render() {
        return (
            <React.Fragment>
                <div className="col-11 mx-auto pl-0 pr-0 mt-3">
                    <div className="col-12 p-0 shadow pt-1 pb-1">
                        <PageTitle title="Risk Clearance" 
                        reqNumber={this.state.reqNo} 
                        requisitionId={this.state.reqId}
                        candSubmissionId={this.state.candSubmissionId}
                        pageUrl={`/requisitions/view/${this.state.reqId}`} />
                        <div className="col-12">
                            <Collapsible trigger={candTriggerName("Candidate Information", this.state.status)} open={true}>
                                {!this.state.showLoader && this.state.candSubDetails && this.state.candidateId && (
                                    <CandidateInformation 
                                    candidateId={this.state.candidateId} 
                                    location={this.state.location}
                                    submissionData={this.state.candSubDetails}
                                     />
                                )}
                            </Collapsible>
                            <Collapsible trigger={candTriggerName("Risk Information")} open={true}>
                                {this.state.candSubmissionId && (
                                    <CandidateRiskInfo candSubmissionId={this.state.candSubmissionId} isEnableRisk={false} />
                                )}
                            </Collapsible>
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
                {this.state.showRejectRiskModal && this.actionId &&
                    <RejectModal
                        actionId={this.actionId}
                        message={REJECT_RISK_CONFIRMATION_MSG}
                        showModal={this.state.showRejectRiskModal}
                        handleYes={(data) => this.candidateStatusUpdate(RISK_REJECTED_SUCCESS_MSG, "showRejectRiskModal", data)}
                        handleNo={() => {
                            this.setState({ showRejectRiskModal: false });
                        }}
                    />
                }
                {this.state.showRejectCandidateModal && this.actionId &&
                    <RejectModal
                        action={"Reject Candidate"}
                        actionId={this.actionId}
                        message={REJECT_CANDIDATE(null)}
                        showModal={this.state.showRejectCandidateModal}
                        handleYes={(data) => this.candidateStatusUpdate(REJECT_CANDIDATE_SUCCESS_MSG, "showRejectCandidateModal", data)}
                        handleNo={() => {
                            this.setState({ showRejectCandidateModal: false });
                        }}
                    />
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
                <ConfirmationModal
                    message={CLEAR_RISK_CONFIRMATION_MSG}
                    showModal={this.state.showClearRiskModal}
                    handleYes={(e) => this.candidateStatusUpdate(RISK_CLEARED_SUCCESS_MSG, "showClearRiskModal")}
                    handleNo={() => {
                        this.setState({ showClearRiskModal: false });
                    }}
                />
            </React.Fragment>
        );
    }
}

export default RiskClearanceForm;
