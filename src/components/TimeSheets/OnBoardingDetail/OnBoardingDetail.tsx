import * as React from "react";
import axios from "axios";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageTitle from "../../Shared/Title";
import CandidateInformation from "../../Shared/CandidateInformation/CandidateInformation";
import Collapsible from "react-collapsible";
import SkeletonWidget from "../../Shared/Skeleton";
import { candTriggerName, ErrorComponent } from "../../ReusableComponents";
import { EntityType } from "../../Shared/AppConstants";
import { Comment } from "../../Shared/Comment/Comment";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import CloseLink from "../../Shared/CloseLink";
import CandSubPresentationInfo from "../../Shared/CandSubPresentationInfo/CandSubPresentationInfo";
import CandidateRiskInfo from "../../Shared/CandidateRiskInfo/CandidateRiskInfo";
import { APP_HOME_URL } from "../../Shared/ApiUrls";
import AllRoundResultView from "../../Candidates/RoundCapture/ViewAllResults/ViewAllResultsGrid";
import TasksComponent from "../../Candidates/CandidateOnBoarding/Task/TasksComponent";
import AlertBox from "../../Shared/AlertBox";
import { INFO_MSG_FOR_BILLRATES_DATE_UPDATE } from "../../Shared/AppMessages";
import { localDateTime } from "../../../HelperMethods";

export interface OnBoardingDetailProps {
  match: any;
}

export interface OnBoardingDetailState {
  reqId: string;
  reqNo: string;
  location: string;
  candSubDetails: any;
  showLoader?: boolean;
  openCommentBox?: boolean;
  candSubmissionId?: string;
  candidateId?: string;
  status?: string;
  statusIntId?: string;
  positionId?: any;
  OnBoardingPositionId?: string;
  locationId?: any;
  divisionId?: string;
  candidateName?: string;
  candidatePhoneNumber?: string;
  candidateMobileNumber?: string;
  candidateEmail?: string;
  startDate?: any;
  reqEndDate?: any;
  taskData?: any;
  reqStartDate?: any;
  candSubRiskInfoId?: any;
  candSubPresentationInfoId?: any;
  showAlert: boolean;
}

class OnBoardingDetail extends React.Component<
  OnBoardingDetailProps,
  OnBoardingDetailState
> {
  constructor(props: OnBoardingDetailProps) {
    super(props);
    this.state = {
      reqId: "",
      reqNo: "",
      location: "",
      candSubDetails: {},
      showAlert: false
    };
  }

  componentDidMount() {
    const { subId } = this.props.match.params;
    this.setState({ candSubmissionId: subId },()=>   this.getAllTasks());
    this.getCandidateSubmissionDetails(subId);
    this.getCandSubRiskInfo(subId);
    this.getCandSubPresentationInfo(subId);
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
          reqStartDate: localDateTime(res.data.reqStartDate),
          reqNo: res.data.reqNumber,
          reqId: res.data.reqId,
          candSubDetails: res.data,
          locationId: res.data.locationId,
          positionId: res.data.positionId,
          candidateId: res.data.candidateId,
          location: res.data.location,
          OnBoardingPositionId: res.data.OnBoardingPositionId,
          divisionId: res.data.divisionId,
          status: res.data.status,
          statusIntId: res.data.statusIntId,
          showLoader: false,
        });
      });
  }

  getCandSubRiskInfo = (candSubmissionId: string) => {
    this.setState({ showLoader: true });
    axios
      .get(`api/candidates/workflow/${candSubmissionId}/riskinfo`)
      .then((result) => {
        if (result !=null && result.data !="") {
          this.setState({
            candSubRiskInfoId: result.data.candSubRiskInfoId,
            showLoader: false,
          });
        } else {
          this.setState({
            showLoader: false,
          });
        }
      });
  };

  getCandSubPresentationInfo = (candSubmissionId: string) => {
    this.setState({ showLoader: true });
    axios
      .get(`api/candidates/workflow/${candSubmissionId}/presentationinfo`)
      .then((result) => {
        if (result !=null && result.data !="") {
          this.setState({
            candSubPresentationInfoId: result.data.candSubPresentationInfoId,
            showLoader: false,
          });
        } else {
          this.setState({
            showLoader: false,
          });
        }
      });
  };

  getAllTasks = () => {
    axios
      .get(
        `/api/candidates/candsubonboardingtask?$filter=canSubmissionId eq ${this.state.candSubmissionId}`
      )
      .then((res) => {
        this.setState(
          { showLoader: false, taskData: res.data},
        );
      });
  };

  handleDisable = () => { };
  handleEnable = () => { };

  handleChange = (e) => {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  render() {
    const {
      candSubDetails,
      candidateId,
      candSubmissionId,
      status,
      reqId,
      reqNo,
      showLoader,
      location,
    } = this.state;
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3">
          <div className="col-12 p-0 shadow pt-1 pb-1">
            <PageTitle
              title="Onboarding Details"
              reqNumber={reqNo}
              candSubmissionId={candSubmissionId}
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
                    candidateId={candidateId}
                    location={location}
                    callbackFromParent={this.candInfoCallback}
                    submissionData={candSubDetails}
                  />
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
              </Collapsible>
              {this.state.candSubmissionId && this.state.candSubRiskInfoId && ( <Collapsible
                trigger={candTriggerName("Risk Information")}
                open={true}
              >
                
                  <CandidateRiskInfo
                    candSubmissionId={this.state.candSubmissionId}
                    isEnableRisk={false}
                  />
             
              </Collapsible>   )}
              {this.state.candSubmissionId &&
                  this.state.candSubPresentationInfoId &&
                  this.state.candidateName &&
                  ( <Collapsible
                trigger={candTriggerName("Presentation Information")}
                open={true}
              >
               
                    <CandSubPresentationInfo
                      candidatePhoneNumber={this.state.candidateMobileNumber ? this.state.candidateMobileNumber : this.state.candidatePhoneNumber}
                      candidateEmail={this.state.candidateEmail}
                      candSubmissionId={this.state.candSubmissionId}
                      isEnable={false}
                      candidateSubStatusIntId={this.state.statusIntId}
                      showAlertBox={() => this.setState({ showAlert: true })}
                      reqStartDate={this.state.reqStartDate}
                    />
               
              </Collapsible>   )}
              {!this.state.showLoader &&
                  this.state.candSubDetails &&
                  this.state.candidateId &&
                  this.state.reqId && (  <Collapsible
                trigger={candTriggerName("Interview Details")}
                open={true}
              >
               
                    <AllRoundResultView
                      CandidateSubmissionId={this.state.candSubmissionId}
                      reqId={this.state.reqId}
                      statusIntId={this.state.statusIntId}
                    />
                
              </Collapsible>  )}

              {(this.state.taskData && this.state.taskData.length > 0) && 
              <Collapsible trigger={candTriggerName("Onboarding")} open={true}>
                {!this.state.showLoader &&
                  this.state.candSubDetails &&
                  this.state.candidateId &&
                  this.state.reqId  && (
                    <TasksComponent
                      clientId={localStorage.getItem("UserClientId")}
                      reqId={this.state.reqId}
                      candidateId={this.state.candidateId}
                      candSubmissionId={candSubmissionId}
                      status={this.state.status}
                      statusIntId={this.state.statusIntId}
                      getAllTaskData={() => {}}
                      getCandidateSubmissionDetails={() => {}}
                    />
                  )}
              </Collapsible>}
            </div>
          </div>
          <CloseLink title={"Close"} pageUrl={APP_HOME_URL} />
        </div>

        <AlertBox
            handleNo={() => this.setState({ showAlert: false })}
            message={INFO_MSG_FOR_BILLRATES_DATE_UPDATE()}
            showModal={this.state.showAlert}
        >
        </AlertBox>
      </React.Fragment>
    );
  }
}

export default OnBoardingDetail;