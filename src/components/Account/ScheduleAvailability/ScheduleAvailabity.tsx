import axios from 'axios'
import React from 'react'
import SchedulerComponent, { SchedulerComponentstate } from '../../Shared/Scheduler/Scheduler'
import PageTitle from '../../Shared/Title'
import { guid } from "@progress/kendo-react-common";
import { parseAdjust, successToastr } from "../../../HelperMethods";
import {
  USER_SCHEDULE_CREATED_SUCCESS_MSG,
  USER_SCHEDULE_UPDATED_SUCCESS_MSG,
  USER_SCHEDULE_REMOVED_SUCCESS_MSG,
} from "../../Shared/AppMessages";
export interface ScheduleAvailabilityProps { }

export interface ScheduleAvailabilityState {
  userId: any;
  initialData: any;
}

class ScheduleAvailability extends React.Component<ScheduleAvailabilityProps, ScheduleAvailabilityState>{
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  childRef: React.RefObject<SchedulerComponent> = React.createRef();
  constructor(props) {
    super(props)
    this.state = {
      userId: this.userObj.userId,
      initialData: [],
    }
  }

  componentDidMount() {
    this.getAllTasks(this.userObj.userId);
  }

  async getAllTasks(id) {
    await axios
      .get(`/api/admin/candsubusercal?$filter=userId eq ${id}`)
      .then((res) => this.setState({ initialData: res.data }));
  };

  createTask = (data) => {
    let postData = {
      userId: this.state.userId,
      slot: JSON.stringify(Object.assign({}, data[0], { id: guid() })),
      startDate: new Date(data[0].start),
    };
    axios
      .post("/api/admin/candsubusercal", JSON.stringify(postData))
      .then(() => {
        this.getAllTasks(this.state.userId);
        successToastr(USER_SCHEDULE_CREATED_SUCCESS_MSG);
      });
  };

  updateTask = (data) => {
    let putData = {
      slot: JSON.stringify(data[0]),
      startDate: new Date(data[0].start),
      candSubUserCalId: this.childRef.current.getScheduleId(data[0].id),
    };
    axios
      .put("/api/admin/candsubusercal", JSON.stringify(putData))
      .then(() => {
        this.getAllTasks(this.state.userId);
        successToastr(USER_SCHEDULE_UPDATED_SUCCESS_MSG);
      });
  };

  removeTask = (data) => {
    let CandSubUserCalId = this.childRef.current.getScheduleId(data[0].id);
    axios
      .delete(`/api/admin/candsubusercal/${CandSubUserCalId}`)
      .then(() => {
        this.getAllTasks(this.state.userId);
        successToastr(USER_SCHEDULE_REMOVED_SUCCESS_MSG);
      });
  };

  render() {
    return (
      <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
        <div className="container-fluid  d-md-none d-block mb-3 remove-row">
          <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
            <label className="col-12 mb-0">Schedule Your Availability</label>
          </div>
        </div>
        <PageTitle title="Schedule Your Availability" />
        <div className="col-12" id="ScheduleAvailablilty">
          <SchedulerComponent
            modification={true}
            selection={false}
            userId={this.state.userId}
            initialData={this.state.initialData}
            createTask={this.createTask}
            updateTask={this.updateTask}
            removeTask={this.removeTask}
            ref={this.childRef}
            defaultDate={new Date()}
          />
        </div>
      </div>
    );
  }
}

export default ScheduleAvailability