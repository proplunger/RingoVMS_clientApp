import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import Skeleton from "react-loading-skeleton";
import { FormatPhoneNumber } from "../../ReusableComponents";
import CommentHistoryBox from "../Comment/CommentHistoryBox";
import { AppPermissions } from "../Constants/AppPermissions";
import DocumentsPortfolio from "../DocumentsPortfolio/DocumentsPortfolio";
import TagControl from "../TagControl/TagControl";
import auth from "../../Auth";
import { AuthRoleType, isRoleType, isVendorRoleType } from "../AppConstants";
export interface RequisitionDetailsProps {
    reqId: string;
    reqDetails: any;
    isEnableDepartment?: any;
}

export interface RequisitionDetailsState {
    reqDetails: any;
    showCommentModal?: boolean;
    isPrivate?: boolean;
}

class RequisitionDetails extends React.Component<RequisitionDetailsProps, RequisitionDetailsState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    constructor(props: RequisitionDetailsProps) {
        super(props);
        this.state = { reqDetails: { reqId: "" } };
    }

    render() {
        const { reqDetails } = this.props;
        return (
            <div>
                {!reqDetails.reqId &&
                    Array.from({ length: 3 }).map(() => (
                        <div className="row mx-auto">
                            {Array.from({ length: 3 }).map(() => (
                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                    <Skeleton width={100} />
                                    <Skeleton height={30} />
                                </div>
                            ))}
                        </div>
                    ))}
                {reqDetails.reqId && (
                    <div className="mb-3" id="My-Requistion">
                        <div className="row mb-0 align-items-center">

                            {auth.hasPermissionV2(AppPermissions.REQ_COMMENT_VIEW) && <div className="col-12 col-sm-6 col-xl-3 text-center text-sm-left text-underline font-weight-bold"
                                onClick={() => this.setState({ showCommentModal: true, isPrivate: null })}>
                                <span className="cursor-pointer pl-1">
                                    Client/Vendor Comments
                                </span>
                                <span>
                                    <FontAwesomeIcon icon={faClock} className="ml-2 active-icon-blue ClockFontSize cursor-pointer" />
                                </span>
                            </div>}
                            {auth.hasPermissionV2(AppPermissions.REQ_PRIVATE_COMMENT_VIEW) && (
                                <div
                                    className="col-12 col-sm-6 col-xl-3 text-center text-sm-right ml-auto text-underline font-weight-bold mt-md-3 mt-2"
                                    onClick={() => this.setState({ showCommentModal: true, isPrivate: true })}>
                                    <span className="cursor-pointer">
                                        Private Comments
                                    </span>
                                    <span className="pr-1">
                                        <FontAwesomeIcon icon={faClock} className="ml-2 active-icon-blue ClockFontSize cursor-pointer" />
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="row text-dark">
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Division:</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.clientDivision.name}</div>
                                </div>
                            </div>
                            {this.props.isEnableDepartment && 
                                <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                    <div className="row">
                                        <div className="col-6 text-right">Department:</div>
                                        <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.department && reqDetails.department.name || '-'}</div>
                                    </div>
                                </div>
                            }

                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Location :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.divisionLocation.name}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Phone Number :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.clientDivision.phoneNumber ? reqDetails.clientDivision.phoneNumber : reqDetails.divisionLocation.phoneNumber || "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Address 1 :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.clientDivision.address1 ? reqDetails.clientDivision.address1 : reqDetails.divisionLocation.address1 || "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Address 2 :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.clientDivision.address2 ? reqDetails.clientDivision.address2 : reqDetails.divisionLocation.address2 || "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">City :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.clientDivision.city ? reqDetails.clientDivision.city : reqDetails.divisionLocation.city || "-"}</div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">State :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.clientDivision.state ? reqDetails.clientDivision.state : reqDetails.divisionLocation.state || "-" }</div>
                                </div>
                            </div>

                        {/* </div>

                        <div className="row text-dark mt-md-3 mt-1"> */}
                            
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Postal Code :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.clientDivision.postalCode ? reqDetails.clientDivision.postalCode : reqDetails.divisionLocation.postalCode || "-"}</div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Purchase Order :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.purchaseOrder}</div>
                                </div>
                            </div>
                            {!isRoleType(AuthRoleType.Vendor) &&
                                <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                    <div className="row">
                                        <div className="col-6 text-right">Client Contact Number :</div>
                                        <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{FormatPhoneNumber(reqDetails.clientContactNum)}</div>
                                    </div>
                                </div>
                            }

                        {/* </div>

                        <div className="row text-dark mt-md-3 mt-1"> */}
                            {!isRoleType(AuthRoleType.Vendor) &&
                                <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                    <div className="row">
                                        <div className="col-6 text-right">Division Contact :</div>
                                        <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.divisionContactName}</div>
                                    </div>
                                </div>
                            }

                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Reason for Requisition :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.reason ?reqDetails.reason.name :"-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Business Justification :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.justification}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Additional Details :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.additionalDetails}</div>
                                </div>
                            </div>

                        {/* </div>

                        <div className="row text-dark mt-md-3 mt-1"> */}
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <TagControl
                                    defaultText={"None"}
                                    fieldName="Tags"
                                    entityId={reqDetails.reqId}
                                    entityTypeId={"d5e6e4f1-79ae-46f4-ae0d-d9ca4892074e"}
                                ></TagControl>
                            </div>
                            {reqDetails.reqCreator && (
                                <React.Fragment>
                                    <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                        <div className="row">
                                            <div className="col-6 text-right">Created By :</div>
                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{reqDetails.reqCreator}</div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                            {this.state.showCommentModal && (
                                <CommentHistoryBox
                                    entityType={"Requisition"}
                                    entityId={reqDetails.reqId}
                                    showDialog={this.state.showCommentModal}
                                    handleNo={() => {
                                        this.setState({ showCommentModal: false });
                                        document.body.style.position = "";
                                    }}
                                    isPrivate={this.state.isPrivate}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default RequisitionDetails;
