import React from 'react';
import { faArchive, faCheckCircle, faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { DropDownList, MultiSelect } from '@progress/kendo-react-dropdowns';
import { Form, Formik } from 'formik';
import Collapsible from 'react-collapsible';
import Skeleton from 'react-loading-skeleton';
import { dateFormatter, history, localDateTime, successToastr, warningToastr } from "../../../HelperMethods";
import { convertShiftDateTime, ErrorComponent } from '../../ReusableComponents';
import { ContentLibStatus, EntityTypeId } from '../../Shared/AppConstants';
import CommonControl from '../../Shared/UserAndRoleControl/CommonControl';
import withValueField from '../../Shared/withValueField';
import { contentLibValidation } from './Validations/Validation';
import contentLibraryDataService from "../Services/DataService";
import TagControl from '../../Shared/TagControl/TagControl';
import { MANAGE_CONTENT_LIBRARY } from '../../Shared/ApiUrls';
import { ARCHIVE_CONTENT_LIB_CONFIRMATION_MSG, CONTENT_LIB_ARCHIVE_SUCCESS_MSG, CONTENT_LIB_CREATED_SUCCESS_MSG, CONTENT_LIB_PUBLISH_SUCCESS_MSG, CONTENT_LIB_UPDATED_SUCCESS_MSG, DOC_ERROR_MSG, DOC_LENGTH_ERROR_MSG, PUBLISH_CONTENT_LIB_CONFIRMATION_MSG } from '../../Shared/AppMessages';
import UploadDocuments from '../../Shared/UploadDocuments/UploadDocuments';
import { IDropDownModel } from '../../Shared/Models/IDropDownModel';
import { filterBy } from '@progress/kendo-data-query';
import BreadCrumbs from '../../Shared/BreadCrumbs/BreadCrumbs';
import ConfirmationModal from '../../Shared/ConfirmationModal';

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select..", id: null };

export enum ALLSELECTED {
    ALLUSERTYPE = "All User Type",
}

export interface CreateContentLibraryProps {
    props: any;
    match: any;
}

export interface CreateContentLibraryState {
    contentLibId: string;
    title: string;
    contentType: any;
    originalcontentType: Array<IDropDownModel>;
    contentTypeId?: string;
    description: string;
    expDate: any;
    clients: any;
    selectedClients: any;
    clientIds: any;
    userType: any;
    userTypeId?: any;
    usersAndRoles: any;
    userTypes: any;
    selectedUserType: any;
    isAllUserTypeSelected?: boolean;
    status?: string;
    statusIntId?: any;
    modifiedDate?: any;
    saveAndPublish?: boolean;
    isUpdate?: boolean;
    isDirty?: boolean;
    toggelFirst: boolean;
    toggelSecond: boolean;
    showLoader: boolean;
    showPublishModal?: boolean;
    showArchiveModal?: boolean;
    submitted: boolean;
}

class CreateContentLibrary extends React.Component<CreateContentLibraryProps, CreateContentLibraryState>{
    public tagRef;
    public uploadDoc: any;
    public commonControl: any;
    constructor(props: CreateContentLibraryProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            contentLibId: id,
            toggelFirst: true,
            toggelSecond: true,
            showLoader: true,
            submitted: false,
            isDirty: false,
            title: "",
            contentType: [],
            originalcontentType: [],
            description: "",
            expDate: "",
            clients: [],
            selectedClients: [],
            userType: [],
            usersAndRoles: [],
            userTypes: [],
            selectedUserType: [],
            clientIds: [],
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.getContentType();
        this.getClients();
        this.getUserType();
        if (this.state.contentLibId) {
            this.getContentLibDetails(this.state.contentLibId);
        }
    }

    getContentType = () => {
        contentLibraryDataService.getContentType().then(async (res) => {
            this.setState({
                contentType: res.data,
                originalcontentType: res.data,
                showLoader: false,
            }, () => {
                if (document.getElementsByName('expDate')) {
                    document.getElementsByName('expDate')[0]['disabled'] = true;
                }
            });
        });
    };

    handleDropdownChange = (e) => {
        let change = { isDirty: true };
        change[e.target.props.name] = e.target.value;
        this.setState(change);
    }

    getClients = () => {
        contentLibraryDataService.getClients().then((res) => {
            this.setState({
                clients: res.data,
                showLoader: false,
            });
        });
    }

    handleClientsChange = (e) => {
        var selectedUser = this.state.selectedUserType ? this.state.selectedUserType.filter(x => x.id !=9999).map(x => x.userTypeIntId) : [];
        this.setState({ clientIds: e.value, selectedClients: e.value },
            () => {
                if (this.state.clientIds.length==0) {
                    this.setState({ usersAndRoles: [] });
                    this.commonControl.handlePropObjChange();
                } else {
                    this.commonControl.getUserAndRoles(this.state.clientIds.map(x => x.id), selectedUser)
                }
            })
    }

    getUserType() {
        contentLibraryDataService.getUserType()
            .then(async res => {
                res.data.unshift({ name: ALLSELECTED.ALLUSERTYPE, id: 9999 });
                this.setState({
                    userTypes: res.data,
                    showLoader: false,
                });

                if (this.state.selectedUserType) {
                    this.setState({
                        isAllUserTypeSelected: this.state.selectedUserType.length ==res.data.length - 1
                    })
                }
            });
    }

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
            if (selectedUserTypes.length==(this.state.userTypes.length - 1)) {
                selectedUserTypes.unshift({ name: ALLSELECTED.ALLUSERTYPE, id: 9999 });
                isAllSelected = true;
            }
        }

        this.setState({
            selectedUserType: selectedUserTypes,
            isAllUserTypeSelected: isAllSelected
        })

        if (this.state.clientIds.length) {
            var selectedUsers = selectedUserTypes.filter(x => x.id !=9999).map(x => x.userTypeIntId);
            this.commonControl.getUserAndRoles(this.state.clientIds.map(x => x.id), selectedUsers)
        }
    }

    saveContent = (isSubmit: boolean) => {
        let isValid = this.checkValidations();
        if (isValid) {
            let data = {
                contentLibId: this.state.contentLibId,
                title: this.state.title,
                description: this.state.description,
                contentTypeId: this.state.contentTypeId,
                validTo: this.state.expDate !=null && this.state.expDate !=undefined ? localDateTime(this.state.expDate) : null,
                clients: this.state.selectedClients,
                usersRoles: JSON.stringify(this.state.usersAndRoles),
                userType: this.state.selectedUserType ? JSON.stringify(this.state.selectedUserType.filter(x => x.id != 9999)) : JSON.stringify([])
            };

            if (!this.state.isUpdate) {
                data['statusId'] = this.state.saveAndPublish==true ? 2 : 1;
            }

            data["isSubmit"] = isSubmit;

            if (this.state.contentLibId) {
                contentLibraryDataService.putContentLib(data).then((res) => {
                    successToastr(CONTENT_LIB_UPDATED_SUCCESS_MSG);
                    history.push(MANAGE_CONTENT_LIBRARY);
                });
            } else {
                contentLibraryDataService.postContentLib(data)
                    .then((response) => response)
                    .then((data) => {
                        this.uploadDocuments(data.data, CONTENT_LIB_CREATED_SUCCESS_MSG, MANAGE_CONTENT_LIBRARY);
                    });
            }
        }
    }

    checkValidations() {
        let docLength = this.uploadDoc.checkDocLength();
        if (docLength.isDocExist==false) {
            warningToastr(DOC_ERROR_MSG);
            return false;
        }

        if (docLength.documentLength > 1) {
            warningToastr(DOC_LENGTH_ERROR_MSG);
            return false;
        }
        return true;
    }

    updateContentStatus = (id, statusId, msg) => {
        let isValid = this.checkValidations();
        if (isValid) {
            this.setState({ showPublishModal: false, showArchiveModal: false });
            var data = {
                contentLibId: id,
                statusId: statusId
            }
            contentLibraryDataService.patchContentLib(data).then((res) => {
                successToastr(msg);
                history.push(MANAGE_CONTENT_LIBRARY);
            })
        }else {
            this.setState({ showPublishModal: false, showArchiveModal: false });
        }
    }

    getContentLibDetails = (contentLibId: string) => {
        contentLibraryDataService.getContentLibDetails(contentLibId).then((res) => {
            const { data } = res;
            this.setState({
                contentLibId: data.id,
                title: data.title,
                contentTypeId: data.contentTypeId,
                description: data.description,
                status: data.status,
                statusIntId: data.statusIntId,
                expDate: data.validTo && new Date(data.validTo),
                selectedClients: data.clientIds,
                clientIds: data.clientIds,
                usersAndRoles: JSON.parse(data.usersRoles),
                selectedUserType: JSON.parse(data.userType),
                modifiedDate: new Date(data.modifiedDate),
                showLoader: false,
            }, () => {
                this.getUserType()
                if (this.state.clientIds.length) {
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

    handleChange = (e) => {
        let { name, value } = e.target;
        this.state[name] = value;
        this.setState(this.state);
    };

    handleObjChange = (change) => {
        this.setState(change);
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

    uploadDocuments(contentId, message, redirectTo) {
        if (contentId) {
            this.uploadDoc.uploadDocumentsWithRedirection(contentId, message, redirectTo);
        }
    }

    onCollapseOpen = () => {
        this.setState({
            toggelFirst: true,
            toggelSecond: true,
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggelFirst: false,
            toggelSecond: false,
        });
    };

    render() {
        const {
            toggelFirst,
            toggelSecond,
        } = this.state;
        const contentInfoTriggerName = (
            <span>
                Content Information
                <span
                    className="d-none d-sm-block"
                    style={{ float: "right", marginRight: "25px" }}
                >
                    Status :  {this.state.contentLibId ? <span className="font-weight-bold"> {this.state.status} </span> : "Draft"}
                </span>
            </span>
        );
        const ContentPermission = (
            <span>
                Content Permissions
            </span>
        );
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-2 col-md-6 fonFifteen paddingLeftandRight">
                            <div className="d-none d-md-block">
                                <BreadCrumbs globalData={{ contentId: this.state.contentLibId }}></BreadCrumbs>
                            </div>
                        </div>
                        <div className="col-10 col-md-6 text-right mt-sm-1 mt-md-0 txt-orderno text-underline paddingRight d-flex align-items-center justify-content-end ">
                            {this.state.contentLibId &&
                                <span className="float-right text-dark">
                                    Last Modified : {this.state.modifiedDate && dateFormatter(this.state.modifiedDate)} {this.state.modifiedDate && convertShiftDateTime(this.state.modifiedDate)}
                                </span>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-12 ml-0 mr-0">
                    <Formik
                        validateOnMount={this.state.submitted}
                        initialValues={this.state}
                        validateOnChange={false}
                        enableReinitialize={true}
                        validationSchema={contentLibValidation}
                        validateOnBlur={false}
                        onSubmit={(fields) => this.saveContent(true)}
                        render={(formikProps) => (
                            <Form className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onChange={formikProps.handleChange}>
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
                                <div className="row mt-2">
                                    <div className="col-12 px-0 mt-2 ml-0 mr-0">
                                        <Collapsible
                                            trigger={contentInfoTriggerName}
                                            open={toggelFirst}
                                            accordionPosition="1"
                                            onTriggerOpening={() => this.setState({ toggelFirst: true })}
                                            onTriggerClosing={() => this.setState({ toggelFirst: false })}
                                        >
                                            {!this.state.showLoader &&
                                                <div className="col-12 px-0">
                                                    <div className="row mt-2">
                                                        <div className="col-12 col-sm-8 col-lg-8 mt-sm-0  mt-1">
                                                            <label className="mb-1 font-weight-bold required">Title</label>
                                                            <input
                                                                type="text"
                                                                id="id"
                                                                name="title"
                                                                className="form-control mr-4"
                                                                placeholder="Enter Title"
                                                                value={this.state.title}
                                                                maxLength={100}
                                                                onChange={(event) => {
                                                                    this.setState({ title: event.target.value });
                                                                }}
                                                            />
                                                            {formikProps.errors.title && <ErrorComponent message={formikProps.errors.title} />}
                                                        </div>
                                                        <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                            <label className="mb-1 font-weight-bold required ">
                                                                Content Type
                                                            </label>
                                                            <CustomDropDownList
                                                                className="form-control disabled"
                                                                data={this.state.contentType}
                                                                textField="name"
                                                                valueField="id"
                                                                name="contentTypeId"
                                                                dataItemKey="id"
                                                                value={this.state.contentTypeId}
                                                                defaultItem={defaultItem}
                                                                onChange={(e) => this.handleDropdownChange(e)}
                                                                filterable={this.state.originalcontentType.length > 5 ? true : false}
                                                                onFilterChange={this.handleFilterChange}
                                                            />
                                                            {formikProps.errors.contentTypeId && <ErrorComponent message={formikProps.errors.contentTypeId} />}
                                                        </div>
                                                    </div>
                                                    <div className="row mt-2">
                                                        <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                            <label className="mb-1 font-weight-bold required">Description</label>
                                                            <textarea
                                                                rows={3}
                                                                id="description"
                                                                name="description"
                                                                value={this.state.description}
                                                                className="form-control"
                                                                placeholder="Enter Description"
                                                                maxLength={2000}
                                                                onChange={(event) => {
                                                                    this.setState({ description: event.target.value });
                                                                }}
                                                            />
                                                            {formikProps.errors.description && <ErrorComponent message={formikProps.errors.description} />}
                                                        </div>
                                                        <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" id="ShowDatePickerIcon">
                                                            <label className="mb-1 font-weight-bold">Expiration Date</label>
                                                            <DatePicker
                                                                className="form-control"
                                                                formatPlaceholder="formatPattern"
                                                                format="MM/dd/yyyy"
                                                                name="expDate"
                                                                value={this.state.expDate}
                                                                onChange={(event) => {
                                                                    this.setState({ expDate: event.target.value });
                                                                }}
                                                                min={new Date()}
                                                            />
                                                        </div>
                                                        <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1" style={{
                                                            display: this.state.contentLibId
                                                                ? "block"
                                                                : "none",
                                                        }}>
                                                            <label className="mb-1 font-weight-bold">
                                                                Tags
                                                            </label>
                                                            <TagControl
                                                                ref={(instance) => {
                                                                    this.tagRef = instance;
                                                                }}
                                                                defaultText="None"
                                                                entityId={this.state.contentLibId}
                                                                entityTypeId={EntityTypeId.CLIENT}
                                                            />
                                                        </div>
                                                        <div className="col-12 col-sm-8 col-lg-4 mt-1 mt-sm-0">
                                                            <UploadDocuments
                                                                ref={(instance) => {
                                                                    this.uploadDoc = instance;
                                                                }}
                                                                entityId={this.state.contentLibId}
                                                                entityName={"Content Library"}
                                                                fieldName={"Attach Files"}
                                                                singleDoc={true}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </Collapsible>
                                    </div>
                                </div>


                                <div className="row mt-2">
                                    <div className="col-12 px-0 ml-0 mr-0">
                                        <Collapsible
                                            lazyRender={true}
                                            trigger={ContentPermission}
                                            open={toggelSecond}
                                            onTriggerOpening={() => this.setState({ toggelSecond: true })}
                                            onTriggerClosing={() => this.setState({ toggelSecond: false })}
                                        >
                                            {!this.state.showLoader &&
                                                <div className="row mt-2">
                                                    <div className="col-12 col-sm-4 col-lg-4 mt-3 area-merged multiselect">
                                                        <label className="mb-1 font-weight-bold required">Clients</label>
                                                        <MultiSelect
                                                            className="form-control disabled"
                                                            textField="client"
                                                            dataItemKey="id"
                                                            id="client"
                                                            data={this.state.clients}
                                                            name="client"
                                                            value={this.state.selectedClients}
                                                            onChange={(e) => this.handleClientsChange(e)}
                                                            placeholder="Select Clients..."
                                                        />
                                                        {formikProps.errors.selectedClients && (<ErrorComponent message={formikProps.errors.selectedClients}/>)}
                                                    </div>
                                                    <div className="col-12 col-sm-4 col-lg-4 mt-3 multiselect">
                                                        <label className="mb-1 font-weight-bold">User Type</label>
                                                        <MultiSelect
                                                            className={"form-control disabled "}
                                                            data={this.state.userTypes}
                                                            textField="name"
                                                            dataItemKey="id"
                                                            id="userType"
                                                            name="userType"
                                                            placeholder="Select User Type"
                                                            value={this.state.selectedUserType && this.state.selectedUserType.filter((x) => x.id !=9999)}
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
                                                </div>
                                            }
                                        </Collapsible>
                                    </div>
                                </div>

                                <div className="modal-footer justify-content-center border-0 mt-2">
                                    <div className="modal-footer justify-content-center border-0 mt-2">
                                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                            </button>
                                            {(this.state.contentLibId && this.state.statusIntId != ContentLibStatus.DRAFT)
                                                ? <React.Fragment>
                                                    <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true, isUpdate: true })}>
                                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                                    </button>
                                                    {(this.state.statusIntId==ContentLibStatus.ARCHIVED) ?
                                                        <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ showPublishModal: true })}>
                                                            <FontAwesomeIcon icon={faCheckCircle} className={"mr-1"} /> Publish
                                                        </button>
                                                        :
                                                        <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ showArchiveModal: true })}>
                                                            <FontAwesomeIcon icon={faArchive} className={"mr-1"} /> Archive
                                                        </button>
                                                    }
                                                </React.Fragment>
                                                : <React.Fragment>
                                                    <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true, saveAndPublish: false })}>
                                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                                    </button>
                                                    <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true, saveAndPublish: true })}>
                                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save And Publish
                                                    </button>
                                                </React.Fragment>}
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    />
                    <ConfirmationModal
                        message={PUBLISH_CONTENT_LIB_CONFIRMATION_MSG()}
                        showModal={this.state.showPublishModal}
                        handleYes={() => this.updateContentStatus(this.state.contentLibId, ContentLibStatus.PUBLISHED, CONTENT_LIB_PUBLISH_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showPublishModal: false });
                        }}
                    />

                    <ConfirmationModal
                        message={ARCHIVE_CONTENT_LIB_CONFIRMATION_MSG()}
                        showModal={this.state.showArchiveModal}
                        handleYes={() => this.updateContentStatus(this.state.contentLibId, ContentLibStatus.ARCHIVED, CONTENT_LIB_ARCHIVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showArchiveModal: false });
                        }}
                    />
                </div>
            </div>
        )

    }
}
export default CreateContentLibrary;