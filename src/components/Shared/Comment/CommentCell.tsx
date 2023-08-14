/* eslint-disable */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { GridCell } from "@progress/kendo-react-grid";
import { dateFormatter } from "../../../HelperMethods";
import { convertShiftDateTime } from "../../ReusableComponents";

export function PositionItemTemplate() {
    return class extends GridCell {
        render() {
            const { dataItem } = this.props;
            return (
                <td className="positionItemRow pl-0 pr-0 " style={{ background: "white" }}>
                    <div className="pl-0 pr-0" key={"posReportee"}>
                        <div className="col-12 px-0">
                            <div className="row mx-0">
                                <div className="col-6 col-md-6">
                                    <span className="mobileBlock"><FontAwesomeIcon icon={faUserCircle} className={"mr-1"} /> User: </span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0">{dataItem.commentedBy}</span>
                                    <span className="mobileBlock"> | Role: </span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0">{dataItem.userRole}</span>
                                </div>
                                <div className="col-6 col-md-6 text-right ">
                                    <span className="mobileBlock">Date Created: </span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0">{dateFormatter(new Date(dataItem.createdDate))} {convertShiftDateTime(dataItem.createdDate)}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="row mx-0">
                                <div className="col-12 col-md-12 mx-auto pr-0">                                   
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0">{dataItem.comment}</span>
                                </div>                                
                            </div>
                        </div>
                    </div>
                </td>
            );
        }
    };
}