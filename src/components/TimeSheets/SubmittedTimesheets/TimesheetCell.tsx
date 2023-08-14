/* eslint-disable */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faDollarSign, faEye, faFileAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { GridCell } from "@progress/kendo-react-grid";
import { dateFormatter, history, numberFormatter, dayFormatter, currencyFormatter } from "../../../HelperMethods";
import ReactTooltip from "react-tooltip";
import ReqStatusCard from "../../Shared/ReqStatusCard/ReqStatusCard";
import { Link } from "react-router-dom";
import { convertShiftDateTime } from "../../ReusableComponents";

export function PositionItemTemplate({ check }) {
    return class extends GridCell {
        render() {
            const { dataItem } = this.props;
            const week = dataItem.tsWeek[0];
            return (
                <td className="positionItemRow pl-0 pr-0 " style={{ background: "white" }}>
                    <div className="pl-0 pr-0" key={"posReportee"}>
                        <div className="col-12 px-0">
                            <div className="row mx-0">
                                <div className="col-6 col-md-6">
                                    <span className="mobileBlock">Division: </span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0">{dataItem.division}</span>
                                </div>
                                <div className="col-6 col-md-6 text-right ">
                                    <span className="mobileBlock">Dept/Location: </span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0">{dataItem.location}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="row mx-0">
                                <div className="col-6 col-md-6 mx-auto pr-0">
                                    <span className="mobileBlock">Vendor: </span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0">{dataItem.vendor}</span>
                                </div>
                                <div className="col-6 col-md-6 text-right pl-0">
                                    <span className="mobileBlock">Position: </span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0">{dataItem.position}</span>
                                </div>
                            </div>
                            <hr />
                            <div className="row mx-0">
                                <div className="col-6 col-md-6 mx-auto pr-0">
                                    <span className="mobileBlock">Hiring Manager:</span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0"> {dataItem.hiringManager}</span>
                                </div>
                                <div className="col-6 col-md-6 text-right pl-0">
                                    <span className="mobileBlock">End Date:</span>
                                    <span className="font-weight-bold text-overflow_helper-label-modile-desktop mb-0"> {dateFormatter(dataItem.endDate)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 k-grid-shadow card-ts-bg-clr pb-2 mb-0" key={dataItem.candidateName}>
                            <div className="row mt-3 pt-2 pb-2 align-items-center">
                                <div className="col-sm-6 col-md-6">
                                    <div className="row align-items-center">
                                        <div className="col-12 col-lg-auto">
                                            <span className="font-weight-bold providerCls">{dataItem.candidateName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {dataItem.tsWeek && dataItem.tsWeek.length > 0
                                ? dataItem.tsWeek.map((week, index) => (
                                      <div key={week.timesheetTagId + index}>
                                          <div className="row mt-1  align-items-center mx-0">
                                              <div className="col-sm-6 col-md-6 px-0">
                                                  <div className="col-12 col-lg-auto pl-0 pr-0">
                                                  <div className="row justify-content-around justify-content-md-start mx-md-0">
                                                  <div>
                                                      <span className="font-weight-bold">
                                                          {dateFormatter(week.startDate) + " - " + dateFormatter(week.endDate)}
                                                      </span>
                                                      </div>
                                                    <div>
                                                      <span className="d-md-none">
                                                          <Link to={`/timesheets/submitted/${week.tsWeekId}`} className="icon-clr-blue ml-3 mt-2">
                                                              <FontAwesomeIcon icon={faFileAlt} className={"lead"} />
                                                          </Link>
                                                      </span>
                                                      <span className="grn-bg-icon-checkbox d-md-none">
                                                          <label className="container-R d-flex col-12 pr-0">
                                                              <input
                                                                  type="checkbox"
                                                                  checked={week.isSelected}
                                                                  onChange={(event) => check(event, week.tsWeekId)}
                                                              />
                                                              <span className="checkmark-R gridCheckbox" style={{ top: "-9px", left: "15px" }}></span>
                                                          </label>
                                                      </span>
                                                      </div>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div
                                                  className="col-sm-6 col-md-6 ml-md-auto d-sm-flex 
                                                text-right justify-content-sm-end mt-2 mt-md-0 px-0"
                                              >
                                                  <div className=" row ml-0 mr-0 mt-md-2">
                                                      <div className="col-6 pr-0 text-left">
                                                          <span className="grn-bg-icon just mr-2">
                                                              <FontAwesomeIcon icon={faClock} />
                                                          </span>
                                                          <span>{numberFormatter.format(week.totalHours)}</span>
                                                      </div>
                                                      <div className="col-6 pl-0 text-right">
                                                          <span className="grn-bg-icon just mr-2">
                                                              <FontAwesomeIcon icon={faDollarSign} />
                                                          </span>
                                                          <span>{numberFormatter.format(week.totalAmount)}</span>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="row mt-1">
                                              <div className="col-md-auto ">
                                                  <table className="table table-condensed table-responsive table-responsive-tbody">
                                                      <thead>
                                                          <tr className="txt-clr-blue font-weight-bold">
                                                              {week.tsDayVms.sort((d1, d2) => new Date(d1.day).getTime() - new Date(d2.day).getTime()).map((dayInfo, index) => (
                                                                  <th key={index}>{dayFormatter(dayInfo.day)}</th>
                                                              ))}
                                                          </tr>
                                                      </thead>
                                                      <tbody>
                                                          <tr className="font-weight-bold">
                                                              {week.tsDayVms.sort((d1, d2) => new Date(d1.day).getTime() - new Date(d2.day).getTime()).map((dayInfo, index) => (
                                                                  <td key={index}>{numberFormatter.format(dayInfo.totalHours)}</td>
                                                              ))}
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </div>
                                              <div className="col-md-auto d-flex mt-1 text-right ml-md-auto">
                                                  <p className="mb-2">
                                                      <span className="mobileBlock">
                                                          Approver(s):{" "}
                                                          <span data-tip data-for={"statusTooltip" + week.tsWeekId} className="text-primary ml-1">
                                                              <FontAwesomeIcon icon={faInfoCircle} />
                                                          </span>
                                                      </span>
                                                      <span className="font-weight-bold">{week.timeSheetApprover}</span>
                                                      <ReactTooltip
                                                          place={"top"}
                                                          effect={"solid"}
                                                          multiline={true}
                                                          backgroundColor={"white"}
                                                          type={"success"}
                                                          border={true}
                                                          className=""
                                                          borderColor={"#FE988D"}
                                                          textColor="black"
                                                          id={"statusTooltip" + week.tsWeekId}
                                                      >
                                                          <ReqStatusCard
                                                              orderId={week.tsWeekId}
                                                              orderStatus={"Pending Approval"}
                                                              entityType="Timesheet"
                                                          />
                                                      </ReactTooltip>
                                                  </p>
                                                  <div className="ml-4 d-none d-md-block">
                                                      <Link to={`/timesheets/submitted/${week.tsWeekId}`} className="icon-clr-blue ml-3 mt-2">
                                                          <FontAwesomeIcon icon={faFileAlt} className={"lead"} />
                                                      </Link>
                                                  </div>
                                                <div className=" d-none d-md-block">
                                                    <label className="container-R d-flex col-12">
                                                        <input
                                                            //disabled={dataItem.isLetterExist==false ? true : false}
                                                            type="checkbox"
                                                            checked={week.isSelected}
                                                            onChange={(event) => check(event, week.tsWeekId)}
                                                        />
                                                        <span className="checkmark-R"></span>
                                                    </label>
                                                </div>
                                              </div>
                                          </div>
                                          <hr className="mt-0" />
                                      </div>
                                  ))
                                : ""}
                        </div>
                    </div>
                </td>
            );
        }
    };
}
