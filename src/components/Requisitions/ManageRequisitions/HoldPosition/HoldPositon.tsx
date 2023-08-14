import { faHistory, faSave, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import axios from "axios";
import HoldPositionHistory from "./HoldPositionHistory";
import { Dialog } from "@progress/kendo-react-dialogs";
import { successToastr } from "../../../../HelperMethods";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import auth from "../../../Auth";

export interface HoldPositionProps {
    props: any;
    onCloseModal: any;
}

export interface HoldPositionState {
    noOfHoldStaff: any;
    noOfRemainingStaff: any;
    comment?: string;
    showHistoryModal?: boolean;
}
class HoldPosition extends React.Component<HoldPositionProps, HoldPositionState> {
    constructor(props: HoldPositionProps) {
        super(props);
        this.state = {
            noOfHoldStaff: this.props.props.noOfHoldStaff,
            noOfRemainingStaff: 0,
        };
    }

    componentDidMount() {
        this.setState({ noOfRemainingStaff: this.props.props.required - this.props.props.noOfHoldStaff });
    }

    handleChange = (e) => {
        debugger;
        const { props } = this.props;
        let change = {};
        let val = e.target.value <= (props.required - props.noOfFilledStaff) ? e.target.value : (props.required - props.noOfFilledStaff);
        let val2 = val < 0 ? 0 : val;
        change[e.target.name] = val2;
        change["noOfRemainingStaff"] = props.required - val2;
        this.setState(change);
    };

    handleUpdate = () => {
        const { noOfHoldStaff, comment } = this.state;
        let data = {
            noOfHoldStaff: noOfHoldStaff,
            noOfReqStaff: this.props.props.required,
            comment: comment,
        };
        axios.patch(`api/requisitions/position/${this.props.props.reqPositionId}`, data).then(() => {
            successToastr("Position(s) put on hold successfully");
            this.props.onCloseModal();
        });
    };

    render() {
        const { props } = this.props;
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            Hold Position: <span> {props.reqNumber} </span>
                        </h4>
                        <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.onCloseModal}>
                            &times;
                        </button>
                    </div>

                    <div className="row mt-2 mt-lg-4 ml-0 mr-0">
                        <div className="col-sm-6 col-md-4">
                            <p className="hold-position_font-size">
                                Division: <span className="pl-1 work-break font-weight-normal">{props.division}</span>
                            </p>
                        </div>
                        <div className="col-sm-6 col-md-4">
                            <p className="hold-position_font-size text-sm-right text-md-center">
                                Location:
                                <span className="pl-1 work-break font-weight-normal">{props.location}</span>
                            </p>
                        </div>

                        <div className="col-md-4">
                            <div className="row">
                                <div className="col-9">
                                    <p className="hold-position_font-size text-md-right">
                                        Position:
                                        <span className="pl-1 work-break font-weight-normal">{props.position}</span>
                                    </p>
                                </div>

                                <div className="col-3 text-right" style={{ cursor: "pointer" }}>
                                    <p className="hold-position_font-size" title="Hold Position History">
                                        <span
                                            className="holdPosition-icon shadow"
                                            onClick={() => {
                                                this.setState({ showHistoryModal: true });
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faHistory} color={"white"} />
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div></div>
                    </div>
                    <div className="row mt-3 ml-0 mr-0">
                        <div className="col-sm-3">
                            <label className="mb-1 font-weight-bold">No. of Required Positions</label>
                            <input
                                type="text"
                                name="requisitionNumber"
                                className="form-control text-right"
                                placeholder="No. of Required Positions"
                                disabled={true}
                                value={props.required}
                            />
                        </div>
                        <div className="col-sm-3">
                            <label className="mb-1 font-weight-bold">No. of Filled Positions</label>
                            <input
                                type="text"
                                name="requisitionNumber"
                                className="form-control text-right"
                                placeholder="No. of Filled Positions"
                                disabled={true}
                                value={props.noOfFilledStaff}
                            />
                        </div>
                        <div className="col-sm-3 mt-2 mt-sm-0">
                            <label className="mb-1 font-weight-bold">No. of Hold Positions</label>
                            <NumericTextBox
                                value={this.state.noOfHoldStaff}
                                className="form-control"
                                placeholder="Enter No. of Hold Position"
                                max={props.required - props.noOfFilledStaff}
                                min={0}
                                onChange={this.handleChange}
                                name="noOfHoldStaff"
                                format="n0"
                            />
                        </div>
                        <div className="col-sm-3 mt-2 mt-sm-0">
                            <label className="mb-1 font-weight-bold">Remaining Positions</label>

                            <input
                                type="number"
                                min={0}
                                max={props.required}
                                name="noOfRemainingStaff"
                                className="form-control text-right"
                                disabled={true}
                                placeholder="Remaining Positions"
                                value={this.state.noOfRemainingStaff}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-sm-4 mt-3">
                        <label className="mb-0 font-weight-bold">Comments</label>
                        <textarea
                            rows={2}
                            id="noteHistoryBox"
                            value={this.state.comment}
                            className="form-control noteHistory mt-1"
                            onChange={(event) => {
                                this.setState({ comment: event.target.value });
                            }}
                        />
                    </div>
                    <div className="modal-footer justify-content-center border-0">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                            </button>
                            {auth.hasPermissionV2(AppPermissions.REQ_POSITION_HOLD) && <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleUpdate}>
                                <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Update
                            </button>}
                        </div>
                    </div>
                </div>
                {this.state.showHistoryModal && (
                    <div id="hold-position">
                        <Dialog className="col-12 For-all-responsive-height" width="100%">
                            <HoldPositionHistory
                                reqPositionId={this.props.props.reqPositionId}
                                reqNumber={this.props.props.reqNumber}
                                handleClose={() => this.setState({ showHistoryModal: false })}
                            />
                        </Dialog>
                    </div>
                )}
            </div>
        );
    }
}
export default HoldPosition;
