import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  State,
  toODataString,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import * as React from "react";
import { searchFieldsReq } from "./searchFieldsOptions";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import {
    faTimesCircle,
    faUndo,
    faSave,
  } from "@fortawesome/free-solid-svg-icons";

export interface ButtonsProps {
 onCloseModal:any;
 onSearch:any;
 onClear:any;
 onSaveAndSerach:any
}

export interface ButtonsState {
 
}

class Buttons extends React.Component<ButtonsProps, ButtonsState> {

  constructor(props: ButtonsProps) {
      super(props)
      
  }

render(){
    return(
        <div className="modal-footer justify-content-center border-0">
        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
          <button
            type="button"
            className="btn button button-close mr-2 shadow mb-2 mb-xl-0"
            onClick={
              this.props.onCloseModal
            }
          >
            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
          </button>
          <button
            type="button"
            className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
            onClick={this.props.onSearch}
          >
            <FontAwesomeIcon icon={faSearch} className={"mr-1"} /> Search
          </button>
          <button
            type="button"
            className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
            onClick={this.props.onClear 
            }
          >
            <FontAwesomeIcon icon={faUndo} className={"mr-1"} /> Clear
          </button>
          <button
            type="submit"
            className="btn button button-bg shadow mt-0 mt-sm-0 mb-2 mb-xl-0"
            onClick={this.props.onSaveAndSerach}
          >
            <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Search & Save
          </button>
        </div>
      </div>
    )
}

}

export default Buttons