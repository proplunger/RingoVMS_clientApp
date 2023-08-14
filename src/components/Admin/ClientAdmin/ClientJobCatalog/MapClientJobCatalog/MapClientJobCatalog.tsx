import { faSave } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../../Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import withValueField from "../../../../Shared/withValueField";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import { ListBox, ListBoxToolbar, processListBoxData, processListBoxDragAndDrop } from '@progress/kendo-react-listbox';
import axios from "axios";
import { successToastr } from "../../../../../HelperMethods";
import { ErrorComponent } from "../../../../ReusableComponents";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import { filterBy } from "@progress/kendo-data-query";
import clientAdminService from "../../Service/DataService";
import globalAdminService from "../../../GlobalAdmin/Service/DataService";
import Skeleton from "react-loading-skeleton";
import Label from "reactstrap/lib/Label";
import { CLIENT_JOB_CATALOG_MAP_SUCCESS_MSG } from "../../../../Shared/AppMessages";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select..", id: null };

export interface MapClientJobCatalogProps {
    props: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface MapClientJobCatalogState {
    clientId?: string;
    clientLobId?: string;
    submitted: boolean;
    showLoader?: boolean;
    allPositions: any;
    selectedPositions: any[];
    draggedItem: {};
}

const SELECTED_FIELD = 'selected';

class MapClientJobCatalog extends React.Component<MapClientJobCatalogProps, MapClientJobCatalogState> {
    private userClientLobId: any = localStorage.getItem("UserClientLobId");
    constructor(props: MapClientJobCatalogProps) {
        super(props);
        this.state = {
            allPositions: [],
            selectedPositions: [],
            draggedItem: {},
            clientId: auth.getClient(),
            clientLobId: this.userClientLobId,
            showLoader: true,
            submitted: false,
        };
    }

    componentDidMount() {
        this.setState({ showLoader: false });
        this.getAllPosition();
    }

    getAllPosition = () => {
        const queryParams = `status eq 'Active'&$orderby=name`;
        globalAdminService.getGlobalJobCatalog(queryParams)
            .then(async res => {
                this.setState({ allPositions: res.data });
            });
    }

    handleSave = () => {
        this.setState({ submitted: true })
        let data = {
            clientId: this.state.clientId,
            clientLobId: this.state.clientLobId,
            positions: this.state.selectedPositions,
        };
        console.log(data)
        clientAdminService.mapClientJobCatalog(data).then((res) => {
            successToastr(CLIENT_JOB_CATALOG_MAP_SUCCESS_MSG);
            this.props.onCloseModal();
        });
    }

    handleItemClick = (event) => {
        this.setState({
            allPositions: (this.state.allPositions.map(item => {
                if (item.name ==event.dataItem.name) {
                    item[SELECTED_FIELD] = !item[SELECTED_FIELD];
                } else if (!event.nativeEvent.ctrlKey) {
                    item[SELECTED_FIELD] = false;
                }
                return item;
            })),
            selectedPositions: (this.state.selectedPositions.map(item => {
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
        let result = processListBoxData(this.state.allPositions, this.state.selectedPositions, e.toolName, SELECTED_FIELD);
        this.setState({
            allPositions: result.listBoxOneData,
            selectedPositions: result.listBoxTwoData
        });
    }

    handleDragStart = (e) => {
        this.setState({
            draggedItem: e.dataItem
        });
    }

    handleDrop = (e) => {
        let result = processListBoxDragAndDrop(this.state.allPositions, this.state.selectedPositions, this.state.draggedItem, e.dataItem, 'name');
        this.setState({
            allPositions: result.listBoxOneData,
            selectedPositions: result.listBoxTwoData
        });
    }

    render() {
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end map-job-catalog-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            Map Client Catalog
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

                                <div className='col col-sm px-sm-0 shadow-sm'>
                                    <div className="col-12 bg-blue">
                                        <label className="mb-0 text-white">All Positions</label>
                                    </div>
                                    <ListBox
                                        style={{ height: 250, width: '100%' }}
                                        data={this.state.allPositions}
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
                                        data={this.state.allPositions}
                                        dataConnected={this.state.selectedPositions}
                                        onToolClick={this.handleToolBarClick}
                                    />
                                </div>

                                <div className='col col-sm px-sm-0 shadow-sm'>
                                    <div className="col-12 bg-blue">
                                        <label className="mb-0 text-white">Selected Positions</label>
                                    </div>
                                    <ListBox
                                        style={{ height: 250, width: '100%' }}
                                        data={this.state.selectedPositions}
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
                            <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSave} disabled={this.state.selectedPositions.length > 0 ? false : true}>
                                <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                              </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default MapClientJobCatalog;