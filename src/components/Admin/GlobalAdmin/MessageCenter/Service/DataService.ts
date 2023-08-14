import axios from "axios";

class MessageCenterDataService {
  //CRUD Apis For Communication Center
  getCommCenter = (queryStr) => {
    return axios.get(`api/messages?${queryStr}`);
  };

  getCommCenterDetails = (id) => {
    return axios.get(`api/messages/${id}`);
  };

  postCommCenter = (data) => {
    return axios.post("api/messages", JSON.stringify(data));
  };

  putCommCenter = (id, data) => {
    return axios.put(`api/messages/${id}`, JSON.stringify(data));
  };

  deleteCommCenter = (id, statusId) => {
    return axios.delete(`/api/messages/${id}/${statusId}`);
  };

  //Apis For Dropdowns
  getRoles = () => {
    return axios.get(`api/admin/role`);
  };

  getClients = () => {
    return axios.get(`api/clients`);
  };

  getUserTypes = () => {
    return axios.get(`api/accounts/usertype`);
  };

  getMsgPriority = () => {
    return axios.get(`api/messages/priority`);
  };

  getMsgCategory = () => {
    return axios.get(`api/messages/category`);
  };

  patchMessage = (id, data) => {
    return axios.patch(`api/messages/${id}`, JSON.stringify(data));
  }
}
export default new MessageCenterDataService();
