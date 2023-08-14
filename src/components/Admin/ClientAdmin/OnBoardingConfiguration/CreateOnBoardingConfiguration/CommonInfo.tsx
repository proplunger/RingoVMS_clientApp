import * as React from "react";
import auth from "../../../../Auth";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../../../Shared/withValueField";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import commonService from "../../../../Shared/Services/CommonDataService";
import globalAdminService from "../../../GlobalAdmin/Service/DataService";
import { ErrorComponent } from "../../../../ReusableComponents";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import axios from "axios";
import TagControl from "../../../../Shared/TagControl/TagControl";
import { EntityTypeId } from "../../../../Shared/AppConstants";

const CustomDropDownList = withValueField(DropDownList);

const defaultItem = { name: "Select...", id: null };

export interface CommonInfoProps {
    data: any;
    Id: string;
    handleObjChange: any;
    handleDropdownChange: any;
    formikProps: any;
    isInEdit?:boolean;
    isTagsAllowed?: boolean;
}

export interface CommonInfoState {
    clientId: string;
    clientName: string;
    divisions: Array<IDropDownModel>;
    originaldivisions: Array<IDropDownModel>;
    locations: Array<IDropDownModel>;
    originallocations: Array<IDropDownModel>;
    jobCategories: Array<IDropDownModel>;
    originaljobCategories: Array<IDropDownModel>;
    positions: Array<IDropDownModel>;
    originalpositions: Array<IDropDownModel>;
    showLoader?: boolean;
    total?: 0;
}

class CommonInfo extends React.Component<CommonInfoProps, CommonInfoState> {

    public tagRef;
    constructor(props: CommonInfoProps) {
        super(props);
        this.state = {
            clientId: auth.getClient(),
            clientName: auth.getClientName(),
            divisions: [],
            originaldivisions: [],
            locations: [],
            originallocations: [],
            jobCategories: [],
            originaljobCategories: [],
            positions: [],
            originalpositions: [],
            showLoader: true,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.getDivisions();
        this.getJobCategory();
    }

    getDivisions = () => {
        const {clientId} = this.state;
        let queryParams = `status eq 'Active'&$orderby=name`;
        if(this.props.Id && this.props.data.divisionId){
            queryParams = `status eq 'Active' or id eq ${this.props.data.divisionId} &$orderby=name `;
        }
        commonService.getClientDivision(clientId, queryParams).then((res) => {
            this.setState({ divisions: res.data, originaldivisions: res.data, showLoader: false });
        });
    }

    handleDivisionChange = (e) => {
        const Id = e.value.id;
        this.props.handleObjChange({
            divisionId: Id,
            locationId: null
        });
        if (Id !=null) {
            this.getLocations(Id);
        }
        else {
            this.setState({ locations: [] });
        }
    }

    getLocations = (Id) => {
        let queryParams = `status eq 'Active' and divId eq ${Id} &$orderby=name`;
        if(this.props.Id && this.props.data.locId){
            queryParams = `(status eq 'Active' or id eq ${this.props.data.locId}) and divId eq ${Id} &$orderby=name `;
        }
        commonService.getDivisionLocations(queryParams).then((res) => {
            this.setState({ locations: res.data, originallocations: res.data });
        });
    }

    getJobCategory = () => {
        const { clientId } = this.state;
        const queryParams = `status eq 'Active'&$orderby=name`;
        //axios.get(`api/clients/${clientId}/positions/categories?$orderby=name`)
        globalAdminService.getClientPositionCategories(clientId, queryParams)
          .then(async res => {
            this.setState({ jobCategories: res.data, originaljobCategories: res.data });
          });
      }
    
      handleJobCategoryChange = (e) => {
        const Id = e.value.id;
        this.props.handleObjChange({
            jobCategoryId: Id,
            positionId: null
        });
        if (Id !=null) {
            this.getPositions(Id);
        }
        else {
            this.setState({ positions: [] });
        }
      }

    getPositions = (Id) => {
        axios.get(`api/clients/${this.state.clientId}/jobcategories/${Id}/jobpositions?$orderby=name`)
            .then(async res => {
                this.setState({ positions: res.data, originalpositions: res.data  });
            });
    }

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

    render() {
    const { data, formikProps } = this.props;
        return (
            <div className="">
                <div className="row">
                    <div className="col-12 pl-0 pr-0">
                        {this.state.showLoader &&
                            Array.from({ length: 2 }).map((item, i) => (
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
                                        <div className="row mt-0 mx-0">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold ">Client</label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    disabled={true}
                                                    value={this.state.clientName}
                                                    // onChange={(event) => {
                                                    //     this.setState({ locationName: event.target.value });
                                                    // }}
                                                />
                                                {/* {formikProps.errors.clientName && <ErrorComponent message={formikProps.errors.clientName} />} */}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold required">Division</label>
                                                <CustomDropDownList
                                                    disabled={this.props.isInEdit}
                                                    className={"form-control disabled "}
                                                    data={this.state.divisions}
                                                    name={`divisionId`}
                                                    textField="name"
                                                    valueField="id"
                                                    id="divisions"
                                                    defaultItem={defaultItem}
                                                    value={data.divisionId}
                                                    onChange={(e) => this.handleDivisionChange(e)}
                                                    filterable={this.state.originaldivisions.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.divisionId && <ErrorComponent message={formikProps.errors.divisionId} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 text-box-disbaled">
                                                <label className="mb-1 font-weight-bold required">Location</label>
                                                <CustomDropDownList
                                                    className="form-control disabled"
                                                    name={`locationId`}
                                                    disabled={!data.divisionId || this.props.isInEdit}
                                                    data={this.state.locations}
                                                    textField="name"
                                                    valueField="id"
                                                    id="locations"
                                                    defaultItem={defaultItem}
                                                    value={data.locationId}
                                                    onChange={(e) => this.props.handleDropdownChange(e)}
                                                    filterable={this.state.originallocations.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.locationId && <ErrorComponent message={formikProps.errors.locationId} />}
                                            </div>
                                        </div>

                                        <div className="row mt-2 mx-0">
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                                                <label className="mb-1 font-weight-bold required">Job Category</label>
                                                <CustomDropDownList
                                                    className={"form-control disabled "}
                                                    data={this.state.jobCategories}
                                                    disabled={!this.state.clientId || this.props.isInEdit}
                                                    name="jobCategory"
                                                    //name={`jobCategoryId`}
                                                    textField="name"
                                                    valueField="id"
                                                    id="jobCategories"
                                                    defaultItem={defaultItem}
                                                    value={data.jobCategoryId}
                                                    onChange={(e) => this.handleJobCategoryChange(e)}
                                                    filterable={this.state.originaljobCategories.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.jobCategoryId && <ErrorComponent message={formikProps.errors.jobCategoryId} />}
                                            </div>
                                            <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 text-box-disbaled">
                                                <label className="mb-1 font-weight-bold required">Position</label>
                                                <CustomDropDownList
                                                    disabled={!data.jobCategoryId || this.props.isInEdit}
                                                    className="form-control disabled"
                                                    name={`positionId`}
                                                    data={this.state.positions}
                                                    textField="name"
                                                    valueField="id"
                                                    id="positions"
                                                    defaultItem={defaultItem}
                                                    value={data.positionId}
                                                    onChange={(e) => this.props.handleDropdownChange(e)}
                                                    filterable={this.state.originalpositions.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                                {formikProps.errors.positionId && <ErrorComponent message={formikProps.errors.positionId} />}
                                            </div>

                                            {this.props.isTagsAllowed && (
                                                <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 text-box-disbaled multiselect">
                                                <label className="mb-1 font-weight-bold">
                                                    Tags
                                                </label>
                                                    <TagControl
                                                        ref={(instance) => {
                                                            this.tagRef = instance;
                                                        }}
                                                        defaultText="None"
                                                        entityId={this.props.Id}
                                                        entityTypeId={EntityTypeId.CLIENT}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                    </div>
                </div>
            </div>
        );
    }
}

export default CommonInfo;