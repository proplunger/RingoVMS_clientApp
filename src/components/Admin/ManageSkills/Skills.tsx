import * as React from "react";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords, GridToolbar } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import axios from "axios";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import RowActions from "../../Shared/Workflow/RowActions";
import { State, toODataString } from "@progress/kendo-data-query";
import { Dialog } from "@progress/kendo-react-dialogs";
import { initialDataState, successToastr } from "../../../HelperMethods";
import { CustomMenu, DefaultActions } from "./GlobalActions";
import UpsertSkill from "./UpsertSkill";
import ConfirmationModal from "../../Shared/ConfirmationModal";

export interface ManageSkillProps {
    
}

export interface ManageSkillState {
    skills: any;
    positionId: string;
    onFirstLoad: boolean;
    totalCount?: number;
    showLoader?: boolean;
    showAddNewSkillModal?: any;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    showDeleteModal?: boolean;
    dataState: any;
}

class ManageSkills extends React.Component<ManageSkillProps, ManageSkillState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public dataItem: any;
    public skillId: string;
    constructor(props: ManageSkillProps) {
        super(props);
        this.state = {
            skills: [],
            dataState: initialDataState,
            positionId: "",
            onFirstLoad: true,
            showLoader: true
        };
    }

    componentDidMount(){
        this.getPositionSkill(this.state.dataState)
    }

    getPositionSkill = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState)}`;

        axios.get(`api/admin/jobpositions/skills?${queryStr}`).then((res) => {
            this.setState({
                skills: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getSkillsCount(dataState);
        });
    }

    getSkillsCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;

        axios.get(`api/admin/jobpositions/skills?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
            });
        });
    };

    selectionChange = (event) => {
        const data = this.state.skills.map(item=>{
            if(item.skillId ==event.dataItem.skillId){
                item.selected = !event.dataItem.selected;
            }
            return item;
        });
        this.setState({ skills:data });
        let isDefaultSelected = this.state.skills.filter((x) => x.selected && x.isDefault==true).length > 0;
        
    }

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const data = this.state.skills.map(item=>{
            item.selected = checked;
            return item;
        });
        this.setState({ skills:data });
        this.state.dataState.skills = data
        let isDefaultSelected = this.state.skills.filter((x) => x.selected && x.isDefault==true).length > 0;
    }

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };
    
    onDataStateChange = (changeEvent) => {
        this.getPositionSkill(changeEvent.data);
    };

    handleActionClick= (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    AddNewModal =() =>{
        this.dataItem = undefined 
        this.setState({showAddNewSkillModal: true})
    }

    RemoveSelectedSkills =() =>{
        const selected = this.state.skills.filter((x) => x.selected==true && x.isDefault !=true);
        const data = [...this.state.skills];
        selected.forEach((element) => {
            this.removeItem(data, element);
            this.deleteSkill(element.skillId);
        });
        this.setState({ skills:data });
    }

    removeItem(data, item) {
        let index = data.findIndex(p => p ==item || (item.skillId && p.skillId ==item.skillId));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    deleteSkill = (skillId) => {
        this.setState({ showDeleteModal: false,showRemoveModal:false });
        axios.delete(`/api/admin/skill/${skillId}`).then((res) => {
            successToastr("Skill deleted successfully");
            this.getPositionSkill(this.state.dataState);
        });
    };

    openModal = (prop, dataItem) => {
        this.setState({ showDeleteModal: true });
    };

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight">
                            Add Skills
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        placeholder="Search text here!"
                        handleSearch={this.getPositionSkill}
                        entityType={"Skill"}
                        onFirstLoad={this.state.onFirstLoad}
                        page="Position Skill"
                    />
                    <div className="mySkillContainer">
                    <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.skills}
                            {...this.state.dataState}
                            //detail={ViewMoreComponent}
                            expandField="expanded"
                            total={this.state.totalCount}
                            className="kendo-grid-custom lastchild"
                            selectedField="selected"
                            onSelectionChange={this.selectionChange}
                            onHeaderSelectionChange={this.headerSelectionChange}
                        >
                        <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                        
                        <GridColumn
                                field="selected"
                                width="50px"
                                headerSelectionValue={this.state.skills && this.state.skills.findIndex((dataItem) => dataItem.selected ==false) ==-1}
                            />

                        <GridColumn
                                field="skillsId"
                                width="280px"
                                title="Skills ID"
                                cell={(props) => CellRender(props, "Skills ID")}
                                columnMenu={ColumnMenu}
                            />
                        <GridColumn
                                field="jobType"
                                width="280px"
                                title="Position | Job Type"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Position | Job Type")}
                                filter="text"
                            />
                        <GridColumn
                                field="name"
                                width="280px"
                                title="Skill Name"
                                cell={(props) => CellRender(props, "Skill Name")}
                                columnMenu={ColumnMenu}
                            />
                        <GridColumn
                                field="description"
                                width="280px"
                                title="Skill Description"
                                cell={(props) => CellRender(props, "Skill Description")}
                                columnMenu={ColumnMenu}
                            />
                        <GridColumn
                                title="Action"
                                sortable={false}
                                width="80px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.clientDivId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.skills, this.AddNewModal, this.RemoveSelectedSkills)}
                            />
                    </Grid>
                    </div>
                </div>
                                    
                <ConfirmationModal
                    message={"Are you sure you want to remove this skill?"}
                    showModal={this.state.showRemoveModal}
                   // handleYes={this.deleteSkill}
                    handleYes={() => this.deleteSkill(this.dataItem.skillId)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                {this.state.showAddNewSkillModal && (
                    <div id="add-Skill">
                        <Dialog className="col-12 For-all-responsive-height">
                            <UpsertSkill
                                props={this.dataItem}
                                //inEdit = {false}
                                onCloseModal={() => this.setState({ showAddNewSkillModal: false }, () => this.getPositionSkill(this.state.dataState))}
                            />
                        </Dialog>
                    </div>
                )}

                {this.state.showEditModal && (
                    <div id="Edit-skill">
                        <Dialog className="col-12 For-all-responsive-height">
                            <UpsertSkill
                                props={this.dataItem}
                                //inEdit = {true}
                                onCloseModal={() => this.setState({ showEditModal: false }, () => this.getPositionSkill(this.state.dataState))}
                            />
                        </Dialog>
                    </div>
                )}
                </div>
        );
    }
}

export default ManageSkills;