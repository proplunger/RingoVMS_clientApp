import axios from "axios";

class ContentLibraryDataService {

    getClients = () => {
        return axios.get(`api/clients`);
    }

    getContentType = () => {
        return axios.get(`api/contentlib/contenttype`);
    }

    getUserType = () => {
        return axios.get(`api/accounts/usertype`);
    }
    
    getContentLibrary = (queryStr) => {
        return axios.get(`api/contentlib?${queryStr}`);
    };

    getContentLibDetails = (id) => {
        return axios.get(`api/contentlib/${id}`);
    }

    getContentLibraryView = (queryStr) => {
        return axios.get(`api/contentlib/view?${queryStr}`);
    };

    postContentLib = (data) => {
        return axios.post("api/contentlib", JSON.stringify(data))
    };

    putContentLib = (data) => {
        return axios.put(`api/contentlib`, JSON.stringify(data))
    };

    deleteContentLib = (id) => {
        return axios.delete(`api/contentlib/${id}`)
    };

    patchContentLib = (data) => {
        return axios.patch(`api/contentlib`, JSON.stringify(data))
    };
}

export default new ContentLibraryDataService();