import * as React from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { State, toODataString } from "@progress/kendo-data-query";
import axios from "axios";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import {
    GridNoRecord,
    CellRender,
} from "../../../Shared/GridComponents/CommonComponents";
import { initialDataState } from "../../../../HelperMethods";
import { KendoFilter} from "../../../ReusableComponents";

export interface TaskHistoryProps {
    taskId: string;
    taskName: string;
    candidateName: string;
    reqNumber: string;
    handleClose: any;
}

export interface TaskHistoryState {
    data: any;
    dataState: any;
    total?: any;
    showLoader?: boolean;
}

class TaskHistory extends React.Component<TaskHistoryProps, TaskHistoryState> {
  constructor(props: TaskHistoryProps) {
    super(props);
    this.state = {
      data: [],
      dataState: initialDataState,
      showLoader: true,
    };
  }

  componentDidMount() {
    this.getTaskHistory(this.state.dataState);
  }

  getTaskHistory(dataState) {
    const { taskId } = this.props;
    const queryParams = `streamId eq ${taskId} and type eq 'cand_sub_onboarding_task_patched'`;
    var queryStr = `${toODataString(dataState, { utcDates: true })}`;
    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

    axios.get(`api/events/details?${finalQueryString}`).then((res) => {
      let data = res.data.map((x) => JSON.parse(x.data));
      this.setState({ data: data, showLoader: false });
      this.getTaskHistoryCount(dataState);
    });
  }

  onDataStateChange = (changeEvent) => {
    this.setState({ dataState: changeEvent.data });
    this.getTaskHistory(changeEvent.data);
  };
  render() {
    const { taskName, candidateName, reqNumber, handleClose } = this.props;
    return (
      <div className="containerDialog">
        <div className="containerDialog-animation">
          <div className="col-10 col-md-7 shadow containerDialoginside">
            <div className="row blue-accordion">
              <div className="col-12  pt-2 pb-2 fontFifteen">
                Task History : <span> {taskName} </span>
                <span
                  className="float-right cursorElement"
                  onClick={() => this.props.handleClose()}
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                </span>
              </div>
            </div>
            <div className="row ml-0 mr-0 mt-2 mb-2 mt-lg-3 mb-lg-3">
              <Grid
                sortable={false}
                className="text-center kendo-grid-custom col-12 pl-0 pr-0 shadowchild heighty_formobile font-weight-normal global-action-grid-onlyhead"
                data={this.state.data}
                {...this.state.dataState}
                onDataStateChange={this.onDataStateChange}
                pageable={true}
                total={this.state.total}
              >
                <GridNoRecords>
                  {GridNoRecord(this.state.showLoader)}
                </GridNoRecords>
                <GridColumn
                  field="Action"
                  title="Action"
                  cell={(props) => CellRender(props, "Action")}
                />
                <GridColumn
                  field="Status"
                  title="Status"
                  cell={(props) => CellRender(props, "Status")}
                />
                <GridColumn
                  field="Comments"
                  title="Comments"
                  cell={(props) => CellRender(props, "Comments")}
                />
                <GridColumn
                  field="Reason"
                  title="Reason"
                  cell={(props) => CellRender(props, "Reason")}
                />
                <GridColumn
                  field="UpdatedDate"
                  width="130px"
                  editor="date"
                  title="Updated Date"
                  cell={(props) => CellRender(props, "Updated Date")}
                />
                <GridColumn
                  field="UpdatedBy"
                  width="120px"
                  title="Updated By"
                  cell={(props) => CellRender(props, "Updated By")}
                />                
              </Grid>
            </div>
            <div className="row mb-2 mb-lg-4 ml-0 mr-0">
              <div className="col-12 text-center text-right font-regular">
                <button
                  type="button"
                  className="btn button button-close mr-2 shadow"
                  onClick={() => handleClose()}
                >
                  <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getTaskHistoryCount = (dataState) => {
    var finalState: State = {
      ...dataState,
      take: null,
      skip: 0,
    };
    const { taskId } = this.props;
    const queryParams = `streamId eq ${taskId} and type eq 'cand_sub_onboarding_task_patched'`;
    var queryStr = `${toODataString(finalState, { utcDates: true })}`;
    var finalQueryString = KendoFilter(finalState, queryStr, queryParams);

    axios.get(`api/events/details?${finalQueryString}`).then((res) => {
      let data = res.data.map((x) => JSON.parse(x.data));
      this.setState({ total: data.length });
    });
  };
}
export default TaskHistory;
