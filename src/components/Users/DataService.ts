import axios from "axios";

class UserDataService {

    getUsers = (queryStr) => {
        return axios.get(`api/users?${queryStr}&$orderby=modifiedDate desc`);
    }

    getUserDetails = (id) => {
        return axios.get(`api/users/${id}`);
    }

    postUser = (data) => {
        return axios.post("api/users", JSON.stringify(data))
    };

    putUser = (id, data) => {
        return axios.put(`api/users/${id}`, JSON.stringify(data))
    };

    patchUser = (id, data) => {
        return axios.patch(`api/users/${id}`, JSON.stringify(data));
    }

    deleteUser = (id, statusId) => {
        return axios.delete(`/api/users/${id}?status=${statusId}`);
    };
}

export default new UserDataService();