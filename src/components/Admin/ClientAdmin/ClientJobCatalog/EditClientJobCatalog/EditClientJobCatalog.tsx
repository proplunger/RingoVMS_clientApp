import { faPaperclip, faSave } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../../Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import withValueField from "../../../../Shared/withValueField";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import * as React from "react";
import axios from "axios";
import { successToastr } from "../../../../../HelperMethods";
import { ErrorComponent } from "../../../../ReusableComponents";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton from "react-loading-skeleton";
import commonService from "../../../../Shared/Services/CommonDataService";
import globalAdminService from "../../../GlobalAdmin/Service/DataService";
import clientAdminService from "../../Service/DataService";
import { CLIENT_JOB_CATALOG_UPDATE_SUCCESS_MSG, REMOVE_TS_DOCUMENT_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import { includes } from "lodash";
import { allowedFileExtentions, allowedMymeTypes } from "../../../../Shared/AppConstants";
import AlertBox from "../../../../Shared/AlertBox";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select..", id: null };

export interface EditClientJobCatalogProps {
    props: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface EditClientJobCatalogState {
    clientId?: string;
    name?: string;
    description?: string;
    clientJobCatalogId?: string;
    globalJobCategoryId?: string;
    globalPositionId?: string;
    submitted: boolean;
    showLoader?: boolean;
    globalJobCategory: Array<IDropDownModel>;
    originalglobalJobCategory: Array<IDropDownModel>;
    globalPositions: Array<IDropDownModel>;
    originalglobalPositions: Array<IDropDownModel>;
    skills: Array<IDropDownModel>;
    originalskills: Array<IDropDownModel>;
    selectedSkills: any;
    fileArray?: any[];
    openAlert?: boolean;
    showRemoveModal?: boolean;
}

class EditClientJobCatalog extends React.Component<EditClientJobCatalogProps, EditClientJobCatalogState> {
    globalFileId: any;
    uploadControl: HTMLInputElement;
    alertMessage = "";
    constructor(props: EditClientJobCatalogProps) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            globalJobCategory: [],
            originalglobalJobCategory: [],
            globalPositions: [],
            originalglobalPositions: [],
            skills: [],
            originalskills: [],
            selectedSkills: [],
            fileArray: [],
            showLoader: true,
            submitted: false,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.getGlobalPositions();
        this.getGlobalJobCategory();
        this.getSkills();
        if (this.props.props) {
            this.setState({
                clientJobCatalogId: this.props.props.id,
                globalJobCategoryId: this.props.props.globalJobCategoryId,
                globalPositionId: this.props.props.globalPositionId,
                name: this.props.props.clientPosition,
                description: this.props.props.description,
                selectedSkills: this.props.props.isOverriden==1 ? this.props.props.clientSkills : this.props.props.globalSkills,
                //selectedSkills:this.props.props.skills
            }, () => { this.getTSWeekDocuments() })
        }
    }

    getTSWeekDocuments = () => {
        let documentId;
        if (this.props.props.isOverriden==1) {
            documentId = this.props.props.id
        } else {
            documentId = this.props.props.globalPositionId
        }
        axios.get(`api/ts/documents?tsWeekId=${documentId}`).then((res) => {
            if (res.data) {
                let fileArray = [...this.state.fileArray];
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

    getGlobalJobCategory = () => {
        axios.get(`api/admin/jobcategories`)
            .then(async res => {
                this.setState({ globalJobCategory: res.data, originalglobalJobCategory: res.data, showLoader: false });
            });
    }

    getGlobalPositions = () => {
        const queryParams = `status eq 'Active'`;
        globalAdminService.getGlobalJobCatalog(queryParams)
            .then(async res => {
                this.setState({ globalPositions: res.data, originalglobalPositions: res.data });
            });
    }

    getSkills = () => {
        const queryParams = `status eq 'Active'`;
        commonService.getSkills()
            .then(async res => {
                this.setState({ skills: res.data, originalskills: res.data });
            });
    }

    isCustom = (item) => { return item.id ==undefined; }
    
    addKey = (item) => { item.id = undefined }

    handleSkillsChange = (e) => {
        const values = e.value;
        const lastItem = values[values.length - 1];

        if (lastItem && this.isCustom(lastItem)) {
            let existingSkill = this.state.skills.filter(i => i.name.trim().toLowerCase()==lastItem.name.trim().toLowerCase())
            let selecSkill = values.filter(i => i.name.trim().toLowerCase()==lastItem.name.trim().toLowerCase())
            
            if (existingSkill.length==0 && selecSkill.length==1) {
                this.addKey(lastItem);
            }else{
                values.pop();
            }
        }

        this.setState({
            selectedSkills: values
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

    openNew = () => {
        this.props.onOpenModal();
    };

    handleSave = () => {
        this.setState({ submitted: true })
        const { clientJobCatalogId } = this.state;
        let data = {
            client: this.state.clientId,
            clientPosMapId: this.state.clientJobCatalogId,
            globalJobCategory: this.state.globalJobCategoryId,
            globalPositions: this.state.globalPositionId,
            clientPosition: this.state.name,
            clientPositionDescription: this.state.description,
            clientPositionSkills: this.state.selectedSkills,
        };
        if ((this.state.globalJobCategoryId !=undefined && this.state.globalJobCategoryId !=null)
            && (this.state.globalPositionId !=undefined && this.state.globalPositionId !=null)
            && (this.state.name !=undefined && this.state.name !=null && this.state.name !="")
            && (this.state.selectedSkills !=undefined && this.state.selectedSkills.length > 0 && this.state.selectedSkills !=null)) {
            let checkNewFile = this.state.fileArray != undefined ? this.state.fileArray.filter((i) => i.candDocumentsId ==undefined) : [];

            if (checkNewFile.some((d) => d.isValid ==false)) {
                this.alertMessage = "Invalid file is attached. Please remove invalid file or attach another valid file.";
                this.setState({ openAlert: true });
                return false;
            } else {
                clientAdminService.putClientJobCatalog(clientJobCatalogId, data)
                    .then((response) => response)
                    .then((data) => {
                        if (checkNewFile.length > 0) {
                            let formData = new FormData();
                            checkNewFile.map((item) => {
                                formData.append("FormFiles", item.file);
                            });
                            formData.append("entityId", this.state.clientJobCatalogId);
                            formData.append("entityName", "ClientJobCatalog");
                            axios
                                .post(`/api/ts/documents`, formData)
                                .then((response) => response)
                                .then((data) => {
                                    successToastr(CLIENT_JOB_CATALOG_UPDATE_SUCCESS_MSG);
                                    this.props.onCloseModal();
                                });
                        } else {
                            successToastr(CLIENT_JOB_CATALOG_UPDATE_SUCCESS_MSG);
                            this.props.onCloseModal();
                        }
                    });
            }
        }
    }

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
            this.setState({ fileArray: fileArray });
        }
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

    removeFile = (index) => {
        if (this.state.fileArray[index].candDocumentsId) {
            this.globalFileId = this.state.fileArray[index].candDocumentsId
            this.setState({ showRemoveModal: true })
        }

        let fileArray = this.state.fileArray;
        this.state.fileArray.splice(index, 1);
        this.setState({ fileArray: fileArray });
    };

    deleteFile = () => {
        this.setState({ showRemoveModal: false });
        axios.delete(`/api/admin/documents/${this.globalFileId}`).then((res) => {
            successToastr("Document deleted successfully");
        });
    };

    render() {
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            {this.props.props != undefined ? "Edit" : "Add"} Client Catalog
                        </h4>
                        <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.onCloseModal}>
                            &times;
                        </button>
                    </div>
                    {this.state.showLoader &&
                        Array.from({ length: 3 }).map((item, i) => (
                            <div className="row mx-auto mt-2" key={i}>
                                {Array.from({ length: 3 }).map((item, j) => (
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
                                        <Skeleton width={230} />
                                        <Skeleton height={30} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    {!this.state.showLoader && (
                        <div>
                            <div className="row mt-3 mx-0">
                                <div className="col-12 col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-0 font-weight-bold required">Global Job Category</label>
                                    <CustomDropDownList
                                        className="form-control mt-1"
                                        disabled={true}
                                        data={this.state.globalJobCategory}
                                        textField="name"
                                        valueField="id"
                                        id="jobCategory"
                                        name="id"
                                        value={this.state.globalJobCategoryId}
                                        defaultItem={defaultItem}
                                        //onChange={(e) => this.handleGlobalPositionsChange(e)}
                                        filterable={this.state.originalglobalPositions.length > 5 ? true : false}
                                        onFilterChange={this.handleFilterChange}
                                    />
                                    {this.state.submitted && (this.state.globalJobCategoryId==undefined || this.state.globalJobCategoryId==null) && <ErrorComponent />}
                                </div>
                                <div className="col-12 col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-0 font-weight-bold required">Global Position</label>
                                    <CustomDropDownList
                                        className="form-control mt-1"
                                        disabled={true}
                                        data={this.state.globalPositions}
                                        textField="name"
                                        valueField="id"
                                        id="globalPositions"
                                        name="id"
                                        value={this.state.globalPositionId}
                                        defaultItem={defaultItem}
                                        //onChange={(e) => this.handleGlobalPositionsChange(e)}
                                        filterable={this.state.originalglobalPositions.length > 5 ? true : false}
                                        onFilterChange={this.handleFilterChange}
                                    />
                                    {this.state.submitted && (this.state.globalPositionId==undefined || this.state.globalPositionId==null) && <ErrorComponent />}
                                </div>
                                <div className="col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-0 font-weight-bold required">Client Position</label>
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Position Name"
                                        value={this.state.name}
                                        onChange={(event) => {
                                            this.setState({ name: event.target.value });
                                        }}
                                    />
                                    {this.state.submitted && (this.state.name==undefined || this.state.name==null || this.state.name=="") && <ErrorComponent />}
                                </div>
                            </div>
                            <div className="row mt-3 mx-0">
                                <div className="col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-0 font-weight-bold">Client Position Description</label>
                                    <textarea
                                        rows={2}
                                        id=""
                                        maxLength={5000}
                                        value={this.state.description}
                                        className="form-control mt-1"
                                        placeholder="Enter Description"
                                        onChange={(event) => {
                                            this.setState({ description: event.target.value });
                                        }}
                                    />
                                </div>
                                <div className="col-12 col-sm-8 col-lg-8 mt-1 mt-sm-0">
                                    <label className="mb-1 font-weight-bold required">Client Position Skills</label>
                                    <MultiSelect
                                        className="form-control disabled"
                                        data={this.state.skills}
                                        textField="name"
                                        dataItemKey="id"
                                        id="skills"
                                        value={this.state.selectedSkills}
                                        onChange={(e) => this.handleSkillsChange(e)}
                                        placeholder="Select Skills..."
                                        allowCustom={true}
                                        filterable={this.state.originalskills.length > 5 ? true : false}
                                        onFilterChange={this.handleFilterChange}
                                    />
                                    {this.state.submitted && (this.state.selectedSkills==undefined || this.state.selectedSkills.length==0 || this.state.selectedSkills==null) && <ErrorComponent />}
                                </div>
                            </div>

                            <div className="row mt-3 mx-0">
                                <div className="col-12 col-sm-8 col-lg-4 mt-1 mt-sm-0">
                                    <input
                                        id="myInput"
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png,application/pdf,application/doc,application/docx,application/xls,application/xlsx"
                                        ref={(ref) => (this.uploadControl = ref)}
                                        style={{ display: "none" }}
                                        onChange={(e) => this.select(e)}
                                    />
                                    {this.props.props != null ? (
                                        <label className="mb-0 font-weight-bold ">
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
                                    ) : (
                                        <label className="mb-0 font-weight-bold ">Uploaded Documents</label>
                                    )}
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
                                                    {this.props.props != null && (
                                                        <span title="Remove" className="remove" onClick={() => this.removeFile(i)}>
                                                            X
                                                        </span>
                                                    )}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    <div className="modal-footer justify-content-center border-0 mt-3 mb-3">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                            </button>
                            {this.props.props != undefined
                                && <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSave}>
                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                              </button>
                            }
                        </div>
                    </div>
                </div>

                {this.state.openAlert &&
                    <AlertBox handleNo={() => { this.setState({ openAlert: false }) }}
                        message={this.alertMessage}
                        showModal={this.state.openAlert}
                    ></AlertBox>
                }

                <ConfirmationModal
                    message={REMOVE_TS_DOCUMENT_CONFIRMATION_MSG()}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteFile()}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />
            </div>
        );
    }
}
export default EditClientJobCatalog;