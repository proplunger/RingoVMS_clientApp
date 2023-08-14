import * as React from "react";
import { Component } from "react";
import { Link } from "react-router-dom";
import { history, GlobalProps, errorToastr } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Register.css";
import { Form, ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { ERROR_MSG } from "../../Shared/AppMessages";
import auth from "../../Auth";
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import ReactTooltip from "react-tooltip";
import { faInfoCircle, faInfo } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { APP_HOME_URL } from "../../Shared/ApiUrls";

export interface RegisterProps {
    location: any;
}

export interface RegisterState {
    firstName: string;
    lastName: string;
    email: string;
    code: string;
    phoneNumber: string;
    userName: string;
    password: string;
    confirmPassword: string;
    errorMessage: any;
    submitted: boolean;
}

const loadingPanel = (
    <div className="k-loading-mask">
        <span className="k-loading-text">Loading</span>
        <div className="k-loading-image"></div>
        <div className="k-loading-color"></div>
    </div>
);

class Register extends React.Component<RegisterProps, RegisterState> {
    constructor(props: RegisterProps) {
        super(props);
        console.log(this.props.location);
        var params = new URLSearchParams(this.props.location.search);
        this.state = {
            firstName: "",
            lastName: "",
            email: params.get("email"),
            code: params.get("code"),
            userName: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            errorMessage: [],
            submitted: false,
        };
    }

    componentDidMount() {
        this.confirmInvite();
    }

    confirmInvite() {
        const { email, code } = this.state;
        if (email && code) {
            axios.get(`/api/accounts/confirminvite?email=${email}&code=${code}`)
                .then(res => {
                    if (res.data.succeeded) {
                        let data = res.data.data;
                        let change = { firstName: data.firstName, lastName: data.lastName, userName: data.userName };
                        this.setState(change);
                    }
                    else {
                        errorToastr(res.data.errors[0]);
                        setTimeout(() => {
                            window.close();
                        }, 1000);
                    }
                });
        } else {
            history.push("/404");
        }
    }

    handleChange(e, modelProp) {
        var stateObj = {};
        stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
        this.setState(stateObj);
    }

    handleSubmit(fields) {
        this.setState({
            submitted: true,
        });
        var requestBody = {
            FirstName: fields.firstName,
            LastName: fields.lastName,
            Email: fields.email,
            UserName: fields.userName,
            Password: fields.password,
            ConfirmPassword: fields.confirmPassword,
            PhoneNumber: fields.phoneNumber.replace(/\D+/g, ""),
        };
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        };

        fetch(`/api/accounts/internal/register`, requestOptions)
            .then(function (response) {
                return response.json();
            })
            .then(
                (result) => {
                    console.log(result);
                    if (result.isUserValid) {
                        auth.login(() => {
                            auth.setUserContext(result);
                            if (result.isTnCAccepted) {
                                history.push(APP_HOME_URL);
                            }
                            else {
                                history.push('/accounts/tnc');
                            }
                        });
                    } else if (!result.succeeded) {
                        this.setState({
                            errorMessage: result.errorMessage,
                        });
                    }
                    this.setState({
                        submitted: false,
                    });
                },
                (error) => {
                    console.log(error);
                    toast.error(ERROR_MSG);
                    this.setState({
                        submitted: false,
                    });
                }
            );
    }

    handleExternalRegister(provider) {
        window.location.href = "/api/accounts/external/login?provider=" + provider;
    }

    render() {
        return (
            <div>
                {this.state.submitted && loadingPanel}
                {this.state.firstName &&
                    <div className="d-flex justify-content-center">
                        <div className="mt-2">
                            <Formik
                                initialValues={this.state}
                                validationSchema={Yup.object().shape({
                                    // firstName: Yup.string().required("First Name is required"),
                                    // lastName: Yup.string().required("Last Name is required"),
                                    // email: Yup.string().email("Email is invalid").required("Email is required"),
                                    //userName: Yup.string().required("User Name is required"),
                                    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
                                    confirmPassword: Yup.string()
                                        .oneOf([Yup.ref("password"), null], "Passwords must match")
                                        .required("Confirm Password is required"),
                                    // phoneNumber: Yup.string()
                                    //     .required("Phone Number is required")
                                    //     .matches(/^(\d{3})-\d{3}-\d{4}$/, "Phone Number is invalid"),
                                })}
                                onSubmit={(fields) => this.handleSubmit(fields)}
                                render={({ errors, touched }) => (
                                    <Form translate>
                                        <div className="row">
                                            <div className="col-11 col-sm-6 col-lg-5 col-xl-4 mx-auto pl-0 pr-0 shadow">
                                                <div className="row mt-2 ml-0 mr-0">
                                                    <div className="col-12 d-flex justify-content-center mt-3">
                                                        <img className="ringo-logo" src={require("../../../assets/images/ringo_login.png")} alt="logo" />
                                                    </div>
                                                </div>

                                                <div className="row ml-0 mr-0 ">
                                                    <div className="register col-11 mx-auto">
                                                        <div className="row justify-content-center ml-0 mr-0">
                                                            <p className="font-medium mt-4 font-weight-normal text-white">Welcome to RINGO</p>
                                                            <h6 className="col-11 col-md-11 text-center font-weight-normal pt-2 text-white">
                                                                Register With
                                                            </h6>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="row ml-0 mr-0 mt-1 justify-content-center">
                                                                    <a
                                                                        className="login100-social-item text-primary"
                                                                        onClick={() => this.handleExternalRegister("Facebook")}
                                                                        title="Facebook"
                                                                        style={{ color: "#45619d" }}
                                                                    >
                                                                        <FontAwesomeIcon icon={["fab", "facebook-f"]} />
                                                                    </a>
                                                                    <a
                                                                        className="login100-social-item"
                                                                        onClick={() => this.handleExternalRegister("Google")}
                                                                        title="Google"
                                                                    >
                                                                        <img
                                                                            src="https://colorlib.com/etc/lf/Login_v9/images/icons/icon-google.png"
                                                                            alt="GOOGLE"
                                                                        />
                                                                    </a>
                                                                    <a
                                                                        className="login100-social-item"
                                                                        onClick={() => this.handleExternalRegister("Microsoft")}
                                                                        title="Microsoft"
                                                                    >
                                                                        <img
                                                                            src="https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.133/static/media/microsoft-logo.319d9b9a.svg"
                                                                            alt="LinkedIn"
                                                                        />
                                                                    </a>
                                                                    <a
                                                                        className="login100-social-item text-primary"
                                                                        onClick={() => this.handleExternalRegister("LinkedIn")}
                                                                        title="LinkedIn"
                                                                        style={{ color: "#3b77b7" }}
                                                                    >
                                                                        <FontAwesomeIcon icon={["fab", "linkedin-in"]} />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row justify-content-center ml-0 mr-0">
                                                            <p className="col-11 col-md-11 text-center font-weight-normal pt-2 text-white">OR</p>
                                                        </div>
                                                        <div className="row mt-1 justify-content-center">
                                                            <div className="col-12 col-md-12">
                                                                <label className="mt-1 mb-1 text-light">First Name : {this.state.firstName}</label>
                                                            </div>
                                                            <div className="col-12 col-md-12">
                                                                <label className="mt-2 mb-1 text-light">Last Name : {this.state.lastName}</label>
                                                            </div>

                                                            <div className="col-12 col-md-12">
                                                                <label className="mt-2 mb-1 text-light">Email : {this.state.email}</label>
                                                            </div>

                                                            <div className="col-12 col-md-12">
                                                                <label className="mt-2 mb-1 text-light">Username : {this.state.userName}</label>
                                                                {/* <Field
                                                                    name="userName"
                                                                    type="text"
                                                                    className={
                                                                        "form-control font-medium text-light placeholder placeholder-brd" +
                                                                        (errors.userName && touched.userName ? " is-invalid" : "")
                                                                    }
                                                                    placeholder="Enter Your User Name"
                                                                />
                                                                <ErrorMessage name="userName" component="div" className="invalid-feedback" /> */}
                                                            </div>
                                                            <div className="col-12 col-md-12">
                                                                <label className="mt-2 mb-1 required text-light">Password</label>
                                                                <ReactTooltip
                                                                    place={"right"}
                                                                    effect={"solid"}
                                                                    multiline={true}
                                                                    backgroundColor={"white"}
                                                                    type={"success"}
                                                                    border={true}
                                                                    className="tooltipCls"
                                                                    borderColor={"#FE988D"}
                                                                    textColor="black"
                                                                    id={"legendTooltip"}
                                                                >
                                                                    <label>Passwords must be at least 6 characters</label>
                                                                    <label>Passwords must have at least one lowercase ('a'-'z')</label>
                                                                    <label>Passwords must have at least one uppercase ('A'-'Z')</label>
                                                                    <label>Passwords must have at least one digit ('0'-'9')</label>
                                                                    <label>Passwords must have at least one non alphanumeric character</label>
                                                                </ReactTooltip>
                                                                <FontAwesomeIcon
                                                                    icon={faInfoCircle}
                                                                    className={"ml-2 text-white"}
                                                                    data-tip
                                                                    data-for={"legendTooltip"}
                                                                />
                                                                <Field
                                                                    name="password"
                                                                    type="password"
                                                                    placeholder="Enter Your Password"
                                                                    className={
                                                                        "form-control font-medium text-light placeholder placeholder-brd" +
                                                                        (errors.password && touched.password ? " is-invalid" : "")
                                                                    }
                                                                />
                                                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                                            </div>
                                                            <div className="col-12 col-md-12">
                                                                <label className="mt-2 mb-1 required text-light">Confirm Password</label>
                                                                <Field
                                                                    name="confirmPassword"
                                                                    type="password"
                                                                    placeholder="Enter Your Confirm Password"
                                                                    className={
                                                                        "form-control font-medium text-light placeholder placeholder-brd" +
                                                                        (errors.confirmPassword && touched.confirmPassword ? " is-invalid" : "")
                                                                    }
                                                                />
                                                                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                                                            </div>
                                                            <div className="col-12 col-md-12 ml-0 mr-0 text-center justify-content-center align-items-center mt-5 mb-3">
                                                                <button type="submit" className="btn button button-signin font-weight-bold mb-2">
                                                                    Sign Up
                                                                </button>
                                                                {this.state.errorMessage &&
                                                                    this.state.errorMessage.map((error, index) => (
                                                                        <span key={index} className="errorMessage">
                                                                            {error}
                                                                            <br />
                                                                        </span>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="row">
                                        <div className="col-12">
                                            <div className="row ml-0 mr-0 mt-3 justify-content-center">
                                                <a className="login100-social-item text-primary" onClick={() => this.handleExternalRegister('Facebook')} title="Facebook" style={{ color: '#45619d' }}>
                                                    <FontAwesomeIcon icon={["fab", "facebook-f"]} />
                                                </a>
                                                <a className="login100-social-item" onClick={() => this.handleExternalRegister('Google')} title="Google">
                                                    <img src="https://colorlib.com/etc/lf/Login_v9/images/icons/icon-google.png" alt="GOOGLE" />
                                                </a>
                                                <a className="login100-social-item" onClick={() => this.handleExternalRegister('Microsoft')} title="Microsoft">
                                                    <img src="https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.133/static/media/microsoft-logo.319d9b9a.svg" alt="LinkedIn" />
                                                </a>
                                                <a className="login100-social-item text-primary" onClick={() => this.handleExternalRegister('LinkedIn')} title="LinkedIn" style={{ color: '#3b77b7' }}>
                                                    <FontAwesomeIcon icon={["fab", "linkedin-in"]} />
                                                </a>
                                            </div>
                                        </div>
                                    </div> */}

                                                <div className="col-12 mx-auto mt-3 mb-3 text-center d-block d-md-none font-medium font-weight-bold">
                                                    Copyright {new Date().getFullYear()}, All rights reserved by Ringo
                                                </div>
                                                <div className="col-12 mx-auto text-center mt-3 mb-3 d-none d-md-block font-medium font-weight-bold">
                                                    Copyright {new Date().getFullYear()}, All rights reserved by Ringo
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            />
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Register;
