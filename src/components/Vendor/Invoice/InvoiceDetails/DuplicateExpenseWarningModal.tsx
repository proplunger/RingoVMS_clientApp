import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faTimes,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";

export interface DuplicateConfirmationModalProps {
  showModal?: boolean;
  handleYes?: any;
  handleNo?: any;
  data?: any;
  message?: any;
}
interface DuplicateConfirmationModalState {}

export default class DuplicateConfirmationModal extends React.Component<
  DuplicateConfirmationModalProps,
  DuplicateConfirmationModalState
> {
  render() {
    return (
      <div className="">
        {this.props.showModal && (
          <div className="containerDialog bg-primaryyy">
            <div className="containerDialog-animation">
              <div className="col-11 col-sm-8 col-md-6 col-lg-4 shadow containerDialoginside containerDialoginside-popup">
                <div className="row blue-accordion">
                  <div className="col-12  pt-2 pb-2 fontFifteen">
                    Duplicate Expense Confirmation!
                    <span className="float-right" onClick={this.props.handleNo}>
                      <FontAwesomeIcon icon={faTimes} className="mr-1" />
                    </span>
                  </div>
                </div>
                <div className="row text-center">
                  <div className="col-12 col-sm-11 mx-auto text-dark mt-2 mt-lg-4 d-flex justify-content-center">
                    <div className="duplicateFlag">
                      <FontAwesomeIcon
                        icon={faFlag}
                        className={`shadow rounded-circle circle-red`}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-11 mx-auto text-dark text-center mt-2 mt-lg-3">
                    {this.props.message}
                  </div>
                </div>
                <div className="row mb-4 ml-0 mr-0 d-none d-lg-block">
                  <div className="col-12 mt-4 text-sm-center text-right font-regular">
                    <button
                      type="button"
                      onClick={this.props.handleNo}
                      className="btn button button-close mr-2 pl-3 pr-3 shadow"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={this.props.handleYes}
                      className="btn button button-bg pl-3 pr-3 shadow"
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
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={this.props.handleYes}
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
      </div>
    );
  }
}
