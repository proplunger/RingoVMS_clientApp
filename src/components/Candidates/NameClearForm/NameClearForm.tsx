import * as React from "react";
import axios from "axios";
import { ConfirmationModal } from "../../Shared/ConfirmationModal";
import { NameClearConfirmationModal } from "../../Shared/NameClearConfirmationModal";
import { RejectModal } from "../../Shared/RejectModal";
import { history, successToastr } from "../../../HelperMethods";
import SkeletonWidget from "../../Shared/Skeleton";
import { faCheckCircle, faTimesCircle, faClock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comment } from "../../Shared/Comment/Comment";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import PageTitle from "../../Shared/Title";
import CandidateInformation from "../../Shared/CandidateInformation/CandidateInformation";
import CandidateOwnership from "../../Candidates/CandidateOwnership/CandidateOwnership";
import Collapsible from "react-collapsible";
import {
    NAME_CLEARED_CANDIDATE_SUCCESS_MSG,
    NAME_NOT_CLEARED_CANDIDATE_SUCCESS_MSG,
    DELEGATE_CANDIDATE_SUCCESS_MSG,
    DELGATE_CONFIRMATION_MSG,
    NAME_CLEAR_CONFIRMATION_MSG,
    NAME_NOT_CLEAR_CONFIRMATION_MSG,
    REJECT_CANDIDATE,
    REJECT_CANDIDATE_SUCCESS_MSG,
    WITHDRAW_CANDIDATE,
    WITHDRAW_CANDIDATE_SUCCESS_MSG,
} from "../../Shared/AppMessages";
import {
    EntityType,
    CandSubStatusIds,


    CandidateWorkflow
} from "../../Shared/AppConstants";
import FormActions from "../../Shared/Workflow/FormActions";
import { candTriggerName } from "../../ReusableComponents";
import {
    CAND_SUB_MANAGE_URL,
} from "../../Shared/ApiUrls";

export interface NameClearFormProps {
    match: any;
}

export interface NameClearFormState {
    reqId: string;
    reqNo: string;
    location: string;
    candSubDetails: any;
    showLoader?: boolean;
    showNameClearModal?: boolean;
    showNameNotClearModal?: boolean;
    showDelegateNameClearModal?: boolean;
    openCommentBox?: boolean;
    candSubmissionId?: string;
    candidateId?: string;
    jobWfTypeId?: string;
    status?: string;
    showCandidateOwnershipModal?: boolean;
    showRejectCandidateModal?: boolean;
    candidateEmail?: string;
    candidateName?: string;
    showWithdrawModal?: boolean;
}

class NameClearForm extends React.Component<NameClearFormProps, NameClearFormState> {
    constructor(props: NameClearFormProps) {
        super(props);
        this.state = {
            reqId: "",
            reqNo: "",
            location: "",
            candSubDetails: {},
        };
    }

    statusId: string;
    eventName: string;
    actionId: string;

    componentDidMount() {
        const { id, subId } = this.props.match.params;
        this.setState({ candSubmissionId: subId, reqId: id });
        this.getCandidateSubmissionDetails(subId);
    }

    getCandidateSubmissionDetails(candSubmissionId) {
        this.setState({ showLoader: true });
        axios.get(`api/candidates/workflow/${candSubmissionId}`).then((res) => {
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

    // dynamic action click
    handleActionClick = (action, nextStateId?, eventName?, actionId?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.statusId = nextStateId;
        this.eventName = eventName;
        this.actionId = actionId;
    };

    candInfoCallback = (candidateInfo) => {
        this.setState({
            candidateEmail: candidateInfo.email,
            candidateName: candidateInfo.name
        });
    };

    render() {
        return (
            <React.Fragment>
                <div className="col-11 mx-auto pl-0 pr-0 mt-3">
                    <div className="col-12 p-0 shadow pt-1 pb-1">
                        <PageTitle title="Name Clear Form" reqNumber={this.state.reqNo} pageUrl={`/requisitions/view/${this.state.reqId}`} candSubmissionId={this.state.candSubmissionId} requisitionId={this.state.reqId} />
                        <div className="col-12">
                            <Collapsible trigger={candTriggerName("Candidate Information", this.state.status)} open={true}>
                                {this.state.showLoader && <SkeletonWidget />}
                                {!this.state.showLoader && this.state.candSubDetails && this.state.candidateId && (
                                    <CandidateInformation
                                        callbackFromParent={this.candInfoCallback}
                                        candidateId={this.state.candidateId}
                                        location={this.state.location}
                                        candSubDetails={this.state.candSubDetails}
                                    />
                                )}

                                {this.state.candSubDetails && (
                                    <div className="mb-3">
                                        <div className="row text-dark mt-md-3 mt-1">
                                            <div className="col-12 col-sm-4">
                                                <div className="row">
                                                    <div className="col-6 text-right">Submitted By Vendor :</div>
                                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                                                        {this.state.candSubDetails.vendor}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-4">
                                                <div className="row">
                                                    <div className="col-6 text-right cursorElement pl-0">
                                                        <span
                                                            className="text-underline col-12"
                                                            onClick={() =>
                                                                this.setState({
                                                                    showCandidateOwnershipModal: true,
                                                                })
                                                            }
                                                        >
                                                            Vendor Ownership
                                                        </span>
                                                        <span
                                                            className="verticalAlign"
                                                            onClick={() =>
                                                                this.setState({
                                                                    showCandidateOwnershipModal: true,
                                                                })
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faClock}
                                                                className={"active-icon-blue ClockFontSize verticalAlign"}
                                                            />
                                                        </span>
                                                    </div>

                                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                                                        {this.state.candSubDetails.vendor}

                                                        {this.state.showCandidateOwnershipModal && (
                                                            <CandidateOwnership
                                                                candidateId={this.state.candidateId}
                                                                handleNo={() => {
                                                                    this.setState({
                                                                        showCandidateOwnershipModal: false,
                                                                    });
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0 px-0">
                                    <label className="mb-0 font-weight-bold ">Comments</label>
                                    <span
                                        onClick={() => this.setState({ openCommentBox: true })}
                                        className="text-underline cursorElement align-middle"
                                    >
                                        <FontAwesomeIcon icon={faClock} className="ml-1 active-icon-blue ClockFontSize" />
                                    </span>
                                    <Comment entityType={EntityType.CANDSUBMISSION} entityId={this.state.candSubmissionId} />
                                </div>
                                {this.state.candSubDetails.reqId && this.state.openCommentBox && (
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
                        </div>
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
                {this.state.showWithdrawModal && this.actionId &&
                    <RejectModal
                        action={"Withdraw"}
                        actionId={this.actionId}
                        message={WITHDRAW_CANDIDATE(this.state.candidateName)}
                        showModal={this.state.showWithdrawModal}
                        handleYes={(data) => this.candidateStatusUpdate(WITHDRAW_CANDIDATE_SUCCESS_MSG, "showWithdrawModal", data)}
                        handleNo={() => {
                            this.setState({ showWithdrawModal: false });
                        }}
                    />
                }
                <NameClearConfirmationModal
                    message={NAME_CLEAR_CONFIRMATION_MSG}
                    showModal={this.state.showNameClearModal}
                    handleYes={(data) => this.candidateStatusUpdate(NAME_CLEARED_CANDIDATE_SUCCESS_MSG, "showNameClearModal", data)}
                    handleNo={() => {
                        this.setState({ showNameClearModal: false });
                    }}
                    radioSelection={true}
                    radioBtnYesTitle={"Name Clear"}
                    radioBtnNoTitle={"Name Clear No Fee"}
                />
                {this.state.showNameNotClearModal && this.actionId &&
                    <RejectModal
                        actionId={this.actionId}
                        message={NAME_NOT_CLEAR_CONFIRMATION_MSG(this.state.candidateName)}
                        showModal={this.state.showNameNotClearModal}
                        handleYes={(data) => this.candidateStatusUpdate(NAME_NOT_CLEARED_CANDIDATE_SUCCESS_MSG, "showNameNotClearModal", data)}
                        handleNo={() => {
                            this.setState({ showNameNotClearModal: false });
                        }}
                    />
                }
                <ConfirmationModal
                    message={DELGATE_CONFIRMATION_MSG}
                    showModal={this.state.showDelegateNameClearModal}
                    handleYes={() => this.candidateStatusUpdate(DELEGATE_CANDIDATE_SUCCESS_MSG, "showDelegateNameClearModal")}
                    handleNo={() => {
                        this.setState({ showDelegateNameClearModal: false });
                    }}
                />
            </React.Fragment>
        );
    }
}

export default NameClearForm;
