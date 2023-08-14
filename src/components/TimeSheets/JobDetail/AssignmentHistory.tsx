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
} from "../../Shared/GridComponents/CommonComponents";
import { dateFormatter, initialDataState } from "../../../HelperMethods";
import { KendoFilter} from "../../ReusableComponents";

export interface AssignmentHistoryProps {
    candSubmissionId: string;
    candidateName: string;
    reqNumber: string;
    handleClose: any;
}

export interface AssignmentHistoryState {
    data: any;
    dataState: any;
    total?: any;
    showLoader?: boolean;
}

class AssignmentHistory extends React.Component<AssignmentHistoryProps, AssignmentHistoryState> {
  constructor(props: AssignmentHistoryProps) {
    super(props);
    this.state = {
      data: [],
      dataState: initialDataState,
      showLoader: true,
    };
  }

  componentDidMount() {
    this.getAssignmentHistory(this.state.dataState);
  }

  getAssignmentHistory(dataState) {
    const { candSubmissionId } = this.props;
    const queryParams = `streamId eq ${candSubmissionId} and type eq 'cand_sub_patched' & $orderby=timestamp desc`;
    var queryStr = `${toODataString(dataState, { utcDates: true })}`;
    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

    axios.get(`api/events/details?${finalQueryString}`).then((res) => {
      let data = res.data.map((x) => JSON.parse(x.data));
      this.setState({ data: data, showLoader: false });
      this.getAssignmentHistoryCount(dataState);
    });
  }

  onDataStateChange = (changeEvent) => {
    this.setState({ dataState: changeEvent.data });
    this.getAssignmentHistory(changeEvent.data);
  };
  render() {
    const { candidateName, reqNumber, handleClose } = this.props;
    return (
      <div className="containerDialog">
        <div className="containerDialog-animation">
          <div className="col-10 col-md-7 shadow containerDialoginside containerDialoginside-height">
            <div className="row blue-accordion">
              <div className="col-12  pt-2 pb-2 fontFifteen">
                Assignment History : <span> {candidateName} </span>
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
                className="text-center kendo-grid-custom col-12 pl-0 pr-0 shadowchild heighty_formobile font-weight-normal"
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
                  field="Values"
                 
                  title="Update"
                  cell={(props) => {
                    let data = props.dataItem.Values
                      ? JSON.parse(props.dataItem.Values.replaceAll("'", '"'))
                      : {};
                    let keys = Object.keys(data);
                    return (
                      <td contextMenu={"Update"}>
                        {keys.map((i) => (
                          <span title={i}>{`${
                            i=="startDate"
                              ? "Start Date: " +
                                dateFormatter(new Date(data[i]))
                              : "End Date: " + dateFormatter(new Date(data[i]))
                          } `}</span>
                        ))}
                      </td>
                    );
                  }}
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

  getAssignmentHistoryCount = (dataState) => {
    var finalState: State = {
      ...dataState,
      take: null,
      skip: 0,
    };
    const { candSubmissionId } = this.props;
    const queryParams = `streamId eq ${candSubmissionId} and type eq 'cand_sub_patched' & $orderby=timestamp desc`;
    var queryStr = `${toODataString(finalState, { utcDates: true })}`;
    var finalQueryString = KendoFilter(finalState, queryStr, queryParams);

    axios.get(`api/events/details?${finalQueryString}`).then((res) => {
      let data = res.data.map((x) => JSON.parse(x.data));
      this.setState({ total: data.length });
    });
  };
}
export default AssignmentHistory;
