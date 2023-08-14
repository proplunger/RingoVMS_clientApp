import { faMapPin, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker, DateTimePicker, DateTimePickerChangeEvent, TimePicker } from "@progress/kendo-react-dateinputs";
import { DropDownList, MultiSelect, MultiSelectChangeEvent  } from "@progress/kendo-react-dropdowns";
import {
  faPenAlt,
  faTimesCircle,
  faTrash,
  faPlusCircle,
  faUndo,
  faPencilAlt,
  faSave,
  faPlus,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import auth from "../../Auth";
import * as React from "react";
import BasicSearch from "./BasicSearch";
import {
  AdvanceSearchFieldsReq,
  CandidateWF_Status,
  Candidate_Sub_Status,
  CandSubStatus,
  ClientInvoiceWF_Status,
  UserStatus,
  Client_Status,
  Req_Status,
  Timesheet_Status,
  Expense_Status,
  VendorInvoiceWF_Status,
  VendorInvoice_ServiceType,
  ManageContentLibStatus,
} from "./searchFieldsOptions";
import withValueField from "../../Shared/withValueField";
import axios from "axios";
import { successToastr } from "../../../HelperMethods";
import { Input } from "@progress/kendo-react-inputs";
import Buttons from "./ButtonsCombinations";
import DateSelector from "./FilterFields/DatePicker";
import { filterBy, State, toDataSourceRequestString, toODataString } from "@progress/kendo-data-query";
import { ErrorComponent, KendoFilter } from "../../ReusableComponents";
import { format } from "url";
import { AppPermissions } from "../Constants/AppPermissions";
import { AuthRoleType, isRoleType, isVendorRoleType, RegistrationStatus, roleTypeName, ConfirmStatusIntId } from "../AppConstants";
import _, { debounce } from "lodash";
import NavItem from "reactstrap/lib/NavItem";
const defaultItem = { name: "Select...", id: null };
const CustomDropDownList = withValueField(DropDownList);
const emptyItem = "loading ...";
const pageSize = 10;
const loadingData = [];
while (loadingData.length < pageSize) {
  loadingData.push(emptyItem);
}
let regexFormat = /^[a-zA-Z'\-\. ]*$/;

export interface AdvanceSearchProps {
  // search?: string;
  basicSearchTextValue?: any;
  selectedOption?: any;
  entityType: string;
  onSearchRequisition?: any;
  getSavedSearches?: any;
  edit: boolean;
  reopened: boolean;
  editableData: any;
  reqNo: string;
  reqStatus: string;
  expenseStatus: string;
  location: string;
  position: string;
  division: any;
  positionSelected:any;
  region: any;
  roleName: any;
  roleType: any;
  zone: any;
  shareCandidateStatus:any;
  serviceCategory: any;
  notificationType:any;
  hiringManager: any;
  searchName: any;
  onCloseModal: any;
  searchId: string;
  savedSearches: any;
  startDateFrom: string;
  startDateTo: string;
  endDateTo: string;
  endDateFrom: string;
  clearState: any;
  inputedValue?: any;
  optionChange?: any;
  page: string;
  client: string;
  candidateName?: any;
  candidateFullName?: any;
  userName?: any;
  userRole?: any;
  vendor?: any;
  tier?: any;
  email?: any;
  notificationCategory?: any;
  address1?: any;
  city?: any;
  state?: any;
  clientStatus?: any;
  submittedOn?: any;
  presentationDate?: any;
  startDate?: any;
  endDate?: any;
  validFrom?: any;
  validTo?: any;
  candidatestatus?: any;
  basicSearchData: any;
  advancedSearchData: any;
  totalHours: any;
  //vendor invoicing fields start
  vendorName: any;
  billingPeriodStart: any;
  billingPeriodEnd: any;
  vendorInvoiceStatus: any;
  vendorInvoiceZones: any;
  vendorInvoiceRegions: any;
  vendorInvoicePosition: any;
  hours: any;
  //vendor invoicing fields end
  runDateFrom: any;
  runDateTo: any;
  serviceType: any;
  reason: any;
  tags: any;
  associate: any;
  jobCategory: any;
  data: any;
  type: string;
  eventLogDate: string;
  jobFlow: any;
  clientPosition: any;
  newSearchId?: any;
  daysToExpiration?: number;
  candSubStatus?: any;
  clientIds: any[];
  isReportSearch?: boolean;
  requisitionStatus: any;
  hiringManagers: any;
  locations: any;
  divisions: any;
  ifPinColor?: boolean;
  allClients?: any;
  userRoles?: any;
  selectedActions?: any;
  statuses?: any;
  vendorInvoiceType?: any;
  tsStatuses?: any;
  allFunctionalArea?: any;
  allPriority?: any;
  allRequestType?: any;
  allStatus?: any;
  message?: string;
  startDateTime ?: any;
  endDateTime?: any;
  msgCatValue?: any;
  msgPrioValue?: any;
  createdDateFrom?: any;
  resolutionDateFrom?: any;
  createdDateTo?: any;
  resolutionDateTo?: any;
  eventLogType?: any;
  entityLogType?: any;
  allAssingnTo?: any;
  allQueue?: any;
  contentLibTitle : any;
  contentType: any;
  expDate?: any;
  ContentLibStatus?: any;
  selectedCnfStatus?: any;
  assignStartDate?: any;
  assignEndDate?: any;
  ticketNumber: any;
  ticketTitle: any;
}

export interface AdvanceSearchState {
  division: any;
  location: string;
  region: any;
  roleName: any;
  roleType: any;
  zone: any;
  shareCandidateStatus:any;
  serviceCategory: any;
  notificationType:any;
  position: any;
  hiringManager: any;
  reqNumber: string;
  status: string;
  expenseStatus: string;
  startDateFrom: any;
  startDateTo: any;
  endDateFrom: any;
  endDateTo: any;
  searchName: string;
  filteredArray: any;
  basicSearchTextValue: string;
  fieldNames: any;
  basicSearchData: any;
  selectedOption: string;
  ifPinColor: boolean;
  searchId: string;
  searchNameReq: string;
  divisionsValue: any;
  vendorclientInvoiceData: any[];
  originalvendorclientInvoiceData: any;
  regionValue: any;
  roleNameValue: any;
  userTypeData: any;
  originalUserTypeData: any;
  zoneValue: any;
  serviceCategoryValue: any;
  notificationTypeValue:any;
  hiringManagerValue: any;
  requisitionStatusValue: any;
  clientId: string;
  originalDivision: any;
  originallocations: any;
  originalRegion?: any;
  originalrolname?: any;
  originalZone?: any;
  originalServiceCategory?: any;
  originalNotificationType?:any;
  originalHiringManager?: any;
  locationsValue: any;
  locationsListValue: any;
  positionValue: any;
  originalPositions: any;
  candidateName: string;
  candidateFullName: string;
  userName: string;
  userRole: any;
  userRoles: any;
  vendor: string;
  email: string;
  notificationCategory: string;
  address1: string;
  city: string;
  state: string;
  tier: string;
  clientStatus: string;
  submittedOn: any;
  presentationDate: any;
  startDate: any;
  eventLogDate: any;
  endDate: any;
  validFrom: any;
  validTo: any;
  candidatestatus: string;
  skip: any;
  total: any;
  page: any;
  divisionId: string;
  totalHours?: any;
  client?: any;
  //vendor invoicing fields start
  vendorName: any;
  billingPeriodStart: any;
  billingPeriodEnd: any;
  vendorInvoiceStatus: any[];
  hours: any;
  //vendor invoicing fields end
  serviceType: any;
  vendorInvoiceType: any[];
  reason: any;
  tags: any;
  associate: any;
  //manage candidate
  runDateFrom: any;
  runDateTo: any;
  jobCategory?: string;
  data: string;
  type: string;
  jobFlow?: string;
  clientPosition?: string;
  newSearchId?: any;
  daysToExpiration?: any;
  CandidateWFStatus?: any;
  positionSelected?: any;
  reqStatusData?: any;
  timesheetStatusData?: any;
  clientInvoiceStatusData?: any;
  vendorInvoiceServiceTypeData?: any[];
  vendorInvoiceStatusData?: any;
  clientStatusData?: any;
  role?: any;
  clientsData?: any;
  actionsData?: any;
  allClients?: any;
  selectedActions?: any;
  functionalAreaData?: any;
  allFunctionalArea?: any;
  priorityData?:any;
  allPriority?: any;
  requestTypeData?: any;
  allRequestType?: any;
  statusData?: any;
  allStatus?: any;
  clientIds: any[];
  requisitionStatus: any[];
  hiringManagers: any[];
  tsStatuses: any[];
  locations: any[];
  divisions: any[];
  userClientsData?: any;
  candSubStatus?: any;
  dataState?: any;
  cIds?: any[];
  UserStatusData?: any[];
  statuses?: any[];
  originalroles: Array<any>;
  roles: Array<any>;
  vendorInvoiceZones: any[];
  vendorInvoiceRegions: any[];
  vendorInvoicePosition: any[];
  startDateTime: any;
  endDateTime: any;
  message?: string;
  msgCatValue: any;
  msgPrioValue: any;
  msgCatData: any;
  msgPrioData: any;
  createdDateFrom: any;
  resolutionDateFrom: any;
  createdDateTo: any;
  resolutionDateTo: any;
  entityLogType: string;
  eventLogType: string;
  assignToData: any;
  allAssignTo: any;
  queueData?: any;
  allQueue?: any;
  contentLibTitle: any;
  contentTypeData: any;
  contentType: any;
  expDate: any;
  contentLibStatusData?: any;
  contentLibStatus: string;
  confirmStatusData?: any;
  selectedCnfStatus?:any;
  assignStartDate: any;
  assignEndDate: any;
  ticketNumber: any;
  ticketTitle: any;
}
const total = 7;
class AdvanceSearch extends React.Component<
  AdvanceSearchProps,
  AdvanceSearchState
> {
  childRef: React.RefObject<BasicSearch> = React.createRef();
  initialState: Readonly<AdvanceSearchState>;
  filteredData;
  dataCaching = [];
  pendingRequest;
  requestStarted = false;
  private UserClient: any = localStorage.getItem("UserClient");
  private UserClientIntId: any = parseInt(localStorage.getItem("UserClientIntId"));
  private userObj: any = JSON.parse(localStorage.getItem("user"));
  private userClients: any = JSON.parse(localStorage.getItem("UserClientLob"));
  private cIds = this.UserClientIntId ? [{ id: this.UserClientIntId, text: this.UserClient }] : []
  constructor(props: AdvanceSearchProps) {
    super(props);
    this.initialState = {
      division: props.division,
      location: "",
      position: "",
      region: "",
      roleName: "",
      roleType: "",
      zone: "",
      shareCandidateStatus:"",
      serviceCategory:"",
      notificationType:"",
      hiringManager: "",
      reqNumber: "",
      status: "",
      expenseStatus: "",
      startDateFrom: "",
      startDateTo: "",
      type: "",
      data: "",
      endDateFrom: "",
      endDateTo: "",
      searchName: "",
      filteredArray: [],
      basicSearchTextValue: "",
      fieldNames: [],
      basicSearchData: [],
      selectedOption: "",
      ifPinColor: false,
      searchId: "",
      searchNameReq: "",
      clientId: auth.getClient(),
      divisionsValue: [],
      vendorclientInvoiceData: [],
      originalvendorclientInvoiceData: [],
      regionValue: [],
      roleNameValue: [],
      userTypeData: [],
      originalUserTypeData: [],
      zoneValue: [],
      serviceCategoryValue: [],
      notificationTypeValue:[],
      hiringManagerValue: [],
      requisitionStatusValue: [],
      originalDivision: [],
      originalRegion: [],
      originalZone: [],
      originalServiceCategory: [],
      originalNotificationType:[],
      originalHiringManager: [],
      originallocations: [],
      locationsValue: [],
      locationsListValue: [],
      originalPositions: [],
      positionValue: [],
      reqStatusData: Req_Status,
      candidateName: "",
      candidateFullName: "",
      userName: "",
      userRole: "",
      userRoles: [],
      vendor: "",
      email: "",
      notificationCategory: "",
      address1: "",
      city: "",
      state: "",
      tier: "",
      clientStatus: "",
      submittedOn: "",
      presentationDate: "",
      startDate: "",
      eventLogDate: "",
      endDate: "",
      validFrom: "",
      validTo: "",
      candidatestatus: "",
      skip: 0,
      total: 50,
      page: 10,
      divisionId: "",
      client: "",
      vendorName: "",
      billingPeriodStart: "",
      billingPeriodEnd: "",
      vendorInvoiceStatus: [],
      hours: "",
      associate: "",
      serviceType: "",
      reason:"",
      tags: "",
      jobCategory: "",
      jobFlow: "",
      clientPosition: "",
      CandidateWFStatus: CandidateWF_Status,
      positionSelected: props.position,
      timesheetStatusData: [],
      clientInvoiceStatusData: ClientInvoiceWF_Status,
      vendorInvoiceStatusData: VendorInvoiceWF_Status,
      vendorInvoiceServiceTypeData: VendorInvoice_ServiceType,
      clientStatusData: Client_Status,
      UserStatusData: UserStatus,
      role: [],
      clientsData: [],
      actionsData: [],
      runDateFrom: "",
      runDateTo: "",
      clientIds: this.props.clientIds.length==0 ? this.cIds : [],
      hiringManagers: [],
      tsStatuses: [],
      statuses: [],
      vendorInvoiceType: [],
      allClients: [],
      selectedActions: [],
      requisitionStatus: [],
      locations: [],
      divisions: [],
      vendorInvoiceZones: [],
      vendorInvoiceRegions: [],
      vendorInvoicePosition: [],
      userClientsData: [],
      originalroles: [],
      roles: [],
      startDateTime: "",
      endDateTime: "",
      confirmStatusData: [],
      selectedCnfStatus:[],
      candSubStatus: "",
      contentLibTitle: "",
      contentTypeData: [],
      contentType: "",
      expDate: "",
      contentLibStatusData: ManageContentLibStatus,
      contentLibStatus: "",
      cIds: this.cIds,
      functionalAreaData: [],
      requestTypeData: [],
      statusData: [],
      priorityData:[],
      allFunctionalArea: [],
      allPriority: [],
      allRequestType: [],
      allStatus: [],
      msgCatValue: "",
      msgPrioValue: "",
      msgCatData: [],
      msgPrioData: [],
      createdDateFrom: "",
      resolutionDateFrom: "",
      createdDateTo:"",
      resolutionDateTo:"",
      eventLogType:"",
      entityLogType:"",
      message: "",
      assignStartDate: "",
      assignEndDate: "",
      assignToData:[],
      allAssignTo:[],
      queueData: [],
      allQueue: [],
      ticketNumber: "",
      ticketTitle: "",
      dataState: this.props.isReportSearch ? {
        skip: 0,
        take: 100,
        filter: {
          logic: 'or',
          filters: this.props.clientIds.length==0 ? this.cIds.map(x => {
            return {
              field: "clientIntId",
              operator: "eq",
              value: x.id,
              ignoreCase: true,
            }
          }) :
            this.props.clientIds.map(x => {
              return {
                field: "clientIntId",
                operator: "eq",
                value: x,
                ignoreCase: true,
              }
            })
        }
      } :
        {
          skip: 0,
          take: 100
        }
    };
    this.state = this.initialState;
  }
 

  componentDidMount() {
    if (this.props.page =="CandidateSubmission") {
      this.locationDebounceHandler(this.state.dataState);
    }
    this.locationDebounceHandler(this.state.dataState);
    this.getRole();
    this.getReqStatus();
    this.getTsStatus();
    if (!this.props.isReportSearch) {
      this.clientDebounceHandler(this.state.dataState);
    }

    this.getUserClients();
    this.divisionDebounceHandler(this.state.dataState);
    this.vendorDebounceHandler(this.state.dataState);
    this.regionDebounceHandler(this.state.dataState);
    this.zoneDebounceHandler(this.state.dataState);
    this.serviceCategoryDebounceHandler(this.state.dataState);
    // this.roleTypeDebounceHandler(this.state.dataState);
    this.notificationTypeDebounceHandler(this.state.dataState);
    this.hmDebounceHandler(this.state.dataState);
    this.posDebounceHandler(this.state.dataState);
    this.disableDateField();
    this.rollNameDebouncHandler(this.state.dataState);
    this.userTypeDebounceHandler(this.state.dataState);
    this.getActionsData(this.state.dataState);
      this.disableDateField();
      this.getFunctionalArea();
      this.getPriority();
      this.getRequestType();
      this.getStatus();
      this.getMsgPrio();
      this.getMsgCat();
    this.getAssignTo(this.state.dataState,this.state.allClients);
    this.getQueue();
    //this.getContentType(this.state.dataState);
    this.getConfirmStatusData(this.state.dataState);
  }

  componentWillReceiveProps(nextProps: Readonly<AdvanceSearchProps>, nextContext: any): void {
    if (_.isEqual(nextProps.clientIds, this.props.clientIds) && this.props.isReportSearch) {
      var dataState = this.props.isReportSearch && {
        skip: 0,
        take: 100,
        filter: {
          logic: 'or',
          filters: nextProps.clientIds.length==0 ? this.cIds.map(x => {
            return {
              field: "clientIntId",
              operator: "eq",
              value: x.id,
              ignoreCase: true,
            }
          }) :
            nextProps.clientIds.map(x => {
              return {
                field: "clientIntId",
                operator: "eq",
                value: x,
                ignoreCase: true,
              }
            })
        }
      }
      this.setState({ dataState: dataState });
      this.regionDebounceHandler(dataState);
      //this.getRegions(dataState);
      if (this.props.page =="CandidateSubmission") {
        this.locationDebounceHandler(dataState);
      }
      this.locationDebounceHandler(dataState);
      if (!this.props.isReportSearch) {
        this.clientDebounceHandler(dataState);
      }
      this.divisionDebounceHandler(dataState);
      this.zoneDebounceHandler(dataState);
      this.serviceCategoryDebounceHandler(dataState);
      this.notificationTypeDebounceHandler(dataState);
      this.hmDebounceHandler(dataState);
      this.posDebounceHandler(dataState);
      this.rollNameDebouncHandler(dataState);
      this.userTypeDebounceHandler(dataState);
    }
  }

  componentDidUpdate(prevProps: Readonly<AdvanceSearchProps>, prevState: Readonly<AdvanceSearchState>, snapshot?: any): void {
    if (!_.isEqual(prevProps.clientIds, this.props.clientIds) && this.props.isReportSearch) {
      var dataState = this.props.isReportSearch && {
        skip: 0,
        take: 100,
        filter: {
          logic: 'or',
          filters: this.props.clientIds.length==0 ? this.cIds.map(x => {
            return {
              field: "clientIntId",
              operator: "eq",
              value: x.id,
              ignoreCase: true,
            }
          }) :
            this.props.clientIds.map(x => {
              return {
                field: "clientIntId",
                operator: "eq",
                value: x,
                ignoreCase: true,
              }
            })
        }
      }
      this.setState({ dataState: dataState });
      this.regionDebounceHandler(dataState);
      //this.getRegions(dataState);
      if (this.props.page =="CandidateSubmission") {
        this.locationDebounceHandler(dataState);
      }
      this.locationDebounceHandler(dataState);
      if (!this.props.isReportSearch) {
        this.clientDebounceHandler(dataState);
      }
      this.divisionDebounceHandler(dataState);
      this.zoneDebounceHandler(dataState);
      this.serviceCategoryDebounceHandler(dataState);
      this.notificationTypeDebounceHandler(dataState);
      this.hmDebounceHandler(dataState);
      this.posDebounceHandler(dataState);
      this.rollNameDebouncHandler(dataState);
      this.userTypeDebounceHandler(dataState);
    }
  }

  // static getDerivedStateFromProps(props, state){
  //   console.log("getDerivedStateFromProps");
  //   if(_.isEqual(props.clientIds,state.clientIds.map(x => x.id))){
  //     console.log("Inside iff");
  //     return {clientIds:props.clientIds,dataState: props.isReportSearch ? {
  //       skip: 0,
  //       take: 100,
  //       filter: {
  //         logic: 'or',
  //         filters: props.clientIds.length==0  ? state.cIds.map(x => {
  //                 return {
  //                   field: "clientIntId",
  //                   operator: "eq",
  //                   value: x.id,
  //                   ignoreCase: true,
  //                 }
  //               }):
  //               props.clientIds.map(x => {
  //                 return {
  //                   field: "clientIntId",
  //                   operator: "eq",
  //                   value: x,
  //                   ignoreCase: true,
  //                 }
  //               })
  //       }
  //     } : {
  //       skip: 0,
  //       take: 100
  //     }};
  //   }
  // }

  itemRender = (li, itemProps) => {
    const itemChildren = (
      <span>
        <input
          type="checkbox"
          checked={itemProps.selected}
          onChange={(e) => itemProps.onClick(itemProps.index, e)}
        />
        &nbsp;{li.props.children}
      </span>
    );
    return React.cloneElement(li, li.props, itemChildren);
  };


  disableDateField = () => {
    document.getElementsByName("submittedOn").length > 0 &&
      (document.getElementsByName("submittedOn")[0]["disabled"] = true);
    document.getElementsByName("presentationDate").length > 0 &&
      (document.getElementsByName("presentationDate")[0]["disabled"] = true);
    document.getElementsByName("billingPeriodStart").length > 0 &&
      (document.getElementsByName("billingPeriodStart")[0]["disabled"] = true);
    document.getElementsByName("startDate").length > 0 &&
      (document.getElementsByName("startDate")[0]["disabled"] = true);
    document.getElementsByName("endDate").length > 0 &&
      (document.getElementsByName("endDate")[0]["disabled"] = true);
    document.getElementsByName("validFrom").length > 0 &&
      (document.getElementsByName("validFrom")[0]["disabled"] = true);
    document.getElementsByName("validTo").length > 0 &&
      (document.getElementsByName("validTo")[0]["disabled"] = true);
    document.getElementsByName("billingPeriodEnd").length > 0 &&
      (document.getElementsByName("billingPeriodEnd")[0]["disabled"] = true);
    document.getElementsByName("createdDateFrom").length > 0 &&
      (document.getElementsByName("createdDateFrom")[0]["disabled"] = true);
    document.getElementsByName("resolutionDateFrom").length > 0 &&
      (document.getElementsByName("resolutionDateFrom")[0]["disabled"] = true);
    document.getElementsByName("resolutionDateTo").length > 0 &&
      (document.getElementsByName("resolutionDateTo")[0]["disabled"] = true);
    document.getElementsByName("createdDateTo").length > 0 &&
      (document.getElementsByName("createdDateTo")[0]["disabled"] = true);
    document.getElementsByName("assignStartDate").length > 0 &&
      (document.getElementsByName("assignStartDate")[0]["disabled"] = true);
    document.getElementsByName("assignEndDate").length > 0 &&
      (document.getElementsByName("assignEndDate")[0]["disabled"] = true);    
  };

  initialValue = async (fromChange?) => {
    const {
      basicSearchTextValue,
      edit,
      reopened,
      selectedOption,
      location,
      position,
      region,
      zone,
      roleName,
      roleType,
      notificationType,
      shareCandidateStatus,
      hiringManager,
      reqStatus,
      expenseStatus,
      reqNo,
      division,
      searchName,
      searchId,
      startDateFrom,
      startDateTo,
      endDateTo,
      endDateFrom,
      candidateName,
      candidateFullName,
      userName,
      userRole,
      vendor,
      serviceCategory,
      email,
      notificationCategory,
      address1,
      city,
      state,
      tier,
      clientStatus,
      submittedOn,
      presentationDate,
      startDate,
      endDate,
      validFrom,
      validTo,
      candidatestatus,
      basicSearchData,
      client, 
      vendorName,
      billingPeriodStart,
      billingPeriodEnd,
      vendorInvoiceStatus,
      vendorInvoiceZones,
      vendorInvoiceRegions,
      vendorInvoicePosition,
      hours,
      associate,
      serviceType,
      reason,
      tags,
      jobCategory,
      data,
      type,
      eventLogDate,
      jobFlow,
      clientPosition,
      daysToExpiration,
      runDateFrom,
      runDateTo,
      candSubStatus,
      clientIds,
      requisitionStatus,
      hiringManagers,
      tsStatuses,
      locations,
      divisions,
      ifPinColor,
      allClients,
      userRoles,
      statuses,
      vendorInvoiceType,
      selectedActions,
      allFunctionalArea,
      allPriority,
      allRequestType,
      allStatus,
      startDateTime,
      endDateTime,
      message,
      msgCatValue,
      msgPrioValue,
      createdDateFrom,
      resolutionDateFrom,
      createdDateTo,
      resolutionDateTo,
      positionSelected,
      eventLogType,
      entityLogType,
      allAssingnTo,
      allQueue,
      contentLibTitle,
      contentType,
      expDate,
      ContentLibStatus,
      selectedCnfStatus,
      assignStartDate,
      assignEndDate,
      ticketNumber,
      ticketTitle
    } = this.props;
    const divisionObject = this.state.divisionsValue.filter(
      (i) => i.text==division
    );
    const roleObject = this.state.role.filter(
      (i) => i.text.toLowerCase()==userRole
    );
    const clientObject = this.state.clientsData && this.state.clientsData.filter(
      (i) => i.text.toLowerCase()==client.toLowerCase()
    );
    const RegionObject = this.state.regionValue.filter((i) => i.name==region);

    const roleNameObject = this.state.roleNameValue.filter((i) => i.name==roleName);

    const roleTypeObject = this.state.userTypeData.filter((i) =>i.roleTypeName==roleType);

    const ZoneObject = this.state.zoneValue.filter((i) => i.name==zone);

    const ShareCandidateStatusObject = this.state.vendorclientInvoiceData.filter((i) => i.name==shareCandidateStatus);

    const ServiceCategoryObject = this.state.serviceCategoryValue.filter((i) => i.name==serviceCategory)

    const NotificationTypeObject = this.state.notificationTypeValue.filter((i) => i.name==notificationType);

    const HiringManagerObject = this.state.hiringManagerValue.filter((i) => i.name==hiringManager);

    const RequisitionStatusObjects = this.state.requisitionStatusValue.filter((i) => requisitionStatus.includes(i.name.toLowerCase()));

    const HiringManagerObjects = this.state.hiringManagerValue.filter((i) => hiringManagers.includes(i.name.toLowerCase()));

    const TimesheetStatusObjects = this.state.timesheetStatusData.filter((i) => tsStatuses.includes(i.name));

    const LocationsObjects = this.state.locationsListValue.filter((i) => locations.includes(i.text.toLowerCase()));

    const DivisionsObjects = this.state.divisionsValue.filter((i) => divisions.includes(i.text.toLowerCase()));

    const vendorInvoiceStatusObject= this.state.vendorclientInvoiceData.filter((i)=> vendorInvoiceStatus.includes(i.name.toLowerCase()))

    const vendorInvoiceZonesObjects = this.state.zoneValue.filter((i)=> vendorInvoiceZones.includes(i.name.toLowerCase()))

    const vendorInvoiceRegionsObjects = this.state.regionValue.filter((i)=> vendorInvoiceRegions.includes(i.name.toLowerCase()))

    const vendorInvoicePositionObjects = this.state.positionValue.filter((i)=> vendorInvoicePosition.includes(i.text.toLowerCase()))

    const ClientsDataObjects = this.state.clientsData.filter((i) => allClients.includes(i.text.toLowerCase()));

    const ActionsDataObjects = this.state.actionsData.filter((i) => selectedActions.includes(i.entityName.toLowerCase()));

    const ClientsStatusDataObjects = this.state.UserStatusData.filter((i) => statuses.includes(i.text));

    const vendorInvoiceTypeObjects = this.state.vendorInvoiceServiceTypeData.filter((i)=> vendorInvoiceType.includes(i.id))

    const UserRoleObjects = this.state.role.filter((i) => userRoles.includes(i.text.toLowerCase()));
   
    const ConfirmStatusDataObjects = this.state.confirmStatusData.filter((i) => selectedCnfStatus.includes(i.cnfStatus.toLowerCase()));

    const positionSelectedObject = this.state.positionValue.filter(
      (i) => i.text==positionSelected
    );

    const ContentTypeObject = this.state.contentTypeData.filter((i) => i.name==contentType)

    const SelectedClients = this.state.userClientsData.filter(el => {
      return clientIds.indexOf(el.id) !=-1;
    });
    const functionalAreaDataObjects = this.state.functionalAreaData.filter((i) => allFunctionalArea.includes(i.text.toLowerCase()));
    const requestTypeDataObjects = this.state.requestTypeData.filter((i) => allRequestType.includes(i.text.toLowerCase()));
    const statusDataObjects = this.state.statusData.filter((i) => allStatus.includes(i.text.toLowerCase()));
    const priorityDataObjects = this.state.priorityData.filter((i) => allPriority.includes(i.text.toLowerCase()));


    const msgCatValueObject = this.state.msgCatData.filter((i) => i.name==msgCatValue)

    const msgPrioValueObject = this.state.msgPrioData.filter((i) => i.name==msgPrioValue)

    const allAssignToDataObjects = this.state.assignToData.filter((i) => allAssingnTo.includes(i.text.toLowerCase()));

    const queueObjects = this.state.queueData.filter((i) => allQueue.includes(i.text.toLowerCase()));

    if (edit || reopened) {
      console.log("selected ::" + JSON.stringify(SelectedClients));
      console.log("State ::" + JSON.stringify(this.state.clientIds));
      this.setState(
        {
          basicSearchTextValue: basicSearchTextValue,
          basicSearchData: basicSearchData,
          // filteredArray: advancedSearchData,
          location: location,
          position: position,
          region: RegionObject[0],
          roleName: roleNameObject[0],
          roleType: roleTypeObject[0],
          zone: ZoneObject[0],
          shareCandidateStatus:ShareCandidateStatusObject[0],
          serviceCategory: ServiceCategoryObject[0],
          notificationType:NotificationTypeObject[0],
          hiringManager: HiringManagerObject[0],
          //hiringManager: hiringManager,
          selectedOption: selectedOption,
          status: reqStatus,
          expenseStatus: expenseStatus,
          reqNumber: reqNo.toUpperCase(),
          division: divisionObject[0],
          searchName: searchName ? searchName : "",
          searchId: searchId,
          ifPinColor: ifPinColor,
          candidateName: candidateName,
          candidateFullName: candidateFullName,
          userName: userName,
          userRole: roleObject[0],
          vendor: vendor,
          type: type,
          data: data,
          tier: tier,
          email: email,
          notificationCategory: notificationCategory,
          address1: address1,
          city: city,
          state: state,
          clientStatus: clientStatus,
          candidatestatus: candidatestatus,
          eventLogType:eventLogType,
          entityLogType:entityLogType,

          contentLibStatus: ContentLibStatus,
          submittedOn:
            submittedOn ==""
              ? this.state.submittedOn
              : new Date(submittedOn.toString()),
          presentationDate:
            presentationDate ==""
              ? this.state.presentationDate
              : new Date(presentationDate.toString()),
          startDate:
            startDate ==""
              ? this.state.startDate
              : new Date(startDate.toString()),
          eventLogDate:
            eventLogDate ==""
              ? this.state.eventLogDate
              : new Date(eventLogDate.toString()),
          startDateTime:
            startDateTime ==""
              ? this.state.startDateTime
              : new Date(startDateTime.toString()),
           endDateTime:
            endDateTime ==""
              ? this.state.endDateTime
              : new Date(endDateTime.toString()),          
          endDate:
            endDate =="" ? this.state.endDate : new Date(endDate.toString()),
          validFrom:
            validFrom ==""
              ? this.state.validFrom
              : new Date(validFrom.toString()),
          validTo:
            validTo =="" ? this.state.validTo : new Date(validTo.toString()),
          startDateFrom:
            startDateFrom ==""
              ? this.state.startDateFrom
              : new Date(startDateFrom.toString()),
          startDateTo:
            startDateTo ==""
              ? this.state.startDateTo
              : new Date(startDateTo.toString()),
          endDateFrom:
            endDateFrom ==""
              ? this.state.endDateFrom
              : new Date(endDateFrom.toString()),
          endDateTo:
            endDateTo ==""
              ? this.state.endDateTo
              : new Date(endDateTo.toString()),
          billingPeriodStart:
            billingPeriodStart ==""
              ? this.state.billingPeriodStart
              : new Date(billingPeriodStart.toString()),
          billingPeriodEnd:
            billingPeriodEnd ==""
              ? this.state.billingPeriodEnd
              : new Date(billingPeriodEnd.toString()),
          runDateFrom:
            runDateFrom ==""
              ? this.state.runDateFrom
              : new Date(runDateFrom.toString()),
          runDateTo:
            runDateTo ==""
              ? this.state.runDateTo
              : new Date(runDateTo.toString()),
          createdDateFrom:
            createdDateFrom ==""
                ? this.state.createdDateFrom
                : new Date(createdDateFrom.toString()),
          createdDateTo:
            createdDateTo ==""
              ? this.state.createdDateTo
              : new Date(createdDateTo.toString()),      
          resolutionDateFrom:
            resolutionDateFrom =="" 
                ? this.state.resolutionDateFrom
                : new Date(resolutionDateFrom.toString()),
          resolutionDateTo:
            resolutionDateTo ==""
              ? this.state.resolutionDateTo
              : new Date(resolutionDateTo.toString()),
           expDate:
            expDate ==""
              ? this.state.expDate
              : new Date(expDate.toString()),
          assignStartDate:
          assignStartDate ==""
              ? this.state.assignStartDate
              : new Date(assignStartDate.toString()),
          assignEndDate:
            assignEndDate ==""
              ? this.state.assignEndDate
              : new Date(assignEndDate.toString()),
          vendorName: vendorName,
          client: clientObject[0],
          vendorInvoiceStatus: vendorInvoiceStatusObject,
          hours: hours,
          associate: associate,
          serviceType: serviceType,
          reason:reason,
          tags: tags,
          jobCategory: jobCategory,
          jobFlow: jobFlow,
          clientPosition: clientPosition,
          daysToExpiration: daysToExpiration,
          candSubStatus: candSubStatus,
          hiringManagers: HiringManagerObjects,
          tsStatuses: TimesheetStatusObjects,
          userRoles: UserRoleObjects,
          allClients: ClientsDataObjects,
          selectedActions: ActionsDataObjects,
          requisitionStatus: RequisitionStatusObjects,
          locations: LocationsObjects,
          divisions: DivisionsObjects,
          vendorInvoiceZones: vendorInvoiceZonesObjects,
          vendorInvoiceRegions: vendorInvoiceRegionsObjects,
          vendorInvoicePosition: vendorInvoicePositionObjects,
          statuses: ClientsStatusDataObjects,
          vendorInvoiceType: vendorInvoiceTypeObjects,
          clientIds: fromChange ? this.state.clientIds : SelectedClients.length==0 ? this.state.clientIds : SelectedClients,
          allFunctionalArea:functionalAreaDataObjects,
          allPriority:priorityDataObjects,
          allRequestType:requestTypeDataObjects,
          allStatus:statusDataObjects,
          message: message,
          msgCatValue:msgCatValueObject[0],
          msgPrioValue: msgPrioValueObject[0],
          positionSelected: positionSelectedObject[0],
          allAssignTo: allAssignToDataObjects,
          allQueue: queueObjects,
          contentLibTitle: contentLibTitle,
          contentType: ContentTypeObject[0],
          selectedCnfStatus: ConfirmStatusDataObjects,
          ticketNumber: ticketNumber,
          ticketTitle: ticketTitle
        },
        () => (
          this.childRef.current.basicSearchValue(
            this.state.basicSearchTextValue,
            this.state.selectedOption
          ),
          divisionObject.length > 0
            ? this.handleDivisionChange(divisionObject[0])
            : null
        )
      );

    } else {
      this.setState(
        {
          basicSearchTextValue: basicSearchTextValue,
          fieldNames: AdvanceSearchFieldsReq,
          selectedOption: selectedOption,
        },
        () => this.dataFromBasicSearch()
      );
    }
  };
  dataFromBasicSearch = () => {
    this.childRef.current.basicSearchValue(
      this.state.basicSearchTextValue,
      this.state.selectedOption
    );
    setTimeout(() => {
      let data =
        this.childRef.current != null &&
        this.childRef.current.searchFilterOperation();

      this.setState({ basicSearchData: data });
    }, 700);
  };

  updateState = (keyword, fieldName) => {
    let change = {};
    change[fieldName] = keyword;
    this.setState(change, () => {
      if (this.props.isReportSearch && fieldName=="clientIds") {
        var dataStatefiltered = {
          skip: 0,
          take: 100,
          filter: {
            logic: 'or',
            filters: this.state.clientIds.map(x => {
              return {
                field: "clientIntId",
                operator: "eq",
                value: x.id,
                ignoreCase: true,
              }
            })
          }
        }
        this.getLocations(dataStatefiltered, true);
        this.getRole(null, true);
        this.getReqStatus(null, true);
        this.getTsStatus(null, true);
        this.getUserClients(null, true);
        this.getDivisions(dataStatefiltered, true);
        this.getRegions(dataStatefiltered, true);
        this.getZones(dataStatefiltered, true);
        this.getServiceCategory(dataStatefiltered, true);
        this.getHiringManagers(dataStatefiltered, true);
        this.getPositions(dataStatefiltered, true);
        this.getRoleName(dataStatefiltered, true);
        this.getNotificationTypes(dataStatefiltered, true);
        this.getUserType(dataStatefiltered, true);
        this.getMsgCat(true);
        this.getMsgPrio(true);
        this.getFunctionalArea(true);
        this.getPriority(true);
        this.getRequestType(true);
        this.getStatus(true);
        // this.getContentType(true);
      }
    });
  };

  onsearchFilteredArray = () => {
    const {
      location,
      position,
      division,
      region,
      roleName,
      roleType,
      zone,
      notificationType,
      shareCandidateStatus,
      hiringManager,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      submittedOn,
      presentationDate,
      startDate,
      endDate,
      startDateTime,
      endDateTime,
      validFrom,
      validTo,
      candidateName,
      candidateFullName,
      userName,
      userRole,
      email,
      notificationCategory,
      address1,
      city,
      state,
      clientStatus,
      vendor,
      serviceCategory,
      tier,
      status,
      expenseStatus,
      candidatestatus,
      reqNumber,
      client,
      vendorName,
      billingPeriodStart,
      billingPeriodEnd,
      vendorInvoiceStatus,
      hours,
      totalHours,
      associate,
      serviceType,
      reason,
      tags,
      jobCategory,
      data,
      type,
      eventLogDate,
      jobFlow,
      clientPosition,
      daysToExpiration,
      runDateFrom,
      runDateTo,
      clientIds,
      candSubStatus,
      requisitionStatus,
      hiringManagers,
      tsStatuses,
      locations,
      divisions,
      vendorInvoiceZones,
      vendorInvoiceRegions,
      vendorInvoicePosition,
      allClients,
      selectedActions,
      userRoles,
      statuses,
      vendorInvoiceType,
      message,
      msgCatValue,
      msgPrioValue,
      allFunctionalArea,
      allPriority,
      allRequestType,
      allStatus,
      createdDateFrom,
      createdDateTo,
      resolutionDateFrom,
      resolutionDateTo,
      eventLogType,
      entityLogType,
      allAssignTo,
      allQueue,
      contentLibTitle,
      contentType,
      expDate,
      contentLibStatus,
      selectedCnfStatus,
      assignStartDate,
      assignEndDate,
      ticketNumber,
      ticketTitle
    } = this.state;

    var checkArrayFieldValue,
      index,
      filteredArray = [];
    if (location != "" && location) {
      filteredArray.push({
        field: "location",
        operator: "contains",
        value: location,
        ignoreCase: null,
      });
    }
    if (totalHours) {
      filteredArray.push({
        field: "totalHours",
        operator: "eq",
        value: parseFloat(totalHours),
        ignoreCase: null,
      });
    }
    if (region != "" && region != undefined && region.name != undefined) {
      filteredArray.push({
        field: "region",
        operator: "contains",
        value: region.name,
        ignoreCase: null,
      });
    }
    if (roleName != "" && roleName != undefined && roleName.name != undefined) {
      filteredArray.push({
        field: "name",
        operator: "contains",
        value: roleName.name,
        ignoreCase: null,
      });
    }

    if (roleType != "" && roleType != undefined && roleType.roleTypeName != undefined) {
      filteredArray.push({
        field: "roleTypeName",
        operator: "contains",
        value: roleType.roleTypeName,
        ignoreCase: null,
      });
    }


    if (vendorInvoiceRegions.length) {
      filteredArray.push({
        logic: 'or',
        filters: vendorInvoiceRegions.map(x => {
          return {
            field: "region",
            operator: "contains",
            value: x.name.toLowerCase(),
            ignoreCase: true,
          }
        })
      });
    }
    if (zone != "" && zone != undefined && zone.name != undefined) {
      filteredArray.push({
        field: "zone",
        operator: "contains",
        value: zone.name,
        ignoreCase: null,
      });
    }
    if (vendorInvoiceZones.length) {
      filteredArray.push({
        logic: 'or',
        filters: vendorInvoiceZones.map(x => {
          return {
            field: "zone",
            operator: "contains",
            value: x.name.toLowerCase(),
            ignoreCase: true,
          }
        })
      });
    }
    if (notificationType != "" && notificationType != undefined && notificationType.name != undefined) {
      filteredArray.push({
        field: "notificationType",
        operator: "contains",
        value: notificationType.name,
        ignoreCase: null,
      });
    }
    if (hiringManager != "" && hiringManager != undefined && hiringManager.name != undefined) {
      filteredArray.push({
        field: "hiringManager",
        operator: "contains",
        value: hiringManager.name,
        ignoreCase: null,
      });
    }

    if (requisitionStatus.length) {
      filteredArray.push({
        logic: 'or',
        filters: requisitionStatus.map(x => {
          return {
            field: "status",
            operator: "contains",
            value: x.name.toLowerCase(),
            ignoreCase: true,
          }
        })

      });
    }

    if (statuses.length) {
      filteredArray.push({
        logic: 'or',
        filters: statuses.map(x => {
          return {
            field: "status",
            operator: "contains",
            value: x.text,
            ignoreCase: null,
          }
        })

      });
    }
    if (vendorInvoiceType.length) {
      filteredArray.push({
        logic: 'or',
        filters: vendorInvoiceType.map(x => {
          return {
            field: x.field,
            operator: "eq",
            value: x.id,
            ignoreCase: null,
          }
        })

      });
    }

    if (hiringManagers.length) {
      filteredArray.push({
        logic: 'or',
        filters: hiringManagers.map(x => {
          return {
            field: "hiringManager",
            operator: "contains",
            value: x.name.toLowerCase(),
            ignoreCase: true,
          }
        })

      });
    }

    if (tsStatuses.length) {
      filteredArray.push({
        logic: 'or',
        filters: tsStatuses.map(x => {
          return {
            field: "status",
            operator: "contains",
            value: x.name,
            ignoreCase: null,
          }
        })
      });
    }

    if (userRoles.length) {
      filteredArray.push({
        logic: 'or',
        filters: userRoles.map(x => {
          return {
            field: "role",
            operator: "contains",
            value: x.text.toLowerCase(),
            ignoreCase: true,
          }
        })
      });
    }

    if (allClients.length) {
      filteredArray.push({
        logic: 'or',
        filters: allClients.map(x => {
          return {
            field: "client",
            operator: "eq",
            value: x.text.toLowerCase(),
            ignoreCase: true,
          }
        })

      });
    }
    if (divisions.length) {
      filteredArray.push({
        logic: 'or',
        filters: divisions.map(x => {
          return {
            field: "division",
            operator: "contains",
            value: x.text.toLowerCase(),
            ignoreCase: true,
          }
        })
        // filters: {
        //   field: "division",
        //   operator: "contains",
        //   value: divisions.map(x => x.text.toLowerCase(),
        //   ignoreCase: true,
        // }

      });
    }
    if (locations.length) {
      filteredArray.push({
        logic: 'or',
        filters: locations.map(x => {
          return {
            field: "location",
            operator: "contains",
            value: x.text.toLowerCase(),
            ignoreCase: true,
          }
        })

      });
    }
    // if (hiringManager != "") {
    //   filteredArray.push({
    //     field: "hiringManager",
    //     operator: "contains",
    //     value: hiringManager.toLowerCase(),
    //     ignoreCase: true,
    //   });
    // }
    if (position != "") {
      filteredArray.push({
        field: "position",
        operator: "contains",
        value: position,
        ignoreCase: null,
      });
    }
    if ( vendorInvoicePosition.length) {
      filteredArray.push({
        logic: 'or',
        filters:  vendorInvoicePosition.map(x => {
          return {
            field: "position",
            operator: "contains",
            value: x.text.toLowerCase(),
            ignoreCase: true,
          }
        })

      });
    }
    if (
      division &&
      Object.keys(division).length != 0 &&
      division != "" &&
      division.text != undefined
    ) {
      filteredArray.push({
        field: "division",
        operator: "contains",
        value: division != "" ? division.text : "",
        ignoreCase: null,
      });
    }
    if (status != "" && this.props.page != "CandidateWF") {
      filteredArray.push({
        field: "status",
        operator: "contains",
        value: status,
        ignoreCase: null,
      });
    }
    if (expenseStatus != "" && this.props.page =="VendorInvoicingDetails") {
      filteredArray.push({
        field: "expenseStatus",
        operator: "contains",
        value: expenseStatus,
        ignoreCase: null,
      });
    }
    if (reqNumber != "") {
      filteredArray.push({
        field: "reqNumber",
        operator: "contains",
        value: reqNumber.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (startDateFrom != "") {
      filteredArray.push({
        field: "startDate",
        operator: "gte",
        value: new Date(startDateFrom),
        ignoreCase: true,
      });
    }
    if (startDateTo != "") {
      filteredArray.push({
        field: "startDate",
        operator: "lte",
        value: new Date(startDateTo),
        ignoreCase: true,
      });
    }
    if (startDate != "") {
      filteredArray.push({
        field: "startDate",
        operator: "gte",
        value: new Date(startDate),
        ignoreCase: true,
      });
    }
    if (endDate != "") {
      filteredArray.push({
        field: "endDate",
        operator: "lte",
        value: new Date(endDate),
        ignoreCase: true,
      });
    }
    if (endDateFrom != "") {
      filteredArray.push({
        field: "endDate",
        operator: "gte",
        value: new Date(endDateFrom),
        ignoreCase: true,
      });
    }
    if (endDateTo != "") {
      filteredArray.push({
        field: "endDate",
        operator: "lte",
        value: new Date(endDateTo),
        ignoreCase: true,
      });
    }
    if (validFrom != "") {
      filteredArray.push({
        field: "validFrom",
        operator: "gte",
        value: new Date(validFrom),
        ignoreCase: true,
      });
    }
    if (validTo != "") {
      filteredArray.push({
        field: "validTo",
        operator: "lte",
        value: new Date(validTo),
        ignoreCase: true,
      });
    }
    if (candidateName != "" && candidateName != undefined) {
      filteredArray.push({
        field: "candidateName",
        operator: "contains",
        value: candidateName.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (candidateFullName != "" && candidateFullName != undefined) {
      filteredArray.push({
        field: this.props.page=="SpendForecastReport" ? "provider" : this.props.page=="AssociateExpense" ? "associate" : this.props.page=="FinancialAccrualReport"? "providerName" : "candidateFullName",
        operator: "contains",
        value: candidateFullName.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (userName != "" && userName != undefined) {
      filteredArray.push({
        field: "userName",
        operator: "contains",
        value: userName.toLowerCase(),
        ignoreCase: true,
      });
    }

    if (userRole != "" && userRole != undefined && userRole.id != null) {
      filteredArray.push({
        field: "role",
        operator: "contains",
        value: userRole.text.toLowerCase(),
        ignoreCase: true,
      });
    }

    if (email != "" && email != undefined) {
      filteredArray.push({
        field: "email",
        operator: "contains",
        value: email.toLowerCase(),
        ignoreCase: true,
      });
    }

    if (address1 != "" && address1 != undefined) {
      filteredArray.push({
        field: "address1",
        operator: "contains",
        value: address1.toLowerCase(),
        ignoreCase: true,
      });
    }

    if (city != "" && city != undefined) {
      filteredArray.push({
        field: "city",
        operator: "contains",
        value: city.toLowerCase(),
        ignoreCase: true,
      });
    }

    if (state != "" && state != undefined) {
      filteredArray.push({
        field: "state",
        operator: "contains",
        value: state.toLowerCase(),
        ignoreCase: true,
      });
    }

    if (notificationCategory != "" && notificationCategory != undefined) {
      filteredArray.push({
        field: "notificationCategory",
        operator: "contains",
        value: notificationCategory.toLowerCase(),
        ignoreCase: true,
      });
    }

    if (candSubStatus != "" && candSubStatus != undefined) {
      filteredArray.push({
        field: "candSubStatus",
        operator: "contains",
        value: candSubStatus.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (
      clientStatus != "" &&
      clientStatus != undefined &&
      (this.props.page=="ManageClient" ||
        this.props.page=="ManageDivision" ||
        this.props.page=="ManageVendor" ||
        this.props.page=="ManageLocation")
    ) {
      filteredArray.push({
        field: "status",
        operator: "eq",
        value: clientStatus.toLowerCase(),
        ignoreCase: true,
      });
    }

    if (
      candidatestatus != "" &&
      (this.props.page =="CandidateWF" ||
        this.props.page =="CandidateSubmittalReport")
    ) {
      filteredArray.push({
        field: "status",
        operator: "eq",
        value: candidatestatus,
        ignoreCase: null,
      });
    }
    if (submittedOn != "") {
      filteredArray.push({
        field: "submittedOn",
        operator: "eq",
        value: new Date(new Date(submittedOn).toDateString()),
        ignoreCase: true,
      });
    }
    if (presentationDate != "") {
      filteredArray.push({
        field: "presentationDate",
        operator: "eq",
        value: new Date(new Date(presentationDate).toDateString()),
        ignoreCase: true,
      });
    }

    if (startDateTo != "") {
      filteredArray.push({
        field: "startDate",
        operator: "lte",
        value: new Date(startDateTo),
        ignoreCase: true,
      });
    }
    if (billingPeriodStart != "") {
      filteredArray.push({
        field: "billingPeriodStart",
        operator: "gte",
        value: new Date(billingPeriodStart).toLocaleDateString(),
        ignoreCase: true,
      });
    }
    if (billingPeriodEnd != "") {
      filteredArray.push({
        field: "billingPeriodEnd",
        operator: "lte",
        value: new Date(billingPeriodEnd).toLocaleDateString(),
        ignoreCase: true,
      });
    }
    if (
      vendorInvoiceStatus.length &&
      (this.props.page =="VendorInvoicing" ||
      this.props.page =="VIUnderReview" ||
        this.props.page =="ClientInvoicing" ||
        this.props.page =="ClientStatementReport"
        || this.props.page =="CandidateShareWF")
    ) {
      filteredArray.push({
        logic: 'or',
        filters: vendorInvoiceStatus.map(x => {
          return {
            field: "status",
            operator: "contains",
            value: x.name.toLowerCase(),
            ignoreCase: true,
          }
        })

      })
    }
    if (vendorName != "" && vendorName != undefined) {
      filteredArray.push({
        field:
          (this.props.page=="FilledAssignmentReport" || this.props.page=="TSSubmitted" || this.props.page=="TSUnderReview") ? "vendor" : "vendorName",
        operator: "contains",
        value: vendorName.toLowerCase(),
        ignoreCase: true,
      });
    }

    if (vendor != "" && vendor != undefined) {
      filteredArray.push({
        field: "vendor",
        operator: "contains",
        value: vendor.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (shareCandidateStatus != "" && shareCandidateStatus != undefined) {
      filteredArray.push({
        field: "status",
        operator: "contains",
        value: shareCandidateStatus.toLowerCase(),
        ignoreCase: true,
      });
    }
    // if (data != "" && data != undefined) {
    //   filteredArray.push({
    //     field: "data",
    //     operator: "contains",
    //     value: data.toLowerCase(),
    //     ignoreCase: true,
    //   });
    // }
    // if (type != "" && type != undefined) {
    //   filteredArray.push({
    //     field: "type",
    //     operator: "contains",
    //     value: type.toLowerCase(),
    //     ignoreCase: true,
    //   });
    // }
    if (tier != "" && tier != undefined) {
      filteredArray.push({
        field: "tier",
        operator: "contains",
        value: tier.toLowerCase(),
        ignoreCase: true,
      });
    }

    if (client != "" && client != undefined && client.id != null) {
      filteredArray.push({
        field: "client",
        operator: "eq",
        value: client.text.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (clientIds.length != 0 && this.props.isReportSearch) {
      filteredArray.push({
        logic: 'or',
        filters: clientIds.map(x => {
          return {
            field: "clientIntId",
            operator: "eq",
            value: x.id,
            ignoreCase: true,
          }
        })

      });
    }
    if (associate != "" && associate != undefined) {
      filteredArray.push({
        field: "associate",
        operator: "contains",
        value: associate.toLowerCase(),
        ignoreCase: true,
      });
    }
   
    if (serviceType != "" && serviceType != undefined) {
      filteredArray.push({
        field: serviceType=="Expense" ? "serviceCatIntId" : "serviceType",
        operator: serviceType=="Expense" ? "eq" : "contains",
        value: serviceType=="Expense" ? 2 : serviceType.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (tags != "" && tags != undefined) {
      filteredArray.push({
        field: "tags",
        operator: "contains",
        value: tags.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (jobCategory != "" && jobCategory != undefined) {
      filteredArray.push({
        field: "jobCategory",
        operator: "contains",
        value: jobCategory.toLowerCase(),
        ignoreCase: true,
      });
    }

    if (jobFlow != "" && jobFlow != undefined) {
      filteredArray.push({
        field: "jobFlow",
        operator: "contains",
        value: jobFlow.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (clientPosition != "" && clientPosition != undefined) {
      filteredArray.push({
        field: "clientPosition",
        operator: "contains",
        value: clientPosition.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (
      daysToExpiration != null &&
      daysToExpiration != undefined &&
      this.props.page != "TSAllProvider"
    ) {
      filteredArray.push({
        field: "daysToExpiration",
        operator: "eq",
        value: Number(daysToExpiration),
        ignoreCase: null,
      });
    }
    if (
      daysToExpiration != null &&
      daysToExpiration != undefined &&
      this.props.page=="TSAllProvider"
    ) {
      filteredArray.push({
        field: "tempCredExpirationDays",
        operator: "eq",
        value: Number(daysToExpiration),
        ignoreCase: null,
      });
    }
    if (runDateFrom != "") {
      filteredArray.push({
        field: "cbiRunDate",
        operator: "gte",
        value: new Date(runDateFrom).toLocaleDateString(),
        ignoreCase: true,
      });
    }
    if (runDateTo != "") {
      filteredArray.push({
        field: "cbiRunDate",
        operator: "lte",
        value: new Date(runDateTo).toLocaleDateString(),
        ignoreCase: true,
      });
    }
    if (createdDateFrom != "") {
      filteredArray.push({
        field: "createdDate",
        operator: "gte",
        value: new Date(createdDateFrom),
        ignoreCase: true,
      });
    }
    if (createdDateTo != "") {
      filteredArray.push({
        field: "createdDate",
        operator: "lte",
        value: new Date(createdDateTo),
        ignoreCase: true,
      });
    }
    if (resolutionDateFrom != "") {
      filteredArray.push({
        field: "resDate",
        operator: "gte",
        value: new Date(resolutionDateFrom),
        ignoreCase: true,
      });
    }
    if (resolutionDateTo != "") {
      filteredArray.push({
        field: "resDate",
        operator: "lte",
        value: new Date(resolutionDateTo),
        ignoreCase: true,
      });
    }
    if (serviceCategory != "" && serviceCategory != undefined && serviceCategory.name != undefined) {
      filteredArray.push({
        field: "serviceCategory",
        operator: "contains",
        value: serviceCategory.name,
        ignoreCase: null,
      });
    }
    if (eventLogDate != "" && eventLogDate != undefined) {
      filteredArray.push({
        field: "eventDate",
        operator: "gte",
        value: new Date(eventLogDate),
        ignoreCase: true,
      });
    }
    // if (message != "" && message != undefined) {
    //   filteredArray.push({
    //     field: "entityType",
    //     operator: "contains",
    //     value: entityType.toLowerCase(),
    //     ignoreCase: true,
    //   });
    // }

    if (reason != "" && reason != undefined) {
      filteredArray.push({
        field: "reason",
        operator: "contains",
        value: reason.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (selectedActions.length) {
      filteredArray.push({
        logic: 'or',
        filters: selectedActions.map(x => {
          return {
            field: "actions",
            operator: "contains",
            value: x.entityName.toLowerCase(),
            ignoreCase: true,
          }
        })

      });
    }

    if (message != "" && message != undefined) {
      filteredArray.push({
        field: "title",
        operator: "contains",
        value: message.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (msgCatValue != "" && msgCatValue != undefined && msgCatValue.name != undefined) {
      filteredArray.push({
        field: "msgCat",
        operator: "contains",
        value: msgCatValue.name,
        ignoreCase: null,
      });
    }
    if (msgPrioValue != "" && msgPrioValue != undefined && msgPrioValue.name != undefined) {
      filteredArray.push({
        field: "msgPrio",
        operator: "contains",
        value: msgPrioValue.name,
        ignoreCase: null,
      });
    }
    if (startDateTime != "") {
      filteredArray.push({
        field: "startDate",
        operator: "gte",
        value: new Date(startDateTime),
        ignoreCase: true,
      });
    }
    if (allFunctionalArea.length) {
      filteredArray.push({
        logic: 'or',
        filters: allFunctionalArea.map(x => {
          return {
            field: "tktFuncArea",
            operator: "eq",
            value: x.text.toLowerCase(),
            ignoreCase: true,
          }
        })

      });
    }
    if (allPriority.length) {
      filteredArray.push({
        logic: 'or',
        filters: allPriority.map(x => {
          return {
            field: "tktPrio",
            operator: "eq",
            value: x.text.toLowerCase(),
            ignoreCase: true,
          }
        })

      });
    }
    if (allRequestType.length) {
      filteredArray.push({
        logic: 'or',
        filters: allRequestType.map(x => {
          return {
            field: "tktReqType",
            operator: "eq",
            value: x.text.toLowerCase(),
            ignoreCase: true,
          }
        })

      });
    }
    if (allAssignTo.length) {
      filteredArray.push({
        logic: 'or',
        filters: allAssignTo.map(x => {
          return {
            field: "currentAssignedTo",
            operator: "eq",
            value: x.text.toLowerCase(),
            ignoreCase: true,
          }
        })

      });
    }
    if (allQueue.length) {
      filteredArray.push({
        logic: 'or',
        filters: allQueue.map(x => {
          return {
            field: "tktQue",
            operator: "eq",
            value: x.text.toLowerCase(),
            ignoreCase: true,
          }
        })

      });
    }
    if (allStatus.length) {
      filteredArray.push({
        logic: 'or',
        filters: allStatus.map(x => {
          return {
            field: "tktStatus",
            operator: "eq",
            value: x.text.toLowerCase(),
            ignoreCase: true,
          }
        })

      });
    }
    if (endDateTime != "") {
      filteredArray.push({
        field: "endDate",
        operator: "lte",
        value: new Date(endDateTime),
        ignoreCase: true,
      });
    }
    if (eventLogType != "" && eventLogType != undefined) {
      filteredArray.push({
        field: "eventType",
        operator: "contains",
        value: eventLogType.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (entityLogType != "" && entityLogType != undefined) {
      filteredArray.push({
        field: "entityType",
        operator: "contains",
        value: entityLogType.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (contentLibTitle != "" && contentLibTitle != undefined) {
      filteredArray.push({
        field: "title",
        operator: "contains",
        value: contentLibTitle.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (contentType != "" && contentType != undefined && contentType.name != undefined) {
      filteredArray.push({
        field: "contentType",
        operator: "contains",
        value: contentType.name,
        ignoreCase: null,
      });
    }
    if (expDate != "") {
      filteredArray.push({
        field: "validTo",
        operator: "gte",
        value: new Date(expDate),
        ignoreCase: true,
      });
    }
    if (assignStartDate != "") {
      filteredArray.push({
        field: "assignStartDate",
        operator: "gte",
        value: new Date(assignStartDate),
        ignoreCase: true,
      });
    }
    if (assignEndDate != "") {
      filteredArray.push({
        field: "assignEndDate",
        operator: "lte",
        value: new Date(assignEndDate),
        ignoreCase: true,
      });
    }
    if (contentLibStatus != "") {
      filteredArray.push({
        field: "status",
        operator: "eq",
        value: contentLibStatus,
        ignoreCase: null,
      });
    }
    if (selectedCnfStatus.length) {
        filteredArray.push({
            logic: 'or',
            filters: selectedCnfStatus.map(x => {
                return {
                    field: "confirmStatus",
                    operator: "contains",
                    value: x.cnfStatus.toLowerCase(),
                    ignoreCase: true,
                }
            })
        });
    }
    if (ticketNumber != "" && ticketNumber != undefined) {
      filteredArray.push({
        field: "ticketNumber",
        operator: "contains",
        value: ticketNumber.toLowerCase(),
        ignoreCase: true,
      });
    }
    if (ticketTitle != "" && ticketTitle != undefined) {
      filteredArray.push({
        field: "ticketTitle",
        operator: "contains",
        value: ticketTitle.toLowerCase(),
        ignoreCase: true,
      });
    }
    return filteredArray;
  };

  basicSearchData = (data, searchString, selectedOption) => {
    this.setState({
      basicSearchData: data,
      basicSearchTextValue: searchString,
      selectedOption: selectedOption,
    });
  };

  searchData = () => {
    const filteredArray = {
      logic: "and",
      filters: this.state.filteredArray,
    };
    let basicSearchData = {
      logic: "or",
      filters: this.state.basicSearchData,
    };
    let data = [];
    if (filteredArray.filters.length > 0) {
      data.unshift(filteredArray);
    }
    if (this.state.basicSearchData.length > 0) {
      if (basicSearchData.filters[0].filters.length > 0) {
        if (basicSearchData.filters[0].filters[0].value != "") {
          data.push(basicSearchData);
        }
      }
    }
    return data;
  };

  onSearch = () => {
    let filteredData = this.onsearchFilteredArray();
    this.setState({ filteredArray: filteredData }, () => {
      let data = this.searchData();
      this.props.onSearchRequisition(data, "true");
      this.props.getSavedSearches();
      this.props.newSearchId(this.props.searchId);
      this.props.onCloseModal();
    });
  };

  saveAndSearch = () => {
    let filterdData = this.onsearchFilteredArray();
    this.setState({ filteredArray: filterdData }, () => {
      if (this.nameValidation()) {
        const { searchName, ifPinColor } = this.state;
        const { edit, entityType, searchId, page } = this.props;
        if (searchName != "") {
          let data = this.searchData();
          const queryData = {
            name: searchName,
            filter: JSON.stringify(data),
            entityType: entityType,
            page: page,
            pinned: ifPinColor,
            searchId: searchId,
          };
          if (!edit) {
            axios
              .post(`/api/search`, JSON.stringify(queryData))
              .then((res) => {
                successToastr("Search saved successfully");
                this.onSearch();
                this.props.newSearchId(res.data);
                this.setState({ newSearchId: res.data });
              })
              .then(() =>
                this.setState({ filteredArray: [], basicSearchData: [] })
              );
          } else {
            axios.put(`/api/search/`, JSON.stringify(queryData)).then((res) => {
              successToastr("Search updated successfully");
              this.onSearch();
              this.props.newSearchId(searchId);
            });
          }
        } else {
          this.setState({ searchNameReq: "Please enter Name" });
        }
      } else {
        this.setState({ searchNameReq: "This name already exists" });
      }
    });
  };

  getRegions = (dataStatefilter, fromChange?) => {
    console.log("test data from region", dataStatefilter);
    let c = 0;
    let reg = [];
    var queryStr = `${toODataString(dataStatefilter)}`;
    var queryUrl = `api/clients/${this.state.clientId}/region?${queryStr}`;
    if (this.props.isReportSearch) {
      queryUrl = `api/clients/region?${queryStr} & $orderby=name`;
    }
    axios
      .get(queryUrl)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.id,
            name: i.name != null ? i.name : "",
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ regionValue: _.uniqBy(reg, 'name'), originalRegion: _.uniqBy(reg, 'name') }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  getRoleName = (dataStatefilter, fromChange?) => {
    let c = 0;
    let reg = [];
    var queryUrl = `api/admin/role?$orderby=name`;
    axios
      .get(queryUrl)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.id,
            name: i.name,
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ roleNameValue: _.uniqBy(reg, 'name'), originalrolname: _.uniqBy(reg, 'name') }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };
  getUserType = (dataStatefilter, fromChange?) => {
    let c = 0;
    let reg = [];
    var queryUrl = `api/admin/role?$orderby=roleTypeName`;
    axios
      .get(queryUrl)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.id,
            roleTypeName: i.roleTypeName,
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ userTypeData: _.uniqBy(reg, 'roleTypeName'), originalUserTypeData: _.uniqBy(reg, 'roleTypeName') }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  getRoleType = (dataStatefilter, fromChange?) => {
    let c = 0;
    let reg = [];
    var queryStr = `${toODataString(dataStatefilter)}`;
    var queryUrl = `api/admin/role?${queryStr}`;
    if (this.props.isReportSearch) {
      var queryUrl = `api/admin/role?${queryStr}`;
    }
    axios.get(queryUrl)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.id,
            name: i.name != null ? i.name : "",
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ roles: reg, originalroles: reg }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  }


  getZones = (dataStatefilter, fromChange?) => {
    let c = 0;
    let reg = [];
    var queryStr = `${toODataString(dataStatefilter)}`;
    var queryUrl = `api/clients/${this.state.clientId}/zone?${queryStr}`;
    if (this.props.isReportSearch) {
      queryUrl = `api/clients/zone?${queryStr} & $orderby=name`;
    }
    axios
      .get(queryUrl)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.id,
            name: i.name != null ? i.name : "",
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ zoneValue: reg, originalZone: reg }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };
  
  getNotificationTypes = (dataStatefilter,fromChange?) => {
    let c = 0;
    let reg = [];
    var queryUrl = `api/admin/notificationtype?$orderby=name`;
    axios
      .get(queryUrl)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.id,
            name: i.name != null ? i.name : "",
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ notificationTypeValue: reg, originalNotificationType: reg }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  getServiceCategory = (dataStatefilter, fromChange?) => {
    let c = 0;
    let reg = [];
    axios
      .get(`api/candidates/servicecat?$orderby=name`)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.id,
            name: i.name != null ? i.name : "",
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ serviceCategoryValue: reg }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  getReqStatus = (dataStatefilter?, fromChange?) => {
    let c = 0;
    let reg = [];
    axios
      .get(`api/requisitions/requisitionStatus?$orderby=name`)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.id,
            name: i.name != null ? i.name : "",
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ requisitionStatusValue: reg }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  getTsStatus = (dataStatefilter?, fromChange?) => {
    let c = 0;
    let reg = [];
    axios
      .get(`api/ts/tsStatus?$orderby=name`)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.id,
            name: i.name != null ? i.name : "",
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ timesheetStatusData: reg }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  getHiringManagers = (dataStatefilter, fromChange?) => {
    console.log("test data from hiringMAnagers", dataStatefilter);
    let c = 0;
    let reg = [];

    var queryStr = `${toODataString(dataStatefilter)}`;
    let queryParams = `permCode eq '${AppPermissions.CAND_INTVW_RESULT_CREATE}'`;
    var finalQueryString = KendoFilter(dataStatefilter, queryStr, queryParams);
    var queryUrl = `api/clients/${this.state.clientId}/approvers?${finalQueryString}`;
    if (this.props.isReportSearch) {
      queryUrl = `api/clients/approvers?${finalQueryString}`;
    }

    axios
      .get(queryUrl)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.id,
            name: i.name != null ? i.name : "",
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ hiringManagerValue: reg, originalHiringManager: reg }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  handleDivisionChange = (division) => {
    this.setState({ division: division, divisionId: division.id });
    if (division.id !=null) {
      let dataState = {
        skip: 0,
        take: 100,
      };
      // this.getLocations(division.id, dataState);
    }
  };

  handlePositionChange = (position) => {
    this.setState({ positionSelected: position, position: position.text });
    // this.getLocations(division.id, dataState);
  };

  handleRegionChange = (region) => {
    this.setState({ region: region.name });
  };
  handleRoleChange = (roleName) => {
    this.setState({ roleName: roleName.name });
  };

  handleZoneChange = (zone) => {
    this.setState({ zone: zone.name });
  };
  handleNotificationTypeChange = (notificationType) => {
    this.setState({ notificationType: notificationType.name });
  };

  handleShareCandidateStatusChange = (shareCandidateStatus) => {
    this.setState({ shareCandidateStatus: shareCandidateStatus.name });
  };

  handleServiceCategoryChange = (serviceCategory) => {
    this.setState({ serviceCategory: serviceCategory.name });
  }

  handleHiringManagerChange = (hiringManager) => {
    this.setState({ hiringManager: hiringManager.name });
  };

  setInitialValue = (fromChange) => {
    this.initialValue(fromChange);
  };
  getDivisions(dataStateFilter, fromChange?) {
    let c = 0;
    let div = [];
    var queryStr = `${toODataString(dataStateFilter)}`;
    var queryUrl = `api/clients/${this.state.clientId}/divisions?${queryStr}`;
    if (this.props.isReportSearch) {
      queryUrl = `api/clients/divisions?${queryStr} & $orderby=name`;
    }
    axios
      .get(queryUrl)
      .then((res) => {
        div = res.data.map((i) => {
          let data = {
            id: i.id,
            text: i.name,
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState(
            { divisionsValue: div, originalDivision: div },
            () => {
              this.setInitialValue(fromChange);
            }
          ),
            (c = 1))
          : null
      )
      .then(() =>
        this.setState({ location: this.props.edit ? this.props.location : "" })
      );
  }

  getVendorInvoice(dataStateFilter, fromChange?){
    let c = 0;
    let ven = [];
    if(this.props.page=="VendorInvoicing" || this.props.page =="VIUnderReview" || this.props.page=="ClientStatementReport"){
      var queryParam =`description eq 'Vendor Invoice'`
    }else if(this.props.page=="ClientInvoicing"){
      var queryParam =`description eq 'Client Invoice'`
    } 
    else if(this.props.page=="CandidateShareWF"){
      var queryParam =`description eq 'Cand Share'`
    }
    if(queryParam){
      var queryUrl = `api/workflow/states?$filter=${queryParam}`;
      axios
        .get(queryUrl)
        .then((res) => {
          ven = res.data
          .map((i) => {
            let data = {
              id:i.stateId,
              name: i.name,
            };
            return data;
          });
        })
        .then(() =>
          c==0
            ? (this.setState(
              { vendorclientInvoiceData: ven, originalvendorclientInvoiceData: ven },
              () => {
                this.setInitialValue(fromChange);
              }
            ),
              (c = 1))
            : null
        )

    }  

  }
  

  getLocations(dataState, divisionId?) {
    if (this.requestStarted) {
      clearTimeout(this.pendingRequest);
      this.pendingRequest = setTimeout(() => {
        this.getLocations(dataState);
      }, 50);
      return;
    }
    let loc = []
    this.requestStarted = true;


    var finalState = dataState;

    var queryStr = `${toODataString(finalState, { utcDates: true })}`;
    var queryUrl = `api/clients/${this.state.clientId}/locations?${queryStr} & $orderby=name`;
    if (this.props.isReportSearch) {
      queryUrl = `api/clients/locations?${queryStr} & $orderby=name`;
    }




    //var queryParams = divisionId ? `divId eq ${divisionId}` : "";

    //var finalQueryString = queryStr;
    // var finalQueryString = queryStr;
    // var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
    axios
      .get(queryUrl)
      .then((response) => response)
      .then((response) => {
        this.getLocationCount(queryUrl);
        const items = [];
        response.data.forEach((element, index) => {
          const item = element.name;
          items.push(item);
          this.dataCaching[index + dataState.skip] = item;
        });

        if (dataState.skip ==this.state.skip) {
          // if (items.length < 5) {
          //     this.setState({total:5})
          // }
          // else {
          //     this.setState({ total: 20 });
          // }
          loc = response.data.map((i) => {
            let data = {
              id: i.id,
              text: i.name,
            };
            return data;
          });
          this.setState({
            locationsValue: items,
            locationsListValue: loc
          });
        }
        this.requestStarted = false;
      });
  }
  getLocationCount = (url) => {
    axios
      .get(
        url
      )
      .then((response) =>
        this.setState({
          total: response.data.length,
          originallocations: response.data,
        })
      );
  };

  getPositions(dataState?, fromChange?) {
    if (dataState==undefined) {
      dataState = {
        skip: 0,
        take: 100
      }
    }
    let c = 0;
    let pos = [];
    var finalQueryString = `${toODataString(dataState)}`;
    if (!this.props.isReportSearch) {
      let queryParams = `clientId eq ${this.state.clientId}`;
      finalQueryString = KendoFilter(dataState, finalQueryString, queryParams);
    }
    //var queryUrl = `api/clients/${this.state.clientId}/approvers?${finalQueryString}`;


    axios
      .get(`api/clients/positions?${finalQueryString}&$orderby=name`)
      .then((response) => response)
      .then((res) => {
        pos = res.data.map((i) => {
          let data = {
            id: i.id,
            text: i.name,
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState(
            { positionValue: pos, originalPositions: pos },
            () => {
              this.setInitialValue(fromChange);
            }
          ),
            (c = 1))
          : null
      )
      .then(() =>
        this.setState({ position: this.props.edit ? this.props.position : "" })
      );
  }

  getRole = (dataState?, fromChange?) => {
    // var queryStr = `${toODataString(dataState)}`;
    let role = [];
    let c = 0;
    axios
      .get(`api/admin/role`)
      .then((res) => {
        role = res.data.map((i) => {
          let data = {
            id: i.id,
            text: i.name,
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ role: role }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  getMsgCat = (fromChange?)=>{
    let c = 0;
    let reg = [];
    axios
      .get(`api/messages/category?$orderby=name`)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.msgCatId,
            name: i.name != null ? i.name : "",
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ msgCatData: reg }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  }

  getMsgPrio = (fromChange?)=>{
    let c = 0;
    let reg = [];
    axios
      .get(`api/messages/priority?$orderby=name`)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.msgPrioId,
            name: i.name != null ? i.name : "",
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ msgPrioData: reg }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  }

  getClients = (dataStatefiltered, fromChange?) => {
    var queryStr = `${toODataString(dataStatefiltered)}`;
    let clients = [];
    let c = 0;
    if (!isRoleType(AuthRoleType.Vendor)) {
      axios.get(`api/clients?${queryStr}&$orderby=client`).then((response) => {
        this.getLocationCount(`api/clients/${this.state.clientId}/locations?${queryStr} & $orderby=name`);
        const items = [];
        response.data.forEach((element, index) => {
          let data = {
            id: element.id,
            text: element.client,
          };
          // const item = element.client;
          items.push(data);
          // this.dataCaching[index + dataState.skip] = data;
        });
        if (this.state.dataState.skip ==this.state.skip) {
          this.setState(
            {
              clientsData: items
            },
            () => this.setInitialValue(fromChange)
          );
        }
        this.requestStarted = false;
      });
    }
  };

  getActionsData = (dataStatefilter, fromChange?) => {
    let c = 0;
    let reg = [];
    axios
      .get(`api/workflow/actions?$orderby=name`)
      .then((res) => {
        reg = res.data.filter(x=> x.isActionMap==true).map((i) => {
          let data = {
            actionId: i.actionId,
            name: i.name,
            entityName:i.entityName,
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ actionsData: reg }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  getUserClients = (dataStatefiltered?, fromChange?) => {
    if (!dataStatefiltered) {
      dataStatefiltered = {
        skip: 0,
        take: 100
      };
    }
    var queryStr = `${toODataString(dataStatefiltered)}`;
    if (!isRoleType(AuthRoleType.Vendor)) {
      axios.get(`api/users/${this.userObj.userId}/clients?${queryStr}&$orderby=name`).then((response) => {
        //this.getLocationCount(queryStr);
        const items = [];
        response.data.forEach((element, index) => {
          let data = {
            id: element.id,
            text: element.name,
            clientId: element.clientId
          };
          // const item = element.client;
          items.push(data);
          // this.dataCaching[index + dataState.skip] = data;
        });
        if (this.state.dataState.skip ==this.state.skip) {
          this.setState(
            {
              userClientsData: items,
            },
            () => this.setInitialValue(fromChange)
          );
        }
        this.requestStarted = false;
      });
    }
  };

  getFunctionalArea = (fromChange?) => {
    let functionalAreaData = [];
    let c = 0;
    axios
      .get(`api/tickets/functionalareas`)
      .then((res) => {
        functionalAreaData = res.data.map((i) => {
          let data = {
            id: i.id,
            text: i.name,
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ functionalAreaData: functionalAreaData }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  getContentType = (fromChange?) => {
    let c = 0;
    let reg = [];
    axios
      .get(`api/contentlib/contenttype?$orderby=name`)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.id,
            name: i.name != null ? i.name : "",
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ contentTypeData: reg }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  getRequestType = (fromChange?) => {
    let requestTypeData = [];
    let c = 0;
    axios
      .get(`api/tickets/requesttype`)
      .then((res) => {
        requestTypeData = res.data.map((i) => {
          let data = {
            id: i.id,
            text: i.name,
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ requestTypeData: requestTypeData }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  getAssignTo = (fromChange?,allClients?) => {
    let assignToData = [];
    let c = 0;
    let queryParams = `status eq 'Active' and roleType eq ${AuthRoleType.SystemAdmin} and (userRegistered eq ${RegistrationStatus.COMPLETE} or userRegistered eq ${RegistrationStatus.AUTOREGISTER} or (userRegistered eq ${RegistrationStatus.PENDINGTNC} and autoRegister eq true))&$orderby=username`;
    // if(allClients.length !=0){
    //   queryParams = `clientId in (${allClients}) and status eq 'Active' and roleType eq ${AuthRoleType.SystemAdmin} and (userRegistered eq ${RegistrationStatus.COMPLETE} or userRegistered eq ${RegistrationStatus.AUTOREGISTER} or (userRegistered eq ${RegistrationStatus.PENDINGTNC} and autoRegister eq true))&$orderby=username`;
    // }
    axios
      .get(`api/users?$filter=${queryParams}`)
      .then(async(res) => {
        assignToData = res.data.map((i) => {
          let data = {
            id: i.userId,
            text: i.fullName,
          };
          return data;
        });
        this.setState({
          assignToData: assignToData
        })
      })
    };

    getQueue = (fromChange?) => {
      let queueData = [];
      let c = 0;
      axios
        .get(`api/tickets/queue`)
        .then((res) => {
          queueData = res.data.map((i) => {
            let data = {
              id: i.id,
              text: i.name,
            };
            return data;
          });
        })
        .then(() =>
          c==0
            ? (this.setState({ queueData: queueData }, () => {
              this.setInitialValue(fromChange);
            }),
              (c = 1))
            : null
        );
    };  

  handleTicketClientChange = (keyword, fieldName) => {
    let change = {};
    change[fieldName] = keyword;
    let Id = keyword.map((client) => client.id);
    this.setState(change, () => {
      this.getAssignTo(this.state.dataState, Id);
    });
   
  }
  getStatus = (fromChange?) => {
    let statusData = [];
    let c = 0;
    axios
      .get(`api/tickets/status`)
      .then((res) => {
        statusData = res.data.map((i) => {
          let data = {
            id: i.id,
            text: i.name,
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ statusData: statusData }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  getPriority = (fromChange?) => {
    let priorityData = [];
    let c = 0;
    axios
      .get(`api/tickets/priorities`)
      .then((res) => {
        priorityData = res.data.map((i) => {
          let data = {
            id: i.id,
            text: i.name,
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ priorityData: priorityData }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  onUserClientFilterChange = (event, fieldName) => {
    let dataStatefiltered: any = {
      skip: 0,
      take: 100,
      filter: {
        logic: "or",
        filters: [
          {
            field: fieldName=="clients" ? "client" : "name",
            operator: "contains",
            value: `${event.filter.value.toLowerCase()}`,
            ignoreCase: true,
          },
        ],
      },
    };
    return this.getUserClients(dataStatefiltered);
  }

  getConfirmStatusData = (dataStatefilter, fromChange?) => {
    let c = 0;
    let reg = [];
    axios
      .get(`api/candidates/confirmstatus?&$filter=intId ne ${ConfirmStatusIntId.Active} and intId ne ${ConfirmStatusIntId.Expired}`)
      .then((res) => {
        reg = res.data.map((i) => {
          let data = {
            id: i.id,
            cnfStatus: i.cnfStatus,
          };
          return data;
        });
      })
      .then(() =>
        c==0
          ? (this.setState({ confirmStatusData: reg }, () => {
            this.setInitialValue(fromChange);
          }),
            (c = 1))
          : null
      );
  };

  onFilterChange = (event, fieldName) => {
    let dataStatefiltered: any = {
      skip: 0,
      take: 100,
      filter: {
        logic: "or",
        filters: [
          {
            field: fieldName=="clients" ? "client" : "name",
            operator: "contains",
            value: `${event.filter.value.toLowerCase()}`,
            ignoreCase: true,
          },
        ],
      },
    };
    if (this.props.isReportSearch) {
      dataStatefiltered = {
        skip: 0,
        take: 100,
        filter: {
          logic: "and",
          filters: [
            {
              logic: "or",
              filters: [
                {
                  field: fieldName=="clients" ? "client" : "name",
                  operator: "contains",
                  value: `${event.filter.value.toLowerCase()}`,
                  ignoreCase: true,
                },
              ],
            },
            {
              logic: 'or',
              filters: this.state.clientIds.map(x => {
                return {
                  field: "clientIntId",
                  operator: "eq",
                  value: x.id,
                  ignoreCase: true,
                }
              })
            }]
        },
      };
    }
    switch (fieldName) {
      case "location":
        return this.getLocations(dataStatefiltered);
      case "region":
        return this.getRegions(dataStatefiltered);
      case "zone":
        return this.getZones(dataStatefiltered);
      case "notificationType":
        return this.getNotificationTypes(dataStatefiltered);
      case "serviceCategory":
        return this.getServiceCategory(dataStatefiltered);
      case "status":
        return this.getReqStatus(dataStatefiltered);
      case "hiringManager":
        return this.getHiringManagers(dataStatefiltered);
      case "division":
        return this.getDivisions(dataStatefiltered);
      case "clients":
        return this.getClients(dataStatefiltered);
      case "entityName":
        return this.getActionsData(dataStatefiltered);
      case "status":
        return this.getVendorInvoice(dataStatefiltered);  
      case "roleName":
        return this.getRoleName(dataStatefiltered);
      case "roleType":
        return this.getRoleType(dataStatefiltered);
      case "roleTypeName":
        return this.getUserType(dataStatefiltered);  
      case "cnfStatus":
      return this.getConfirmStatusData(dataStatefiltered);
      // case 'userClients':
      //   return this.getUserClients(dataStatefiltered);
      // case 'list':
      //     return this.renderDropDown();
      default:
        return "";
    }

    this.setState({
      skip: 0,
    });
  };

  onPosFilterChange = (event, fieldName) => {
    this.filteredData = filterBy(
      this.state.originalPositions.slice(),
      event.filter
    );
    let dataState = {
      skip: 0,
      take: 100,
      filter: {
        logic: "or",
        filters: [
          {
            field: "name",
            operator: "contains",
            value: `${event.filter.value.toLowerCase()}`,
            ignoreCase: true,
          },
        ],
      },
    };
    this.getPositions(dataState);
    this.setState({
      skip: 0,
    });
  };

  pageChange = (event, fieldName) => {

    const skip = event.page.skip;
    const take = event.page.take;
    let dataState = {
      skip: skip,
      take: skip + take,
    };
    if (this.shouldRequestData(skip)) {
      this.getLocations(dataState, this.state.divisionId);
      // switch (fieldName) {
      //   case "location":
      //     return this.getLocations(dataState);
      //   case "clients":
      //     return this.getClients(dataState);
      // }
    }
    const data = this.getCachedData(skip);
    this.setState({
      locationsValue: data,
      skip: skip,
    });
  };

  shouldRequestData(skip) {
    for (let i = 0; i < pageSize; i++) {
      if (!this.dataCaching[skip + i]) {
        return true;
      }
    }
    return false;
  }

  getCachedData(skip) {
    const data = [];
    for (let i = 0; i < pageSize; i++) {
      data.push(this.dataCaching[i + skip] || emptyItem);
    }
    return data;
  }

  nameValidation = () => {
    var name = this.props.searchId
      ? this.props.savedSearches.filter(
        (i) =>
          this.state.searchName.toLowerCase() ==i.name.toLowerCase() &&
          i.searchId != this.props.searchId
      )
      : this.props.savedSearches.filter(
        (i) => this.state.searchName.toLowerCase() ==i.name.toLowerCase()
      );
    // var name = this.props.savedSearches.filter((i) => this.state.searchName ==i.name);
    if (name.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  onCloseModal = () => {
    this.setState({ filteredArray: [], basicSearchData: [] }, () =>
      this.props.onCloseModal(
        this.state.basicSearchTextValue,
        this.state.selectedOption
      )
    );
  };
  onClear = () => {
    let UserClientsData = this.state.userClientsData
    let DivisionData = this.state.divisionsValue;
    let vendorclientInvoiceData = this.state.vendorclientInvoiceData
    let positionValue = this.state.positionValue;
    let regionValue = this.state.regionValue;
    let roleNameValue = this.state.roleNameValue;
    let zoneValue = this.state.zoneValue;
    let notificationTypeValue = this.state.notificationTypeValue;
    let serviceCategoryValue = this.state.serviceCategoryValue;
    let hiringManagerValue = this.state.hiringManagerValue;
    let requisitionStatusValue = this.state.requisitionStatusValue;
    let tsStatusData = this.state.timesheetStatusData;
    let actionsData = this.state.actionsData;
    let userTypeData = this.state.userTypeData;
    let clientsData=this.state.clientsData;
    let functionalAreaData=this.state.functionalAreaData;
    let priorityData=this.state.priorityData;
    let requestTypeData=this.state.requestTypeData;
    let statusData=this.state.statusData;
    let msgCatData = this.state.msgCatData;
    let msgPrioData = this.state.msgPrioData;
    let assignToData = this.state.assignToData;
    let queueData=this.state.queueData;
    let confirmStatusData = this.state.confirmStatusData;
    let locationsValue = this.state.locationsValue
    this.setState(this.initialState, () => {
      this.childRef.current.basicSearchValue(
        this.props.basicSearchTextValue,
        this.state.selectedOption
      );
    });
    this.setState({ filteredArray: [], basicSearchData: [] });
    this.props.clearState();
    this.setState({
      userClientsData: UserClientsData,
      divisionsValue: DivisionData,
      positionValue: positionValue,
      vendorclientInvoiceData:vendorclientInvoiceData,
      regionValue: regionValue,
      roleNameValue: roleNameValue,
      zoneValue: zoneValue,
      notificationTypeValue:notificationTypeValue,
      serviceCategoryValue: serviceCategoryValue,
      hiringManagerValue: hiringManagerValue,
      requisitionStatusValue: requisitionStatusValue,
      timesheetStatusData: tsStatusData,
      actionsData: actionsData,
      userTypeData: userTypeData,
      clientsData:clientsData,
      functionalAreaData:functionalAreaData,
      priorityData:priorityData,
      requestTypeData:requestTypeData,
      statusData:statusData,
      msgCatData: msgCatData,
      msgPrioData: msgPrioData,
      assignToData: assignToData,
      queueData:queueData,
      confirmStatusData:confirmStatusData,
      locationsValue: locationsValue
    });
  };
  private regionDebounceHandler = debounce(this.getRegions, 500);
  private divisionDebounceHandler = debounce(this.getDivisions, 500);
  private vendorDebounceHandler = debounce(this.getVendorInvoice, 500);
  private locationDebounceHandler = debounce(this.getLocations, 500);
  private clientDebounceHandler = debounce(this.getClients, 500);
  private zoneDebounceHandler = debounce(this.getZones, 500);
  private roleTypeDebounceHandler = debounce(this.getRoleType, 500);
  private hmDebounceHandler = debounce(this.getHiringManagers, 500);
  private posDebounceHandler = debounce(this.getPositions, 500);
  private rollNameDebouncHandler = debounce(this.getRoleName, 500);
  private userTypeDebounceHandler = debounce(this.getUserType, 500);
  private serviceCategoryDebounceHandler = debounce(this.getServiceCategory, 500);
  private notificationTypeDebounceHandler = debounce(this.getNotificationTypes, 500);
  
  render() {
    const {
      searchName,
      searchNameReq,
      reqNumber,
      status,
      expenseStatus,
      client,
      ifPinColor,
      candidateName,
      candidateFullName,
      userName,
      userRole,
      email,
      notificationCategory,
      address1,
      city,
      state,
      clientStatus,
      vendor,
      serviceCategory,
      location,
      totalHours,
      vendorName,
      hours,
      position,
      associate,
      serviceType,
      tags,
      jobCategory,
      data,
      type,
      eventLogDate,
      jobFlow,
      clientPosition,
      tier,
      eventLogType,
      entityLogType,
      contentLibTitle,
      contentType,
      ticketNumber,
      ticketTitle
    } = this.state;

    return (
      <div className="modal-content border-0">
        <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
          <h4 className="modal-title text-white fontFifteen">
            Advanced Search
          </h4>
          <button
            type="button"
            className="close text-white close_opacity"
            data-dismiss="modal"
            onClick={() => this.onCloseModal()}
          >
            &times;
          </button>
        </div>
        <div
          className="modal-body forSearchBox_advancesearch"
          id="forSearchBox">
          <div className="row ml-0 mr-0 basic-search-mobile">
            <div className="col-12">
              <BasicSearch
                basicSearchValue={this.props.basicSearchTextValue}
                selectedOption={this.props.selectedOption}
                sendData={this.basicSearchData}
                entityType={this.props.page}
                advancedSearch={true}
                ref={this.childRef}
                optionChange={this.props.optionChange}
                page={this.props.page}
                inputedValue={this.props.inputedValue}
              />
            </div>
          </div>
          <div className="row mx-0">
            {auth.hasPermissionV2(AppPermissions.REPORT_MULTI_CLIENT_VIEW) && this.userClients.length > 1 && (this.props.isReportSearch) &&
              <div className="col-12 col-sm-6 mt-2">
                <label className="mb-1 font-weight-bold">Clients</label>
                <MultiSelect
                  className="form-control"
                  data={this.state.userClientsData}
                  textField="text"
                  dataItemKey="id"
                  id="clients"
                  autoClose={false}
                  itemRender={this.itemRender}
                  value={this.state.clientIds}
                  onChange={(e) =>
                    this.updateState(e.target.value, "clientIds")
                  }
                  placeholder="Select Clients..."
                  filterable={false}
                  onFilterChange={(e) => this.onUserClientFilterChange(e, "userClients")}
                />
              </div>
            }
            {this.props.page =="TSAllProvider" ||
              this.props.page=="TSSubmitted" ||
              this.props.page=="TSUnderReview" ||
              this.props.page=="TimesheetReport" ||
              this.props.page =="FilledAssignmentReport" ||
              this.props.page =="ExpiringCredentialReport" ||
              this.props.page=="ReqPerformanceReport" ||
              this.props.page=="ClientActivityReport" ||
              this.props.page=="SpendForecastReport" ||
              this.props.page=="AssociateExpense" ||
              this.props.page=="FinancialAccrualReport" ? (
              <React.Fragment>
                {this.props.page != "ExpiringCredentialReport" && this.props.page != "SpendForecastReport"  &&
                 this.props.page != "AssociateExpense" && this.props.page != "FinancialAccrualReport" &&
                  (
                    <div className="col-12 col-sm-6 mt-2">
                      <label className="mb-1 font-weight-bold">Zone</label>
                      <DropDownList
                        data={this.state.zoneValue}
                        className="form-control"
                        textField="name"
                        dataItemKey="id"
                        id="zones"
                        name="zone"
                        value={this.state.zone}
                        filterable={
                          this.state.zoneValue.length > 5 ? true : false
                        }
                        onFilterChange={(e) => this.onFilterChange(e, "zone")}
                        onChange={(e) =>
                          this.updateState(e.target.value, "zone")
                        }
                      />
                    </div>
                  )}
                {this.props.page != "ExpiringCredentialReport" && this.props.page != "AssociateExpense" &&
                  (
                    <div className="col-12 col-sm-6 mt-2">
                      <label className="mb-1 font-weight-bold">Region</label>
                      <DropDownList
                        data={this.state.regionValue}
                        className="form-control"
                        textField="name"
                        dataItemKey="id"
                        id="regions"
                        name="region"
                        value={this.state.region}
                        filterable={true}
                        onFilterChange={(e) => this.onFilterChange(e, "region")}
                        onChange={(e) =>
                          this.updateState(e.target.value, "region")
                        }
                      />
                    </div>
                  )}
                {this.props.page != "ReqPerformanceReport" && <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">{this.props.page =="AssociateExpense" ? "Associate" : "Provider"}</label>
                  <input
                    type="text"
                    name="candidateName"
                    className="form-control"
                    placeholder="Enter Provider Name"
                    maxLength={100}
                    onChange={(e) =>
                      regexFormat.test(e.target.value) &&
                      this.updateState(e.target.value, "candidateFullName")
                    }
                    value={candidateFullName}
                  />
                </div>}
              </React.Fragment>
            ) : null}
            {this.props.page =="TSSingleProvider" ? (
              <React.Fragment>

                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Status</label>
                  <MultiSelect
                    className="form-control "
                    data={this.state.timesheetStatusData}
                    textField="name"
                    dataItemKey="id"
                    id="timesheetInfo"
                    autoClose={false}
                    name="timesheetInfo"
                    itemRender={this.itemRender}
                    value={this.state.tsStatuses}
                    onChange={(e) =>
                      this.updateState(e.target.value, "tsStatuses")
                    }
                    placeholder="Select Status"
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "status")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Total Hours</label>
                  <input
                    type="number"
                    name="totalHours"
                    className="form-control"
                    placeholder="Enter Total Hours"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "totalHours")
                    }
                    value={totalHours}
                  />
                </div>


                <div className="col-12 date-search col-sm-6 mt-2">
                  <div className="row">
                    <div className="col-12 col-sm-6">
                      <label className="mb-1 font-weight-bold">Pay Period</label>
                      <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="startDate"
                        formatPlaceholder="formatPattern"
                        value={this.state.startDate}
                        title="Start Date"
                        onChange={(e) =>
                          this.updateState(e.target.value, "startDate")
                        }
                      />
                    </div>
                    <div className="col-12 col-sm-6 mt-0 mt-sm-0">
                      <label className="mb-1 font-weight-bold invisible"
                      >
                        f
                      </label>
                      <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="endDate"
                        formatPlaceholder="formatPattern"
                        value={this.state.endDate}
                        title="End Date"
                        onChange={(e) =>
                          this.updateState(e.target.value, "endDate")
                        }
                      />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : null}

            {this.props.page =="MyRequisitions" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Region</label>
                  <DropDownList
                    data={this.state.regionValue}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    id="regions"
                    name="region"
                    value={this.state.region}
                    filterable={
                      this.state.regionValue.length > 5 ? true : false
                    }
                    onFilterChange={(e) => this.onFilterChange(e, "region")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "region")
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">State</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    placeholder="Enter State"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "state")}
                    value={state}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    placeholder="Enter City"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "city")}
                    value={city}
                  />
                </div>

              </React.Fragment>
            ) : null}

            <React.Fragment>
              {
                this.props.page =="PendingRequisitions" ||
                  this.props.page =="TSAllProvider" ||
                  this.props.page =="TSSubmitted" ||
                  this.props.page =="TSUnderReview" ||
                  this.props.page =="TimesheetReport" ||
                  this.props.page=="ReqPerformanceReport" ||
                  this.props.page =="FilledAssignmentReport" ||
                  this.props.page =="ExpiringCredentialReport" ||
                  this.props.page =="ClientActivityReport" ||
                  this.props.page =="SpendForecastReport" ||
                  this.props.page =="AssociateExpense" ||
                  this.props.page =="ConfirmationAssignment" ||
                  this.props.page =="FinancialAccrualReport" ? (
                  <div className="col-12 col-sm-6 mt-2">
                    <label className="mb-1 font-weight-bold">Division</label>
                    <DropDownList
                      data={this.state.divisionsValue}
                      className="form-control"
                      textField="text"
                      dataItemKey="id"
                      id="divisions"
                      name="division"
                      value={this.state.division}
                      onChange={(e) => this.handleDivisionChange(e.target.value)}
                      filterable={true}
                      onFilterChange={(e) => this.onFilterChange(e, "division")}
                    />
                  </div>
                ) : null}
              {
                this.props.page =="PendingRequisitions" ||
                  this.props.page =="CandidateSubmission" ||
                  this.props.page =="TSAllProvider" ||
                  this.props.page =="TSSubmitted" ||
                  this.props.page =="TSUnderReview" ||
                  this.props.page =="TimesheetReport" ||
                  this.props.page=="ReqPerformanceReport" ||
                  this.props.page =="FilledAssignmentReport" ||
                  this.props.page =="ExpiringCredentialReport" ||
                  this.props.page =="ClientActivityReport" ||
                  this.props.page =="SpendForecastReport" ||
                  this.props.page =="AssociateExpense" ||
                  this.props.page =="ConfirmationAssignment" ||
                  this.props.page =="FinancialAccrualReport" ? (
                  <div className="col-12 col-sm-6 mt-2   ">
                    <label className="mb-1 font-weight-bold">Location</label>
                    <DropDownList
                      className={"form-control"}
                      id="location"
                      name="location"
                      data={this.state.locationsValue}
                      onChange={(e) => this.updateState(e.target.value, "location")}
                      value={location}
                      virtual={{
                        total: this.state.total,
                        pageSize: this.state.page,
                        skip: this.state.skip,
                      }}
                      onPageChange={(e) => this.pageChange(e, "location")}
                      filterable={true}
                      onFilterChange={(e) => this.onFilterChange(e, "location")}
                      popupSettings={{
                        height: "140px",
                      }}
                    />
                  </div>
                ) : null}
            </React.Fragment>
            {this.props.page =="MyRequisitions" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Division</label>
                  <MultiSelect
                    className="form-control "
                    data={this.state.divisionsValue}
                    textField="text"
                    dataItemKey="id"
                    id="divisions"
                    autoClose={false}
                    name="division"
                    itemRender={this.itemRender}
                    value={this.state.divisions}
                    onChange={(e) =>
                      this.updateState(e.target.value, "divisions")
                    }
                    placeholder="Select Division"
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "division")}
                  />
                  {/* <DropDownList
                        data={this.state.divisionsValue}
                        className="form-control"
                        textField="text"
                        dataItemKey="id"
                        id="divisions"
                        name="division"
                        value={this.state.division}
                        onChange={(e) => this.handleDivisionChange(e.target.value)}
                        filterable={true}
                        onFilterChange={(e) => this.onFilterChange(e, "division")}
                      /> */}
                </div>

                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Location</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.locationsListValue}
                    textField="text"
                    dataItemKey="id"
                    id="locations"
                    autoClose={false}
                    name="location"
                    itemRender={this.itemRender}
                    value={this.state.locations}
                    onChange={(e) =>
                      this.updateState(e.target.value, "locations")
                    }
                    placeholder="Select Location"
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "location")}
                  />
                  {/* <DropDownList
                        className={"form-control"}
                        id="location"
                        name="location"
                        data={this.state.locationsValue}
                        onChange={(e) => this.updateState(e.target.value, "location")}
                        value={location}
                        virtual={{
                          total: this.state.total,
                          pageSize: this.state.page,
                          skip: this.state.skip,
                        }}
                        onPageChange={(e) => this.pageChange(e, "location")}
                        filterable={true}
                        onFilterChange={(e) => this.onFilterChange(e, "location")}
                        popupSettings={{
                          height: "140px",
                        }}
                      /> */}
                </div>


                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Hiring Manager</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.hiringManagerValue}
                    textField="name"
                    dataItemKey="id"
                    id="hiringManagers"
                    autoClose={false}
                    name="hiringManager"
                    itemRender={this.itemRender}
                    value={this.state.hiringManagers}
                    onChange={(e) =>
                      this.updateState(e.target.value, "hiringManagers")
                    }
                    placeholder="Select Hiring Manager"
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "hiringManager")}
                  />
                  {/* <DropDownList
                    data={this.state.hiringManagerValue}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    id="hiringManagers"
                    name="hiringManager"
                    value={this.state.hiringManager}
                    filterable={
                      this.state.hiringManagerValue.length > 5 ? true : false
                    }
                    onFilterChange={(e) => this.onFilterChange(e, "hiringManager")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "hiringManager")
                    }
                  /> */}
                </div>
              </React.Fragment>

            ) : null}
            {this.props.page =="MyRequisitions" ||
              this.props.page =="PendingRequisitions" ||
              this.props.page =="CandidateSubmission" ||
              this.props.page=="ReqPerformanceReport" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Requisition Number
                  </label>
                  <input
                    type="text"
                    name="requisitionNumber"
                    className="form-control"
                    placeholder="Enter Requisition Number"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "reqNumber")
                    }
                    value={reqNumber}
                  />
                </div>
                {this.props.page != "PendingRequisitions" && this.props.page != "MyRequisitions" && (
                  <div className="col-12 col-sm-6 mt-2   ">
                    <label className="mb-1 font-weight-bold">
                      Requisition Status
                    </label>
                    <DropDownList
                      className={"form-control"}
                      name="requisitionStatus"
                      data={this.state.reqStatusData}
                      onChange={(e) => this.updateState(e.target.value, "status")}
                      value={status}
                      filterable={true}
                      onFilterChange={(e) => {
                        let filteredData = filterBy(Req_Status.slice(), e.filter);
                        return this.setState({ reqStatusData: filteredData });
                      }}
                      popupSettings={{
                        height: "140px",
                      }}
                    />
                  </div>
                )}

                {this.props.page=="MyRequisitions" && (
                  <div className="col-12 col-sm-6 mt-2   ">
                    <label className="mb-1 font-weight-bold">
                      Requisition Status
                    </label>
                    <MultiSelect
                      className="form-control"
                      data={this.state.requisitionStatusValue}
                      textField="name"
                      dataItemKey="id"
                      id="requisitionStatus"
                      autoClose={false}
                      name="requisitionStatus"
                      itemRender={this.itemRender}
                      value={this.state.requisitionStatus}
                      onChange={(e) =>
                        this.updateState(e.target.value, "requisitionStatus")
                      }
                      placeholder="Select Status"
                      filterable={false}
                      onFilterChange={(e) => this.onFilterChange(e, "requisitionStatus")}
                    />
                  </div>
                )}

              </React.Fragment>
            ) : null}

            {this.props.page =="TSAllProvider" ||
              this.props.page=="TSSubmitted" ||
              this.props.page=="TSUnderReview" ||
              this.props.page=="TimesheetReport" ||
              this.props.page =="FilledAssignmentReport" ||
              this.props.page =="ExpiringCredentialReport"  ||
              this.props.page =="AssociateExpense" ||
              this.props.page =="ConfirmationAssignment" ||
              this.props.page =="FinancialAccrualReport" ? (

              <React.Fragment>
                {this.props.entityType !="TimesheetReport" && this.props.page !="FinancialAccrualReport" && (
                  <div className="col-12 col-sm-6 mt-2">
                    <label className="mb-1 font-weight-bold">Position</label>
                    {/* <CustomDropDownList
                                            className={"form-control"}
                                            id="position"
                                            name="position"
                                            textField="text"
                                            valueField="text"
                                            dataItemKey="text"
                                            data={this.state.positionValue}
                                            onChange={(e) => this.updateState(e.target.value, "position")}
                                            value={position}
                                            filterable={true}
                                            onFilterChange={(e) => this.onPosFilterChange(e, "position")}
                                            popupSettings={{
                                                height: "140px",
                                            }}
                                        /> */}
                    <DropDownList
                      className={"form-control"}
                      id="position"
                      name="position"
                      data={this.state.positionValue}
                      textField="text"
                      dataItemKey="text"
                      onChange={(e) =>
                        this.handlePositionChange(e.target.value)
                      }
                      value={this.state.positionSelected}
                      filterable={true}
                      onFilterChange={(e) =>
                        this.onPosFilterChange(e, "position")
                      }
                      popupSettings={{
                        height: "140px",
                      }}
                    />
                    {/* <DropDownList
                                            data={this.state.divisionsValue}
                                            className="form-control"
                                            textField="text"
                                            dataItemKey="id"
                                            id="divisions"
                                            name="division"
                                            value={this.state.division}
                                            onChange={(e) => this.handleDivisionChange(e.target.value)}
                                        /> */}
                  </div>
                )}
                {this.props.entityType !="TimesheetReport" &&
                  this.props.entityType !="TSAllProvider" &&
                  this.props.page != "ExpiringCredentialReport" &&
                  this.props.page != "AssociateExpense"  &&
                  this.props.page != "ConfirmationAssignment" &&
                  this.props.page != "FinancialAccrualReport" && (
                    <div className="col-12 col-sm-6 mt-2  ">
                      <label className="mb-1 font-weight-bold">Vendor</label>
                      <input
                        type="text"
                        name="vendorName"
                        className="form-control"
                        placeholder="Enter Vendor Name"
                        maxLength={100}
                        onChange={(e) =>
                          this.updateState(e.target.value, "vendorName")
                        }
                        value={vendorName}
                      />
                    </div>
                  )}{" "}
                {this.props.entityType !="TimesheetReport" &&
                  this.props.entityType !="TSAllProvider" &&
                  this.props.page != "AssociateExpense"  &&
                  this.props.page != "ConfirmationAssignment" &&
                  (this.props.page=="ExpiringCredentialReport" ||
                  this.props.page =="FinancialAccrualReport") && (
                    <div className="col-12 col-sm-6 mt-2  ">
                      <label className="mb-1 font-weight-bold">Vendor</label>
                      <input
                        type="text"
                        name="vendor"
                        className="form-control"
                        placeholder="Enter Vendor Name"
                        maxLength={100}
                        onChange={(e) =>
                          this.updateState(e.target.value, "vendor")
                        }
                        value={vendor}
                      />
                    </div>
                  )}
                {this.props.entityType=="TimesheetReport" &&
                  this.props.page != "AssociateExpense" && (
                  // <div className="col-12 px-0">
                  //   <div className="row   ml-0 mr-0">
                  <React.Fragment>
                    <div className="col-12 pl-0 col-sm-6 mt-2">
                      <label className="mb-1 font-weight-bold">
                        Week Start Date
                      </label>
                      <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="startDate"
                        formatPlaceholder="formatPattern"
                        value={this.state.startDate}
                        title="Start Date"
                        onChange={(e) =>
                          this.updateState(e.target.value, "startDate")
                        }
                      />
                    </div>
                    <div className="col-12 pr-0 col-sm-6 mt-2">
                      <label className="mb-1 font-weight-bold">
                        Week End Date
                      </label>
                      <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="endDate"
                        formatPlaceholder="formatPattern"
                        value={this.state.endDate}
                        title="End Date"
                        onChange={(e) =>
                          this.updateState(e.target.value, "endDate")
                        }
                      />
                    </div>

                    <div className="col-12 col-sm-6 mt-2">
                      <label className="mb-1 font-weight-bold">Vendor</label>
                      <input
                        type="text"
                        name="vendorName"
                        className="form-control"
                        placeholder="Enter Vendor Name"
                        maxLength={100}
                        onChange={(e) =>
                          this.updateState(e.target.value, "vendorName")
                        }
                        value={vendorName}
                      />
                    </div>
                  </React.Fragment>
                  //</div>
                  //</div>
                )}
                {this.props.page !="TSSubmitted" &&
                  this.props.page !="TSUnderReview" &&
                  this.props.page !="TimesheetReport" &&
                  this.props.page != "ExpiringCredentialReport" &&
                  this.props.page != "AssociateExpense" &&
                  this.props.page != "ConfirmationAssignment" && (
                    <div className="col-12 date-search col-sm-6 mt-2 px-0">

                      <div className="row mx-0">
                        <div className="col-12 col-sm-6 mt-0 mt-sm-0">
                          <label className="mb-1 font-weight-bold">
                            Start Date
                          </label>
                          <DatePicker
                            className="form-control"
                            format="MM/dd/yyyy"
                            name="startDate"
                            formatPlaceholder="formatPattern"
                            value={this.state.startDate}
                            title="Start Date"
                            onChange={(e) =>
                              this.updateState(e.target.value, "startDate")
                            }
                          />
                        </div>
                        <div className="col-12 col-sm-6 mt-2 mt-sm-0">
                          <label className="mb-1 font-weight-bold">
                            End Date
                          </label>
                          <DatePicker
                            className="form-control"
                            format="MM/dd/yyyy"
                            name="endDate"
                            formatPlaceholder="formatPattern"
                            value={this.state.endDate}
                            title="End Date"
                            onChange={(e) =>
                              this.updateState(e.target.value, "endDate")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                {/* </React.Fragment>
               <React.Fragment> */}
                {/* <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Hiring Manager
                  </label>
                  <input
                    type="text"
                    name="hiringManager"
                    className="form-control"
                    placeholder="Hiring Manager"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "hiringManager")
                    }
                    value={hiringManager}
                  />
                </div> */}

              {this.props.page != "AssociateExpense" && 
              this.props.page != "ConfirmationAssignment" && 
              this.props.page != "FinancialAccrualReport" && (
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Hiring Manager</label>
                  <DropDownList
                    data={this.state.hiringManagerValue}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    id="hiringManagers"
                    name="hiringManager"
                    value={this.state.hiringManager}
                    filterable={
                      this.state.hiringManagerValue.length > 5 ? true : false
                    }
                    onFilterChange={(e) => this.onFilterChange(e, "hiringManager")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "hiringManager")
                    }
                  />
                </div>)}
                {/* {(this.props.page=="TimesheetReport" && !isRoleType(AuthRoleType.Vendor)) && (
                  <div className="col-12 col-sm-6 mt-2">
                    <label className="mb-1 font-weight-bold">Client</label>
                    <DropDownList
                      className={"form-control"}
                      id="client"
                      name="client"
                      data={this.state.clientsData}
                      textField="text"
                      dataItemKey="text"
                      onChange={(e) =>
                        this.updateState(e.target.value, "client")
                      }
                      filterable={true}
                      onFilterChange={(e) => this.onFilterChange(e, "clients")}
                      popupSettings={{
                        height: "140px",
                      }}
                    />
                  </div>
                )} */}
                {this.props.page=="ExpiringCredentialReport" ? (
                  <div className="col-12 col-sm-6 mt-2">
                    <label className="mb-1 font-weight-bold">
                      Days To Expiration
                    </label>
                    <input
                      type="text"
                      name="expirationDate"
                      className="form-control"
                      placeholder="Enter Days to Expiration"
                      maxLength={100}
                      onChange={(e) =>
                        this.updateState(e.target.value, "daysToExpiration")
                      }
                      value={this.state.daysToExpiration}
                    />
                  </div>
                ) : null}
              </React.Fragment>

            ) : null}
            {this.props.page =="TSAllProvider" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2  ">
                  <label className="mb-1 font-weight-bold">Vendor</label>
                  <input
                    type="text"
                    name="vendor"
                    className="form-control"
                    placeholder="Enter Vendor Name"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "vendor")}
                    value={vendor}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Days To Expiration
                  </label>
                  <input
                    type="number"
                    name="daysToExpiration"
                    className="form-control text-right"
                    placeholder="Enter Days to Expiration"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "daysToExpiration")
                    }
                    value={this.state.daysToExpiration}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Status
                  </label>
                  <DropDownList
                    className={"form-control"}
                    name="candSubStatus"
                    data={CandSubStatus}
                    onChange={(e) => this.updateState(e.target.value, "candSubStatus")}
                    value={this.state.candSubStatus}
                  />
                </div>
              </React.Fragment>
            ) : null}
            {this.props.page=="TimesheetReport" ||
              (this.props.page =="ClientActivityReport" && (
                <React.Fragment>
                  <div className="col-12 col-sm-6 mt-2">
                    <label className="mb-1 font-weight-bold">Report Status</label>
                    <DropDownList
                      className={"form-control"}
                      name="status"
                      data={Timesheet_Status}
                      onChange={(e) => this.updateState(e.target.value, "status")}
                      value={this.state.status}
                    />
                  </div>
                </React.Fragment>
              ))}
            {this.props.page=="TimesheetReport" && (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Status</label>
                  <MultiSelect
                    className="form-control "
                    data={this.state.timesheetStatusData}
                    textField="name"
                    dataItemKey="id"
                    id="status"
                    autoClose={false}
                    name="status"
                    itemRender={this.itemRender}
                    value={this.state.tsStatuses}
                    onChange={(e) =>
                      this.updateState(e.target.value, "tsStatuses")
                    }
                    placeholder="Select Status"
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "status")}
                  />
                  {/* <DropDownList
                    className={"form-control"}
                    name="status"
                    data={this.state.timesheetStatusData}
                    onChange={(e) => this.updateState(e.target.value, "status")}
                    filterable={true}
                    onFilterChange={(e) => {
                      let filteredData = filterBy(
                        Timesheet_Status.slice(),
                        e.filter
                      );
                      return this.setState({ timesheetStatusData: filteredData });
                    }}
                    value={this.state.status}
                  /> */}
                </div>
              </React.Fragment>
            )}
            {this.props.page =="MyRequisitions" ||
              this.props.page =="PendingRequisitions" ||
              this.props.page =="CandidateSubmission" ||
              this.props.page=="ReqPerformanceReport" ? (
              <DateSelector
                updateState={this.updateState}
                startDateFrom={this.state.startDateFrom}
                startDateTo={this.state.startDateTo}
                endDateFrom={this.state.endDateFrom}
                endDateTo={this.state.endDateTo}
              />
            ) : null}

            {this.props.page =="CandidateWF" ||
              this.props.page =="CandidateSubmittalReport" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    name="candidateName"
                    className="form-control"
                    placeholder="Enter Candidate Name"
                    maxLength={100}
                    onChange={(e) =>
                      regexFormat.test(e.target.value) &&
                      this.updateState(e.target.value, "candidateFullName")
                    }
                    value={candidateFullName}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    {" "}
                    Candidate Status
                  </label>
                  <DropDownList
                    className={"form-control"}
                    name="candidateStatus"
                    data={this.state.CandidateWFStatus}
                    onChange={(e) =>
                      this.updateState(e.target.value, "candidatestatus")
                    }
                    value={this.state.candidatestatus}
                    filterable={true}
                    onFilterChange={(e) => {
                      let filteredData = filterBy(
                        CandidateWF_Status.slice(),
                        e.filter
                      );
                      return this.setState({ CandidateWFStatus: filteredData });
                    }}
                  />
                </div>
                {this.props.page !="CandidateSubmittalReport" ? (

                  <React.Fragment>
                    <div className="col-12 col-sm-6 mt-2">
                      <label className="mb-1 font-weight-bold">Location</label>
                      <DropDownList
                        className={"form-control"}
                        id="location"
                        name="location"
                        data={this.state.locationsValue}
                        onChange={(e) => this.updateState(e.target.value, "location")}
                        value={location}
                        virtual={{
                          total: this.state.total,
                          pageSize: this.state.page,
                          skip: this.state.skip,
                        }}
                        onPageChange={(e) => this.pageChange(e, "location")}
                        filterable={true}
                        onFilterChange={(e) => this.onFilterChange(e, "location")}
                        popupSettings={{
                          height: "140px",
                        }}
                      />
                    </div>
                    <div className="col-12 col-sm-6 mt-2">
                      <label className="mb-1 font-weight-bold">State</label>
                      <input
                        type="text"
                        name="state"
                        className="form-control"
                        placeholder="Enter State"
                        maxLength={100}
                        onChange={(e) => this.updateState(e.target.value, "state")}
                        value={state}
                      />
                    </div>
                    <div className="col-12 col-sm-6 mt-2">
                      <label className="mb-1 font-weight-bold">City</label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        placeholder="Enter City"
                        maxLength={100}
                        onChange={(e) => this.updateState(e.target.value, "city")}
                        value={city}
                      />
                    </div>
                    <div className="col-12 col-sm-6 mt-2">
                      <label className="mb-1 font-weight-bold">Presented On</label>
                      <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="presentationDate"
                        formatPlaceholder="formatPattern"
                        value={this.state.presentationDate}
                        onChange={(e) =>
                          this.updateState(e.target.value, "presentationDate")
                        }
                      //min={this.props.endDateFrom ? new Date(this.props.endDateFrom) : new Date()}
                      />
                    </div>
                  </React.Fragment>

                ) : null}




                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Hiring Manager</label>
                  <DropDownList
                    data={this.state.hiringManagerValue}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    id="hiringManagers"
                    name="hiringManager"
                    value={this.state.hiringManager}
                    filterable={
                      this.state.hiringManagerValue.length > 5 ? true : false
                    }
                    onFilterChange={(e) => this.onFilterChange(e, "hiringManager")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "hiringManager")
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Submitted On</label>
                  <DatePicker
                    className="form-control"
                    format="MM/dd/yyyy"
                    name="submittedOn"
                    formatPlaceholder="formatPattern"
                    value={this.state.submittedOn}
                    onChange={(e) =>
                      this.updateState(e.target.value, "submittedOn")
                    }
                  //min={this.props.endDateFrom ? new Date(this.props.endDateFrom) : new Date()}
                  />
                </div>
              </React.Fragment>
            ) : null}

            {this.props.page =="ClientInvoicing" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Run Date From</label>
                  <DatePicker
                    className="form-control"
                    format="MM/dd/yyyy"
                    name="runDateFrom"
                    formatPlaceholder="formatPattern"
                    value={this.state.runDateFrom}
                    onChange={(e) =>
                      this.updateState(e.target.value, "runDateFrom")
                    }
                    max={
                      this.state.runDateTo
                        ? new Date(this.state.runDateTo)
                        : undefined
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Run Date To</label>
                  <DatePicker
                    className="form-control"
                    format="MM/dd/yyyy"
                    name="runDateTo"
                    formatPlaceholder="formatPattern"
                    value={this.state.runDateTo}
                    onChange={(e) =>
                      this.updateState(e.target.value, "runDateTo")
                    }
                    min={
                      this.state.runDateFrom
                        ? new Date(this.state.runDateFrom)
                        : undefined
                    }
                  />
                </div>
              </React.Fragment>
            ) : null}

            {/* Vendor Invoicing grid */}
            {this.props.page =="VendorInvoicing" ||
              this.props.page =="VIUnderReview" ||
              this.props.page =="ClientInvoicing" ||
              this.props.page=="ClientStatementReport" ? (
              <React.Fragment>
                {(this.props.page =="VendorInvoicing" || this.props.page =="VIUnderReview" ||
                  this.props.page=="ClientStatementReport") && (
                    <React.Fragment>
                      <div className="col-12 col-sm-6 mt-2">
                        <label className="mb-1 font-weight-bold">
                          Billing Start Date
                        </label>
                        <DatePicker
                          className="form-control"
                          format="MM/dd/yyyy"
                          name="billingPeriodStart"
                          formatPlaceholder="formatPattern"
                          value={this.state.billingPeriodStart}
                          onChange={(e) =>
                            this.updateState(e.target.value, "billingPeriodStart")
                          }
                          max={
                            this.state.billingPeriodEnd
                              ? new Date(this.state.billingPeriodEnd)
                              : undefined
                          }
                        />
                      </div>
                      <div className="col-12 col-sm-6 mt-2">
                        <label className="mb-1 font-weight-bold">
                          Billing End Date
                        </label>
                        <DatePicker
                          className="form-control"
                          format="MM/dd/yyyy"
                          name="billingPeriodEnd"
                          formatPlaceholder="formatPattern"
                          value={this.state.billingPeriodEnd}
                          onChange={(e) =>
                            this.updateState(e.target.value, "billingPeriodEnd")
                          }
                          min={
                            this.state.billingPeriodStart
                              ? new Date(this.state.billingPeriodStart)
                              : undefined
                          }
                        />
                      </div>
                      {!isRoleType(AuthRoleType.Vendor) && <div className="col-12 col-sm-6 mt-2">
                        <label className="mb-1 font-weight-bold">Vendor</label>
                        <input
                          type="text"
                          name="vendorName"
                          className="form-control"
                          placeholder="Enter Vendor Name"
                          maxLength={100}
                          onChange={(e) =>
                            this.updateState(e.target.value, "vendorName")
                          }
                          value={vendorName}
                        />
                      </div>}
                    </React.Fragment>
                  )}
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">
                    {this.props.page =="VendorInvoicing" ||
                      this.props.page =="VIUnderReview" ||
                      this.props.page =="ClientInvoicing"
                      ? "Invoice Status"
                      : this.props.page=="ClientStatementReport"
                        ? "Report Status"
                        : "Status"}
                  </label>
                  <MultiSelect
                    className={"form-control"}
                    itemRender={this.itemRender}
                    textField="name"
                    autoClose={false}
                    name="vendorclientInvoiceStatus"
                    data={this.state.vendorclientInvoiceData}
                    onChange={(e) =>
                      this.updateState(
                        e.target.value,
                        "vendorInvoiceStatus"
                      )
                    }
                    value={this.state.vendorInvoiceStatus}
                    filterable={false}
                    onFilterChange={(e) => {
                      let filteredData = filterBy(
                        (this.state.vendorclientInvoiceData).slice(),
                        e.filter
                      );
                      return this.setState({
                        vendorclientInvoiceData: filteredData,
                      });
                    }}
                  />
                </div>
              </React.Fragment>
            ) : null}
            {/* Vendor Invoicing Details Grid */}
            {this.props.page =="VendorInvoicingDetails" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Associate</label>
                  <input
                    type="text"
                    name="associate"
                    className="form-control"
                    placeholder="Enter Associate Name"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "associate")
                    }
                    value={associate}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Zone</label>
                  <MultiSelect
                    data={this.state.zoneValue}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    id="zones"
                    name="zone"
                    value={this.state.vendorInvoiceZones}
                    itemRender={this.itemRender} 
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "vendorInvoiceZones")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "vendorInvoiceZones")
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Region</label>
                  <MultiSelect
                    data={this.state.regionValue}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    id="regions"
                    name="region"
                    value={this.state.vendorInvoiceRegions}
                    filterable={false}
                    itemRender={this.itemRender}
                    onFilterChange={(e) => this.onFilterChange(e, "vendorInvoiceRegions")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "vendorInvoiceRegions")
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                <label className="mb-1 font-weight-bold">Division</label>
                  <MultiSelect
                    className="form-control "
                    data={this.state.divisionsValue}
                    textField="text"
                    dataItemKey="id"
                    id="divisions"
                    autoClose={false}
                    name="division"
                    itemRender={this.itemRender}
                    value={this.state.divisions}
                    onChange={(e) =>
                      this.updateState(e.target.value, "divisions")
                    }
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "division")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                <label className="mb-1 font-weight-bold">Location</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.locationsListValue}
                    textField="text"
                    dataItemKey="id"
                    id="locations"
                    autoClose={false}
                    name="location"
                    itemRender={this.itemRender}
                    value={this.state.locations}
                    onChange={(e) =>
                      this.updateState(e.target.value, "locations")
                    }
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "location")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Position</label>
                  {/* <input
                                    type="text"
                                    name="position"
                                    className="form-control"
                                    placeholder="Enter Position"
                                    maxLength={100}
                                    onChange={(e) => this.updateState(e.target.value, "position")}
                                    value={position}
                                /> */}
                  <MultiSelect
                    className={"form-control"}
                    id="position"
                    name="position"
                    data={this.state.positionValue}
                    textField="text"
                    dataItemKey="text"
                    itemRender={this.itemRender}
                    onChange={(e) => this.updateState(e.target.value,"vendorInvoicePosition")}
                    value={this.state.vendorInvoicePosition}
                    filterable={false}
                    onFilterChange={(e) => this.onPosFilterChange(e, "vendorInvoicePosition")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Type</label>
                  <MultiSelect
                    className={"form-control"}
                    name="serviceType"
                    textField="text"
                    dataItemKey="id"
                    id="serviceType"
                    itemRender={this.itemRender}
                    data={this.state.vendorInvoiceServiceTypeData}
                    onChange={(e) =>
                      this.updateState(e.target.value, "vendorInvoiceType")
                    }
                    value={this.state.vendorInvoiceType}
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "serviceType")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Expense Status</label>
                  <DropDownList
                    className={"form-control"}
                    name="status"
                    data={Expense_Status}
                    onChange={(e) => this.updateState(e.target.value, "expenseStatus")}
                    value={this.state.expenseStatus}
                  />
                </div>
              </React.Fragment>
            ) : null}
            {this.props.page =="ManageCandidate" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Candidate Name</label>
                  <input
                    type="text"
                    name="candidateName"
                    className="form-control"
                    placeholder="Enter Candidate Name"
                    maxLength={100}
                    onChange={(e) =>
                      regexFormat.test(e.target.value) &&
                      this.updateState(e.target.value, "candidateName")
                    }
                    value={candidateName}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Job Category</label>
                  <input
                    type="text"
                    name="jobCategory"
                    className="form-control"
                    placeholder="Enter Job Category"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "jobCategory")
                    }
                    value={jobCategory}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Position</label>
                  {/* <input
                                    type="text"
                                    name="position"
                                    className="form-control"
                                    placeholder="Enter Position"
                                    maxLength={100}
                                    onChange={(e) => this.updateState(e.target.value, "position")}
                                    value={position}
                                /> */}
                  <DropDownList
                    className={"form-control"}
                    id="position"
                    name="position"
                    data={this.state.positionValue}
                    textField="text"
                    dataItemKey="text"
                    onChange={(e) => this.handlePositionChange(e.target.value)}
                    value={this.state.positionSelected}
                    filterable={true}
                    onFilterChange={(e) => this.onPosFilterChange(e, "position")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>
              </React.Fragment>
            ) : null}

            {/* Manage Client Grid */}
            {this.props.page =="ManageClient" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Client</label>
                  <DropDownList
                    className={"form-control"}
                    id="client"
                    name="client"
                    data={this.state.clientsData}
                    textField="text"
                    dataItemKey="text"
                    onChange={(e) => this.updateState(e.target.value, "client")}
                    value={this.state.client}
                    filterable={true}
                    // virtual={{
                    //   total: this.state.total,
                    //   pageSize: this.state.page,
                    //   skip: this.state.skip,
                    // }}
                    // onPageChange={(e) => this.pageChange(e, "clients")}
                    onFilterChange={(e) => this.onFilterChange(e, "clients")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Email</label>
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    placeholder="Enter Email"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "email")}
                    value={email}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Address</label>
                  <input
                    type="text"
                    name="address1"
                    className="form-control"
                    placeholder="Enter Address"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "address1")}
                    value={address1}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    placeholder="Enter City"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "city")}
                    value={city}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">State</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    placeholder="Enter State"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "state")}
                    value={state}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold"> Client Status</label>
                  <DropDownList
                    className={"form-control"}
                    name="clientStatus"
                    data={this.state.clientStatusData}
                    onChange={(e) => this.updateState(e.target.value, "status")}
                    value={status}
                    filterable={Client_Status.length > 5 ? true : false}
                    onFilterChange={(e) => {
                      let filteredData = filterBy(
                        Client_Status.slice(),
                        e.filter
                      );
                      return this.setState({ clientStatusData: filteredData });
                    }}
                  />
                </div>
              </React.Fragment>
            ) : null}

            {/* Manage Region Grid */}
            {this.props.page =="ManageRegion" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Zone</label>
                  <DropDownList
                    data={this.state.zoneValue}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    id="zones"
                    name="zone"
                    value={this.state.zone}
                    filterable={
                      this.state.zoneValue.length > 5 ? true : false
                    }
                    onFilterChange={(e) => this.onFilterChange(e, "zone")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "zone")
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Region</label>
                  <DropDownList
                    data={this.state.regionValue}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    id="regions"
                    name="region"
                    value={this.state.region}
                    filterable={
                      this.state.regionValue.length > 5 ? true : false
                    }
                    onFilterChange={(e) => this.onFilterChange(e, "region")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "region")
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    {" "}
                    Region Status
                  </label>
                  <DropDownList
                    className={"form-control"}
                    name="clientStatus"
                    data={this.state.clientStatusData}
                    onChange={(e) => this.updateState(e.target.value, "status")}
                    value={status}
                    filterable={Client_Status.length > 5 ? true : false}
                    onFilterChange={(e) => {
                      let filteredData = filterBy(
                        Client_Status.slice(),
                        e.filter
                      );
                      return this.setState({ clientStatusData: filteredData });
                    }}
                  />
                </div>
              </React.Fragment>
            ) : null}

            {/* Manage Division Grid */}
            {this.props.page =="ManageDivision" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Zone</label>
                  <DropDownList
                    data={this.state.zoneValue}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    id="zones"
                    name="zone"
                    value={this.state.zone}
                    filterable={
                      this.state.zoneValue.length > 5 ? true : false
                    }
                    onFilterChange={(e) => this.onFilterChange(e, "zone")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "zone")
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Region</label>
                  <DropDownList
                    data={this.state.regionValue}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    id="regions"
                    name="region"
                    value={this.state.region}
                    filterable={
                      this.state.regionValue.length > 5 ? true : false
                    }
                    onFilterChange={(e) => this.onFilterChange(e, "region")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "region")
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Division</label>
                  <DropDownList
                    data={this.state.divisionsValue}
                    className="form-control"
                    textField="text"
                    dataItemKey="id"
                    id="divisions"
                    name="division"
                    value={this.state.division}
                    onChange={(e) => this.handleDivisionChange(e.target.value)}
                    filterable={true}
                    onFilterChange={(e) => this.onFilterChange(e, "division")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    {" "}
                    Division Status
                  </label>
                  <DropDownList
                    className={"form-control"}
                    name="clientStatus"
                    data={this.state.clientStatusData}
                    onChange={(e) => this.updateState(e.target.value, "status")}
                    value={status}
                    filterable={Client_Status.length > 5 ? true : false}
                    onFilterChange={(e) => {
                      let filteredData = filterBy(
                        Client_Status.slice(),
                        e.filter
                      );
                      return this.setState({ clientStatusData: filteredData });
                    }}
                  />
                </div>
              </React.Fragment>
            ) : null}

            {/* Manage Vendor Grid */}
            {this.props.page =="ManageVendor" ? (
              <React.Fragment>
                {<div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Vendor Name</label>
                  <input
                    type="text"
                    name="vendor"
                    className="form-control"
                    placeholder="Enter Vendor Name"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "vendor")}
                    value={vendor}
                  />
                </div>}
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Email</label>
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    placeholder="Enter Email"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "email")}
                    value={email}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Address</label>
                  <input
                    type="text"
                    name="address1"
                    className="form-control"
                    placeholder="Enter Address"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "address1")}
                    value={address1}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    placeholder="Enter City"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "city")}
                    value={city}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">State</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    placeholder="Enter State"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "state")}
                    value={state}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold"> Vendor Status</label>
                  <DropDownList
                    className={"form-control"}
                    name="clientStatus"
                    data={this.state.clientStatusData}
                    onChange={(e) => this.updateState(e.target.value, "status")}
                    value={status}
                    filterable={Client_Status.length > 5 ? true : false}
                    onFilterChange={(e) => {
                      let filteredData = filterBy(
                        Client_Status.slice(),
                        e.filter
                      );
                      return this.setState({ clientStatusData: filteredData });
                    }}
                  />
                </div>
              </React.Fragment>
            ) : null}

            {/* Manage Notification Grid */}
            {this.props.page =="ManageNotifications" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Notification</label>
                  <DropDownList
                    data={this.state.notificationTypeValue}
                    className="form-control"
                    textField="name"
                    value={this.state.notificationType}
                    filterable={
                      this.state.notificationTypeValue.length > 5 ? true : false
                    }
                    onFilterChange={(e) => this.onFilterChange(e, "notificationType")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "notificationType")
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Category</label>
                  <input
                    type="text"
                    name="notificationCategory"
                    className="form-control"
                    placeholder="Enter Category"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "notificationCategory")}
                    value={notificationCategory}
                  />
                </div>
              </React.Fragment>
            ) : null}

            {/* Manage Vendor Tiers  Grid */}
            {this.props.page =="ManageVendorTiers" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Client</label>
                  <DropDownList
                    className={"form-control"}
                    id="client"
                    name="client"
                    data={this.state.clientsData}
                    textField="text"
                    dataItemKey="text"
                    onChange={(e) => this.updateState(e.target.value, "client")}
                    value={this.state.client}
                    filterable={true}
                    // virtual={{
                    //   total: this.state.total,
                    //   pageSize: this.state.page,
                    //   skip: this.state.skip,
                    // }}
                    // onPageChange={(e) => this.pageChange(e, "clients")}
                    onFilterChange={(e) => this.onFilterChange(e, "clients")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Division</label>
                  <DropDownList
                    data={this.state.divisionsValue}
                    className="form-control"
                    textField="text"
                    dataItemKey="id"
                    id="divisions"
                    name="division"
                    value={this.state.division}
                    onChange={(e) => this.handleDivisionChange(e.target.value)}
                    filterable={true}
                    onFilterChange={(e) => this.onFilterChange(e, "division")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Location</label>
                  <DropDownList
                    className={"form-control"}
                    id="location"
                    name="location"
                    data={this.state.locationsValue}
                    onChange={(e) => this.updateState(e.target.value, "location")}
                    value={location}
                    virtual={{
                      total: this.state.total,
                      pageSize: this.state.page,
                      skip: this.state.skip,
                    }}
                    onPageChange={(e) => this.pageChange(e, "location")}
                    filterable={true}
                    onFilterChange={(e) => this.onFilterChange(e, "location")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>

                {<div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Vendor</label>
                  <input
                    type="text"
                    name="vendor"
                    className="form-control"
                    placeholder="Enter Vendor"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "vendor")}
                    value={vendor}
                  />
                </div>}
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Tier</label>
                  <input
                    type="text"
                    name="tier"
                    className="form-control"
                    placeholder="Enter Tier"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "tier")}
                    value={tier}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    className="form-control"
                    placeholder="Enter Tags"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "tags")
                    }
                    value={tags}
                  />
                </div>
              </React.Fragment>
            ) : null}

            {/* Manage Location Grid */}
            {this.props.page =="ManageLocation" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Division</label>
                  <DropDownList
                    data={this.state.divisionsValue}
                    className="form-control"
                    textField="text"
                    dataItemKey="id"
                    id="divisions"
                    name="division"
                    value={this.state.division}
                    onChange={(e) => this.handleDivisionChange(e.target.value)}
                    filterable={true}
                    onFilterChange={(e) => this.onFilterChange(e, "division")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Location</label>
                  <DropDownList
                    className={"form-control"}
                    id="location"
                    name="location"
                    data={this.state.locationsValue}
                    onChange={(e) => this.updateState(e.target.value, "location")}
                    value={location}
                    virtual={{
                      total: this.state.total,
                      pageSize: this.state.page,
                      skip: this.state.skip,
                    }}
                    onPageChange={(e) => this.pageChange(e, "location")}
                    filterable={true}
                    onFilterChange={(e) => this.onFilterChange(e, "location")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Location Status</label>
                  <DropDownList
                    className={"form-control"}
                    name="clientStatus"
                    data={this.state.clientStatusData}
                    onChange={(e) => this.updateState(e.target.value, "status")}
                    value={status}
                    filterable={Client_Status.length > 5 ? true : false}
                    onFilterChange={(e) => {
                      let filteredData = filterBy(
                        Client_Status.slice(),
                        e.filter
                      );
                      return this.setState({ clientStatusData: filteredData });
                    }}
                  />
                </div>
              </React.Fragment>
            ) : null}

            {/* Manage Global Job Catalog Grid */}
            {this.props.page =="ManageGlobalJobCatalog" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Job Category</label>
                  <input
                    type="text"
                    name="jobCategory"
                    className="form-control"
                    placeholder="Enter Job Category Name"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "jobCategory")
                    }
                    value={jobCategory}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Position</label>

                  <DropDownList
                    className={"form-control"}
                    id="position"
                    name="position"
                    data={this.state.positionValue}
                    textField="text"
                    dataItemKey="text"
                    onChange={(e) => this.handlePositionChange(e.target.value)}
                    value={this.state.positionSelected}
                    filterable={true}
                    onFilterChange={(e) => this.onPosFilterChange(e, "position")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>
              </React.Fragment>
            ) : null}

            {/* Manage Client Rate Card Grid */}
            {this.props.page =="ManageClientRateCard" ? (
              <React.Fragment>
                {/* <div className="col-12 col-sm-6 mt-2">
                                <label className="mb-1 font-weight-bold">Client</label>
                                <input
                                    type="text"
                                    name="client"
                                    className="form-control"
                                    placeholder="Enter Client"
                                    maxLength={100}
                                    onChange={(e) => this.updateState(e.target.value, "client")}
                                    value={client}
                                />
                            </div> */}
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Division</label>
                  <DropDownList
                    data={this.state.divisionsValue}
                    className="form-control"
                    textField="text"
                    dataItemKey="id"
                    id="divisions"
                    name="division"
                    value={this.state.division}
                    onChange={(e) => this.handleDivisionChange(e.target.value)}
                    filterable={true}
                    onFilterChange={(e) => this.onFilterChange(e, "division")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Location</label>
                  <DropDownList
                    className={"form-control"}
                    id="location"
                    name="location"
                    data={this.state.locationsValue}
                    onChange={(e) => this.updateState(e.target.value, "location")}
                    value={location}
                    virtual={{
                      total: this.state.total,
                      pageSize: this.state.page,
                      skip: this.state.skip,
                    }}
                    onPageChange={(e) => this.pageChange(e, "location")}
                    filterable={true}
                    onFilterChange={(e) => this.onFilterChange(e, "location")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Position</label>
                  <DropDownList
                    className={"form-control"}
                    id="position"
                    name="position"
                    data={this.state.positionValue}
                    textField="text"
                    dataItemKey="text"
                    onChange={(e) => this.handlePositionChange(e.target.value)}
                    value={this.state.positionSelected}
                    filterable={true}
                    onFilterChange={(e) => this.onPosFilterChange(e, "position")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Service Type</label>
                  <input
                    type="text"
                    name="serviceType"
                    className="form-control"
                    placeholder="Enter Service Type Name"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "serviceType")
                    }
                    value={serviceType}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Valid From</label>
                  <DatePicker
                    className="form-control"
                    format="MM/dd/yyyy"
                    name="validFrom"
                    formatPlaceholder="formatPattern"
                    value={this.state.validFrom}
                    title="Valid From"
                    onChange={(e) =>
                      this.updateState(e.target.value, "validFrom")
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Valid To</label>
                  <DatePicker
                    className="form-control"
                    format="MM/dd/yyyy"
                    name="validTo"
                    formatPlaceholder="formatPattern"
                    value={this.state.validTo}
                    title="Valid To"
                    onChange={(e) => this.updateState(e.target.value, "validTo")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    className="form-control"
                    placeholder="Enter Tags"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "tags")
                    }
                    value={tags}
                  />
                </div>
              </React.Fragment>
            ) : null}

            {/* Manage Interview Criteria Configuration & Manage Onboarding Configuration & Manage Release Configuration & Manage Requisition Approver Configuration & Manage Timesheet Approver Configuration*/}
            {this.props.page =="ManageInterviewCriteriaConfiguration" ||
              this.props.page=="ManageOnBoardingConfiguration" ||
              this.props.page =="ManageReleaseConfiguration" ||
              this.props.page=="ManageRequisitionApproverConfiguration" ||
              this.props.page=="ManageTimesheetApproverConfiguration" ? (
              <React.Fragment>
                {/* <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Client</label>
                  <DropDownList
                    className={"form-control"}
                    id="client"
                    name="client"
                    data={this.state.clientsData}
                    textField="text"
                    dataItemKey="text"
                    onChange={(e) => this.updateState(e.target.value, "client")}
                    value={this.state.client}
                    filterable={true}
                    // virtual={{
                    //   total: this.state.total,
                    //   pageSize: this.state.page,
                    //   skip: this.state.skip,
                    // }}
                    // onPageChange={(e) => this.pageChange(e, "clients")}
                    onFilterChange={(e) => this.onFilterChange(e, "clients")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div> */}
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Division</label>
                  <DropDownList
                    data={this.state.divisionsValue}
                    className="form-control"
                    textField="text"
                    dataItemKey="id"
                    id="divisions"
                    name="division"
                    value={this.state.division}
                    onChange={(e) => this.handleDivisionChange(e.target.value)}
                    filterable={true}
                    onFilterChange={(e) => this.onFilterChange(e, "division")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Location</label>
                  <DropDownList
                    className={"form-control"}
                    id="location"
                    name="location"
                    data={this.state.locationsValue}
                    onChange={(e) => this.updateState(e.target.value, "location")}
                    value={location}
                    virtual={{
                      total: this.state.total,
                      pageSize: this.state.page,
                      skip: this.state.skip,
                    }}
                    onPageChange={(e) => this.pageChange(e, "location")}
                    filterable={true}
                    onFilterChange={(e) => this.onFilterChange(e, "location")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Position</label>
                  <DropDownList
                    className={"form-control"}
                    id="position"
                    name="position"
                    data={this.state.positionValue}
                    textField="text"
                    dataItemKey="text"
                    onChange={(e) => this.handlePositionChange(e.target.value)}
                    value={this.state.positionSelected}
                    filterable={true}
                    onFilterChange={(e) => this.onPosFilterChange(e, "position")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    className="form-control"
                    placeholder="Enter Tags"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "tags")
                    }
                    value={tags}
                  />
                </div>
              </React.Fragment>
            ) : null}

            {/* Manage Client Job Catalog Grid */}
            {this.props.page =="ManageClientJobCatalog" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Global Job Category
                  </label>
                  <input
                    type="text"
                    name="jobCategory"
                    className="form-control"
                    placeholder="Enter Job Category Name"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "jobCategory")
                    }
                    value={jobCategory}
                  />
                </div>

                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Global Positions
                  </label>
                  <DropDownList
                    className={"form-control"}
                    id="position"
                    name="position"
                    data={this.state.positionValue}
                    textField="text"
                    dataItemKey="text"
                    onChange={(e) => this.handlePositionChange(e.target.value)}
                    value={this.state.positionSelected}
                    filterable={true}
                    onFilterChange={(e) => this.onPosFilterChange(e, "position")}
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>

                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Client Position</label>
                  <input
                    type="text"
                    name="clientPosition"
                    className="form-control"
                    placeholder="Enter Client Position Name"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "clientPosition")
                    }
                    value={clientPosition}
                  />
                </div>
              </React.Fragment>
            ) : null}
            {/* Client Report Grid */}
            {this.props.page=="ClientActivityReport" && (
              // <div className="col-12 date-search col-sm-12 mt-2 px-0">
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Position</label>
                  {/* <input
                                        type="text"
                                        name="position"
                                        className="form-control"
                                        placeholder="Enter Position"
                                        maxLength={100}
                                        onChange={(e) => this.updateState(e.target.value, "position")}
                                        value={position}
                                    /> */}
                  <DropDownList
                    className={"form-control"}
                    id="position"
                    name="position"
                    data={this.state.positionValue}
                    textField="text"
                    dataItemKey="text"
                    onChange={(e) => this.handlePositionChange(e.target.value)}
                    value={this.state.positionSelected}
                    filterable={true}
                    onFilterChange={(e) =>
                      this.onPosFilterChange(e, "position")
                    }
                    popupSettings={{
                      height: "140px",
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Pay Period Start Date
                  </label>
                  <DatePicker
                    className="form-control"
                    format="MM/dd/yyyy"
                    name="startDate"
                    formatPlaceholder="formatPattern"
                    value={this.state.startDate}
                    title="Start Date"
                    onChange={(e) =>
                      this.updateState(e.target.value, "startDate")
                    }
                    max={
                      this.state.endDate
                        ? new Date(this.state.endDate)
                        : undefined
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Pay Period End Date
                  </label>
                  <DatePicker
                    className="form-control"
                    format="MM/dd/yyyy"
                    name="endDate"
                    formatPlaceholder="formatPattern"
                    value={this.state.endDate}
                    title="End Date"
                    onChange={(e) =>
                      this.updateState(e.target.value, "endDate")
                    }
                    min={
                      this.state.startDate
                        ? new Date(this.state.startDate)
                        : undefined
                    }
                  />
                </div>
              </React.Fragment>
              // </div>
            )}
            {/* Manage User Grid */}
            {this.props.page =="ManageUser" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">User Name</label>
                  <input
                    type="text"
                    name="userName"
                    className="form-control"
                    placeholder="Enter User Name"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "userName")}
                    value={userName}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Role</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.role}
                    textField="text"
                    dataItemKey="id"
                    id="userRole"
                    autoClose={false}
                    itemRender={this.itemRender}
                    value={this.state.userRoles}
                    onChange={(e) =>
                      this.updateState(e.target.value, "userRoles")
                    }
                    placeholder="Select Role"
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "role")}
                  />
                  {
                    /* <input
                                      type="text"
                                      name="userRole"
                                      className="form-control"
                                      placeholder="Enter Role"
                                      maxLength={100}
                                      onChange={(e) => this.updateState(e.target.value, "userRole")}
                                      value={userRole}
                                  /> */
                    // <DropDownList
                    //   className={"form-control"}
                    //   id="userRole"
                    //   name="userRole"
                    //   data={this.state.role}
                    //   textField="text"
                    //   dataItemKey="text"
                    //   onChange={(e) =>
                    //     this.updateState(e.target.value, "userRole")
                    //   }
                    //   value={this.state.userRole}
                    // filterable={true}
                    // onFilterChange={(e) => this.onPosFilterChange(e, "position")}
                    // popupSettings={{
                    //     height: "140px",
                    // }}
                    // />
                  }
                </div>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Client</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.clientsData}
                    textField="text"
                    dataItemKey="id"
                    id="clients"
                    autoClose={false}
                    itemRender={this.itemRender}
                    value={this.state.allClients}
                    onChange={(e) =>
                      this.updateState(e.target.value, "allClients")
                    }
                    placeholder="Select Clients..."
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "client")}
                  />
                  {/* {
                    <DropDownList
                      className={"form-control"}
                      id="client"
                      name="client"
                      data={this.state.clientsData}
                      textField="text"
                      dataItemKey="text"
                      onChange={(e) => this.updateState(e.target.value, "client")}
                      value={this.state.client}
                      filterable={true}
                      // virtual={{
                      //   total: this.state.total,
                      //   pageSize: this.state.page,
                      //   skip: this.state.skip,
                      // }}
                      // onPageChange={(e) => this.pageChange(e, "clients")}
                      onFilterChange={(e) => this.onFilterChange(e, "clients")}
                      popupSettings={{
                        height: "140px",
                      }}
                    />
                  } */}
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">User Status</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.UserStatusData}
                    textField="text"
                    dataItemKey="id"
                    id="status"
                    autoClose={false}
                    itemRender={this.itemRender}
                    value={this.state.statuses}
                    onChange={(e) =>
                      this.updateState(e.target.value, "statuses")
                    }
                    placeholder="Select User Status"
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "status")}
                  />
                  {/* <DropDownList
                    className={"form-control"}
                    name="userStatus"
                    data={this.state.clientStatusData}
                    onChange={(e) => this.updateState(e.target.value, "status")}
                    value={status}
                    filterable={Client_Status.length > 5 ? true : false}
                    onFilterChange={(e) => {
                      let filteredData = filterBy(
                        Client_Status.slice(),
                        e.filter
                      );
                      return this.setState({ clientStatusData: filteredData });
                    }}
                  /> */}
                </div>
              </React.Fragment>
            ) : null}

            {/* Manage service Type */}
            {this.props.page =="ManageServiceType" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2  ">
                  <label className="mb-1 font-weight-bold">Service Category</label>
                  <DropDownList
                    data={this.state.serviceCategoryValue}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    name="serviceCategory"
                    value={this.state.serviceCategory}
                    filterable={
                      this.state.serviceCategoryValue.length > 5 ? true : false
                    }
                    onFilterChange={(e) => this.onFilterChange(e, "serviceCategory")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "serviceCategory")
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2  ">
                  <label className="mb-1 font-weight-bold">Service Type</label>
                  <input
                    type="text"
                    name="ServiceType"
                    className="form-control"
                    placeholder="Enter Service Type Name"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "serviceType")
                    }
                    value={serviceType}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    {" "}
                    Status
                  </label>
                  <DropDownList
                    className={"form-control"}
                    name="clientStatus"
                    data={this.state.clientStatusData}
                    onChange={(e) => this.updateState(e.target.value, "status")}
                    value={status}
                    filterable={Client_Status.length > 5 ? true : false}
                    onFilterChange={(e) => {
                      let filteredData = filterBy(
                        Client_Status.slice(),
                        e.filter
                      );
                      return this.setState({ clientStatusData: filteredData });
                    }}
                  />
                </div>

              </React.Fragment>
            ) : null}
             {/* Manage Action Reason */}
             {this.props.page =="ManageActionReason" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2  ">
                  <label className="mb-1 font-weight-bold">Reason</label>
                  <input
                    type="text"
                    name="reasonName"
                    className="form-control"
                    placeholder="Enter Reason Name"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "reason")
                    }
                    value={this.state.reason}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                <label className="mb-1 font-weight-bold">Actions</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.actionsData}
                    textField="entityName"
                    dataItemKey="actionId"
                    autoClose={false}
                    itemRender={this.itemRender}
                    value={this.state.selectedActions}
                    onChange={(e) =>
                      this.updateState(e.target.value, "selectedActions")
                    }
                    placeholder="Select Actions..."
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "entityName")}
                  />                      
                </div>
              </React.Fragment>
            ) : null}

            {/* Role page */}

            {this.props.page =="ManageRole" ? (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Role</label>
                  <DropDownList
                    data={this.state.roleNameValue}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    id="roleNames"
                    name="roleName"
                    value={this.state.roleName}
                    filterable={
                      this.state.roleNameValue.length > 5 ? true : false
                    }
                    onFilterChange={(e) => this.onFilterChange(e, "roleName")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "roleName")
                    }
                  />
                </div>
                
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">User Type</label>
                  <DropDownList
                    data={this.state.userTypeData}
                    className="form-control"
                    textField="roleTypeName"
                    dataItemKey="id"
                    id="roleType"
                    name="roleType"
                    value={this.state.roleType}
                    onFilterChange={(e) => this.onFilterChange(e, "roleType")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "roleType")
                    }
                  />
                </div>
                
              </React.Fragment>
            ) : null}

            {/* Events Logs */}
            {this.props.page =="EventsLogs" ? (
              <React.Fragment>
                 <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                   Event Type
                  </label>
                  <input
                    type="text"
                    name="Event Type"
                    className="form-control"
                    placeholder="Enter Event Type"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "eventLogType")
                    }
                    value={eventLogType}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Entity Type
                  </label>
                  <input
                    type="text"
                    name="Entity Type"
                    className="form-control"
                    placeholder="Enter Entity Type"
                    maxLength={200}
                    onChange={(e) =>
                      this.updateState(e.target.value, "entityLogType")
                    }
                    value={entityLogType}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2  mt-sm-0">
                  <label className="mb-1 font-weight-bold">Event Date</label>
                  <DatePicker
                    className="form-control"
                    format="MM/dd/yyyy"
                    name="eventLogDate"
                    formatPlaceholder="formatPattern"
                    value={this.state.eventLogDate}
                    title="Time Stamp"
                    onChange={(e) =>
                      this.updateState(e.target.value, "eventLogDate")
                    }
                  />
                </div>
              </React.Fragment>
            ) : null}

            {this.props.page=="VendorPerformance" && (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Requisition Number
                  </label>
                  <input
                    type="text"
                    name="requisitionNumber"
                    className="form-control"
                    placeholder="Enter Requisition Number"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "reqNumber")
                    }
                    value={reqNumber}
                  />
                </div>
                {<div className="col-12 col-sm-6 mt-2 ">
                  <label className="mb-1 font-weight-bold">Vendor</label>
                  <input
                    type="text"
                    name="vendorName"
                    className="form-control"
                    placeholder="Enter Vendor Name"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "vendor")}
                    value={vendor}
                  />
                </div>}

                <div className="col-12 date-search col-sm-6 mt-2 px-0">
                  <div className="row mx-0">
                    <div className="col-12 col-sm-6 mt-0 mt-sm-0 ">
                      <label className="mb-1 font-weight-bold">Start Date</label>
                      <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="startDate"
                        formatPlaceholder="formatPattern"
                        value={this.state.startDate}
                        title="Start Date"
                        onChange={(e) =>
                          this.updateState(e.target.value, "startDate")
                        }
                      />
                    </div>
                    <div className="col-12 col-sm-6 mt-2  mt-sm-0">
                      <label className="mb-1 font-weight-bold">End Date</label>
                      <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="endDate"
                        formatPlaceholder="formatPattern"
                        value={this.state.endDate}
                        title="End Date"
                        onChange={(e) =>
                          this.updateState(e.target.value, "endDate")
                        }
                      />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}

            {/* Manage Candidate Share Requests */}
            {this.props.page=="CandidateShareWF" && (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    name="candidateName"
                    className="form-control"
                    placeholder="Enter Candidate Name"
                    maxLength={100}
                    onChange={(e) =>
                      regexFormat.test(e.target.value) &&
                      this.updateState(e.target.value, "candidateFullName")
                    }
                    value={candidateFullName}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Vendor Name</label>
                  <input
                    type="text"
                    name="vendorName"
                    className="form-control"
                    placeholder="Enter Vendor Name"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "vendorName")
                    }
                    value={vendorName}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Status</label>
                  <MultiSelect
                    className={"form-control"}
                    itemRender={this.itemRender}
                    textField="name"
                    placeholder="Select status"
                    autoClose={false}
                    name="vendorclientInvoiceStatus"
                    data={this.state.vendorclientInvoiceData}
                    onChange={(e) =>
                      this.updateState(
                        e.target.value,
                        "vendorInvoiceStatus"
                      )
                    }
                    value={this.state.vendorInvoiceStatus}
                    filterable={false}
                    onFilterChange={(e) => {
                      let filteredData = filterBy(
                        (this.state.vendorclientInvoiceData).slice(),
                        e.filter
                      );
                      return this.setState({
                        vendorclientInvoiceData: filteredData,
                      });
                    }}
                  />
                </div> </React.Fragment>
            )}
            {/* Manage Content Library */}
            {(this.props.page=="ManageContentLibrary" || this.props.page=="ViewContentLibrary") && (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Title</label>
                  <input
                    type="text"
                    name="contentLibTitle"
                    className="form-control"
                    placeholder="Enter Title"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "contentLibTitle")
                    }
                    value={contentLibTitle}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2  ">
                  <label className="mb-1 font-weight-bold">Content Type</label>
                  <DropDownList
                    data={this.state.contentTypeData}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    name="contentType"
                    value={contentType}
                    filterable={
                      this.state.contentTypeData.length > 5 ? true : false
                    }
                    onFilterChange={(e) => this.onFilterChange(e, "contentType")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "contentType")
                    }
                  />
                </div>
                {this.props.page=="ManageContentLibrary" && (
                <div className="col-12 col-sm-6 mt-2">
                      <label className="mb-1 font-weight-bold">
                        Expiration Date
                      </label>
                      <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="expDate"
                        formatPlaceholder="formatPattern"
                        value={this.state.expDate}
                        title="Expiration Date"
                        onChange={(e) =>
                          this.updateState(e.target.value, "expDate")
                        }
                      />
                </div>
                )}
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    {" "}
                    Status
                  </label>
                  <DropDownList
                    className={"form-control"}
                    name="contentLibStatus"
                    data={this.state.contentLibStatusData}
                    onChange={(e) =>
                      this.updateState(e.target.value, "contentLibStatus")
                    }
                    value={this.state.contentLibStatus}
                    filterable={true}
                    onFilterChange={(e) => {
                      let filteredData = filterBy(
                        ManageContentLibStatus.slice(),
                        e.filter
                      );
                      return this.setState({ contentLibStatusData: filteredData });
                    }}
                  />
                </div>
                 </React.Fragment>
            )}

            {/* Message Center */}
            {this.props.page=="ManageCommunicationCenter" && (
              // <div className="col-12 date-search col-sm-12 mt-2 px-0">
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Message</label>
                  <input
                    type="text"
                    name="message"
                    className="form-control"
                    placeholder="Enter Message"
                    maxLength={100}
                    onChange={(e) => this.updateState(e.target.value, "message")}
                    value={this.state.message}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2  ">
                  <label className="mb-1 font-weight-bold">Priority</label>
                  <DropDownList
                    data={this.state.msgPrioData}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    name="name"
                    value={this.state.msgPrioValue}
                    onFilterChange={(e) => this.onFilterChange(e, "msgPrioValue")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "msgPrioValue")
                    }
                  />
                </div>
                 <div className="col-12 col-sm-6 mt-2  ">
                  <label className="mb-1 font-weight-bold">Category</label>
                  <DropDownList
                    data={this.state.msgCatData}
                    className="form-control"
                    textField="name"
                    dataItemKey="id"
                    name="name"
                    value={this.state.msgCatValue}
                    onFilterChange={(e) => this.onFilterChange(e, "msgCatValue")}
                    onChange={(e) =>
                      this.updateState(e.target.value, "msgCatValue")
                    }
                   />
                 </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    Start Date
                  </label>
                  <DateTimePicker
                    className="form-control"
                    name="startDateTime"
                    formatPlaceholder="formatPattern"
                    format="MM/dd/yyyy hh:mm aa"
                    value={this.state.startDateTime}
                    title="Start Date"
                    onChange={(e) =>
                      this.updateState(e.target.value, "startDateTime")
                    }
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">
                    End Date
                  </label>
                  <DateTimePicker
                    className="form-control"
                    name="endDateTime"
                    formatPlaceholder="formatPattern"
                    format="MM/dd/yyyy hh:mm aa"
                    value={this.state.endDateTime}
                    title="End Date"
                    onChange={(e) =>
                      this.updateState(e.target.value, "endDateTime")
                    }
                  />
                </div>
              </React.Fragment>
              // </div>
            )}

            {/* Customer Service Management */}
            {this.props.page=="ManageSupportTickets" && (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Client</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.clientsData}
                    textField="text"
                    dataItemKey="id"
                    id="clients"
                    autoClose={false}
                    itemRender={this.itemRender}
                    value={this.state.allClients}
                    onChange={(e) =>
                      this.handleTicketClientChange(e.target.value, "allClients")
                    }
                    placeholder="Select Clients..."
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "client")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Ticket #</label>
                  <input
                    type="text"
                    name="ticketNumber"
                    className="form-control"
                    placeholder="Enter Ticket #"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "ticketNumber")
                    }
                    value={ticketNumber}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Title</label>
                  <input
                    type="text"
                    name="ticketTitle"
                    className="form-control"
                    placeholder="Enter Title"
                    maxLength={100}
                    onChange={(e) =>
                      this.updateState(e.target.value, "ticketTitle")
                    }
                    value={ticketTitle}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Priority</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.priorityData}
                    textField="text"
                    dataItemKey="id"
                    id="priority"
                    autoClose={false}
                    itemRender={this.itemRender}
                    value={this.state.allPriority}
                    onChange={(e) =>
                      this.updateState(e.target.value, "allPriority")
                    }
                    placeholder="Select..."
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "priority")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Functional Area</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.functionalAreaData}
                    textField="text"
                    dataItemKey="id"
                    id="functionalArea"
                    autoClose={false}
                    itemRender={this.itemRender}
                    value={this.state.allFunctionalArea}
                    onChange={(e) =>
                      this.updateState(e.target.value, "allFunctionalArea")
                    }
                    placeholder="Select..."
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "functionalArea")}
                  />
                </div>
               
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Request Type</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.requestTypeData}
                    textField="text"
                    dataItemKey="id"
                    id="requestType"
                    autoClose={false}
                    itemRender={this.itemRender}
                    value={this.state.allRequestType}
                    onChange={(e) =>
                      this.updateState(e.target.value, "allRequestType")
                    }
                    placeholder="Select..."
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "requestType")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Queue</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.queueData}
                    textField="text"
                    dataItemKey="id"
                    id="queue"
                    autoClose={false}
                    itemRender={this.itemRender}
                    value={this.state.allQueue}
                    onChange={(e) =>
                      this.updateState(e.target.value, "allQueue")
                    }
                    placeholder="Select..."
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "queue")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Assigned To</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.assignToData}
                    textField="text"
                    dataItemKey="id"
                    id="assignedTo"
                    autoClose={false}
                    itemRender={this.itemRender}
                    value={this.state.allAssignTo}
                    onChange={(e) =>
                      this.updateState(e.target.value, "allAssignTo")
                    }
                    placeholder="Select..."
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "assignedTo")}
                  />
                </div>

                <div className="col-12 col-sm-6 mt-2 multiselect">
                  <label className="mb-1 font-weight-bold">Status</label>
                  <MultiSelect
                    className="form-control"
                    data={this.state.statusData}
                    textField="text"
                    dataItemKey="id"
                    id="status"
                    autoClose={false}
                    itemRender={this.itemRender}
                    value={this.state.allStatus}
                    onChange={(e) =>
                      this.updateState(e.target.value, "allStatus")
                    }
                    placeholder="Select..."
                    filterable={false}
                    onFilterChange={(e) => this.onFilterChange(e, "status")}
                  />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <div className="row">
                    <div className="col-12">
                      <label className="mb-1 font-weight-bold">Created Date</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-6">
                      <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="createdDateFrom"
                        formatPlaceholder="formatPattern"
                        value={this.state.createdDateFrom}
                        title="Created Date - From"
                        onChange={(e) => this.updateState(e.target.value, "createdDateFrom")}
                        max={this.state.createdDateTo ? new Date(this.state.createdDateTo) : undefined}
                      />
                    </div>
                    <div className="col-12 col-sm-6 mt-2 mt-sm-0">
                      <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="createdDateTo"
                        formatPlaceholder="formatPattern"
                        value={this.state.createdDateTo}
                        title="Created Date - To"
                        onChange={(e) => this.updateState(e.target.value, "createdDateTo")}
                        min={this.state.createdDateFrom ? new Date(this.state.createdDateFrom) : undefined}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <div className="row">
                    <div className="col-12">
                      <label className="mb-1 font-weight-bold">Resolution Date</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-6">
                      <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="resolutionDateFrom"
                        formatPlaceholder="formatPattern"
                        value={this.state.resolutionDateFrom}
                        title="Resolution Date - From"
                        onChange={(e) => this.updateState(e.target.value, "resolutionDateFrom")}
                        max={this.state.resolutionDateTo ? new Date(this.state.resolutionDateTo) : undefined}
                      />
                    </div>
                    <div className="col-12 col-sm-6 mt-2 mt-sm-0">
                      <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="resolutionDateTo"
                        formatPlaceholder="formatPattern"
                        value={this.state.resolutionDateTo}
                        title="Resolution Date - To"
                        onChange={(e) => this.updateState(e.target.value, "resolutionDateTo")}
                        min={this.state.resolutionDateFrom ? new Date(this.state.resolutionDateFrom) : undefined}
                      />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
        {this.props.page=="ConfirmationAssignment" && (
              <React.Fragment>
                <div className="col-12 col-sm-6 mt-2 multiselect">
                      <label className="mb-1 font-weight-bold">Confirm Status</label>
                        <MultiSelect
                          className="form-control"
                          data={this.state.confirmStatusData}
                          textField="cnfStatus"
                          dataItemKey="id"
                          autoClose={false}
                          itemRender={this.itemRender}
                          value={this.state.selectedCnfStatus}
                          onChange={(e) =>
                            this.updateState(e.target.value, "selectedCnfStatus")
                          }
                          placeholder="Select Confirm Status..."
                          filterable={false}
                          onFilterChange={(e) => this.onFilterChange(e, "cnfStatus")}
                        />                      
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Assignment Start</label>
                  <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="assignStartDate"
                        formatPlaceholder="formatPattern"
                        value={this.state.assignStartDate}
                        title="Start Date"
                        onChange={(e) =>
                          this.updateState(e.target.value, "assignStartDate")
                        }
                      />
                </div>
                <div className="col-12 col-sm-6 mt-2">
                  <label className="mb-1 font-weight-bold">Assignment End</label>
                  <DatePicker
                        className="form-control"
                        format="MM/dd/yyyy"
                        name="assignEndDate"
                        formatPlaceholder="formatPattern"
                        value={this.state.assignEndDate}
                        title="End Date"
                        onChange={(e) =>
                          this.updateState(e.target.value, "assignEndDate")
                        }
                      />
                </div>
              </React.Fragment>
            )}

            <div className="col-12 mt-3">
              <div className="col-12 border-top"></div>
            </div>

            <div className="col-12">
              <div className="row mt-2 align-items-center">
                <div className="col-12 col-sm-6" id="nameyoursearch">
                  <label className="mb-1 font-weight-bold required">
                    Name Your Search
                  </label>
                  <Input
                    name="nameYourSearch"
                    type="text"
                    className="form-control"
                    style={{ width: "100%" }}
                    required={searchName =="" && searchNameReq ? true : false}
                    minLength={1}
                    maxLength={100}
                    placeholder="Enter Search Name"
                    onChange={(e) =>
                      this.setState({
                        searchName: e.value,
                        searchNameReq: "",
                      })
                    }
                    value={searchName}
                  />
                  <ErrorComponent message={this.state.searchNameReq} />
                </div>
                <div style={{ marginTop: "5px" }}>
                  <FontAwesomeIcon
                    icon={faThumbtack}
                    color={ifPinColor ? "black" : "gray"}
                    className={ifPinColor ? "black_rotate" : "gray_rotate"}
                    onClick={() =>
                      this.setState({
                        ifPinColor: ifPinColor ? false : true,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Buttons
          onClear={this.onClear}
          onCloseModal={this.onCloseModal}
          onSaveAndSerach={this.saveAndSearch}
          onSearch={this.onSearch}
        />
      </div>
    );
  }
}
export default AdvanceSearch;