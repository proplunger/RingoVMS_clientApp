import axios from "axios";

class TicketDataService {

    // Support Tickets

    getAllTickets = (url, queryStr, config) => {
        return axios.post(`${url}`, (queryStr), config);
    };

    getClientAllTickets = (finalQueryString) => {
        return axios.get(`api/tickets?${finalQueryString}`);
    };

    getTicketDetails = (ticketId) => {
        return axios.get(`api/tickets/${ticketId}`);
    };

    viewTicketDetails = (queryParams) => {
        return axios.get(`api/tickets?$filter=${queryParams}`);
    };

    getClients = (queryParams) => {
        return axios.get(`api/clients?$filter=${queryParams}`);
    };

    getClientAssociatedVendor = (clientId, queryParams) => {
        return axios.get(`api/clients/${clientId}/vendor?$filter=${queryParams}`);
    };

    getUsers = (queryParams) => {
        return axios.get(`api/users?$filter=${queryParams}`);
    };

    getFuncArea = (queryParams) => {
        return axios.get(`api/tickets/functionalareas?$filter=${queryParams}`);
    };

    getFunc = (queryParams) => {
        return axios.get(`api/tickets/functions?$filter=${queryParams}`);
    };

    getPriority = (queryParams) => {
        return axios.get(`api/tickets/priorities?$filter=${queryParams}`);
    };

    getRequestType = (queryParams) => {
        return axios.get(`api/tickets/requesttype?$filter=${queryParams}`);
    };

    getResolutionType = (queryParams) => {
        return axios.get(`api/tickets/resolutiontype?$filter=${queryParams}`);
    };

    getStatus = (queryParams) => {
        return axios.get(`api/tickets/status?$filter=${queryParams}`);
    };

    getQueue = (queryParams) => {
        return axios.get(`api/tickets/queue?$filter=${queryParams}`);
    };

    postTicket = (data) => {
        return axios.post("api/tickets", JSON.stringify(data))
    };

    putTicket = (data) => {
        return axios.put(`api/tickets`, JSON.stringify(data))
    };

    deleteTicket = (id) => {
        return axios.delete(`/api/tickets/${id}`)
    };
}

export default new TicketDataService();