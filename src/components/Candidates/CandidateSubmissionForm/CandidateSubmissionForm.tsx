import React, { useRef } from "react";
import {
  dateFormatter,
  history,
  successToastr,
  warningToastr,
} from "../../../HelperMethods";
import axios from "axios";
import auth from "../../Auth";
import {
  faClock,
  faPlusCircle,
  faFilter,
  faUserLock,
  faTimesCircle,
  faCheckCircle,
  faLock
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comment } from "../../Shared/Comment/Comment";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import PageTitle from "../../Shared/Title";
import CandidateInformation from "../../Shared/CandidateInformation/CandidateInformation";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../Shared/withValueField";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import {
  SAVED_CANDIDATE_SUCCESS_MSG,
  SUBMIT_CANDIDATE_SUCCESS_MSG,
  VENDOR_NOT_ASSOCIATED,
} from "../../Shared/AppMessages";
import { CandidateWorkflow, CandidateWorkflowActions } from "../../Shared/AppConstants";
import Collapsible from "react-collapsible";
import { EntityType } from "../../Shared/AppConstants";
import FormActions from "../../Shared/Workflow/FormActions";
import { candTriggerName } from "../../ReusableComponents";
import { APP_HOME_URL, CAND_SUB_MANAGE_URL } from "../../Shared/ApiUrls";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { Popup } from "@progress/kendo-react-popup/dist/npm/Popup";
import ReactTooltip from "react-tooltip";
import SkeletonWidget from "../../Shared/Skeleton";
import { filterBy } from "@progress/kendo-data-query";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select Candidate Name", id: null };

export interface CandidateSubmissionFormProps {
  match: any;
}

export interface CandidateSubmissionFormState {
  candDetails?: any;
  openCommentBox?: boolean;
  candidates: Array<IDropDownModel>;
  filteredcandidates: Array<IDropDownModel>;
  data?: any;
  clientLobId: string;
  vendorId: string;
  reqNo: string;
  location: string;
  reqId: string;
  jobWfTypeId?: string;
  candSubmissionId?: string;
  candidateId: string;
  submittedVendorId: string;
  status: string;
  candSubDetails?: any;

  isJobTitleFilter: boolean;
  isJobCatFilter: boolean;
  isJobSkillFilter: boolean;
  isAvailablityFilter: boolean;
  show?: any;
  showLoader?: boolean;
}
const ref = React.createRef<CandidateInformation>();

export class CandidateSubmissionForm extends React.Component<
  CandidateSubmissionFormProps,
  CandidateSubmissionFormState
> {
  private userClientLobId: any = localStorage.getItem("UserClientLobId");
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  private anchor = null;
  constructor(props) {
    super(props);

    this.state = {
      candidates: [],
      filteredcandidates: [],
      clientLobId: this.userClientLobId,
      vendorId: auth.getVendor(),
      reqNo: "",
      location: "",
      reqId: "",
      candidateId: "",
      submittedVendorId: "",
      status: "",
      isJobTitleFilter: false,
      isJobCatFilter: false,
      isJobSkillFilter: false,
      isAvailablityFilter: false,
      show: false,
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const { subId } = this.props.match.params;
    this.setState({ candSubmissionId: subId });
    this.setState({ reqId: id });

    const { clientLobId } = this.state;
    this.getCandidates(id, false, false, false, false);
    this.getReqDetails(id);

    if (subId) {
      this.getCandidateSubmissionDetails(subId);
    }
  }

  getReqDetails(reqId: string) {
    axios
      .get(`api/requisitions/${reqId}?$filter=$select=reqNumber`)
      .then((res) => {
        this.setState({
          reqNo: res.data.reqNumber,
          location: res.data.location,
          jobWfTypeId: res.data.jobWfTypeId,
        });
      });
  }

  getCandidates(
    reqId: string,
    isJobTitleFilter,
    isJobCatFilter,
    isJobSkillFilter,
    isAvailablityFilter
  ) {

    this.setState({ candidates: [], candidateId: "", showLoader: true });
    axios
      .get(
        `api/candidates/dd?reqId=${reqId}&isJobTitleFilter=${isJobTitleFilter}&isJobCatFilter=${isJobCatFilter}&isJobSkillFilter=${isJobSkillFilter}&isAvailablityFilter=${isAvailablityFilter}`
      )
      .then((result) => {
        this.setState({ candidates: result.data, filteredcandidates: result.data, showLoader: false });
      });
  }

  // handling candidates dropdown change
  handleCandidateChange = (e) => {
    var candidateId = e.target.value;
    var isSubmissionEnable = e.value.isSubmissionEnable;
    var ownershipEndDate = e.value.ownershipEndDate;
    let candStatus = candidateId !=null && candidateId !=undefined ? "Pending Submission" : "";

    this.setState({ candidateId: candidateId, status: candStatus });
    if (ref.current) ref.current.getCandidateDetails(candidateId);
  };

  getCandidateSubmissionDetails(candSubmissionId) {
    axios.get(`api/candidates/workflow/${candSubmissionId}`).then((res) => {
      this.setState({
        candSubDetails: res.data,
        candidateId: res.data.candidateId,
        status: res.data.status,
        jobWfTypeId: res.data.jobWfTypeId,
      });
    });
  }

  saveCandidate = (action, nextStateId?) => {
    let data = { ...this.state, ...{ statusId: nextStateId } };
    const { reqId } = this.state;

    if (
      this.state.vendorId=="" ||
      this.state.vendorId==undefined ||
      this.state.vendorId==null
    ) {
      warningToastr(VENDOR_NOT_ASSOCIATED);
      // history.push(`${CAND_SUB_MANAGE_URL}${reqId}`);
      history.goBack()
    } else {
      data["isSubmit"] = action==CandidateWorkflowActions.SUBMIT ? true : false;
      const successMsg = data["isSubmit"]
        ? SUBMIT_CANDIDATE_SUCCESS_MSG
        : SAVED_CANDIDATE_SUCCESS_MSG;
      let httpVerb = data.candSubmissionId ? "put" : "post";
      axios[httpVerb]("api/candidates/workflow", JSON.stringify(data)).then(
        (res) => {
          successToastr(successMsg);
          if (auth.hasPermissionV2(AppPermissions.CANDIDATE_UPDATE)) {
            history.push(`${CAND_SUB_MANAGE_URL}`);
            // history.goBack()
          } else {
            window.location.href = APP_HOME_URL;
          }
        }
      );
    }
  };

  handleCandFilterChange = (e) => {
    let change = {};
    change[e.target.name] = e.target.checked;
    this.setState(change);
  };

  itemRender = (li, itemProps) => {
    const index = itemProps.index;
    const itemChildren = (
      <span>
        {li.props.children}{" "}
        {itemProps.dataItem.ownershipEndDate !=null &&
          new Date(itemProps.dataItem.ownershipEndDate) > new Date() && itemProps.dataItem.ownerVendorId !=this.state.vendorId ? (
          <>
            <span
              data-tip
              data-for={"candidateStatusTooltip" + index}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon
                icon={faUserLock}
                className={"mr-2"}
                color={"red"}
              />
            Ownership lock till {dateFormatter(new Date(itemProps.dataItem.ownershipEndDate))}
            </span>
            <ReactTooltip
              place={"bottom"}
              effect={"solid"}
              multiline={true}
              backgroundColor={"white"}
              type={"success"}
              border={true}
              className=""
              borderColor={"#FE988D"}
              textColor="black"
              id={"candidateStatusTooltip" + index}
            >
              Candidate submission is locked due to vendor ownership.
            </ReactTooltip>
          </>
        ) : itemProps.dataItem.ownershipEndDate==null && itemProps.dataItem.isSubmissionEnable==1 ? (
          <>
            <span
              data-tip
              data-for={"candidateStatusTooltip" + index}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon
                icon={faLock}
                className={"mr-2"}
                color={"red"}
              />
            Submit lock till {dateFormatter(new Date(itemProps.dataItem.submissionOpenDate))}
            </span>
            <ReactTooltip
              place={"bottom"}
              effect={"solid"}
              multiline={true}
              backgroundColor={"white"}
              type={"success"}
              border={true}
              className=""
              borderColor={"#FE988D"}
              textColor="black"
              id={"candidateStatusTooltip" + index}
            >
              Candidate submission is locked due to recent submit.
            </ReactTooltip>
          </>
        ) : (
          ""
        )}
      </span>
    );

    if (
      itemProps.dataItem.ownershipEndDate==null && itemProps.dataItem.isSubmissionEnable==1 ||
      (itemProps.dataItem.ownershipEndDate !=null &&
        new Date(itemProps.dataItem.ownershipEndDate) > new Date() && itemProps.dataItem.ownerVendorId !=this.state.vendorId)
    ) {
      const props = {
        ...li.props,
        className: "k-item k-state-disabled",
      };
      return React.cloneElement(li, props, itemChildren);
    }

    return React.cloneElement(li, li.props, itemChildren);
  };

  onPopUpClick = () => {
    this.setState({ show: !this.state.show });
  };

  onPopUpCloseClick = () => {
    this.setState({ show: false });
  };

  onPopUpResetClick = () => {
    this.setState({
      isJobTitleFilter: true,
      isJobCatFilter: true,
      isJobSkillFilter: true,
      isAvailablityFilter: true
    });

    this.getCandidates(
      this.state.reqId,
      true,
      true,
      true,
      true
    );
    this.setState({ show: false });
  };

  onPopUpOkClick = () => {
    const {
      isJobTitleFilter,
      isJobCatFilter,
      isJobSkillFilter,
      isAvailablityFilter,
    } = this.state;

    this.getCandidates(
      this.state.reqId,
      isJobTitleFilter,
      isJobCatFilter,
      isJobSkillFilter,
      isAvailablityFilter
    );
    this.setState({ show: false });
  };

  handleFilterChange(event) {
    var name = event.target.props.id;
    var originalArray = "filtered" + name;
    this.state[name] = this.filterData(event.filter, originalArray);
    this.setState(this.state);
  }

  filterData(filter, originalArray) {
    const originalData = this.state[originalArray];
    return filterBy(originalData, filter);
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3" id="remove_row">
          <div className="col-12 p-0 shadow pt-1 pb-1">
            <PageTitle
              title="Candidate Submission"
              reqNumber={this.state.reqNo}
              requisitionId={this.state.reqId}
              pageUrl={`/requisitions/view/${this.state.reqId}`}
              candSubmissionId={this.state.candSubmissionId}
            />
            <div className="col-12">
              <Collapsible
                trigger={candTriggerName(
                  "Candidate Information",
                  this.state.status
                )}
                open={true}
              >
                <div className={this.state.showLoader ? "x" : ""}>
                  {this.state.showLoader && (
                    <SkeletonWidget length={1} breadth={1} />
                  )}

                  <div className="row mb-4 align-items-center xy">
                    {!this.state.showLoader &&
                      !this.state.candSubmissionId &&
                      this.state.reqNo && (
                        <div className="col-6 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                          <label className="mb-1 font-weight-bold required as">
                            Candidate Name
                          </label>
                          <CustomDropDownList
                            name={`candidateId`}
                            id="candidates"
                            textField="name"
                            valueField="id"
                            defaultItem={defaultItem}
                            data={this.state.candidates}
                            itemRender={this.itemRender}
                            className="form-control disabled "
                            value={this.state.candidateId}
                            onChange={this.handleCandidateChange}
                            filterable={
                              this.state.filteredcandidates.length > 5
                                ? true
                                : false
                            }
                            onFilterChange={this.handleFilterChange}
                          />
                        </div>
                      )}
                    <div className="col-auto mt-sm-0  mt-1 pl-0">
                      <label className="marginbtn font-weight-bold required invisible d-block">
                        Candidate Name
                      </label>
                      {!this.state.candSubmissionId && this.state.reqNo && (
                        <div>
                          <button
                            className="btn button button-bg mr-2 shadow"
                            onClick={this.onPopUpClick}
                            ref={(button) => {
                              this.anchor = button;
                            }}
                          >
                            <FontAwesomeIcon icon={faFilter} />
                          </button>
                          <Popup
                            anchor={this.anchor}
                            show={this.state.show}
                            popupClass={"popup-content"}
                          >
                            <div className="p-2">
                              <label className="container-R d-flex mb-2">
                                <span className="font-weight-bold pl-1 left-filter_font-size">
                                  Job Category
                                </span>
                                <input
                                  type="checkbox"
                                  checked={this.state.isJobCatFilter}
                                  name="isJobCatFilter"
                                  onChange={(e) =>
                                    this.handleCandFilterChange(e)
                                  }
                                  className="mr-1"
                                />
                                <span className="checkmark-R checkPosition checkPositionTop left-filter"></span>
                              </label>
                              {/* <label className="pl-5 font-weight-bold">
                        Job Category
                        </label> */}
                              <label className="container-R d-flex mb-2">
                                <span className="font-weight-bold pl-1 left-filter_font-size">
                                  Job Title
                                </span>
                                <input
                                  type="checkbox"
                                  checked={this.state.isJobTitleFilter}
                                  name="isJobTitleFilter"
                                  onChange={(e) =>
                                    this.handleCandFilterChange(e)
                                  }
                                  className="mr-1"
                                />
                                <span className="checkmark-R checkPosition checkPositionTop left-filter"></span>
                              </label>
                              {/* <label className="pl-5 font-weight-bold">
                          
                        </label> */}
                              <label className="container-R d-flex mb-2">
                                <span className="font-weight-bold pl-1 left-filter_font-size">
                                  Availability
                                </span>
                                <input
                                  type="checkbox"
                                  checked={this.state.isAvailablityFilter}
                                  name="isAvailablityFilter"
                                  onChange={(e) =>
                                    this.handleCandFilterChange(e)
                                  }
                                  className="mr-1"
                                />
                                <span className="checkmark-R checkPosition checkPositionTop left-filter"></span>
                              </label>
                              {/* <label className="pl-5 font-weight-bold">
                          
                        </label> */}
                              <label className="container-R d-flex mb-2">
                                <span className="font-weight-bold pl-1 left-filter_font-size">
                                  Job Skill
                                </span>
                                <input
                                  type="checkbox"
                                  checked={this.state.isJobSkillFilter}
                                  name="isJobSkillFilter"
                                  onChange={(e) =>
                                    this.handleCandFilterChange(e)
                                  }
                                  className="mr-1"
                                />
                                <span className="checkmark-R checkPosition checkPositionTop left-filter"></span>
                              </label>
                              {/* <label className="pl-5 font-weight-bold">
                          
                        </label> */}
                              <div className="row">
                                <div className="col-12 text-sm-center text-right font-regular">
                                  <button
                                    type="button"
                                    onClick={this.onPopUpOkClick}
                                    className="btn button button-bg mr-2 shadow"
                                  >
                                    <FontAwesomeIcon
                                      icon={faCheckCircle}
                                      className={"mr-2"}
                                    />
                                    Apply
                                  </button>
                                  <button
                                    type="button"
                                    onClick={this.onPopUpCloseClick}
                                    className="btn button button-close mr-0 pl-3 pr-3 shadow"
                                  >
                                    <FontAwesomeIcon
                                      icon={faTimesCircle}
                                      className={"mr-2"}
                                    />
                                    Close
                                  </button>

                                  {/* <button
                              type="button"
                              onClick={this.onPopUpResetClick}
                              className="btn button button-close mr-2 pl-3 pr-3 shadow"
                            >
                              <FontAwesomeIcon
                                icon={faUnlink}
                                className={"mr-2"}
                              />
                            </button> */}
                                </div>
                              </div>
                            </div>
                          </Popup>
                          <button
                            type="button"
                            onClick={() => {
                              history.push("/candidate/create");
                            }}
                            className="btn button button-close mr-2 pl-3 pr-3 shadow"
                          >
                            <FontAwesomeIcon
                              icon={faPlusCircle}
                              className={"mr-2"}
                            />
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <>
                  {this.state.showLoader && <SkeletonWidget />}
                  {!this.state.showLoader && this.state.candidateId && (
                    <CandidateInformation
                      ref={ref}
                      candidateId={this.state.candidateId}
                      location={this.state.location}
                    />
                  )}
                  {this.state.candSubmissionId && (
                    <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0">
                      <label className="mb-0 font-weight-bold">Comments</label>
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
                        entityId={this.state.candSubmissionId}
                      />
                    </div>
                  )}
                </>
              </Collapsible>
              {this.state.candSubmissionId && this.state.openCommentBox && (
                <CommentHistoryBox
                  entityType={EntityType.CANDSUBMISSION}
                  entityId={this.state.candSubmissionId}
                  showDialog={this.state.openCommentBox}
                  handleNo={() => {
                    this.setState({ openCommentBox: false });
                    document.body.style.position = "";
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {this.state.status && this.state.jobWfTypeId && (
          <FormActions
            wfCode={CandidateWorkflow.CANDIDATE}
            currentState={this.state.status}
            jobWfTypeId={this.state.jobWfTypeId}
            entityId={this.state.candSubmissionId}
            handleClick={this.saveCandidate}
            // cancelUrl={`${CAND_SUB_MANAGE_URL}${this.state.reqId}`}
            handleClose={() => history.goBack()}
          />
        )}
      </React.Fragment>
    );
  }
}

export default CandidateSubmissionForm;
