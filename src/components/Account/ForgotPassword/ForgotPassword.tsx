import * as React from "react";
import { history, GlobalProps, successToastr } from "../../../HelperMethods";
import "./Forgotpassword.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { RESET_PASSWORD_SENT_MSG, ERROR_MSG } from "../../Shared/AppMessages";
import { Link } from "react-router-dom";
export interface ForgotPasswordProps {}

export interface ForgotPasswordState {
    userName: string;
    submitted: boolean;
}

const loadingPanel = (
    <div className="k-loading-mask">
        <span className="k-loading-text">Loading</span>
        <div className="k-loading-image"></div>
        <div className="k-loading-color"></div>
    </div>
);

class ForgotPassword extends React.Component<ForgotPasswordProps, ForgotPasswordState> {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            submitted: false,
        };
    }

    handleSubmit(fields) {
        this.setState({
            submitted: true,
        });

        const requestOptions = {
            method: "Get",
            headers: { "Content-Type": "application/json" },
        };

        fetch(`/api/accounts/internal/password/reset?UserName=${fields.userName}`, requestOptions)
            .then(function (response) {
                return response.json();
            })
            .then(
                (result) => {
                    //debugger;
                    if (result.succeeded) {
                        successToastr(RESET_PASSWORD_SENT_MSG);
                        history.push("/login");
                    } else if (!result.succeeded) {
                        toast.error(result.Errors[0]);
                    }
                    this.setState({
                        submitted: false,
                    });
                },
                (error) => {
                    toast.error(ERROR_MSG);
                    this.setState({
                        submitted: false,
                    });
                }
            );
    }

    render() {
        const { userName } = this.state;
        return (
            <div>
                {this.state.submitted && loadingPanel}
                <div className="d-flex justify-content-center">
                    <div className="mt-2">
                        <Formik
                            initialValues={{ userName }}
                            enableReinitialize
                            validationSchema={Yup.object().shape({
                                userName: Yup.string().required("Username is required"),
                            })}
                            onSubmit={(fields) => this.handleSubmit(fields)}
                            render={({ errors, touched }) => (
                                <Form translate>
                                    <div className="row">
                                        <div className="col-11 col-sm-10 mx-auto pl-0 pr-0 shadow">
                                            <div className="row mt-2 ml-0 mr-0">
                                                <div className="col-12 d-flex justify-content-center mt-3">
                                                    <img className="ringo-logo" src={require("../../../assets/images/ringo_login.png")} alt="logo" />
                                                </div>
                                            </div>

                                            <div className="forgotpass col-11 mx-auto">
                                                <div className="row justify-content-center ml-0 mr-0">
                                                    <h5 className="col-11 col-md-11 text-center font-weight-normal pt-4 text-white">
                                                        Forgot Password
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

                                                    <div className="col-12 col-md-12 ml-0 mr-0 text-center justify-content-center align-items-center mt-5 mb-3">
                                                        <button type="submit" className="btn button button-signin font-weight-bold mb-4">
                                                            Send Email
                                                        </button>
                                                        <Link to="/login">Back to Login</Link>
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

export default ForgotPassword;
