import * as React from "react";
import auth from "../../../../Auth";
import commonService from "../../../../Shared/Services/CommonDataService";
import globalAdminService from "../../../GlobalAdmin/Service/DataService";
import { ErrorComponent } from "../../../../ReusableComponents";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import axios from "axios";
import DropdownTreeSelect from "react-dropdown-tree-select";

export interface CommonInfoTreeProps {
    data: any;
    Id: string;
    handleObjChange: any;
    handleDropdownChange: any;
    formikProps: any;
    isInEdit?: boolean;
}

export interface CommonInfoTreeState {
    clientId: string;
    clientName: string;   
    showLoader?: boolean;
    total?: 0;
    allDivisions?:any;
    allLocations?:any;
    allJobCategory?:any;
    allPositions?:any;
}

class CommonInfoTree extends React.Component<
  CommonInfoTreeProps,
  CommonInfoTreeState
> {
  constructor(props: CommonInfoTreeProps) {
    super(props);
    this.state = {
      clientId: auth.getClient(),
      clientName: auth.getClientName(),     
      showLoader: true,
      allDivisions: {
        label: "All Divisions",
        value: "AllDiv",
        children: [],
      },
      allLocations: {
        label: "All Locations",
        value: "AllLoc",
        children: [],
      },
      allJobCategory: {
        label: "All Job Category",
        value: "AllJobCat",
        children: [],
      },
      allPositions: {
        label: "All Positions",
        value: "AllPos",
        children: [],
      },
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

    axios.get(`https://localhost:44338/api/clients/${clientId}/divisions?$filter=${queryParams}`).then((res) => {
      this.setState({
        showLoader: false,
        allDivisions: {
          label: "All Divisions",
          value: "AllDiv",
          children: res.data,
        }
      });
    });
  };

  handleDivisionChange = (currentNode, selectedNodes) => {
    let selectedDivisions = selectedNodes.map((i) => i.value);
    this.props.handleObjChange({
      selectedDivisions: selectedDivisions,
      selectedDiv: selectedNodes,
      locationId: null,
    });
    if (selectedNodes !=null) {
      this.getLocations(selectedDivisions);
    } else {
      this.setState({ allLocations: {
         label: "All Locations",
        value: "AllLoc",
        children: []
      } });
    }
  };

  getLocations = (Id) => {
    let queryParams = `status eq 'Active' and divId in (${Id}) &$orderby=name`;
    if (this.props.Id && this.props.data.locId) {
      queryParams = `(status eq 'Active' or id eq ${this.props.data.locId}) and divId eq ${Id} &$orderby=name `;
    }
    commonService.getDivisionLocations(queryParams).then((res) => {
      this.setState({
        allLocations: {
          label: "All Locations",
          value: "AllLoc",
          children: res.data,
        },
      });
    });
  };
  
  handleLocationChange = (currentNode, selectedNodes) => {
    let selectedLocations = selectedNodes.map((i) => i.value);
    this.props.handleObjChange({
      selectedLocations: selectedLocations,
    });
  };

  getJobCategory = () => {
    const { clientId } = this.state;
    const queryParams = `status eq 'Active'&$orderby=name`;

    globalAdminService
      .getClientPositionCategories(clientId, queryParams)
      .then(async (res) => {
        this.setState({
          showLoader: false,
          allJobCategory: {
            label: "All Job Category",
            value: "AllJobCat",
            children: res.data,
          },
          allPositions: {
            label: "All Positions",
            value: "AllPos",
            children: [],
          },
        });
      });
  };

  handleJobCategoryChange = (currentNode, selectedNodes) => {
    let selectedJobCategory = selectedNodes.map((i) => i.value);
    this.props.handleObjChange({
      selectedJobCategory: selectedJobCategory,
      positionId: null,
    });
    if (selectedNodes !=null) {
      this.getPositions(selectedJobCategory);
    } else {
      this.setState({ allPositions: {
        label: "All Positions",
        value: "AllPos",
        children: [],
      } });
    }
  };

  getPositions = (Id) => {
    axios.get(`api/clients/${this.state.clientId}/jobcategories/${Id}/jobpositions?$orderby=name`)
      .then(async (res) => {
        this.setState({
          allPositions: {
            label: "All Positions",
            value: "AllPos",
            children: res.data,
          },
        });
      });
  };

  handlePositionChange = (currentNode, selectedNodes) => {
    let selectedPositions = selectedNodes.map((i) => i.value);
    this.props.handleObjChange({
      selectedPositions: selectedPositions,
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

  onAction = (node, action) => {
    console.log("onAction::", action, node);
  };

  onNodeToggle = (currentNode) => {
    console.log("onNodeToggle::", currentNode);
  };

  assignObjectPaths = (obj, stack?) => {
    Object.keys(obj).forEach((k) => {
      const node = obj[k];
      if (typeof node =="object") {
        node.path = stack ? `${stack}.${k}` : k;
        this.assignObjectPaths(node, node.path);
      }
    });
  };

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
                    <label className="mb-1 font-weight-bold required">
                      Division
                    </label>
                    <DropdownTreeSelect
                      id="divisions"
                      data={this.props.data.selectedDiv}{...this.state.allDivisions}
                      onChange={this.handleDivisionChange}
                      onNodeToggle={this.onNodeToggle}
                      //inlineSearchInput={true}
                      hierarchical={true}
                    />
                    {formikProps.errors.selectedDivisions && <ErrorComponent message={formikProps.errors.selectedDivisions} />}
                  </div>

                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 text-box-disbaled">
                    <label className="mb-1 font-weight-bold required">
                      Location
                    </label>
                    <DropdownTreeSelect                    
                      id="locations"
                      data={this.state.allLocations}
                      onChange={this.handleLocationChange}
                      onNodeToggle={this.onNodeToggle}
                      //inlineSearchInput={true}
                      disabled={!data.selectedDivisions || this.props.isInEdit}
                    />
                    {formikProps.errors.selectedLocations && <ErrorComponent message={formikProps.errors.selectedLocations} />}
                  </div>
                </div>

                <div className="row mt-2 mx-0">
                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                    <label className="mb-1 font-weight-bold required">
                      Job Category
                    </label>
                    <DropdownTreeSelect
                      id="jobCategories"
                      data={this.state.allJobCategory}
                      onChange={this.handleJobCategoryChange}
                      onNodeToggle={this.onNodeToggle}
                      //inlineSearchInput={true}
                    />
                    {formikProps.errors.selectedJobCategory && <ErrorComponent message={formikProps.errors.selectedJobCategory} />}
                  </div>

                  <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1 text-box-disbaled">
                    <label className="mb-1 font-weight-bold required">
                      Position
                    </label>
                    <DropdownTreeSelect
                      id="positions"
                      data={this.state.allPositions}
                      onChange={this.handlePositionChange}
                      onNodeToggle={this.onNodeToggle}
                      //inlineSearchInput={true}
                      disabled={!data.selectedJobCategory || this.props.isInEdit}
                    />
                    {formikProps.errors.selectedPositions && <ErrorComponent message={formikProps.errors.selectedPositions} />}
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

export default CommonInfoTree;