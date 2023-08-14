import * as React from "react";
import auth from "../../Auth";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords, GridToolbar } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import axios from "axios";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import RowActions from "../../Shared/Workflow/RowActions";
import { CustomMenu , DefaultActions , DetailColumnCell} from "./GlobalActions";
import { State, toODataString } from "@progress/kendo-data-query";
import UpsertJobCategories from "./UpsertJobCategories";
import { Dialog } from "@progress/kendo-react-dialogs";
import { initialDataState, successToastr } from "../../../HelperMethods";
import ConfirmationModal from "../../Shared/ConfirmationModal";

export interface ManageJobCategoriesProps {
    
}

export interface ManageJobCategoriesState {
    jobCategories: any;
    clientId?: string;
    onFirstLoad: boolean;
    totalCount?: number;
    showLoader?: boolean;
    showAddNewJobCategoryModal?: any;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    showDeleteModal?: boolean;
    showInActiveJobCategoryModal?: boolean;
    dataState: any; 
}

class ManageJobCategories extends React.Component<ManageJobCategoriesProps, ManageJobCategoriesState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public dataItem: any;
    constructor(props: ManageJobCategoriesProps) {
        super(props);
        this.state = {
            jobCategories: [],
            dataState: initialDataState,
            clientId: auth.getClient(),
            onFirstLoad: true,
            showLoader: true
        };
    }

    componentDidMount(){
        this.getClientJobCategories(this.state.dataState)
    }

    getClientJobCategories = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState)}`;

        axios.get(`api/admin/client/${this.state.clientId}/jobcategory?${queryStr}`).then((res) => {
            //console.log("+++++++++", res.data)
            this.setState({
                jobCategories: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getJobCategoriesCount(dataState);
        });
    }
    

    getJobCategoriesCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;
        
        axios.get(`api/admin/client/${this.state.clientId}/jobcategory?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
            });
        });
    };

    selectionChange = (event) => {
        //console.log(event,"$$$$$$$$$$$$$")
        const data = this.state.jobCategories.map(item=>{
            if(item.jobCategoryId ==event.dataItem.jobCategoryId){
                item.selected = !event.dataItem.selected;
            }
            return item;
        });
        this.setState({ jobCategories:data });
        let isDefaultSelected = this.state.jobCategories.filter((x) => x.selected && x.isDefault==true).length > 0;
    }

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const data = this.state.jobCategories.map(item=>{
            item.selected = checked;
            return item;
        });
        this.setState({ jobCategories:data });
        this.state.dataState.jobCategories = data
        let isDefaultSelected = this.state.jobCategories.filter((x) => x.selected && x.isDefault==true).length > 0;
    }

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };
    
    onDataStateChange = (changeEvent) => {
        this.getClientJobCategories(changeEvent.data);
    };

    handleActionClick= (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    AddNewModal =() =>{
        this.dataItem = undefined 
        this.setState({showAddNewJobCategoryModal: true})
    }

    RemoveSelectedJobCategory =() =>{
        const selected = this.state.jobCategories.filter((x) => x.selected==true && x.isDefault !=true);
        const data = [...this.state.jobCategories];
        selected.forEach((element) => {
            //console.log(element,"$$$$$$$$")
            this.removeItem(data, element);
            this.deleteJobCategory(element.jobCategoryId);
        });
        this.setState({ jobCategories:data });
    }

    removeItem(data, item) {
        let index = data.findIndex(p => p ==item || (item.id && p.id ==item.id));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    InActiveSelectedJobCategory =() => {
        const selected = this.state.jobCategories.filter((x) => x.selected==true && x.isDefault !=true);
        const data = [...this.state.jobCategories];
        selected.forEach((element) => {
            //console.log(element,"$$$$$$$$")
            this.removeItem(data, element);
            this.inActiveJobCategory(element.jobCategoryId);
        });
        this.setState({ jobCategories:data });
    }

    deleteJobCategory = (id) => {
            this.setState({ showDeleteModal: false,showRemoveModal:false });
             axios.delete(`/api/admin/jobcategory/${id}`).then((res) => {
                 successToastr("Job Category deleted successfully");
                 this.getClientJobCategories(this.state.dataState);
             });
        };
    
    openModal = (prop, dataItem) => {
            this.setState({ showDeleteModal: true });
        };

    inActiveJobCategory = (id) => {
            this.setState({ showDeleteModal: false,showInActiveJobCategoryModal:false });
             axios.delete(`/api/admin/jobcategory/${id}`).then((res) => {
                     successToastr("Job Category InActive successfully");
                     this.getClientJobCategories(this.state.dataState);
                });
        };

    render() {
        //console.log(this.dataItem,"{{{{{{{{{{")
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight">
                            Job Categories
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        placeholder="Search text here!"
                        handleSearch={this.getClientJobCategories}
                        entityType={"Job Categories"}
                        onFirstLoad={this.state.onFirstLoad}
                        page="Job Categories"
                    />
                    <div className="myJobCategoriesContainer">
                    <Grid
                            style={{ height: "auto" }} 
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.jobCategories}
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
                                headerSelectionValue={this.state.jobCategories && this.state.jobCategories.findIndex((dataItem) => dataItem.selected ==false) ==-1}
                            />

                        <GridColumn
                                field="name"
                                width="240px"
                                title="Job Category"
                                cell={(props) => CellRender(props, "Job Category")}
                                columnMenu={ColumnMenu}
                            />
                        <GridColumn
                                field="createdDate"
                                width="180px"
                                filter="date"
                                format="{0:d}"
                                editor="date"
                                title="Created Date"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Created Date")}
                            />
                        {/* <GridColumn
                                field="createdBy"
                                width="180px"
                                title="Created By"
                                cell={(props) => CellRender(props, "Created By")}
                                columnMenu={ColumnMenu}
                            /> */}
                        <GridColumn
                                field="description"
                                width="330px"
                                title="Description"
                                cell={(props) => CellRender(props, "Description")}
                                columnMenu={ColumnMenu}
                            /> 
                        <GridColumn 
                                field="status" 
                                width="110px" 
                                title="Status" 
                                columnMenu={ColumnMenu} 
                                cell={StatusCell} 
                            /> 
                        <GridColumn
                                title="Action"
                                sortable={false}
                                width="40px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.clientDivId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.jobCategories, this.AddNewModal, this.RemoveSelectedJobCategory, this.InActiveSelectedJobCategory)}
                            />
                        <GridColumn 
                                sortable={false} 
                                field="expanded" 
                                title="View More" 
                                cell={this.ExpandCell} 
                            />
                    </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={"Are you sure you want to in-active this job category?"}
                    showModal={this.state.showInActiveJobCategoryModal}
                    handleYes={() => this.inActiveJobCategory(this.dataItem.jobCategoryId)}
                    handleNo={() => {
                        this.setState({ showInActiveJobCategoryModal: false });
                    }}
                />

                <ConfirmationModal
                    message={"Are you sure you want to remove this job category?"}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteJobCategory(this.dataItem.jobCategoryId)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                
                {this.state.showAddNewJobCategoryModal && (
                    <div id="add-jobCategories">
                        <Dialog className="col-12 For-all-responsive-height">
                            <UpsertJobCategories
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showAddNewJobCategoryModal: false }, () => this.getClientJobCategories(this.state.dataState))}
                                onOpenModal={() => this.setState({ showAddNewJobCategoryModal: true })}
                                clientId = {this.state.clientId}
                            />
                        </Dialog>
                    </div>
                )}

                {this.state.showEditModal && (
                    <div id="Edit-jobCategories">
                        <Dialog className="col-12 For-all-responsive-height">
                            <UpsertJobCategories
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showEditModal: false }, () => this.getClientJobCategories(this.state.dataState))}
                                onOpenModal={() => this.setState({ showEditModal: false })}
                                clientId = {this.state.clientId}
                            />
                        </Dialog>
                    </div>
                )}
                </div>
        );
    }
}

export default ManageJobCategories;