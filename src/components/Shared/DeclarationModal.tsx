import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { ErrorComponent } from "../ReusableComponents";

export interface DeclarationModalProps {
  showModal: boolean;
  message: any;
  declarationMessage: any;
  signature: any;
  name: any;
  handleYes: any;
  handleNo: any;
  showError?: boolean;
}

export interface DeclarationModalState {
  showModal: boolean;
  showError: boolean;
  isChecked?: any;
}

export class DeclarationModal extends React.Component<
  DeclarationModalProps,
  DeclarationModalState
> {
  commentInput:any;
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showError: false,
      isChecked: false,
    };
  }

  handleCheckBoxChange = (e) => {
    this.setState({
      isChecked: e.target.type=="checkbox" ? e.target.checked : false,
    });
    console.log(e.target.checked);
  };

  handleYes = () => {
    const { isChecked, showError } = this.state;
    let showErrors = isChecked ==false ? true : false;
    this.setState({ showError: showErrors });
    if (!showErrors) {
      this.props.handleYes();
    }
    else{
      this.commentInput.focus();
    }
  };

  render() {
    return (
      <div className="">
        {this.props.showModal && (
          <div className="containerDialog">
            <div className="containerDialog-animation">
              <div className="col-11 col-md-7 shadow containerDialoginside">
                <div className="row blue-accordion">
                  <div className="col-12  pt-2 pb-2 fontFifteen">
                    Confirmation
                    <span className="float-right" onClick={this.props.handleNo}>
                      <FontAwesomeIcon icon={faTimes} className="mr-1" />
                      {/* <i className="far fa-arrow-right mr-2 "></i> */}
                    </span>
                  </div>
                </div>
                <div className="row text-center">
                  <div className="col-12 text-dark mt-4">
                    <div className="text-left" id="Declarationmodal">
                      {this.props.message}
                      <p className="mb-2 mb-lg-3">
                        <div className="col-12">
                          <label
                            className="container-R d-flex"
                            style={{ fontSize: "14px" }}
                          >
                            <input
                              checked={this.state.isChecked}
                              type="checkbox"
                              onChange={(e) => this.handleCheckBoxChange(e)}
                              ref={(input) => { this.commentInput = input; }}
                            />
                              {this.props.declarationMessage}
                            <span className="checkmark-R check mt-2"></span>
                          </label>
                          {this.state.showError && <ErrorComponent />}
                        </div>
                      </p>
                      <div className="row ml-0 mr-0 mb-2 mb-lg-0">
                        <form className="col-12">
                          <div className="form-row">
                            <div className="col">
                              <label className="font-weight-bold">
                                Signature
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter"
                                name="email"
                                disabled={true}
                                value={this.props.signature}
                              ></input>
                            </div>
                            <div className="col">
                              <label className="font-weight-bold">
                                Candidate Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Candidate Name"
                                name="email"
                                value={this.props.name}
                                disabled={true}
                              ></input>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-2 mb-lg-4 ml-0 mr-0 d-none d-lg-block">
                  <div className="col-12 mt-4 text-sm-center text-right font-regular">
                    <button
                      type="button"
                      onClick={this.props.handleNo}
                      className="btn button button-close mr-2 pl-3 pr-3 shadow"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                      No
                    </button>
                    <button
                      type="button"
                      onClick={this.handleYes}
                      className="btn button button-bg pl-3 pr-3 shadow"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                      Yes
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
                      No
                    </button>
                    <button
                      type="button"
                      onClick={this.handleYes}
                      className="btn button button-bg shadow mb-2 mb-xl-0"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                      Yes
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

export default DeclarationModal;
