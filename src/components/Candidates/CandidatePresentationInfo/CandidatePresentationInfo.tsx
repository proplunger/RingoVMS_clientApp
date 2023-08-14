import {
  faClock,
  faSave,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import * as React from "react";
import auth from "../../Auth";
import Collapsible from "react-collapsible";
import { candTriggerName } from "../../ReusableComponents";
import { EntityType, SettingCategory, SETTINGS } from "../../Shared/AppConstants";
import CandidateInformation from "../../Shared/CandidateInformation/CandidateInformation";
import CandSubPresentationInfo from "../../Shared/CandSubPresentationInfo/CandSubPresentationInfo";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import PageTitle from "../../Shared/Title";
import { clientSettingsData, history, localDateTime, successToastr } from "../../../HelperMethods";
import { Comment } from "../../Shared/Comment/Comment";
import ProjectionTargetDates from "../Projection/ProjectionTargetDates";
import { PRESENTATION_SAVE_SUCCESS_MSG } from "../../Shared/AppMessages";
import { CAND_SUB_WORKFLOW_URL } from "../../Shared/ApiUrls";


export interface CandidatePresentationInfoProps {
  match: any;
}

export interface CandidatePresentationInfoState {
  showLoader?: boolean;
  reqNo?: string;
  reqId?: string;
  candPresentationId?: string;
  candPresentationDetails?: any;
  status?: string;
  candidateId?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhoneNumber?: string;
  candidateMobileNumber?: string;
  location?: string;
  openCommentBox?: boolean;
  statusIntId?: any;
  reqStartDate?: any;
  targetStartDate?: any;
  targetEndDate?: any;
  reqEndDate?: any;
  isDirty?: boolean;
  isAssignmentProjections: boolean;
  clientId: string;
  targetDateError: boolean;
}

const refCand = React.createRef<CandidateInformation>();
const refCandSubPresentation = React.createRef<CandSubPresentationInfo>();
class CandidatePresentationInfo extends React.Component<
  CandidatePresentationInfoProps,
  CandidatePresentationInfoState
> {
  constructor(props: CandidatePresentationInfoProps) {
    super(props);
    this.state = {
      reqId: "",
      reqNo: "",
      targetStartDate: null,
      targetEndDate: null,
      isAssignmentProjections: false,
      clientId: auth.getClient(),
      targetDateError: false
    };
  }

  componentDidMount() {
    const { subId } = this.props.match.params;
    this.setState({ candPresentationId: subId });
    this.getCandidatePresentationInfoDetails(subId);
    this.getClientSettings(this.state.clientId);
  }

  async getCandidatePresentationInfoDetails(candPresentationId) {
    this.setState({ showLoader: true });
    await axios
      .get(`api/candidates/workflow/${candPresentationId}`)
      .then((res) => {
        this.setState({
          reqNo: res.data.reqNumber,
          reqStartDate: localDateTime(res.data.reqStartDate),
          reqEndDate: localDateTime(res.data.reqEndDate),
          reqId: res.data.reqId,
          candPresentationDetails: res.data,
          status: res.data.status,
          candidateId: res.data.candidateId,
          location: res.data.location,
          statusIntId: res.data.statusIntId,
          showLoader: false,
          targetStartDate:
            res.data.targetStartDate !=null &&
            res.data.targetStartDate !=undefined &&
            res.data.targetStartDate !=""
              ? localDateTime(res.data.targetStartDate)
              : res.data.targetStartDate,
          targetEndDate:
            res.data.targetEndDate !=null &&
            res.data.targetEndDate !=undefined &&
            res.data.targetEndDate !=""
              ? localDateTime(res.data.targetEndDate)
              : res.data.targetEndDate,
        });
      });
  }
  candInfoCallback = (candidateInfo) => {
    this.setState({
      candidateEmail: candidateInfo.email,
      candidateName: candidateInfo.name,
      candidatePhoneNumber: candidateInfo.phoneNumber,
      candidateMobileNumber: candidateInfo.mobileNumber,
    });
  };

  handleUpdate = () => {
    //   refCandSubPresentation.current.savePresentationInfo();
    //   console.log("reff",refCandSubPresentation.current.state)
    const {
        showErrors,
        presentationInfoDetails,
      } = refCandSubPresentation.current.validateField();

      let targetDateError = this.validateTargetDates()
      if (showErrors || targetDateError) {
        return false;
      }
  
      if (presentationInfoDetails.potentialStartDate !=null && presentationInfoDetails.potentialStartDate !=undefined) {
        presentationInfoDetails.potentialStartDate = localDateTime(presentationInfoDetails.potentialStartDate);
      }
  
      let data = {
        candSubmissionId: this.state.candPresentationId,
        isSubmit: false,
        targetStartDate: null,
        targetEndDate: null,
        ...presentationInfoDetails,
      };

      if (this.state.targetStartDate !=null && this.state.targetStartDate !=undefined) {
        data.targetStartDate = localDateTime(this.state.targetStartDate);
      }
  
      if (this.state.targetEndDate !=null && this.state.targetEndDate !=undefined) {
        data.targetEndDate = localDateTime(this.state.targetEndDate);
      }

      axios.put("api/candidates/presentationinfo", JSON.stringify(data)).then((res) => {
        successToastr(PRESENTATION_SAVE_SUCCESS_MSG);
        history.push(CAND_SUB_WORKFLOW_URL)
      });
  };

  handleChange = (e) => {
    let change = { isDirty: true };
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  getClientSettings = (clientId) => {
    clientSettingsData(clientId, SettingCategory.REPORT, SETTINGS.ASSIGNMENT_PROJECTION, (response) => {
      this.setState({ isAssignmentProjections : response });
    });
  };

  validateTargetDates = () => {
    var showError = this.state.isAssignmentProjections==true && (this.state.targetStartDate ==null ||
                  this.state.targetEndDate ==null) ? true : false;
    this.setState({ targetDateError: showError });
    return showError;
  }

  render() {
    const { candPresentationDetails, targetStartDate, targetEndDate, targetDateError } =
      this.state;

    const projectionInfo = {
      targetStartDate,
      targetEndDate,
      candPresentationDetails,
      targetDateError
    };
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3">
          <div className="col-12 p-0 shadow pt-1 pb-1">
            <PageTitle
              title="Edit Presentation Info"
              candSubmissionId={this.state.candPresentationId}
              reqNumber={this.state.reqNo}
              pageUrl={`/requisitions/view/${this.state.reqId}`}
            />
            <div className="col-12">
              <Collapsible
                trigger={candTriggerName(
                  "Candidate Information",
                  this.state.status
                )}
                open={true}
              >
                {!this.state.showLoader &&
                  this.state.candPresentationDetails &&
                  this.state.candidateId && (
                    <CandidateInformation
                      ref={refCand}
                      callbackFromParent={this.candInfoCallback}
                      candidateId={this.state.candidateId}
                      location={this.state.location}
                      submissionData={this.state.candPresentationDetails}
                    />
                  )}
              </Collapsible>
              <Collapsible
                trigger={candTriggerName("Presentation Information")}
                open={true}
              >
                {this.state.candPresentationId && this.state.candidateName && (
                  <CandSubPresentationInfo
                    candidatePhoneNumber={
                      this.state.candidateMobileNumber
                        ? this.state.candidateMobileNumber
                        : this.state.candidatePhoneNumber
                    }
                    candidateEmail={this.state.candidateEmail}
                    ref={refCandSubPresentation}
                    candSubmissionId={this.state.candPresentationId}
                    isEnable={true}
                    reqStartDate={this.state.reqStartDate}
                  />
                )}
              </Collapsible>
              {this.state.isAssignmentProjections==true && 
                <Collapsible
                  trigger={candTriggerName("Assignment Target Dates")}
                  open={true}
                >
                  {this.state.candPresentationId && (
                    <ProjectionTargetDates
                      data={projectionInfo}
                      handleChange={this.handleChange}
                      showLoader={false}
                      generateProjection={false}
                      reqDates={{
                        reqStartDate: this.state.reqStartDate,
                        reqEndDate: this.state.reqEndDate,
                      }}
                    />
                  )}
                </Collapsible>
              }
            </div>
            <hr />
            <div className="col-12 col-sm-4 col-lg-4 mt-1 mb-2 mb-sm-0  mt-sm-0">
              <label className="mb-0 font-weight-bold ">Comments</label>
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
                entityId={this.state.candPresentationId}
              />
            </div>
            {this.state.openCommentBox && (
              <CommentHistoryBox
                entityType={EntityType.CANDSUBMISSION}
                entityId={this.state.candPresentationId}
                showDialog={this.state.openCommentBox}
                handleNo={() => {
                  this.setState({ openCommentBox: false });
                  document.body.style.position = "";
                }}
              />
            )}
          </div>
          <div className="modal-footer justify-content-center border-0 mt-2">
            <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
              <button
                type="button"
                className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                onClick={() => history.goBack()}
              >
                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />{" "}
                Close
              </button>
              <button
                type="button"
                className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                onClick={this.handleUpdate}
              >
                <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CandidatePresentationInfo;
