import { faPaperPlane, faTimesCircle, faSearch, faTimes, faEnvelope, faCheckCircle, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import { Editor } from "react-editor";
import "react-multi-email/style.css";
import * as React from "react";
import "./SendPresentation.css";
import axios from "axios";
import { callUserEmail, errorToastr, successToastr } from "../../../HelperMethods";
import { PRESENTATION_SENT_SUCCESS_MSG } from "../../Shared/AppMessages";
import { ErrorComponent } from "../../ReusableComponents";
import { NotificationTypeIds } from "../../Shared/AppConstants";

export interface SendPresentationProps {
    candSubmissionId: string;
    candidateName: string;
    candidateId: string;
    notificatioTypeId?: string;
    handleClose: any;
    updateCandidateStatus: any;
}

export interface SendPresentationState {
    emails: string[];
    senderEmail: string;
    subject?: string;
    summary?: string;
    showLoader?: boolean;
    ccEmails?: string[];
    userId?: string;
    emailErrorMessage?: string;
}

class SendPresentation extends React.Component<SendPresentationProps, SendPresentationState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public isSendClicked = false;
    constructor(props: SendPresentationProps) {
        super(props);
        this.state = { 
            emails: [],
            senderEmail: "",
            ccEmails: [],
            userId: this.userObj.userId
        };
    }

    getEmailTemplate = () => {
        // axios.get(`api/admin/notificationtemplate?$filter=notificationTypeIntId eq ${NotificationTypeIds.SENDPRESENTATION}`).then((res) => {
        //     this.setState({
        //         subject: res.data[0].subject,
        //         summary: res.data[0].body,
        //         showLoader: false,
        //     });
        // });
        axios.get(`api/candidates/candpresentationtemplate/${this.props.candSubmissionId}`).then((res) => {
            this.setState({
                subject: res.data.subject,
                summary: res.data.body,
                showLoader: false,
            });
        });
    };

    handleChange = (e) => {
        if (e.target) {
            let { name, value, type } = e.target;
            this.state[name] = value;
            this.setState(this.state);
        } else {
            this.setState({ summary: e });
        }
    };

    validate = () => {
        if (
            this.state.emails.length==0 ||
            this.state.subject=="" ||
            this.state.senderEmail=="" ||
            this.state.subject==undefined ||
            this.state.summary.replace(/<[^>]*>?/gm, "")=="" ||
            this.state.summary.replace(/<[^>]*>?/gm, "")==undefined ||
            (this.state.senderEmail && !isEmail(this.state.senderEmail))
        ) {
            return false;
        } else {
            return true;
        }
    };

    sendPresentation = () => {
        this.isSendClicked = true;
        if (this.validate()) {
            const data = {
                candSubmissionId: this.props.candSubmissionId,
                candidateId: this.props.candidateId,
                emailIds: this.state.emails.toString(),
                senderEmail: this.state.senderEmail,
                ccEmails: this.state.ccEmails.toString(),
                subject: this.state.subject,
                body: this.state.summary,
            };
            axios.post("api/candidates/presentation", JSON.stringify(data)).then((res) => {
                this.props.handleClose();
                if (res.data) {
                    this.props.updateCandidateStatus();
                    successToastr(PRESENTATION_SENT_SUCCESS_MSG);
                } else {
                    errorToastr("Please upload candidate's resume in document portfolio.");
                }
            });
        } else {
            this.setState(this.state);
            return false;
        }
    };

    componentDidMount() {
        this.getEmailTemplate();
        this.getUserEmail(this.state.userId);
    }

    getUserEmail = (userId) => {
        callUserEmail(userId, (res) => {
            this.setState({senderEmail: res})
        })
    }

    render() {
        const {emails, subject, summary, senderEmail, ccEmails} = this.state;
        return (
            <div className="modal-content border-0 modal-content-mobile">
                <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                    <h4 className="modal-title text-white fontFifteen">Send Presentation - {this.props.candidateName}</h4>
                    <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.handleClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body forSearchBox_advancesearch" id="forSearchBox" style={{ width: "710px" }}>
                    <div className="row ml-0 mr-0">
                        <div className="col-12">
                            <div className="bg-blue shadow envelop">
                                <FontAwesomeIcon className="head-icon" icon={faEnvelope}></FontAwesomeIcon>
                            </div>
                        </div>
                    </div>
                    <div className="row ml-0 mr-0 mt-1">
                        <div className="col-12">
                            <div className="mb-1 font-weight-bold text-center pt-2 pb-2">
                                Please fill in below details to send candidate presentation.
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2 ml-0 mr-0">
                        <div className="col-12 col-sm-2 col-lg-2">
                            <label className="font-weight-bold required">From</label>
                            <span className="pl-1">:</span>
                        </div>
                        <div className="col-12 col-sm-10 col-lg-10 pl-lg-0">
                            <input
                                type="email"
                                name="senderEmail"
                                value={senderEmail}
                                className="form-control"
                                placeholder="Enter Email"
                                maxLength={100}
                                // onChange={(e) => this.handleChange(e)}
                                disabled={true}
                            />
                            {this.isSendClicked && ((this.state.senderEmail=="" || this.state.senderEmail==undefined) ) && <ErrorComponent />}
                            {this.isSendClicked && ((this.state.senderEmail && !isEmail(this.state.senderEmail)) ) && <ErrorComponent message={'This is not a valid email'}/>}

                        </div>
                    </div>
                    <div className="row mt-3 ml-0 mr-0">
                        <div className="col-12 col-sm-2 col-lg-2">
                            <label className="font-weight-bold required">To</label>
                            <span className="pl-1">:</span>
                        </div>

                        <div className="col-12 col-sm-10 col-lg-10 pl-lg-0" id="SendPresentation">
                            <ReactMultiEmail
                                className="form-controll"
                                placeholder="Enter Email/s"
                                emails={emails}
                                onChange={(_emails: string[]) => {
                                    this.setState({ emails: _emails });
                                }}
                                validateEmail={(email) => {
                                    return isEmail(email); // return boolean
                                }}
                                getLabel={(email: string, index: number, removeEmail: (index: number) => void) => {
                                    return (
                                        <div data-tag key={index}>
                                            {email}
                                            <span data-tag-handle onClick={() => removeEmail(index)}>
                                                ×
                                            </span>
                                        </div>
                                    );
                                }}
                            />
                            {this.isSendClicked && this.state.emails.length==0 && <ErrorComponent />}
                        </div>
                    </div>

                    <div className="row mt-3 ml-0 mr-0">
                        <div className="col-12 col-sm-2 col-lg-2">
                            <label className="font-weight-bold">CC</label>
                            <span className="pl-1">:</span>
                        </div>

                        <div className="col-12 col-sm-10 col-lg-10 pl-lg-0" id="SendPresentation">
                            <ReactMultiEmail
                                className="form-controll"
                                placeholder="Enter Email/s"
                                emails={ccEmails}
                                onChange={(_emails: string[]) => {
                                    this.setState({ ccEmails: _emails });
                                }}
                                validateEmail={(email) => {
                                    return isEmail(email); // return boolean
                                }}
                                getLabel={(email: string, index: number, removeEmail: (index: number) => void) => {
                                    return (
                                        <div data-tag key={index}>
                                            {email}
                                            <span data-tag-handle onClick={() => removeEmail(index)}>
                                                ×
                                            </span>
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    </div>

                    <div className="row mt-3 ml-0 mr-0">
                        <div className="col-12 col-sm-2 col-lg-2">
                            <label className="font-weight-bold required">Subject</label>
                            <span className="pl-1">:</span>
                        </div>
                        <div className="col-12 col-sm-10 col-lg-10 pl-lg-0">
                            <input
                                type="text"
                                name="subject"
                                value={subject}
                                className="form-control"
                                placeholder="Enter Subject"
                                maxLength={1000}
                                onChange={(e) => this.handleChange(e)}
                            />
                            {this.isSendClicked && (this.state.subject=="" || this.state.subject==undefined) && <ErrorComponent />}
                        </div>
                    </div>

                    <div className="row mt-3 ml-0 mr-0">
                        <div className="col-12 col-sm-2 col-lg-2">
                            <label className="font-weight-bold required">Summary</label>
                            <span className="pl-1">:</span>
                        </div>

                        <div className="col-12 col-sm-10 col-lg-10 pl-lg-0 editor-container">
                            <Editor
                                placeholder="Type message to send..."
                                className="form-control text-editor"
                                value={summary}
                                name="summary"
                                onChange={(e) => this.handleChange(e)}
                            />
                            {this.isSendClicked && this.state.summary &&
                                (this.state.summary.replace(/<[^>]*>?/gm, "")=="" || this.state.summary.replace(/<[^>]*>?/gm, "")==undefined) && (
                                    <ErrorComponent />
                                )}
                        </div>
                    </div>
                </div>

                <div className="justify-content-center">
                    <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                        <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.handleClose}>
                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                        </button>

                        <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.sendPresentation()}>
                            <FontAwesomeIcon icon={faPaperPlane} className={"mr-1"} /> Send
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SendPresentation;
