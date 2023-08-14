import * as React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { faTimesCircle, faClock,faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PageTitle from "../../../Shared/Title";
import CandidateInformation from "../../../Shared/CandidateInformation/CandidateInformation";
import Collapsible from "react-collapsible";
import SkeletonWidget from "../../../Shared/Skeleton";
import { candTriggerName } from "../../../ReusableComponents";
import { dateFormatter, history, successToastr } from "../../../../HelperMethods";
import  CandidateVendorMapping from "./CandidateVendorMapping"
import FormActions from "../../../Shared/Workflow/FormActions";
import RejectModal from "../../../Shared/RejectModal";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { CAND_SHARE_APPROVE_CONFIRMATION_MSG, CAND_SHARE_APPROVE_SUCCESS_MSG, CAND_SHARE_REJECTED_SUCCESS_MSG,CAND_SHARE_RESET_SUCCESS_MSG, PENDING_APPROVAL_STATUS, REJECT_CAND_SHARE_CONFIRMATION_MSG,CAND_SHARE_RESET_CONFIRMATION_MSG} from "../../../Shared/AppMessages";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord, StatusCell } from "../../../Shared/GridComponents/CommonComponents";
import ColumnMenu from "../../../Shared/GridComponents/ColumnMenu";


export interface ApproveCandidateShareProps {
    candidateId:any;
    match: any;
}

export interface ApproveCandidateShareState {
  reqId: string;
  location: string;
  showLoader?: boolean;
  openCommentBox?: boolean;
  candidateId?: string;
  vendorId?:string;
  candShareRequestId?:string;
  status?: string;
  showCandidateOwnershipModal?: boolean;
  toggelFirst: boolean;
  toggleSecond: boolean;
  toggleThird: boolean;
  showResetModal?:boolean;
  showRejectModal?: boolean;
  showApproveModal?: boolean;
  requestor?:string;
  requestDate?:string;
  requestDeatils?:any []
}

class ApproveCandidateShare extends React.Component<ApproveCandidateShareProps,ApproveCandidateShareState> {
  statusId: any;eventName: any;actionId: any;action: any;
  constructor(props: ApproveCandidateShareProps) {
    super(props);
    this.state = {
      reqId: "",
      location: "",
      toggelFirst: true,
      toggleSecond: true,
      toggleThird:true,
      requestDeatils:[]
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.setState({ candShareRequestId: id },()=>{this.getCandidateShareDetails(id);});
    
  }
  async getCandidateShareDetails(candShareRequestId) {
    this.setState({ showLoader: true, status: "" });
    await axios
      .get(`api/candidates/share/workflow/${candShareRequestId}`)
      .then((res) => {
        this.setState({
          status: res.data.status,
          candidateId: res.data.candidateId,
          vendorId:res.data.vendorId,
          requestor : res.data.actionBy,
          requestDate : res.data.actionDate,
          requestDeatils : [{requestedBy:res.data.vendorName, requestDate:res.data.createdDate, status:res.data.status, actionBy:res.data.actionBy,actionDate:res.data.actionDate}],
          showLoader: false
        });
        
      });
  }
  onCollapseOpen = () => {
    this.setState({
      toggelFirst: true,
      toggleSecond: true,
      toggleThird: true,
    });
  };

  onCollapseClose = () => {
    this.setState({
      toggelFirst: false,
      toggleSecond: false,
      toggleThird: false
    });
  };
  handleActionClick = (action, nextStateId?, eventName?, actionId?) => {
    this.statusId = nextStateId;
    this.eventName = eventName;
    this.actionId = actionId;
    this.action = action;
    let change = {};
    let property = `show${action.replace(/ +/g, "")}Modal`;
    change[property] = true;
    this.setState(change);
};

  render() {
    const {
      toggelFirst,
      toggleSecond,
      toggleThird
    } = this.state;
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3">
          <div className="col-12 p-0 shadow pt-1 pb-1">
            <PageTitle
              title="Candidate Share Request" candShareRequestId = {this.state.candShareRequestId}
            />
            <div className="col-12">
              <Collapsible
                trigger={candTriggerName(
                  "Candidate Information"
                )}
                  open={toggelFirst}
                  onTriggerOpening={() => this.setState({ toggelFirst: true })}
                  onTriggerClosing={() => this.setState({ toggelFirst: false })}
              >
                {this.state.showLoader && <SkeletonWidget />}
                {!this.state.showLoader &&
                  this.state.candidateId && (
                    <CandidateInformation
                      candidateId={this.state.candidateId}
                      location={this.state.location}
                    />
                  )}
              </Collapsible>
              <Collapsible
                trigger={candTriggerName(
                  "Associated Vendors"
                )}
                  open={toggleSecond}
                  onTriggerOpening={() => this.setState({ toggleSecond: true })}
                  onTriggerClosing={() => this.setState({ toggleSecond: false })}
              >
                {this.state.candidateId && 
                <CandidateVendorMapping candidateId={this.state.candidateId} vendorId={this.state.vendorId}></CandidateVendorMapping>
                }
                  
              </Collapsible>
              <Collapsible className="mt-2"
                trigger={candTriggerName(
                  "Request Details"
                )}
                  open={toggleThird}
                  onTriggerOpening={() => this.setState({ toggleThird: true })}
                  onTriggerClosing={() => this.setState({ toggleThird: false })}
              >
                <div className="row">
                  <div className="col-12">
                      <div className="myOrderContainer gridshadow global-action-grid-onlyhead">
                          <Grid
                              style={{ height: "auto" }}
                              data={this.state.requestDeatils}
                              className="kendo-grid-custom lastchild "
                          >
                              <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                              
                              <GridColumn
                                  field="requestedBy"
                                  title="Requested By"
                                  cell={(props) => CellRender(props, "Requested By")}
                                  columnMenu={ColumnMenu}
                              />
                            
                              <GridColumn
                                  field="requestDate"
                                  title="Request Date"
                                  columnMenu={ColumnMenu}
                                  cell={(props) => {
                                      return (
                                          <td contextMenu={"Request Date"}
                                              className="pr-3"
                                              title={props.dataItem.requestDate}
                                          >
                                              {props.dataItem.requestDate ? dateFormatter(props.dataItem.requestDate) : "-"}
                                          </td>
                                      );
                                  }}
                                  //cell={(props) => CellRender(props, "Share Date")}
                              />
                              <GridColumn
                                  field="actionBy"
                                  title="Action By"
                                  cell={(props) => CellRender(props, "Action By")}
                                  columnMenu={ColumnMenu}
                              />
                            
                              <GridColumn
                                  field="actionDate"
                                  title="Action Date"
                                  columnMenu={ColumnMenu}
                                  cell={(props) => {
                                      return (
                                          <td contextMenu={"Action Date"}
                                              className="pr-3"
                                              title={props.dataItem.requestDate}
                                          >
                                              {props.dataItem.requestDate ? dateFormatter(props.dataItem.requestDate) : "-"}
                                          </td>
                                      );
                                  }}
                                  //cell={(props) => CellRender(props, "Share Date")}
                              />
                              <GridColumn field="status" 
                              headerClassName="text-left"
                              width="270px" title="Status" columnMenu={ColumnMenu} cell={StatusCell} />
                          </Grid>
                          
                      </div>
                  </div>
                </div>
              </Collapsible>
            </div>
          </div>
        </div>
        {this.state.status && 
          <FormActions
              cancelUrl={`/cand/share/manage`}
              wfCode="WF_CAND_SHARE"
              currentState={this.state.status}
              handleClick={this.handleActionClick}
              handleClose={() => history.goBack()}
          />
        }
        
        {this.state.showRejectModal && this.actionId && (
                    <RejectModal
                        action="Reject"
                        actionId={this.actionId}
                        message={REJECT_CAND_SHARE_CONFIRMATION_MSG(null)}
                        showModal={this.state.showRejectModal}
                        handleYes={(data) => this.shareRequestStatusUpdate(CAND_SHARE_REJECTED_SUCCESS_MSG, "showRejectModal", data)}
                        handleNo={() => {
                            this.setState({ showRejectModal: false });
                        }}
                    />
          )}

                <ConfirmationModal
                    message={CAND_SHARE_APPROVE_CONFIRMATION_MSG}
                    showModal={this.state.showApproveModal}
                    handleYes={(e) => this.shareRequestStatusUpdate(CAND_SHARE_APPROVE_SUCCESS_MSG, "showApproveModal")}
                    handleNo={() => {
                        this.setState({ showApproveModal: false });
                    }}
                />

                <ConfirmationModal
                    message={CAND_SHARE_RESET_CONFIRMATION_MSG}
                    showModal={this.state.showResetModal}
                    handleYes={(e) => this.shareRequestStatusUpdate(CAND_SHARE_RESET_SUCCESS_MSG, "showResetModal")}
                    handleNo={() => {
                        this.setState({ showResetModal: false });
                    }}
                />
      </React.Fragment>
    );
  }
  
  shareRequestStatusUpdate(successMsg, modal, props?) {
    this.setState({ showLoader: true });
        const data = {
            //candSubmissionIds: this.state.selectedIds,
            candShareRequestId: this.state.candShareRequestId,
            statusId: this.statusId,
            action :this.action,
            eventName: this.eventName,
            ...props,
        };
        axios.put("api/candidates/share/workflow", JSON.stringify(data)).then((res) => {
            successToastr(successMsg);
            //this.getCandidateWFs(this.state.dataState);
            this.setState({ showLoader: false });
            history.push('/cand/share/manage');
            
        });
        let change = {};
        change[modal] = false;
        this.setState(change);
  }
}

export default ApproveCandidateShare;
