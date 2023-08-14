import React, { Component } from "react";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenAlt,
  faTrash,
  faPlusCircle,
  faUndo,
  faPencilAlt,
  faSave,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  kendoLoadingPanel,
  KendoDataValueRender,
} from "../../../ReusableComponents";
import {
  SUBMIT_RELEASE_SUCCESS_MSG,
  RELEASE_UPDATED_SUCCESS_MSG,
} from "../../../Shared/AppMessages";
import axios from "axios";
import DropwDownContainer from "./DropdownContainer";
import "react-dropdown-tree-select/dist/styles.css";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { CustomHeaderActionCell, MyCommandCell } from "./HelperComponent";
import {
  GetClientLocationVendors,
  GetTimingCatalog,
  GetReleaseStatus,
  GetUnReleasedVendorList,
  GetVendorVMList,
  SelectDropdownMenus,
  FindSelectedVendorValues,
  addBusinessDays,
} from "./HelperFunctions";
import { history } from "../../../../HelperMethods";
import data from "./data.json";
import {
  IReqReleaseVm,
  IVendorListVm,
  VendorDropdownModel,
} from "./IReleaseVendorState";
import { filterBy } from "@progress/kendo-data-query";
import { ConfirmationModal } from "../../../Shared/ConfirmationModal";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import withValueField from "../../../Shared/withValueField";
import Label from "reactstrap/lib/Label";
import { successToastr } from "../../../../HelperMethods";
import { release } from "process";
import { IDropDownModel } from "../../../Shared/Models/IDropDownModel";
import difference from "lodash/difference";
import Skeleton from "react-loading-skeleton";
import { GridNoRecord } from "../../../Shared/GridComponents/CommonComponents";
import AlertBox from "../../../Shared/AlertBox";
import Auth from "../../../Auth";
import _ from "lodash";
import {
  ReqStatus,
  VendorTierType,
} from "../../../Shared/AppConstants";
import {
  NO_VENDOR_CONFIGURED,
 
} from "../../../Shared/AppMessages";
import { Req_Status } from "../../../Shared/Search/searchFieldsOptions";

const isPresent = (value) => value != null && value != undefined;

export interface IReleaseVendorProps {
  approverStep?: {
    releaseDetails: IReqReleaseVm;
    isReleseDetailsLoaded: boolean;
    locationId?: string;
  };
  originalReleaseDetails?: IReqReleaseVm;
  reqId: string;
  clientId?: string;
  reqStatus: string;
  reqDetails?: any;
}

export interface IReleaseVendorState {
  data: IReqReleaseVm[];
  showLoader?: boolean;
  openConfirmDelete?: boolean;
  openConfirmRelease?: boolean;
  openConfirmUnrelease?: boolean;
  vendorsList?: VendorDropdownModel[];
  selectedVendors?: any[];
  PlatinumExpanded: boolean;
  GoldExpanded: boolean;
  SilverExpanded: boolean;
  UtilityExpanded: boolean;
  locationId: string;
  clientId: string;
  distributionsList: IDropDownModel[];
  releaseStatusList: IDropDownModel[];
  selectedDistributionValue: string;
  selectedDistributionName: string;
  releaseDate: Date;
  PlatinumItemsToShow: any;
  GoldItemsToShow: any;
  SilverItemsToShow: any;
  UtilityItemsToShow: any;
  indexToDelete: number;
  isNewRelease: boolean;
  idToUnrelease: string;
  automaticDistribution?: number;
  selectedContainer?: any[];
  showAlert?: boolean;
  dataItem?: any;
  //selectedReleaseVendorMapping:any[];
}
const CustomDropDownList = withValueField(DropDownList);

const assignObjectPaths = (obj, stack?) => {
  Object.keys(obj).forEach((k) => {
    const node = obj[k];
    if (typeof node =="object") {
      node.path = stack ? `${stack}.${k}` : k;
      assignObjectPaths(node, node.path);
    }
  });
};

const headerMenu = [
  {
    text: "",
    icon: "more-horizontal",
    items: [
      {
        text: "Add Release",
        icon: "plus-outline",
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
class ReleaseVendor extends React.Component<
  IReleaseVendorProps,
  IReleaseVendorState
> {
  CustomHeaderActionCellTemplate: any;
  CommandCell;
  editField = "inEdit";
  private originalLevels;
  private currentDataItem;
  private selectedReleaseVendorMapping: any[] = [];
  orignialVendorsList: VendorDropdownModel[];
  private alertMessage = "";
  constructor(props: IReleaseVendorProps) {
    super(props);
    this.state = {
      data: [],
      showLoader: true,
      vendorsList: [],
      selectedVendors: [],
      PlatinumExpanded: false,
      GoldExpanded: false,
      SilverExpanded: false,
      UtilityExpanded: false,
      locationId: "",
      clientId: Auth.getClient(),
      distributionsList: [],
      releaseStatusList: [],
      selectedDistributionValue: "",
      selectedDistributionName: "Manual",
      releaseDate: new Date(),
      PlatinumItemsToShow: 3,
      GoldItemsToShow: 3,
      SilverItemsToShow: 3,
      UtilityItemsToShow: 3,
      indexToDelete: -1,
      isNewRelease: true,
      idToUnrelease: "",
      automaticDistribution: 0,
      selectedContainer: [],
      //selectedReleaseVendorMapping:[]
    };

    this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
      add: this.addNew,
    });
    // this.CommandCell = MyCommandCell({
    //     edit: this.enterEdit,
    //     remove: this.openConfirmBox,
    //     add: this.addNew,
    //     delete: this.delete,
    //     update: this.update,
    //     cancel: this.cancel,
    //     editField: this.editField
    // });
    this.vendorChange = this.vendorChange.bind(this);
    this.onopen = this.onopen.bind(this);
    this.getReqRelease = this.getReqRelease.bind(this);
  }

  async componentDidMount() {
    const { reqDetails } = this.props;
    this.orignialVendorsList = await GetClientLocationVendors(
      this.state.clientId,
      reqDetails.divisionLocationId,
      reqDetails.clientDivisionId
    );
    //this.orignialVendorsList = await GetClientLocationVendors(this.state.clientId, reqDetails.divisionLocationId,null,null);
    this.setState({ distributionsList: await GetTimingCatalog() });
    this.setState({ releaseStatusList: await GetReleaseStatus() });
    this.setState({
      vendorsList: this.orignialVendorsList.filter(
        (x) => x.children.length > 0
      ),
      showLoader: false,
    });
    this.getReqRelease(reqDetails);
    this.getAutomaticDistribution();
  }

  disableDateFields = () => {
    let elements = document.getElementsByName("releseDate");
    if (elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
        elements[i]["disabled"] = true;
      }
    }
  };

  //gets approvers dropdown based on clientId

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
      this.setState({
        indexToDelete: index,
        openConfirmDelete: true,
        dataItem: dataItem,
      });
    }
  };

  addNew = () => {
    if (this.orignialVendorsList.length==0) {
      this.alertMessage = NO_VENDOR_CONFIGURED;
      this.setState({ showAlert: true });
      return false;
    }
    let currentIndex = this.state.data.length;
    let defaultTimingCatalog = this.state.distributionsList.filter(
      (x) => x.name=="Manual"
    )[0];
    let defaultReleaseStatus = this.state.releaseStatusList.filter(
      (x) => x.name=="Pending Release"
    )[0].name;
    const newDataItem: IReqReleaseVm = {
      index: currentIndex,
      allVendorList: this.state.vendorsList,
      reqReleaseVendorMap: [],
      distType: defaultTimingCatalog,
      releaseDate: new Date(),
      reqReleaseId: undefined,
      status: defaultReleaseStatus,
      inEdit: true,
      isDefault: false,
      noOfDays: 0,
      selectedReleaseVendorMapping: [],
    };

    this.state.data.push(newDataItem);
    this.setState({ data: this.state.data }, () => this.disableDateFields());
    // this.props.handleApproversChange(this.state.data);
  };

  enterEdit = (index) => {
    this.state.data[index].inEdit = true;
    if (!this.state.data[index].reqReleaseId) {
      this.vendorChange(
        null,
        this.state.data[index].reqReleaseVendorMap,
        index
      );
    }

    this.setState({ data: this.state.data });
  };

  disableContents = (index) => {
    setTimeout(() => {
      if (this.state.data[index] && this.state.data[index].status=="Released") {
        let allVendorIds = this.state.data[index].allVendorList.map(
          (x) => x.id
        );
        this.state.data[index].allVendorList.forEach((vendor) => {
          if (vendor.children.length > 0) {
            vendor.children.forEach((child) => {
              allVendorIds.push(child.id);
            });
          }
        });
        let selectedVendorIds = this.state.data[index].reqReleaseVendorMap.map(
          (x) => x.id
        );

        let unSelectedVendorIds = difference(allVendorIds, selectedVendorIds);
        unSelectedVendorIds.forEach((id) => {
          if (document.getElementById(id) !=null) {
            var el = document.getElementById("index" + index);
            el.querySelector<HTMLElement>("[id='" + id + "']").setAttribute(
              "disabled",
              "true"
            );
            //document.getElementById(id).setAttribute('disabled','true');
          }
        });
      }
      let checkedVendors = [];
      this.state.data.forEach((v, i) => {
        v.reqReleaseVendorMap.forEach((x) => {
          if (x._parent==undefined) {
            v.allVendorList
              .find((v) => v.id==x.id)
              .children.forEach((c) => {
                checkedVendors.push(c.id);
              });
          } else {
            checkedVendors.push(x._parent);
          }
          checkedVendors.push(x.id);
        });
      });
      checkedVendors.forEach((id) => {
        if (document.getElementById(id) !=null) {
          var el = document.getElementById("index" + index);
          el.querySelector<HTMLElement>("[id='" + id + "']").setAttribute(
            "disabled",
            "true"
          );
          //document.getElementById(id).setAttribute('disabled','true');
        }
      });
    }, 100);
  };

  update = (index) => {
    if (
      this.state.data[index].reqReleaseVendorMap.length > 0 ||
      this.state.data[index].status=="Released"
    ) {
      this.state.data[index].inEdit = undefined;
      this.setState({ data: this.state.data });
    } else {
      this.alertMessage = "Please select vendors to save.";
      this.setState({ showAlert: true });
      return false;
    }
  };

  updateItem = (data, item) => {
    let index = data.findIndex(
      (p) => p ==item || (item.releaseId && p.releaseId ==item.releaseId)
    );
    if (index >= 0) {
      data[index] = { ...item };
    }
  };

  cancel = (dataItem) => {};

  delete = (index, dataItem) => {
    const data = this.state.data;
    //data.splice(index, 1);
    if (data.length==1) {
      this.setState({ openConfirmDelete: false });
      this.alertMessage = "At least one release is required.";
      this.setState({ showAlert: true });
      return false;
    }
    this.removeItem(data, dataItem);
    this.setState({ data: data, openConfirmDelete: false });
    //this.props.handleApproversChange(this.state.data);
  };

  removeItem(data, item) {
    let index = data.findIndex(
      (p) => p ==item || (item.releaseId && p.releaseId ==item.releaseId)
    );
    if (index >= 0) {
      data.splice(index, 1);
    }
    this.setState({ data: data, openConfirmDelete: false });
  }

  resetChanges = () => {
    const data = { ...this.originalLevels };
    this.setState({ data });
  };

    render() {
        assignObjectPaths(data);
        return (
            <div className="row">
                <div className="releaseVendor w-100" id="releaseVendor">
                    <div className="table-responsive tableShadow">
                        <table className="release-table-responsive release-table release-table-resp" id="kendo-Tabledatepicker">
                            <thead className="release-table-head">
                                <tr className="release-table-row releae-vendor-table-tr">
                                    <th>Vendors</th>
                                    <th>Distributions</th>
                                    <th>Release Date</th>
                                    <th>Status</th>
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
                                                        onFocus={() => this.disableContents(release.index)}
                                                        onNodeToggle={() => this.disableContents(release.index)}
                                                    />
                                                )}

                          <div className="row ml-0 mr-0">
                            <div className="col-12 col-sm-12 mb-2">
                              <div className="vendor-ranking row w-100 ml-0 mr-0">
                                <div
                                  className="font-weight-bold ranking"
                                  style={{
                                    display:
                                      release.reqReleaseVendorMap.filter(
                                        (x) => x.tagClassName=="lplatinum-bg"
                                      ).length > 0
                                        ? "block"
                                        : "none",
                                  }}
                                >
                                  {VendorTierType.PLATINUM}
                                </div>
                                {release.reqReleaseVendorMap
                                  .filter(
                                    (x) => x.tagClassName=="lplatinum-bg"
                                  )
                                  .slice(
                                    0,
                                    release.PlatinumExpanded
                                      ? release.reqReleaseVendorMap.filter(
                                          (x) =>
                                            x.tagClassName=="lplatinum-bg"
                                        ).length
                                      : this.state.PlatinumItemsToShow
                                  )
                                  .map(
                                    (item: any, index) =>
                                      item.tagClassName=="lplatinum-bg" && (
                                        <div
                                          title={
                                            item.hasOwnProperty("children")
                                              ? _.filter(
                                                  release.selectedReleaseVendorMapping,
                                                  (v) =>
                                                    _.indexOf(
                                                      item.children,
                                                      v.vendorId
                                                    ) !=-1
                                                )
                                                  .map((x) => x.name)
                                                  .join(" | ")
                                              : item.label
                                          }
                                          style={{ whiteSpace: "nowrap" }}
                                          className={
                                            "p-1 ml-1 mt-2 pl-2 " +
                                            item.tagClassName
                                          }
                                          key={item.id}
                                        >
                                          {item.label}
                                          {release.inEdit && (
                                            <span
                                              key={item.id + "span"}
                                              onClick={() => {
                                                this.deleteTag(
                                                  item.id,
                                                  release.status,
                                                  release.index
                                                );
                                              }}
                                              style={{
                                                cursor: "pointer",
                                                paddingRight: "5px",
                                              }}
                                            >
                                              <FontAwesomeIcon
                                                icon={faTimes}
                                                className="ml-1"
                                              />
                                            </span>
                                          )}
                                        </div>
                                      )
                                  )}
                                <a
                                  className="ml-3"
                                  onClick={() =>
                                    this.showMore(
                                      "PlatinumExpanded",
                                      release.index
                                    )
                                  }
                                  style={{
                                    display:
                                      release.reqReleaseVendorMap.filter(
                                        (x) => x.tagClassName=="lplatinum-bg"
                                      ).length > 3
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
                                      release.reqReleaseVendorMap.filter(
                                        (x) => x.tagClassName=="lgold-bg"
                                      ).length > 0
                                        ? "block"
                                        : "none",
                                  }}
                                >
                                  {VendorTierType.GOLD}
                                </div>
                                {release.reqReleaseVendorMap
                                  .filter((x) => x.tagClassName=="lgold-bg")
                                  .slice(
                                    0,
                                    release.GoldExpanded
                                      ? release.reqReleaseVendorMap.filter(
                                          (x) => x.tagClassName=="lgold-bg"
                                        ).length
                                      : this.state.GoldItemsToShow
                                  )
                                  .map(
                                    (item: any, index) =>
                                      item.tagClassName=="lgold-bg" && (
                                        <div
                                          title={
                                            item.hasOwnProperty("children")
                                              ? _.filter(
                                                  release.selectedReleaseVendorMapping,
                                                  (v) =>
                                                    _.indexOf(
                                                      item.children,
                                                      v.vendorId
                                                    ) !=-1
                                                )
                                                  .map((x) => x.name)
                                                  .join(" | ")
                                              : item.label
                                          }
                                          style={{ whiteSpace: "nowrap" }}
                                          className={
                                            "p-1 ml-1 mt-2 pl-2 " +
                                            item.tagClassName
                                          }
                                          key={item.id}
                                        >
                                          {item.label}
                                          {release.inEdit && (
                                            <span
                                              key={item.id + "span"}
                                              onClick={() => {
                                                this.deleteTag(
                                                  item.id,
                                                  release.status,
                                                  release.index
                                                );
                                              }}
                                              style={{
                                                cursor: "pointer",
                                                paddingRight: "5px",
                                              }}
                                            >
                                              <FontAwesomeIcon
                                                icon={faTimes}
                                                className="ml-1"
                                              />
                                            </span>
                                          )}
                                        </div>
                                      )
                                  )}
                                <a
                                  className="ml-3"
                                  onClick={() =>
                                    this.showMore("GoldExpanded", release.index)
                                  }
                                  style={{
                                    display:
                                      release.reqReleaseVendorMap.filter(
                                        (x) => x.tagClassName=="lgold-bg"
                                      ).length > 3
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
                                      release.reqReleaseVendorMap.filter(
                                        (x) => x.tagClassName=="lsilver-bg"
                                      ).length > 0
                                        ? "block"
                                        : "none",
                                  }}
                                >
                                  {VendorTierType.SILVER}
                                </div>
                                {release.reqReleaseVendorMap
                                  .filter((x) => x.tagClassName=="lsilver-bg")
                                  .slice(
                                    0,
                                    release.SilverExpanded
                                      ? release.reqReleaseVendorMap.filter(
                                          (x) => x.tagClassName=="lsilver-bg"
                                        ).length
                                      : this.state.SilverItemsToShow
                                  )
                                  .map(
                                    (item: any, index) =>
                                      item.tagClassName=="lsilver-bg" && (
                                        <div
                                          title={
                                            item.hasOwnProperty("children")
                                              ? _.filter(
                                                  release.selectedReleaseVendorMapping,
                                                  (v) =>
                                                    _.indexOf(
                                                      item.children,
                                                      v.vendorId
                                                    ) !=-1
                                                )
                                                  .map((x) => x.name)
                                                  .join(" | ")
                                              : item.label
                                          }
                                          style={{ whiteSpace: "nowrap" }}
                                          className={
                                            "p-1 ml-1 mt-2 pl-2 " +
                                            item.tagClassName
                                          }
                                          key={item.id}
                                        >
                                          {item.label}
                                          {release.inEdit && (
                                            <span
                                              key={item.id + "span"}
                                              onClick={() => {
                                                this.deleteTag(
                                                  item.id,
                                                  release.status,
                                                  release.index
                                                );
                                              }}
                                              style={{
                                                cursor: "pointer",
                                                paddingRight: "5px",
                                              }}
                                            >
                                              <FontAwesomeIcon
                                                icon={faTimes}
                                                className="ml-1"
                                              />
                                            </span>
                                          )}
                                        </div>
                                      )
                                  )}
                                <a
                                  className="ml-3"
                                  onClick={() =>
                                    this.showMore(
                                      "SilverExpanded",
                                      release.index
                                    )
                                  }
                                  style={{
                                    display:
                                      release.reqReleaseVendorMap.filter(
                                        (x) => x.tagClassName=="lsilver-bg"
                                      ).length > 3
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
                                      release.reqReleaseVendorMap.filter(
                                        (x) => x.tagClassName=="lutility-bg"
                                      ).length > 0
                                        ? "block"
                                        : "none",
                                  }}
                                >
                                  {VendorTierType.UTILITY}
                                </div>
                                {release.reqReleaseVendorMap
                                  .filter(
                                    (x) => x.tagClassName=="lutility-bg"
                                  )
                                  .slice(
                                    0,
                                    release.UtilityExpanded
                                      ? release.reqReleaseVendorMap.filter(
                                          (x) => x.tagClassName=="lutility-bg"
                                        ).length
                                      : this.state.UtilityItemsToShow
                                  )
                                  .map(
                                    (item: any, index) =>
                                      item.tagClassName=="lutility-bg" && (
                                        <div
                                          title={
                                            item.hasOwnProperty("children")
                                              ? _.filter(
                                                  release.selectedReleaseVendorMapping,
                                                  (v) =>
                                                    _.indexOf(
                                                      item.children,
                                                      v.vendorId
                                                    ) !=-1
                                                )
                                                  .map((x) => x.name)
                                                  .join(" | ")
                                              : item.label
                                          }
                                          style={{ whiteSpace: "nowrap" }}
                                          className={
                                            "p-1 ml-1 mt-2 pl-2 " +
                                            item.tagClassName
                                          }
                                          key={item.id}
                                        >
                                          {item.label}
                                          {release.inEdit && (
                                            <span
                                              key={item.id + "span"}
                                              onClick={() => {
                                                this.deleteTag(
                                                  item.id,
                                                  release.status,
                                                  release.index
                                                );
                                              }}
                                              style={{
                                                cursor: "pointer",
                                                paddingRight: "5px",
                                              }}
                                            >
                                              <FontAwesomeIcon
                                                icon={faTimes}
                                                className="ml-1"
                                              />
                                            </span>
                                          )}
                                        </div>
                                      )
                                  )}
                                <a
                                  className="ml-3"
                                  onClick={() =>
                                    this.showMore(
                                      "UtilityExpanded",
                                      release.index
                                    )
                                  }
                                  style={{
                                    display:
                                      release.reqReleaseVendorMap.filter(
                                        (x) => x.tagClassName=="lutility-bg"
                                      ).length > 3
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
                            disabled={
                              !release.inEdit || release.status=="Released"
                            }
                            className="form-control distribution-ddl"
                            data={
                              release.isDefault
                                ? this.state.distributionsList
                                : this.state.distributionsList.filter(
                                    (x) => x.name !="Automatic"
                                  )
                            }
                            textField="name"
                            valueField="id"
                            value={release.distType.id}
                            onChange={(e) =>
                              this.onDistributionChange(e, release.index)
                            }
                            id="distribution"
                          />
                        </td>
                        <td contextMenu="Release Date">
                          <Label
                            style={{
                              display:
                                release.distType.name !="Manual"
                                  ? "block"
                                  : "none",
                            }}
                          >
                            {Intl.DateTimeFormat("en-US").format(
                              release.releaseDate
                            )}
                          </Label>
                          <div
                            style={{
                              display:
                                release.distType.name=="Manual"
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <DatePicker
                              className="form-control release-date-ddl kendo-Tabledatepicker"
                              format="MM/dd/yyyy"
                              name="releseDate"
                              value={release.releaseDate}
                              onChange={(e) =>
                                this.handleChange(e, release.index)
                              }
                              formatPlaceholder="formatPattern"
                              disabled={
                                !release.inEdit || release.status=="Released"
                              }
                              min={new Date()}
                            />
                          </div>
                        </td>
                        <td>
                          <Label>{release.status}</Label>
                        </td>
                        <td>
                          {release.inEdit ? (
                            <div className="iconcolorsize">
                              <span
                                className="k-icon k-i-save release-icon iconColorReleased"
                                title="Save"
                                onClick={() => this.update(release.index)}
                              ></span>
                              {release.status !="Released" && (
                                <span
                                  className="k-icon k-i-delete release-icon kendo-Tabledatepickera iconColorReleased iconmarginRight"
                                  title="Delete"
                                  onClick={() =>
                                    release.reqReleaseVendorMap.length > 0
                                      ? this.setState({
                                          indexToDelete: release.index,
                                          openConfirmDelete: true,
                                          dataItem: release,
                                        })
                                      : this.delete(release.index, release)
                                  }
                                ></span>
                              )}
                            </div>
                          ) : (
                            <Menu
                              onSelect={(e) =>
                                this.onRowMenuSelect(e, release.index, release)
                              }
                              items={
                                release.status=="Released"
                                  ? rowMenuReleased
                                  : rowMenuAll
                              }
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
        ></AlertBox>
        <ConfirmationModal
          message={"Are you sure you want to release this requisition?"}
          showModal={this.state.openConfirmRelease}
          handleYes={() => this.submitRelease(true)}
          handleNo={() => {
            this.setState({ openConfirmRelease: false });
          }}
        />
        <ConfirmationModal
          message={"Are you sure you want to delete release?"}
          showModal={this.state.openConfirmDelete}
          handleYes={() =>
            this.delete(this.state.indexToDelete, this.state.dataItem)
          }
          handleNo={() => {
            this.setState({ openConfirmDelete: false });
          }}
        />
        <ConfirmationModal
          message={
            "Are you sure you want to unrelease the requisition for the vendor?"
          }
          showModal={this.state.openConfirmUnrelease}
          handleYes={() =>
            this.deleteTagAfterRelease(
              this.state.idToUnrelease,
              this.state.indexToDelete
            )
          }
          handleNo={() => {
            this.setState({ openConfirmUnrelease: false });
          }}
        />
      </div>
    );
  }

  vendorChange = (currentNode, selectedNodes, index) => {
    // if (selectedNodes.length <= 3) {
    //     this.setState({
    //         PlatinumExpanded: false,
    //         GoldExpanded: false,
    //         SilverExpanded: false,
    //         UtilityExpanded: false,
    //     });
    // }

    this.setState({
      selectedVendors: selectedNodes,
    });
    if (!currentNode && selectedNodes.length > 0) {
      const vendors = SelectDropdownMenus(
        this.orignialVendorsList,
        selectedNodes
      );
      this.state.data[index].allVendorList = vendors;
      //this.setState({ vendorsList: vendors });
    }
    if (currentNode) {
      if (currentNode.hasOwnProperty("_children")) {
        if (currentNode.checked) {
          currentNode._children.forEach((element) => {
            this.state.data[index].selectedReleaseVendorMapping.push({
              name: currentNode.label,
              tier: currentNode.rankingType,
              releaseVendorMappingId: undefined,
              vendorId: element,
            });
          });
        } else {
          currentNode._children.forEach((element) => {
            this.state.data[index].selectedReleaseVendorMapping.splice(
              this.state.data[index].selectedReleaseVendorMapping.findIndex(
                (x) => x.vendorId==element
              ),
              1
            );
          });
        }
      } else {
        if (currentNode.checked) {
          this.state.data[index].selectedReleaseVendorMapping.push({
            name: currentNode.label,
            tier: currentNode.rankingType,
            releaseVendorMappingId: undefined,
            vendorId: currentNode.id,
          });
        } else {
          this.state.data[index].selectedReleaseVendorMapping.splice(
            this.state.data[index].selectedReleaseVendorMapping.findIndex(
              (x) => x.name==currentNode.label
            ),
            1
          );
        }
      }

      selectedNodes = selectedNodes.map(
        ({ checked, id, label, tagClassName, _id, _parent }) => ({
          checked,
          id,
          label,
          tagClassName,
          _id,
          _parent,
        })
      );
    }
    this.state.data[index].reqReleaseVendorMap = selectedNodes;
    this.setState({ data: this.state.data });
  };

  onDistributionChange = (e, index) => {
    let releaseDate;
    if (e.value.name=="Manual") {
      releaseDate = new Date();
    }

    //this.setState({selectedDistributionValue:e.value.timingCatalogId, selectedDistributionName:e.value.name})
    if (e.value.name=="Automatic") {
      //releaseDate = new Date(this.state.releaseDate.setDate(this.state.releaseDate.getDate() + 14));
      releaseDate = addBusinessDays(
        new Date(),
        this.state.data[index].noOfDays
      );
    }
    if (e.value.name=="Release Now") {
      releaseDate = new Date();
    }
    this.state.data[index].distType = e.value;
    this.state.data[index].releaseDate = releaseDate;
    this.setState({ data: this.state.data });
  };

  handleChange = (e, index) => {
    this.state.data[index].releaseDate = e.value;
    this.setState({ data: this.state.data });
  };
  onopen(e, index) {}
  deleteTag(id: string, status: string, index: number) {
    if (status=="Released") {
      this.setState({
        idToUnrelease: id,
        indexToDelete: index,
        openConfirmUnrelease: true,
      });
    } else {
      var el = document.getElementById("index" + index);

      var delElem = el.querySelector<HTMLElement>("[id='" + id + "_button']");
      setTimeout(() => {
        delElem.click();
      }, 1000);
    }
  }
  deleteTagAfterRelease(id: string, index: number) {
    //document.getElementById(id + '_button').click();

    var el = document.getElementById("index" + index);
    el.querySelector<HTMLElement>("[id='" + id + "_button']").click();
    this.setState({ openConfirmUnrelease: false });
  }

  showMore(rank, index) {
    switch (rank) {
      case "PlatinumExpanded":
        this.state.data[index].PlatinumExpanded =
          !this.state.data[index].PlatinumExpanded;
        break;
      case "GoldExpanded":
        this.state.data[index].GoldExpanded =
          !this.state.data[index].GoldExpanded;
        break;
      case "SilverExpanded":
        this.state.data[index].SilverExpanded =
          !this.state.data[index].SilverExpanded;
        break;
      case "UtilityExpanded":
        this.state.data[index].UtilityExpanded =
          !this.state.data[index].UtilityExpanded;
    }
    this.setState({ data: this.state.data });
  }

  getReqRelease = (reqDetails) => {
    axios.get(`api/requisitions/${this.props.reqId}/releases`).then((res) => {
      // this.setState({data:releaseData});
      if (res.data.length > 0) {
        this.populateReleaseVendors(res.data);
        this.setState({ isNewRelease: false });
      } else {
        axios
          .get(
            `api/clients/releases?clientId=${this.state.clientId}&locationId=${reqDetails.divisionLocationId}&divisionId=${reqDetails.clientDivisionId}&positionId=${reqDetails.jobPositionId}`
          )
          .then((res) => {
            // this.setState({data:releaseData});
            if (res.data.length > 0) {
              this.populateReleaseVendors(res.data);
              this.setState({ isNewRelease: true });
            }
          });
      }
    });
  };

  getAutomaticDistribution = () => {
    axios.get(`api/requisitions/autodistribution`).then((res) => {
      if (res.data) {
        this.setState({ automaticDistribution: res.data });
      }
    });
  };

  populateReleaseVendors(releaseVendors: any[]) {
    releaseVendors.map((d, index) => {
      let tempMapping = d.reqReleaseVendorMap;
      let updateVendors = SelectDropdownMenus(
        this.orignialVendorsList,
        d.reqReleaseVendorMap
      );
      let selectedVendors = FindSelectedVendorValues(
        this.orignialVendorsList,
        d.reqReleaseVendorMap,
        d.status.name =="Released"
      );
      d.allVendorList = updateVendors;
      this.state.selectedContainer.push(selectedVendors);
      d.reqReleaseVendorMap = selectedVendors;
      d.status = d.status.name;
      let calculatedReleaseDate = new Date();
      if (!d.releaseDate) {
        if (d.distType.name=="Automatic") {
          calculatedReleaseDate = addBusinessDays(new Date(), d.noOfDays);
        } else {
          calculatedReleaseDate = calculatedReleaseDate;
        }
        d.releaseDate = calculatedReleaseDate;
      } else {
        d.releaseDate = new Date(d.releaseDate);
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
    });
    this.setState({ data: this.state.data });
  }

  close = () => {
    if (this.state.data.some((d) => d.reqReleaseId ==undefined)) {
      if (
        window.confirm(
          "Any changes made will be lost. Do you wish to continue?"
        )
      ) {
        history.goBack();
      }
      return false;
    } else {
      history.goBack();
    }
  };
  release = (isRelease: boolean) => {
    if (this.state.data.length==0) {
      this.alertMessage = "No release added.";
      this.setState({ showAlert: true });
      return false;
    }
    if (this.state.data.some((d) => d.inEdit ==true)) {
      this.alertMessage = "Please save data in each row before Release.";
      this.setState({ showAlert: true });
      return false;
    }
    if (isRelease) {
      this.setState({ openConfirmRelease: true });
    } else {
      this.submitRelease(false);
    }
  };

  submitRelease = (isRelease: boolean) => {
    this.setState({ openConfirmRelease: false });
    this.state.data.map((data, index) => {
      data.releaseVendorMappings = data.selectedReleaseVendorMapping.map(
        (x) => {
          return {
            vendorId: x.vendorId,
            rank: x.tier,
            releaseVendorMappingId: x.reqReleaseVendorMapId,
          };
        }
      );
      // data.releaseVendorMappings = GetVendorVMList(data.selectedReleaseVendorMapping, data.reqReleaseVendorMap);
      data.statusId = this.state.releaseStatusList.filter(
        (x) => x.name=="Pending Release"
      )[0].id;
      if (!isRelease && (this.props.reqStatus !="Released" && this.props.reqStatus !=ReqStatus.CANDIDATEUNDERREVIEW)) {
        data.releaseDate = null;
      }
    });
    const data = {
      isReleased: isRelease,
      reqId: this.props.reqId,
      clientId: localStorage.getItem("UserClientId"),
      reqReleaseCollectionVms: this.state.data,
    };
    if (this.state.isNewRelease) {
      axios
        .post("/api/requisitions/release", JSON.stringify(data))
        .then((res) => {
          if (res.data) {
            if (isRelease) {
              successToastr(SUBMIT_RELEASE_SUCCESS_MSG);
            } else {
              successToastr(RELEASE_UPDATED_SUCCESS_MSG);
            }
            history.goBack();
          }
        });
    } else {
      axios
        .put("/api/requisitions/release", JSON.stringify(data))
        .then((res) => {
          if (res.data) {
            if (isRelease) {
              successToastr(SUBMIT_RELEASE_SUCCESS_MSG);
            } else {
              successToastr(RELEASE_UPDATED_SUCCESS_MSG);
            }
            history.goBack();
          }
        });
    }
  };
}

export default ReleaseVendor;
