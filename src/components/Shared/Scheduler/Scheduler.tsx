import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Scheduler,
  DayView,
  MonthView,
  WeekView,
  SchedulerItem,
} from "@progress/kendo-react-scheduler";
//import "../../../assets/css/KendoScheduler.css";
import "../../../assets/css/App.css";
import "../../../assets/css/Kendo.css";
import "./Scheduler.css";
import { FormWithAdditionalValidation, getTaskData } from "./SchedulerValidator";
import { CustomSlot, EditItemWithDynamicTitle } from "./CustomeTitle";
import { SchedulerTime } from "../AppConstants";
import _ from "lodash";

export interface SchedulerComponentProps {
  userId?: any;
  onChangeSelection?: any;
  modification: boolean;
  selection: boolean;
  selectedData?: any;
  initialData: any;
  createTask?: any;
  updateTask?: any;
  removeTask?: any;
  defaultDate?:any;
}

export interface SchedulerComponentstate {
  userId: any;
  selectedData: any;
  selectedDeselectedValue: boolean;
  defaultDate:Date;
}

class SchedulerComponent extends React.Component<
  SchedulerComponentProps,
  SchedulerComponentstate
> {
  private defaultDate = new Date();
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      selectedData: [],
      selectedDeselectedValue: false,
      defaultDate: new Date()
    };
  }

  componentDidMount() { 
    
    
  }

  getScheduleId = (slotId) => {
    let ScheduleID = this.props.initialData.filter(
      (i) => JSON.parse(i.slot).id ==slotId
    );
    if (ScheduleID.length > 0) {
      return ScheduleID[0].candSubUserCalId;
    }
  };

  handleDataChange = ({ created, updated, deleted }) => {
   
    if (created.length > 0) {
      this.props.createTask(created);
    } else if (updated.length > 0) {
      this.props.updateTask(updated);
    } else if (deleted.length > 0) {
      this.props.removeTask(deleted);
    }
  };

  CustomItem = (props) => {

    const handleDoubleClick = (event) => {
      if (new Date(props.start) < new Date()) {
        event.syntheticEvent.preventDefault();
        return false;
      }

      if (!this.props.modification) {
        this.props.onChangeSelection(event);
      }

      event.syntheticEvent.preventDefault();
      if (props.onDoubleClick) {
        props.onDoubleClick(event);
      }
    };

    const handleClick = (event) => {
      if (!this.props.modification) {
        this.props.onChangeSelection(event);
      }

      event.syntheticEvent.preventDefault();
      if (props.onClick) {
        props.onClick(event);
      }
    };

    let taskId = this.getScheduleId(props.uid);    
    let selected = [];

    if (!this.props.modification) {
      selected = this.props.selectedData.filter((i) => i ==taskId);
    }

    return (
      <SchedulerItem
      
        {...props}
        editable = {new Date(props.start) < new Date() ? false : true}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        style={{
          ...props.style,
          userSelect: "initial",
          color:
          selected.length > 0 && !this.props.modification
              ? "white"
              : this.props.modification
              ? "white"
              : "black",
          backgroundColor:
            selected.length > 0 && !this.props.modification
              ? "#2b70a5"
              : this.props.modification
              ? "#2b70a5"
              : "#ffe69a",
        }}
        // isAllDay={true}
      />
    );
  };

  render() {

    return (
      <Scheduler
      
        data={getTaskData(this.props.initialData)}
        item={this.CustomItem}
        onDataChange={this.handleDataChange}
        editable={{
          add: this.props.modification,
          remove: this.props.modification,
          drag: this.props.modification,
          resize: this.props.modification,
          edit: this.props.modification,
          select: this.props.selection,
        }}
        defaultDate={new Date(this.props.defaultDate)}
        form={FormWithAdditionalValidation}
        editItem={EditItemWithDynamicTitle}
        slot={CustomSlot}
      >
        <WeekView
          workDayStart={SchedulerTime.START_TIME}
          workDayEnd={SchedulerTime.END_TIME}
          slotDivisions={2}
        />
        <MonthView editable={false} />
        <DayView
          workDayStart={SchedulerTime.START_TIME}
          workDayEnd={SchedulerTime.END_TIME}
        />
      </Scheduler>
    );
  }
}

export default SchedulerComponent;
