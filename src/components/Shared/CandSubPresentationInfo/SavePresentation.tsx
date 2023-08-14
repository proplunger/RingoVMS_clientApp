import React from "react";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import { ErrorComponent } from "../../ReusableComponents";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../Shared/withValueField";
import { emailPattern } from "../AppConstants";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select", id: null };

export interface SavePresentationProps {
  data: any;
  handleChange?: any;
  handleDropdownChange?: any;
  handleRadioBtnChange?: any;
}

function trim(stringToTrim) {
  return stringToTrim.replace(/^\s+|\s+$/g, "");
}

class SavePresentation extends React.Component<SavePresentationProps> {
  constructor(props: SavePresentationProps) {
    super(props);
  }

  render() {
    const {
      data,
      handleChange,
      handleDropdownChange,
      handleRadioBtnChange,
    } = this.props;
    document.getElementsByName('potentialStartDate').length > 0 &&
      (document.getElementsByName('potentialStartDate')[0]['disabled'] = true)
    return (
      <div className="">
        <div className="row text-dark">
          <div className="col-12 pl-0 pr-0">
            <div className="row mx-auto">
              <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                <label className="mb-2 text-dark required font-weight-bold">
                  License
                </label>
                <input
                  type="text"
                  name="license"
                  className="form-control disabled"
                  placeholder="Type here..."
                  value={data.license}
                  maxLength={100}
                  onChange={(e) => handleChange(e)}
                />
                {data.showError && data.license =="" ? (
                  <ErrorComponent />
                ) : null}
              </div>
              <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                <label className="mb-2 text-dark required font-weight-bold">
                  Board Certificate
                </label>
                <CustomDropDownList
                  className="form-control disabled"
                  name={`boardCertificate`}
                  data={[
                    { id: "1", name: "Yes" },
                    { id: "2", name: "No" },
                    { id: "3", name: "Pending" },
                  ]}
                  textField="name"
                  valueField="id"
                  value={data.boardCertificate}
                  defaultItem={defaultItem}
                  onChange={(e) => handleDropdownChange(e)}
                />
                {data.showError && data.boardCertificate ==null ? (
                  <ErrorComponent />
                ) : null}
              </div>
              <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-3" id="ShowDatePickerIcon">
                <label className="mb-2 text-dark required font-weight-bold">
                  Potential Start Date
                </label>
                <DatePicker
                  className="form-control"
                  format="MM/dd/yyyy"
                  name="potentialStartDate"
                  value={data.potentialStartDate}
                  onChange={(e) => handleChange(e)}
                  formatPlaceholder="formatPattern"
                  min={new Date(data.reqStartDate)}
                // max={data.potentialStartDate}
                />
                {data.showError && data.potentialStartDate ==null ? (
                  <ErrorComponent />
                ) : null}
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <div className="row mx-auto">
                  <div className="col-12 col-sm-4 col-lg-4 mt-1 mt-sm-0 mt-3">
                    <label className="mb-2 text-dark required font-weight-bold">
                      Schedule Requested
                    </label>
                    <input
                      type="text"
                      name="scheduleRequested"
                      className="form-control disabled"
                      placeholder="Type here..."
                      value={data.scheduleRequested}
                      maxLength={100}
                      onChange={(e) => handleChange(e)}
                    />
                    {data.showError && trim(data.scheduleRequested) =="" ? (
                      <ErrorComponent />
                    ) : null}
                  </div>
                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-3">
                    <label className="mb-2 text-dark required font-weight-bold">
                      Time Off Requested
                    </label>
                    <input
                      type="text"
                      name="timeOffRequested"
                      className="form-control disabled"
                      placeholder="Type here..."
                      value={data.timeOffRequested}
                      maxLength={100}
                      onChange={(e) => handleChange(e)}
                    />
                    {data.showError && trim(data.timeOffRequested) =="" ? (
                      <ErrorComponent />
                    ) : null}
                  </div>
                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0">
                    <label className="mb-2 text-dark font-weight-bold">
                      Contact Number
                    </label>
                    <MaskedTextBox
                      mask="(000) 000-0000"
                      name="cellNumber"
                      value={data.cellNumber}
                      maskValidation
                      onChange={(e) => handleChange(e)}
                      className="form-control disabled"
                      disabled={true}
                    />
                    {data.showError &&
                      (data.cellNumber != "" &&
                        data.cellNumber.replace(/\D+/g, "").length !=10 ? (
                        <div role="alert" className="k-form-error k-text-start">
                          Phone Number is invalid.
                        </div>
                      ) : (
                        data.cellNumber =="" && <ErrorComponent />
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <div className="row mx-auto">
                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                    <label className="mb-2 text-dark required font-weight-bold">
                      Credentials
                    </label>
                    <input
                      type="text"
                      name="credentials"
                      className="form-control disabled"
                      placeholder="Type here..."
                      value={data.credentials}
                      maxLength={100}
                      onChange={(e) => handleChange(e)}
                    />
                    {data.showError && data.credentials =="" ? (
                      <ErrorComponent />
                    ) : null}
                  </div>
                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                    <label className="mb-2 text-dark required font-weight-bold">
                      Malpractice
                    </label>
                    <input
                      type="text"
                      name="malpractice"
                      className="form-control disabled"
                      placeholder="Type here..."
                      value={data.malpractice}
                      maxLength={100}
                      onChange={(e) => handleChange(e)}
                    />
                    {data.showError && data.malpractice =="" ? (
                      <ErrorComponent />
                    ) : null}
                  </div>
                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                    <label className="mb-2 text-dark required font-weight-bold">
                      Background Clearance
                    </label>
                    <input
                      type="text"
                      name="backgroundClearance"
                      className="form-control disabled"
                      placeholder="Type here..."
                      value={data.backgroundClearance}
                      maxLength={100}
                      onChange={(e) => handleChange(e)}
                    />
                    {data.showError && data.backgroundClearance =="" ? (
                      <ErrorComponent />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <div className="row mx-auto">

                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                    <label className="mb-2 text-dark required font-weight-bold">
                      Perm Fee
                    </label>
                    <input
                      type="text"
                      name="permFee"
                      className="form-control disabled"
                      placeholder="Type here..."
                      value={data.permFee}
                      maxLength={100}
                      onChange={(e) => handleChange(e)}
                    />
                    {data.showError && data.permFee =="" ? (
                      <ErrorComponent />
                    ) : null}
                  </div>



                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0">
                    <label className="mb-2 text-dark font-weight-bold">
                      Email
                    </label>
                    <input
                      type="email"
                      name="emailAddress"
                      className="form-control disabled"
                      placeholder="Type here..."
                      value={data.emailAddress}
                      maxLength={100}
                      onChange={(e) => handleChange(e)}
                      disabled={true}
                    />
                    {data.showError &&
                      (data.emailAddress != "" &&
                        emailPattern.test(data.emailAddress) ==false ? (
                        <div role="alert" className="k-form-error k-text-start">
                          Provider email is invalid.
                        </div>
                      ) : (
                        data.emailAddress =="" &&
                        data.showError && <ErrorComponent />
                      ))}
                  </div>
                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0">
                    <label className="mb-2 text-dark font-weight-bold">
                      Previous Employee
                    </label>
                    <div className="col-12 text-dark d-flex pl-0 pr-0 mt-2">
                      <label className="container container_checkboxandradio-savePressentation mb-0 radioBtnCustom font-weight-normal">
                        Yes
                        <input
                          type="radio"
                          name="isPreviousEmployer"
                          value="true"
                          checked={data.previousEmployer}
                          onChange={(e) => handleRadioBtnChange(e)}
                        />
                        <span className="checkmark checkmark-nameClear checkmark-nameClear-savepressentation"></span>
                      </label>
                      <label className="container container_checkboxandradio  mb-0 radioBtnCustom font-weight-normal">
                        No
                        <input
                          type="radio"
                          name="isPreviousEmployer"
                          value="false"
                          checked={!data.previousEmployer}
                          onChange={(e) => handleRadioBtnChange(e)}
                        />
                        <span className="checkmark checkmark-nameClearNofee checkmark-nameClear-savepressentation"></span>
                      </label>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <div className="row mx-auto">
                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0">
                    <label className="mb-2 text-dark font-weight-bold">
                      Previous Employee Description
                    </label>
                    <textarea
                      name="previousEmployerDescription"
                      onChange={(e) => handleChange(e)}
                      value={data.previousEmployerDescription}
                      maxLength={1000}
                      className="form-control"
                      placeholder="Enter Previous Employee Description"
                      disabled={!data.previousEmployer}
                    />
                    {data.showError &&
                      data.previousEmployer &&
                      data.previousEmployerDescription =="" ? (
                      <ErrorComponent />
                    ) : null}
                  </div>
                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0">
                    <label className="mb-2 text-dark font-weight-bold required">
                      Special Terms
                    </label>
                    <textarea
                      name="specialTerms"
                      onChange={(e) => handleChange(e)}
                      value={data.specialTerms}
                      maxLength={2000}
                      className="form-control"
                      placeholder="Enter Special Terms"
                    />
                    {data.showError &&
                      (data.specialTerms =="" || data.specialTerms==null)? (
                      <ErrorComponent />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SavePresentation;
