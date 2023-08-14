import * as React from "react";
import auth from "../Auth";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faTimes, faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { ErrorComponent } from "../ReusableComponents";
import { IDropDownModel } from "../Shared/Models/IDropDownModel";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../Shared/withValueField";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ExtensionActionStatuses } from "./AppConstants";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select Reason", id: null };

export interface RejectModalProps {
    showModal: boolean;
    message: any;
    handleYes: any;
    handleNo: any;
    actionId?: string;
    action?: string;
    icon?: IconProp;
    isRequest?: boolean;
}
export interface RejectModalState {
    reasons: Array<IDropDownModel>;
    reasonId?: string;
    clientId: string;
    comments?: string;
    reason?: any;
    showError?: boolean;
}

export class RejectModal extends React.Component<RejectModalProps, RejectModalState> {
    constructor(props) {
        super(props);
        this.state = {
            reasons: [],
            reasonId: "",
            clientId: auth.getClient(),
            showError: false,
            comments: "",
        };
    }

    componentDidMount() {
        this.getReasons();
    }

    getReasons() {
        if (this.props.actionId) {
            axios.get(`api/candidates/action/${this.props.actionId}/reasons`).then((res) => {
                this.setState({ reasons: res.data });
            });
        }
    }

    handleCommentChange = (e) => {
        this.setState({ comments: e.target.value });
    };

    handleReasonChange = (e) => {
        this.setState({ reasonId: e.target.value });
    };

    handleYes = () => {
        const { comments, reasonId, showError } = this.state;
        let showErrors = comments =="" || reasonId =="" || reasonId ==null ? true : false;
        this.setState({ showError: showErrors });
        if (!showErrors) {
            this.props.handleYes({ reasonId, comments });
        }
    };

    render() {
        return (
          <div className="">
            {this.props.showModal && (
              <div className="containerDialog bg-primaryyy">
                <div className="containerDialog-animation">
                  <div className="col-11 col-sm-8 col-md-6 col-lg-4 shadow containerDialoginside containerDialoginside-popup">
                    <div className="row blue-accordion">
                      <div className="col-12  pt-2 pb-2 fontFifteen">
                        Confirmation
                        <span
                          className="float-right"
                          onClick={this.props.handleNo}
                        >
                          <FontAwesomeIcon icon={faTimes} className="mr-1" />
                        </span>
                      </div>
                    </div>
                    <div className="row text-center">
                      <div className="col-12 col-sm-11 mx-auto text-dark mt-2 mt-lg-4">
                        <FontAwesomeIcon
                          icon={
                            this.props.action=="Withdraw" ||
                            this.props.action=="Negotiate"
                              ? faArrowAltCircleLeft
                              : (this.props.icon || faCheckCircle)
                          }
                          className={`mr-1 shadow rounded-circle ${
                            this.props.action=="Withdraw" ||
                            this.props.action=="Negotiate" ||
                            this.props.action==ExtensionActionStatuses.REQUESTFOREXTENSION
                              ? "circle-withdraw"
                              : "circle-red"
                          } `}
                        />
                      </div>
                      <div className="col-12 col-sm-11 mx-auto text-dark text-center mt-2 mt-lg-3">
                        {this.props.message}
                      </div>
                    </div>

                    <div className="col-12 col-sm-11 mx-auto mt-2 mt-sm-2 mt-lg-3">
                      <label className="mb-1 font-weight-bold required">
                        Reason
                      </label>
                      <CustomDropDownList
                        className="form-control disabled "
                        name={`reasonId`}
                        data={this.state.reasons}
                        textField="name"
                        valueField="id"
                        id="candidates"
                        value={this.state.reasonId}
                        defaultItem={defaultItem}
                        onChange={this.handleReasonChange}
                      />
                      {this.state.showError &&
                      (this.state.reasonId =="" ||
                        this.state.reasonId ==null) ? (
                        <ErrorComponent />
                      ) : null}
                    </div>

                    <div className="row ml-0 mr-0">
                      <div className="col-12 col-sm-11 mx-auto mt-sm-2">
                        <label className="mb-1 font-weight-bold required">
                          Comments
                        </label>
                        <textarea
                          name="comment"
                          maxLength={2000}
                          placeholder="Enter Comments"
                          className="form-control"
                          value={this.state.comments}
                          onChange={(e) => this.handleCommentChange(e)}
                        />
                        {this.state.showError && this.state.comments =="" ? (
                          <ErrorComponent />
                        ) : null}
                      </div>
                    </div>
                    <div className="row mb-4 ml-0 mr-0 d-none d-lg-block">
                      <div className="col-12 mt-4 text-sm-center text-right font-regular">
                        <button
                          type="button"
                          onClick={this.props.handleNo}
                          className="btn button button-close mr-2 pl-3 pr-3 shadow"
                        >
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className="mr-2"
                          />
                          Close
                        </button>
                        <button
                          type="button"
                          onClick={this.handleYes}
                          className="btn button button-bg pl-3 pr-3 shadow"
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="mr-2"
                          />
                            {this.props.isRequest==true ? "Send Request" : "OK"}
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
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className="mr-2"
                          />
                          Close
                        </button>
                        <button
                          type="button"
                          onClick={this.handleYes}
                          className="btn button button-bg shadow mb-2 mb-xl-0"
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="mr-2"
                          />
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

export default RejectModal;
