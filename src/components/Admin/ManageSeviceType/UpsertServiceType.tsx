import { faHistory, faSave, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import withValueField from "../../Shared/withValueField";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import * as React from "react";
import auth from "../../Auth";
import { NumericTextBox } from "@progress/kendo-react-inputs";
import axios from "axios";
import { Dialog } from "@progress/kendo-react-dialogs";
import { authHeader, successToastr } from "../../../HelperMethods";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";

const CustomDropDownList = withValueField(DropDownList);

export interface UpsertServiceTypeProps {
    props: any;
    //inEdit: boolean;
    onCloseModal: any;
}

export interface UpsertServiceTypeState {
    serviceTypeId?: string;
    serviceType?: string;
    serviceCategory?: string;
    applyFee?: string;
}

class UpsertServiceType extends React.Component<UpsertServiceTypeProps, UpsertServiceTypeState> {
    constructor(props: UpsertServiceTypeProps) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        if (this.props.props) {
            this.setState({ serviceType: this.props.props.serviceType, serviceCategory: this.props.props.serviceCategoryId, serviceTypeId: this.props.props.serviceTypeId })
        }
    }

    handleSave = () => {
        let data = {
            serviceType: this.state.serviceType,
            serviceCategory: this.state.serviceCategory,
        };
        //console.log("))",Id,"&&&&&&" , data)

        axios.post(`api/admin/servicetypes`, JSON.stringify(data)).then((res) => {
            successToastr("Service Type(s) post successfully");
            this.props.onCloseModal();
        });
    }

    handleUpdate = () => {
        const { serviceTypeId } = this.state;
        let data = {
            serviceType: this.state.serviceType,
            serviceCategory: this.state.serviceCategory,
        };


        //   axios.put(`api/admin/skill/${this.state.serviceTypeId}`, JSON.stringify(data)).then((res) => {
        //      successToastr("Service Type(s) update successfully");
        //      this.props.onCloseModal();
        //});  
    }

    render() {
        //const { props } = this.props;
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 
        align-items-center mb-0 d-flex justify-content-end holdposition-width holdposition-width-UpsertService">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                            {this.props.props != undefined ? "Edit Service Category" : "Add Service Category"}
                        </h4>
                        <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.onCloseModal}>
                            &times;
                    </button>
                    </div>

                    <div className="col-12">
                        <div className="row mt-3 ml-0 mr-0">
                            <div className="col-sm-4 pl-0">
                                <label className="mb-2 font-weight-bold">Service Category</label>
                                {/* <input
                                    type="radio"
                                    name="Time"
                                    className="form-control "
                                    //value={props.required}
                                    value="true"
                                    onChange={(event) => {
                                        console.log(event)
                                        this.setState({ serviceCategory: event.target.value });
                                    }}
                                /> */}
                                <div className="d-flex">
                                    <label className="container container_checkboxandradio radioBtnCustom font-weight-normal col-auto">
                                        Time
                                       <input
                                            type="radio"
                                            name="Time"
                                            value="true"

                                            onChange={(event) => {
                                                console.log(event)
                                                this.setState({ serviceCategory: event.target.value });
                                            }}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                    <label className="container container_checkboxandradio radioBtnCustom font-weight-normal col">
                                        Expenses
                                       <input
                                            type="radio"
                                            name="Expenses"
                                            value="false"

                                            onChange={(event) => {
                                                this.setState({ serviceCategory: event.target.value });
                                            }}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                {/* <input
                                    type="radio"
                                    name="Expenses"
                                    className="form-control "
                                    //value={props.required}
                                    value="true"
                                    onChange={(event) => {
                                        this.setState({ serviceCategory: event.target.value });
                                    }}
                                /> */}
                            </div>

                            <div className="col-sm-4">
                                <label className="mb-2 font-weight-bold">Global Service Type</label>
                                <input
                                    type="text"
                                    //name="requisitionNumber"
                                    className="form-control "
                                    value={this.state.serviceType}
                                    onChange={(event) => {
                                        this.setState({ serviceType: event.target.value });
                                    }}
                                />
                            </div>
                            <div className="col-sm-4">
                                <label className="mb-2 font-weight-bold">Apply Fee</label>
                                <div className="d-flex">
                                    <label className="container container_checkboxandradio radioBtnCustom font-weight-normal col-auto">
                                        Yes
                                       <input
                                            type="radio"
                                            name="Yes"
                                            value="true"
                                            onChange={(event) => {
                                                this.setState({ applyFee: event.target.value });
                                            }}
                                        />
                                        <span className="checkmark"></span>
                                    </label>

                                    <label className="container container_checkboxandradio radioBtnCustom font-weight-normal col">
                                        No
                                       <input
                                            type="radio"
                                            name="No"
                                            value="true"
                                            onChange={(event) => {
                                                this.setState({ applyFee: event.target.value });
                                            }}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                {/* <input
                                    type="radio"
                                    name="Yes"
                                    className="form-control "
                                    
                                    value="true"
                                    onChange={(event) => {

                                        this.setState({ applyFee: event.target.value });
                                    }}
                                />
                                <input
                                    type="radio"
                                    name="No"
                                    className="form-control "
                                    
                                    value="true"
                                    onChange={(event) => {
                                        this.setState({ applyFee: event.target.value });
                                    }}
                                /> */}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer justify-content-center border-0">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                            </button>
                            {this.props.props != undefined
                                ? <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleUpdate}>
                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Update Service Type
                            </button>
                                : <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSave}>
                                    <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default UpsertServiceType;