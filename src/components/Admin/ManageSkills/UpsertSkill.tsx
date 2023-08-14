import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import withValueField from "../../Shared/withValueField";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import * as React from "react";
import axios from "axios";
import { successToastr } from "../../../HelperMethods";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select here...", id: null };

export interface UpsertSkillProps {
    props: any;
    //inEdit: boolean;
    onCloseModal: any;
}

export interface UpsertSkillState {
    name?: string;
    jobType?: string;
    positionId?: string;
    SkillId?: string;
    description?: string;
    jobTypes: Array<IDropDownModel>;
}

class UpsertSkill extends React.Component<UpsertSkillProps, UpsertSkillState> {
    constructor(props: UpsertSkillProps) {
        super(props);
        this.state = {
            jobTypes: [],
        };
    }

componentDidMount() {
        this.getJobType();
        //if(this.props.inEdit)
        if(this.props.props){
        this.setState({description: this.props.props.description, name:this.props.props.name, jobType:this.props.props.jobType, positionId: this.props.props.positionId, SkillId: this.props.props.skillId})
}}

getJobType = () =>{
    axios.get(`api/admin/globaljobcatalogs`)
    .then(async res => {
        this.setState({ jobTypes: res.data});
    });
}

handleJobTypeChange= (e) => {
    const Id = e.target.value;
    this.setState({ positionId: Id });
    //console.log("))",Id)
}

handleSave = () =>{
    const {positionId} = this.state;
    let data = {
    skillName: this.state.name,
    skilldescription: this.state.description,
    };
    //console.log("))",Id,"&&&&&&" , data)

  axios.post(`api/admin/jobpositions/${this.state.positionId}/skills`, JSON.stringify(data)).then((res) => {
     successToastr("Skiil(s) post successfully");
     this.props.onCloseModal();
  });  
}

handleUpdate = () =>{
    const {positionId} = this.state;
    const {SkillId} = this.state;
    let data = {
    positionId: positionId,
    skillName: this.state.name,
    skillDescription: this.state.description,
    };

     //console.log("&&&&&&" , data)

  axios.put(`api/admin/skill/${this.state.SkillId}`, JSON.stringify(data)).then((res) => {
     successToastr("Skiil(s) update successfully");
     this.props.onCloseModal();
  });  
}

render() {
    //const { props } = this.props;
    console.log("this.pops", this.props.props, this.state,"^^^^^6");
    return (
        <div className="row mt-0 ml-0 mr-0 mt-lg-0 align-items-center mb-0 d-flex justify-content-end holdposition-width">
            <div className="modal-content border-0">
                <div className="modal-header rounded-0 bg-blue d-flex justify-content-center align-items-center pt-2 pb-2">
                    <h4 className="modal-title text-white fontFifteen">
                        {this.props.props != undefined ? "Edit Skiils" : "Add Skills" } 
                    </h4>
                    <button type="button" className="close text-white close_opacity" data-dismiss="modal" onClick={this.props.onCloseModal}>
                        &times;
                    </button>
                </div>

               
                <div className="row mt-3 ml-0 mr-0">
                        <div className="col-sm-4">
                            <label className="mb-1 font-weight-bold">Position | Job Type</label>
                            <CustomDropDownList
                            className="form-control"
                            data={this.state.jobTypes}
                            textField="name"
                            valueField="id"
                            id="jobTypes"
                            name="position|jobType"
                            value={this.state.positionId}
                            defaultItem={defaultItem}
                            onChange={this.handleJobTypeChange}
                        />
                        </div>
                        <div className="col-sm-4">
                            <label className="mb-1 font-weight-bold">Skill Name</label>
                            <input
                                type="text"
                                className="form-control "
                                value={this.state.name}
                                onChange={(event) => {
                                    this.setState({ name: event.target.value });
                                }}
                            />
                        </div>
                        <div className="col-sm-4">
                        <label className="mb-0 font-weight-bold">Skill Description</label>
                        <textarea
                            rows={2}
                            id=""
                            value={this.state.description}
                            className="form-control mt-1"
                            placeholder="Enter here..."
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
                            ?<button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleUpdate}> 
                                <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Update Skill
                            </button>
                            :<button type="button" className="btn button button-bg mr-2 shadow mb-2 mb-xl-0" onClick={this.handleSave}> 
                                <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default UpsertSkill ;