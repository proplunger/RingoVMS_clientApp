import axios from "axios";
import auth from "./Auth";
import { history, logout, errorToastr } from "../HelperMethods";
import { toast } from "react-toastify";
import { ERROR_MSG } from "./Shared/AppMessages";
import { hideLoader, showLoader } from "./ReusableComponents";
import { BASE_URL } from "./Shared/AppConstants";


export default {
    setupInterceptors: (store) => {
        axios.interceptors.request.use(
            (config) => {
                if (config.method !="get") {
                    showLoader();
                }
                const token = auth.getAccessToken();
                if (token) {
                    config.headers["Authorization"] = "Bearer " + token;
                }
                if (!config.headers["Content-Type"]) {
                    config.headers["Content-Type"] = "application/json";
                }
                
                config.baseURL = BASE_URL;
                return config;
            },
            (error) => {
                Promise.reject(error);
            }
        );

        //Add a response interceptor

        axios.interceptors.response.use(
            (response) => {

                if (response.config.method !="get") {
                    hideLoader();
                }
                return response;

            },
            function (error) {
                hideLoader();
                const originalRequest = error.config;
                var returnUrl = window.location.pathname;
                switch (error.response.status) {
                    case 400:
                        var data = error.response.data;
                        if (data.hasOwnProperty("errors")) {
                            var errorMsg = data.title + "\n";
                            for (var key in data.errors) {
                                errorMsg += `${key} : ${data.errors[key].join(",")} \n`;
                            }
                            errorToastr(errorMsg);
                        }
                        else {
                            errorToastr(data.Message);
                        }
                        break;
                    case 401:
                        auth.logout(() => {
                            history.push(returnUrl);
                        });
                        break;
                    case 403:
                        history.push("/notauthorized");
                        break;
                    case 404:
                        history.push("/404");
                        break;
                    case 500:
                        errorToastr(ERROR_MSG);
                        break;
                    default:
                        break;
                }

                return Promise.reject(error);
            }
        );
    },
};
