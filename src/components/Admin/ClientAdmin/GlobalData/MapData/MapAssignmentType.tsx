import { faSave } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../../Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { ListBox, ListBoxToolbar, processListBoxData, processListBoxDragAndDrop } from '@progress/kendo-react-listbox';
import { successToastr } from "../../../../../HelperMethods";
import clientAdminService from "../../Service/DataService";
import Skeleton from "react-loading-skeleton";
import { CLIENT_ASSINMENT_TYPES_MAP_SUCCESS_MSG } from "../../../../Shared/AppMessages";
import { setTimeout } from "timers";

// export function  useSingleAndDoubleClick(actionSimpleClick, actionDoubleClick, delay = 250) {
//     const [click, setClick] = React.useState(0);

//     React.useEffect(() => {
//         const timer = setTimeout(() => {
//             // simple click
//             if (click ==1) actionSimpleClick();
//             setClick(0);
//         }, delay);

//         // the duration between this click and the previous one
//         // is less than the value of delay = double-click
//         if (click ==2) actionDoubleClick();

//         return () => clearTimeout(timer);
        
//     }, [click]);

//     return () => setClick(prev => prev + 1);
// }

export interface MapAssignmentTypesProps {
    props: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface MapAssignmentTypesState {
    clientId?: string;
    clientLobId?: string;
    submitted: boolean;
    showLoader?: boolean;
    allAssignmentTypes: any;
    selectedAssignmentTypes: any[];
    draggedItem: {};
}

const SELECTED_FIELD = 'selected';

class MapAssignmentTypes extends React.Component<MapAssignmentTypesProps, MapAssignmentTypesState> {

    private click =0;

    private userClientLobId: any = localStorage.getItem("UserClientLobId");
    constructor(props: MapAssignmentTypesProps) {
        super(props);
        this.state = {
            allAssignmentTypes: [],
            selectedAssignmentTypes: [],
            draggedItem: {},
            clientId: auth.getClient(),
            clientLobId: this.userClientLobId,
            showLoader: true,
            submitted: false,
        };
    }

    useSingleAndDoubleClick =(e, transfer)=>{
        return setTimeout(() => {
            // simple click
            if (this.click ==1){
                this.handleItemClick(e);
                this.click = 0;
            } 
            else{
                if (this.click ==2) 
                {
                    this.handleItemClick(e);
                    setTimeout(()=>{
                        this.handleToolBarClick(e , transfer);
                    },250)
                    
                    this.click = 0;
                //clearTimeout(timer);
            }
            }
        }, 500);
    }

    clickItem=(e, transfer?)=>{
        
        this.click = this.click + 1;
        this.useSingleAndDoubleClick(e, transfer);
    }

    componentDidMount() {
        this.setState({ showLoader: false });
        this.getAllAssignmentTypes();
    }

    getAllAssignmentTypes = () => {
        clientAdminService.getAllAssignmentTypes(this.state.clientId)
            .then(async res => {
                this.setState({ allAssignmentTypes: res.data });
            });
    }

    handleSave = () => {
        this.setState({ submitted: true })
        let data = {
            clientId: this.state.clientId,
            AssignmentTypes: this.state.selectedAssignmentTypes,
        };
        clientAdminService.mapClientAssignmentTypes(data).then((res) => {
            successToastr(CLIENT_ASSINMENT_TYPES_MAP_SUCCESS_MSG);
            this.props.onCloseModal();
        });
    }

    handleItemClick = (event) => {
      
        this.setState({
            allAssignmentTypes: (this.state.allAssignmentTypes.map(item => {
                if (item.name ==event.dataItem.name) {
                    item[SELECTED_FIELD] = !item[SELECTED_FIELD];
                } else if (!event.nativeEvent.ctrlKey) {
                    item[SELECTED_FIELD] = false;
                }
                return item;
            })),
            selectedAssignmentTypes: (this.state.selectedAssignmentTypes.map(item => {
                if (item.name ==event.dataItem.name) {
                    item[SELECTED_FIELD] = !item[SELECTED_FIELD];
                } else if (!event.nativeEvent.ctrlKey) {
                    item[SELECTED_FIELD] = false;
                }
                return item;
            })),
        });
    }


    handleToolBarClick = (e, transfer?) => {
        let result = processListBoxData(this.state.allAssignmentTypes, this.state.selectedAssignmentTypes, transfer ? transfer :  e.toolName, SELECTED_FIELD);
        this.setState({
            allAssignmentTypes: result.listBoxOneData,
            selectedAssignmentTypes: result.listBoxTwoData
        });
    }

    handleDragStart = (e) => {
        this.setState({
            draggedItem: e.dataItem
        });
    }

    handleDrop = (e) => {
        let result = processListBoxDragAndDrop(this.state.allAssignmentTypes, this.state.selectedAssignmentTypes, this.state.draggedItem, e.dataItem, 'name');
        this.setState({
            allAssignmentTypes: result.listBoxOneData,
            selectedAssignmentTypes: result.listBoxTwoData
        });
    }

    callbackClick=(e)=>{
        this.handleItemClick(e);
    }
    callbackDoubleClick=(e)=>{
        this.handleToolBarClick(e)
    }

    render() {
        
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end map-job-catalog-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            Map Assignment Types
                        </h4>
                        <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.onCloseModal}>
                            &times;
                        </button>
                    </div>
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
                        <div className="col-12 col-sm-11 mx-auto px-0 mt-4">
                            <div className="row mt-0 mx-0 map-job-catalog">

                                <div className='col-12 col-sm px-sm-0 shadow-sm'>
                                    <div className="col-12 bg-blue">
                                        <label className="mb-0 text-white">All Assignment Types</label>
                                    </div>
                                    <ListBox
                                        style={{ height: 250, width: '100%' }}
                                        data={this.state.allAssignmentTypes}
                                        textField="name"
                                        selectedField={SELECTED_FIELD}
                                        onItemClick={(e) => this.clickItem(e, 'transferTo')}
                                        onDragStart={this.handleDragStart}
                                        onDrop={this.handleDrop}
                                        
                                    />
                                </div>

                                <div className="d-flex align-items-center listboxicon col-auto">
                                    <ListBoxToolbar
                                        tools={['transferTo', 'transferFrom']}
                                        data={this.state.allAssignmentTypes}
                                        dataConnected={this.state.selectedAssignmentTypes}
                                        onToolClick={this.handleToolBarClick}
                                    />
                                </div>

                                <div className='col-12 col-sm px-sm-0 shadow-sm'>
                                    <div className="col-12 bg-blue">
                                        <label className="mb-0 text-white">Selected Assignment Types</label>
                                    </div>
                                    <ListBox

                                        style={{ height: 250, width: '100%' }}
                                        data={this.state.selectedAssignmentTypes}
                                        textField="name"
                                        selectedField={SELECTED_FIELD}
                                        onItemClick={(e) => this.clickItem(e,'transferFrom')}
                                        onDragStart={this.handleDragStart}
                                        onDrop={this.handleDrop}
                                    />
                                </div>

                            </div>
                        </div>
                    )}


                    <div className="modal-footer justify-content-center border-0 mt-2 mb-2">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                            </button>
                            <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSave} disabled={this.state.selectedAssignmentTypes.length > 0 ? false : true}>
                                <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default MapAssignmentTypes;
