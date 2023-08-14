import * as React from "react";
import { Link } from "react-router-dom";
import { APP_HOME_URL } from "../ApiUrls";

class NotFound extends React.Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 text-center">
                        <h2 className="font-weight-bolder text-body mt-5">404 Page Not Found</h2>
                        <h6 className="text-secondary mt-3">Whoops....Looks like the page you are looking for is not available :(</h6>
                        <div className="mt-5">
                            <img src={require("../../../assets/images/pageNotFound.png")} />
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

export default NotFound;
