import { faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import DocumentsPortfolioGrid from "./DocumentsPortfolioGrid";
import '../DocumentsPortfolio/DocumentsPortfolio.css'


export interface IDocumentsPortfolioProps{
    entityId?:string;
    entityTypeId?:string;
    candidateId?:string;
    isStyleChange?: boolean;
    candSubmissionId?:string;
    vendor?:string;
    reqNumber?:string;
    candWfStatus?:string;
    jobDetailPage?: any;
    handleDocStatus?: any;
}
export interface IDocumentsPortfolioState{
    show?:boolean;

}
class DocumentsPortfolio extends React.Component<IDocumentsPortfolioProps, IDocumentsPortfolioState> {
    constructor(props: IDocumentsPortfolioProps) {
        super(props);
        this.state = {
            show:false
        };
        
    }
    close=()=>{
        this.setState({show:false})
    }
    show=()=>{
        this.setState({show:true})
    }
    render() {
        return (
            <div className={this.props.isStyleChange ? "col-12 col-sm-auto pr-0 ViewController timesheet-doc-header" : "col-12 col-sm-auto pr-0 ViewController"}>
            <div className={this.props.isStyleChange ? "col-auto pr-0 timesheet-doc-portfolio" : "col-auto pr-0 doc-portfolio float-right"} onClick={this.show}>
                <span className="k-icon k-i-file-txt shadow"></span><div>Document Portfolio</div>
            </div>
            {this.state.show && (
                <div className="containerDialog">
                <div className="containerDialog-animation">
                    <div className="col-10 col-md-10 shadow containerDialoginside">
                        <div className="row blue-accordion">
                            <div className="col-12  pt-2 pb-2 fontFifteen text-left ">
                                Document Portfolio
                                <span className="float-right" onClick={this.close}>
                                    <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                    {/* <i className="far fa-arrow-right mr-2 "></i> */}
                                </span>
                            </div>
                        </div>
                        <DocumentsPortfolioGrid candidateId={this.props.candidateId} candSubmissionId={this.props.candSubmissionId} vendor={this.props.vendor} reqNumber={this.props.reqNumber} candWfStatus={this.props.candWfStatus} close={this.close} jobDetailPage={this.props.jobDetailPage} handleDocStatus={this.props.handleDocStatus}></DocumentsPortfolioGrid>
                        <div className="btn-bottom pt-2 pb-2 pt-lg-4 pb-lg-4 mt-1 mb-1 mt-lg-0 mb-lg-0">
                            <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={this.close}>
                                <FontAwesomeIcon icon={faTimesCircle} className={"mr-2"} />
                                Close
                            </button>
                        </div>
                    </div>
                    
                </div>
                </div>
                
            )}
            </div>
        );
    }

    
}

export default DocumentsPortfolio;
