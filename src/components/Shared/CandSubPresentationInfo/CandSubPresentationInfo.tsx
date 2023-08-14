import * as React from "react";
import axios from "axios";
import SkeletonWidget from "../../Shared/Skeleton";
import PresentationView from "./ViewPresentation";
import PresentationSave from "./SavePresentation";
import { FormatPhoneNumber } from "../../ReusableComponents";
import { emailPattern } from "../AppConstants";
import { localDateTime, successToastr } from "../../../HelperMethods";
import { PRESENTATION_SAVE_SUCCESS_MSG } from "../AppMessages";

export interface CandSubPresentationInfoProps {
  candSubmissionId: any;
  isEnable?: boolean;
  candidateEmail?: any;
  candidatePhoneNumber?: any;
  reqStartDate?: any;
  candidateSubStatusIntId?: any;
  showAlertBox?: any;
}

export interface CandSubPresentationInfoState {
  showLoader: boolean;
  showError: boolean;
  candSubPresentationInfoId?: any;
  license?: string;
  boardCertificate?: any;
  potentialStartDate?: Date;
  scheduleRequested?: string;
  timeOffRequested?: string;
  cellNumber?: any;
  emailAddress?: string;
  previousEmployer?: boolean;
  previousEmployerDescription?: string;
  credentials?: string;
  malpractice?: string;
  backgroundClearance?: string;
  permFee?: string;
  reqStartDate?: any;
  specialTerms: any;
}

function trim(stringToTrim) {
  if (stringToTrim !=null){
    return stringToTrim.replace(/^\s+|\s+$/g, "");
  } else{
    return "";
  }
}

class CandSubPresentationInfo extends React.Component<
  CandSubPresentationInfoProps,
  CandSubPresentationInfoState
> {
  constructor(props: CandSubPresentationInfoProps) {
    super(props);
    this.state = {
      showLoader: true,
      showError: false,
      license: "",
      boardCertificate: null,
      potentialStartDate: null,
      scheduleRequested: "",
      timeOffRequested: "",
      cellNumber: "",
      emailAddress: "",
      previousEmployer: false,
      previousEmployerDescription: "",
      credentials: "",
      malpractice: "",
      backgroundClearance: "",
      permFee: "",
      specialTerms: "",
      reqStartDate: this.props.reqStartDate
    };
  }

  componentDidMount() {
    this.setState({ showLoader: false });
    this.getCandSubPresentationInfo(this.props.candSubmissionId);
  }

  handleDropdownChange = (e) => {
    let change = {};
    change[e.target.props.name] = e.target.value;
    this.setState(change);
  };

  handleChange = (e) => {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  handleRadioBtnChange = (e) => {
    var radioValue = e.target.value=="true" ? true : false;
    this.setState({ previousEmployer: radioValue });
  };

  validateField = () => {
    const {
      license,
      boardCertificate,
      potentialStartDate,
      scheduleRequested,
      timeOffRequested,
      previousEmployer,
      previousEmployerDescription,
      credentials,
      malpractice,
      backgroundClearance,
      permFee,
      specialTerms,
      showError,
    } = this.state;

    let showErrors =
      boardCertificate ==null ||
        potentialStartDate ==null ||
        license =="" ||
        trim(scheduleRequested) =="" ||
        trim(timeOffRequested) =="" ||
        trim(credentials) =="" ||
        trim(malpractice) =="" ||
        trim(backgroundClearance) =="" ||
        trim(permFee) =="" ||
        trim(specialTerms)=="" ||
        previousEmployer ==null ||
        (previousEmployer ==true
          ? previousEmployerDescription ==""
          : previousEmployer ==false
            ? false
            : true)
        ? true
        : false;
    this.setState({ showError: showErrors });

    let presentationInfoDetails = { ...this.state };

    return { showErrors, presentationInfoDetails };
  };

  getCandSubPresentationInfo = (candSubmissionId: string) => {
    this.setState({ showLoader: true });
    axios
      .get(`api/candidates/workflow/${candSubmissionId}/presentationinfo`)
      .then((result) => {
        if (result !=null && result.data !="") {
          this.setState({
            candSubPresentationInfoId: result.data.candSubPresentationInfoId,
            license: result.data.license,
            boardCertificate: result.data.boardCertificate,
            potentialStartDate: result.data.potentialStartDate !="" && result.data.potentialStartDate !=null && result.data.potentialStartDate !=undefined
              ? localDateTime(result.data.potentialStartDate)
              : null,
            scheduleRequested: result.data.scheduleRequested,
            timeOffRequested: result.data.timeOffRequested,
            previousEmployer: result.data.previousEmployer,
            previousEmployerDescription:
              result.data.previousEmployerDescription,
            credentials: result.data.credentials,
            malpractice: result.data.malpractice,
            backgroundClearance: result.data.backgroundClearance,
            permFee: result.data.permFee,
            specialTerms: result.data.specialTerms,
            showLoader: false,
          });

        } else {
          this.setState({
            showLoader: false,
          });
        }

        this.setState({
          cellNumber: FormatPhoneNumber(this.props.candidatePhoneNumber),
          emailAddress: this.props.candidateEmail,
        });
      });
  };

  savePresentationInfo = () => {
    const {
      showErrors,
      presentationInfoDetails,
    } = this.validateField();

    if (showErrors) {
      return false;
    }

    if (presentationInfoDetails.potentialStartDate !=null && presentationInfoDetails.potentialStartDate !=undefined) {
      presentationInfoDetails.potentialStartDate = localDateTime(presentationInfoDetails.potentialStartDate);
    }

    let data = {
      candSubmissionId: this.props.candSubmissionId,
      isSubmit: false,
      ...presentationInfoDetails,
    };

    axios.put("api/candidates/presentationinfo", JSON.stringify(data)).then((res) => {
      successToastr(PRESENTATION_SAVE_SUCCESS_MSG);

      if (res.data && res.data.responseCode=="CSU"){
        this.props.showAlertBox();
      }
      this.getCandSubPresentationInfo(this.props.candSubmissionId);
    });
  }

  render() {
    return (
      <>
        <div>
          {this.state.showLoader && <SkeletonWidget />}
          {!this.state.showLoader && this.props.isEnable && (
            <PresentationSave
              data={this.state}
              handleChange={this.handleChange}
              handleDropdownChange={this.handleDropdownChange}
              handleRadioBtnChange={this.handleRadioBtnChange}
            />
          )}
          {!this.state.showLoader && !this.props.isEnable && (
            <PresentationView
              data={this.state}
              candidateSubStatusIntId={this.props.candidateSubStatusIntId}
              handleChange={this.handleChange}
              handleDropdownChange={this.handleDropdownChange}
              handleRadioBtnChange={this.handleRadioBtnChange}
              discardChanges={(candSubmissionId) => this.getCandSubPresentationInfo(candSubmissionId)}
              saveChanges={() => this.savePresentationInfo()}
              candSubmissionId={this.props.candSubmissionId}
            />
          )}
        </div>
      </>
    );
  }
}

export default CandSubPresentationInfo;
