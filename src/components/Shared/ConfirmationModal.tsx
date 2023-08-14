import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowRight, faCheckCircle, faCheck, faTimesCircle, faTimes, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage } from "formik";
import { ErrorComponent, HrsErrorComponent } from "../ReusableComponents";
import { allowedFileExtentions, allowedMymeTypes } from "./AppConstants";
import { includes } from "lodash";
import AlertBox from "./AlertBox";
import axios from "axios";
import { successToastr } from "../../HelperMethods";
import { REMOVE_TS_DOCUMENT_CONFIRMATION_MSG } from "./AppMessages";

export interface ConfirmationModalProps {
    showModal: boolean;
    message: any;
    messageSecond?: any;
    handleYes: any;
    handleNo: any;
    enterComments?: boolean;
    changeHours?: boolean;
    commentsChange?: any;
    roleName?: any;
    txtName?: any;
    comments?: string;
    gHours?: number;
    showError?: boolean;
    commentsRequired?: boolean;
    errorMessage?: boolean;
    isDocRequired?: boolean;
    entityId?: string;
}

export interface ConfirmationModalState {
    showModal: boolean;
    fileArray?: any[];
    showInvalidFileAlert?: boolean;
    showRemoveModal?: boolean;
}

export class ConfirmationModal extends React.Component<ConfirmationModalProps, ConfirmationModalState> {
    private commentsLabelClass = "mb-1 font-weight-bold required";
    uploadControl: HTMLInputElement;
    globalFileId: any;
    public fileArrayGlobal: any[];
    invalidFileList: any[];
    alertMessage = "";
    maxGHours = 0;
    constructor(props) {
        super(props);
        this.state = { showModal: false, fileArray: [], };
        if (!this.props.commentsRequired) {
            this.commentsLabelClass = "mb-1 font-weight-bold";
        }
        this.maxGHours = this.props.gHours;
    }

    handleCommentChange = (e) => {
        this.props.commentsChange(e);
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

    select = (event) => {
        let fileArray = [...this.state.fileArray];
        event.preventDefault();
        if (event.target.files.length > 0) {
            Array.from(event.target.files).forEach((file: any) => {
                let isfileValid = false;
                if (includes(allowedMymeTypes, file.type)) {
                    isfileValid = true;
                } else if (file.type=="") {
                    if (includes(allowedFileExtentions, file.name.split(".")[1])) {
                        isfileValid = true;
                    }
                }
                fileArray.push({ candDocumentsId: undefined, fileName: file.name, file: file, isValid: isfileValid, path: undefined });
            });
            this.fileArrayGlobal = fileArray;
            if (fileArray.some((d) => d.isValid ==false)) {
                this.invalidFileList = fileArray.filter(x => x.isValid ==false);
                this.alertMessage = this.invalidFileList.map(x => x.fileName).join(", ") + " is invalid and will not be uploaded."
                this.setState({ showInvalidFileAlert: true });
                return false;
            }
            else {
                this.uploadDocuments(fileArray);
            }
        }
    };

    uploadDocuments = (fileArray) => {
        this.setState({ showInvalidFileAlert: false });
        let checkNewFile = fileArray != undefined ? fileArray.filter((i) => i.candDocumentsId ==undefined && i.isValid ==true) : [];
        if (checkNewFile.length > 0) {
            let formData = new FormData();
            checkNewFile.map((item) => {
                formData.append("FormFiles", item.file);
            });
            formData.append("entityId", this.props.entityId);
            formData.append("entityName", "TimeSheet");
            axios
                .post(`/api/ts/documents`, formData)
                .then((response) => response)
                .then((data) => {
                    successToastr("Document(s) uploaded successfully.");
                    this.getDocuments(this.props.entityId);
                });
        }
    }

    removeFile = (index) => {
        if (this.state.fileArray[index].candDocumentsId) {
            this.globalFileId = this.state.fileArray[index].candDocumentsId
            axios.delete(`/api/admin/documents/${this.globalFileId}`).then((res) => {
                successToastr("Document deleted successfully");
                this.getDocuments(this.props.entityId);
            });
        }
    };

    render() {
        return (
            <div className="">
                {this.props.showModal && (
                    <div className="containerDialog">
                        <div className="containerDialog-animation">
                            <div className="col-10 col-sm-7 col-xl-4 shadow containerDialoginside">
                                <div className="row blue-accordion">
                                    <div className="col-12  pt-2 pb-2 fontFifteen">
                                        Confirmation
                                        <span className="float-right" onClick={this.props.handleNo}>
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                            {/* <i className="far fa-arrow-right mr-2 "></i> */}
                                        </span>
                                    </div>
                                </div>
                                <div className="row text-center">
                                    <div className="col-12 text-dark mt-4 pl-2 pr-2">{this.props.message}</div>
                                </div>

                                <div className="row ml-0 mr-0 mt-3" style={{ display: this.props.txtName ? "block" : "none" }}>
                                    <div className="col-12 mt-sm-2">
                                        <label
                                            className={
                                                this.props.commentsRequired
                                                    ? "mb-1 font-weight-bold required"
                                                    : "mb-1 font-weight-bold"
                                            }
                                        >
                                            {this.props.txtName}
                                        </label>
                                        <input
                                            name="role"
                                            placeholder="Enter Role"
                                            maxLength={100}
                                            className="form-control"
                                            value={this.props.roleName}
                                            onChange={(e) => this.handleCommentChange(e)}
                                        />
                                        {this.props.showError && <ErrorComponent />}
                                    </div>
                                </div>

                                <div className="row ml-0 mr-0" style={{ display: this.props.enterComments ? "block" : "none" }}>
                                    <div className="col-12 mt-sm-2">
                                        <label
                                            className={
                                                this.props.commentsRequired
                                                    ? "mb-1 font-weight-bold required"
                                                    : "mb-1 font-weight-bold"
                                            }
                                        >
                                            Comments
                                        </label>
                                        <textarea
                                            name="comment"
                                            maxLength={2000}
                                            placeholder="Enter Comments"
                                            className="form-control"
                                            value={this.props.comments}
                                            onChange={(e) => this.handleCommentChange(e)}
                                        />
                                        {this.props.showError && <ErrorComponent />}
                                    </div>
                                </div>

                                <div className="row ml-0 mr-0 text-center" style={{ display: this.props.changeHours ? "block" : "none" }}>
                                    <div className="col-3 mt-sm-2" style={{ display: "inline-block" }}>
                                        <input
                                            name="hours"
                                            className="form-control text-center"
                                            value={this.props.gHours ? this.props.gHours.toFixed(2) : 0}
                                            onChange={(e) => this.handleCommentChange(e)}
                                        />
                                    </div>
                                    {this.props.showError && HrsErrorComponent(this.props.errorMessage)}
                                </div>
                                <div className="row text-center" style={{ display: this.props.changeHours ? "block" : "none" }}>
                                    <div className="col-12 text-dark mt-4 pl-2 pr-2">{this.props.messageSecond}</div>
                                </div>

                                <div className="row ml-0 mr-0 text-center" style={{ display: this.props.isDocRequired ? "block" : "none" }}>
                                    <div className="col-12 col-sm-12 col-lg-12 mt-2 mb-2 mb-sm-0  mt-sm-0">
                                        <input
                                            id="myInput"
                                            type="file"
                                            multiple
                                            accept="image/jpeg,image/png,application/pdf,application/doc,application/docx,application/xls,application/xlsx"
                                            ref={(ref) => (this.uploadControl = ref)}
                                            style={{ display: "none" }}
                                            onChange={(e) => this.select(e)}
                                        />
                                        <label className="mb-0 font-weight-bold text-left d-block mb-1 mt-2">
                                            Upload Documents
                                            <span
                                                onClick={() => {
                                                    this.uploadControl.click();
                                                }}
                                                className="text-underline cursorElement align-middle"
                                            >
                                                <FontAwesomeIcon icon={faPaperclip} className="ml-1 active-icon-blue ClockFontSize" />
                                            </span>
                                        </label>
                                        <div className="file-list">
                                            {this.state.fileArray.length > 0 &&
                                                this.state.fileArray.map((file, i) => (
                                                    <span>
                                                        <span
                                                            title={file.fileName}
                                                            //onClick={() => file.candDocumentsId && this.download(file.path)}
                                                            className={file.isValid ? "valid-file" : "invalid-file"}
                                                        >
                                                            {file.fileName}
                                                        </span>
                                                        <span title="Remove" className="remove" onClick={() => this.removeFile(i)}>
                                                            X
                                                        </span>
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="row ml-0 mr-0">
                                    <div className="col-12 mt-4 mb-4 text-center font-regular">
                                        <button
                                            type="button"
                                            onClick={this.props.handleNo}
                                            className="btn button button-close mr-2 shadow mb-2 mb-xl-0">
                                            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                                            No
                                        </button>
                                        <button
                                            type="button"
                                            onClick={this.props.handleYes}
                                            className="btn button button-bg shadow mb-2 mb-xl-0">
                                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                            Yes
                                        </button>
                                    </div>
                                </div>
                                {/* <div className="row text-center d-block d-lg-none">
                                <div className="col-12 mt-2 mb-3 text-cenetr font-regular">
                                    <button
                                        type="button"
                                        onClick={this.props.handleNo}
                                        className="btn button button-close mr-2 shadow"
                                    >
                                        <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                                        No
                                    </button>
                                    <button type="button" onClick={this.props.handleYes} className="btn button button-bg shadow">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                        Yes
                                    </button>
                                </div>
                            </div> */}
                            </div>
                        </div>
                    </div>
                )}
                <AlertBox
                    message={this.alertMessage}
                    showModal={this.state.showInvalidFileAlert}
                    handleNo={() => this.uploadDocuments(this.fileArrayGlobal)}
                />
            </div>
        );
    }
}

export default ConfirmationModal;