import { faHistory, faSave, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import axios from "axios";
import PatchRequisitionHistory from "./PatchReqHistory";
import { Dialog } from "@progress/kendo-react-dialogs";
import { successToastr } from "../../../HelperMethods";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import auth from "../../Auth";
import { UPDATE_REQ_SUCCESSFULL_MSG } from "../../Shared/AppMessages";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { endsWith } from "lodash";
import { NumericTextBox } from "@progress/kendo-react-inputs";

export interface PatchRequisitionProps {
    props: any;
    onCloseModal: any;
}

export interface PatchRequisitionState {
    purchaseOrder?: any;
    comment?: string;
    showHistoryModal?: boolean;
    isDisabled: boolean;
    StartDate?: any;
    EndDate?: any;
    NoOfReqStaff?: number;
}
class PatchRequisition extends React.Component<
    PatchRequisitionProps,
    PatchRequisitionState
> {
    public updatedData;
    constructor(props: PatchRequisitionProps) {
        super(props);
        this.state = {
            isDisabled: true,
            StartDate: new Date(),
            EndDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            NoOfReqStaff: props.props.required
        };
        this.updatedData = {};
    }
    componentDidMount() {

        const { props, onCloseModal } = this.props;
        this.setState({ StartDate: props !=undefined && props.startDate != null ? new Date(props.startDate) : null, EndDate: props !=undefined && props.endDate != null ? new Date(props.endDate) : null })
    }

    handleChange = (e) => {
        let change = { isDisabled: false };
        if (e.target.name=="StartDate" || e.target.name=="EndDate") {
            Object.assign(this.updatedData, { ["ReqPosition"]: { ...this.updatedData.ReqPosition, [e.target.name]: e.target.value.toDateString() } });
            change[e.target.name] = e.target.value;
        } else if (e.target.name=="NoOfReqStaff") {
            Object.assign(this.updatedData, { ["ReqPosition"]: { ...this.updatedData.ReqPosition, [e.target.name]: (e.target.value < 0 ? 0 : (e.target.value < this.props.props.noOfFilledStaff ? this.props.props.required : (e.target.value > 999 ? 999 : e.target.value))) } });
            change[e.target.name] = (e.target.value < 0 ? 0 : (e.target.value < this.props.props.noOfFilledStaff ? this.props.props.required : (e.target.value > 999 ? 999 : e.target.value)));
        } else {
            Object.assign(this.updatedData, { [e.target.name]: e.target.value });
            change[e.target.name] = e.target.value;
        }
        this.setState(change);
    };

    handleUpdate = () => {
        let data = {
            values: JSON.stringify(this.updatedData),
            comment: this.state.comment,
        };
        axios
            .patch(`api/requisitions/${this.props.props.reqId}`, JSON.stringify(data))
            .then(() => {
                successToastr(UPDATE_REQ_SUCCESSFULL_MSG);
                this.props.onCloseModal();
            });
    };

    render() {
        const { props, onCloseModal } = this.props;
        const { StartDate, EndDate, NoOfReqStaff } = this.state;
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end patchRequisition-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            Edit Requisition: <span> {props.reqNumber} </span>
                        </h4>
                        <button
                            type="button"
                            className="close text-white close_opacity"
                            data-dismiss="modal"
                            onClick={onCloseModal}
                        >
                            &times;
                        </button>
                    </div>

                    <div className="row mt-2 mt-lg-4 ml-0 mr-0">
                        <div className="col-sm-6 col-md-4">
                            <p className="hold-position_font-size">
                                Division:
                                <span className="pl-1 work-break font-weight-normal">{props.division}</span>
                            </p>
                        </div>
                        <div className="col-sm-6 col-md-4 text-left text-sm-right">
                            <p className="hold-position_font-size">
                                Location:
                                <span className="pl-1 work-break font-weight-normal">{props.location}</span>
                            </p>
                        </div>

                        <div className="col-md-4">
                            <div className="row">
                                <div className="col-9">
                                    <p className="hold-position_font-size ">
                                        Position:
                                        <span className="pl-1 work-break font-weight-normal">{props.position}</span>
                                    </p>
                                </div>

                                <div className="col-3 text-right" style={{ cursor: "pointer" }}>
                                    <p className="hold-position_font-size" title="History">
                                        <span
                                            className="holdPosition-icon shadow "
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
                    </div>

                    <div className="row mt-3 ml-0 mr-0">
                        <div className="col-sm-6">
                            <label className="mb-1 font-weight-bold">
                                Current Purchase Order
                            </label>
                            <input
                                title={props && props.purchaseOrder}
                                type="text"
                                name="PO"
                                className="form-control"
                                disabled={true}
                                value={props && props.purchaseOrder}
                            />
                        </div>
                        <div className="col-sm-6 mt-2 mt-sm-0">
                            <label className="mb-1 font-weight-bold">
                                New Purchase Order
                            </label>
                            <input
                                value={this.state.purchaseOrder}
                                className="form-control"
                                placeholder="Enter purchase order"
                                maxLength={50}
                                onChange={this.handleChange}
                                name="PurchaseOrder"
                            />
                        </div>
                    </div>

                    {/* Start Date */}
                    <div className="row mt-3 ml-0 mr-0">
                        <div className="col-sm-6" id="ShowDatePickerIcon">
                            <label className="mb-1 font-weight-bold">
                                Current Start Date
                            </label>
                            <DatePicker
                                className="form-control"
                                format="MM/dd/yyyy"
                                name="startDate"
                                disabled
                                value={props !=undefined && props.startDate != null ? new Date(props.startDate) : null}

                                formatPlaceholder="formatPattern"
                            />
                        </div>
                        <div className="col-sm-6 mt-2 mt-sm-0" id="ShowDatePickerIcon">
                            <label className="mb-1 font-weight-bold">
                                New Start Date
                            </label>
                            <DatePicker
                                className="form-control"
                                format="MM/dd/yyyy"
                                name="StartDate"
                                value={StartDate ? StartDate : ""}
                                onChange={(e) => this.handleChange(e)}
                                formatPlaceholder="formatPattern"
                            //max={new Date(new Date(this.state.endDate).setDate(new Date(this.state.endDate).getDate()))}
                            />
                        </div>
                    </div>



                    <div className="row mt-3 ml-0 mr-0">
                        <div className="col-sm-6" id="ShowDatePickerIcon">
                            <label className="mb-1 font-weight-bold">
                                Current End Date
                            </label>
                            <DatePicker
                                className="form-control"
                                format="MM/dd/yyyy"
                                name="endDate"
                                disabled
                                value={props !=undefined && props.endDate != null ? new Date(props.endDate) : null}
                                formatPlaceholder="formatPattern"
                            />
                        </div>
                        <div className="col-sm-6 mt-2 mt-sm-0" id="ShowDatePickerIcon">
                            <label className="mb-1 font-weight-bold">
                                New End Date
                            </label>
                            <DatePicker
                                className="form-control"
                                format="MM/dd/yyyy"
                                name="EndDate"
                                value={EndDate ? new Date(EndDate) : null}
                                onChange={this.handleChange}
                                formatPlaceholder="formatPattern"
                            //min={new Date(new Date(this.state.startDate).setDate(new Date(this.state.startDate).getDate() + 1))}
                            />
                        </div>
                    </div>
                    <div className="row mt-3 ml-0 mr-0">
                        <div className="col-sm-6" id="ShowDatePickerIcon">
                            <label className="mb-1 font-weight-bold">
                                Current No. of Positions Required
                            </label>
                            <NumericTextBox
                                className="form-control"
                                name="noOfReqStaff"
                                disabled={true}
                                placeholder="Enter Number"
                                value={props && props.required}
                            />
                        </div>
                        <div className="col-sm-6 mt-2 mt-sm-0" id="ShowDatePickerIcon">
                            <label className="mb-1 font-weight-bold">
                                New No. of Positions Required
                            </label>
                            <NumericTextBox
                                className="form-control"
                                name="NoOfReqStaff"
                                placeholder="Enter Number"
                                value={NoOfReqStaff}
                                onChange={this.handleChange}
                                min={props.noOfFilledStaff}
                                max={999}
                                format="n0"
                            />
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 mt-2">
                        <label className="mb-0 font-weight-bold">Comment</label>
                        <textarea
                            rows={2}
                            id="comment"
                            value={this.state.comment}
                            className="form-control noteHistory mt-1"
                            name="comment"
                            onChange={(e) => this.setState({ comment: e.target.value })}
                        />
                    </div>
                    <div className="modal-footer justify-content-center border-0">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button
                                type="button"
                                className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                                onClick={this.props.onCloseModal}
                            >
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                Close
                            </button>
                            {auth.hasPermissionV2(AppPermissions.REQ_UPDATE) && (
                                <button
                                    type="button"
                                    className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                    onClick={this.handleUpdate}
                                    disabled={this.state.isDisabled}
                                >
                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Update
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {this.state.showHistoryModal && (
                    <div id="hold-position">
                        <Dialog className="col-12 For-all-responsive-height" width="100%">
                            <PatchRequisitionHistory
                                reqId={this.props.props.reqId}
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
export default PatchRequisition;
