import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import {
  CellRender,
  GridNoRecord,
  CandidateStatusCell,
} from "../../Shared/GridComponents/CommonComponents";
import {
  DELETED_CANDIDATE_SUCCESS_MSG,
  DELEGATE_CANDIDATE_SUCCESS_MSG,
  WITHDRAW_CANDIDATE_SUCCESS_MSG,
  SELECTED_SUBMITTED_CANDIDATE_SUCCESS_MSG,
  DELGATE_CONFIRMATION_MSG,
  NAME_CLEARED_CANDIDATE_SUCCESS_MSG,
  NAME_NOT_CLEARED_CANDIDATE_SUCCESS_MSG,
  CLEAR_RISK_CONFIRMATION_MSG,
  RISK_REJECTED_SUCCESS_MSG,
  RISK_CLEARED_SUCCESS_MSG,
  PRESENTATION_HIRING_SUBMIT_SUCCESS_MSG,
  REQUEST_INTERVIEW_SUCCESS_MSG,
  NAME_CLEAR_CONFIRMATION_MSG,
  NAME_NOT_CLEAR_CONFIRMATION_MSG,
  REJECT_RISK_CONFIRMATION_MSG,
  SUBMIT_PRESENTATION_CONFIRMATION_MSG,
  REQUEST_BATCH_INTERVIEW_CONFIRMATION_MSG,
  WITHDRAW_CANDIDATE,
  REMOVE_CANDIDATE_SUBMISSION,
  REJECT_PRESENTATION_CONFIRMATION_MSG,
  PRESENTATION_REJECTED_SUCCESS_MSG,
  REQUEST_INTERVIEW_CONFIRMATION_MSG,
  REJECT_CANDIDATE,
  REJECT_CANDIDATE_SUCCESS_MSG,
  CANCEL_INTERVIEW_CONFIRMATION_MSG,
  INTERVIEW_CANCELLED_SUCCESS_MSG,
  SUBMIT_TO_VENDOR_SUCCESS_MSG,
  REJECT_OFFER,
  ACCEPT_OFFER_MSG,
  BILL_RATE_EXPENSE_PENDING,
  REQUEST_SUBMIT_SELECTED_CONFIRMATION_MSG,
  REQUEST_AN_OFFER_CONFIRMATION_MSG,
  REQUEST_AN_OFFER_SUCCESS_MSG,
  REJECT_ASSIGNMENT,
} from "../../Shared/AppMessages";
import {
  CandSubStatusIds,
  CandSubInterviewStatusIds,
  CandidateWorkflow,
  CandidateWorkflowActions,
  isRoleType,
  AuthRoleType,
} from "../../Shared/AppConstants";
import { Grid, GridCellProps, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import {
  State,
  toODataString,
} from "@progress/kendo-data-query";
import {
  CustomMenu,
  DetailColumnCell,
  ViewMoreComponent,
  CandNameCell,
} from "./WFCells";
import {
  NumberCell,
  PhoneNumberCell,
  KendoFilter,
} from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import "./CandidateWF.css";
import PageTitle from "../../Shared/Title";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import {
  successToastr,
  errorToastr,
  initialDataState,
} from "../../../HelperMethods";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import RowActions from "../../Shared/Workflow/RowActions";
import { DefaultActions } from "./WFCells";
import NameClearConfirmationModal from "../../Shared/NameClearConfirmationModal";
import CandStatusBar from "../../Shared/CandStatusCard/CandStatusBar";
import { Dialog } from "@progress/kendo-react-dialogs";
import RejectModal from "../../Shared/RejectModal";
import { CandNumberCell } from "../ManageCandidateSubmission/CandidateCells";

export interface CandidateWFsProps {
  match?: any;
  reqId?: any;
}

export interface CandidateWFsState {
  search: string;
  data: any;
  totalCandSubData: any;
  clientId: string;
  vendorId: string;
  reqId: string;
  reqNo: string;
  dataState: any;
  showLoader?: boolean;
  totalCount?: number;
  showRemoveModal?: boolean;
  showNameClearModal?: boolean;
  showNameNotClearModal?: boolean;
  showDelegateNameClearModal?: boolean;
  showWithdrawModal?: boolean;
  showRejectCandidateModal?: boolean;
  showRejectRiskModal?: boolean;
  showClearRiskModal?: boolean;
  showRejectPresentationModal?: boolean;
  showSubmitToHiringManagerModal?: boolean;
  showRequestAnInterviewModal?: boolean;
  selectedIds: any;
  showsubmitSelectedCandidateModal?: boolean;
  enableSelected?: boolean;
  enableBatchSelected?: boolean;
  enableBatchInterviewSelected?: boolean;
  showBatchInterviewModal?: boolean;
  nameClearNoFee?: any;
  showCandidateStatusModal?: boolean;
  showBatchSubmissionModal?: boolean;
  showCancelInterviewModal?: boolean;
  showSubmitSelectedModal?: boolean;
  onFirstLoad: boolean;

  showRejectOfferModal?: boolean;
  showAcceptOfferModal?: boolean;
  showRejectModal?: boolean;
  showReadyforOfferModal?: boolean
}

class CandidateWFs extends React.Component<
  CandidateWFsProps,
  CandidateWFsState
> {
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  public candSubmissionId: string;
  public dataItem: any;
  public isVendorRole: any;
  constructor(props: CandidateWFsProps) {
    super(props);
    this.state = {
      search: "",
      data: [],
      totalCandSubData: [],
      dataState: initialDataState,
      selectedIds: [],
      clientId: auth.getClient(),
      vendorId: auth.getVendor(),
      reqId: "",
      reqNo: "",
      onFirstLoad: true,
      showLoader: true,
    };
    this.isVendorRole = isRoleType(AuthRoleType.Vendor);
  }
  action: string;
  statusId: string;
  eventName: string;
  actionId: string;
  componentDidMount() {
    if(this.props.match)
    {
      const { id } = this.props.match.params;
      this.setState({ reqId: id });
    }
    // if (id) {
    //   this.getReqNo(id);
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match && this.props.match && nextProps.match.path != this.props.match.path) {
      this.setState({ reqId: nextProps.match.params.id }, () => this.getCandidateWFs(this.state.dataState));
    }
    if (this.props.reqId != null) {
      this.setState({ reqId: this.props.reqId }, () => this.getCandidateWFs(this.state.dataState));
    }
  }

  getCandidateWFs = (dataState) => {
    let reqId = this.state.reqId;
    this.setState({ showLoader: true, onFirstLoad: false, data: [] });
    var queryStr = `${toODataString(dataState)}`;

    var queryParams = this.candidateQuery(reqId);

    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

    axios.get(`api/candidates/workflow?${finalQueryString}`).then((res) => {
      this.setState({
        data: res.data,
        showLoader: false,
        dataState: dataState
      });
      this.getCandidateWFsCount(dataState, reqId);
      this.shouldSubmitSelectedBtnEnable(this.state.data);
    });
  };

  removeCandSubmission = () => {
    this.setState({ showRemoveModal: false, showLoader: true });
    axios
      .delete(`/api/candidates/workflow/${this.candSubmissionId}`)
      .then((res) => {
        successToastr(DELETED_CANDIDATE_SUCCESS_MSG);
        this.getCandidateWFs(this.state.dataState);
        this.setState({ showLoader: false });
      }, (err) => {
        this.getCandidateWFs(this.state.dataState);
        this.setState({ showLoader: false });
      });
  };

  submitSelectedCandidate = () => {
    this.setState({ showLoader: true });
    const data = {
      statusIntId: CandSubStatusIds.PENDINGSUBMISSION,
      actionType: "MultipleCandidateSubmission",
    };

    this.candidateStatusUpdate(
      SELECTED_SUBMITTED_CANDIDATE_SUCCESS_MSG,
      "showSubmitSelectedModal",
      data
    );
  };

  submitBatchCandidate = (props) => {
    this.setState({ showLoader: true });
    const data = {
      statusIntId: CandSubStatusIds.VENDORPRESENTATIONSUBMITTED,
      actionType: "BatchSubmission",
      ...props,
    };

    this.candidateStatusUpdate(
      PRESENTATION_HIRING_SUBMIT_SUCCESS_MSG,
      "showBatchSubmissionModal",
      data
    );
  };

  requestBatchInterviews = (props) => {
    this.setState({ showLoader: true });
    const data = {
      statusIntId: CandSubStatusIds.PENDINGFORCLIENTPRESENTATION,
      actionType: "RequestBatchInterviews",
      ...props,
    };

    this.candidateStatusUpdate(
      PRESENTATION_HIRING_SUBMIT_SUCCESS_MSG,
      "showBatchInterviewModal",
      data
    );
  };

  openModal = (prop, candSubmissionId) => {
    let change = {};
    change[prop] = true;
    this.setState(change);
    this.candSubmissionId = candSubmissionId;
  };

  expandChange = (dataItem) => {
    dataItem.expanded = !dataItem.expanded;
    this.forceUpdate();
  };

  onDataStateChange = (changeEvent) => {
    // this.setState({ dataState: changeEvent.data });
    this.getCandidateWFs(changeEvent.data);
    localStorage.setItem("CandidateWF-GridDataState", JSON.stringify(changeEvent.data));
  };

  selectionChange = (event) => {
    var checked = event.syntheticEvent.target.checked;

    let ids = this.state.selectedIds;
    const data = this.state.data.map((item) => {
      if (item.candSubmissionId ==event.dataItem.candSubmissionId) {
        item.selected = !event.dataItem.selected;

        if (
          item.statusIntId==CandSubStatusIds.PENDINGSUBMISSION ||
          item.statusIntId==CandSubStatusIds.VENDORPRESENTATIONSUBMITTED ||
          item.statusIntId==CandSubStatusIds.PENDINGFORCLIENTPRESENTATION
        ) {
          if (checked==true) {
            ids.push(item.candSubmissionId);
          } else if (checked==false) {
            ids = ids.filter((o) => o !=item.candSubmissionId);
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
          item.statusIntId==CandSubStatusIds.PENDINGSUBMISSION ||
          item.statusIntId==CandSubStatusIds.VENDORPRESENTATIONSUBMITTED ||
          item.statusIntId==CandSubStatusIds.PENDINGFORCLIENTPRESENTATION
        ) {
          ids.push(item.candSubmissionId);
        }
      }
      item.selected = checked;
      return item;
    });
    this.shouldSubmitSelectedBtnEnable(this.state.data);
    this.setState({ data, selectedIds: ids });
  };

  candidateStatusUpdate = (successMsg, modal, props?) => {
    this.setState({ showLoader: true, data: [] });
    const data = {
      candSubmissionIds: this.state.selectedIds,
      candSubmissionId: this.candSubmissionId,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      ...props,
    };
    axios
      .put("api/candidates/workflow/status", JSON.stringify(data))
      .then((res) => {
        successToastr(successMsg);
        this.getCandidateWFs(this.state.dataState);
        this.setState({ showLoader: false });
      }, (err) => {
        this.getCandidateWFs(this.state.dataState);
        this.setState({ showLoader: false });
      });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  candidateTaskUpdate = (successMsg, modal, props?) => {
    this.setState({ showLoader: true });
    const data = {
      candSubmissionId: this.candSubmissionId,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
      ...props,
    };
    axios
      .put("api/candidates/candsubonboardingtask/status", JSON.stringify(data))
      .then((res) => {
        successToastr(successMsg);
        this.getCandidateWFs(this.state.dataState);
        this.setState({ showLoader: false });
      }, (err) => {
        this.getCandidateWFs(this.state.dataState);
        this.setState({ showLoader: false });
      });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
  };

  validateBillRates = async (id) => {
    var isValid = true;
    await axios
      .get(`api/candidates/billrate?$filter=candSubId eq ${id}`)
      .then((res) => {
        console.log("data from bill rate", res.data)
        if (
          res.data.filter((x) => x.status=="Pending Approval").length > 0 ||
          res.data.filter((x) => x.status=="Pending Negotiation").length > 0
        ) {
          isValid = true;
        }
      });
    return isValid;
  };

  // dynamic action click
  handleActionClick = async (
    action,
    actionId,
    rowId,
    nextStateId?,
    eventName?,
    dataItem?
  ) => {
    if (
      action==CandidateWorkflowActions.SUBMIT_TO_HIRING_MANAGER &&
      !(await this.validateBillRates(rowId))
    ) {
      this.setState({ showLoader: true });
      errorToastr(BILL_RATE_EXPENSE_PENDING);
    } else {
      let change = {};
      let property = `show${action.replace(/ +/g, "")}Modal`;
      change[property] = true;
      this.setState(change);
      this.action = action;
      this.actionId = actionId;
      this.statusId = nextStateId;
      this.eventName = eventName;
      this.candSubmissionId = rowId;
      this.dataItem = dataItem;
    }
  };

  cancelInteviewRound = (successMsg, modal, props?) => {
    this.setState({ showCancelInterviewModal: false, showLoader: true });
    let ids = [];
    ids.push(this.dataItem.interviewId);
    const data = {
      CandSubInterviewIds: ids,
      CandSubmissionId: this.candSubmissionId,
      StatusIntId: CandSubInterviewStatusIds.CANCELLED,
      statusId: this.statusId,
      eventName: this.eventName,
      actionId: this.actionId,
    };
    axios
      .put(`api/candidates/candsubinterview/status`, JSON.stringify(data))
      .then((res) => {
        successToastr(INTERVIEW_CANCELLED_SUCCESS_MSG);
        this.getCandidateWFs(this.state.dataState);
        this.setState({ showLoader: false });
      }, (err) => {
        this.getCandidateWFs(this.state.dataState);
        this.setState({ showLoader: false });
      });
  };

  ExpandCell = (props) => (
    <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />
  );

  MyCustomCell = (props: GridCellProps) => (
    <RowActions {...props} wfCode={CandidateWorkflow.CANDIDATE}
      props={props}
      key={props.dataItem.candSubmissionId}
      dataItem={props.dataItem}
      currentState={props.dataItem.status}
      jobWfTypeId={props.dataItem.jobWfTypeId}
      entityId={props.dataItem.candSubmissionId}
      rowId={props.dataItem.candSubmissionId}
      handleClick={this.handleActionClick}
      defaultActions={DefaultActions(props, this.isVendorRole)} />
  );

  render() {
    return (
      <div className= {this.props.reqId ? "col-12 pl-0 pr-0": "col-11 mx-auto pl-0 pr-0"}>
        {this.props.reqId==null &&
        <PageTitle
          title="Submitted Candidates"
          requisitionId={this.state.reqId}
          reqNumber={null}
          pageUrl={`/requisitions/view/${this.state.reqId}`}
        />
        }
        <div className={this.props.reqId ? "container-fluid px-0" : "container-fluid"}>
        {this.props.reqId==null &&
          <CompleteSearch
            page="CandidateWF"
            entityType="Candidate"
            handleSearch={this.getCandidateWFs}
            onFirstLoad={this.state.onFirstLoad}
            persistSearchData={true}
          />
        }
          <div className="candidateWFContainer" id="CandidateWF-Responsive">
            <Grid
              style={{ height: "auto" }}
              sortable={true}
              onDataStateChange={this.onDataStateChange}
              pageable={{ pageSizes: true }}
              data={this.state.data}
              {...this.state.dataState}
              detail={ViewMoreComponent}
              expandField="expanded"
              total={this.state.totalCount}
              className="kendo-grid-custom lastchild table_responsive-TABcandidates frozen-column"
              selectedField="selected"
              onSelectionChange={this.selectionChange}
              onHeaderSelectionChange={this.headerSelectionChange}
            >
              <GridNoRecords>
                {GridNoRecord(this.state.showLoader)}
              </GridNoRecords>
              <GridColumn
                field="selected"
                width="40px"
                headerSelectionValue={
                  this.state.data &&
                  this.state.data.findIndex(
                    (dataItem) => dataItem.selected ==false
                  ) ==-1
                }
              />
              <GridColumn
                field="reqNumber"
                width="150px"
                title="Req#"
                cell={CandNumberCell}
                columnMenu={ColumnMenu}
              />
              {!isRoleType(AuthRoleType.Vendor) &&
                <GridColumn
                  field="vendor"
                  width="150px"
                  title="Vendor"
                  cell={(props) => CellRender(props, "Vendor")}
                  columnMenu={ColumnMenu}
                />
              }
              <GridColumn
                field="candidateName"
                width={150}
                title="Candidate Name"
                cell={CandNameCell}
                columnMenu={ColumnMenu}
              />
              <GridColumn
                field="location"
                title="Location"
                width={150}
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Location")}
              />              
              <GridColumn
                field="presentationDate"
                width="130px"
                filter="date"
                format="{0:d}"
                editor="date"
                title="Presented On"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Presented On")}
              />

              {isRoleType(AuthRoleType.Vendor) &&
                <GridColumn
                  field="npi"
                  width="120px"
                  title="NPI#"
                  columnMenu={ColumnMenu}
                  cell={(props) => CellRender(props, "NPI#")}
                />
              }
              {/* <GridColumn
                field="email"
                title="Email ID"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Email ID")}
              /> */}
              <GridColumn
                field="submittedOn"
                width="130px"
                filter="date"
                format="{0:d}"
                editor="date"
                title="Submitted On"
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "Submitted On")}
              />
              {/* <GridColumn
                field="openDays"
                width="130px"
                filter="numeric"
                title="Open Days"
                columnMenu={ColumnMenu}
                sortable={true}
                cell={(props) => NumberCell(props, "Open Days")}
              /> */}
              <GridColumn
                field="city"
                title="City"
                width={150}
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "City")}
              />
              <GridColumn
                field="state"
                title="State"
                width={150}
                columnMenu={ColumnMenu}
                cell={(props) => CellRender(props, "State")}
              />
              <GridColumn
                locked
                field="status"
                width="240px"
                title="Status"
                columnMenu={ColumnMenu}
                cell={CandidateStatusCell}
              />
              <GridColumn
                locked
                title="Action"
                headerClassName="tab-action"
                sortable={false}
                width="30px"
                cell={this.MyCustomCell}
                headerCell={() =>
                  CustomMenu(
                    this.state.totalCandSubData,
                    this.state.reqId,
                    this.userObj.role,
                    () => {
                      this.setState({ showSubmitSelectedModal: true });
                    },
                    this.state.enableSelected,
                    this.state.enableBatchSelected,
                    () => {
                      this.setState({ showBatchSubmissionModal: true });
                    },
                    this.state.enableBatchInterviewSelected,
                    () => {
                      this.setState({ showBatchInterviewModal: true });
                    }
                  )
                }
              />
              <GridColumn
                locked
                sortable={false}
                field="expanded"
                title="View More"
                width="100px"
                cell={this.ExpandCell}
              />
            </Grid>
          </div>
        </div>
        <ConfirmationModal
          message={REMOVE_CANDIDATE_SUBMISSION}
          showModal={this.state.showRemoveModal}
          handleYes={this.removeCandSubmission}
          handleNo={() => {
            this.setState({ showRemoveModal: false });
          }}
        />
        <NameClearConfirmationModal
          message={NAME_CLEAR_CONFIRMATION_MSG}
          showModal={this.state.showNameClearModal}
          handleYes={(data) =>
            this.candidateStatusUpdate(
              NAME_CLEARED_CANDIDATE_SUCCESS_MSG,
              "showNameClearModal",
              data
            )
          }
          handleNo={() => {
            this.setState({ showNameClearModal: false });
          }}
          radioSelection={true}
          radioBtnYesTitle={"Name Clear"}
          radioBtnNoTitle={"Name Clear No Fee"}
        />
        {this.state.showNameNotClearModal && this.actionId && (
          <RejectModal
            actionId={this.actionId}
            message={NAME_NOT_CLEAR_CONFIRMATION_MSG(null)}
            showModal={this.state.showNameNotClearModal}
            handleYes={(data) =>
              this.candidateStatusUpdate(
                NAME_NOT_CLEARED_CANDIDATE_SUCCESS_MSG,
                "showNameNotClearModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showNameNotClearModal: false });
            }}
          />
        )}
        <ConfirmationModal
          message={DELGATE_CONFIRMATION_MSG}
          showModal={this.state.showDelegateNameClearModal}
          handleYes={() =>
            this.candidateStatusUpdate(
              DELEGATE_CANDIDATE_SUCCESS_MSG,
              "showDelegateNameClearModal"
            )
          }
          handleNo={() => {
            this.setState({ showDelegateNameClearModal: false });
          }}
        />
        {this.state.showWithdrawModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={WITHDRAW_CANDIDATE(
              this.dataItem ? this.dataItem.candidateName : null
            )}
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

        {this.state.showRejectCandidateModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={REJECT_CANDIDATE(
              this.dataItem ? this.dataItem.candidateName : null
            )}
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

        {this.state.showRejectRiskModal && this.actionId && (
          <RejectModal
            actionId={this.actionId}
            message={REJECT_RISK_CONFIRMATION_MSG}
            showModal={this.state.showRejectRiskModal}
            handleYes={(data) =>
              this.candidateStatusUpdate(
                RISK_REJECTED_SUCCESS_MSG,
                "showRejectRiskModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showRejectRiskModal: false });
            }}
          />
        )}
        <ConfirmationModal
          message={CLEAR_RISK_CONFIRMATION_MSG}
          showModal={this.state.showClearRiskModal}
          handleYes={(e) =>
            this.candidateStatusUpdate(
              RISK_CLEARED_SUCCESS_MSG,
              "showClearRiskModal"
            )
          }
          handleNo={() => {
            this.setState({ showClearRiskModal: false });
          }}
        />
        <ConfirmationModal
          message={REQUEST_SUBMIT_SELECTED_CONFIRMATION_MSG}
          showModal={this.state.showSubmitSelectedModal}
          handleYes={(data) => this.submitSelectedCandidate()}
          handleNo={() => {
            this.setState({ showSubmitSelectedModal: false });
          }}
        />
        <NameClearConfirmationModal
          message={SUBMIT_PRESENTATION_CONFIRMATION_MSG(null)}
          showModal={this.state.showBatchSubmissionModal}
          handleYes={(data) => this.submitBatchCandidate(data)}
          handleNo={() => {
            this.setState({ showBatchSubmissionModal: false });
          }}
          commentTitle={"Comments"}
          commentsRequired={true}
          enterComments={true}
          radioSelection={true}
          radioBtnTitle={"Send Mail To Hiring Manager"}
          radioBtnYesTitle={"Yes"}
          radioBtnNoTitle={"No"}
        />
        <NameClearConfirmationModal
          message={REQUEST_BATCH_INTERVIEW_CONFIRMATION_MSG}
          showModal={this.state.showBatchInterviewModal}
          handleYes={(data) => this.requestBatchInterviews(data)}
          handleNo={() => {
            this.setState({ showBatchInterviewModal: false });
          }}
          commentTitle={"Summary"}
          commentsRequired={true}
          enterComments={true}
        />
        {this.state.showRejectPresentationModal && this.actionId && (
          <RejectModal
            actionId={this.actionId}
            message={REJECT_PRESENTATION_CONFIRMATION_MSG(null)}
            showModal={this.state.showRejectPresentationModal}
            handleYes={(data) =>
              this.candidateStatusUpdate(
                PRESENTATION_REJECTED_SUCCESS_MSG,
                "showRejectPresentationModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showRejectPresentationModal: false });
            }}
          />
        )}

        <NameClearConfirmationModal
          message={SUBMIT_PRESENTATION_CONFIRMATION_MSG(null)}
          showModal={this.state.showSubmitToHiringManagerModal}
          handleYes={(data) =>
            this.candidateStatusUpdate(
              PRESENTATION_HIRING_SUBMIT_SUCCESS_MSG,
              "showSubmitToHiringManagerModal",
              data
            )
          }
          handleNo={() => {
            this.setState({ showSubmitToHiringManagerModal: false });
          }}
          commentTitle={"Summary"}
          commentsRequired={true}
          enterComments={true}
          radioSelection={true}
          radioBtnTitle={"Send Mail To Hiring Manager"}
          radioBtnYesTitle={"Yes"}
          radioBtnNoTitle={"No"}
        />
        <ConfirmationModal
          message={REQUEST_INTERVIEW_CONFIRMATION_MSG}
          showModal={this.state.showRequestAnInterviewModal}
          handleYes={(e) =>
            this.candidateStatusUpdate(
              REQUEST_INTERVIEW_SUCCESS_MSG,
              "showRequestAnInterviewModal"
            )
          }
          handleNo={() => {
            this.setState({ showRequestAnInterviewModal: false });
          }}
        />
        {this.state.showCandidateStatusModal && (
          <div id="hold-position">
            <Dialog className="col-12 width For-all-responsive-height">
              <CandStatusBar
                dataItem={this.dataItem}
                handleClose={() =>
                  this.setState({ showCandidateStatusModal: false })
                }
                statusLevel={1}
                candidateName={"Cand Name"}
              ></CandStatusBar>
            </Dialog>
          </div>
        )}
        <ConfirmationModal
          message={CANCEL_INTERVIEW_CONFIRMATION_MSG}
          showModal={this.state.showCancelInterviewModal}
          handleYes={(data) =>
            this.cancelInteviewRound(
              INTERVIEW_CANCELLED_SUCCESS_MSG,
              "showCancelInterviewModal",
              data
            )
          }
          handleNo={() => {
            this.setState({ showCancelInterviewModal: false });
          }}
        />
        {this.state.showRejectOfferModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={REJECT_OFFER(null)}
            showModal={this.state.showRejectOfferModal}
            handleYes={(data) =>
              this.candidateStatusUpdate(
                REJECT_CANDIDATE_SUCCESS_MSG,
                "showRejectOfferModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showRejectOfferModal: false });
            }}
          />
        )}
        {this.state.showRejectModal && this.actionId && (
          <RejectModal
            action={this.action}
            actionId={this.actionId}
            message={REJECT_ASSIGNMENT(null)}
            showModal={this.state.showRejectModal}
            handleYes={(data) =>
              this.candidateStatusUpdate(
                REJECT_CANDIDATE_SUCCESS_MSG,
                "showRejectModal",
                data
              )
            }
            handleNo={() => {
              this.setState({ showRejectModal: false });
            }}
          />
        )}
        <ConfirmationModal
          message={ACCEPT_OFFER_MSG}
          showModal={this.state.showAcceptOfferModal}
          handleYes={(e) =>
            this.candidateTaskUpdate(
              SUBMIT_TO_VENDOR_SUCCESS_MSG,
              "showAcceptOfferModal"
            )
          }
          handleNo={() => {
            this.setState({ showAcceptOfferModal: false });
          }}
        />
        <ConfirmationModal
          message={REQUEST_AN_OFFER_CONFIRMATION_MSG}
          showModal={this.state.showReadyforOfferModal}
          handleYes={(e) => this.candidateStatusUpdate(REQUEST_AN_OFFER_SUCCESS_MSG, "showReadyforOfferModal")}
          handleNo={() => {
            this.setState({ showReadyforOfferModal: false });
          }}
        />
      </div>
    );
  }

  // To be removed
  getCandidateWFsCount = (dataState, reqId: string) => {
    var finalState: State = {
      ...dataState,
      take: null,
      skip: 0,
    };

    var queryStr = `${toODataString(finalState)}`;
    var queryParams = this.candidateQuery(reqId);

    var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

    axios.get(`api/candidates/workflow?${finalQueryString}`).then((res) => {
      this.setState({
        totalCount: res.data.length,
        totalCandSubData: res.data,
      });
    });
  };

  private candidateQuery(reqId): string {
    var queryParams = `statusIntId ne ${CandSubStatusIds.ASSIGNMENTCREATED} and statusIntId ne ${CandSubStatusIds.ASSIGNMENTINPROGRESS} and statusIntId ne ${CandSubStatusIds.ASSIGNMENTEXTENDED}  and statusIntId ne ${CandSubStatusIds.ASSIGNMENTCOMPLETED}`;
    const { clientId, vendorId } = this.state;
    if (clientId) {
      queryParams += ` and clientId eq ${clientId}`
    }
    if (vendorId) {
      queryParams += ` and vendorId eq ${vendorId}`;
    }
    if (reqId) {
      queryParams += ` and reqId eq ${reqId}`
    }
    return queryParams;
  }

  private shouldSubmitSelectedBtnEnable(candidateList) {
    this.setState({
      enableSelected: false,
      enableBatchSelected: false,
      enableBatchInterviewSelected: false,
    });

    var selectedCandidates = candidateList.filter((o) => o.selected);

    var selectedCandidatesForSubmission = selectedCandidates.filter(
      (o) => o.statusIntId==CandSubStatusIds.PENDINGSUBMISSION
    );
    var selectedCandidatesForBatchSubmission = selectedCandidates.filter(
      (o) => o.statusIntId==CandSubStatusIds.VENDORPRESENTATIONSUBMITTED
    );
    var selectedCandidatesForBatchInterviewSubmission = selectedCandidates.filter(
      (o) => o.statusIntId==CandSubStatusIds.PENDINGFORCLIENTPRESENTATION
    );

    if (
      selectedCandidatesForSubmission.length > 0 &&
      selectedCandidates.length > 0
    ) {
      if (selectedCandidatesForSubmission.length==selectedCandidates.length) {
        this.setState({
          enableSelected: true,
        });
      }
    }

    if (
      selectedCandidatesForBatchSubmission.length > 0 &&
      selectedCandidates.length > 0
    ) {
      if (
        selectedCandidatesForBatchSubmission.length==selectedCandidates.length
      ) {
        this.setState({
          enableBatchSelected: true,
        });
      }
    }

    if (
      selectedCandidatesForBatchInterviewSubmission.length > 0 &&
      selectedCandidates.length > 0
    ) {
      if (
        selectedCandidatesForBatchInterviewSubmission.length ==
        selectedCandidates.length
      ) {
        this.setState({
          enableBatchInterviewSelected: true,
        });
      }
    }
  }
}

export default CandidateWFs;
