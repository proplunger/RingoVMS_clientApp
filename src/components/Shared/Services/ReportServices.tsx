import { State } from "@progress/kendo-data-query";
import axios from "axios";
import { CreateQueryString } from "../../ReusableComponents";

class ReportServices {
    getVendorPerformanceReportForExcel = (clientId, vendorId, dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
          };
        let finalQueryString = CreateQueryString(finalState, clientId, vendorId);  
        return axios.get(`api/report/vp?${finalQueryString}`)
    };

    getTimesheetReportForExcel = (clientId, vendorId, dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
          };
        let finalQueryString = CreateQueryString(finalState, clientId, vendorId);  
        return axios.get(`/api/grid/tsexcel?${finalQueryString}`)
    };

    getFilledAssignmentReportForExcel = (clientId, vendorId, dataState) => {
      var finalState: State = {
          ...dataState,
          take: null,
          skip: 0,
        };
      let finalQueryString = CreateQueryString(finalState, clientId, vendorId);  
      return axios.get(`/api/grid/faexcel?${finalQueryString}`)
    };

    getClientActivityReportForExcel = (clientId, vendorId, dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        let finalQueryString = CreateQueryString(finalState, clientId, vendorId);
        return axios.get(`/api/grid/caexcel?${finalQueryString}`)
    };
}

export default new ReportServices();