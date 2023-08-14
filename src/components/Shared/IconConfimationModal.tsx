import * as React from "react";
import auth from "../Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faTimes, faFileInvoiceDollar, faHistory, faClock } from "@fortawesome/free-solid-svg-icons";
import { ErrorComponent } from "../ReusableComponents";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { currencyFormatter } from "../../HelperMethods";

export interface IconConfimationModalProps {
    showModal: boolean;
    message: any;
    handleYes: any;
    handleNo: any;
    actionId?: string;
    action?: string;
    fieldTitle: any;
    modalTitle?: any;
    iconName?: any;
    isDisable: any;
    data?: any;
    disableFields: any;
    handlePaymentHistory?: any;
}
export interface IconConfimationModalState {
    clientId: string;
    comments?: string;
    amount?: any;
    received?: any;
    balance?: any;
    date?: any;
    showError?: boolean;
    expiryDate?: any;
}

export class IconConfimationModal extends React.Component<IconConfimationModalProps, IconConfimationModalState> {
    constructor(props) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            showError: false,
            comments: "",
        };
    }
    componentDidMount() {
        if (this.props.data)
            this.setState({ amount: this.props.data.amount,
                balance: this.props.data.balance,
                date: this.props.data.date,
                received: this.props.data.received});
    }

    handleCommentChange = (e) => {
        this.setState({ comments: e.target.value });
    };

    handleChange = (e) => {
        let change = {};
        change[e.target.name] = e.target.value;
        this.setState(change);
    }

    handleYes = () => {
        const { comments, amount, date, showError, balance } = this.state;
        let showErrors = amount==undefined || amount =="" || balance=="" || amount > this.props.data.amount || balance > this.props.data.balance ||amount==0 || balance==0 || date==undefined || date==null ? true : false;
        this.setState({ showError: showErrors });
        if (!showErrors) {
            this.props.handleYes({ amount: balance, date: date, comments: comments });
        }
    };

    render() {
        return (
            <div className="">
                {this.props.showModal && (
                    <div className="containerDialog bg-primaryyy">
                        <div className="containerDialog-animation">
                            <div className="col-11 col-sm-8 col-md-6 col-lg-4 shadow containerDialoginside containerDialoginside-popup">
                                <div className="row blue-accordion">
                                    <div className="col-12  pt-2 pb-2 fontFifteen">
                                        {this.props.modalTitle}
                                        <span className="float-right" onClick={this.props.handleNo}>
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                        </span>
                                    </div>
                                </div>
                                {/* <div className="row text-center">
                                    <div className="col-12 col-sm-11 mx-auto text-dark mt-2 mt-lg-4">
                                        <FontAwesomeIcon
                                            icon={faFileInvoiceDollar}
                                            className={`mr-1 circle-Green shadow rounded-circle`}
                                        />
                                    </div>
                                    <div className="col-12 col-sm-11 mx-auto text-dark text-center mt-2 mt-lg-3">{this.props.message}</div>
                                </div> */}
                                <div className="col-12 col-sm-11 mx-auto text-left text-dark mt-2 mt-lg-4">
                                    <div className="row">
                                        <div className="col-12 col-sm-4 mx-auto font-weight-bold text-dark text-left mt-2 mt-lg-3">
                                                {this.props.fieldTitle.totalAmount}:
                                        </div>
                                        <div className="col-12 col-sm-8 mx-auto text-dark font-weight-bold text-right mt-2 mt-lg-3">
                                            {isNaN(this.state.amount) ? 0 : currencyFormatter(this.state.amount)}
                                        </div>
                                    </div>
                                </div>
                                    
                                <div className="col-12 col-sm-11 mx-auto mt-2 mt-sm-0 mt-lg-3" id="ShowDatePickerIcon">
                                    <label className="mb-1 font-weight-bold required">
                                        {this.props.fieldTitle.date}
                                    </label>
                                    <DatePicker
                                        className="form-control"
                                        format="MM/dd/yyyy"
                                        name="date"
                                        formatPlaceholder="formatPattern"
                                        value={this.state.date}
                                        title="Expiry Date"
                                        onChange={(e) => this.handleChange(e)}
                                        disabled={this.props.disableFields.date}
                                    />
                                    {this.state.showError &&
                                        (this.state.date =="" || this.state.date ==undefined ||
                                            this.state.date ==null) ? (
                                        <ErrorComponent />
                                    ) : null}
                                </div>
                                <div className="col-12 col-sm-11 mx-auto mt-2 mt-sm-2 mt-lg-3">
                                    <label className="mb-1 font-weight-bold required">
                                        {this.props.fieldTitle.amount}
                                    </label>
                                    <span>
                                        <FontAwesomeIcon icon={faClock} className="ml-1 active-icon-blue ClockFontSize cursorElement" onClick={this.props.handlePaymentHistory}/>
                                    </span>
                                    <NumericTextBox
                                        format="c2"
                                        min={0}
                                        max={10000000000000}
                                        name="balance"
                                        className="form-control disabled"
                                        placeholder="Enter amount here..."
                                        value={this.state.balance ? this.state.balance : 0}
                                        onChange={(e) => this.setState({ balance: e.value })}
                                        // disabled={this.props.disableFields.amount}
                                    />
                                    {this.state.showError && (this.state.balance =="" || this.state.balance ==0 || this.state.balance==undefined) ? (
                                        <ErrorComponent />
                                    ) :  (this.state.balance > this.props.data.balance)?<ErrorComponent message={`Remittance Amount can not be greater than ${currencyFormatter(this.props.data.balance)}`}/>:null}
                                </div>

                                {/* <div className="col-12 col-sm-11 mx-auto mt-2 mt-sm-2 mt-lg-3">
                                    <label className="mb-1 font-weight-bold required">{this.props.fieldTitle.totalAmount}</label>
                                    <NumericTextBox
                                        format="c2"
                                        min={0}
                                        max={10000000000000}
                                        name="amount"
                                        className="form-control disabled"
                                        placeholder="Enter amount here..."
                                        value={isNaN(this.state.amount) ? 0 : this.state.amount}
                                        onChange={(e) => this.setState({ amount: e.value })}
                                        disabled={this.props.disableFields.amount}
                                        spinners={false}
                                    />
                                    {this.state.showError && (this.state.amount =="" || this.state.amount ==0 || this.state.amount==undefined) ? (
                                        <ErrorComponent />
                                    ) :  (this.state.amount > this.props.data.amount)?<ErrorComponent message={`Remittance Amount can not be greater than ${currencyFormatter( this.props.data.amount)}`}/>:null}
                                </div> */}
                                <div className="row ml-0 mr-0">
                                    <div className="col-12 col-sm-11 mx-auto mt-sm-2">
                                        <label className="mb-1 font-weight-bold">Notes</label>
                                        <textarea
                                            name="comments"
                                            maxLength={1000}
                                            placeholder="Enter Notes .."
                                            className="form-control"
                                            value={this.state.comments}
                                            onChange={(e) => this.handleChange(e)}
                                        />
                                        {/* {this.state.showError && this.state.comments =="" ? <ErrorComponent /> : null} */}
                                    </div>
                                </div>
                                <div className="row mb-4 ml-0 mr-0 d-none d-lg-block">
                                    <div className="col-12 mt-4 text-sm-center text-right font-regular">
                                        <button type="button" onClick={this.props.handleNo} className="btn button button-close mr-2 pl-3 pr-3 shadow mb-2 mb-xl-0">
                                            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                                            Close
                                        </button>
                                        <button type="button" onClick={this.handleYes} className="btn button button-bg pl-3 pr-3 shadow mb-2 mb-xl-0">
                                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                            OK
                                        </button>
                                    </div>
                                </div>
                                <div className="row text-center d-block d-lg-none">
                                    <div className="col-12 mt-3 mb-3 text-cenetr font-regular">
                                        <button type="button" onClick={this.props.handleNo} className="btn button button-close mr-2 shadow mb-2 mb-xl-0">
                                            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                                             Close
                                        </button>
                                        <button type="button" onClick={this.handleYes} className="btn button button-bg shadow mb-2 mb-xl-0">
                                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                            OK
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default IconConfimationModal;
