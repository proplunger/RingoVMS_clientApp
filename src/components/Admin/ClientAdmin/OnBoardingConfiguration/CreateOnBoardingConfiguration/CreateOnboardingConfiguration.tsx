import * as React from "react";
import auth from "../../../../Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faSave, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { errorToastr, history, preventSubmitOnEnter, successToastr, warningToastr } from "../../../../../HelperMethods";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import clientAdminService from "../../Service/DataService";
import { onBoardingCnfigValidation } from "./validations/validation";
import CommonInfoMultiselect from "./CommonInfoMultiselect";
import { ONBOARDING_CONFIGURATION_CREATE_SUCCESS_MSG, ONBOARDING_CONFIGURATION_UPDATE_SUCCESS_MSG, TASK_ERROR_MSG, TASK_WARNING_MSG } from "../../../../Shared/AppMessages";
import Task from "./Task";
import OnboardingGroupTask from "../Common/OnboardingGroupTasks";
import { EDIT_ONBOARDING_CONFIGURATION } from "../../../../Shared/ApiUrls";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";


export interface CreateOnboardingConfigurationProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateOnboardingConfigurationState {
    clientId?: string;
    taskProfileGroupId?: string;
    clientName?: string;
    divisionId?: string;
    locationId?: string;
    locId?: string;
    jobCategoryId?: string;
    positionId?: string;
    submitted: boolean;
    isPrivate?: boolean;
    showLoader?: boolean;
    isDirty?: boolean;
    selectedDivisions: any;
    isAllDivSelected: boolean;
    selectedLocations: any;
    isAllLocSelected: boolean;
    selectedJobCategory: any;
    selectedPositions: any;
    isAllJobCatSelected: any;
    isAllJobPosSelected: any;
    openExistingTasksGrid: any;
    exisitingGroupIds: any;
    isProfileUpdate: boolean;
}

class CreateOnboardingConfiguration extends React.Component<
  CreateOnboardingConfigurationProps,
  CreateOnboardingConfigurationState
> {
  public onBoardingChild: any;
  public task: any;
  constructor(props: CreateOnboardingConfigurationProps) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      clientId: auth.getClient(),
      taskProfileGroupId: id,
      divisionId: "",
      locationId: "",
      locId: "",
      jobCategoryId: "",
      positionId: "",
      submitted: false,
      isDirty: false,
      showLoader: true,
      selectedDivisions: [],
      selectedLocations: [],
      selectedJobCategory: [],
      selectedPositions: [],
      isAllDivSelected: false,
      isAllLocSelected: false,
      isAllJobCatSelected: false,
      isAllJobPosSelected: false,
      openExistingTasksGrid: false,
      exisitingGroupIds: [],
      isProfileUpdate: false,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.getOnboardingConfigurationDetails(id);
    } else {
      this.setState({ showLoader: false });
    }
  }

  handleObjChange = (change) => {
    change["isDirty"] = true;
    this.setState(change);
  };

  handleDropdownChange = (e) => {  };

  saveOnoardingConfigurtion(isSubmit: boolean, isSaveAndRemove: boolean) {
    let isValid = this.checkValidations();
    if (isValid) {
      let data = {
        taskProfileGroupId: this.state.taskProfileGroupId,
        client: this.state.clientId,
        Divisions: this.state.selectedDivisions.map((div) => div.id),
        Locations: this.state.selectedLocations.map((loc) => loc.id),
        Positions: this.state.selectedPositions.map((pos) => pos.id),
        tasks: this.task.getTaskData().data,
        isSaveAndRemove: isSaveAndRemove,
        isProfileUpdate: this.state.isProfileUpdate
      };
      console.log(data, "(***(**");
      data["isSubmit"] = isSubmit;

      if (this.state.taskProfileGroupId) {
        const { taskProfileGroupId } = this.state;
        clientAdminService
          .putOnBoardingConfig(taskProfileGroupId, data)
          .then((res) => {
            if (res.data && !res.data.isSuccess) {
              errorToastr(res.data.statusMessage);
              this.setState({
                openExistingTasksGrid: true,
                exisitingGroupIds: res.data.data,
              });
            } else {
              successToastr(ONBOARDING_CONFIGURATION_UPDATE_SUCCESS_MSG);
              history.push("/admin/onboarding/manage");
            }
          });
      } else {
        data["tags"] = this.onBoardingChild.tagRef.state.selectedValues;
        clientAdminService.postOnBoardingConfig(data).then((res) => {
          if (res.data && !res.data.isSuccess) {
            errorToastr(res.data.statusMessage);
            this.setState({
              openExistingTasksGrid: true,
              exisitingGroupIds: res.data.data,
            });
          } else {
            successToastr(ONBOARDING_CONFIGURATION_CREATE_SUCCESS_MSG);
            history.push("/admin/onboarding/manage");
          }
        });
      }
    }
  }

  checkValidations() {
    let tasks = this.task.getTaskData();
    if (tasks.hasTask) {
      errorToastr(TASK_ERROR_MSG);
      return false;
    } else if (tasks.hasError) {
      warningToastr(TASK_WARNING_MSG);
      return false;
    }
    return true;
  }

  handleCheckboxChange(e, modelProp) {
    var stateObj = {};
    stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
    this.setState(stateObj);
  }

  getOnboardingConfigurationDetails(taskProfileGroupId: string) {
    clientAdminService
      .getOnBoardingConfigDetail(taskProfileGroupId)
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
        var cats = [];
        data.jobCategoryIds.map((x) =>
          cats.filter((a) => a.id==x.id).length > 0
            ? null
            : cats.push({ id: x.id, name: x.name })
        );
        var pos = [];
        data.positionIds.map((x) =>
          pos.filter((a) => a.name==x.name).length > 0
            ? null
            : pos.push({ id: x.id, name: x.name })
        );
        this.setState(
          {
            taskProfileGroupId: data.taskProfileGroupId,
            clientId: data.clientId,
            selectedDivisions: divs,
            selectedLocations: locs,
            selectedJobCategory: cats,
            selectedPositions: pos,
            showLoader: false,
          },
          () => {
            this.state.selectedDivisions &&
              this.state.selectedDivisions.length > 0 &&
              this.onBoardingChild.getLocations(
                this.state.selectedDivisions.map((div) => div.id)
              );
            this.state.selectedJobCategory &&
              this.state.selectedJobCategory.length > 0 &&
              this.onBoardingChild.getPositions(
                this.state.selectedJobCategory.map((cat) => cat.id)
              );
          }
        );
      });
  }

  render() {
    const controlsToShow = ['CLIENT', 'DIVISION', 'LOCATION', 'POSITION', 'JOB CATEGORY']

    const {
      taskProfileGroupId,
      clientId,
      selectedDivisions,
      selectedLocations,
      selectedJobCategory,
      selectedPositions,
      isAllDivSelected,
      isAllLocSelected,
      isAllJobCatSelected,
      isAllJobPosSelected,
    } = this.state;
    const commonInfo = {
      taskProfileGroupId,
      clientId,
      selectedDivisions,
      selectedLocations,
      selectedJobCategory,
      selectedPositions,
      isAllDivSelected,
      isAllLocSelected,
      isAllJobCatSelected,
      isAllJobPosSelected,
    };
    return (
      <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
        <div className="col-12">
          <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
            <div className="col-12 col-md-12 fonFifteen paddingLeftandRight">
               <div className="row mx-0 align-items-center">
                    <div><BreadCrumbs globalData={{taskProfileGroupId:this.state.taskProfileGroupId}}></BreadCrumbs>
                    </div>
                    {this.state.taskProfileGroupId && (<div className="col pr-0 d-flex align-items-center justify-content-end">
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
          validationSchema={onBoardingCnfigValidation}
          validateOnBlur={false}
          onSubmit={(fields) => this.saveOnoardingConfigurtion(true, false)}
          render={(formikProps) => (
            <Form
              className="col-12 ml-0 mr-0"
              id="collapsiblePadding"
              translate="yes"
              onKeyDown={preventSubmitOnEnter}
              onChange={formikProps.handleChange}
            >
              {((taskProfileGroupId && selectedDivisions) ||
                !taskProfileGroupId) && (
                <CommonInfoMultiselect
                  ref={(instance) => {
                    this.onBoardingChild = instance;
                  }}
                  data={commonInfo}
                  Id={taskProfileGroupId}
                  isInEdit={this.state.taskProfileGroupId ? (this.state.isProfileUpdate ? false : true) : false}
                  handleObjChange={this.handleObjChange}
                  handleDropdownChange={this.handleDropdownChange}
                  formikProps={formikProps}
                  isTagsAllowed={true}
                  controlsToShow={controlsToShow}
                />
              )}

              <div>
                <Task
                  ref={(instance) => {
                    this.task = instance;
                  }}
                  entityType="Task"
                  match={this.props.match}
                  canEdit={true}
                  key="Vendors"
                />
              </div>

              <div className="modal-footer justify-content-center border-0">
                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                  <Link to="/admin/onboarding/manage">
                    <button
                      type="button"
                      className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                      onClick={this.props.onCloseModal}
                    >
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className={"mr-1"}
                      />{" "}
                      Close
                    </button>
                  </Link>
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

        {this.state.openExistingTasksGrid && this.state.exisitingGroupIds && (
          <OnboardingGroupTask
            Title={"Overlapping Onboarding Profile"}
            Url={EDIT_ONBOARDING_CONFIGURATION}
            exisitingGroupIds={this.state.exisitingGroupIds}
            clientId={this.state.clientId}
            showDialog={this.state.openExistingTasksGrid}
            handleNo={() => {
              this.setState({ openExistingTasksGrid: false });
              document.body.style.position = "";
            }}
            handleYes={() => {
              this.setState({ openExistingTasksGrid: false });
              this.saveOnoardingConfigurtion(true, true);
            }}
          />
        )}
      </div>
    );
  }
}

export default CreateOnboardingConfiguration;