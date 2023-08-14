import * as React from "react";
import Skeleton from "react-loading-skeleton";
import { dateFormatter } from "../../../HelperMethods";
import { convertShiftDateTime } from "../../ReusableComponents";

export interface TicketDataProps {
    ticketId: string;
    data: any;
    isEdit?: boolean;
}

export interface TicketDataState {
}

class TicketData extends React.Component<TicketDataProps, TicketDataState> {
    constructor(props: TicketDataProps) {
        super(props);
        this.state = {  };
    }

    render() {
        const { data } = this.props;
        return (
            <div>
                {!this.props.ticketId &&
                    Array.from({ length: 3 }).map(() => (
                        <div className="row mx-auto">
                            {Array.from({ length: 2 }).map(() => (
                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                    <Skeleton width={100} />
                                    <Skeleton height={30} />
                                </div>
                            ))}
                        </div>
                    ))}
                {this.props.ticketId && (
                    <div className="mb-3" id="My-Requistion">
                        <div className="row text-dark">
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className={`${this.props.isEdit ==true ? "col-4 text-left" : "col-6 text-right"}`}>Created Date :</div>
                                    <div className={`${this.props.isEdit ==true ? "col-8 " : "col-6 "} font-weight-bold pl-0 text-left word-break-div`}>{data.createdDate ? `${dateFormatter(new Date(data.createdDate))} ${convertShiftDateTime(data.createdDate)}` : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className={`${this.props.isEdit ==true ? "col-4 text-left" : "col-6 text-right"}`}>Created By :</div>
                                    <div className={`${this.props.isEdit ==true ? "col-8 " : "col-6 "} font-weight-bold pl-0 text-left word-break-div`}>{data.createdBy ? data.createdBy : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className={`${this.props.isEdit ==true ? "col-4 text-left" : "col-6 text-right"}`}>Closed Date :</div>
                                    <div className={`${this.props.isEdit ==true ? "col-8 " : "col-6 "} font-weight-bold pl-0 text-left word-break-div`}>{data.lastClosedDate ? `${dateFormatter(new Date(data.lastClosedDate))} ${convertShiftDateTime(data.lastClosedDate)}` : "-"}</div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className={`${this.props.isEdit ==true ? "col-4 text-left" : "col-6 text-right"}`}>Closed By :</div>
                                    <div className={`${this.props.isEdit ==true ? "col-8 " : "col-6 "} font-weight-bold pl-0 text-left word-break-div`}>{data.lastClosedBy ? data.lastClosedBy : "-"}</div>
                                </div>
                            </div>
                            {/* <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className={`${this.props.isEdit ==true ? "col-4 text-left" : "col-6 text-right"}`}>Aging :</div>
                                    <div className={`${this.props.isEdit ==true ? "col-8 " : "col-6 "} font-weight-bold pl-0 text-left word-break-div`}>{data.aging >= 0 ? data.aging : "-"}</div>
                                </div>
                            </div> */}
                            {/* <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                <div className="row">
                                    <div className="col-6 text-right">Org :</div>
                                    <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{data.org ? data.org : "-"}</div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default TicketData;
