import { faClock, faCopy, faHandPaper, faThumbsDown, faThumbsUp, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Link } from "react-router-dom";
import BaseRequisition from "../../Shared/BaseRequisition/BaseRequisition";
import {
    APPROVE_ORDER_ACTION,
    APPROVE_ORDER_SUCCESS_MSG,
    HOLD_APPROVAL_STATUS,
    HOLD_ORDER_ACTION,
    HOLD_ORDER_SUCCESS_MSG,
    REMOVE_HOLD_ORDER_ACTION,
    REMOVE_HOLD_ORDER_SUCCESS_MSG,
    ORDER_NOT_ASSIGNED_MSG,
    REJECT_APPROVAL_STATUS,
    REJECT_ORDER_ACTION,
    REJECT_ORDER_SUCCESS_MSG,
} from "../../Shared/AppMessages";
import { Comment } from "../../Shared/Comment/Comment";
import axios from "axios";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { clientSettingData, errorToastr, history, successToastr } from "../../../HelperMethods";
import CommentHistoryBox, { CommentHistoryRow } from "../../Shared/Comment/CommentHistoryBox";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import auth from "../../Auth";
import { ReqUrls } from "../../Shared/ApiUrls";

export interface ReviewRequisitionProps {
    match: any;
}

export interface ReviewRequisitionState {
    reqId: string;
    reqDetails: any;
    message?: string;
    clientId: string;
    showModal?: boolean;
    action?: string;
    comment?: string;
    showCommentError?: boolean;
    openCommentBox?: boolean;
    isEnableDepartment?: boolean;
}

class ReviewRequisition extends React.Component<ReviewRequisitionProps, ReviewRequisitionState> {
    constructor(props: ReviewRequisitionProps) {
        super(props);
        this.state = { clientId: auth.getClient(), reqId: "", reqDetails: {}, comment: "", showCommentError: false, isEnableDepartment: false };
    }
    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ reqId: id });
        this.getReqDetails(id);
        this.getClientSetting(this.state.clientId)
    }

    getReqDetails(reqId: string) {
        axios.get(`api/requisitions/${reqId}`).then((res) => {
            const { data } = res;
            if (!data.isOrderAssigned) {
                errorToastr(ORDER_NOT_ASSIGNED_MSG);
                setTimeout(() => {
                    history.push(ReqUrls.APPROVAL);
                }, 3000);
            } else {
                const reqDetails = { ...data };
                this.setState({ reqDetails: reqDetails });
            }
        });
    }

    confirmAction(action: string) {
        const msg = `Are you sure you want to ${action.toLowerCase()} the requisition?`;
        this.setState({ showModal: true, message: msg, action: action });
    }

    reviewRequisition() {
        if (this.state.action !=APPROVE_ORDER_ACTION && !this.state.comment) {
            this.setState({ showCommentError: true });
            return;
        }
        this.setState({ showModal: false });
        const { action, comment } = this.state;
        const data = {
            requisitions: [
                {
                    reqId: this.state.reqId,
                    actionStatus: action,
                },
            ],
            comment: comment,
        };

        axios.put("/api/requisitions/status", data).then((res) => {
            if (res.data.filter((c) => !c.isUpdated).length > 0) {
                var errorMsg = "This requisition is no longer in your approval queue.";
                errorToastr(errorMsg);
            } else {
                successToastr(this.getSuccessMsg());
            }
            history.push(ReqUrls.APPROVAL);
        });
    }

    getClientSetting = (id) => {
        clientSettingData(id, (response) => {
            this.setState({ isEnableDepartment: response });
        });
    };

    // handle change for comment
    handleChange = (e) => {
        let change = { showCommentError: e.target.value.replace(/ +/g, "")=="" };
        change[e.target.name] = e.target.value;
        this.setState(change);
    };

    getSuccessMsg() {
        var successMsg = APPROVE_ORDER_SUCCESS_MSG;
        switch (this.state.action) {
            case APPROVE_ORDER_ACTION:
                successMsg = APPROVE_ORDER_SUCCESS_MSG;
                break;
            case REJECT_ORDER_ACTION:
                successMsg = REJECT_ORDER_SUCCESS_MSG;
                break;
            case REMOVE_HOLD_ORDER_ACTION:
                successMsg = REMOVE_HOLD_ORDER_SUCCESS_MSG;
                break;
            case HOLD_ORDER_ACTION:
                successMsg = HOLD_ORDER_SUCCESS_MSG;
                break;
        }
        return successMsg;
    }

    render() {
        const { reqDetails, isEnableDepartment } = this.state;
        return (
            <React.Fragment>
                <div className="col-11 mx-auto pl-0 pr-0 mt-3">
                    <div className="col-12 p-0 shadow pt-1 pb-1">
                        {this.state.reqId && (
                            <div>
                                <BaseRequisition reqId={this.state.reqId} reqDetails={reqDetails} title="Review" isEnableDepartment={isEnableDepartment}/>
                                {auth.hasPermissionV2(AppPermissions.REQ_COMMENT_CREATE) && <div className="">
                                    <div className="col-12 pl-0 pr-0">
                                        <div className="col-12 col-md-4 mt-2 mb-2">
                                            <label className="mb-0 font-weight-bold">Comments</label>
                                            <span onClick={() => this.setState({ openCommentBox: true })} className="text-underline cursorElement align-middle">
                                                <FontAwesomeIcon icon={faClock} className="ml-1 active-icon-blue ClockFontSize" />
                                            </span>
                                            <Comment entityType={"Requisition"} entityId={this.state.reqId} />
                                        </div>
                                    </div>
                                    {auth.hasPermissionV2(AppPermissions.REQ_COMMENT_VIEW) && this.state.reqId && this.state.openCommentBox && (
                                        <CommentHistoryBox
                                            entityType={"Requisition"}
                                            entityId={this.state.reqId}
                                            showDialog={this.state.openCommentBox}
                                            handleNo={() => {
                                                this.setState({ openCommentBox: false });
                                                document.body.style.position = "";
                                            }}
                                        />
                                    )}
                                </div>}
                            </div>
                        )}
                    </div>
                </div>
                <ConfirmationModal
                    message={this.state.message}
                    showModal={this.state.showModal}
                    handleYes={() => this.reviewRequisition()}
                    handleNo={() => {
                        this.setState({ showModal: false, showCommentError: false, comment: "" });
                    }}
                    enterComments={true}
                    commentsChange={this.handleChange}
                    showError={this.state.showCommentError}
                    commentsRequired={this.state.action !=APPROVE_ORDER_ACTION}
                />
                <div className="col-12">
                    <div className="col-sm-12 col-12 p-2">
                        <div className="row text-center">
                            <div className="col-12 mt-4 mb-4 forallDisbaled">
                                <button type="button" onClick={() => history.goBack()} className="btn button button-close mr-2 shadow mb-2 mb-xl-0">
                                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-2"} />
                                        Close
                                    </button>
                                {(auth.hasPermissionV2(AppPermissions.REQ_HOLD) || auth.hasPermissionV2(AppPermissions.REQ_OFFHOLD)) && <button
                                    type="button"
                                    className="btn button button-onHold-newClr mr-2 shadow mb-2 mb-xl-0"
                                    onClick={() => {
                                        this.confirmAction(reqDetails.status==HOLD_APPROVAL_STATUS ? REMOVE_HOLD_ORDER_ACTION : HOLD_ORDER_ACTION);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faHandPaper} className={"mr-2"} />
                                    {reqDetails.status==HOLD_APPROVAL_STATUS ? "Remove Hold" : "Hold"}
                                </button>}

                                {auth.hasPermissionV2(AppPermissions.REQ_REJECT) && <button
                                    type="button"
                                    onClick={() => {
                                        this.confirmAction(REJECT_ORDER_ACTION);
                                    }}
                                    disabled={reqDetails.status==HOLD_APPROVAL_STATUS}
                                    className="btn button button-reject mr-2 shadow mb-2 mb-xl-0"
                                >
                                    <FontAwesomeIcon icon={faThumbsDown} className={"mr-2"} />
                                    Reject
                                </button>}

                                {auth.hasPermissionV2(AppPermissions.REQ_APPROVE) && <button
                                    type="button"
                                    onClick={() => {
                                        this.confirmAction(APPROVE_ORDER_ACTION);
                                    }}
                                    disabled={reqDetails.status==HOLD_APPROVAL_STATUS}
                                    className="btn button button-bg-newClr mr-2 shadow mb-2 mb-xl-0"
                                >
                                    <FontAwesomeIcon icon={faThumbsUp} className={"mr-2"} />
                                    Approve
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ReviewRequisition;
