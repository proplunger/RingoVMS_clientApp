import * as React from "react";
import { Component } from "react";
import { history, GlobalProps, successToastr } from "../../../HelperMethods";
import { toast } from "react-toastify";
import { REGISTRATION_LINK_SENT, ERROR_MSG } from "../../Shared/AppMessages";

export interface SendRegistrationLinkProps {}

export interface SendRegistrationLinkState {
    email: string;
    submitted: boolean;
}

const loadingPanel = (
    <div className="k-loading-mask">
        <span className="k-loading-text">Loading</span>
        <div className="k-loading-image"></div>
        <div className="k-loading-color"></div>
    </div>
);

class SendRegistrationLink extends React.Component<SendRegistrationLinkProps, SendRegistrationLinkState> {
    constructor(props: SendRegistrationLinkProps) {
        super(props);
        this.state = { email: "", submitted: false };
    }

    handleChange(event, name) {
        this.state[name] = event.target.value;
        this.setState(this.state);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({
            submitted: true,
        });
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };

        fetch(`/api/accounts/register?EmailId=${this.state.email}`, requestOptions)
            .then(function (response) {
                return response.json();
            })
            .then(
                (result) => {
                    if (result.succeeded) {
                        successToastr(REGISTRATION_LINK_SENT);
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
        return (
            <div>
                {this.state.submitted && loadingPanel}
                <div className="d-flex justify-content-center">
                    <div className="shadow-login mt-2">
                        <div className="row mt-2 ml-0 mr-0">
                            <div className="col-12 d-flex justify-content-center mt-3">
                                <img className="ringo-logo" src={require("../../../assets/images/ringo_login.png")} alt="logo" />
                            </div>
                        </div>
                        <form>
                            <div className="row ml-0 mr-0 ">
                                <div className="login">
                                    <div className="row justify-content-center ml-0 mr-0">
                                        <h5 className="col-11 col-md-11 text-center font-weight-normal pt-5 text-white">
                                            Send Registration Link
                                            <p className="font-medium mt-4 font-weight-normal text-white">Welcome to RINGO</p>
                                        </h5>
                                    </div>
                                    <div className="row ml-0 mr-0 mt-2 justify-content-center">
                                        <div className="col-12 col-md-12">
                                            <label className="mb-1 required text-light">Email</label>
                                            <input
                                                type="text"
                                                required
                                                className="form-control placeholder placeholder-brd"
                                                value={this.state.email}
                                                onChange={(e) => {
                                                    this.handleChange(e, "email");
                                                }}
                                                placeholder="Enter Your Email"
                                            />
                                        </div>

                                        <div className="col-12 col-md-12 ml-0 mr-0 text-center justify-content-center align-items-center mt-5">
                                            <button
                                                type="submit"
                                                className="btn button button-signin font-weight-bold mb-2"
                                                onClick={(e) => {
                                                    this.handleSubmit(e);
                                                }}
                                            >
                                                Send Registration Link
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="ml-0 mr-0 text-center d-block d-md-none font-medium txt-dar-blue">
                            Copyright {new Date().getFullYear()}, All rights reserved by Ringo
                        </div>
                        <div className="mt-2 ml-0 mr-0 mb-2 text-center d-none d-md-block font-medium txt-dar-blue">
                            Copyright {new Date().getFullYear()}, All rights reserved by Ringo
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SendRegistrationLink;
