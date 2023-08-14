import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { State, toODataString, CompositeFilterDescriptor } from "@progress/kendo-data-query";

import * as React from "react";
import { searchFieldsReq, candidateWF, tsAllProvider, tsSingleProvider, TSSubmitted, VendorInvoice, VendorInvoicingDetail, ManageCandidate, ManageClient, ManageVendorTiers, ManageVendor, CBI, ManageDivision, ManageUser, FilledAssignmentReport, VendorPerformanceReport, candSubReport, ManageLocation, ManageGlobalJobCatalog, clientActivityReport, ManageClientRateCard, ManageInterviewCriteriaConfiguration, ManageClientJobCatalog, TSReport, VendorPerformance, ClientStatementReport, ManageRegion, ManageReleaseConfiguration, searchFieldsManageReq, ManageServiceType, Role, ManageNotifications, ManageActionReason, CandidateShareWF, SpendForecastReport, AssociateExpense, ManageCommunicationCenter, EventsLogs, ManageSupportTickets, ManageContentLibrary, ConfirmationAssignment, FinancialAccrualReport } from "./searchFieldsOptions";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { roleType } from "../AppConstants";

export interface BasicSearchProps {
    placeholder?: string;
    onSearch?: Function;
    category?: string;
    basicSearchValue?: string;
    selectedOption?: string;
    entityType: string;
    sendData?: Function;
    advancedSearch?: boolean;
    inputedValue?: any;
    optionChange?: any;
    page?: string;
    isReportSearch?: boolean;
    enableDepartment?: boolean;
}

export interface BasicSearchState {
    optionValue: string;
    options: any;
    x: string;
    searchString: any;
    filteredArray: any;
    roleType: any;
}

class BasicSearch extends React.Component<BasicSearchProps, BasicSearchState> {
    constructor(props: BasicSearchProps) {
        super(props);
        this.state = {
            x: "",
            filteredArray: [],
            searchString: "",
            optionValue: "All",
            options: [],
            roleType: roleType
        };
    }
    componentDidMount() {
        this.getOptionValues();
        this.searchFilterOperation();
    }

    basicSearchValue = (text, selected) => {
        this.setState({
            searchString: text ==undefined || text =="" ? "" : text,
            optionValue: selected ==undefined || this.props.selectedOption =="" ? "All" : selected,
        });
        return [this.state.searchString];
    };

    public searchFilterOperation() {
        const option = this.state.options.filter((i) => i != "All");
        var filterArray: Array<CompositeFilterDescriptor>;
        let SelectedOption = this.state.optionValue;
        let ignoreCase = true;
        let SearchText
        if (SelectedOption =="All") {
            let filtered = option.map((item) => {
                SearchText = this.state.searchString.toLowerCase();
                let field, operator;

                if (item =="Requisition#") {
                    field = "reqNumber";
                    ignoreCase = true;
                    operator = "contains";
                }
                else if (this.props.page != "SpendForecastReport" && (item =="Candidate Name" || item =="Provider" || item =="Provider Name")) {
                    field = this.props.page != "FinancialAccrualReport" ? (SearchText.indexOf(',')==-1 ? "candidateFullName" : "candidateName") : "providerName";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (this.props.page=="SpendForecastReport" && item =="Provider") {
                    field = "provider";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="User Type") {
                    field = "roleTypeName";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Role") {
                    field = "role";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Hiring Manager") {
                    field = "hiringManager";
                    operator = "contains";
                    ignoreCase = true;
                }

                else if (item =="Submitted On") {
                    field = "submittedOn";
                    operator = "contains";
                } else if (item =="Not Filled") {
                    field = "notFilled";
                    operator = "eq";
                    ignoreCase = null;
                } else if (item =="Open Days") {
                    field = "openDays";
                    operator = "contains";
                    ignoreCase = true;
                    //SearchText = Number(SearchText);
                }
                // else if (item =="Start Date") {
                //   field = "startDate";
                //   operator = "contains";
                // }
                // else if (item =="End Date") {
                //   field = "endDate";
                //   operator = "contains";
                // }
                else if (item =="Client Invoice Number") {
                    field = "clientInvoiceNumber";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Vendor Name") {
                    field = "vendorName";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Vendor" || (item=="Submitted By" && this.props.page=="CandidateSubmittalReport")) {
                    field = "vendor";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Hours") {
                    field = this.props.page=="TSSingleProvider" ? "totalHours" : "hours";
                    operator = "eq";
                    ignoreCase = null;
                    SearchText = Number(SearchText);
                }
                else if (item =="First Name") {
                    field = "firstName";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Last Name") {
                    field = "lastName";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="NPI#") {
                    field = "npi";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Job Flow") {
                    field = "jobFlow";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Job Category") {
                    field = "jobCategory";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Service Type") {
                    field = "serviceType";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Action") {
                    field = "actions";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Reason") {
                    field = "reason";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Tags") {
                    field = "tags";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Global Position") {
                    field = "globalPosition";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Client Position") {
                    field = "clientPosition";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Status" && (this.props.page=="ManageClient" || this.props.page=="ManageVendor" || this.props.page=="ManageDivision" || this.props.page=="ManageLocation" || this.props.page=="ManageUser" || this.props.page=="ManageServiceType" || this.props.page=="ManageNotifications" || this.props.page=="ManageCommunicationCenter")) {
                    field = "status";
                    operator = "eq";
                    ignoreCase = true;
                }
                else if (item =="Service Category") {
                    field = "serviceCategory";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Event Type") {
                    field = "eventType";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Entity Type") {
                    field = "entityType";
                    operator = "contains";
                    ignoreCase = true;
                }

                else if (item =="Client") {
                    field = this.props.page=="ManageUser" ? "clientNames" : "client";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Invoice#") {
                    field = "vendorInvoiceNumber";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Category") {
                    field = this.props.page=="ManageCommunicationCenter"? "msgCat" : "notificationCategory";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Notification") {
                    field = "notificationType";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Position") {
                    field = "position";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Candidate") {
                    field = "associate";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Functional Area") {
                    field = "tktFuncArea";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Request Type") {
                    field = "tktReqType";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Priority") {
                    field = this.props.page=="ManageSupportTickets" ? "tktPrio" : "msgPrio";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Status" && (this.props.page=="ManageSupportTickets")) {
                    field = "tktStatus";
                    operator = "eq";
                    ignoreCase = true;
                }
                else if (item =="Message") {
                    field = "title";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Title") {
                    field = this.props.page=="ManageSupportTickets" ? "ticketTitle" : "title";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Content Type") {
                    field = "contentType";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Confirm Status") {
                    field = "confirmStatus";
                    operator = "contains";
                    ignoreCase = true;
                }
                else if (item =="Ticket #") {
                    field = "ticketNumber";
                    operator = "contains";
                    ignoreCase = true;
                }
                else {
                    field = item;
                    operator = "contains";
                    ignoreCase = true;
                }
                
                return {
                    field: field,
                    operator: operator,
                    value: SearchText,
                    ignoreCase: ignoreCase,
                };
            });
            if (this.props.enableDepartment && this.props.page=='MyRequisitions') {
                filtered.push({
                    field: "departmentName",
                    operator: "contains",
                    value: this.state.searchString.toLowerCase(),
                    ignoreCase: true
                })
            }
            if (this.props.isReportSearch) {
                filterArray = [
                    {
                        logic: "and",
                        filters: [{
                            logic: "or",
                            filters: filtered,
                        }, {
                            field: "clientIntId",
                            operator: "eq",
                            value: parseInt(localStorage.getItem("UserClientIntId")),
                            ignoreCase: null,
                        }]

                    },
                ];
            }
            else {
                filterArray = [
                    {
                        logic: "or",
                        filters: filtered,
                    },
                ];
            }

        } else {
            
            SearchText = this.state.searchString.toLowerCase();
            var filedName = SelectedOption.toLowerCase();
            var roleTypeValue = this.state.roleType.filter(i => i.name.toLowerCase()==SearchText);
            var operator;
            if (SelectedOption =="Requisition#") {
                filedName = "reqNumber";
                operator = "contains";
                ignoreCase = true;
            } else if (SelectedOption =="Client Invoice Number") {
                filedName = "clientInvoiceNumber";
                operator = "contains";
                ignoreCase = true;
            } else if (SelectedOption =="Hiring Manager") {
                filedName = "hiringManager";
                operator = "contains";
                ignoreCase = true;
            } else if (this.props.page != "SpendForecastReport" && (SelectedOption =="Candidate Name" || SelectedOption =="Provider" || SelectedOption =="Provider Name")) {
                filedName = this.props.page != "FinancialAccrualReport" ? (SearchText.indexOf(',')==-1 ? "candidateFullName" : "candidateName") : "providerName";
                operator = "contains";
                ignoreCase = true;
            } else if (this.props.page=="SpendForecastReport" && SelectedOption =="Provider") {
                filedName = "provider";
                operator = "contains";
                ignoreCase = true;
            } else if (SelectedOption =="Not Filled") {
                filedName = "notFilled";
                operator = "contains";
            } else if (SelectedOption =="Open Days") {
                filedName = "openDays";
                operator = "contains";
                //let value = Number(SearchText);
                //SearchText = value;
                ignoreCase = true;
            } else if (SelectedOption =="Start Date") {
                filedName = "startDate";
                operator = "contains";
            } else if (SelectedOption =="End Date") {
                filedName = "endDate";
                operator = "contains";
            } else if (SelectedOption =="Vendor Name") {
                filedName = "vendorName";
                operator = "contains";
            } else if (SelectedOption =="Vendor") {
                filedName = "vendor";
                operator = "contains";
            } else if (SelectedOption =="Hours") {
                filedName = this.props.page=="TSSingleProvider" ? "totalHours" : "hours";
                operator = "eq";
                let value = Number(SearchText);
                SearchText = value;
                ignoreCase = null;
            } else if (SelectedOption =="First Name") {
                filedName = "firstName";
                operator = "contains";
                ignoreCase = true;
            } else if (SelectedOption =="Last Name") {
                filedName = "lastName";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="User Type") {
                filedName="roleTypeName"
                operator = "contains";    
                ignoreCase = true;
            }
             else if (SelectedOption =="Role") {
                filedName = "role";
                operator = "contains";
                ignoreCase = true;
            } else if (SelectedOption =="NPI#") {
                filedName = "npi";
                operator = "contains";
                ignoreCase = true;
            } else if (SelectedOption =="Job Flow") {
                filedName = "jobFlow";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Job Category") {
                filedName = "jobCategory";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Event Type") {
                filedName = "eventType";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Entity Type") {
                filedName = "entityType";
                operator = "contains";
                ignoreCase = true;
            }
             else if (SelectedOption =="Service Type") {
                filedName = "serviceType";
                operator = "contains";
                ignoreCase = true;
            } else if (SelectedOption =="Action") {
                filedName = "actions";
                operator = "contains";
                ignoreCase = true;
            }
             else if (SelectedOption =="Reason") {
                filedName = "reason";
                operator = "contains";
            }  
            else if (SelectedOption =="Status") {
                filedName = this.props.page=="ManageSupportTickets" ?"tktStatus":"status";
                operator = "eq";
                ignoreCase = true;
            } else if (SelectedOption =="Tags") {
                filedName = "tags";
                operator = "contains";
                ignoreCase = true;
            } else if (SelectedOption =="Global Position") {
                filedName = "globalPosition";
                operator = "contains";
                ignoreCase = true;
            } else if (SelectedOption =="Client Position") {
                filedName = "clientPosition";
                operator = "contains";
                ignoreCase = true;
            } else if (SelectedOption =="Submitted By") {
                filedName = "vendor";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Service Category") {
                filedName = "serviceCategory";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Client") {
                filedName = this.props.page=="ManageUser" ? "clientNames" : "client";
                operator = "contains";
                ignoreCase = true;
            }

            else if (SelectedOption =="Invoice#") {
                filedName = "vendorInvoiceNumber";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Category") {
                filedName = this.props.page=="ManageCommunicationCenter"? "msgCat" : "notificationCategory";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Notification") {
                filedName = "notificationType";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Position") {
                filedName = "position";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Candidate") {
                filedName = "associate";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Functional Area") {
                filedName = "tktFuncArea";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Request Type") {
                filedName = "tktReqType";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Priority") {
                filedName = this.props.page=="ManageSupportTickets" ? "tktPrio" : "msgPrio";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Message") {
                filedName = "title";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Title") {
                filedName = this.props.page=="ManageSupportTickets" ? "ticketTitle" : "title";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Content Type") {
                filedName = "contentType";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Confirm Status") {
                filedName = "confirmStatus";
                operator = "contains";
                ignoreCase = true;
            }
            else if (SelectedOption =="Ticket #") {
                filedName = "ticketNumber";
                operator = "contains";
                ignoreCase = true;
            }
            else {
                filedName = filedName;
                operator = "contains";
                ignoreCase = true;
            }
            if (this.props.isReportSearch) {
                filterArray = [
                    {
                        logic: "and",
                        filters: [{
                            logic: "or",
                            filters: [
                                {
                                    field: filedName,
                                    operator: operator,
                                    value: SearchText,
                                    ignoreCase: ignoreCase,
                                },
                            ],
                        }, {
                            field: "clientIntId",
                            operator: "eq",
                            value: parseInt(localStorage.getItem("UserClientIntId")),
                            ignoreCase: null,
                        }]

                    },
                ];
            }
            else {
                filterArray = [
                    {
                        logic: "or",
                        filters: [
                            {
                                field: filedName,
                                operator: operator,
                                value: SearchText,
                                ignoreCase: ignoreCase,
                            },
                        ],
                    },
                ];
            }
        }
        this.setState({ filteredArray: filterArray });

        return filterArray;
    }

    getOptionValues = () => {
        const option =
            this.props.page =="MyRequisitions"
                ? searchFieldsManageReq
                : this.props.page =="CandidateSubmission" || this.props.page =="PendingRequisitions" || this.props.page =="ReqPerformanceReport"
                    ? searchFieldsReq
                    : this.props.page =="CandidateWF"
                        ? candidateWF
                        : this.props.page =="TSAllProvider"
                            ? tsAllProvider
                            : this.props.page =="TSSingleProvider"
                                ? tsSingleProvider
                                : this.props.page =="TSSubmitted" || this.props.page=="TSUnderReview" || this.props.page =="ExpiringCredentialReport"
                                    ? TSSubmitted
                                    : this.props.page =="TimesheetReport"
                                        ? TSReport
                                        : this.props.entityType =="ClientActivityReport"
                                            ? clientActivityReport
                                            : this.props.page =="VendorInvoicing" || this.props.page =="VIUnderReview"
                                                ? VendorInvoice
                                                : this.props.page=="ClientStatementReport"
                                                    ? ClientStatementReport
                                                    : this.props.page =="VendorInvoicingDetails"
                                                        ? VendorInvoicingDetail
                                                        : this.props.page =="ManageCandidate"
                                                            ? ManageCandidate
                                                            : this.props.page =="ManageClient"
                                                                ? ManageClient
                                                                : this.props.page =="ManageDivision"
                                                                    ? ManageDivision
                                                                    : this.props.page =="ManageVendor"
                                                                        ? ManageVendor
                                                                        : this.props.page =="ManageVendorTiers"
                                                                            ? ManageVendorTiers
                                                                            : this.props.page =="ManageUser"
                                                                                ? ManageUser
                                                                                : this.props.page =="ClientInvoicing"
                                                                                    ? CBI
                                                                                    : this.props.page =="FilledAssignmentReport"
                                                                                        ? FilledAssignmentReport
                                                                                        : this.props.page =="VendorPerformance"
                                                                                            ? VendorPerformance
                                                                                            : this.props.page =="CandidateSubmittalReport"
                                                                                                ? candSubReport
                                                                                                : this.props.page =="ManageLocation"
                                                                                                    ? ManageLocation
                                                                                                    : this.props.page =="ManageGlobalJobCatalog"
                                                                                                        ? ManageGlobalJobCatalog
                                                                                                        : this.props.page =="ManageClientRateCard"
                                                                                                            ? ManageClientRateCard
                                                                                                            // :
                                                                                                            //     ? ManageInterviewCriteriaConfiguration
                                                                                                            : this.props.page =="ManageRequisitionApproverConfiguration" || this.props.page=="ManageTimesheetApproverConfiguration" || this.props.page =="ManageReleaseConfiguration" || this.props.page =="ManageOnBoardingConfiguration" || this.props.page =="ManageInterviewCriteriaConfiguration"
                                                                                                                ? ManageReleaseConfiguration
                                                                                                                : this.props.page =="ManageClientJobCatalog"
                                                                                                                    ? ManageClientJobCatalog
                                                                                                                    : this.props.page =="ManageRegion"
                                                                                                                        ? ManageRegion
                                                                                                                        : this.props.page =="ManageServiceType"
                                                                                                                            ? ManageServiceType
                                                                                                                            : this.props.page =="ManageRole"
                                                                                                                                ? Role
                                                                                                                                : this.props.page =="ManageNotifications"
                                                                                                                                    ? ManageNotifications
                                                                                                                                    : this.props.page =="ManageActionReason"
                                                                                                                                        ? ManageActionReason
                                                                                                                                        : this.props.page =="CandidateShareWF"
                                                                                                                                            ? CandidateShareWF
                                                                                                                                            :this.props.page =="SpendForecastReport"
                                                                                                                                                ? SpendForecastReport
                                                                                                                                                :this.props.page =="AssociateExpense"
                                                                                                                                                    ? AssociateExpense
                                                                                                                                                : this.props.page =="ManageCommunicationCenter"
                                                                                                                                                    ? ManageCommunicationCenter
                                                                                                                                                    : this.props.page =="ManageSupportTickets"
                                                                                                                                                        ? ManageSupportTickets
                                                                                                                                                        : this.props.page =="EventsLogs"
                                                                                                                                                            ? EventsLogs
                                                                                                                                                            : this.props.page =="ConfirmationAssignment"
                                                                                                                                                                    ? ConfirmationAssignment
                                                                                                                                                                    : this.props.page=="ManageContentLibrary" || this.props.page=="ViewContentLibrary"
                                                                                                                                                                        ? ManageContentLibrary
                                                                                                                                                                        : this.props.page =="FinancialAccrualReport"
                                                                                                                                                                            ? FinancialAccrualReport  
                                                                                                                                                                            : [];

        this.setState({ options: option }, () => {
            this.setState({
                optionValue: this.props.selectedOption ? this.props.selectedOption : "All",
                searchString: this.props.basicSearchValue ? this.props.basicSearchValue : ""
            }, () => {
                this.handleInputChange()
            });
        });
    };
    handleInputChange = (e?) => {
        this.setState({ searchString: e ? e.target.value : this.state.searchString }, () => this.searchFilterOperation());
        if (e) {
            this.props.inputedValue(e.target.value);
            setTimeout(() => {
                return this.state.searchString=="" && !this.props.advancedSearch ? this.props.onSearch() : null, 300;
            });
        }

    };
    OnOptionChange = (e) => {
        this.setState({ optionValue: e.target.value }, () => this.searchFilterOperation());
        this.props.optionChange(e.target.value);
    };
    render() {
        const { placeholder, onSearch, advancedSearch } = this.props;
        const { filteredArray } = this.state;
        return (
            <div
                className="input-group col pl-0 pr-sm-0 forSearchPopup"
                onBlur={() => (advancedSearch ? this.props.sendData(filteredArray, this.state.searchString, this.state.optionValue) : null)}>
                <div className="input-group-prepend" id="forSearchPoupWidth_scroll">
                    <DropDownList
                        style={{ height: "33.5px", width: "auto" }}
                        className="btn btn-sm buttonAll for-remove-shadow p-0 forSearchPoupWidth"
                        data={this.state.options}
                        onChange={(e) => this.OnOptionChange(e)}
                        value={this.state.optionValue}
                        popupSettings={{ width: "auto" }}
                    />
                </div>
                <input
                    type="search"
                    className="AdvacneBorderSearch AdvacneBorderSearch_new  AdvacneBorderSearch_borderright form-control placeholder-mobile searchText"
                    placeholder="Search text here!"
                    title={placeholder}
                    onChange={(e) => this.handleInputChange(e)}
                    onKeyPress={(event) => {
                        if (event.key =="Enter" && !this.props.advancedSearch) {
                            this.props.onSearch(this.state.optionValue, this.state.filteredArray, this.state.searchString);
                        }
                    }}
                    value={this.state.searchString}
                />
                {!this.props.advancedSearch ? (
                    <div className="input-group-append">
                        <button
                            className="btn-secondary Advancesearch-icon border-left-0 search-button-focus basicsearch-mobile"
                            type="button"
                            onClick={() => this.props.onSearch(this.state.optionValue, this.state.filteredArray, this.state.searchString)}
                        >
                            <FontAwesomeIcon icon={faSearch} className={"mr-2"} />
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default BasicSearch;
