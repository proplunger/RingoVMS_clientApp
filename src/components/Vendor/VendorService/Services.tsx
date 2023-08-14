import axios from "axios";
import { VendorInvoiceServiceTypeId } from "../../Shared/AppConstants";

export const getVendorInvoicesService = (queryStr) => {
    return axios.get(`api/vendor/invoice?${queryStr}`);
};

export const getVendorInvoicesServiceByInvoiceId = (vendorInvoiceId, queryStr?) => {
    return axios.get(`api/vendor/invoice/${vendorInvoiceId}?${queryStr}`);
};

export const patchVendorInvoicesService = (data) => {
    return axios.put(`api/vendor/invoice/status`, JSON.stringify(data));
};

export const getDebitCreditServiceTypes = () => {
    return axios.get(`api/admin/servicetypes?$filter=intId in (${VendorInvoiceServiceTypeId.DEBIT},${VendorInvoiceServiceTypeId.CREDIT})`);
};

export const getSubmittedCandidates = (queryStr) => {
    return axios.get(`api/ts/associates?${queryStr}`);
};

export const getPayPeriodsByCandidate = (candidateId, invoiceId) => {
    return axios.get(`/api/ts/candidate/${candidateId}/payperiod?invoiceId=${invoiceId}`);
};

export const checkDuplicateExpense = (serviceTypeId, tsWeekId) => {
    return axios.get(`api/ts/week/expense?$filter=serviceTypeId eq ${serviceTypeId} and tsWeekId eq ${tsWeekId}`);
};

// Client 

export const getClientInvoicesServiceByInvoiceId = (clientInvoiceId) => {
    return axios.get(`api/clients/invoice/${clientInvoiceId}`);
};

export const getVendorRemittanceService = (queryStr) => {
    return axios.get(`api/vendor/remittance?${queryStr}`);
};

export const patchVendorPaymentStatus = (data) => {
    return axios.patch(`api/vendor/invoice/history/update`,  JSON.stringify(data));
}

export const cancelScheduledPayment = (id) => {
    return axios.delete(`api/vendor/scheduledpayment/${id}`);
}