import * as React from "react";
import axios from "axios";
import { history, successToastr } from "../../../../HelperMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { ErrorComponent, hideLoader, showLoader } from "../../../ReusableComponents";
import { DocStatus, DocType } from "../../../Shared/AppConstants";
import { Dialog } from "@progress/kendo-react-dialogs";
import { GENERATING_CONFIRMATION_LETTER_MSG, LETTER_SIGNED_SUCCESSFULLY, PREPARING_CONFIRMATION_LETTER_MSG, SUBMIT_TO_VENDOR_SUCCESS_MSG } from "../../../Shared/AppMessages";
import { DocumentsVm } from "../../../Shared/DocumentsPortfolio/IDocumentsPortfolioGridState";

export interface ConfirmationLetterProps {
    vendor?: any;
    eventName?: any;
    actionId?: any;
    candSubmissionId?: any;
    candidateId?: any;
    reqId?: any;
    updateCandWf?: any;
    reqNumber?: any;
    close?: any;
    jobDetailPage?: any;
    createDocPortfolio?: any;
    handleDocStatus?: any;
    redirectTo?: any;
    getDocPortfolio?: any;
    isRedirectTo?: any;
}

export interface ConfirmationLetterState {
    Agree?: boolean;
    userId: string;
    showLoader?: boolean;
    allowVendorToSubmit: boolean;
    clientSignature: string;
    vendorSignature: string;
    vendorSignatureNotValid: boolean;
    clientSignatureNotValid: boolean;
    documentName?: string;
    candDocumentId?: string;
    newlink?: any;
    showConfirmationLetterModal: boolean;
    nextStateId?: string;
    actionId?: string;
    eventName?: string;
}

export class ConfirmationLetter extends React.Component<ConfirmationLetterProps, ConfirmationLetterState> {
    private userObj: any = JSON.parse(localStorage.getItem("user"));
    constructor(props) {
        super(props);
        this.state = {
            userId: this.userObj.userId,
            showLoader: true,
            allowVendorToSubmit: false,
            clientSignature: "",
            vendorSignature: "",
            clientSignatureNotValid: false,
            vendorSignatureNotValid: false,
            showConfirmationLetterModal: false
        };
    }

    // handleShowModal = () => {
    //     if(this.props.wfStatus=="Offer Submitted"){
    //         this.getDocumentPortfolio();
    //         this.setState({ offerSubmittedStatus: true });
    //     }else{
    //         this.getConfirmationLetter("");
    //     }
    // }

    getConfirmationLetter = (clientName?) => {
        this.setState({showLoader: true});
        successToastr(GENERATING_CONFIRMATION_LETTER_MSG);

        showLoader();
    
        axios.get(`api/candidates/confirm/letter/${this.props.candSubmissionId}?client=${clientName}`).then((res: any) => {
            const linkSource = `data:application/pdf;base64,${res.data}`;
            hideLoader();
            this.setState({ newlink: linkSource, showConfirmationLetterModal: true, showLoader: false });
          
        });
      }
    
    getDocumentPortfolio = (candDocumentsId?) => {
        this.setState({ candDocumentId: candDocumentsId });
        var submission = this.props.candSubmissionId;
        var queryParams = '';
        if(submission !="" && submission !=null && submission !=undefined){
            queryParams ="?candSubmissionId=" + this.props.candSubmissionId
        }
        axios.get(`/api/candidates/${this.props.candidateId}/documents`+ queryParams).then((res: any) => {
            if (res) {
                res.data.forEach((doc: DocumentsVm) => {
                    doc.description = doc.description && JSON.parse(doc.description);
                });

                var data;
                if (candDocumentsId){
                    data = res.data.filter(x => x.candDocumentsId==candDocumentsId && x.description !=null )
                }else{
                    data = res.data.filter(x => x.status==DocStatus.CLIENTSIGNED && x.description !=null && x.docType==DocType.CONFIRMATIONLETTER);
                }

                if (data.length){
                    this.setState({
                        clientSignature: data[0].description.ApprovedByClientUser,
                        candDocumentId: data[0].candDocumentsId,
                        documentName: data[0].documentName,
                        allowVendorToSubmit: true
                    }, () => this.getConfirmationLetter(data[0].description.ApprovedByClientUser))
                }else{
                    this.getConfirmationLetter("")
                }
                
            }
        });
      }

    handleChange(e, modelProp) {
        var stateObj = {};
        stateObj[modelProp] = e.target.type=="checkbox" ? e.target.checked : e.target.value;
        this.setState(stateObj);
    }

    signatureValid = () => {
        if (this.state.allowVendorToSubmit &&
            this.state.vendorSignature.trim().toLowerCase() != this.userObj.userFullName.trim().toLowerCase()){
          this.setState({ vendorSignatureNotValid: true });
          return false;
        }else if (!this.state.allowVendorToSubmit &&
            this.state.clientSignature.trim().toLowerCase() != this.userObj.userFullName.trim().toLowerCase()){
          this.setState({ clientSignatureNotValid: true });
          return false;
        }
    
        this.setState({ clientSignatureNotValid: false, vendorSignatureNotValid: false });
        return true;
      }

    candidateStatusWithConfirmLetter = () => {
        if (this.signatureValid()){
          this.setState({ showLoader: true });
          successToastr(PREPARING_CONFIRMATION_LETTER_MSG);
    
          const data = {
            candSubmissionId: this.props.candSubmissionId,
            CandDocumentId: this.state.candDocumentId,
            nextStateId: this.state.nextStateId,
            eventName: this.state.eventName,
            actionId: this.state.actionId,
            clientSignature: this.state.clientSignature,
            client: this.userObj.client,
            jobDetailPage: this.props.jobDetailPage,
            updateCandWf: this.props.updateCandWf,
            createDocPortfolio: this.props.createDocPortfolio
          };
    
          if(this.state.allowVendorToSubmit){
            data["vendorSignature"] = this.state.vendorSignature
            data["candDocumentId"] = this.state.candDocumentId
            data["documentName"] = this.state.documentName
          }
    
          axios.post("api/candidates/status/confirmation", JSON.stringify(data)).then((res) => {
            if (this.props.reqId){
                successToastr(SUBMIT_TO_VENDOR_SUCCESS_MSG);
                this.props.getDocPortfolio(this.props.candSubmissionId);
                history.goBack()
            }else{

                successToastr(LETTER_SIGNED_SUCCESSFULLY);
                if(this.props.redirectTo){
                    history.push(this.props.redirectTo);
                }
            }
            this.setState({ showLoader: false });

            if (this.props.close){
                this.props.close();
            }
            if (this.props.handleDocStatus){
                this.props.handleDocStatus();
            }
          });
          // close the modal
          this.setState({ showConfirmationLetterModal: false });
        }
      };

      handleSignatureChange = (value, label) => {
        var change = {};
        change[label] = value;
        this.setState(change);
      }

    //   handleChangeData = (clientSignature, candDocumentId, documentName) => {
    //       this.setState({ 
    //         clientSignature: clientSignature,
    //         candDocumentId: candDocumentId,
    //         documentName: documentName
    //     })
    //   }
    handleSetAction = (eventName, actionId, statusId) => {
        this.setState({nextStateId: statusId, eventName: eventName, actionId: actionId});
    }

    render() {
        return (
            <div id="impersonate-popup">
                {this.state.showConfirmationLetterModal && (
                    <Dialog>
                        <div className="d-print-none modal-header rounded-0 bg-blue d-flex justify-content-start align-items-center pt-2 pb-2">
                            <h4 className="modal-title text-white fontFifteen">
                                Confirmation
                            </h4>
                        </div>
                        <div className="row mx-0 pr-4 pl-4" id="tnc">
                            <object data={this.state.newlink + "#toolbar=0"}
                                    width="100%" 
                                    height="400"> 
                            </object>
                        </div>
                        <div className="row mt-2 mx-0 d-print-none">
                            
                            <div className="col-12 mt-1">
                                <label className="container-R d-flex mb-0 pb-3">
                                    <span className="Introduction-line-height ml-1">I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief and I undertake the
                                    responsibility to inform you of any changes therein, immediately.</span>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => this.handleChange(e, "Agree")}
                                    />
                                    <span className="checkmark-R checkPosition checkPositionTop" style={{ left: "0px" }}></span>
                                </label>
                            </div>

                        </div>
                        <div className="row ml-0 mr-0 mb-2 mb-lg-0">
                            <form className="col-12">
                                <div className="form-row">
                                    <div className="col">
                                        <label className="font-weight-bold">
                                            Client Signature
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Client Signature"
                                            name="clientSignature"
                                            value={this.state.clientSignature}
                                            disabled={this.state.allowVendorToSubmit ? true: false}
                                            onChange={(e) => this.handleSignatureChange(e.target.value, "clientSignature")}
                                        ></input>
                                        {this.state.clientSignatureNotValid && <ErrorComponent message="Signature does not match the user profile"/>}

                                    </div>
                                    <div className="col">
                                        <label className="font-weight-bold">
                                            Client
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            // placeholder="Enter Candidate Name"
                                            name="name"
                                            value={this.userObj.client}
                                            disabled={true}
                                        ></input>
                                    </div>
                                </div>
                                
                                {this.state.allowVendorToSubmit &&
                                    <div className="form-row mt-2">
                                        <div className="col">
                                            <label className="font-weight-bold">
                                                Vendor Signature
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Vendor Signature"
                                                name="vendorSignature"
                                                value={this.state.vendorSignature}
                                                onChange={(e) => this.handleSignatureChange(e.target.value, 'vendorSignature')}
                                            ></input>
                                        {this.state.vendorSignatureNotValid && <ErrorComponent message="Signature does not match the user profile"/>}
                                        </div>
                                        <div className="col">
                                            <label className="font-weight-bold">
                                                Vendor
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                // placeholder="Enter Candidate Name"
                                                name="name"
                                                value={this.props.vendor}
                                                disabled={true}
                                            ></input>
                                        </div>
                                    </div>
                                }
                            </form>
                        </div>
                        <div className="row mx-0 w-100 d-print-none">
                            <div className="col-12">
                                <div className="modal-footer justify-content-center border-0">
                                    <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                        <button type="button" className="btn button button-close mr-2 shadow mb-0 mb-xl-0" onClick={() => this.props.isRedirectTo==true ? history.push(this.props.redirectTo) : this.setState({showConfirmationLetterModal: false })}>
                                            <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                            </button>
                                        <button type="button" className="btn button button-bg mr-2 shadow mb-0 mb-xl-0" onClick={() => this.candidateStatusWithConfirmLetter()} disabled={this.state.Agree ? false : true}>
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

export default ConfirmationLetter;