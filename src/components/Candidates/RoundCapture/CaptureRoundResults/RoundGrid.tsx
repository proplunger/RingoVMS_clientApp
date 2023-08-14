import { toODataString } from "@progress/kendo-data-query";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import axios from "axios";
import React from "react";
import { KendoFilter } from "../../../ReusableComponents";
import { GridNoRecord } from "../../../Shared/GridComponents/CommonComponents";
import { CustomHeaderActionCell, MyCommandCell } from "./RoundCaptureCells";
import withValueField from "../../../Shared/withValueField";
import SkeletonWidget from "../../../Shared/Skeleton";
import { initialDataState } from "../../../../HelperMethods";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { REMOVE_ROUND_RESULT_CONFIRMATION_MSG } from "../../../Shared/AppMessages";
const CustomDropDownList = withValueField(DropDownList);

export interface RoundResultViewProps {
  candSubmissionId?: string;
  reqId?: string;
  interviewId?: string;
  interviewStatusId?: any;
  getAllCriteriaData: any;
}

export interface RoundResultViewState {
  data: any;
  clientId?: string;
  showDeleteModal?: boolean;
  showLoader?: boolean;
  showAddBillDialog?: boolean;
  dataItem?: any;
  dataState?: any;
  originalData?: any;
  ratingOptions: any;
  currentDataItem: any;
  showResultRemoveModal?: any;
}

const defaultRating = { name: "Select Rating", id: null };
class RoundResultView extends React.Component<
  RoundResultViewProps,
  RoundResultViewState
> {
  CommandCell;
  CustomHeaderActionCellTemplate: any;
  editField = "inEdit";
  private dataItem;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      originalData: [],
      ratingOptions: [],
      currentDataItem: { isDefault: false },
      showLoader: false,
    };
    this.initializeHeaderCell(true);
    this.initializeActionCell();
  }

  componentDidMount() {
    this.getAllCriteria(initialDataState);
    this.getRatingOption();
  }

  getAllCriteria = async (dataState) => {
    this.setState({ showLoader: true });
    var queryStr = `${toODataString(dataState, { utcDates: true })}`;
    var queryParams = `candSubInterviewId eq ${this.props.interviewId}`;

    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
   await axios
      .get(`api/candidates/candsubinterviewresult?${finalQueryString}`)
      .then((res) => {
        this.setState(
          {
            data: res.data,
            showLoader: false,
            originalData: res.data,
          },
          () => this.props.getAllCriteriaData(this.state.data)
        );
      });
  };

  getInterviewResultData = () => {
    return this.state.data;
  };

  async getRatingOption() {
    await axios
      .get(`api/admin/rating`)
      .then((res) => this.setState({ ratingOptions: res.data }));
  }

  // row add/save action
  add = (dataItem) => {
    dataItem.inEdit = undefined;
    this.SaveNewCriteria(dataItem);
  };

  // global add action
  addNew = () => {
    const newDataItem = {
      inEdit: true,
      Discontinued: false,
      comment: "",
      criteria: "",
      rating: "",
      ratingId: null,
      CandSubInterviewId: this.props.interviewId,
      CandSubInterviewResultIntId: this.generateId(this.state.data),
    };
    this.setState({
      data: [newDataItem, ...this.state.data],
    });
  };

  SaveNewCriteria = (dataItem) => {
    let data = {
      Criteria: dataItem.criteria,
      RatingId: dataItem.ratingId,
      Comment: dataItem.comment,
      CandSubInterviewId: this.props.interviewId,
    };
    axios
      .post(`api/candidates/candsubinterviewresult`, JSON.stringify(data))
      .then(() => this.getAllCriteria(initialDataState));
  };

  deleteCriteria = (dataItem) => {
    this.dataItem = dataItem;
    this.setState({ showResultRemoveModal: true });
  };

  deleteInterviewResult = () => {
    let dataItem = this.dataItem;
    this.setState({ showResultRemoveModal: false });
    axios
      .delete(
        `api/candidates/candsubinterviewresult/${dataItem.candSubInterviewResultId}`
      )
      .then(() => this.getAllCriteria(initialDataState));
  };

  updateCriteria = (dataItem) => {
    let data = {
      CandSubInterviewResultId: dataItem.candSubInterviewResultId,
      Criteria: dataItem.criteria,
      RatingId: dataItem.ratingId,
      Comment: dataItem.comment,
      CandSubInterviewId: this.props.interviewId,
    };
    axios
      .put(`api/candidates/candsubinterviewresult`, JSON.stringify(data))
      .then(() => this.getAllCriteria(initialDataState));
  };

  initializeActionCell = () => {
    this.CommandCell = MyCommandCell({
      edit: this.enterEdit,
      checkStatus: this.props.interviewStatusId,
      remove: this.deleteCriteria,
      add: this.add,
      discard: this.discard,
      update: this.updateCriteria,
      cancel: this.cancel,
      editField: this.editField,
    });
  };

  initializeHeaderCell = (canRemove) => {
    this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
      AddCriteria: this.addNew,
      checkStatus: this.props.interviewStatusId,
    });
  };

  itemChange = (event) => {
    const data = this.state.data.map((item) =>
      item.candSubInterviewResultId ==
        event.dataItem.candSubInterviewResultId &&
      item.CandSubInterviewResultIntId ==
        event.dataItem.CandSubInterviewResultIntId
        ? { ...item, [event.field]: event.value }
        : item
    );

    this.setState({ data });
  };

  generateId = (data) => {
    return (
      data.reduce(
        (acc, current) =>
          Math.max(
            acc,
            isNaN(current.CandSubInterviewResultIntId)
              ? 0
              : current.CandSubInterviewResultIntId
          ),
        0
      ) + 1
    );
  };

  enterEdit = (dataItem) => {
    const data = this.state.data.map((item) =>
      item.candSubInterviewResultId ==dataItem.candSubInterviewResultId &&
      item.CandSubInterviewResultIntId==dataItem.CandSubInterviewResultIntId
        ? { ...item, inEdit: true }
        : item
    );
    this.setState({
      data: data,
      currentDataItem: dataItem,
    });
  };

  discard = (dataItem) => {
    var data = this.state.data.filter(function (item) {
      if (item != dataItem) {
        return item;
      }
    });
    this.setState({ data: data });
  };

  cancel = (dataItem) => {
    const originalItem = this.state.originalData.find(
      (p) => p.candSubInterviewResultId ==dataItem.candSubInterviewResultId
    );
    originalItem["inEdit"] = undefined;
    const data = this.state.data.map((item) =>
      item.candSubInterviewResultId ==originalItem.candSubInterviewResultId
        ? originalItem
        : item
    );
    this.setState({ data: data });
  };

  handleChange = (e, props) => {
    this.setState((prevState) => ({
      data: prevState.data.map((item) =>
        item.candSubInterviewResultId ==
          props.dataItem.candSubInterviewResultId &&
        item.CandSubInterviewResultIntId ==
          props.dataItem.CandSubInterviewResultIntId
          ? Object.assign(item, { rating: e.value.name, ratingId: e.value.id })
          : item
      ),
    }));
  };

  updateState = (value, props) => {
    // const data = this.state.data.map((item) =>
    //     item.id ==props.dataItem.id
    //         ? { ...item, [props.field]: value }
    //         : item
    // );
    // this.setState({ data: data });
    const data = this.state.data.map((item) =>
    item.candSubInterviewResultId ==
      props.dataItem.candSubInterviewResultId &&
    item.CandSubInterviewResultIntId ==
      props.dataItem.CandSubInterviewResultIntId
      ? { ...item, [props.field]: value }
      : item
  );

  this.setState({ data });

  };

InputField = (props) => {
    const { dataItem, field } = props;
    let max=field=="comment"?2000:100;
    return (
        <td contextMenu={max==2000?"Comment":"Criteria"}>
            {dataItem.inEdit ? (
            <div  className="my-task-desciption">
            <input
                type="text"
                className="form-control "
                placeholder=""
                value={dataItem[field]}
                maxLength={max}
                onChange={(event) => {
                    this.updateState(event.target.value, props);
                }}
                name="name"
            />
            {/* {props.dataItem && props.dataItem[field]&& props.dataItem[field].length >= max && <ErrorComponent message={`Lob ${field} should not be greater than ${max} charecters`} />} */}
        </div>
        ) : (
          <div className="my-task-desciption" title={dataItem[field]}>
              {dataItem[field]}
            </div>
        )}
        </td>
    );
};



  render() {
    const { showLoader, data } = this.state;
    return (
      <div className="row mt-3 mt-md-0">
        <div className="container-fluid" id="nameyoursearch">
          <div className="cand-bill-rate-1" id="RoundeGrid-rate">
            {!showLoader && data && (
              <Grid
                data={this.state.data}
                onItemChange={this.itemChange}
                editField={this.editField}
                expandField="expanded"
                className="kendo-grid-custom lastchild global-action-grid-lastchild"
              >
                <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>
                <GridColumn field="criteria" 
              //    cell={(props) => <td contextMenu="Criteria">
              //    <div className="my-task-desciption">{props.dataItem.criteria}</div>
              //  </td>}
              cell={this.InputField}
                title="Criteria" width="250" />
                <GridColumn
                  field="rating"
                  title="Rating"
                  width="250"
                  cell={(props) => {
                    const { dataItem, field } = props;
                    const dataValue = {
                      name: (dataItem[field]==null || dataItem[field]==undefined || dataItem[field]=="") ? "" : dataItem[field],
                    };
                    return (
                      <td contextMenu={"Rating"}>
                        {dataItem.inEdit ? (
                          <div className="my-task-desciption Rating-border">
                          <CustomDropDownList
                            onChange={(e) => this.handleChange(e, props)}
                            value={dataItem.ratingId}
                            name={`rating`}
                            valueField="id"
                            id="id"
                            data={this.state.ratingOptions}
                            textField="name"
                            defaultItem={defaultRating}
                          />
                          </div>
                        ) : (
                          dataValue.name
                        )}
                      </td>
                    );
                  }}
                />
                <GridColumn field="comment"
                 title="Comment" 
              //    cell={(props) => <td contextMenu="Comment">
              //    <div className="my-task-desciption">{props.dataItem.comment}</div>
              //  </td>}
              cell={this.InputField}
                 />
                <GridColumn
                  title=""
                  width="100px"
                  sortable={false}
                  cell={this.CommandCell}
                  headerCell={this.CustomHeaderActionCellTemplate}
                />
              </Grid>
            )}
          </div>
        </div>
        <ConfirmationModal
          message={REMOVE_ROUND_RESULT_CONFIRMATION_MSG}
          showModal={this.state.showResultRemoveModal}
          handleYes={(e) => this.deleteInterviewResult()}
          handleNo={() => {
            this.setState({ showResultRemoveModal: false });
          }}
        />
      </div>
    );
  }
}

export default RoundResultView;
