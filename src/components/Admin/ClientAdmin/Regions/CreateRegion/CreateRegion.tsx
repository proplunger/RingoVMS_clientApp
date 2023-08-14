import auth from "../../../../Auth";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import withValueField from "../../../../Shared/withValueField";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import * as React from "react";
import axios from "axios";
import { authHeader, successToastr } from "../../../../../HelperMethods";
import { ErrorComponent } from "../../../../ReusableComponents";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton from "react-loading-skeleton";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select..", id: null };

export interface CreateRegionProps {
    props: any;
    onCloseModal: any;
    onOpenModal: any;
    clientId: string;
    clientName: string;
}

export interface CreateRegionState {
    name?: string;
    clientName: string;
    description?: string;
    regionId?: string;
    zoneId?: string;
    zone?: string;
    submitted: boolean;
    showLoader?: boolean;
    zones: Array<IDropDownModel>;
    originalzones: Array<IDropDownModel>;
}

class CreateRegion extends React.Component<CreateRegionProps, CreateRegionState> {
    constructor(props: CreateRegionProps) {
        super(props);
        this.state = {
            clientName: auth.getClientName(),
            name: "",
            submitted: false,
            zones: [],
            originalzones: [],
            showLoader: true,
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.getZones();
        if (this.props.props) {
            this.setState({ description: this.props.props.description, name: this.props.props.name, regionId: this.props.props.id, zoneId: this.props.props.zoneId, zone: this.props.props.zone })
        }
    }

    getZones = () => {
        let queryParams = `$filter=status eq 'Active'&$orderby=name`;
        if(this.props.props && this.props.props.zoneId){
            queryParams = `$filter=status eq 'Active' or id eq ${this.props.props.zoneId} &$orderby=name `;
        }
        axios.get(`api/clients/${this.props.clientId}/zone?${queryParams}`)
            .then(async res => {
                this.setState({ zones: res.data, originalzones: res.data, showLoader: false });
            });
    }

    handleZoneChange = (e) => {
        const Id = e.target.value;
        this.setState({ zoneId: Id });
    }

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

    openNew = () => {
        this.props.onOpenModal();
    };

    handleSaveAndAddAnother = () => {
        this.setState({ submitted: true })
        const { clientId } = this.props;
        let data = {
            clientId: this.props.clientId,
            regionName: this.state.name,
            description: this.state.description,
            zone: this.state.zoneId,
        };
        if ((this.state.name.trim() !=undefined && this.state.name.trim() !=null && this.state.name.trim() !="") && (this.state.zoneId !=undefined && this.state.zoneId !=null)) {
            axios.post(`api/admin/client/${clientId}/region`, JSON.stringify(data)).then((res) => {
                successToastr("Region created successfully");
                this.props.onCloseModal();
                setTimeout(() => {
                    this.openNew();
                }, 50);
            });
        }
    }

    handleUpdate = () => {
        this.setState({ submitted: true })
        const { regionId } = this.state;
        let data = {
            clientId: this.props.clientId,
            regionId: this.state.regionId,
            regionName: this.state.name,
            description: this.state.description,
            zone: this.state.zoneId,
        };
        if ((this.state.name.trim() !=undefined && this.state.name.trim() !=null && this.state.name.trim() !="") && (this.state.zoneId !=undefined && this.state.zoneId !=null)) {
            axios.put(`api/admin/region/${regionId}`, JSON.stringify(data)).then((res) => {
                successToastr("Region updated successfully");
                this.props.onCloseModal();
            });
        }
    }

    handleSaveAndClose = () => {
        this.setState({ submitted: true })
        const { clientId } = this.props;
        let data = {
            clientId: this.props.clientId,
            regionName: this.state.name,
            description: this.state.description,
            zone: this.state.zoneId,
        };
        if ((this.state.name.trim() !=undefined && this.state.name.trim() !=null && this.state.name.trim() !="") && (this.state.zoneId !=undefined && this.state.zoneId !=null)) {
            axios.post(`api/admin/client/${clientId}/region`, JSON.stringify(data)).then((res) => {
                successToastr("Division created successfully");
                this.props.onCloseModal();
            });
        }
    }

    render() {
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            {this.props.props != undefined ? "Edit Region" : "Add New Region"}
                        </h4>
                        <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.onCloseModal}>
                            &times;
                        </button>
                    </div>
                    {this.state.showLoader &&
                        Array.from({ length: 2 }).map((item, i) => (
                            <div className="row mx-auto mt-2" key={i}>
                                {Array.from({ length: 3 }).map((item, j) => (
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
                                        <Skeleton width={230} />
                                        <Skeleton height={30} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    {!this.state.showLoader && (
                        <div>
                            <div className="row mt-3 mx-0">
                                <div className="col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-0 font-weight-bold">Client</label>
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        disabled={true}
                                        value={(this.props.clientName==null || this.props.clientName==undefined || this.props.clientName=="") ? this.state.clientName : this.props.clientName}
                                    //value={this.props.props!= undefined ? this.props.props.client : ""}
                                    />
                                </div>
                                <div className="col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-0 font-weight-bold required">Region Name</label>
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Enter Region Name"
                                        value={this.state.name}
                                        maxLength={100}
                                        onChange={(event) => {
                                            this.setState({ name: event.target.value });
                                        }}
                                    />
                                    {this.state.submitted && (this.state.name.trim()==undefined || this.state.name.trim()==null || this.state.name.trim()=="") && <ErrorComponent />}
                                </div>
                                <div className="col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-0 font-weight-bold">Description</label>
                                    <textarea
                                        rows={2}
                                        id=""
                                        maxLength={2000}
                                        value={this.state.description}
                                        className="form-control mt-1"
                                        placeholder="Enter Description"
                                        onChange={(event) => {
                                            this.setState({ description: event.target.value });
                                        }}
                                    />
                                </div>
                                {/* </div>
                    <div className="row mt-3 mx-0"> */}
                                <div className="col-12 col-sm-4 mt-1 mt-sm-0">
                                    <label className="mb-0 font-weight-bold required">Zone</label>
                                    <CustomDropDownList
                                        className="form-control mt-1"
                                        data={this.state.zones}
                                        textField="name"
                                        valueField="id"
                                        id="regions"
                                        name="id"
                                        value={this.state.zoneId}
                                        defaultItem={defaultItem}
                                        onChange={(e) => this.handleZoneChange(e)}
                                        filterable={this.state.originalzones.length > 5 ? true : false}
                                        onFilterChange={this.handleFilterChange}
                                    />
                                    {this.state.submitted && (this.state.zoneId==undefined || this.state.zoneId==null) && <ErrorComponent />}
                                </div>
                            </div>
                        </div>
                    )}


                    <div className="modal-footer justify-content-center border-0 mt-3 mb-3">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                            </button>
                            {this.props.props != undefined
                                ? <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleUpdate}>
                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                              </button>
                                : <React.Fragment>
                                    <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSaveAndAddAnother}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save & Add Another
                            </button>
                                    <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSaveAndClose}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save & Close
                            </button>
                                </React.Fragment>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default CreateRegion;