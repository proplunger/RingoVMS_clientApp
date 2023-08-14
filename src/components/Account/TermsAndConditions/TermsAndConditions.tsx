import * as React from "react";
import auth from "../../Auth";
import axios from "axios";
import { history } from "../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { ErrorComponent } from "../../ReusableComponents";
import { filterBy } from "@progress/kendo-data-query";
import Axios from "axios";
import { AuthRole } from "../../Shared/AppConstants";
import { Dialog } from "@progress/kendo-react-dialogs";
import { text } from "@fortawesome/fontawesome-svg-core";
import { APP_HOME_URL } from "../../Shared/ApiUrls";

export interface TermsAndConditionsProps {

}

export interface TermsAndConditionsState {
    tnc?: any;
    Agree?: boolean;
    tncId: string;
    userId: string;
    showTnCModal?: boolean;
    showLoader?: boolean;
}

export class TermsAndConditions extends React.Component<TermsAndConditionsProps, TermsAndConditionsState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    constructor(props) {
        super(props);
        this.state = {
            tncId: "",
            userId: this.userObj.userId,
            showTnCModal: true,
            showLoader: true,
        };
    }

    componentDidMount() {
        // this.setState({ showTnCModal: true });
         this.getTnC();
    }

    getTnC() {
        axios.get(`api/accounts/tnc`)
            .then(res => {
                this.setState({
                    tnc: res.data,
                    tncId: res.data.id,
                    showLoader: false
                });
                document.getElementById('tnc').innerHTML = res.data.terms
            });
    }

    handleChange(e, modelProp) {
        var stateObj = {};
        stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
        this.setState(stateObj);

        // let change = {};
        // change[e.target.name] = e.target.checked;
        // this.setState(change);
    }

    handleSave = () => {
        let data = {
            userId: this.state.userId,
            tncId: this.state.tncId,
            isTncAccepted: true
        };
        axios.put(`api/accounts/tnc`, JSON.stringify(data)).then((res) => {
            this.userObj.isTnCAccepted = true;
            localStorage.setItem("user", JSON.stringify(this.userObj));
            history.push('/');
        });
    }

    printDiv = () => {
        // var divContent = document.getElementById("tnc").innerHTML;
        // var a = window.open('', '', 'height=800, width=800');
        // a.document.write(divContent);
        // a.document.close();
        // //a.print();
        window.print();
        

    //     var originalContents = document.body.innerHTML;

    //  document.body.innerHTML = divContent;

    //  window.print();

    //  document.body.innerHTML = originalContents;
    }
//     printDiv(tnc){
//         var printContents = document.getElementById(tnc).innerHTML;
//         var originalContents = document.body.innerHTML;
//         document.body.innerHTML = printContents;
//         window.print();
//         document.body.innerHTML = originalContents;
// }
    render() {
        return (
            <div id="impersonate-popup">
                {this.state.showTnCModal && (
                    <Dialog>
                        <div className="d-print-none modal-header rounded-0 bg-blue d-flex justify-content-start align-items-center pt-2 pb-2">
                            <h4 className="modal-title text-white fontFifteen">
                                Terms and Conditions of Use - {this.userObj.userFullName}
                            </h4>
                        </div>
                        <div className="row mx-0 Introduction-firstHeader" id="tnc"> </div>
                        <div className="row mt-2 mx-0 d-print-none">
                            <div className="col-12 ">
                                {/* <p>Click <span onClick={window.print} className="Introduction-printClick">Here</span> For A Printable Version Of These Terms Of Use</p> */}
                                <p>Click <span onClick={this.printDiv} className="Introduction-printClick">Here</span> For A Printable Version Of These Terms Of Use</p>
                            </div>
                            <div className="col-12  mt-1">
                                <label className="container-R d-flex mb-0 pb-3">
                                    <span className="Introduction-line-height ml-1">I AGREE TO THE TERMS OF USE.</span>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => this.handleChange(e, "Agree")}
                                    />
                                    <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                </label>
                            </div>


                        </div>
                        <div className="row mx-0 w-100 d-print-none">
                            <div className="col-12">
                                <div className="modal-footer justify-content-center border-0">
                                    <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                        <button type="button" className="btn button button-close mr-2 shadow mb-0 mb-xl-0" onClick={() => auth.logout(() => { localStorage.clear(); history.push(APP_HOME_URL); })}>
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                            </button>
                                        <button type="button" className="btn button button-bg mr-2 shadow mb-0 mb-xl-0" onClick={this.handleSave} disabled={this.state.Agree ? false : true}>
                                            <FontAwesomeIcon icon={faCheckCircle} className={"mr-1"} /> Accept
                                            </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                )}
            </div>
        );
    }
}

export default TermsAndConditions;