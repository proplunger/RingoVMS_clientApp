import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import axios from "axios";
import { successToastr } from "../../../HelperMethods";

export interface UpsertDivisionProps {
    props: any;
    onCloseModal: any;
    onOpenModal: any;
    clientId: string;
}

export interface UpsertDivisionState {
    jobCategoryId?: string;
    name?: string;
    description?: string;
    divisionId?: string;
    clientId?: string;
}
class UpsertJobCategories extends React.Component<UpsertDivisionProps, UpsertDivisionState> {
    constructor(props: UpsertDivisionProps) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        if(this.props.props){
        this.setState({description: this.props.props.description, name:this.props.props.name, jobCategoryId:this.props.props.jobCategoryId})
      }}

    openNew = () => {
        this.props.onOpenModal();
    };

    handleSaveAndAddAnother = () =>{
        const {clientId} = this.props;
        let data = {
        jobCategory: this.state.name,
        description: this.state.description,
        };
        //console.log("________",data, clientId)
        axios.post(`api/admin/client/${clientId}/jobcategory`, JSON.stringify(data)).then((res) => {
        successToastr("Job Category(s) post successfully");
        this.props.onCloseModal();
        setTimeout(() => {
        this.openNew();
        }, 50);
      });  
    }

    handleUpdate = () =>{
        const {jobCategoryId} = this.state;
        let data = {
        jobCategory: this.state.name,
        description: this.state.description,
        };
    
         //console.log("&&&&&&" , data, "^^^^^^^", jobCategoryId)
    
      axios.put(`api/admin/jobcategory/${jobCategoryId}`, JSON.stringify(data)).then((res) => {
         successToastr("Job Category(s) update successfully");
         this.props.onCloseModal();
      });  
    } 

    handleSaveAndClose = () =>{
        const {clientId} = this.props;
        let data = {
        jobCategory: this.state.name,
        description: this.state.description,
        };
        axios.post(`api/admin/client/${clientId}/jobcategory`, JSON.stringify(data)).then((res) => {
        successToastr("Job Category(s) post successfully");
        this.props.onCloseModal();
     });  
    }

    render() {
        //const { props , inEdit} = this.props;
        //console.log("))))))))", this.props.props)
        //console.log("this.pops", this.props, this.state);
        return (
            <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
                <div className="modal-content border-0">
                    <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                        <h4 className="modal-title text-white fontFifteen">
                        {this.props.props != undefined ? "Edit Job Category" : "Add Job Category" }  {/*<span> {props.clientId} </span> */}
                        </h4>
                        <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.onCloseModal}>
                            &times;
                        </button>
                    </div>

                    <div className="row mt-3 ml-0 mr-0">
                        <div className="col-sm-4">
                            <label className="mb-1 font-weight-bold">Job Category</label>
                            <input
                                type="text"
                                className="form-control "
                                placeholder="Type here"
                                value={this.state.name}
                                onChange={(event) => {
                                    this.setState({ name: event.target.value });
                                }}
                            />
                        </div>
                        <div className="col-sm-4">
                        <label className="mb-0 font-weight-bold">Description</label>
                        <textarea
                            rows={2}
                            id=""
                            value={this.state.description}
                            className="form-control mt-1"
                            onChange={(event) => {
                                this.setState({ description: event.target.value });
                            }}
                        />
                        </div>     
                    </div>

                    <div className="modal-footer justify-content-center border-0">
                        <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.props.onCloseModal}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                            </button>
                            {this.props.props != undefined
                            ? <button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleUpdate}> 
                            <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Update Job Category
                              </button>
                            :<div>
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
            </div>
        );
    }
}
export default UpsertJobCategories ;