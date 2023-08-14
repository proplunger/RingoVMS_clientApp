import { IDropDownModel } from "../Models/IDropDownModel";

export interface IDocumentsPortfolioGridState{
    entityId?:string;
    entityTYpeId?:string;
    documentTypes?: Array<IDropDownModel>;
    data?:Array<DocumentsVm>;
    showModal?:boolean;
    itemToDelete?:any;
    isAdminRole?: boolean;
    isClientRole?: boolean;
    isVendorRole?: boolean;
    showInactivateModal?: boolean;
    showAuditLogModal?: boolean;
}

export interface DocumentsVm{
    candDocumentsId?:string;
    documentName?:string;
    fileName?:string;
    filePath?:string;
    selctedDocumenyTypeId?: string;
    selected?: boolean;
    uploadedDate?:Date;
    inEdit?:boolean;
    isDefault?:boolean;
    candidateFile?:any;
    fileCount?:number;
    isFileValid?:boolean;
    isUploading?:boolean;
    docTypeId?:string;
    description?: string;
    docType?: string
    status?: string
}