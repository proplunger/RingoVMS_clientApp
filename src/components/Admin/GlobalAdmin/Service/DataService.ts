import { toODataString } from "@progress/kendo-data-query";
import axios from "axios";

class GlobalAdminDataService {

    getGlobalJobCatalog = (queryStr) => {
        return axios.get(`api/admin/globaljobcatalogs?${queryStr}`);
    };

    postGlobalJobCatalog = (data) => {
        return axios.post("api/admin/globaljobcatalog", JSON.stringify(data))
    };

    putGlobalJobCatalog = (positionId, data) => {
        return axios.put(`api/admin/globaljobcatalog/${positionId}`, JSON.stringify(data))
    };

    deleteGlobalJobCatalog = (id) => {
        return axios.delete(`/api/admin/globaljobcatalog/${id}`)
    };

    // GlobalSetting
    getGlobalSetting = () => {
        return axios.get(`api/admin/global/settings`)
    };
     
    patchGlobalSetting = (data) => {
        return axios.patch(`api/admin/global/settings`, JSON.stringify(data))
    };

    // ClientPositionCategories
    getClientPositionCategories(clientId, queryParams) {
        return axios.get(`api/clients/${clientId}/positions/categories?${queryParams}`);
    }
    
    // ClientPositions
    getClientPositions(clientId, jobCategoryId, queryParams) {
        return axios.get(`api/clients/${clientId}/jobcategories/${jobCategoryId}/jobpositions?$filter=${queryParams}`);

    }
    getActionReason(ActionReasonId){
        return axios.get(`api/admin/action/reason/${ActionReasonId}`)

    }
    getEventLogs = (queryStr) => {
        return axios.get(`api/events?${`$count=true&`}${queryStr}`);
    };

    getRoleDetails = (roleId) => {
        return axios.get(`api/admin/role/${roleId}`)
    }

    // NotificationTypes
    getNotificationType(queryParams) {
        return axios.get(`api/admin/notificationtype?${queryParams}`);
    }

    //NotificationMedium
    getNotificationMedium(queryParams) {
        return axios.get(`api/admin/notificationmedium?${queryParams}`);
    }

    // NotificationTemplateDetail
    getNotificationTemplateDetail(notificationTemplateId) {
        return axios.get(`api/admin/notificationtemplate/${notificationTemplateId}`);
    }

    // postNotificationTemplate = (data) => {
    //     return axios.post("api/admin/notificationtemplate", JSON.stringify(data))
    // };

    putNotificationTemplate = (notificationTemplateId, data) => {
        return axios.put(`api/admin/notificationtemplate/${notificationTemplateId}`, JSON.stringify(data))
    };

    getGlobalActionReason(queryStr){
        return  axios.get(`api/admin/globalActionReasons?${queryStr}`)
    }

    saveReasonAction(data){
        return axios.post(`api/admin/actionReason`, JSON.stringify(data))
    }

    getActions(){
        return axios.get(`api/workflow/actions?$orderby=entityName`);
    }
    
}

export default new GlobalAdminDataService();