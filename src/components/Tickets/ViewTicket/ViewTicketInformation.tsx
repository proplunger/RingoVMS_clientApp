import * as React from "react";
import Skeleton from "react-loading-skeleton";
import { dateFormatter } from "../../../HelperMethods";
import { convertShiftDateTime } from "../../ReusableComponents";

export interface ViewTicketInformationProps {
    ticketId: string;
    ticketDetails: any;
    documents?: any;
    download?: any;
}

export interface ViewTicketInformationState {
    ticketDetails: any;
}

class ViewTicketInformation extends React.Component<ViewTicketInformationProps, ViewTicketInformationState> {
    constructor(props: ViewTicketInformationProps) {
        super(props);
        this.state = { ticketDetails: { ticketId: "" } };
    }

    render() {
        const { ticketDetails } = this.props;
        return (
            <div>
                {!ticketDetails.ticketId &&
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
                {ticketDetails.ticketId && (
                    <div className="mb-3" id="My-Requistion">
                        <div className="row text-dark">
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Title :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.ticketTitle ? ticketDetails.ticketTitle : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Client :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.client ? ticketDetails.client : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Vendor :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.vendor ? ticketDetails.vendor : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Function Area :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.tktFuncArea ? ticketDetails.tktFuncArea : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Function :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.tktFunc ? ticketDetails.tktFunc : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Queue :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.tktQue ? ticketDetails.tktQue : "-"}</div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Description :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.ticketDesc ? ticketDetails.ticketDesc : "-" }</div>
                                </div>
                            </div>
                            
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Priority :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.tktPrio ? ticketDetails.tktPrio : "-"}</div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Request Type :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.tktReqType ? ticketDetails.tktReqType : "-"}</div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Assigned To :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.currentAssignedTo ? ticketDetails.currentAssignedTo : "-"}</div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Owner :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.owner ? ticketDetails.owner : "-"}</div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Tags :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.tags ? ticketDetails.tags :"-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Status :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.tktStatus ? ticketDetails.tktStatus :"-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Created Date :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.createdDate ? `${dateFormatter(new Date(ticketDetails.createdDate))} ${convertShiftDateTime(ticketDetails.createdDate)}` : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Created By :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.createdBy ? ticketDetails.createdBy : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Aging :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.aging >= 0 ? ticketDetails.aging : "-"}</div>
                                </div>
                            </div>
                        </div>
                        <div className="row text-dark">
                            <div className="col-12 col-sm-4 mt-md-3 mt-3">
                                <label className="mb-0 font-weight-bold">Attachments</label>
                                <div className="file-list">
                                    {this.props.documents.length > 0 &&
                                        this.props.documents.map((file, i) => (
                                            <span>
                                                <span
                                                    title={file.fileName}
                                                    onClick={() => file.candDocumentsId && this.props.download(file.path)}
                                                    className={file.isValid ? "valid-file" : "invalid-file"}
                                                >
                                                    {file.fileName}
                                                </span>
                                            </span>
                                        ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ViewTicketInformation;
