import * as React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { faTimesCircle, faClock,faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import PageTitle from "../../Shared/Title";
import CandidateInformation from "../../Shared/CandidateInformation/CandidateInformation";
import Collapsible from "react-collapsible";
import { EntityType } from "../../Shared/AppConstants";
import CandidateOwnership from "../../Candidates/CandidateOwnership/CandidateOwnership";
import SkeletonWidget from "../../Shared/Skeleton";
import { candTriggerName } from "../../ReusableComponents";
import {
  INTERVIEW_DETAILS,
  CAND_SUB_MANAGE_URL,
} from "../../Shared/ApiUrls";
import { history } from "../../../HelperMethods";

export interface ViewCandidateProps {
  match: any;
}

export interface ViewCandidateState {
  reqId: string;
  reqNo: string;
  location: string;
  candSubDetails: any;
  showLoader?: boolean;
  openCommentBox?: boolean;
  candSubmissionId?: string;
  candidateId?: string;
  status?: string;
  subStatusId?: string;
  isInterview?: string;
  showCandidateOwnershipModal?: boolean;
 
}

class ViewCandidate extends React.Component<
  ViewCandidateProps,
  ViewCandidateState
> {
  constructor(props: ViewCandidateProps) {
    super(props);
    this.state = {
      reqId: "",
      reqNo: "",
      location: "",
      candSubDetails: {},
    };
  }

  componentDidMount() {
    const { subId } = this.props.match.params;
    this.setState({ candSubmissionId: subId });
    this.getCandidateSubmissionDetails(subId);
  }

 async getCandidateSubmissionDetails(candSubmissionId) {
    this.setState({ showLoader: true });
    await  axios.get(`api/candidates/workflow/${candSubmissionId}`).then((res) => {
      this.setState({
        reqNo: res.data.reqNumber,
        reqId: res.data.reqId,
        candSubDetails: res.data,
        candidateId: res.data.candidateId,
        location: res.data.location,
        status: res.data.status,
        subStatusId: res.data.subStatusId,
        isInterview: res.data.isInterview,
        showLoader: false,
      });
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3">
          <div className="col-12 p-0 shadow pt-1 pb-1">
            <PageTitle
              title="View Candidate"
              candSubmissionId={this.state.candSubmissionId}
              reqNumber={this.state.reqNo}
              pageUrl={`/requisitions/view/${this.state.reqId}`}
            />
            <div className="col-12">
              <Collapsible
                trigger={candTriggerName(
                  "Candidate Information",
                  this.state.status,
                  "",
                  this.state.subStatusId
                )}
                open={true}
              >
                {this.state.showLoader && <SkeletonWidget />}
                {!this.state.showLoader &&
                  this.state.candSubDetails &&
                  this.state.candidateId && (
                    <CandidateInformation
                      candidateId={this.state.candidateId}
                      location={this.state.location}
                      candSubmissionId={this.state.candSubmissionId}
                    />
                  )}

                {this.state.candSubDetails && (
                  <div className="mb-3">
                    <div className="row text-dark mt-md-1 mt-1">
                      <div className="col-12 col-sm-4">
                        <div className="row">
                          <div className="col-6 text-right">
                            Submitted By Vendor :
                          </div>
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
                                className={
                                  "active-icon-blue ClockFontSize verticalAlign"
                                }
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
                      {/* {this.state.isInterview && (
                        <div className="col-12 col-sm-4">
                          <div className="row">
                            <div className="col-6 text-right">
                              Interview Details :
                            </div>
                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                              <Link
                                to={`${INTERVIEW_DETAILS}${this.state.candSubmissionId}`}
                              >
                                <span className="text-underline font-weight-bold text-dark">
                                <FontAwesomeIcon icon={faEye} className={"mr-2"} /> View
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )} */}
                    </div>
                  </div>
                )}

                <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0">
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
        <div className="col-12">
          <div className="col-sm-12 col-12 p-2">
            <div className="row text-center">
              <div className="col-12 mt-4 mb-4">
                {/* <Link to={`${CAND_SUB_MANAGE_URL}${this.state.reqId}`}> */}
                  <button
                    onClick={()=>history.goBack()}
                    type="button"
                    className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-2"} />
                    Close
                  </button>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ViewCandidate;
