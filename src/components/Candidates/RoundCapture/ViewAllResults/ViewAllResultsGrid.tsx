import * as React from "react";
import axios from "axios";
import {
  CellRender,
  GridNoRecord,
  CandidateInterviewStatusCell,
} from "../../../Shared/GridComponents/CommonComponents";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { State, toODataString } from "@progress/kendo-data-query";
import { KendoFilter, NumberCell } from "../../../ReusableComponents";
import "../../../../assets/css/App.css";
import "../../../../assets/css/KendoCustom.css";
import { Rating } from "@progress/kendo-react-inputs";
import RowActions from "../../../Shared/Workflow/RowActions";
import {
  CustomeHeaderCell,
  DefaultActions,
  DetailColumnCell,
} from "./WFCells";
import { initialDataState } from "../../../../HelperMethods";
import {  ViewMoreComponent } from "./WFCells";
import {
  CandSubInterviewStatusIds,
  CandSubStatusIds,
} from "../../../Shared/AppConstants";
import {
  CANCEL_INTERVIEW_CONFIRMATION_MSG,
  INTERVIEW_CANCELLED_SUCCESS_MSG,
  INTERVIEW_REMOVED_SUCCESS_MSG,
  INTERVIEW_RESEND_TO_VENDOR_SUCCESS_MSG,
  REMOVE_INTERVIEW_CONFIRMATION_MSG,
  RESEND_TO_VENDOR_INTERVIEW_CONFIRMATION_MSG,
} from "../../../Shared/AppMessages";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { successToastr } from "../../../../HelperMethods";
import auth from "../../../Auth";

export interface AllRoundResultViewProps {
  CandidateSubmissionId?: any;
  reqId?: any;
  statusIntId?: any;
}

export interface AllRoundResultViewState {
  CandidateSubmissionId?: any;
  data: any;
  clientId?: string;
  showDeleteModal?: boolean;
  showLoader?: boolean;
  showAddBillDialog?: boolean;
  dataItem?: any;
  reqId: any;
  showCancelSelectedInterviewsModal?: boolean;
  enableCancelInterview?: boolean;
  selectedIds: any;
  totalCount?: number;
  showRemoveModal?: boolean;
  showCancelInterviewModal?: boolean;
  showResendToVendorModal?: boolean;
  vendorId: string;
}

class AllRoundResultView extends React.Component<
  AllRoundResultViewProps,
  AllRoundResultViewState
> {
  CustomHeaderActionCellTemplate: any;
  reqId;
  public candSubInterviewId: string;
  public dataItem: any;
  constructor(props) {
    super(props);
    this.state = {
      reqId: "",
      data: [],
      selectedIds: [],
      vendorId: auth.getVendor(),
    };
  }

  componentDidMount() {
    this.getInterviews(initialDataState, this.props.CandidateSubmissionId);
  }

  getInterviews = (dataState, candSubId) => {
    this.setState({ showLoader: true,CandidateSubmissionId :candSubId});
    var queryStr = `${toODataString(dataState, { utcDates: true })}`;
    var queryParams = this.candidateQuery(candSubId);
    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
    axios
      .get(`api/candidates/candsubinterview?${finalQueryString}`)
      .then((res) => {
        this.setState({
          data: res.data,
          showLoader: false,
        });
        this.getInterviewsCount(dataState, candSubId);
      });
  };

  private candidateQuery(candSubId): string {
    var queryParams = `candSubmissionId eq ${candSubId}`;
    if (this.state.vendorId) {
      queryParams = `candSubmissionId eq ${candSubId} and statusIntId ne ${CandSubInterviewStatusIds.DRAFT}`;
    }
    
    return queryParams;
  }

  // dynamic action click
handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
    let change = {};
    let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
    change[property] = true;
    this.setState(change);
    this.dataItem = dataItem;
    this.candSubInterviewId = dataItem.candSubInterviewId;
};

cancelInteviewRound = () => {
    this.setState({ showCancelInterviewModal: false });
    let ids = [];
    ids.push(this.candSubInterviewId);
    const data = {
        CandSubInterviewIds: ids,
        CandSubmissionId: this.state.CandidateSubmissionId,
        StatusIntId: CandSubInterviewStatusIds.CANCELLED,
    };
    axios.put(`api/candidates/candsubinterview/status`, JSON.stringify(data)).then((res) => {
        successToastr(INTERVIEW_CANCELLED_SUCCESS_MSG);
        this.getInterviews(initialDataState, this.state.CandidateSubmissionId);
    });
};

candidateStatusUpdate = () => {
    this.setState({ showCancelSelectedInterviewsModal: false });
  
    const data = {
        CandSubInterviewIds:this.state.selectedIds,
        CandSubmissionId: this.state.CandidateSubmissionId,
        StatusIntId: CandSubInterviewStatusIds.CANCELLED,
    };
    axios.put(`api/candidates/candsubinterview/status`, JSON.stringify(data)).then((res) => {
        successToastr(INTERVIEW_CANCELLED_SUCCESS_MSG);
        this.getInterviews(initialDataState, this.state.CandidateSubmissionId);
    });
};

removeInteviewRound = () => {
    this.setState({ showRemoveModal: false });
    axios.delete(`api/candidates/candsubinterview/${this.candSubInterviewId}`).then((res) => {
        successToastr(INTERVIEW_REMOVED_SUCCESS_MSG);
        this.getInterviews(initialDataState, this.state.CandidateSubmissionId);
    });
};

resendToVendor = () => {
    this.setState({ showResendToVendorModal: false });
    let ids = [];
    ids.push(this.candSubInterviewId);
    const data = {
        CandSubInterviewIds: ids,
        CandSubmissionId: this.state.CandidateSubmissionId,
        StatusIntId: CandSubInterviewStatusIds.RESCHEDULED,
    };
    axios.put(`api/candidates/candsubinterview/status`, JSON.stringify(data)).then((res) => {
        successToastr(INTERVIEW_RESEND_TO_VENDOR_SUCCESS_MSG);
        this.getInterviews(initialDataState, this.state.CandidateSubmissionId);
    });
};

  openModal = (prop, reqId) => {
    let change = {};
    change[prop] = true;
    this.setState(change);
    this.reqId = reqId;
  };

  expandChange = (dataItem) => {
    dataItem.expanded = !dataItem.expanded;
    this.forceUpdate();
  };

  onDataStateChange = (changeEvent) => {
    this.getInterviews(changeEvent.data, this.state.CandidateSubmissionId);
  };

  selectionChange = (event) => {
    var checked = event.syntheticEvent.target.checked;

    let ids = this.state.selectedIds;
    const data = this.state.data.map((item) => {
      if (item.candSubInterviewId ==event.dataItem.candSubInterviewId) {
        item.selected = !event.dataItem.selected;

        if (
          item.statusIntId==CandSubInterviewStatusIds.PENDINGCONFIRMATION ||
          item.statusIntId==CandSubInterviewStatusIds.SCHEDULED ||
          item.statusIntId==CandSubInterviewStatusIds.RESCHEDULED
        ) {
          if (checked==true) {
            ids.push(item.candSubInterviewId);
          } else if (checked==false) {
            ids = ids.filter((o) => o !=item.candSubInterviewId);
          }
        }
      }

      return item;
    });

    this.shouldSubmitSelectedBtnEnable(this.state.data);

    this.setState({ data, selectedIds: ids });
  };

  headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    let ids = [];
    const data = this.state.data.map((item) => {
      if (checked==true) {
        if (
          item.statusIntId==CandSubInterviewStatusIds.PENDINGCONFIRMATION ||
          item.statusIntId==CandSubInterviewStatusIds.SCHEDULED ||
          item.statusIntId==CandSubInterviewStatusIds.RESCHEDULED
        ) {
          ids.push(item.candSubInterviewId);
        }
      }
      item.selected = checked;
      return item;
    });
    this.shouldSubmitSelectedBtnEnable(this.state.data);
    this.setState({ data, selectedIds: ids });
  };

  ExpandCell = (props) => (
    <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />
  );

  render() {
    return (
      <div className="row mt-3 mt-md-0">
        <div className="container-fluid">
          <div className="cand-bill-ratee global-action-grid">
            <Grid
              style={{ height: "auto" }}
              sortable={true}
              onDataStateChange={this.onDataStateChange}
              pageable={{ pageSizes: true }}
              data={this.state.data}
              {...initialDataState}
              detail={ViewMoreComponent}
              expandField="expanded"
              total={this.state.totalCount}
              className="kendo-grid-custom lastchild"
              selectedField="selected"
              onSelectionChange={this.selectionChange}
              onHeaderSelectionChange={this.headerSelectionChange}
            >
              <GridNoRecords>
                {GridNoRecord(this.state.showLoader)}
              </GridNoRecords>
              {this.props.statusIntId < CandSubStatusIds.ASSIGNMENTCREATED && (
                <GridColumn
                  field="selected"
                  width="100px"
                  headerSelectionValue={
                    this.state.data &&
                    this.state.data.findIndex(
                      (dataItem) => dataItem.selected ==false
                    ) ==-1
                  }
                />
              )}
              <GridColumn
                field="round"
                title="Round"
                width="60px"
                cell={(props) => NumberCell(props, "Round")}
              />
              <GridColumn
                field="hiringManager"
                title="Interviewer"
                cell={(props) => CellRender(props, "Interviewer")}
              />
              <GridColumn
                field="title"
                title="Title"
                cell={(props) => CellRender(props, "Title")}
              />
              <GridColumn
                field="medium"
                title="Medium"
                cell={(props) => CellRender(props, "Medium")}
              />
              <GridColumn
                field="interviewDate"
                filter="date"
                format="{0:d}"
                editor="date"
                title="Interview Date"
                cell={(props) => CellRender(props, "Interview Date")}
              />
              <GridColumn
                title="Overall Rating"
                sortable={false}
                cell={(props) => {
                  return (<td contextMenu="Overall Rating" className="p-0">
                    <div  className="change-rating-color change-rating-color-margin-top">
                      <Rating value={props.dataItem.rating} disabled />
                    </div>
                    </td>
                  );
                }}
                headerCell={this.CustomHeaderActionCellTemplate}
              />
              <GridColumn
                field="notes"
                title="Notes"
                cell={(props) => CellRender(props, "Notes")}
              />
              <GridColumn
                field="status"
                width="180px"
                title="Status"
                cell={CandidateInterviewStatusCell}
              />
              <GridColumn
                title=""
                width="60px"
                sortable={false}
                cell={(props) => (
                  <RowActions
                    dataItem={props.dataItem}
                    currentState={""}
                    rowId={this.props.CandidateSubmissionId}
                    handleClick={this.handleActionClick}
                    defaultActions={DefaultActions(props, this.props.reqId)}
                  />
                )}
                headerCell={() =>
                  CustomeHeaderCell(
                    this.state.data,
                    this.state.CandidateSubmissionId,
                    this.state.enableCancelInterview,
                    () => {
                      this.setState({
                        showCancelSelectedInterviewsModal: true,
                      });
                    },
                    this.props.statusIntId
                  )
                }
              />
              <GridColumn
                sortable={false}
                width="100px"
                field="expanded"
                title="View More"
                cell={this.ExpandCell}
              />
            </Grid>
          </div>
        </div>
        <ConfirmationModal
          message={REMOVE_INTERVIEW_CONFIRMATION_MSG}
          showModal={this.state.showRemoveModal}
          handleYes={this.removeInteviewRound}
          handleNo={() => {
            this.setState({ showRemoveModal: false });
          }}
        />
        <ConfirmationModal
          message={CANCEL_INTERVIEW_CONFIRMATION_MSG}
          showModal={this.state.showCancelInterviewModal}
          handleYes={this.cancelInteviewRound}
          handleNo={() => {
            this.setState({ showCancelInterviewModal: false });
          }}
        />
        <ConfirmationModal
          message={RESEND_TO_VENDOR_INTERVIEW_CONFIRMATION_MSG}
          showModal={this.state.showResendToVendorModal}
          handleYes={this.resendToVendor}
          handleNo={() => {
            this.setState({ showResendToVendorModal: false });
          }}
        />
        <ConfirmationModal
          message={CANCEL_INTERVIEW_CONFIRMATION_MSG}
          showModal={this.state.showCancelSelectedInterviewsModal}
          handleYes={this.candidateStatusUpdate}
          handleNo={() => {
            this.setState({ showCancelSelectedInterviewsModal: false });
          }}
        />
      </div>
    );
  }

  getInterviewsCount = (dataState, candSubId: string) => {
    var finalState: State = {
        ...dataState,
        take: null,
        skip: 0,
    };

    var queryStr = `${toODataString(finalState, { utcDates: true })}`;
    var queryParams = this.candidateQuery(candSubId);

    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

    axios.get(`api/candidates/candsubinterview?${finalQueryString}`).then((res) => {
        this.setState({
            totalCount: res.data.length,
        });
    });
};

  private shouldSubmitSelectedBtnEnable(candidateInterviewRoundList) {
    this.setState({ enableCancelInterview: false });
    var selectedRounds = candidateInterviewRoundList.filter((o) => o.selected);

    var selectedCandidatesForCancellation = selectedRounds.filter(
      (o) =>
        o.statusIntId==CandSubInterviewStatusIds.PENDINGCONFIRMATION ||
        o.statusIntId==CandSubInterviewStatusIds.SCHEDULED ||
        o.statusIntId==CandSubInterviewStatusIds.RESCHEDULED
    );

    if (
      selectedCandidatesForCancellation.length > 0 &&
      selectedRounds.length > 0
    ) {
      if (selectedCandidatesForCancellation.length==selectedRounds.length) {
        this.setState({ enableCancelInterview: true });
      }
    }
  }
}
export default AllRoundResultView;
