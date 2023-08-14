import * as React from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { authHeader, dateFormatter, errorToastr, successToastr, toLocalDateTime } from '../../../HelperMethods';
import axios from "axios";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { CustomHeaderActionCell, MyCommandCell } from "./HelperComponent";
import { IDocumentsPortfolioGridState, DocumentsVm } from './IDocumentsPortfolioGridState';
import { IDocumentsPortfolioGridProps } from './IDocumentsPortfolioGridProps';
import includes from 'lodash/includes';
import { ConfirmationModal } from "../ConfirmationModal";
import Skeleton from "react-loading-skeleton";
import TagControl from "../TagControl/TagControl";
import { AuthRoleType, EntityTypeId, isRoleType } from "../AppConstants";
import withValueField from "../withValueField";
import { ErrorComponent } from "../../ReusableComponents";
import { ViewMoreComponent } from "./GlobalAction";
import { CellRender, DetailColumnCell } from "../GridComponents/CommonComponents";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import ConfirmationLetter from "../../Candidates/MakeAnOffer/OfferInformation/ConfirmationLetter";
import { DOCUMENT_INACTIVE_SUCCESS_MSG, INACTIVE_DOCUMENT_CONFIRMATION_MSG } from "../AppMessages";
import DocumentViewer from "../DocumentViewer/DocumentViewer";
import ExcelViewer from "../DocumentViewer/ExcelViewer";
import AuditLog from "../AuditLog/AuditLog";
const defaultItem = { name: "Select", id: null };
const CustomDropDownList = withValueField(DropDownList);
var totalFileCount = 0;
var processedFileCount = 0;
var processedFileCountUpload = 0;
const allowedMymeTypes = ["application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/pdf",
    "image/png",
    "image/jpeg"];

const allowedFileExtentions = ["jpeg", "jpg", "pdf", "xls", "xlsx", "doc", "docx"];

class DocumentsPortfolioGrid extends React.Component<IDocumentsPortfolioGridProps, IDocumentsPortfolioGridState> {
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    editField = "inEdit";
    public isSubmit = false;
    public dataItem: any;
    private originalLevels;
    public confirmationLetter;
    constructor(props: IDocumentsPortfolioGridProps) {
        super(props);
        this.state = {
            data: [],
            documentTypes: [],
            showModal: false,
            isAdminRole: isRoleType(AuthRoleType.SystemAdmin),
            isClientRole: isRoleType(AuthRoleType.Client),
            isVendorRole: isRoleType(AuthRoleType.Vendor)
        };


        this.initializeHeaderCell(false, false);
        this.initializeActionCell();
    }

    componentDidMount() {
        this.getDocumentPortfolio();
        this.getDocumentsType();
    }

    initializeActionCell = () => {
        this.CommandCell = MyCommandCell({
            edit: this.enterEdit,
            view: this.download,
            //add: this.addNew,
            //select:this.select,
            upload: this.upload,
            discard: this.discard,
            update: this.update,
            deleteDoc: this.confirmDelete,
            editField: this.editField,
            handleActionClick: this.handleActionClick,
            candidateId: this.props.candidateId,
            candWfStatus: this.props.candWfStatus,
            isAdminRole: this.state.isAdminRole,
            isClientRole: this.state.isClientRole,
            isVendorRole: this.state.isVendorRole,
        });
    };

    initializeHeaderCell = (canRemove, enableGlobalSave) => {
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
            add: this.select,
            save: this.saveAll,
            removeSelected: this.removeSelected,
            canRemove: canRemove,
            enableSave: enableGlobalSave
        });
    };

    select = (event) => {
        event.preventDefault();
        if (event.target.files.length > 0) {
            this.initializeHeaderCell(false, true);
            Array.from(event.target.files).forEach((file: any) => {
                let isfileValid = false;
                if (includes(allowedMymeTypes, file.type)) {
                    isfileValid = true;
                }
                else if (file.type=="") {
                    if (includes(allowedFileExtentions, file.name.split('.')[1])) {
                        isfileValid = true;
                    }
                }

                const newDataItem: DocumentsVm = {
                    candDocumentsId: undefined,
                    documentName: file.name.split('.')[0],
                    fileName: file.name,
                    candidateFile: file,
                    uploadedDate: new Date(),
                    inEdit: true,
                    isDefault: false,
                    isFileValid: isfileValid,
                    isUploading: false
                };
                this.state.data.push(newDataItem);
            });
            this.setState({ data: this.state.data },
                () => {
                    this.restrictDatesEntry()
                });
        }
    }

    saveAll = () => {
        this.isSubmit = true;
        totalFileCount = 0;
        totalFileCount = this.state.data.filter(x => x.inEdit==true && x.isFileValid==true).length;
        if (this.state.data.filter(x => x.isFileValid==false).length > 0) {
            var elems = document.getElementsByClassName('invalid-row');

            document.querySelectorAll('.invalid-row').forEach((row) => {
                var node = document.createElement("span");
                node.className = "show-text";
                var textnode = document.createTextNode("Invalid file type.");
                node.appendChild(textnode);
                row.previousSibling.appendChild(node);
                // Now do something with my button
            });
            //alert('Invalid file type selected. Please remove row and add valid file again.');
            return false;

        }
        else if (this.state.data.filter(x => x.docTypeId==null).length > 0) {
            this.setState({ data: this.state.data });
            return false;
        }
        else {
            this.state.data.filter(x => x.inEdit==true && x.isFileValid==true).forEach(item => {
                this.upload(item);
            });
        }
    }

    upload = (dataItem) => {
        if (dataItem.isFileValid) {
            if (dataItem.docTypeId==null) {
                this.isSubmit = true;
                this.setState({ data: this.state.data });
                return false;
            }
            else {

                this.setState({ data: this.state.data });
                if (!includes(this.state.data.filter(x => x.inEdit==false).map(x => x.fileName), dataItem.fileName)) {
                    dataItem.isUploading = true;
                    let formData = new FormData();
                    formData.append("documentName", dataItem.documentName);
                    formData.append("candidateFile", dataItem.candidateFile);
                    formData.append("fileName", dataItem.fileName);
                    formData.append("docTypeIntId", dataItem.docTypeIntId);
                    formData.append("candidateId", this.props.candidateId);
                    if(dataItem.validFrom){
                    formData.append("validFrom", (toLocalDateTime(dataItem.validFrom)).toUTCString());
                    }
                    if(dataItem.validTo){
                    formData.append("validTo",(toLocalDateTime(dataItem.validTo)).toUTCString());
                    }
                    const options = {
                        method: "POST",
                        headers: { ...authHeader() },
                        body: formData
                    };
                    this.initializeHeaderCell(false, false);
                    fetch(`/api/candidates/documents`, options)
                        .then(response => response.json())
                        .then(data => {
                            if (data.length==36) {
                                processedFileCountUpload += 1;
                                dataItem.inEdit = false;
                                dataItem.candDocumentsId = data;
                                dataItem.isUploading = false;
                                this.getDocumentPortfolio();
                                this.setState({ data: this.state.data });
                                if (totalFileCount==processedFileCountUpload) {

                                    successToastr('Document(s) uploaded successfully.');
                                    // this.initializeHeaderCell(false, true);
                                }
                            }
                            else {
                                errorToastr('Something went wrong. Please try again.')
                            }
                        });
                }
                else {
                    errorToastr("File already exists. Please select different file or rename to upload!");
                    return false;
                }
                this.initializeActionCell();
            }

        }
        else {
            alert("File type is invalid");
        }

    }

    update = (dataItem) => {
        this.isSubmit = true;
        if (dataItem.docTypeId==null) {
            this.setState({ data: this.state.data });
            return false;
        }
        else {
            const data = {
                candDocumentsId: dataItem.candDocumentsId,
                documentName: dataItem.documentName,
                docTypeId: dataItem.docTypeId,
            };
            axios.put(`/api/candidates/document/`, JSON.stringify(data)).then((res: any) => {
                if (res.data) {
                    dataItem.inEdit = false;
                    this.setState({ data: this.state.data })
                    successToastr('Document updated successfully!');
                }
            });
        }

    }

    download = (filePath) => {
        axios.get(`/api/candidates/documents/download?filePath=${filePath}`).then((res: any) => {
            if (res) {
                let fileExt = filePath.split('.')[1].toLowerCase();
                let fileType;
                if (fileExt=='jpg' || fileExt=='png' || fileExt=='jpeg') {
                    fileType = 'image';
                }
                else {
                    fileType = 'application'
                }
                
                const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
                const downloadLink = document.createElement("a");
                let fileName = filePath.split('/')[1];

                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();

            }
        });
    }

    getDocumentPortfolio = () => {
        var submission = this.props.candSubmissionId;
        var queryParams = '';
        if (submission !="" && submission !=null && submission !=undefined) {
            queryParams = "?candSubmissionId=" + this.props.candSubmissionId
        }
        axios.get(`/api/candidates/${this.props.candidateId}/documents` + queryParams).then((res: any) => {
            if (res) {
                res.data.forEach((doc: DocumentsVm) => {
                    doc.inEdit = false;
                    doc.uploadedDate = new Date(doc.uploadedDate);
                    doc.isFileValid = true;
                    doc.description = doc.description && JSON.parse(doc.description);
                    //doc.status = doc.status;
                });
                this.setState({ data: res.data });
                this.initializeHeaderCell(false, false);
            }
        });
    }

    getDocumentsType = () => {
        axios.get(`/api/candidates/doctype`).then((res: any) => {
            if (res) {
                this.setState({ documentTypes: res.data });
            }
        });
    }

    selectionChange = (event) => {
        event.dataItem.selected = !event.dataItem.selected;
        this.setState({ data: this.state.data });
        let canRemove = this.state.data.filter(x => x.selected==true).length > 0;
        this.initializeHeaderCell(canRemove, this.state.data.length > 0);
    };

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const data = this.state.data.map((item) => {
            item.selected = checked;
            return item;
        });
        this.setState({ data: data });
        let canRemove = this.state.data.filter(x => x.selected==true).length > 0;
        this.initializeHeaderCell(canRemove, this.state.data.length > 0);
    };

    addNew = () => {
        // let levelNo = this.generateLevelNo(this.state.data.wfApprovalLevel);
        const newDataItem: DocumentsVm = {
            candDocumentsId: undefined,
            documentName: "",
            candidateFile: null,
            uploadedDate: new Date(),
            inEdit: true,
            isDefault: false,
            fileCount: 0
        };

        this.state.data.push(newDataItem);
        this.setState({ data: this.state.data });
    };

    enterEdit = (dataItem) => {
        dataItem.inEdit = true;
        dataItem.isFileValid = true;
        this.setState({ data: this.state.data })
    };

    updateItem = (data, item) => {
        let index = data.findIndex((p) => p ==item || (item.order && p.order ==item.order));
        if (index >= 0) {
            data[index] = { ...item };
        }
    };

    handleChange = (e, dataItem: DocumentsVm) => {
        dataItem.documentName = e.target.value;
        this.setState({ data: this.state.data })
        e.target.focus();
    }

    confirmDelete = (dataItem: DocumentsVm) => {
        this.setState({ showModal: true, itemToDelete: dataItem });
    };

    discard = (dataItem) => {
        let index = this.state.data.findIndex((p) => p ==dataItem);
        this.state.data.splice(index, 1);
        this.setState({ data: this.state.data });
        if (this.state.data.filter(x => x.inEdit==true).length==0) {
            this.initializeHeaderCell(false, false);
        }
    };

    delete = (dataItem) => {
        this.discard(dataItem);
        this.setState({ showModal: false });
        axios.put(`/api/candidates/documents/${dataItem.candDocumentsId}`).then((res: any) => {
            if (res.data) {
                processedFileCount += 1;
                if (totalFileCount==processedFileCount) {
                    successToastr('Document(s) deleted successfully!');
                }
                //this.getDocumentPortfolio();
            }
        });
    };

    removeSelected = () => {
        totalFileCount = 0;
        var itemsToDelete = this.state.data.filter(x => x.selected==true);
        if (itemsToDelete.length > 0) {
            totalFileCount = itemsToDelete.length;
            itemsToDelete.forEach(dataItem => {
                this.delete(dataItem);
            });
        }
    };

    itemChange = event => {
        const data = this.state.data.map(item =>
            item.documentName ==event.dataItem.documentName
                ? { ...item, [event.field]: event.value }
                : item
        );

        this.setState({ data });
    };

    updateState = (keyword, props) => {
        // if(keyword.length>50){
        const data = this.state.data.map((item) =>
            item.candDocumentsId ==props.dataItem.candDocumentsId
                ? { ...item, [props.field]: keyword }
                : item
        );
        this.setState({ data: data },
            () => {
                this.restrictDatesEntry()
            });
        // }
    };

    InputField = (props) => {
        const { dataItem, field } = props;
        let max = field=="description" ? 2000 : 50;
        return (
            <td contextMenu="Description">
                {dataItem.inEdit ? (
                    <div className="input-desciption">
                        <input
                            type="text"
                            className="form-control "
                            placeholder=""
                            value={dataItem[field]}
                            maxLength={max}
                            onChange={(event) => {
                                this.updateState(event.target.value, props);
                            }}
                            name="name"
                        />
                        {/* {props.dataItem && props.dataItem[field]&& props.dataItem[field].length >= max && <ErrorComponent message={`${field} should not be greater than ${max} charecters`} />} */}
                    </div>
                ) : (
                    <span
                        title={dataItem[field]}
                    >
                        {dataItem[field]}
                    </span>
                )}
            </td>
        );
    };

    handleActionClick = (
        action,
        actionId,
        rowId,
        nextStateId?,
        eventName?,
        dataItem?
    ) => {
        this.dataItem = dataItem;
        action =="Edit"
            ? this.setState({
                data: this.state.data.map((item) =>
                    item.candDocumentsId ==
                        dataItem.candDocumentsId
                        ? { ...item, inEdit: true }
                        : item
                ),
            },
            () => {
                this.restrictDatesEntry()
            })
            : action =="View"
                ? this.download(dataItem.filePath)
                : action =="Sign"
                    ? this.confirmationLetter.getDocumentPortfolio(dataItem.candDocumentsId)
                    : action =="Show Audit Log"
                        ? this.setState({ showAuditLogModal: true })
                        : console.log("");
    };

    docuemntStatusUpdate = (candDocumentsId) => {
        let data = {
            values: JSON.stringify({
                candDocumentsId: candDocumentsId,
            }),
        };
        this.setState({ showInactivateModal: false })
        axios
            .patch(
                `api/candidates/documents/${candDocumentsId}?statusId=${3}`,
                JSON.stringify(data)
            )
            .then((res) => {
                if (res.data && res.data.isSuccess) {
                    successToastr(DOCUMENT_INACTIVE_SUCCESS_MSG);
                    this.getDocumentPortfolio();
                    this.props.close();
                }
            });
    };

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    restrictDatesEntry=() => {
          if (document.getElementsByName("ValidFrom").length > 0) {
            let a = document.getElementsByName("ValidFrom");
            let b = document.getElementsByName("ValidTo");
  
            for (let i = 0; i < a.length; i++) {
              document.getElementsByName("ValidFrom")[i]["disabled"] = true;
              document.getElementsByName("ValidTo")[i]["disabled"] = true;
            }
          }
    }

    render() {
        console.log("this.state", this.state.data, this.state);
        return (
            <div className="row mt-2">
                <div className="col-12">
                    <div className="createjoborderstep4 createjoborderstep4_new Poup_heighty" id="createjoborderstep">
                        <div className="table-responsive tableShadow">
                            <Grid
                                className="kendo-grid-custom"
                                style={{ height: "auto" }}
                                data={this.state.data}
                                editField="inEdit"
                                onItemChange={this.itemChange}
                                detail={ViewMoreComponent}
                                expandField="expanded"
                                selectedField="selected"
                                onSelectionChange={this.selectionChange}
                                onHeaderSelectionChange={this.headerSelectionChange}

                            >

                                <Column
                                    field="selected"
                                    width="50px"
                                    sortable={false}

                                // headerSelectionValue={
                                //     this.state.data &&
                                //     this.state.data.findIndex((dataItem) => dataItem.selected ==false) ==
                                //         -1
                                // }
                                />

                                <Column
                                    //width="350px"
                                    sortable={false}
                                    field="documentName"
                                    title="Document Name"
                                    cell={this.InputField}
                                // cell={(props) => <input type="text" value={props.dataItem.value} onChange={(event) => this.updateState(props, event.target.value)} />}
                                />

                                <Column
                                    //width="250px"
                                    sortable={false}
                                    title="Document Type"
                                    cell={(props) => {
                                        return (
                                            <td contextMenu="Document Type" id="documenttag-wrap" className={props.dataItem.isFileValid ? '' : 'invalid-row'}>
                                                <CustomDropDownList
                                                    disabled={props.dataItem.inEdit ? false : true}
                                                    className="form-control documenttag-wrap-mobile"
                                                    name={`docTypeId`}
                                                    data={this.state.documentTypes}
                                                    textField="name"
                                                    valueField="id"
                                                    id="docTypeId"
                                                    value={props.dataItem.docTypeId}
                                                    defaultItem={defaultItem}
                                                    onChange={(e) => {
                                                        const docTypeId = e.value.id;
                                                        props.dataItem.docTypeId = docTypeId;
                                                        props.dataItem.docTypeIntId = e.value.candDocTypeIntId
                                                        this.setState({ data: this.state.data },
                                                            () => {
                                                                this.restrictDatesEntry()
                                                            })
                                                    }}
                                                //onChange={(e)=>console.log(e, props.dataItem)}
                                                />
                                                {this.isSubmit && props.dataItem.docTypeId==null && <ErrorComponent />}
                                            </td>
                                        );
                                    }}
                                />
                                <Column
                                    width="115px"
                                    sortable={false}
                                    title="Document Tags"
                                    cell={(props) => {
                                        const value = props.dataItem[props.field];
                                        return (
                                            <td contextMenu="Document Tags" id="documenttag-wrap">
                                                <TagControl defaultText={props.dataItem.candDocumentsId ? "None" : "Save document to add tags."} isTaggingDisabled={!props.dataItem.candDocumentsId} entityTypeId={EntityTypeId.DOCUMENT} entityId={props.dataItem.candDocumentsId}></TagControl>
                                            </td>
                                        );
                                    }}
                                />
                                <Column
                                    field="uploadedDate"
                                    sortable={false}
                                    width="125px"
                                    title="Uploaded Date"
                                    filter="date"
                                    format="{0:d}"
                                    editor="date"
                                    // cell={(props) => {
                                    //     return (
                                    //         // <td contextMenu="Uploaded Date" className="d-flex justify-content-between">
                                    //         //    {Intl.DateTimeFormat("en-US").format(props.dataItem.uploadedDate)}
                                    //         // </td>
                                    //         <td contextMenu="Uploaded Date">
                                    //             {dateFormatter(new Date(props.dataItem.uploadedDate))}
                                    //         </td>
                                    //     );
                                    // }}
                                    cell={(props) => CellRender(props, "Uploaded Date", null, true)}
                                />
                                <Column
                                    field="validFrom"
                                    sortable={false}
                                    width="90px"
                                    title="Valid From"
                                    cell={(props) => {
                                        const { dataItem, field } = props;
                                        const dateValue =
                                            dataItem.validFrom ==null ||
                                                dataItem.validFrom ==undefined
                                                ? null
                                                : new Date(dataItem.validFrom);
                                        const dataValue =
                                            dataItem.validFrom ==null ||
                                                dataItem.validFrom ==undefined
                                                ? "_"
                                                : dateFormatter(dataItem[field]);
                                        return (
                                            <td contextMenu={"Valid From"}>
                                                {dataItem.inEdit ? (
                                                    <div className="my-task-desciption cal-icon-color">
                                                        <DatePicker
                                                            className="form-control"
                                                            format="MM/dd/yyyy"
                                                            name="ValidFrom"
                                                            formatPlaceholder="formatPattern"
                                                            value={dateValue}
                                                            onChange={(e) =>
                                                                this.updateState(e.target.value, props)
                                                            }
                                                            max={
                                                                dataItem.validTo
                                                                    ? new Date(dataItem.validTo)
                                                                    : new Date()
                                                            }
                                                        />
                                                    </div>
                                                ) : (
                                                    dataValue
                                                )}
                                            </td>
                                        );
                                    }}
                                />
                                <Column
                                    field="validTo"
                                    sortable={false}
                                    width="90px"
                                    title="Valid To"
                                    cell={(props) => {
                                        const { dataItem, field } = props;
                                        const dateValue =
                                            dataItem.validTo ==null ||
                                                dataItem.validTo ==undefined
                                                ? null
                                                : new Date(dataItem.validTo);

                                        const dataValue =
                                            dataItem.validTo ==null ||
                                                dataItem.validTo ==undefined
                                                ? "_"
                                                : dateFormatter(dataItem[field]);
                                        return (
                                            <td contextMenu={"Valid To"}>
                                                {dataItem.inEdit ? (
                                                    <div className="my-task-desciption cal-icon-color">
                                                        <DatePicker
                                                            className="form-control"
                                                            format="MM/dd/yyyy"
                                                            name="ValidTo"
                                                            formatPlaceholder="formatPattern"
                                                            value={dateValue}
                                                            onChange={(e) =>
                                                                this.updateState(e.target.value, props)
                                                            }
                                                            min={
                                                                dataItem.validFrom
                                                                    ? new Date(dataItem.validFrom)
                                                                    : new Date()
                                                            }
                                                        />
                                                    </div>
                                                ) : (
                                                    dataValue
                                                )}
                                            </td>
                                        );
                                    }}
                                />
                                <Column
                                    sortable={false}
                                    width="130px"
                                    field="status"
                                    title="Status"
                                    cell={(props) => CellRender(props, "Status")}
                                />
                                <Column
                                    sortable={false}
                                    cell={this.CommandCell}
                                    width="50px"
                                    title="Action"
                                    headerCell={this.CustomHeaderActionCellTemplate}
                                />
                                <Column sortable={false} width="80px" field="expanded" title="View More" cell={this.ExpandCell} />
                            </Grid>
                        </div>
                    </div>
                </div>
                <ConfirmationModal
                    message={"Are you sure you want to delete document?"}
                    showModal={this.state.showModal}
                    handleYes={() => this.delete(this.state.itemToDelete)}
                    handleNo={() => {
                        this.setState({ showModal: false });
                    }}
                />
                <ConfirmationModal
                    message={INACTIVE_DOCUMENT_CONFIRMATION_MSG()}
                    showModal={this.state.showInactivateModal}
                    handleYes={() => this.docuemntStatusUpdate(this.dataItem.candDocumentsId)}
                    handleNo={() => {
                        this.setState({ showInactivateModal: false });
                    }}
                />
                <ConfirmationLetter
                    ref={(instance) => {
                        this.confirmationLetter = instance;
                    }
                    }
                    candSubmissionId={this.props.candSubmissionId}
                    candidateId={this.props.candidateId}
                    vendor={this.props.vendor}
                    updateCandWf={false}
                    close={this.props.close}
                    reqNumber={this.props.reqNumber}
                    jobDetailPage={this.props.jobDetailPage}
                    handleDocStatus={this.props.handleDocStatus}
                />

                {this.state.showAuditLogModal && (
                    <AuditLog
                        candSubmissionId={this.props.candSubmissionId}
                        showDialog={this.state.showAuditLogModal}
                        handleNo={() => {
                        this.setState({ showAuditLogModal: false });
                        }}
                    />
                )}
            </div>
                
        );
    }
}

export default DocumentsPortfolioGrid;
