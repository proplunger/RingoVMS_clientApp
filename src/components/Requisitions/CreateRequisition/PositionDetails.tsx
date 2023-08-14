import * as React from "react";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { DatePicker, TimePicker } from "@progress/kendo-react-dateinputs";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import axios from "axios";
import { IPositionDetails } from "./models/IPositionDetails";
import { ErrorComponent } from "../../ReusableComponents";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton from "react-loading-skeleton";
import { calculateBudget, clientSettingsData } from "../../../HelperMethods";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { AppPermissions } from "../../Shared/Constants/AppPermissions";
import auth from "../../Auth";
import { AuthRoleType, isRoleType, isVendorRoleType, SettingCategory, SETTINGS } from "../../Shared/AppConstants";
import commonService from "../../Shared/Services/CommonDataService";
const defaultItem = { name: "Select...", id: null };

export interface PositionDetailsProps {
    data?: IPositionDetails;
    clientId: string;
    handlePositionChange: any;
    handleObjChange: any;
    formikProps: any;
    disableReg?: boolean;
}

export interface PositionDetailsState {
    jobWfTypes: Array<IDropDownModel>;
    originaljobWfTypes?: Array<IDropDownModel>;
    jobCategories: Array<IDropDownModel>;
    originaljobCategories?: Array<IDropDownModel>;
    positions: Array<IDropDownModel>;
    originalpositions?: Array<IDropDownModel>;
    positionSkills: Array<IDropDownModel>;
    originalpositionSkills?: Array<IDropDownModel>;
    assignmentTypes: Array<IDropDownModel>;
    originalassignmentTypes?: Array<IDropDownModel>;
    hiringManagers: Array<IDropDownModel>;
    originalhiringManagers?: Array<IDropDownModel>;
    showLoader?: boolean;
    holidays?: any;
    positionDocName?: string;
    positionDocUrl?: string;
    isDisablePosDesc?: boolean;
}

class PositionDetails extends React.Component<PositionDetailsProps, PositionDetailsState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    constructor(props: PositionDetailsProps) {
        super(props);
        this.state = {
            jobWfTypes: [],
            jobCategories: [],
            positions: [],
            positionSkills: [],
            assignmentTypes: [],
            hiringManagers: [],
            originaljobWfTypes: [],
            originaljobCategories: [],
            originalpositions: [],
            originalpositionSkills: [],
            originalassignmentTypes: [],
            originalhiringManagers: [],
            holidays: [],
            showLoader: true,
            positionDocName: "",
            positionDocUrl: ""
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        const { data, clientId } = this.props;
        if (data.reqId) {
            this.getPositionDetails(data.reqId);
        }
        if (clientId) {
            this.getJobWfTypes(clientId);
            this.getJobCategories(clientId)
            this.getAssignments(clientId);
            this.getHiringMangers(clientId);
            this.getHolidays(clientId);
        } else {
            this.setState({ showLoader: false });
        }
        this.getClientSettings(clientId);
    }

    //gets position details based on reqId
    getPositionDetails(reqId: string) {
        axios.get(`api/requisitions/${reqId}/position`).then((res) => {
            const reqPosition = { ...res.data };
            this.props.handleObjChange({ reqPosition });
            // if (reqPosition.jobWf && reqPosition.jobWf.id !=null) {
            //     this.getJobCategories(this.props.clientId);
            // }
            if (reqPosition.jobCategory && reqPosition.jobCategory.id !=null) {
                this.getJobPositions(reqPosition.jobCategory.id);
            }
            if (reqPosition.jobPosition && reqPosition.jobPosition.id !=null) {
                this.getPositionSkills(reqPosition.jobPosition.id);
                this.getPositionDocument(reqPosition.jobPosition.id);
            }
        });
    }

    getJobWfTypes(clientId) {
        axios.get(`api/clients/${clientId}/jobtypes`).then((res) => {
            this.setState({ jobWfTypes: res.data, originaljobWfTypes: res.data });
        });
    }

    // handling division cascase dropdown change
    handleJobWfTypeChange = (e) => {
        const jobWf = e.target.value;
        const reqPosition = {
            jobWf: jobWf,
            // jobCategory: { id: null, name: "Select..." },
            // jobPosition: { id: null, name: "Select..." },
            // positionDesc: null,
            // positionSkillMapping: [],
        };
        this.props.handleObjChange({ reqPosition });
        // if (jobWf.id !=null) {
        //     this.getJobCategories(jobWf.id);
        // } else {
        //     this.setState({ jobCategories: [] });
        // }
    };

    getJobCategories(clientId) {
        axios.get(`api/clients/${clientId}/positions/categories?$orderby=name`).then((res) => {
            this.setState({
                jobCategories: res.data,
                originaljobCategories: res.data,
            });
        });
    }

    // handling jobCategory cascade dropdown change
    handleJobCategoryChange = (e) => {
        const jobCategory = e.target.value;
        const reqPosition = {
            jobCategory: jobCategory,
            jobPosition: { id: null, name: "Select..." },
            positionDesc: "",
            positionSkillMapping: [],
        };
        this.props.handleObjChange({ reqPosition });
        if (jobCategory.id !=null) {
            this.getJobPositions(jobCategory.id);
        } else {
            this.setState({ positions: [] });
        }
    };

    getJobPositions(jobCategoryId) {
        axios.get(`api/clients/${this.props.clientId}/jobcategories/${jobCategoryId}/jobpositions?$orderby=name`).then((res) => {
            this.setState({
                positions: res.data,
                originalpositions: res.data,
            });
        });
    }

    // handling jobPosition cascade dropdown change
    handleJobPositionChange = (e) => {
        const jobPosition = e.target.value;
        const reqPosition = {
            jobPosition: jobPosition,
            positionDesc: jobPosition.description || "",
            positionSkillMapping: [],
        };
        this.props.handleObjChange({ reqPosition });
        if (jobPosition.id !=null) {
            this.getPositionSkills(jobPosition.id);
            this.getPositionDocument(jobPosition.id);
        } else {
            this.setState({ positionSkills: [] });
            this.setState({ positionDocName: "", positionDocUrl: "" });
        }
    };

    getPositionSkills(jobPositionId) {
        axios.get(`api/clients/jobtypes/jobcategories/jobpositions/${jobPositionId}/skills`).then((res) => {
            this.setState({
                positionSkills: res.data,
                originalpositionSkills: res.data,
            });
        });
    }

    getPositionDocument = (jobPositionId) => {
        axios.get(`api/clients/positions/${jobPositionId}/document`).then((res) => {
            if (res.data) {

                this.setState({ positionDocName: res.data.fileName, positionDocUrl: res.data.filePath });
            }
            else {
                this.setState({ positionDocName: "", positionDocUrl: "" });
            }
        });
    };

    getAssignments(clientId) {
        axios.get(`api/clients/${clientId}/assignments?$orderby=name`).then((res) => {
            this.setState({
                assignmentTypes: res.data,
                originalassignmentTypes: res.data,
            });
        });
    }

    getHiringMangers(clientId) {
        axios.get(`api/clients/${clientId}/approvers?$filter=permCode eq '${AppPermissions.CAND_INTVW_RESULT_CREATE}' &$orderby=name`).then((res) => {
            this.setState({
                hiringManagers: res.data,
                originalhiringManagers: res.data,
                showLoader: false,
            }, () => {
                if (document.getElementsByName('startDate')) {
                    document.getElementsByName('startDate')[0]['disabled'] = true;
                    document.getElementsByName('endDate')[0]['disabled'] = true;
                    document.getElementsByName('shiftStartTime')[0]['disabled'] = true;
                    document.getElementsByName('shiftEndTime')[0]['disabled'] = true;
                }
            });
        });
    }

    getHolidays(clientId, startDate?, endDate?) {
        axios.get(`api/clients/${clientId}/holidays`).then((res) => {
            this.setState({ holidays: res.data }, () => { this.updateBudget(); });
        });
    }

    handleFilterChange(event) {
        var name = event.target.props.id;
        var originalArray = "original" + name;
        this.state[name] = this.filterData(event.filter, originalArray);
        this.setState(this.state);
    }

    filterData(filter, originalArray) {
        const originalData = this.state[originalArray];
        return filterBy(originalData, filter);
    }

    updateBudget = (e?: any) => {
        if (e) {
            this.props.handlePositionChange(e);
        }
        const { billRate, startDate, endDate, shiftStartTime, shiftEndTime, noOfReqStaff } = this.props.data;
        const data = {
            billRate,
            startDate,
            endDate,
            shiftStartTime,
            shiftEndTime,
            noOfReqStaff,
        };
        if (new Date(startDate).getFullYear() !=new Date(endDate).getFullYear()) {
            axios.get(`api/clients/${this.props.clientId}/holidays?startDate=${new Date(startDate).toDateString()}&endDate=${new Date(endDate).toDateString()}`).then((res) => {
                const budget = calculateBudget(data, res.data);
                const reqPosition = {
                    budget: budget,
                };
                this.props.handleObjChange({ reqPosition });
            });
        }
        else {
            const budget = calculateBudget(data, this.state.holidays);
            const reqPosition = {
                budget: budget,
            };
            this.props.handleObjChange({ reqPosition });
        }
    };

    getClientSettings = (id) => {
        this.setState({ showLoader: true })
        clientSettingsData(id, SettingCategory.REQUISITION, SETTINGS.EDIT_POSITION_DESCRIPTION, (response) => {
            this.setState({ isDisablePosDesc: response });
        });
    };

    render() {
        const { data, formikProps, disableReg } = this.props;
        const hasJobType = data.jobWf && data.jobWf.id != defaultItem.id;
        const hasJobCategory = data.jobCategory && data.jobCategory.id != defaultItem.id;
        const hasJobPosition = data.jobPosition && data.jobPosition.id != defaultItem.id;

        return (
            <div className="">
                <div className="row">
                    <div className="col-12 pl-0 pr-0">
                        {this.state.showLoader &&
                            Array.from({ length: 5 }).map((item, i) => (
                                <div className="row mx-auto mt-2" key={i}>
                                    {Array.from({ length: 3 }).map((item, j) => (
                                        <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
                                            <Skeleton width={100} />
                                            <Skeleton height={30} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        {!this.state.showLoader && (
                            <div>
                                <div className="row mx-auto">
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-sm-0  mt-1">
                                        <label className="mb-1 font-weight-bold required">Job Workflow</label>
                                        <DropDownList
                                            className={"form-control"}
                                            data={this.state.jobWfTypes}
                                            disabled={!this.props.clientId || disableReg}
                                            name="jobWf"
                                            textField="name"
                                            dataItemKey="id"
                                            id="jobWfType"
                                            defaultItem={defaultItem}
                                            value={data.jobWf}
                                            onChange={this.handleJobWfTypeChange}
                                            filterable={this.state.originaljobWfTypes.length > 5 ? true : false}
                                            onFilterChange={this.handleFilterChange}
                                        />
                                        {formikProps.errors.reqPosition && formikProps.errors.reqPosition.jobWf && <ErrorComponent />}
                                    </div>

                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-sm-0 mt-1">
                                        <label className="mb-1 font-weight-bold required">Job Category</label>
                                        <DropDownList
                                            className={"form-control"}
                                            disabled={disableReg}
                                            data={this.state.jobCategories}
                                            name="jobCategory"
                                            textField="name"
                                            dataItemKey="id"
                                            id="jobCategories"
                                            defaultItem={defaultItem}
                                            value={data.jobCategory}
                                            onChange={this.handleJobCategoryChange}
                                            filterable={this.state.originaljobCategories.length > 5 ? true : false}
                                            onFilterChange={this.handleFilterChange}
                                        />
                                        {formikProps.errors.reqPosition && formikProps.errors.reqPosition.jobCategory && <ErrorComponent />}
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-1 mt-sm-0">
                                        <label className="mb-1 font-weight-bold required ">Position</label>
                                        <DropDownList
                                            className="form-control"
                                            disabled={!hasJobCategory || disableReg}
                                            data={this.state.positions}
                                            name="jobPosition"
                                            textField="name"
                                            dataItemKey="id"
                                            id="positions"
                                            defaultItem={defaultItem}
                                            value={data.jobPosition}
                                            onChange={this.handleJobPositionChange}
                                            filterable={this.state.originalpositions.length > 5 ? true : false}
                                            onFilterChange={this.handleFilterChange}
                                            footer={
                                                auth.hasPermissionV2(AppPermissions.CLIENT_JOB_POSITION_CREATE) && <Link to="/admin/clientjobcatalog/manage">
                                                    <div className="pb-2 pt-2">
                                                        <span className="dropdown-footer col-12">
                                                            <FontAwesomeIcon icon={faPlusCircle} className={"dropdown-footer mr-1"} />
                                                            <span className="text-underline">Add New Position</span>
                                                        </span>
                                                    </div>
                                                </Link>
                                                
                                            }
                                        />
                                        {formikProps.errors.reqPosition && formikProps.errors.reqPosition.jobPosition && <ErrorComponent />}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 mt-1 mt-lg-3">
                                        <div className="row mx-auto">
                                            <div className="col-12 col-sm-6 col-lg-8 mt-sm-0 area-merged">
                                                <label className="mb-1 font-weight-bold required  ">Position Skills</label>
                                                <MultiSelect
                                                    className="form-control"
                                                    disabled={!hasJobPosition}
                                                    data={this.state.positionSkills}
                                                    name="positionSkillMapping"
                                                    textField="name"
                                                    dataItemKey="id"
                                                    id="positionSkills"
                                                    value={data.positionSkillMapping}
                                                    onChange={(e) => this.props.handlePositionChange(e)}
                                                    placeholder="Select.."
                                                    filterable={this.state.originalpositionSkills.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.reqPosition &&
                                                    formikProps.errors.reqPosition.positionSkillMapping &&
                                                    !data.positionSkillMapping.length && <ErrorComponent />}
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-4 mt-1 mt-sm-0">
                                                <label className="mb-1 font-weight-bold required ">Position Description</label>
                                                {this.state.positionDocUrl && <span className="text-underline cursorElement" title={this.state.positionDocName}
                                                    onClick={() => this.state.positionDocUrl && commonService.download(this.state.positionDocUrl, data.jobPosition.name + " Position Description")}>
                                                    <FontAwesomeIcon icon={faFilePdf} className="ml-1 active-icon-blue" />
                                                </span>}
                                                <textarea
                                                    className="form-control area-textarea"
                                                    name="positionDesc"
                                                    placeholder="Enter Description"
                                                    value={data.positionDesc}
                                                    maxLength={5000}
                                                    onChange={(e) => this.props.handlePositionChange(e)}
                                                    disabled={this.state.isDisablePosDesc}
                                                ></textarea>
                                                {formikProps.errors.reqPosition && formikProps.errors.reqPosition.positionDesc && <ErrorComponent />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 mt-1 mt-lg-3">
                                        <div className="row mx-auto">
                                            <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-1 mt-sm-0" id="removemargin-border">
                                                <label className="mb-1 font-weight-bold required">Number of Positions Required</label>
                                                <NumericTextBox
                                                    className="form-control"
                                                    name="noOfReqStaff"
                                                    placeholder="Enter Number"
                                                    value={data.noOfReqStaff}
                                                    onChange={(e) => this.updateBudget(e)}
                                                    title="Maximum value could be 999."
                                                    max={999}
                                                    format="n0"
                                                    min={1}
                                                />
                                                {formikProps.errors.reqPosition && formikProps.errors.reqPosition.noOfReqStaff && (
                                                    <ErrorComponent message={formikProps.errors.reqPosition.noOfReqStaff} />
                                                )}
                                            </div>
                                            {!isRoleType(AuthRoleType.Vendor) &&
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-1 mt-sm-0">
                                                    <label className="mb-1 font-weight-bold required">Hiring Manager</label>
                                                    <DropDownList
                                                        className="form-control"
                                                        data={this.state.hiringManagers}
                                                        name="hiringManager"
                                                        textField="name"
                                                        dataItemKey="id"
                                                        id="hiringManagers"
                                                        defaultItem={defaultItem}
                                                        value={data.hiringManager}
                                                        onChange={(e) => this.props.handlePositionChange(e)}
                                                        filterable={this.state.originalhiringManagers.length > 5 ? true : false}
                                                        onFilterChange={this.handleFilterChange}
                                                    />
                                                    {formikProps.errors.reqPosition &&
                                                        formikProps.errors.reqPosition.hiringManager && (!data.hiringManager || (data.hiringManager && !data.hiringManager.id)) &&
                                                        <ErrorComponent />
                                                    }
                                                </div>
                                            }
                                            <div className="col-12 col-sm-6 col-md-4 col-lg-4 mt-1 mt-sm-0">
                                                <label className="mb-1 font-weight-bold required">Assignment Type</label>
                                                <DropDownList
                                                    className="form-control"
                                                    data={this.state.assignmentTypes}
                                                    name="assignType"
                                                    textField="name"
                                                    dataItemKey="id"
                                                    id="assignmentTypes"
                                                    defaultItem={defaultItem}
                                                    value={data.assignType}
                                                    onChange={(e) => this.props.handlePositionChange(e)}
                                                    filterable={this.state.originalassignmentTypes.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.reqPosition &&
                                                    formikProps.errors.reqPosition.assignType && (!data.assignType || (data.assignType && !data.assignType.id)) &&
                                                    <ErrorComponent />
                                                }
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 mt-lg-3 mt-1">
                                                <div className="row mx-auto">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-2 mt-1 mt-sm-0" id="ShowDatePickerIcon">
                                                        <label className="mb-1 font-weight-bold required">Start Date</label>
                                                        <DatePicker
                                                            className="form-control"
                                                            format="MM/dd/yyyy"
                                                            name="startDate"
                                                            value={data.startDate !=undefined && data.startDate != null ? new Date(data.startDate) : null}
                                                            max={data.endDate ? new Date(new Date(data.endDate).setDate(new Date(data.endDate).getDate() - 1)) : 
                                                                new Date(new Date().setFullYear(new Date().getFullYear()+1))
                                                            }
                                                            onChange={(e) => this.updateBudget(e)}
                                                            formatPlaceholder="formatPattern"
                                                        />
                                                        {formikProps.errors.reqPosition &&
                                                            formikProps.errors.reqPosition.startDate &&
                                                            !data.startDate && (
                                                                <div className="k-form-error k-text-start">
                                                                    {formikProps.errors.reqPosition.startDate}
                                                                </div>
                                                            )}
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-2 mt-1 mt-sm-0" id="ShowDatePickerIcon">
                                                        <label className="mb-1 font-weight-bold  required">End Date</label>
                                                        <DatePicker
                                                            className="form-control"
                                                            format="MM/dd/yyyy"
                                                            name="endDate"
                                                            value={data.endDate !=undefined && data.endDate != null ? new Date(data.endDate) : null}
                                                            onChange={(e) => this.updateBudget(e)}
                                                            formatPlaceholder="formatPattern"
                                                            min={new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 1))}
                                                        />
                                                        {formikProps.errors.reqPosition && formikProps.errors.reqPosition.endDate && (
                                                            <ErrorComponent message={formikProps.errors.reqPosition.endDate} />
                                                        )}
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-2 mt-1 mt-sm-0" id="ShowDatePickerIcon">
                                                        <label className="mb-1 font-weight-bold">Start Time</label>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <TimePicker
                                                                    className="form-control"
                                                                    format="hh:mm a"
                                                                    name="shiftStartTime"
                                                                    value={new Date(data.shiftStartTime)}
                                                                    max={new Date(data.shiftEndTime)}
                                                                    onChange={(e) => this.updateBudget(e)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-2 mt-1 mt-sm-0" id="ShowDatePickerIcon">
                                                        <label className="mb-1 font-weight-bold">End Time</label>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <TimePicker
                                                                    className="form-control"
                                                                    format="hh:mm a"
                                                                    min={new Date(data.shiftStartTime)}
                                                                    name="shiftEndTime"
                                                                    value={new Date(data.shiftEndTime)}
                                                                    onChange={(e) => this.updateBudget(e)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-2 mt-1 mt-sm-0" id="removemargin-border">
                                                        <label className="mb-1 font-weight-bold">Bill Rate</label>
                                                        <NumericTextBox
                                                            className="form-control"
                                                            placeholder="Enter Bill Rate"
                                                            defaultValue={data.billRate}
                                                            value={data.billRate}
                                                            format="c2"
                                                            min={0}
                                                            max={99999}
                                                            name="billRate"
                                                            onChange={(e) => e.target.value >= 0 ? this.updateBudget(e) : null}
                                                        />
                                                    </div>
                                                    {(auth.hasPermissionV2(AppPermissions.REQ_CREATE) || auth.hasPermissionV2(AppPermissions.REQ_APPROVE) || auth.hasPermissionV2(AppPermissions.REQ_REJECT)) && (
                                                        <div className="col-12 col-sm-6 col-md-4 col-lg-2 mt-1 mt-sm-0" id="removemargin-border">
                                                            <label className="mb-1 font-weight-bold">Budget Amount</label>
                                                            <NumericTextBox
                                                                className="form-control"
                                                                value={isNaN(data.budget) ? 0 : data.budget}
                                                                format="c2"
                                                                min={0}
                                                                name="budget"
                                                                onChange={(e) => this.props.handlePositionChange(e)}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default PositionDetails;
