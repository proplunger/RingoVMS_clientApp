import * as React from "react";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import axios from "axios";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { MyCommandCell, CustomHeaderActionCell } from "./HelperComponent";
import withValueField from "../../../Shared/withValueField";
import { CellRender, GridNoRecord, StatusCell } from "../../../Shared/GridComponents/CommonComponents";
import { IDropDownModel } from "../../../Shared/Models/IDropDownModel";
import { filterBy, State, toODataString } from "@progress/kendo-data-query";
import { currencyFormatter, errorToastr, getFormattedDate, warningToastr } from "../../../../HelperMethods";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { INLINE_BILL_ERROR_MSG, INLINE_EXTENSION_CONTRACT_WARNING_MSG, REMOVE_CONTRACT_CONFIRMATION_MSG } from "../../../Shared/AppMessages";
import { ErrorComponent, KendoFilter } from "../../../ReusableComponents";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { BillRateStatus, ExtensionStatuses, ServiceCategory } from "../../../Shared/AppConstants";
import _ from "lodash";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select...", id: null };

export interface ProviderContractsProps {
    candSubmissionId: string;
    canEdit?: boolean;
    clientId?: string;
    positionId?: string;
    locationId?: string;
    divisionId?: string;
}

export interface ProviderContractsState {
    contract: any;
    totalContract?: number;
    gridBillRate?: any;
    gridHolidayBillRate?: any;
    actualBillRate?: number;
    actualHolidayRate?: number;
    serviceCatId?: any;
    serviceTypeId?: any;
    rateCardId?: any;
    dataState: any;
    serviceCategory: Array<IDropDownModel>;
    originalserviceCategory: Array<IDropDownModel>;
    serviceTypes: Array<IDropDownModel>;
    originalserviceTypes: Array<IDropDownModel>;
    date?: Date;
    showRemoveConfirmationModal?: boolean;
    showLoader?: boolean;
}

const initialDataState = {
    skip: 0,
    take: 50,
};

class ProviderContracts extends React.Component<ProviderContractsProps, ProviderContractsState> {
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    public dataItem: any;
    editField = "inEdit";
    public isSubmit = false;
    private originalLevels = [];
    candSubExtId: string;
    constructor(props: ProviderContractsProps) {
        super(props);
        this.state = {
            contract: [],
            serviceCategory: [],
            originalserviceCategory: [],
            serviceTypes: [],
            originalserviceTypes: [],
            date: getFormattedDate(),
            dataState: initialDataState,
            showLoader: true
        };
        this.initializeHeaderCell();
        this.initializeActionCell();
    }

    componentDidMount() {
        if (this.props.candSubmissionId) {
            this.getExtensions(this.props.candSubmissionId);
        } else {
            this.setState({ showLoader: false });
        }
    }

    initializeActionCell = () => {
        this.CommandCell = MyCommandCell({
            edit: this.enterEdit,
            remove: (dataItem) => this.setState({ showRemoveConfirmationModal: true }, () => this.dataItem = dataItem),
            add: this.add,
            discard: this.discard,
            update: this.update,
            cancel: this.cancel,
            editField: this.editField
        });
    };

    initializeHeaderCell = () => {
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
            add: this.addNew
        });
    };

    getExtensions = (candSubmissionId) => {
        let queryStr = `$filter=status eq '${ExtensionStatuses.APPROVED}'`;
        this.setState({ showLoader: true });
        axios.get(`api/candidates/${candSubmissionId}/assignmentextensions?${queryStr}`)
            .then((res) => {
                if(res.data.length > 0){
                    this.candSubExtId = res.data[0].candSubExtId !=null && res.data[0].candSubExtId;
                }
                this.getBillRates(this.state.dataState, this.candSubExtId);
            });
    };

    getBillRates = (dataState, candSubExtId?) => {
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var queryParams = `candSubId eq ${this.props.candSubmissionId} and status eq '${BillRateStatus.APPROVED}' and candSubExtId eq null`;

        if (candSubExtId) {
            queryParams = `candSubId eq ${this.props.candSubmissionId} and status eq '${BillRateStatus.APPROVED}' and candSubExtId eq ${candSubExtId}`;
        }

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        this.setState({ showLoader: true });
        axios.get(`api/candidates/billrate?${finalQueryString}`).then((res) => {
            console.log("res.data", res.data);
            this.setState({
                contract: res.data.filter((i) => new Date(i.endDate) >= this.state.date),
                showLoader: false,
                dataState: dataState,
            });
            this.getBillRatesCount(dataState, candSubExtId);
            this.originalLevels = res.data;
        });
    };

    getBillRatesCount = (dataState, candSubExtId?) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };

        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        var queryParams = `candSubId eq ${this.props.candSubmissionId} and status eq '${BillRateStatus.APPROVED}' and candSubExtId eq null`;

        if (candSubExtId) {
            queryParams = `candSubId eq ${this.props.candSubmissionId} and status eq '${BillRateStatus.APPROVED}' and candSubExtId eq ${candSubExtId}`;
        }

        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);

        axios.get(`api/candidates/billrate?${finalQueryString}`).then((res) => {
            this.setState({
                totalContract: res.data.filter((i) => new Date(i.endDate) >= this.state.date).length
            });
        });
    };

    getServiceCategories = () => {
        axios.get(`api/candidates/servicecat`).then((res) => {
            this.setState({ serviceCategory: res.data, originalserviceCategory: res.data });
        });
    }

    getServiceTypes = (id, clientId, divisionId, locationId, positionId) => {
        if (id != null) {
            axios.get(`api/candidates/servicetype?serviceCatId=${id}&clientId=${clientId}&divisionId=${divisionId}&locationId=${locationId}&positionId=${positionId}`).then((res) => {
                this.setState({ serviceTypes: res.data, originalserviceTypes: res.data });
            })
        } else {
            this.setState({ serviceTypes: [], originalserviceTypes: [] });
        }
    }

    generateId = data => data.reduce((acc, current) => Math.max(acc, current.intId), 0) + 1;

    checkDuplicate = (serviceType) => {
        let serviceTypeExists = this.state.contract.filter(i => i.serviceType==serviceType)
        if (serviceTypeExists.length > 1) {
            return false;
        }
        else {
            return true;
        }
    }

    addNew = () => {
        let hasUnsavedData = this.state.contract.filter(i => i.inEdit==true).length > 0;
        let hasError = hasUnsavedData ? true : false;
        if (hasError) {
            warningToastr(INLINE_EXTENSION_CONTRACT_WARNING_MSG);
            return false;
        }
        this.getServiceCategories();

        this.isSubmit = false;
        const newDataItem = { inEdit: true, intId: this.generateId(this.state.contract), serviceCatId: this.state.serviceCatId, serviceTypeId: this.state.serviceTypeId, gridBillRate: this.state.gridBillRate, gridHolidayBillRate: this.state.gridHolidayBillRate, rateCardId: this.state.rateCardId, status: BillRateStatus.PENDINGAPPROVAL, statusIntId: 20 };

        { this.setState({ serviceCategory: this.state.originalserviceCategory }) }
        this.setState({
            contract: [newDataItem, ...this.state.contract]
        });
    };

    add = dataItem => {
        this.isSubmit = true;
        if (this.checkDuplicate(dataItem.serviceType)) {
            if (dataItem.serviceCategory==ServiceCategory.EXPENSE ? dataItem.serviceCategory && dataItem.serviceType && dataItem.gridBillRate > 0 : dataItem.serviceCategory && dataItem.serviceType && dataItem.gridBillRate > 0 && dataItem.gridHolidayBillRate > 0) {
                dataItem.inEdit = undefined;
                dataItem.intId = this.generateId
                    (this.originalLevels);

                this.originalLevels.unshift(dataItem);
                this.setState({
                    contract: [...this.state.contract],
                    serviceTypes: [],
                    originalserviceTypes: []
                });
            }
        }
        else {
            errorToastr(INLINE_BILL_ERROR_MSG);
        }
    };

    enterEdit = (dataItem) => {
        if(dataItem.subBillRateId==null || dataItem.subBillRateId==undefined){
            this.getServiceTypes(dataItem.serviceCatId, this.props.clientId, this.props.divisionId, this.props.locationId, this.props.positionId)
        }
        dataItem.gridHolidayBillRate = dataItem.serviceCategory==ServiceCategory.EXPENSE ?  0 : dataItem.gridHolidayBillRate;
        let hasUnsavedData = this.state.contract.filter(i => i.inEdit==true).length > 0;
        let hasError = hasUnsavedData ? true : false;
        if (hasError) {
            warningToastr(INLINE_EXTENSION_CONTRACT_WARNING_MSG);
            return false;
        }
        this.isSubmit = false;
        this.setState({
            contract: this.state.contract.map(item => item.intId ==dataItem.intId ? { ...item, inEdit: true } : item),
            actualBillRate: dataItem.gridBillRate,
            actualHolidayRate: dataItem.gridHolidayBillRate
        });
    }

    update = (dataItem) => {
        this.isSubmit = true;
        if (this.checkDuplicate(dataItem.serviceType)) {
            if (dataItem.serviceCategory==ServiceCategory.EXPENSE ? dataItem.serviceCategory && dataItem.serviceType && dataItem.gridBillRate > 0 : dataItem.serviceCategory && dataItem.serviceType && dataItem.gridBillRate > 0 && dataItem.gridHolidayBillRate > 0) {
                
                if (dataItem.gridBillRate !=this.state.actualBillRate) {
                    dataItem.status = BillRateStatus.PENDINGAPPROVAL;
                    dataItem.statusIntId = 20;
                } else if (dataItem.gridHolidayBillRate !=this.state.actualHolidayRate) {
                    dataItem.status = BillRateStatus.PENDINGAPPROVAL;
                    dataItem.statusIntId = 20;
                }
                
                const data = [...this.state.contract];
                const updatedItem = { ...dataItem, inEdit: undefined };

                this.updateItem(data, updatedItem);

                this.setState({ contract: data });
            }
        }
        else {
            errorToastr(INLINE_BILL_ERROR_MSG);
        }
    }

    updateItem = (data, item) => {
        let index = data.findIndex(p => p ==item || (item.subBillRateId && p.subBillRateId ==item.subBillRateId));
        if (index >= 0) {
            data[index] = { ...item };
        }
    }

    remove = (dataItem) => {
        const data = [...this.state.contract];
        this.removeItem(data, dataItem);
        this.setState({ contract: data, showRemoveConfirmationModal: false });
    }

    removeItem(data, item) {
        let index = data.findIndex(p => p ==item || (item.id && p.id ==item.id));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    cancel = (dataItem) => {
        const originalItem = this.originalLevels.find((p) => p.subBillRateId ==dataItem.subBillRateId);
        originalItem["inEdit"] = undefined;
        const data = this.state.contract.map((item) => item.subBillRateId ==originalItem.subBillRateId ? originalItem : item);
        this.setState({ contract: data });
    }

    discard = dataItem => {
        const data = [...this.state.contract];
        this.removeItem(data, dataItem);

        this.setState({ contract: data });
    };

    onDataStateChange = (changeEvent) => {
        if (this.props.candSubmissionId) {
            this.getBillRates(changeEvent.data);
        }
    };

    updateState = (value, props) => {
        const data = this.state.contract.map((item) =>
            item.intId ==props.dataItem.intId
                ? { ...item, [props.field]: value }
                : item
        );
        this.setState({ contract: data });
    };

    itemChange = (event) => {
        const data = this.state.contract.map(item =>
            item.intId ==event.dataItem.intId ?
                { ...item, [event.field]: event.value } : item
        );

        this.setState({ contract: data });
    }

    handleFilterChange = (event) => {
        var name = event.target.props.id;
        var originalArray = "original" + name;
        this.state[name] = this.filterData(event.filter, originalArray);
        this.setState(this.state);
    }

    filterData(filter, originalArray) {
        const data1 = this.state[originalArray];
        return filterBy(data1, filter);
    }

    ServiceCategoryCell = (props) => {
        return (
            <>
                {!props.dataItem.inEdit || props.dataItem.subBillRateId != undefined
                    ? (
                        <td contextMenu="Service Category">
                            {props.dataItem.serviceCategory != undefined && props.dataItem.serviceCategory}
                        </td>
                    ) :
                    (<td contextMenu="Service Category" className="myOrderContainer-dropdownList">

                        <CustomDropDownList
                            className={"form-control"}
                            data={this.state.serviceCategory}
                            name="serviceCategory"
                            textField="name"
                            id="serviceCategory"
                            valueField="id"
                            defaultItem={defaultItem}
                            value={(props.dataItem.serviceCatId)}
                            onChange={(e) => {
                                props.dataItem.serviceCatId = e.value.id;
                                props.dataItem.serviceCategory = e.value.name;
                                props.dataItem.serviceTypeId = null;
                                props.dataItem.rateCardId = null;
                                props.dataItem.billType = "-";
                                props.dataItem.gridBillRate = 0;
                                props.dataItem.gridHolidayBillRate = 0;
                                this.setState({ contract: this.state.contract })
                                this.getServiceTypes(e.value.id, this.props.clientId, this.props.divisionId, this.props.locationId, this.props.positionId)
                            }}
                            filterable={this.state.originalserviceCategory.length > 5 ? true : false}
                            onFilterChange={this.handleFilterChange}
                        />
                    </td>
                    )
                }
            </>
        );
    }

    ServiceTypeCell = (props) => {
        return (
            <>
                {!props.dataItem.inEdit || props.dataItem.subBillRateId != undefined
                    ? (
                        <td contextMenu="Service Type">
                            {props.dataItem.serviceType != undefined && props.dataItem.serviceType}
                        </td>
                    ) :
                    (<td contextMenu="Service Type" className="myOrderContainer-dropdownList">

                        <CustomDropDownList
                            className={"form-control"}
                            data={this.state.serviceTypes}
                            name="serviceType"
                            textField="name"
                            id="serviceTypes"
                            valueField="id"
                            defaultItem={defaultItem}
                            value={(props.dataItem.serviceTypeId)}
                            onChange={(e) => {
                                props.dataItem.serviceType = e.value.name;
                                props.dataItem.serviceTypeId = e.value.id;
                                props.dataItem.rateCardId = e.value.rateCardId;
                                props.dataItem.billType = e.value.billType;
                                props.dataItem.gridBillRate = 0;
                                props.dataItem.gridHolidayBillRate = 0;
                                this.setState({ contract: this.state.contract })
                            }}
                            filterable={this.state.originalserviceTypes.length > 5 ? true : false}
                            onFilterChange={this.handleFilterChange}
                        />
                    </td>
                    )
                }
            </>
        );
    }

    BillRateField = (props) => {
        const { dataItem, field } = props;
        return (
            <td contextMenu="Bill Rate" className="text-right pr-4">
                {dataItem.inEdit ? (
                    <div className="input-desciption">
                        <NumericTextBox
                            className="form-control"
                            placeholder="Enter Bill Rate"
                            value={isNaN(dataItem[field]) ? 0 : dataItem[field]}
                            format="c2"
                            min={0}
                            max={99999}
                            name="billRate"
                            onChange={(event) => this.updateState(event.target.value, props)}
                        />
                        {this.isSubmit && props.dataItem.gridBillRate <= 0 && <ErrorComponent message="Bill Rate should be greater than 0" />}
                    </div>
                ) : (
                    <span
                        title={dataItem[field]}
                    >
                        {currencyFormatter(dataItem[field])}
                    </span>
                )}
            </td>
        );
    };

    HolidayRateField = (props) => {
        const { dataItem, field } = props;
        return (
            <td contextMenu="Holiday Rate" className="text-right pr-4">
                {dataItem.inEdit ? (
                    <div className="input-desciption">
                        <NumericTextBox
                            disabled={dataItem.serviceCategory==ServiceCategory.EXPENSE ? true : false}
                            className="form-control"
                            placeholder="Enter Holiday Bill Rate"
                            value={isNaN(dataItem[field]) ? 0 : dataItem[field]}
                            format="c2"
                            min={0}
                            max={99999}
                            name="holidayBillRate"
                            onChange={(event) => this.updateState(event.target.value, props)}
                        />
                        {this.isSubmit && dataItem.serviceCategory==ServiceCategory.TIME && props.dataItem.gridHolidayBillRate <= 0 && <ErrorComponent message="Holiday Rate should be greater than 0" />}
                    </div>
                ) : (
                    <span
                        title={dataItem[field]}
                    >
                        {currencyFormatter(dataItem[field])}
                    </span>
                )}
            </td>
        );
    };

    getContractData() {
        let hasDuplicateRecords = false;
        let hasUnsavedData = this.state.contract.filter(i => i.inEdit==true).length > 0;
        let duplicateContracts = this.state.contract.map(x => x.serviceTypeId);
        let duplicateContractsCount = duplicateContracts.length;
        let uniqueContractsCount = _.uniq(duplicateContracts).length;
        let hasTimeData = this.state.contract.filter(i => i.serviceCategory==ServiceCategory.TIME).length <= 0;

        if(duplicateContractsCount !=uniqueContractsCount){
            hasDuplicateRecords = true;
        }
        
        return ({ data: this.state.contract, hasError: hasUnsavedData ? true : false, hasDuplicateRecords, hasNoTimeCategoryData: hasTimeData ? true : false });
    }

    render() {
        const { canEdit } = this.props;
        return (
            <>
                <div className="">
                    <div className="row mt-2">
                        <div className="col-12" id="nameyoursearch">
                            <div className="createjoborderstep4-a" id="createjoborderstep">
                                <div className="table-responsive tableShadow myOrderContainer-dropdownList">
                                    <Grid
                                        className="kendo-grid-custom lastchild global-action-grid-lastchild"
                                        style={{ height: 'auto' }}
                                        sortable={false}
                                        onDataStateChange={this.onDataStateChange}
                                        onItemChange={this.itemChange}
                                        editField="inEdit"
                                        selectedField="selected"
                                        data={this.state.contract}
                                        {...this.state.dataState}
                                        total={this.state.totalContract}
                                        filterable={false}
                                        columnMenu={false}
                                    >
                                        <GridNoRecords>{GridNoRecord(this.state.showLoader, true)}</GridNoRecords>

                                        <GridColumn
                                            field="serviceCategory"
                                            title="Service Category"
                                            className="myOrderContainer-K-textbox"
                                            cell={this.ServiceCategoryCell}
                                        />
                                        <GridColumn
                                            field="serviceType"
                                            title="Service Type"
                                            className="myOrderContainer-K-textbox"
                                            cell={this.ServiceTypeCell}
                                        />
                                        <GridColumn
                                            field="billType"
                                            title="Bill Type"
                                            className="myOrderContainer-K-textbox"
                                            cell={(props) => CellRender(props, "Bill Type")}
                                        />
                                        <GridColumn
                                            field="gridBillRate"
                                            title="Bill Rate"
                                            headerClassName="text-right pr-4"
                                            className="myOrderContainer-K-textbox"
                                            cell={this.BillRateField}
                                        />
                                        <GridColumn
                                            field="gridHolidayBillRate"
                                            title="Holiday Rate"
                                            headerClassName="text-right pr-4"
                                            className="myOrderContainer-K-textbox"
                                            cell={this.HolidayRateField}
                                        />
                                        <GridColumn
                                            field="status"
                                            title="Status"
                                            cell={StatusCell}
                                        />
                                        <GridColumn
                                            sortable={false}
                                            cell={this.CommandCell}
                                            width="110px"
                                            headerCell={this.CustomHeaderActionCellTemplate}
                                        />
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ConfirmationModal
                        message={REMOVE_CONTRACT_CONFIRMATION_MSG()}
                        showModal={this.state.showRemoveConfirmationModal}
                        handleYes={() => this.remove(this.dataItem)}
                        handleNo={() => {
                            this.setState({ showRemoveConfirmationModal: false });
                        }}
                    />
                </div>
            </>
        );
    }
}

export default ProviderContracts;