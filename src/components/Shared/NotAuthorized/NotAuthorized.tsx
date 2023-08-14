import React, { Component } from "react";
import { Link } from "react-router-dom";
import { APP_HOME_URL } from "../ApiUrls";

class NotAuthorized extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 text-center">
                        <h2 className="font-weight-bolder text-body  mt-5">403 Forbidden</h2>
                        <h6 className="text-secondary  mt-3">You are not authorized to view this page. Kindly contact the system admin.</h6>
                        <div className="mt-4">
                            <img src={require("../../../assets/images/error403.png")} />
                        </div>
                        <div className="mt-5 linkcolor">
                            <Link to={APP_HOME_URL}> Back to home </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotAuthorized;
