import * as React from "react";
import axios from "axios";
import { IPositionDetails } from "../../Requisitions/CreateRequisition/models/IPositionDetails";
import { convertShiftDateTime } from "../../ReusableComponents";
import { currencyFormatter, dateFormatter } from "../../../HelperMethods";
import auth from "../../Auth";
import { AppPermissions } from "../Constants/AppPermissions";
import { AuthRoleType, isRoleType, isVendorRoleType } from "../AppConstants";

export interface PositionDetailsProps {
    reqId: string;
}

export interface PositionDetailsState {
    reqPosition?: IPositionDetails;
}

class PositionDetails extends React.Component<PositionDetailsProps, PositionDetailsState> {
    constructor(props: PositionDetailsProps) {
        super(props);
        this.state = { reqPosition: { reqId: "" } };
    }
    private userObj: any = JSON.parse(localStorage.getItem("user"));

    componentDidMount() {
        this.getPositionDetails(this.props.reqId);
    }

    //gets position details based on reqId
    getPositionDetails(reqId: string) {
        axios.get(`api/requisitions/${reqId}/position`).then((res) => {
            const reqPosition = { ...res.data };
            this.setState({ reqPosition: reqPosition });
        });
    }

    render() {
        const { reqPosition } = this.state;
        return (
            <div>
                {this.state.reqPosition.reqPositionId && (
                    <div className="mb-3">
                        <div className="row text-dark">
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Job Workflow:</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqPosition.jobWf ? reqPosition.jobWf.name :"-"}</div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Job Category :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqPosition.jobCategory ? reqPosition.jobCategory.name :"-"}</div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Position :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqPosition.jobPosition ?reqPosition.jobPosition.name : "-"}</div>
                                </div>
                            </div>
                        {/* </div>
                        <div className="row text-dark mt-md-3 mt-2"> */}
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Position Skills :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                                        {reqPosition.positionSkillMapping.map((x) => x.name).join(",")}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Position Description :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqPosition.positionDesc}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Positions Required :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqPosition.noOfReqStaff}</div>
                                </div>
                            </div>
                        {/* </div>
                        <div className="row text-dark mt-md-3 mt-2"> */}
                            {!isRoleType(AuthRoleType.Vendor) &&
                                <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                    <div className="row">
                                        <div className="col-6 text-right">Hiring Manager :</div>
                                        <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqPosition.hiringManager ?reqPosition.hiringManager.name : "-"}</div>
                                    </div>
                                </div>}
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Assignment Type :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqPosition.assignType ? reqPosition.assignType.name :"-"}</div>
                                </div>
                            </div>
                        {/* </div>

                        <div className="row text-dark mt-md-3 mt-2"> */}
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Start Date :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{dateFormatter(new Date(reqPosition.startDate))}</div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">End Date :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div"> {dateFormatter(new Date(reqPosition.endDate))}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Bill Rate :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{currencyFormatter(reqPosition.billRate)}</div>
                                </div>
                            </div>
                        {/* </div>

                        <div className="row text-dark mt-md-3 mt-2"> */}
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Start Time :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">
                                        {convertShiftDateTime(reqPosition.shiftStartTime)}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">End Time :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{convertShiftDateTime(reqPosition.shiftEndTime)}</div>
                                </div>
                            </div>
                            {(auth.hasPermissionV2(AppPermissions.REQ_CREATE) || auth.hasPermissionV2(AppPermissions.REQ_APPROVE) || auth.hasPermissionV2(AppPermissions.REQ_REJECT)) && (
                                <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                    <div className="row">
                                        <div className="col-6 text-right">Budget :</div>
                                        <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{currencyFormatter(reqPosition.budget)}</div>
                                    </div>
                                </div>
                            )}
                        {/* </div>
                        <div className="row text-dark mt-md-3 mt-2"> */}
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Positions On Hold :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqPosition.noOfHoldStaff || "-"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default PositionDetails;
