import React, { useRef } from "react";
import axios from "axios";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import withValueField from "../../Shared/withValueField";
import { IDropDownModel } from "../../Shared/Models/IDropDownModel";
import { successToastr } from "../../../HelperMethods";

const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select Role Name", id: null };

export interface RoleSubmissionFormProps {
  match: any;
}

export interface RoleSubmissionFormState {
  roles: Array<IDropDownModel>;
  rolePermissions: any;
  permissions: any;
  initialPermissions: any;
  Id: string;
  name: string;
  methodName: string;
  httpVerb: string; 
  data?: any;
}

export class ManagePermissions extends React.Component<
  RoleSubmissionFormProps,
  RoleSubmissionFormState
> {
  constructor(props) {
    super(props);

    this.state = {
      roles: [],
      rolePermissions: [],
      permissions: [],
      initialPermissions: [],
      Id: "",
      name: "",
      methodName: "",
      httpVerb: ""
    }
    this.getPermission = this.getPermission.bind(this);
  }

  componentDidMount() {
    this.getRoles();
  }

  getRoles() {
    axios.get(`api/tags/roles`).then((result) => {
        this.setState({ roles: result.data });
      });
  }

  getPermission() {
    axios.get(`api/tags/permissions`)
        .then(async res => {
          //console.log("++++++++++++++", res);
            this.setState({ permissions: res.data, initialPermissions: res.data});
        });
  }

  getPermissions(id) {
    axios.get(`api/tags/role/${id}/permissions`).then((result) => {
        this.setState({ rolePermissions: result.data }, () => this.checkedPermissions(result.data));
      });
  }

  handleRoleChange = (e) => {
    const Id = e.target.value;
    this.setState({ Id: Id });
    if (Id !=null)
     {
      this.setState(prevState => ({
        permissions: prevState.permissions.map(
        obj =>  Object.assign(obj, { isChecked: false })
      )
    }), () => this.getPermissions(Id)) 
       //this.getPermissions(Id);
       //setTimeout(() => this.getPermissions(Id), 500)
       //this.setState({permissions: this.state.initialPermissions}, () => this.getPermissions(Id))
     }
  };

  checkedPermissions = (e) => {
    const {permissions} = this.state
     permissions.map((x, index) => { 
      var result = e.filter( (a1, index) => a1.name ==x.name);
        //console.log(result, "result data");
      if(result.length > 0) {
        //console.log("i was called")
        this.setState(prevState => ({
          permissions: this.state.permissions.map(
          obj => (obj.name ==result[0].name ? Object.assign(obj, { isChecked: true }) : obj)
        )
      }))
       }
      return x })
   
  }

  handleChange(e){
    this.setState(prevState => ({
      permissions: prevState.permissions.map(
      obj => (obj.name ==e ? Object.assign(obj, { isChecked: !obj.isChecked }) : obj)
    )
  }))
   }

  renderPermissions =() =>
  {
    let a;
    return(
       <div>
          <div>
             Permissions. 
          </div>
             <table className="table table-striped">
                 <thead>
                      <tr>
                         <th scope="col">Name</th>
                         <th scope="col">Action</th>
                         <th scope="col">Http Verb</th>
                         <th scope="col">Checkbox</th>
                     </tr>
                 </thead>
                 <tbody>
                   {
                     this.state.permissions.map((permission) => 
                       <tr>
                    
                           <td>{permission.name}</td>
                           <td>{permission.methodName}</td>
                           <td>{permission.httpVerb}</td>
                           <td><div><input onChange = {() =>
                          this.handleChange(permission.name)} 
                          type = "checkbox" checked={permission.isChecked} /></div></td>
                        </tr>
                      )
                    }
                 </tbody>
             </table>
       </div>
          )
  }

  saveChanges = () => {
    const {Id} = this.state;
    let data = this.state.permissions.filter((i) => i.isChecked ==true)
    let permissions = {permissions:data}
    //console.log("_________________", this.state.permissions,data)
    axios.post(`api/tags/role/${Id}/permissions`, JSON.stringify(permissions)).then((res) => {
      if (res.data) {
          successToastr("permissions saved successfully");
      }
  });  
} 

  render() {
  //  console.log("hello world", this.state);

    const candTriggerName = (
      <span>
        Role Information
        <span
          className="d-none d-sm-block"
          style={{ float: "right", marginRight: "20px" }}
        >
        </span>
      </span>
    );
    
    return (
      <React.Fragment>
        <div className="col-11 mx-auto pl-0 pr-0 mt-3" id="remove_row">
         <div className="col-12 p-0 shadow pt-1 pb-1">
            
          <div className="col-12">
              
                  <div className="row mb-4 align-items-center">
                    <div className="col-6 col-sm-4 col-lg-4 mt-sm-0  mt-1">
                      
                      <label className="mb-1 font-weight-bold required as">
                        Role Name
                      </label>
                      <CustomDropDownList
                        className="form-control disabled "
                        name={`Id`}
                        data={this.state.roles}
                        textField="name"
                        valueField="id"
                        id="roles"
                        value={this.state.Id}
                        defaultItem={defaultItem}
                        onChange={this.handleRoleChange}
                      />
                    </div>
                  </div>
           <div>
              {this.renderPermissions()}
           </div>
           <button
           onClick = {this.saveChanges}>Save Changes</button> 
          </div>
         </div>
        </div>
      </React.Fragment>
    );
  }

  public async componentWillMount() {
    this.getPermission();
  }
}

export default ManagePermissions;