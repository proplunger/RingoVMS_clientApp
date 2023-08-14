import { instanceOf } from "prop-types";
import { Cookies } from "react-cookie";
class Auth {
    public authenticated: boolean;
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    constructor() {
        this.authenticated = false;
    }

    login(cb) {
        this.authenticated = true;
        cb();
    }

    logout(cb) {
        this.authenticated = false;
        cb();
        // localStorage.clear();
       
    }

    isAuthenticated() {
        const cookie: Cookies = new Cookies();
        console.log(cookie);
        cookie.get(".AspNetCore.Identity.Application");
        if (localStorage.getItem("user") !=null) {
            this.authenticated = true;
        } else {
            this.authenticated = false;
        }
        return this.authenticated;
    }

    getAccessToken() {
        if (localStorage.getItem("user") !=null) {
            return JSON.parse(localStorage.getItem("user")).token;
        }
        return;
    }

    getUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

    hasPermission(controller, method) {
        const permissions = JSON.parse(localStorage.getItem("permissions"));
        if (permissions) {
            var hasPermission = permissions.some((x) => x.ControllerName==controller && x.MethodName==method);
            return hasPermission;
        }
        return false;
    }

    hasPermissionV2(permCode) {
        const permissions = JSON.parse(localStorage.getItem("permissions"));
        if (permissions) {
            var hasPermission = permissions.some((x) => x.PermCode==permCode);
            return hasPermission;
        }
        return false;
    }

    getClient() {
        if (localStorage.getItem("UserClientId") !=null) {
            var clientId = localStorage.getItem("UserClientId");
            if (clientId=="00000000-0000-0000-0000-000000000000") {
                return null;
            }
            return clientId;
        }
    }

    getVendor() {
        return localStorage.getItem("vendorId");
    }

    getClientName() {
        return localStorage.getItem("UserClient");
    }
    setUserContext(userInfo)
    {
       localStorage.setItem("permissions", userInfo.permissions);
       delete userInfo.permissions;
       localStorage.setItem("user", JSON.stringify(userInfo));
       localStorage.setItem("UserClientId", userInfo.defaultClient);
       localStorage.setItem("UserClient", userInfo.client);
       localStorage.setItem("UserClientIntId", userInfo.clientIntId);
       localStorage.setItem("vendorId", userInfo.defaultVendor);
       localStorage.setItem("candidateId", userInfo.candidateId);
       localStorage.setItem("candSubmissionId", userInfo.candSubmissionId);
    }
}

export default new Auth();
