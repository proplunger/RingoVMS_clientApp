import axios from "axios";

class ClientAdminDataService {

    // Division Locations

    getClientDivisionLocation = (queryStr) => {
        return axios.get(`api/clients/divisions/locations?${queryStr}`);
    };

    getLocations = (queryStr) => {
        return axios.get(`api/admin/divisions/locations?${queryStr}`);
    };

    getLocationDetail = (locationId) => {
        return axios.get(`api/clients/divisions/location/${locationId}`)
    };

    postLocation = (data) => {
        return axios.post("api/clients/divisions/locations", JSON.stringify(data))
    };

    putLocation = (locationId, data) => {
        return axios.put(`api/clients/divisions/location/${locationId}`, JSON.stringify(data))
    };

    deleteClientDivisionLocation = (id, statusId) => {
        return axios.delete(`/api/clients/divisions/location/${id}/${statusId}`)
    };

    // Client Rate Card

    getClientRateCard = (finalQueryString) => {
        return axios.get(`api/admin/ratecards?${finalQueryString}`);
    };

    postClientRateCard = (data) => {
        return axios.post("api/admin/ratecard", JSON.stringify(data))
    };

    putClientRateCard = (rateCardId, data) => {
        return axios.put(`api/admin/ratecard/${rateCardId}`, JSON.stringify(data))
    };

    deleteClientRateCard = (id) => {
        return axios.delete(`/api/admin/ratecard/${id}`)
    };

    //Interview Criteria
    getInterviewCriteria = (clientId, finalQueryString) => {
        return axios.get(`api/admin/client/${clientId}/interviewcriteria?${finalQueryString}`);
    };

    getInterviewCriteriaCount = (clientId) => {
        return axios.get(`api/grid/client/${clientId}/interviewcriteriacount`);
    };

    getInterviewCriteriaDetail = (interviewCriteriaId) => {
        return axios.get(`api/admin/interviewcriteria/${interviewCriteriaId}`)
    };

    postInterviewCriteria = (data) => {
        return axios.post("api/admin/interviewcriteria", JSON.stringify(data))
    };

    putInterviewCriteria = (id, data) => {
        return axios.put(`api/admin/interviewcriteria/${id}`, JSON.stringify(data))
    };

    deleteInterviewCriteria = (id, statusId) => {
        return axios.delete(`/api/admin/interviewcriteria/${id}/${statusId}`)
    };

    getCriteria = (id, queryStr) => {
        return axios.get(`api/admin/clientinterviewcriteria/${id}/criteria?${queryStr}`);
    };

    //Client Job Catalog

    getClientJobCatalog = (finalQueryString) => {
        return axios.get(`api/admin/clientjobcatalogs?${finalQueryString}`);
    };

    mapClientJobCatalog = (data) => {
        return axios.post("api/admin/clientjobcatalog", JSON.stringify(data))
    };

    putClientJobCatalog = (clientJobCatalogId, data) => {
        return axios.put(`api/admin/clientjobcatalog/${clientJobCatalogId}`, JSON.stringify(data))
    };

    deleteClientJobCatalog = (id) => {
        return axios.delete(`/api/admin/clientjobcatalog/${id}`)
    };

    // On Boarding Configuration

    getOnBoardingConfig = (finalQueryString) => {
        return axios.get(`api/admin/onboardingconfiguration?${finalQueryString}`);
    };

    getOnBoardingConfigDetail = (onBoardingId) => {
        return axios.get(`api/admin/onboardingconfiguration/${onBoardingId}`)
    };

    postOnBoardingConfig = (data) => {
        return axios.post("api/admin/onboardingconfiguration", JSON.stringify(data))
    };

    putOnBoardingConfig = (id, data) => {
        return axios.put(`api/admin/onboardingconfiguration/${id}`, JSON.stringify(data))
    };

    deleteOnBoardingConfig = (id) => {
        return axios.delete(`/api/admin/onboardingconfiguration/${id}`)
    };

    getTask = (id, queryStr) => {
        return axios.get(`api/admin/onboardingconfiguration/${id}/tasks?${queryStr}`);
    };

    // Approver Configuration
    getWfApprovalConfig = (clientId, entitytype, finalQueryString) => {
        return axios.get(`api/admin/client/${clientId}/${entitytype}/wfapproval?${finalQueryString}`);
    };

    getWfApprovalDetails = (clientId, entitytype, wfApprovalGroupId) => {
        return axios.get(`api/admin/client/${clientId}/${entitytype}/approverdetail?wfApprovalGroupId=${wfApprovalGroupId}`);
    };

    getWfApprovalConfiCount = (clientId, entitytype) => {
        return axios.get(`api/grid/client/${clientId}/${entitytype}/wfapprovalcount`);
    };

    getWfApprovalConfigDetail = (wfApprovalId) => {
        return axios.get(`api/admin/approverconfiguration/${wfApprovalId}`)
    };

    postWfApprovalConfig = (data) => {
        return axios.post("api/admin/wfapproval", JSON.stringify(data))
    };

    putWfApprovalConfig = (id, data) => {
        return axios.put(`api/admin/wfapproval/${id}`, JSON.stringify(data))
    };

    deleteWfApprovalConfig = (id) => {
        return axios.delete(`/api/admin/wfapproval/${id}`)
    };

    // Timesheet Approver Configuration

    // postTimesheetApproverConfig = (data) => {
    //     return axios.post("api/admin/timesheetapprover", JSON.stringify(data))
    // };

    // putTimesheetApproverConfig = (id, data) => {
    //     return axios.put(`api/admin/timesheetapprover/${id}`, JSON.stringify(data))
    // };

    //Map Global Data

    getAllAssignmentTypes = (clientId) => {
        return axios.get(`api/admin/assignmenttypes/client/${clientId}`);
    };

    getClientAssignmentTypes = (clientId, queryStr) => {
        return axios.get(`api/admin/client/${clientId}/assignmenttypes?${queryStr}`);
    };

    mapClientAssignmentTypes = (data) => {
        return axios.post("api/admin/client/assignmenttype", JSON.stringify(data))
    };

    deleteClientAssignmentType = (id) => {
        return axios.delete(`/api/admin/assignmenttype/${id}`)
    };

    getAllRequisitionReasons = (clientId) => {
        return axios.get(`api/admin/requisitionreasons/client/${clientId}`);
    };

    getClientRequisitionReasons = (clientId, queryStr) => {
        return axios.get(`api/admin/client/${clientId}/requisitionreasons?${queryStr}`);
    };

    mapClientRequisitionReasons = (data) => {
        return axios.post("api/admin/client/requisitionreason", JSON.stringify(data))
    };

    deleteClientRequisitionReason = (id) => {
        return axios.delete(`/api/admin/requisitionreason/${id}`)
    };

    // ClientSetting

    getClientSetting = (id) => {
        return axios.get(`api/admin/client/${id}/settings`)
    }

    patchClientSetting = (data, id) => {
        return axios.patch(`api/admin/client/${id}/settings`, JSON.stringify(data))
    }

    // NotificationSettings

    getNotificationSetting = (id) => {
        return axios.get(`api/admin/notification/user/${id}/settings`)
    }

    patchNotificationSetting = (data, id) => {
        return axios.patch(`api/admin/notification/user/${id}/settings`, JSON.stringify(data))
    }

    // Release Configuration

    getReleaseConfiguration = (finalQueryString) => {
        return axios.get(`api/admin/releaseconfiguration?${finalQueryString}`);
    };

    getReleaseConfigurationDetail = (releaseConfiId) => {
        return axios.get(`api/admin/releaseconfiguration/${releaseConfiId}`)
    };

    deleteReleaseConfiguration = (id) => {
        return axios.delete(`/api/admin/releaseconfiguration/${id}`)
    };

}

export default new ClientAdminDataService();