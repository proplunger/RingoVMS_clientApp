import { IPositionDetails } from "./IPositionDetails";

export interface ICreateRequisitionState {
    reqId: string;
    reqNumber: string;
    clientId: string;
    clientDivisionId: string;
    divisionLocationId: string;
    divLocId: string;
    purchaseOrder: string;
    clientContactNum: string;
    divisionContactId: string;
    reasonId: string;
    customerLocation: string;
    justification: string;
    reqPosition?: IPositionDetails;
    reqApproverDetails?: any;
    timesheetApproverDetails?: any;
    status?: string;
    toggleAll: boolean;
    showLoader?: boolean;
    isDirty?: boolean;
    toggelFirst: boolean,
    toggleFourth: boolean,
    toggleThird: boolean,
    toggleSecond: boolean,
    submitted: boolean;
    errorValidate: boolean;
    locationKey ?:any;
    allowEdit?: boolean;
    isApproversUpdated?: boolean;
    isEnableDepartment?: boolean;
    additionalDetails?: string;
    departmentId?: string;
}

export interface ICreateRequisitionProps {
    match: any;
        location?: any;

}

