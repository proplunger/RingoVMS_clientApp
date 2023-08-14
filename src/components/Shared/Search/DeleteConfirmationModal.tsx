import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faTimesCircle,
    faTimes,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ErrorComponent } from "../../ReusableComponents";

export interface DeleteConfirmationModalProps {
    showModal: boolean;
    message: any;
    handleYes: any;
    handleNo: any;


    commentTitle?: string;
    enterComments?: boolean;
    commentsRequired?: boolean;

    radioSelection?: boolean;
    radioBtnTitle?: any;
    radioBtnYesTitle?: any;
    radioBtnNoTitle?: any;
    title?: any;
}

export interface DeleteConfirmationModalState {
    showModal: boolean;
    isNameClearFee?: boolean;
    comments?: string;
    showError?: boolean;
}

export class DeleteConfirmationModal extends React.Component<
    DeleteConfirmationModalProps,
    DeleteConfirmationModalState
> {
    private commentsLabelClass = "mb-1 font-weight-bold required";
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            isNameClearFee: false,
            comments: ""
        };
        if (!this.props.commentsRequired) {
            this.commentsLabelClass = "mb-1 font-weight-bold";
        }
    }

    handleCommentChange = (e) => {
        this.setState({ comments: e.target.value });
    };

    handleRadioBtnChange = (e) => {
        this.setState({ isNameClearFee: e.target.value=="true" ? true : false });
    };

    handleYes = () => {
        const { comments, isNameClearFee, showError } = this.state;
        let showErrors = this.props.commentsRequired
            ? comments ==""
                ? true
                : false
            : false;
        this.setState({ showError: showErrors });
        if (!showErrors) {
            this.props.handleYes({ isNameClearFee, comments });
        }
    };

    render() {
        return (
            <>
                {this.props.showModal && (
                    <div className="containerDialog">
                        <div className="containerDialog-animation">
                            <div className="col-11 col-sm-8 col-md-6 col-lg-4 shadow containerDialoginside containerDialoginside-popup">
                                <div className="row blue-accordion">
                                    <div className="col-12  pt-2 pb-2 fontFifteen">
                                        <span className="float-left" >    {"Confirmation"}</span>
                                        <span className="float-right" onClick={this.props.handleNo}>
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                        </span>
                                    </div>
                                </div>
                                <div className="row text-center ml-0 mr-0">
                                    <div className="col-12 col-sm-11 mx-auto mt-2 mt-lg-4">
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            className="mr-1 circle-red shadow rounded-circle"
                                        />
                                    </div>
                                    <div className="col-12 col-sm-11 mx-auto text-dark mt-2 mt-lg-3 text-center">
                                        {this.props.message}
                                    </div>
                                </div>


                                <div className="row mb-2 mb-lg-4 ml-0 mr-0 d-none d-lg-block">
                                    <div className="col-12 mt-4 text-sm-center text-right font-regular">
                                        <button
                                            type="button"
                                            onClick={this.props.handleNo}
                                            className="btn button button-close mr-2 pl-3 pr-3 shadow mb-2 mb-xl-0"
                                        >
                                            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                      Cancel
                    </button>
                                        <button
                                            type="button"
                                            onClick={this.handleYes}
                                            className="btn button button-bg pl-3 pr-3 shadow mb-2 mb-xl-0"
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                      OK
                    </button>
                                    </div>
                                </div>
                                <div className="row text-center d-block d-lg-none">
                                    <div className="col-12 mt-3 mb-3 text-cenetr font-regular">
                                        <button
                                            type="button"
                                            onClick={this.props.handleNo}
                                            className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                                        >
                                            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                      Cancel
                    </button>
                                        <button
                                            type="button"
                                            onClick={this.handleYes}
                                            className="btn button button-bg shadow mb-2 mb-xl-0"
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                      OK
                    </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default DeleteConfirmationModal;
