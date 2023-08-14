import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleDown,
  faChevronCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import RequisitionDetails from "./RequisitionDetails";
import PositionDetails from "./PositionDetails";
import ApprovalsWFGrid from "../ApprovalsWFGrid/ApprovalsWFGrid";
import ReqStatusBar from "../ReqStatusCard/ReqStatusBar";
import auth from "../../Auth";
import { AppPermissions } from "../Constants/AppPermissions";
import { AuthRoleType, isRoleType, isVendorRoleType } from "../AppConstants";
import { Link } from "react-router-dom";
import { CAND_SUB_WORKFLOW_URL } from "../ApiUrls";
import BreadCrumbs from "../BreadCrumbs/BreadCrumbs";

export interface BaseRequisitionProps {
  reqId: string;
  reqDetails: any;
  title: string;
  toggleFifth?: boolean;
  toggleSixth?: boolean;
  openFifthCollapsible?: any;
  closeFifthCollapsible?: any;
  showSubmittedCandLink?: boolean;
  isEnableDepartment?: any;
}

export interface BaseRequisitionState {
  reqId: string;
  clientId: string;
  toggelFirst: boolean;
  toggleSecond: boolean;
  toggleThird: boolean;
  toggleFourth: boolean;
  toggleAll: boolean;
  isEnableDepartment?: boolean;
}

class BaseRequisition extends React.Component<
  BaseRequisitionProps,
  BaseRequisitionState
> {
  public reqId: string;
  constructor(props: BaseRequisitionProps) {
    super(props);
    this.state = {
      reqId: props.reqId,
      clientId: auth.getClient(),
      toggleAll: false,
      toggelFirst: true,
      toggleSecond: false,
      toggleThird: false,
      toggleFourth: false 
    };
  }

  onCollapseOpen = () => {
    this.setState({
      toggleAll: true,
      toggelFirst: true,
      toggleFourth: true,
      toggleThird: true,
      toggleSecond: true,
    });
    this.props.openFifthCollapsible();
  };

  onCollapseClose = () => {
    this.setState({
      toggleAll: false,
      toggelFirst: false,
      toggleFourth: false,
      toggleThird: false,
      toggleSecond: false,
    });
    this.props.closeFifthCollapsible();
  };
  render() {
    const { title, showSubmittedCandLink, reqDetails, isEnableDepartment } = this.props;
    const {
      toggleAll,
      toggelFirst,
      toggleSecond,
      toggleThird,
      toggleFourth,
    } = this.state;

    const reqTriggerName = (
      <span>
        Requisition Details
        <span
          className="d-none d-sm-block"
          style={{ float: "right", marginRight: "25px" }}
        >
          Status : {reqDetails.status}
        </span>
      </span>
    );

    return (
      <React.Fragment>
        <div>
          {reqDetails.status && (
            <ReqStatusBar
              orderId={reqDetails.reqId}
              orderStatus={reqDetails.status}
            />
          )}
          <div className="col-12 ml-0 mr-0">
            <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
              <div className="col-8 col-md-8 fonFifteen paddingLeftandRight">
                <div className="d-none d-md-block">
                  {/* {title} Requisition */}
                  <BreadCrumbs globalData={{requisitionId:this.props.reqId}}></BreadCrumbs>
                  </div>
              </div>
              <div className="col-4 col-md-4 text-right mt-sm-1 mt-md-0 txt-orderno paddingRight d-flex align-items-center justify-content-end">
                {/* {(reqDetails.reqId && showSubmittedCandLink) ? (<><Link
                                          className="orderNumberTd orderNumberTdBalck mr-2"
                                          to={`${CAND_SUB_WORKFLOW_URL}${reqDetails.reqId}`}
                                          style={{ color: "#007bff" }}
                                        >
                                          {`Submitted Candidates`}
                                        </Link> | </>) : '' }  */}
                 Req#: {reqDetails.reqNumber}
                {(toggleFourth && toggleSecond && toggelFirst && toggleThird) ||
                  toggleAll ? (
                  <FontAwesomeIcon
                    className="ml-2 mt-0 text-primary collapseExpandIcon globalExpandCursor"
                    icon={faChevronCircleUp}
                    onClick={
                      toggleAll ? this.onCollapseClose : this.onCollapseOpen
                    }
                  ></FontAwesomeIcon>
                ) : (
                  <FontAwesomeIcon
                    className="ml-2 mt-1 text-primary collapseExpandIcon globalExpandCursor"
                    icon={faChevronCircleDown}
                    onClick={
                      toggleAll ? this.onCollapseClose : this.onCollapseOpen
                    }
                  ></FontAwesomeIcon>
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            {this.state.reqId && (
              <React.Fragment>
                <span className="d-block d-md-none text-right">
                  Status : {reqDetails.status}
                </span>

                <Collapsible
                  trigger={reqTriggerName}
                  open={toggelFirst}
                  onTriggerOpening={() => this.setState({ toggelFirst: true })}
                  onTriggerClosing={() => this.setState({ toggelFirst: false })}
                >
                  <RequisitionDetails
                    reqId={this.state.reqId}
                    reqDetails={reqDetails}
                    isEnableDepartment={isEnableDepartment}
                  />
                </Collapsible>

                <Collapsible
                  trigger="Position Details"
                  open={toggleSecond}
                  onTriggerOpening={() => this.setState({ toggleSecond: true })}
                  onTriggerClosing={() =>
                    this.setState({ toggleSecond: false })
                  }
                >
                  <PositionDetails reqId={this.state.reqId} />
                </Collapsible>
                <React.Fragment>
                  {!isRoleType(AuthRoleType.Vendor) &&
                    <Collapsible
                      trigger="Requisition Approvers"
                      lazyRender={true}
                      open={toggleThird}
                      onTriggerOpening={() => this.setState({ toggleThird: true })}
                      onTriggerClosing={() => this.setState({ toggleThird: false })}
                    >
                      <ApprovalsWFGrid
                        entityId={this.state.reqId}
                        entityType="Requisition"
                        clientId={this.state.clientId}
                        permission={AppPermissions.REQ_APPROVE}
                        canEdit={false}
                      />
                    </Collapsible>
                  }
                  <Collapsible
                    trigger="Timesheet Approvers"
                    lazyRender={true}
                    open={toggleFourth}
                    onTriggerOpening={() => this.setState({ toggleFourth: true })}
                    onTriggerClosing={() =>
                      this.setState({ toggleFourth: false })
                    }
                  >
                    <ApprovalsWFGrid
                      entityId={this.state.reqId}
                      entityType="Timesheet"
                      clientId={this.state.clientId}
                      permission={AppPermissions.TS_APPROVE}
                      canEdit={false}
                    />
                  </Collapsible>
                </React.Fragment>
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BaseRequisition;
