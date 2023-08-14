import * as React from "react";
import axios from "axios";
import SkeletonWidget from "../../Shared/Skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../Shared/withValueField";
import { ErrorComponent } from "../../ReusableComponents";
import { RISK_FACTOR_TITLE, RISK_DISCLAMER } from "../AppMessages";
import { emailPattern } from "../AppConstants";
const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select", id: null };
const emailRegex = /^[^@]+@[^@]{2,}\.[^@]{2,}$/;
export interface CandidateRiskInfoProps {
    candSubmissionId: any;
    candidateEmail?: any;
    isEnableRisk?: boolean;
}

export interface CandidateRiskInfoState {
    showLoader: boolean;
    showError: boolean;
    candSubRiskInfoId?: any;
    riskFactor: boolean;
    providerEmail: string;
    riskFactorIssue: string;
    isEnableRisk: boolean;
}

class CandidateRiskInfo extends React.Component<CandidateRiskInfoProps, CandidateRiskInfoState> {
    constructor(props: CandidateRiskInfoProps) {
        super(props);
        this.state = {
            showLoader: true,
            showError: false,
            riskFactor: null,
            providerEmail: "",
            riskFactorIssue: "",
            isEnableRisk: true,
        };
    }

    componentDidMount() {
        this.setState({ showLoader: false });
        this.getCandSubRiskInfo(this.props.candSubmissionId);
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
        // if (e.target.name=="providerEmail") {

        //     this.setState({ showError: !this.validateEmail(e.target.value) })
        // }
        this.validateField();
    };

    validateField = () => {
        const { riskFactor, providerEmail, riskFactorIssue, showError } = this.state;

        //         if(riskFactor ==true){
        //             if(providerEmail != "")
        //             {
        //                 if(emailPattern.test(this.state.providerEmail) ==false){
        // debugger
        //                 }
        //             }else if( providerEmail ==""){

        //             }
        //         }
        let showErrors = riskFactor ==null ||
            (riskFactor ==true
                ? (providerEmail != "" ? emailRegex.test(this.state.providerEmail) ==false : providerEmail =="") ||
                riskFactorIssue.replace(/ +/g, "") ==""
                : riskFactor ==false
                    ? false
                    : true)
            ? true
            : false;
        this.setState({ showError: showErrors });

        let riskInfoDetails = {
            candSubRiskInfoId: this.state.candSubRiskInfoId,
            providerEmail: this.state.providerEmail,
            riskFactorIssue: this.state.riskFactorIssue,
            riskFactor: this.state.riskFactor,
        };

        return { showErrors, riskInfoDetails };
    };

    getCandSubRiskInfo = (candSubmissionId: string) => {
        this.setState({ showLoader: true });
        axios.get(`api/candidates/workflow/${candSubmissionId}/riskinfo`).then((result) => {
            if (result !=null && result.data !="") {
                this.setState({
                    candSubRiskInfoId: result.data.candSubRiskInfoId,
                    providerEmail: result.data.providerEmail,
                    riskFactorIssue: result.data.riskFactorIssue,
                    riskFactor: result.data.riskFactor,
                    showLoader: false,
                });
            } else {
                this.setState({
                    providerEmail: this.props.candidateEmail,
                    showLoader: false,
                });
            }
        });
    };

    render() {
        return (
            <>
                <div>
                    {this.state.showLoader && <SkeletonWidget />}
                    {!this.state.showLoader && (
                        <div className="">
                            <div className="row text-dark">
                                <div className="col-12 pl-0 pr-0">
                                    <div className="row mx-auto">
                                        <div className="col-12 col-sm-auto col-lg-4 mt-1 mt-sm-0">
                                            <label className="required">
                                                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                                <span className="font-weight-bold">{RISK_FACTOR_TITLE}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row mx-auto">
                                        <div className="col-auto col-lg-2">
                                            <CustomDropDownList
                                                className="form-control disabled "
                                                name={`riskFactor`}
                                                data={[
                                                    { id: true, name: "Yes" },
                                                    { id: false, name: "No" },
                                                ]}
                                                textField="name"
                                                valueField="id"
                                                value={this.state.riskFactor}
                                                defaultItem={defaultItem}
                                                onChange={(e) => this.handleDropdownChange(e)}
                                                disabled={!this.props.isEnableRisk}
                                            />
                                            {this.state.showError && this.state.riskFactor ==null ? <ErrorComponent /> : null}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 mt-3">
                                            <div className="row mx-auto">
                                                <div className="col-12 col-sm-12 col-lg-12 mt-1 mt-sm-0">
                                                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                                    <span className="font-weight-bold">{RISK_DISCLAMER}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 mt-3">
                                            <div className="row mx-auto">
                                                <div className="col-12 col-sm-6 col-lg-4 mt-1 mt-sm-0">
                                                    <label className="mb-2 text-dark required font-weight-bold">Risk Factor Issue</label>
                                                    <textarea
                                                        name="riskFactorIssue"
                                                        onChange={(e) => this.handleChange(e)}
                                                        value={this.state.riskFactor ? this.state.riskFactorIssue : ""}
                                                        maxLength={2000}
                                                        className="form-control disabled"
                                                        placeholder="Enter Risk Factor Issue"
                                                        disabled={this.props.isEnableRisk ? !this.state.riskFactor : !this.props.isEnableRisk}
                                                    />
                                                    {this.state.showError && this.state.riskFactorIssue.replace(/ +/g, "") =="" ? (
                                                        <ErrorComponent />
                                                    ) : null}
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-4 mt-sm-0">
                                                    <label className="mb-2 text-dark required font-weight-bold">Provider Email</label>
                                                    <input
                                                        type="email"
                                                        name="providerEmail"
                                                        className="form-control disabled"
                                                        placeholder="Enter Email"
                                                        value={this.state.riskFactor ? this.state.providerEmail : ""}
                                                        maxLength={100}
                                                        onChange={(e) => this.handleChange(e)}
                                                        disabled={this.props.isEnableRisk ? !this.state.riskFactor : !this.props.isEnableRisk}
                                                    />
                                                    {this.state.riskFactor &&
                                                        this.state.showError &&
                                                        (this.state.providerEmail != "" && emailPattern.test(this.state.providerEmail) ==false ? (
                                                            <div role="alert" className="k-form-error k-text-start">
                                                                Provider email is invalid.
                                                            </div>
                                                        ) : (
                                                            this.state.providerEmail.replace(/ +/g, "") =="" &&
                                                            this.state.showError && <ErrorComponent />
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    }
}

export default CandidateRiskInfo;
