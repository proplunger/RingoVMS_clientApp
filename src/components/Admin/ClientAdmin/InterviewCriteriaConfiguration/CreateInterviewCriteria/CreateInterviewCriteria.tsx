import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faUserCircle, faChevronCircleDown, faChevronCircleUp, faClock, faSave, faTimesCircle, faHistory, faEye } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../../Auth";
import axios from "axios";
import globalAdminService from "../../../GlobalAdmin/Service/DataService";
import { errorToastr, history, successToastr, warningToastr } from "../../../../../HelperMethods";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { ErrorComponent, FormatPhoneNumber } from "../../../../ReusableComponents";
import { interviewCriteriaValidation } from "./validations/validation";
import clientAdminService from "../../Service/DataService";
import commonService from "../../../../Shared/Services/CommonDataService";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import withValueField from "../../../../Shared/withValueField";
import Skeleton from "react-loading-skeleton";
import { filterBy } from "@progress/kendo-data-query";
import { CRITERIA_ERROR_MSG, CRITERIA_WARNING_MSG, INTERVIEW_CRITERIA_CREATE_SUCCESS_MSG, INTERVIEW_CRITERIA_UPDATE_SUCCESS_MSG } from "../../../../Shared/AppMessages";
import Criteria from "./Criteria";
import CommonInfo from "../../OnBoardingConfiguration/CreateOnBoardingConfiguration/CommonInfo";
import CommonInfoMultiselect from "../../OnBoardingConfiguration/CreateOnBoardingConfiguration/CommonInfoMultiselect";
import InterviewCriteriaGroupTask from "../Common/InterviewCriteriaGroupTasks";
import { EDIT_INTERVIEW_CRITERIA_CONFIG } from "../../../../Shared/ApiUrls";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select...", id: null };

export interface CreateInterviewCriteriaProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateInterviewCriteriaState {
    clientId?: string;
    clientName?: string;
    interviewCriteriaGroupId?: string;
    divisionId?: string;
    locationId?: string;
    locId?: string;
    jobCategoryId?: string;
    positionId?: string;
    submitted: boolean;
    openCommentBox?: boolean;
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

class CreateInterviewCriteria extends React.Component<CreateInterviewCriteriaProps, CreateInterviewCriteriaState> {
    public interviewCriteriaChild: any;
    public criteria: any;
    constructor(props: CreateInterviewCriteriaProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            clientId: auth.getClient(),
            clientName: auth.getClientName(),
            interviewCriteriaGroupId: id,
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
            isProfileUpdate: false
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        if (id) {
            this.getInterviewCriteriaDetails(id);

        } else {
            this.setState({ showLoader: false });
        }
    }

    handleCheckboxChange(e, modelProp) {
        var stateObj = {};
        stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
        this.setState(stateObj);
    }

    handleObjChange = (change) => {
        change["isDirty"] = true;
        this.setState(change);
    };

    handleDropdownChange = (e) => {
        
    };

    saveInterviewCriteria(isSubmit: boolean, isSaveAndRemove: boolean) {
        let isValid = this.checkValidations();
        if (isValid) {
            let data = {
                interviewCriteriaGroupId: this.state.interviewCriteriaGroupId,
                clientId: this.state.clientId,
                Divisions: this.state.selectedDivisions.map((div) => div.id),
                Locations: this.state.selectedLocations.map((loc) => loc.id),
                Positions: this.state.selectedPositions.map((pos) => pos.id),
                criterias: this.criteria.getCriteriaData().data,
                isSaveAndRemove: isSaveAndRemove,
                IsCritUpdate: this.state.isProfileUpdate
            };
            data["isSubmit"] = isSubmit;
            if (this.state.interviewCriteriaGroupId) {
                const { interviewCriteriaGroupId } = this.state;
                clientAdminService.putInterviewCriteria(interviewCriteriaGroupId, data).then((res) => {
                    if (res.data && !res.data.isSuccess) {
                        errorToastr(res.data.statusMessage);
                        this.setState({
                          openExistingTasksGrid: true,
                          exisitingGroupIds: res.data.data,
                        });
                    } else {
                        successToastr(INTERVIEW_CRITERIA_UPDATE_SUCCESS_MSG);
                        history.push('/admin/interviewcriteria/manage');
                    }
                });
            } else {
                data['tags'] = this.interviewCriteriaChild.tagRef.state.selectedValues;
                clientAdminService.postInterviewCriteria(data).then((res) => {
                    if (res.data && !res.data.isSuccess) {
                        errorToastr(res.data.statusMessage);
                        this.setState({
                          openExistingTasksGrid: true,
                          exisitingGroupIds: res.data.data,
                        });
                    } else {
                        successToastr(INTERVIEW_CRITERIA_CREATE_SUCCESS_MSG);
                        history.push('/admin/interviewcriteria/manage');
                    }
                });
            }
        }
    }

    checkValidations() {
        let criterias = this.criteria.getCriteriaData();
        if (criterias.hasCriteria) {
            errorToastr(CRITERIA_ERROR_MSG);
            return false;
        } else if (criterias.hasError) {
            warningToastr(CRITERIA_WARNING_MSG);
            return false;
        }
        return true;
    }

    getInterviewCriteriaDetails(interviewCriteriaGroupId: string) {
        clientAdminService.getInterviewCriteriaDetail(interviewCriteriaGroupId).then((res) => {
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
                interviewCriteriaGroupId: data.clientIntvwCritGroupId,
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
                this.interviewCriteriaChild.getLocations(
                    this.state.selectedDivisions.map((div) => div.id)
                );
                this.state.selectedJobCategory &&
                this.state.selectedJobCategory.length > 0 &&
                this.interviewCriteriaChild.getPositions(
                    this.state.selectedJobCategory.map((cat) => cat.id)
                );
            }
            );
        });
    }

    render() {
        const controlsToShow = ['CLIENT', 'DIVISION', 'LOCATION', 'POSITION', 'JOB CATEGORY']

        const {
            interviewCriteriaGroupId,
            clientId,
            selectedDivisions,
            selectedLocations,
            selectedJobCategory,
            selectedPositions,
            isAllDivSelected,
            isAllLocSelected,
            isAllJobCatSelected,
            isAllJobPosSelected
        } = this.state;
        const commonInfo = {
            interviewCriteriaGroupId,
            clientId,
            selectedDivisions,
            selectedLocations,
            selectedJobCategory,
            selectedPositions,
            isAllDivSelected,
            isAllLocSelected,
            isAllJobCatSelected,
            isAllJobPosSelected
        };
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-12 col-md-12 fonFifteen paddingLeftandRight">
                            <div className="row mx-0 align-items-center">
                                <div>
                                <BreadCrumbs globalData={{clientIntvwCritGroupId:this.state.interviewCriteriaGroupId}}></BreadCrumbs>
                                </div>
                                {this.state.interviewCriteriaGroupId && (<div className="col pr-0 d-flex align-items-center justify-content-end">
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
                    validationSchema={interviewCriteriaValidation}
                    validateOnBlur={false}
                    onSubmit={(fields) => this.saveInterviewCriteria(true, false)}
                    render={(formikProps) => (
                        <Form className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onChange={formikProps.handleChange}>
                            {((interviewCriteriaGroupId && selectedDivisions) || !interviewCriteriaGroupId) &&
                                <CommonInfoMultiselect
                                    ref={(instance) => {
                                        this.interviewCriteriaChild = instance;
                                    }}
                                    data={commonInfo}
                                    Id={interviewCriteriaGroupId}
                                    isInEdit={this.state.interviewCriteriaGroupId ? (this.state.isProfileUpdate ? false : true) : false}
                                    handleObjChange={this.handleObjChange}
                                    handleDropdownChange={this.handleDropdownChange}
                                    formikProps={formikProps}
                                    isTagsAllowed={true}
                                    controlsToShow={controlsToShow}
                                />
                            }

                            <Criteria
                                ref={(instance) => {
                                    this.criteria = instance;
                                }}
                                entityType="Client"
                                match={this.props.match}
                                // criteriaId={this.state.interviewCriteriaId}
                                canEdit={true}
                                key="Vendors"
                            />

                            <div className="modal-footer justify-content-center border-0">
                                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                    <Link to="/admin/interviewcriteria/manage">
                                        <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                        </button>
                                    </Link>
                                    <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true })}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                />
                {this.state.openExistingTasksGrid && this.state.exisitingGroupIds && (
                    <InterviewCriteriaGroupTask
                        Title={"Overlapping Interview Criteria Profile"}
                        Url={EDIT_INTERVIEW_CRITERIA_CONFIG}
                        exisitingGroupIds={this.state.exisitingGroupIds}
                        clientId={this.state.clientId}
                        showDialog={this.state.openExistingTasksGrid}
                        handleNo={() => {
                        this.setState({ openExistingTasksGrid: false });
                        document.body.style.position = "";
                        }}
                        handleYes={() => {
                        this.setState({ openExistingTasksGrid: false });
                        this.saveInterviewCriteria(true, true);
                        }}
                    />
                )}
            </div>
        );
    }
}

export default CreateInterviewCriteria;