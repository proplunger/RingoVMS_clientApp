import * as React from "react";
import axios from "axios";
import auth from "../../Auth";
import PageTitle from "../../Shared/Title";
import CandidateShortInfo from "../../Shared/CandidateInformation/CandidateShortInfo";
import {
  SCHEDULE_INTERVIEW_CONFIRMATION_MSG,
  INTERVIEW_REQUESTED_SUCCESS_MSG,
  REJECT_CANDIDATE,
  REJECT_CANDIDATE_SUCCESS_MSG,
  WITHDRAW_CANDIDATE,
  WITHDRAW_CANDIDATE_SUCCESS_MSG,
} from "../../Shared/AppMessages";
import { CandidateWorkflow, CandidateWorkflowActions } from "../../Shared/AppConstants";
import { ConfirmationModal } from "../../Shared/ConfirmationModal";
import { history, successToastr } from "../../../HelperMethods";
import { APP_HOME_URL, INTERVIEW_DETAILS } from "../../Shared/ApiUrls";
import SchedulerComponent from "../../Shared/Scheduler/Scheduler";
import FormActions from "../../Shared/Workflow/FormActions";
import RejectModal from "../../Shared/RejectModal";
import ScheduleInterviewFields from "./SchedulerFields"
import { AppPermissions } from "../../Shared/Constants/AppPermissions";

export interface ScheduleInterviewProps {
  match: any;
}

export interface ScheduleInterviewState {
  candSubmissionId?: string;
  candSubInterviewId?: string;
  candidateId?: string;
  showLoader?: boolean;
  showScheduleInterviewModal?: boolean;
  showRejectCandidateModal?: boolean;
  title?: string;
  mediumId?: any;
  durationId?: any;
  hiringManagerId: string;
  meetingDetails?: string;
  showError: boolean;
  selectedData: any;
  showWithdrawModal?: boolean;
  //workflow
  status?: string;
  location?: string;
  initialData: any;
  jobWfTypeId?: string;
  maxRoundNumber?: number;
  roundNumber?: number;
  hideBtns: any;
}

class ScheduleInterview extends React.Component<
  ScheduleInterviewProps,
  ScheduleInterviewState
> {
  childRef: React.RefObject<SchedulerComponent> = React.createRef();
  constructor(props: ScheduleInterviewProps) {
    super(props);
    this.state = {
      title: "",
      mediumId: null,
      durationId: null,
      hiringManagerId: null,
      meetingDetails: "",
      selectedData: [],
      showError: false,
      initialData: [],
      hideBtns: [
        "ReadyforOffer",
        "ScheduleInterview",
        "ProceedToNextRound",
        "RejectCandidate",
        "Withdraw",
      ],
    };
  }

  action: string;
  statusId: string;
  eventName: string;
  actionId: string;

  componentDidMount() {
    const { id, subId } = this.props.match.params;
    this.setState({ candSubInterviewId: id, candSubmissionId: subId });
    this.getCandidateSubmissionDetails(subId);
    if (id !=undefined && id !=null)
      this.getCandidateSubmissionInterviewDetails(id);
  }

  async getCandidateSubmissionDetails(candSubmissionId) {
    this.setState({ showLoader: true });
    await axios
      .get(`api/candidates/workflow/${candSubmissionId}`)
      .then((res) => {
        this.setState({
          candidateId: res.data.candidateId,
          status: res.data.status,
          location: res.data.location,
          showLoader: false,
          jobWfTypeId: res.data.jobWfTypeId,
          maxRoundNumber: res.data.maxRoundNumber,
        });
      });
  }

  async getCandidateSubmissionInterviewDetails(interviewId) {
    this.setState({ showLoader: true });
    await axios
      .get(`api/candidates/candsubinterview/${interviewId}`)
      .then((res) => {
        this.setState({
          roundNumber: res.data.roundNumber,
          mediumId: res.data.mediumId,
          durationId: res.data.durationId,
          title: res.data.title,
          hiringManagerId: res.data.hiringManagerId,
          meetingDetails: res.data.meetingDetails,
          selectedData: res.data.candSubInterviewSlot.map(
            (i) => i.candSubUserCalId
          ),
          showLoader: false,
        });
        if (
          (res.data.hiringManagerId)
        ) {
          this.getAllTasks(res.data.hiringManagerId, res.data.candSubInterviewSlot.map((i) => i.candSubUserCalId));
        }
      });
  }

  async getAllTasks(id, selectedData) {
    var today = new Date();
    let initialData = [];
    await axios
      .get(
        `/api/admin/candsubusercal?$filter=userId eq ${id} and isVendorSelected eq false and startDate ge ${today
          .toISOString()
          .substr(0, 10)}`
      )
      .then((res) => initialData = res.data);

    if (selectedData) {

      let interviewId = this.state.candSubInterviewId;
      await axios
        .get(
          `api/candidates/candsubinterview/candsubinterviewslot?$filter= candSubInterviewId eq ${interviewId}`
        )
        .then(async (res) => {
          if (res.data) {
            let selectedRecord = res.data.map(s => (
              {
                candSubUserCalId: s.candSubUserCalId,
                isVendorSelected: s.isVendorSelected,
                recordStatus: 1,
                slot: s.candSubUserCal.slot,
                startDate: JSON.parse(s.candSubUserCal.slot).start,
                userId: s.candSubUserCal.userId
              }
            ));

            initialData = initialData.concat(selectedRecord);
          }

          this.setState({ initialData: initialData });
        });
    } else {
      this.setState({ initialData: initialData });
    }
  }

  handleChange = (e) => {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  handleDropdownChange = (e) => {
    let change = {};
    if (e.target.props.name =="hiringManagerId") {
      this.setState({ selectedData: [] });
      this.getAllTasks(e.target.value, null);
    }
    change[e.target.props.name] = e.target.value;
    this.setState(change);
  };

  SelectDeselectTasks = (event) => {
    let ScheduleID = this.childRef.current.getScheduleId(
      event.target.props.uid
    );
    let ifAlreadySelected = this.state.selectedData.filter(
      (i) => i ==ScheduleID
    );
    if (ifAlreadySelected.length > 0) {
      this.setState({
        selectedData: this.state.selectedData.filter(function (person) {
          return person != ScheduleID;
        }),
      });
    } else {
      this.setState({ selectedData: [...this.state.selectedData, ScheduleID] });
    }
  };

  onValidation = (action, nextStateId?, eventName?, actionId?) => {
    this.action = action;
    this.statusId = nextStateId;
    this.eventName = eventName;
    this.actionId = actionId;
    const {
      mediumId,
      durationId,
      hiringManagerId,
      meetingDetails,
      selectedData,
      title,
      candSubmissionId,
    } = this.state;

    if (
      mediumId != null &&
      durationId != null &&
      hiringManagerId != null &&
      title != "" &&
      meetingDetails != "" &&
      selectedData.length > 0
    ) {
      if (action==CandidateWorkflowActions.SCHEDULE_INTERVIEW_REQUEST) {
        this.setState({ showScheduleInterviewModal: true });
        this.action = action;
        this.statusId = nextStateId;
        this.eventName = eventName;
      } else if (action==CandidateWorkflowActions.REJECT_CANDIDATE) {
        this.setState({ showRejectCandidateModal: true });
        this.action = action;
        this.statusId = nextStateId;
        this.eventName = eventName;
      } else if (action==CandidateWorkflowActions.WITHDRAW) {
        this.setState({ showWithdrawModal: true });
        this.action = action;
        this.statusId = nextStateId;
        this.eventName = eventName;
      } else {
        this.onScheduleSubmit(action, nextStateId, eventName);
      }
    } else {
      if (action==CandidateWorkflowActions.REJECT_CANDIDATE) {
        this.setState({ showRejectCandidateModal: true });
        this.action = action;
        this.statusId = nextStateId;
        this.eventName = eventName;
      } else if (action==CandidateWorkflowActions.WITHDRAW) {
        this.setState({ showWithdrawModal: true });
        this.action = action;
        this.statusId = nextStateId;
        this.eventName = eventName;
      } else {
        this.setState({ showError: true });
        return false;
      }
    }
  };

  candidateStatusUpdate = (successMsg, modal, props?) => {
    this.setState({ showLoader: true });
    const data = {
      candSubmissionId: this.state.candSubmissionId,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      ...props,
    };
    axios
      .put("api/candidates/workflow/status", JSON.stringify(data))
      .then((res) => {
        successToastr(successMsg);
        this.setState({ showLoader: false });
        if (auth.hasPermissionV2(AppPermissions.CAND_SUB_NAME_CLEAR)) {
          history.push(`${INTERVIEW_DETAILS}${this.state.candSubmissionId}`);
        } else {
          window.location.href = APP_HOME_URL;
        }
      });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  onScheduleSubmit = (action, nextStateId?, eventName?) => {
    let data = {
      ...this.state,
      userCalenderIds: this.state.selectedData,
      statusId: nextStateId,
      isSubmit: false,
      eventName: eventName,
      actionId: this.actionId,
    };

    data["isSubmit"] =
      action==CandidateWorkflowActions.SCHEDULE_INTERVIEW_REQUEST
        ? true
        : false;
    const successMsg = data["isSubmit"]
      ? INTERVIEW_REQUESTED_SUCCESS_MSG
      : INTERVIEW_REQUESTED_SUCCESS_MSG;
    let httpVerb = data.candSubInterviewId ? "put" : "post";
    axios[httpVerb](
      "api/candidates/candsubinterview",
      JSON.stringify(data)
    ).then((res) => {
      successToastr(successMsg);
      this.setState({ showScheduleInterviewModal: false });
      if (auth.hasPermissionV2(AppPermissions.CAND_SUB_NAME_CLEAR)) {
        history.push(`${INTERVIEW_DETAILS}${this.state.candSubmissionId}`);
      } else {
        window.location.href = APP_HOME_URL;
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-0">
          <div className="col-12 p-0">
            {(!isNaN(this.state.roundNumber) || !isNaN(this.state.maxRoundNumber)) && (
              <div>
                <div className="container-fluid  d-md-none d-block mb-3 remove-row">
                  <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3 justify-content-end">
                    <div className="txt-orderno text-right col-12">
                      {`Round ${!isNaN(this.state.roundNumber) ? this.state.roundNumber : this.state.maxRoundNumber + 1}`}
                    </div>
                  </div>
                </div>
                <PageTitle
                  title="Schedule Interview"
                  candSubmissionId={this.state.candSubmissionId}
                  status={`Round ${!isNaN(this.state.roundNumber) ? this.state.roundNumber : this.state.maxRoundNumber + 1}`}
                />
              </div>
            )}
            <div className="col-12">
              {!this.state.showLoader && this.state.candidateId && (
                <CandidateShortInfo
                  candidateId={this.state.candidateId}
                  location={this.state.location}
                />
              )}
              <ScheduleInterviewFields
                onDropdownChangeHandle={this.handleDropdownChange}
                onChangeHandle={this.handleChange}
                onChangeData={this.state}
              />
            </div>

            <div className="row ml-0 mr-0 align-items-center mt-3">
              <div className="col-12 col-sm-6">
                <label className="font-weight-bold mb-0">
                  Select time slot for interview
                </label>
                {this.state.showError &&
                  this.state.selectedData.length ==0 ? (
                  <div role="alert" className="k-form-error k-text-start">
                    Please select atleast one time slot.
                  </div>
                ) : null}
              </div>

              <div
                className="col-12 col-sm-6 text-left text-sm-right"
                id="Schedule-radiobtn"
              >
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="customRadio1"
                    value="customRadio1"
                    name="example1"
                    checked
                  />
                  <label className="custom-control-label">Selected Slot</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="customRadio2"
                    value="customRadio2"
                    name="example2"
                    style={{ backgroundColor: "#f2f7fe" }}
                  />

                  <label className="custom-control-label custom-control-label-gray">
                    Unselected Slot
                  </label>
                </div>
              </div>
            </div>
            <div className="col-12 mt-2" id="ScheduleAvailablilty">
              <SchedulerComponent
                modification={false}
                selection={true}
                userId={this.state.hiringManagerId}
                ref={this.childRef}
                onChangeSelection={this.SelectDeselectTasks}
                selectedData={this.state.selectedData}
                initialData={this.state.initialData}
                defaultDate={new Date()}
              />
            </div>
          </div>
        </div>
        {this.state.status && this.state.jobWfTypeId && (
          <FormActions
            wfCode={CandidateWorkflow.CANDIDATE}
            currentState={this.state.status}
            jobWfTypeId={this.state.jobWfTypeId}
            entityId={this.state.candSubmissionId}
            handleClick={this.onValidation}
            //cancelUrl={`${INTERVIEW_DETAILS}${this.state.candSubmissionId}`}
            handleClose={() => history.goBack()}
            hideBtn={this.state.hideBtns}
          />
        )}
        {this.state.showRejectCandidateModal && this.actionId && (
          <RejectModal
            action={"Reject Candidate"}
            actionId={this.actionId}
            message={REJECT_CANDIDATE(null)}
            showModal={this.state.showRejectCandidateModal}
            handleYes={(data) =>
              this.candidateStatusUpdate(
                REJECT_CANDIDATE_SUCCESS_MSG,
                "showRejectCandidateModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showRejectCandidateModal: false });
            }}
          />
        )}
        {this.state.showWithdrawModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={WITHDRAW_CANDIDATE(null)}
            showModal={this.state.showWithdrawModal}
            handleYes={(data) =>
              this.candidateStatusUpdate(
                WITHDRAW_CANDIDATE_SUCCESS_MSG,
                "showWithdrawModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showWithdrawModal: false });
            }}
          />
        )}
        <ConfirmationModal
          message={SCHEDULE_INTERVIEW_CONFIRMATION_MSG}
          showModal={this.state.showScheduleInterviewModal}
          handleYes={(e) =>
            this.onScheduleSubmit(this.action, this.statusId, this.eventName)
          }
          handleNo={() => {
            this.setState({ showScheduleInterviewModal: false });
          }}
        />
      </React.Fragment>
    );
  }
}

export default ScheduleInterview;