import axios from "axios";

export const getClientsInvoicesService = (queryStr) => {
    return axios.get(`api/clients/invoice?${queryStr}`);
};

export const getClientsInvoicesServiceByInvoiceId = (vendorInvoiceId, queryStr?) => {
    return axios.get(`api/clients/invoice/${vendorInvoiceId}?${queryStr}`);
};

export const patchClientsInvoicesService = (data) => {
    return axios.put(`api/clients/invoice/status`, JSON.stringify(data));
};

export const postClientsInvoicesService = (data) => {
    return axios.post(`api/clients/invoice`, JSON.stringify(data));
};

export const getPaymentHistoryService = (clientInvoiceId) => {
    return axios.get(`/api/clients/invoice/${clientInvoiceId}/paymenthistory`)
};
export const getRemittanceHistoryService = (vendorInvoiceId) => {
    return axios.get(`/api/vendor/invoice/${vendorInvoiceId}/paymenthistory`)
};
export const postClientPaymentData = (queryStr) => {
    return axios.post(`/api/clients/invoice/${queryStr.clientInvoiceId}/paymenthistory`, JSON.stringify(queryStr));
}

export const postVendorRemittance = (queryStr) => {
    return axios.post(`/api/vendor/invoice/${queryStr.clientInvoiceId}/paymenthistory`, JSON.stringify(queryStr));
}

export const postVendorRemittanceSent = (data) => {
    return axios.post(`/api/vendor/invoice/${data.clientInvoiceId}/paymenthistory`, JSON.stringify(data));
}

export const resetCBI = (data) => {
    return axios.put(`api/clients/invoice`, JSON.stringify(data));
}

export const getCIAccountingReport = (clientInvoiceId) => {
    return axios.get(`api/report/ciaccounting/${clientInvoiceId}`);
}

export const getTsDetailReport = (clientInvoiceId) => {
    return axios.get(`api/report/tsdetail/${clientInvoiceId}`);
}

export const getCISummaryReport = (clientInvoiceId) => {
    return axios.get(`api/report/cisummary/${clientInvoiceId}`);
}