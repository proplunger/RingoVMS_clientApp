import * as React from "react";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt, faTrash, faPlusCircle, faUndo, faPencilAlt, faSave, faPlus, faUserPlus, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { kendoLoadingPanel, KendoDataValueRender, PhoneNumberCell } from "../../../../ReusableComponents";
import axios from "axios";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import {ViewMoreComponent, DetailColumnCell, MyCommandCell, CustomHeaderActionCell} from "./HelperComponent";
import Skeleton from "react-loading-skeleton";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import withValueField from "../../../../Shared/withValueField";
import ReactTooltip from "react-tooltip";
import { GridNoRecord } from "../../../../Shared/GridComponents/CommonComponents";
import RowActions from "../../../../Shared/Workflow/RowActions";
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";

const isPresent = (value) => value != null && value != undefined;
const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select...", id: null };


export interface LocationDetailsProps {
    data: any;
    entityType: string;
    vendorId: string;
    canEdit?: boolean;
}

export interface LocationDetailsState {
    locations: any;
    state : Array<IDropDownModel>;
    city : Array<IDropDownModel>;
    cityId?: string;
    stateId?: string;
    originalstate : Array<IDropDownModel>;
    originalcity : Array<IDropDownModel>;
    location : Array<IDropDownModel>;
    originallocation : Array<IDropDownModel>;
    phoneNumber?: string;
    address1?: string;
    address2?: string;
    showLoader?: boolean;
    openConfirm?: boolean;
    filterText: any;
    dataState: any; 
}

const initialDataState = {
    skip: 0,
    take: 5,
};

class LocationDetails extends React.Component<LocationDetailsProps, LocationDetailsState> {
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    public dataItem: any;
    editField = "inEdit";
    private originalLevels;
    constructor(props: LocationDetailsProps) {
        super(props);
        this.state = {
            locations: [],
            location: [],
            state: [],
            city: [],
            originallocation: [],
            originalstate: [],
            originalcity: [],
            dataState: initialDataState,
            showLoader: true,
            filterText: "",
        };

        // this.initializeHeaderCell();
        // this.initializeActionCell();
    }

    componentDidMount() {
        // this.getState();
        // if (this.props.vendorId) {
        //     this.getLocation(this.props.vendorId);

        // } else {
        //     this.setState({ showLoader: false });
        // }
    }

    initializeActionCell = () => {
        // this.CommandCell = MyCommandCell({
        //     edit: this.enterEdit,
        //     remove: this.remove,
        //     add: this.add,
        //     discard: this.discard,
        //     update: this.update,
        //     cancel: this.cancel,
        //     editField: this.editField,
        // });
    };

    initializeHeaderCell = () => {
        // this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
        //     add: this.addNew,
        // });
    };
    
    getLocation = (dataState) => {
        // const { vendorId } = this.props;
        // axios.get(`api/vendor/${vendorId}/locations`)
        //     .then(async res => {
        //         this.setState({ locations: res.data  });
        //         this.originalLevels = res.data;
        //     }); 
    }

    addNew = () => {
        //  const newDataItem = { inEdit: true, status: "Available"}; 

        //  this.setState({
        //      locations: [newDataItem, ...this.state.locations]
        //  });
    };
    
    enterEdit = (dataItem) => {
        // this.setState({
        //     locations: this.state.locations.map(item =>
        //         item.intId ==dataItem.intId ?
        //         { ...item, inEdit: true } : item
        //     )
        // });
    }

    add = (dataItem) => {
    //     if (dataItem.address1) {
    //     dataItem.inEdit = undefined;
    //     dataItem.intId = this.generateId
    //     (this.originalLevels);

    //     this.originalLevels.unshift(dataItem);
    //     this.setState({
    //       locations: [...this.state.locations]
    //     });
    // }
      };

    generateId = data => data.reduce((acc, current) => Math.max(acc, current.intId), 0) + 1;

    remove = (dataItem) => {
        // const data = [ ...this.state.locations ];
        // this.removeItem(data, dataItem);

        // this.setState({ locations:data });
    }

    removeItem(data, item) {
        // let index = data.findIndex(p => p ==item || (item.id && p.id ==item.id));
        // if (index >= 0) {
        //     data.splice(index, 1);
        // }
    }

    update = (dataItem) => {
        // if (dataItem.address1) {
        // const data = [ ...this.state.locations ];
        // const updatedItem = { ...dataItem, inEdit: undefined };

        // this.updateItem(data, updatedItem);

        // this.setState({ locations:data });
        // }
    }
    
    updateItem = (data, item) => {
        // let index = data.findIndex(p => p ==item || (item.id && p.id ==item.id));
        // if (index >= 0) {
        //     data[index] = { ...item };
        // }
    }

    cancel = (dataItem) => {
        // const originalItem = this.originalLevels.find((p) => p.id ==dataItem.id);
        // originalItem["inEdit"] = undefined;
        // const data = this.state.locations.map((item) => item.id ==originalItem.id ? originalItem : item);
        // this.setState({ locations: data });
    }

    discard = dataItem => {
        // const data = [...this.state.locations];
        // this.removeItem(data, dataItem);
    
        // this.setState({ locations:data });
      };

    itemChange = (event) => {
        // const data = this.state.locations.map(item =>
        //     item.intId ==event.dataItem.intId ?
        //     { ...item, [event.field]: event.value } : item
        // );

        // this.setState({ locations: data });
    }

    onDataStateChange = (changeEvent) => {
        // this.getLocation(changeEvent.data);
    };

    getLocationData(){
        // return this.state.locations;
    }


    getAllLocation = () => {
        // //const { countryId } = this.props.data;
        // axios.get(`api/vendors/locations`)
        //     .then(async res => {
        //         this.setState({ location: res.data  , originallocation: res.data });
        //     });
    }

    getState = () => {
        // axios.get(`api/admin/country/ce0bb9cd-ad9a-40b9-80be-47dc3d808e9f/state`)
        //     .then(async res => {
        //         this.setState({ state: res.data, originalstate: res.data });
        //     });
    }

    handleStateChange = (e) => {
        // const id = e.value.stateId;
        // this.setState({ stateId: id, cityId:null }, () => {
        //     if(id){
        //         this.getCity();
        //     }
        //     else{
        //         this.setState({city:[]});
        //     }
        // });
    }

    getCity = () => {
        // const { stateId } = this.state;
        // axios.get(`api/admin/state/${stateId}/city`)
        //     .then(async res => {
        //         this.setState({ city: res.data , originalcity: res.data });
        //     });
    }

    handleChange = (e, props) => {

        // let {name, value} =  e.target.props;
        // const {transitions} = this.state;
        // this.setState((prevState) => ({
        //     transitions: prevState.transitions.map((item) =>
        //       item.transitionId==props.dataItem.transitionId
        //         ? (name=="previousStateId"?Object.assign(item, { previousStateId: e.value.stateId, previousState:e.value.name })
        //         :name=="nextStateId"?Object.assign(item, { nextStateId: e.value.stateId, nextState:e.value.name }) 
        //         :Object.assign(item, { actionId: e.value.actionId, action:e.value.name })) :item
        //     ),
        //   }));
      };

    expandChange = (dataItem) => {
        // dataItem.expanded = !dataItem.expanded;
        // this.forceUpdate();
    };

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    render() {
        const { canEdit } = this.props;
        return (
            <React.Fragment>
                <div className="">
                    <div className="row mt-2">
                        <div className="col-12" id="nameyoursearch">
                            <div className="createjoborderstep4" id="createjoborderstep">
                                <div className="table-responsive tableShadow">
                                <Grid
                                    className="kendo-grid-custom lastchild"
                                    style={{ height: "auto" }}
                                    sortable={true}
                                    onItemChange = {this.itemChange}
                                    onDataStateChange={this.onDataStateChange}
                                    //pageable={{ pageSizes: true }}
                                    data={this.state.locations}
                                    {...this.state.dataState}
                                    editField="inEdit"
                                    selectedField="selected"
                                    detail={ViewMoreComponent}
                                    expandField="expanded"
                                >
                                    <GridColumn
                                        sortable={false}
                                        field="name"
                                        title="Location"
                                        width="150px"
                                        cell={(props) => {
                                            if (!props.dataItem.inEdit) {
                                                return (
                                                    <td contextMenu="Location">
                                                        {/* {props.dataItem.location.name==undefined ? props.dataItem.location : props.dataItem.location.name} */}
                                                    </td>
                                                   );
                                            } else {
                                                return (
                                                    <td contextMenu="Locations">
                                                        <CustomDropDownList
                                                                className="form-control"
                                                                data={this.state.location}
                                                                textField="name"
                                                                valueField="locationId"
                                                                id="id"
                                                                disabled={!props.dataItem.inEdit}
                                                                name="locationId"
                                                                value={(props.dataItem.locationId)}
                                                                defaultItem={defaultItem}
                                                                onChange={(e) => this.handleChange(e, props)}
                                                                />
                                                    </td>                               
                                                        );
                                                    }
                                                }}
                                        columnMenu={ColumnMenu}
                                    />
                                    <GridColumn
                                        sortable={false}
                                        field="phonenumber"
                                        title="Phone Number"
                                        width="180px"
                                        columnMenu={ColumnMenu}
                                    />

                                    <GridColumn
                                        sortable={false}
                                        field="address1"
                                        title="Address 1"
                                        width="220px"
                                        columnMenu={ColumnMenu}
                                    />

                                    <GridColumn
                                        sortable={false}
                                        field="address2"
                                        title="Address 2"
                                        width="220px"
                                        columnMenu={ColumnMenu}
                                    />

                                    <GridColumn
                                        sortable={false}
                                        field="state"
                                        title="State"
                                        width="150px"
                                        cell={(props) => {
                                            if (!props.dataItem.inEdit) {
                                                return (
                                                    <td contextMenu="Locations">
                                                        {/* {props.dataItem.state.name==undefined ? props.dataItem.state : props.dataItem.state.name} */}
                                                    </td>
                                                   );
                                            } else {
                                                return (
                                                    <td contextMenu="Locations">
                                                        <CustomDropDownList
                                                            className="form-control"
                                                            data={this.state.state}
                                                            textField="name"
                                                            valueField="stateId"
                                                            id="id"
                                                            disabled={!props.dataItem.inEdit}
                                                            name="stateId"
                                                            value={(props.dataItem.stateId)}
                                                            defaultItem={defaultItem}
                                                            //onChange={(e) => this.handleChange(e, props)}
                                                            onChange={(e) => this.handleStateChange(e)}
                                                        />
                                                    </td>                               
                                                        );
                                                    }
                                                }}
                                        columnMenu={ColumnMenu}
                                    />

                                    <GridColumn
                                        sortable={false}
                                        field="city"
                                        title="City"
                                        width="150px"
                                        cell={(props) => {
                                            if (!props.dataItem.inEdit) {
                                                return (
                                                    <td contextMenu="Locations">
                                                        {/* {props.dataItem.city.name==undefined ? props.dataItem.city : props.dataItem.city.name} */}
                                                    </td>
                                                   );
                                            } else {
                                                return (
                                                    <td contextMenu="Locations">
                                                        <CustomDropDownList
                                                            className="form-control"
                                                                data={this.state.city}
                                                                textField="name"
                                                                valueField="cityId"
                                                                id="id"
                                                                disabled={!props.dataItem.inEdit}
                                                                name="cityId"
                                                                value={(props.dataItem.cityId)}
                                                                defaultItem={defaultItem}
                                                                onChange={(e) => this.handleChange(e, props)}
                                                                />
                                                    </td>                               
                                                        );
                                                    }
                                                }}
                                        columnMenu={ColumnMenu}
                                    />

                                    <GridColumn
                                        sortable={false}
                                        cell={this.CommandCell}
                                        width="60px"
                                        headerCell={this.CustomHeaderActionCellTemplate}
                                    />
                                    <GridColumn sortable={false} field="expanded" title="View More" cell={this.ExpandCell} />
                                </Grid>
                                </div>
                            </div>
                       </div>
                    </div>
                </div>
                    

            </React.Fragment>
            );
        }

}

export default LocationDetails;