import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faUserCircle, faChevronCircleDown, faChevronCircleUp, faClock, faSave, faTimesCircle, faHistory, faEye } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../../Auth";
import axios from "axios";
import { history, restrictValue, successToastr } from "../../../../../HelperMethods";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { ErrorComponent, FormatPhoneNumber } from "../../../../ReusableComponents";
import { candidateValidation } from "./validations/validation";
import { Comment } from "../../../../Shared/Comment/Comment";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import withValueField from "../../../../Shared/withValueField";
import Skeleton from "react-loading-skeleton";
import { MaskedTextBox, NumericTextBox } from "@progress/kendo-react-inputs";
import TagControl from "../../../../Shared/TagControl/TagControl";
import CommentHistoryBox from "../../../../Shared/Comment/CommentHistoryBox";
import { AuthRole, AuthRoleType, EntityTypeId } from "../../../../Shared/AppConstants";
import DocumentsPortfolio from "../../../../Shared/DocumentsPortfolio/DocumentsPortfolio";
import { filterBy } from "@progress/kendo-data-query";
import CandidateOwnership from "../../../../Candidates/CandidateOwnership/CandidateOwnership";
import AlertBox from "../../../../Shared/AlertBox";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { CANDIDATE_CREATE_SUCCESS_MSG, CANDIDATE_UPDATE_SUCCESS_MSG } from "../../../../Shared/AppMessages";
import _ from "lodash";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

const CustomDropDownList = withValueField(DropDownList);
const defaultJobCategory = { name: "Select Job Category", jobCategoryId: null };
const defaultJobTitle = { name: "Select Job Title", id: null };
const defaultCity = { name: "Select City", id: null };
const defaultVendor = { vendor: "Select Vendor", vendorId: null };
const defaultVendorLocation = { name: "Select Vendor Location", id: null };
const defaultState = { name: "Select State", stateId: null };


export interface CreateCandidateProps {
  props: any;
  match: any;
  onCloseModal: any;
  onOpenModal: any;
}

export interface CreateCandidateState {
  clientId?: string;
  candidateId?: string;
  candidateNumber: string;
  firstName?: string;
  lastName?: string;
  ssn?: string;
  isSsn?: string;
  isSsnClear?: boolean;
  jobCategoryId?: string;
  jobTitleId?: string;
  addressId?: string;
  skillId?: string;
  npi?: number;
  //npi?: string;
  email?: string;
  mobileNumber?: string;
  phoneNumber?: string;
  status?: string;
  address1?: string;
  address2?: string;
  cityId?: string;
  stateId?: string;
  countryId?: string;
  vendorId?: string;
  vendorLocationId?: string;
  // postalCode?: number;
  postalCode?: string;
  isVendorRole?: boolean;
  isNpiRequired?: boolean;
  comments?: string;
  submitted: boolean;
  toggleAll: boolean;
  openCommentBox?: boolean;
  isPrivate?: boolean;
  showLoader?: boolean;
  isDirty?: boolean;
  toggelFirst: boolean;
  jobCategories: Array<IDropDownModel>;
  originaljobCategories: Array<IDropDownModel>;
  jobTitle: Array<IDropDownModel>;
  originaljobTitle: Array<IDropDownModel>;
  skills: Array<IDropDownModel>;
  originalskills: Array<IDropDownModel>;
  city: Array<IDropDownModel>;
  originalcity: Array<IDropDownModel>;
  country: Array<IDropDownModel>;
  originalcountry: Array<IDropDownModel>;
  state: Array<IDropDownModel>;
  originalstate: Array<IDropDownModel>;
  selectedSkills: any;
  vendors: Array<IDropDownModel>;
  originalvendors: Array<IDropDownModel>;
  vendorLocation: Array<IDropDownModel>;
  originalvendorLocation: Array<IDropDownModel>;
  showCandidateOwnershipModal?: boolean;
  showAlert?: boolean;
  showConfirmModal?: boolean;
  originalData?:any;
  isNameChanged?:boolean;
}

class CreateCandidate extends React.Component<CreateCandidateProps, CreateCandidateState> {
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  alertMessage;
  constructor(props: CreateCandidateProps) {
    super(props);
    this.state = {
      clientId: auth.getClient(),
      candidateId: "",
      candidateNumber: "",
      jobCategoryId: "",
      jobTitleId: "",
      addressId: "",
      selectedSkills: [],
      cityId: "",
      stateId: "",
      countryId: "",
      vendorId: auth.getVendor(),
      isVendorRole: AuthRole.Vendor_9==this.userObj.role || AuthRole.Vendor_10==this.userObj.role || AuthRole.Vendor_11==this.userObj.role || AuthRole.NAPA_VENDOR==this.userObj.role,
      vendorLocationId: "",
      submitted: false,
      toggleAll: false,
      isDirty: false,
      toggelFirst: true,
      showLoader: true,
      jobCategories: [],
      originaljobCategories: [],
      jobTitle: [],
      originaljobTitle: [],
      skills: [],
      originalskills: [],
      city: [],
      originalcity: [],
      country: [],
      originalcountry: [],
      state: [],
      originalstate: [],
      vendors: [],
      originalvendors: [],
      vendorLocation: [],
      originalvendorLocation: [],
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    this.getJobCategory();
    this.getVendor();
    this.getCountry();

    const { id } = this.props.match.params;
    if (id) {
      this.getCandidateDetails(id);
    }
    this.setState({ candidateId: id });
  }

  getJobCategory = () => {
    const { clientId } = this.state;
    axios.get(`api/admin/globalpositon/category?$orderby=name`)
      .then(async res => {
        this.setState({ jobCategories: res.data, originaljobCategories: res.data, showLoader: false });
      });
  }

  handleJobCategoryChange = (e) => {
    const id = e.value.jobCategoryId;
    this.setState({ jobCategoryId: id, jobTitleId: null, selectedSkills: null }, () => {
      if (id) {
        this.getJobTitle()
      } else {
        this.setState({ jobTitle: [], skills: [] })
      }
    });

  }

  getJobTitle = () => {
    const { jobCategoryId } = this.state;
    axios.get(`api/admin/globaljobcatalogs?$filter=jobCategoryId eq ${jobCategoryId}&$orderby=name`)
      .then(async res => {
        this.setState({ jobTitle: res.data, originaljobTitle: res.data });
      });
  }

  handleJobTitleChange = (e) => {
    const id = e.value.id;
    this.setState({ jobTitleId: id, selectedSkills: [] , isNpiRequired: e.value.isNpiRequired}, () => {
      if (id) {
        this.getSkills();
      }
      else {
        this.setState({ skills: [] })
      }
    });
  }

  getSkills = () => {
    const { jobTitleId } = this.state;
    axios.get(`api/admin/jobpositions/skills?$filter=positionId eq ${jobTitleId}&$orderby=name`)
      .then(async res => {
        this.setState({ skills: res.data, originalskills: res.data });
      });
  }

  handleSkillsChange = (e) => {
    this.setState({ selectedSkills: e.value });
  }

  getCity = () => {
    const { stateId } = this.state;
    axios.get(`api/admin/state/${stateId}/city`)
      .then(async res => {
        this.setState({ city: res.data, originalcity: res.data });
      });
  }

  handleCityChange = (e) => {
    const Id = e.value.cityId;
    this.setState({ cityId: Id });
  }

  getCountry = () => {
    axios.get(`api/admin/country`)
      .then(async res => {
        let data = res.data.filter((i) => i.name =="United States")
        this.setState({ country: res.data, originalcountry: res.data, countryId: data[0].countryId }, () => this.getState());
      });
  }

  handleCountryChange = (e) => {
    const Id = e.value.countryId;
    this.setState({ countryId: Id, stateId: null, cityId: null }, () => this.getState());
  }

  getState = () => {
    const { countryId } = this.state;
    axios.get(`api/admin/country/${countryId}/state`)
      .then(async res => {
        this.setState({ state: res.data, originalstate: res.data });
      });
  }

  handleStateChange = (e) => {
    const id = e.value.stateId;
    this.setState({ stateId: id, cityId: null }, () => {
      if (id) {
        this.getCity();
      }
      else {
        this.setState({ city: [] });
      }
    });
  }

  getVendor = () => {
    axios.get(`api/vendor?$orderby=vendor`)
      .then(async res => {
        this.setState({ vendors: res.data, originalvendors: res.data });
      });
  }

  handleVendorChange = (e) => {
    const Id = e.value.vendorId;
    this.setState({ vendorId: Id });
  }

  handleFilterChange(event) {
    var name = event.target.props.id;
    var originalArray = "original" + name;
    this.state[name] = this.filterData(event.filter, originalArray);
    this.setState(this.state);
  }

  filterData(filter, originalArray) {
    const data1 = this.state[originalArray];
    return filterBy(data1, filter);
  }

  handleCheckboxChange(e, modelProp) {
    var stateObj = {};
    stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
    this.setState(stateObj);
  }

  saveCandidate(isSubmit: boolean) {
    let data = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      ssn: this.state.ssn,
      ssnOnFile: this.state.isSsn,
      isSsnClear: this.state.isSsnClear,
      jobCategory: this.state.jobCategoryId,
      jobTitle: this.state.jobTitleId,
      skills: this.state.selectedSkills,
      npi: this.state.npi,
      email: this.state.email,
      mobileNumber: this.state.mobileNumber,
      phoneNumber: this.state.phoneNumber,
      address1: this.state.address1,
      address2: this.state.address2,
      city: this.state.cityId,
      state: this.state.stateId,
      postalCode: this.state.postalCode,
      country: this.state.countryId,
      addressId: this.state.addressId,
      candidateId: this.state.candidateId,
      vendorId: this.state.vendorId,
      isNameChanged: this.state.originalData && this.state.firstName.toLowerCase().trim()+ this.state.lastName.toLowerCase().trim() != this.state.originalData.firstName.toLowerCase().trim()+ this.state.originalData.lastName.toLowerCase().trim()
    };
    data["isSubmit"] = isSubmit;
    data["phoneNumber"] = data["phoneNumber"] ? data["phoneNumber"].replace(/\D+/g, "") : "";
    data["mobileNumber"] = data["mobileNumber"] ? data["mobileNumber"].replace(/\D+/g, "") : "";
    if (this.state.candidateId) {
      const { candidateId } = this.state;
      axios.put(`api/candidates/${this.state.candidateId}`, JSON.stringify(data)).then((res) => {
        if (res.data.isValid==false && res.data.errorCode==null) {
          this.alertMessage = res.data.errorMessage;
          this.setState({ showAlert: true });
        }
        if (res.data.isValid) {
          successToastr(CANDIDATE_UPDATE_SUCCESS_MSG);
          history.goBack();
        }
      });
    } else {
      axios.post("api/candidates", JSON.stringify(data)).then((res) => {
        if (res.data.isValid==false && res.data.errorCode=="SHARED_WITH_VENDOR") {
          this.alertMessage = res.data.errorMessage;
          this.setState({ showAlert: true });
        }
        if (res.data.isValid==false && res.data.errorCode=="SHARE_REQUESTED") {
          this.alertMessage = res.data.errorMessage;
          this.setState({ showAlert: true });
        }
        if (res.data.isValid==false && res.data.errorCode=="REQUEST_SHARE") {
          this.alertMessage = res.data.errorMessage;
          this.setState({ candidateId: res.data.candidateId, showConfirmModal: true });
        }
        if (res.data.isValid) {
          successToastr(CANDIDATE_CREATE_SUCCESS_MSG);
          history.goBack();
        }
      });
    }
  }

  getCandidateDetails(candidateId: string) {
    axios.get(`api/candidates/${candidateId}`).then((res) => {
      const { data } = res;
      this.setState({
        candidateId: data.candidateId,
        candidateNumber: data.candidateNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        ssn: data.isSsn=="On File" ? "" : data.ssn1,
        isSsn: data.isSsn,
        npi: data.npi1,
        email: data.email,
        address1: data.addressLine1,
        address2: data.addressLine2,
        cityId: data.cityId,
        countryId: data.countryId,
        stateId: data.stateId,
        postalCode: data.pinCodeId,
        mobileNumber: FormatPhoneNumber(data.contactNum1),
        phoneNumber: FormatPhoneNumber(data.contactNum2),
        jobCategoryId: data.jobCategoryId,
        jobTitleId: data.reqPositionId,
        isNpiRequired: data.isNpiRequired,
        addressId: data.addressId,
        selectedSkills: data.skills,
        status: data.status,
        vendorId: data.vendorId,
        showLoader: false,
        originalData: _.cloneDeep(data)

      }, () => { this.getJobTitle(); this.getSkills(); this.getState(); this.getCity(); });
    });
  }

  onCollapseOpen = () => {
    this.setState({
      toggleAll: true,
      toggelFirst: true,
    });
  };

  onCollapseClose = () => {
    this.setState({
      toggleAll: false,
      toggelFirst: false,
    });
  };

  render() {
    const {
      toggleAll,
      toggelFirst,
    } = this.state;
    const reqTriggerName = (
      <span>
        Personal Details
        <span
          className="d-none d-sm-block"
          style={{ float: "right", marginRight: "25px" }}
        >
          Status :  {this.state.candidateId ? <span className="font-weight-bold"> {this.state.status} </span> : "Draft"}
        </span>
      </span>
    );
    return (
      <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
        <div className="col-12">
          <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
            <div className="col-10 fonFifteen paddingLeftandRight">
              <div className="d-none d-md-block">
              <BreadCrumbs globalData={{candidateId:this.state.candidateId}}></BreadCrumbs>
              </div>
            </div>

            <div className="col-2 text-right mt-sm-1 mt-md-0 txt-orderno text-underline paddingRight d-flex align-items-center justify-content-end ">
              {this.state.candidateId && (
                <Link
                  to={`/timesheets/provider/${this.state.candidateId}/workhistory`}
                >
                  <span className="float-right text-dark">
                    <FontAwesomeIcon
                      icon={faHistory}
                      className={"mr-2 text-dark"}
                    />
                        Work History
                      </span>
                </Link>
              )}

              {toggelFirst || toggleAll ? (
                <FontAwesomeIcon
                  className="ml-2 mt-1 text-primary collapseExpandIcon globalExpandCursor"
                  icon={faChevronCircleUp}
                  onClick={
                    toggleAll ? this.onCollapseClose : this.onCollapseOpen
                  }
                ></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon
                  className="ml-2 mt-1 text-primary collapseExpandIcon globalExpandCursor"
                  icon={faChevronCircleDown}
                  onClick={
                    toggleAll ? this.onCollapseClose : this.onCollapseOpen
                  }
                ></FontAwesomeIcon>
              )}
            </div>
          </div>
        </div>

        <Formik
          validateOnMount={this.state.submitted}
          initialValues={this.state}
          validateOnChange={false}
          enableReinitialize={true}
          validationSchema={candidateValidation}
          validateOnBlur={false}
          onSubmit={(fields) => this.saveCandidate(true)}
          render={(formikProps) => (
            <Form
              className="col-12 ml-0 mr-0"
              id="collapsiblePadding"
              translate="yes"
              onChange={formikProps.handleChange}
              autoComplete="false"
            >
              <Collapsible
                trigger={reqTriggerName}
                open={toggelFirst}
                accordionPosition="1"
                onTriggerOpening={() =>
                  this.setState({ toggelFirst: true })
                }
                onTriggerClosing={() =>
                  this.setState({ toggelFirst: false })
                }
              >
                <div className="row pt-2 pb-2  mx-auto mb-1 mt-1">
                  <div className="col-6 col-md fonFifteen paddingLeftandRight pl-0">
                    {this.state.candidateId && (
                      <div className="row mx-0 align-items-center ">
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className={"mr-1 text-dark font-sizelarge"}
                        />
                        <span>
                          Candidate# :{" "}
                          <span className="font-weight-bold">
                            {" "}
                            {this.state.candidateNumber}{" "}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="col-6 col-md textt-right mt-sm-0 mt-md-0 txt-orderno text-underline paddingRightt d-flex align-items-centerr justify-content-end pr-0">
                    {this.state.candidateId && (
                      <div className="row mx-0 align-items-centerr">
                        <span className="float-right text-dark">
                          <DocumentsPortfolio
                            candidateId={this.state.candidateId}
                          ></DocumentsPortfolio>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {this.state.showLoader &&
                  Array.from({ length: 6 }).map((item, i) => (
                    <div className="row mx-auto mt-2" key={i}>
                      {Array.from({ length: 3 }).map((item, j) => (
                        <div
                          className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1"
                          key={j}
                        >
                          <Skeleton width={100} />
                          <Skeleton height={30} />
                        </div>
                      ))}
                    </div>
                  ))}
                {!this.state.showLoader && (
                  <div>
                    <div className="row mt-2">
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-0">
                        <label className="mb-1 font-weight-bold required">
                          First Name
                            </label>
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Enter First Name"
                          value={this.state.firstName}
                          maxLength={100}
                          onChange={(event) => {
                            this.setState({
                              firstName: event.target.value,
                            });
                          }}
                        />
                        {formikProps.errors.firstName && (
                          <ErrorComponent
                            message={formikProps.errors.firstName}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold required">
                          Last Name
                            </label>
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Enter Last Name"
                          value={this.state.lastName}
                          maxLength={100}
                          onChange={(event) => {
                            this.setState({ lastName: event.target.value });
                          }}
                        />
                        {formikProps.errors.lastName && (
                          <ErrorComponent
                            message={formikProps.errors.lastName}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0   mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold">
                          SSN#
                            
                          </label>
                          {this.state.isSsn=="On File" ?
                              <React.Fragment>
                                <span className="pl-2 pr-1"> - On File</span>
                                  <label className="container-R d-flex mb-0 pb-0 dispaly-ssn-inline">
                                  <span className="Introduction-line-height pl-0">Clear SSN#</span>
                                  <input
                                      type="checkbox"
                                      onChange={(e) => this.handleCheckboxChange(e, "isSsnClear")}
                                  />
                                  <span className="checkmark-R checkPosition checkPositionTop" 
                                  style={{ left: "0px"}}></span>
                                  </label>
                              </React.Fragment>
                              :
                            ""
                            }
                            <input
                              type="password"
                              disabled={this.state.isSsnClear ? true : false}
                              autoComplete="new-password"
                              className="form-control "
                              placeholder="Enter SSN"
                              value={this.state.ssn}
                              maxLength={9}
                              onChange={(event) => {
                                this.setState({ ssn: event.target.value });
                              }}
                        />
                        {formikProps.errors.ssn && (
                          <ErrorComponent
                            message={formikProps.errors.ssn}
                          />
                        )}
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-0">
                        <label className="mb-1 font-weight-bold required">
                          Job Category
                            </label>
                        <CustomDropDownList
                          className={"form-control disabled "}
                          data={this.state.jobCategories}
                          disabled={!this.state.clientId}
                          name="jobCategory"
                          //name={`jobCategoryId`}
                          textField="name"
                          valueField="jobCategoryId"
                          id="jobCategories"
                          defaultItem={defaultJobCategory}
                          value={this.state.jobCategoryId}
                          onChange={(e) => this.handleJobCategoryChange(e)}
                          filterable={
                            this.state.originaljobCategories.length > 5
                              ? true
                              : false
                          }
                          onFilterChange={this.handleFilterChange}
                        />
                        {formikProps.errors.jobCategoryId && (
                          <ErrorComponent
                            message={formikProps.errors.jobCategoryId}
                          />
                        )}
                      </div>

                      <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold required">
                          Job Title
                            </label>
                        <CustomDropDownList
                          className={"form-control disabled"}
                          data={this.state.jobTitle}
                          disabled={!this.state.jobCategoryId}
                          name="name"
                          //name={`jobTitleId`}
                          textField="name"
                          valueField="id"
                          id="jobTitle"
                          defaultItem={defaultJobTitle}
                          value={this.state.jobTitleId}
                          onChange={(e) => this.handleJobTitleChange(e)}
                          filterable={
                            this.state.originaljobTitle.length > 5
                              ? true
                              : false
                          }
                          onFilterChange={this.handleFilterChange}
                        />
                        {formikProps.errors.jobTitleId && (
                          <ErrorComponent
                            message={formikProps.errors.jobTitleId}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0 area-merged">
                        <label className="mb-1 font-weight-bold required">
                          Skills
                            </label>
                        <MultiSelect
                          className="form-control disabled"
                          disabled={!this.state.jobTitleId}
                          data={this.state.skills}
                          textField="name"
                          dataItemKey="id"
                          id="name"
                          value={this.state.selectedSkills}
                          onChange={(e) => this.handleSkillsChange(e)}
                          placeholder="Select Skills..."
                        // filterable={this.state.originalskills.length > 5 ? true : false}
                        // onFilterChange={this.handleFilterChange}
                        />
                        {formikProps.errors.selectedSkills && (
                          <ErrorComponent
                            message={formikProps.errors.selectedSkills}
                          />
                        )}
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-0">
                        <label className={`mb-1 font-weight-bold ${this.state.isNpiRequired ? "required" : "" }`}>
                          NPI#
                            </label>
                        <NumericTextBox
                          className="form-control text-left-align"
                          name="npi"
                          placeholder="Enter NPI"
                          value={this.state.npi}
                          onChange={(event) => {
                            this.setState({ npi: event.target.value });
                          }}
                          max={9999999999}
                          min={0}
                          format="#"
                          spinners={false}
                        />
                          {/* <input
                                                      type="tel"
                                                      className="form-control text-right"
                                                      placeholder="Enter NPI"
                                                      value={this.state.npi}
                                                      maxLength={10}
                                                      onChange={(event) => {
                                                          this.setState({ npi: event.target.value });
                                                      }}
                                                  /> */}
                        {formikProps.errors.npi && (
                          <ErrorComponent
                            message={formikProps.errors.npi}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold ">
                          Email
                            </label>
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Enter Email"
                          value={this.state.email}
                          maxLength={100}
                          onChange={(event) => {
                            this.setState({ email: event.target.value });
                          }}
                        />
                        {formikProps.errors.email && (
                          <ErrorComponent
                            message={formikProps.errors.email}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold ">
                          Mobile Number
                            </label>
                        <MaskedTextBox
                          mask="(000) 000-0000"
                          name="mobileNumber"
                          className="form-control"
                          placeholder="Enter Mobile Number"
                          value={this.state.mobileNumber}
                          onChange={(event) => {
                            this.setState({
                              mobileNumber: event.target.value,
                            });
                          }}
                        />
                        {formikProps.errors.mobileNumber && (
                          <ErrorComponent
                            message={formikProps.errors.mobileNumber}
                          />
                        )}
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-0">
                        <label className="mb-1 font-weight-bold ">
                          Phone Number
                            </label>
                        <MaskedTextBox
                          mask="(000) 000-0000"
                          name="phoneNumber"
                          className="form-control"
                          placeholder="Enter Phone Number"
                          value={this.state.phoneNumber}
                          onChange={(event) => {
                            this.setState({
                              phoneNumber: event.target.value,
                            });
                          }}
                        />
                        {formikProps.errors.phoneNumber && (
                          <ErrorComponent
                            message={formikProps.errors.phoneNumber}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold required">
                          Address 1
                            </label>
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Enter Address 1"
                          value={this.state.address1}
                          maxLength={100}
                          onChange={(event) => {
                            this.setState({ address1: event.target.value });
                          }}
                        />
                        {formikProps.errors.address1 && (
                          <ErrorComponent
                            message={formikProps.errors.address1}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold ">
                          Address 2
                            </label>
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Enter Address 2"
                          value={this.state.address2}
                          maxLength={100}
                          onChange={(event) => {
                            this.setState({ address2: event.target.value });
                          }}
                        />
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-0">
                        <label className="mb-1 font-weight-bold required">
                          State
                            </label>
                        <CustomDropDownList
                          className={"form-control disabled"}
                          disabled={!this.state.countryId}
                          data={this.state.state}
                          name="name"
                          textField="name"
                          valueField="stateId"
                          id="state"
                          defaultItem={defaultState}
                          value={this.state.stateId}
                          onChange={(e) => this.handleStateChange(e)}
                          filterable={
                            this.state.originalstate.length > 5
                              ? true
                              : false
                          }
                          onFilterChange={this.handleFilterChange}
                        />
                        {formikProps.errors.stateId && (
                          <ErrorComponent
                            message={formikProps.errors.stateId}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold required">
                          City
                            </label>
                        <CustomDropDownList
                          className={"form-control disabled"}
                          disabled={!this.state.stateId}
                          data={this.state.city}
                          name="name"
                          textField="name"
                          valueField="cityId"
                          id="city"
                          defaultItem={defaultCity}
                          value={this.state.cityId}
                          onChange={(e) => this.handleCityChange(e)}
                          filterable={
                            this.state.originalcity.length > 5
                              ? true
                              : false
                          }
                          onFilterChange={this.handleFilterChange}
                        />
                        {formikProps.errors.cityId && (
                          <ErrorComponent
                            message={formikProps.errors.cityId}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold required">
                          Postal Code
                            </label>
                        {/* <NumericTextBox
                          className="form-control text-right"
                          name="postalCode"
                          placeholder="Enter Postal Code"
                          value={this.state.postalCode}
                          onChange={(event) => {
                            this.setState({
                              postalCode: event.target.value,
                            });
                          }}
                          max={999999999}
                          min={0}
                          format="#"
                          spinners={false}
                        /> */}

                        <input
                            type="number"
                            className="form-control no-spinner"
                            name="postalCode"
                            placeholder="Enter Postal Code"
                            value={this.state.postalCode}
                            // maxLength={9}
                            onChange={(event) => {
                                this.setState({ postalCode: event.target.value });
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            onKeyPress={(e) => restrictValue(e)}
                        />
                        {formikProps.errors.postalCode && (
                          <ErrorComponent
                            message={formikProps.errors.postalCode}
                          />
                        )}
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-0">
                        <label className="mb-1 font-weight-bold required">
                          Country
                            </label>
                        <CustomDropDownList
                          className={"form-control disabled"}
                          data={this.state.country}
                          valueField="countryId"
                          name="name"
                          textField="name"
                          id="country"
                          value={this.state.countryId}
                          onChange={(e) => this.handleCountryChange(e)}
                          filterable={
                            this.state.originalcountry.length > 5
                              ? true
                              : false
                          }
                          onFilterChange={this.handleFilterChange}
                        />
                        {formikProps.errors.countryId && (
                          <ErrorComponent
                            message={formikProps.errors.countryId}
                          />
                        )}
                      </div>
                      {this.userObj.roleType != AuthRoleType.Vendor &&
                        <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
                          <label className="mb-1 font-weight-bold ">
                            <span>Vendor</span>
                            {this.state.candidateId && (
                              <span
                                className="text-underline cursorElement align-middle"
                                onClick={() =>
                                  this.setState({
                                    showCandidateOwnershipModal: true,
                                  })
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faClock}
                                  className="ml-1 active-icon-blue ClockFontSize"
                                />
                              </span>
                            )}
                          </label>
                          <CustomDropDownList
                            disabled={this.state.isVendorRole}
                            className={"form-control"}
                            data={this.state.vendors}
                            name="vendor"
                            textField="vendor"
                            valueField="vendorId"
                            id="vendors"
                            defaultItem={defaultVendor}
                            value={this.state.vendorId}
                            onChange={(e) => this.handleVendorChange(e)}
                            filterable={
                              this.state.originalvendors.length > 5
                                ? true
                                : false
                            }
                            onFilterChange={this.handleFilterChange}
                          />
                        </div>
                      }
                      {this.userObj.roleType==AuthRoleType.Vendor && this.state.candidateId &&
                        <div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
                        <label className="mb-1 font-weight-bold ">
                          <span>Vendor Ownership</span>
                          {this.state.candidateId && (
                            <span
                              className="text-underline cursorElement align-middle"
                              onClick={() =>
                                this.setState({
                                  showCandidateOwnershipModal: true,
                                })
                              }
                            >
                              <FontAwesomeIcon
                                icon={faClock}
                                className="ml-1 active-icon-blue ClockFontSize"
                              />
                            </span>
                          )}
                        </label>
                      </div>
                      }
                      <div
                        className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0"
                        style={{
                          display: this.state.candidateId
                            ? "block"
                            : "none",
                        }}
                      >
                        <label className="mb-1 font-weight-bold ">
                          Tags
                            </label>
                        <TagControl
                          defaultText="None"
                          entityId={this.state.candidateId}
                          entityTypeId={EntityTypeId.CANDIDATE}
                        />
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div
                        className="col-12 col-sm-4 col-lg-4 mt-0 mt-sm-0"
                        style={{
                          display: this.state.candidateId
                            ? "block"
                            : "none",
                        }}
                      >
                        <label className="mb-0 font-weight-bold">
                          Comments
                            </label>
                        <span
                          onClick={() =>
                            this.setState({
                              openCommentBox: true,
                              isPrivate: null,
                            })
                          }
                          className="text-underline cursorElement align-middle"
                        >
                          <FontAwesomeIcon
                            icon={faClock}
                            className="ml-1 active-icon-blue ClockFontSize"
                          />
                        </span>
                        <Comment
                          entityType={"Candidate"}
                          entityId={this.state.candidateId}
                        />
                      </div>
                      {this.state.candidateId && this.state.openCommentBox && (
                        <CommentHistoryBox
                          entityType={"Candidate"}
                          entityId={this.state.candidateId}
                          showDialog={this.state.openCommentBox}
                          handleNo={() => {
                            this.setState({ openCommentBox: false });
                            document.body.style.position = "";
                          }}
                          isPrivate={this.state.isPrivate}
                        />
                      )}
                   
                    </div>
                  </div>
                )}
              </Collapsible>

              <div className="modal-footer justify-content-center border-0">
                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                  {/* <Link to="/candidate/manage"> */}
                  <button
                    type="button"
                    className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                    //onClick={this.props.onCloseModal}
                    onClick={() => history.goBack()}
                  >
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className={"mr-1"}
                    />{" "}
                          Close
                        </button>
                  {/* </Link> */}
                  <button
                    type="submit"
                    className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                    onClick={() => this.setState({ submitted: true })}
                  >
                    <FontAwesomeIcon icon={faSave} className={"mr-1"} />{" "}
                        Save
                      </button>
                </div>
              </div>
            </Form>
          )}
        />
        {this.state.showAlert && (
          <AlertBox
            showModal={this.state.showAlert}
            handleNo={() => {
              this.setState({ showAlert: false });
            }}
            message={this.alertMessage}
          />
        )}
        {this.state.showConfirmModal && (
          <ConfirmationModal
            message={this.alertMessage}
            showModal={this.state.showConfirmModal}
            handleYes={(e) => this.createCandShareRequest()}
            handleNo={() => {
              this.setState({
                showConfirmModal: false,
                candidateId: undefined,
              });
            }}
          />
        )}

<div className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0">
                        {this.state.showCandidateOwnershipModal && (
                          <CandidateOwnership
                            candidateId={this.state.candidateId}
                            handleNo={() => {
                              this.setState({
                                showCandidateOwnershipModal: false,
                              });
                            }}
                          />
                        )}
                      </div>
      </div>
    );
  }
  createCandShareRequest = () => {
    this.setState({ showConfirmModal: false });
    const data = {
      candidateId: this.state.candidateId,
      vendorId: this.state.vendorId
    }
    axios.post("api/candidates/share/workflow", JSON.stringify(data)).then((res) => {
      successToastr('Candidate share request created successfully.');
      history.push('/candidate/manage');
    });
  }
}

export default CreateCandidate;