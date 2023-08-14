import axios from "axios";

class CommonDataService {
    getClientDivision = (clientId, queryParams) => {
        return axios.get(`api/clients/${clientId}/divisions?$filter=${queryParams}`)
    };

    getDivisionLocations = (queryParams) => {
        return axios.get(`api/clients/divisions/locations?$filter=${queryParams}`)
    };

    //for multiple locations
    getMultiDivisionLocations = (data) => {
        return axios.post(`api/clients/divisions/locations/map`,JSON.stringify(data))
    };

    getShiftTypes = () => {
        return axios.get(`api/ts/shifttype`)
    };

    getServiceTypes = () => {
        return axios.get(`api/admin/servicetypes`)
    };

    getBillTypes = () => {
        return axios.get(`api/admin/billtypes`)
    };

    getCountry = () => {
        return axios.get(`api/admin/country`)
    };

    getState = (countryId) => {
        return axios.get(`api/admin/country/${countryId}/state`)
    };

    getCity = (stateId) => {
        return axios.get(`api/admin/state/${stateId}/city`)
    };

    getDocTypes = () => {
        return axios.get(`api/candidates/doctype`)
    };

    getClientJobTypes = (clientId) => {
        return axios.get(`api/clients/${clientId}/jobtypes`)
    };

    getJobCategories = (clientId, jobFlowId) => {
        return axios.get(`api/clients/${clientId}/jobtypes/${jobFlowId}/jobcategories`)
    };


    getSkills = () => {
        return axios.get(`api/admin/skills`)
    };
    
    download = (filePath, downLoadedFileName?) => {
        axios.get(`/api/candidates/documents/download?filePath=${filePath}`).then((res: any) => {
            if (res) {
                let fileExt = filePath.split('.')[1].toLowerCase();
                let fileType;
                if (fileExt=='jpg' || fileExt=='png' || fileExt=='jpeg') {
                    fileType = 'image';
                }
                else {
                    fileType = 'application'
                }
                const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
                const downloadLink = document.createElement("a");
                let fileName="";
                if(downLoadedFileName){
                    fileName = downLoadedFileName + "." + fileExt;
                }
                else{
                    fileName = filePath.split('/')[1];
                }
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            }
        });
    }

    getUserAndRoles = (queryParams?) => {
        return axios.get(`api/users/userandroles${queryParams}`);
    };

    getEvents = (queryParams) => {
        return axios.get(`api/events/details?$filter=${queryParams}`)
    };

    getAuditLogsService = (queryParams) => {
        return axios.get(`api/grid/auditlog?${queryParams}`)
    }
}



export default new CommonDataService();