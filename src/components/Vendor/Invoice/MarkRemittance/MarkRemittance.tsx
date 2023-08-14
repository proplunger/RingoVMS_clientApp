import {
    faCheckCircle,
    faDollarSign,
    faFileInvoiceDollar, faHistory, faTimes, faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord, MenuRender } from "../../../Shared/GridComponents/CommonComponents";
import { currencyFormatter, dateFormatter, datetimeFormatter, errorToastr, localDateTime, successToastr } from "../../../../HelperMethods";
import ColumnMenu from "../../../Shared/GridComponents/ColumnMenu";
import { RemittanceExcelExport, VendorInvoiceNumberCell } from "../Manage/GlobalActions";
import { NumericTextBox } from "@progress/kendo-react-inputs/dist/npm/numerictextbox/NumericTextBox";
import { cancelScheduledPayment, getVendorInvoicesService, getVendorRemittanceService, patchVendorPaymentStatus } from "../../VendorService/Services";
import { ErrorComponent, ErrorComponentNoDecimal, KendoFilter, convertShiftDateTime } from "../../../ReusableComponents";
import { State, toODataString } from "@progress/kendo-data-query";
import { AuthRoleType, isRoleType, PaymentStatus, VendorInvoiceStatusIds } from "../../../Shared/AppConstants";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { DELETE_SCHEDULE_PAYMENT_CONFIRMATION_MSG, PAYMENT_RESCHEDULED_SUCCESSFULLY, RESCHEDULE_PAYMENT_CONFIRMATION_MSG, SCHEDULED_PAYMENT_CANCELLED, SCHEDULED_PAYMENT_REMITTED, VENDOR_INVOICE_PAYMENT_CONFIRMATION_MSG } from "../../../Shared/AppMessages";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import ConfirmationModal from "../../../Shared/ConfirmationModal";
import { AppPermissions } from "../../../Shared/Constants/AppPermissions";
import auth from "../../../Auth";
import { Checkbox } from "@progress/kendo-react-inputs";
import { postVendorRemittance } from "../../../Clients/ClientInvoice/CBIServices/CBIServices";

export interface MarkRemittanceProps {
    handleClose?: any;
    title?: any;
    clientData?: any;
    dataItem?: any;
    handleYes?: any;
    clientId?: any;
    clientInvoiceId?: any;
    handlePaymentHistory?: any;
    handleGlobalPaymentHistory?: any;
    getVendorInvoicesGrid?: any;
}

export interface MarkRemittanceState {
    dataArray?: any;
    showLoader?: boolean;
    dataState?: any;
    totalCount?: number;
    totalInvoiceData?: any;
    errors?: any;
    totalRemittance?: any;
    totalBalance?: any;
    paymentData?: any;
    data?: any;
    showError?: any;
    markRemittanceGlobalConfirmationModal?: any;
    ifAllSelected?: boolean;
    originalArray?: any;
    totalBalanceError?: any;
    errorMessage?: any;
    paymentDate?: any;
    showConfirmationModal: boolean;
    jobViPayHistId: any;
    showCancelPaymentModal: boolean;
    showPayDateChangeModal: boolean;
}

const initialDataState = {
    skip: 0,
    take: null,
};

export default class PaymentHistory extends React.Component<
    MarkRemittanceProps,
    MarkRemittanceState
> {
    private userClientLobId: any = localStorage.getItem("UserClientLobId");
    public dataItem : any;
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            dataArray: [],
            errors: [],
            originalArray: [],
            dataState: initialDataState,
            ifAllSelected: true,
            totalBalance: 0,
            totalRemittance: 0,
            showConfirmationModal: false,
            jobViPayHistId: null,
            showCancelPaymentModal: false,
            showPayDateChangeModal: false
        };
    }

    componentDidMount() {
        // this.getPaymentHistory()        
        this.getVendorInvoices(this.state.dataState);

    }

    getVendorInvoices = (dataState) => {
        this.setState({ showLoader: true });
        var queryStr = `${toODataString(dataState, { utcDates: true })}`;
        var queryParams = this.vendorInvoiceQuery();
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        getVendorRemittanceService(finalQueryString).then((res) => {
            var data = [];
          if (this.props.dataItem){
            data = res.data.filter(x => x.vendorInvoiceId==this.props.dataItem.vendorInvoiceId);
          }else{
            data = res.data.filter(x => x.statusIntId != VendorInvoiceStatusIds.PAIDINFULLREMITTANCE);
          }
          this.setState({
            dataArray: data,
            showLoader: false,
            originalArray: res.data,
            dataState: dataState,
            totalCount: res.data.length,
          }, () => {
            this.headerSelectionChange();
          })
        });
      };

    private vendorInvoiceQuery(): string {
        const { clientId, clientInvoiceId } = this.props;
    
        var queryParams = `clientId eq ${clientId}`;
        if (clientInvoiceId) {
          queryParams =
            queryParams + ` and clientInvoiceId eq ${this.props.clientInvoiceId}`;
        }
        
        return queryParams;
    }

    getVendorInvoicesCount = (dataState) => {
        var finalState: State = {
          ...dataState,
          take: null,
          skip: 0,
        };
    
        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        var queryParams = this.vendorInvoiceQuery();
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        getVendorInvoicesService(finalQueryString).then((res) => {
          this.setState({
            totalCount: res.data.length,
            totalInvoiceData: res.data
          });
        });
      };

    onDataStateChange = (changeEvent) => {
        this.setState({ dataState: changeEvent.data });
        this.getVendorInvoices(changeEvent.data);
    };

    updateState = (value, props) => {
        if (props.field=='payDate'){
            value = localDateTime(value);
        }
        const data = this.state.dataArray.map((item) =>
        item.vendorInvoiceId ==props.dataItem.vendorInvoiceId &&
        item.jobViPayHistId ==props.dataItem.jobViPayHistId
            ? { ...item, [props.field]: value }
            : item
        );
        // this.state.dataArray[props.dataIndex - 1][props.field] = amount
        this.setState({ dataArray: data }, () => {
            if (props.field=='balanceAmount'){
                this.updateAmount('balanceAmount', 'totalBalance');
            }
            if (props.field=='payDate' && props.dataItem.paymentStatus==PaymentStatus.SCHEDULED){
                this.setState({ showPayDateChangeModal: true });
                this.dataItem = this.state.dataArray.filter(x => x.jobViPayHistId==props.dataItem.jobViPayHistId)[0];
            }
        });

    };

    markRemittanceValidation = () => {
        var is_valid = true;
        var totalBalance = 0;
        var totalRemittedAmount : any = 0;

        if(!this.props.dataItem){
            const data = this.state.dataArray.filter(x => x.selected==true);
        
            if (data.length ==0){
                errorToastr('Select atleast one vendor invoice')
                return false;
            }
        }

        this.state.dataArray.map(x => {
            if(x.selected && x.balanceAmount <= 0){
                is_valid = false;
                return false;
            }
        });

        if(!is_valid){
            this.setState({ showError: true, errorMessage: "The balance Amount should be greater than 0!"});
            return false;
        }

        this.state.originalArray.filter(x => x.jobViPayHistId==null).map(x => {
            totalRemittedAmount += x.receivedAmount !=null ? x.receivedAmount : 0;
        })

        if(this.props.dataItem){
            let scheduledAmount = this.state.dataArray.filter(x => x.jobViPayHistId !=null)
                .reduce((acc, current) => acc + current['balanceAmount'], 0);

            this.state.dataArray.filter(x => x.jobViPayHistId==null).map(x => {
                if(x.remittanceAmount < (x.receivedAmount + x.balanceAmount + scheduledAmount).toFixed(2)){
                    is_valid = false;
                }

                totalBalance += x.balanceAmount;
            })

        }else{

            this.state.dataArray.filter(x => x.jobViPayHistId==null).map(x => {
                if(x.selected) {
                    let scheduledAmount = this.state.dataArray.filter(y => y.vendorInvoiceId==x.vendorInvoiceId && y.jobViPayHistId !=null)
                        .reduce((acc, current) => acc + current['balanceAmount'], 0);
                    if(x.remittanceAmount < (x.receivedAmount + x.balanceAmount + scheduledAmount).toFixed(2)){
                        is_valid = false;
                    }
    
                    totalBalance += x.balanceAmount;
                }
            })
        }

        var balanceLeft = this.props.clientData.received - totalRemittedAmount.toFixed(2);

        if (parseFloat(totalBalance.toFixed(2)) > parseFloat(balanceLeft.toFixed(2))){
            is_valid = false
            this.setState({ showError: true, errorMessage: `* The balance amount cannot be greater than ${currencyFormatter(balanceLeft)}` });
        }
        return is_valid
    }

    submitMarkRemittance = () => {
        var valid = this.markRemittanceValidation()
        if(valid){
            var data = [];
            if(this.props.dataItem){
                data = this.state.dataArray.filter(x => x.jobViPayHistId==null)
            }else{
                data = this.state.dataArray.filter(x => x.selected==true && x.jobViPayHistId==null)
            }
            this.props.handleYes(data)
        }
    }

    makeHistoryIcon = (props) => {
        return (
            this.props.handlePaymentHistory ? 
                <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={this.props.handlePaymentHistory}>
                    <FontAwesomeIcon icon={faHistory} className={"nonactive-icon-color ml-2 mr-2"} />
                    Remittance History
                </div>
            : <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => this.props.handleGlobalPaymentHistory(props)}>
                <FontAwesomeIcon icon={faHistory} className={"nonactive-icon-color ml-2 mr-2"} />
                Remittance History
                </div>
            
        );
    }

    paymentStatusPaid = (props) => {
        return (
            auth.hasPermissionV2(AppPermissions.REMIT_SCHEDULED_PAYMENT) ?
                <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => { 
                    this.setState({ showConfirmationModal: true})
                    this.dataItem = props.dataItem;
                    }}>
                    <FontAwesomeIcon icon={faDollarSign} className={"nonactive-icon-color ml-2 mr-2"} />
                    Mark as Paid
                </div>
            : null
        );
    }

    cancelSchedulePayment = (props) => {
        return (
            auth.hasPermissionV2(AppPermissions.REMIT_SCHEDULED_PAYMENT) ?
                <div className="pb-1 pt-1 w-100  myorderGlobalicons" onClick={() => { 
                    this.setState({ showCancelPaymentModal: true})
                    this.dataItem = props.dataItem;
                    }}>
                    <FontAwesomeIcon icon={faTimes} className={"nonactive-icon-color ml-2 mr-2"} />
                    Cancel
                </div>
            : null
            
        );
    }

    menuRender = (props) => {
        return <span className="k-icon k-i-more-horizontal active-icon-blue"></span>;
    };

    numericInputField = (props) => {
        var balanceLeft = props.dataItem.remittanceAmount - props.dataItem.receivedAmount;
        let balanceAmount = this.state.dataArray.filter(x => x.vendorInvoiceId==props.dataItem.vendorInvoiceId && x.jobViPayHistId !=null)
                            .reduce((acc, current) => acc + current['balanceAmount'], 0);
            balanceLeft = balanceLeft - balanceAmount;
        return (
            <td
            contextMenu={"Balance Amount"}
            className="text-right pr-4"
            key={`${props.dataItem.vendorInvoiceNumber}-${props.dataItem.jobViPayHistId}`}
            style={{ textAlign: "right" }}
            >
                <NumericTextBox
                    format="c2"
                    min={0}
                    key={`input-${props.dataItem.vendorInvoiceNumber}-${props.dataItem.jobViPayHistId}`}
                    max={10000000000000}
                    name="amount"
                    className="form-control disabled"
                    value={props.dataItem.balanceAmount}
                    onChange={(e) => {
                            this.updateState(e.target.value, props);
                            this.setState({ showError: false });
                        }
                    }
                    disabled={props.dataItem.paymentStatus==PaymentStatus.PENDING ? false : true}
                />
                {props.dataItem.paymentStatus==PaymentStatus.PENDING ? 
                    props.dataItem.balanceAmount <= 0 && <ErrorComponentNoDecimal message={`Amount cannot be 0`}/>
                : null}

                {props.dataItem.paymentStatus==PaymentStatus.PENDING ? 
                    (props.dataItem.balanceAmount + props.dataItem.receivedAmount + balanceAmount).toFixed(2) > props.dataItem.remittanceAmount && <ErrorComponentNoDecimal message={`Cannot be greater than ${currencyFormatter(balanceLeft)}`}/>
                : null}
            </td>
        );
    }

    selectionChange = (event) => {
        const data = this.state.dataArray.map(item=>{
            if(item.vendorInvoiceId ==event.dataItem.vendorInvoiceId &&
                item.jobViPayHistId==event.dataItem.jobViPayHistId){
                item.selected = !event.dataItem.selected;
            }
            return item;
        });
        this.updateAmount('remittanceAmount', 'totalRemittance');
        this.updateAmount('balanceAmount', 'totalBalance');
        this.setState({ dataArray: data });
        // let isDefaultSelected = this.state.reqReason.filter((x) => x.selected && x.isDefault==true).length > 0;
    }

    headerSelectionChange = (event?) => {
        var checked = this.props.dataItem ? false : true;
        if (event){
            checked = event.syntheticEvent.target.checked;
        }

        const data = this.state.dataArray.map(item => {
            //if (item.paymentStatus==PaymentStatus.PENDING){
                item.selected = checked;
            //}
            return item;
        });

        this.updateAmount('remittanceAmount', 'totalRemittance');
        this.updateAmount('balanceAmount', 'totalBalance');

        this.setState({ dataArray: data });
        // this.state.dataState.reqReason = data
        // let isDefaultSelected = this.state.reqReason.filter((x) => x.selected && x.isDefault==true).length > 0;
    }

    inputField = (props) => {
        return (
            props.field=="comments" ? 
                <td
                contextMenu={"Notes"}
                key={`${props.dataItem.vendorInvoiceNumber}-${props.dataItem.jobViPayHistId}`}
                className="pr-4"
                >
                    <textarea
                        name="comments"
                        style={{ "resize": "none", "fontSize": "13px"}}
                        maxLength={1000}
                        placeholder="Enter Notes .."
                        className="form-control"
                        value={props.dataItem.comments !=null ? props.dataItem.comments : ""}
                        rows={1}
                        onChange={(e) => this.updateState(e.target.value, props)}
                        //disabled={props.dataItem.paymentStatus==PaymentStatus.PENDING ? false : true}
                    />
                    
                </td>
            :
            
            <td
                contextMenu={"Dates"}
                key={props.dataItem.payDate}
                className="pr-4 cal-icon-color"
                >
                <DatePicker
                    className="form-control"
                    format="MM/dd/yyyy"
                    name="payDate"
                    value={props.dataItem.payDate !=null ? new Date(props.dataItem.payDate) :new Date()}
                    onChange={(e) => this.updateState(e.target.value, props)}
                    formatPlaceholder="formatPattern"
                    //disabled={props.dataItem.paymentStatus==PaymentStatus.PENDING ? false : true}
                />
            </td>
        );
    }

    updateAmount = (column, field) => {
        let data = this.state.dataArray;

        if (this.state.dataArray.filter(x => x.selected==true).length > 0){
            data = this.state.dataArray.filter(x => x.selected==true);
        }

        if (column=='remittanceAmount'){
            data = data.filter((obj, index, self) =>
            index ==self.findIndex((t) => t.vendorInvoiceId ==obj.vendorInvoiceId)
          );
        }
        var amountTotal = data.reduce((acc, current) =>
            acc + current[column], 0);
        
        var change = {}
        change[field] = amountTotal
        this.setState(change)
    }

    markAsPaidValidation = () => {
        var is_valid = true;
        var totalBalance = 0;
        var totalRemittedAmount : any = 0;

        this.state.dataArray.filter(x => x.jobViPayHistId==this.dataItem.jobViPayHistId).map(x => {
            if(x.balanceAmount <= 0){
                is_valid = false;
                return false;
            }
        });

        if(!is_valid){
            this.setState({ showError: true, errorMessage: "The balance Amount should be greater than 0!"});
            return false;
        }

        this.state.originalArray.filter(x => x.jobViPayHistId==null).map(x => {
            totalRemittedAmount += x.receivedAmount !=null ? x.receivedAmount : 0;
        })

        this.state.dataArray.filter(x => x.jobViPayHistId==this.dataItem.jobViPayHistId).map(x => {
            if(x.remittanceAmount < (x.receivedAmount + x.balanceAmount).toFixed(2)){
                is_valid = false;
            }

            totalBalance += x.balanceAmount;
        })

        var balanceLeft = this.props.clientData.received - totalRemittedAmount.toFixed(2);

        if (parseFloat(totalBalance.toFixed(2)) > parseFloat(balanceLeft.toFixed(2))){
            is_valid = false
            this.setState({ showError: true, errorMessage: `* The balance amount cannot be greater than ${currencyFormatter(balanceLeft)}` });
        }
        return is_valid
    }

    updatePaymentStatus = () => {
        
        if (this.state.showConfirmationModal && this.dataItem){
            var valid = this.markAsPaidValidation()
            if(valid){

                let dataArray = this.state.dataArray.filter(x => x.jobViPayHistId==this.dataItem.jobViPayHistId);
                //dataArray = [{...dataArray, payDate: localDateTime(new Date()), comments: this.dataItem.comments}]
                dataArray = dataArray.map(x => {
                    
                    x.payDate = localDateTime(new Date());
                    x.comments = this.dataItem.comments;
                    return x;
                })

                var data = {
                    clientInvoiceId: this.props.clientInvoiceId,
                    clientLobId: this.userClientLobId,
                }
                    
                var postData = []
                for(var i=0; i < dataArray.length ; i++){
                    const vendorsList = {
                    ...dataArray[i]
                    };
                    postData.push(vendorsList)
                }
                data['vendorList'] = postData
            
                postVendorRemittance(data).then((res) => {
                    successToastr(SCHEDULED_PAYMENT_REMITTED);
                    this.setState({ showConfirmationModal: false, showLoader: true })

                    this.getVendorInvoices(this.state.dataState);

                    if (this.props.getVendorInvoicesGrid){
                        this.props.getVendorInvoicesGrid();
                    }

                    if(this.props.dataItem){
                        this.props.handleClose();
                    }
                })
            }
                
        }else if (this.state.showCancelPaymentModal && this.dataItem){
            cancelScheduledPayment(this.dataItem.jobViPayHistId)
            .then(() => {
                successToastr(SCHEDULED_PAYMENT_CANCELLED);
                this.setState({ showCancelPaymentModal: false, showLoader: true  })

                this.getVendorInvoices(this.state.dataState);

                if (this.props.getVendorInvoicesGrid){
                    this.props.getVendorInvoicesGrid();
                }
                
                if(this.props.dataItem){
                    this.props.handleClose();
                }
            });
        }
        this.setState({ showCancelPaymentModal: false, showConfirmationModal: false });

        this.dataItem = null;
        
    }

    updateScheduleDate = () => {
        const data = {
            jobViPayHistId : this.dataItem.jobViPayHistId,
            payDate : this.dataItem.payDate
        }

        patchVendorPaymentStatus(data)
        .then(() => {
            successToastr(PAYMENT_RESCHEDULED_SUCCESSFULLY);
            this.setState({ showPayDateChangeModal: false, showLoader: true })

            this.getVendorInvoices(this.state.dataState);

            if (this.props.getVendorInvoicesGrid){
                this.props.getVendorInvoicesGrid();
            }

            if(this.props.dataItem){
                this.props.handleClose();
            }
            
        });
        this.dataItem = null;
    }

    conditionalCellRender = (td, props) => {
        if (props.field=="selected" && props.dataItem.jobViPayHistId !=null) {
          return (
            <td>
              <Checkbox disabled={true} />
            </td>
          );
        } else {
          return td;
        }
      };

    render() {
        return (
            <>
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end" style={{ "width": "1250px" }}>
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            Vendor Remittance
                        </h4>
                        <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.handleClose}>
                            &times;
                        </button>
                    </div>
                    <div className="row ml-0 mr-0">
                        <div className="col-12 pl-0 pr-0 mt-2">
                            <div className="row mx-auto mt-3 align-items-center">
                                <div className="col-12 col-sm-4 align-items-center">
                                    <div className="row hold-position_font-size">
                                        <div className="col-6 text-right">Client Invoice#:</div>
                                        <div className="col-6 font-weight-normal pl-0 text-left word-break-div">{this.props.clientData.clientInvoiceNumber}</div>                        
                                    </div>
                                </div>
                                
                                <div className="col-12 col-sm-4 text-left mt-1 mt-sm-0 text-sm-right">
                                    <div className="row hold-position_font-size">
                                        <div className="col-6 text-right">Client:</div>
                                        <div className="col-6  font-weight-normal pl-0 text-left word-break-div">{this.props.clientData.client}</div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 text-left mt-1 mt-sm-0 text-sm-right">
                                    <div className="row hold-position_font-size">
                                        <div className="col-6 text-right">CBI Run Date:</div>
                                        <div className="col-6  font-weight-normal pl-0 text-left word-break-div">{this.props.clientData.cbiRunDate && `${dateFormatter(this.props.clientData.cbiRunDate)} ${convertShiftDateTime(this.props.clientData.cbiRunDate)}`}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 pl-0 pr-0">
                            <div className="row mx-auto align-items-center">
                                <div className="col-12 col-sm-4 mt-1 mt-sm-0">
                                    <div className="row hold-position_font-size">
                                        <div className="col-6 text-right">Total Amount:</div>
                                        <div className="col-6  font-weight-normal pl-0 text-left word-break-div">{currencyFormatter(this.props.clientData.amount)}</div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 mt-1 mt-sm-0 text-sm-right">
                                    <div className="row hold-position_font-size">
                                        <div className="col-6 text-right">Total Received Amount:</div>
                                        <div className="col-6  font-weight-normal pl-0 text-left word-break-div">{currencyFormatter(this.props.clientData.received)}</div>
                                    </div>
                                </div>
                                {!this.props.dataItem && (
                                    <div className="col-12 col-sm-4 mt-1 mt-sm-0 text-sm-right">
                                        <div className="row hold-position_font-size">
                                            <div className="col-6 text-right">Total Remittance Amount:</div>
                                            {/* {this.state.totalRemittance && */}
                                                <div className="col-6  font-weight-normal pl-0 text-left word-break-div">{currencyFormatter(this.state.totalRemittance)}</div>
                                            {/* } */}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {!this.props.dataItem && (
                            <div className="col-12 pl-0 pr-0">
                                <div className="row mx-auto align-items-center">
                                    <div className="col-12 col-sm-4 mt-1 mt-sm-0 text-sm-right">
                                        <div className="row hold-position_font-size">
                                            <div className="col-6 text-right">Total Balance Amount:</div>
                                            {/* {this.state.totalBalance && */}
                                                <div className="col-6  font-weight-normal pl-0 text-left word-break-div">{currencyFormatter(this.state.totalBalance)}</div>
                                            {/* } */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="myOrderContainer gridshadow mb-4 col-12">
                            <Grid
                                //cellRender={this.conditionalCellRender}
                                style={{ "maxHeight": "350px" }}
                                // resizable={true}
                                // reorderable={true}
                                sortable={true}
                                onDataStateChange={this.onDataStateChange}
                                data={this.state.dataArray}
                                {...this.state.dataState}
                                total={this.state.totalCount}
                                // pageable={{ pageSizes: true }}
                                selectedField={this.props.dataItem? "": "selected"}
                                onSelectionChange={this.selectionChange}
                                onHeaderSelectionChange={this.headerSelectionChange}
                                className="kendo-grid-custom lastchildd global-action-grid-onlyhead"
                            >
                                <GridNoRecords>
                                    {GridNoRecord(this.state.showLoader)}
                                </GridNoRecords>
                       
                                {!this.props.dataItem ? 
                                    <GridColumn
                                        field="selected"
                                        width="35px"
                                        headerSelectionValue={
                                            this.state.dataArray &&
                                            this.state.dataArray.findIndex(
                                            (dataItem) => dataItem.selected ==false
                                            ) ==-1
                                        }
                                        
                                    />
                                : null }

                                <GridColumn
                                    field="vendorInvoiceNumber"
                                    title="Invoice#"
                                    width="160px"
                                    cell={(props) =>
                                    VendorInvoiceNumberCell(props, this.props.clientInvoiceId)
                                    }
                                    columnMenu={ColumnMenu}
                                />

                                <GridColumn
                                    field="payDate"
                                    title="Payment Date"
                                    width="165px"
                                    filter="date"
                                    cell={this.inputField}
                                    columnMenu={ColumnMenu}
                                />

                                <GridColumn
                                    field="vendorName"
                                    title="Vendor"
                                    width="100px"
                                    filter="text"
                                    cell={(props) =>
                                        CellRender(props, "Vendor")
                                    }
                                    columnMenu={ColumnMenu}
                                />

                                <GridColumn
                                    field="amount"
                                    title="Billed Amount"
                                    width="120px"
                                    headerClassName="text-right pr-4"
                                    filter="numeric"
                                    cell={(props) => {
                                    return (
                                        <td
                                        contextMenu={"Billed Amount"}
                                        className="pr-4"
                                        style={{ textAlign: "right" }}
                                        >
                                        {currencyFormatter(props.dataItem.amount)}
                                        </td>
                                    );
                                    }}
                                    columnMenu={ColumnMenu}
                                />
                                {isRoleType(AuthRoleType.Vendor) ||
                                 isRoleType(AuthRoleType.SystemAdmin) &&
                                    <GridColumn
                                        field="transFee"
                                        title="Fees"
                                        width="80px"
                                        headerClassName="text-right pr-4"
                                        filter="numeric"
                                        cell={(props) => {
                                        return (
                                            <td
                                            contextMenu={"Fees"}
                                            className="pr-4"
                                            style={{ textAlign: "right" }}
                                            >
                                                {currencyFormatter(props.dataItem.transFee)}
                                            </td>
                                        );
                                        }}
                                        columnMenu={ColumnMenu}
                                    />
                                }
                                <GridColumn
                                    field="remittanceAmount"
                                    title="Remittance Amount"
                                    width="145px"
                                    headerClassName="text-right pr-4"
                                    filter="numeric"
                                    cell={(props) => {
                                    return (
                                        <td
                                        contextMenu={"Remittance Amount"}
                                        className="pr-4"
                                        style={{ textAlign: "right" }}
                                        >
                                            {currencyFormatter(props.dataItem.remittanceAmount)}
                                        </td>
                                    );
                                    }}
                                    columnMenu={ColumnMenu}
                                />
                                <GridColumn
                                    field="receivedAmount"
                                    title="Remitted Amount"
                                    width="135px"
                                    headerClassName="text-right pr-4"
                                    filter="numeric"
                                    cell={(props) => {
                                    return (
                                        <td
                                        contextMenu={"Remitted Amount"}
                                        className="pr-4"
                                        style={{ textAlign: "right" }}
                                        >
                                            {currencyFormatter(props.dataItem.receivedAmount)}
                                        </td>
                                    );
                                    }}
                                    columnMenu={ColumnMenu}
                                />
                                <GridColumn
                                    field="balanceAmount"
                                    title="Balance Amount"
                                    width="200px"
                                    headerClassName="text-right pr-4"
                                    filter="numeric"
                                    cell={this.numericInputField}
                                    columnMenu={ColumnMenu}
                                />
                                <GridColumn
                                    field="comments"
                                    title="Notes"
                                    width="150px"
                                    cell={this.inputField}
                                    columnMenu={ColumnMenu}
                                />

                                <GridColumn
                                    field="paymentStatus"
                                    title="Status"
                                    width="80px"
                                    cell={(props) => CellRender(props, "Status")}
                                    columnMenu={ColumnMenu}
                                />

                                <GridColumn
                                    title="History"
                                    headerClassName="tab-action"
                                    sortable={false}
                                    width="35px"
                                    cell={(props) => {
                                        return (
                                            <td contextMenu="Action" >
                                                <Menu openOnClick={true} className="actionItemMenu">
                                                    <MenuItem render={() => this.menuRender(props)}>
                                                        {props.dataItem.paymentStatus !=PaymentStatus.SCHEDULED &&
                                                            <MenuItem render={() => this.makeHistoryIcon(props)} />}

                                                        {props.dataItem.paymentStatus==PaymentStatus.SCHEDULED &&
                                                            <MenuItem render={() => this.paymentStatusPaid(props)} />}
                                                        {props.dataItem.paymentStatus==PaymentStatus.SCHEDULED &&
                                                            <MenuItem render={() => this.cancelSchedulePayment(props)} />}
                                                    </MenuItem>
                                                </Menu>
                                            </td>
                                        );
                                    }}
                                    headerCell={() => {
                                        return (
                                            <Menu openOnClick={true} className="actionItemMenu actionItemMenuThreeDots">
                                                <MenuItem render={MenuRender}>
                                                    <MenuItem render={() => RemittanceExcelExport(this.state.dataArray)} />
                                                </MenuItem>
                                            </Menu>
                                        )
                                    }}
                                />
                            </Grid>
                            <div className="mt-2">
                                {this.state.showError && <ErrorComponentNoDecimal message={this.state.errorMessage}/>}
                            </div>
                        </div>

                        <div className="col-12 mt-4 mb-4 text-sm-center text-right font-regular">
                            <button type="button" onClick={this.props.handleClose} className="btn button button-close mr-2 pl-3 pr-3 shadow mb-2 mb-xl-0">
                                <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                                Close
                            </button>

                            <button 
                                type="button" onClick={this.submitMarkRemittance}
                                className="btn button button-bg pl-3 pr-3 shadow mb-2 mb-xl-0"
                                disabled={(this.state.dataArray && 
                                (this.state.dataArray.filter(x => x.selected==true && x.paymentStatus==PaymentStatus.SCHEDULED).length ||
                                !(this.state.dataArray.filter(x => x.paymentStatus==PaymentStatus.PENDING).length > 0)))}>
                                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                Remit Payment
                            </button>
                        </div>
                    </div>
                </div>

                <ConfirmationModal
                    message={VENDOR_INVOICE_PAYMENT_CONFIRMATION_MSG()}
                    showModal={this.state.showConfirmationModal}
                    handleYes={() => this.updatePaymentStatus()}
                    handleNo={() => {
                        this.setState({ showConfirmationModal: false });
                    }}
                />

                <ConfirmationModal
                    message={DELETE_SCHEDULE_PAYMENT_CONFIRMATION_MSG()}
                    showModal={this.state.showCancelPaymentModal}
                    handleYes={() => this.updatePaymentStatus()}
                    handleNo={() => {
                        this.setState({ showCancelPaymentModal: false });
                    }}
                />

                <ConfirmationModal
                    message={RESCHEDULE_PAYMENT_CONFIRMATION_MSG()}
                    showModal={this.state.showPayDateChangeModal}
                    handleYes={() => this.updateScheduleDate()}
                    handleNo={() => {
                        this.getVendorInvoices(this.state.dataState);
                        this.setState({ showPayDateChangeModal: false });
                    }}
                />
            </div>

            
            </>
        );
    }
}
