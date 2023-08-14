import * as React from "react";
import axios from "axios";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridCellProps, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { CustomHeaderActionCell, CommandCell, TotalHoursCell, DownloadDocument } from "../TimeSheet/GlobalActions";
import { convertShiftDateTime, ErrorComponent, KendoFilter } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faEnvelope, faFileSignature, faInfoCircle, faPrint, faThumbsDown, faThumbsUp, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { authHeader, history, dateFormatter, successToastr, weekDayFormatter, numberFormatter, currencyFormatter, RemoveSecFromTime, clientSettingsData } from "../../../HelperMethods";
import Skeleton from "react-loading-skeleton";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../Shared/withValueField";
import _, { includes } from "lodash";
import { Link } from "react-router-dom";
import { Dialog } from "@progress/kendo-react-dialogs";
import { SettingCategory, SETTINGS, TimesheetStatus, TimesheetStatuses } from "../../Shared/AppConstants";
import Auth from "../../Auth";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import ReactToPrint from "react-to-print";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import ConfirmationLetter from "../../Candidates/MakeAnOffer/OfferInformation/ConfirmationLetter";
import { GENERATE_CONFIRMATION_LETTER_MSG, LETTER_GENERATED_SUCCESSFULLY, TS_PENDING_APPROVAL_CONFIRMATION_MSG, TS_REJECTED_CONFIRMATION_MSG } from "../../Shared/AppMessages";

const CustomDropDownList = withValueField(DropDownList);

export interface SubmittedTimesheetDetailsProps {
    match: any;
}

export interface SubmittedTimesheetDetailsState {
    data?: any;
    documents: any;
    showLoader?: any;
    tsWeekId?: string;
    candidateId?: string;
    serviceTypes?: any;
    clientComments?: any;
    showCommentError?: any;
    globalServiceTypes: any[];
    showContract?: any;
    isEligibleForGauranteedHours?: boolean;
    weeklyGuaranteedHours?: number;
    remainigWeeklyGuaranteedHours?: number;
    weeklyGuaranteedAmount?: number;
    isWeeklyConfirmed?: boolean;
    weeklyGRate?: number;
    showConfirmationModal?: any;
    showRejectModal?: any;
    isConfirmationAssignment: boolean;
    showGenerateLetterModal?: boolean;
    clientId: string;
    isHideGenerateBtn?: boolean;
    isEnablePendingApproval?: boolean;
}

class SubmittedTimesheetDetails extends React.Component<SubmittedTimesheetDetailsProps, SubmittedTimesheetDetailsState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    commentInput: any;
    divRef: any;
    public confirmationLetter;
    constructor(props: SubmittedTimesheetDetailsProps) {
        super(props);
        this.state = {
            data: {}, documents: [], showCommentError: false, clientComments: "", weeklyGuaranteedHours: 0,
            weeklyGuaranteedAmount: 0,
            remainigWeeklyGuaranteedHours: 0,
            weeklyGRate: 0,
            globalServiceTypes: [],
            clientId: Auth.getClient(),
            isConfirmationAssignment: false,
            isHideGenerateBtn: false,
            isEnablePendingApproval: false
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ tsWeekId: id });
        this.getServiceTypes(id);
        this.getClientSettings(this.state.clientId);
    }

    getTimeSheetDetails = (tsWeekId) => {
        this.setState({ showLoader: true });
        axios.get(`api/ts/week/${tsWeekId}`).then((res) => {
            const { data } = res;
            if(res.data && res.data.candSubmissionId){   
                this.setState({
                    data: res.data,
                    showLoader: false,
                    weeklyGuaranteedHours: res.data.gauranteedHours,
                    remainigWeeklyGuaranteedHours: res.data.gauranteedHours,
                    weeklyGuaranteedAmount: res.data.gauranteedAmount,
                    weeklyGRate: res.data.gauranteedHours ? res.data.gauranteedAmount / res.data.gauranteedHours : 0
                }, () => {
                    this.state.data.tsDayVms && this.state.data.tsDayVms.forEach((element, index) => {
                        element.serviceTypes = this.dateWiseServiceTypes(element.day);
                        if (!element.isWorking) {
                            this.disableNonWorkingDay(index);
                        }
                    });
                    this.setState({ data: this.state.data });
                });
            }else{
                history.push('/');
            }
            this.getDocumentPortfolio(data)
        });
        this.getTSDocuments(tsWeekId);
    };

    dateWiseServiceTypes = (startDate) => {
        return this.state.globalServiceTypes.filter(x => new Date(x.startDate).setHours(0, 0, 0, 0) <= new Date(startDate).setHours(0, 0, 0, 0) && new Date(x.endDate).setHours(0, 0, 0, 0) >= new Date(startDate).setHours(0, 0, 0, 0));
    }

    disableNonWorkingDay = (index) => {
        document.querySelectorAll(".grid-" + index).forEach((row) => {
            var node = document.createElement("div");
            node.className = "disabled-grid";
            row.prepend(node);
        });
    }

    getTSDocuments = (tsWeekId) => {
        axios.get(`api/ts/documents?tsWeekId=${tsWeekId}`).then((res) => {
            console.log("Document Data", res.data);
            if (res.data) {
                let fileArray = [...this.state.documents];
                res.data.forEach((doc) => {
                    fileArray.push({
                        candDocumentsId: doc.candDocumentsId,
                        fileName: doc.fileName,
                        file: undefined,
                        isValid: true,
                        path: doc.filePath,
                    });
                });
                this.setState({ documents: fileArray });
            }
        });
    };

    getServiceTypes = (tsWeekId) => {
        axios.get(`api/ts/servicetype?tsWeekId=${tsWeekId}`).then((res) => {
            console.log("Service Types", res.data);
            this.setState({
                globalServiceTypes: res.data,
            }, () => {
                this.setState({ isEligibleForGauranteedHours: this.state.globalServiceTypes.some(x => x.guaranteedHours !=null && x.guaranteedBillType !="Weekly") });
            });
            this.getTimeSheetDetails(tsWeekId);
        });
    };

    BillRateCell = (props: GridCellProps, titleValue, index, isHoliday?) => {
        var fieldValue = props.dataItem[props.field];
        let rate = 0;
        let serviceType = this.state.data.tsDayVms[index].serviceTypes && this.state.data.tsDayVms[index].serviceTypes.find((x) => x.id==props.dataItem.serviceTypeId);
        if (serviceType) {
            if (isHoliday) {
                rate = serviceType.holidayBillRate ? serviceType.holidayBillRate : serviceType.billRate + (serviceType.billRate * 20) / 100;
            } else {
                rate = serviceType.billRate;
            }
        }
        return (
            <td contextMenu={titleValue} title={fieldValue}>
                {currencyFormatter(rate)}
            </td>
        );
    };

    BillAmmountCell = (props: GridCellProps, titleValue, index, isHoliday?) => {
        var fieldValue = props.dataItem[props.field];
        let billAmont = 0;
        let serviceType = this.state.data.tsDayVms[index].serviceTypes && this.state.data.tsDayVms[index].serviceTypes.find((x) => x.id==props.dataItem.serviceTypeId);
        let rate = 0;
        if (serviceType) {
            if (isHoliday) {
                rate = serviceType.holidayBillRate ? serviceType.holidayBillRate : serviceType.billRate + (serviceType.billRate * 20) / 100;
            } else {
                rate = serviceType.billRate;
            }
            if (serviceType.billType=="Hourly") {
                let timeOut = RemoveSecFromTime(props.dataItem.timeOut);
                let timeIn = RemoveSecFromTime(props.dataItem.timeIn);
                //let timeOut = new Date(props.dataItem.timeOut).valueOf();
                //let timeIn = new Date(props.dataItem.timeIn).valueOf();
                let breakHours = parseInt(props.dataItem.breakHour) + parseFloat((parseInt(props.dataItem.breakMinutes) / 60).toString());
                let shiftHours = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5 > 24 ? ((timeOut - timeIn) / 36e5) - 24 : (timeOut - timeIn) / 36e5;
                let workHrs = 0;
                if ((shiftHours - breakHours) < 0) {
                    workHrs = 0;
                }
                else {
                    workHrs = shiftHours - breakHours;
                }
                let effectiveHrs = workHrs + props.dataItem.gauranteedHours;
                billAmont = effectiveHrs * rate;
            } else {
                billAmont = rate;
            }
        }
        return (
            <td contextMenu={titleValue} title={fieldValue}>
                {currencyFormatter(billAmont)}
            </td>
        );
    };

    GauranteedHoursCell = (props: GridCellProps, titleValue) => {
        var fieldValue = props.dataItem[props.field];
        if (fieldValue==null || fieldValue==undefined) {
            fieldValue = 0;
        }
        fieldValue = parseFloat(fieldValue);
        return (
            <td contextMenu={titleValue} className={fieldValue > 0 ? "g-hours-highlight" : ""}>
                {fieldValue.toFixed(2)}
            </td>
        );
    };

    HoursCell = (props: GridCellProps, titleValue) => {
        let timeOut = RemoveSecFromTime(props.dataItem.timeOut);
        let timeIn = RemoveSecFromTime(props.dataItem.timeIn);
        //let timeOut = new Date(props.dataItem.timeOut).valueOf();
        //let timeIn = new Date(props.dataItem.timeIn).valueOf();
        let breakHours = parseInt(props.dataItem.breakHour) + parseFloat((parseInt(props.dataItem.breakMinutes) / 60).toString());
        var fieldValue = props.dataItem[props.field];
        let shiftHours = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5 > 24 ? ((timeOut - timeIn) / 36e5) - 24 : (timeOut - timeIn) / 36e5;
        let workHrs = 0;
        if ((shiftHours - breakHours) < 0) {
            workHrs = 0;
        }
        else {
            workHrs = shiftHours - breakHours;
        }
        return (
            <td contextMenu={titleValue} title={fieldValue}>
                {workHrs.toFixed(2)}
            </td>
        );
    };

    updateTimesheetStatus = (status) => {
        if (status==TimesheetStatus.REJECT && !this.state.clientComments.replace(/^\s+|\s+$/g, "")) {
            this.setState({ showCommentError: true, showRejectModal: false });
            this.commentInput.focus();
            return;
        }
        let data = {
            id: [this.state.tsWeekId],
            statusId: status,
            comment: this.state.clientComments
        };
        axios.patch(`api/ts`, data).then((res) => {
            successToastr("Timesheet updated successfully!");
            history.goBack();
        });
    };

    calculateGuaranteed() {
        let totalGuaranteedHours = 0;
        this.state.data.tsDayVms.forEach((tsDay) => {
            if (tsDay.isWorking) {
                tsDay.tsDayServTypeVms.forEach((tsdayServ) => {
                    let gHours = tsdayServ.gauranteedHours ? tsdayServ.gauranteedHours : 0;
                    totalGuaranteedHours += gHours;
                })
            }
        });
        return totalGuaranteedHours + this.state.weeklyGuaranteedHours;

    }

    calculateOvertimeHours() {
        let totalOvertimeHours = 0;
        this.state.data.tsDayVms.forEach((tsDay) => {
            if (tsDay.isWorking) {
                tsDay.tsDayServTypeVms.forEach((tsdayServ) => {
                    if (tsdayServ.serviceType=='Overtime') {
                        let timeOut = RemoveSecFromTime(tsdayServ.timeOut);
                        let timeIn = RemoveSecFromTime(tsdayServ.timeIn);
                        //let timeOut = new Date(tsdayServ.timeOut).valueOf();
                        //let timeIn = new Date(tsdayServ.timeIn).valueOf();
                        let breakHours = parseInt(tsdayServ.breakHour) + parseFloat((parseInt(tsdayServ.breakMinutes) / 60).toString());
                        let shiftHours = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5;
                        totalOvertimeHours += (shiftHours - breakHours);
                    }
                })
            }
        });
        return totalOvertimeHours;
    }



    printDiv = () => {
        var printContents = document.getElementById("printtableDiv").innerHTML;
        var originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        window.print();

        document.body.innerHTML = originalContents;
    }

    getClientSettings = (clientId) => {
        clientSettingsData(clientId, SettingCategory.CANDIDATE, SETTINGS.CONFIRMATION_OF_ASSIGNMENT, (response) => {
            this.setState({ isConfirmationAssignment: response, showLoader: false });
        });
    };

    getDocumentPortfolio = (data) => {
        var submission = data.candSubmissionId;
        var queryParams = '';
        if (submission !="" && submission !=null && submission !=undefined) {
            queryParams = "?candSubmissionId=" + data.candSubmissionId + "&$filter=docType eq 'Confirmation Letter' and (status eq 'Executed' or status eq 'Client Signed' or status eq 'Pending Signature')"
        }
        axios.get(`/api/candidates/${data.candidateId}/documents` + queryParams).then((res: any) => {
            if (res) {
                var data = res.data;
                var data1 = res.data.filter((i) => i.status=="Executed")
                if (data.length > 0) {
                    this.setState({ isHideGenerateBtn: true });
                }
                if (data1.length > 0) {
                    this.setState({ isEnablePendingApproval: true });
                }
            }
        });
    }

    generateConfirmationLetter = () => {
        this.setState({ showLoader: true, showGenerateLetterModal: false });
        this.confirmationLetter.getConfirmationLetter("");
    }

    render() {
        const {
            provider,
            position,
            vendor,
            submittedOn,
            status,
            division,
            location,
            startDate,
            endDate,
            tsDayVms,
            candSubmissionId,
        } = this.state.data;
        return (
            <React.Fragment>

                <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0" id="printtableDiv" ref={ref => this.divRef = ref}>
                    <div className="container-fluid mt-3 mb-3">
                        <div className="row ml-0 mr-0">
                            <div className="col-12 text-left pl-0 pr-0">
                                <div className="row justify-content-start ml-0 mr-0">
                                    <div className="col mx-auto pl-0 pr-0">
                                        <span className="mobileBlock">Provider:</span>
                                        <span className="font-weight-bold Charcoal-blck pl-lg-2">{provider || "-"}</span>
                                    </div>
                                    <div className="col text-right pl-0 pr-0">
                                        <span className="mobileBlock">Position: </span>
                                        <span className="font-weight-bold Charcoal-blck pl-lg-2">{position || "-"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row ml-0 mr-0 mt-1">
                            <div className="col-12 text-left pl-0 pr-0">
                                <div className="row justify-content-start  ml-0 mr-0">
                                    <div className="col mx-auto pl-0 pr-0">
                                        <span className="mobileBlock">Pay Period:</span>
                                        <span className="font-weight-bold Charcoal-blck pl-lg-2">
                                            {(startDate && dateFormatter(startDate) + " - " + dateFormatter(endDate)) || "-"}
                                        </span>
                                    </div>
                                    <div className="col text-right pl-0 pr-0">
                                        <span className="mobileBlock">Division:</span>
                                        <span className="font-weight-bold Charcoal-blck pl-lg-2">{division || "-"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row ml-0 mr-0 d-flex mt-1">
                            <div className="col-12 text-left pl-0 pr-0">
                                <div className="row justify-content-start  ml-0 mr-0">
                                    <div className="col mx-auto pl-0 pr-0">
                                        <span className="mobileBlock">Dept/Location:</span>
                                        <span className="font-weight-bold Charcoal-blck pl-lg-2">{location || "-"}</span>
                                    </div>
                                    <div className="col text-right pl-0 pr-0">
                                        <span className="mobileBlock">Vendor:</span>
                                        <span className="font-weight-bold Charcoal-blck pl-lg-2">{vendor || "-"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row ml-0 mr-0 d-flex mt-1">
                            <div className="col-12 text-left pl-0 pr-0">
                                <div className="row justify-content-start  ml-0 mr-0">
                                    <div className="col-12 mx-auto pl-0 pr-0">
                                        <span className="mobileBlock">Submitted On:</span>
                                        <span className="font-weight-bold Charcoal-blck pl-lg-2">
                                            {(submittedOn && dateFormatter(submittedOn)) || "-"}
                                        </span>
                                        {/* <span className="mobileBlock">
                                             <span className="font-weight-bold pl-2">{submittedOn && dateFormatter(submittedOn)}</span>
                                        </span> */}
                                        {/* <span className="font-weight-bold Charcoal-blck">06/10/2019 10:30:45 AM EST</span> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row ml-0 mr-0 mt-1">
                            <div className="col-12 col-md-12 mx-auto pl-0 pr-0">
                                <hr className="pb-0 mt-0" />
                            </div>
                        </div>
                        {(Auth.hasPermissionV2(AppPermissions.TS_APPROVE) || Auth.hasPermissionV2(AppPermissions.TS_REJECT)) &&
                            <div className="row mt-1 mb-3">
                                <div className="col-12 col-md-12 mx-auto">
                                    <div className="row ml-0 mr-0 justify-content-end d-print-none">
                                        {tsDayVms ? (
                                            <React.Fragment>
                                                <div className="col-auto mt-2 pr-0">
                                                    <div
                                                        className="submitted-timesheet-color cursor-pointer"
                                                        onClick={() => history.push(`/timesheets/week/${this.state.tsWeekId}/expense`)}
                                                    >
                                                        <span className="submitted-timesheet-color-Expenses">
                                                            <FontAwesomeIcon icon={faDollarSign} className={"text-white"} />
                                                        </span>
                                                        <span className="ml-2 active-icon">Expenses</span>
                                                    </div>
                                                </div>

                                                <div className="col-auto mt-2 pr-0">
                                                    <Link
                                                        className="submitted-timesheet-color"
                                                        to={{
                                                            pathname: `/timesheets/${this.state.tsWeekId}/provider/${candSubmissionId}/contract`,
                                                            state: {
                                                                provider: provider,
                                                                position: position,
                                                                division: division,
                                                                location: location,
                                                                tsWeekId: this.state.tsWeekId,
                                                            },
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faFileSignature} className={"active-icon submitted-timesheet-color_iconsize"} />
                                                        <span className="ml-2 active-icon">Contract</span>
                                                    </Link>
                                                </div>
                                                <div className="col-auto mt-2 pr-0">
                                                    <div
                                                        className="submitted-timesheet-color cursor-pointer"
                                                        onClick={() =>
                                                            history.push(`/timesheet/ratecard/provider/${this.state.data.candSubmissionId}/${this.state.tsWeekId}`)
                                                        }
                                                    >
                                                        <FontAwesomeIcon icon={faDollarSign} className={"active-icon submitted-timesheet-color_iconsize"} />
                                                        <span className="ml-2 active-icon">Rate Card</span>
                                                    </div>
                                                </div>
                                                <div className="col-auto pr-0 pt-2 pt-lg-0">
                                                    {Auth.hasPermissionV2(AppPermissions.TS_REJECT) &&
                                                        <button
                                                            type="button"
                                                            className="btn button button-reject font-weight-bold ml-2 mr-3 rounded shadow"
                                                            onClick={() => this.setState({ showRejectModal: true })}
                                                        >
                                                            Reject
                                                        </button>
                                                    }
                                                    {Auth.hasPermissionV2(AppPermissions.TS_APPROVE) && this.state.data.status != TimesheetStatuses.UNDERREVIEW &&
                                                        <button
                                                            type="button"
                                                            className="btn button button-regular font-weight-bold mr-3 rounded shadow"
                                                            onClick={() => this.updateTimesheetStatus(TimesheetStatus.APPROVE)}
                                                        >
                                                            Approve
                                                        </button>
                                                    }
                                                    {Auth.hasPermissionV2(AppPermissions.TS_UNDER_REVIEW_CREATE) && this.state.data.status==TimesheetStatuses.UNDERREVIEW &&
                                                        <button
                                                            //disabled={this.state.isEnablePendingApproval==true ? false : true}
                                                            type="button"
                                                            className="btn button button-regular font-weight-bold mr-3 rounded shadow"
                                                            onClick={() => this.setState({ showConfirmationModal: true })}
                                                        >
                                                            Set To Pending Approval
                                                        </button>
                                                    }
                                                    <ReactToPrint
                                                        trigger={() => {
                                                            return <button
                                                                type="button"
                                                                className="btn button button-regular font-weight-bold rounded shadow"
                                                            //onClick={this.printDiv}
                                                            >
                                                                <FontAwesomeIcon icon={faPrint} />
                                                            </button>
                                                        }}
                                                        content={() => this.divRef}
                                                        documentTitle={"Submitted Timesheet"}
                                                    ></ReactToPrint>
                                                </div>
                                            </React.Fragment>
                                        ) :
                                            <div>{Array.from({ length: 5 }).map((item, j) => (<span style={{ paddingRight: "10px" }}><Skeleton height={40} width={70} /></span>))}</div>}
                                    </div>
                                </div>
                            </div>
                        }

                        <div className="row ml-0 mr-0 mt-2">
                            <div className="col-12 col-md-12 mx-auto pl-0 pr-0">
                                <div className="shadow">
                                    <div id="print">
                                        <div className="row value-card-bg ml-0 mr-0">
                                            <div className="col border-right">
                                                <div className="row">
                                                    <div className="col font-weight-bold pt-2 height-50">Total Hours</div>
                                                    <div className="col txt-clr font-weight-bold text-right pt-2 pt-lg-4 pb-1 pb-lg-2">
                                                        {tsDayVms && numberFormatter.format(this.state.data.totalHours)}
                                                        {!tsDayVms && "-"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col border-right">
                                                <div className="row">
                                                    <div className="col font-weight-bold pt-2  height-50">Overtime Hours</div>
                                                    <div className="col txt-clr font-weight-bold text-right pt-2 pt-lg-4 pb-1 pb-lg-2">
                                                        {tsDayVms && numberFormatter.format(this.calculateOvertimeHours())}
                                                        {!tsDayVms && "-"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="row">
                                                    <div className="col font-weight-bold pt-2  height-50">Guaranteed Hours</div>
                                                    <div className="col txt-clr font-weight-bold text-right pt-2 pt-lg-4 pb-1 pb-lg-2">
                                                        {tsDayVms && numberFormatter.format(this.calculateGuaranteed())}
                                                        {!tsDayVms && "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid">
                        {!tsDayVms &&
                            Array.from({ length: 3 }).map(() => (
                                <div className="row">
                                    <div className="col-12 col-sm-4 col-lg-12 mt-sm-0 mb-3 mt-1">
                                        <Skeleton height={40} />
                                        <Skeleton height={40} />
                                        <Skeleton height={40} />
                                    </div>
                                </div>
                            ))}
                        {tsDayVms &&
                            tsDayVms
                                .sort((d1, d2) => new Date(d1.day).getTime() - new Date(d2.day).getTime())
                                .map((day, index) => (
                                    <div className="myOrderContainer">
                                        <div className="day-header col-12">
                                            <span>{weekDayFormatter(new Date(day.day))}</span>
                                            {day.isHoliday && <FontAwesomeIcon icon={faInfoCircle} title="Holiday" className="info-icon" />}
                                            <label className="container-R checkPosition_createorder-timesheet-after float-right">
                                                <input
                                                    type="checkbox"
                                                    disabled={this.state.data.submittedOn !=null}
                                                    checked={day.isWorking}
                                                    className="mr-1"
                                                />
                                                <span className="ml-1 mt-1 font-weight-normal font-medium">Working Day</span>
                                                <span className="checkmark-R checkPosition_createorder-timesheet"></span>
                                            </label>
                                        </div>
                                        <div className="table-responsivee tableShadow table-TimeSheet global-action-grid-status-active">
                                            <Grid
                                                className={"kendo-grid-custom grid-" + index}
                                                style={{ height: "auto" }}
                                                data={day.tsDayServTypeVms}
                                                editField="inEdit"
                                                key={index}
                                                sort={[{ field: "createdDate", dir: "asc" }]}
                                            >
                                                <GridColumn className="serviceType-submittedd" field="serviceType" title="Service Type" />

                                                <GridColumn
                                                    field="timeIn"
                                                    title="Time In"
                                                    cell={(props) => <td contextMenu="Time In">{convertShiftDateTime(props.dataItem.timeIn)}</td>}
                                                />

                                                <GridColumn
                                                    field="timeOut"
                                                    title="Time Out"
                                                    cell={(props) => <td contextMenu="Time Out">{convertShiftDateTime(props.dataItem.timeOut)}</td>}
                                                />
                                                <GridColumn
                                                    field="breakTime"
                                                    title="Break"
                                                    width="120px"
                                                    cell={(props) => (
                                                        <td contextMenu="Break">
                                                            {props.dataItem.breakHour +
                                                                ":" +
                                                                (props.dataItem.breakMinutes.length < 2
                                                                    ? "0" + props.dataItem.breakMinutes
                                                                    : props.dataItem.breakMinutes)}
                                                        </td>
                                                    )}
                                                />
                                                <GridColumn
                                                    field="workHours"
                                                    title="Work Hours"
                                                    width="100px"
                                                    cell={(props) => this.HoursCell(props, "Work Hours")}
                                                    footerCell={(props) =>
                                                        TotalHoursCell(day.isHoliday, day.isWorking ? this.state.data : undefined, index, false)
                                                    }
                                                />
                                                {this.state.isEligibleForGauranteedHours &&
                                                    <GridColumn
                                                        field="gauranteedHours"
                                                        title="Guaranteed Hours"
                                                        cell={(props) => this.GauranteedHoursCell(props, "Guaranteed Hours")}
                                                    />
                                                }
                                                <GridColumn
                                                    field="billRate"
                                                    title="Bill Rate"
                                                    cell={(props) => this.BillRateCell(props, "Bill Rate", index, day.isHoliday)}
                                                />
                                                <GridColumn
                                                    field="billAmount"
                                                    title="Bill Amount"
                                                    cell={(props) => this.BillAmmountCell(props, "Bill Amount", index, day.isHoliday)}
                                                />
                                                <GridColumn field="comment" className="comment-submittedd" title="Comment" />
                                            </Grid>
                                        </div>
                                    </div>
                                ))}
                        {this.state.weeklyGuaranteedHours > 0 &&
                            <div className="col-12 col-sm-12 col-lg-12 mt-3 mb-3 text-center font-weight-bold d-flex align-items-center justify-content-center weeky-guaranteed-row">
                                <div className="row align-items-center justify-content-center mx-0">
                                    <div className="col-12 col-sm-auto mt-2 mt-sm-0">
                                        <div className="row mx-0 align-items-center justify-content-center">
                                            <div className="col-12 col-sm-auto col-lg-auto font-weight-bold pl-0 pr-2">Weekly Guaranteed hours :</div>
                                            <div className="col-auto col-lg-auto total-hours-amount-timesheet total-hours-font-size pr-0 font-weight-bold text-left pl-0 total-hours total-hours-font-size total-hours-amount-timesheet timeSheet-break-hours-amount">{this.state.weeklyGuaranteedHours.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-auto mt-2 mt-sm-0">
                                        <div className="row mx-0 align-items-center justify-content-center">
                                            <div className="col-12 col-sm-auto col-lg-auto font-weight-bold pl-0 pr-2">Rate :</div>
                                            <div className="col-auto col-lg-auto total-hours-amount-timesheet total-hours-font-size pr-0 font-weight-bold text-left pl-0 total-hours total-hours-font-size total-hours-amount-timesheet timeSheet-break-hours-amount">{currencyFormatter(this.state.weeklyGRate.toFixed(2))}</div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-auto mt-2 mt-sm-0">
                                        <div className="row mx-0 align-items-center justify-content-center">
                                            <div className="col-12 col-sm-auto col-lg-auto font-weight-bold pl-0 pr-2">Weekly Guaranteed Amount :</div>
                                            <div className="col-auto col-lg-auto total-hours-amount-timesheet total-hours-font-size pr-0 font-weight-bold text-left pl-0 total-hours total-hours-font-size total-hours-amount-timesheet timeSheet-break-hours-amount">{currencyFormatter((this.state.weeklyGuaranteedHours * this.state.weeklyGRate).toFixed(2))}</div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div>Weekly Guaranteed hours :<span className="total-hours total-hours-font-size pl-2 pr-3">{this.state.weeklyGuaranteedHours.toFixed(2)}</span></div> */}
                                {/* <div>Rate : <span className="total-hours total-hours-font-size pl-2 pr-3"> {currencyFormatter(this.state.weeklyGRate.toFixed(2))}</span></div> */}
                                {/* <div>Weekly Guaranteed Amount : <span className="total-hours total-hours-font-size pl-2"> {currencyFormatter((this.state.weeklyGuaranteedHours * this.state.weeklyGRate).toFixed(2))}</span></div> */}
                            </div>
                        }
                        <div className="row ml-0 mr-0 mt-3">
                            <div className="col-12 col-md-12 mx-auto pl-0 pr-0">
                                <div className="form-group">
                                    <textarea
                                        ref={(input) => { this.commentInput = input; }}
                                        className="form-control font-regular grainsboro-clr"
                                        value={this.state.clientComments}
                                        onChange={(e) => this.setState({ clientComments: e.target.value, showCommentError: false })}
                                        rows={3}
                                        id="clientComment"
                                        name="text"
                                        placeholder="Client Comment"
                                    ></textarea>
                                    <label
                                        style={{ display: this.state.showCommentError ? "block" : "none", color: "red", fontSize: "12px" }}
                                    >
                                        <ErrorComponent />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-sm-4 col-lg-4 mt-2 mb-2 mb-sm-0  mt-sm-0">
                                <label className="mb-0 font-weight-bold ">Uploaded Documents</label>
                                <div className="file-list">
                                    {this.state.documents.length > 0 &&
                                        this.state.documents.map((file, i) => (
                                            <span>
                                                <span
                                                    title={file.fileName}
                                                    onClick={() => file.candDocumentsId && DownloadDocument(file.path)}
                                                    className={file.isValid ? "valid-file" : "invalid-file"}
                                                >
                                                    {file.fileName}
                                                </span>
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 d-print-none">
                            <div className="col-sm-12 col-12 p-2">
                                <div className="row text-center">
                                    <div className="col-12 mt-4 mb-4">
                                        {/* <Link to="/timesheets/submitted"> */}
                                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-2"} />
                                                Close
                                            </button>
                                        {/* </Link> */}
                                        {Auth.hasPermissionV2(AppPermissions.TS_REJECT) &&
                                            <button
                                                type="button"
                                                onClick={() => this.setState({ showRejectModal: true })}
                                                className="btn button button-reject mr-2 shadow mb-2 mb-xl-0"
                                            >
                                                <FontAwesomeIcon icon={faThumbsDown} className={"mr-2"} />
                                                Reject
                                            </button>
                                        }
                                        {Auth.hasPermissionV2(AppPermissions.TS_APPROVE) && this.state.data.status != TimesheetStatuses.UNDERREVIEW &&
                                            <button
                                                type="button"
                                                onClick={() => this.updateTimesheetStatus(TimesheetStatus.APPROVE)}
                                                className="btn button button-regular font-weight-bold mr-3 rounded shadow mb-2 mb-xl-0"
                                            >
                                                <FontAwesomeIcon icon={faThumbsUp} className={"mr-2"} />
                                                Approve
                                            </button>
                                        }
                                        {Auth.hasPermissionV2(AppPermissions.TS_UNDER_REVIEW_CREATE) && this.state.data.status==TimesheetStatuses.UNDERREVIEW &&
                                            <button
                                                //disabled={this.state.isEnablePendingApproval==true ? false : true}
                                                type="button"
                                                onClick={() => this.setState({ showConfirmationModal: true })}
                                                className="btn button button-regular font-weight-bold mr-3 rounded shadow mb-2 mb-xl-0"
                                            >
                                                <FontAwesomeIcon icon={faThumbsUp} className={"mr-2"} />
                                                Set To Pending Approval
                                            </button>
                                        }
                                        {Auth.hasPermissionV2(AppPermissions.GENERATE_CONFIRMATION_LETTER) && this.state.data.status==TimesheetStatuses.UNDERREVIEW && this.state.isConfirmationAssignment && this.state.isHideGenerateBtn==false &&
                                            <button
                                                type="button"
                                                onClick={() => this.setState({ showGenerateLetterModal: true })}
                                                className="btn button button-regular font-weight-bold mr-3 rounded shadow mb-2 mb-xl-0"
                                            >
                                                <FontAwesomeIcon icon={faEnvelope} className={"mr-2"} />
                                                Generate Letter
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        <ConfirmationModal
                            message={TS_REJECTED_CONFIRMATION_MSG()}
                            showModal={this.state.showRejectModal}
                            handleYes={() => this.updateTimesheetStatus(TimesheetStatus.REJECT)}
                            handleNo={() => {
                                this.setState({ showRejectModal: false });
                            }}
                        />
                        <ConfirmationModal
                            message={TS_PENDING_APPROVAL_CONFIRMATION_MSG()}
                            showModal={this.state.showConfirmationModal}
                            handleYes={() => this.updateTimesheetStatus(TimesheetStatus.PENDINGAPPROVAL)}
                            handleNo={() => {
                                this.setState({ showConfirmationModal: false });
                            }}
                        />
                        <ConfirmationModal
                            message={GENERATE_CONFIRMATION_LETTER_MSG}
                            showModal={this.state.showGenerateLetterModal}
                            handleYes={(e) =>
                                this.generateConfirmationLetter()
                            }
                            handleNo={() => {
                                this.setState({ showGenerateLetterModal: false });
                            }}
                        />
                        <ConfirmationLetter
                            ref={(instance) => {
                                this.confirmationLetter = instance;
                            }}
                            candSubmissionId={this.state.data.candSubmissionId}
                            candidateId={this.state.data.candidateId}
                            vendor={this.state.data.vendor}
                            reqNumber={this.state.data.reqNumber}
                            createDocPortfolio={true}
                            redirectTo={`/timesheets/underreview`}
                            jobDetailPage={true}
                        />
                </div>
            </React.Fragment>
        );
    }
}

export default SubmittedTimesheetDetails;
