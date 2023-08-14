import { faSave } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../../Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { ListBox, ListBoxToolbar, processListBoxData, processListBoxDragAndDrop } from '@progress/kendo-react-listbox';
import { successToastr } from "../../../../../HelperMethods";
import clientAdminService from "../../Service/DataService";
import Skeleton from "react-loading-skeleton";
import { CLIENT_REQUISITION_REASONS_MAP_SUCCESS_MSG } from "../../../../Shared/AppMessages";


export interface MapRequisitionReasonsProps {
    props: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface MapRequisitionReasonsState {
    clientId?: string;
    clientLobId?: string;
    submitted: boolean;
    showLoader?: boolean;
    allRequisitionReasons: any;
    selectedRequisitionReasons: any[];
    draggedItem: {};
}

const SELECTED_FIELD = 'selected';

class MapRequisitionReason extends React.Component<MapRequisitionReasonsProps, MapRequisitionReasonsState> {
    private userClientLobId: any = localStorage.getItem("UserClientLobId");
    constructor(props: MapRequisitionReasonsProps) {
        super(props);
        this.state = {
            allRequisitionReasons: [],
            selectedRequisitionReasons: [],
            draggedItem: {},
            clientId: auth.getClient(),
            clientLobId: this.userClientLobId,
            showLoader: true,
            submitted: false,
        };
    }

    componentDidMount() {
        this.setState({ showLoader: false });
        this.getAllRequisitionReasons();
    }

    getAllRequisitionReasons = () => {
        clientAdminService.getAllRequisitionReasons(this.state.clientId)
            .then(async res => {
                this.setState({ allRequisitionReasons: res.data });
            });
    }

    handleSave = () => {
        this.setState({ submitted: true })
        let data = {
            clientId: this.state.clientId,
            clientLobId: this.state.clientLobId,
            ReqReasons: this.state.selectedRequisitionReasons,
        };
        clientAdminService.mapClientRequisitionReasons(data).then((res) => {
            successToastr(CLIENT_REQUISITION_REASONS_MAP_SUCCESS_MSG);
            this.props.onCloseModal();
        });
    }

    handleItemClick = (event) => {
        this.setState({
            allRequisitionReasons: (this.state.allRequisitionReasons.map(item => {
                if (item.name ==event.dataItem.name) {
                    item[SELECTED_FIELD] = !item[SELECTED_FIELD];
                } else if (!event.nativeEvent.ctrlKey) {
                    item[SELECTED_FIELD] = false;
                }
                return item;
            })),
            selectedRequisitionReasons: (this.state.selectedRequisitionReasons.map(item => {
                if (item.name ==event.dataItem.name) {
                    item[SELECTED_FIELD] = !item[SELECTED_FIELD];
                } else if (!event.nativeEvent.ctrlKey) {
                    item[SELECTED_FIELD] = false;
                }
                return item;
            })),
        });
    }


    handleToolBarClick = (e) => {
        let result = processListBoxData(this.state.allRequisitionReasons, this.state.selectedRequisitionReasons, e.toolName, SELECTED_FIELD);
        this.setState({
            allRequisitionReasons: result.listBoxOneData,
            selectedRequisitionReasons: result.listBoxTwoData
        });
    }

    handleDragStart = (e) => {
        this.setState({
            draggedItem: e.dataItem
        });
    }

    handleDrop = (e) => {
        let result = processListBoxDragAndDrop(this.state.allRequisitionReasons, this.state.selectedRequisitionReasons, this.state.draggedItem, e.dataItem, 'name');
        this.setState({
            allRequisitionReasons: result.listBoxOneData,
            selectedRequisitionReasons: result.listBoxTwoData
        });
    }

    render() {
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end map-job-catalog-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            Map Requisition Reasons
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
                                        <label className="mb-0 text-white">All Requisition Reasons</label>
                                    </div>
                                    <ListBox
                                        style={{ height: 250, width: '100%' }}
                                        data={this.state.allRequisitionReasons}
                                        textField="name"
                                        selectedField={SELECTED_FIELD}
                                        onItemClick={(e) => this.handleItemClick(e)}
                                        onDragStart={this.handleDragStart}
                                        onDrop={this.handleDrop}
                                    />
                                </div>

                                <div className="d-flex align-items-center listboxicon col-auto">
                                    <ListBoxToolbar
                                        tools={['transferTo', 'transferFrom']}
                                        data={this.state.allRequisitionReasons}
                                        dataConnected={this.state.selectedRequisitionReasons}
                                        onToolClick={this.handleToolBarClick}
                                    />
                                </div>

                                <div className='col-12 col-sm px-sm-0 shadow-sm'>
                                    <div className="col-12 bg-blue">
                                        <label className="mb-0 text-white">Selected Requisition Reasons</label>
                                    </div>
                                    <ListBox
                                        style={{ height: 250, width: '100%' }}
                                        data={this.state.selectedRequisitionReasons}
                                        textField="name"
                                        selectedField={SELECTED_FIELD}
                                        onItemClick={(e) => this.handleItemClick(e)}
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
                            <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSave} disabled={this.state.selectedRequisitionReasons.length > 0 ? false : true}>
                                <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                              </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default MapRequisitionReason;