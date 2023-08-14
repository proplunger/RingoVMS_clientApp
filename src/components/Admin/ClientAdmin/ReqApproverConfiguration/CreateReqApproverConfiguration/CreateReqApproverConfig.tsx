import * as React from "react";
import auth from "../../../../Auth";
import ApprovalsWFGrid from "../../../../Shared/ApprovalsWFGrid/ApprovalsWFGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faSave, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { errorToastr, history, preventSubmitOnEnter, successToastr, warningToastr } from "../../../../../HelperMethods";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import clientAdminService from "../../Service/DataService";
import { reqApproverConfigValidation } from "./validations/validation";
import CommonInfo from "../../OnBoardingConfiguration/CreateOnBoardingConfiguration/CommonInfo";
import { REQ_APPROVER_CONFIGURATION_UPDATE_SUCCESS_MSG, REQ_APPROVER_CONFIGURATION_CREATE_SUCCESS_MSG, APPROVER_ERROR_MSG, APPROVER_WARNING_MSG } from "../../../../Shared/AppMessages";
import { AppPermissions } from "../../../../Shared/Constants/AppPermissions";
import { IWfApprovalLevelVm } from "../../../../Shared/ApprovalsWFGrid/models/IApprovalWfState";
import { EntityType, EntityTypeId } from "../../../../Shared/AppConstants";
import CommonInfoMultiselect from "../../OnBoardingConfiguration/CreateOnBoardingConfiguration/CommonInfoMultiselect";
import ReqApproverGroupTask from "../Common/ReqApproverGroupTasks";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";


export interface CreateReqApproverConfigurationProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateReqApproverConfigurationState {
    clientName?: string;
    clientId?: string;
    wfApprovalId?: string;
    wfApprovalGroupId?: string;
    divisionId?: string;
    locationId?: string;
    locId?: string;
    jobCategoryId?: string;
    positionId?: string;
    reqApprovers?: Array<IWfApprovalLevelVm>;
    entityType?: string;
    submitted: boolean;
    showLoader?: boolean;
    dataSet?: boolean;
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

class CreateReqApproverConfiguration extends React.Component<CreateReqApproverConfigurationProps, CreateReqApproverConfigurationState> {
    public reqApproverChild: any;
    //public task: any;
    constructor(props: CreateReqApproverConfigurationProps) {
        super(props);
        const { id, entityType } = this.props.match.params;
        this.state = {
            clientId: auth.getClient(),
            divisionId: "",
            locationId: "",
            locId: "",
            jobCategoryId: "",
            positionId: "",
            wfApprovalId: id,
            wfApprovalGroupId: id,
            reqApprovers: [],
            entityType: entityType,
            submitted: false,
            showLoader: true,
            dataSet: false,
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

    componentDidMount(){
        if(this.state.wfApprovalGroupId){
            this.setState({showLoader: true})
            this.getReqWfApprovalConfig(this.state.wfApprovalGroupId)
        }
    }

    handleObjChange = (change) => {
        this.setState(change);
    };

    handleDropdownChange = (e) => {
        // let change = {};
        // change[e.target.props.name] = e.target.value;
        // this.setState(change);
    };

    saveReqWfApprovalConfig(isSubmit: boolean, isSaveAndRemove: boolean) {
        let isValid = this.checkValidations();
        console.log(isValid)
        if (isValid) {
            let data = {
                entityType: this.state.entityType,
                clientId: this.state.clientId,
                Divisions: this.state.selectedDivisions.map((div) => div.id),
                Locations: this.state.selectedLocations.map((loc) => loc.id),
                Positions: this.state.selectedPositions.map((pos) => pos.id),
                isProfileUpdate: this.state.isProfileUpdate,
                isSaveAndRemove: isSaveAndRemove,
                wfApproverDetails: {
                    wfApprovalGroupId: this.state.wfApprovalGroupId,
                    wfApprovalLevel: this.state.reqApprovers,
                }
            };
            data["isSubmit"] = isSubmit;
            if (this.state.wfApprovalGroupId) {
                const { wfApprovalGroupId } = this.state;
                clientAdminService.putWfApprovalConfig(wfApprovalGroupId, data).then((res) => {
                    if (res.data && !res.data.isSuccess) {
                        errorToastr(res.data.statusMessage);
                        this.setState({
                          openExistingTasksGrid: true,
                          exisitingGroupIds: res.data.data,
                        });
                    } else {
                        successToastr(REQ_APPROVER_CONFIGURATION_UPDATE_SUCCESS_MSG);
                        history.goBack();
                    }
            });
            } else {
                data['tags'] = this.reqApproverChild.tagRef.state.selectedValues;
                clientAdminService.postWfApprovalConfig(data).then((res) => {
                    if (res.data && !res.data.isSuccess) {
                        errorToastr(res.data.statusMessage);
                        this.setState({
                          openExistingTasksGrid: true,
                          exisitingGroupIds: res.data.data,
                        });
                    } else {
                        successToastr(REQ_APPROVER_CONFIGURATION_CREATE_SUCCESS_MSG);
                        history.goBack();
                    }
                });
            }
        }
    }

    checkValidations() {
        let noReqApprover = this.state.reqApprovers.length <= 0;
        let hasUnsavedData = this.state.reqApprovers.filter(i => i.inEdit==true).length > 0;
        if(noReqApprover){
            errorToastr(APPROVER_ERROR_MSG);
            return false;
        } else if (hasUnsavedData) {
            warningToastr(APPROVER_WARNING_MSG);
            return false;
        }
        return true;
    }

    // not used for now
    // getReqWfApprovalConfig(wfApprovalId: string) {
    //     clientAdminService.getWfApprovalConfigDetail(wfApprovalId).then((res) => {
    //         const { data } = res;
    //         this.setState({
    //             wfApprovalId: data.id,
    //             clientId: data.clientId,
    //             divisionId: data.divId,
    //             locationId: data.locId,
    //             locId: data.locId,
    //             jobCategoryId: data.jobCategoryId,
    //             positionId: data.clientPosId,
    //             showLoader: false,
    //         }, () => { this.reqApproverChild.getLocations(this.state.divisionId); this.reqApproverChild.getPositions(this.state.jobCategoryId)});
    //     });
    // }

    handleCheckboxChange(e, modelProp) {
        var stateObj = {};
        stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
        this.setState(stateObj);
    }

    getReqWfApprovalConfig(wfApprovalGroupId: string) {
        
        clientAdminService
        .getWfApprovalDetails(this.state.clientId, this.state.entityType, wfApprovalGroupId)
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
                wfApprovalGroupId: data.wfApprovalGroupId,
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
                    this.reqApproverChild.getLocations(
                    this.state.selectedDivisions.map((div) => div.id)
                    );
                this.state.selectedJobCategory &&
                    this.state.selectedJobCategory.length > 0 &&
                    this.reqApproverChild.getPositions(
                    this.state.selectedJobCategory.map((cat) => cat.id)
                    );
                }
            );
        });
      }

    handleReqApproversChange = (data) => {
        if (this.state.wfApprovalGroupId && !this.state.dataSet) {
            this.setState({
                dataSet: true,
                reqApprovers: data.wfApprovalLevel
            })
            // this.setState({
            //     dataSet: true,
            //     clientId: data.clientId, divisionId: data.divId, locationId: data.locId, locId: data.locId,
            //     jobCategoryId: data.jobCategoryId, positionId: data.clientPosId, reqApprovers: data.wfApprovalLevel
            // });
            // data.divId && this.reqApproverChild.getLocations(data.divId);
            // data.jobCategoryId && this.reqApproverChild.getPositions(data.jobCategoryId);
        }
        else {
            this.setState({ reqApprovers: data.wfApprovalLevel });
        }
    };

    render() {
        const controlsToShow = ['CLIENT', 'DIVISION', 'LOCATION', 'POSITION', 'JOB CATEGORY']

        const {
            wfApprovalGroupId,
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
            wfApprovalGroupId,
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
                            <div>
                                {/* {this.state.wfApprovalGroupId ? "Edit" : "Add New"} Approver Configuration */}
                                <BreadCrumbs globalData={{wfApprovalGroupId:this.state.wfApprovalGroupId}}></BreadCrumbs>
                            </div>
                            {this.state.wfApprovalGroupId && (<div className="col pr-0 d-flex align-items-center justify-content-end">
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
                    validationSchema={reqApproverConfigValidation}
                    validateOnBlur={false}
                    onSubmit={(fields) => this.saveReqWfApprovalConfig(true, false)}
                    render={(formikProps) => (
                        <Form className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onKeyDown={preventSubmitOnEnter} onChange={formikProps.handleChange}>
                            {((wfApprovalGroupId && selectedDivisions) || !wfApprovalGroupId) &&
                            // <CommonInfo
                            //     ref={(instance) => {
                            //         this.reqApproverChild = instance;
                            //     }}
                            //     data={commonInfo}
                            //     Id={wfApprovalId}
                            //     handleObjChange={this.handleObjChange}
                            //     handleDropdownChange={this.handleDropdownChange}
                            //     formikProps={formikProps}
                            //     isTagsAllowed={true}
                            // />
                            <CommonInfoMultiselect
                                ref={(instance) => {
                                    this.reqApproverChild = instance;
                                }}
                                data={commonInfo}
                                Id={wfApprovalGroupId}
                                isInEdit={wfApprovalGroupId ? (this.state.isProfileUpdate ? false : true) : false}
                                handleObjChange={this.handleObjChange}
                                handleDropdownChange={this.handleDropdownChange}
                                formikProps={formikProps}
                                isTagsAllowed={true}
                                controlsToShow={controlsToShow}
                                />
                            }

                            <div>
                                <ApprovalsWFGrid
                                    wfApprovalId={wfApprovalGroupId ? wfApprovalGroupId : ""}
                                    entityId={null}
                                    entityType={this.state.entityType}
                                    clientId={clientId}
                                    permission={AppPermissions.REQ_APPROVE}
                                    canEdit={true}
                                    canEditDefault={true}
                                    key={this.state.entityType}
                                    handleApproversChange={this.handleReqApproversChange}
                                />
                            </div>

                            <div className="modal-footer justify-content-center border-0">
                                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                    <Link to={`/admin/${this.state.entityType}/approver/manage`}>
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
                    <ReqApproverGroupTask
                        Title={"Overlapping Onboarding Profile"}
                        Url={`/admin/${this.state.entityType}/approver/edit/`}
                        exisitingGroupIds={this.state.exisitingGroupIds}
                        clientId={this.state.clientId}
                        showDialog={this.state.openExistingTasksGrid}
                        handleNo={() => {
                        this.setState({ openExistingTasksGrid: false });
                        document.body.style.position = "";
                        }}
                        handleYes={() => {
                        this.setState({ openExistingTasksGrid: false });
                        this.saveReqWfApprovalConfig(true, true);
                        }}
                    />
                )}
            </div>
        );
    }

}

export default CreateReqApproverConfiguration;