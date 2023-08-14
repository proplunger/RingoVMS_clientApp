import { IDropDownModel } from "../../../../Shared/Models/IDropDownModel";

export interface IReqReleaseVm {
    isReleased?: boolean;
    index: number;
    reqReleaseId: string;
    clientId?: string;
    reqId?: string;
    releaseDate?: Date;
    statusId?: string;
    status?: string;
    distType: IDropDownModel;
    inEdit?: boolean;
    allVendorList?: any;
    reqReleaseVendorMap?: Array<any>;
    releaseVendorMappings?: Array<any>;
    selectedReleaseVendorMapping?: Array<any>;
    PlatinumExpanded?: boolean;
    GoldExpanded?: boolean;
    SilverExpanded?: boolean;
    UtilityExpanded?: boolean;
    isDefault?: boolean;
    noOfDays?: number;
}

export interface IVendorListVm {
    id: string;
    name: string;
    tier: string;
    label: string;
    tagClassName: string;
    releaseId: string;
    releaseVendorMappingId: string;
    // releaseId?: string;
    // name?: string;
    // vendorIds?: VendorDropdownItem[];
    // selected?: boolean;
    // inEdit?: boolean;
    // status:string;
    // realeseDate?:Date;
    // distribution:{
    //     timingCatalogId:string;
    //     name:string;
    // }
}
export interface VendorDropdownModel {
    id: string;
    rankingType: string;
    label: string;
    className: string;
    tagClassName: string;
    releaseId?: string;
    releaseVendorMappingId?: string;
    children: VendorDropdownItem[];
}

export interface VendorDropdownItem {
    label: string;
    tagClassName: string;
    rankingType: string;
    id: string;
    checked?: boolean;
    releaseId?: string;
    releaseVendorMappingId?: string;
}
