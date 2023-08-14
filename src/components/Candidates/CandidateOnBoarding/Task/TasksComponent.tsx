import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import React from "react";
import { MyCommandCell } from "./WFCells";
import { CustomHeaderActionCell } from "./GlobalActions";
import {
  CellRender,
  GridNoRecord,
} from "../../../Shared/GridComponents/CommonComponents";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import Input from "reactstrap/lib/Input";
import { includes } from "lodash";
import {
  dateFormatter,
  errorToastr,
  successToastr,
  toLocalDateTime,
  warningToastr,
} from "../../../../HelperMethods";
import axios from "axios";
import {
  REPLACE_OLD_DOC_MSG,
  COMPLETE_ALL_MAND_TASK_VALIDATION_MSG,
  TASK_DOCUMENT_UPLOADED_SUCCESS_MSG,
  TASK_DOCUMENT_DELETED_SUCCESS_MSG,
  APPROVED_TASK_MSG,
  UNDER_REVIEW_TASK_MSG,
  UNDER_REVIEW_TASK_CONFIRMATION_MSG,
  APPROVED_TASK_CONFIRMATION_MSG,
  REMOVE_TASK_CONFIRMATION_MSG,
  REMOVE_DOCUMENT_CONFIRMATION_MSG,
  SUBMIT_TASK_CONFIRMATION_MSG,
  SUBMIT_TASK_MSG,
  PLEASE_UPLOAD_FILE,
  PLEASE_UPLOAD_VALID_FILE,
  PLEASE_UPLOAD_FILE_OF_SIZE,
  FILE_ALREADY_UPLOADED,
  NOT_DOWNLOADABLE,
  TASK_WARNING_MSG,
  SAVE_UNSAVED_INTERVIEW_RESULT,
  SUBMIT_ONBOARD_MSG,
  SUBMIT_ONBOARD_SUCCESS_MSG,
} from "../../../Shared/AppMessages";
import {
  allowedFileExtentions,
  allowedMymeTypes,
  CandSubOnBoardTaskStatusIds,
  allowedFileSize,
  isRoleType,
  AuthRoleType,
  CandSubStatusIds,
  TaskActions,
  SKIP_ONBOARDING_TASK_APPROVAL,
  SettingCategory,
} from "../../../Shared/AppConstants";
import "./TasFile.css";
import { ErrorComponent, kendoLoadingPanel } from "../../../ReusableComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { Dialog } from "@progress/kendo-react-dialogs";
import TaskHistory from "./TaskHistory";
import ClientAdminDataService from '../../../Admin/ClientAdmin/Service/DataService';
import _ from "lodash";

export interface TasksComponentProps {
  candSubmissionId?: string;
  reqId?: string;
  interviewId?: string;
  interviewStatusId?: any;
  getAllTaskData?: any;
  getCandidateSubmissionDetails?: any;
  candidateId?: any;
  status?: any;
  statusIntId?: any;
  statusId?: any;
  eventName?: any;
  candidateTaskUpdate?: any;
  clientId?: string;
}

export interface TasksComponentState {
  data?: any;
  skipOnboardingTask?: any;
  showLoader?: any;
  selectedIds: any;
  uploadedFiles: any;
  originalData: any;
  isVendorRole?: boolean;
  showError?: boolean;
  ShowConfirmationModal?: boolean;
  selectedItems: any;
  onSubmit: boolean;
  sendCredetialEnabled?: boolean;
  ShowUnderReviewModal?: boolean;
  ShowApproveModal?: boolean;
  ifForApproveSelected?: boolean;
  ifForUnderReviewSelected?: boolean;
  showSubmitRowModal?: boolean;
  ShowRemoveModal?: boolean;
  ShowRemoveDocumentModal?: boolean;
  dataItemForRemove?: any;
  propsToRemoveDoc?: any;
  showTaskHistoryModal?: any;
  showUnSavedTasksModal?: boolean;
  showSubmitModal?: boolean;
}

class TasksComponent extends React.Component<
  TasksComponentProps,
  TasksComponentState
> {
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  editField = "inEdit";
  CustomHeaderActionCellTemplate;
  CommandCell;
  action: string;
  actionId: string;
  statusId: string;
  eventName: string;
  subBillRateId: string;
  dataItem: any;
  ReplaceOnYes: any;
  originalData = [];
  isSubmit: boolean;
  hasUnsavedData = [];
  uploadControl: HTMLInputElement;
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      data: [],
      selectedIds: [],
      selectedItems: [],
      uploadedFiles: [],
      originalData: [],
      isVendorRole: isRoleType(AuthRoleType.Vendor),
      showError: false,
      ShowConfirmationModal: false,
      onSubmit: false,
      sendCredetialEnabled: false,
      ifForUnderReviewSelected: false,
      ifForApproveSelected: false,
      ShowRemoveModal: false,
    };
  }

  componentDidMount() {
    this.getAllTasks();
    this.getClientSetting();
  }

  initializeActionCell = () => {
    this.CommandCell = MyCommandCell({
      checkStatus: this.props.status,
      upload: this.uploadDocument,
      add: this.createNewTask,
      discard: this.discard,
      update: this.updateTask,
      cancel: this.cancel,
      editField: this.editField,
      candSubmissionId: this.props.candSubmissionId,
      handleActionClick: this.handleActionClick,
      deleteNew: this.removeTask,
      isVendorRole: this.state.isVendorRole,
      warning: this.warningOnUpdateDoc,
      statusIntId: this.props.statusIntId,
      controlClick: this.controllClick,
    });
  };
  controllClick = (data) => {
    this.dataItem = data;
    this.uploadControl.click();
  };
  warningOnUpdateDoc = () => {
    this.setState({ ShowConfirmationModal: true });
  };

  getAllTasks = () => {
    this.setState({ showLoader: true });
    axios
      .get(
        `/api/candidates/candsubonboardingtask?$filter=canSubmissionId eq ${this.props.candSubmissionId}`
      )
      .then((res) => {
        this.setState(
          { showLoader: false, data: [...res.data], originalData: res.data },
          () => this.props.getAllTaskData(this.state.data)
        );
      });

    return this.state.data;
  };

  getClientSetting = () => {
    this.setState({ showLoader: true })
    ClientAdminDataService.getClientSetting(this.props.clientId).then(res => {
      const settings = res.data.filter(
        (i) => i.name ==SettingCategory.CANDIDATE
      )[0];
      if(settings && settings.settings){
      const result = settings.settings.filter(
        (i) => i.settingCode ==SKIP_ONBOARDING_TASK_APPROVAL
      );
      if (result.length > 0) {
        this.setState({ skipOnboardingTask: result[0].value });
      }
    }
    })
  };

  createNewTask = (dataItem, unsaved?) => {
    this.setState({ showLoader: true });
    if (
      (dataItem.candDocuments != undefined &&
        dataItem.candDocuments.length > 0 &&
        dataItem.name != undefined) ||
      (!this.state.isVendorRole &&
        dataItem.name != "" &&
        dataItem.name != undefined)
    ) {
      let data = {
        canSubmissionId: this.props.candSubmissionId,
        name: dataItem.name,
        candidateOnboardingDefaultId: "",
        documentTypeId: "",
        validFrom:
          dataItem.validFrom != null &&
            dataItem.validFrom != undefined &&
            dataItem.validFrom != ""
            ? toLocalDateTime(new Date(dataItem.validFrom))
            : null,
        validTo:
          dataItem.validTo != null &&
            dataItem.validTo != undefined &&
            dataItem.validTo != ""
            ? toLocalDateTime(new Date(dataItem.validTo))
            : null,
        //default values
        isMandatory: false,
        isValidToMandatory: false,
        isValidity: false,
        isMultipleDoc: false,
        isDocumentMandatory: false,
      };
      axios
        .post("/api/candidates/candsubonboardingtask", JSON.stringify(data))
        .then((res) => {
          dataItem.candSubOnboardingTaskId = res.data;
          this.upload(dataItem);
          this.setState({ showSubmitModal: unsaved });
          //this.props.getCandidateSubmissionDetails();
        });
    } else {
      this.setState({ showError: true, showLoader: false });
      if (this.state.isVendorRole) {
        errorToastr(PLEASE_UPLOAD_FILE);
      }
    }
  };

  updateTask = (dataItem, unsaved?) => {
    if (
      //(dataItem.candDocuments != undefined &&
      //  dataItem.candDocuments.length > 0) ||

      // this.state.isVendorRole && (dataItem.candDocuments != undefined &&
      //     dataItem.candDocuments.length > 0) ||
      // (!this.state.isVendorRole &&
      (dataItem.name != "" &&
        dataItem.name != undefined)
    ) {
      if (!dataItem.isValidity && !dataItem.isValidToMandatory && !dataItem.isDocumentMandatory) {  //all false
        return this.updateTaskApi(dataItem, unsaved);
      } else if (
        dataItem.isValidity &&   //start true and end false and is doc false
        dataItem.validFrom != undefined &&
        dataItem.validFrom != null &&
        !dataItem.isValidToMandatory &&
        !dataItem.isDocumentMandatory
      ) {
        return this.updateTaskApi(dataItem, unsaved);
      } else if (
        dataItem.isValidToMandatory && //end true and start false and is doc false
        dataItem.validTo != undefined &&
        dataItem.validTo != null &&
        !dataItem.isValidity &&
        !dataItem.isDocumentMandatory
      ) {
        return this.updateTaskApi(dataItem, unsaved);
      } else if (
        dataItem.isValidToMandatory && //start and end true and is doc false
        dataItem.validTo != undefined &&
        dataItem.validTo != null &&
        dataItem.isValidity &&
        dataItem.validFrom != undefined &&
        dataItem.validFrom != null &&
        !dataItem.isDocumentMandatory
      ) {
        return this.updateTaskApi(dataItem, unsaved);
      } else if (dataItem.isValidToMandatory && //all true
        dataItem.validTo != undefined &&
        dataItem.validTo != null &&
        dataItem.isValidity &&
        dataItem.validFrom != undefined &&
        dataItem.validFrom != null &&
        dataItem.isDocumentMandatory &&
        dataItem.candDocuments.length > 0
      ) {
        return this.updateTaskApi(dataItem, unsaved);
      } else if (!dataItem.isValidToMandatory && //start and end false and is doc true
        !dataItem.isValidity &&
        dataItem.isDocumentMandatory &&
        dataItem.candDocuments.length > 0
      ) {
        return this.updateTaskApi(dataItem, unsaved);
      } else if (!dataItem.isValidToMandatory && //end false and start and is doc true
        dataItem.isValidity &&
        dataItem.validFrom != undefined &&
        dataItem.validFrom != null &&
        dataItem.isDocumentMandatory &&
        dataItem.candDocuments.length > 0
      ) {
        return this.updateTaskApi(dataItem, unsaved);
      } else if (dataItem.isValidToMandatory && //start false and end and is doc true
        dataItem.validTo != undefined &&
        dataItem.validTo != null &&
        !dataItem.isValidity &&
        dataItem.isDocumentMandatory &&
        dataItem.candDocuments.length > 0
      ) {
        return this.updateTaskApi(dataItem, unsaved);
      }
      else {
        this.setState({ showError: true });
      }
      // } else {
      //   if (this.state.isVendorRole) {
      //     errorToastr(PLEASE_UPLOAD_FILE);
      //   }
    }
  };

  updateTaskApi = (dataItem, unsaved?) => {
    let data = {
      canSubmissionId: this.props.candSubmissionId,
      name: dataItem.name,
      candidateOnboardingDefaultId: dataItem.candidateOnboardingDefaultId,
      documentTypeId: "",
      isMandatory: dataItem.isMandatory,
      isValidToMandatory: dataItem.isValidToMandatory,
      isValidity: dataItem.isValidity,
      isDocumentMandatory: dataItem.isDocumentMandatory,
      validFrom:
        dataItem.validFrom != null &&
          dataItem.validFrom != undefined &&
          dataItem.validFrom != ""
          ? toLocalDateTime(new Date(dataItem.validFrom))
          : null,
      validTo:
        dataItem.validTo != null &&
          dataItem.validTo != undefined &&
          dataItem.validTo != ""
          ? toLocalDateTime(new Date(dataItem.validTo))
          : null,
      isMultipleDoc: dataItem.isMultipleDoc,
      candSubOnboardingTaskId: dataItem.candSubOnboardingTaskId,
    };
    this.setState({ showLoader: true });
    axios
      .put("/api/candidates/candsubonboardingtask", JSON.stringify(data))
      .then((res) => {
        this.upload(dataItem);
        this.setState({ showSubmitModal: unsaved });
        //this.props.getCandidateSubmissionDetails();
      });
  };
  removeTask = (dataItem) => {
    if (dataItem.candSubOnboardingTaskId ==undefined) {
      const data = [...this.state.data];
      data.splice(-1, 1);
      this.setState({ data });
    } else {
      this.setState({ ShowRemoveModal: false, showLoader: true });
      axios
        .delete(
          `/api/candidates/candsubonboardingtask/${dataItem.candSubOnboardingTaskId}`
        )
        .then((res) => {
          this.getAllTasks();
        });
    }
  };

  cancel = (dataItem) => {
    const originalItem = this.state.originalData.find(
      (p) => p.candSubOnboardingTaskId ==dataItem.candSubOnboardingTaskId
    );
    const data = this.state.data.map((item) =>
      item.candSubOnboardingTaskId ==originalItem.candSubOnboardingTaskId
        ? originalItem
        : item
    );
    this.setState({ data, showError: false });
  };

  discard = (dataItem) => {
    let data = this.state.data.map((i) =>
      i ==dataItem
        ? Object.assign({}, (i = { inEdit: true, Discontinued: false }))
        : i
    );
    this.setState({ data: data, showError: false });
  };

  itemChange = (event) => {
    const data = this.state.data.map((item) =>
      item.candSubOnboardingTaskId ==event.dataItem.candSubOnboardingTaskId
        ? { ...item, [event.field]: event.value }
        : item
    );
    this.setState({ data });
  };

  addNewTask = () => {
    const newDataItem = {
      inEdit: true,
      isMandatory: false,
      isValidToMandatory: false,
      isValidity: false,
      isDocumentMandatory: false,
      Discontinued: false,
      isMultipleDoc: false,
      candSubOnboardingTaskIntId: this.generateId(this.state.data),
    };

    this.setState(
      {
        data: [...this.state.data, newDataItem],
      },
      () => {
        if (document.getElementsByName("ValidFrom").length > 0) {
          let a = document.getElementsByName("ValidFrom");
          let b = document.getElementsByName("ValidTo");

          for (let i = 0; i < a.length; i++) {
            document.getElementsByName("ValidFrom")[i]["disabled"] = true;
            document.getElementsByName("ValidTo")[i]["disabled"] = true;
          }
        }
      }
    );
  };

  generateId = (data) => {
    return (
      data.reduce(
        (acc, current) =>
          Math.max(
            acc,
            isNaN(current.candSubOnboardingTaskIntId)
              ? 0
              : current.candSubOnboardingTaskIntId
          ),
        0
      ) + 1
    );
  };

  uploadDocument = (event, dataItem) => {
    let candDocuments = [];
    event.preventDefault();
    if (event.target.files.length > 0) {
      if (event.target.files[0].size <= allowedFileSize) {
        Array.from(event.target.files).forEach((file: any) => {
          let isfileValid = false;
          if (includes(allowedMymeTypes, file.type)) {
            isfileValid = true;
          } else if (file.type=="") {
            if (includes(allowedFileExtentions, file.name.split(".")[1])) {
              isfileValid = true;
            }
          }

          const newDataItem = {
            documentName: file.name.split(".")[0],
            fileName: file.name,
            file: file,
            inEdit: true,
            isFileValid: isfileValid,
            docTypeId: null,
            fileType: file.type,
          };
          candDocuments.push(newDataItem);
        });
        if (candDocuments[0].isFileValid) {
          const data = this.state.data.map((item, index) =>
            item.candSubOnboardingTaskId ==dataItem.candSubOnboardingTaskId
              ? dataItem.isMultipleDoc
                ? {
                  ...item,
                  ["candDocuments"]: item.candDocuments.concat(candDocuments),
                }
                : { ...item, ["candDocuments"]: candDocuments }
              : item
          );

          this.setState({ data });
        } else {
          errorToastr(PLEASE_UPLOAD_VALID_FILE);
        }
      } else {
        errorToastr(`${PLEASE_UPLOAD_FILE_OF_SIZE} ${allowedFileSize} KB`);
      }
    }
  };

  upload = (dataItem) => {
    let checkNewFile =
      dataItem.candDocuments != undefined
        ? dataItem.candDocuments.filter((i) => i.candDocumentsId ==undefined)
        : [];
    if (checkNewFile.length > 0) {
      let formData = new FormData();
      dataItem.candDocuments.map((item) => {
        formData.append("FormFiles", item.file);
      });
      formData.append("candidateId", this.props.candidateId);
      formData.append("taskName", dataItem.name);
      formData.append("CandSubOnboardTaskId", dataItem.candSubOnboardingTaskId);
      formData.append("isMultiple", dataItem.isMultipleDoc);
      axios
        .post(`/api/candidates/canddocuments`, formData)
        .then((response) => response)
        .then((data) => {
          dataItem.inEdit = false;
          successToastr(TASK_DOCUMENT_UPLOADED_SUCCESS_MSG);
          dataItem.inEdit = undefined;
          this.getAllTasks();
        });
    } else {
      this.getAllTasks();
      dataItem.inEdit = undefined;

      if (
        dataItem.candDocument != undefined &&
        dataItem.candDocuments.length > 0
      ) {
        successToastr(FILE_ALREADY_UPLOADED);
      }
      return false;
    }
  };

  candidateTaskUpdate = (successMsg, modal, props?, statusIntId?, action?) => {
    this.setState({ showLoader: true });

    const data = {
      candSubmissionId: this.props.candSubmissionId,
      candSubOnboardingTaskIds: this.dataItem
        ? [this.dataItem.candSubOnboardingTaskId]
        : this.state.selectedIds,
      statusIntId: statusIntId,
      statusId:
        this.props.status=="Onboarding Submitted"
          ? "448df2b6-a438-4e0c-bf5f-778dc2c13368"
          : this.props.statusId,
      eventName:
        this.props.status=="Onboarding Submitted"
          ? "PendingCredentialing"
          : this.props.eventName,
      actionName: action,
    };
    axios
      .put("api/candidates/candsubonboardingtask/status", JSON.stringify(data))
      .then((res) => {
        successToastr(successMsg);
        this.props.getCandidateSubmissionDetails();
        this.getAllTasks();
      });
    // close the modal
    let change = {};
    change[modal] = false;
    this.setState(change);
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
    this.state.selectedIds.push(dataItem.candSubOnboardingTaskId);
    this.action = action;
    action =="Edit"
      ? this.setState({
        data: this.state.data.map((item) =>
          item.candSubOnboardingTaskIntId ==
            dataItem.candSubOnboardingTaskIntId
            ? { ...item, inEdit: true }
            : item
        ),
      })
      : action =="Remove"
        ? this.setState({ ShowRemoveModal: true, dataItemForRemove: dataItem })
        : action =="Under Review"
          ? this.setState({ ShowUnderReviewModal: true })
          : action =="Approve"
            ? this.setState({ ShowApproveModal: true })
            : action =="Submit"
              ? this.setState({ showSubmitRowModal: true })
              : action =="History"
                ? this.setState({
                  showTaskHistoryModal: true,
                  dataItemForRemove: dataItem,
                })
                : console.log("");
  };

  selectionChange = (event) => {
    var checked = event.syntheticEvent.target.checked;
    let ids = this.state.selectedIds;
    let selectedItems = this.state.selectedItems;
    const data = this.state.data.map((item) => {
      if (
        item.candSubOnboardingTaskId ==event.dataItem.candSubOnboardingTaskId
      ) {
        item.selected = !event.dataItem.selected;
        if (checked==true) {
          ids.push(item.candSubOnboardingTaskId);
          if (item["candDocuments"] != undefined) {
            selectedItems = [...selectedItems, ...item["candDocuments"]];
          }
        } else if (checked==false) {
          ids = ids.filter((o) => o !=item.candSubOnboardingTaskId);
          if (
            item.candDocuments != undefined &&
            item.candDocuments.length > 0
          ) {
            selectedItems = selectedItems.filter(
              (o) => o.candDocumentsId != item.candDocuments[0].candDocumentsId
            );
          }
        }
      }

      return item;
    });
    this.setState(
      { data, selectedIds: ids, selectedItems: selectedItems },
      () => this.shouldSendBtnEnable(this.state.data)
    );
  };

  headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    let ids = [];
    let selectedItems = [];
    const data = this.state.data.map((item) => {
      if (checked==true) {
        ids.push(item.candSubOnboardingTaskId);
        selectedItems = [...selectedItems, ...item["candDocuments"]];
      }
      item.selected = checked;
      return item;
    });
    this.setState(
      { data, selectedIds: ids, selectedItems: selectedItems },
      () => this.shouldSendBtnEnable(this.state.data)
    );
  };

  getSelectedItems = (open) => {
    // used as Ref in onboarding (Parent Component)
    return {
      shouldOpen: this.state.sendCredetialEnabled,
      selectedItems: this.state.selectedItems,
      selectedIds: this.state.selectedIds,
    };
  };

  updateState = (keyword, props) => {
    const data = this.state.data.map((item) =>
      item.candSubOnboardingTaskIntId ==
        props.dataItem.candSubOnboardingTaskIntId
        ? { ...item, [props.field]: keyword }
        : item
    );
    this.setState({ data });
  };

  downloadFile = (filePath, key, props) => {
    if (filePath ==undefined) {
      errorToastr(NOT_DOWNLOADABLE);
    } else {
      axios
        .get(`/api/candidates/documents/download?filePath=${key}`)
        .then((res: any) => {
          if (res) {
            let fileExt = filePath.split(".")[1].toLowerCase();
            let fileType;
            if (fileExt=="jpg" || fileExt=="png" || fileExt=="jpeg") {
              fileType = "image";
            } else {
              fileType = "application";
            }
            const linkSource = `data:${fileType}/${fileExt};base64,${res.data}`;
            const downloadLink = document.createElement("a");
            let fileName = filePath.split("/")[1];

            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          }
        });
    }
  };

  removeDocument = (dataItem, props) => {
    if (dataItem.candDocumentsId ==undefined) {
      let filesAfterDeletion = props.dataItem.candDocuments.filter(
        (i) => i.documentName != dataItem.documentName
      );
      let data = this.state.data.map((i) =>
        i ==props.dataItem
          ? Object.assign({}, i, (i.candDocuments = filesAfterDeletion))
          : i
      );
      this.setState({ data: data, ShowRemoveDocumentModal: false });
    } else {
      axios
        .put(`/api/candidates/documents/${dataItem.candDocumentsId}`)
        .then((res: any) => {
          if (res.data) {
            this.setState({ ShowRemoveDocumentModal: false });
            successToastr(TASK_DOCUMENT_DELETED_SUCCESS_MSG);
            this.getAllTasks();
          }
        });
    }
  };

  InputField = (props) => {
    const { dataItem, field } = props;
    return (
      <td contextMenu={"Task"}>
        {dataItem.inEdit &&
          (dataItem.candOnboardDefaultTaskId ==null ||
            dataItem.candOnboardDefaultTaskId ==undefined) &&
          !this.state.isVendorRole ? ( //Vendor permission will be added here
          <div className="my-task-desciption">
            <Input
              value={dataItem[field]}
              onChange={(e) => this.updateState(e.target.value, props)}
              maxLength={100}
            />
            {this.state.showError &&
              (dataItem.name =="" || dataItem.name ==undefined) && (
                <ErrorComponent />
              )}
          </div>
        ) : (
          <div
            className={
              dataItem.isMandatory
                ? "required  my-task-desciption"
                : "my-task-desciption"
            }
            title={dataItem[field]}
          >
            {dataItem[field]}
          </div>
        )}
      </td>
    );
  };

  OnFormaDataSubmit = () => {
    // used as Ref in onboaeding (Parent Component)
    // isvalidToMandatory && (!validto) || isValidity && (!validFrom)
    let hasUnsavedData = this.state.data.filter((i) => i.inEdit==true);
    if (hasUnsavedData.length > 0) {
      var invalidResults = hasUnsavedData.filter(
        (o) =>
          o.name==null ||
          o.name==undefined ||
          (this.state.isVendorRole && o.candDocuments==undefined) ||
          (this.state.isVendorRole && o.candDocuments.length==0) ||
          (o.isValidity && !o.validFrom) ||
          (o.isValidToMandatory && !o.validTo)
      );
      if (invalidResults !=null && invalidResults.length > 0) {
        warningToastr(TASK_WARNING_MSG);
        this.setState({ showUnSavedTasksModal: false, showError: true });
        return false;
      } else {
        this.hasUnsavedData = hasUnsavedData;
        this.setState({ showUnSavedTasksModal: true });
      }
    } else {
      return this.checkMandatoryValidation();
    }
  };

  checkMandatoryValidation = () => {
    let isMandatory = this.state.data.filter((i) => i.isMandatory);
    let haveData =
      isMandatory.length > 0 &&
      isMandatory.filter((i) => i.isDocumentMandatory && i.candDocuments.length ==0 || i.isValidity && !i.validFrom || i.isValidToMandatory && !i.validTo);
    if (haveData.length > 0) {
      this.setState({ onSubmit: true });
      return false;
    } else {
      this.setState({ onSubmit: false });
      return true;
    }
  };

  SaveTasks = async () => {
    this.setState({ showLoader: true });
    if (this.hasUnsavedData !=null && this.hasUnsavedData.length > 0) {
      let resultTotalCount = this.hasUnsavedData.length;
      let resultCount = 0;
      for await (var tasks of this.hasUnsavedData) {
        if (tasks.candSubOnboardingTaskId) {
          await this.updateTask(tasks, true);
        } else {
          await this.createNewTask(tasks, true);
        }
        resultCount = resultCount + 1;
      }

      if (resultCount==resultTotalCount) {
        this.setState({ showLoader: false });
      }
    }
    this.setState({ showUnSavedTasksModal: false }, () => {
      this.hasUnsavedData = [];
      this.checkMandatoryValidation();
    });
  };

  render() {
    this.initializeActionCell();
    const { data, showLoader, isVendorRole: vendor } = this.state;
    this.CustomHeaderActionCellTemplate = CustomHeaderActionCell(
      this.addNewTask,
      () => {
        this.setState({ ShowUnderReviewModal: true });
        this.action = TaskActions.UNDERREVIEW;
        this.dataItem = null;
      },
      () => {
        this.setState({ ShowApproveModal: true });
        this.action = TaskActions.APPROVE;
        this.dataItem = null;
      },
      this.state.ifForApproveSelected,
      this.state.ifForUnderReviewSelected,
      this.state.isVendorRole,
      this.props.statusIntId
    );
    return (
      <div className="row mt-3 mt-md-0">
        <div className="container-fluid" id="viewOnboarding">
          <div className="cand-bill-rate" id="RoundeGrid-rate">
            {showLoader && kendoLoadingPanel}
            {!showLoader && data && (
              <Grid
                data={data}
                onItemChange={this.itemChange}
                editField={this.editField}
                expandField="expanded"
                className="kendo-grid-custom lastchild"
                selectedField="selected"
                onSelectionChange={this.selectionChange}
                onHeaderSelectionChange={this.headerSelectionChange}
              >
                <GridNoRecords>{GridNoRecord(showLoader)}</GridNoRecords>
                {this.props.statusIntId <
                  CandSubStatusIds.ASSIGNMENTCREATED && (
                    <GridColumn
                      field="selected"
                      width="50px"
                      headerSelectionValue={
                        data &&
                        data.findIndex(
                          (dataItem) => dataItem.selected ==false
                        ) ==-1
                      }
                    />
                  )}
                <GridColumn
                  field="name"
                  title="Task"
                  width="250"
                  cell={this.InputField}
                />
                <GridColumn
                  field="candDocuments"
                  title="Document"
                  width="250"
                  cell={(props) => {
                    const { dataItem, field } = props;
                    const dataValue = dataItem[field];
                    return (
                      <td contextMenu={"Document"}>
                        {dataValue != null &&
                          dataValue != undefined &&
                          dataValue.map((i) => (
                            <div className="my-task-desciption">
                              <span
                                className={"fileName"}
                                style={{
                                  marginLeft: "2px",
                                }}
                              >
                                <span
                                  className="text-underline text-underline-ellipse"
                                  title="View Document"
                                  onClick={() =>
                                    this.downloadFile(i.filePath, i.key, props)
                                  }
                                >
                                  {i.documentName}{" "}
                                </span>
                                {((this.state.isVendorRole &&
                                  dataItem.statusIntId ==
                                  CandSubOnBoardTaskStatusIds.PENDINGSUBMISSION) ||
                                  (!this.state.isVendorRole &&
                                    (dataItem.statusIntId ==
                                      CandSubOnBoardTaskStatusIds.PENDINGSUBMISSION ||
                                      dataItem.statusIntId ==
                                      CandSubOnBoardTaskStatusIds.SUBMITTED))) && (
                                    <span
                                      onClick={() =>
                                        this.setState({
                                          ShowRemoveDocumentModal: true,
                                          dataItemForRemove: i,
                                          propsToRemoveDoc: props,
                                        })
                                      }
                                      className="filenamecross"
                                    >
                                      <FontAwesomeIcon
                                        icon={faTimesCircle}
                                        className={"nonactive-icon ml-1 mr-2"}
                                      />
                                    </span>
                                  )}
                              </span>
                            </div>
                          ))}
                        {dataItem.inEdit && this.state.showError &&
                          dataItem.isDocumentMandatory &&
                          (dataItem.candDocuments.length <= 0) && (
                            <ErrorComponent message="Document is required" />
                          )}
                      </td>
                    );
                  }}
                  editable={false}
                />
                <GridColumn
                  field="validFrom"
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
                          <div className="my-task-desciption">
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
                              required={
                                dataItem.isMandatory && vendor ? true : false
                              }
                            />

                            {this.state.showError &&
                              dataItem.isValidity &&
                              (dataItem.validFrom ==null ||
                                dataItem.validFrom ==undefined) && (
                                <ErrorComponent />
                              )}
                          </div>
                        ) : (
                          dataValue
                        )}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  field="validTo"
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
                          <div className="my-task-desciption">
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
                            {this.state.showError &&
                              dataItem.isValidToMandatory &&
                              (dataItem.validTo ==null ||
                                dataItem.validTo ==undefined) && (
                                <ErrorComponent />
                              )}
                          </div>
                        ) : (
                          dataValue
                        )}
                      </td>
                    );
                  }}
                />
                <GridColumn
                  field="status"
                  title="Status"
                  cell={(props) => (
                    <td contextMenu="Status">
                      <div className="my-task-desciption">
                        {props.dataItem.status}
                      </div>
                    </td>
                  )}
                  editable={false}
                />

                <GridColumn
                  title=""
                  width="100px"
                  sortable={false}
                  cell={this.CommandCell}
                  headerCell={this.CustomHeaderActionCellTemplate}
                />
              </Grid>
            )}
            {this.state.onSubmit && (
              <ErrorComponent message={COMPLETE_ALL_MAND_TASK_VALIDATION_MSG} />
            )}
            <ConfirmationModal
              message={REPLACE_OLD_DOC_MSG}
              showModal={this.state.ShowConfirmationModal}
              handleYes={() => {
                this.uploadControl.click();
                this.setState({ ShowConfirmationModal: false });
              }}
              handleNo={() => {
                this.setState({ ShowConfirmationModal: false });
              }}
            />
            <ConfirmationModal
              message={UNDER_REVIEW_TASK_CONFIRMATION_MSG}
              showModal={this.state.ShowUnderReviewModal}
              handleYes={() => {
                this.candidateTaskUpdate(
                  UNDER_REVIEW_TASK_MSG,
                  "ShowUnderReviewModal",
                  null,
                  CandSubOnBoardTaskStatusIds.UNDERREVIEW,
                  this.action
                );
              }}
              handleNo={() => {
                this.setState({ ShowUnderReviewModal: false });
              }}
            />
            <ConfirmationModal
              message={REMOVE_TASK_CONFIRMATION_MSG}
              showModal={this.state.ShowRemoveModal}
              handleYes={() => {
                this.removeTask(this.state.dataItemForRemove);
              }}
              handleNo={() => {
                this.setState({ ShowRemoveModal: false });
              }}
            />
            <ConfirmationModal
              message={REMOVE_DOCUMENT_CONFIRMATION_MSG}
              showModal={this.state.ShowRemoveDocumentModal}
              handleYes={() => {
                this.removeDocument(
                  this.state.dataItemForRemove,
                  this.state.propsToRemoveDoc
                );
              }}
              handleNo={() => {
                this.setState({ ShowRemoveDocumentModal: false });
              }}
            />
            <ConfirmationModal
              message={APPROVED_TASK_CONFIRMATION_MSG}
              showModal={this.state.ShowApproveModal}
              handleYes={() => {
                this.candidateTaskUpdate(
                  APPROVED_TASK_MSG,
                  "ShowApproveModal",
                  null,
                  CandSubOnBoardTaskStatusIds.APPROVED,
                  this.action
                );
                this.setState({ ShowApproveModal: false });
              }}
              handleNo={() => {
                this.setState({ ShowApproveModal: false });
              }}
            />
            <ConfirmationModal
              message={SUBMIT_TASK_CONFIRMATION_MSG}
              showModal={this.state.showSubmitRowModal}
              handleYes={() => {
                this.candidateTaskUpdate(
                  SUBMIT_TASK_MSG,
                  "showSubmitRowModal",
                  null,
                  CandSubOnBoardTaskStatusIds.SUBMITTED,
                  this.action
                );
                this.setState({ showSubmitRowModal: false });
              }}
              handleNo={() => {
                this.setState({ showSubmitRowModal: false });
              }}
            />
            {this.state.showTaskHistoryModal && (
              <div id="hold-position">
                <Dialog
                  className="col-12 For-all-responsive-height"
                  width="100%"
                >
                  <TaskHistory
                    taskName={this.state.dataItemForRemove.name}
                    taskId={
                      this.state.dataItemForRemove.candSubOnboardingTaskId
                    }
                    candidateName={""}
                    reqNumber={""}
                    handleClose={() =>
                      this.setState({ showTaskHistoryModal: false })
                    }
                  />
                </Dialog>
              </div>
            )}

            <ConfirmationModal
              message={SAVE_UNSAVED_INTERVIEW_RESULT}
              showModal={this.state.showUnSavedTasksModal}
              handleYes={async (e) => {
                this.SaveTasks();
              }}
              handleNo={() => {
                this.setState({ showUnSavedTasksModal: false });
              }}
            />
            <ConfirmationModal
              message={SUBMIT_ONBOARD_MSG}
              showModal={this.state.showSubmitModal}
              handleYes={(e) =>
                this.props.candidateTaskUpdate(
                  SUBMIT_ONBOARD_SUCCESS_MSG,
                  "showSubmitModal",
                  null,
                  CandSubOnBoardTaskStatusIds.SUBMITTED
                )
              }
              handleNo={() => {
                this.setState({ showSubmitModal: false });
              }}
            />
          </div>
        </div>
        <input
          id={`${Math.random().toString(36)}`}
          type="file"
          onBeforeInputCapture={(e) => console.log("onBeforeInputCapture", e)}
          onClick={(e) => console.log("onClick ", e)}
          multiple={false}
          accept="image/jpeg,image/png,application/pdf,application/doc,application/docx,application/xls,application/xlsx"
          ref={(ref) => (this.uploadControl = ref)}
          style={{ display: "none" }}
          onChange={(e) => {
            this.uploadDocument(e, this.dataItem);
          }}
        />
      </div>
    );
  }

  private shouldSendBtnEnable(taskList) {
    this.setState({
      sendCredetialEnabled: false,
      ifForApproveSelected: false,
      ifForUnderReviewSelected: false,
    });
    var selectedTasks = taskList.filter((o) => o.selected);
    var selectedForSendCredential = selectedTasks.filter(
      (o) => o.statusIntId != CandSubOnBoardTaskStatusIds.SUBMITTED
    );
    var selectedForSendBack = selectedTasks.filter(
      (o) =>
        o.statusIntId ==CandSubOnBoardTaskStatusIds.SUBMITTED ||
        //o.statusIntId ==CandSubOnBoardTaskStatusIds.PENDINGSUBMISSION ||
        o.statusIntId ==CandSubOnBoardTaskStatusIds.UNDERREVIEW
    );

    var selectedForUnderReview = selectedTasks.filter(
      (o) => o.statusIntId ==CandSubOnBoardTaskStatusIds.SUBMITTED
    );
    var selectedForApprove = selectedTasks.filter(
      (o) => o.statusIntId ==CandSubOnBoardTaskStatusIds.UNDERREVIEW
    );

    var selectedApprovedForNAPA = selectedTasks.filter(
      (o) => o.statusIntId ==CandSubOnBoardTaskStatusIds.APPROVED
    );

    if (selectedTasks.length > 0 && selectedForSendCredential.length ==0) {
      this.setState({ sendCredetialEnabled: true });
    }

    if (selectedTasks.length > 0 && selectedForSendCredential.length > 0) {
      if (selectedForSendBack.length==selectedTasks.length) {
        this.setState({ sendCredetialEnabled: true });
      }
    }

    if (selectedTasks.length > 0 && selectedForUnderReview.length > 0) {
      if (selectedForUnderReview.length ==selectedTasks.length) {
        this.setState({ ifForUnderReviewSelected: true });
      }
    }
    if (selectedTasks.length > 0 && selectedForApprove.length > 0) {
      if (selectedForApprove.length ==selectedTasks.length) {
        this.setState({ ifForApproveSelected: true });
      }
    }
    if (selectedTasks.length > 0 && selectedApprovedForNAPA.length > 0 && this.state.skipOnboardingTask=="true") {
      this.setState({ sendCredetialEnabled: true });
    }
  }
}

export default TasksComponent;
