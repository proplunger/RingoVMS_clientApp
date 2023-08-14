import * as React from "react";
import {
  faChevronCircleDown,
  faChevronCircleUp,
  faSave,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Form } from "formik";
import Collapsible from "react-collapsible";
import Skeleton from "react-loading-skeleton";
// import Form from "reactstrap/lib/Form";
import auth from "../../../../Auth";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import withValueField from "../../../../Shared/withValueField";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import { filterBy } from "@progress/kendo-data-query";
import axios from "axios";
import { errorToastr, history, successToastr } from "../../../../../HelperMethods";
import { vendorTierValidation } from "./validations/validation";
import { ErrorComponent } from "../../../../ReusableComponents";
import CommonInfoMultiselect from "../../OnBoardingConfiguration/CreateOnBoardingConfiguration/CommonInfoMultiselect";
import VendorTierGroupTasks from "../Common/VendorTierGroupTasks";
import { EDIT_VENDOR_TIER } from "../../../../Shared/ApiUrls";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { UPDATE_REQ_RELEASE_TIER_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select...", id: null };
const defaultVendor = { vendor: "Select Vendor", vendorId: null };

interface CreateVendorTiersProps {
  props: any;
  clientId: string;
  match: any;
}

interface CreateVendorTiersState {
  id?: string;
  clientVendorId?: string;
  toggleFirst?: boolean;
  toggleAll?: boolean;
  submitted: boolean;
  showLoader: boolean;
  clientName: string;
  divisions: Array<IDropDownModel>;
  divisionsId?: any;
  locationsId?: any;
  // locationId?: string;
  originaldivisions: Array<IDropDownModel>;
  originallocations: Array<IDropDownModel>;
  originalvendors: Array<IDropDownModel>;
  originalvendorTiers: Array<IDropDownModel>;
  clientId: string;
  locations: Array<IDropDownModel>;
  vendors: Array<IDropDownModel>;
  vendorTiers: Array<IDropDownModel>;
  vendorId?: string;
  vendorTierId?: string;
  // divisionId?: string;
  allSelectedDivision?: boolean;
  allSelectedLocation?: boolean;
  dropdownOpened?: boolean;
  selectedDivisions: any;
  isAllDivSelected: boolean;
  selectedLocations: any;
  isAllLocSelected: boolean;
  isProfileUpdate: boolean;
  openExistingTasksGrid: boolean;
  exisitingGroupIds: any;
  showUpdateReqReleaseModal?: boolean;
}

export enum ALLSELECTED {
  ALLDIVISIONS = "All Divisions",
  ALLLOCATIONS = "All Locations"
}

class CreateVendorTiers extends React.Component<
  CreateVendorTiersProps,
  CreateVendorTiersState
> {
  public vendorTierChild: any;
  constructor(props: CreateVendorTiersProps) {
    super(props);
    const { id } = this.props.match.params;

    this.state = {
      toggleFirst: true,
      toggleAll: true,
      clientVendorId: id,
      showLoader: true,
      clientName: auth.getClientName(),
      clientId: auth.getClient(),
      divisions: [],
      submitted: false,
      originaldivisions: [],
      locations: [],
      originallocations: [],
      vendors: [],
      originalvendors: [],
      vendorTiers: [],
      originalvendorTiers: [],
      divisionsId: [],
      locationsId: [],
      allSelectedDivision: false,
      allSelectedLocation: false,
      isProfileUpdate: false,
      selectedDivisions: [],
      selectedLocations: [],
      isAllDivSelected: false,
      isAllLocSelected: false,
      openExistingTasksGrid: false,
      exisitingGroupIds: [],
      showUpdateReqReleaseModal: false,
    };
  }

  componentDidMount() {
    // this.getClientDivision();
    this.getVendor();
    this.getVendorTier();

    const { id } = this.props.match.params;

    if (id){
      this.getVendorProfileDetails(id)
      this.getVendorTierDetails(id)
    }
  }

  getVendor = () => {
    const { clientId } = this.state;

    const queryParams = `status eq 'Active'&$orderby=vendor`;
    axios
      .get(`api/clients/${clientId}/vendor?$filter=${queryParams}`)
      .then(async (res) => {
        this.setState({ vendors: res.data, originalvendors: res.data, showLoader: false });
      });
  };

  handleVendorChange = (e) => {
    const Id = e.target.value;
    this.setState({ vendorId: Id });
  };

  getVendorTier = () => {
    axios.get(`api/vendor/vendortiertype`).then(async (res) => {
      this.setState({ vendorTiers: res.data, originalvendorTiers: res.data, showLoader: false });
    });
  };

  handleVendorTierChange = (e) => {
    const Id = e.value.id;
    this.setState({ vendorTierId: Id });
  };

  getVendorTierDetails = (id) => {
    axios.get(`api/vendor/client/${this.state.clientId}/vendortiers`).then((res) => {
        res.data.map(item => { 
          if(item.id==id){
            this.setState({
              id: item.id,
              clientName: item.client,
              vendorId: item.vendorId,
              vendorTierId: item.tierId,
              // divisionId: item.clientDivId,
              // locationId: item.clientDivLocId
            })

          }
        })
    });

  }

  getVendorProfileDetails(vendorTierProfileGroupId: string) {
    axios.get(`api/vendor/vendortier/${vendorTierProfileGroupId}`)
      .then((res) => {
        
        const { data } = res;
        var divs = [];
        data.divisionIds.map((x) =>
          divs.filter((a) => a.id==x.id).length > 0
            ? null
            : divs.push({ id: x.id, name: x.name })
        );
        var locs = [];
        data.locationIds.map((x) =>
          locs.filter((a) => a.id==x.id).length > 0
            ? null
            : locs.push({ id: x.id, name: x.name })
        );
        this.setState(
          {
            clientVendorId: data.vendorClientTierProfileGroupId,
            clientId: data.clientId,
            selectedDivisions: divs,
            selectedLocations: locs,
            showLoader: false,
          },
          () => {
            this.state.selectedDivisions &&
              this.state.selectedDivisions.length > 0 &&
              this.vendorTierChild.getLocations(
                this.state.selectedDivisions.map((div) => div.id)
              );
          }
        );
      });
  }

  handleFilterChange = (event) => {
    var name = event.target.props.id;
    var originalArray = "original" + name;
    this.state[name] = this.filterData(event.filter, originalArray);
    this.setState(this.state);
  };

  filterData(filter, originalArray) {
    const data1 = this.state[originalArray];
    return filterBy(data1, filter);
  }

  onCollapseOpen = () => {
    this.setState({
      toggleAll: true,
      toggleFirst: true,
    });
  };

  onCollapseClose = () => {
    this.setState({
      toggleAll: false,
      toggleFirst: false,
    });
  };

  itemRender = (li, itemProps) => {
    const itemChildren = (
      <span>
        <input type="checkbox" checked={
          itemProps.dataItem.name=="All Division" ? this.state.allSelectedDivision:
          itemProps.dataItem.name=="All Location" ? this.state.allSelectedLocation:                  
         itemProps.selected} onChange={() => { }} />
        &nbsp;{li.props.children}
      </span>
    );
    return React.cloneElement(li, li.props, itemChildren);
  }

  saveVendorTier = (isSubmit: boolean, isSaveAndRemove: boolean, isUpdateReqRelease: boolean) => {
    const {id} = this.state;
    let data = {
      client: this.state.clientId,
      divisions: this.state.selectedDivisions.map((div) => div.id),
      locations: this.state.selectedLocations.map((loc) => loc.id),
      vendor: this.state.vendorId,
      vendorTier: this.state.vendorTierId,
      isSaveAndRemove: isSaveAndRemove,
      isProfileUpdate: this.state.isProfileUpdate,
      isUpdateReqRelease: isUpdateReqRelease
    };

    if (this.state.id){
      data['VendorClientTierId'] = this.state.id;
      axios.put(`api/vendor/vendortier/${id}`, JSON.stringify(data)).then((res) => {

        if (res.data && !res.data.isSuccess && res.data.statusMessage !=null) {
          errorToastr(res.data.statusMessage);
          this.setState({
            openExistingTasksGrid: true,
            exisitingGroupIds: res.data.data,
          });
        } else if (!res.data.isSuccess && res.data.statusMessage==null) {
            // errorToastr(res.data.statusMessage);
            this.setState({
              showUpdateReqReleaseModal: true,
            });
        }else{
          history.push('/admin/vendortiers/manage');
          successToastr("Vendor Tier updated successfully");
        }
        
       });
    }else{
      data['tags'] = this.vendorTierChild.tagRef.state.selectedValues;
      axios.post(`api/vendor/vendortier`, JSON.stringify(data)).then((res) => {
        if (res.data && !res.data.isSuccess) {
          errorToastr(res.data.statusMessage);
          this.setState({
            openExistingTasksGrid: true,
            exisitingGroupIds: res.data.data,
          });
        }else{
          history.push('/admin/vendortiers/manage');
          successToastr("Vendor Tier created successfully");
        }
        
      }); 
    }
  };

  handleCheckboxChange(e, modelProp) {
    var stateObj = {};
    stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
    this.setState(stateObj);
  }

  handleObjChange = (change) => {
    change["isDirty"] = true;
    this.setState(change);
  }

  handleDropdownChange = () => {

  }

  onFocusEvent = () => {
    this.setState({ dropdownOpened: true })
  }

  onBlurEvent = () => {
    this.setState({ dropdownOpened: false })
  }

  render() {
    const { toggleFirst, toggleAll } = this.state;
    const controlsToShow = ['CLIENT', 'DIVISION', 'LOCATION']

    const {
      clientVendorId,
      clientId,
      selectedDivisions,
      selectedLocations,
      isAllDivSelected,
      isAllLocSelected,
  } = this.state;

    const commonInfo = {
      clientVendorId,
      clientId,
      selectedDivisions,
      selectedLocations,
      isAllDivSelected,
      isAllLocSelected,
    };

    const reqTriggerDetail = (
      <span>
        Vendor Tier Details
        <span
          className="d-none d-sm-block"
          style={{ float: "right", marginRight: "25px" }}
        ></span>
      </span>
    );
    return (
      <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
        <div className="col-12">
          <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
            <div className="col-12 col-md-12 fonFifteen paddingLeftandRight">
            <div className="row mx-0 align-items-center">
                
                <BreadCrumbs globalData={{vendorClientTierProfileGroupId:this.state.clientVendorId}}></BreadCrumbs>
                        

                {this.state.clientVendorId && (<div className="col pr-0 d-flex align-items-center justify-content-end">
                    <span className=" d-none d-sm-inline">
                    <label className="container-R d-flex mb-0 pb-0 dispaly-ssn-inline">
                        <span className="Introduction-line-height pl-0">
                            Edit Profile
                        </span>
                        <input
                            type="checkbox"
                            onChange={(e) =>
                            this.handleCheckboxChange(e, "isProfileUpdate")
                            }
                        />
                        <span
                            className="checkmark-R checkPosition checkPositionTop"
                            style={{ left: "0px" }}
                        ></span>
                    </label>
                    </span>
                </div>)}
              </div>
            </div>

          </div>
        </div>

        <Formik
          validateOnMount={this.state.submitted}
          initialValues={this.state}
          validateOnChange={false}
          enableReinitialize={true}
          validationSchema={vendorTierValidation}
          validateOnBlur={false}
          onSubmit={(fields) => this.saveVendorTier(true, false, false)}
          render={(formikProps) => (
            <Form
              className="col-12 ml-0 mr-0"
              id="collapsiblePadding"
              translate="yes"
              onChange={formikProps.handleChange}
              autoComplete="false"
            >
            
                {this.state.showLoader &&
                  Array.from({ length: 2 }).map((item, i) => (
                    <div className="row mx-auto mt-2" key={i}>
                      {Array.from({ length: 3 }).map((item, j) => (
                        <div
                          className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1"
                          key={j}
                        >
                          <Skeleton width={100} />
                          <Skeleton height={30} />
                        </div>
                      ))}
                  </div>
                ))}

                {!this.state.showLoader && (
                  <div>
                      <CommonInfoMultiselect
                        ref={(instance) => {
                            this.vendorTierChild = instance;
                        }}
                        data={commonInfo}
                        Id={clientVendorId}
                        handleObjChange={this.handleObjChange}
                        handleDropdownChange={this.handleDropdownChange}
                        formikProps={formikProps}
                        isInEdit={this.state.clientVendorId ? (this.state.isProfileUpdate ? false : true) : false}
                        isTagsAllowed={true}
                        controlsToShow={controlsToShow}
                      />

                    <Collapsible
                      trigger={reqTriggerDetail}
                      open={toggleFirst}
                      accordionPosition="1"
                      onTriggerOpening={() => this.setState({ toggleFirst: true })}
                      onTriggerClosing={() => this.setState({ toggleFirst: false })}
                    >
                      <div className="row mt-3 mx-0">
                        <div className="col-12 col-sm-4 pl-0 pr-0">
                          <label className="mb-1 font-weight-bold required">
                            Vendor
                          </label>
                          <CustomDropDownList
                            className={"form-control"}
                            data={this.state.vendors}
                            name="vendor"
                            textField="vendor"
                            valueField="vendorId"
                            id="vendors"
                            defaultItem={defaultVendor}
                            value={this.state.vendorId}
                            onChange={(e) => this.handleVendorChange(e)}
                            filterable={
                              this.state.originalvendors.length > 5 ? true : false
                            }
                            onFilterChange={this.handleFilterChange}
                          />
                          {formikProps.errors.vendorId && (
                            <ErrorComponent
                              message={formikProps.errors.vendorId}
                            />
                          )}
                        </div>

                        <div className="col-12 col-sm-4">
                          <label className="mb-1 font-weight-bold required">
                            Vendor Tier
                          </label>
                          <CustomDropDownList
                            className="form-control"
                            name={`id`}
                            data={this.state.vendorTiers}
                            textField="name"
                            valueField="id"
                            id="vendorTiers"
                            defaultItem={defaultItem}
                            value={this.state.vendorTierId}
                            onChange={(e) => this.handleVendorTierChange(e)}
                            filterable={
                              this.state.originalvendorTiers.length > 5
                                ? true
                                : false
                            }
                            onFilterChange={this.handleFilterChange}
                          />
                          {formikProps.errors.vendorTierId && (
                            <ErrorComponent
                              message={formikProps.errors.vendorTierId}
                            />
                          )}
                        </div>
                      </div>
                      
                    </Collapsible>
                  </div>
                )}

              <div className="modal-footer justify-content-center border-0 mt-3 mb-3">
                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                  <button
                    type="button"
                    className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                    onClick={() => history.push('/admin/vendortiers/manage')}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />{" "}
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                    onClick={() => this.setState({ submitted: true })}
                  >
                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                  </button>
                </div>
              </div>
            </Form>
          )}
        />

        {this.state.id && this.state.showUpdateReqReleaseModal && (
            <ConfirmationModal
                message={UPDATE_REQ_RELEASE_TIER_CONFIRMATION_MSG()}
                showModal={this.state.showUpdateReqReleaseModal}
                handleYes={() => {
                    this.setState({ showUpdateReqReleaseModal: false });
                    this.saveVendorTier(true, false, true);
                }}
                handleNo={() => {
                    this.setState({ showUpdateReqReleaseModal: false });
                }}
            />
        )}

        {this.state.openExistingTasksGrid && this.state.exisitingGroupIds && (
          <VendorTierGroupTasks
            Title={"Overlapping Vendor Profile"}
            Url={EDIT_VENDOR_TIER}
            exisitingGroupIds={this.state.exisitingGroupIds}
            clientId={this.state.clientId}
            showDialog={this.state.openExistingTasksGrid}
            handleNo={() => {
              this.setState({ openExistingTasksGrid: false });
              document.body.style.position = "";
            }}
            handleYes={() => {
              this.setState({ openExistingTasksGrid: false });
              this.saveVendorTier(true, true, false);
            }}
          />
        )}
      </div>
    );
  }
}

export default CreateVendorTiers;
