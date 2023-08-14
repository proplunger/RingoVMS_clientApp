import * as XLSX from 'xlsx';
import React from 'react';
import { Dialog } from '@progress/kendo-react-dialogs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

interface SheetData {
  [key: string]: any;
}

interface Props {
    base64Data: string;

}

interface State {
  sheetData: SheetData[];
  showDocument?: any; 
}

class ExcelViewer extends React.Component<Props, State> {
  state: State = {
    sheetData: [],
    showDocument:true
  };

  componentDidMount() {
      if(this.props.base64Data){
        this.parseExcelFile(this.props.base64Data);
      }
  }

  parseExcelFile(base64Data: string) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const workbook = XLSX.read(byteArray, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    this.setState({ sheetData });
  }

  
  handleDocShow =()=>{
    this.setState({
      showDocument:false
    })
  }
  disableRightClickAndCopying = (e) => {
    e.preventDefault();
  }

  render() {
    return (
       <div id="impersonate-popup" 
       onContextMenu={this.disableRightClickAndCopying}
       onCopy={this.disableRightClickAndCopying} 
       >
       {/* {showDocument && ( */}
       {this.state.showDocument && (
         <Dialog>
           <div className="d-print-none modal-header rounded-0 bg-blue d-flex justify-content-start align-items-center pt-2 pb-2">
             <h4 className="modal-title text-white fontFifteen">
               Document Preview
             </h4>
           </div>

           <div style={{ display: "flex", justifyContent: "center" }}>
        <table style={{ margin: "auto" }}>
          <tbody>
            {this.state.sheetData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={{ padding: "8px" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

           <div className="row mx-0 w-100 d-print-none">
             <div className="col-12">
               <div className="modal-footer justify-content-center border-0">
                 <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                   <button type="button" className="btn button button-close mr-2 shadow mb-0 mb-xl-0"
                   onClick={() => this.handleDocShow()}
                   >
                     <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
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

export default ExcelViewer;
