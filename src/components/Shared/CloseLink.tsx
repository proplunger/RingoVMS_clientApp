import * as React from "react";
import { Link } from "react-router-dom";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { errorToastr, history, successToastr } from "../../HelperMethods";

export interface CloseLinkProps {
  title: string;
  pageUrl?: string;
}

export interface CloseLinkState { }

class CloseLink extends React.Component<CloseLinkProps> {
  render() {
    return (
      <div className="col-12 mt-4 mb-4">
        <div className="row ml-sm-0 mr-sm-0 justify-content-center">
          {this.props.pageUrl && (
            <button
              onClick={() => history.goBack()}
              type="button"
              className="btn button button-close mr-2 mr-sm-2 mr-lg-2 shadow col-auto mb-2"
            >
              <FontAwesomeIcon
                icon={faTimesCircle}
                className={"mr-2"}
              />
              {this.props.title}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default CloseLink;
