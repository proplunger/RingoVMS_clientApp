import * as React from "react";
import { Component } from "react";
import { errorToastr, history, successToastr } from "../../../HelperMethods";
import "../ChangePassword/ChangePassword.css";
import { Link } from "react-router-dom";
import { APP_HOME_URL } from "../../Shared/ApiUrls";
import { Form, ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import accountDataService from "../Service/DataService";
import { CHANGE_PASSWORD, ERROR_MSG } from "../../Shared/AppMessages";

export interface ChangePasswordProps { }

export interface ChangePasswordState {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

class ChangePassword extends React.Component<ChangePasswordProps, ChangePasswordState> {
    constructor(props: ChangePasswordProps) {
        super(props);
        this.state = { oldPassword: "", newPassword: "", confirmPassword: "" };
    }

    handleChange(event, name) {
        this.state[name] = event.target.value;
        this.setState(this.state);
    }

    handleSubmit(data) {
        accountDataService.changePassword(data).then(res => {
            if (res.data && res.data.succeeded) {
                successToastr(CHANGE_PASSWORD);
                history.push(APP_HOME_URL);
            }
            else {
                errorToastr(res.data.errors && res.data.errors.join(',') || ERROR_MSG);
            }
        });
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-center">
                    <div className="shadow-login mt-2">
                        <div className="row mt-2 ml-0 mr-0">
                            <div className="col-12 d-flex justify-content-center mt-3">
                                <img className="ringo-logo" src={require("../../../assets/images/ringo_login.png")} alt="logo" />
                            </div>
                        </div>
                        <Formik
                            initialValues={this.state}
                            validationSchema={Yup.object().shape({
                                oldPassword: Yup.string().min(6, "Password must be at least 6 characters").required("Old Password is required"),
                                newPassword: Yup.string()
                                    .notOneOf([Yup.ref("oldPassword"), null], "Old and New Passwords must be different")
                                    .min(6, "Password must be at least 6 characters").required("New Password is required"),
                                confirmPassword: Yup.string()
                                    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                                    .required("Confirm Password is required"),
                            })}
                            onSubmit={(fields) => this.handleSubmit(fields)}
                            render={({ errors, touched }) => (
                                <Form translate>
                                    <div className="row ml-0 mr-0 ">
                                        <div className="changepass">
                                            <div className="row justify-content-center ml-0 mr-0">
                                                <h5 className="col-11 col-md-11 text-center font-weight-normal pt-4 text-white">
                                                    Change Password
                                                    <p className="font-medium mt-4 font-weight-normaltext-white">Welcome to RINGO</p>
                                                </h5>
                                            </div>
                                            <div className="row ml-0 mr-0 mt-3 justify-content-center">
                                                <div className="col-12 col-md-12">
                                                    <label className="mt-1 required text-light">Old Password</label>
                                                    <Field
                                                        name="oldPassword"
                                                        type="password"
                                                        placeholder="Enter Your Old Password"
                                                        className={
                                                            "form-control font-medium text-light placeholder placeholder-brd" +
                                                            (errors.oldPassword && touched.oldPassword ? " is-invalid" : "")
                                                        }
                                                    />
                                                    <ErrorMessage name="oldPassword" component="div" className="invalid-feedback" />

                                                </div>
                                                <div className="col-12 col-md-12">
                                                    <label className="mt-3 required text-light">New Password</label>
                                                    <Field
                                                        name="newPassword"
                                                        type="password"
                                                        placeholder="Enter Your New Password"
                                                        className={
                                                            "form-control font-medium text-light placeholder placeholder-brd" +
                                                            (errors.newPassword && touched.newPassword ? " is-invalid" : "")
                                                        }
                                                    />
                                                    <ErrorMessage name="newPassword" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="col-12 col-md-12">
                                                    <label className="mt-3 required text-light">Confirm Password</label>
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
                                                    <button
                                                        type="submit"
                                                        className="btn button button-signin font-weight-bold mb-2"
                                                    >
                                                        Change Password
                                            </button>
                                                    <Link to={APP_HOME_URL}>Back to Home</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        />
                        <div className="ml-0 mr-0 text-center  mb-2  mb-sm-0  invisible font-medium txt-dar-blue">
                            Copyright {new Date().getFullYear()}, All rights reserved by Ringo
                        </div>
                        {/* <div className="ml-0 mr-0 mb-2 text-center invisible font-medium txt-dar-blue">
                            Copyright {new Date().getFullYear()}, All rights reserved by Ringo
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default ChangePassword;
