import axios from "axios";

class AccountDataService {
    changePassword = (data) => {
        return axios.put(`/api/accounts/internal/password`, data);
    };

}

export default new AccountDataService();