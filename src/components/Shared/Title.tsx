import * as React from "react";
import { Link } from "react-router-dom";
import BreadCrumbs from "./BreadCrumbs/BreadCrumbs";
import CustomBreadCrumbs from "./BreadCrumbs/CustomBreadCrumbs";

export interface PageTitleProps {
  title: string;
  reqNumber?: string;
  status?: string;
  pageUrl?: string;
  candSubmissionId?: string;
  requisitionId?:string;
  candShareRequestId?:string;
  candSubInterviewId?:string;
  eventId?: string;
  isCustomBreadcrumb?: boolean;
  breadCrumbData?: any
}

export interface PageTitleState { }

class PageTitle extends React.Component<PageTitleProps> {

  render() {
    return (
      <div className="container-fluid  d-md-block d-none mb-3 remove-row">
        <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
          <div className="col-12 col-md-8 fonFifteen paddingLeftandRight">
              {!this.props.isCustomBreadcrumb ? 
              <BreadCrumbs
                globalData={{ candSubmissionId: this.props.candSubmissionId, requisitionId: this.props.requisitionId, candShareRequestId: this.props.candShareRequestId, candSubInterviewId: this.props.candSubInterviewId, eventId: this.props.eventId }}>
              </BreadCrumbs>
              : <CustomBreadCrumbs
                    data={this.props.breadCrumbData}
                ></CustomBreadCrumbs>
              }
          </div>
          {this.props.reqNumber && (
            <div className="col-12 col-md-4 text-right mt-sm-1 mt-md-0 txt-orderno paddingRight">
              <Link
                className="orderNumberTd orderNumberTdBalck"
                to={this.props.pageUrl}
                style={{ color: "#007bff" }}
              >
                Req#: {this.props.reqNumber}
              </Link>
            </div>
          )}
          {this.props.status && (
            <div className="col-4 col-md-4 text-right mt-sm-1 mt-md-0 txt-orderno paddingRight">
              {this.props.pageUrl && (
                <Link
                  className="orderNumberTd orderNumberTdBalck"
                  to={this.props.pageUrl}
                  style={{ color: "#007bff" }}
                >
                  {this.props.status}
                </Link>
              )}
              {!this.props.pageUrl && <span>{this.props.status}</span>}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default PageTitle;
