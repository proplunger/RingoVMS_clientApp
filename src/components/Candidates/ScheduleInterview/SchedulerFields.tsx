import React from "react";
import auth from "../../Auth";
import axios from "axios";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../Shared/withValueField";
import { ErrorComponent, KendoFilter } from "../../ReusableComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Comment } from "../../Shared/Comment/Comment";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import { EntityType } from "../../Shared/AppConstants";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import SkeletonWidget from "../../Shared/Skeleton";
import { filterBy, State, toODataString } from "@progress/kendo-data-query";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";

const CustomDropDownList = withValueField(DropDownList);
const defaultItemDuration = { name: "Select Duration", id: null };
const defaultItemMedium = { name: "Select Medium", id: null };
const defaultItemHiringManager = { name: "Select Interviewer", id: null };

export interface ScheduleInterviewProps {
  onDropdownChangeHandle?: any;
  onChangeHandle?: any;
  onChangeData: any;
}
export interface ScheduleInterviewState {
  showLoader: boolean;
  title: string;
  medium: Array<IDropDownModel>;
  duration: Array<IDropDownModel>;
  hiringManager: Array<IDropDownModel>;
  meetingDetails: string;
  openCommentBox?: boolean;
  skip: any;
  total: any;
  page: any;
  clientId: any;
}
let dataState = {
  skip: 0,
  take: 10,
};
const emptyItem = { name: "loading ..." };
const pageSize = 10;
const loadingData = [];
while (loadingData.length < pageSize) {
  loadingData.push(emptyItem);
}
class ScheduleInterviewFields extends React.Component<
  ScheduleInterviewProps,
  ScheduleInterviewState
> {
  filteredData;
  dataCaching = [];
  pendingRequest;
  requestStarted = false;
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      title: "",
      medium: [],
      duration: [],
      hiringManager: [],
      meetingDetails: "",
      skip: 0,
      total: 10,
      page: 8,
      clientId: auth.getClient()
    };
  }

  componentDidMount() {
    this.getHiringManagers(dataState);
    this.getDurations();
    this.getMediums();
  }

  async getHiringManagers(dataState) {
    if (this.requestStarted) {
      clearTimeout(this.pendingRequest);
      this.pendingRequest = setTimeout(() => {
        this.getHiringManagers(dataState);
      }, 50);
      return;
    }
    this.requestStarted = true;

    const { clientId } = this.state;
    // var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
    var queryStr = `${toODataString(dataState, { utcDates: true })}`;
    const queryParams = `permCode eq '${AppPermissions.CAND_INTVW_RESULT_CREATE}'`;
    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
    await axios.get(`api/clients/${clientId}/approvers?${finalQueryString} &$orderby=name `)
      .then((response) => {
        const items = [];
        response.data.forEach((element, index) => {
          const item = element;
          items.push(item);
          this.dataCaching[index + dataState.skip] = item;
        });
        if (dataState.skip ==this.state.skip) {
          // if (items.length < 5) {
          //     this.setState({total:5})
          // }
          // else {
          //     this.setState({ total: 20 });
          // }
          this.setState({
            hiringManager: items,
          },() => this.getHiringManagerCount(dataState));
        }
        this.requestStarted = false;
      });
  }

  getHiringManagerCount(dataState){
    var finalState: State = {
      ...dataState,
      take: null,
      skip: 0,
    };
    const { clientId } = this.state;
    // var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
    var queryStr = `${toODataString(finalState, { utcDates: true })}`;
    const queryParams = `permCode eq '${AppPermissions.CAND_INTVW_RESULT_CREATE}'`;
    var finalQueryString = KendoFilter(finalState, queryStr, queryParams);
    axios.get(`api/clients/${clientId}/approvers?${finalQueryString} &$orderby=name `)
      .then((response) => {
        this.setState({
          total: response.data.length,
        })
      })
  }

  pageChange = (event) => {
    const skip = event.page.skip;
    const take = event.page.take;
    let dataState = {
      skip: skip,
      take: skip + take,
    };
    if (this.shouldRequestData(skip)) {
      this.getHiringManagers(dataState);
    }

    const data = this.getCachedData(skip);

    this.setState({
      hiringManager: data,
      skip: skip,
    });
  };
  
  shouldRequestData(skip) {
    for (let i = 0; i < pageSize; i++) {
      if (!this.dataCaching[skip + i]) {
        return true;
      }
    }
    return false;
  }

  getCachedData(skip) {
    const data = [];
    for (let i = 0; i < pageSize; i++) {
      data.push(this.dataCaching[i + skip] || emptyItem);
    }
    return data;
  }

  onFilterChange = (event) => {
    this.filteredData = filterBy(
      this.state.hiringManager.slice(),
      event.filter
    );
    let dataState = {
      skip: 0,
      take: 100,
      filter: {
        logic: "or",
        filters: [
          {
            field: "name",
            operator: "contains",
            value: `${event.filter.value}`,
            ignoreCase: true,
          },
          // {
          //   field: "lastName",
          //   operator: "contains",
          //   value: `${event.filter.value}`,
          //   ignoreCase: true,
          // }
        ],
      },
    };

    this.getHiringManagers(dataState);
    this.setState({
      skip: 0,
    });
  };

  async getMediums() {
    this.setState({ showLoader: true });
    await axios.get(`api/admin/medium`).then((res) => {
      this.setState({ medium: res.data, showLoader: false });
    });
  }

  async getDurations() {
    this.setState({ showLoader: true });
    await axios.get(`api/admin/duration`).then((res) => {
      this.setState({ duration: res.data, showLoader: false });
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-12 pl-0 pr-0">
          {this.state.showLoader && <SkeletonWidget />}
          {!this.state.showLoader && (
            <div>
              <div className="row mx-auto">
                <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0">
                  <label className="mb-1 font-weight-bold required">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Enter Title"
                    maxLength={50}
                    required={true}
                    onChange={this.props.onChangeHandle}
                    value={this.props.onChangeData.title}
                  />
                  {this.props.onChangeData.showError &&
                    this.props.onChangeData.title =="" && <ErrorComponent />}
                </div>
                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-2">
                  <label className="mb-1 font-weight-bold required">
                    Medium
                  </label>
                  <CustomDropDownList
                    className="form-control disabled"
                    name={`mediumId`}
                    data={this.state.medium}
                    textField="name"
                    valueField="id"
                    id="medium"
                    value={this.props.onChangeData.mediumId}
                    defaultItem={defaultItemMedium}
                    onChange={(e) => this.props.onDropdownChangeHandle(e)}
                  />
                  {this.props.onChangeData.showError &&
                    this.props.onChangeData.mediumId ==null && (
                      <ErrorComponent />
                    )}
                </div>
                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-2">
                  <label className="mb-1 font-weight-bold required">
                    Duration
                  </label>
                  <CustomDropDownList
                    className="form-control disabled"
                    name={`durationId`}
                    data={this.state.duration}
                    textField="name"
                    valueField="id"
                    id="duration"
                    value={this.props.onChangeData.durationId}
                    defaultItem={defaultItemDuration}
                    onChange={(e) => this.props.onDropdownChangeHandle(e)}
                  />
                  {this.props.onChangeData.showError &&
                    this.props.onChangeData.durationId ==null && (
                      <ErrorComponent />
                    )}{" "}
                </div>
              </div>
              <div className="row mx-auto mt-3">
                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-2">
                  <label className="mb-1 font-weight-bold required">
                    Interviewer
                  </label>
                  <CustomDropDownList
                    className="form-control disabled "
                    name={`hiringManagerId`}
                    data={this.state.hiringManager}
                    textField="name"
                    valueField="id"
                    id="hiringManager"
                    filterable={true}
                    value={this.props.onChangeData.hiringManagerId}
                    defaultItem={defaultItemHiringManager}
                    onChange={(e) => this.props.onDropdownChangeHandle(e)}
                    virtual={{
                      total: this.state.total,
                      pageSize: this.state.page,
                      skip: this.state.skip,
                    }}
                    onPageChange={(e) => this.pageChange(e)}
                    onFilterChange={(e) => this.onFilterChange(e)}
                  />
                  {this.props.onChangeData.showError &&
                    this.props.onChangeData.hiringManagerId ==null && (
                      <ErrorComponent />
                    )}{" "}
                </div>
                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-2">
                  <label className="mb-1 font-weight-bold required">
                    Meeting Details
                  </label>
                  <textarea
                    name="meetingDetails"
                    className="form-control"
                    maxLength={1000}
                    onChange={this.props.onChangeHandle}
                    value={this.props.onChangeData.meetingDetails}
                  />
                  {this.props.onChangeData.showError &&
                    this.props.onChangeData.meetingDetails =="" && (
                      <ErrorComponent />
                    )}{" "}
                </div>
                <div className="col-12 col-sm-4 col-lg-4 mt-2 mt-sm-0">
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
                    entityId={this.props.onChangeData.candSubmissionId}
                  />
                </div>
                {this.state.openCommentBox && (
                  <CommentHistoryBox
                    entityType={EntityType.CANDSUBMISSION}
                    entityId={this.props.onChangeData.candSubmissionId}
                    showDialog={this.state.openCommentBox}
                    handleNo={() => {
                      this.setState({ openCommentBox: false });
                      document.body.style.position = "";
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ScheduleInterviewFields;
