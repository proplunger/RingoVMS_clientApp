import * as React from "react";
import axios from "axios";
import "../TagControl/TagControl.css";
import { successToastr, history } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { includes } from "lodash";
import { allowedFileExtentions, allowedMymeTypes } from "../../Shared/AppConstants";
import AlertBox from "../AlertBox";
import ConfirmationModal from "../ConfirmationModal";
import { REMOVE_TS_DOCUMENT_CONFIRMATION_MSG } from "../AppMessages";

export interface UploadDocumentsProps {
    entityId: any;
    entityName: any;
    fieldName: any;
    singleDoc?: boolean;
}

export interface UploadDocumentsState {
    fileArray?: any[];
    showInvalidFileAlert?: boolean;
    showRemoveModal?: boolean;
}

class UploadDocuments extends React.Component<UploadDocumentsProps, UploadDocumentsState> {
    invalidFileList: any[];
    globalFileId: any;
    alertMessage = "";
    uploadControl: HTMLInputElement;
    public fileArrayGlobal: any[];
    constructor(props: UploadDocumentsProps) {
        super(props);
        this.state = {
            fileArray: [],
        };
    }

    componentDidMount() {
        if (this.props.entityId !=null) {
            this.getDocuments(this.props.entityId);
        }
    }

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
            if (this.props.entityId==null || this.props.entityId==undefined) {
                this.setState({ fileArray: fileArray })
            }
            if (fileArray.some((d) => d.isValid ==false)) {
                this.invalidFileList = fileArray.filter(x => x.isValid ==false);
                this.alertMessage = this.invalidFileList.map(x => x.fileName).join(", ") + " is invalid and will not be uploaded."
                this.setState({ showInvalidFileAlert: true });
                return false;
            }
            else if (this.props.entityId) {
                this.uploadDocuments();
            }
        }
    };

    uploadDocuments = (entityId?) => {
        this.setState({ showInvalidFileAlert: false });
        let checkNewFile = this.fileArrayGlobal != undefined ? this.fileArrayGlobal.filter((i) => i.candDocumentsId ==undefined && i.isValid ==true) : [];
        if (checkNewFile.length > 0) {
            let formData = new FormData();
            checkNewFile.map((item) => {
                formData.append("FormFiles", item.file);
            });
            formData.append("entityId", this.props.entityId ? this.props.entityId : entityId);
            formData.append("entityName", this.props.entityName);
            axios
                .post(`/api/ts/documents`, formData)
                .then((response) => response)
                .then((data) => {
                    if (this.props.entityId) {
                        successToastr("Document(s) uploaded successfully.");
                        this.getDocuments(this.props.entityId);
                    }
                });
        }
    }

    uploadDocumentsWithRedirection = async (entityId?, message?, redirectTo?) => {
        this.setState({ showInvalidFileAlert: false });
        let checkNewFile = this.fileArrayGlobal != undefined ? this.fileArrayGlobal.filter((i) => i.candDocumentsId ==undefined && i.isValid ==true) : [];
        if (checkNewFile.length > 0) {
            let formData = new FormData();
            checkNewFile.map((item) => {
                formData.append("FormFiles", item.file);
            });
            formData.append("entityId", this.props.entityId ? this.props.entityId : entityId);
            formData.append("entityName", this.props.entityName);
            await axios
                .post(`/api/ts/documents`, formData)
                .then((response) => response)
                .then((data) => {
                    if (this.props.entityId) {
                        successToastr("Document(s) uploaded successfully.");
                        this.getDocuments(this.props.entityId);
                    }
                    if (data.data) {
                        successToastr(message);
                        history.push(redirectTo);
                    }
                });
        }
    }

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

    removeFile = (index) => {
        if (this.state.fileArray[index].candDocumentsId) {
            this.globalFileId = this.state.fileArray[index].candDocumentsId
            this.setState({ showRemoveModal: true })
        } else {
            let fileArray = this.state.fileArray;
            this.state.fileArray.splice(index, 1);
            this.setState({ fileArray: fileArray });
        }
    };

    deleteFile = () => {
        this.setState({ showRemoveModal: false });
        axios.delete(`/api/admin/documents/${this.globalFileId}`).then((res) => {
            successToastr("Document deleted successfully");
            this.getDocuments(this.props.entityId);
        });
    };

    checkDocLength = () => {
        let fileArray = [...this.state.fileArray];
        var isDocExist = fileArray.length > 0 ? true : false;
        var documentLength = fileArray.length;

        return { isDocExist, documentLength };
    }

    render() {
        return (
            <>
                {/* className="col-12 col-sm-4 col-lg-4 mt-2 mb-2 mb-sm-0 mt-sm-0" */}
                <div>
                    <input
                        id="myInput"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,application/pdf,application/doc,application/docx,application/xls,application/xlsx,video/mp4"
                        ref={(ref) => (this.uploadControl = ref)}
                        style={{ display: "none" }}
                        onChange={(e) => this.select(e)}
                    />
                    <label className="mb-0 font-weight-bold ">
                        {this.props.fieldName}
                        {this.props.singleDoc==true ?
                            this.state.fileArray.length==0 &&
                            <span
                                onClick={() => {
                                    this.uploadControl.click();
                                }}
                                className="text-underline cursorElement align-middle"
                            >
                                <FontAwesomeIcon icon={faPaperclip} className="ml-1 active-icon-blue ClockFontSize" />
                            </span>
                            :
                            <span
                                onClick={() => {
                                    this.uploadControl.click();
                                }}
                                className="text-underline cursorElement align-middle"
                            >
                                <FontAwesomeIcon icon={faPaperclip} className="ml-1 active-icon-blue ClockFontSize" />
                            </span>
                        }
                    </label>
                    <div className="file-list">
                        {this.state.fileArray.length > 0 &&
                            this.state.fileArray.map((file, i) => (
                                <span>
                                    <span
                                        title={file.fileName}
                                        onClick={() => file.candDocumentsId && this.download(file.path)}
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
                <AlertBox
                    message={this.alertMessage}
                    showModal={this.state.showInvalidFileAlert}
                    handleNo={() => this.uploadDocuments()}
                />
                <ConfirmationModal
                    message={REMOVE_TS_DOCUMENT_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteFile()}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />
            </>
        );
    }
}

export default UploadDocuments;
