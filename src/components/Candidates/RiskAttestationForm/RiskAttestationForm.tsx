import * as React from "react";
import Collapsible from "react-collapsible";
import axios from "axios";
import auth from "../../Auth";
import PageTitle from "../../Shared/Title";
import CandidateInformation from "../../Shared/CandidateInformation/CandidateInformation";
import CandidateRiskInfo from "../../Shared/CandidateRiskInfo/CandidateRiskInfo";
import { candTriggerName } from "../../ReusableComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comment } from "../../Shared/Comment/Comment";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import {
    PENDING_RISK_SAVE_SUCCESS_MSG,
    PENDING_RISK_SUBMIT_SUCCESS_MSG,
    SUBMIT_RISK_CONFIRMATION_MSG_ONE,
    SUBMIT_RISK_CONFIRMATION_MSG_TWO,
    WITHDRAW_CANDIDATE,
    WITHDRAW_CANDIDATE_SUCCESS_MSG,
    REJECT_CANDIDATE,
    REJECT_CANDIDATE_SUCCESS_MSG,
    CANDIDATE_EMAIL_VALIDATION,
} from "../../Shared/AppMessages";
import {
    EntityType,


    CandidateWorkflow
} from "../../Shared/AppConstants";
import {
    Controllers,
    CandidateControllerActions,
} from "../../Shared/AppPermissions";
import { DeclarationModal } from "../../Shared/DeclarationModal";
import { errorToastr, history, successToastr } from "../../../HelperMethods";
import FormActions from "../../Shared/Workflow/FormActions";
import {
    APP_HOME_URL,
    CAND_SUB_MANAGE_URL,
} from "../../Shared/ApiUrls";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import RejectModal from "../../Shared/RejectModal";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";

export interface RiskAttestationFormProps {
    match: any;
}

export interface RiskAttestationFormState {
    candidateId?: string;
    candSubmissionId?: string;
    location?: string;
    candidateEmail?: string;
    candidateName?: string;
    reqNo?: string;
    reqId?: string;
    jobWfTypeId?: string;

    status?: string;

    candSubDetails?: any;
    showLoader?: boolean;

    openCommentBox?: boolean;
    showSubmitModal?: boolean;

    candRiskInfoId?: string;
    providerEmail?: string;

    isSubmit?: boolean;
    isEnableRisk?: boolean;

    showWithdrawModal?: boolean;

    showRejectCandidateModal?: boolean;
}
const refCand = React.createRef<CandidateInformation>();
const refRisk = React.createRef<CandidateRiskInfo>();

class RiskAttestationForm extends React.Component<RiskAttestationFormProps, RiskAttestationFormState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    constructor(props: RiskAttestationFormProps) {
        super(props);
        this.state = {
            providerEmail: "",
            isEnableRisk: true,
        };
    }

    action: string;
    statusId: string;
    eventName: string;
    actionId: string;

    componentDidMount() {
        const { id, subId } = this.props.match.params;
        this.setState({ reqId: id, candSubmissionId: subId });
        this.getCandidateSubmissionDetails(subId);
    }

    candInfoCallback = (candidateInfo) => {
        this.setState({
            candidateEmail: candidateInfo.email,
            candidateName: candidateInfo.name,
        });

        if(this.state.candidateEmail==null){
            errorToastr(CANDIDATE_EMAIL_VALIDATION);
        }
    };

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

    validateSubmission = (action, nextStateId?, eventName?, actionId?) => {
        const { showErrors, riskInfoDetails } = refRisk.current.validateField();
        if (action=="Submit") {
            if (showErrors) return false;
        }
        if (action=="Submit") {
            this.setState({ showSubmitModal: true });
            this.action = action;
            this.statusId = nextStateId;
            this.eventName = eventName;
        } else {
            this.saveRiskAttestation(action, nextStateId, eventName, actionId);
        }
    };

    saveRiskAttestation = (action, nextStateId?, eventName?, actionId?) => {
        this.action = action;
        if (action=="Withdraw") {
            this.statusId = nextStateId;
            this.eventName = eventName;
            this.actionId = actionId;
            this.setState({ showWithdrawModal: true });
        }
        else if (action=="Reject Candidate") {
            this.statusId = nextStateId;
            this.eventName = eventName;
            this.actionId = actionId;
            this.setState({ showRejectCandidateModal: true });
        }
        else {
            const { riskInfoDetails } = refRisk.current.validateField();
            let data = {
                candSubmissionId: this.state.candSubmissionId,
                statusId: nextStateId,
                isSubmit: false,
                eventName: eventName,
                actionId: this.actionId,
                ...riskInfoDetails,
            };
            data["isSubmit"] = action=="Submit" ? true : false;
            const successMsg = action=="Submit" ? PENDING_RISK_SUBMIT_SUCCESS_MSG : PENDING_RISK_SAVE_SUCCESS_MSG;
            let httpVerb = data.candSubRiskInfoId ? "put" : "post";
            axios[httpVerb]("api/candidates/riskinfo", JSON.stringify(data)).then((res) => {
                successToastr(successMsg);
                if (auth.hasPermissionV2(AppPermissions.CANDIDATE_UPDATE)) {
                    // history.push(`${CAND_SUB_MANAGE_URL}${this.state.reqId}`);
                    history.goBack();
                } else {
                    window.location.href = APP_HOME_URL;
                }
            });
        }

    };

    // reject and withdraw candidate
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
            // history.push('/candidate/manage/' + this.state.reqId);
            history.goBack();
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
                        <PageTitle title="Risk Attestation" reqNumber={this.state.reqNo} requisitionId={this.state.reqId} candSubmissionId={this.state.candSubmissionId} pageUrl={`/requisitions/view/${this.state.reqId}`} />
                        <div className="col-12">
                            <Collapsible trigger={candTriggerName("Candidate Information", this.state.status)} open={true}>
                                {!this.state.showLoader && this.state.candSubDetails && this.state.candidateId && (
                                    <CandidateInformation
                                        ref={refCand}
                                        callbackFromParent={this.candInfoCallback}
                                        candidateId={this.state.candidateId}
                                        location={this.state.location}
                                        submissionData={this.state.candSubDetails}
                                    />
                                )}
                            </Collapsible>
                            <Collapsible trigger={candTriggerName("Risk Information")} open={true}>
                                {!this.state.showLoader && this.state.candSubmissionId && this.state.candidateEmail && (
                                    <CandidateRiskInfo
                                        ref={refRisk}
                                        candSubmissionId={this.state.candSubmissionId}
                                        candidateEmail={this.state.candidateEmail}
                                        isEnableRisk={true}
                                    />
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
                        handleClick={this.validateSubmission}
                        // cancelUrl={`${CAND_SUB_MANAGE_URL}${this.state.reqId}`}
                        handleClose={() => history.goBack()}
                    />
                )}
                <DeclarationModal
                    message={SUBMIT_RISK_CONFIRMATION_MSG_ONE}
                    declarationMessage={SUBMIT_RISK_CONFIRMATION_MSG_TWO}
                    signature={this.userObj.userFullName}
                    name={this.state.candidateName}
                    showModal={this.state.showSubmitModal}
                    handleYes={(e) => this.saveRiskAttestation(this.action, this.statusId, this.eventName)}
                    handleNo={() => {
                        this.setState({ showSubmitModal: false });
                    }}
                />
                {this.state.showWithdrawModal && this.actionId &&
                    <RejectModal
                        action={this.action}
                        actionId={this.actionId}
                        message={WITHDRAW_CANDIDATE(this.state.candidateName)}
                        showModal={this.state.showWithdrawModal}
                        handleYes={(data) => this.candidateStatusUpdate(WITHDRAW_CANDIDATE_SUCCESS_MSG, "showWithdrawModal", data)}
                        handleNo={() => {
                            this.setState({ showWithdrawModal: false });
                        }}
                    />
                }
                {this.state.showRejectCandidateModal && this.actionId &&
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
                }
            </React.Fragment>
        );
    }
}

export default RiskAttestationForm;
