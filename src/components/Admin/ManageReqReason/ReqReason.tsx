import * as React from "react";
import auth from "../../Auth";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords, GridToolbar } from "@progress/kendo-react-grid";
import { CellRender, GridNoRecord, StatusCell } from "../../Shared/GridComponents/CommonComponents";
import axios from "axios";
import CompleteSearch from "../../Shared/Search/CompleteSearch";
import ColumnMenu from "../../Shared/GridComponents/ColumnMenu";
import RowActions from "../../Shared/Workflow/RowActions";
import { CustomMenu , DefaultActions } from "./GlobalActions";
import { State, toODataString } from "@progress/kendo-data-query";
import UpsertReqreason from "./UpsertReqReason";
import { Dialog } from "@progress/kendo-react-dialogs";
import { initialDataState, successToastr } from "../../../HelperMethods";
import { KendoFilter } from "../../ReusableComponents";
import ConfirmationModal from "../../Shared/ConfirmationModal";

export interface ManageReqReasonProps {
    
}

export interface ManageReqReasonState {
    reqReason: any;
    onFirstLoad: boolean;
    totalCount?: number;
    showLoader?: boolean;
    showAddNewReqReasonModal?: any;
    showEditModal?: boolean;
    showRemoveModal?: boolean;
    showDeleteModal?: boolean;
    dataState: any; 
}

class ManageReqReason extends React.Component<ManageReqReasonProps, ManageReqReasonState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    public dataItem: any;
    //public reqReasonId: string;
    constructor(props: ManageReqReasonProps) {
        super(props);
        this.state = {
            reqReason: [],
            dataState: initialDataState,
            onFirstLoad: true,
            showLoader: true
        };
    }

    componentDidMount(){
        this.getReqReason(this.state.dataState)
    }

    getReqReason = (dataState) => {
        this.setState({ showLoader: true, onFirstLoad: false });
        var queryStr = `${toODataString(dataState)}`;

        axios.get(`api/admin/reqreason?${queryStr}`).then((res) => {
            //console.log("+++++++++", res.data)
            this.setState({
                reqReason: res.data,
                showLoader: false,
                dataState: dataState,
            });
            this.getReqReasonCount(dataState);
        });
    }
    

    getReqReasonCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;
        
        axios.get(`api/admin/reqreason?${queryStr}`).then((res) => {
            this.setState({
                totalCount: res.data.length,
            });
        });
    };

    selectionChange = (event) => {
        //console.log(event,"$$$$$$$$$$$$$")
        const data = this.state.reqReason.map(item=>{
            if(item.id ==event.dataItem.id){
                item.selected = !event.dataItem.selected;
            }
            return item;
        });
        this.setState({ reqReason:data });
        let isDefaultSelected = this.state.reqReason.filter((x) => x.selected && x.isDefault==true).length > 0;
    }

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        const data = this.state.reqReason.map(item=>{
            item.selected = checked;
            return item;
        });
        this.setState({ reqReason:data });
        this.state.dataState.reqReason = data
        let isDefaultSelected = this.state.reqReason.filter((x) => x.selected && x.isDefault==true).length > 0;
    }

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };
    
    onDataStateChange = (changeEvent) => {
        this.getReqReason(changeEvent.data);
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
        this.setState({showAddNewReqReasonModal: true})
    }

    RemoveSelectedReqReason =() =>{
        const selected = this.state.reqReason.filter((x) => x.selected==true && x.isDefault !=true);
        const data = [...this.state.reqReason];
        selected.forEach((element) => {
            //console.log(element,"$$$$$$$$")
            this.removeItem(data, element);
            this.deleteReqReason(element.id);
        });
        this.setState({ reqReason:data });
    }

    removeItem(data, item) {
        let index = data.findIndex(p => p ==item || (item.id && p.id ==item.id));
        if (index >= 0) {
            data.splice(index, 1);
        }
    }

    deleteReqReason = (id) => {
            this.setState({ showDeleteModal: false,showRemoveModal:false });
            axios.delete(`/api/admin/reqreason/${id}`).then((res) => {
                successToastr("Requisition Reason deleted successfully");
                this.getReqReason(this.state.dataState);
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
                            Requisition Reason
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        placeholder="Search text here!"
                        handleSearch={this.getReqReason}
                        entityType={"Req Reason"}
                        onFirstLoad={this.state.onFirstLoad}
                        page="Requisition Reason"
                    />
                    <div className="myReqReasonContainer">
                    <Grid
                            style={{ height: "auto" }} 
                            sortable={true}
                            onDataStateChange={this.onDataStateChange}
                            pageable={{ pageSizes: true }}
                            data={this.state.reqReason}
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
                                headerSelectionValue={this.state.reqReason && this.state.reqReason.findIndex((dataItem) => dataItem.selected ==false) ==-1}
                            />

                        <GridColumn
                                field="name"
                                width="330px"
                                title="Reason Name"
                                cell={(props) => CellRender(props, "Reason Name")}
                                columnMenu={ColumnMenu}
                            />
                        <GridColumn
                                field="description"
                                width="800px"
                                title="Description"
                                columnMenu={ColumnMenu}
                                cell={(props) => CellRender(props, "Description")}
                                filter="text"
                            />
                        <GridColumn
                                title="Action"
                                sortable={false}
                                width="50px"
                                cell={(props) => (
                                    <RowActions
                                        dataItem={props.dataItem}
                                        currentState={""}
                                        rowId={props.dataItem.clientDivId}
                                        handleClick={this.handleActionClick}
                                        defaultActions={DefaultActions(props)}
                                    />
                                )}
                                headerCell={() => CustomMenu(this.state.reqReason, this.AddNewModal, this.RemoveSelectedReqReason)}
                            />
                    </Grid>
                    </div>
                </div>

                <ConfirmationModal
                    message={"Are you sure you want to remove this requisition reason?"}
                    showModal={this.state.showRemoveModal}
                    handleYes={() => this.deleteReqReason(this.dataItem.id)}
                    handleNo={() => {
                        this.setState({ showRemoveModal: false });
                    }}
                />

                
                {this.state.showAddNewReqReasonModal && (
                    <div id="add-reqReason">
                        <Dialog className="col-12 For-all-responsive-height">
                            <UpsertReqreason
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showAddNewReqReasonModal: false }, () => this.getReqReason(this.state.dataState))}
                                onOpenModal={() => this.setState({ showAddNewReqReasonModal: true })}
                            />
                        </Dialog>
                    </div>
                )}

                {this.state.showEditModal && (
                    <div id="Edit-reqReason">
                        <Dialog className="col-12 For-all-responsive-height">
                            <UpsertReqreason
                                props={this.dataItem}
                                onCloseModal={() => this.setState({ showEditModal: false }, () => this.getReqReason(this.state.dataState))}
                                onOpenModal={() => this.setState({ showEditModal: false })}
                            />
                        </Dialog>
                    </div>
                )}
                </div>
        );
    }
}

export default ManageReqReason;