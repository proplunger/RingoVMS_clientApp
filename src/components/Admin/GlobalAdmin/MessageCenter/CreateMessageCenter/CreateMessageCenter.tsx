import * as React from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faTimesCircle, faTruckMonster, faUpload } from "@fortawesome/free-solid-svg-icons";
import { Form, Formik } from "formik";
import withValueField from "../../../../Shared/withValueField";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import Skeleton from "react-loading-skeleton";
import { filterBy } from "@progress/kendo-data-query";
import { ErrorComponent, convertShiftDateTime } from "../../../../ReusableComponents";
import { AuthRole, AuthRoleType, MessageStatus } from "../../../../Shared/AppConstants";
import { DateTimePicker, DateTimePickerChangeEvent } from '@progress/kendo-react-dateinputs';
import { dateFormatter, datetimeFormatter, errorToastr, history, localDateTime, successToastr } from "../../../../../HelperMethods";
import { messageValidation } from "./Validations/validation";
import globalAdminService from "../../../GlobalAdmin/Service/DataService";
import MessageCenterDataService from "../Service/DataService";
import { COMMUNICATION_CENTER } from "../../../../Shared/ApiUrls";
import { COMM_CENTER_CREATE_SUCCESS_MSG, COMM_CENTER_UPDATE_SUCCESS_MSG } from "../../../../Shared/AppMessages";
import CommonControl from "../../../../Shared/UserAndRoleControl/CommonControl";
import Collapsible from "react-collapsible";
import UploadDocuments from "../../../../Shared/UploadDocuments/UploadDocuments";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select..", id: null };

export enum ALLSELECTED {
    ALLUSERTYPE = "All User Type",
}

export interface CreateMessageCenterProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;

}

export interface CreateMessageCenterState {
    commCenterId?: string;
    msgPrioId?: string;
    msgCatId?: string;
    roleId?: string;
    submitted: boolean;
    showLoader?: boolean;
    roles: Array<any>;
    originalroles: Array<any>;
    message?: string;
    startDateTime: any;
    endDateTime: any;
    uploadFiles: any;
    clients?: any;
    clientIds: any;
    userTypes: any;
    userId?: string;
    selectedUserType: any;
    msgPriorityData: any;
    msgCategoryData: any;
    usersAndRoles: any;
    modifiedDate: any;
    status: string;
    toggelFirst: boolean;
    topic: string;
    isAllUserTypeSelected?: boolean;
    saveAndPublish?: boolean;
}

class CreateMessageCenter extends React.Component<CreateMessageCenterProps, CreateMessageCenterState> {
    public addressChild: any;
    public uploadDoc: any;
    public commonControl: any;
    constructor(props: CreateMessageCenterProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            commCenterId: id,
            submitted: false,
            showLoader: true,
            roles: [],
            originalroles: [],
            startDateTime: '',
            endDateTime: '',
            uploadFiles: [],
            clientIds: [],
            msgPriorityData: [],
            msgCategoryData: [],
            usersAndRoles: [],
            userTypes: [],
            modifiedDate: "",
            status: "",
            toggelFirst: true,
            topic: "",
            selectedUserType: []
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);

    }
    componentDidMount() {
        this.getClients();
        this.getUserType();
        this.getMsgCategory();
        this.getMsgPriority();
        if (this.state.commCenterId) {
            this.getMsgDetails(this.state.commCenterId);
        }
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

    saveCommCenter = () => {
        let data = {
            MsgId: this.state.commCenterId,
            title: this.state.topic,
            msgDesc: this.state.message,
            msgPrioId: this.state.msgPrioId,
            msgCatId: this.state.msgCatId,
            startDate: this.state.startDateTime ? datetimeFormatter(this.state.startDateTime) : null,
            endDate: datetimeFormatter(this.state.endDateTime),
            clientIds: this.state.clientIds.map(x => x.id),
            UsersRoles: JSON.stringify(this.state.usersAndRoles),
            userType: this.state.selectedUserType ? JSON.stringify(this.state.selectedUserType.filter(x => x.id != 9999)) : JSON.stringify([])
        };       

        data['statusId'] = 0

        if(this.state.saveAndPublish){
            data['statusId'] = 1
        }

        if (this.state.commCenterId) {
            const { commCenterId } = this.state;
            MessageCenterDataService.putCommCenter(commCenterId, data).then((res) => {
                successToastr(COMM_CENTER_UPDATE_SUCCESS_MSG);
                history.push(COMMUNICATION_CENTER);
            });

        } else {

            MessageCenterDataService.postCommCenter(data)
            // .then((res) => {
            .then((response) => response)
            .then((data) => {
                this.uploadDoc.uploadDocuments(data.data);
                successToastr(COMM_CENTER_CREATE_SUCCESS_MSG);
                history.push(COMMUNICATION_CENTER);
            });
        }
    }

    uploadFile = () => {
        this.setState({
            submitted: false,
        })
        document.getElementById('getFile').click()
    }

    handleUploadFiles = (files) => {
        const uploaded = [...this.state.uploadFiles]
        files.some((file) => {
            if (uploaded.findIndex((f) => f.name ==file.name) ==-1) {
                uploaded.push(file);
                this.setState({
                    uploadFiles: uploaded
                })
            }
        })
    }
    handleFile = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files)
        this.handleUploadFiles(chosenFiles);
    }

    deleteUploadedItem = (name) => {
        const list = [];
        this.state.uploadFiles.map((file, i) => {
            if (file.name != name) {
                list.push(file);
            }
        });
        this.setState({
            uploadFiles: list
        });
    }
    getClients = () => {
        MessageCenterDataService.getClients().then(async res => {
            this.setState({ clients: res.data }, () => {
                if (document.getElementsByName('startDateTime') && document.getElementsByName('startDateTime')[0]) {
                    document.getElementsByName('startDateTime')[0]['disabled'] = true;
                    document.getElementsByName('endDateTime')[0]['disabled'] = true;
                }
            });
        });
    }
    handleClientsChange = (e) => {
        var selectedUser = this.state.selectedUserType ? this.state.selectedUserType.filter(x => x.id !=9999).map(x => x.userTypeIntId): [];
        this.setState({ clientIds: e.value },
             () => {
                if(this.state.clientIds.length==0){
                    this.setState({ usersAndRoles: [] });
                    this.commonControl.handlePropObjChange();
                }else {
                    this.commonControl.getUserAndRoles(this.state.clientIds.map(x => x.id), selectedUser)
                }
            })
    }

    handleChange = (e) => {
        let { name, value } = e.target;
        this.state[name] = value;
        this.setState(this.state);
    };

    handleChangeUserType = (e) => {
        var isAllSelected = false;
        var selectedUserTypes = e.value.filter(
            (x) => x.id !=undefined && x.id !=null && x.id !=9999
        );
        let Id = selectedUserTypes.map((loc) => loc.id);    

        if (e.nativeEvent.target.innerText.trim() ==ALLSELECTED.ALLUSERTYPE
        || (e.nativeEvent.target.nextSibling !=null && e.nativeEvent.target.nextSibling.nextSibling !=null
        && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=null && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=undefined
        && e.nativeEvent.target.nextSibling.nextSibling.wholeText.trim() ==ALLSELECTED.ALLUSERTYPE)) {
            if (!this.state.isAllUserTypeSelected) {
                isAllSelected = true;
                var vendors = this.state.userTypes.filter(
                (x) => x.id !=undefined && x.id !=null && x.id !=9999
                );
                
                Id = vendors.map((x) => x.id);
                selectedUserTypes = this.state.userTypes;
            } else {
                selectedUserTypes = [];
                Id = null;
            }
        } else {
            if(selectedUserTypes.length==(this.state.userTypes.length - 1)){
                selectedUserTypes.unshift({ name: ALLSELECTED.ALLUSERTYPE, id: 9999 });
                isAllSelected = true;
            }
        }

        this.setState({
            selectedUserType: selectedUserTypes,
            isAllUserTypeSelected: isAllSelected
        })

        if(this.state.clientIds.length){
            var selectedUsers = selectedUserTypes.filter(x => x.id !=9999).map(x => x.userTypeIntId);
            this.commonControl.getUserAndRoles(this.state.clientIds.map(x => x.id), selectedUsers)
        }
        
    }

    getUserType() {
        MessageCenterDataService.getUserTypes()
            .then(async res => {
                res.data.unshift({ name: ALLSELECTED.ALLUSERTYPE, id: 9999 });
                this.setState({
                    userTypes: res.data,
                    showLoader: false,
                });

                if (this.state.selectedUserType){
                    this.setState({  
                        isAllUserTypeSelected: this.state.selectedUserType.length ==res.data.length - 1
                    })
                }
            });
    }
    getMsgPriority = () => {
        MessageCenterDataService.getMsgPriority()
            .then(async res => {
                this.setState({
                    msgPriorityData: res.data,
                })
            })
    }

    getMsgCategory = () => {
        MessageCenterDataService.getMsgCategory()
            .then(async res => {
                this.setState({
                    msgCategoryData: res.data,
                })
            })
    }
    getMsgDetails = (commCenterId: string) => {
        MessageCenterDataService.getCommCenterDetails(commCenterId).then((res) => {
            const { data } = res;
            this.setState({
                ...data,
                clientIds: data.clientIds,
                message: data.msgDesc,
                startDateTime: data.startDate && new Date(data.startDate),
                endDateTime: new Date(data.endDate),
                showLoader: false,
                usersAndRoles: JSON.parse(data.usersRoles),
                modifiedDate: new Date(data.modifiedDate),
                topic: data.title,
                selectedUserType: JSON.parse(data.userType)
            }, () => {
                this.getUserType();
                if(this.state.clientIds.length){
                    var selectedUsers = this.state.selectedUserType.filter(x => x.id !=9999).map(x => x.userTypeIntId)
                    this.commonControl.getUserAndRoles(this.state.clientIds.map(x => x.id), selectedUsers)
                }
            });
        });
    }

    itemRender = (li, itemProps) => {
        const itemChildren = (
          <span>
            <input
              type="checkbox"
              checked={itemProps.dataItem.name==ALLSELECTED.ALLUSERTYPE ? this.state.isAllUserTypeSelected :
                itemProps.selected}
              onChange={(e) => itemProps.onClick(itemProps.index, e)}
            />
            &nbsp;{li.props.children}
          </span>
        );
        return React.cloneElement(li, li.props, itemChildren);
    };

    handleObjChange = (change) => {
        this.setState(change);
    }

    render() {

        const messageTriggerName = (
            <span>
              Message Details
              <span
                className="d-none d-sm-block"
                style={{ float: "right", marginRight: "25px" }}
              >
                Status :  {this.state.commCenterId ? <span className="font-weight-bold"> {this.state.status} </span> : "Draft"}
              </span>
            </span>
        );

        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-8 fonFifteen paddingLeftandRight">
                            {/* {this.state.commCenterId ? "Edit" : "Add"} Message */}
                            <BreadCrumbs globalData={{messageId:this.state.commCenterId}}></BreadCrumbs>
                            </div>
                            <div className="col-4">
                            {this.state.commCenterId && 
                                <span className="float-right text-dark">
                                    Last Modified : {this.state.modifiedDate && dateFormatter(this.state.modifiedDate)} {this.state.modifiedDate && convertShiftDateTime(this.state.modifiedDate)}
                                </span>
                            }
                        </div>
                    </div>
                </div>
                <Formik
                    validateOnMount={this.state.submitted}
                    initialValues={this.state}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={messageValidation}
                    validateOnBlur={false}
                    onSubmit={(fields) => this.saveCommCenter()}
                    render={(formikProps) => (
                        <Form className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onChange={formikProps.handleChange}>
                            <Collapsible
                                trigger={messageTriggerName}
                                open={this.state.toggelFirst}
                                accordionPosition="1"
                                onTriggerOpening={() =>
                                this.setState({ toggelFirst: true })
                                }
                                onTriggerClosing={() =>
                                this.setState({ toggelFirst: false })
                                }
                            >
                                {this.state.showLoader &&
                                    Array.from({ length: 3 }).map((item, i) => (
                                        <div className="row mx-auto mt-2" key={i}>
                                            {Array.from({ length: 3 }).map((item, j) => (
                                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
                                                    <Skeleton width={100} />
                                                    <Skeleton height={30} />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                {!this.state.showLoader && (
                                    <div>
                                        <div className="row mx-auto">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-2">
                                                <label className="mb-1 font-weight-bold required">Message</label>
                                                <textarea
                                                    rows={3}
                                                    id=""
                                                    maxLength={2000}
                                                    value={this.state.message}
                                                    className="form-control mt-1"
                                                    placeholder="Enter Message"
                                                    onChange={(event) => {
                                                        this.setState({ message: event.target.value });
                                                    }}
                                                />
                                                {formikProps.errors.message && <ErrorComponent message={formikProps.errors.message} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-2">
                                                <label className="mb-1 font-weight-bold required">Topic</label>
                                                <input
                                                    type="text"
                                                    maxLength={60}
                                                    value={this.state.topic}
                                                    className="form-control mt-1"
                                                    placeholder="Enter Topic"
                                                    onChange={(event) => {
                                                        this.setState({ topic: event.target.value });
                                                    }}
                                                />
                                                {formikProps.errors.topic && <ErrorComponent message={formikProps.errors.topic} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-2">
                                                <label className="mb-1 font-weight-bold required">Priority</label>
                                                <CustomDropDownList
                                                    className={"form-control disabled "}
                                                    data={this.state.msgPriorityData}
                                                    textField="name"
                                                    valueField="msgPrioId"
                                                    name="name"
                                                    defaultItem={defaultItem}
                                                    value={this.state.msgPrioId}
                                                    onChange={(e) => this.setState({ msgPrioId: e.target.value })}
                                                />
                                                {formikProps.errors.msgPrioId && <ErrorComponent message={formikProps.errors.msgPrioId} />}
                                            </div>
                                        
                                            <div className="col-12 col-sm-4 col-lg-4 mt-3">
                                                <label className="mb-1 font-weight-bold required">Category</label>
                                                <CustomDropDownList
                                                    className={"form-control disabled "}
                                                    data={this.state.msgCategoryData}
                                                    textField="name"
                                                    valueField="msgCatId"
                                                    name="name"
                                                    defaultItem={defaultItem}
                                                    value={this.state.msgCatId}
                                                    onChange={(e) => this.setState({ msgCatId: e.target.value })}
                                                />
                                                {formikProps.errors.msgCatId && <ErrorComponent message={formikProps.errors.msgCatId} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-3">
                                                <label className="mb-1 font-weight-bold">Start Date</label>
                                                <DateTimePicker
                                                    className="form-control"
                                                    formatPlaceholder="formatPattern"
                                                    format="MM/dd/yyyy hh:mm aa"
                                                    value={this.state.startDateTime}
                                                    name="startDateTime"
                                                    onChange={(e) => this.setState({ startDateTime: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-3">
                                                <label className="mb-1 font-weight-bold required">End Date</label>
                                                <DateTimePicker
                                                    className="form-control"
                                                    formatPlaceholder="formatPattern"
                                                    format="MM/dd/yyyy hh:mm aa"
                                                    value={this.state.endDateTime}
                                                    name="endDateTime"
                                                    onChange={(e) => this.setState({ endDateTime: e.target.value })}
                                                    min={this.state.startDateTime ? this.state.startDateTime : undefined}
                                                />
                                                {formikProps.errors.endDateTime && <ErrorComponent message={formikProps.errors.endDateTime} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-3 area-merged multiselect">
                                                <label className="mb-1 font-weight-bold">Clients</label>
                                                <MultiSelect
                                                    className="form-control disabled"
                                                    textField="client"
                                                    dataItemKey="id"
                                                    data={this.state.clients}
                                                    name="client"
                                                    value={this.state.clientIds}
                                                    onChange={(e) => this.handleClientsChange(e)}
                                                    placeholder="Select Clients..."
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-3">
                                                <label className="mb-1 font-weight-bold">User Type</label>
                                                <MultiSelect
                                                    className={"form-control disabled "}
                                                    data={this.state.userTypes}
                                                    textField="name"
                                                    dataItemKey="id"
                                                    id="userType"
                                                    name="userType"
                                                    placeholder="Select User Type"
                                                    value={this.state.selectedUserType && this.state.selectedUserType.filter((x) => x.id !=9999 )}
                                                    onChange={(e) => this.handleChangeUserType(e)}
                                                    itemRender={this.itemRender}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-3 common-control_padding">
                                                <label className="mb-1 font-weight-bold">Users & Roles</label>
                                                <CommonControl
                                                    disabled={this.state.clientIds.length ==0}
                                                    ref={(instance) => {
                                                        this.commonControl = instance;
                                                    }}
                                                    value={this.state.usersAndRoles}
                                                    id="usersAndRoles"
                                                    handleChange={this.handleChange}
                                                    handleObjChange={this.handleObjChange}
                                                />
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-3">
                                                <UploadDocuments
                                                    ref={(instance) => {
                                                        this.uploadDoc = instance;
                                                    }}
                                                    entityId={this.state.commCenterId}
                                                    entityName= {"CommunicationCenter"}
                                                    fieldName= {"Attach Files"}
                                                />
                                            </div>

                                        </div>

                                    </div>

                                )}
                            </Collapsible>
                            <div className="modal-footer justify-content-center border-0 mt-2">
                                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                    <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                        <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                    </button>
                                    <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true, saveAndPublish: false })}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                    </button>
                                    {!this.state.showLoader && this.state.status !=MessageStatus.PUBLISHED && 
                                        <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true, saveAndPublish: true })}>
                                            <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save And Publish
                                        </button>
                                    }
                                </div>
                            </div>
                        </Form>
                    )}

                />

            </div >
        )

    }



}
export default CreateMessageCenter;