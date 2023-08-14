import * as React from "react";
import Skeleton from "react-loading-skeleton";
import { dateFormatter } from "../../../HelperMethods";
import { convertShiftDateTime } from "../../ReusableComponents";

export interface ViewResolutionProps {
    ticketId: string;
    ticketDetails: any;
}

export interface ViewResolutionState {
    ticketDetails: any;
}

class ViewResolution extends React.Component<ViewResolutionProps, ViewResolutionState> {
    constructor(props: ViewResolutionProps) {
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
                                    <div className="col-6 text-right">Resolution Type :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.tktResType ? ticketDetails.tktResType : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Resolution Date :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.resDate ? `${dateFormatter(new Date(ticketDetails.resDate))}`: "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Resolution Details :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.resDesc ? ticketDetails.resDesc : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div  className="col-6 text-right">Closed Date :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.lastClosedDate ? `${dateFormatter(new Date(ticketDetails.lastClosedDate))} ${convertShiftDateTime(ticketDetails.lastClosedDate)}` : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div  className="col-6 text-right">Closed By :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{ticketDetails.lastClosedBy ? ticketDetails.lastClosedBy : "-"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default ViewResolution;
