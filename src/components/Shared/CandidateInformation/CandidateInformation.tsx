import * as React from "react";
import { Link } from 'react-router-dom';
import auth from "../../Auth";
import { FormatPhoneNumber } from "../../ReusableComponents";
import { faPencilAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import TagControl from "../../Shared/TagControl/TagControl";
import { EntityTypeId, SettingCategory, SETTINGS } from "../AppConstants";
import DocumentsPortfolio from "../DocumentsPortfolio/DocumentsPortfolio";
import { EDIT_CANDIDATE_URL } from "../ApiUrls";
import { AppPermissions } from "../Constants/AppPermissions";
import { clientSettingsData, dateFormatter } from "../../../HelperMethods";

export interface CandidateInformationProps {
  candidateId: any;
  location: any;
  callbackFromParent?: any;
  submittedVendor?: string;
  targetStartDate?: any;
  targetEndDate?: any;
  isAssignmentProjections?: boolean;
  submissionData?: any;
  candSubmissionId?: any;
  candSubDetails?: any;
  jobDetailPage?: any;
  getDocPortfolio?: any;
}

export interface CandidateInformationState {
  showLoader?: boolean;
  candDetails: any;
  candAddressDetails: any;
  candCityDetails?: any;
  candStateDetails?: any;
  candCountryDetails?: any;
  vendorContact?: string;
  isAssignmentProjections?: boolean;
  clientId?: any;
  isAlreadyExecuted: boolean;
}

export class CandidateInformation extends React.Component<
  CandidateInformationProps,
  CandidateInformationState
> {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
      candDetails: {},
      candAddressDetails: {},
      candCityDetails: {},
      candStateDetails: {},
      candCountryDetails: {},
      clientId: auth.getClient(),
      isAlreadyExecuted: false
    };
  }

  componentDidMount() {
    this.getCandidateDetails(this.props.candidateId);
    this.props.submissionData && this.getWFHistory(this.props.submissionData.candSubmissionId)
    this.state.clientId && this.getClientSettings(this.state.clientId)
  }

  getCandidateDetails(candidateId) {
    this.setState({ showLoader: true });
    if (candidateId) {
      axios.get(`api/candidates/${candidateId}`).then((res) => {
        this.setState({
          candDetails: res.data,
          candAddressDetails: res.data.address,
          candCityDetails: res.data.address.city,
          candStateDetails: res.data.address.state,
          candCountryDetails: res.data.address.country,
          showLoader: false,
        });

        if (res.data && res.data.address && res.data.address.email !="") {
          let email = res.data.address.email;
          let name = res.data.candidateName;
          let mobileNumber = this.state.candAddressDetails.contactNum1;
          let phoneNumber = this.state.candAddressDetails.contactNum2;
          if (this.props.callbackFromParent !=null)
            this.props.callbackFromParent({ name, email, phoneNumber, mobileNumber });
        }
      });
    }
  }

  getCandDetails = () => {
    return { ...this.state };
  };

  getWFHistory = (candSubmissionId) => {
    const queryParams = `entityId eq ${candSubmissionId}`;
    axios.get(`api/workflow/history?$filter=${queryParams}`).then((res) => {
      if (res.data.length > 0 && res.data[0] && res.data[0].actionBy) {
        this.setState({vendorContact:res.data[0].actionBy});
      }
    })
  }

  getClientSettings = (clientId) => {
    clientSettingsData(clientId, SettingCategory.REPORT, SETTINGS.ASSIGNMENT_PROJECTION, (response) => {
      this.setState({ isAssignmentProjections : response });
    });
  };

  handleStateUpdate = () => {
      this.setState({ isAlreadyExecuted: true });
      if (this.props.getDocPortfolio && this.props.submissionData){
        this.props.getDocPortfolio(this.props.submissionData.candSubmissionId)
      }
  }


  render() {
    return (
      <div>
        {!this.state.showLoader && (
          <div className="mb-3">
            <div className="row text-dark mb-md-3 mb-1 ml-0 mr-0">
              <div className="col col-sm pl-0 pr-0">
                <div className="row">
                  <div className="col-12 text-left">
                    <div className="row ml-0 mr-0 d-flex align-items-center">
                      <span>
                        <FontAwesomeIcon
                          icon={faUserCircle}
                          className={"mr-2 IconLargeSize shadow rounded-circle"}
                        />
                      </span>{" "}
                      <span className="font-weight-bold">
                        Candidate# : {this.state.candDetails.candidateNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col col-sm pl-0 pr-0" id="viewController">
                <div className="row">
                  <div className="col-12 text-left">
                    <div className="row ml-0 mr-0 d-flex align-items-center justify-content-end">
                      <DocumentsPortfolio
                        candidateId={this.props.candidateId}
                        candSubmissionId={this.props.submissionData ? this.props.submissionData.candSubmissionId: this.props.candSubmissionId}
                        vendor={this.props.submissionData && this.props.submissionData.vendor}
                        reqNumber={this.props.submissionData && this.props.submissionData.reqNumber}
                        candWfStatus={this.props.submissionData && this.props.submissionData.statusIntId}
                        jobDetailPage={this.props.jobDetailPage? true: false}
                        handleDocStatus={this.handleStateUpdate}
                      ></DocumentsPortfolio>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row text-dark">
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Candidate Name:</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {this.state.candDetails.candidateName}{" "}
                    {auth.hasPermissionV2(AppPermissions.CANDIDATE_UPDATE) &&
                      <span>
                        <Link to={`${EDIT_CANDIDATE_URL}${this.props.candidateId}`}>
                          <FontAwesomeIcon
                            icon={faPencilAlt}
                            className="ml-1 active-icon-blue"
                          />
                        </Link>
                      </span>}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Position :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {this.state.candDetails.jobPosition}
                  </div>
                </div>
              </div>
              {this.props.location && (
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="row">
                    <div className="col-6 text-right">Location :</div>
                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                      {this.props.location}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="row text-dark mt-md-2 mt-1">
              {/* <div className="col-12 col-sm-4">
                <div className="row">
                  <div className="col-6 text-right">Vendor :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {FormatPhoneNumber(this.state.candDetails.vendor)}
                  </div>
                </div>
              </div> */}
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Skill :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {this.state.candDetails &&
                      this.state.candDetails.candSkills &&
                      this.state.candDetails.candSkills
                        .map((v: { jobSkills: any }) => Object(v.jobSkills))
                        .join(",")}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">SSN# :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {this.state.candDetails.ssn}
                  </div>
                </div>
              </div>
            </div>
            <div className="row text-dark mt-md-2 mt-1">
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Email :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {this.state.candAddressDetails.email}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Mobile # :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {FormatPhoneNumber(
                      this.state.candAddressDetails.contactNum1
                    )}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Phone # :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {FormatPhoneNumber(
                      this.state.candAddressDetails.contactNum2
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row text-dark mt-md-2 mt-1">
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">NPI# :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {this.state.candDetails.npi}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Address 1 :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {this.state.candAddressDetails.addressLine1}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Address 2 :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {this.state.candAddressDetails.addressLine2}
                  </div>
                </div>
              </div>
            </div>
            <div className="row text-dark mt-md-2 mt-1">
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">City :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {this.state.candCityDetails.name}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">State :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {this.state.candStateDetails.name}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Postal Code :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {this.state.candAddressDetails.pinCodeId}
                  </div>
                </div>
              </div>              
            </div>
            <div className="row text-dark mt-md-2 mt-1">
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Country :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {this.state.candCountryDetails.name}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4" id="Candidate-Submission">
                <div className="row">
                  <TagControl
                    defaultText="None"
                    fieldName="Tags"
                    entityId={this.props.candidateId}
                    entityTypeId={EntityTypeId.CANDIDATE}
                  />
                </div>
              </div>
              
            </div>
            <>
              <div className="row text-dark mt-md-2 mt-1">
              {this.props.submissionData && this.props.submissionData.vendor && (
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="row">
                    <div className="col-6 text-right">Submitted Vendor :</div>
                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                      {this.props.submissionData.vendor}
                    </div>
                  </div>
                </div>
                )}
                {this.props.submissionData && this.props.submissionData.targetStartDate 
                && this.props.submissionData && this.props.submissionData.targetEndDate 
                && this.state.isAssignmentProjections==true
                && (<>
                  <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Target Start Date :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {dateFormatter(new Date(this.props.submissionData.targetStartDate))}
                  </div>
                </div>
              </div>
                <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Target End Date :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                    {dateFormatter(new Date(this.props.submissionData.targetEndDate))}
                  </div>
                </div>
              </div>
                </>)
                }
              </div>            
            {this.state.vendorContact && (
              <div className="row text-dark mt-md-2 mt-1">
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="row">
                  <div className="col-6 text-right">Vendor Contact :</div>
                  <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                  {this.state.vendorContact}
                  </div>
                </div>
              </div>
            </div>
            )}
              </>
              
          </div>
        )}
      </div>
    );
  }
}

export default CandidateInformation;
