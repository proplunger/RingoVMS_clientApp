import * as React from "react";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; import { faUserCircle, faChevronCircleDown, faChevronCircleUp, faClock, faSave, faTimesCircle, faHistory, faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { DropDownList, MultiSelect, MultiSelectFilterChangeEvent } from "@progress/kendo-react-dropdowns";
import withValueField from "../../Shared/withValueField";
import { ReqStatus } from "../../Shared/AppConstants";
import { filterBy, State, toODataString } from "@progress/kendo-data-query";
import { ErrorComponent, KendoFilter } from "../../ReusableComponents";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { Label } from "reactstrap";
import { history, successToastr } from "../../../HelperMethods";
import BatchRequisitionTask from "./BatchRequisitionTask";
import { REQ_VIEW_URL } from "../../Shared/ApiUrls";
import ConfirmationModal from "../../Shared/ConfirmationModal";
import { BATCH_RELEASE_CONFIRMATION_MSG } from "../../Shared/AppMessages";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select..", id: null };

export enum ALLSELECTED {
    ALLREQUISTIONS = "All Open Requisitions",
    ALLVENDORS = "All Vendors"
}

export interface BatchReleaseRequisitionProps {
    props: any;
    match: any;
}

export interface BatchReleaseRequisitionState {
    showLoader: boolean;
    clientId?: string;
    requisitions: any;
    selectedRequisitions: any;
    vendors: any;
    selectedVendors: any;
    distributionTypes: any;
    selectedDist: any;
    releaseDate: Date;
    distType?: any;
    originalVendors: any;
    originalRequisitions: any;
    isAllVendorSelected?: boolean;
    isAllReqSelected?: boolean;
    submitted: boolean;
    openBatchResultGrid: boolean;
    batchReleaseReqIds: any;
    showBatchReleaseConfirmationModal: boolean;
    selectedReleaseDate: Date;
    selectedDistID: string;
}

class BatchReleaseRequisition extends React.Component<BatchReleaseRequisitionProps, BatchReleaseRequisitionState> {

    constructor(props: BatchReleaseRequisitionProps) {
        super(props);
        this.state = {
            clientId: localStorage.getItem("UserClientId"),
            requisitions: [],
            selectedRequisitions: [],
            selectedVendors: [],
            vendors: [],
            distributionTypes: [],
            selectedDist: "",
            releaseDate: new Date(),
            selectedReleaseDate: new Date(),
            originalVendors: [],
            originalRequisitions: [],
            submitted: false,
            openBatchResultGrid: false,
            batchReleaseReqIds: [],
            showLoader: true,
            showBatchReleaseConfirmationModal: false,
            selectedDistID: ""
        };
    }

    componentDidMount() {
        this.getRequisitions();
        this.getDistributionTypes();
        this.getVendors();
    }

    handleSubmitBatch = () => {
        this.setState({ submitted: true });

        if (this.handleValidation()){
            this.setState({ showBatchReleaseConfirmationModal: true, submitted: false });
        }
    }

    handleValidation = () => {
        if(
            this.state.selectedVendors.length==0 ||
            this.state.selectedRequisitions.length==0
        ){
            return false;
        }else{
            return true;
        }
    }

    handleBatchConfirmation = () => {
        var data = {
            requisitionIds: this.state.selectedRequisitions.filter(x => x.reqId !=9999).map(x => x.reqId),
            vendorIds: this.state.selectedVendors.filter(x => x.id !=9999).map(x => x.id),
            releaseDate: this.state.releaseDate,
            distributionTypeId: this.state.selectedDist,
        }
        axios.post("api/requisitions/batchrelease", JSON.stringify(data))
            .then((res) => {
                if(res.data.data.resultData && res.data.isSuccess){
                    this.setState({
                        openBatchResultGrid: true,
                        batchReleaseReqIds: res.data.data.resultData
                    });
                    // successToastr("Selected requisitions released successfully");

                }

                this.setState({
                    submitted: false,
                    showBatchReleaseConfirmationModal: false,
                    selectedRequisitions: [],
                    selectedVendors: [],
                    releaseDate: new Date(),
                    selectedDist: this.state.distributionTypes.filter(x => x.name=='Manual')[0].id,
                    isAllVendorSelected: false,
                    distType: this.state.distributionTypes.filter(x => x.name=='Manual')[0]
                });

        });
    }

    updateState = (value, field) => {
        let change = {};
        change[field] = value;
        this.setState(change);
    }

    handleReleaseDate = (value) => {
        this.setState({
            releaseDate: value,
            selectedReleaseDate: value
        })
    }

    getRequisitions = () => {
        let filterProps = this.getFilter();
        const url = filterProps[0];
        var finalState: State = {
            take: null,
            skip: 0,
        };
        
        var queryStr = `${toODataString(finalState)}`;
        
        var finalQueryString = KendoFilter(finalState, queryStr, filterProps[1]);

        // var config = {
        //     headers: {
        //         'Content-Type': 'text/plain'
        //     },
        // };
        axios.get(`${url}?${finalQueryString}`).then((res) => {
            res.data.unshift({ reqNumber: ALLSELECTED.ALLREQUISTIONS, reqId: 9999 });
            this.setState({
                requisitions: res.data,
                originalRequisitions: res.data,
                selectedRequisitions: res.data,
                isAllReqSelected: true,
                showLoader: false,
            }, () => {
                if (document.getElementsByName('releaseDate')) {
                    document.getElementsByName('releaseDate')[0]['disabled'] = true;
                }
            });
        });
    }

    getFilter() {
        let queryParams = `clientId eq ${this.state.clientId} and (status eq '${ReqStatus.RELEASED}' or status eq '${ReqStatus.CANDIDATEUNDERREVIEW}')`;
        //let apiUrl = "api/requisitions";
        let apiUrl = "api/requisitions";
        return [apiUrl, queryParams];
    }

    getVendors = () => {
        const { clientId } = this.state;

        const queryParams = `status eq 'Active'&$orderby=vendor`;
        axios.get(`api/clients/${clientId}/vendor?$filter=${queryParams}`)
        .then(async (res) => {
            var data = res.data.filter(x => x.hasVendorTier==true).map(x => {
                return {
                    id: x.vendorId,
                    vendor: x.vendor
                }
            });
            data.unshift({ vendor: ALLSELECTED.ALLVENDORS, id: 9999 });

            this.setState({ 
                vendors: data,
                originalVendors: data, 
                showLoader: false
            });
        });
    }

    itemRender = (li, itemProps) => {
        const itemChildren = (
          <span>
            <input
              type="checkbox"
              checked={itemProps.dataItem.vendor==ALLSELECTED.ALLVENDORS ? this.state.isAllVendorSelected :
                itemProps.selected}
              onChange={(e) => itemProps.onClick(itemProps.index, e)}
            />
            &nbsp;{li.props.children}
          </span>
        );
        return React.cloneElement(li, li.props, itemChildren);
    };

    itemRenderReq = (li, itemProps) => {
        const itemChildren = (
          <span>
            <input
              type="checkbox"
              checked={itemProps.dataItem.reqNumber==ALLSELECTED.ALLREQUISTIONS ? this.state.isAllReqSelected :
                   itemProps.selected}
              onChange={(e) => itemProps.onClick(itemProps.index, e)}
            />
           &nbsp;{li.props.children}
            {li.props.children[0] !=ALLSELECTED.ALLREQUISTIONS &&
                <span>
                    | <b>Div:</b> {itemProps.dataItem.division} | <b>Loc:</b> {itemProps.dataItem.location} | <b>Pos:</b> {itemProps.dataItem.position}
                </span>
            }
          </span>
        );
        return React.cloneElement(li, li.props, itemChildren);
    };

    getDistributionTypes = () => {
        axios.get(`api/requisitions/distcatalogs`).then((res) => {
            this.setState({
                distributionTypes: res.data.filter(x => x.name !='Automatic'),
                selectedDist: res.data.filter(x => x.name=='Manual')[0].id,
                selectedDistID: res.data.filter(x => x.name=='Manual')[0].id,
                distType: res.data.filter(x => x.name=='Manual')[0]
            });
        });
    }

    handleDistributionChange = (e) => {
        if(e.value.name=="Release Now"){
            this.setState({releaseDate : new Date(), selectedReleaseDate: new Date()});
        }
        this.setState({
            selectedDist: e.target.value,
            selectedDistID: e.target.value,
            distType: e.value
        });
    }

    handleChangeReq = (e) => {
        var isAllSelected = false;
        var selectedReq = e.value.filter(
            (x) => x.reqId !=undefined && x.reqId !=null && x.reqId !=9999
        );
        let Id = selectedReq.map((x) => x.reqId);    

        if (e.nativeEvent.target.innerText.trim() ==ALLSELECTED.ALLREQUISTIONS
        || (e.nativeEvent.target.nextSibling !=null && e.nativeEvent.target.nextSibling.nextSibling !=null
        && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=null && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=undefined
        && e.nativeEvent.target.nextSibling.nextSibling.wholeText.trim() ==ALLSELECTED.ALLREQUISTIONS)) {
            if (!this.state.isAllReqSelected) {
                isAllSelected = true;
                var requisitions = this.state.requisitions.filter(
                (x) => x.reqId !=undefined && x.reqId !=null && x.reqId !=9999
                );
                
                Id = requisitions.map((x) => x.reqId);
                selectedReq = this.state.requisitions;
            } else {
                selectedReq = [];
                Id = null;
            }
        } else {
            if(selectedReq.length==(this.state.requisitions.length - 1)){
                selectedReq.unshift({ name: ALLSELECTED.ALLREQUISTIONS, reqId: 9999 });
                isAllSelected = true;
            }
        }

        this.setState({
            selectedRequisitions: selectedReq,
            isAllReqSelected: isAllSelected
        })
    }

    handleChangeVendor = (e) => {
        var isAllSelected = false;
        var selectedVendor = e.value.filter(
            (x) => x.id !=undefined && x.id !=null && x.id !=9999
        );
        let Id = selectedVendor.map((loc) => loc.id);    

        if (e.nativeEvent.target.innerText.trim() ==ALLSELECTED.ALLVENDORS
        || (e.nativeEvent.target.nextSibling !=null && e.nativeEvent.target.nextSibling.nextSibling !=null
        && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=null && e.nativeEvent.target.nextSibling.nextSibling.wholeText !=undefined
        && e.nativeEvent.target.nextSibling.nextSibling.wholeText.trim() ==ALLSELECTED.ALLVENDORS)) {
            if (!this.state.isAllVendorSelected) {
                isAllSelected = true;
                var vendors = this.state.vendors.filter(
                (x) => x.id !=undefined && x.id !=null && x.id !=9999
                );
                
                Id = vendors.map((x) => x.id);
                selectedVendor = this.state.vendors;
            } else {
                selectedVendor = [];
                Id = null;
            }
        } else {
            if(selectedVendor.length==(this.state.vendors.length - 1)){
                selectedVendor.unshift({ name: ALLSELECTED.ALLVENDORS, id: 9999 });
                isAllSelected = true;
            }
        }

        this.setState({
            selectedVendors: selectedVendor,
            isAllVendorSelected: isAllSelected
        })
    }

    handleFilterChangeRequisition = (event: MultiSelectFilterChangeEvent) => {
        this.setState({ requisitions: filterBy(this.state.originalRequisitions.slice(), event.filter) })
    };

    handleFilterChangeVendor = (event: MultiSelectFilterChangeEvent) => {
        this.setState({ vendors: filterBy(this.state.originalVendors.slice(), event.filter) })
    };

    render() {
        const {selectedDist, releaseDate, distType, selectedReleaseDate, selectedDistID } = this.state;
        const userTriggerName = (
            <span>
                Batch Release
            </span>
        );
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-2 col-md-4 fonFifteen paddingLeftandRight">
                            <div className="d-none d-md-block">
                                Batch Release
                             </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 ml-0 mr-0">
                    <div className="row mb-2">
                        <div className="col-12 ml-0 mr-0 mb-4">

                            <Collapsible
                                trigger={userTriggerName}
                                accordionPosition="1"
                                open={true}
                            >
                            {this.state.showLoader &&
                            Array.from({ length: 2 }).map((item, i) => (
                                <div className="row mx-auto mt-2" key={i}>
                                {Array.from({ length: 3 }).map((item, j) => (
                                    <div
                                    className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1"
                                    key={j}
                                    >
                                    <Skeleton width={100} />
                                    <Skeleton height={30} />
                                    </div>
                                ))}
                                </div>
                            ))}

                            {!this.state.showLoader && (
                                <div>
                                    <div className="row mt-0 mx-0">
                                        <div className="col-12 col-sm-12 mt-2 multiselect">
                                            <label className="mb-1 font-weight-bold required">Requisition 
                                                <i className="fa fa-info-circle pl-2 pr-2" style={{ "color": "#109DD2" }} title="Only open or released requisitions can be batch released"></i>
                                            </label>
                                            <MultiSelect
                                                className="form-control "
                                                data={this.state.requisitions}
                                                textField="reqNumber"
                                                dataItemKey="reqId"
                                                id="Requisitions"
                                                autoClose={false}
                                                name="selectedRequisitions"
                                                itemRender={this.itemRenderReq}
                                                value={this.state.selectedRequisitions.filter((x) => x.reqId !=9999 )}
                                                onChange={(e) =>
                                                    this.handleChangeReq(e)
                                                }
                                                placeholder="Select Requisition"
                                                filterable={this.state.originalRequisitions.length > 5 ? true : false}
                                                onFilterChange={this.handleFilterChangeRequisition}
                                            />

                                            {this.state.submitted && (this.state.selectedRequisitions==undefined || this.state.selectedRequisitions==null || this.state.selectedRequisitions.length ==0) && <ErrorComponent />}

                                        </div>

                                        <div className="col-12 col-sm-6 mt-3 multiselect">
                                            <label className="mb-1 font-weight-bold required">Vendor</label>
                                            <MultiSelect
                                                className="form-control "
                                                data={this.state.vendors}
                                                textField="vendor"
                                                dataItemKey="id"
                                                id="selectedVendors"
                                                autoClose={false}
                                                name="selectedVendors"
                                                itemRender={this.itemRender}
                                                value={this.state.selectedVendors.filter((x) => x.id !=9999 )}
                                                onChange={(e) =>
                                                    this.handleChangeVendor(e)
                                                }
                                                placeholder="Select Vendor"
                                                filterable={this.state.originalVendors.length > 5 ? true : false}
                                                onFilterChange={this.handleFilterChangeVendor}
                                            />
                                            {this.state.submitted && (this.state.selectedVendors==undefined || this.state.selectedVendors==null || this.state.selectedVendors.length ==0) && <ErrorComponent />}

                                        </div>

                                        <div className="col-12 col-sm-3 mt-3">
                                            <label className="mb-1 font-weight-bold">Distribution Type</label>
                                            <CustomDropDownList
                                                className="form-control disabled"
                                                name={`selectedDistType`}
                                                data={this.state.distributionTypes}
                                                textField="name"
                                                valueField="id"
                                                id="distributionType"
                                                value={selectedDist}
                                                onChange={(e) => this.handleDistributionChange(e)}
                                                // onFilterChange={this.handleFilterChange}
                                            />
                                        </div>

                                        <div className="col-12 col-sm-3 mt-3">
                                            <label className="mb-1 font-weight-bold">Release Date</label>
                                            
                                            <div id="ShowDatePickerIcon">
                                                {distType && distType.name !="Manual" ? 
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        value={Intl.DateTimeFormat("en-US").format(
                                                            releaseDate
                                                          )}
                                                        disabled={true}
                                                    />
                                                :
                                                    <DatePicker
                                                        className="form-control release-date-ddl kendo-Tabledatepicker"
                                                        format="MM/dd/yyyy"
                                                        name="releaseDate"
                                                        value={releaseDate}
                                                        onChange={(e) =>
                                                            this.handleReleaseDate(e.value)
                                                        }
                                                        formatPlaceholder="formatPattern"
                                                        min={new Date()}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Collapsible>

                            <div className="modal-footer justify-content-center border-0 mt-3 mb-3">
                                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                <button
                                    type="button"
                                    className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
                                    onClick={() => history.push('/requisitions/manage')}
                                >
                                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} />{" "}
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                    onClick={() => this.handleSubmitBatch()}
                                >
                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Release
                                </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {this.state.openBatchResultGrid && this.state.batchReleaseReqIds && (
                    <BatchRequisitionTask
                        title={"Batch Release Log"}
                        url={REQ_VIEW_URL}
                        batchReleaseReqIds={this.state.batchReleaseReqIds}
                        clientId={this.state.clientId}
                        showDialog={this.state.openBatchResultGrid}
                        handleNo={() => {
                            this.setState({ openBatchResultGrid: false });
                        }}
                        distributionType={selectedDistID && this.state.distributionTypes.filter(x => x.id==selectedDistID)[0].name}
                        releaseDate={selectedReleaseDate && selectedReleaseDate}
                    />
                )}

                <ConfirmationModal
                    message={BATCH_RELEASE_CONFIRMATION_MSG()}
                    showModal={this.state.showBatchReleaseConfirmationModal}
                    handleYes={() => this.handleBatchConfirmation()}
                    handleNo={() => {
                        this.setState({ showBatchReleaseConfirmationModal: false });
                    }}
                />
                
            </div>

        );
    }
}

export default BatchReleaseRequisition;