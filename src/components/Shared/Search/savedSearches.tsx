import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faChevronCircleDown,
  faSave,
  faTrash,
  faEdit,
  faMapPin,
  faTimesCircle,
  faPencilAlt,
  faCopy,
  faTrashAlt,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import axios from "axios";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import Tag from "reactstrap/lib/Tag";
import { successToastr, updateFilteredArray } from "../../../HelperMethods";
import { DELETE_SEARCH_CONFIRMATION_MSG, VENDOR_INVOICE_MAKE_REMITTANCE_CONFIRMATION_MSG } from "../AppMessages";
import DeleteConfirmationModal from './DeleteConfirmationModal'
export interface SaveSearchProps {
  savedSearches: any;
  editSearch: Function;
  getSavedSearches?: any;
  onSearchRequisition: any;
}
export interface SaveSearchState {
  suggestedData: any;
  selectedValue: string;
  inputedText: string;
  defaultSelected: string;
  deleteConfirmationModal?: boolean
  searchId?: any;
  previosData?: any;
  searchName?: any;
}

class SavedSearch extends React.Component<SaveSearchProps, SaveSearchState> {
  constructor(props: SaveSearchProps) {
    super(props);
    this.state = {
      suggestedData: [],
      inputedText: "",
      selectedValue: "Save search",
      defaultSelected: "All",
    };
  }
  componentDidMount() {
    // this.props.getSavedSearches();
    this.updateStateData();
  }

  pinnedValue = (data, newSavedSearch) => {
    newSavedSearch==undefined ? data.map((item) => {
      return item.pinned ? this.setState({ defaultSelected: item.name }) : null;
    }) : data.map((item) => {
      return item.searchId ==newSavedSearch ? this.setState({ defaultSelected: item.name }) : null;
    })
  };

  updateStateData = () => {
    this.setState({ suggestedData: this.props.savedSearches }
    );
  };
  getSelectedData = (dataName) => {
    let data = this.props.savedSearches.filter((i) =>
      i.name ==dataName || i.searchId ==dataName ? i : null
    );
    return data;
  };

  deleteSavedSearch = (id) => {
    let searchId = id;
    let dataAfterDelete = this.props.savedSearches.filter(
      (i) => i.searchId != searchId
    );
    axios
      .delete(`/api/search/${searchId}`)
      .then(() => {
        successToastr("Search deleted successfully");
        this.setState({
          suggestedData: dataAfterDelete,
          defaultSelected: "All",
        });
      })
      .then(() => this.defaultSearch())
      .then(() => this.props.getSavedSearches()).then(() => this.setState({ deleteConfirmationModal: false }));
  };
  EditSavedSearch = (id) => {
    let data = this.getSelectedData(id);
    setTimeout(() => this.props.editSearch(data), 500);
  };
  pinUnpinSearch = (id, ifpinned) => {
    let data = this.getSelectedData(id);
    let searchId = id;
    let filterdArray = JSON.parse(data[0].filter);
    axios
      .patch(`api/search/${searchId}`, { pinned: ifpinned })
      .then(() => {
        this.props.getSavedSearches();
      })
      .then(() =>
        ifpinned
          ? (this.setState({ defaultSelected: data[0].name }),
            (filterdArray = updateFilteredArray(filterdArray)),
            this.props.onSearchRequisition(filterdArray, "true",data))
          : this.defaultSearch()
      );
  };

  defaultSearch = () => {
    this.setState({ defaultSelected: "All" });
    // this.props.onSearchRequisition();
  };

  setDefault = () => {
    this.setState({ defaultSelected: "All" });
  };
  
  itemRender = (li) => {
    var ifpinned;
    var searchId;
    let searchName;
    let data = this.getSelectedData(li.props.children[0]);
    if (li.props.children[0] != "All") {
      if (data[0].pinned) {
        ifpinned = true;
      } else {
        ifpinned = false;
      }
      searchId = data[0].searchId;
      searchName = data[0].name;
    }
    const itemChildren =
      li.props.children[0] =="All" ? (
        <span className="col-12" onClick={this.defaultSearch}>
          All
        </span>
      ) : (
        <div className="row mr-0 ml-0 w-100">
          {" "}
          <div className="col pl-0">
            <span
              className="whiteHover pinColor"
              color={ifpinned}
              onClick={() =>
                data[0].pinned
                  ? this.pinUnpinSearch(searchId, false)
                  : this.pinUnpinSearch(searchId, true)
              }
            >
              {/* <FontAwesomeIcon icon={faThumbtack} color={color} className="whiteHover pinColor" /> */}
              <FontAwesomeIcon
                icon={faThumbtack}
                className={ifpinned ? "black_rotate" : "gray_rotate"}
              />
            </span>
            <span className="pl-2 whiteHover">{li.props.children[0]} </span>
          </div>
          <div className="col-auto d-flex justify-content-between pr-0">
            <span
              onClick={() => this.EditSavedSearch(searchId)}
              className="text-primary whiteHover"
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </span>
            <span
              onClick={() => this.setState({ searchId: searchId, searchName: searchName, deleteConfirmationModal: true })}
              className="text-primary whiteHover ml-3"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </span>
          </div>
        </div>
      );
    return React.cloneElement(li, li.props, itemChildren);
  };
  selectedSearchOption = (e) => {
    if (e.target.value =="All") {
      this.props.onSearchRequisition();
    } else {
      let data = this.getSelectedData(e.target.value);

      if (data.length > 0) {
        let searchId = data[0].id;
        let filterdArray = JSON.parse(data[0].filter);
        this.setState({ defaultSelected: data[0].name });
        filterdArray = updateFilteredArray(filterdArray);
        this.props.onSearchRequisition(filterdArray, "true", data);
      }
    }
  };
  render() {
    const { savedSearches } = this.props;
    const { suggestedData } = this.state;
    let savedSearchesData = suggestedData.map((i) => i.name);
    savedSearchesData.unshift("All");
    return (
      <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-2 text-right mt-2 mt-md-0 pr-0 ">
        <div className="row d-flex justify-content-end mr-0 remove-ml-forMobile">
          <div className="col-12 pl-0" id="remove-shadow">
            <DropDownList
              data={savedSearchesData}
              itemRender={this.itemRender}
              className="btn font-style-italic advancesearch_heighty w-100 rounded-right buttonSaveSearch Advacne_buttonSaveSearch p-0 d-flex align-items-center"
              value={this.state.defaultSelected}
              onFocus={this.updateStateData}
              onChange={this.selectedSearchOption}
            />
          </div>
        </div>
        {this.state.deleteConfirmationModal ? (
          <DeleteConfirmationModal
            message={DELETE_SEARCH_CONFIRMATION_MSG(this.state.searchName)
            }
            showModal={this.state.deleteConfirmationModal}
            handleYes={(props) =>
              this.deleteSavedSearch(
                this.state.searchId
              )
            }
            handleNo={() => {
              this.setState({ deleteConfirmationModal: false });
            }}
            radioSelection={false}
          />
        ) : null}
      </div>
    );
  }
}
export default SavedSearch;
