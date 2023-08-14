import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowRight, faCheckCircle, faCheck, faTimesCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage } from "formik";
import { ErrorComponent, HrsErrorComponent } from "../ReusableComponents";

export interface ConfirmationMessageModalProps {
    showModal: boolean;
    message: any;
    handleClose: any;
    title?: any;
}

export interface ConfirmationMessageModalState {
    showModal: boolean;
}

export class ConfirmationMessageModal extends React.Component<ConfirmationMessageModalProps, ConfirmationMessageModalState> {

    render() {
        return (
            <div className="">
                {this.props.showModal && (
                    <div className="containerDialog">
                        <div className="containerDialog-animation">
                            <div className="col-10 col-sm-7 col-xl-4 shadow containerDialoginside">
                                <div className="row blue-accordion">
                                    <div className="col-12  pt-2 pb-2 fontFifteen">
                                        {this.props.title}
                                        <span className="float-right" onClick={this.props.handleClose}>
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                            {/* <i className="far fa-arrow-right mr-2 "></i> */}
                                        </span>
                                    </div>
                                </div>
                                <div className="row text-center">
                                    <div className="col-12 text-dark mt-4 pl-2 pr-2">{this.props.message}</div>
                                </div>
                                <div className="row ml-0 mr-0">
                                    <div className="col-12 mt-4 mb-4 text-center font-regular">
                                        <button
                                            type="button"
                                            onClick={this.props.handleClose}
                                            className="btn button button-close mr-2 shadow mb-2 mb-xl-0">
                                            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                                        Close
                                    </button>

                                    </div>
                                </div>
                                {/* <div className="row text-center d-block d-lg-none">
                                <div className="col-12 mt-2 mb-3 text-cenetr font-regular">
                                    <button
                                        type="button"
                                        onClick={this.props.handleNo}
                                        className="btn button button-close mr-2 shadow"
                                    >
                                        <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                                        No
                                    </button>
                                    <button type="button" onClick={this.props.handleYes} className="btn button button-bg shadow">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                        Yes
                                    </button>
                                </div>
                            </div> */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ConfirmationMessageModal;
