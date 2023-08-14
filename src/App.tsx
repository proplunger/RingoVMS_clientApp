import * as React from "react";
import { Router } from "react-router";
import "../src/assets/scss/variables.scss";
import "../src/assets/css/Kendo.css";
import "./assets/css/KendoCustom.css";
import { history } from "../src/HelperMethods";
import Routes from "../src/components/Routing/Routes";
import { library, IconPack } from "@fortawesome/fontawesome-svg-core";
import { ToastContainer, Slide } from "react-toastify";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { APP_HOME_URL } from "./components/Shared/ApiUrls";
import { kendoLoadingPanel } from "./components/ReusableComponents";
import auth from "./components/Auth";

export class App extends React.Component<{}, { isLoading }> {
  constructor(props) {
    super(props);
    library.add(fab as IconPack);
    this.state = { isLoading: false };

    this.unload();
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer
          transition={Slide}
          hideProgressBar={true}
          position="top-right"
        />
        {this.state.isLoading && kendoLoadingPanel}
        <Router history={history}>
          <Routes />
        </Router>
      </React.Fragment>
    );
  }

  public componentWillMount() {
    localStorage.openpages = Date.now();
    window.addEventListener('storage', this.onLocalStorageEvent, false);

    var url = new URL(window.location.href);
    var pathname = window.location.pathname;
    var userValid = url.searchParams.get("IsUserValid");
    if (userValid !=null) {
      // case when external register or login is called
      var queryString = window.location.search;
      var urlParams = new URLSearchParams(queryString);
      if (userValid=="True") {
        this.setState({ isLoading: true });
        localStorage.setItem("rememberme", "true");
        localStorage.setItem("UserClientId", urlParams.get("defaultClient"));
        localStorage.setItem("vendorId", urlParams.get("defaultVendor") !=null ? urlParams.get("defaultVendor") : "");
        localStorage.setItem("candidateId", urlParams.get("CandidateId") !=null ? urlParams.get("CandidateId") : "");
        localStorage.setItem("candSubmissionId", urlParams.get("CandSubmissionId") !=null ? urlParams.get("CandSubmissionId") : "");
        var obj = {
          role: urlParams.get("Role"),
          roleType: urlParams.get("RoleType"),
          userId: urlParams.get("UserId"),
          candidateId: urlParams.get("CandidateId") !=null ? urlParams.get("CandidateId") : "",
          candSubmissionId: urlParams.get("CandSubmissionId") !=null ? urlParams.get("CandSubmissionId") : "",
          token: urlParams.get("Token"),
          userFullName: urlParams.get("UserFullName"),
          userName: urlParams.get("UserName"),
          client: urlParams.get("Client"),
          isUserValid: urlParams.get("IsUserValid"),
          isTnCAccepted: urlParams.get("IsTnCAccepted"),
          appVersion: urlParams.get("AppVersion")
        };
        fetch("/api/accounts/external/menuandpermission", {
          headers: { Authorization: "Bearer " + obj.token },
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            localStorage.setItem("permissions", res.permissions);
            const menus = res.menus;
            obj['menus'] = menus;
            obj['breadcrumbs'] = res.breadcrumbs;
            localStorage.setItem("user", JSON.stringify(obj));
            this.setState({ isLoading: false });
            if (!obj.isTnCAccepted || obj.isTnCAccepted=="False") { // if tnc is not accepted and session exists
              history.push('/accounts/tnc');
            }
          });
      } else {
        history.push("/");
        setTimeout(() => {
          toast.error(urlParams.get("error"));
        }, 500);
        return;
      }
    }
    var user = localStorage.getItem("user")
    if (user) {
      if (!JSON.parse(user).isTnCAccepted || JSON.parse(user).isTnCAccepted=="False") { // if tnc is not accepted and session exists
        history.push('/accounts/tnc');
      }
      else {
        if (userValid !=null) { // if external login redirect to login
          history.push(APP_HOME_URL);
        } else { // some other link
          history.push(pathname);
        }
      }
    } else if (userValid !=null) { // redirect to login
      history.push(APP_HOME_URL);
    }
  }

  public componentDidMount() {
    window.onbeforeunload = (event) => {
      sessionStorage.setItem("logged-in", "yes");
      localStorage.removeItem("logged-in");
      localStorage.page_available = Date.now();
      // this.onLocalStorageEvent(event)
    };
  }
  onLocalStorageEvent = (e) => {
    if (e.key=="openpages") {
      localStorage.page_available = Date.now();
      localStorage.setItem("logged-in", "yes");
    }
    if (e.key=="page_available") {
      localStorage.setItem("logged-in", "yes");
    }
  };
  componentWillUnmount() {
    //   window.onbeforeunload = (event) => {
    //     sessionStorage.setItem("logged-in", "yes");
    //     localStorage.removeItem("logged-in");
    //   };
    // window.removeEventListener("beforeunload", this.unload);
    // window.removeEventListener("unload", this.unload);
  }

  unload = () => {
    let loggedIn = localStorage.getItem("logged-in");
    let sessionLoggedIn = sessionStorage.getItem("logged-in");
    if (!loggedIn) {
      if (sessionLoggedIn) {
        localStorage.setItem("logged-in", sessionLoggedIn);
      } else {
        var rememberMe = localStorage.getItem("rememberme");
        var user = auth.getUser();
        localStorage.clear();
        if (rememberMe) {
          if (user) {
            localStorage.setItem("rememberme", rememberMe);
            localStorage.setItem("password", "");
            localStorage.setItem("userName", user.userName);
          }
        }
      }
    }
  };
}

export default App;
