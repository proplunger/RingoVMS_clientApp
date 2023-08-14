import { faSave } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../../Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import withValueField from "../../../../Shared/withValueField";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import * as React from "react";
import axios from "axios";
import { errorToastr, successToastr } from "../../../../../HelperMethods";
import Skeleton from "react-loading-skeleton";
import { ErrorComponent } from "../../../../ReusableComponents";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import { filterBy } from "@progress/kendo-data-query";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { UPDATE_REQ_RELEASE_TIER_CONFIRMATION_MSG } from "../../../../Shared/AppMessages";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select...", id: null };
const defaultVendor = { vendor: "Select Vendor", vendorId: null };

export interface CreateVendorTierProps {
    props: any;
    onCloseModal: any;
    onOpenModal: any;
    clientId: string;
    // clientName: string;
}

export interface CreateVendorTierState {
    id?: string;
    fee?: number;
    clientId?: string;
    clientName: string;
    divisionId?: string;
    locationId?: string;
    positionId?: string;
    vendorId?: string;
    vendorTierId?: string;
    divisions: Array<IDropDownModel>;
    locations: Array<IDropDownModel>;
    positions: Array<IDropDownModel>;
    vendors: Array<IDropDownModel>;
    vendorTiers: Array<IDropDownModel>;
    originaldivisions: Array<IDropDownModel>;
    originallocations: Array<IDropDownModel>;
    originalpositions: Array<IDropDownModel>;
    originalvendors: Array<IDropDownModel>;
    originalvendorTiers: Array<IDropDownModel>;
    submitted: boolean;
    showLoader?: boolean;
    showUpdateReqReleaseModal?: boolean;
}
class CreateVendorTier extends React.Component<CreateVendorTierProps, CreateVendorTierState> {
    constructor(props: CreateVendorTierProps) {
        super(props);
        this.state = {
            clientName: auth.getClientName(),
            divisions: [],
            locations: [],
            positions: [],
            vendors: [],
            vendorTiers: [],
            originaldivisions: [],
            originallocations: [],
            originalpositions: [],
            originalvendors: [],
            originalvendorTiers: [],
            submitted: false,
            showLoader: true,
            showUpdateReqReleaseModal: false,
        };
    }

    componentDidMount() {
        this.getClientDivision();
        this.getVendor();
        this.getVendorTier();
        //this.getPosition();
        this.setState({ showLoader: false });

        if (this.props.props) {
            this.setState({ id: this.props.props.id, clientId: this.props.props.clientId, divisionId: this.props.props.clientDivId, locationId: this.props.props.clientDivLocId, positionId: this.props.props.positionId, vendorId: this.props.props.vendorId, vendorTierId: this.props.props.tierId }, () => { this.getDivisionLocations(this.props.props.clientDivId); })
        }
    }

    getClientDivision = () => {
        const { clientId } = this.props;
        let queryParams = `status eq 'Active'&$orderby=name`;
        if (this.props.props && this.props.props.clientDivId) {
            queryParams = `status eq 'Active' or id eq ${this.props.props.clientDivId} &$orderby=name `;
        }
        axios.get(`api/clients/${clientId}/divisions?$filter=${queryParams}`).then((res) => {
            this.setState({ divisions: res.data, originaldivisions: res.data });
        });
    }

    handleDivisionChange = (e) => {
        const Id = e.target.value;
        this.setState({ divisionId: Id, locationId: null });
        if (Id !=null) {
            this.getDivisionLocations(Id);
        } else {
            this.setState({ locations: [] });
        }
    };

    getDivisionLocations(Id) {
        let queryParams = `status eq 'Active' and divId eq ${Id}&$orderby=name`;
        if (this.props.props && this.props.props.clientDivLocId) {
            queryParams = `(status eq 'Active' or id eq ${this.props.props.clientDivLocId}) and divId eq ${Id}&$orderby=name `;
        }
        axios.get(`api/clients/divisions/locations?$filter=${queryParams}`).then((res) => {
            this.setState({ locations: res.data, originallocations: res.data });
        });
    }

    handleLocationChange = (e) => {
        const Id = e.value.id;
        this.setState({ locationId: Id });
    }

    // getPosition = () =>{
    //     axios.get(`api/admin/globaljobcatalogs`)
    //     .then(async res => {
    //         this.setState({ positions: res.data  , originalpositions: res.data});
    //     });
    // }

    // handlePositionChange = (e) => {
    //     const Id = e.value.id;
    //     this.setState({ positionId: Id });
    // }

    getVendor = () => {
        const queryParams = `status eq 'Active'&$orderby=vendor`;
        axios.get(`api/clients/${this.props.clientId}/vendor?$filter=${queryParams}`)
            .then(async res => {
                this.setState({ vendors: res.data, originalvendors: res.data });
            });
    }

    handleVendorChange = (e) => {
        const Id = e.value.vendorId;
        this.setState({ vendorId: Id });
    }

    getVendorTier = () => {
        axios.get(`api/vendor/vendortiertype`)
            .then(async res => {
                this.setState({ vendorTiers: res.data, originalvendorTiers: res.data });
            });
    }

    handleVendorTierChange = (e) => {
        const Id = e.value.id;
        this.setState({ vendorTierId: Id });
    }

    openNew = () => {
        this.props.onOpenModal();
    };

    handleSaveAndAddAnother = () => {
        this.setState({ submitted: true })
        let data = {
            client: this.props.clientId,
            division: this.state.divisionId,
            location: this.state.locationId,
            //position: this.state.positionId,
            vendor: this.state.vendorId,
            vendorTier: this.state.vendorTierId,
        };
        if ((this.state.divisionId !=undefined && this.state.divisionId !=null) && (this.state.locationId !=undefined && this.state.locationId !=null) && (this.state.vendorId !=undefined && this.state.vendorId !=null) && (this.state.vendorTierId !=undefined && this.state.vendorId !=null)) {
            axios.post(`api/vendor/vendortier`, JSON.stringify(data)).then((res) => {
                successToastr("Vendor Tier created successfully");
                this.props.onCloseModal();
                setTimeout(() => {
                    this.openNew();
                }, 50);
            });
        }
    }

    handleUpdate = (isUpdateReqRelease: boolean) => {
        this.setState({ submitted: true })
        const { id } = this.state;
        let data = {
            VendorClientTierId: this.state.id,
            client: this.props.clientId,
            division: this.state.divisionId,
            location: this.state.locationId,
            //position: this.state.positionId,
            vendor: this.state.vendorId,
            vendorTier: this.state.vendorTierId,
            isUpdateReqRelease: isUpdateReqRelease,
        };
        if ((this.state.divisionId !=undefined && this.state.divisionId !=null) && (this.state.locationId !=undefined && this.state.locationId !=null) && (this.state.vendorId !=undefined && this.state.vendorId !=null) && (this.state.vendorTierId !=undefined && this.state.vendorId !=null)) {
            axios.put(`api/vendor/vendortier/${id}`, JSON.stringify(data)).then((res) => {
                if (res.data && !res.data.isSuccess) {
                    errorToastr(res.data.statusMessage);
                    this.setState({
                      showUpdateReqReleaseModal: true,
                    });
                  } else {
                    successToastr("Vendor Tier updated successfully");
                    this.props.onCloseModal();
                  }
            });
        }
    }

    handleSaveAndClose = () => {
        this.setState({ submitted: true })
        let data = {
            client: this.props.clientId,
            division: this.state.divisionId,
            location: this.state.locationId,
            //position: this.state.positionId,
            vendor: this.state.vendorId,
            vendorTier: this.state.vendorTierId,
        };
        if ((this.state.divisionId !=undefined && this.state.divisionId !=null) && (this.state.locationId !=undefined && this.state.locationId !=null) && (this.state.vendorId !=undefined && this.state.vendorId !=null) && (this.state.vendorTierId !=undefined && this.state.vendorTierId !=null)) {
            axios.post(`api/vendor/vendortier`, JSON.stringify(data)).then((res) => {
                successToastr("Vendor Tier created successfully");
                this.props.onCloseModal();
            });
        }
    }

    handleFilterChange = (event) => {
        var name = event.target.props.id;
        var originalArray = "original" + name;
        this.state[name] = this.filterData(event.filter, originalArray);
        this.setState(this.state);
    }

    filterData(filter, originalArray) {
        const data1 = this.state[originalArray];
        return filterBy(data1, filter);
    }

    render() {
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            {this.props.props != undefined ? "Edit Vendor Tier" : "Add New Vendor Tier"}
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
                                        <Skeleton width={100} />
                                        <Skeleton height={30} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    {!this.state.showLoader && (
                        <div>
                            <div className="row mt-3 mx-0">
                                <div className="col-sm-4">
                                    <label className="mb-0 font-weight-bold">Client</label>
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        disabled={true}
                                        value={this.state.clientName}
                                    //value={this.props.props!= undefined ? this.props.props.client : ""}
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <label className="mb-1 font-weight-bold required">Division</label>
                                    <CustomDropDownList
                                        className="form-control disabled "
                                        name={`clientDivisionId`}
                                        data={this.state.divisions}
                                        textField="name"
                                        valueField="id"
                                        id="divisions"
                                        value={this.state.divisionId}
                                        defaultItem={defaultItem}
                                        onChange={this.handleDivisionChange}
                                        filterable={this.state.originaldivisions.length > 5 ? true : false}
                                        onFilterChange={this.handleFilterChange}
                                    />
                                    {this.state.submitted && (this.state.divisionId==undefined || this.state.divisionId==null) && <ErrorComponent />}
                                </div>
                                <div className="col-sm-4">
                                    <label className="mb-1 font-weight-bold required">Location</label>
                                    <CustomDropDownList
                                        className="form-control disabled"
                                        name={`divisionLocationId`}
                                        disabled={!this.state.divisionId}
                                        data={this.state.locations}
                                        textField="name"
                                        valueField="id"
                                        id="locations"
                                        defaultItem={defaultItem}
                                        value={this.state.locationId}
                                        onChange={(e) => this.handleLocationChange(e)}
                                        filterable={this.state.originallocations.length > 5 ? true : false}
                                        onFilterChange={this.handleFilterChange}
                                    />
                                    {this.state.submitted && (this.state.locationId==undefined || this.state.locationId==null) && <ErrorComponent />}
                                </div>
                            </div>

                            <div className="row mt-3 mx-0">
                                {/* <div className="col-sm-4">
                                                <label className="mb-1 font-weight-bold">Position</label>
                                                <CustomDropDownList
                                                    className="form-control disabled"
                                                    name={"position"}
                                                    data={this.state.positions}
                                                    textField="name"
                                                    valueField="id"
                                                    id="positions"
                                                    defaultItem={defaultItem}
                                                    value={this.state.positionId}
                                                    onChange={(e) => this.handlePositionChange(e)}
                                                    filterable={this.state.originalpositions.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                />
                                            </div> */}
                                <div className="col-12 col-sm-4">
                                    <label className="mb-1 font-weight-bold required">Vendor</label>
                                    <CustomDropDownList
                                        className={"form-control"}
                                        data={this.state.vendors}
                                        name="vendor"
                                        textField="vendor"
                                        valueField="vendorId"
                                        id="vendors"
                                        defaultItem={defaultVendor}
                                        value={this.state.vendorId}
                                        onChange={(e) => this.handleVendorChange(e)}
                                        filterable={this.state.originalvendors.length > 5 ? true : false}
                                        onFilterChange={this.handleFilterChange}
                                    />
                                    {this.state.submitted && (this.state.vendorId==undefined || this.state.vendorId==null) && <ErrorComponent />}
                                </div>
                                <div className="col-12 col-sm-4">
                                    <label className="mb-1 font-weight-bold required">Vendor Tier</label>
                                    <CustomDropDownList
                                        className="form-control"
                                        name={`id`}
                                        data={this.state.vendorTiers}
                                        textField="name"
                                        valueField="id"
                                        id="vendorTiers"
                                        defaultItem={defaultItem}
                                        value={this.state.vendorTierId}
                                        onChange={(e) => this.handleVendorTierChange(e)}
                                        filterable={this.state.originalvendorTiers.length > 5 ? true : false}
                                        onFilterChange={this.handleFilterChange}
                                    />
                                    {this.state.submitted && (this.state.vendorTierId==undefined || this.state.vendorTierId==null) && <ErrorComponent />}
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
                                ? <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => {this.handleUpdate(false)}}>
                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                </button>
                                : <div>
                                    <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSaveAndAddAnother}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save & Add Another
                                    </button>
                                    <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSaveAndClose}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save & Close
                                    </button>
                                </div>}
                        </div>
                    </div>
                </div>

                {this.state.id && this.state.showUpdateReqReleaseModal && (
                    <ConfirmationModal
                        message={UPDATE_REQ_RELEASE_TIER_CONFIRMATION_MSG()}
                        showModal={this.state.showUpdateReqReleaseModal}
                        handleYes={() => {
                            this.setState({ showUpdateReqReleaseModal: false });
                            this.handleUpdate(true);
                        }}
                        handleNo={() => {
                            this.setState({ showUpdateReqReleaseModal: false });
                        }}
                    />
                )}
            </div>
        );
    }
}

export default CreateVendorTier;