import * as React from "react";
import axios from "axios";
import { faClock, faEnvelope, faExpand, faHistory, faInfo, faInfoCircle, faSave, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageTitle from "../../Shared/Title";
import CandidateInformation from "../../Shared/CandidateInformation/CandidateInformation";
import Collapsible from "react-collapsible";
import SkeletonWidget from "../../Shared/Skeleton";
import { candTriggerName, ErrorComponent } from "../../ReusableComponents";
import BillRateAndExpenses from "../../Candidates/BillRateAndExpenses/BillRateAndExpenses";
import { CandSubStatusIds, EntityType, initialDataState, SettingCategory, SETTINGS } from "../../Shared/AppConstants";
import { Comment } from "../../Shared/Comment/Comment";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import TasksComponent from "../../Candidates/CandidateOnBoarding/Task/TasksComponent";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { ASSIGNMENT_UPDATED_SUCCESS_MSG,
   ASSIGN_REQ_DATE_GREATER_THAN_START_DATE,
    ASSIGN_START_DATE_LESS_THAN_REQ_END_DATE,
     CONTRACT_SUBMITTED_TIMESHEET_WITH_NOTE_MSG,
     EXTEND_ASSIGNMENT_MSG,
     GENERATE_CONFIRMATION_LETTER_MSG,
     GENERATE_PROJECTION_SUCCESS_MSG,
     INFO_MSG_FOR_BILLRATES_DATE_UPDATE,
     LETTER_GENERATED_SUCCESSFULLY,
     LETTER_UPDATED_SUCCESSFULLY,
     MULTIPLE_CONTRACT_SAME_SERVICE_MSG,
     OVERRIDE_EXISTING_PROJECTION_GENERATE_CONFIRMATION_MSG,
     UPDATE_ASSIGN_CANDIDATE_MSG, 
     UPDATE_CONFIRMATION_LETTER_MSG} from "../../Shared/AppMessages";
import CloseLink from "../../Shared/CloseLink";
import { APP_HOME_URL, EXTEND_ASSIGNMENT, MANAGE_TIMESHEET } from "../../Shared/ApiUrls";
import { clientSettingsData, errorToastr, localDateTime, successToastr, history } from "../../../HelperMethods";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import auth from "../../Auth";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { Dialog } from "@progress/kendo-react-dialogs";
import AssignmentHistory from "./AssignmentHistory";
import IconMessageModal from "../../Shared/IconMessageModal";
import AssignmentProjections from "../../Candidates/Projection/AssignmentProjection/AssignmentProjections";
import ProjectionTargetDates from "../../Candidates/Projection/ProjectionTargetDates";
import ConfirmationLetter from "../../Candidates/MakeAnOffer/OfferInformation/ConfirmationLetter";
import AlertBox from "../../Shared/AlertBox";
import AssignmentExtensions from "../ExtendAssignment/ManageAssignmentExtensions/AssignmentExtensions";
import AuditLog from "../../Shared/AuditLog/AuditLog";
import { Link } from "react-router-dom";

export interface JobDetailProps {
  match: any;
}

export interface JobDetailState {
  reqId: string;
  reqNo: string;
  location: string;
  candSubDetails: any;
  showLoader?: boolean;
  openCommentBox?: boolean;
  candSubmissionId?: string;
  candidateId?: string;
  status?: string;
  statusIntId?: number;
  positionId?: any;
  jobPositionId?: string;
  locationId?: any;
  divisionId?: string;
  candidateName?: string;
  startDate?: any;
  endDate?: any;
  reqEndDate?: any;
  reqStartDate?: any;
  showAssignModal?: boolean;
  showAssignHistoryModal?: boolean;
  isDisabled: boolean;
  taskData?: any
  showMultiContractValidationModal?: boolean
  showSubmittedTimesheetValidationModal?: boolean
  contractData?: any
  timesheetData?: any
  targetStartDate?: any;
  targetEndDate?: any;
  projectedStartDate?: any;
  projectedEndDate?: any;
  hours?: any;
  showAssignmentProjectionModal?: boolean;
  isAssignmentProjections?: boolean;
  serviceType?: any;
  isConfirmationPdfRequired: boolean;
  clientId: string;
  vendor?: any;
  showGenerateLetterModal: boolean;
  showAlert: boolean;
  showUpdateLetterModal: boolean;
  submittedVendorId: string;
  showExtendAssignmentModal: boolean;
  showAuditLogModal: boolean;
}

class JobDetail extends React.Component<JobDetailProps, JobDetailState> {
  public billRateChild: any;
  public confirmationLetter: any;
  constructor(props: JobDetailProps) {
    super(props);
    this.state = {
      isDisabled: true,
      reqId: "",
      reqNo: "",
      location: "",
      candSubDetails: {},
      startDate: null,
      endDate: null,
      reqEndDate: null,
      reqStartDate: null,
      targetStartDate: null,
      targetEndDate: null,
      projectedStartDate: null,
      projectedEndDate: null,
      hours: 0,
      clientId: auth.getClient(),
      isConfirmationPdfRequired: false,
      showGenerateLetterModal: false,
      showAlert: false,
      showUpdateLetterModal: false,
      submittedVendorId: "",
        showExtendAssignmentModal: false,
        showAuditLogModal: false
    };
  }

  componentDidMount() {
    const { subId } = this.props.match.params;
    this.setState({ candSubmissionId: subId },()=>   this.getAllTasks());
    this.getClientSettings(this.state.clientId);
    this.getCandidateSubmissionDetails(subId);
  }

  candInfoCallback = (candidateInfo) => {
    this.setState({
      candidateName: candidateInfo.name,
    });
  };

  async getCandidateSubmissionDetails(candSubmissionId) {
    this.setState({ showLoader: true });
    await axios
      .get(`api/candidates/workflow/${candSubmissionId}`)
      .then((res) => {
        this.setState({
          reqNo: res.data.reqNumber,
          reqId: res.data.reqId,
          candSubDetails: res.data,
          locationId: res.data.locationId,
          positionId: res.data.positionId,
          candidateId: res.data.candidateId,
          location: res.data.location,
          jobPositionId: res.data.jobPositionId,
          divisionId: res.data.divisionId,
          status: res.data.status,
          statusIntId: res.data.statusIntId,
          startDate:
            res.data.startDate !=null &&
            res.data.startDate !=undefined &&
            res.data.startDate !=""
              ? (res.data.startDate)
              : res.data.startDate,
          endDate:
            res.data.endDate !=null &&
            res.data.endDate !=undefined &&
            res.data.endDate !=""
              ? (res.data.endDate)
              : res.data.endDate,
          reqStartDate: localDateTime(res.data.reqStartDate),
          reqEndDate: localDateTime(res.data.reqEndDate),
          targetStartDate: res.data.targetStartDate,
          targetEndDate: res.data.targetEndDate,
          projectedStartDate: res.data.targetStartDate,
          projectedEndDate: res.data.targetEndDate,
          vendor: res.data.vendor,
          submittedVendorId: res.data.submittedVendorId
        }, () => {
          this.getClientSettings(this.state.clientId);
        });
      });
  }

  handleChange = (e) => {
    let change = { isDisabled: false };
    change[e.target.name] = e.target.value;
    this.setState(change);
    if(e.target.name=="targetStartDate"){
      this.setState({ projectedStartDate: e.target.value });
    }else if(e.target.name=="targetEndDate"){
      this.setState({ projectedEndDate: e.target.value });
    }
  };

  candidateStatusUpdate = (successMsg, modal, props?) => {
    let data = {
      values: JSON.stringify({
        startDate: localDateTime(this.state.startDate),
        endDate: localDateTime(this.state.endDate),
      }),
    };
    axios
      .patch(
        `api/candidates/workflow/${this.state.candSubmissionId}`,
        JSON.stringify(data)
      )
      .then((res) => {
        if (res.data && !res.data.isSuccess) {
          errorToastr(res.data.statusMessage);
        }
        else{
          if(res.data.data.item1 !=null && res.data.data.item2 !=null){
            if(res.data.data !=null &&res.data.data.item1 !=undefined && res.data.data.item1.length > 0 && res.data.data.item2=="1")
            {
              this.setState({ showMultiContractValidationModal: true, contractData: res.data.data.item1 });
            }
            else if(res.data.data.item1 !=null && res.data.data.item1 !=undefined && res.data.data.item1.length > 0 && res.data.data.item2=="2")
            {
              this.setState({ showSubmittedTimesheetValidationModal: true, timesheetData: res.data.data.item1 });
            }
            else{
              successToastr(successMsg);
              if (modal=="showAssignModal"){
                this.handleConfirmationStatusAlert(res.data.responseCode);
              }
            }
          }
        }
        this.billRateChild.getBillRates(initialDataState);
      });

    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  handleConfirmationStatusAlert = (responseCode) => {
      if (responseCode=="CSU"){
          this.setState({showAlert: true});
      }
  }

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

  createDocumentPortfolio = () => {
    this.setState({ showLoader: true, showGenerateLetterModal: false });
    const data = {
      candSubmissionId: this.state.candSubmissionId,
      candidateId: this.state.candidateId,
      vendor: this.state.vendor,
      reqNumber: this.state.reqNo,
      createDocPortfolio: true,
      generateLetter: true
    };

    axios.post("api/candidates/status/confirmation", JSON.stringify(data)).then((res) => {
      successToastr(LETTER_GENERATED_SUCCESSFULLY);
      this.setState({ showLoader: false });
    }).catch(error => {
      this.setState({
        showLoader: false
      })
    }); 
  }

  updateDocumentPortfolio = () => {
    this.setState({ showLoader: true, showUpdateLetterModal: false });
    const data = {
      candSubmissionId: this.state.candSubmissionId
    };

    axios.post("api/candidates/confirmation/update", JSON.stringify(data)).then((res) => {
      successToastr(LETTER_UPDATED_SUCCESSFULLY);
      this.setState({ showLoader: false });
    }).catch(error => {
      this.setState({
        showLoader: false
      })
    }); 
  }

  generateProjections = (isOverrideProjection = false) => {
    this.setState({ showLoader: true });
    const data = {
      candSubmissionId: this.state.candSubmissionId,
      targetStartDate: localDateTime(this.state.targetStartDate),
      targetEndDate: localDateTime(this.state.targetEndDate),
      projectedStartDate: localDateTime(this.state.projectedStartDate),
      projectedEndDate: localDateTime(this.state.projectedEndDate),
      hours: this.state.hours,
      isOverrideProjection: isOverrideProjection,
      isGenerateGlobalProjection: true
    };
    axios.post("api/candidates/generateprojections", JSON.stringify(data)).then((res) => {
      if (res.data && !res.data.isSuccess) {
        errorToastr(res.data.statusMessage);
        this.setState({
          showLoader: false,
          serviceType: res.data.responseCode,
          showAssignmentProjectionModal: true
        });
      } else {
        successToastr(GENERATE_PROJECTION_SUCCESS_MSG);
        this.setState({ showLoader: false, hours: null, projectedStartDate: this.state.targetStartDate, projectedEndDate: this.state.targetEndDate });
      }
    }).catch(error => {
      this.setState({
        showLoader: false
      });
    });
  };

  getClientSettings = (clientId) => {
    clientSettingsData(clientId, SettingCategory.REPORT, SETTINGS.ASSIGNMENT_PROJECTION, (response) => {
      this.setState({ isAssignmentProjections : response });
    });

    clientSettingsData(clientId, SettingCategory.CANDIDATE, SETTINGS.CONFIRMATION_OF_ASSIGNMENT, (response) => {
      this.setState({ isConfirmationPdfRequired: response, showLoader: false });
    });
  };   
  
  redirectTo = () => {
    this.setState({ showExtendAssignmentModal: false });
    history.push(`${EXTEND_ASSIGNMENT}${this.state.candSubmissionId}`);
  }

  render() {
    const {
      candSubDetails,
      candidateId,
      candSubmissionId,
      status,
      statusIntId,
      reqId,
      reqNo,
      showLoader,
      location,
      positionId,
      jobPositionId,
      locationId,
      divisionId,
      targetStartDate,
      targetEndDate,
      projectedStartDate,
      projectedEndDate,
      hours,
      isAssignmentProjections,
      isConfirmationPdfRequired,
      showGenerateLetterModal,
      showUpdateLetterModal,
      showAuditLogModal
    } = this.state;

    const projectionInfo = {
      targetStartDate,
      targetEndDate,
      projectedStartDate,
      projectedEndDate,
      candSubDetails,
      hours
    };

    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3">
          <div className="col-12 p-0 shadow pt-1 pb-1">
            <PageTitle
              title="Job Details"
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
                    isAssignmentProjections = {isAssignmentProjections}
                    jobDetailPage={true}
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
              <Collapsible
                trigger={candTriggerName("Assignment Information")}
                open={true}
              >
                <div className="row text-dark">
                  <div className="col-12 pl-0 pr-0">
                    <div className="row mx-auto">
                      <div className="col-12 col-sm-6 col-lg-4">
                        <div className="row">
                      <div className="col-6 mt-sm-0 mt-1 cal-icon-color">
                        <label className="mb-2 text-dark required font-weight-bold">
                          Start Date
                        </label>
                        <DatePicker
                          disabled={CandSubStatusIds.ASSIGNMENTEXTENDED==statusIntId ? true : false}
                          className="form-control"
                          format="MM/dd/yyyy"
                          name="startDate"
                          value={this.state.startDate ? new Date(this.state.startDate) : null}
                          onChange={(e) => this.handleChange(e)}
                          formatPlaceholder="formatPattern"
                          min={this.state.reqStartDate ? new Date(this.state.reqStartDate) : null}
                          max={this.state.reqEndDate ? new Date(this.state.reqEndDate) : null}
                        />
                        {this.state.startDate ==null ? (
                          <ErrorComponent />
                        ) : this.state.startDate > this.state.reqEndDate ? (
                          <ErrorComponent
                            message={ASSIGN_START_DATE_LESS_THAN_REQ_END_DATE}
                          />
                        ) : (
                          this.state.startDate < this.state.reqStartDate && (
                            <ErrorComponent
                              message={ASSIGN_REQ_DATE_GREATER_THAN_START_DATE}
                            />
                          )
                        )}
                      </div>
                      <div className="col-6 mt-sm-0 mt-1 cal-icon-color text-box-disbaled">
                        <label className="mb-2 text-dark required font-weight-bold">
                          End Date
                        </label>
                        {this.state.endDate && (
                          <DatePicker
                            disabled={CandSubStatusIds.ASSIGNMENTEXTENDED==statusIntId ? true : false}
                            className="form-control"
                            format="MM/dd/yyyy"
                            name="endDate"
                            value={this.state.endDate ? new Date(this.state.endDate) : null}
                            onChange={(e) => this.handleChange(e)}
                            formatPlaceholder="formatPattern"
                            min={this.state.reqStartDate ? new Date(this.state.reqStartDate) : null}
                          max={this.state.reqEndDate ? new Date(this.state.reqEndDate) : null}
                          />
                        )}
                      </div>
                      </div>
                      </div>
                      <div className="col-12 col-sm-6 col-lg-8 mt-sm-0 mt-1">
                          <label className="marginbtn font-weight-bold required invisible d-block pl-1">
                            Assignment
                          </label>
                          {auth.hasPermissionV2(
                            AppPermissions.CAND_SUB_ASSIGNMENT_UPDATE
                          ) && (
                            <>
                              <span>
                                
                                <span
                                  className=" text-underline cursorElement align-middle holdPosition-icon shadow mr-2"
                                  onClick={() =>
                                    this.setState({ showAssignHistoryModal: true })
                                  }
                                >
                                  <FontAwesomeIcon icon={faHistory} color={"white"} />
                                </span>
                                <button
                                  type="button"
                                  className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                  onClick={() => {
                                    this.setState({ showAssignModal: true });
                                  }}
                                  disabled={this.state.isDisabled}
                                >
                                  <FontAwesomeIcon icon={faSave} className={"mr-1"} />{" "}
                                  Update
                                </button>
                              </span>
                              
                            </>
                          )}
                          
                          {(CandSubStatusIds.ASSIGNMENTCREATED==statusIntId || 
                            CandSubStatusIds.ASSIGNMENTINPROGRESS==statusIntId ||
                            CandSubStatusIds.ASSIGNMENTEXTENDED==statusIntId ||
                            CandSubStatusIds.ASSIGNMENTCOMPLETED==statusIntId) && auth.hasPermissionV2(
                              AppPermissions.GENERATE_CONFIRMATION_LETTER
                            ) && isConfirmationPdfRequired && 
                                <span>
                                  
                                  <button
                                    type="button"
                                    className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                    onClick={() => {
                                      this.setState({ showGenerateLetterModal: true });
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faEnvelope} className={"mr-1"} />{" "}
                                    Generate Letter
                                  </button>
                                </span>
                          }
                          {(CandSubStatusIds.ASSIGNMENTCREATED==statusIntId || 
                            CandSubStatusIds.ASSIGNMENTINPROGRESS==statusIntId ||
                            CandSubStatusIds.ASSIGNMENTEXTENDED==statusIntId ||
                            CandSubStatusIds.ASSIGNMENTCOMPLETED==statusIntId) && auth.hasPermissionV2(
                              AppPermissions.UPDATE_CONFIRMATION_LETTER
                            ) && isConfirmationPdfRequired && 
                                <span>
                                  
                                  <button
                                    type="button"
                                    className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                    onClick={() => {
                                      this.setState({ showUpdateLetterModal: true });
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faEnvelope} className={"mr-1"} />{" "}
                                    Update Letter
                                  </button>
                                </span>
                          }

                        {(CandSubStatusIds.ASSIGNMENTINPROGRESS==statusIntId || CandSubStatusIds.ASSIGNMENTEXTENDED==statusIntId) && auth.hasPermissionV2(AppPermissions.ASSIGNMENT_EXTEND_REQUEST) &&
                          <span>
                            <button
                              type="button"
                              className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                              onClick={() => {
                                this.setState({ showExtendAssignmentModal: true });
                              }}
                            >
                              <FontAwesomeIcon icon={faExpand} className={"mr-1"} />{" "}
                              Request for Extension
                            </button>
                          </span>
                        }

                          {auth.hasPermissionV2(
                              AppPermissions.AUDIT_LOG
                            ) &&
                            <span>
                              <button
                                type="button"
                                className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                onClick={() => {
                                  this.setState({ showAuditLogModal: true });
                                }}
                              >
                                <FontAwesomeIcon icon={faHistory} className={"mr-1"} />{" "}
                                Audit Log
                              </button>
                            </span>
                          }
                      </div>
                    </div>
                  </div>
                </div>
              </Collapsible>
              {!showLoader &&
                  candSubmissionId &&
                  candSubDetails &&
                  locationId &&
                  positionId &&
                  jobPositionId && (  <Collapsible
                trigger={candTriggerName("Bill Rates and Expenses")}
                open={true}
              >               
                    <BillRateAndExpenses                    
                      ref={(instance) => {
                        this.billRateChild = instance;
                      }}
                      candSubmissionId={candSubmissionId}
                      candidateName={this.state.candidateName}
                      positionId={jobPositionId}
                      locationId={locationId}
                      divisionId={divisionId}
                      candidateSubStatus={status}
                      handleDisable={() => {}}
                      handleEnable={() => {}}
                      candidateSubStatusIntId={statusIntId}
                      AssignmentStartDate={this.state.startDate}
                      AssignmentEndDate={this.state.endDate}
                      handleAlert={this.handleConfirmationStatusAlert}
                    />
                 
              </Collapsible> )}
              {/* {(this.state.taskData && this.state.taskData.length > 0) && 
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
              </Collapsible>} */}
              {isAssignmentProjections==true && (
                <Collapsible
                  trigger={candTriggerName("Assignment Target Dates")}
                  open={true}
                >
                  {!showLoader &&
                    candSubmissionId && isAssignmentProjections==true && (
                      <ProjectionTargetDates
                        data={projectionInfo}
                        handleChange={this.handleChange}
                        showLoader={showLoader}
                        generateProjection={true}
                        handleGenerateProjections={this.generateProjections}
                        reqDates={{reqStartDate:this.state.reqStartDate, reqEndDate:this.state.reqEndDate}}
                        />
                    )}
                </Collapsible>
              )}

              {isAssignmentProjections==true && (
              <Collapsible
                trigger={candTriggerName("Assignment Forecast")}
                open={true}
              >
                {!showLoader &&
                  candSubmissionId && isAssignmentProjections==true && (
                    <AssignmentProjections
                      candSubmissionId={candSubmissionId}
                      targetStartDate={this.state.targetStartDate}
                      targetEndDate={this.state.targetEndDate}
                    />
                  )}
              </Collapsible>
              )}

              {(auth.hasPermissionV2(AppPermissions.ASSIGNMENT_EXTEND_REQUEST) || auth.hasPermissionV2(AppPermissions.ASSIGNMENT_EXTEND)) && (
                <Collapsible
                  trigger={candTriggerName("Assignment Extensions")}
                  open={true}
                >
                  {!showLoader &&
                    candSubmissionId && (
                      <AssignmentExtensions
                        candSubmissionId={candSubmissionId}
                        assignmentStatus={statusIntId}
                      />
                    )}
                </Collapsible>
              )}
            </div>
          </div>
          <div className="col-12 mt-4 mb-4">
            <div className="row ml-sm-0 mr-sm-0 justify-content-center">
            <Link to={`${MANAGE_TIMESHEET}`}>
                <button
                  type="button"
                  className="btn button button-close mr-2 mr-sm-2 mr-lg-2 shadow col-auto mb-2"
                >
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    className={"mr-2"}
                  />
                  Close
                </button>
                </Link>
            </div>
          </div>
        </div>
        <ConfirmationModal
          message={UPDATE_ASSIGN_CANDIDATE_MSG}
          showModal={this.state.showAssignModal}
          handleYes={(e) =>
            this.candidateStatusUpdate(
              ASSIGNMENT_UPDATED_SUCCESS_MSG,
              "showAssignModal"
            )
          }
          handleNo={() => {
            this.setState({ showAssignModal: false });
          }}
        />

        <AlertBox
            handleNo={() => this.setState({ showAlert: false })}
            message={INFO_MSG_FOR_BILLRATES_DATE_UPDATE()}
            showModal={this.state.showAlert}
        >
        </AlertBox>

        <ConfirmationModal
          message={GENERATE_CONFIRMATION_LETTER_MSG}
          showModal={this.state.showGenerateLetterModal}
          handleYes={(e) =>
            this.createDocumentPortfolio()
          }
          handleNo={() => {
            this.setState({ showGenerateLetterModal: false });
          }}
        />

        {/* <ConfirmationLetter
            ref={(instance) => {
                  this.confirmationLetter = instance;
              }
            }
            reqId={this.state.reqId}
            candSubmissionId={this.state.candSubmissionId}
            candidateId={this.state.candidateId}
            vendor={candSubDetails && candSubDetails.vendor}
            updateCandWf={false}
            reqNumber={this.state.reqNo}
        /> */}
        {this.state.showMultiContractValidationModal && 
            <IconMessageModal
                title={"Assignment Update"}
                icon={faInfoCircle}
                iconClass={"circle-red"}
                message={MULTIPLE_CONTRACT_SAME_SERVICE_MSG(this.state.contractData)}
                showModal={this.state.showMultiContractValidationModal}
                handleNo={() => {
                    this.setState({ showMultiContractValidationModal: false, contractData: [] });
                }}
            />
        }
        {this.state.showSubmittedTimesheetValidationModal && 
            <IconMessageModal
                title={"Assignment Update"}
                icon={faInfoCircle}
                iconClass={"circle-red"}
                message={CONTRACT_SUBMITTED_TIMESHEET_WITH_NOTE_MSG(this.state.timesheetData)}
                showModal={this.state.showSubmittedTimesheetValidationModal}
                handleNo={() => {
                    this.setState({ showSubmittedTimesheetValidationModal: false, timesheetData: [] });
                }}
            />
        }
        {this.state.showAssignHistoryModal && (
          <div id="hold-position">
            <Dialog className="col-12 For-all-responsive-height" width="100%">
              <AssignmentHistory
                candSubmissionId={this.state.candSubmissionId}
                candidateName={this.state.candidateName}
                reqNumber={this.state.reqNo}
                handleClose={() =>
                  this.setState({ showAssignHistoryModal: false })
                }
              />
            </Dialog>
          </div>
        )}

        <ConfirmationModal
          message={OVERRIDE_EXISTING_PROJECTION_GENERATE_CONFIRMATION_MSG(this.state.serviceType)}
          showModal={this.state.showAssignmentProjectionModal}
          handleYes={() => {
            this.setState({ showAssignmentProjectionModal: false });
            this.generateProjections(true)
        }}
          handleNo={() => {
            this.setState({ showAssignmentProjectionModal: false });
          }}
        />

        <ConfirmationModal
          message={UPDATE_CONFIRMATION_LETTER_MSG}
          showModal={showUpdateLetterModal}
          handleYes={(e) =>
            this.updateDocumentPortfolio()
          }
          handleNo={() => {
            this.setState({ showUpdateLetterModal: false });
          }}
        />

        <ConfirmationModal
          message={EXTEND_ASSIGNMENT_MSG()}
          showModal={this.state.showExtendAssignmentModal}
          handleYes={(e) =>
            this.redirectTo()
          }
          handleNo={() => {
            this.setState({ showExtendAssignmentModal: false });
          }}
        />

        {showAuditLogModal && (
          <AuditLog
            candSubmissionId={this.state.candSubmissionId}
            showDialog={showAuditLogModal}
            handleNo={() => {
              this.setState({ showAuditLogModal: false });
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default JobDetail;
