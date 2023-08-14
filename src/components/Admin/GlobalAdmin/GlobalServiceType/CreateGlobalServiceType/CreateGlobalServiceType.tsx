import { DropDownList } from "@progress/kendo-react-dropdowns";
import * as React from "react";
import withValueField from "../../../../Shared/withValueField";
import Auth from "../../../../Auth";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import axios from "axios";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton from "react-loading-skeleton";
import { ErrorComponent } from "../../../../ReusableComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { successToastr } from "../../../../../HelperMethods";
import { Checkbox } from "@progress/kendo-react-inputs";
import { ServiceCategory } from "../../../../Shared/AppConstants";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select..", id: null };

export interface CreateGlobalServiceTypeProps {
  props: any;
  onCloseModal: any;
  onOpenModal: any;
  clientName: string;
}

export interface CreateGlobalServiceTypeState {
  clientId?: string;
  clientName: string;
  name?: string;
  description?: string;
  serviceCatId?: string;
  submitted: boolean;
  showLoader?: boolean;
  ServiceCategory: Array<IDropDownModel>;
  originalServiceCategory: Array<IDropDownModel>;
  openAlert?: boolean;
  data?: any;
  isFeeApplied?: boolean;
  serviceTypeId: string;
  isOneTime?: boolean;
}

class CreateGlobalServiceType extends React.Component<CreateGlobalServiceTypeProps, CreateGlobalServiceTypeState>
{
  constructor(props: CreateGlobalServiceTypeProps) {
    super(props);
    this.state = {
      serviceTypeId: "",
      clientId: Auth.getClient(),
      clientName: Auth.getClientName(),
      ServiceCategory: [],
      originalServiceCategory: [],
      showLoader: true,
      submitted: false,
      isFeeApplied: false,
      isOneTime: false,
      name: ""
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    this.getServiceCategory();
    if (this.props.props) {
      this.setState({
        description: this.props.props.description,
        isFeeApplied: this.props.props.isFeeApplied,
        name: this.props.props.name,
        serviceTypeId: this.props.props.id,
        serviceCatId: this.props.props.serviceCatId,
        isOneTime: this.props.props.isOneTime,
      });
    }
  }

  getServiceCategory = () => {
    axios.get(`api/candidates/servicecat`).then(async (res) => {
      this.setState({
        ServiceCategory: res.data,
        originalServiceCategory: res.data,
        showLoader: false,
      });
    });
  };

  handleServiceCategoryChange = (e) => {

    const Id = e.value.id;
    this.setState({ serviceCatId: Id });

    if (ServiceCategory.TIME==e.value.name) {
      this.setState({ isFeeApplied: true });
    } else {
      this.setState({ isFeeApplied: false });
    }

  };

  handleCheckboxChange(e, modelProp) {
    var stateObj = {};
    stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
    this.setState(stateObj);
  }

  handleUpdate = () => {
    this.setState({ submitted: true });
    let data = {
      description: this.state.description,
      ServiceCategoryId: this.state.serviceCatId,
      serviceType: this.state.name,
      isFeeApplied: this.state.isFeeApplied,
      serviceTypeId: this.state.serviceTypeId,
      isOneTime: this.state.isOneTime,
    };

    if (
      this.state.name.trim() !=undefined &&
      this.state.name.trim() !=null &&
      this.state.name.trim() !=""
    ) {
      axios
        .put(
          `api/admin/servicetypes/${this.state.serviceTypeId}`,
          JSON.stringify(data)
        )
        .then((res) => {
          successToastr("Service type updated successfully");
          this.props.onCloseModal();
        });
    }
  };

  handleSaveAndAddAnother = () => {
    this.setState({ submitted: true });
    let data = {
      description: this.state.description,
      serviceCategoryId: this.state.serviceCatId,
      serviceType: this.state.name,
      isFeeApplied: this.state.isFeeApplied,
      isOneTime: this.state.isOneTime,
    };
    if ((this.state.name.trim() !=undefined && this.state.name.trim() !=null && this.state.name.trim() !="") && (this.state.serviceCatId !=undefined && this.state.serviceCatId !=null)) {
      axios.post(`api/admin/servicetypes`, JSON.stringify(data)).then((res) => {
        successToastr("Service type created successfully");
        this.props.onCloseModal();
        setTimeout(() => {
          this.openNew();
        }, 50);
      });
    }
  };

  handleSaveAndClose = () => {
    this.setState({ submitted: true });
    let data = {
      description: this.state.description,
      serviceCategoryId: this.state.serviceCatId,
      serviceType: this.state.name,
      isFeeApplied: this.state.isFeeApplied,
      isOneTime: this.state.isOneTime,

    };
    if ((this.state.name.trim() !=undefined && this.state.name.trim() !=null && this.state.name.trim() !="") && (this.state.serviceCatId !=undefined && this.state.serviceCatId !=null)) {
      axios.post(`api/admin/servicetypes`, JSON.stringify(data)).then((res) => {
        successToastr("Service type created successfully");
        this.props.onCloseModal();
      });
    }
  };

  handleFilterChange(event) {
    var name = event.target.props.id;
    var originalArray = "original" + name;
    this.state[name] = this.filterData(event.filter, originalArray);
    this.setState(this.state);
  }

  filterData(filter, originalArray) {
    const data1 = this.state[originalArray];
    return filterBy(data1, filter);
  }

  openNew = () => {
    this.props.onOpenModal();
  };

  render() {
    return (
      <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
        <div className="modal-content border-0">
          <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
            <h4 className="modal-title text-white fontFifteen">
              {this.props.props != undefined
                ? "Edit Service Type"
                : "Add New Service Type"}
            </h4>
            <button
              type="button"
              className="close text-white close_opacity"
              data-dismiss="modal"
              onClick={this.props.onCloseModal}
            >
              &times;
            </button>
          </div>
          {this.state.showLoader &&
            Array.from({ length: 2 }).map((item, i) => (
              <div className="row mx-auto mt-2" key={i}>
                {Array.from({ length: 3 }).map((item, j) => (
                  <div
                    className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1"
                    key={j}
                  >
                    <Skeleton width={230} />
                    <Skeleton height={30} />
                  </div>
                ))}
              </div>
            ))}
          {!this.state.showLoader && (
            <div>
              <div className="row mt-3 mx-0">
                <div className="col-12 col-sm-4 mt-1 mt-sm-0">
                  <label className="mb-0 font-weight-bold required">
                    Service Category
                  </label>
                  <CustomDropDownList
                    className="form-control mt-1"
                    data={this.state.ServiceCategory}
                    textField="name"
                    valueField="id"
                    name="id"
                    value={this.state.serviceCatId}
                    defaultItem={defaultItem}
                    onChange={(e) => this.handleServiceCategoryChange(e)}
                    filterable={
                      this.state.originalServiceCategory.length > 5
                        ? true
                        : false
                    }
                    onFilterChange={this.handleFilterChange}
                  />
                  {this.state.submitted &&
                    (this.state.serviceCatId==undefined ||
                      this.state.serviceCatId==null) && <ErrorComponent />}
                </div>
                <div className="col-sm-4 mt-1 mt-sm-0">
                  <label className="mb-0 font-weight-bold required">
                    Service Type
                  </label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Enter Service Type"
                    value={this.state.name}
                    maxLength={100}
                    onChange={(event) => {
                      this.setState({ name: event.target.value });
                    }}
                  />
                  {this.state.submitted &&
                    (this.state.name.trim()==undefined ||
                      this.state.name.trim()==null ||
                      this.state.name.trim()=="") && <ErrorComponent />}
                </div>

                <div className="col-sm-4 mt-1 mt-sm-0">
                  <label className="mb-0 font-weight-bold">Description</label>
                  <textarea
                    rows={2}
                    id=""
                    maxLength={1000}
                    value={this.state.description}
                    className="form-control mt-1"
                    placeholder="Enter Description"
                    onChange={(event) => {
                      this.setState({ description: event.target.value });
                    }}
                  />
                </div>

                <div className="col-sm-4 mt-1 mt-sm-0">
                  <label className="mb-1 font-weight-bold">Is Fee Applied</label>
                  <label className="container-R d-flex mb-0 pb-3">
                    <input
                      type="checkbox"
                      value="false"
                      onChange={(e) => this.handleCheckboxChange(e, "isFeeApplied")}
                      checked={this.state.isFeeApplied}
                    />
                    <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                  </label>
                </div>

                <div className="col-sm-4 mt-1 mt-sm-0">
                  <label className="mb-1 font-weight-bold">Is One Time</label>
                  <label className="container-R d-flex mb-0 pb-3">
                    <input
                      type="checkbox"
                      value="false"
                      onChange={(e) => this.handleCheckboxChange(e, "isOneTime")}
                      checked={this.state.isOneTime}
                    />
                    <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="modal-footer justify-content-center border-0 mt-3 mb-3">
            <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
              <button
                type="button"
                className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                onClick={this.props.onCloseModal}
              >
                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />{" "}
                Close
              </button>
              {this.props.props != undefined ? (
                <button
                  type="button"
                  className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                  onClick={this.handleUpdate}
                >
                  <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                </button>
              ) : (
                <React.Fragment>
                  <button
                    type="button"
                    className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                    onClick={this.handleSaveAndAddAnother}
                  >
                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save & Add Another
                  </button>
                  <button
                    type="button"
                    className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                    onClick={this.handleSaveAndClose}
                  >
                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save & Close
                  </button>
                </React.Fragment>
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }
}
export default CreateGlobalServiceType;