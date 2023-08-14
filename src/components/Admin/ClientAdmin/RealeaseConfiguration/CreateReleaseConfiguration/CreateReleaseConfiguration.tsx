import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faSave, faTimesCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import auth from "../../../../Auth";
import clientAdminService from "../../Service/DataService";
import { errorToastr, history, successToastr, warningToastr } from "../../../../../HelperMethods";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { releaseConfigurationValidation } from "./validations/validation";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../../../Shared/withValueField";
import { GridNoRecord } from "../../../../Shared/GridComponents/CommonComponents";
import DropwDownContainer from "./DropdownContainer";
import "react-dropdown-tree-select/dist/styles.css";
import axios from "axios";
import { FindSelectedVendorValues, GetClientLocationVendorTiers, GetReleaseStatus, SelectDropdownMenus } from "./HelperFunctions";
import { IReqReleaseVm, VendorDropdownModel } from "./IReleaseVendorState";
import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";
import { Menu } from "@progress/kendo-react-layout";
import _ from "lodash";
import Label from "reactstrap/lib/Label";
import AlertBox from "../../../../Shared/AlertBox";
import ConfirmationModal from "../../../../Shared/ConfirmationModal";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import { DistributionType, VendorTierType } from "../../../../Shared/AppConstants";
import { NO_VENDOR_CONFIGURED, RELEASE_SAVE_SUCCESS_MSG, RELEASE_UPDATED_SUCCESS_MSG, } from "../../../../Shared/AppMessages";
import CommonInfoMultiselect from "../../OnBoardingConfiguration/CreateOnBoardingConfiguration/CommonInfoMultiselect";
import ReleaseGroupTask from "../Common/ReleaseGroupTasks";
import DuplicateVendorTier from "../Common/DuplicateVendorTiers";
import { EDIT_RELEASE } from "../../../../Shared/ApiUrls";
import BreadCrumbs from "../../../../Shared/BreadCrumbs/BreadCrumbs";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select...", id: null };

export interface CreateReleaseConfigurationProps {
    props: any;
    match: any;
    onCloseModal: any;
    onOpenModal: any;
}

export interface CreateReleaseConfigurationState {
    relConfigGroupId: string;
    clientId?: string;
    releaseConfigId: string;
    clientName?: string;
    submitted: boolean;
    openCommentBox?: boolean;
    isPrivate?: boolean;
    showLoader?: boolean;
    isDirty?: boolean;
    data?: any;
    vendorsList?: VendorDropdownModel[];
    selectedVendors?: any[];
    PlatinumExpanded: boolean;
    GoldExpanded: boolean;
    SilverExpanded: boolean;
    UtilityExpanded: boolean;
    PlatinumItemsToShow: any;
    GoldItemsToShow: any;
    SilverItemsToShow: any;
    UtilityItemsToShow: any;
    indexToDelete: number;
    isNewRelease?: boolean;
    idToUnrelease: string;
    selectedContainer?: any[];
    distributionsList: IDropDownModel[];
    releaseStatusList: IDropDownModel[];
    showAlert?: boolean;
    openConfirmDelete?: boolean;
    dataItem?: any;
    isInEdit?: boolean;
    selectedDivisions: any;
    isAllDivSelected: boolean;
    selectedLocations: any;
    isAllLocSelected: boolean;
    selectedJobCategory: any;
    selectedPositions: any;
    isAllJobCatSelected: any;
    isAllJobPosSelected: any;
    openExistingReleasesGrid: any;
    exisitingGroupIds: any;
    IsSaveAndRemove: boolean;
    openDuplicateVendorTiersGrid: any;
    DuplicateVednorsData: any;
    isProfileUpdate: boolean;
}

const headerMenu = [
    {
        text: "",
        icon: "more-horizontal",
        items: [
            {
                text: "Add Release",
                icon: "plus-outline"
            },
        ],
    },
];
const headerMenuReleased = [
    {
        text: "",
        icon: "",
        items: [],
    },
];
const rowMenuAll = [
    {
        text: "",
        icon: "more-horizontal",
        items: [
            { text: "Edit", icon: "edit Icon_Size" },
            { text: "Delete", icon: "delete Icon_Size" },
        ],
    },
];
const rowMenuReleased = [
    {
        text: "",
        icon: "more-horizontal",
        items: [{ text: "Edit", icon: "edit" }],
    },
];

class CreateReleaseConfiguration extends React.Component<CreateReleaseConfigurationProps, CreateReleaseConfigurationState> {
    public vendorConfig: any;
    public releaseConfigChild: any;
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    editField = "inEdit";
    private originalLevels;
    private currentDataItem;
    private selectedReleaseVendorMapping: any[] = [];
    orignialVendorsList: VendorDropdownModel[];
    private alertMessage = "";
    private clientDefReqRelId: "";
    private distributionsList: IDropDownModel[] = [
        { id: "1", name: DistributionType.IMMEDIATE },
        { id: "2", name: DistributionType.AFTERDAYS }
    ];

    constructor(props: CreateReleaseConfigurationProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            data: [],
            relConfigGroupId: id,
            releaseConfigId: "",
            clientId: auth.getClient(),
            submitted: false,
            isDirty: false,
            showLoader: true,
            vendorsList: [],
            selectedVendors: [],
            PlatinumExpanded: false,
            GoldExpanded: false,
            SilverExpanded: false,
            UtilityExpanded: false,
            PlatinumItemsToShow: 3,
            GoldItemsToShow: 3,
            SilverItemsToShow: 3,
            UtilityItemsToShow: 3,
            indexToDelete: -1,
            idToUnrelease: "",
            distributionsList: this.distributionsList,
            releaseStatusList: [],
            selectedContainer: [],
            selectedDivisions: [],
            selectedLocations: [],
            selectedJobCategory: [],
            selectedPositions: [],
            isAllDivSelected: false,
            isAllLocSelected: false,
            isAllJobCatSelected: false,
            isAllJobPosSelected: false,
            openExistingReleasesGrid: false,
            exisitingGroupIds: [],
            IsSaveAndRemove: false,
            openDuplicateVendorTiersGrid: false,
            DuplicateVednorsData: [],
            isProfileUpdate: false
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        if (id) {
            this.getReleaseConfigurationDetails(id);
            this.clientDefReqRelId = id;

        } else {
            this.setState({ showLoader: false, isNewRelease: true });
        }
    }

    handleObjChange = (change) => {
        // if (change.hasOwnProperty("selectedDivisions")) {
        //     this.divisionId = change.selectedDivisions;
        // }
        // if (change.hasOwnProperty("selectedLocations")) {
        //     this.locationId = change.selectedLocations;
        // }
        change["isDirty"] = true;
        this.setState(change);
    };

    handleDropdownChange = async (e,selectedLoc) => {
        let change = { isDirty: true };
        //change[e.target.props.name] = e.target.value;
        if (e.target.props.name=="selectedLocations") {
            //this.locationId = e.target.value;
            this.orignialVendorsList = await GetClientLocationVendorTiers(this.state.clientId, selectedLoc.map((loc) => loc.id), this.state.selectedDivisions.map((div) => div.id));
            this.setState({ distributionsList: this.distributionsList });
            this.setState({ releaseStatusList: await GetReleaseStatus() });
            this.setState({ vendorsList: this.orignialVendorsList.filter(x => x.children.length > 0), showLoader: false });
        }
        // if (e.target.props.name=="selectedPositions") {
        //     this.positionId = e.target.value;
        // }
        ////this.getReqRelease(reqDetails);
        //this.setState(change);
    };


    saveReleaseConfiguration = (isSubmit: boolean, isSaveAndRemove: boolean) => {
        if (this.state.data.length==0) {
            this.alertMessage = "Please add release to save.";
            this.setState({ showAlert: true });
            return false;
        }
        if (this.state.data.some((d) => d.inEdit ==true)) {
            this.alertMessage = "Please save data in each row before Release.";
            this.setState({ showAlert: true });
            return false;
        }
        console.log(isSubmit)
        this.submitRelease(isSaveAndRemove);
    }

    getReleaseConfigurationDetails(relConfigGroupId: string) {
        clientAdminService.getReleaseConfigurationDetail(relConfigGroupId).then(async (res) => {
            const { data } = res;
            var divs = [];
            data.divisionIds.map((x) =>
                divs.filter((a) => a.id==x.id).length > 0
                    ? null
                    : divs.push({ id: x.id, name: x.name })
            );
            var locs = [];
            data.locationIds.map((x) =>
                locs.filter((a) => a.id==x.id).length > 0
                    ? null
                    : locs.push({ id: x.id, name: x.name })
            );
            var cats = [];
            data.jobCategoryIds.map((x) =>
                cats.filter((a) => a.id==x.id).length > 0
                    ? null
                    : cats.push({ id: x.id, name: x.name })
            );
            var pos = [];
            data.positionIds.map((x) =>
                pos.filter((a) => a.name==x.id).length > 0
                    ? null
                    : pos.push({ id: x.id, name: x.name })
            );
            this.orignialVendorsList = await GetClientLocationVendorTiers(this.state.clientId, locs.map((loc) => loc.id), divs.map((div) => div.id));
            this.setState({ vendorsList: this.orignialVendorsList.filter(x => x.children.length > 0), showLoader: false });
            this.getReqRelease(relConfigGroupId);
            this.setState({
                isInEdit: true,
                releaseConfigId: data.Id,
                relConfigGroupId: data.relConfigGroupId,
                clientId: data.clientId,
                selectedDivisions: divs,
                selectedLocations: locs,
                selectedJobCategory: cats,
                selectedPositions: pos,
                showLoader: false,
            }, () => {
                this.state.selectedDivisions && this.state.selectedDivisions.length > 0 && this.releaseConfigChild.getLocations(this.state.selectedDivisions.map((div) => div.id));
                this.state.selectedJobCategory  && this.state.selectedJobCategory.length > 0 && this.releaseConfigChild.getPositions(this.state.selectedJobCategory.map((pos) => pos.id));
            });
        });
    }

    vendorChange = (currentNode, selectedNodes, index) => {
        this.setState({
            selectedVendors: selectedNodes,
        });
        if (!currentNode && selectedNodes.length > 0) {
            const vendors = SelectDropdownMenus(this.orignialVendorsList, selectedNodes);
            this.state.data[index].allVendorList = vendors;
            //this.setState({ vendorsList: vendors });
        }
        if (currentNode) {
            if (currentNode.hasOwnProperty('_children')) {
                if (currentNode.checked) {
                    currentNode._children.forEach(element => {

                        this.state.data[index].selectedReleaseVendorMapping.push({
                            name: currentNode.label,
                            tier: currentNode.rankingType,
                            releaseVendorMappingId: undefined,
                            vendorId: element,
                        });
                    });
                }
                else {
                    currentNode._children.forEach(element => {
                        this.state.data[index].selectedReleaseVendorMapping.splice(this.state.data[index].selectedReleaseVendorMapping.findIndex(x => x.vendorId==element), 1);
                    });
                }
            }
            else {
                if (currentNode.checked) {
                    this.state.data[index].selectedReleaseVendorMapping.push({
                        name: currentNode.label,
                        tier: currentNode.rankingType,
                        releaseVendorMappingId: undefined,
                        vendorId: currentNode.id,
                    });
                }
                else {
                    this.state.data[index].selectedReleaseVendorMapping.splice(this.state.data[index].selectedReleaseVendorMapping.findIndex(x => x.name==currentNode.label), 1);
                }
            }

            selectedNodes = selectedNodes.map(({ checked, id, label, tagClassName, _id, _parent }) => ({
                checked,
                id,
                label,
                tagClassName,
                _id,
                _parent,
            }));
        }
        this.state.data[index].reqReleaseVendorMap = selectedNodes;
        this.setState({ data: this.state.data });
    };

    onDistributionChange = (e, index) => {
        if (e.value.name==DistributionType.IMMEDIATE) {
            this.state.data[index].noOfDays = 0;
        }
        else {
            this.state.data[index].noOfDays = 1;
        }
        this.state.data[index].distType = e.value;
        this.setState({ data: this.state.data });
    };

    handleChange = (e, index) => {

        this.state.data[index].noOfDays = e.value;
        this.setState({ data: this.state.data });
    };

    async deleteTag(id: string, status: string, index: number) {
        var el = document.getElementById("index" + index);

        var delElem = await el.querySelector<HTMLElement>("[id='" + id + "_button']");
        setTimeout(() => {
            delElem.click();
        }, 1000);
    }

    deleteTagAfterRelease(id: string, index: number) {
        //document.getElementById(id + '_button').click();

        // var el = document.getElementById("index" + index);
        // el.querySelector<HTMLElement>("[id='" + id + "_button']").click();
        // this.setState({ openConfirmUnrelease: false });
    }

    showMore(rank, index) {
        switch (rank) {
            case "PlatinumExpanded":
                this.state.data[index].PlatinumExpanded = !this.state.data[index].PlatinumExpanded;
                break;
            case "GoldExpanded":
                this.state.data[index].GoldExpanded = !this.state.data[index].GoldExpanded;
                break;
            case "SilverExpanded":
                this.state.data[index].SilverExpanded = !this.state.data[index].SilverExpanded;
                break;
            case "UtilityExpanded":
                this.state.data[index].UtilityExpanded = !this.state.data[index].UtilityExpanded;
        }
        this.setState({ data: this.state.data });
    }

    getReqRelease = (id) => {
        axios.get(`api/admin/releasevendorconfig/${id}`).then((res) => {
            // this.setState({data:releaseData});
            if (res.data.length > 0) {
                this.populateReleaseVendors(res.data);
            }
        });
    };

    populateReleaseVendors(releaseVendors: any[]) {
        releaseVendors.map((d, index) => {
            let tempMapping = d.reqReleaseVendorMap;
            let updateVendors = SelectDropdownMenus(this.orignialVendorsList, d.reqReleaseVendorMap);
            let selectedVendors = FindSelectedVendorValues(this.orignialVendorsList, d.reqReleaseVendorMap);
            d.allVendorList = updateVendors;
            this.state.selectedContainer.push(selectedVendors);
            d.reqReleaseVendorMap = selectedVendors;
            d.status = d.status.name;
            if (d.noOfDays==0) {
                d.distType.id = "1";
                d.distType.name = DistributionType.IMMEDIATE;
            }
            else {
                d.distType.id = "2";
                d.distType.name = DistributionType.AFTERDAYS;
            }
            d.index = index;
            this.state.data.push(d);

            this.state.data[index].inEdit = undefined;
            this.state.data[index].index = index;
            this.state.data[index].PlatinumExpanded = false;
            this.state.data[index].GoldExpanded = false;
            this.state.data[index].SilverExpanded = false;
            this.state.data[index].UtilityExpanded = false;
            this.state.data[index].selectedReleaseVendorMapping = tempMapping;
            this.vendorChange(null, selectedVendors, index);
        }, () => {
            this.setState({ data: this.state.data });
        });

    }

    close = () => {
        if (this.state.data.some((d) => d.reqReleaseId ==undefined)) {
            if (window.confirm("Any changes made will be lost. Do you wish to continue?")) {
                history.goBack();
            }
            return false;
        } else {
            history.goBack();
        }
    };
    onHeaderMenuSelect = (e) => {
        if (e.itemId=="0_0") {
            this.addNew();
        }
    };

    onRowMenuSelect = (e, index, dataItem) => {
        if (e.itemId=="0_0") {
            this.enterEdit(index);
        }
        if (e.itemId=="0_1") {
            this.setState({ indexToDelete: index, openConfirmDelete: true, dataItem: dataItem });
        }
    };

    addNew = () => {
        if (this.orignialVendorsList==undefined || this.orignialVendorsList==null || this.orignialVendorsList.length==0) {
            this.alertMessage = NO_VENDOR_CONFIGURED;
            this.setState({ showAlert: true });
            return false;
        }

        let currentIndex = this.state.data.length;
        let defaultTimingCatalog = this.state.distributionsList.filter((x) => x.name==DistributionType.IMMEDIATE)[0];
        //let defaultReleaseStatus = this.state.releaseStatusList.filter((x) => x.name=="Pending Release")[0].name;
        const newDataItem: IReqReleaseVm = {
            index: currentIndex,
            allVendorList: this.state.vendorsList,
            reqReleaseVendorMap: [],
            distType: defaultTimingCatalog,
            releaseDate: new Date(),
            reqReleaseId: undefined,
            statusId: "4bcc296f-f196-4a9d-92a9-32ae46a33e76",
            status: "",
            inEdit: true,
            isDefault: false,
            noOfDays: 0,
            selectedReleaseVendorMapping: [],
        };

        this.state.data.push(newDataItem);
        this.setState({ data: this.state.data });
        // this.props.handleApproversChange(this.state.data);
    };

    enterEdit = (index) => {
        this.state.data[index].inEdit = true;
        this.setState({ data: this.state.data });
    };

    // disableContents = (index) => {
    //     setTimeout(() => {
    //         if (this.state.data[index].status=="Released") {
    //             let allVendorIds = this.state.data[index].allVendorList.map((x) => x.id);
    //             this.state.data[index].allVendorList.forEach((vendor) => {
    //                 if (vendor.children.length > 0) {
    //                     vendor.children.forEach((child) => {
    //                         allVendorIds.push(child.id);
    //                     });
    //                 }
    //             });
    //             let selectedVendorIds = this.state.data[index].reqReleaseVendorMap.map((x) => x.id);

    //             let unSelectedVendorIds = difference(allVendorIds, selectedVendorIds);
    //             unSelectedVendorIds.forEach((id) => {
    //                 if (document.getElementById(id) !=null) {
    //                     var el = document.getElementById("index" + index);
    //                     el.querySelector<HTMLElement>("[id='" + id + "']").setAttribute("disabled", "true");
    //                     //document.getElementById(id).setAttribute('disabled','true');
    //                 }
    //             });
    //         }
    //     }, 100);
    // };

    update = (index) => {
        if (this.state.data[index].reqReleaseVendorMap.length > 0 || this.state.data[index].status=="Released") {
            this.state.data[index].inEdit = undefined;
            this.setState({ data: this.state.data });
        } else {
            this.alertMessage = "Please select vendors to save.";
            //this.setState({ showAlert: true })
            return false;
        }
    };

    updateItem = (data, item) => {
        let index = data.findIndex((p) => p ==item || (item.releaseId && p.releaseId ==item.releaseId));
        if (index >= 0) {
            data[index] = { ...item };
        }
    };

    cancel = (dataItem) => { };

    delete = (index, dataItem) => {
        const data = this.state.data;
        // if (data.length==1) {
        //     //this.setState({ openConfirmDelete: false });
        //     this.alertMessage = "At least one release is required."
        //     //this.setState({ showAlert: true });
        //     return false;
        // }
        this.setState({ openConfirmDelete: false });
        this.removeItem(data, dataItem);
        //this.setState({ data: data, openConfirmDelete: false });
    };

    removeItem(data, item) {
        let index = data.findIndex((p) => p ==item || (item.releaseId && p.releaseId ==item.releaseId));
        if (index >= 0) {
            data.splice(index, 1);
        }
        //this.setState({ data: data, openConfirmDelete: false });
    }

    resetChanges = () => {
        const data = { ...this.originalLevels };
        this.setState({ data });
    };

    save() {
        if (this.state.data.length==0) {
            this.alertMessage = "Please add release to save.";
            this.setState({ showAlert: true });
            return false;
        }
        if (this.state.data.some((d) => d.inEdit ==true)) {
            this.alertMessage = "Please save data in each row before Release.";
            this.setState({ showAlert: true });
            return false;
        }
        this.submitRelease(false);
    };

    handleCheckboxChange(e, modelProp) {
    var stateObj = {};
    stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
    this.setState(stateObj);
    }

    submitRelease = (isSaveAndRemove) => {
        this.state.data.map((data, index) => {
            data.releaseVendorMappings = data.selectedReleaseVendorMapping.map(x => { return { vendorId: x.vendorId, rank: x.tier, releaseVendorMappingId: x.reqReleaseVendorMapId } });
        });

        if (this.state.isNewRelease) {
            const defrel = {
                clientId: this.state.clientId,
                Divisions: this.state.selectedDivisions.map((div) => div.id),
                Locations: this.state.selectedLocations.map((loc) => loc.id),
                Positions: this.state.selectedPositions.map((pos) => pos.id),                
                reqReleaseCollectionVms: this.state.data,
                isSaveAndRemove: isSaveAndRemove,
                tags: this.releaseConfigChild.tagRef.state.selectedValues
            };
            axios.post("/api/admin/releaseconfiguration", JSON.stringify(defrel)).then((res) => {               
                if (res.data && !res.data.isSuccess) {
                    if(res.data && !res.data.isSuccess && res.data.responseCode=="3"){
                        warningToastr(res.data.statusMessage);
                        this.setState({
                            openDuplicateVendorTiersGrid: true,
                            DuplicateVednorsData: res.data.data,
                        }); 
                    }
                    else{
                        errorToastr(res.data.statusMessage);
                        this.setState({
                            openExistingReleasesGrid: true,
                            exisitingGroupIds: res.data.data,
                        });
                    }
                  } else {
                    successToastr(RELEASE_SAVE_SUCCESS_MSG);
                    history.push("/admin/releaseconfig/manage");
                  }
            });
        } 
        else {
            const defrel = {
                clientDefReqRelId: this.clientDefReqRelId,
                RelConfigGroupId: this.state.relConfigGroupId,
                clientId: this.state.clientId,
                Divisions: this.state.selectedDivisions.map((div) => div.id),
                Locations: this.state.selectedLocations.map((loc) => loc.id),
                Positions: this.state.selectedPositions.map((pos) => pos.id),
                reqReleaseCollectionVms: this.state.data,
                isSaveAndRemove: isSaveAndRemove,
                isProfileUpdate: this.state.isProfileUpdate
            };

            axios.put("/api/admin/releaseconfiguration", JSON.stringify(defrel)).then((res) => {             
                if (res.data && !res.data.isSuccess) {
                    if(res.data && !res.data.isSuccess && res.data.responseCode=="3"){
                        warningToastr(res.data.statusMessage);
                        this.setState({
                            openDuplicateVendorTiersGrid: true,
                            DuplicateVednorsData: res.data.data,
                        });
                    }
                    else{
                        errorToastr(res.data.statusMessage);
                        this.setState({
                            openExistingReleasesGrid: true,
                            exisitingGroupIds: res.data.data,
                        });
                    }
                  } else {
                    successToastr(RELEASE_SAVE_SUCCESS_MSG);
                    history.push("/admin/releaseconfig/manage");
                  }
            });
        }
    };

    render() {
        const controlsToShow = ['CLIENT', 'DIVISION', 'LOCATION', 'POSITION', 'JOB CATEGORY']
    
        const {
            releaseConfigId,
            relConfigGroupId,
            clientId,
            selectedDivisions,
            selectedLocations,
            selectedJobCategory,
            selectedPositions,
            isAllDivSelected,
            isAllLocSelected,
            isAllJobCatSelected,
            isAllJobPosSelected            
        } = this.state;
        const commonInfo = {
            releaseConfigId,
            relConfigGroupId,
            clientId,
            selectedDivisions,
            selectedLocations,
            selectedJobCategory,
            selectedPositions,
            isAllDivSelected,
            isAllLocSelected,
            isAllJobCatSelected,
            isAllJobPosSelected
        };
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-12 col-md-12 fonFifteen paddingLeftandRight">
                            <div className="row mx-0 align-items-center">
                                <div>
                                    {/* {this.state.relConfigGroupId ? "Edit" : "Add"} Release */}
                                <BreadCrumbs globalData={{relConfigGroupId:this.state.relConfigGroupId}}></BreadCrumbs>
                                </div>
                                {this.state.relConfigGroupId && (<div className="col pr-0 d-flex align-items-center justify-content-end">
                                    <span className=" d-none d-sm-inline">
                                    <label className="container-R d-flex mb-0 pb-0 dispaly-ssn-inline">
                                        <span className="Introduction-line-height pl-0">
                                            Edit Profile
                                        </span>
                                        <input
                                            type="checkbox"
                                            onChange={(e) =>
                                            this.handleCheckboxChange(e, "isProfileUpdate")
                                            }
                                        />
                                        <span
                                            className="checkmark-R checkPosition checkPositionTop"
                                            style={{ left: "0px" }}
                                        ></span>
                                    </label>
                                    </span>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
                <Formik
                    validateOnMount={this.state.submitted}
                    initialValues={this.state}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={releaseConfigurationValidation}
                    validateOnBlur={false}
                    onSubmit={async () => this.saveReleaseConfiguration(true, false)}
                    render={(formikProps) => (
                        <Form className="col-12 ml-0 mr-0" id="collapsiblePadding" translate="yes" onChange={formikProps.handleChange}>
                            {((relConfigGroupId && selectedDivisions) || !relConfigGroupId) &&
                                <CommonInfoMultiselect
                                    ref={(instance) => {
                                        this.releaseConfigChild = instance;
                                    }}
                                    data={commonInfo}
                                    Id={relConfigGroupId}
                                    isInEdit={this.state.relConfigGroupId ? (this.state.isProfileUpdate ? false : true) : false}
                                    handleObjChange={this.handleObjChange}
                                    handleDropdownChange={this.handleDropdownChange}
                                    formikProps={formikProps}
                                    isTagsAllowed={true}
                                    controlsToShow={controlsToShow}
                                />}

                            <div className="row mx-0 mt-2">
                                <div className="releaseVendor w-100" id="releaseVendor">
                                    <div className="table-responsive tableShadow">
                                        <table className="release-table-responsive release-table release-table-resp" id="kendo-Tabledatepicker">
                                            <thead className="release-table-head">
                                                <tr className="release-table-row releae-vendor-table-tr" >
                                                    <th>Vendors</th>
                                                    <th>Distribution Type</th>
                                                    <th className="text-right pr-4">Number of Days</th>
                                                    <th>
                                                        <Menu
                                                            onSelect={(e) => this.onHeaderMenuSelect(e)}
                                                            //items={this.props.reqStatus=="Released" ? headerMenuReleased : headerMenu}
                                                            items={headerMenu}
                                                        ></Menu>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.data.length==0 && (
                                                    <tr>
                                                        <td colSpan={5} style={{ padding: "8px 12px", textAlign: "center" }}>{GridNoRecord(this.state.showLoader, true)}</td>
                                                    </tr>
                                                )}
                                                {this.state.data.length > 0 &&
                                                    this.state.data.map((release) => (
                                                        <tr style={{ position: "relative" }}>
                                                            <td contextMenu="Vendors">
                                                                {release.inEdit && (
                                                                    <DropwDownContainer
                                                                        data={release.allVendorList}
                                                                        name={"selectedVendors"}
                                                                        onChange={(currentNode, selectedNode) =>
                                                                            this.vendorChange(currentNode, selectedNode, release.index)
                                                                        }
                                                                        className={"mdl-demo mdl-demo_dropdown vendor-ddl index" + release.index}
                                                                        id={"index" + release.index}
                                                                    //onFocus={() => this.disableContents(release.index)}
                                                                    //onNodeToggle={() => this.disableContents(release.index)}
                                                                    />
                                                                )}

                                                                <div className="row ml-0 mr-0">
                                                                    <div className="col-12 col-sm-12 mb-2">
                                                                        <div className="vendor-ranking row w-100 ml-0 mr-0">
                                                                            <div
                                                                                className="font-weight-bold ranking"
                                                                                style={{
                                                                                    display:
                                                                                        release.reqReleaseVendorMap.filter((x) => x.tagClassName=="lplatinum-bg")
                                                                                            .length > 0
                                                                                            ? "block"
                                                                                            : "none",
                                                                                }}
                                                                            >
                                                                                {VendorTierType.PLATINUM}
                                                                            </div>
                                                                            {release.reqReleaseVendorMap.filter(x => x.tagClassName=="lplatinum-bg")
                                                                                .slice(0, release.PlatinumExpanded ? release.reqReleaseVendorMap.filter(x => x.tagClassName=="lplatinum-bg").length : this.state.PlatinumItemsToShow).map(
                                                                                    (item: any, index) =>
                                                                                        item.tagClassName=="lplatinum-bg" && (
                                                                                            <div title={item.hasOwnProperty('children') ?
                                                                                                _.filter(release.selectedReleaseVendorMapping, (v) => _.indexOf(item.children, v.vendorId) !=-1).map(x => x.name).join(' | ') : item.label
                                                                                            }
                                                                                                style={{ whiteSpace: "nowrap" }}
                                                                                                className={"p-1 ml-1 mt-2 pl-2 " + item.tagClassName}
                                                                                                key={item.id}
                                                                                            >
                                                                                                {item.label}
                                                                                                {release.inEdit && (
                                                                                                    <span
                                                                                                        key={item.id + "span"}
                                                                                                        onClick={() => {
                                                                                                            this.deleteTag(item.id, release.status, release.index);
                                                                                                        }}
                                                                                                        style={{ cursor: "pointer", paddingRight: "5px" }}
                                                                                                    >
                                                                                                        <FontAwesomeIcon icon={faTimes} className="ml-1" />
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        )
                                                                                )}
                                                                            <a
                                                                                className="ml-3"
                                                                                onClick={() => this.showMore("PlatinumExpanded", release.index)}
                                                                                style={{
                                                                                    display:
                                                                                        release.reqReleaseVendorMap.filter((x) => x.tagClassName=="lplatinum-bg")
                                                                                            .length > 3
                                                                                            ? "block"
                                                                                            : "none",
                                                                                    marginTop: "10px",
                                                                                }}
                                                                            >
                                                                                {release.PlatinumExpanded ? (
                                                                                    <span className="text-primary font-weight-bold mt-2 vendorViewMore ">
                                                                                        Show less
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="text-primary font-weight-bold  mt-2 vendorViewMore">
                                                                                        Show more
                                                                                    </span>
                                                                                )}
                                                                            </a>
                                                                        </div>
                                                                        <div className="vendor-ranking row w-100 ml-0 mr-0">
                                                                            <div
                                                                                className="font-weight-bold ranking"
                                                                                style={{
                                                                                    display:
                                                                                        release.reqReleaseVendorMap.filter((x) => x.tagClassName=="lgold-bg")
                                                                                            .length > 0
                                                                                            ? "block"
                                                                                            : "none",
                                                                                }}
                                                                            >
                                                                                {VendorTierType.GOLD}
                                                                            </div>
                                                                            {release.reqReleaseVendorMap.filter(x => x.tagClassName=="lgold-bg")
                                                                                .slice(0, release.GoldExpanded ? release.reqReleaseVendorMap.filter(x => x.tagClassName=="lgold-bg").length : this.state.GoldItemsToShow).map(
                                                                                    (item: any, index) =>
                                                                                        item.tagClassName=="lgold-bg" && (
                                                                                            <div
                                                                                                title={item.hasOwnProperty('children') ?
                                                                                                    _.filter(release.selectedReleaseVendorMapping, (v) => _.indexOf(item.children, v.vendorId) !=-1).map(x => x.name).join(' | ') : item.label
                                                                                                }
                                                                                                style={{ whiteSpace: "nowrap" }}
                                                                                                className={"p-1 ml-1 mt-2 pl-2 " + item.tagClassName}
                                                                                                key={item.id}
                                                                                            >
                                                                                                {item.label}
                                                                                                {release.inEdit && (
                                                                                                    <span
                                                                                                        key={item.id + "span"}
                                                                                                        onClick={() => {
                                                                                                            this.deleteTag(item.id, release.status, release.index);
                                                                                                        }}
                                                                                                        style={{ cursor: "pointer", paddingRight: "5px" }}
                                                                                                    >
                                                                                                        <FontAwesomeIcon icon={faTimes} className="ml-1" />
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        )
                                                                                )}
                                                                            <a
                                                                                className="ml-3"
                                                                                onClick={() => this.showMore("GoldExpanded", release.index)}
                                                                                style={{
                                                                                    display:
                                                                                        release.reqReleaseVendorMap.filter((x) => x.tagClassName=="lgold-bg")
                                                                                            .length > 3
                                                                                            ? "block"
                                                                                            : "none",
                                                                                    marginTop: "10px",
                                                                                }}
                                                                            >
                                                                                {release.GoldExpanded ? (
                                                                                    <span className="text-primary font-weight-bold mt-2 vendorViewMore ">
                                                                                        Show less
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="text-primary font-weight-bold  mt-2 vendorViewMore">
                                                                                        Show more
                                                                                    </span>
                                                                                )}
                                                                            </a>
                                                                        </div>
                                                                        <div className="vendor-ranking row w-100 ml-0 mr-0">
                                                                            <div
                                                                                className="font-weight-bold ranking"
                                                                                style={{
                                                                                    display:
                                                                                        release.reqReleaseVendorMap.filter((x) => x.tagClassName=="lsilver-bg")
                                                                                            .length > 0
                                                                                            ? "block"
                                                                                            : "none",
                                                                                }}
                                                                            >
                                                                                {VendorTierType.SILVER}
                                                                            </div>
                                                                            {release.reqReleaseVendorMap.filter(x => x.tagClassName=="lsilver-bg")
                                                                                .slice(0, release.SilverExpanded ? release.reqReleaseVendorMap.filter(x => x.tagClassName=="lsilver-bg").length : this.state.SilverItemsToShow).map(
                                                                                    (item: any, index) =>
                                                                                        item.tagClassName=="lsilver-bg" && (
                                                                                            <div
                                                                                                title={item.hasOwnProperty('children') ?
                                                                                                    _.filter(release.selectedReleaseVendorMapping, (v) => _.indexOf(item.children, v.vendorId) !=-1).map(x => x.name).join(' | ') : item.label
                                                                                                }
                                                                                                style={{ whiteSpace: "nowrap" }}
                                                                                                className={"p-1 ml-1 mt-2 pl-2 " + item.tagClassName}
                                                                                                key={item.id}
                                                                                            >
                                                                                                {item.label}
                                                                                                {release.inEdit && (
                                                                                                    <span
                                                                                                        key={item.id + "span"}
                                                                                                        onClick={() => {
                                                                                                            this.deleteTag(item.id, release.status, release.index);
                                                                                                        }}
                                                                                                        style={{ cursor: "pointer", paddingRight: "5px" }}
                                                                                                    >
                                                                                                        <FontAwesomeIcon icon={faTimes} className="ml-1" />
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        )
                                                                                )}
                                                                            <a
                                                                                className="ml-3"
                                                                                onClick={() => this.showMore("SilverExpanded", release.index)}
                                                                                style={{
                                                                                    display:
                                                                                        release.reqReleaseVendorMap.filter((x) => x.tagClassName=="lsilver-bg")
                                                                                            .length > 3
                                                                                            ? "block"
                                                                                            : "none",
                                                                                    marginTop: "10px",
                                                                                }}
                                                                            >
                                                                                {release.SilverExpanded ? (
                                                                                    <span className="text-primary font-weight-bold mt-2 vendorViewMore ">
                                                                                        Show less
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="text-primary font-weight-bold  mt-2 vendorViewMore">
                                                                                        Show more
                                                                                    </span>
                                                                                )}
                                                                            </a>
                                                                        </div>
                                                                        <div className="vendor-ranking row w-100 ml-0 mr-0">
                                                                            <div
                                                                                className="font-weight-bold ranking"
                                                                                style={{
                                                                                    display:
                                                                                        release.reqReleaseVendorMap.filter((x) => x.tagClassName=="lutility-bg")
                                                                                            .length > 0
                                                                                            ? "block"
                                                                                            : "none",
                                                                                }}
                                                                            >
                                                                                {VendorTierType.UTILITY}
                                                                            </div>
                                                                            {release.reqReleaseVendorMap.filter(x => x.tagClassName=="lutility-bg")
                                                                                .slice(0, release.UtilityExpanded ? release.reqReleaseVendorMap.filter(x => x.tagClassName=="lutility-bg").length : this.state.UtilityItemsToShow).map(
                                                                                    (item: any, index) =>
                                                                                        item.tagClassName=="lutility-bg" && (
                                                                                            <div
                                                                                                title={item.hasOwnProperty('children') ?
                                                                                                    _.filter(release.selectedReleaseVendorMapping, (v) => _.indexOf(item.children, v.vendorId) !=-1).map(x => x.name).join(' | ') : item.label
                                                                                                }
                                                                                                style={{ whiteSpace: "nowrap" }}
                                                                                                className={"p-1 ml-1 mt-2 pl-2 " + item.tagClassName}
                                                                                                key={item.id}
                                                                                            >
                                                                                                {item.label}
                                                                                                {release.inEdit && (
                                                                                                    <span
                                                                                                        key={item.id + "span"}
                                                                                                        onClick={() => {
                                                                                                            this.deleteTag(item.id, release.status, release.index);
                                                                                                        }}
                                                                                                        style={{ cursor: "pointer", paddingRight: "5px" }}
                                                                                                    >
                                                                                                        <FontAwesomeIcon icon={faTimes} className="ml-1" />
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        )
                                                                                )}
                                                                            <a
                                                                                className="ml-3"
                                                                                onClick={() => this.showMore("UtilityExpanded", release.index)}
                                                                                style={{
                                                                                    display:
                                                                                        release.reqReleaseVendorMap.filter((x) => x.tagClassName=="lutility-bg")
                                                                                            .length > 3
                                                                                            ? "block"
                                                                                            : "none",
                                                                                    marginTop: "10px",
                                                                                }}
                                                                            >
                                                                                {release.UtilityExpanded ? (
                                                                                    <span className="text-primary font-weight-bold mt-2 vendorViewMore ">
                                                                                        Show less
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="text-primary font-weight-bold  mt-2 vendorViewMore">
                                                                                        Show more
                                                                                    </span>
                                                                                )}
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td contextMenu="Distributions">
                                                                <CustomDropDownList
                                                                    disabled={!release.inEdit}
                                                                    className="form-control distribution-ddl"
                                                                    data={this.state.distributionsList}
                                                                    textField="name"
                                                                    valueField="id"
                                                                    value={release.distType.id}
                                                                    onChange={(e) => this.onDistributionChange(e, release.index)}
                                                                    id="distribution"
                                                                />
                                                            </td>
                                                            <td contextMenu="Number of days" className="text-right pr-4">
                                                                <Label style={{ display: release.distType.name !=DistributionType.AFTERDAYS || !release.inEdit ? "block" : "none" }}>
                                                                    {release.noOfDays}
                                                                </Label>
                                                                <div id="removemargin-border" style={{ display: release.distType.name==DistributionType.AFTERDAYS && release.inEdit ? "block" : "none" }}>
                                                                    <NumericTextBox
                                                                        className="form-control"
                                                                        placeholder="Enter Number of days"
                                                                        value={isNaN(release.noOfDays) ? 0 : release.noOfDays}
                                                                        min={1}
                                                                        format="#"
                                                                        name="quantity"
                                                                        onChange={(e) => this.handleChange(e, release.index)}

                                                                    />
                                                                </div>
                                                            </td>
                                                            <td >
                                                                {release.inEdit ? (
                                                                    <div className="iconcolorsize pl-xl-3">
                                                                        <span
                                                                            className="k-icon k-i-save release-icon iconColorReleased"
                                                                            title="Save"
                                                                            onClick={() => this.update(release.index)}
                                                                        ></span>
                                                                        {release.status !="Released" && (
                                                                            <span
                                                                                className="k-icon k-i-delete release-icon kendo-Tabledatepickera iconColorReleased iconmarginRight"
                                                                                title="Delete"
                                                                                onClick={() => release.reqReleaseVendorMap.length > 0
                                                                                    ? this.setState({ indexToDelete: release.index, openConfirmDelete: true, dataItem: release })
                                                                                    : this.delete(release.index, release)
                                                                                }
                                                                            ></span>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <Menu
                                                                        onSelect={(e) => this.onRowMenuSelect(e, release.index, release)}
                                                                        items={release.status=="Released" ? rowMenuReleased : rowMenuAll}
                                                                    ></Menu>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <AlertBox
                                    handleNo={() => this.setState({ showAlert: false })}
                                    message={this.alertMessage}
                                    showModal={this.state.showAlert}
                                >
                                </AlertBox>
                                <ConfirmationModal
                                    message={"Are you sure you want to delete release?"}
                                    showModal={this.state.openConfirmDelete}
                                    handleYes={() => this.delete(this.state.indexToDelete, this.state.dataItem)}
                                    handleNo={() => {
                                        this.setState({ openConfirmDelete: false });
                                    }}
                                />
                            </div>
                            <div className="modal-footer justify-content-center border-0">
                                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                    <Link to="/admin/releaseconfig/manage">
                                        <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                        </button>
                                    </Link>
                                    <button type="submit" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={() => this.setState({ submitted: true })}>
                                        <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                />

                {this.state.openExistingReleasesGrid && this.state.exisitingGroupIds && (
                    <ReleaseGroupTask
                        Title={'Overlapping Release Configuration'}
                        Url={EDIT_RELEASE}
                        exisitingGroupIds={this.state.exisitingGroupIds}
                        clientId={this.state.clientId}
                        showDialog={this.state.openExistingReleasesGrid}
                        handleNo={() => {
                            this.setState({ openExistingReleasesGrid: false });
                            document.body.style.position = "";
                        }}
                        handleYes={() => {
                            this.setState({ openExistingReleasesGrid: false });
                            this.saveReleaseConfiguration(true, true)
                        }}
                    />
                )}
                {this.state.openDuplicateVendorTiersGrid && this.state.DuplicateVednorsData && (
                    <DuplicateVendorTier
                        DuplicateVednorsData={this.state.DuplicateVednorsData}
                        clientId={this.state.clientId}
                        showDialog={this.state.openDuplicateVendorTiersGrid}
                        handleNo={() => {
                            this.setState({ openDuplicateVendorTiersGrid: false });
                            document.body.style.position = "";
                        }}
                        handleYes={() => {
                            this.setState({ openDuplicateVendorTiersGrid: false });
                            this.saveReleaseConfiguration(true, true)
                        }}
                    />
                )}
            </div>
        );
    }
}

export default CreateReleaseConfiguration;