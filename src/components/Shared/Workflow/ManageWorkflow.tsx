import * as React from "react";
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import axios from "axios";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../withValueField";
import { IDropDownModel } from "../Models/IDropDownModel";
import { CustomHeaderActionCell, MyCommandCell } from "./HelperComponent"
import { successToastr } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons"; 

const isPresent = (value) => value != null && value != undefined;
const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select Workflow", id: null };
const defaultItem1 = { name: "Select Previous State", id: null };
const defaultItem2 = { name: "Select Action", id: null };
const defaultItem3 = { name: "Select Next State", id: null };

export interface ManageWorkflowProps {
    canEdit?: boolean;
}

export interface ManageWorkflowState {
    workflows : Array<IDropDownModel>;
    states : Array<IDropDownModel>;
    actions : Array<IDropDownModel>;
    Id : string;
    wfId : string;
    transitions: any;
    currentDataItem: any;
}

class ManageWorkflow extends React.Component<ManageWorkflowProps, ManageWorkflowState> {
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    editField = "inEdit";
    private originalLevels;
    constructor(props: ManageWorkflowProps) {
        super(props);
        this.state = {
            workflows: [],
            states: [],
            actions: [],
            transitions: [],
            currentDataItem: { isDefault: false },
            Id: "",
            wfId: "",
        };

        this.initializeActionCell();
        this.initializeHeaderCell();
    }

    componentDidMount() {
        this.getWorkflows();
        this.getStates();
        this.getActions();
      }

      initializeActionCell = () => {
        this.CommandCell = MyCommandCell({
            edit: this.enterEdit,
            remove: this.remove,
            add: this.add,
            discard: this.discard,
            update: this.update,
            cancel: this.cancel,
            editField: this.editField,
        });
    };

    initializeHeaderCell = () => {
        this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
            add: this.addNew,
        });
    };

    getWorkflows() {
        axios.get(`api/workflow/workflows`).then((result) => {
         this.setState({ workflows: result.data });
          });
       }
    
    getStates() {
        axios.get(`api/workflow/states`).then((result) => {
            this.setState({ states: result.data });
          });
      }
    
    getActions() {
        axios.get(`api/workflow/actions`).then((result) => {
            this.setState({ actions: result.data });
          });
      }
 
    getCurrentTransitions(state: string) {
         const queryParam = `wfCode eq '${state}'`;
         axios.get(`api/workflow/transitions?$filter=${queryParam}`).then((res) => {
             this.setState({ transitions: res.data });
             this.originalLevels = res.data ;
         });
     }

    handleWorkflowChange = (e) => {
        const Id = e.target.value;
        this.setState({ Id: Id , wfId: e.value.wfId});
        if (Id !=null)
           {
              this.getCurrentTransitions(Id);
           }
      };

    handleChange = (e, props) => {
        //   console.log(this.state.transitions)
        //   console.log("eeeee", e,"====", props)
        //   console.log(e.target, "++++++")
        //   console.log(e.target.props, "()()()()()()()()")
        // let {name, value} =  e.target.props;
        // const {transitions} = this.state;
        // transitions[name] = value;

        //   //   transitions[name] = name =="previousStateId"? e.value.stateId:value;
        // this.setState({transitions});

        let {name, value} =  e.target.props;
        const {transitions} = this.state;
        this.setState((prevState) => ({
            transitions: prevState.transitions.map((item) =>
              item.transitionId==props.dataItem.transitionId
                ? (name=="previousStateId"?Object.assign(item, { previousStateId: e.value.stateId, previousState:e.value.name })
                :name=="nextStateId"?Object.assign(item, { nextStateId: e.value.stateId, nextState:e.value.name }) 
                :Object.assign(item, { actionId: e.value.actionId, action:e.value.name })) :item
            ),
          }));
      };

    addNew = () => {
        const newDataItem = { inEdit: true , wfCode: this.state.Id};

        this.setState({
            transitions: [newDataItem, ...this.state.transitions]
        });
    };
    
    enterEdit = (dataItem) => {
        this.setState({
            transitions: this.state.transitions.map(item =>
                item.transitionId ==dataItem.transitionId ?
                { ...item, inEdit: true } : item
            )
        });
    }

    add = dataItem => {
        dataItem.inEdit = undefined;

        this.originalLevels.unshift(dataItem);
        this.setState({
          transitions: [...this.state.transitions]
        });
      };

    remove = (dataItem) => {
        const data = [ ...this.state.transitions ];
        this.removeItem(data, dataItem);
        //this.removeItem(this.state.transitions, dataItem);

        this.setState({ transitions:data });
    }

    removeItem(data, item) {
        let index = data.findIndex(p => p ==item || (item.transitionId && p.transitionId ==item.transitionId));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    update = (dataItem) => {
        const data = [ ...this.state.transitions ];
        const updatedItem = { ...dataItem, inEdit: undefined };

        this.updateItem(data, updatedItem);
        //this.updateItem(this.state.transitions, updatedItem); 

        this.setState({ transitions:data });
    }
    
    updateItem = (data, item) => {
        let index = data.findIndex(p => p ==item || (item.transitionId && p.transitionId ==item.transitionId));
        if (index >= 0) {
            data[index] = { ...item };
        }
    }

    cancel = (dataItem) => {
        const originalItem = this.originalLevels.find((p) => p.transitionId ==dataItem.transitionId);
        originalItem["inEdit"] = undefined;
        const data = this.state.transitions.map((item) => item.transitionId ==originalItem.transitionId ? originalItem : item);
        this.setState({ transitions: data });
    }

    discard = dataItem => {
        const data = [...this.state.transitions];
        this.removeItem(data, dataItem);
    
        this.setState({ transitions:data });
      };

    saveChanges = () => {
        const {wfId} = this.state;
        let data = this.state.transitions
        let transitions = {transitions:data}
        axios.put(`api/workflow/workflow/${wfId}/transitions`, JSON.stringify(transitions)).then((res) => {
          if (res.data) {
              successToastr("transitions saved successfully");
          }
      });  
    } 

    render (){
        const { canEdit } = this.props;
        return(
            <React.Fragment>
            <div className="col-11 mx-auto pl-0 pr-0 mt-3" id="remove_row">
                <div className="col-12 p-0 shadow pt-1 pb-1">
                    <div className="col-sm-4 col-lg-4 mt-sm-0  mt-1"> 
                      <label className="mb-1 font-weight-bold required as">
                        Workflows
                      </label>
                      <CustomDropDownList
                        className="form-control disabled "
                        name={`Id`}
                        data={this.state.workflows}
                        textField="name"
                        valueField="value"
                        id="workflow"
                        value={this.state.Id}
                        defaultItem={defaultItem}
                        onChange={this.handleWorkflowChange}
                      />
                    </div>
                
                    <div className="table-responsive tableShadow">
                                            <Grid
                                                className="kendo-grid-custom"
                                                style={{ height: "auto" }}
                                                data={this.state.transitions}
                                                editField="inEdit"
                                                selectedField="selected"
                                            >
                                                {/* {this.state.Id != "" &&
                                                <GridToolbar>
                                                    <button
                                                        title="Add New Transition"
                                                        className="k-button k-primary"
                                                        onClick={this.addNew}
                                                    >
                                                        Add New Transition
                                                    </button>
                                                </GridToolbar>} */}
                                            {/* <Column
                                                    width="70px"
                                                    sortable={false}
                                                    field="S No."
                                                    headerClassName="text-right"
                                                    title="S No."
                                                    cell={(props) => {
                                                        return (
                                                            <td contextMenu="S No." className="text-right">
                                                                <span>{props.dataIndex}</span>
                                                            </td>
                                                        );
                                                    }}
                                                /> */}
                                                <Column
                                                    sortable={false}
                                                    field="previousStateId"
                                                    title="Previous State"
                                                    cell={(props) => {
                                                       // console.log(props.dataItem.previousState,"5555",this.state.states)
                                                        if (!props.dataItem.inEdit) {
                                                            return (
                                                                <td contextMenu="Transitions">
                                                                    {props.dataItem.previousState.name==undefined ? props.dataItem.previousState : props.dataItem.previousState.name}
                                                                </td>
                                                            );
                                                        } else {
                                                            return (
                                                                <td contextMenu="Transitions">
                                                                <CustomDropDownList
                                                                    className="form-control"
                                                                    data={this.state.states}
                                                                    textField="name"
                                                                    valueField="stateId"
                                                                    id="id"
                                                                    disabled={!props.dataItem.inEdit}
                                                                    name="previousStateId"
                                                                    value={(props.dataItem.previousStateId)}
                                                                    defaultItem={defaultItem1}
                                                                    onChange={(e) => this.handleChange(e, props)}
                                                                    />
                                                            </td>
                                                        );
                                                    }
                                                    }}
                                                />
                                                <Column
                                                    sortable={false}
                                                    field="actionId"
                                                    title="Action"
                                                    cell={(props) => {
                                                        if (!props.dataItem.inEdit) {
                                                            return (
                                                                <td contextMenu="Transitions">
                                                                    {props.dataItem.action.name==undefined ? props.dataItem.action : props.dataItem.action.name}
                                                                </td>
                                                            );
                                                        } else {
                                                            return (
                                                                <td contextMenu="Transitions">  
                                                                <CustomDropDownList
                                                                    className="form-control"
                                                                    data={this.state.actions}
                                                                    textField="name"
                                                                    valueField="actionId"
                                                                    id="id"
                                                                    disabled={!props.dataItem.inEdit}
                                                                    name="actionId"
                                                                    value={(props.dataItem.actionId)}
                                                                    defaultItem={defaultItem2}
                                                                    onChange={(e) => this.handleChange(e, props)}
                                                                    />
                                                            </td>
                                                        );
                                                    }
                                                    }}
                                                />
                                                <Column
                                                    sortable={false}
                                                    field="nextStateId"
                                                    title="Next State"
                                                    cell={(props) => {
                                                        if (!props.dataItem.inEdit) {
                                                            return (
                                                                <td contextMenu="Transitions">
                                                                    {props.dataItem.nextState.name==undefined ? props.dataItem.nextState : props.dataItem.nextState.name}
                                                                </td>
                                                            );
                                                        } else {
                                                            return (
                                                                <td contextMenu="Transitions">
                                                                <CustomDropDownList
                                                                    className="form-control"
                                                                    data={this.state.states}
                                                                    textField="name"
                                                                    valueField="stateId"
                                                                    id="id"
                                                                    disabled={!props.dataItem.inEdit}
                                                                    name="nextStateId"
                                                                    value={(props.dataItem.nextStateId)}
                                                                    defaultItem={defaultItem3}
                                                                    onChange={(e) => this.handleChange(e, props)}
                                                                    />
                                                            </td>
                                                        );
                                                    }
                                                    }}
                                                />

                                                {/* <Column cell= {this.CommandCell} width="240px" /> */}
                                                
                                                {this.state.Id != "" &&
                                                <Column
                                                        sortable={false}
                                                        cell={this.CommandCell}
                                                        width="60px"
                                                        headerCell={this.CustomHeaderActionCellTemplate}
                                                    />}
                                            </Grid>

                                            <div className="row mb-2 mb-lg-4 ml-sm-0 mr-sm-0">
                                                <div className="col-12 mt-5 text-sm-center text-center font-regular">
                                            {this.state.Id != "" &&
                                            <button
                                                type="button"
                                                className="btn button button-bg mr-2 mb-2 shadow  mb-xl-0"
                                                onClick = {this.saveChanges}
                                                >
                                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} />{" "}
                                                    Save Changes
                                                    </button>}
                                                </div>
                                            </div>
                    </div>
                </div>
            </div>                    
            </React.Fragment>      
        );
    }   
}

export default ManageWorkflow;