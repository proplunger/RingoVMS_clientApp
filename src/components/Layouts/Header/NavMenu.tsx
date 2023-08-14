import * as React from "react";
import NavbarToggler from "reactstrap/lib/NavbarToggler";
import Collapse from "reactstrap/lib/Collapse";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCalendarAlt,
  faSignOutAlt,
  faUserCog,
  faFile,
  faFileAlt,
  faQuestionCircle,
  faHeadset,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  PanelBar,
  PanelBarItem,
  PanelBarUtils,
} from "@progress/kendo-react-layout";
import {
  authHeader,
  history,
  NavigationArray,
} from "../../../../src/HelperMethods";
import { ApplicationState } from "../../../store";
import * as GlobalStore from "../../../store/Global";
import { connect } from "react-redux";
import "./NavMenu.css";
import auth from "../../Auth";
import {
  Controllers,
  AdminControllerActions,
} from "../../Shared/AppPermissions";
import Axios from "axios";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import {
  APP_HOME_URL,
  MANAGE_SUPPORT_TICKETS,
  MANAGE_EVENTS_LOGS,
  NOTIFICATION_SETTING,
  USER_CALENDAR_URL,
} from "../../Shared/ApiUrls";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import DropdownContainer from "../../Requisitions/ReleaseRequisition/ReleaseSchedule/DropdownContainer";
import ImersonateComp, {
  ImpersonatePopUp,
} from "../../Account/Impersonate/ImpersonatePopUp";
import { Dialog } from "@progress/kendo-react-dialogs";
import { showLoader } from "../../ReusableComponents";
import { ProtectedRoute } from "../../Routing/ProtectedRoute";
import AuthorizedLayout from "./AuthorizedLayout";
import ManageEventsLog from "../../Admin/GlobalAdmin/EventsLog/ManageEventLog/ManageEventsLog";
type GlobalProps = GlobalStore.GlobalState &
  typeof GlobalStore.actionCreators & NavProps &
  RouteComponentProps<{}>;

export interface NavProps {
  pageTitle: any
};
export interface INavMenuState {
  isOpen: boolean;
  activeHeader: string;
  userInfo: any;
  userClientLob: any[];
  isClientOpen: boolean;
  clientFullName: string;
  selectedLobName: string;
  selectedLobId: string;
  clientNameWithLob: string;
  fullClientNameWithLob?: string;
  showModal?: boolean;
  showImpersonateModal?: boolean;
  pageTitle?: string;
}

export class NavMenu extends React.PureComponent<GlobalProps, INavMenuState> {
  _documentRef;
  event: any;
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      activeHeader: "home",
      userInfo: JSON.parse(localStorage.getItem("user")),
      userClientLob: [],
      isClientOpen: false,
      clientFullName: "Loading...",
      selectedLobName: "Loading...",
      selectedLobId: "",
      clientNameWithLob: "Loading...",
      showModal: false,
      showImpersonateModal: false,
      pageTitle: document.title,
    };
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onSelectLob = this.onSelectLob.bind(this);
  }
  
  
  public render() {
    console.log("this.props.navmenue", this.props, document.title)
    const { menus } = this.state.userInfo;
    const pageTitle = document.title;
    
    return (
      <>
      <header id="headerMenu" ref={(c) => (this._documentRef = c)}>
        <div className="container-fluid" id="navigationMenu">
          <div className="row gradient">
            <div className="col-1 pr-0  text-center d-none d-xl-block">
              <a className="navbar-brand">
                <img
                  src={require("../../../assets/images/ringoLogo.png")}
                  className=""
                  alt="logo"
                  style={{ width: "96px", marginTop: "2px" }}
                />
              </a>
            </div>
            <div className="col-12 col-xl-11">
              <nav className="navbar navbar-expand-xl navbar-dark mb-0 ">
                <div
                  className="navbar-hamburgericon"
                  style={{ display: this.state.isOpen ? "block" : "none" }}
                >
                  <ul className="navbar-nav flex-row align-items-center">
                    {/* <div className="mt-0 navbar-user-crcl mr-2 d-block d-xl-none">
                                            <span className="txt-clr-blue" title={this.state.userInfo.userName}>{this.state.userInfo.userFullName.charAt(0)}</span>
                                        </div> */}

                    <div className="for-small-device d-block d-xl-none">
                      <UncontrolledDropdown nav inNavbar>
                        <div className="mt-0 navbar-user-crcl mr-2 d-block d-xl-none mt-1">
                          <span
                            className="txt-clr-blue"
                            title={this.state.userInfo.userName}
                          >
                            {this.state.userInfo.userFullName.charAt(0)}
                          </span>
                        </div>
                        <DropdownToggle
                          nav
                          caret
                          className={
                            "text-white ml-1 ml-sm-0 font-weight-normal user-role-style user-role-style-mobile"
                          }
                          title={
                            this.state.userInfo.userFullName +
                            " | " +
                            this.state.userInfo.role
                          }
                        >
                          {/* {this.state.userInfo.userFullName} | {this.state.userInfo.role} */}
                          {this.state.userInfo.userFullName.length > 15
                            ? this.state.userInfo.userFullName.substring(
                              0,
                              15
                            ) + "..."
                            : this.state.userInfo.userFullName}{" "}
                          |{" "}
                          {this.state.userInfo.role.length > 15
                            ? this.state.userInfo.role.substring(0, 15) + "..."
                            : this.state.userInfo.role}
                          {this.state.userInfo.isImpersonated && (
                            <div>
                              <div>
                                <span className="navbar-ringo navbar-ringo-ellipse">
                                  {this.state.userInfo.impersonatedFrom}{" "}
                                </span>
                                <span className="navbar-ringo-impersonated">
                                  Impersonated
                                </span>
                              </div>
                              <span>{""}</span>
                            </div>
                          )}
                        </DropdownToggle>
                        <DropdownMenu className="text-decoration-none dropdown-menu-logout dropdown-menu-logout-mobile">
                          {auth.hasPermissionV2(
                            AppPermissions.CAND_INTVW_SLOT_CREATE
                          ) && (
                              <DropdownItem>
                                <Link
                                  to={USER_CALENDAR_URL}
                                  className="text-dark pl-2"
                                >
                                  Set My Calendar
                                </Link>
                              </DropdownItem>
                            )}
                          <DropdownItem>
                            <Link
                              to={NOTIFICATION_SETTING}
                              className="text-dark pl-2"
                            >
                              My Notification
                            </Link>
                          </DropdownItem>
                          {auth.hasPermissionV2(
                            AppPermissions.EVENT_VIEW
                          ) && (
                              <DropdownItem>
                                <Link
                                  to={MANAGE_EVENTS_LOGS}
                                  className="text-dark pl-2"
                                >
                                Events Logs
                                </Link>
                              </DropdownItem>
                            )}
                          <DropdownItem>
                            <Link
                              to="/changepassword"
                              className="text-dark pl-2"
                            >
                              Change Password
                            </Link>
                          </DropdownItem>
                          {auth.hasPermissionV2(
                            AppPermissions.ADMIN_CAN_IMPERSONATE
                          ) &&
                            !this.state.userInfo.isImpersonated && (
                              <DropdownItem
                                onClick={() =>
                                  this.setState({ showImpersonateModal: true })
                                }
                              >
                                <a
                                  href="javascript:void(0)"
                                  className="text-dark font-medium pl-2"
                                >
                                  Impersonate
                                </a>
                              </DropdownItem>
                            )}
                          {this.state.userInfo.isImpersonated && (
                            <DropdownItem
                              onClick={() => this.onImpersonateExit()}
                            >
                              <a
                                href="javascript:void(0)"
                                className="text-dark font-medium pl-2"
                              >
                                Exit Impersonate
                              </a>
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>

                    <li className="d-none d-xl-none d-xl-none-navbar  d-none">
                      <a
                        className="nav-link text-white font-weight-normal font-medium"
                        href=""
                        title={
                          this.state.userInfo.userFullName +
                          " | " +
                          this.state.userInfo.role
                        }
                      >
                        {/* {this.state.userInfo.userFullName} */}
                        {this.state.userInfo.userFullName.length > 15
                          ? this.state.userInfo.userFullName.substring(0, 15) +
                          "..."
                          : this.state.userInfo.userFullName}{" "}
                        |{" "}
                        {this.state.userInfo.role.length > 15
                          ? this.state.userInfo.role.substring(0, 15) + "..."
                          : this.state.userInfo.role}
                        <div>
                          {this.state.userInfo.isImpersonated ? (
                            <div>
                              <span className="navbar-ringo navbar-ringo-ellipse">
                                {this.state.userInfo.impersonatedFrom}{" "}
                              </span>
                              <span className="navbar-ringo-impersonated">
                                Impersonated As
                              </span>
                            </div>
                          ) : (
                            <span>{""}</span>
                          )}
                        </div>
                        {/* <div>{this.state.userInfo.isImpersonated ? this.state.userInfo.impersonatedFrom + " Impersonated As " : ""}</div> */}
                      </a>
                    </li>
                  </ul>
                </div>
                <NavbarToggler onClick={this.toggle} className={"mr-2"} />
                <Collapse
                  className="flex-sm-row-reverse  longscreen"
                  id="navBarCollapseElem"
                  isOpen={this.state.isOpen}
                  navbar
                >
                  <ul className="navbar-nav mr-auto paddingtopnav paddingtopnav_new">
                    <UncontrolledDropdown
                      nav
                      inNavbar
                      className="coll-auto  pl-3 pl-sm-3 mb-md-0 mb-xl-auto pl-xl-auto dropdown nav-item"
                    >
                      <FontAwesomeIcon
                        icon={faHome}
                        className="d-xl-none active-icon icons-size-sm"
                      />
                      <span
                        onClick={() => this.updateMenuSelection("Home")}
                        className={
                          "nav-span nav-span-ipad " +
                          (this.state.activeHeader=="Home"
                            ? "dashboard-bl pl-xl-0 pr-xl-0"
                            : "")
                        }
                      >
                        <Link
                          to={APP_HOME_URL}
                          className="text-decoration-none"
                        >
                          <span className="navText fontSixteen">Home</span>
                        </Link>
                      </span>
                    </UncontrolledDropdown>

                    {menus &&
                      menus.map((parent, index) => (
                        <UncontrolledDropdown
                          nav
                          key={parent.menuId}
                          inNavbar
                          className="coll-auto  pl-3 pl-sm-3 pl-md-0 pl-xl-auto"
                        >
                          <DropdownToggle
                            nav
                            caret
                            className={
                              this.state.activeHeader ==
                                parent.name.replace(/\u21b5/g, "")
                                ? "navText dashboard-bl pl-xl-0 pr-xl-0"
                                : "navText pl-xl-0 pr-xl-0"
                            }
                          >
                            <i
                              data-attr={parent.name}
                              className="far fa-tachometer-slowest d-xl-none active-icon icons-size-sm"
                            ></i>
                            {/* <FontAwesomeIcon data-attr={parent.name} icon={faFileAlt} className="d-xl-none active-icon icons-size-sm"/> */}
                            <span className={"nav-span nav-span-ipad"}>
                              <span className="navText fontSixteen">
                                {parent.name}
                              </span>
                            </span>
                          </DropdownToggle>
                          <DropdownMenu
                            className="text-decoration-none timesheetMenu dropdown-menu-mobile dropdown-menu-right-submit-left scrollable-menu"
                            right
                          >
                            {parent.childMenus.map((child) =>
                              child.pageUrl ? (
                                <DropdownItem
                                  key={child.menuId}
                                  className="active-icon bg-active-sub-menu border-bottomm Charcoal-black scrollable-menu"
                                  tag={Link}
                                  to={child.pageUrl}
                                  onClick={() =>
                                    this.updateMenuSelection(parent.name)
                                  }
                                >
                                  <span className="ml-5 ml-xl-1 navChildSpan">
                                    {child.name}
                                  </span>
                                </DropdownItem>
                              ) : (
                                <UncontrolledDropdown
                                  key={child.menuId}
                                  inNavbar
                                  className="col-auto  pl-0 pl-sm-0 pl-md-0 pl-xl-auto pr-0"
                                >
                                  <DropdownToggle
                                    caret
                                    className="active-icon bg-active-sub-menu border-bottomm Charcoal-black scrollable-menu w-100 subMenu-btn"
                                  >
                                    <FontAwesomeIcon
                                      icon={faFileAlt}
                                      className="d-none active-icon icons-size-sm"
                                    />
                                    <span className={"nav-span nav-span-ipad"}>
                                      <span className="fontSixteen subMenu-btn-font-size">
                                        {child.name}
                                      </span>
                                    </span>
                                  </DropdownToggle>
                                  <DropdownMenu
                                    className="text-decoration-none timesheetMenu dropdown-menu-mobile dropdown-menu-right-submit-left scrollable-menu subChild-menu"
                                    right
                                  >
                                    {child.childMenus.map(
                                      (subChild) =>
                                        subChild.pageUrl && (
                                          <DropdownItem
                                            key={subChild.menuId}
                                            className="active-icon bg-active-sub-menu border-bottomm Charcoal-black scrollable-menu"
                                            tag={Link}
                                            to={subChild.pageUrl}
                                            onClick={() =>
                                              this.updateMenuSelection(
                                                parent.name
                                              )
                                            }
                                          >
                                            <span className="ml-5 ml-xl-1 navChildSpan">
                                              {subChild.name}
                                            </span>
                                          </DropdownItem>
                                        )
                                    )}
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                              )
                            )}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      ))}
                    <div className="horizontal-separator"></div>
                    {this.state.userClientLob.length > 0 ? (
                      <UncontrolledDropdown
                        nav
                        inNavbar
                        className="client-lob display-small"
                      >
                        <DropdownToggle
                          nav
                          caret
                          className={
                            "text-black ml-2 ml-sm-0 font-medium clientClick"
                          }
                          id="clientClickMobile"
                          title={this.state.fullClientNameWithLob}
                        >
                          {this.state.clientNameWithLob}
                        </DropdownToggle>
                        <DropdownMenu className="d-none text-decoration-none dropdown-menu-logout">
                          <DropdownToggle
                            expandMode="single"
                            onSelect={this.showConfirm}
                            // selected={this.state.selectedLobId}
                            selected={this.state.selectedLobName}
                          >
                            {this.state.userClientLob &&
                              this.state.userClientLob
                                .sort((a, b) =>
                                  a.name.toLowerCase() > b.name.toLowerCase()
                                    ? 1
                                    : b.name.toLowerCase() >
                                      a.name.toLowerCase()
                                      ? -1
                                      : 0
                                )
                                .map((parent) => (
                                  <PanelBarItem
                                    key={parent.id}
                                    parentUniquePrivateKey={[parent.id]}
                                    id={parent.id}
                                    title={
                                      parent.name.length > 24
                                        ? parent.name.substring(0, 24) + "..."
                                        : parent.name
                                    }
                                    className="parentClick"
                                  >
                                    {parent.lob
                                      .sort((a, b) =>
                                        a.name.toLowerCase() >
                                          b.name.toLowerCase()
                                          ? 1
                                          : b.name.toLowerCase() >
                                            a.name.toLowerCase()
                                            ? -1
                                            : 0
                                      )
                                      .map((child) => (
                                        <PanelBarItem
                                          customProp={{
                                            clientId: parent.id,
                                            clientName: parent.name,
                                          }}
                                          id={child.id}
                                          title={child.name}
                                          key={child.id}
                                          className={
                                            child.id ==
                                              this.state.selectedLobId
                                              ? "selected"
                                              : ""
                                          }
                                        />
                                      ))}
                                  </PanelBarItem>
                                ))}
                          </DropdownToggle>
                        </DropdownMenu>

                        <DropdownMenu className="text-decoration-none dropdownClientMenu dropdownClientMenu_arrow">
                          <PanelBar
                            expandMode="single"
                            onSelect={this.showConfirm}
                            // selected={this.state.selectedLobId}
                            selected={this.state.selectedLobName}
                          >
                            {this.state.userClientLob.length > 0 &&
                              this.state.userClientLob
                                .sort((a, b) =>
                                  a.name.toLowerCase() > b.name.toLowerCase()
                                    ? 1
                                    : b.name.toLowerCase() >
                                      a.name.toLowerCase()
                                      ? -1
                                      : 0
                                )
                                .map((parent) => (
                                  <PanelBarItem
                                    key={parent.id}
                                    parentUniquePrivateKey={[parent.id]}
                                    id={parent.id}
                                    title={parent.name}
                                    className="parentClick parentClick_cusror"
                                  >
                                    {parent.lob
                                      .sort((a, b) =>
                                        a.name.toLowerCase() >
                                          b.name.toLowerCase()
                                          ? 1
                                          : b.name.toLowerCase() >
                                            a.name.toLowerCase()
                                            ? -1
                                            : 0
                                      )
                                      .map((child) => (
                                        <PanelBarItem
                                          key={child.id}
                                          customProp={{
                                            clientId: parent.id,
                                            clientName: parent.name,
                                          }}
                                          id={child.id}
                                          title={child.name}
                                          className={`parentClick_childMenu cursor-pointer ${child.id ==
                                            this.state.selectedLobId
                                            ? "selected"
                                            : ""
                                            }`}
                                        />
                                      ))}
                                  </PanelBarItem>
                                ))}
                          </PanelBar>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    ) : (
                      <span className="no-client display-small">
                        {this.state.clientNameWithLob}
                      </span>
                    )}

                    {/* {auth.hasPermissionV2(AppPermissions.SUP_TKT_VIEW) && (
                      <Link
                        to={MANAGE_SUPPORT_TICKETS}
                        className="text-decoration-none pt-1"
                      >
                        <span className="navText fontSixteen">
                          <FontAwesomeIcon
                            icon={faQuestionCircle}
                            className="ml-1 ClockFontSize"
                          />
                        </span>
                      </Link>
                    )} */}

                  </ul>
                  <div className="nav-item nav-item-ipadd menuu-logo">
                    <a className="nav-link pl-2 d-block d-xl-none text-dark ">
                      <img
                        src={require("../../../assets/images/ringo_login.png")}
                        className=""
                        alt="logo"
                        style={{ width: "100px" }}
                      />
                    </a>
                  </div>
                </Collapse>
                <div
                  className="d-xl-none text-center nav-title-mobile"
                  style={{
                    display: this.state.isOpen ? "none" : "block",
                    width: "65%",
                  }}
                >
                  <span
                    className="font-weight-bold text-white d-block "
                    id="curPageTitle"
                  >
                    {this.props.CurrentPageName}
                  </span>
                  <span className="font-weight-bold text-white d-block font-exrtasmall">
                    {this.props.UserClientName}
                  </span>
                </div>

                <div className="d-xl-none " style={{ display: this.state.isOpen ? "none" : "block" }}>
                {auth.hasPermissionV2(AppPermissions.SUP_TKT_VIEW) && (
                    <Link
                      to={MANAGE_SUPPORT_TICKETS}
                      className="text-decoration-none pt-1 mr-1 supportIcon"
                    >
                      <span className="navText fontSixteen">
                        <FontAwesomeIcon
                          icon={faQuestion}
                          className="ml-1 ClockFontSize"
                          title="Customer Service Management"
                        />
                      </span>
                    </Link>
                  )}
                </div>

                <div
                  className="d-xl-none "
                  style={{
                    display: this.state.isOpen ? "none" : "block",
                    //width: "10%",
                  }}
                >
                  <a href="javascript:void(0)" onClick={this.logoutUser}>
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="text-white lead float-right signOut"
                    />
                  </a>
                </div>

                <div className="d-none d-xl-block col-auto ">
                  <div className="d-flex align-items-center ">
                    {auth.hasPermissionV2(AppPermissions.SUP_TKT_VIEW) && (
                      <Link
                        to={MANAGE_SUPPORT_TICKETS}
                        className="text-decoration-none pt-1 mr-2 supportIcon"
                      >
                        <span className="navText fontSixteen">
                          <FontAwesomeIcon
                            icon={faQuestion}
                            className="ml-1 ClockFontSize"
                            title="Customer Service Management"
                          />
                        </span>
                      </Link>
                    )}
                    
                    <ul className="navbar-nav  align-items-center">
                      <div className="mr-2">
                        {this.state.userInfo.isImpersonated ? (
                          <div>
                            <div className="navbar-ringo navbar-ringo-ellipse">
                              {this.state.userInfo.impersonatedFrom}{" "}
                            </div>
                            <div className="navbar-ringo-impersonated">
                              Impersonated As
                            </div>
                          </div>
                        ) : (
                          <span>{""}</span>
                        )}
                      </div>

                      {/* {this.state.userInfo.isImpersonated ? this.state.userInfo.impersonatedFrom + " Impersonated As " : ""} */}

                      <div className="navbar-user-crcl">
                        <span
                          className="text-center txt-clr-blue"
                          title={this.state.userInfo.userName}
                        >
                          {this.state.userInfo.userFullName
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div >
                        <UncontrolledDropdown nav inNavbar>
                          <DropdownToggle
                            nav
                            caret
                            className={
                              "text-white ml-2 ml-sm-0 font-weight-normal user-role-style"
                            }
                            title={
                              this.state.userInfo.userFullName +
                              " | " +
                              this.state.userInfo.role
                            }
                          >
                            {/* {this.state.userInfo.userFullName} | {this.state.userInfo.role} */}
                            {this.state.userInfo.userFullName.length > 15
                              ? this.state.userInfo.userFullName.substring(
                                0,
                                15
                              ) + "..."
                              : this.state.userInfo.userFullName}{" "}
                            |{" "}
                            {this.state.userInfo.role.length > 15
                              ? this.state.userInfo.role.substring(0, 15) + "..."
                              : this.state.userInfo.role}
                          </DropdownToggle>
                          <DropdownMenu className="text-decoration-none dropdown-menu-logout dropdown-menu-logout-dektop">
                            {auth.hasPermissionV2(
                              AppPermissions.CAND_INTVW_SLOT_CREATE
                            ) && (
                                <DropdownItem>
                                  <Link
                                    to={USER_CALENDAR_URL}
                                    className="text-dark"
                                  >
                                    Set My Calendar
                                  </Link>
                                </DropdownItem>
                              )}
                            <DropdownItem>
                              <Link
                                to={NOTIFICATION_SETTING}
                                className="text-dark"
                              >
                                My Notification
                              </Link>
                            </DropdownItem>
                            {auth.hasPermissionV2(
                            AppPermissions.EVENT_VIEW
                          ) && (
                              <DropdownItem>
                                <Link
                                  to={MANAGE_EVENTS_LOGS}
                                  className="text-dark"
                                >
                                Events Logs
                                </Link>
                              </DropdownItem>
                            )}
                            <DropdownItem>
                              <Link to="/changepassword" className="text-dark">
                                Change Password
                              </Link>
                            </DropdownItem>
                            {auth.hasPermissionV2(
                              AppPermissions.ADMIN_CAN_IMPERSONATE
                            ) &&
                              !this.state.userInfo.isImpersonated && (
                                <DropdownItem
                                  onClick={() =>
                                    this.setState({ showImpersonateModal: true })
                                  }
                                >
                                  <a
                                    href="javascript:void(0)"
                                    className="text-dark font-medium"
                                  >
                                    Impersonate
                                  </a>
                                </DropdownItem>
                              )}
                            {this.state.userInfo.isImpersonated && (
                              <DropdownItem
                                onClick={() => this.onImpersonateExit()}
                              >
                                <a
                                  href="javascript:void(0)"
                                  className="text-dark font-medium"
                                >
                                  Exit Impersonate
                                </a>
                              </DropdownItem>
                            )}
                            <DropdownItem onClick={this.logoutUser}>
                              <a
                                href="javascript:void(0)"
                                className="text-dark font-medium"
                              >
                                Logout
                              </a>
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                        {/* <span className="text-white ml-3 ml-sm-2 font-medium">{this.props.UserClientName}</span> */}
                        {this.state.userClientLob.length > 0 ? (
                          <UncontrolledDropdown
                            nav
                            inNavbar
                            className="client-lob"
                          >
                            <DropdownToggle
                              nav
                              caret
                              className={
                                "text-white ml-2 ml-sm-0 font-medium clientClick clientClickAnchor position-relative"
                              }
                              id="clientClick"
                              title={this.state.fullClientNameWithLob}
                            >
                              {this.state.clientNameWithLob}
                            </DropdownToggle>
                            <DropdownMenu className="text-decoration-none dropdownClientMenu dropdownClientMenu-desktop dropdownClientMenu_arrow">
                              <PanelBar
                                expandMode="single"
                                onSelect={this.showConfirm}
                                // selected={this.state.selectedLobId}
                                selected={this.state.selectedLobName}
                              >
                                {this.state.userClientLob.length > 0 &&
                                  this.state.userClientLob
                                    .sort((a, b) =>
                                      a.name.toLowerCase() > b.name.toLowerCase()
                                        ? 1
                                        : b.name.toLowerCase() >
                                          a.name.toLowerCase()
                                          ? -1
                                          : 0
                                    )
                                    .map((parent) => (
                                      <PanelBarItem
                                        key={parent.id}
                                        parentUniquePrivateKey={[parent.id]}
                                        id={parent.id}
                                        title={parent.name}
                                        className="parentClick parentClick_cusror"
                                      >
                                        {parent.lob
                                          .sort((a, b) =>
                                            a.name.toLowerCase() >
                                              b.name.toLowerCase()
                                              ? 1
                                              : b.name.toLowerCase() >
                                                a.name.toLowerCase()
                                                ? -1
                                                : 0
                                          )
                                          .map((child) => (
                                            <PanelBarItem
                                              key={child.id}
                                              customProp={{
                                                clientId: parent.id,
                                                clientName: parent.name,
                                              }}
                                              id={child.id}
                                              title={child.name}
                                              className={`parentClick_childMenu cursor-pointer ${child.id ==
                                                this.state.selectedLobId
                                                ? "selected"
                                                : ""
                                                }`}
                                            />
                                          ))}
                                      </PanelBarItem>
                                    ))}
                              </PanelBar>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        ) : (
                          <span className="no-client">
                            {this.state.clientNameWithLob}
                          </span>
                        )}
                      </div>
                      {/* <div className="d-flex align-items-center ">
                    {auth.hasPermissionV2(AppPermissions.SUP_TKT_VIEW) && (
                    <Link
                      to={MANAGE_SUPPORT_TICKETS}
                      className="text-decoration-none pt-1 mr-3 supportIcon"
                    >
                      <span className="navText fontSixteen">
                        <FontAwesomeIcon
                          icon={faQuestion}
                          className="ml-1 ClockFontSize"
                        />
                      </span>
                    </Link>
                  )}
                  </div> */}
                    </ul>
                  </div>
                </div>
                <ConfirmationModal
                  message={"Are you sure you want to change?"}
                  showModal={this.state.showModal}
                  handleYes={this.onSelectLob}
                  handleNo={() => {
                    this.setState({ showModal: false });
                  }}
                />
                {this.state.showImpersonateModal && (
                  <div id="impersonate-newpopup">
                    <Dialog>
                      <ImpersonatePopUp
                        onCloseModal={() =>
                          this.setState({ showImpersonateModal: false })
                        }
                        onOpenModal={() =>
                          this.setState({ showImpersonateModal: true })
                        }
                      />
                    </Dialog>
                  </div>
                )}
                
              </nav>              
            </div>
          </div>
        </div>
      </header>
      </>
    );
  }

  private toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
    setTimeout(() => {
      if (this.state.isOpen) {
        document.body.classList.add("body-scroll");
      } else {
        document.body.classList.remove("body-scroll");
      }
    }, 100);
  };

  private handleDocumentClick = (e) => {
    const container = this._documentRef;
    if (
      (e.target != container && !(container && container.contains(e.target))) ||
      (e.target.className.indexOf !=undefined && e.target.className.indexOf("navChildSpan") !=-1)
    ) {
      //this.toggle();
      var navCollapseElem = document.getElementById("navBarCollapseElem");
      if (navCollapseElem) {
        var navCollapseCls = navCollapseElem.classList;
        if (navCollapseCls.contains("show")) {
          this.toggle();
        }
      }
    }
    if (e.target.parentNode.classList.contains("parentClick_childMenu")) {
      this.setState({
        isOpen: false,
      });
    }
  };

  showConfirm = (e) => {
    if (e.target.props.parentUniquePrivateKey.length > 0) {
      this.event = e;
      this.setState({ showModal: true });
    }
  };

  onSelectLob = () => {
    let a = document.getElementsByClassName("show");
    if (a.length > 1) {
      a[1].classList.remove("show");
    }
    this.updateMenuSelection("Home")
    const e = this.event;
    if (e && e.target.props.parentUniquePrivateKey.length > 0) {
      this.setState({
        clientFullName: e.target.props.customProp.clientName,
        selectedLobName: e.target.props.title,
        selectedLobId: e.target.props.id,
        showModal: false,
      });
      // document.getElementById("clientClick").click();
      document.getElementById("clientClickMobile").click();
      //this.clientToggle();
      localStorage.setItem("UserClientId", e.target.props.customProp.clientId);
      localStorage.setItem("UserClient", e.target.props.customProp.clientName);
      localStorage.setItem("UserClientLobId", e.target.props.id);
      localStorage.setItem("UserClientLobName", e.target.props.title);
      this.setState({
        isOpen: !this.state.isOpen,
      });
      this.setDefaultClientUserLob(
        e.target.props.customProp.clientId,
        this.state.userInfo.userId,
        e.target.props.id
      );
    }
  };
  public componentWillMount() {
    document.addEventListener("click", this.handleDocumentClick, true);
    this.getUserClientLob(this.state.userInfo.userId);
  }

  public componentWillUnmount() {
    document.removeEventListener("click", this.handleDocumentClick, true);
  }

  public componentDidMount() {
    var pageUrl = window.location.pathname.split("/")[1];
    var navIndex = NavigationArray.findIndex(
      (n) => n.pageUrl==pageUrl.toLowerCase()
    );
    if (navIndex !=-1) {
      this.setState({
        activeHeader: NavigationArray[navIndex].parent,
      });
    }
    
  }
 

  public updateMenuSelection(parent) {

    let a = document.getElementsByClassName("show");
    if (a.length > 1) {
      a[1].classList.remove("show");
    } else if (a.length==1) {
      a[0].classList.remove("show");
    }
    this.setState({ pageTitle: document.title })

    this.setState({ activeHeader: parent });

    //localStorage.removeItem('GridDataState')
    //localStorage.removeItem('SearchData')
  }

  private logoutUser = () => {
    // auth.logout(() => {
    //   localStorage.clear();
    //   history.push(APP_HOME_URL);
    // });
    auth.logout(() => {
      const rememberMe = localStorage.getItem("rememberme");
      let user = auth.getUser()
      localStorage.clear();
      if (rememberMe) {
        if (user) {
          localStorage.setItem("rememberme", rememberMe);
          localStorage.setItem("userName", user.userName);
        }
      }
      // localStorage.clear();
      history.push(APP_HOME_URL);
    });
  };

  private getUserClientLob(userId) {
    const init = {
      method: "GET",
      accept: "application/json",
      headers: authHeader(),
    };
    Axios.get("api/accounts/internal/user/clientlob?Userid=" + userId).then(
      (response) => {
        console.log(response);
        if (response.data.clientLob.length==0) {
          this.setState({ clientNameWithLob: "No client associated" });
        } else {
          this.setState({
            userClientLob: response.data.clientLob,
            selectedLobId: response.data.selectedLobId,
            selectedLobName: response.data.defaultLobName,
            clientFullName: response.data.defaultClientName,
          });
          var clientName =
            this.state.clientFullName.length > 15
              ? this.state.clientFullName.substring(0, 15) + "..."
              : this.state.clientFullName;
          var lobName =
            this.state.selectedLobName.length > 15
              ? this.state.selectedLobName.substring(0, 15) + "..."
              : this.state.selectedLobName;
          this.setState({
            clientNameWithLob: clientName + " - " + lobName,
            fullClientNameWithLob:
              this.state.clientFullName + " - " + this.state.selectedLobName,
          });
        }
        localStorage.setItem("UserClientLob", JSON.stringify(response.data.clientLob));
        localStorage.setItem("UserClientId", response.data.defaultClientId);
        localStorage.setItem("UserClientIntId", response.data.defaultClientIntId);
        localStorage.setItem("UserClientLobId", response.data.selectedLobId);
        localStorage.setItem("UserClientLobName", response.data.defaultLobName);
      }
    );
  }

  private setDefaultClientUserLob(
    clientId: string,
    userId: string,
    lobId: string
  ) {
    const data = {
      clientId: clientId,
      userId: userId,
      selectedLobId: lobId,
    };
    Axios.put(
      "api/accounts/internal/user/clientlob",
      JSON.stringify(data)
    ).then((res) => {
      if (res.data) {
        this.getUserClientLob(this.state.userInfo.userId);
        // refresh token
        let user = JSON.parse(localStorage.getItem("user"));
        user.token = res.data.token;
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = window.location.href;
        // history.push(APP_HOME_URL);
      }
    });
  }

  public onImpersonateExit() {
    if (this.state.userInfo.isImpersonated) {
      const data = {
        fromUserId: this.state.userInfo.userId,
        toUserId: this.state.userInfo.impersonatedFromId,
        comment: "Impersonation exited",
      };
      Axios.post(
        "api/accounts/internal/user/exitimpersonate",
        JSON.stringify(data)
      ).then((res) => {
        showLoader();
        if (res.data) {
          let userInfo = res.data;
          auth.setUserContext(userInfo);
          window.location.href = "/";
        }
      });
    }
  }
}

export default connect(
  (state: ApplicationState) => state.global, // Selects which state properties are merged into the component's props
  GlobalStore.actionCreators // Selects which action creators are merged into the component's props
)(NavMenu as any);
