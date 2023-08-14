import * as React from "react";
import { Editor } from "react-editor";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import "./SendCredentials.css";
import axios from "axios";
import {
  faPaperPlane,
  faTimesCircle,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { successToastr } from "../../../../HelperMethods";
import { SEND_CREDENTIAL_SUCCESS_MSG } from "../../../Shared/AppMessages";
import { CandSubOnBoardTaskStatusIds, TaskActions } from "../../../Shared/AppConstants";
import { ErrorComponent } from "../../../ReusableComponents";

export interface SendCredentialsProps {
  candidateName: string;
  candSubmissionId: string;
  candSubOnboardingTaskIds: any;
  notificationTypeId?: number;
  handleClose: any;
  handleSend?: any;
  filesData?: any;
  statusId?: any;
  eventName?: any;
  handleYes?: any;
}

export interface SendCredentialsState {
  emails: string[];
  subject?: string;
  summary?: string;
  showLoader?: boolean;
  filesData?: any;
}

class SendCredentials extends React.Component<
  SendCredentialsProps,
  SendCredentialsState
> {
  public isSendClicked = false;
  constructor(props: SendCredentialsProps) {
    super(props);
    this.state = { emails: [], filesData: [] };
  }

  getEmailTemplate = () => {
    axios
      .get(
        `api/admin/notificationtemplate?$filter=notificationTypeIntId eq ${this.props.notificationTypeId}`
      )
      .then((res) => {
        this.setState({
          subject: res.data[0].subject,
          summary: res.data[0].body,
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
      this.state.subject==undefined ||
      this.state.summary.replace(/<[^>]*>?/gm, "")=="" ||
      this.state.summary.replace(/<[^>]*>?/gm, "")==undefined
    ) {
      return false;
    } else {
      return true;
    }
  };

  removeDocument = (document) => {
    let data = this.state.filesData.filter(
      (i) => i.candDocumentsId != document.candDocumentsId
    );
    this.setState({ filesData: data });
  };

  SendCredentials = () => {
    this.isSendClicked = true;
    if (this.validate()) {
      const data = {
        candSubmissionId: this.props.candSubmissionId,
        CandSubOnboardingTaskIds: this.props.candSubOnboardingTaskIds,
        statusIntId: CandSubOnBoardTaskStatusIds.UNDERREVIEW,
        emailIds: this.state.emails.toString(),
        subject: this.state.subject,
        body: this.state.summary,
        statusId: this.props.statusId,
        eventName: this.props.eventName,
        actionName : TaskActions.UNDERREVIEW
      };
      axios.put("api/candidates/candsubonboardingtask/status", JSON.stringify(data)).then((res) => {
        this.props.handleYes();
        successToastr(SEND_CREDENTIAL_SUCCESS_MSG);
      });
    } else {
      this.setState(this.state);
      return false;
    }
  };

  componentDidMount() {
    this.getEmailTemplate();
    this.setState({ filesData: this.props.filesData });
  }

  render() {
    const { emails, subject, summary } = this.state;
    return (
      <div className="modal-content border-0 modal-content-mobile">
        <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
          <h4 className="modal-title text-white fontFifteen">
            Send Credentials - {this.props.candidateName}
          </h4>
          <button
            type="button"
            className="close text-white close_opacity"
            data-dismiss="modal"
            onClick={this.props.handleClose}
          >
            &times;
          </button>
        </div>
        <div
          className="modal-body forSearchBox_advancesearch"
          id="forSearchBox"
          style={{ width: "710px" }}
        >
          <div className="row ml-0 mr-0">
            <div className="col-12">
              <div className="bg-blue shadow envelop">
                <FontAwesomeIcon
                  className="head-icon"
                  icon={faEnvelope}
                ></FontAwesomeIcon>
              </div>
            </div>
          </div>
          <div className="row ml-0 mr-0 mt-1">
            <div className="col-12">
              <div className="mb-1 font-weight-bold text-center pt-2 pb-2">
                Please fill in below details to send credential package.
              </div>
            </div>
          </div>
          <div className="row mt-2 ml-0 mr-0">
            <div className="col-12 col-sm-2 col-lg-2">
              <label className="font-weight-bold required">To</label>
              <span className="pl-1">:</span>
            </div>

            <div
              className="col-12 col-sm-10 col-lg-10 pl-lg-0"
              id="SendCredentials"
            >
              <ReactMultiEmail
                className="form-controll"
                placeholder="Enter Emails"
                emails={emails}
                onChange={(_emails: string[]) => {
                  this.setState({ emails: _emails });
                }}
                validateEmail={(email) => {
                  return isEmail(email); // return boolean
                }}
                getLabel={(
                  email: string,
                  index: number,
                  removeEmail: (index: number) => void
                ) => {
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
              {this.isSendClicked && this.state.emails.length==0 && (
                <ErrorComponent />
              )}
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
              {this.isSendClicked &&
                (this.state.subject=="" ||
                  this.state.subject==undefined) && <ErrorComponent />}
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
              {this.isSendClicked &&
                (this.state.summary.replace(/<[^>]*>?/gm, "")=="" ||
                  this.state.summary.replace(/<[^>]*>?/gm, "") ==
                  undefined) && <ErrorComponent />}
            </div>
          </div>
          <div className="row mt-3 ml-0 mr-0">
            <div className="col-12 col-sm-2 col-lg-2">
              <label className="font-weight-bold required">Package: </label>
              <span className="pl-1">:</span>
            </div>

            <div className="col-12 col-sm-10 col-lg-10 pl-lg-0 gray">
              {this.state.filesData != undefined && this.state.filesData.length != 0
                ? this.state.filesData.map((item) => {
                  return (
                    <span
                      style={{
                        marginLeft: "2px",
                      }}
                    >
                      <span
                        className="text-underline text-underline-ellipse"
                        title="View Document"
                      >
                        {item.documentName}{" "}
                      </span>
                      <span
                        onClick={() => this.removeDocument(item)}
                        className="filenamecross"
                      >
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className={"nonactive-icon ml-1 mr-2"}
                        />
                      </span>
                    </span>
                  );
                })
                : <ErrorComponent message="Please select atleast one package" />}
            </div>
          </div>

          <div className="justify-content-center">
            <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
              <button
                type="button"
                className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                onClick={this.props.handleClose}
              >
                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />{" "}
                Close
              </button>

              <button
                type="button"
                disabled={this.state.filesData.length > 0 ? false : true}
                className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                onClick={() => this.SendCredentials()}
              >
                <FontAwesomeIcon icon={faPaperPlane} className={"mr-1"} /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SendCredentials;
