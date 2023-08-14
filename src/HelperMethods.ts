import { createBrowserHistory } from "history";
import * as GlobalStore from "../src/store/Global";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { DISPLAY_DEPARTMENT, ReqStatus, SettingCategory } from "./components/Shared/AppConstants";
import { APP_HOME_URL } from "./components/Shared/ApiUrls";
import axios from "axios";

export const history = createBrowserHistory();


// history.goBack = (url?: string) => {
//     history.go(-1);
//     if (history.action != 'POP' && history.length > 2) {
//     }
//     else {
//         history.push(url || APP_HOME_URL);
//     }
// }

history.goBack = () => {
    if(history.length > 2)
    {
        history.go(-1);
    }
    else {
        history.push(APP_HOME_URL);
    }
}

export function authHeader() {
    // return authorization header with jwt token
    var userString = localStorage.getItem("user");
    if (userString) {
        let user = JSON.parse(userString);
        return { Authorization: "Bearer " + user.token };
    } else {
        return { Authorization: "Bearer xadas" };
    }
}

export function appVersion(){
    return JSON.parse(localStorage.getItem("user")).appVersion
}

export function logout() {
    localStorage.removeItem("user");
    window.location.reload(true);
}

export const initialDataState = {
    skip: 0,
    take: 10,
};

export const myinitialDataState = {
    skip: 0,
    take: 0,
};

export const DynamicDataState = (skipValue, takeValue) => {
   return  {
    skip: skipValue,
    take: takeValue,
    };
}
export type GlobalProps = GlobalStore.GlobalState & typeof GlobalStore.actionCreators & RouteComponentProps<{}>;

export const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
});

export const currencyFormatter = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(amount);
};

export const amountFormatter = (amount) => {
    if(amount){
        return parseFloat(amount.toFixed(2))
    }else{
        return amount
    }
};

export const dateFormatter = (date) => {
    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(date));
};

export const weekDayFormatter = (date) => {
    console.log("date from date", date);
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(date));
};

export const dayFormatter = (date) => {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
    }).format(new Date(date));
};

export const dateFormatter2 = (date) => {
    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    }).format(new Date(date));
};
export const toLocalDateTime = (date) => {
    let inDate = new Date(date);
    let timeZneOffsetInMs = inDate.getTimezoneOffset() * 60 * 1000;
    return new Date(inDate.valueOf() - timeZneOffsetInMs);
}
export const datetimeFormatter = (date) => {
    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    }).format(new Date(date));
};
export const padLeadingZeros = (number, width) => {
    width -= number.toString().length;
    if (width==0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number;
}
export function successToastr(message: string) {
    toast.success(message);
}

export function errorToastr(message: string) {
    toast.error(message);
}

export function infoToastr(message: string) {
    toast.info(message);
}

export function warningToastr(message: string) {
    toast.warn(message);
}

export const NavigationArray: any[] = [
    { pageUrl: "", parent: "Home" },
    { pageUrl: "requisitions", parent: "Requisition" },
    { pageUrl: "approvetimesheet", parent: "Timesheet Admin" },
    { pageUrl: "candidate", parent: "Candidate" },
    { pageUrl: "candidates", parent: "Candidate" },
    { pageUrl: "timesheets", parent: "Job Management" },
    { pageUrl: "timesheet", parent: "Job Management" },
    { pageUrl: "report", parent: "Reports" },
];

export const calculateBudget = (data, holidays = []) => {
    const oneDay = 24 * 60 * 60 * 1000;
    var noOfDays = calculateBusinessDays(data.startDate, data.endDate, holidays);
    var noOfHours = (new Date(data.shiftEndTime).getTime() - new Date(data.shiftStartTime).getTime()) / (1000 * 60 * 60);
    var budget = data.billRate * noOfDays * noOfHours * data.noOfReqStaff;
    return budget < 0 ? 0 : budget;
};

const calculateBusinessDays = (d0, d1, holidays) => {
    var startDate = new Date(d0);
    var endDate = new Date(d1);

    // Calculate days between dates
    var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
    startDate.setHours(0, 0, 0, 1); // Start just after midnight
    endDate.setHours(23, 59, 59, 999); // End just before midnight
    var diff = endDate.getTime() - startDate.getTime(); // Milliseconds between datetime objects
    var days = Math.ceil(diff / millisecondsPerDay);

    // Subtract two weekend days for every week in between
    var weeks = Math.floor(days / 7);
    days -= weeks * 2;

    // Handle special cases
    var startDay = startDate.getDay();
    var endDay = endDate.getDay();

    // Remove weekend not previously removed.
    if (startDay - endDay > 1) {
        days -= 2;
    }
    // Remove start day if span starts on Sunday but ends before Saturday
    if (startDay==0 && endDay !=6) {
        days--;
    }
    // Remove end day if span ends on Saturday but starts after Sunday
    if (endDay==6 && startDay !=0) {
        days--;
    }

    holidays.forEach((day) => {
        if (new Date(day) >= d0 && new Date(day) <= d1) {
            /* If it is not saturday (6) or sunday (0), substract it */
            if (new Date(day).getDay() % 6 !=0) {
                days--;
            }
        }
    });

    return days;
};

export function updateFilteredArray(data) {
    if (data != undefined)
        data.forEach((element) => {
            element.filters.forEach((item) => {
                if (
                    item.operator=="lte" ||
                    item.operator=="gte" ||
                    item.field=="submittedOn" ||
                    item.field=="startDate" ||
                    item.field=="endDate"
                ) {
                    item.value = new Date(item.value);
                }
            });
        });
    return data;
}

const currentYear = new Date().getFullYear();
export const parseAdjust = (eventDate) => {
    const date = new Date(eventDate);
    //date.setFullYear(currentYear);
    return date;
};
export const numberFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

export function localDateTime(date) { return toLocalDateTime(date); }

export function preventSubmitOnEnter(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) ==13) {
        keyEvent.preventDefault();
    }
}

export const candidateUnderReview = (status) => {
    return [ReqStatus.RELEASED, ReqStatus.CANDIDATEUNDERREVIEW, ReqStatus.FILLED].indexOf(status) !=-1;
}

export const releaseReq = (status) => {
    return [ReqStatus.APPROVED, ReqStatus.RELEASED, ReqStatus.CANDIDATEUNDERREVIEW, ReqStatus.FILLED].indexOf(status) !=-1;
}


export let dataForContract: any;
export const setContractData=(data, id)=>{
   return dataForContract=data;
}

export const RemoveSecFromTime = (time)=>  {
    let msec = new Date(time).setMilliseconds(0);
    return new Date(msec).setSeconds(0);
}

export const restrictValue = (e) => {
    let keyCode = e.keyCode || e.which;
    var regex = /^[0-9\b]*$/;
    var isValid = regex.test(String.fromCharCode(keyCode));

    if (!isValid || e.target.value.length==9) {
      e.preventDefault();
      return false;
    }
};

export function downloadExcel(fileName, data){
    let fileExt = ".xlsx";
    let fileType = "application";
    
    const linkSource = `data:${fileType}/${fileExt};base64,${data}`;
    const downloadLink = document.createElement("a");

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

export const clientSettingData = (id, callback) => {
    axios.get(`api/admin/client/${id}/settings`).then(res => {
        const settings = res.data.filter(
          (i) => i.name ==SettingCategory.REQUISITION
        )[0];
        if(settings && settings.settings){
        const result = settings.settings.filter(
          (i) => i.settingCode ==DISPLAY_DEPARTMENT
        );
        if (result.length > 0) {
          callback(result[0].value=='true'? true: false);
        }
      }
    })
}

export const callUserEmail = (userId, callback) => {

    axios.get(`api/users/${userId}`).then((res) => {
        const { data } = res;

        callback(data.email);
    });
}

export const newPageSizes: number[] = [5, 10, 20, 50, 100];

export const clientSettingsData = (id, settingCategory, settingName, callback) => {
    axios.get(`api/admin/client/${id}/settings`).then(res => {
        const settings = res.data.filter(
          (i) => i.name ==settingCategory
        )[0];
        if(settings && settings.settings){
        const result = settings.settings.filter(
          (i) => i.settingCode ==settingName
        );
        if (result.length > 0 && (result[0].settingDataType=='boolean' || result[0].settingDataType =='switch')) {
          callback(result[0].value=='true' ? true: false);
        }
        else if (result.length > 0) {
            callback(result[0].value);
        }
      }
      })
}

export const pageSizes: number[] = [5, 10, 20, 50, 100];

export const getFormattedDate = () => {
    let todaysDate = new Date();
    var dd = todaysDate.getDate();
    var mm = todaysDate.getMonth() + 1;
    var yyyy = todaysDate.getFullYear();
    todaysDate = new Date(yyyy + '-' + mm + '-' + dd);
    return todaysDate;
}