import { faPencilAlt, faSave, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { dateFormatter } from "../../../HelperMethods";
import { CandSubStatusIds } from "../AppConstants";
import PresentationSave from "./SavePresentation";
import auth from "../../Auth";
import { AppPermissions } from "../Constants/AppPermissions";

export interface ViewPresentationProps {
  data: any;
  candidateSubStatusIntId?: any;
  handleChange?: any;
  handleDropdownChange?: any;
  handleRadioBtnChange?: any;
  discardChanges?: any;
  saveChanges?: any;
  candSubmissionId?: any;
}

export interface ViewPresentationState {
  showLoader: boolean;
  previousEmployer?: boolean;
  isEdit: boolean;
}

class ViewPresentation extends React.Component<ViewPresentationProps, ViewPresentationState> {
  constructor(props: ViewPresentationProps) {
    super(props);
    this.state = {
      showLoader: true,
      previousEmployer: false,
      isEdit: false
    };
  }

  edit(){
    this.setState({ isEdit: !this.state.isEdit });
  }
  
  discard(){
    this.props.discardChanges(this.props.candSubmissionId)
  }

  savePresentation(){
    this.props.saveChanges();
  }

  InputField = () => {
    let inEdit = this.state.isEdit;
    return ( inEdit==false ?
      (
        <div className="col-12  txt-clr-blue d-flex justify-content-end px-0">
        <label className="container-R d-flex mb-0">
        <span
          className="font-medium"
          style={{ paddingRight: "5px", cursor: "pointer"}}
          onClick={() => this.edit()}
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </span>
      </label>

      {/* <label className="container-R d-flex mb-0 pl-2">
        <span
          className="font-medium disable-opacity" 
          style={{ paddingRight: "0px"}}
        >
          <FontAwesomeIcon icon={faUndo} />
        </span>
      </label> */}
      </div>
      ) : (
        <div className="col-12  txt-clr-blue d-flex justify-content-end px-0">
      <label className="container-R d-flex mb-0">
        <span
          className="font-medium"
          style={{ paddingRight: "0px", cursor: "pointer"}}
          onClick={() => this.savePresentation()}
        >
          <FontAwesomeIcon className="fa-save" icon={faSave} />
        </span>
      </label>

      <label className="container-R d-flex mb-0 pl-2">
        <span
          className="font-medium" 
          style={{ paddingRight: "0px", cursor: "pointer"}}
          onClick={() => this.discard()}
        >
          <FontAwesomeIcon icon={faUndo} />
        </span>
      </label></div>
    )
    );
};

  render() {
    const { data } = this.props;
    return (
      <div className="mb-3">
        {((auth.hasPermissionV2(AppPermissions.CAND_SUB_VENDOR_PRESENT_UPDATE) && 
          this.props.candidateSubStatusIntId==CandSubStatusIds.VENDORPRESENTATIONSUBMITTED) ||
          (auth.hasPermissionV2(AppPermissions.EDIT_PRESENTATION_INFO) &&
          (this.props.candidateSubStatusIntId==CandSubStatusIds.ASSIGNMENTCREATED ||
          this.props.candidateSubStatusIntId==CandSubStatusIds.ASSIGNMENTINPROGRESS ||
          this.props.candidateSubStatusIntId==CandSubStatusIds.ASSIGNMENTEXTENDED ||
          this.props.candidateSubStatusIntId==CandSubStatusIds.ASSIGNMENTCOMPLETED))) &&
          this.InputField()
        }

        {!this.state.isEdit && (
          <div>
            <div className="row text-dark">
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">License:</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div">
                    {data.license}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Board Certificate :</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div">
                    {data.boardCertificate=="1" ? "Yes" : data.boardCertificate=="2" ? "No" : "Pending"}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Potential Start Date :</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div">
                    <span>{dateFormatter(data.potentialStartDate)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row text-dark mt-md-2 mt-1">
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Schedule Requested :</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div email-textellipse">
                    {data.scheduleRequested}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Time Off Requested :</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div email-textellipse">
                    {data.timeOffRequested}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Contact Number :</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div">
                    {data.cellNumber}
                  </div>
                </div>
              </div>
            </div>
            <div className="row text-dark mt-md-2 mt-1">
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Credentials:</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div">
                    {data.credentials}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Malpractice:</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div">
                    {data.malpractice}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Background Clearance:</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div">
                    {data.backgroundClearance}
                  </div>
                </div>
              </div>
            </div>
            <div className="row text-dark mt-md-2 mt-1">
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Perm Fee:</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div">
                    {data.permFee}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Email :</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div email-textellipse">
                    {data.emailAddress}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Previous Employee :</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div">
                    {data.previousEmployer ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

            </div>
            <div className="row text-dark mt-md-2 mt-1">
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Previous Employee Description:</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div">
                    {data.previousEmployerDescription}
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="row">
                  <div className="col-7 text-right">Special Terms:</div>
                  <div className="col-5 font-weight-bold pl-0 text-left word-break-div">
                    {data.specialTerms}
                  </div>
                </div>
              </div>
            </div>
          </div>)}

        {this.state.isEdit && (
          <PresentationSave
            data={this.props.data}
            handleChange={this.props.handleChange}
            handleDropdownChange={this.props.handleDropdownChange}
            handleRadioBtnChange={this.props.handleRadioBtnChange}
          />
        )}

      </div>
    );
  }
}

export default ViewPresentation;
