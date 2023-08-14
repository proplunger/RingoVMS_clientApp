import React, { Component } from "react";
import { ILoginState } from "./ILoginState";
import { history, GlobalProps, errorToastr } from "../../../HelperMethods";
import "./LoginStyles.css";
import { ApplicationState } from "../../../store";
import * as GlobalStore from "../../../store/Global";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import auth from "../../Auth";
import { toast } from "react-toastify";
import { ERROR_MSG } from "../../Shared/AppMessages";
import * as jwt_decode from "jwt-decode";
import { APP_HOME_URL } from "../../Shared/ApiUrls";
import { BASE_URL } from "../../Shared/AppConstants";

const loadingPanel = (
    <div className="k-loading-mask">
        <span className="k-loading-text">Loading</span>
        <div className="k-loading-image"></div>
        <div className="k-loading-color"></div>
    </div>
);

export class Login extends Component<GlobalProps, ILoginState> {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
            submitted: false,
            errorMessage: "",
            rememberMe: true,
        };

        // localStorage.removeItem('user');
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        var rememberMe = localStorage.getItem("rememberme");
        if (rememberMe=="true") {
            let userName = localStorage.getItem("userName");
            if (userName) {
                this.setState({ userName: userName, password: "" , rememberMe: true});
            }
        }else{
            this.setState({ rememberMe: false});
        }
    }

    handleChange(e, modelProp) {
        var stateObj = {};
        stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
        this.setState(stateObj);
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.password !="" && this.state.userName !="") {
            this.internalLogin();
        } else {
            this.setState({
                errorMessage: "Please fill in the mandatory data before submitting.",
            });
        }
    }

    handleExternalLogin(provider) {
        window.location.href = BASE_URL+"/api/accounts/external/login?provider=" + provider;
    }

    handleSignUp() { }

    forgotPassword() {
        history.push("/forgotpassword");
    }

    render() {
        return (
            <div>
                {this.state.submitted && loadingPanel}
                <div className="d-flex justify-content-center containerr">
                    <div className="mt-2">
                        <form>
                            <div className="row">
                                <div className="col-11 col-sm-8 col-md-6 col-lg-5 mx-auto pl-0 pr-0 shadow">
                                    <div className="row mt-2 ml-0 mr-0">
                                        <div className="col-12 d-flex justify-content-center mt-3">
                                            <img className="ringo-logo" src={require("../../../assets/images/ringo_login.png")} alt="logo" />
                                        </div>
                                    </div>
                                    <div className="login col-11 mx-auto">
                                        <div className="row justify-content-center ml-0 mr-0">
                                            <p className="font-medium mt-4 font-weight-normal text-white">Welcome to RINGO</p>
                                            <h6 className="col-11 col-md-11 text-center font-weight-normal pt-2 text-white">Sign In With</h6>
                                        </div>

                                        <div className="row">
                                            <div className="col-12">
                                                <div className="row mt-2 justify-content-center">
                                                    <a
                                                        className="login100-social-item text-primary"
                                                        onClick={() => this.handleExternalLogin("Facebook")}
                                                        title="Facebook"
                                                        style={{ color: "#45619d" }}
                                                    >
                                                        <FontAwesomeIcon icon={["fab", "facebook-f"]} />
                                                    </a>
                                                    <a
                                                        className="login100-social-item"
                                                        onClick={() => this.handleExternalLogin("Google")}
                                                        title="Google"
                                                    >
                                                        <img src="https://colorlib.com/etc/lf/Login_v9/images/icons/icon-google.png" alt="GOOGLE" />
                                                    </a>
                                                    <a
                                                        className="login100-social-item"
                                                        onClick={() => this.handleExternalLogin("Microsoft")}
                                                        title="Microsoft"
                                                    >
                                                        <img
                                                            src="https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.133/static/media/microsoft-logo.319d9b9a.svg"
                                                            alt="LinkedIn"
                                                        />
                                                    </a>
                                                    <a
                                                        className="login100-social-item text-primary"
                                                        onClick={() => this.handleExternalLogin("LinkedIn")}
                                                        title="LinkedIn"
                                                        style={{ color: "#3b77b7" }}
                                                    >
                                                        <FontAwesomeIcon icon={["fab", "linkedin-in"]} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center ml-0 mr-0">
                                            <p className="font-medium mt-1 font-weight-normal text-white">OR</p>
                                        </div>

                                        <div className="row justify-content-center">
                                            <div className="col-12 col-md-12">
                                                <label className="mt-1 mb-1 required text-light">Username</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="form-control font-medium text-light placeholder placeholder-brd"
                                                    value={this.state.userName}
                                                    placeholder="Enter Your Username"
                                                    onChange={(e) => this.handleChange(e, "userName")}
                                                />
                                            </div>
                                            <div className="col-12 col-md-12">
                                                <label className="mt-3 mb-1 required text-light">Password</label>
                                                <input
                                                    type="password"
                                                    required
                                                    className="form-control font-medium text-light placeholder placeholder-brd"
                                                    value={this.state.password}
                                                    placeholder="Enter Your Password"
                                                    onChange={(e) => this.handleChange(e, "password")}
                                                />
                                            </div>

                                            <div className="col-12 col-md-12 ml-0 mr-0 mt-2 ml-3">
                                                <div className="row ml-0 mr-0">
                                                    <div className="col-6 text-right pl-0">
                                                        <label className="container-R d-flex">
                                                            <input
                                                                type="checkbox"
                                                                className="mr-3"
                                                                checked={this.state.rememberMe}
                                                                onChange={(e) => this.handleChange(e, "rememberMe")}
                                                            />
                                                            <span className="ml-1 fontTwelve text-white">Remember me</span>
                                                            <span className="checkmark-R check"></span>
                                                        </label>
                                                    </div>
                                                    <div className="col-6 text-right pl-0 fontTwelve">
                                                        <label>
                                                            <Link to="/forgotpassword">
                                                                <span className="fontTwelve">Forgot Password?</span>
                                                            </Link>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-12 mt-3 mb-0 ml-0 mr-0 text-center justify-content-center align-items-center mt-3">
                                                <button
                                                    type="submit"
                                                    className="btn button button-signin font-weight-bold mb-2"
                                                    onClick={this.handleSubmit}
                                                >
                                                    Sign In
                                                </button>
                                                <Link style={{ display: "block" }} className="invisible" to="/sendregistration">
                                                    Send Registration Link
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-md-12 mt-2 mb-0 text-center justify-content-center align-items-center mt-2 pl-0 pr-0">
                                                {this.state.errorMessage && <span className="errorMessage">{this.state.errorMessage}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 mx-auto mt-3 mb-3 text-center d-block d-md-none font-medium font-weight-bold">
                                        Copyright {new Date().getFullYear()}, All rights reserved by Ringo
                                    </div>
                                    <div className="col-12 mx-auto text-center mt-3 mb-3 d-none d-md-block font-medium font-weight-bold">
                                        Copyright {new Date().getFullYear()}, All rights reserved by Ringo
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // public componentWillMount() {
    //     if (localStorage.getItem("user")) {
    //         history.push(APP_HOME_URL);
    //     }
    // }

    internalLogin = () => {
        this.setState({ submitted: true });
        var requestBody = {
            UserName: this.state.userName,
            Password: this.state.password,
            RememberMe: this.state.rememberMe,
        };
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        };
        fetch(BASE_URL + `/api/accounts/internal/login`, requestOptions)
            .then(function (response) {
                return response.json();
            })
            .then(
                (user) => {

                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    if (user.isUserValid) {
                       document.cookie=user.client
                        sessionStorage.setItem("reloaded", "yes");
                        localStorage.setItem('logged-in', "yes");
                        sessionStorage.setItem('logged-in', "yes");
                        var userPayLoad: GlobalStore.GlobalState = {
                            CurrentPageName: "Submitted Timesheets",
                            LoginUserName: user.userFullName,
                            UserClientName: user.client,
                            CurrentPageTitle:""
                        };
                        this.props.updateUserDetails(userPayLoad);
                        var urlParams = new URLSearchParams(window.location.search);
                        var returnUrl = urlParams.get("returnUrl");

                        // var permissions = jwt_decode(user.token).Permissions;
                        auth.login(() => {
                            // localStorage.setItem("permissions", user.permissions);
                            // delete user.permissions;
                            // localStorage.setItem("user", JSON.stringify(user));
                            localStorage.setItem("rememberme", this.state.rememberMe.toString());
                            // localStorage.setItem("UserClientId", user.defaultClient);
                            // localStorage.setItem("UserClient", user.client);
                            // localStorage.setItem("vendorId", user.defaultVendor);
                            // localStorage.setItem("candidateId", user.candidateId);
                            // localStorage.setItem("candSubmissionId", user.candSubmissionId);
                            auth.setUserContext(user);
                            if (user.isTnCAccepted) {
                                let { from } = this.props.location.state || { from: { pathname: "/" } };
                                if (from.pathname=="/") {
                                    this.props.history.push(APP_HOME_URL);
                                } else {
                                    this.props.history.push(from);
                                }
                            }
                            else {
                                this.props.history.push('/accounts/tnc');
                            }
                        });

                    } else if (user.hasOwnProperty('Success') && !user.Success) {
                        errorToastr(user.Message);
                        this.setState({ submitted: false });
                    } else {
                        this.setState({
                            submitted: false,
                            errorMessage: user.errorMessage,
                        });
                    }
                },
                (error) => {
                    this.setState({
                        submitted: false,
                    });
                    errorToastr(ERROR_MSG);
                }
            );
    };
}

export default connect(
    (state: ApplicationState) => state.global, // Selects which state properties are merged into the component's props
    GlobalStore.actionCreators // Selects which action creators are merged into the component's props
)(Login as any);
