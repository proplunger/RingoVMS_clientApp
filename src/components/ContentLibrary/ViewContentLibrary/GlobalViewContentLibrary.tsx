import { faChevronCircleDown, faChevronCircleUp, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { dateFormatter, history } from "../../../HelperMethods";
import Collapsible from "react-collapsible";
import BreadCrumbs from "../../Shared/BreadCrumbs/BreadCrumbs";
import axios from "axios";
import contentLibraryDataService from "../Services/DataService";
import CommonControl from "../../Shared/UserAndRoleControl/CommonControl";
import { MultiSelect } from "@progress/kendo-react-dropdowns";

export interface GlobalViewContentLibraryProps {
    match: any;
}

export interface GlobalViewContentLibraryState {
    contentLibId: string;
    contentDetails: any;
    clients: any;
    userTypes: any;
    selectedUserType: any;
    usersAndRoles: any;
    toggleAll: boolean;
    toggleFirst: boolean;
    toggleSecond: boolean;
    isPrivate?: boolean;
    fileArray: any;
}

class GlobalViewContentLibrary extends React.Component<GlobalViewContentLibraryProps, GlobalViewContentLibraryState> {
    constructor(props: GlobalViewContentLibraryProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            contentLibId: id,
            contentDetails: {},
            toggleAll: false,
            toggleFirst: true,
            toggleSecond: true,
            clients: [],
            userTypes: [],
            selectedUserType: [],
            usersAndRoles: [],
            fileArray: []
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ contentLibId: id });
        this.getClients();
        this.getUserType();
        this.getContentDetails(id);
        this.getDocuments(id);
    }

    getClients = () => {
        contentLibraryDataService.getClients().then((res) => {
            this.setState({
                clients: res.data
            });
        });
    }

    getUserType() {
        contentLibraryDataService.getUserType()
            .then(async res => {
                this.setState({
                    userTypes: res.data
                });
            });
    }

    getContentDetails(contentLibId) {
        contentLibraryDataService.getContentLibDetails(contentLibId).then((res) => {
            const { data } = res;
            const contentDetails = { ...data };
            this.setState({
                contentDetails: contentDetails,
                usersAndRoles: JSON.parse(data.usersRoles),
                selectedUserType: JSON.parse(data.userType)
            });
        });
    }

    onCollapseOpen = () => {
        this.setState({
            toggleAll: true,
            toggleFirst: true,
            toggleSecond: true
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggleAll: false,
            toggleFirst: false,
            toggleSecond: false
        });
    };

    getDocuments = (entityId) => {
        axios.get(`api/ts/documents?tsWeekId=${entityId}`).then((res) => {
            if (res.data) {
                let fileArray = [];
                res.data.forEach((doc) => {
                    fileArray.push({
                        candDocumentsId: doc.candDocumentsId,
                        fileName: doc.fileName,
                        file: undefined,
                        isValid: true,
                        path: doc.filePath,
                    });
                });
                this.setState({ fileArray: fileArray });
            }
        });
    };

    download = (filePath) => {
        axios.get(`/api/candidates/documents/download?filePath=${filePath}`).then((res: any) => {
            if (res) {
                let fileExt = filePath.split('.')[1].toLowerCase();
                let fileType;
                if (fileExt=="jpg" || fileExt=="png" || fileExt=="jpeg") {
                    fileType = "image";
                } else {
                    fileType = "application";
                }
                const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
                const downloadLink = document.createElement("a");
                let fileName = filePath.split("/")[2];

                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            }
        });
    };

    handleChange = (e) => {
        let { name, value } = e.target;
        this.state[name] = value;
        this.setState(this.state);
    };

    render() {
        const { contentLibId, contentDetails, fileArray, usersAndRoles, selectedUserType } = this.state;
        const {
            toggleAll,
            toggleFirst,
            toggleSecond
        } = this.state;

        const contentInfoTriggerName = (
            <span>
                Content Information
                <span
                    className="d-none d-sm-block"
                    style={{ float: "right", marginRight: "25px" }}
                >
                    Status : {contentDetails.status}
                </span>
            </span>
        );

        return (
            <React.Fragment>
                <div>
                    <div className="col-11 mx-auto pl-0 pr-0 mt-3">
                        <div className="col-12 p-0 shadow pt-1 pb-1">
                            <div className="col-12 ml-0 mr-0">
                                <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                                    <div className="col-9 col-md-9 fonFifteen paddingLeftandRight">
                                        <div className="d-none d-md-block"><BreadCrumbs globalData={{ contentId: contentLibId }}></BreadCrumbs></div>
                                    </div>
                                    <div className="col-3 col-md-3 text-right mt-sm-1 mt-md-0 txt-orderno paddingRight d-flex align-items-center justify-content-end">
                                        {(toggleFirst && toggleSecond) ||
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
                                {this.state.contentLibId && (
                                    <React.Fragment>
                                        <span className="d-block d-md-none text-right">
                                            Status : {contentDetails.status}
                                        </span>

                                        <Collapsible
                                            trigger={contentInfoTriggerName}
                                            open={toggleFirst}
                                            onTriggerOpening={() => this.setState({ toggleFirst: true })}
                                            onTriggerClosing={() => this.setState({ toggleFirst: false })}
                                        >
                                            <div className="mb-3" id="My-Requistion">
                                                <div className="row text-dark">
                                                    <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                                        <div className="row">
                                                            <div className="col-6 text-right">Title :</div>
                                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{contentDetails.title ? contentDetails.title : "-"}</div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                                        <div className="row">
                                                            <div className="col-6 text-right">Content Type :</div>
                                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{contentDetails.contentType ? contentDetails.contentType : "-"}</div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                                        <div className="row">
                                                            <div className="col-6 text-right">Expiration Date :</div>
                                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{contentDetails.validTo ? `${dateFormatter(new Date(contentDetails.validTo))}` : "-"}</div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-sm-4 mt-md-3 mt-2">
                                                        <div className="row">
                                                            <div className="col-6 text-right">Description :</div>
                                                            <div className="col-6 font-weight-bold pl-0 text-left word-break-div">{contentDetails.description ? contentDetails.description : "-"}</div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="row text-dark">
                                                    <div className="col-12 col-sm-4 mt-md-3 mt-3">
                                                        <label className="mb-0 font-weight-bold">Attachments</label>
                                                        <div className="file-list">
                                                            {fileArray.length > 0 &&
                                                                fileArray.map((file, i) => (
                                                                    <span>
                                                                        <span
                                                                            title={file.fileName}
                                                                            onClick={() => file.candDocumentsId && this.download(file.path)}
                                                                            className={file.isValid ? "valid-file" : "invalid-file"}
                                                                        >
                                                                            {file.fileName}
                                                                        </span>
                                                                    </span>
                                                                ))}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </Collapsible>

                                        <Collapsible
                                            trigger="Content Permissions"
                                            open={toggleSecond}
                                            onTriggerOpening={() => this.setState({ toggleSecond: true })}
                                            onTriggerClosing={() =>
                                                this.setState({ toggleSecond: false })
                                            }
                                        >
                                            <div className="row mt-2">
                                                <div className="col-12 col-sm-4 col-lg-4 mt-3 area-merged multiselect">
                                                    <label className="mb-1 font-weight-bold">Clients</label>
                                                    <MultiSelect
                                                        className="form-control disabled"
                                                        disabled={true}
                                                        textField="client"
                                                        dataItemKey="id"
                                                        id="client"
                                                        data={this.state.clients}
                                                        name="client"
                                                        value={contentDetails.clientIds}
                                                    />
                                                </div>
                                                <div className="col-12 col-sm-4 col-lg-4 mt-3 multiselect">
                                                    <label className="mb-1 font-weight-bold">User Type</label>
                                                    <MultiSelect
                                                        className={"form-control disabled "}
                                                        disabled={true}
                                                        data={this.state.userTypes}
                                                        textField="name"
                                                        dataItemKey="id"
                                                        id="userType"
                                                        name="userType"
                                                        placeholder="Select User Type"
                                                        value={selectedUserType && selectedUserType.filter((x) => x.id !=9999)}
                                                    />
                                                </div>
                                                <div className="col-12 col-sm-4 col-lg-4 mt-3 common-control_padding">
                                                    <label className="mb-1 font-weight-bold">Users & Roles</label>
                                                    <CommonControl
                                                        disabled={true}
                                                        value={usersAndRoles}
                                                        id="usersAndRoles"
                                                        handleChange={this.handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </Collapsible>
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer justify-content-center border-0">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default GlobalViewContentLibrary;
