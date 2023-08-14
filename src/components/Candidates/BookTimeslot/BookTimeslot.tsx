import * as React from "react";
import axios from "axios";
import auth from "../../Auth";
import PageTitle from "../../Shared/Title";
import CandidateShortInfo from "../../Shared/CandidateInformation/CandidateShortInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BOOK_INTERVIEW_CONFIRMATION_MSG,
  INTERVIEW_SCHEDULED_SUCCESS_MSG,
} from "../../Shared/AppMessages";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { CandSubInterviewStatusIds } from "../../Shared/AppConstants";
import { ConfirmationModal } from "../../Shared/ConfirmationModal";
import { history, successToastr, datetimeFormatter } from "../../../HelperMethods";
import { APP_HOME_URL, INTERVIEW_DETAILS } from "../../Shared/ApiUrls";
import { Link } from "react-router-dom";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import SchedulerComponent from "../../Shared/Scheduler/Scheduler";
import _ from "lodash";

export interface BookTimeslotProps {
  match: any;
}

export interface BookTimeslotState {
  candSubInterviewIds?: any;
  candSubInterviewId?: any;
  candSubmissionId?: string;
  candidateId?: string;
  showLoader?: boolean;

  openCommentBox?: boolean;
  showBookTimeslotModal?: boolean;

  interviewDetails?: any;
  candSubInterviewIntId?: string;
  selectedData?: any;

  selectedDate: any;
  interviewStartDate?: any;
  interviewEndDate?: any;

  status?: string;
  location?: string;

  initialData: any;
  clientLobId?: any;

  defaultDate?:any;
}

class BookTimeslot extends React.Component<
  BookTimeslotProps,
  BookTimeslotState
> {
  childRef: React.RefObject<SchedulerComponent> = React.createRef();
  private userClientLobId: any = localStorage.getItem("UserClientLobId");
  constructor(props: BookTimeslotProps) {
    super(props);
    this.state = {
      selectedData: [],
      selectedDate: "",
      candSubInterviewIds: [],
      initialData: [],
      clientLobId: this.userClientLobId,
    };
  }

  componentDidMount() {
    const { id, subId } = this.props.match.params;
    let ids = [];
    ids.push(id);
    this.setState({ candSubmissionId: subId, candSubInterviewIds: ids, candSubInterviewId: id });
    this.getCandidateSubmissionDetails(subId);
    this.getCandidateInterviewDetails(id);
    this.getAvailableTasks(id);
  }

  async getCandidateSubmissionDetails(candSubmissionId) {
    this.setState({ showLoader: true });
    await axios.get(`api/candidates/workflow/${candSubmissionId}`).then((res) => {
      this.setState({
        candidateId: res.data.candidateId,
        status: res.data.status,
        location: res.data.location,
        showLoader: false,
      });
    });
  }

  async getCandidateInterviewDetails(candSubInterviewId) {
    this.setState({ showLoader: true });
    await axios
      .get(`api/candidates/candsubinterview/${candSubInterviewId}`)
      .then((res) => {
        this.setState({
          interviewDetails: res.data,
          showLoader: false,
        });
      });
  }

  getAvailableTasks = (id) => {
    axios
      .get(
        `/api/candidates/candsubinterview/candsubinterviewslot?$filter=candSubInterviewId eq ${id}`
      )
      .then((res) => {
        let data = res.data.map((data) => {
          return {
            candSubUserCalId: data.candSubUserCalId,
            slot: data.candSubUserCal.slot,
          };
        });
        this.setState({ initialData: data }, ()=>{
          this.getFirstAvailableDate();
        });
      });
  };

  SelectDeselectTasks = (event) => {
    let ScheduleID = this.childRef.current.getScheduleId(
      event.target.props.uid
    );
    this.setState({
      showBookTimeslotModal: true,
      interviewStartDate: datetimeFormatter(event.target.props.start),
      interviewEndDate: datetimeFormatter(event.target.props.end),
      selectedDate: `${datetimeFormatter(
        event.target.props.start
      )} - ${datetimeFormatter(event.target.props.end)}`,
    });
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

  BookTimeslot = () => {
    let data = {
      CandSubInterviewIds: this.state.candSubInterviewIds,
      candSubmissionId: this.state.candSubmissionId,
      candSubUserCalId: this.state.selectedData[0],
      interviewStartDate: this.state.interviewStartDate,
      interviewEndDate: this.state.interviewEndDate,
      statusIntId: CandSubInterviewStatusIds.SCHEDULED, //TODO
      clientLobId: this.state.clientLobId
    };
    axios
      .put("api/candidates/candsubinterview/status", JSON.stringify(data))
      .then((res) => {
        successToastr(INTERVIEW_SCHEDULED_SUCCESS_MSG);
        this.setState({ showBookTimeslotModal: false });
        if (auth.hasPermissionV2(AppPermissions.CAND_SUB_CREATE)) {
          // history.push(
          //   `${INTERVIEW_DETAILS}${this.state.candSubmissionId}`
          // );
          history.goBack()
        } else {
          window.location.href = APP_HOME_URL;
        }
      });
  };
  getFirstAvailableDate=()=>{
    let startDates = this.state.initialData.map(x => new Date(JSON.parse(x.slot).start));
    let validates:Date[] = startDates.filter(x => x >= new Date());
    if(validates.length > 0){
      this.setState({defaultDate:_.orderBy(validates)[0]})
    }
    else{
      this.setState({defaultDate:new Date()})
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-0">
          <div className="col-12 p-0">
            {this.state.interviewDetails && (
              <PageTitle
                title="Schedule Interview"
                candSubmissionId={this.state.candSubmissionId}
                candSubInterviewId={this.state.candSubInterviewId}
                status={`Round ${this.state.interviewDetails.roundNumber}`}
              />
            )}
            <div className="col-12">
              {this.state.candidateId && (
                <CandidateShortInfo candidateId={this.state.candidateId} location={this.state.location} />
              )}
            </div>
            <div className="col-12" id="ScheduleAvailablilty">
              {this.state.candSubInterviewId && this.state.defaultDate && (
                <SchedulerComponent
                  modification={false}
                  selection={true}
                  userId={this.state.candSubInterviewId}
                  ref={this.childRef}
                  onChangeSelection={this.SelectDeselectTasks}
                  selectedData={this.state.selectedData}
                  initialData={this.state.initialData}
                  defaultDate={this.state.defaultDate}
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="col-sm-12 col-12 p-2">
            <div className="row text-center">
              <div className="col-12 mt-4 mb-4 heello">
                <div className="row ml-sm-0 mr-sm-0 justify-content-center">
                  {/* <Link
                    to={`${INTERVIEW_DETAILS}${this.state.candSubmissionId}`}
                  > */}
                  <button
                    type="button"
                    className="btn button button-close mr-2 mr-sm-2 mr-lg-2 shadow col-auto mb-2"
                    onClick={() => history.goBack()}
                  >
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className={"mr-2"}
                    />
                      Close
                    </button>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ConfirmationModal
          message={BOOK_INTERVIEW_CONFIRMATION_MSG(this.state.selectedDate)}
          showModal={this.state.showBookTimeslotModal}
          handleYes={this.BookTimeslot}
          handleNo={() => {
            this.setState({ showBookTimeslotModal: false, selectedData: [] });
          }}
        />
      </React.Fragment>
    );
  }
}

export default BookTimeslot;