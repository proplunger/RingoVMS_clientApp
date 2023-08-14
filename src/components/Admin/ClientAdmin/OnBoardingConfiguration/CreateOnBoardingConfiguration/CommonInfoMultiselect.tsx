import * as React from "react";
import auth from "../../../../Auth";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import commonService from "../../../../Shared/Services/CommonDataService";
import globalAdminService from "../../../GlobalAdmin/Service/DataService";
import { ErrorComponent } from "../../../../ReusableComponents";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton from "react-loading-skeleton";
import TagControl from "../../../../Shared/TagControl/TagControl";
import axios from "axios";
import { EntityTypeId } from "../../../../Shared/AppConstants";
import _ from "lodash";

export interface CommonInfoMultiselectProps {
  data: any;
  Id: string;
  handleObjChange: any;
  handleDropdownChange: any;
  formikProps: any;
  isInEdit?: boolean;
  controlsToShow: any[];
  isTagsAllowed?: boolean;
}

export interface CommonInfoMultiselectState {
  clientId: string;
  clientName: string;
  divisions: any;
  originaldivisions: Array<IDropDownModel>;
  locations: any;
  originallocations: Array<any>;
  jobCategories: any;
  originaljobCategories: Array<IDropDownModel>;
  positions: any;
  originalpositions: Array<IDropDownModel>;
  showLoader?: boolean;
  total?: 0;
}

export enum ALLSELECTED {
  ALLDIVISIONS = "All Divisions",
  ALLLOCATIONS = "All Locations",
  ALLCATEGORIES = "All Categories",
  ALLPOSITIONS = "All Positions",
}

class CommonInfoMultiselect extends React.Component<
  CommonInfoMultiselectProps,
  CommonInfoMultiselectState
> {
  public tagRef;
  constructor(props: CommonInfoMultiselectProps) {
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
    const { clientId } = this.state;
    let queryParams = `status eq 'Active'&$orderby=name`;
    if (this.props.Id && this.props.data.divisionId) {
      queryParams = `status eq 'Active' or id eq ${this.props.data.divisionId} &$orderby=name `;
    }
    commonService.getClientDivision(clientId, queryParams).then((res) => {
      res.data.unshift({ name: ALLSELECTED.ALLDIVISIONS, divisionIntId: 9999 });
      this.setState({
        divisions: res.data,
        originaldivisions: res.data,
        //showLoader: false,
      });
      if(this.props.Id==null){
        this.setState({ showLoader: false });
      }
    });
  };

  handleDivisionChange = (e) => {
    var isAllSelected = false;
    var selectedDiv = e.value.filter(
      (x) => x.id !=undefined && x.id !=null && x.divisionIntId !=9999
    );
    let Id = selectedDiv.map((div) => div.id);    

    if (e.nativeEvent.target.innerText.trim() ==ALLSELECTED.ALLDIVISIONS
     || (e.nativeEvent.target.nextSibling !=null && e.nativeEvent.target.nextSibling.nextSibling !=null
      && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=null && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=undefined
      && e.nativeEvent.target.nextSibling.nextSibling.wholeText.trim() ==ALLSELECTED.ALLDIVISIONS)) {
      if (!this.props.data.isAllDivSelected) {
        isAllSelected = true;
        var divs = this.state.divisions.filter(
          (x) => x.id !=undefined && x.id !=null && x.divisionIntId !=9999
        );
        
        Id = divs.map((div) => div.id);
        selectedDiv = this.state.divisions;
      } else {
        selectedDiv = [];
        Id = null;
      }
    } else {
      if(selectedDiv.length==(this.state.divisions.length - 1)){
        selectedDiv.unshift({ name: ALLSELECTED.ALLDIVISIONS, divisionIntId: 9999 });
        isAllSelected = true;
      }
    }

    this.props.handleObjChange({
      selectedDivisions: selectedDiv,
      isAllDivSelected: isAllSelected,
    });

    if (Id !=null && Id.length > 0) {
      this.getLocations(Id);
    } else {
      this.setState({ locations: [] });
      this.props.handleObjChange({
        selectedLocations: []
      });
    }
  };

  getLocations = (Id) => {
    let queryParams = `status eq 'Active' and divId in (${Id}) &$orderby=name`;
    if (this.props.Id && this.props.data.locId) {
      queryParams = `(status eq 'Active' or id eq ${this.props.data.locId}) and divId eq ${Id} &$orderby=name`;
    }
    // commonService.getDivisionLocations(queryParams).then((res) => {
    //   res.data.unshift({
    //     name: ALLSELECTED.ALLLOCATIONS,
    //     clientDivLocIntId: 9999,
    //   });

    //   this.setState({ locations: res.data, originallocations: res.data });
    //   let originalLocations = this.state.locations.map((x) => x.id);
    //   let selectedLocations = this.props.data.selectedLocations.filter((x) => originalLocations.indexOf(x.id) !=-1)
    //   this.props.handleObjChange({
    //     selectedLocations: selectedLocations
    //   });
    // });

    const data = {
      divisionIds: Id,
      locationIds: this.props.data.locId,
    };

    commonService.getMultiDivisionLocations(data).then((res) => {
      res.data.unshift({
        name: ALLSELECTED.ALLLOCATIONS,
        clientDivLocIntId: 9999,
      });

      this.setState({ locations: _.uniqBy(res.data, 'id'), originallocations: _.uniqBy(res.data, 'id') });
      //this.setState({ locations: res.data, originallocations: res.data });
      let originalLocations = this.state.locations.map((x) => x.id);
      let selectedLocations = this.props.data.selectedLocations.filter((x) => originalLocations.indexOf(x.id) !=-1)
      this.props.handleObjChange({
        selectedLocations: selectedLocations
      });
      if(this.props.Id){
      this.setState({ showLoader: false });
      }
    });
  };

  handleLocationChange = (e) => {
    var isAllSelected = false;
    var selectedLoc = e.value.filter(
      (x) => x.id !=undefined && x.id !=null && x.clientDivLocIntId !=9999
    );
    let Id = selectedLoc.map((loc) => loc.id);    

    if (e.nativeEvent.target.innerText.trim() ==ALLSELECTED.ALLLOCATIONS
     || (e.nativeEvent.target.nextSibling !=null && e.nativeEvent.target.nextSibling.nextSibling !=null
      && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=null && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=undefined
      && e.nativeEvent.target.nextSibling.nextSibling.wholeText.trim() ==ALLSELECTED.ALLLOCATIONS)) {
      if (!this.props.data.isAllLocSelected) {
        isAllSelected = true;
        var locs = this.state.locations.filter(
          (x) => x.id !=undefined && x.id !=null && x.clientDivLocIntId !=9999
        );
        
        Id = locs.map((loc) => loc.id);
        selectedLoc = this.state.locations;
      } else {
        selectedLoc = [];
        Id = null;
      }
    } else {
      if(selectedLoc.length==(this.state.locations.length - 1)){
        selectedLoc.unshift({ name: ALLSELECTED.ALLLOCATIONS, clientDivLocIntId: 9999 });
        isAllSelected = true;
      }
    }

    this.props.handleObjChange({
      selectedLocations: selectedLoc,
      isAllLocSelected: isAllSelected,
    });

    this.props.handleDropdownChange(e,selectedLoc);
  };

  getJobCategory = () => {
    const { clientId } = this.state;
    const queryParams = `status eq 'Active'&$orderby=name`;

    globalAdminService
      .getClientPositionCategories(clientId, queryParams)
      .then(async (res) => {
        res.data.unshift({
          name: ALLSELECTED.ALLCATEGORIES,
          jobCategoryIntId: 9999,
        });
        this.setState({
          jobCategories: res.data,
          originaljobCategories: res.data,
        });
      });
  };

  handleJobCategoryChange = (e) => {    

    var isAllSelected = false;
    var selectedJobCat = e.value.filter(
      (x) => x.id !=undefined && x.id !=null && x.jobCategoryIntId !=9999
    );
    let Id = selectedJobCat.map((jobCat) => jobCat.id);    

    if (e.nativeEvent.target.innerText.trim() ==ALLSELECTED.ALLCATEGORIES
     || (e.nativeEvent.target.nextSibling !=null && e.nativeEvent.target.nextSibling.nextSibling !=null
      && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=null && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=undefined
      && e.nativeEvent.target.nextSibling.nextSibling.wholeText.trim() ==ALLSELECTED.ALLCATEGORIES)) {
      if (!this.props.data.isAllJobCatSelected) {
        isAllSelected = true;
        var jobCats = this.state.jobCategories.filter(
          (x) => x.id !=undefined && x.id !=null && x.jobCategoryIntId !=9999
        );
        
        Id = jobCats.map((jobCat) => jobCat.id);
        selectedJobCat = this.state.jobCategories;
      } else {
        selectedJobCat = [];
        Id = null;
      }
    } else {
      if(selectedJobCat.length==(this.state.jobCategories.length - 1)){
        selectedJobCat.unshift({ name: ALLSELECTED.ALLCATEGORIES, jobCategoryIntId: 9999 });
        isAllSelected = true;
      }
    }

    this.props.handleObjChange({
      selectedJobCategory: selectedJobCat,
      isAllJobCatSelected: isAllSelected,
    });

    if (Id !=null && Id.length > 0) {
      this.getPositions(Id);
    } else {
      this.setState({ positions: [] });
      this.props.handleObjChange({
        selectedPositions: []
      });
    }
  };

  getPositions = (Ids) => {
    axios
      .get(
        `api/clients/${this.state.clientId}/jobcatpositions?$filter=jobCategoryId in (${Ids}) &$orderby=name`
      )
      .then(async (res) => {
        res.data.unshift({
          name: ALLSELECTED.ALLPOSITIONS,
          clientPosMapIntId: 9999,
        });
        this.setState({ positions: res.data, originalpositions: res.data });
        let originalPositions = this.state.positions.map((x) => x.id);
        let selectedPositions = this.props.data.selectedPositions.filter((x) => originalPositions.indexOf(x.id) !=-1)
        this.props.handleObjChange({
          selectedPositions: selectedPositions
      });
    });
  };

  handlePositionChange = (e) => {
    var isAllSelected = false;
    var selectedPos = e.value.filter(
      (x) => x.id !=undefined && x.id !=null && x.clientPosMapIntId !=9999
    );
    let Id = selectedPos.map((pos) => pos.id);    

    if (e.nativeEvent.target.innerText.trim() ==ALLSELECTED.ALLPOSITIONS
     || (e.nativeEvent.target.nextSibling !=null && e.nativeEvent.target.nextSibling.nextSibling !=null
      && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=null && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=undefined
      && e.nativeEvent.target.nextSibling.nextSibling.wholeText.trim() ==ALLSELECTED.ALLPOSITIONS)) {
      if (!this.props.data.isAllJobPosSelected) {
        isAllSelected = true;
        var pos = this.state.positions.filter(
          (x) => x.id !=undefined && x.id !=null && x.clientPosMapIntId !=9999
        );
        
        Id = pos.map((loc) => loc.id);
        selectedPos = this.state.positions;
      } else {
        selectedPos = [];
        Id = null;
      }
    } else {
      if(selectedPos.length==(this.state.positions.length - 1)){
        selectedPos.unshift({ name: ALLSELECTED.ALLPOSITIONS, clientPosMapIntId: 9999 });
        isAllSelected = true;
      }
    }

    this.props.handleObjChange({
      selectedPositions: selectedPos,
      isAllJobPosSelected: isAllSelected,
    });
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

  itemRender = (li, itemProps) => {
    const itemChildren = (
      <span>
        <input
          type="checkbox"
          checked={itemProps.dataItem.name=="All Divisions" ? this.props.data.isAllDivSelected :
                   itemProps.dataItem.name=="All Locations" ? this.props.data.isAllLocSelected :
                   itemProps.dataItem.name=="All Categories" ? this.props.data.isAllJobCatSelected :
                   itemProps.dataItem.name=="All Positions" ? this.props.data.isAllJobPosSelected :
                   itemProps.selected}
          onChange={(e) => itemProps.onClick(itemProps.index, e)}
        />
        &nbsp;{li.props.children}
      </span>
    );
    return React.cloneElement(li, li.props, itemChildren);
  };

  render() {
    const { data, formikProps } = this.props;
    return (
      <div className="">
        <div className="row mb-2">
          <div className="col-12 pl-0 pr-0 mb-4">
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
                <div className="row mt-0 mx-0">
                  {this.props.controlsToShow.find(x => x=='CLIENT') && 
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                      <label className="mb-1 font-weight-bold ">Client</label>
                      <input
                        type="text"
                        className="form-control "
                        disabled={true}
                        value={this.state.clientName}
                      />
                    </div>
                  }

                  {this.props.controlsToShow.find(x => x=='DIVISION') &&
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 multiselect">
                      <label className="mb-1 font-weight-bold required">
                        Division
                      </label>
                      <MultiSelect
                        className="form-control disabled"
                        disabled={this.props.isInEdit}
                        data={this.state.divisions}
                        textField="name"
                        dataItemKey="id"
                        id="divisions"
                        itemRender={this.itemRender}
                        autoClose={false}
                        value={data.selectedDivisions.filter((x) => x.divisionIntId !=9999 )}
                        onChange={(e) => this.handleDivisionChange(e)}
                        placeholder="Select Divisions..."
                        filterable={
                          this.state.originaldivisions.length > 5 ? true : false
                        }
                        onFilterChange={this.handleFilterChange}
                      />
                      {formikProps.errors.selectedDivisions && (
                        <ErrorComponent
                          message={formikProps.errors.selectedDivisions}
                        />
                      )}
                    </div>
                  }


                  {this.props.controlsToShow.find(x => x=='LOCATION') && 

                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 text-box-disbaled multiselect">
                      <label className="mb-1 font-weight-bold required">
                        Location
                      </label>
                      <MultiSelect
                        className="form-control disabled"
                        disabled={data.selectedDivisions.length <= 0 || this.props.isInEdit}
                        data={this.state.locations}
                        textField="name"
                        dataItemKey="id"
                        id="locations"
                        name="selectedLocations"
                        itemRender={this.itemRender}
                        autoClose={false}
                        value={data.selectedLocations.filter((x) => x.clientDivLocIntId !=9999 )}
                        onChange={(e) => this.handleLocationChange(e)}
                        placeholder="Select Locations..."
                        filterable={
                          this.state.originallocations.length > 5 ? true : false
                        }
                        onFilterChange={this.handleFilterChange}
                      />
                      {formikProps.errors.selectedLocations && (
                        <ErrorComponent
                          message={formikProps.errors.selectedLocations}
                        />
                      )}
                    </div>
                  }
                </div>

                <div className="row mt-2 mx-0">
                  {this.props.controlsToShow.find(x => x=='JOB CATEGORY') &&
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 multiselect">
                      <label className="mb-1 font-weight-bold required">
                        Job Category
                      </label>
                      <MultiSelect
                        className="form-control disabled"
                        disabled={this.props.isInEdit}
                        data={this.state.jobCategories}
                        textField="name"
                        dataItemKey="id"
                        id="jobCategories"
                        itemRender={this.itemRender}
                        autoClose={false}
                        value={data.selectedJobCategory.filter((x) => x.jobCategoryIntId !=9999 )}
                        onChange={(e) => this.handleJobCategoryChange(e)}
                        placeholder="Select Locations..."
                        filterable={
                          this.state.originaljobCategories.length > 5
                            ? true
                            : false
                        }
                        onFilterChange={this.handleFilterChange}
                      />
                      {formikProps.errors.selectedJobCategory && (
                        <ErrorComponent
                          message={formikProps.errors.selectedJobCategory}
                        />
                      )}
                    </div>
                  }

                  {this.props.controlsToShow.find(x => x=='POSITION') &&
                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 text-box-disbaled multiselect">
                      <label className="mb-1 font-weight-bold required">
                        Position
                      </label>
                      <MultiSelect
                        className="form-control disabled"
                        disabled={data.selectedJobCategory.length <= 0 || this.props.isInEdit}
                        data={this.state.positions}
                        textField="name"
                        dataItemKey="id"
                        id="positions"
                        name="selectedPositions"
                        itemRender={this.itemRender}
                        autoClose={false}
                        value={data.selectedPositions.filter((x) => x.clientPosMapIntId !=9999 )}
                        onChange={(e) => this.handlePositionChange(e)}
                        placeholder="Select Positions..."
                        filterable={
                          this.state.originalpositions.length > 5 ? true : false
                        }
                        onFilterChange={this.handleFilterChange}
                      />
                      {formikProps.errors.selectedPositions && (
                        <ErrorComponent
                          message={formikProps.errors.selectedPositions}
                        />
                      )}
                    </div>
                  }

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

export default CommonInfoMultiselect;
