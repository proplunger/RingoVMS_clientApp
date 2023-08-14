import React from 'react'
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { ErrorComponent } from "../../ReusableComponents";
import { NumericTextBox } from '@progress/kendo-react-inputs';
import { currencyFormatter } from '../../../HelperMethods';

export interface MakePaymentFormProps {
  paymentAmount?: any;
  paymentDate?: any;
  handleChange?: any;
  assign?: any;
  fieldTitle?: any;
  showError?: any;
  disabledFields: any;
  date?: any;
  receivedPayment?: any;
}

export interface MakePaymentFormState {
  paymentAmount?: any;
  paymentDate?: any;
  handleChange?: any;
  assign?: any;
  fieldTitle?: any;
  notes?: any;
  showError?: any;
}

export default class MakePaymentForm extends React.Component<
  MakePaymentFormProps,
  MakePaymentFormState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      paymentAmount: this.props.paymentAmount,
      paymentDate: this.props.paymentDate,
    });
  }

  getPaymentData = (makePayment) => {
    const { paymentAmount, paymentDate, notes } = this.state;
    if (this.props.disabledFields.date && this.props.disabledFields.amount) {
      return {
        validationSuccess: true,
        notes: notes,
        paymentAmount: paymentAmount,
        paymentDate: paymentDate,
      };
    } else {
      if (
        paymentAmount != undefined &&
        paymentAmount != "" &&
        paymentAmount !=0 &&
        paymentAmount > 0 &&
        paymentAmount &&
        paymentDate != null &&
        paymentDate != undefined
      ) {
        return {
          validationSuccess: true,
          paymentAmount: paymentAmount,
          paymentDate: paymentDate,
          notes: notes,
        };
      } else {
        this.setState({ assign: makePayment, showError: true });
        return {
          validationSuccess: false,
        };
      }
    }
  };

  handleChange = (e) => {
    let change = {};
    change[e.target.name] = e.target.value;
    this.setState(change);
  };

  render() {
    return (
      <div className="row text-dark mt-1" id="disbaled">
        <div className="col-12 pl-0 pr-0">
          <div className="row mx-auto">
            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color">
              <label className="mb-2 text-dark required font-weight-bold required">
                {this.props.fieldTitle != undefined &&
                  this.props.fieldTitle.date}
              </label>
              <DatePicker
                className="form-control"
                format="MM/dd/yyyy"
                name="paymentDate"
                disabled={this.props.disabledFields.date}
                value={this.state.paymentDate}
                onChange={(e) => this.handleChange(e)}
                formatPlaceholder="formatPattern"
              />
              {this.state.assign &&
                this.state.showError &&
                (this.state.paymentDate ==null ||
                  this.state.paymentDate==undefined ||
                  this.state.paymentDate=="") && <ErrorComponent />}
            </div>
            {this.props.receivedPayment && 
              <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color">
                <label className="mb-2 text-dark font-weight-bold">
                  {this.props.fieldTitle != undefined &&
                    this.props.fieldTitle.received}
                </label>
                <NumericTextBox
                  className="form-control"
                  value={
                    isNaN(this.props.receivedPayment) ? 0 : this.props.receivedPayment
                  }
                  format="c2"
                  // min={0}
                  // max={this.props.paymentAmount}
                  disabled={true}
                  name="received"
                  spinners={false}
                  // onChange={(e) => this.setState({ paymentAmount: e.value })}
                />
              </div>
            }
            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 cal-icon-color">
              <label className="mb-2 text-dark font-weight-bold required">
                {this.props.fieldTitle != undefined &&
                  this.props.fieldTitle.amount}
              </label>
              <NumericTextBox
                className="form-control"
                value={
                  isNaN(this.state.paymentAmount) ? 0 : this.state.paymentAmount
                }
                format="c2"
                min={0}
                max={this.props.paymentAmount}
                // disabled={this.props.disabledFields.amount}
                name="budget"
                onChange={(e) => this.setState({ paymentAmount: e.value })}
              />
              {this.state.assign &&
                this.state.showError &&
                (this.state.paymentAmount ==null ||
                  this.state.paymentAmount==undefined) ? (
                <ErrorComponent />
              ) : this.state.assign &&
                this.state.showError &&
                this.state.paymentAmount <= 0 ? (
                <ErrorComponent message="Invalid Amount" />
              ) : this.props.paymentAmount<this.state.paymentAmount?<ErrorComponent message={`Remittance amount can not be grater that ${currencyFormatter(this.props.paymentAmount)}`}/>:null}
            </div>
            <div className="col-12 col-sm-4 flex mt-2 mb-2 mb-sm-0 mt-sm-0">
              <label className="mb-2 font-weight-bold ">Notes</label>
              <textarea
                name="notes"
                className="form-control"
                maxLength={2000}
                onChange={(e) => this.handleChange(e)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}