import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faChevronCircleDown, faChevronCircleUp, faSave, faTimesCircle, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { errorToastr, history, successToastr } from "../../../../../HelperMethods";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../../../Shared/withValueField";
import GlobalService from '../../Service/DataService'
import axios from "axios";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import { filterBy } from "@progress/kendo-data-query";
import { Form, Formik } from "formik";
import { notificationTemplateValidation } from "./validations/validation";
import { ErrorComponent } from "../../../../ReusableComponents";
import { Editor } from "react-editor";
import CommonControl from "../../../../Shared/UserAndRoleControl/CommonControl";
import { GLOBAL_NOTIFICATION_CREATE_SUCCESS_MSG, GLOBAL_NOTIFICATION_UPDATE_SUCCESS_MSG } from "../../../../Shared/AppMessages";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select...", id: null };

export interface CreateNotificationTemplateProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateNotificationTemplateState {
    notificationTemplateId?: string;
    notificationTypeId?: string;
    notificationType: Array<IDropDownModel>;
    originalnotificationType: Array<IDropDownModel>;
    notificationMediumId?: string;
    notificationMedium: Array<IDropDownModel>;
    originalnotificationMedium: Array<IDropDownModel>;
    body?: any;
    subject?: any;
    distributionType?: any;
    to: any;
    cc: any;
    bcc: any;
    submitted: boolean;
    toggleAll: boolean;
    showLoader?: boolean;
    toggleFirst: boolean;
    toggleSecond: boolean;
    //toggleThird: boolean;
    isDirty?: boolean;
}

class CreateNotificationTemplate extends React.Component<CreateNotificationTemplateProps, CreateNotificationTemplateState> {
    public commonControl: any;
    public mailBody: any;
    constructor(props: CreateNotificationTemplateProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            notificationTemplateId: id,
            notificationType: [],
            originalnotificationType: [],
            notificationMedium: [],
            originalnotificationMedium: [],
            distributionType: "1",
            to: [],
            cc: [],
            bcc: [],
            submitted: false,
            toggleAll: false,
            toggleFirst: true,
            toggleSecond: true,
            //toggleThird: true,
            showLoader: true,
            isDirty: false,
        };
    }

    componentDidMount() {
        if (this.state.notificationTemplateId) {
            this.getNotificationTemplateDetail(this.state.notificationTemplateId);
        }
        this.getNotificationType();
        this.getNotificationMedium();
    }

    getNotificationType = () => {
        let queryParams = `$orderby=name`;
        GlobalService.getNotificationType(queryParams).then(async res => {
            this.setState({
                notificationType: res.data,
                originalnotificationType: res.data
            });
        });
    }

    getNotificationMedium = () => {
        let queryParams = `$orderby=name`;
        GlobalService.getNotificationMedium(queryParams).then(async res => {
            this.setState({
                notificationMedium: res.data,
                originalnotificationMedium: res.data
            });
        });
    }

    handleDropdownChange = (e) => {
        let change = { isDirty: true };
        change[e.target.props.name] = e.target.value;
        this.setState(change);
    }

    saveNotification(isSubmit: boolean) {
        let data = {
            notificationTemplateId: this.state.notificationTemplateId,
            notificationTypeId: this.state.notificationTypeId,
            notificationMediumId: this.state.notificationMediumId,
            subject: this.state.subject,
            body: this.state.body,
            distributionType: this.state.distributionType,
            to: JSON.stringify(this.state.to),
            cc: JSON.stringify(this.state.cc),
            bcc: JSON.stringify(this.state.bcc)
        };
        data["isSubmit"] = isSubmit;

        if (this.state.notificationTemplateId) {
            const { notificationTemplateId } = this.state;
            GlobalService.putNotificationTemplate(notificationTemplateId, data).then((res) => {
                successToastr(GLOBAL_NOTIFICATION_CREATE_SUCCESS_MSG);
                history.goBack();
            });
        } 
        // else {
        //     GlobalService.postNotificationTemplate(data).then((res) => {
        //         successToastr(GLOBAL_NOTIFICATION_UPDATE_SUCCESS_MSG);
        //         history.goBack();
        //     });
        // }
    }

    getNotificationTemplateDetail = (notificationTemplateId) => {
        GlobalService.getNotificationTemplateDetail(notificationTemplateId).then(async res => {
            const { data } = res;
            this.setState({
                notificationTypeId: data.notificationTypeId,
                notificationMediumId: data.notificationMedId,
                subject: data.subject,
                body: data.body,
                distributionType: data.emailDistType,
                to: JSON.parse(data.to),
                cc: JSON.parse(data.cc),
                bcc: JSON.parse(data.bcc),
            })

            var previewData = data.body.concat(data.footer);
            document.getElementById('mailBody').innerHTML = previewData
            const body = document.getElementById('mailBody').innerText; 
            this.mailBody = encodeURIComponent(body);
        });
    }

    handleFilterChange(event) {
        var name = event.target.props.id;
        var originalArray = "original" + name;
        this.state[name] = this.filterData(event.filter, originalArray);
        this.setState(this.state);
    }

    filterData(filter, originalArray) {
        const data1 = this.state[originalArray];
        return filterBy(data1, filter);
    }

    onCollapseOpen = () => {
        this.setState({
            toggleAll: true,
            toggleFirst: true,
            toggleSecond: true,
            //toggleThird: true,
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggleAll: false,
            toggleFirst: false,
            //toggleThird: false,
            toggleSecond: false,
        });
    };

    handleChange = (e) => {
        let { name, value } = e.target;
        this.state[name] = value;
        this.setState(this.state);
    }

    render() {
        const {
            notificationTemplateId,
            notificationTypeId,
            notificationMediumId,
            toggleAll,
            toggleFirst,
            toggleSecond,
            to,
            cc,
            bcc
            //toggleThird,
        } = this.state;

        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-10 col-md-10 fonFifteen paddingLeftandRight">
                            <div className="d-none d-md-block">
                                {/* {this.state.notificationTemplateId ? "Edit" : "Add New"} Notification */}
                                <BreadCrumbs globalData={{notificationId:this.state.notificationTemplateId}}></BreadCrumbs>
                            </div>
                        </div>

                        <div className="col-2 col-md-2 text-right mt-sm-1 mt-md-0 txt-orderno text-underline paddingRight d-flex align-items-center justify-content-end ">
                            {(toggleFirst && toggleSecond) ||
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

                <Formik
                    validateOnMount={this.state.submitted}
                    initialValues={this.state}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={notificationTemplateValidation}
                    validateOnBlur={false}
                    onSubmit={(fields) => this.saveNotification(true)}
                    render={(formikProps) => (
                        <Form className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onChange={formikProps.handleChange}>
                            <Collapsible
                                trigger={"Details"}
                                open={toggleFirst}
                                accordionPosition="1"
                                onTriggerOpening={() => this.setState({ toggleFirst: true })}
                                onTriggerClosing={() => this.setState({ toggleFirst: false })}
                            >
                                <div className="row mt-2">
                                    <div className="col-12 col-sm-4 col-lg-2">
                                        <label className="font-weight-bold required">Notification Type</label>
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4">
                                        <CustomDropDownList
                                            className={"form-control disabled"}
                                            disabled={notificationTemplateId ? true : false}
                                            data={this.state.notificationType}
                                            name="notificationTypeId"
                                            textField="name"
                                            valueField="notificationTypeId"
                                            id="notificationType"
                                            defaultItem={defaultItem}
                                            value={notificationTypeId}
                                            onChange={(e) => this.handleDropdownChange(e)}
                                            filterable={this.state.originalnotificationType.length > 5 ? true : false}
                                            onFilterChange={this.handleFilterChange}
                                        />
                                        {formikProps.errors.notificationTypeId && (
                                            <ErrorComponent
                                                message={formikProps.errors.notificationTypeId}
                                            />
                                        )}
                                    </div>

                                    <div className="col-12 col-sm-4 col-lg-2">
                                        <label className="font-weight-bold required">Notification Channel</label>
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4">
                                        <CustomDropDownList
                                            className={"form-control disabled"}
                                            disabled={notificationTemplateId ? true : false}
                                            data={this.state.notificationMedium}
                                            name="notificationMediumId"
                                            textField="name"
                                            valueField="notificationMediumId"
                                            id="notificationMedium"
                                            defaultItem={defaultItem}
                                            value={notificationMediumId}
                                            onChange={(e) => this.handleDropdownChange(e)}
                                            filterable={this.state.originalnotificationMedium.length > 5 ? true : false}
                                            onFilterChange={this.handleFilterChange}
                                        />
                                        {formikProps.errors.notificationMediumId && (
                                            <ErrorComponent
                                                message={formikProps.errors.notificationMediumId}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-sm-4 col-lg-2">
                                        <label className="font-weight-bold required">Subject</label>
                                    </div>
                                    <div className="col-12 col-sm-8 col-lg-4">
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Enter Subject"
                                                value={this.state.subject}
                                                maxLength={2000}
                                                onChange={(event) => {
                                                    this.setState({ subject: event.target.value });
                                                }}
                                            />
                                            {formikProps.errors.subject && (
                                                <ErrorComponent
                                                    message={formikProps.errors.subject}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-4 col-lg-2">
                                        <label className="font-weight-bold required">Email Distribution Type</label>
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4">
                                        <div className="row mx-0">
                                            <div className="d-flex flex-column pt-2 w-100">
                                                <label className="container container_checkboxandradio radioBtnCustom font-weight-normal col-auto ml-0 mr-0 mb-2">
                                                    <input
                                                        type="radio"
                                                        value="1"
                                                        name="distType"
                                                        onChange={(event) => {
                                                            this.setState({ distributionType: event.target.value });
                                                        }}
                                                        checked={this.state.distributionType==1 ? true : false}
                                                    />
                                                    Group (Send email to all recipients as a group)
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="container container_checkboxandradio radioBtnCustom font-weight-normal col-auto ml-0 mr-0 mb-0">
                                                    <input
                                                        type="radio"
                                                        value="2"
                                                        name="distType"
                                                        onChange={(event) => {
                                                            this.setState({ distributionType: event.target.value });
                                                        }}
                                                        checked={this.state.distributionType==2 ? true : false}
                                                    />
                                                    Individual (Send email to individual recipients)
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                            <div className="d-block w-100">
                                            {formikProps.errors.distributionType && (
                                                <ErrorComponent
                                                    message={formikProps.errors.distributionType}
                                                />
                                            )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-12 col-sm-4 col-lg-2">
                                        <label className="font-weight-bold required">Body</label>
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4 email-template">
                                        <div>
                                            <Editor
                                                style={{ "height": "200px" }}
                                                placeholder="Enter Body"
                                                className="form-control text-editor"
                                                value={this.state.body}
                                                name="body"
                                                onChange={(event) => {
                                                    this.setState({ body: event });
                                                }}
                                            />
                                            {formikProps.errors.body && (
                                                <ErrorComponent
                                                    message={formikProps.errors.body}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-6 d-flex justify-content-start align-items-end pl-0"> 
                                        <p className="mb-0 font-weight-extra-bold text-blue"><a className="text-blue" href={`mailto: ?Subject=${this.state.subject}&body=${this.mailBody}`}>(Preview)</a></p>
                                    </div>
                                </div>
                                <div id= "mailBody"></div>
                            </Collapsible>

                            <Collapsible
                                trigger="Audience"
                                open={toggleSecond}
                                onTriggerOpening={() => this.setState({ toggleSecond: true })}
                                onTriggerClosing={() => this.setState({ toggleSecond: false })}
                            >
                                <div className="row mt-2">
                                    <div className="col-12 col-sm-4 col-lg-2">
                                        <label className="font-weight-bold required">To</label>
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4">
                                        <div className="row">
                                            <CommonControl
                                                value={to}
                                                id="to"
                                                handleChange={this.handleChange}
                                                submitted={this.state.submitted}
                                                errorData={this.state.to}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-sm-4 col-lg-2">
                                        <label className="font-weight-bold required">CC</label>
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4">
                                        <div className="row">
                                            <CommonControl
                                                value={cc}
                                                id="cc"
                                                handleChange={this.handleChange}
                                                submitted={this.state.submitted}
                                                errorData={this.state.cc}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-12 col-sm-4 col-lg-2">
                                        <label className="font-weight-bold required">BCC</label>
                                    </div>
                                    <div className="col-12 col-sm-4 col-lg-4">
                                        <div className="row">
                                            <CommonControl
                                                value={bcc}
                                                id="bcc"
                                                handleChange={this.handleChange}
                                                submitted={this.state.submitted}
                                                errorData={this.state.bcc}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Collapsible>

                            {/* <Collapsible
                                //lazyRender={true}
                                trigger="Setting"
                                open={toggleThird}
                                onTriggerOpening={() => this.setState({ toggleThird: true })}
                                onTriggerClosing={() => this.setState({ toggleThird: false })}
                            >
                                <div className="row mt-2">
                                    <div className="col-12 col-sm-4 col-lg-2">
                                        <label className="mb-1 font-weight-bold required">Email Distribution Type</label>
                                            <div className="d-flex pt-2">
                                                <label className="container container_checkboxandradio radioBtnCustom font-weight-normal col-auto ml-0 mr-0">
                                                    <input 
                                                        type = "radio" 
                                                        value = "1" 
                                                        name = "distType"
                                                        onChange ={(event) => {
                                                            this.setState({ distributionType: event.target.value });
                                                        }}
                                                     /> 
                                                     Common
                                                    <span className="checkmark"></span>
                                                </label>
                                                <label className="container container_checkboxandradio radioBtnCustom font-weight-normal col-auto ml-0 mr-0">
                                                    <input
                                                        type = "radio" 
                                                        value = "2" 
                                                        name = "distType" 
                                                        onChange ={(event) => {
                                                            this.setState({ distributionType: event.target.value });
                                                        }}
                                                    /> 
                                                    Individual
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                            {formikProps.errors.distributionType && (
                                                <ErrorComponent
                                                    message={formikProps.errors.distributionType}
                                                />
                                            )}
                                    </div>
                                </div>
                            </Collapsible> */}

                            <div className="modal-footer justify-content-center border-0">
                                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                    <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                        <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                    </button>
                                    <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true })}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                />
            </div>
        );
    }
}

export default CreateNotificationTemplate;