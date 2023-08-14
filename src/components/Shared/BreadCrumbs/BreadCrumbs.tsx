import * as React from "react";
import { Breadcrumb } from '@progress/kendo-react-layout';
import { Link } from "react-router-dom";
import { GlobalData } from "../../Shared/AppConstants"
import {addPageId,getPageId} from "../BreadCrumbs/GlobalId"

interface DataModel {
    id: string;
    text?: string;
    icon?: React.ReactNode;
    iconClass?: string;
    disabled?: boolean;
    pageUrl?: string;
}

export interface GlobalDataModel {
    clientId?: string;
    zoneid?: string;
    regionId?: string;
    divisionId?: string;
    locationId?: string;
    positionId?: string;
    clientInvoiceId?: any;
    requisitionId?:any;
    candSubmissionId?:any;
    candidateId?:any;
    timesheetId?:any;
    vendorId?: string;
    rateCardProfileGroupId?:string;
    userId?:string;
    candShareRequestId?:string;
    vendorClientTierProfileGroupId?:string;
    relConfigGroupId?:string;
    taskProfileGroupId?:string;
    wfApprovalGroupId?:string;
    clientIntvwCritGroupId?:string;
    vendorInvoiceId?:string;
    notificationId?: string;
    actionReasonId?: string;
    rolePermissionsId?: string;
    messageId?: string;
    streamId?: string;
    ticketId?: string;
    candSubInterviewId?: string;
    eventId?: string;
    tsWeekId? : string;
    contentId?: string;
    candSubExtId?:any;
}

const initialData = [{
    id: 'Home',
    text: 'Home',
    icon: <i className="fas fa-home" />,
    pageUrl: "/",
    disabled: false
}];

export interface BreadCrumbsProps {
    globalData?: GlobalDataModel;
}

export interface BreadCrumbsState {
    breadCrumbData: DataModel[]
}
class BreadCrumbs extends React.Component<BreadCrumbsProps, BreadCrumbsState> {
    public clientId = localStorage.UserClientId
    constructor(props) {
        super(props);
        this.state = {
            breadCrumbData: initialData,
        }
    };

    componentDidMount() {
        this.findPage()
        
    }

    componentDidUpdate(prevProps) {
        if (this.props != prevProps) {
            this.findPage()
        }
    }

    findPage = () => {
        const { breadcrumbs } = JSON.parse(localStorage.getItem("user"));
        const parentMenuNames = this.getParentMenuNames(window.location.pathname, breadcrumbs);
        this.setState({
            breadCrumbData: [...initialData, ...parentMenuNames]
        })
    }

    getParentMenuNames(pageUrl, obj) {
        for (const menu of obj) {
            const replacedPageUrl = menu.pageUrl ? this.replaceId(menu.pageUrl) : null
            if (menu.pageUrl && replacedPageUrl ==pageUrl) {
                return [{ id: menu.menuId, text: menu.name, pageUrl: replacedPageUrl, disabled: this.isDisabled(replacedPageUrl) }]
            }
            if (menu.childMenus) {
                const result = this.getParentMenuNames(pageUrl, menu.childMenus);
                if (result.length > 0) {
                    return [{ id: menu.menuId, text: menu.name, pageUrl: menu.pageUrl ? replacedPageUrl : null, disabled: this.isDisabled(replacedPageUrl) }, ...result];
                }
            }
        }
        return [];
    }
    

    isDisabled = (pageUrl) => {
        return pageUrl ==null || pageUrl ==undefined || pageUrl =="" ? true : false
    }

    replaceId = (text) => {
        let clientId = this.props && this.props.globalData && this.props.globalData.clientId && this.props.globalData.clientId;
        let divisionId = this.props && this.props.globalData && this.props.globalData.divisionId && this.props.globalData.divisionId;
        let zoneId = this.props && this.props.globalData && this.props.globalData.zoneid && this.props.globalData.zoneid;
        let regionId = this.props && this.props.globalData && this.props.globalData.regionId && this.props.globalData.regionId;
        let positionId = this.props && this.props.globalData && this.props.globalData.positionId && this.props.globalData.positionId;
        let locationId = this.props && this.props.globalData && this.props.globalData.locationId && this.props.globalData.locationId;
        let clientInvoiceId = this.props && this.props.globalData && this.props.globalData.clientInvoiceId && this.props.globalData.clientInvoiceId;
        let requisitionId = this.props && this.props.globalData && this.props.globalData.requisitionId && this.props.globalData.requisitionId;
        let candSubmissionId = this.props && this.props.globalData && this.props.globalData.candSubmissionId && this.props.globalData.candSubmissionId;
        let candidateId = this.props && this.props.globalData && this.props.globalData.candidateId && this.props.globalData.candidateId;
        let timesheetId = this.props && this.props.globalData && this.props.globalData.timesheetId && this.props.globalData.timesheetId;
        let vendorId = this.props && this.props.globalData && this.props.globalData.vendorId && this.props.globalData.vendorId;
        let rateCardProfileGroupId = this.props && this.props.globalData && this.props.globalData.rateCardProfileGroupId && this.props.globalData.rateCardProfileGroupId;
        let userId = this.props && this.props.globalData && this.props.globalData.userId && this.props.globalData.userId;
        let candShareRequestId = this.props && this.props.globalData && this.props.globalData.candShareRequestId && this.props.globalData.candShareRequestId;
        let vendorClientTierProfileGroupId = this.props && this.props.globalData && this.props.globalData.vendorClientTierProfileGroupId && this.props.globalData.vendorClientTierProfileGroupId;
        let relConfigGroupId = this.props && this.props.globalData && this.props.globalData.relConfigGroupId && this.props.globalData.relConfigGroupId;
        let taskProfileGroupId = this.props && this.props.globalData && this.props.globalData.taskProfileGroupId && this.props.globalData.taskProfileGroupId;
        let wfApprovalGroupId = this.props && this.props.globalData && this.props.globalData.wfApprovalGroupId && this.props.globalData.wfApprovalGroupId;
        let clientIntvwCritGroupId = this.props && this.props.globalData && this.props.globalData.clientIntvwCritGroupId && this.props.globalData.clientIntvwCritGroupId;
        let vendorInvoiceId = this.props && this.props.globalData && this.props.globalData.vendorInvoiceId && this.props.globalData.vendorInvoiceId;
        let notificationId = this.props && this.props.globalData && this.props.globalData.notificationId && this.props.globalData.notificationId;
        let rolePermissionsId = this.props && this.props.globalData && this.props.globalData.rolePermissionsId && this.props.globalData.rolePermissionsId;
        let messageId = this.props && this.props.globalData && this.props.globalData.messageId && this.props.globalData.messageId;
        let actionReasonId = this.props && this.props.globalData && this.props.globalData.actionReasonId && this.props.globalData.actionReasonId;
        let streamId = this.props && this.props.globalData && this.props.globalData.streamId && this.props.globalData.streamId;
        let ticketId = this.props && this.props.globalData && this.props.globalData.ticketId && this.props.globalData.ticketId;
        let candSubInterviewId = this.props && this.props.globalData && this.props.globalData.candSubInterviewId && this.props.globalData.candSubInterviewId;
        let eventId = this.props && this.props.globalData && this.props.globalData.eventId && this.props.globalData.eventId;
        let tsWeekId = this.props && this.props.globalData && this.props.globalData.tsWeekId && this.props.globalData.tsWeekId;
        let contentId = this.props && this.props.globalData && this.props.globalData.contentId && this.props.globalData.contentId;
        let candSubExtId = this.props && this.props.globalData && this.props.globalData.candSubExtId && this.props.globalData.candSubExtId;
        

        addPageId('regionId', regionId);
        const id = getPageId('regionId');

        if (regionId !=undefined) {
            const idArray = [
                {
                    idName: "regionId",
                    id: regionId
                }
            ]

            localStorage.setItem('key', JSON.stringify(idArray));
        }

        return text.replace(GlobalData.CLIENTID, this.validateId(GlobalData.CLIENTID, clientId)).replace(GlobalData.DIVISIONID, this.validateId(GlobalData.DIVISIONID, divisionId))
            .replace(GlobalData.ZONEID, this.validateId(GlobalData.ZONEID, zoneId)).replace(GlobalData.REGIONID, this.validateId(GlobalData.REGIONID, regionId)).replace(GlobalData.POSITIONID, this.validateId(GlobalData.POSITIONID, positionId))
            .replace(GlobalData.LOCATIONID, this.validateId(GlobalData.LOCATIONID, locationId)).replace(GlobalData.CLIENTINVOICEID, this.validateId(GlobalData.CLIENTINVOICEID, clientInvoiceId))
            .replace(GlobalData.REQUISITIONID, this.validateId(GlobalData.REQUISITIONID, requisitionId)).replace(GlobalData.CANDSUBMISSIONID, this.validateId(GlobalData.CANDSUBMISSIONID, candSubmissionId))
            .replace(GlobalData.CANDIDATEID, this.validateId(GlobalData.CANDIDATEID, candidateId)).replace(GlobalData.TIMESHEETID, this.validateId(GlobalData.TIMESHEETID, timesheetId))
            .replace(GlobalData.VENDORID, this.validateId(GlobalData.VENDORID, vendorId)).replace(GlobalData.RATECARDPROFILEGROUPID, this.validateId(GlobalData.RATECARDPROFILEGROUPID, rateCardProfileGroupId))
            .replace(GlobalData.USERID, this.validateId(GlobalData.USERID, userId)).replace(GlobalData.CANDSHAREREQUESTID, this.validateId(GlobalData.CANDSHAREREQUESTID, candShareRequestId))
            .replace(GlobalData.VENDORCLIENTTIERPROFILEGROUPID, this.validateId(GlobalData.VENDORCLIENTTIERPROFILEGROUPID, vendorClientTierProfileGroupId)).replace(GlobalData.RELCONFIGGROUPID, this.validateId(GlobalData.RELCONFIGGROUPID, relConfigGroupId))
            .replace(GlobalData.TASKPROFILEGROUPID, this.validateId(GlobalData.TASKPROFILEGROUPID, taskProfileGroupId)).replace(GlobalData.WFAPPROVALGROUPID, this.validateId(GlobalData.WFAPPROVALGROUPID, wfApprovalGroupId))
            .replace(GlobalData.CLIENTINTVWCRITGROUPID, this.validateId(GlobalData.CLIENTINTVWCRITGROUPID, clientIntvwCritGroupId)).replace(GlobalData.VENDORINVOICEID, this.validateId(GlobalData.VENDORINVOICEID, vendorInvoiceId))
            .replace(GlobalData.NOTIFICATIONID, this.validateId(GlobalData.NOTIFICATIONID, notificationId)).replace(GlobalData.MESSAGEID, this.validateId(GlobalData.MESSAGEID, messageId))
            .replace(GlobalData.ACTIONREASONID, this.validateId(GlobalData.ACTIONREASONID, actionReasonId)).replace(GlobalData.ROLEPERMISSIONID, this.validateId(GlobalData.ROLEPERMISSIONID, rolePermissionsId))
            .replace(GlobalData.STREAMID, this.validateId(GlobalData.STREAMID, streamId)).replace(GlobalData.TICKETID, this.validateId(GlobalData.TICKETID, ticketId))
            .replace(GlobalData.CANDSUBINTERVIEWID, this.validateId(GlobalData.CANDSUBINTERVIEWID, candSubInterviewId)).replace(GlobalData.EVENTID, this.validateId(GlobalData.EVENTID, eventId))
            .replace(GlobalData.TSWEEKID, this.validateId(GlobalData.TSWEEKID, tsWeekId))
            .replace(GlobalData.CONTENTID, this.validateId(GlobalData.CONTENTID, contentId))
            .replace(GlobalData.CANDSUBEXTID, this.validateId(GlobalData.CANDSUBEXTID, candSubExtId))
    }
    validateId = (urlId, id) => {
        if (id ==undefined || id ==null) {
            let newUrlId = urlId.substring(1, urlId.length - 1)
            const idArray = JSON.parse(localStorage.getItem('key'))

            if (idArray !=null && idArray !=undefined) {
                let obj = idArray.find((id) => id.idName ==newUrlId)

                if (obj !=undefined && obj !=null) {
                    return obj.id
                }
            }
        }
        else {
            return id
        }
    }

    breadCrumbLink = (props) => {
        var pageObj = props.data.filter(x => x.id==props.id);
        var pageUrl = pageObj[0] !=null ? pageObj[0].pageUrl : null;
        pageUrl = pageUrl !=null && pageUrl !=undefined ? pageUrl : '/'
        if (props.disabled) {
            return <Link to={pageUrl} onClick={e => e.preventDefault()}>
                <span className="float-right text-dark cursorDisabled">{props.text}</span>
            </Link>;
        }
        else {
            return <Link to={pageUrl}>
                <span className="float-right text-dark"> {props.icon} {props.text}</span>
            </Link>;
        }
    }

    render() {
        return (
            <>
                <Breadcrumb
                    breadcrumbLink={this.breadCrumbLink}
                    data={this.state.breadCrumbData}
                />
            </>
        )
    }
};
export default BreadCrumbs;
