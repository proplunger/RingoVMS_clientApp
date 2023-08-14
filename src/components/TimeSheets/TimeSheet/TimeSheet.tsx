import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { CellRender, GridNoRecord } from "../../Shared/GridComponents/CommonComponents";
import { Grid, GridCellProps, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { CustomHeaderActionCell, CommandCell, TotalHoursCell, GrandTotalCell } from "./GlobalActions";
import { convertShiftDateTime, ErrorComponent, KendoFilter } from "../../ReusableComponents";
import "../../../assets/css/App.css";
import "../../../assets/css/KendoCustom.css";
import { TsDayServType } from "./ITimeSheetModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faClock, faDollarSign, faExclamationCircle, faEye, faFileSignature, faInfoCircle, faPaperclip, faPencilAlt, faPlusCircle, faPrint, faSave, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { authHeader, history, dateFormatter, successToastr, weekDayFormatter, toLocalDateTime, setContractData, currencyFormatter, RemoveSecFromTime } from "../../../HelperMethods";
import Skeleton from "react-loading-skeleton";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../Shared/withValueField";
import { TimePicker } from "@progress/kendo-react-dateinputs";
import _, { includes, result } from "lodash";
import { Link } from "react-router-dom";
import { Comment } from "../../Shared/Comment/Comment";
import CommentHistoryBox from "../../Shared/Comment/CommentHistoryBox";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import AlertBox from "../../Shared/AlertBox";
import { TIMESHEET_WEEK_SUBMIT_CONFIRMATION_MSG, TIMESHEET_WEEK_RESUBMIT_CONFIRMATION_MSG, REMOVE_TS_DOCUMENT_CONFIRMATION_MSG, TS_UNDERREVIEW_CONFIRMATION_MSG, TS_CONFIRMATION_INACTIVE_CONFIRMATION_MSG, TS_UNDERREVIEW_CONFIRMATION_INACTIVE_MSG, CONFIRMATION_LETTER_COMMENT_MSG } from "../../Shared/AppMessages";
import { allowedFileExtentions, allowedMymeTypes, AuthRole, AuthRoleType, BillRateStatus, isRoleType, TimeSheetCheck, TimesheetStatus, TimesheetStatuses, TsUnderReviewReasons } from "../../Shared/AppConstants";
import { setTimeout } from "timers";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import DocumentsPortfolio from "../../Shared/DocumentsPortfolio/DocumentsPortfolio";
import ReactToPrint from "react-to-print";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";

const defaultItem = { name: "Select", id: null };
const CustomDropDownList = withValueField(DropDownList);

export interface TimeSheetProps {
    match: any;
}

export interface TimeSheetState {
    data: any;
    provider?: string;
    status?: string;
    payPeriod?: string;
    division?: string;
    location?: string;
    position?: string;
    clientId: string;
    globalServiceTypes: any[];
    serviceTypes: any[];
    // shiftTypes: any[];
    showLoader?: boolean;
    totalCount?: number;
    total?: any;
    candSubmissionId?: string;
    tsWeekId?: string;
    hours?: any[];
    minutes?: any[];
    openCommentBox?: boolean;
    fileArray?: any[];
    showModal?: boolean;
    showSubmitConfirmationModal?: boolean;
    showNotWorkingConfirmationModal?: boolean;
    showReSubmitConfirmationModal?: boolean;
    isEligibleForGauranteedHours?: boolean;
    openAlert?: boolean;
    showMarkNonWorkingDay?: boolean;
    showInvalidFileAlert?: boolean;
    showAddGuaranteedHoursModal?: boolean;
    guranteedHours?: any;
    showGHrsError?: boolean;
    weeklyGuaranteedHours?: number;
    remainigWeeklyGuaranteedHours?: number;
    weeklyGuaranteedAmount?: number;
    isWeeklyConfirmed?: boolean;
    weeklyGRate?: number;
    showRemoveModal?: boolean;
    showReqNumber?: boolean;
    oldStatus?: string;
    approverComments?: any;
    approverCommentError?: any;
    showUnderReviewModal?: any;
    tsLockdownDays?: any;
    confirmationInactive?: any;
    confirmationInactiveAndUnderReview?: any;
    reason?: any;
}
const steps = {
    minute: 15,
};
class TimeSheet extends React.Component<TimeSheetProps, TimeSheetState> {
    invalidFileList: any[];
    globalFileId: any;
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    editField = "inEdit";
    private originalTsData;
    uploadControl: HTMLInputElement;
    globalDataItem;
    globalIndex;
    alertMessage = "";
    isWorkingChangeIndex;
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public reqId: string;
    public dataItem: any;
    public openModal: any;
    globalGuarateedHrs: any;
    public gHrsErrorMesage: any;
    public fileArrayGlobal: any[];
    public divRef;
    constructor(props: TimeSheetProps) {
        super(props);
        this.state = {
            data: [],
            provider: "-",
            status: "-",
            clientId: auth.getClient(),
            serviceTypes: [],
            globalServiceTypes: [],
            // shiftTypes: [],
            hours: [
                { id: "0", name: "0" },
                { id: "1", name: "1" },
                { id: "2", name: "2" },
                { id: "3", name: "3" },
                { id: "4", name: "4" },
            ],
            minutes: [
                { id: "00", name: "00" },
                { id: 15, name: "15" },
                { id: 30, name: "30" },
                { id: 45, name: "45" },
            ],
            showLoader: true,
            total: 0,
            fileArray: [],
            weeklyGuaranteedHours: 0,
            weeklyGuaranteedAmount: 0,
            remainigWeeklyGuaranteedHours: 0,
            weeklyGRate: 0,
            approverComments: "",
        };
        this.initializeHeaderCell(true);
        this.initializeActionCell();
    }

    initializeHeaderCell = (canAdd) => {
        this.CustomHeaderActionCellTemplate = (index) => {
            let i = index;
            return CustomHeaderActionCell({
                addNew: this.addNew,
                canAdd: canAdd,
                index: index,
            });
        };
    };

    initializeActionCell = () => {
        this.CommandCell = (index) => {
            let i = index;
            return CommandCell({
                edit: this.enterEdit,
                remove: this.del,
                discard: this.reset,
                save: this.save,
                editField: this.editField,
                parentIndex: index,
            });
        };
    };

    getWeeklyTimeSheetInfo = (tsWeekId) => {
        this.setState({ showLoader: true });
        axios.get(`api/ts/week/${tsWeekId}`).then((res) => {
          if(res.data && res.data.candSubmissionId){
                this.setState({
                    data: res.data,
                    showLoader: false,
                    candSubmissionId: res.data.candSubmissionId,
                    weeklyGuaranteedHours: res.data.gauranteedHours,
                    remainigWeeklyGuaranteedHours: res.data.gauranteedHours,
                    weeklyGuaranteedAmount: res.data.gauranteedAmount,
                    weeklyGRate: res.data.gauranteedHours ? res.data.gauranteedAmount / res.data.gauranteedHours : 0
                }, () => {
                    setTimeout(() => this.setState(this.state), 1000);
                    this.state.data.tsDayVms && this.state.data.tsDayVms.forEach((element, index) => {
                        element.serviceTypes = this.dateWiseServiceTypes(element.day);
                        if (!element.isWorking) {
                            this.disableNonWorkingDay(index);
                        }
                    });
                    this.setState({ data: this.state.data }, () => {
                        var urlParams = new URLSearchParams(window.location.search);

                        if (urlParams.get("print")) {
                            document.getElementById('printTimesheet').click()
                        }
                    });
                });

                this.originalTsData = _.cloneDeep(res.data);
            }else{
                history.push('/');
            }
        });
        this.getTSWeekDocuments(tsWeekId);

    };

    dateWiseServiceTypes = (startDate) => {
        let distinctServices = [];
        let boundryData = this.state.globalServiceTypes.filter(x => new Date(x.startDate).setHours(0, 0, 0, 0) <= new Date(startDate).setHours(0, 0, 0, 0) && new Date(x.endDate).setHours(0, 0, 0, 0) >= new Date(startDate).setHours(0, 0, 0, 0));
        boundryData.forEach(element => {
            if (distinctServices.findIndex(x => x.id==element.id)==-1) {
                distinctServices.push(element);
            }
        });
        return distinctServices;
    }

    formatTolocal = (data) => {
        data.tsDayVms.forEach((tsDay) => {
            tsDay.tsDayServTypeVms.forEach((tsdayServ) => {
                tsdayServ.timeOut = toLocalDateTime(tsdayServ.timeOut);
                tsdayServ.timeIn = toLocalDateTime(tsdayServ.timeIn);
            });
        });
        return data;
    };

    getTSWeekDocuments = (tsWeekId) => {
        axios.get(`api/ts/documents?tsWeekId=${tsWeekId}`).then((res) => {
            if (res.data) {
                let fileArray = [];
                res.data.forEach((doc) => {
                    fileArray.push({
                        candDocumentsId: doc.candDocumentsId,
                        fileName: doc.fileName,
                        file: undefined,
                        isValid: true,
                        path: doc.filePath,
                    });
                });
                this.setState({ fileArray: fileArray });
            }
        });
    };

    download = (filePath) => {
        axios.get(`/api/candidates/documents/download?filePath=${filePath}`).then((res: any) => {
            if (res) {
                let fileExt = filePath.split('.')[1].toLowerCase();
                let fileType;
                if (fileExt=="jpg" || fileExt=="png" || fileExt=="jpeg") {
                    fileType = "image";
                } else {
                    fileType = "application";
                }
                const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
                const downloadLink = document.createElement("a");
                let fileName = filePath.split("/")[2];

                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            }
        });
    };

    getServiceTypes = (tsWeekId) => {
        axios.get(`api/ts/servicetype?tsWeekId=${tsWeekId}&$filter=status ne '${BillRateStatus.REJECTED}' and status ne '${BillRateStatus.PENDINGAPPROVAL}'`).then((res) => {
            this.setState({
                globalServiceTypes: res.data,
                //serviceTypes: res.data
            }, () => {
                this.setState({ isEligibleForGauranteedHours: this.state.globalServiceTypes.some(x => x.guaranteedHours !=null && x.guaranteedBillType !="Weekly") });
            });
            this.getWeeklyTimeSheetInfo(this.state.tsWeekId);
        });
    };

    getWFHistory = (tsWeekId) => {
        axios.get(`api/requisitions/${tsWeekId}/workflowhistory`).then((res) => {
            if (res.data.length > 0) {
                this.setState({ oldStatus: res.data[res.data.length-1].oldStatus });
            }
        });
    };

    addNew = (dataIndex) => {
        var timeIn = new Date();
        timeIn.setHours(9);
        timeIn.setMinutes(30);
        timeIn.setSeconds(0);
        timeIn.setMilliseconds(0);
        var timeOut = new Date();
        timeOut.setHours(17);
        timeOut.setMinutes(30);
        timeOut.setSeconds(0);
        timeOut.setMilliseconds(0);
        const newDataItem: TsDayServType = {
            inEdit: true,
            serviceTypeId: null,
            // shiftId: this.state.shiftTypes[0].id,
            timeIn: timeIn.toISOString(),
            timeOut: timeOut.toISOString(),
            saveTimeOut: toLocalDateTime(timeOut),
            saveTimeIn: toLocalDateTime(timeIn),
            billType: "-",
            //gauranteedHours: 0,
            breakHour: "1",
            breakMinutes: "00",
        };

        this.state.data.tsDayVms[dataIndex].tsDayServTypeVms.push(newDataItem);
        this.setState({ data: this.state.data });
    };

    enterEdit = (dataItem) => {
        dataItem.inEdit = true;
        this.setState({ data: this.state.data });
    };

    reset = (dataItem, parentIndex) => {
        const originalItem = this.originalTsData.tsDayVms[parentIndex].tsDayServTypeVms.find((p) => p.tsDayServTypeId ==dataItem.tsDayServTypeId);
        originalItem["inEdit"] = undefined;
        const data = this.state.data.tsDayVms[parentIndex].tsDayServTypeVms.map((item) =>
            item.tsDayServTypeId ==originalItem.tsDayServTypeId ? originalItem : item
        );
        this.originalTsData = _.cloneDeep(this.originalTsData);
        this.state.data.tsDayVms[parentIndex].tsDayServTypeVms = data;
        this.setState({ data: this.state.data });
    };

    isOverlapping = (dataItem, dataIndex, parentIndex) => {
        let isOverlappping = false;
        let data = this.state.data.tsDayVms[parentIndex].tsDayServTypeVms.filter(x => !x.inEdit);
        let timeOut = new Date(new Date(dataItem.timeOut).toISOString()).setSeconds(0, 0).valueOf();
        let timeIn = new Date(new Date(dataItem.timeIn).toISOString()).setSeconds(0, 0).valueOf();
        if (data.length > 0) {
            let existing = data.filter(x => (timeIn >= new Date(x.timeIn).setSeconds(0, 0).valueOf() && timeIn < new Date(x.timeOut).setSeconds(0, 0).valueOf())
                || (timeOut > new Date(x.timeIn).setSeconds(0, 0).valueOf() && timeOut < new Date(x.timeOut).setSeconds(0, 0).valueOf()));
                //|| (timeIn >= new Date(x.timeIn).setSeconds(0, 0).valueOf() && timeOut < new Date(x.timeOut).setSeconds(0, 0).valueOf()));


            if (existing.length > 0) {
                isOverlappping = true;
            }
        }
        return isOverlappping;
    }


    isMoreThan24 = (dataItem, parentIndex) => {
        let isMoreThan24 = false;
        let totalHours = 0;
        let data = this.state.data.tsDayVms[parentIndex].tsDayServTypeVms.filter(x => !x.inEdit);
        data.forEach((item) => {
            let gHours = item.gauranteedHours ? item.gauranteedHours : 0;
            let timeOut = RemoveSecFromTime(item.timeOut);
            let timeIn = RemoveSecFromTime(item.timeIn);
            //let timeOut = new Date(item.timeOut).valueOf();
            //let timeIn = new Date(item.timeIn).valueOf();
            let hour = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5 > 24 ? ((timeOut - timeIn) / 36e5) - 24 : (timeOut - timeIn) / 36e5==0 ? 24 : (timeOut - timeIn) / 36e5;
            let breakHours = parseInt(item.breakHour) + parseFloat((parseInt(item.breakMinutes) / 60).toString());
            let workHrs = 0;
            if ((hour - breakHours) < 0) {
                workHrs = 0;
            }
            else {
                workHrs = hour - breakHours;
            }
            totalHours = workHrs + gHours;


            let newRowTimeOut = RemoveSecFromTime(dataItem.timeOut);
            let newRowTimeIn = RemoveSecFromTime(dataItem.timeIn);
            //let newRowTimeOut = new Date(dataItem.timeOut).valueOf();
            //let newRowTimeIn = new Date(dataItem.timeIn).valueOf();
            let newRowHour = (newRowTimeOut - newRowTimeIn) / 36e5 < 0 ? 24 + (newRowTimeOut - newRowTimeIn) / 36e5 : (newRowTimeOut - newRowTimeIn) / 36e5 > 24 ? ((newRowTimeOut - newRowTimeIn) / 36e5) - 24 : (newRowTimeOut - newRowTimeIn) / 36e5==0 ? 24 : (newRowTimeOut - newRowTimeIn) / 36e5;
            let newRowBreakHours = parseInt(dataItem.breakHour) + parseFloat((parseInt(dataItem.breakMinutes) / 60).toString());

            let newRowWorkHrs = 0;
            if ((newRowHour - newRowBreakHours) < 0) {
                newRowWorkHrs = 0;
            }
            else {
                newRowWorkHrs = newRowHour - newRowBreakHours;
            }
            let newRowTotalHours = newRowWorkHrs + (dataItem.gauranteedHours ? dataItem.gauranteedHours : 0);

            if (totalHours + newRowTotalHours > 24) {
                isMoreThan24 = true;
            }
        });
        return isMoreThan24;
    }

    save = (dataItem: TsDayServType, dataIndex, parentIndex) => {
        if (!dataItem.serviceTypeId) {
            dataItem.invalidServiceType = true;
            //return false;
        }
        else if (dataItem.gauranteedHours > dataItem.maxGuaranteedHours) {
            dataItem.invalidHours = true;
            this.setState(this.state);
            //return false;
        }
        else if (dataItem.gauranteedHours < 0) {
            dataItem.isNegetiveGHours = true;
            this.setState(this.state);
            //return false;
        }
        else if (this.isOverlapping(dataItem, dataIndex, parentIndex)) {
            this.alertMessage = "Selected duration overlaps with time saved for another service type. Please update.";
            this.setState({ openAlert: true });
            return false;
        }
        else if (this.isMoreThan24(dataItem, parentIndex)) {
            this.alertMessage = "Total hours cannot exceed 24 hours for same day.";
            this.setState({ openAlert: true });
            return false;
        }
        else {
            let data = {
                tsWeekId: this.state.tsWeekId,
                tsDayId: this.state.data.tsDayVms[parentIndex].tsDayId,
                dayTotalHours: this.state.data.tsDayVms[parentIndex].totalHours,
                dayTotalAmount: this.state.data.tsDayVms[parentIndex].totalAmount,
                totalHours: this.state.data.totalHours,
                totalAmount: this.state.data.totalAmount,
                tsDayServTypeVm: dataItem
            }
            axios
                .put(`/api/ts/update/tsdayserve/inline/`, data).then(result => {
                    this.state.data.tsDayVms[parentIndex].tsDayServTypeVms[dataIndex - 1].tsDayServTypeId = result.data;
                    dataItem.inEdit = undefined;
                    this.originalTsData = _.cloneDeep(this.state.data);
                    this.setState({ data: this.state.data });
                    successToastr("Updated successfully.");
                })
        }
        //this.setState({ data: this.state.data });
    };

    del = (dataItem, parentIndex) => {
        //if (dataItem.tsDayServTypeId !=null) {
        this.globalDataItem = dataItem;
        this.globalIndex = parentIndex;
        this.setState({ showModal: true });
        // } else {
        //     this.remove(dataItem, parentIndex);
        // }
    };

    remove = (dataItem, parentIndex) => {
        this.setState({ showModal: false });
        const data = this.state.data.tsDayVms[parentIndex].tsDayServTypeVms;
        this.removeItem(data, dataItem);
        this.state.data.tsDayVms[parentIndex].tsDayServTypeVms = data;
        this.setState({ data: this.state.data });
        if (dataItem.tsDayServTypeId) {
            let data = {
                tsDayServTypeId: dataItem.tsDayServTypeId
            }
            axios
                .put(`/api/ts/delete/inline/`, data).then(result => {
                    successToastr("Deleted successfully.");
                })
        }
    };

    removeItem(data, item) {
        let index = data.findIndex((p) => p ==item || (item.tsDayServTypeId && p.tsDayServTypeId ==item.tsDayServTypeId));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    HoursCell = (props: GridCellProps, titleValue, index, isHoliday?) => {
        let timeOut = RemoveSecFromTime(props.dataItem.timeOut);
        let timeIn = RemoveSecFromTime(props.dataItem.timeIn);
        //let timeOut = new Date(props.dataItem.timeOut).valueOf();
        //let timeIn = new Date(props.dataItem.timeIn).valueOf();
        let breakHours = parseInt(props.dataItem.breakHour) + parseFloat((parseInt(props.dataItem.breakMinutes) / 60).toString());
        var fieldValue = props.dataItem[props.field];
        let shiftHours = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5 > 24 ? ((timeOut - timeIn) / 36e5) - 24 : (timeOut - timeIn) / 36e5==0 ? 24 : (timeOut - timeIn) / 36e5;
        let workHrs = 0;
        if ((shiftHours - breakHours) < 0) {
            workHrs = 0;
        }
        else {
            workHrs = shiftHours - breakHours;
        }
        workHrs = this.fix(workHrs, 2, 2);
        props.dataItem.workHours = workHrs;

        if (isRoleType(AuthRoleType.Provider)) {
            let rate = 0;
            let billType;
            if (isHoliday==false && props.dataItem.rate) {
                rate = props.dataItem.rate;
                billType = props.dataItem.billType;
            } else {
                let serviceType = this.state.data.tsDayVms[index].serviceTypes && this.state.data.tsDayVms[index].serviceTypes.find((x) => x.id==props.dataItem.serviceTypeId);
                if (serviceType) {
                    if (isHoliday) {
                        rate = serviceType.holidayBillRate ? serviceType.holidayBillRate : serviceType.billRate;
                    } else {
                        rate = serviceType.billRate;
                    }
                    props.dataItem.billType = serviceType.billType;
                    billType = serviceType.billType;
                }
            }
            props.dataItem.rate = rate;
        }

        return (
            <td contextMenu={titleValue} title={fieldValue}>
                {workHrs}
            </td>
        );
    };
    changeGuaranteedHrs = (e) => {
        this.setState({ showGHrsError: false, remainigWeeklyGuaranteedHours: parseFloat(e.target.value) });
    }

    addGuaranteedHrs = () => {
        if ((this.state.remainigWeeklyGuaranteedHours==0 || this.state.remainigWeeklyGuaranteedHours==undefined)) {
            this.gHrsErrorMesage = "This field is required";
            this.setState({ showGHrsError: true });
            return false;
        }
        if (this.state.remainigWeeklyGuaranteedHours && isNaN(this.state.remainigWeeklyGuaranteedHours)) {
            this.gHrsErrorMesage = "Only numbers allowed";
            this.setState({ showGHrsError: true });
            return false;
        }
        if (this.state.remainigWeeklyGuaranteedHours < 0) {
            this.gHrsErrorMesage = "Guaranteed hours cant be less than 0";
            this.setState({ showGHrsError: true });
            return false;
        }
        if (this.state.remainigWeeklyGuaranteedHours > this.globalGuarateedHrs) {
            this.gHrsErrorMesage = "Guaranteed hours cannot be greater than " + this.globalGuarateedHrs;
            this.setState({ showGHrsError: true });
            return false;
        }
        else {
            //this.dataItem.gauranteedHours = parseFloat(this.state.guranteedHours ? this.state.guranteedHours : 0);
            this.setState({ showAddGuaranteedHoursModal: false, weeklyGuaranteedHours: this.state.remainigWeeklyGuaranteedHours }, () => { this.setState(this.state) });
        }


    }
    GauranteedHoursCell = (props: GridCellProps, index, data) => {
        if (!props.dataItem.isGuaranteedModified) {
            if (data && data.tsDayVms[index].serviceTypes) {
                let incWorkHrs = 0;
                let dailyGuarnteed = data.tsDayVms[index].serviceTypes.find((x) => x.guaranteedBillType=="Daily" && x.id==props.dataItem.serviceTypeId);

                let timeOut = RemoveSecFromTime(props.dataItem.timeOut);
                let timeIn = RemoveSecFromTime(props.dataItem.timeIn);
                //let timeOut = new Date(props.dataItem.timeOut).valueOf();
                //let timeIn = new Date(props.dataItem.timeIn).valueOf();
                let hour = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5 > 24 ? ((timeOut - timeIn) / 36e5) - 24 : (timeOut - timeIn) / 36e5==0 ? 24 : (timeOut - timeIn) / 36e5;
                let breakHours = parseInt(props.dataItem.breakHour) + parseFloat((parseInt(props.dataItem.breakMinutes) / 60).toString());
                let dataItemWorkHrs = 0;
                if ((hour - breakHours) < 0) {
                    dataItemWorkHrs = 0;
                }
                else {
                    dataItemWorkHrs = hour - breakHours;
                }



                data.tsDayVms[index].tsDayServTypeVms.forEach((item) => {
                    let serviceType = data.tsDayVms[index].serviceTypes.find((x) => x.id==item.serviceTypeId);
                    let timeOut = RemoveSecFromTime(item.timeOut);
                    let timeIn = RemoveSecFromTime(item.timeIn);
                    //let timeOut = new Date(item.timeOut).valueOf();
                    //let timeIn = new Date(item.timeIn).valueOf();
                    let hour = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5 > 24 ? ((timeOut - timeIn) / 36e5) - 24 : (timeOut - timeIn) / 36e5==0 ? 24 : (timeOut - timeIn) / 36e5;
                    let breakHours = parseInt(item.breakHour) + parseFloat((parseInt(item.breakMinutes) / 60).toString());
                    let workHrs = 0;
                    if ((hour - breakHours) < 0) {
                        workHrs = 0;
                    }
                    else {
                        workHrs = hour - breakHours;
                        if (serviceType && serviceType.incInGuaranteedHrs) {
                            incWorkHrs += workHrs;
                        }
                    }
                });

                if (!props.dataItem.isGuaranteedHrsChanged) {
                    if (dailyGuarnteed && dailyGuarnteed.guaranteedHours > 0) {
                        if (dailyGuarnteed.guaranteedHours - (incWorkHrs + dataItemWorkHrs) < 0) {
                            props.dataItem.gauranteedHours = 0;
                        }
                        else {
                            props.dataItem.gauranteedHours = dailyGuarnteed.guaranteedHours - (incWorkHrs + dataItemWorkHrs);
                            props.dataItem.maxGuaranteedHours = dailyGuarnteed.guaranteedHours - (incWorkHrs + dataItemWorkHrs);
                        }

                    }

                }

            }
        }

        return props.dataItem.inEdit ?
            <td contextMenu="Guaranteed Hours" id="documenttag-wrap">
                <NumericTextBox
                    disabled={props.dataItem.billType !="Hourly"}
                    className="form-control number documenttag-wrap-mobile"
                    value={isNaN(props.dataItem.gauranteedHours) ? 0 : props.dataItem.gauranteedHours}
                    min={0}
                    format="#"
                    name="quantity"
                    onChange={(e) => {
                        props.dataItem.gauranteedHours = e.target.value;
                        props.dataItem.invalidHours = false;
                        props.dataItem.isNegetiveGHours = false;
                        props.dataItem.isGuaranteedHrsChanged = true;
                        this.setState({ data: this.state.data })
                        }
                    }
                />
                {props.dataItem.invalidHours && <div role="alert" title={`Guaranteed Hours cannot be greater than ${props.dataItem.maxGuaranteedHours}`} className="k-form-error k-text-start">
                    <FontAwesomeIcon icon={faExclamationCircle} className="error-sign"></FontAwesomeIcon>
                </div>}
                {props.dataItem.isNegetiveGHours && <div role="alert" title={`Guaranteed Hours cannot be less than 0`} className="k-form-error k-text-start">
                    <FontAwesomeIcon icon={faExclamationCircle} className="error-sign"></FontAwesomeIcon>
                </div>}
            </td>

            :
            <td className="g-hours-highlight" contextMenu="Guaranteed Hrs">
                {props.dataItem.billType=="Hourly" ? parseFloat(props.dataItem.gauranteedHours !=null ? props.dataItem.gauranteedHours : 0).toFixed(2) : "N/A"}
            </td>
    };

    fix = (v, left, right) => {
        return (Math.abs(v).toFixed(right) as any).padStart(left + right + 1, '0');
    }

    BillRateCell = (props: GridCellProps, titleValue, index, isHoliday?) => {
        var fieldValue = props.dataItem[props.field];
        let rate = 0;
        let billType;
        if (isHoliday==false && props.dataItem.rate) {
            rate = props.dataItem.rate;
            billType = props.dataItem.billType;
        } else {
            let serviceType = this.state.data.tsDayVms[index].serviceTypes && this.state.data.tsDayVms[index].serviceTypes.find((x) => x.id==props.dataItem.serviceTypeId);
            if (serviceType) {
                if (isHoliday) {
                    rate = serviceType.holidayBillRate ? serviceType.holidayBillRate : serviceType.billRate;
                } else {
                    rate = serviceType.billRate;
                }
                props.dataItem.billType = serviceType.billType;
                billType = serviceType.billType;
            }
        }

        props.dataItem.rate = rate;

        return (
            <td contextMenu={titleValue} title={billType}>
                {currencyFormatter(rate.toFixed(2))}
            </td>
        );
    };

    BillAmmountCell = (props: GridCellProps, titleValue, isHoliday?) => {
        var fieldValue = props.dataItem[props.field];
        let billAmount = 0;
        if (props.dataItem.billRate && props.dataItem.workHours) {
            billAmount = props.dataItem.billRate * props.dataItem.workHours;
        }
        let serviceType = this.state.serviceTypes.find((x) => x.id==props.dataItem.serviceTypeId);
        let rate = 0;
        if (serviceType) {
            if (isHoliday) {
                rate = serviceType.holidayBillRate ? serviceType.holidayBillRate : serviceType.billRate;
            } else {
                rate = serviceType.billRate;
            }
            if (serviceType.billType=="Hourly") {
                let timeOut = RemoveSecFromTime(props.dataItem.timeOut);
                let timeIn = RemoveSecFromTime(props.dataItem.timeIn);
                //let timeOut = new Date(props.dataItem.timeOut).valueOf();
                //let timeIn = new Date(props.dataItem.timeIn).valueOf();
                let breakHours = parseInt(props.dataItem.breakHour) + parseFloat((parseInt(props.dataItem.breakMinutes) / 60).toString());
                let shiftHours = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5 > 24 ? ((timeOut - timeIn) / 36e5) - 24 : (timeOut - timeIn) / 36e5==0 ? 24 : (timeOut - timeIn) / 36e5;
                let workHrs = 0;
                if ((shiftHours - breakHours) < 0) {
                    workHrs = 0;
                }
                else {
                    workHrs = shiftHours - breakHours;
                }
                let effectiveHrs = workHrs + props.dataItem.gauranteedHours;
                billAmount = effectiveHrs * rate;
            } else {
                billAmount = rate;
            }
        }
        return (
            <td contextMenu={titleValue} title={fieldValue}>
                ${billAmount.toFixed(2)}
            </td>
        );
    };

    ifServiceTypeExists = (index, value) => {
        return _.find(this.state.data.tsDayVms[index].tsDayServTypeVms, ["serviceTypeId", value]);
    }

    // ifWeeklyGuaranteedAdded = () => {
    //     let isExist = this.state.data.tsDayVms.some(tsDay => {
    //         return tsDay.tsDayServTypeVms.some(this.isweeky);
    //     });
    //     return isExist;
    // }
    ifWeeklyGuaranteedAdded = () => {
        let isExist;
        let serviceType = this.state.globalServiceTypes.find(x => x.guaranteedBillType=="Weekly")
        if (serviceType) {
            isExist = this.state.data.tsDayVms.some(tsDay => {
                return tsDay.tsDayServTypeVms.some((d) => d.serviceTypeId ==serviceType.id)
            });
            return isExist;
        }
    }


    ifWeeklyServiceTypeAdded = (value) => {
        let isExist = this.state.data.tsDayVms.some(tsDay => {
            return tsDay.tsDayServTypeVms.some((d) => d.serviceTypeId ==value)
        });
        return isExist;
    }
    // weeklyServiceTypeExist=()=>{
    //     this.state.data.tsDayVms.forEach((tsDay,dayIndex) => {
    //         if(tsDay.isWorking){
    //             tsDay.tsDayServTypeVms.forEach((tsdayServ, rowIndex) => {
    //                 let serviceType = this.state.serviceTypes.find(x => x.serviceTypeId==tsdayServ.serviceTypeId);
    //                 if(serviceType.guaranteedBillType=="Weekly"){

    //                 }
    //             })
    //         }
    //     })
    // }
    ifEligibleBreakHour = (props, value) => {
        let breakHours = parseInt(value) + parseFloat((parseInt(props.dataItem.breakMinutes) / 60).toString());
        let maxBreakHours = 0;// this.state.shiftTypes.find(x => x.id==props.dataItem.shiftId).maxBreakHours;
        if (breakHours <= maxBreakHours) {
            return true;
        }
        return "Maximum break allowed for the shift is " + maxBreakHours + " hours.";
    };
    ifEligibleBreakMinuts = (props, value) => {
        let breakHours = parseInt(props.dataItem.breakHour) + parseFloat((parseInt(value) / 60).toString());
        let maxBreakHours = 0; //this.state.shiftTypes.find((x) => x.id==props.dataItem.shiftId).maxBreakHours;
        if (breakHours <= maxBreakHours) {
            return true;
        }
        return "Maximum break allowed for the shift is " + maxBreakHours + " hours.";
    };

    showColumn = () => { };

    changeWorkingDay = (e, index) => {
        //this.state.data.tsDayVms[index].isWorking = !this.state.data.tsDayVms[index].isWorking;
        if (this.state.data.tsDayVms[index].isWorking) {
            if (this.state.data.tsDayVms[index].tsDayServTypeVms.length > 0) {
                this.isWorkingChangeIndex = index;
                this.setState({ showMarkNonWorkingDay: true });
            }
            else {
                this.change(e, index);
            }
        }
        else {
            this.change(e, index);
        }
    }

    change = (e, index) => {
        //this.state.data.tsDayVms[index].isWorking = !this.state.data.tsDayVms[index].isWorking;
        // if (this.state.data.tsDayVms[index].isWorking) {
        //     this.isWorkingChangeIndex = index;
        //     this.setState({ showMarkNonWorkingDay: true });

        // } else {
        //this.setState({ showMarkNonWorkingDay: false });
        if (this.state.data.tsDayVms[index].isWorking) {
            this.state.data.tsDayVms[index].tsDayServTypeVms = [];
            document.querySelectorAll(".grid-" + index).forEach((row) => {
                var node = document.createElement("div");
                node.className = "disabled-grid";
                row.prepend(node);
            });
        }
        else {
            document.querySelectorAll(".grid-" + index + " .disabled-grid").forEach((ele) => {
                ele.remove();
            });
        }
        let showMarkNonWorkingDay = "showMarkNonWorkingDay";
        this.state[showMarkNonWorkingDay] = false;
        this.state.data.tsDayVms[index].isWorking = !this.state.data.tsDayVms[index].isWorking;
        this.setState(this.state);

        let data = {
            tsDayId: this.state.data.tsDayVms[index].tsDayId,
            isWorking: this.state.data.tsDayVms[index].isWorking
        }
        axios.put(`/api/ts/update/isworking/inline/`, data).then(res => {
            successToastr("Working day updated successfully.");
        });
        //}
        //this.setState(this.state);
    };

    disableNonWorkingDay = (index, fromUser?) => {
        document.querySelectorAll(".grid-" + index).forEach((row) => {
            var node = document.createElement("div");
            node.className = "disabled-grid";
            row.prepend(node);
        });
        if (fromUser) {
            this.state.data.tsDayVms[index].isWorking = !this.state.data.tsDayVms[index].isWorking;
        }
        this.isWorkingChangeIndex = undefined;
        this.setState(this.state);
        this.setState({ showMarkNonWorkingDay: false });
        if (fromUser) {
            let data = {
                tsDayId: this.state.data.tsDayVms[index].tsDayId,
                isWorking: this.state.data.tsDayVms[index].isWorking
            }

            axios.put(`/api/ts/update/isworking/inline/`, data).then(res => {
                successToastr("Non-working day updated successfully.");
            });
        }
    }

    select = (event) => {
        let fileArray = [...this.state.fileArray];
        event.preventDefault();
        if (event.target.files.length > 0) {
            Array.from(event.target.files).forEach((file: any) => {
                let isfileValid = false;
                if (includes(allowedMymeTypes, file.type)) {
                    isfileValid = true;
                } else if (file.type=="") {
                    if (includes(allowedFileExtentions, file.name.split(".")[1])) {
                        isfileValid = true;
                    }
                }
                fileArray.push({ candDocumentsId: undefined, fileName: file.name, file: file, isValid: isfileValid, path: undefined });
            });
            this.fileArrayGlobal = fileArray;
            //this.setState({ fileArray: fileArray })
            if (fileArray.some((d) => d.isValid ==false)) {
                this.invalidFileList = fileArray.filter(x => x.isValid ==false);
                this.alertMessage = this.invalidFileList.map(x => x.fileName).join(", ") + " is invalid and will not be uploaded."
                this.setState({ showInvalidFileAlert: true });
                return false;
            }
            else {
                this.uploadDocuments(fileArray);
            }
        }
    };

    uploadDocuments = (fileArray) => {
        this.setState({ showInvalidFileAlert: false });
        let checkNewFile = fileArray != undefined ? fileArray.filter((i) => i.candDocumentsId ==undefined && i.isValid ==true) : [];
        if (checkNewFile.length > 0) {
            let formData = new FormData();
            checkNewFile.map((item) => {
                formData.append("FormFiles", item.file);
            });
            formData.append("entityId", this.state.tsWeekId);
            formData.append("entityName", "TimeSheet");
            axios
                .post(`/api/ts/documents`, formData)
                .then((response) => response)
                .then((data) => {
                    successToastr("Document(s) uploaded successfully.");
                    this.getTSWeekDocuments(this.state.tsWeekId);

                    // history.push("/timesheet/provider/" + this.state.candSubmissionId);
                    //history.goBack();
                });
        }
    }


    removeFile = (index) => {
        if (this.state.fileArray[index].candDocumentsId) {
            this.globalFileId = this.state.fileArray[index].candDocumentsId
            this.setState({ showRemoveModal: true })
        }
    };

    deleteFile = () => {
        this.setState({ showRemoveModal: false });
        axios.delete(`/api/admin/documents/${this.globalFileId}`).then((res) => {
            successToastr("Document deleted successfully");
            this.getTSWeekDocuments(this.state.tsWeekId);
        });
    };

    inEdit = () => {
        let isInEdit = this.state.data.tsDayVms.some((tsDay) => {
            return tsDay.tsDayServTypeVms.some((d) => d.inEdit ==true);
        });
        return isInEdit;
    };

    isWorkingButNotFilled = () => {
        let isWorkingButNotFilled = this.state.data.tsDayVms.filter(x => x.isWorking).some((tsDay) =>
            tsDay.tsDayServTypeVms.length==0
        );
        return isWorkingButNotFilled;
    }

    isWorkingAndFilled = () => {
        let isWorkingAndFilled = this.state.data.tsDayVms.filter(x => x.isWorking).some((tsDay) =>
            tsDay.tsDayServTypeVms.length > 0
        );
        return isWorkingAndFilled;
    }

    isAnyDayWorking = () => {
        return this.state.data.tsDayVms.some(x => x.isWorking);
    }

    checkUnsaved = () => {
        if (this.inEdit()) {
            this.alertMessage = "Please save data in each row.";
            this.setState({ openAlert: true });
            return false;
        }
        else {
            this.setState({ showSubmitConfirmationModal: true })
        }
    }

    submitTimesheet = (isSumit, reSubmit = false, isUnderReview = false) => {
        if (this.state.showUnderReviewModal==true && !this.state.approverComments.replace(/^\s+|\s+$/g, "")) {
            this.setState({ approverCommentError: true });
            return;
        }
        this.setState({ showSubmitConfirmationModal: false });

        if (this.inEdit()) {
            this.alertMessage = "Please save data in each row.";
            this.setState({ openAlert: true });
            return false;
        }

        if (this.isWorkingButNotFilled() && isSumit) {
            this.alertMessage = "Please mark days with zero Work Hours as non-working days to proceed.";
            this.setState({ openAlert: true });
            return false;
        }
        else {
            if (!this.state.isWeeklyConfirmed && this.ifWeeklyGuaranteedAdded() && isSumit) {
                let totalWeeklyGuranteedHours = 0;
                let workHrs = 0;
                let rate = 0;
                this.state.data.tsDayVms.forEach(tsDay => {
                    if (tsDay.serviceTypes.find(x => x.guaranteedBillType=="Weekly")) {
                        rate = tsDay.serviceTypes.find(x => x.guaranteedBillType=="Weekly").billRate;
                    }
                    tsDay.tsDayServTypeVms.forEach(tsdayServ => {
                        let serviceType = tsDay.serviceTypes.find(x => x.id==tsdayServ.serviceTypeId)
                        if (serviceType && serviceType.guaranteedBillType=="Weekly") {
                            totalWeeklyGuranteedHours = tsDay.serviceTypes.find(x => x.id==tsdayServ.serviceTypeId).guaranteedHours;
                            //rate = tsdayServ.rate;
                            let timeOut = RemoveSecFromTime(tsdayServ.timeOut);
                            let timeIn = RemoveSecFromTime(tsdayServ.timeIn);
                            //let timeOut = new Date(tsdayServ.timeOut).valueOf();
                            //let timeIn = new Date(tsdayServ.timeIn).valueOf();
                            let hour = (timeOut - timeIn) / 36e5 < 0 ? 24 + (timeOut - timeIn) / 36e5 : (timeOut - timeIn) / 36e5 > 24 ? ((timeOut - timeIn) / 36e5) - 24 : (timeOut - timeIn) / 36e5==0 ? 24 : (timeOut - timeIn) / 36e5;
                            let breakHours = parseInt(tsdayServ.breakHour) + parseFloat((parseInt(tsdayServ.breakMinutes) / 60).toString());
                            //let workHrs = 0;
                            if ((hour - breakHours) < 0) {
                                workHrs = 0;
                            }
                            else {
                                workHrs += hour - breakHours;
                            }
                        }
                    })
                });

                this.setState({ isWeeklyConfirmed: true, showAddGuaranteedHoursModal: true, guranteedHours: totalWeeklyGuranteedHours, remainigWeeklyGuaranteedHours: totalWeeklyGuranteedHours - workHrs, weeklyGRate: rate });
            }
            else {
                let data = {
                    tsWeekId: this.state.tsWeekId,
                    isSubmit: isSumit,
                    tsDayVms: this.state.data.tsDayVms,
                    totalHours: this.state.data.totalHours,
                    totalAmount: this.state.data.totalAmount,
                    gauranteedHours: this.state.weeklyGuaranteedHours,
                    gauranteedAmount: this.state.weeklyGuaranteedHours * this.state.weeklyGRate,
                    isReSubmit: reSubmit,
                    isUnderReview: isUnderReview,
                    comment: this.state.approverComments,
                    reason: this.state.reason,
                    tsLockdownDays: this.state.tsLockdownDays
                }
                axios
                    .post(`/api/ts/week/${this.state.tsWeekId}`, data)
                    .then(data => {
                        if( data.data && !data.data.isSuccess && data.data.statusMessage==TimesheetStatuses.UNDERREVIEW){
                            this.setState({ showUnderReviewModal : true, tsLockdownDays: data.data.responseCode, confirmationInactiveAndUnderReview: false, confirmationInactive: false, reason: TsUnderReviewReasons.UnderReview});
                        }else if (data.data && !data.data.isSuccess && data.data.statusMessage==TimeSheetCheck.CONFIRMATION_NOT_VALID){
                            this.setState({ showUnderReviewModal : true, confirmationInactive: true, approverComments: CONFIRMATION_LETTER_COMMENT_MSG, reason: TsUnderReviewReasons.NoConfirmationLetter });
                        }else if (data.data && !data.data.isSuccess && data.data.statusMessage==TimeSheetCheck.CONFIRMATION_NOT_VALID_UNDER_REVIEW){
                            this.setState({ showUnderReviewModal : true, tsLockdownDays: data.data.responseCode, confirmationInactiveAndUnderReview: true, confirmationInactive: false, approverComments: CONFIRMATION_LETTER_COMMENT_MSG, reason: TsUnderReviewReasons.UnderReviewAndNoConfirmationLetter });
                        }
                        else{
                            successToastr(isSumit ? "Timesheet submitted successfully." : "Timesheet saved successfully.");
                            this.setState({ showUnderReviewModal: false });
                            history.goBack();
                        }
                    });
            }

        }
    };

    markNonWorking = () => {
        if (this.isWorkingAndFilled()) {
            this.alertMessage = "Please remove any service type added from working days to proceed.";
            this.setState({ showNotWorkingConfirmationModal: false, openAlert: true });
            return false;
        }
        else {
            axios.post(`/api/ts/nonworking?tsWeekId=${this.state.tsWeekId}&isManual=${true}`).then(res => {
                successToastr("Saved successfully.");
                history.goBack();
            });
        }

    }

    itemChange = (event, index) => {
        const data = this.state.data.tsDayVms[index].tsDayServTypeVms.map((item) =>
            item.tsDayServTypeId ==event.dataItem.tsDayServTypeId ? { ...item, [event.field]: event.value } : item
        );
        this.state.data.tsDayVms[index].tsDayServTypeVms = data;
        this.setState({ data: this.state.data });
    };

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ tsWeekId: id });
        this.getServiceTypes(id);
        this.getWFHistory(id);

        if(isRoleType(AuthRoleType.Vendor) || isRoleType(AuthRoleType.SystemAdmin)){
            this.setState({showReqNumber: true})
        }
        
        // this.getShiftTypes();
    }

    commentsChange = (e) => this.setState({ approverComments: e.target.value, approverCommentError: e.target.value=="" });

    InputField = (props) => {
        const { dataItem, field } = props;
        return (
            <td contextMenu={"Comment"}>
                {dataItem.inEdit ?

                    (
                        <div className="my-task-desciption">
                            <input
                                className="form-control"
                                value={dataItem[field]}
                                onChange={(e) => props.dataItem.comment = e.target.value}
                                maxLength={100}
                            />

                        </div>
                    ) : (
                        <div
                            className={
                                dataItem.isMandatory
                                    ? "required  my-task-desciption"
                                    : "my-task-desciption"
                            }
                            title={dataItem[field]}
                        >
                            {dataItem[field]}
                        </div>
                    )}
            </td>
        );
    };

    render() {
        const { provider, status, division, location, position, startDate, endDate, tsDayVms, candidateId, reqId, reqNumber } = this.state.data;
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0"  ref={ref => this.divRef = ref}>
                <div className="container-fluid mt-3 mb-3">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2 d-print-none">
                        <div className="col-6 p-0 m-0 fonFifteen paddingLeftandRight">
                            <BreadCrumbs globalData={{tsWeekId:this.state.tsWeekId}}></BreadCrumbs>
                            </div>
                            <div className="col-6 p-0 m-0">
                            <div className="float-right text-dark">
                                <span className="mr-2" style={{ fontWeight: "lighter"}}>
                                    <DocumentsPortfolio
                                        candidateId={candidateId}
                                        isStyleChange={true}
                                        candSubmissionId={this.state.candSubmissionId}
                                    ></DocumentsPortfolio>
                                </span>
                                {auth.hasPermissionV2(AppPermissions.CLIENT_RATE_CARD_VIEW) &&
                                    <span
                                        className="cursor-pointer mr-2"
                                        title="View Rate Card"
                                        onClick={() =>
                                            history.push(`/timesheet/ratecard/provider/${this.state.data.candSubmissionId}/${this.state.tsWeekId}`)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faDollarSign} className="nonactive-icon-color mr-2"></FontAwesomeIcon>
                                        Rate Card
                                    </span>
                                }

                                {/* <Link
                                    className="text-dark mr-2 text-decor-none"
                                    to={{
                                        pathname: `/timesheets/provider/${this.state.candSubmissionId}/contract`,
                                        state: {
                                            provider: provider,
                                            position: position,
                                            division: division,
                                            location: location,
                                            tsWeekId: this.state.tsWeekId,
                                        },
                                    }}
                                > */}
                                {auth.hasPermissionV2(AppPermissions.CAND_SUB_CONTRACT_VIEW) &&
                                    <>
                                        <FontAwesomeIcon icon={faFileSignature} className="nonactive-icon-color mr-1" />

                                        <span onClick={() => {
                                            localStorage.setItem("contractData", JSON.stringify({
                                                provider: provider,
                                                position: position,
                                                division: division,
                                                location: location,
                                                tsWeekId: this.state.tsWeekId,
                                            }))
                                                ; return history.push({
                                                    pathname: `/timesheets/${this.state.tsWeekId}/provider/${this.state.candSubmissionId}/contract`,
                                                }


                                                )
                                        }} className="cursor-pointer" title="View Contract">Contract</span></>}
                                {/* </Link> */}

                                <span
                                    className="cursor-pointer"
                                    title={(status==TimesheetStatuses.ACTIVE || status==TimesheetStatuses.REJECTED) ? "Add Expense" : "View Expense"}
                                    onClick={() => history.push(`/timesheets/week/${this.state.tsWeekId}/expense`)}
                                >
                                    <FontAwesomeIcon icon={(status==TimesheetStatuses.ACTIVE || status==TimesheetStatuses.REJECTED) ? faPlusCircle : faEye} className="nonactive-icon-color mr-1 ml-1"></FontAwesomeIcon>
                                    Expense
                                </span>                               
                                <span>| <ReactToPrint
                                        trigger={() => {
                                            return <span id="printTimesheet">
                                                    <FontAwesomeIcon icon={faPrint} className="nonactive-icon-color mr-1 ml-1 cursor-pointer" title="Print Timesheet"/>
                                                </span>
                                        }}
                                        content={() => this.divRef}
                                        documentTitle={`Timesheet_${provider}_${startDate && dateFormatter(new Date(startDate))}-${endDate && dateFormatter(new Date(endDate))}`}
                                    ></ReactToPrint>
                                </span>
                            </div>
                            <div className="float-right text-dark">
                                <span className="font-weight-normal">Provider : </span> <span className="mr-1">{provider}</span>
                                <span className="font-weight-normal">| Status :</span> <span className="">{status} </span>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className={this.state.showReqNumber ? "col-12 col-sm-3 pr-sm-0" : "col-12 col-sm-4 pr-sm-0"}>
                            <div className="row">
                                <div className="col-auto text-right font-weight-normal pr-2">Pay Period :</div>
                                <div className="col font-weight-bold pl-0 pr-0 text-left font-weight-bold">
                                    {(startDate && dateFormatter(new Date(startDate)) + " - " + dateFormatter(new Date(endDate))) || "-"}
                                </div>
                            </div>
                        </div>
                        <div className={this.state.showReqNumber ? "col-12 col-sm-3": "col-12 col-sm-4"}>
                            <div className="row">
                                <div className="col-auto col-sm-7 text-right font-weight-normal pr-2">Division :</div>
                                <div className="col col-sm-5 font-weight-bold pl-0 pr-0 text-left font-weight-bold">{division || "-"}</div>
                            </div>
                        </div>
                        {this.state.showReqNumber ? 
                            <div className="col-12 col-sm-3">
                                <div className="row">
                                    <div className="col-auto col-sm-5 text-right font-weight-normal pr-2">Req# :</div>
                                    <div className="col col-sm-7 pl-0 pr-0 text-left">   
                                        <Link
                                            className="orderNumberTd orderNumberTdBalck font-weight-bold"
                                            to={`/requisitions/view/${reqId}`}
                                            style={{ color: "#007bff" }}
                                        >{reqNumber || "-"}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                         : null }
                        <div className={this.state.showReqNumber ? "col-12 col-sm-3 pl-0" : 
                        "col-12 col-sm-4 pl-0"}>
                            <div className="row justify-content-end ml-0 mr-0">
                                <div className="col-auto col-sm text-right font-weight-normal pr-2 pl-lg-0">Location :</div>
                                <div className="col col-sm-auto font-weight-bold pl-0 pr-0 text-left font-weight-bold">{location || "-"}</div>
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

                    {tsDayVms && tsDayVms.sort((d1, d2) => new Date(d1.day).getTime() - new Date(d2.day).getTime()).map((day, index) =>
                        <div className="myOrderContainer">
                            <div className="day-header col-12"><span>{weekDayFormatter(new Date(day.day))}</span>
                                {day.isHoliday && <FontAwesomeIcon icon={faInfoCircle} title="Holiday" className="info-icon" />}
                                <label className="container-R checkPosition_createorder-timesheet-after float-right">
                                    <input
                                        type="checkbox"
                                        disabled={!(status==TimesheetStatuses.ACTIVE || status==TimesheetStatuses.REJECTED)}
                                        checked={day.isWorking}
                                        onChange={(e) => this.changeWorkingDay(e, index)}
                                        className="mr-1"
                                    />
                                    <span className="ml-1 mt-1 font-weight-normal font-medium">Working Day</span>
                                    <span className="checkmark-R checkPosition_createorder-timesheet"></span>
                                </label>

                            </div>
                            <div className="table-responsivee tableShadow table-TimeSheet a global-action-grid-status-active">

                                <Grid
                                    className={"kendo-grid-custom grid-" + index}
                                    style={{ height: "auto" }}
                                    data={day.tsDayServTypeVms}
                                    editField="inEdit"
                                    key={index}
                                    onItemChange={(e) => this.itemChange(e, index)}
                                    sort={[
                                        { field: 'createdDate', dir: 'asc' }
                                    ]}
                                >

                                    <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                                    <GridColumn
                                        field="serviceType"
                                        title="Service Type"
                                        cell={(props) => props.dataItem.inEdit ?
                                            <td contextMenu="Service Tye" id="documenttag-wrap">
                                                <CustomDropDownList
                                                    className="form-control documenttag-wrap-mobile"
                                                    name={`serviceTypeId`}
                                                    data={day.serviceTypes}
                                                    textField="name"
                                                    valueField="id"
                                                    id="serviceTypeId"
                                                    value={props.dataItem.serviceTypeId}
                                                    defaultItem={defaultItem}
                                                    onChange={(e) => {
                                                        const serviceTypeId = e.value.id;
                                                        props.dataItem.gauranteedHours = 0;
                                                        if (this.ifServiceTypeExists(index, serviceTypeId)) {
                                                            this.alertMessage = "Service type '" + e.value.name + "' already exists.";
                                                            this.setState({ openAlert: true });
                                                            return false;
                                                        }
                                                        else if (e.value.billType=="Weekly") {
                                                            if (this.ifWeeklyServiceTypeAdded(serviceTypeId)) {
                                                                this.alertMessage = "Service type '" + e.value.name + "' with Bill Type set as 'Weekly', cannot be added twice for the pay period.";
                                                                this.setState({ openAlert: true });
                                                                return false;
                                                            }
                                                            else {
                                                                props.dataItem.serviceTypeId = serviceTypeId;
                                                                props.dataItem.serviceType = e.value.name;
                                                                props.dataItem.billType = e.value.billType;
                                                                props.dataItem.rate = e.value.billRate;
                                                                props.dataItem.holidayRate = e.value.holidayBillRate;
                                                                // props.dataItem.shift = this.state.shiftTypes[0].name;
                                                                props.dataItem.invalidServiceType = false;
                                                                this.setState({ data: this.state.data })
                                                            }
                                                        }
                                                        else {
                                                            props.dataItem.serviceTypeId = serviceTypeId;
                                                            props.dataItem.serviceType = e.value.name;
                                                            props.dataItem.billType = e.value.billType;
                                                            props.dataItem.rate = e.value.billRate;
                                                            props.dataItem.holidayRate = e.value.holidayBillRate;
                                                            props.dataItem.guaranteedBillType = e.value.guaranteedBillType;
                                                            // props.dataItem.shift = this.state.shiftTypes[0].name;
                                                            props.dataItem.invalidServiceType = false;
                                                            this.setState({ data: this.state.data })
                                                        }
                                                    }}
                                                />
                                                {props.dataItem.invalidServiceType && <ErrorComponent />}
                                            </td>
                                            : CellRender(props, "Service Type")}
                                    />
                                    {/* <GridColumn
                                        field="shift"
                                        title="Shift"
                                        cell={(props) => props.dataItem.inEdit ?
                                            <td contextMenu="Shift" id="documenttag-wrap">
                                                <CustomDropDownList
                                                    className="form-control documenttag-wrap-mobile"
                                                    name={`shiftId`}
                                                    data={this.state.shiftTypes}
                                                    textField="name"
                                                    valueField="id"
                                                    id="shiftId"
                                                    value={props.dataItem.shiftId}
                                                    //defaultItem={this.state.shiftTypes[0]}
                                                    onChange={(e) => {
                                                        props.dataItem.gauranteedHours = 0;
                                                        const shiftId = e.value.id;
                                                        props.dataItem.shiftId = shiftId;
                                                        props.dataItem.shift = e.value.name;
                                                        props.dataItem.invalidShiftType = false;
                                                        props.dataItem.timeIn = this.state.shiftTypes.find(x => x.id==shiftId).timeIn;
                                                        props.dataItem.timeOut = this.state.shiftTypes.find(x => x.id==shiftId).timeOut;
                                                        this.setState({ data: this.state.data })
                                                    }}
                                                />
                                                {props.dataItem.invalidShiftType && <ErrorComponent />}
                                            </td>
                                            : CellRender(props, "Shift")}
                                    /> */}
                                    <GridColumn
                                        field="timeIn"
                                        title="Time In"
                                        cell={(props) => props.dataItem.inEdit ?
                                            <td contextMenu="Time In" id="documenttag-wrap">
                                                <TimePicker
                                                    steps={steps}
                                                    className="form-control documenttag-wrap-mobile"
                                                    name={`timeIn`}
                                                    id="timeIn"
                                                    defaultValue={new Date(new Date() + "09:30:000")}
                                                    value={new Date(props.dataItem.timeIn)}
                                                    onChange={(e) => {
                                                        if (e.nativeEvent !=null && e.nativeEvent.type !='input') {
                                                            props.dataItem.gauranteedHours = 0;
                                                            const timeIn = e.target.value;
                                                            props.dataItem.timeIn = timeIn;
                                                            props.dataItem.saveTimeIn = toLocalDateTime(timeIn);
                                                            props.dataItem.breakHour = "0";
                                                            props.dataItem.breakMinutes = "00";
                                                            this.setState({ data: this.state.data })
                                                        }
                                                    }}
                                                />
                                            </td>
                                            : <td contextMenu="Time In">{convertShiftDateTime(props.dataItem.timeIn)}</td>}
                                    />

                                    <GridColumn
                                        field="timeOut"
                                        title="Time Out"
                                        cell={(props) => props.dataItem.inEdit ?
                                            <td contextMenu="Time Out" id="documenttag-wrap">
                                                <TimePicker
                                                    steps={steps}
                                                    className="form-control documenttag-wrap-mobile"
                                                    name={`timeOut`}
                                                    id="timeOut"
                                                    value={new Date(props.dataItem.timeOut)}
                                                    onChange={(e) => {
                                                        if (e.nativeEvent !=null && e.nativeEvent.type !='input') {
                                                            props.dataItem.gauranteedHours = 0;
                                                            const timeOut = e.target.value;
                                                            props.dataItem.timeOut = timeOut;
                                                            props.dataItem.saveTimeOut = toLocalDateTime(timeOut);
                                                            props.dataItem.breakHour = "0";
                                                            props.dataItem.breakMinutes = "00";
                                                            this.setState({ data: this.state.data })
                                                        }
                                                    }}
                                                />
                                            </td>
                                            : <td contextMenu="Time Out">{convertShiftDateTime(props.dataItem.timeOut)}</td>}
                                    />

                                    <GridColumn
                                        field="breakTime"
                                        title="Break"
                                        width="150px"
                                        cell={(props) => props.dataItem.inEdit ?
                                            <td contextMenu="Break" id="documenttag-wrap" className="d-flex justify-content-between">
                                                <CustomDropDownList
                                                    className="form-control documenttag-wrap-mobile hour-ddl mr-2"
                                                    name={`breakHour`}
                                                    data={this.state.hours}
                                                    textField="name"
                                                    valueField="id"
                                                    value={props.dataItem.breakHour}
                                                    onChange={(e) => {
                                                        props.dataItem.gauranteedHours = 0;
                                                        const breakHour = e.value.id;
                                                        props.dataItem.breakHour = breakHour;
                                                        this.setState({ data: this.state.data })
                                                    }}
                                                />
                                                <CustomDropDownList
                                                    className="form-control documenttag-wrap-mobile minute-ddl"
                                                    name={`breakMinutes`}
                                                    data={this.state.minutes}
                                                    textField="name"
                                                    valueField="id"
                                                    value={props.dataItem.breakMinutes.length < 2 ? "0" + props.dataItem.breakMinutes : props.dataItem.breakMinutes}
                                                    onChange={(e) => {
                                                        props.dataItem.gauranteedHours = 0;
                                                        const breakMinutes = e.value.id;
                                                        props.dataItem.breakMinutes = breakMinutes;
                                                        this.setState({ data: this.state.data })
                                                    }}
                                                />
                                            </td>
                                            : <td contextMenu="Break">{props.dataItem.breakHour && props.dataItem.breakHour.padStart(2, '0') + ":" + (props.dataItem.breakMinutes && props.dataItem.breakMinutes.length < 2 ? "0" + props.dataItem.breakMinutes : props.dataItem.breakMinutes)}</td>}
                                    />

                                    <GridColumn
                                        field="workHours"
                                        title="Work Hours"
                                        cell={(props) => this.HoursCell(props, "Work Hours", index, day.isHoliday)}
                                        footerCell={(props) => TotalHoursCell(day.isHoliday, day.isWorking ? this.state.data : undefined, index, this.userObj.role ==AuthRole.PROVIDER_1)}
                                    />

                                    {this.state.isEligibleForGauranteedHours &&
                                        <GridColumn
                                            field="gauranteedHours"
                                            title="Guaranteed Hrs"
                                            cell={(props) => this.GauranteedHoursCell(props, index, this.state.data)}

                                        />
                                    }

                                    {(isRoleType(AuthRoleType.Vendor) || isRoleType(AuthRoleType.SystemAdmin)) &&
                                        <GridColumn
                                            field="rate"
                                            title="Bill Rate"
                                            cell={(props) => this.BillRateCell(props, "Bill Rate", index, day.isHoliday)}
                                        />
                                    }

                                    <GridColumn
                                        field="billType"
                                        title="Bill Type"
                                        cell={(props) => CellRender(props, "Bill Type")}
                                    />

                                    <GridColumn
                                        field="comment"
                                        title="Comment"
                                        className="timesheet-comments"
                                        cell={this.InputField}
                                    />

                                    {(status==TimesheetStatuses.ACTIVE || status==TimesheetStatuses.REJECTED) &&
                                        <GridColumn
                                            sortable={false}
                                            cell={this.CommandCell(index)}
                                            headerClassName="status-active d-print-none"
                                            width="100px"
                                            title="Action"
                                            headerCell={this.CustomHeaderActionCellTemplate(index)}
                                        />
                                    }

                                </Grid>


                            </div>
                        </div>
                    )}
                    {this.state.weeklyGuaranteedHours > 0 &&
                        <div className="col-12 col-sm-12 col-lg-12 mt-3 mb-3 text-center font-weight-bold weeky-guaranteed-row">
                            <div className="row align-items-center justify-content-center mx-0">
                                <div className="col-12 col-sm-auto mt-2 mt-sm-0">
                                    <div className="row mx-0 align-items-center justify-content-center">
                                        <div className="col-12 col-sm-auto col-lg-auto font-weight-bold pl-0 pr-2">Weekly Guaranteed hours :</div>
                                        <div className="col-auto col-lg-auto total-hours-amount-timesheet total-hours-font-size pr-0 font-weight-bold text-left pl-0 total-hours total-hours-font-size total-hours-amount-timesheet timeSheet-break-hours-amount">{this.state.weeklyGuaranteedHours.toFixed(2)}</div>
                                    </div>
                                </div>

                                {(auth.hasPermissionV2(AppPermissions.CANDIDATE_CREATE) || auth.hasPermissionV2(AppPermissions.CAND_SUB_REJECT)) &&
                                    <React.Fragment>
                                        <div className="col-12 col-sm-auto mt-2 mt-sm-0">
                                            <div className="row mx-0 align-items-center justify-content-center">
                                                <div className="col-12 col-sm-auto col-lg-auto font-weight-bold pl-0 pr-2">Rate :</div>
                                                <div className="col-auto col-lg-auto total-hours-amount-timesheet total-hours-font-size pr-0 font-weight-bold text-left pl-0 total-hours total-hours-font-size total-hours-amount-timesheet timeSheet-break-hours-amount">{currencyFormatter(this.state.weeklyGRate.toFixed(2))}</div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-auto mt-2 mt-sm-0">
                                            <div className="row mx-0 align-items-center justify-content-center">
                                                <div className="col-12 col-sm-auto col-lg-auto font-weight-bold pl-0 pr-2">Weekly Guaranteed Amount :</div>
                                                <div className="col-auto col-lg-auto total-hours-amount-timesheet total-hours-font-size pr-0 font-weight-bold text-left pl-0 total-hours total-hours-font-size timeSheet-break-hours-amount"> {currencyFormatter((this.state.weeklyGuaranteedHours * this.state.weeklyGRate).toFixed(2))}</div>
                                            </div>
                                        </div>



                                        {/* <div>Rate : <span className="total-hours total-hours-font-size pl-2 pr-3"> {currencyFormatter(this.state.weeklyGRate.toFixed(2))}</span></div> */}
                                        {/* <div>Weekly Guaranteed Amount : <span className="total-hours total-hours-font-size pl-2"> {currencyFormatter((this.state.weeklyGuaranteedHours * this.state.weeklyGRate).toFixed(2))}</span></div> */}
                                    </React.Fragment>
                                }
                                {(status==TimesheetStatuses.ACTIVE || status==TimesheetStatuses.REJECTED) &&
                                    <FontAwesomeIcon title="Edit guaranteed hours" icon={faPencilAlt} className="ml-3 active-icon-blue cursor-pointer" onClick={() => this.setState({ showAddGuaranteedHoursModal: true })}></FontAwesomeIcon>
                                }
                            </div>
                        </div>
                    }



                    <div className="row justify-content-center">
                        {(tsDayVms || this.state.weeklyGuaranteedHours > 0) && GrandTotalCell(this.state.data, (auth.hasPermissionV2(AppPermissions.CANDIDATE_CREATE) || auth.hasPermissionV2(AppPermissions.CAND_SUB_REJECT)), this.state.weeklyGuaranteedHours, this.state.weeklyGRate)}
                    </div>
                    <div className="row d-print-none">
                        <div className="col-12 col-sm-4 col-lg-4 mt-2 mb-2 mb-sm-0  mt-sm-0">
                            <label className="mb-0 font-weight-bold ">Comments</label>
                            <span onClick={() => this.setState({ openCommentBox: true })} className="text-underline cursorElement align-middle">
                                <FontAwesomeIcon icon={faClock} className="ml-1 active-icon-blue ClockFontSize" />
                            </span>

                            <Comment isDisabled={this.state.data.submittedOn !=null ? true : false} entityType={"Timesheet"} entityId={this.state.tsWeekId} />
                        </div>
                        <div className="col-12 col-sm-4 col-lg-4 mt-2 mb-2 mb-sm-0  mt-sm-0"></div>
                        <div className="col-12 col-sm-4 col-lg-4 mt-2 mb-2 mb-sm-0  mt-sm-0">
                            <input
                                id="myInput"
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,application/pdf,application/doc,application/docx,application/xls,application/xlsx"
                                ref={(ref) => (this.uploadControl = ref)}
                                style={{ display: "none" }}
                                onChange={(e) => this.select(e)}
                            />
                            {(status==TimesheetStatuses.ACTIVE || status==TimesheetStatuses.REJECTED) ? (
                                <label className="mb-0 font-weight-bold ">
                                    Upload Documents
                                    <span
                                        onClick={() => {
                                            this.uploadControl.click();
                                        }}
                                        className="text-underline cursorElement align-middle"
                                    >
                                        <FontAwesomeIcon icon={faPaperclip} className="ml-1 active-icon-blue ClockFontSize" />
                                    </span>
                                </label>
                            ) : (
                                <label className="mb-0 font-weight-bold ">Uploaded Documents</label>
                            )}
                            <div className="file-list">
                                {this.state.fileArray.length > 0 &&
                                    this.state.fileArray.map((file, i) => (
                                        <span>
                                            <span
                                                title={file.fileName}
                                                onClick={() => file.candDocumentsId && this.download(file.path)}
                                                className={file.isValid ? "valid-file" : "invalid-file"}
                                            >
                                                {file.fileName}
                                            </span>
                                            {(status==TimesheetStatuses.ACTIVE || status==TimesheetStatuses.REJECTED) && (
                                                <span title="Remove" className="remove" onClick={() => this.removeFile(i)}>
                                                    X
                                                </span>
                                            )}
                                        </span>
                                    ))}
                            </div>
                        </div>
                        {this.state.openCommentBox && (
                            <CommentHistoryBox
                                entityType={"Timesheet"}
                                entityId={this.state.tsWeekId}
                                showDialog={this.state.openCommentBox}
                                handleNo={() => {
                                    this.setState({ openCommentBox: false });
                                    document.body.style.position = "";
                                }}
                            />
                        )}
                    </div>

                    <div className="row mb-2 mb-lg-4  ml-sm-0 mr-sm-0 d-print-none">
                        <div className="col-12 mt-5 text-sm-center text-center font-regular">

                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                Close
                            </button>

                            {(status==TimesheetStatuses.ACTIVE) &&
                                <React.Fragment>
                                    <button type="button" disabled={!this.isAnyDayWorking()} className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={(e) => this.submitTimesheet(false)}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                    </button>
                                    <button
                                        disabled={!this.isAnyDayWorking()}
                                        type="button"
                                        className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                        onClick={() => this.checkUnsaved()}
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle} className={"mr-1"} /> Submit Timesheet
                                    </button>
                                    <button
                                        type="button"
                                        className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                        onClick={() => this.setState({ showNotWorkingConfirmationModal: true })}
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle} className={"mr-1"} /> Not Working
                                    </button>
                                </React.Fragment>
                            }
                            {status==TimesheetStatuses.REJECTED && (
                                <button
                                    title={this.state.oldStatus==TimesheetStatuses.UNDERREVIEW ? "Disabled as timesheet was rejected during review." :""}
                                    disabled={this.state.oldStatus==TimesheetStatuses.UNDERREVIEW}
                                    type="button"
                                    className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                    onClick={() => this.setState({ showReSubmitConfirmationModal: true })}
                                >
                                    <FontAwesomeIcon icon={faCheckCircle} className={"mr-1"} /> Resubmit Timesheet
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <ConfirmationModal
                    message={`Based on the weekly guarantee of ${this.state.guranteedHours} hours, there are`}
                    messageSecond={" hours remaining. Do you want to insert the remaining guaranteed hours?"}
                    showModal={this.state.showAddGuaranteedHoursModal}
                    changeHours={true}
                    showError={this.state.showGHrsError}
                    errorMessage={this.gHrsErrorMesage}
                    commentsChange={(e) => this.changeGuaranteedHrs(e)}
                    gHours={this.state.remainigWeeklyGuaranteedHours}
                    handleYes={() => this.addGuaranteedHrs()}
                    handleNo={() => {
                        this.setState({ showAddGuaranteedHoursModal: false });
                    }}
                />
                <ConfirmationModal
                    message={REMOVE_TS_DOCUMENT_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteFile()}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />
                {/* <ConfirmationModal
                    message={"Are you sure you want to mark this as a non-working day?"}
                    showModal={this.state.showMarkNonWorkingDay}
                    handleYes={() => this.disableNonWorkingDay(this.isWorkingChangeIndex, true)}
                    handleNo={() => {
                        this.setState({ showMarkNonWorkingDay: false });
                    }}
                /> */}

                <AlertBox
                    message={this.alertMessage}
                    showModal={this.state.showInvalidFileAlert}
                    handleNo={() => this.uploadDocuments(this.fileArrayGlobal)}
                />
                <ConfirmationModal
                    message={"Are you sure you want to delete row?"}
                    showModal={this.state.showModal}
                    handleYes={() => this.remove(this.globalDataItem, this.globalIndex)}
                    handleNo={() => {
                        this.setState({ showModal: false });
                    }}
                />
                <ConfirmationModal
                    message={"Are you sure you want to mark this week as non-working?"}
                    showModal={this.state.showNotWorkingConfirmationModal}
                    handleYes={() => this.markNonWorking()}
                    handleNo={() => {
                        this.setState({ showNotWorkingConfirmationModal: false });
                    }}
                />
                <ConfirmationModal
                    message={"Saved data will be lost. Are you sure you want to mark this day as non-working?"}
                    showModal={this.state.showMarkNonWorkingDay}
                    handleYes={(e) => this.change(e, this.isWorkingChangeIndex)}
                    handleNo={() => {
                        this.setState({ showMarkNonWorkingDay: false });
                    }}
                />
                <ConfirmationModal
                    message={TIMESHEET_WEEK_SUBMIT_CONFIRMATION_MSG(startDate, endDate)}
                    showModal={this.state.showSubmitConfirmationModal}
                    handleYes={() => this.submitTimesheet(true)}
                    handleNo={() => {
                        this.setState({ showSubmitConfirmationModal: false });
                    }}
                />
                <ConfirmationModal
                    message={TIMESHEET_WEEK_RESUBMIT_CONFIRMATION_MSG(startDate, endDate)}
                    showModal={this.state.showReSubmitConfirmationModal}
                    handleYes={() => this.submitTimesheet(false, true)}
                    handleNo={() => {
                        this.setState({ showReSubmitConfirmationModal: false });
                    }}
                />
                {this.state.openAlert &&
                    <AlertBox handleNo={() => { this.setState({ openAlert: false }) }}
                        message={this.alertMessage}
                        showModal={this.state.openAlert}
                    ></AlertBox>
                }
                
                <ConfirmationModal
                    message={this.state.confirmationInactive ? 
                        TS_CONFIRMATION_INACTIVE_CONFIRMATION_MSG() :
                        this.state.confirmationInactiveAndUnderReview ?
                        TS_UNDERREVIEW_CONFIRMATION_INACTIVE_MSG(this.state.tsLockdownDays) :
                        TS_UNDERREVIEW_CONFIRMATION_MSG(this.state.tsLockdownDays)
                    }
                    showModal={this.state.showUnderReviewModal}
                    handleYes={() => this.submitTimesheet(true, false, true)}
                    enterComments
                    commentsRequired
                    commentsChange={this.commentsChange}
                    comments={this.state.approverComments}
                    handleNo={() => {
                        this.setState({ approverComments: "", showUnderReviewModal: false });
                    }}
                    showError={this.state.approverCommentError}
                    isDocRequired= {true}
                    entityId={this.state.tsWeekId}
                />
            </div>
        );
    }
}
export default TimeSheet;
