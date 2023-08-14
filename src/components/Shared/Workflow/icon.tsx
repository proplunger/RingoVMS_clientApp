import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faTimesCircle,
    faClock,
    faSave,
    faPlusCircle,
    faTimes,
    faEye,
    faArrowLeft,
    faCheckSquare,
    faFileImport,
    faPencilAlt,
    faTrashAlt,
    faCalendar,
    faPaperPlane,
    faArrowRight,
    faCalendarAlt,
    faFileSignature,
    faArrowAltCircleRight,
    faCopy,
    faHandPaper,
    faThumbsUp,
    faThumbsDown,
    faShare,
    faPlus,
    faMinus,
    faHistory,
    faEnvelope,
    faUndo,
    faBell,
    faMapMarker,
    faUsersCog,
    faMapMarkerAlt,
    faChartBar,
    faChartLine,
    faCoins,
    faDollarSign,
    faHandHoldingUsd,
    faUserMd,
    faFileExcel,
    faUserPlus,
    faPrint,
    faFileAlt,
    faArchive,
    faSignature
} from "@fortawesome/free-solid-svg-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";

export const getIcon = (icon) => {
    let iconTag;
    let size = 5;
    switch (icon) {
        case "faSave":
            iconTag = <FontAwesomeIcon icon={faSave} className={"mr-2"} />;
            break;
        case "faCheckCircle":
            iconTag = <FontAwesomeIcon icon={faCheckCircle} className={"mr-2"} />;
            break;
        case "faTimes":
            iconTag = <FontAwesomeIcon icon={faTimes} className={"mr-2"} />;
            break;
        case "faEye":
            iconTag = <FontAwesomeIcon icon={faEye} className={"mr-2"} />;
            break;
        case "faArrowLeft":
            iconTag = <FontAwesomeIcon icon={faArrowLeft} className={"mr-2"} />;
            break;
        case "faCheckSquare":
            iconTag = <FontAwesomeIcon icon={faCheckSquare} className={"mr-2"} />;
            break;
        case "faFileImport":
            iconTag = <FontAwesomeIcon icon={faFileImport} className={"mr-2"} />;
            break;
        case "faPencilAlt":
            iconTag = <FontAwesomeIcon icon={faPencilAlt} className={"mr-2"} />;
            break;
        case "faTrashAlt":
            iconTag = <FontAwesomeIcon icon={faTrashAlt} className={"mr-2"} />;
            break;
        case "faCalendar":
            iconTag = <FontAwesomeIcon icon={faCalendar} className={"mr-2"} />;
            break;
        case "faClock":
            iconTag = <FontAwesomeIcon icon={faClock} className={"mr-2"} />;
            break;
        case "faArrowRight":
            iconTag = <FontAwesomeIcon icon={faArrowRight} className={"mr-2"} />;
            break;
        case "faCalendarAlt":
            iconTag = <FontAwesomeIcon icon={faCalendarAlt} className={"mr-2"} />;
            break;
        case "faFileSignature":
            iconTag = <FontAwesomeIcon icon={faFileSignature} className={"mr-2"} />;
            break;
        case "faArrowAltCircleRight":
            iconTag = <FontAwesomeIcon icon={faArrowAltCircleRight} className={"mr-2"} />;
            break;
        case "faTimesCircle":
            iconTag = <FontAwesomeIcon icon={faTimesCircle} className={"mr-2"} />;
            break;
        case "faPlusCircle":
            iconTag = <FontAwesomeIcon icon={faPlusCircle} className={"mr-2"} />;
            break;
        case "faPaperPlane":
            iconTag = <FontAwesomeIcon icon={faPaperPlane} className={"mr-2"} />;
            break;
        case "faCopy":
            iconTag = <FontAwesomeIcon icon={faCopy} className={"mr-2"} />;
            break;
        case "faHandPaper":
            iconTag = <FontAwesomeIcon icon={faHandPaper} className={"mr-2"} />;
            break;
        case "faThumbsUp":
            iconTag = <FontAwesomeIcon icon={faThumbsUp} className={"mr-2"} />;
            break;
        case "faThumbsDown":
            iconTag = <FontAwesomeIcon icon={faThumbsDown} className={"mr-2"} />;
            break;
        case "faShare":
            iconTag = <FontAwesomeIcon icon={faShare} className={"mr-2"} />;
            break;
        case "faPlusMinus":
            iconTag = (
                <span className="fa-stack mr-0 position-relative" style={{ fontSize: "10px" }}>
                    <FontAwesomeIcon
                        className="faclock_size d-block nonactive-icon-color"
                        icon={faPlus}
                        style={{ position: "absolute", top: "4px" }}
                    />
                    <FontAwesomeIcon className="faclock_size nonactive-icon-color" icon={faMinus} style={{ position: "absolute", top: "14px" }} />
                </span>
            );
            break;
        case "faHistory":
            iconTag = <FontAwesomeIcon icon={faHistory} className={"mr-2"} />;
            break;
        case "faEnvelope":
            iconTag = <FontAwesomeIcon icon={faEnvelope} className={"mr-2 Icon_width nonactive-icon-color"} />;
            break;
        case "faBell":
            iconTag = <FontAwesomeIcon icon={faBell} className={"mr-2 Icon_width nonactive-icon-color"} />;
            break;
        case "faUndo":
            iconTag = <FontAwesomeIcon icon={faUndo} className={"mr-2 Icon_width nonactive-icon-color"} />;
            break;
        case "faMapMarker":
            iconTag = <FontAwesomeIcon icon={faMapMarker} className={"mr-2 Icon_width nonactive-icon-color"} />;
            break;
        case "faMapMarkerAlt":
            iconTag = <FontAwesomeIcon icon={faMapMarkerAlt} className={"mr-2 Icon_width nonactive-icon-color"} />;
            break;
        case "faUsersCog":
            iconTag = <FontAwesomeIcon icon={faUsersCog} className={"mr-2 Icon_width nonactive-icon-color"} />;
            break;
        case "faChartLine":
            iconTag = <FontAwesomeIcon icon={faChartLine} className={"mr-2 Icon_width nonactive-icon-color"} />;
            break;
        case "faChartBar":
            iconTag = <FontAwesomeIcon icon={faChartBar} className={"mr-2 Icon_width nonactive-icon-color"} />;
            break;
        case "faDollarSign":
            iconTag = <FontAwesomeIcon icon={faDollarSign} className={"mr-2 Icon_width nonactive-icon-color"} />;
            break;
        case "faHandHoldingUsd":
            iconTag = <FontAwesomeIcon icon={faHandHoldingUsd} className={"mr-2 Icon_width nonactive-icon-color"} />;
            break;
        case "faCoins":
            iconTag = <FontAwesomeIcon icon={faCoins} className={"mr-2 Icon_width nonactive-icon-color"} />;
            break;
        case "faUserMd":
            iconTag = <FontAwesomeIcon icon={faUserMd} className={"mr-2"} />;
            break;
        case "faShare":
            iconTag = <FontAwesomeIcon icon={faShare} className={"mr-2"} />;
            break;
        case "faFileExcel":
            iconTag = <FontAwesomeIcon icon={faFileExcel} className={"mr-2"} />;
            break;
        case "faUserPlus":
            iconTag = <FontAwesomeIcon icon={faUserPlus} className={"mr-2 Icon_width nonactive-icon-color"} />;
            break;
        case "faPrint":
            iconTag = <FontAwesomeIcon icon={faPrint} className={"mr-2"} />;
            break;
        case "faArchive":
            iconTag = <FontAwesomeIcon icon={faArchive} className={"mr-2"} />;
            break;
        case "faFileSignature":
            iconTag = <FontAwesomeIcon icon={faFileSignature} className={"mr-2"} />;
            break;
        case "faFileAlt":
            iconTag = <FontAwesomeIcon icon={faFileAlt} className={"mr-2"} />;
            break;
    }
    return iconTag;
};

