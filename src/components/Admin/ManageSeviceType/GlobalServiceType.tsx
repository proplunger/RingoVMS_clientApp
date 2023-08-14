import * as React from "react";
import auth from "../../Auth";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords, GridToolbar } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import axios from "axios";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import RowActions from "../../Shared/Workflow/RowActions";
import { CustomMenu , DefaultActions} from "./GlobalAction";
import { State, toODataString } from "@progress/kendo-data-query";
import { Dialog } from "@progress/kendo-react-dialogs";
import UpsertServiceType from "./UpsertServiceType";
import { initialDataState, successToastr } from "../../../HelperMethods";
import { KendoFilter } from "../../ReusableComponents";
import ConfirmationModal from "../../Shared/ConfirmationModal";

export interface ManageServiceTypeProps {
    
}

export interface ManageServiceTypeState {
    serviceTypes: any;
    onFirstLoad: boolean;
    totalCount?: number;
    showLoader?: boolean;
    showAddNewServiceTypeModal?: any;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    showDeleteModal?: boolean;
    dataState: any; 
}

class ManageServiceType extends React.Component<ManageServiceTypeProps, ManageServiceTypeState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public dataItem: any;
    //public divId: string;
    constructor(props: ManageServiceTypeProps) {
        super(props);
        this.state = {
            serviceTypes: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true
        };
    }

    componentDidMount(){
        this.getServiceType(this.state.dataState)
    }

    getServiceType = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState)}`;

        axios.get(`api/admin/servicetypes?${queryStr}`).then((res) => {
            console.log("+++++++++", res.data)
            this.setState({
                serviceTypes: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getServiceTypeCount(dataState);
        });
    }
    

    getServiceTypeCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;
        
        axios.get(`api/admin/servicetypes?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
            });
        });
    };

    selectionChange = (event) => {
        console.log(event,"$$$$$$$$$$$$$")
        const data = this.state.serviceTypes.map(item=>{
            if(item.serviceTypeId ==event.dataItem.serviceTypeId){
                item.selected = !event.dataItem.selected;
            }
            return item;
        });
        this.setState({ serviceTypes:data });
        let isDefaultSelected = this.state.serviceTypes.filter((x) => x.selected && x.isDefault==true).length > 0;
    }

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const data = this.state.serviceTypes.map(item=>{
            item.selected = checked;
            return item;
        });
        this.setState({ serviceTypes:data });
        this.state.dataState.divisions = data
        let isDefaultSelected = this.state.serviceTypes.filter((x) => x.selected && x.isDefault==true).length > 0;
    }

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };
    
    onDataStateChange = (changeEvent) => {
        this.getServiceType(changeEvent.data);
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
        this.setState({showAddNewServiceTypeModal: true})
    }

    RemoveSelected =() =>{
        const selected = this.state.serviceTypes.filter((x) => x.selected==true && x.isDefault !=true);
        const data = [...this.state.serviceTypes];
        selected.forEach((element) => {
            //console.log(element,"$$$$$$$$")
            this.removeItem(data, element);
            this.deleteServiceType(element.serviceTypeId);
        });
        this.setState({ serviceTypes:data });
    }

    removeItem(data, item) {
        let index = data.findIndex(p => p ==item || (item.serviceTypeId && p.serviceTypeId ==item.serviceTypeId));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    //deleteSkill = () => {
        deleteServiceType = (serviceTypeId) => {
            this.setState({ showDeleteModal: false,showRemoveModal:false });
            //console.log(serviceTypeId,"[[[")
            //axios.delete(`/api/admin/skill/${this.dataItem.skillId}`).then((res) => {
            axios.delete(`/api/admin/servicetypes/${serviceTypeId}`).then((res) => {
                successToastr("Service Type deleted successfully");
                this.getServiceType(this.state.dataState);
            });
        };

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-12 fonFifteen paddingLeftandRight">
                            Global service Type
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        placeholder="Search text here!"
                        handleSearch={this.getServiceType}
                        entityType={"Service Type"}
                        onFirstLoad={this.state.onFirstLoad}
                        page="Global service Type"
                    />
                    <div className="myServiceTypeContainer">
                    <Grid
                            style={{ height: "auto" }}
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.serviceTypes}
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
                                width="100px"
                                headerSelectionValue={this.state.serviceTypes && this.state.serviceTypes.findIndex((dataItem) => dataItem.selected ==false) ==-1}
                            />

                        <GridColumn
                                field="serviceType"
                                width="360px"
                                title="Service Type"
                                cell={(props) => CellRender(props, "Service Type")}
                                columnMenu={ColumnMenu}
                            />
                        <GridColumn
                                field="serviceCategory"
                                
                                title="Service Category"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Service Category")}
                                filter="text"
                            />
                        <GridColumn
                                field="apply fee"
                               
                                title="Apply Fee"
                                cell={(props) => CellRender(props, "Apply Fee")}
                                columnMenu={ColumnMenu}
                            /> 
                        <GridColumn
                                title="Action"
                                sortable={false}
                                width="100px"
                                //cell={(props) => CellRender(props, "Action")}
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.clientDivId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.serviceTypes, this.AddNewModal, this.RemoveSelected)}
                            />
                    </Grid> 
                    </div>
                </div>

                <ConfirmationModal
                    message={"Are you sure you want to remove this service type?"}
                    showModal={this.state.showRemoveModal}
                   // handleYes={this.deleteSkill}
                    handleYes={() => this.deleteServiceType(this.dataItem.serviceTypeId)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                {this.state.showAddNewServiceTypeModal && (
                    <div id="add-Skill" className="add-Skill-removepadding">
                        <Dialog className="col-12 For-all-responsive-height">
                            <UpsertServiceType
                                props={this.dataItem}
                                //inEdit={false}
                                onCloseModal={() => this.setState({ showAddNewServiceTypeModal: false }, () => this.getServiceType(this.state.dataState))}
                            />
                        </Dialog>
                    </div>
                )}

                {this.state.showEditModal && (
                    <div id="Edit-skill" className="add-Skill-removepadding">
                        <Dialog className="col-12 For-all-responsive-height">
                            <UpsertServiceType
                                props={this.dataItem}
                                //inEdit={true}
                                onCloseModal={() => this.setState({ showEditModal: false }, () => this.getServiceType(this.state.dataState))}
                            />
                        </Dialog>
                    </div>
                )}

                </div>
            );
    }
}

export default ManageServiceType;