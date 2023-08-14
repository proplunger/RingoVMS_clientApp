import * as React from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";
import auth from "../../Auth";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faTimesCircle,
    faEye,
    faSave,
    faPlusCircle,
    faPrint,
    faTimes,
    faArrowLeft,
    faCheckSquare,
    faFileImport,
    faPencilAlt,
    faTrashAlt,
    faCalendar,
    faCopy,
    faClock,
    faHandPaper,
    faThumbsUp,
    faThumbsDown,
    faCalendarAlt,
    faFileSignature,
    faHistory,
    faUserMd,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { history } from "../../../HelperMethods";
import { getIcon } from "./icon";

export interface RowActionsProps {
    currentState: string;
    rowId: string;
    handleClick?: any;
    cancelUrl?: string;
    defaultActions?: any;
    dataItem?: any;
    wfCode?: string;
    jobWfTypeId?: string;
    entityId?: string;
    hideBtn?: any;
    props?:any;
    isClientCheck?:boolean;
}

export interface RowActionsState {
    actions: any;
    clientId: any;
}

class RowActions extends React.Component<RowActionsProps, RowActionsState> {
    constructor(props: RowActionsProps) {
        super(props);
        this.state = { actions: [...props.defaultActions], clientId: auth.getClient() };
    }

    componentDidMount() {
        if (this.props.currentState && this.props.wfCode) {
            this.getCurrentStateActions(this.props.currentState);
        }
    }

    getCurrentStateActions(state: string) {
        let queryParam = `previousState eq '${state}' and wfCode eq '${this.props.wfCode}' and isRowAction eq true`;
        if (!this.props.isClientCheck && this.state.clientId) {
            queryParam += ` and clientId eq ${this.state.clientId}`;
        }
        if (this.props.jobWfTypeId) {
            queryParam += ` and jobWfTypeId eq ${this.props.jobWfTypeId}`;
        }
        // add clientid, client lobId, wfType, position
        axios.get(`api/workflow/transitions?$filter=${queryParam}`).then((res) => {
            this.setState({ actions: this.state.actions.concat(res.data) });
        });
    }

    render() {
        const menuRender = (props) => {
            return <span className="k-icon k-i-more-horizontal active-icon-blue"></span>;
        };

        const { handleClick, rowId, dataItem,props } = this.props;

        return (
            <td contextMenu="Action" style={props && props.style} className={'k-grid-content-sticky custom-sticky-icons'}>
                <Menu openOnClick={true} className="actionItemMenu ">
                    <MenuItem render={menuRender} key={"parentMenu"}>
                        {this.state.actions.map(
                            (action, i) =>
                                auth.hasPermissionV2(action.permCode) &&
                                (this.props.hideBtn ? this.props.hideBtn.filter((o) => o==action.action.replace(/ +/g, "")).length==0 : true) &&
                                (
                                    <MenuItem
                                        disabled={action.disabled}
                                        key={"editBtn" + i}
                                        render={(props) => (
                                            <div
                                                className="pb-1 pt-1 w-100 myorderactionicons"
                                                onClick={() =>
                                                    action.hasOwnProperty("linkUrl")
                                                        ? this.handleLinkClick(action.linkUrl)
                                                        : handleClick(action.action, action.actionId, rowId, action.nextStateId, action.eventName, dataItem)
                                                }
                                            >
                                                {getIcon(action.icon)}
                                                {action.action}
                                            </div>
                                        )}
                                        cssStyle={action.cssStyle}
                                    />
                                )
                        )}
                    </MenuItem>
                </Menu>
            </td>
        );
    }

    getIcon(icon) {
        let iconTag;
        switch (icon) {
            case "faSave":
                iconTag = <FontAwesomeIcon icon={faSave} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faCheckCircle":
                iconTag = <FontAwesomeIcon icon={faCheckCircle} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faTimes":
                iconTag = <FontAwesomeIcon icon={faTimes} className={"mr-2 FontSizeDropdown Icon_width nonactive-icon-color"} />;
                break;
            case "faEye":
                iconTag = <FontAwesomeIcon icon={faEye} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faArrowLeft":
                iconTag = <FontAwesomeIcon icon={faArrowLeft} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faCheckSquare":
                iconTag = <FontAwesomeIcon icon={faCheckSquare} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faFileImport":
                iconTag = <FontAwesomeIcon icon={faFileImport} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faPencilAlt":
                iconTag = <FontAwesomeIcon icon={faPencilAlt} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faTrashAlt":
                iconTag = <FontAwesomeIcon icon={faTrashAlt} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faCalendar":
                iconTag = <FontAwesomeIcon icon={faCalendar} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faCopy":
                iconTag = <FontAwesomeIcon icon={faCopy} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faClock":
                iconTag = <FontAwesomeIcon icon={faClock} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faHandPaper":
                iconTag = <FontAwesomeIcon icon={faHandPaper} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faThumbsUp":
                iconTag = <FontAwesomeIcon icon={faThumbsUp} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faThumbsDown":
                iconTag = <FontAwesomeIcon icon={faThumbsDown} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faCalendarAlt":
                iconTag = <FontAwesomeIcon icon={faCalendarAlt} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faFileSignature":
                iconTag = <FontAwesomeIcon icon={faFileSignature} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faPlusCircle":
                iconTag = <FontAwesomeIcon
                    icon={faPlusCircle} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
            case "faPlusMinus":
                iconTag = <img src="https://img.icons8.com/office/16/000000/plus-minus.png" />
                break;
            case "faHistory":
                iconTag = <FontAwesomeIcon icon={faHistory} className={"mr-2"} />;
                break;
            case "faUserMd":
                iconTag = <FontAwesomeIcon icon={faUserMd} className={"mr-2"} />;
                break;
            case "faPrint":
                iconTag = <FontAwesomeIcon icon={faPrint} className={"mr-2"} />;
                break;
            case "faUserPlus":
                iconTag = <FontAwesomeIcon icon={faUserPlus} className={"mr-2 Icon_width nonactive-icon-color"} />;
                break;
        }
        return iconTag;
    }

    handleLinkClick(url) {
        history.push(url);
    }
}

export default RowActions;
