import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { ErrorComponent } from "../ReusableComponents";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import withValueField from "./withValueField";
import { DropDownList } from "@progress/kendo-react-dropdowns";
const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { billingPeriod: "Select...", vendorInvoiceId: null };

export interface NameClearConfirmationModalProps {
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
  hideIcon?: boolean;
  icon?: IconProp;
  dropdownData?: any;
  showDropdown?: boolean;
  iconClass?: string;
}

export interface NameClearConfirmationModalState {
  showModal: boolean;
  isNameClearFee?: boolean;
  comments?: string;
  showError?: boolean;
  dropDownId?: string;
  showDropdownError?: boolean;
}

export class NameClearConfirmationModal extends React.Component<
  NameClearConfirmationModalProps,
  NameClearConfirmationModalState
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
    const { comments, isNameClearFee, showError, dropDownId } = this.state;
    let showErrors = this.props.commentsRequired
      ? comments ==""
        ? true
        : false
      : false;
    let dropdownErrors = false;
    if (this.props.showDropdown && !dropDownId) {
      dropdownErrors = true
    }
    this.setState({ showError: showErrors, showDropdownError: dropdownErrors });
    if (!showErrors && !dropdownErrors) {
      this.props.handleYes({ isNameClearFee, comments, dropDownId });
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
                    {this.props.title != undefined ? this.props.title : "Confirmation"}
                    <span className="float-right cursorElement" onClick={this.props.handleNo}>
                      <FontAwesomeIcon icon={faTimes} className="mr-1" />
                    </span>
                  </div>
                </div>
                <div className="row text-center ml-0 mr-0">
                  {!this.props.hideIcon && <div className="col-12 col-sm-11 mx-auto mt-2 mt-lg-4">
                    <FontAwesomeIcon
                      icon={this.props.icon || faCheckCircle}
                      className={`mr-1 shadow rounded-circle ${this.props.iconClass || "circle-Green"}`}
                    />
                  </div>}
                  <div className="col-12 col-sm-11 mx-auto text-dark mt-2 mt-lg-3 text-center">
                    {this.props.message}
                  </div>
                </div>
                {this.props.showDropdown &&
                  <div className="row ml-0 mr-0">
                    <div className="col-12 col-sm-11 mx-auto mt-sm-2">
                      <label className="mb-1 font-weight-bold required">Vendor Invoice </label>
                      <CustomDropDownList
                        className="form-control disabled "
                        name={`clientDivisionId`}
                        data={this.props.dropdownData}
                        textField="billingPeriod"
                        valueField="vendorInvoiceId"
                        defaultItem={defaultItem}
                        onChange={(e) => { this.setState({ dropDownId: e.target.value }) }}
                      // filterable={this.props.dropdownData.length > 5 ? true : false}
                      // onFilterChange={this.handleFilterChange}
                      />
                      {this.state.showDropdownError && <ErrorComponent />}
                    </div>
                  </div>
                }
                <div
                  className="row ml-0 mr-0"
                  style={{
                    display: this.props.enterComments ? "block" : "none",
                  }}
                >
                  <div className="col-12 col-sm-11 mx-auto mt-sm-2">
                    <label
                      className={
                        this.props.commentsRequired
                          ? "mb-1 font-weight-bold required"
                          : "mb-1 font-weight-bold"
                      }
                    >
                      {this.props.commentTitle || "Comments"}
                    </label>
                    <textarea
                      name="comment"
                      maxLength={2000}
                      placeholder="Enter Comments"
                      className="form-control"
                      value={this.state.comments}
                      onChange={(e) => this.handleCommentChange(e)}
                    />
                    {this.state.showError && <ErrorComponent />}
                  </div>
                </div>
                <div
                  className="row text-center ml-0 mr-0"
                  style={{
                    display: this.props.radioSelection ? "block" : "none",
                  }}
                >
                  <div className="col-12 col-sm-11 mx-auto text-dark mt-2 mt-lg-3 d-flex text-center">
                    {this.props.radioBtnTitle && (
                      <label className="mb-1 text-dark">
                        {this.props.radioBtnTitle}
                      </label>
                    )}
                    <label className="container container_checkboxandradio mb-0 radioBtnCustom font-weight-normal col-auto pr-0">
                      {this.props.radioBtnYesTitle}
                      <input
                        type="radio"
                        name="isNameClear"
                        value="true"
                        checked={this.state.isNameClearFee}
                        onChange={(e) => this.handleRadioBtnChange(e)}
                      />
                      {/* <span className="checkmark checkmark-nameClear"></span> */}
                      <span className="checkmark"></span>
                    </label>
                    <label className="container container_checkboxandradio  mb-0 radioBtnCustom font-weight-normal col-auto pr-0">
                      {this.props.radioBtnNoTitle}
                      <input
                        type="radio"
                        name="isNameClear"
                        value="false"
                        checked={!this.state.isNameClearFee}
                        onChange={(e) => this.handleRadioBtnChange(e)}
                      />
                      <span className="checkmark"></span>
                    </label>
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
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={this.handleYes}
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

export default NameClearConfirmationModal;
