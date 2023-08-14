import { includes } from "lodash";
import React from "react";
import {
  allowedFileExtentions,
  allowedMymeTypes
} from "../AppConstants";
import { DocumentsVm } from "../DocumentsPortfolio/IDocumentsPortfolioGridState";

export function UploadDocument(event, dataItem) {

  let fileData = [];
  event.preventDefault();
  if (event.target.files.length > 0) {
    Array.from(event.target.files).forEach((file: any) => {
      let isfileValid = false;
      if (includes(allowedMymeTypes, file.type)) {
        isfileValid = true;
      } else if (file.type=="") {
        if (includes(allowedFileExtentions, file.name.split(".")[1])) {
          isfileValid = true;
        }
      }
      const newDataItem = {
        documentName: file.name.split(".")[0],
        fileName: file.name,
        taskFile: file,
        isFileValid: isfileValid,
        isUploading: false,
      };
      fileData.push(newDataItem);
    });
    return fileData
  }
}