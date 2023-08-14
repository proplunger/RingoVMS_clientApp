import { faCheckCircle, faChevronCircleDown, faChevronCircleUp, faSave, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ClientAdminDataService from '../Service/DataService'
import { history, successToastr } from "../../../../HelperMethods";
import CollapsibleComponent from "./CollapsibleComponent";
import auth from "../../../Auth";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { NOTIFICATION_SETTINGS_UPDATE_SUCCESS_MSG, SAVE_CLIENT_SETTING_CONFIRMATION_MSG } from "../../../Shared/AppMessages";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import BreadCrumbs from "../../../Shared/BreadCrumbs/BreadCrumbs";

export interface NotificationSettingsProps {
    match: any;
 }
export interface NotificationSettingsState {
    data?: any;
    toggelFirst?: any;
    saveDisabled?: boolean;
    toggleAll?: boolean;
    toggleItem?: boolean;
    userId: any;
    clientId?: any;
    showConfirmationModal: boolean
    showLoader?: boolean;
}

export default class NotificationSettings extends React.Component<NotificationSettingsProps, NotificationSettingsState> {
    changedData;
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    constructor(props) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            toggelFirst: true,
            saveDisabled: true,
            toggleAll: false,
            toggleItem: true,
            userId: id ? id : this.userObj.userId,
            clientId: auth.getClient(),
            showConfirmationModal: false,
            data: []
        };
        this.changedData = [];
    }

    componentDidMount() {
        this.getNotifications(this.state.userId);
    }

    getNotifications = (userId) => {

        this.setState({ showLoader: true })
        ClientAdminDataService.getNotificationSetting(userId)
            .then((res) =>
                this.setState({
                    data: res.data,
                    showLoader: false
                })
            )
    };

    handleChange = (dataValue, field) => {
        this.setState({ saveDisabled: false })
        let changedFieldValue = dataValue[field]==true ? false : true;
        let changedData = {
            key: dataValue.id,
            values: { [field]: changedFieldValue }
        }
        let newDataCheck = this.changedData.filter(i => i.key==dataValue.id)
        if (newDataCheck.length > 0) {
            this.changedData.map(i => i.key==dataValue.id ? Object.assign(i.values, { [field]: changedFieldValue }) : i)
        } else {
            this.changedData.push(changedData)
        }
    }

    SaveSettings = () => {
        let settings = JSON.parse(JSON.stringify(this.changedData));
        settings.forEach(setting => {
            setting.values = JSON.stringify(setting.values);
        });
        let data = {
            data: settings
        }
        ClientAdminDataService.patchNotificationSetting(data, this.userObj.userId)
            .then(() => {
                successToastr(NOTIFICATION_SETTINGS_UPDATE_SUCCESS_MSG);
                //this.getNotifications(this.userObj.userId);
                history.goBack();
                this.setState({ showConfirmationModal: false })
            }
            )
    }

    onCollapseClose = () => {
        this.setState({ toggleAll: false, toggleItem: false });
    }

    onCollapseOpen = () => {

        this.setState({ toggleAll: true, toggleItem: false });
    }

    render() {
        const { toggelFirst, data, toggleAll } = this.state;
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3">
                <div className="col-12 p-10 shadow pt-1 pb-1">
                    <div className="col-12 px-0">
                        <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                            <div className="col-8 col-md-8 fonFifteen paddingLeftandRight">
                                <div className="d-none d-md-block">
                                    <BreadCrumbs></BreadCrumbs>
                                      </div>
                            </div>
                            <div className="col-4 col-md-4 text-right mt-sm-1 mt-md-0 txt-orderno text-underline paddingRight d-flex align-items-center justify-content-end">
                                {
                                    toggleAll ? (
                                        <FontAwesomeIcon
                                            className="ml-2 mt-1 text-primary collapseExpandIcon globalExpandCursor"
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
                    {this.state.showLoader ? <div><Skeleton /> <Skeleton /> <Skeleton /> </div> : data &&
                        data.map((i, index) => (
                            <CollapsibleComponent data={i} handleChange={this.handleChange} toggleAll={toggleAll} toggleItem={this.state.toggleItem} index={index} />
                        ))}
                    <div className="row mb-2 mb-lg-4 ml-sm-0 mr-sm-0">
                        <div className="col-12 mt-5 text-sm-center text-center font-regular">

                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />
                                    Close
                                </button>
                            {(
                                <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" disabled={this.state.saveDisabled} onClick={(e) => this.setState({ showConfirmationModal: true })}>
                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                </button>
                            )}

                        </div>
                    </div>
                </div>
                <ConfirmationModal
                    message={SAVE_CLIENT_SETTING_CONFIRMATION_MSG()}
                    showModal={this.state.showConfirmationModal}
                    handleYes={() => this.SaveSettings()}
                    handleNo={() => {
                        this.setState({ showConfirmationModal: false });
                    }}
                />
            </div>

        );
    }
}