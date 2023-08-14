import {
    faFileInvoiceDollar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import React from "react";
import ReactTooltip from "react-tooltip";
import { currencyFormatter, dateFormatter, datetimeFormatter } from "../../../../HelperMethods";
import {
    CellRender,
    GridNoRecord,
} from "../../../Shared/GridComponents/CommonComponents";
import { getPaymentHistoryService, getRemittanceHistoryService } from "../CBIServices/CBIServices";
import { ClientPaymentHistoryExcel, VendorPaymentHistoryExcel } from "./GlobalActions";

export interface PaymentHistoryProps {
    data?: any;
    handleClose?: any;
    dataApi?: any;
    title?: any;
}

export interface PaymentHistoryState {
    dataArray?: any;
    showLoader?: boolean;
    remittedToVendorTotal?: any;
    paymentReceivedTotal?: any;
    balanceAmountTotal?: any;
}

export default class PaymentHistory extends React.Component<
    PaymentHistoryProps,
    PaymentHistoryState
> {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            dataArray: [],
        };
    }

    componentDidMount() {
        this.getPaymentHistory()
    }

    getPaymentHistory = () => {
        this.setState({ showLoader: true })
        if (this.props.dataApi=="client") {
            getPaymentHistoryService(this.props.data.invoiceId)
            .then(res => {

                var paymentReceived = res.data.filter(i => i.status=="Payment Received");
                var remittedToVendor = res.data.filter(i => i.status=="Remitted to Vendor");

                var remittedToVendorTotal = remittedToVendor.reduce((acc, current) =>
                    acc + current.amount, 0);

                var paymentReceivedTotal = paymentReceived.reduce((acc, current) =>
                acc + current.amount, 0);

                // var balanceAmount = paymentReceivedTotal - remittedToVendorTotal;

                this.setState({
                    dataArray: res.data,
                    showLoader: false,
                    remittedToVendorTotal: remittedToVendorTotal,
                    paymentReceivedTotal: paymentReceivedTotal,
                    // balanceAmountTotal: balanceAmount
                })
            })
        } else if (this.props.dataApi=="vendor") {
            getRemittanceHistoryService(this.props.data.invoiceId).then(res => this.setState({ dataArray: res.data, showLoader: false }))
        }
    }

    render() {
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end paymenthistory-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            {this.props.title} {this.props.dataApi=='vendor' && `- Invoice#: ${this.props.data.invoiceNumber}`}
                        </h4>
                        <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.handleClose}>
                            &times;
                        </button>
                    </div>
                    <div className="row ml-0 mr-0">
                        <div className="col-12 pl-0 pr-0 mt-2">
                            <div className="row mx-auto mt-2 align-items-center">
                                <div className="col-12 col-sm-6 align-items-center">
                                    <div className="row hold-position_font-size">
                                        <div className="col-5 text-right">Client Invoice#:</div>
                                        <div className="col-7 font-weight-normal pl-0 text-left word-break-div">{this.props.dataApi=='client' ? this.props.data.invoiceNumber : this.props.data.clientInvoiceNumber}</div>                        
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 align-items-center">
                                    <div className="row hold-position_font-size">
                                        <div className="col-5 text-right">Client:</div>
                                        <div className="col-7 font-weight-normal pl-0 text-left word-break-div">{this.props.data.client}</div>                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-12 pl-0 pr-0">
                            <div className="row mx-auto align-items-center">
                                <div className="col-12 col-sm-6 align-items-center">
                                    <div className="row hold-position_font-size">
                                        <div className="col-5 text-right">Total Amount:</div>
                                        <div className="col-7 font-weight-normal pl-0 text-left word-break-div">{currencyFormatter(this.props.data.amount)}</div>                        
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 align-items-center">
                                    <div className="row hold-position_font-size">
                                        <div className="col-5 text-right">
                                            {this.props.dataApi=="client" ? 
                                            `CBI Run Date:`
                                            : `Billing Period:`
                                            }
                                        </div>
                                        <div className="col-7 font-weight-normal pl-0 text-left word-break-div">{this.props.data.billingPeriod}</div>                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.props.dataApi=="client" && 
                            this.state.paymentReceivedTotal &&
                            <div className="col-12 pl-0 pr-0">
                                <div className="row mx-auto align-items-center">
                                    <div className="col-12 col-sm-6 align-items-center">
                                        <div className="row hold-position_font-size">
                                            <div className="col-5 text-right">Payment Received:</div>
                                            <div className="col-7 font-weight-normal pl-0 text-left word-break-div">{currencyFormatter(this.state.paymentReceivedTotal)}</div>                        
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 align-items-center">
                                        <div className="row hold-position_font-size">
                                            <div className="col-5 text-right">Remitted To Vendor:</div>
                                            <div className="col-7 font-weight-normal pl-0 text-left word-break-div">{currencyFormatter(this.state.remittedToVendorTotal)}</div>                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {/* {this.props.dataApi=="client" && 
                            this.state.paymentReceivedTotal &&
                            <div className="col-12 pl-0 pr-0">
                                <div className="row mx-auto align-items-center">
                                    <div className="col-12 col-sm-6 align-items-center">
                                        <div className="row hold-position_font-size">
                                            <div className="col-5 text-right">Balance Amount:</div>
                                            <div className="col-7 font-weight-normal pl-0 text-left word-break-div">{currencyFormatter(this.state.balanceAmountTotal)}</div>                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        } */}
                        <div className="col-12 pl-0 pr-0">
                            <div className="row mx-auto align-items-center">
                                <div className="col-12 text-right">
                                    {this.props.dataApi=='client' ? 
                                        ClientPaymentHistoryExcel(this.state.dataArray)                                    
                                    :
                                        VendorPaymentHistoryExcel(this.state.dataArray)                                   
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="myOrderContainer gridshadow mb-4 col-12">
                            <Grid
                                style={{ "maxHeight": "300px" }}
                                resizable={true}
                                reorderable={true}
                                sortable={true}
                                data={this.state.dataArray}
                                className="kendo-grid-custom lastchildd global-action-grid-onlyhead"
                            >
                                <GridNoRecords>
                                    {GridNoRecord(this.state.showLoader)}
                                </GridNoRecords>
                                <GridColumn
                                    field="createdDate"
                                    title="Payment Date"
                                    format="{0:d}"
                                    filter="date"
                                    editor="date"
                                    cell={(props) => CellRender(props, 'Payment Date', null, true)}
                                />

                                {this.props.dataApi=='client' ?
                                    <GridColumn
                                    field="vendor"
                                    title="Vendor"
                                    cell={(props) => CellRender(props, "Vendor")}
                                    
                                />
                                : null }

                                <GridColumn
                                    field="amount"
                                    title="Amount"
                                    headerClassName="text-right pr-4"
                                    filter="text"
                                    cell={(props) => (
                                        <td contextMenu="Amount" className="text-right pr-4">{currencyFormatter(props.dataItem.amount)}</td>
                                    )}
                                />
                                
                                <GridColumn
                                    field="createdBy"
                                    title="Payment By"
                                    cell={(props) => CellRender(props, "Payment By")}
                                />

                                <GridColumn
                                    field="status"
                                    title="Status"
                                    cell={(props) => CellRender(props, "Status")}
                                />

                                <GridColumn
                                    field="comments"
                                    title="Notes"
                                    cell={(props) => {
                                        return (
                                            <td contextMenu="Comments">
                                                {/* <Tooltip anchorElement="target" position="top"> */}
                                                <ReactTooltip id={props.dataItem.payHistId ? `${props.dataItem.payHistId}` : `${props.dataItem.jobViPayHistId}`} place={"top"} effect="solid" multiline={true}
                                                    backgroundColor={"white"}
                                                    type={"success"}
                                                    border={true}
                                                    className="tooltip-comments-new"
                                                    borderColor={"#FE988D"}
                                                    textColor="black">
                                                    {props.dataItem.comments}
                                                </ReactTooltip>
                                                <div data-tip data-for={props.dataItem.payHistId ? `${props.dataItem.payHistId}` : `${props.dataItem.jobViPayHistId}`} className="my-task-desciption" >
                                                    {props.dataItem.comments}
                                                </div>
                                                {/* </Tooltip> */}
                                            </td>
                                        )
                                    }}
                                />
                                
                                
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
