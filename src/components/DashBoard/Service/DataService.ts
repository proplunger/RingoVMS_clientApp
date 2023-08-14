import axios from "axios";

class DashBoardDataService {
    getKPIs = () => {
        return axios.get(`/api/home/kpis`);
    };
     getTasks = () => {
        return axios.get(`/api/home/tasks`);
    };

}

export default new DashBoardDataService();