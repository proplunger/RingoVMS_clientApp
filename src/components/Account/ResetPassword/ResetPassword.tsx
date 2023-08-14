import * as React from "react";
import { Component } from "react";
import { history, GlobalProps, successToastr } from "../../../HelperMethods";
import { Form, ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { RESET_PASSWORD_SUCCESS_MSG, ERROR_MSG } from "../../Shared/AppMessages";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faInfo } from "@fortawesome/free-solid-svg-icons";

import "../ResetPassword/ResetPassword.css";
import ReactTooltip from "react-tooltip";
export interface ResetPasswordProps {}

export interface ResetPasswordState {
    userName: string;
    password: string;
    confirmPassword: string;
    code: string;
    submitted: boolean;
    errorMessage: any;
}

const loadingPanel = (
    <div className="k-loading-mask">
        <span className="k-loading-text">Loading</span>
        <div className="k-loading-image"></div>
        <div className="k-loading-color"></div>
    </div>
);

class ResetPassword extends React.Component<{ location: any }, ResetPasswordState> {
    constructor(props) {
        super(props);
        console.log(this.props.location);
        var params = new URLSearchParams(this.props.location.search);
        this.state = {
            userName: "",
            password: "",
            confirmPassword: "",
            code: params.get("code"),
            submitted: false,
            errorMessage: [],
        };
    }

    handleSubmit(fields) {
        this.setState({
            submitted: true,
        });
        var requestBody = {
            UserName: fields.userName,
            Password: fields.password,
            ConfirmPassword: fields.confirmPassword,
            Code: this.state.code,
        };
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        };

        fetch(`/api/accounts/internal/password/reset`, requestOptions)
            .then(function (response) {
                return response.json();
            })
            .then(
                (result) => {
                    if (result.succeeded) {
                        successToastr(RESET_PASSWORD_SUCCESS_MSG);
                        history.push("/login");
                    } else if (!result.succeeded) {
                        this.setState({
                            errorMessage: result.errors,
                        });
                    }
                    this.setState({
                        submitted: false,
                    });
                },
                (error) => {
                    this.setState({
                        submitted: false,
                    });
                    toast.error(ERROR_MSG);
                }
            );
    }

    handleChange(event, name) {
        this.state[name] = event.target.value;
        this.setState(this.state);
    }

    render() {
        const { userName, password, confirmPassword } = this.state;
        return (
            <div>
                {this.state.submitted && loadingPanel}
                <div className="d-flex justify-content-center">
                    <div className="mt-2">
                        <Formik
                            initialValues={{ userName, password, confirmPassword }}
                            enableReinitialize
                            validationSchema={Yup.object().shape({
                                userName: Yup.string().required("Username is required"),
                                password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
                                confirmPassword: Yup.string()
                                    .oneOf([Yup.ref("password"), null], "Passwords must match")
                                    .required("Confirm Password is required"),
                            })}
                            onSubmit={(fields) => this.handleSubmit(fields)}
                            render={({ errors, touched }) => (
                                <Form translate>
                                    <div className="row">
                                        <div className="col-11 col-sm-7 col-md-7 col-lg-6 col-xl-5 mx-auto pl-0 pr-0 shadow">
                                            <div className="row mt-2 ml-0 mr-0">
                                                <div className="col-12 d-flex justify-content-center mt-3">
                                                    <img className="ringo-logo" src={require("../../../assets/images/ringo_login.png")} alt="logo" />
                                                </div>
                                            </div>

                                            <div className="reset col-11 mx-auto">
                                                <div className="row justify-content-center ml-0 mr-0">
                                                    <h5 className="col-11 col-md-11 text-center font-weight-normal pt-4 text-white">
                                                        Reset Password
                                                        <p className="font-medium mt-3 font-weight-normal  text-white">Welcome to RINGO</p>
                                                    </h5>
                                                </div>

                                                <div className="row mt-3 justify-content-center">
                                                    <div className="col-12 col-md-12">
                                                        <label className="mb-1 required text-light">Username</label>
                                                        <Field
                                                            name="userName"
                                                            type="text"
                                                            className={
                                                                "form-control font-medium text-light placeholder placeholder-brd" +
                                                                (errors.userName && touched.userName ? " is-invalid" : "")
                                                            }
                                                            placeholder="Enter Your Username"
                                                        />
                                                        <ErrorMessage name="userName" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="col-12 col-md-12">
                                                        <label className="mt-3 mb-1 required text-light">Password</label>
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
                                                            <label className="pl-3 pr-3 pt-3">Passwords must be at least 6 characters</label>
                                                            <label className="pl-3 pr-3">Passwords must have at least one lowercase ('a'-'z')</label>
                                                            <label className="pl-3 pr-3">Passwords must have at least one uppercase ('A'-'Z')</label>
                                                            <label className="pl-3 pr-3">Passwords must have at least one digit ('0'-'9')</label>
                                                            <label className="pl-3 pr-3 pb-3">Passwords must have at least one special character</label>
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
                                                        <label className="mt-3 mb-1 required text-light">Confirm Password</label>
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
                                                    <div className="col-12 col-md-12 ml-0 mr-0 text-center justify-content-center align-items-center mt-5">
                                                        <button type="submit" className="btn button button-signin font-weight-bold mb-4">
                                                            Reset Password
                                                        </button>
                                                        <Link to="/login">Back to Login</Link>
                                                        <br />
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
                                            <div className="col-12 mx-auto mt-3 mb-3 text-center d-block d-md-none font-medium txt-dar-blue">
                                                Copyright {new Date().getFullYear()}, All rights reserved by Ringo
                                            </div>
                                            <div className="col-12 mx-auto mt-3 mb-3 text-center d-none d-md-block font-medium txt-dar-blue">
                                                Copyright {new Date().getFullYear()}, All rights reserved by Ringo
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default ResetPassword;
