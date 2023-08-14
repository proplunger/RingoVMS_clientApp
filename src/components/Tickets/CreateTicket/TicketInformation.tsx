import * as React from "react";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import withValueField from "../../Shared/withValueField";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import { convertShiftDateTime, ErrorComponent, FormatPhoneNumber } from "../../ReusableComponents";
import { filterBy } from "@progress/kendo-data-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ticketService from "../Services/DataService";
import TagControl from "../../Shared/TagControl/TagControl";
import { AuthRoleType, EntityTypeId, RegistrationStatus } from "../../Shared/AppConstants";
import UploadDocuments from "../../Shared/UploadDocuments/UploadDocuments";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@progress/kendo-react-dialogs";
import TicketStatusBar from "../../Shared/TicketStatusCard/TicketStatusBar";
import { dateFormatter } from "../../../HelperMethods";
import auth from "../../Auth";

const CustomDropDownList = withValueField(DropDownList);

const defaultItem = { name: "Select...", id: null };
const defaultClient = { client: "Select...", id: null };
const defaultVendor = { vendor: "Select...", id: null };
const defaultUser = { fullName: "Select...", userId: null };

export interface TicketInformationProps {
    data: any;
    ticketId: string;
    handleChange: any;
    handleObjChange: any;
    handleDropdownChange: any;
    handleMultiselectChange: any;
    formikProps: any;
    isEdit?: boolean;
}

export interface TicketInformationState {
    client: Array<IDropDownModel>;
    originalclient: Array<IDropDownModel>;
    vendor: Array<IDropDownModel>;
    originalvendor: Array<IDropDownModel>;
    tktFunctionArea: Array<IDropDownModel>;
    originaltktFunctionArea: Array<IDropDownModel>;
    tktFunction: Array<IDropDownModel>;
    originaltktFunction: Array<IDropDownModel>;
    tktQueue: Array<IDropDownModel>;
    originaltktQueue: Array<IDropDownModel>;
    tktPriority: Array<IDropDownModel>;
    originaltktPriority: Array<IDropDownModel>;
    tktRequestType: Array<IDropDownModel>;
    originaltktRequestType: Array<IDropDownModel>;
    tktStatus: Array<IDropDownModel>;
    originaltktStatus: Array<IDropDownModel>;
    assignedTo: Array<IDropDownModel>;
    originalassignedTo: Array<IDropDownModel>;
    owner: Array<IDropDownModel>;
    originalowner: Array<IDropDownModel>;
    showLoader?: boolean;
    showCaseStatusModal?: boolean;
    clientId: string;
}

class TicketInformation extends React.Component<TicketInformationProps, TicketInformationState> {
    public uploadDoc: any;
    constructor(props: TicketInformationProps) {
        super(props);
        this.state = {
            client: [],
            originalclient: [],
            vendor: [],
            originalvendor: [],
            tktFunctionArea: [],
            originaltktFunctionArea: [],
            tktFunction: [],
            originaltktFunction: [],
            tktQueue: [],
            originaltktQueue: [],
            tktPriority: [],
            originaltktPriority: [],
            tktRequestType: [],
            originaltktRequestType: [],
            tktStatus: [],
            originaltktStatus: [],
            assignedTo: [],
            originalassignedTo: [],
            owner: [],
            originalowner: [],
            showLoader: true,
            clientId: auth.getClient()
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        this.getClients();
        this.getUsers();
        this.getTktFuncArea();
        this.getTktQueue();
        this.getTktPriority();
        this.getTktReqType();
        if(this.props.ticketId !=null){
            this.getTktStatus();
        }
        if (this.props.data.clientId !=null) {
            this.getClientAssociatedVendor(this.props.data.clientId);
            //this.getUsers(this.props.data.clientId);
        } else {
            this.setState({ vendor: [] });
            //this.getUsers();
        }
    }

    getClients = () => {
        let queryParams = `status eq 'Active'&$orderby=client`;
        ticketService.getClients(queryParams).then((res) => {
            this.setState({
                client: res.data.filter(x => x.id==this.state.clientId),
                originalclient: res.data.filter(x => x.id==this.state.clientId)
            });
        });
    }

    handleClient = (e) => {
        const id = e.target.value;
        this.props.handleObjChange({
            clientId: id,
            //vendorId: null,
            selectedVendors: null,
        });
        if (id !=null) {
            this.getClientAssociatedVendor(id);
            //this.getUsers(id);
        } else {
            this.setState({ vendor: [] });
            //this.getUsers();
        }
    };

    getClientAssociatedVendor = (clientId) => {
        let queryParams = `status eq 'Active'&$orderby=vendor`;
        ticketService.getClientAssociatedVendor(clientId, queryParams).then((res) => {
            this.setState({
                vendor: res.data,
                originalvendor: res.data
            });
        });
    }

    getUsers = (clientId?) => {
        let queryParams = `status eq 'Active' and roleType eq ${AuthRoleType.SystemAdmin} and (userRegistered eq ${RegistrationStatus.COMPLETE} or userRegistered eq ${RegistrationStatus.AUTOREGISTER} or (userRegistered eq ${RegistrationStatus.PENDINGTNC} and autoRegister eq true))&$orderby=username`;
        // if(clientId !=null){
        //     queryParams = `clientId eq ${clientId} and status eq 'Active' and roleType eq ${AuthRoleType.SystemAdmin} and (userRegistered eq ${RegistrationStatus.COMPLETE} or userRegistered eq ${RegistrationStatus.AUTOREGISTER} or (userRegistered eq ${RegistrationStatus.PENDINGTNC} and autoRegister eq true))&$orderby=username`;
        // }
        ticketService.getUsers(queryParams).then((res) => {
            this.setState({
                assignedTo: res.data,
                originalassignedTo: res.data,
                owner: res.data,
                originalowner: res.data,
                // showLoader:false
            });
        });
    }

    getTktFuncArea = () => {
        let queryParams = `status eq 'Active'&$orderby=name`;
        ticketService.getFuncArea(queryParams).then((res) => {
            this.setState({
                tktFunctionArea: res.data,
                originaltktFunctionArea: res.data
            });
        });
    }

    handleTktFuncArea = (e) => {
        const id = e.target.value;
        this.props.handleObjChange({
            tktFunctionAreaId: id,
            tktFunctionId: null,
        });
        if (id !=null) {
            this.getTktFunc(id);
        } else {
            this.setState({ tktFunction: [] });
        }
    };


    getTktFunc = (tktFuncAreaId) => {
        let queryParams = `tktFuncAreaId eq ${tktFuncAreaId} and status eq 'Active'&$orderby=name`;
        ticketService.getFunc(queryParams).then((res) => {
            this.setState({
                tktFunction: res.data,
                originaltktFunction: res.data
            });
        });
    }

    getTktPriority = () => {
        let queryParams = `status eq 'Active'`;
        ticketService.getPriority(queryParams).then((res) => {
            this.setState({
                tktPriority: res.data,
                originaltktPriority: res.data
            });
        });
    }

    getTktReqType = () => {
        let queryParams = `status eq 'Active'&$orderby=name`;
        ticketService.getRequestType(queryParams).then((res) => {
            this.setState({
                tktRequestType: res.data,
                originaltktRequestType: res.data
            });
        });
    }

    getTktQueue = () => {
        let queryParams = `status eq 'Active'&$orderby=name`;
        ticketService.getQueue(queryParams).then((res) => {
            this.setState({
                tktQueue: res.data,
                originaltktQueue: res.data,
                showLoader:false
            });
            this.props.handleObjChange({
                tktQueueId: res.data[0].id,
            });
        });
    }

    getTktStatus = () => {
        let queryParams = `status eq 'Active'&$orderby=tktStatusIntId`;
        ticketService.getStatus(queryParams).then((res) => {
            this.setState({
                tktStatus: res.data,
                originaltktStatus: res.data
            });
        });
    }

    itemRender = (li, itemProps) => {
        const itemChildren = (
            <span>
                <input
                    type="checkbox"
                    checked={itemProps.selected}
                    onChange={(e) => itemProps.onClick(itemProps.index, e)}
                />
                &nbsp;{li.props.children}
            </span>
        );
        return React.cloneElement(li, li.props, itemChildren);
    };

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

    uploadDocuments(ticketId){
        if (ticketId) {
            this.uploadDoc.uploadDocuments(ticketId);
        }
    }

    render() {
        const { data, formikProps } = this.props;
        return (
          <div className="">
            <div className="row">
              <div className="col-12 pl-0 pr-0">
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
                  <div>
                    <div className="row mt-2 mx-0">
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                        <label className="mb-1 font-weight-bold required">Title</label>
                        <input
                          type="text"
                          className="form-control "
                          placeholder="Enter Title"
                          value={data.title}
                          name="title"
                          maxLength={100}
                          onChange={(e) => this.props.handleChange(e)}
                        />
                      {formikProps.errors.title && <ErrorComponent message={formikProps.errors.title} />}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                        <label className="mb-1 font-weight-bold ">Client</label>
                        <CustomDropDownList
                          className={"form-control disabled"}
                          data={this.state.client}
                          valueField="id"
                          name={`clientId`}
                          textField="client"
                          //disabled={false}
                          id="client"
                          value={data.clientId}
                          defaultItem={defaultClient}
                          onChange={(e) => this.handleClient(e)}
                          filterable={this.state.originalclient.length > 5 ? true : false}
                          onFilterChange={this.handleFilterChange}
                        />
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1 multiselect">
                        <label className="mb-1 font-weight-bold ">Vendor</label>
                        {/* <CustomDropDownList
                                                    className={"form-control disabled"}
                                                    disabled={!data.clientId}
                                                    data={this.state.vendor}
                                                    valueField="vendorId"
                                                    name={`vendorId`}
                                                    textField="vendor"
                                                    id="vendor"
                                                    value={data.vendorId}
                                                    defaultItem={defaultVendor}
                                                    onChange={(e) => this.props.handleDropdownChange(e)}
                                                    filterable={this.state.originalvendor.length > 5 ? true : false}
                                                    onFilterChange={this.handleFilterChange}
                                                /> */}
                        <MultiSelect
                          className="form-control disabled"
                          disabled={!data.clientId}
                          data={this.state.vendor}
                          textField="vendor"
                          dataItemKey="vendorId"
                          id="vendor"
                          name="selectedVendors"
                          value={data.selectedVendors}
                          itemRender={this.itemRender}
                          autoClose={false}
                          onChange={(e) => this.props.handleMultiselectChange(e)}
                          placeholder="Select..."
                        />
                      </div>
                    </div>

                    <div className="row mt-3 mx-0">
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                        <label className="mb-1 font-weight-bold required">
                          Request Type
                        </label>
                        <CustomDropDownList
                          className={"form-control disabled"}
                          data={this.state.tktRequestType}
                          valueField="id"
                          name={`tktRequestTypeId`}
                          textField="name"
                          id="tktRequestType"
                          value={data.tktRequestTypeId}
                          defaultItem={defaultItem}
                          onChange={(e) => this.props.handleDropdownChange(e)}
                          filterable={
                            this.state.originaltktRequestType.length > 5
                              ? true
                              : false
                          }
                          onFilterChange={this.handleFilterChange}
                        />
                        {formikProps.errors.tktRequestTypeId && (
                          <ErrorComponent
                            message={formikProps.errors.tktRequestTypeId}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                        <label className="mb-1 font-weight-bold">
                          Functional Area
                        </label>
                        <CustomDropDownList
                          className={"form-control disabled"}
                          data={this.state.tktFunctionArea}
                          valueField="id"
                          name={`tktFunctionAreaId`}
                          textField="name"
                          id="tktFunctionArea"
                          value={data.tktFunctionAreaId}
                          defaultItem={defaultItem}
                          onChange={(e) => this.handleTktFuncArea(e)}
                          filterable={this.state.originaltktFunctionArea.length > 5 ? true : false}
                          onFilterChange={this.handleFilterChange}
                        />
                      {/* {formikProps.errors.tktFunctionAreaId && <ErrorComponent message={formikProps.errors.tktFunctionAreaId} />} */}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                      <label className="mb-1 font-weight-bold ">Function</label>
                        <CustomDropDownList
                          className={"form-control disabled"}
                          disabled={!data.tktFunctionAreaId}
                          data={this.state.tktFunction}
                          name="tktFunctionId"
                          textField="name"
                          valueField="id"
                          id="tktFunction"
                          defaultItem={defaultItem}
                          value={data.tktFunctionId}
                          onChange={(e) => this.props.handleDropdownChange(e)}
                          filterable={this.state.originaltktFunction.length > 5 ? true : false}
                          onFilterChange={this.handleFilterChange}
                        />
                      </div>
                    </div>

                    <div className="row mt-3 mx-0">
                      <div className="col-12 col-sm-4 col-lg-8 mt-sm-0 mt-1">
                      <label className="mb-0 font-weight-bold">Description</label>
                        <textarea
                          rows={3}
                          id=""
                          maxLength={5000}
                          value={data.description}
                          name="description"
                          className="form-control mt-1"
                          placeholder="Enter Description"
                          onChange={(e) => this.props.handleChange(e)}
                        />
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                        <label className="mb-1 font-weight-bold ">Queue</label>
                        <CustomDropDownList
                          className={"form-control disabled"}
                          data={this.state.tktQueue}
                          valueField="id"
                          name={`tktQueueId`}
                          textField="name"
                          id="tktQueue"
                          value={data.tktQueueId}
                          onChange={(e) => this.props.handleDropdownChange(e)}
                          filterable={this.state.originaltktQueue.length > 5 ? true : false}
                          onFilterChange={this.handleFilterChange}
                        />
                      </div>
                    </div>
                    <div className="row mt-3 mx-0">
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                      <label className="mb-1 font-weight-bold required">Priority</label>
                        <CustomDropDownList
                          className={"form-control disabled"}
                          data={this.state.tktPriority}
                          valueField="id"
                          name={`tktPriorityId`}
                          textField="name"
                          id="tktPriority"
                          value={data.tktPriorityId}
                          defaultItem={defaultItem}
                          onChange={(e) => this.props.handleDropdownChange(e)}
                          filterable={
                            this.state.originaltktQueue.length > 5
                              ? true
                              : false
                          }
                          onFilterChange={this.handleFilterChange}
                        />
                        {formikProps.errors.tktPriorityId && (
                          <ErrorComponent
                            message={formikProps.errors.tktPriorityId}
                          />
                        )}
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                        <label className="mb-1 font-weight-bold ">
                          Assigned To
                        </label>
                        {/* <span>Assigned To</span>
                                                        {this.props.ticketId && (
                                                            <span
                                                                className="text-underline cursorElement align-middle"
                                                                // onClick={() =>
                                                                //     this.setState({
                                                                //         showCandidateOwnershipModal: true,
                                                                //     })
                                                                // }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faClock}
                                                                    className="ml-1 active-icon-blue ClockFontSize"
                                                                />
                                                            </span>
                                                        )}
                                                </label> */}
                        <CustomDropDownList
                          className={"form-control disabled"}
                          data={this.state.assignedTo}
                          name="assignedToId"
                          textField="fullName"
                          valueField="userId"
                          id="assignedTo"
                          defaultItem={defaultUser}
                          value={data.assignedToId}
                          onChange={(e) => this.props.handleDropdownChange(e)}
                          filterable={this.state.originalassignedTo.length > 5 ? true : false}
                          onFilterChange={this.handleFilterChange}
                        />
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1">
                        <label className="mb-1 font-weight-bold ">Owner</label>
                        <CustomDropDownList
                          className={"form-control disabled"}
                          data={this.state.owner}
                          disabled={this.props.ticketId==null}
                          valueField="userId"
                          name={`ownerId`}
                          textField="fullName"
                          id="owner"
                          value={data.ownerId}
                          defaultItem={defaultUser}
                          onChange={(e) => this.props.handleDropdownChange(e)}
                          filterable={this.state.originalowner.length > 5 ? true : false}
                          onFilterChange={this.handleFilterChange}
                        />
                      </div>
                    </div>

                    <div className="row mt-3 mx-0">
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1" >
                        <UploadDocuments
                          ref={(instance) => {
                            this.uploadDoc = instance;
                          }}
                          entityId={this.props.ticketId}
                          entityName= {"Ticket"}
                          fieldName= {"Attach Files"}
                        />
                      </div>
                      <div
                        className="col-12 col-sm-4 col-lg-4  mt-2 mt-sm-0"
                        style={{
                            display: this.props.ticketId
                                ? "block"
                                : "none",
                        }}
                      >
                        <label className="mb-1 font-weight-bold ">
                             Tags
                         </label>
                        <TagControl
                          defaultText="None"
                          entityId={this.props.ticketId}
                          entityTypeId={EntityTypeId.TICKET}
                        />
                      </div>
                      <div className="col-12 col-sm-4 col-lg-4 mt-sm-0 mt-1" style={{ display: this.props.ticketId ? "block" : "none" }}>
                        <label className="mb-1 font-weight-bold ">
                          <span>Status</span>
                          {this.props.ticketId && (
                            <span
                              className="text-underline cursorElement align-middle"
                              onClick={() =>
                                this.setState({
                                  showCaseStatusModal: true,
                                })
                              }
                            >
                              <FontAwesomeIcon
                                icon={faClock}
                                className="ml-1 active-icon-blue ClockFontSize"
                              />
                            </span>
                          )}
                        </label>
                        <CustomDropDownList
                          className={"form-control disabled"}
                          data={this.state.tktStatus}
                          valueField="id"
                          name={`tktStatusId`}
                          textField="name"
                          id="tktStatus"
                          value={data.tktStatusId}
                          defaultItem={defaultItem}
                          onChange={(e) => this.props.handleDropdownChange(e)}
                          filterable={this.state.originaltktStatus.length > 5 ? true : false}
                          onFilterChange={this.handleFilterChange}
                        />
                      </div>
                    </div>
                    {this.props.ticketId && (                     
                        <div className="row text-dark mt-3 mx-0">
                          <div className="col-12 col-sm-4 mt-md-3 mt-2">
                            <div className="row ml-1">
                              <span className={`${this.props.isEdit ==true ? "" : "col-6 text-right"}`}>Created Date :</span>
                              <div className={`${this.props.isEdit ==true ? "col-8 " : "col-6 "} font-weight-bold pl-2 text-left word-break-div`}>{data.createdDate ? `${dateFormatter(new Date(data.createdDate))} ${convertShiftDateTime(data.createdDate)}` : "-"}</div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 mt-md-3 mt-2">
                            <div className="row ml-1">
                              <span className={`${this.props.isEdit ==true ? "" : "col-6 text-right"}`}>Created By :</span>
                              <div className={`${this.props.isEdit ==true ? "col-8 " : "col-6 "} font-weight-bold pl-2 text-left word-break-div`}>{data.createdBy ? data.createdBy : "-"}</div>
                            </div>
                          </div>
                          {/* <div className="col-12 col-sm-4 mt-md-3 mt-2">
                            <div className="row ml-1">
                              <span className={`${this.props.isEdit ==true ? "" : "col-6 text-right"}`}>Aging :</span>
                              <div className={`${this.props.isEdit ==true ? "col-8 " : "col-6 "} font-weight-bold pl-2 text-left word-break-div`}>{data.aging >= 0 ? data.aging : "-"}</div>
                            </div>
                          </div> */}
                        </div>                     
                    )}
                  </div>
                )}

                {this.state.showCaseStatusModal && (
                  <div id="hold-position">
                    <Dialog className="col-12 width For-all-responsive-height">
                      <TicketStatusBar
                        entityId={this.props.ticketId}
                        title={"Ticket History - " + data.ticketNumber}
                        handleClose={() => this.setState({ showCaseStatusModal: false })}
                        dataItem={{tktQue: data.tktQue, currentAssignedTo: data.currentAssignedTo}}
                      />
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
}

export default TicketInformation;