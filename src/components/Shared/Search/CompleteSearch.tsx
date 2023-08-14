import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faChevronCircleDown, faSave, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import BasicSearch from "./BasicSearch";
import AdvanceSearch from "../Search/AdvanceSearch";
import axios from "axios";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import SavedSearch from "./savedSearches";
import { DynamicDataState, initialDataState, numberFormatter, updateFilteredArray } from "../../../HelperMethods";
import { CompositeFilterDescriptor } from "@progress/kendo-data-query";
export interface CompleteSearchProps {
    placeholder?: string;
    handleSearch?: Function;
    entityType: string;
    fields?: any;
    page: string;
    state?: any;
    onFirstLoad: boolean;
    persistSearchData?: boolean;
    enableDepartment?: boolean;
}

export interface CompleteSearchState {
    optionValue: string;
    options: any;
    ifAdvancedSearch: boolean;
    basicSearchTextValue: string;
    savedSearches: any;
    editSavedSearches: boolean;
    reopened: boolean;
    editableData: any;
    division: string;
    reqNo: string;
    reqStatus: string;
    startDateFrom: string;
    startDateTo: string;
    endDateFrom: string;
    endDateTo: string;
    location: string;
    position: string;
    searchName: string;
    region: string;
    roleName: string;
    zone: string;
    shareCandidateStatus: string;
    expenseStatus: string;
    serviceCategory: string;
    notificationType: string;
    hiringManager: string;
    searchId: string;
    candidateName: string;
    candidateFullName: string;
    candidatestatus: string;
    submittedOn: any;
    presentationDate: any;
    startDate: any;
    startDateTime: any;
    endDateTime: any;
    endDate: any;
    validFrom: any;
    validTo: any;
    basicSearchData: any;
    advancedSearchData: any;
    totalHours: any;
    dataState: any;
    serviceTypeDataState: any;
    client: string;
    //vendor invoicing fields start
    vendorName: any;
    billingPeriodStart: any;
    billingPeriodEnd: any;
    vendorInvoiceStatus?: any[];
    vendorInvoiceZones?: any[];
    vendorInvoiceRegions?: any[];
    vendorInvoicePosition?: any[];
    hours: any;
    //vendor invoicing fields end
    serviceType: any;
    reason: any;
    tags: any;
    associate: any;
    jobCategory: any;
    data: any;
    type: any;
    eventLogDate: string;
    //Manage Clients, Vendors, Vendor Tiers fields start
    email: string;
    address1: string;
    city: string;
    state: string;
    clientStatus: string;
    vendor: string;
    message: string;
    tier: string;
    jobFlow: string;
    clientPosition: string;
    newSavedSearchId?: any;
    //Manage Clients, Vendors, Vendor Tiers fields ends
    userRole?: any;
    daysToExpiration?: any;
    runDateFrom: any;
    runDateTo: any;
    clientIds: any;
    selectedSavedSearchData?: any;
    positionSelected: string;
    createdDateFrom: any;
    resolutionDateFrom: any;
    requisitionStatus?: any[];
    hiringManagers?: any[];
    tsStatuses?: any[];
    locations?: any[];
    divisions?: any[];
    isPinned?: boolean;
    allClients?: any[];
    selectedActions?: any[];
    userRoles?: any[];
    statuses?: any[];
    notificationCategory: string;
    roleType?: any;
    vendorInvoiceType?: any[];
    dynamicDataState?: any;
    allFunctionalArea?: any[];
    allPriority?: any[];
    allRequestType?: any[];
    allStatus?: any[];
    msgCatValue: string;
    msgPrioValue: string;
    createdDateTo: any;
    resolutionDateTo: any;
    eventLogType: string;
    entityLogType: string;
    allAssignTo?: any[];
    allQueue?: any[];
    contentLibTitle : any;
    contentType: string;
    expDate: string;
    ContentLibStatus: string;
    selectedCnfStatus?: any[];
    assignStartDate: any;
    assignEndDate: any;
    ticketNumber: any;
    ticketTitle: any;
}

class CompleteSearch extends React.Component<CompleteSearchProps, CompleteSearchState> {
    initialState: Readonly<CompleteSearchState>;
    childRef: React.RefObject<SavedSearch> = React.createRef();
    basicRef: React.RefObject<BasicSearch> = React.createRef();
    private userObj: any = JSON.parse(localStorage.getItem("user"));

    constructor(props: CompleteSearchProps) {
        super(props);
        this.initialState = {
            ifAdvancedSearch: false,
            basicSearchTextValue: "",
            optionValue: "All",
            options: [],
            savedSearches: [],
            editSavedSearches: false,
            reopened: false,
            editableData: [],
            division: "",
            reqNo: "",
            reqStatus: "",
            startDateFrom: "",
            startDateTo: "",
            endDateFrom: "",
            endDateTo: "",
            location: "",
            position: "",
            region: "",
            roleName: "",
            zone: "",
            notificationType: "",
            shareCandidateStatus: "",
            serviceCategory: "",
            msgCatValue: "",
            msgPrioValue: "",
            startDateTime: "",
            endDateTime: "",
            hiringManager: "",
            searchName: "",
            searchId: "",
            requisitionStatus: [],
            hiringManagers: [],
            tsStatuses: [],
            locations: [],
            divisions: [],
            candidatestatus: "",
            candidateName: "",
            candidateFullName: "",
            submittedOn: "",
            presentationDate: "",
            startDate: "",
            endDate: "",
            validFrom: "",
            validTo: "",
            totalHours: 0,
            basicSearchData: [],
            advancedSearchData: [],
            dataState: initialDataState,
            serviceTypeDataState: "",
            client: "",
            vendorName: "",
            billingPeriodStart: "",
            billingPeriodEnd: "",
            runDateFrom: "",
            runDateTo: "",
            vendorInvoiceStatus: [],
            vendorInvoiceZones: [],
            vendorInvoiceRegions: [],
            vendorInvoicePosition: [],
            hours: "",
            associate: "",
            serviceType: "",
            reason: "",
            tags: "",
            jobCategory: "",
            data: "",
            type: "",
            eventLogDate: "",
            email: "",
            notificationCategory: "",
            address1: "",
            city: "",
            state: "",
            clientStatus: "",
            vendor: "",
            message: "",
            tier: "",
            jobFlow: "",
            clientPosition: "",
            positionSelected: "",
            expenseStatus: "",
            createdDateFrom: "",
            resolutionDateFrom: "",
            clientIds: [],
            allClients: [],
            selectedActions: [],
            userRoles: [],
            statuses: [],
            vendorInvoiceType: [],
            dynamicDataState: DynamicDataState(0,100),
            allFunctionalArea: [],
            allPriority: [],
            allRequestType: [],
            allStatus: [],
            createdDateTo:"",
            resolutionDateTo: "",
            eventLogType: "",
            entityLogType: "",
            allAssignTo: [],
            allQueue: [],
            contentLibTitle : "",
            contentType: "",
            expDate: "",
            ContentLibStatus: "",
            selectedCnfStatus: [],
            assignStartDate: "",
            assignEndDate: "",
            ticketNumber: "",
            ticketTitle: "",
        };
        this.state = this.initialState;
    }
    componentDidMount() {
        this.getSavedSearches();
        let searchData = JSON.parse(localStorage.getItem(`${this.props.page}-SearchData`))

        if (searchData) {
            if (searchData.searchText && searchData.searchText !="undefined") {
                this.setState({
                    basicSearchTextValue: searchData.searchText,
                    optionValue: searchData.searchOption,
                })
            }
        }
    }

    onSearchRequisition = (selectedOption, filteredArray, searchString) => {
        this.setState({
            basicSearchTextValue: searchString,
            optionValue: selectedOption,
        });

        this.handleSearchFunction(filteredArray, searchString);
    };

    getSavedSearches = (isOnClose?: boolean) => {
        const queryParams = `createdBy eq ${this.userObj.userId} and page eq '${this.props.page}'`;
        axios.get(`/api/search?$filter=${queryParams}`).then((res) => {
            this.setState({ savedSearches: res.data }, () => { if (!isOnClose) this.childRef.current.pinnedValue(res.data, this.state.newSavedSearchId) });

            if (this.props.onFirstLoad) {
                this.getRequisitionOnFirstLoad(res)
            }
        });
    };
    getRequisitionOnFirstLoad = (res) => {
        const pinned = res.data.filter((item) => item.pinned ==true);

        var gridDataState = JSON.parse(localStorage.getItem(`${this.props.page}-GridDataState`))
        if (gridDataState) {
            this.props.handleSearch(gridDataState);
            this.setState({ selectedSavedSearchData: pinned.length ? pinned : undefined });
        } else {
            return (pinned.length > 0
                ? this.handleSearchFunction(JSON.parse(pinned[0].filter), "true", pinned)
                : this.handleSearchFunction())
        }

    }
    handleSearchFunction = (filteredArray?: any, searchString?: any, data?) => {
        this.setState({ selectedSavedSearchData: data ? data : filteredArray });

        filteredArray = updateFilteredArray(filteredArray);
        var searchData = {}
        var dataState = {}
        var serviceTypeDataState = {}
        var currentDataState = {}
        if (searchString=="" || searchString==null) {
            dataState = {
                ...this.state.dataState,
                skip: 0,
                filter: null,
            };

            serviceTypeDataState = {
                ...this.state.serviceTypeDataState,
                skip: 0,
                filter: null,
            };

            currentDataState = {
                ...this.state.dynamicDataState,
                skip: 0,
                filter: null,
            };

            this.props.page=="ManageServiceType" ? this.props.handleSearch(serviceTypeDataState) : 
            (this.props.page=="SpendForecastReport" ? this.props.handleSearch(currentDataState) :  this.props.handleSearch(dataState))
            this.childRef.current.setDefault();
            searchData = {
                'advanceSearch': {},
                'searchText': null,
                'searchOption': "All",
            }
        } else {
            var filterObj: CompositeFilterDescriptor = {
                logic: "and",
                filters: filteredArray,
            };
            dataState = {
                ...this.state.dataState,
                skip: 0,
                filter: filterObj,
            };
            currentDataState = {
                ...this.state.dynamicDataState,
                skip: 0,
                filter: filterObj,
            };
            serviceTypeDataState = {
                ...this.state.serviceTypeDataState,
                skip: 0,
                filter: filterObj,
            };

            searchData = {
                'advanceSearch': this.state.basicSearchTextValue ? {} : filterObj,
                'searchText': this.state.basicSearchTextValue,
                'searchOption': this.state.optionValue ? this.state.optionValue : "All",
            }

            this.props.page=="SpendForecastReport" ? this.props.handleSearch(currentDataState) : this.props.handleSearch(dataState);
            this.props.page=="ManageServiceType" ? this.props.handleSearch(serviceTypeDataState) : this.props.handleSearch(dataState);
            if (data) {
                this.editSavedSearch(data, true);
            }
        }

        if (this.props.persistSearchData) {
            localStorage[`${this.props.page}-SearchData`] = JSON.stringify(searchData)
            localStorage[`${this.props.page}-GridDataState`] = JSON.stringify(dataState)
        }
    };

    editSavedSearch = (data, isSearchChanged?) => {
        let parsedEditableData = data[0].filter ? JSON.parse(data[0].filter) : data;
        parsedEditableData.map((i) => {
            return i.logic =="or"
                ? i.filters.length ==1
                    ? i.filters[0].filters.length > 1
                        ? this.setState({
                            optionValue: "All",
                            basicSearchTextValue: i.filters[0].filters[0].value,
                            searchName: data[0].name,
                            searchId: data[0].searchId,
                            basicSearchData: i.filters[0].filters[0],
                        })
                        : this.setState({
                            optionValue: i.filters[0].filters[0].field,
                            basicSearchTextValue: i.filters[0].filters[0].value,
                            searchName: data[0].name,
                            searchId: data[0].searchId,
                            basicSearchData: i.filters[0].filters[0],
                        })
                    : null
                : i.logic =="and"
                    ? i.filters.map((item) => {
                        this.state.advancedSearchData.push(item);
                        return item.field =="division"
                            ? this.setState({ division: item.value })
                            : item.field =="Location" || item.field =="location"
                                ? this.setState({ location: item.value })
                                : item.field =="position"
                                    ? this.setState({ position: item.value ,positionSelected: item.value})
                                    : item.field =="region"
                                        ? this.setState({ region: item.value })
                                        : item.field =="hiringManager"
                                            ? this.setState({ hiringManager: item.value })
                                            : item.field =="reqNumber"
                                                ? this.setState({ reqNo: item.value })
                                                : item.field =="status"
                                                    ? this.setState({ reqStatus: item.value, candidatestatus: item.value, ContentLibStatus: item.value })
                                                    : item.field =="startDate" && item.operator =="gte"
                                                        ? this.setState({ startDateFrom: item.value, startDateTime: item.value, startDate: item.value })
                                                        : item.field =="startDate" && item.operator =="lte"
                                                            ? this.setState({ startDateTo: item.value })
                                                            : item.field =="endDate" && item.operator =="gte"
                                                                ? this.setState({ endDateFrom: item.value })
                                                                : item.field =="endDate" && item.operator =="lte"
                                                                    ? this.setState({ endDateTo: item.value, endDateTime: item.value, endDate: item.value })
                                                                    : item.field =="candidateName"
                                                                        ? this.setState({ candidateName: item.value })
                                                                        : item.field =="candidateFullName"
                                                                            ? this.setState({ candidateFullName: item.value })
                                                                            : item.field =="candidatestatus"
                                                                                ? this.setState({ candidatestatus: item.value })
                                                                                : item.field =="submittedOn"
                                                                                    ? this.setState({ submittedOn: item.value })
                                                                                    : item.field =="presentationDate"
                                                                                        ? this.setState({ presentationDate: item.value })
                                                                                        : item.field =="vendorName"
                                                                                            ? this.setState({ vendorName: item.value })
                                                                                            : item.field =="client"
                                                                                                ? this.setState({ client: item.value })
                                                                                                // : item.field =="status"
                                                                                                //     ? this.setState({ vendorInvoiceStatus: item.value })
                                                                                                : item.field =="hours"
                                                                                                    ? this.setState({ hours: item.value })
                                                                                                    : item.field =="associate"
                                                                                                        ? this.setState({ associate: item.value })
                                                                                                        : item.field =="serviceType"
                                                                                                            ? this.setState({ serviceType: item.value })
                                                                                                            : item.field =="billingPeriodStart" && item.operator =="gte"
                                                                                                                ? this.setState({ billingPeriodStart: item.value })
                                                                                                                : item.field =="billingPeriodStart" && item.operator =="lte"
                                                                                                                    ? this.setState({ billingPeriodStart: item.value })
                                                                                                                    : item.field =="billingPeriodEnd" && item.operator =="gte"
                                                                                                                        ? this.setState({ billingPeriodEnd: item.value })
                                                                                                                        : item.field =="billingPeriodStart" && item.operator =="eq"
                                                                                                                            ? this.setState({ billingPeriodStart: item.value })
                                                                                                                            : item.field =="billingPeriodEnd" && item.operator =="eq"
                                                                                                                                ? this.setState({ billingPeriodEnd: item.value })
                                                                                                                                : item.field =="billingPeriodEnd" && item.operator =="lte"
                                                                                                                                    ? this.setState({ billingPeriodEnd: item.value })
                                                                                                                                    : item.field =="runDateFrom" && item.operator =="gte"
                                                                                                                                        ? this.setState({ runDateFrom: item.value })
                                                                                                                                        : item.field =="runDateFrom" && item.operator =="lte"
                                                                                                                                            ? this.setState({ runDateFrom: item.value })
                                                                                                                                            : item.field =="runDateTo" && item.operator =="gte"
                                                                                                                                                ? this.setState({ runDateTo: item.value })
                                                                                                                                                : item.field =="runDateFrom" && item.operator =="eq"
                                                                                                                                                    ? this.setState({ runDateFrom: item.value })
                                                                                                                                                    : item.field =="runDateTo" && item.operator =="eq"
                                                                                                                                                        ? this.setState({ runDateTo: item.value })
                                                                                                                                                        : item.field =="runDateTo" && item.operator =="lte"
                                                                                                                                                            ? this.setState({ runDateTo: item.value })
                                                                                                                                                            : item.field =="jobCategory"
                                                                                                                                                                ? this.setState({ jobCategory: item.value })
                                                                                                                                                                : item.field =="email"
                                                                                                                                                                    ? this.setState({ email: item.value })
                                                                                                                                                                    : item.field =="address1"
                                                                                                                                                                        ? this.setState({ address1: item.value })
                                                                                                                                                                        : item.field =="city"
                                                                                                                                                                            ? this.setState({ city: item.value })
                                                                                                                                                                            : item.field =="state"
                                                                                                                                                                                ? this.setState({ state: item.value })
                                                                                                                                                                                : item.field =="clientStatus"
                                                                                                                                                                                    ? this.setState({ clientStatus: item.value })
                                                                                                                                                                                    : item.field =="vendor"
                                                                                                                                                                                        ? this.setState({ vendor: item.value })
                                                                                                                                                                                        : item.field =="tier"
                                                                                                                                                                                            ? this.setState({ tier: item.value })
                                                                                                                                                                                            : item.field =="jobFlow"
                                                                                                                                                                                                ? this.setState({ jobFlow: item.value })
                                                                                                                                                                                                : item.field =="validFrom" && item.operator =="gte"
                                                                                                                                                                                                    ? this.setState({ validFrom: item.value })
                                                                                                                                                                                                    : item.field =="validTo" && item.operator =="lte"
                                                                                                                                                                                                        ? this.setState({ validTo: item.value })
                                                                                                                                                                                                        : item.field =="clientPosition"
                                                                                                                                                                                                            ? this.setState({ clientPosition: item.value })
                                                                                                                                                                                                            : item.field =="daysToExpiration"
                                                                                                                                                                                                                ? this.setState({ daysToExpiration: item.value })
                                                                                                                                                                                                                : item.field =="role"
                                                                                                                                                                                                                    ? this.setState({ userRole: item.value })
                                                                                                                                                                                                                    : item.field =="zone"
                                                                                                                                                                                                                        ? this.setState({ zone: item.value })
                                                                                                                                                                                                                        : item.field =="serviceCategory"
                                                                                                                                                                                                                            ? this.setState({ serviceCategory: item.value })
                                                                                                                                                                                                                            : item.field =="notificationType"
                                                                                                                                                                                                                                ? this.setState({ notificationType: item.value })
                                                                                                                                                                                                                                : item.field =="notificationCategory"
                                                                                                                                                                                                                                    ? this.setState({ notificationCategory: item.value })
                                                                                                                                                                                                                                    : item.field =="tags"
                                                                                                                                                                                                                                        ? this.setState({ tags: item.value })
                                                                                                                                                                                                                                            : item.logic =="or" && item.filters[0].field =="clientIntId"
                                                                                                                                                                                                                                                ? this.setState({ clientIds: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                : item.logic =="or" && item.filters[0].field =="hiringManager"
                                                                                                                                                                                                                                                    ? this.setState({ hiringManagers: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                    : item.logic =="or" && item.filters[0].field =="location"
                                                                                                                                                                                                                                                        ? this.setState({ locations: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                        : item.logic =="or" && item.filters[0].field =="division"
                                                                                                                                                                                                                                                            ? this.setState({ divisions: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                            : item.logic =="or" && item.filters[0].field =="status"
                                                                                                                                                                                                                                                                ? this.setState({ requisitionStatus: item.filters.map(x => x.value), statuses: item.filters.map(x => x.value), tsStatuses: item.filters.map(x => x.value), vendorInvoiceStatus: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                : item.logic =="or" && item.filters[0].field =="client"
                                                                                                                                                                                                                                                                    ? this.setState({ allClients: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                    : item.logic =="or" && item.filters[0].field =="role"
                                                                                                                                                                                                                                                                        ? this.setState({ userRoles: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                        : item.field =="name"
                                                                                                                                                                                                                                                                            ? this.setState({ roleName: item.value })
                                                                                                                                                                                                                                                                            : item.field =="roleTypeName"
                                                                                                                                                                                                                                                                                ? this.setState({ roleType: item.value })
                                                                                                                                                                                                                                                                                : item.logic =="or" && item.filters[0].field =="zone"
                                                                                                                                                                                                                                                                                    ? this.setState({ vendorInvoiceZones: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                    : item.logic =="or" && item.filters[0].field =="region"
                                                                                                                                                                                                                                                                                        ? this.setState({ vendorInvoiceRegions: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                        : item.logic =="or" && item.filters[0].field =="position"
                                                                                                                                                                                                                                                                                            ? this.setState({ vendorInvoicePosition: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                            : item.logic =="or" && (item.filters[0].field =="serviceCatIntId" || item.filters[0].field =="serviceTypeIntId")
                                                                                                                                                                                                                                                                                                ? this.setState({ vendorInvoiceType: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                                : item.logic =="or" && item.filters[0].field =="actions"
                                                                                                                                                                                                                                                                                                    ? this.setState({ selectedActions: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                                    : item.field =="reasonName"
                                                                                                                                                                                                                                                                                                        ? this.setState({ reason: item.value })
                                                                                                                                                                                                                                                                                                        : item.logic =="or" && item.filters[0].field =="role"
                                                                                                                                                                                                                                                                                                            ? this.setState({ userRoles: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                                            : item.field =="status"
                                                                                                                                                                                                                                                                                                                ? this.setState({ shareCandidateStatus: item.value })
                                                                                                                                                                                                                                                                                                                : item.field =="expenseStatus"
                                                                                                                                                                                                                                                                                                                    ? this.setState({ expenseStatus: item.value })
                                                                                                                                                                                                                                                                                                                : item.field =="title"
                                                                                                                                                                                                                                                                                                                    ? this.setState({ message: item.value })
                                                                                                                                                                                                                                                                                                                    : item.field =="msgCat"
                                                                                                                                                                                                                                                                                                                        ? this.setState({ msgCatValue: item.value })
                                                                                                                                                                                                                                                                                                                        : item.field =="msgPrio"
                                                                                                                                                                                                                                                                                                                            ? this.setState({ msgPrioValue: item.value })
                                                                                                                                                                                                                                                                                                                            : item.logic =="or" && item.filters[0].field =="tktFuncArea"
                                                                                                                                                                                                                                                                                                                                ? this.setState({ allFunctionalArea: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                                                                : item.logic =="or" && item.filters[0].field =="tktPrio"
                                                                                                                                                                                                                                                                                                                                    ? this.setState({ allPriority: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                                                                    : item.logic =="or" && item.filters[0].field =="tktReqType"
                                                                                                                                                                                                                                                                                                                                        ? this.setState({ allRequestType: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                                                                        : item.logic =="or" && item.filters[0].field =="tktStatus"
                                                                                                                                                                                                                                                                                                                                            ? this.setState({ allStatus: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                                                                            : item.field =="createdDate" && item.operator =="gte"
                                                                                                                                                                                                                                                                                                                                                ? this.setState({ createdDateFrom: item.value })
                                                                                                                                                                                                                                                                                                                                                : item.field =="createdDate" && item.operator =="lte"
                                                                                                                                                                                                                                                                                                                                                    ? this.setState({ createdDateTo: item.value })
                                                                                                                                                                                                                                                                                                                                                    : item.field =="resDate" && item.operator =="gte"
                                                                                                                                                                                                                                                                                                                                                        ? this.setState({ resolutionDateFrom: item.value })
                                                                                                                                                                                                                                                                                                                                                        : item.field =="resDate" && item.operator =="lte"
                                                                                                                                                                                                                                                                                                                                                            ? this.setState({ resolutionDateTo: item.value })
                                                                                                                                                                                                                                                                                                                                                            : item.field =="eventType"
                                                                                                                                                                                                                                                                                                                                                                ? this.setState({ eventLogType: item.value })
                                                                                                                                                                                                                                                                                                                                                                : item.field =="entityType"
                                                                                                                                                                                                                                                                                                                                                                    ? this.setState({ entityLogType: item.value })
                                                                                                                                                                                                                                                                                                                                                                    : item.field =="eventDate"
                                                                                                                                                                                                                                                                                                                                                                        ? this.setState({ eventLogDate: item.value })
                                                                                                                                                                                                                                                                                                                                                                        : item.logic =="or" && item.filters[0].field =="currentAssignedTo"
                                                                                                                                                                                                                                                                                                                                                                            ? this.setState({ allAssignTo: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                                                                                                            : item.logic =="or" && item.filters[0].field =="tktQue"
                                                                                                                                                                                                                                                                                                                                                                                ? this.setState({ allQueue: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                                                                                                                : item.field =="title"
                                                                                                                                                                                                                                                                                                                                                                                    ? this.setState({ contentLibTitle: item.value })
                                                                                                                                                                                                                                                                                                                                                                                    : item.field =="contentType"
                                                                                                                                                                                                                                                                                                                                                                                        ? this.setState({ contentType: item.value })
                                                                                                                                                                                                                                                                                                                                                                                        : item.field =="validTo" && item.operator =="gte"
                                                                                                                                                                                                                                                                                                                                                                                            ? this.setState({ expDate: item.value })
                                                                                                                                                                                                                                                                                                                                                                                            : item.logic =="or" && item.filters[0].field =="confirmStatus"
                                                                                                                                                                                                                                                                                                                                                                                                ? this.setState({ selectedCnfStatus: item.filters.map(x => x.value) })
                                                                                                                                                                                                                                                                                                                                                                                                : item.field =="assignStartDate" && item.operator =="gte"
                                                                                                                                                                                                                                                                                                                                                                                                    ? this.setState({ assignStartDate: item.value })
                                                                                                                                                                                                                                                                                                                                                                                                    : item.field =="assignEndDate" && item.operator =="lte"
                                                                                                                                                                                                                                                                                                                                                                                                        ? this.setState({ assignEndDate: item.value })
                                                                                                                                                                                                                                                                                                                                                                                                        : item.field =="ticketNumber"
                                                                                                                                                                                                                                                                                                                                                                                                            ? this.setState({ ticketNumber: item.value })
                                                                                                                                                                                                                                                                                                                                                                                                            : item.field =="ticketTitle"
                                                                                                                                                                                                                                                                                                                                                                                                                ? this.setState({ ticketTitle: item.value })
                                                                                                                                                                                                                                                                                                                                                                                                                : null;
                    })
                    : null;
        });
        this.setState({
            ifAdvancedSearch: isSearchChanged ? false : true,
            editSavedSearches: data[0].searchId ? true : false,
            reopened: true,
            editableData: data,
            searchId: data[0].searchId,
            searchName: data[0].name,
            isPinned: data[0].pinned
        });
    };

    onCloseModal = (basicSearchTextValue, selectedOption) => {
        this.setState(this.initialState);
        this.setState({ basicSearchTextValue: basicSearchTextValue, optionValue: selectedOption, ifAdvancedSearch: false }, () =>
            this.basicRef.current.basicSearchValue(basicSearchTextValue, selectedOption)
        );
        this.getSavedSearches(true);
    };
    clearState = () => {
        this.setState({ basicSearchTextValue: "", optionValue: "", hiringManagers: [], tsStatuses: [], vendorInvoiceStatus: [], selectedActions: [], selectedCnfStatus:[] });
    };

    optionChange = (e) => {
        this.setState({ optionValue: e });
    };
    inputedValueChange = (e) => {
        this.setState({ basicSearchTextValue: e });
    };

    persistAdvanceSearchData = () => {
        let searchData = JSON.parse(localStorage.getItem(`${this.props.page}-SearchData`))
        if (searchData) {
            if (Object.keys(searchData.advanceSearch).length) {
                if (searchData.advanceSearch.filters.length) {
                    this.editSavedSearch(searchData.advanceSearch.filters);
                }
            }
        }
    }

    onAdvanceSearchClicked = () => {
        this.setState({
            ifAdvancedSearch: true,
        }, () => {
            if (this.state.selectedSavedSearchData && this.state.selectedSavedSearchData.length) {
                this.editSavedSearch(this.state.selectedSavedSearchData);
            } else {
                this.persistAdvanceSearchData()
            }
        })
    }


    render() {
        const { placeholder, handleSearch, entityType } = this.props;
        const {
            ifAdvancedSearch,
            savedSearches,
            searchName,
            searchId,
            editSavedSearches,
            reopened,
            editableData,
            division,
            location,
            position,
            hiringManager,
            reqStatus,
            reqNo,
            region,
            roleName,
            roleType,
            zone,
            notificationType,
            shareCandidateStatus,
            serviceCategory,
            optionValue,
            basicSearchTextValue,
            startDateFrom,
            startDateTo,
            endDateTo,
            endDateFrom,
            totalHours,
            expenseStatus,
            startDate,
            endDate,
            validFrom,
            validTo,
            jobCategory,
            jobFlow,
            clientPosition,
            isPinned,
            positionSelected,
            msgCatValue,
            msgPrioValue,
        } = this.state;

        return (
            <div className="myOrderComponent">
                <div className="row mt-3 mt-lg-0 align-items-center mb-3 d-flex justify-content-center">
                    <div className="col-12 col-md-9 col-lg-9 col-xl-10 pr-0">
                        <div className="input-group">
                            <BasicSearch
                                onSearch={this.onSearchRequisition}
                                placeholder={placeholder}
                                entityType={this.props.entityType}
                                page={this.props.page}
                                optionChange={this.optionChange}
                                inputedValue={this.inputedValueChange}
                                basicSearchValue={this.state.basicSearchTextValue}
                                selectedOption={this.state.optionValue}
                                ref={this.basicRef}
                                isReportSearch={this.props.page=="VendorPerformance" || this.props.page=="ReqPerformanceReport"
                                    || this.props.page=="ClientActivityReport" || this.props.page=="CandidateSubmittalReport" || this.props.page=="ClientStatementReport"
                                    || this.props.page=="ExpiringCredentialReport" || this.props.page=="FilledAssignmentReport" || this.props.page=="TimesheetReport" || this.props.page=="ConfirmationAssignment"
                                    || this.props.page=="FinancialAccrualReport"}
                                enableDepartment={this.props.enableDepartment}
                            />
                            <div className="input-group-append col-12 col-sm-auto mt-2 mt-sm-0 pl-0 justify-content-end justify-content-start">
                                <button
                                    onClick={() =>
                                        this.onAdvanceSearchClicked()
                                    }
                                    className="col-12 btn btn-sm buttonAdvancedSearch border_Radiusforsearch_left"
                                    type="button"
                                    data-toggle="modal"
                                    data-target="#myModal"
                                >
                                    <span>Advanced Search</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <SavedSearch
                        savedSearches={savedSearches}
                        editSearch={this.editSavedSearch}
                        getSavedSearches={this.getSavedSearches}
                        onSearchRequisition={this.handleSearchFunction}
                        ref={this.childRef}
                    />
                    <div id="advancesearchCompoent-popup">
                        {this.state.ifAdvancedSearch && (
                            <Dialog>
                                <AdvanceSearch
                                    basicSearchTextValue={basicSearchTextValue}
                                    basicSearchData={this.state.basicSearchData}
                                    advancedSearchData={this.state.advancedSearchData}
                                    entityType={entityType}
                                    newSearchId={(id) => this.setState({ newSavedSearchId: id })}
                                    onSearchRequisition={this.handleSearchFunction}
                                    selectedOption={optionValue}
                                    getSavedSearches={this.getSavedSearches}
                                    edit={editSavedSearches}
                                    reopened={reopened}
                                    editableData={editableData}
                                    division={division}
                                    reqNo={reqNo}
                                    reqStatus={reqStatus}
                                    totalHours={totalHours}
                                    location={location}
                                    position={position}
                                    region={region}
                                    roleName={roleName}
                                    roleType={roleType}
                                    zone={zone}
                                    notificationType={notificationType}
                                    shareCandidateStatus={shareCandidateStatus}
                                    serviceCategory={serviceCategory}
                                    hiringManager={hiringManager}
                                    searchName={searchName}
                                    startDateFrom={startDateFrom}
                                    endDateFrom={endDateFrom}
                                    startDateTo={startDateTo}
                                    endDateTo={endDateTo}
                                    onCloseModal={this.onCloseModal}
                                    searchId={this.state.searchId}
                                    savedSearches={savedSearches}
                                    clearState={this.clearState}
                                    optionChange={this.optionChange}
                                    inputedValue={this.inputedValueChange}
                                    page={this.props.page}
                                    candidateName={this.state.candidateName}
                                    candidateFullName={this.state.candidateFullName}
                                    candidatestatus={this.state.candidatestatus}
                                    submittedOn={this.state.submittedOn}
                                    presentationDate={this.state.presentationDate}
                                    vendorName={this.state.vendorName}
                                    client={this.state.client}
                                    billingPeriodStart={this.state.billingPeriodStart}
                                    billingPeriodEnd={this.state.billingPeriodEnd}
                                    runDateFrom={this.state.runDateFrom}
                                    runDateTo={this.state.runDateTo}
                                    vendorInvoiceStatus={this.state.vendorInvoiceStatus}
                                    vendorInvoiceZones={this.state.vendorInvoiceZones}
                                    vendorInvoiceRegions={this.state.vendorInvoiceRegions}
                                    vendorInvoicePosition={this.state.vendorInvoicePosition}
                                    hours={this.state.hours}
                                    associate={this.state.associate}
                                    serviceType={this.state.serviceType}
                                    reason={this.state.reason}
                                    tags={this.state.tags}
                                    jobCategory={this.state.jobCategory}
                                    data={this.state.data}
                                    type={this.state.type}
                                    eventLogDate={this.state.eventLogDate}
                                    jobFlow={this.state.jobFlow}
                                    startDate={this.state.startDate}                               
                                    endDate={this.state.endDate}
                                    validFrom={this.state.validFrom}
                                    validTo={this.state.validTo}
                                    email={this.state.email}
                                    address1={this.state.address1}
                                    city={this.state.city}
                                    state={this.state.state}
                                    clientStatus={this.state.clientStatus}
                                    vendor={this.state.vendor}                                   
                                    tier={this.state.tier}
                                    clientPosition={this.state.clientPosition}
                                    daysToExpiration={this.state.daysToExpiration}
                                    userRole={this.state.userRole}
                                    clientIds={this.state.clientIds}
                                    requisitionStatus={this.state.requisitionStatus}
                                    hiringManagers={this.state.hiringManagers}
                                    tsStatuses={this.state.tsStatuses}
                                    notificationCategory={this.state.notificationCategory}
                                    allClients={this.state.allClients}
                                    selectedActions={this.state.selectedActions}
                                    userRoles={this.state.userRoles}
                                    locations={this.state.locations}
                                    divisions={this.state.divisions}
                                    statuses={this.state.statuses}
                                    expenseStatus={expenseStatus}
                                    vendorInvoiceType={this.state.vendorInvoiceType}
                                    ifPinColor={isPinned}
                                    message={this.state.message}
                                    startDateTime={this.state.startDateTime}
                                    endDateTime={this.state.endDateTime}
                                    msgCatValue={msgCatValue}
                                    msgPrioValue={msgPrioValue}
                                    isReportSearch={this.props.page=="VendorPerformance" || this.props.page=="ReqPerformanceReport"
                                        || this.props.page=="ClientActivityReport" || this.props.page=="CandidateSubmittalReport" || this.props.page=="ClientStatementReport"
                                        || this.props.page=="ExpiringCredentialReport" || this.props.page=="FilledAssignmentReport" || this.props.page=="TimesheetReport" || this.props.page=="ConfirmationAssignment"
                                        || this.props.page=="FinancialAccrualReport"}
                                    positionSelected={positionSelected}
                                    allFunctionalArea={this.state.allFunctionalArea}
                                    allPriority={this.state.allPriority}
                                    allRequestType={this.state.allRequestType}
                                    allStatus={this.state.allStatus} 
                                    createdDateFrom={this.state.createdDateFrom}
                                    createdDateTo={this.state.createdDateTo}
                                    resolutionDateFrom={this.state.resolutionDateFrom}
                                    resolutionDateTo={this.state.resolutionDateTo}
                                    eventLogType={this.state.eventLogType}
                                    entityLogType={this.state.entityLogType}
                                    allAssingnTo={this.state.allAssignTo}
                                    allQueue={this.state.allQueue}
                                    contentLibTitle = {this.state.contentLibTitle}
                                    contentType = {this.state.contentType}
                                    expDate = {this.state.expDate}  
                                    ContentLibStatus ={this.state.ContentLibStatus}  
                                    selectedCnfStatus={this.state.selectedCnfStatus}
                                    assignStartDate={this.state.assignStartDate}
                                    assignEndDate={this.state.assignEndDate}
                                    ticketNumber={this.state.ticketNumber}
                                    ticketTitle={this.state.ticketTitle}
                                />
                            </Dialog>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default CompleteSearch;