import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle} from "@fortawesome/free-solid-svg-icons";

export interface AlertBoxProps {
    showModal: boolean;
    message: any;
    handleNo: any;
}

export interface AlertBoxState {
    showModal: boolean;
}

export class AlertBox extends React.Component<AlertBoxProps, AlertBoxState> {
    constructor(props) {
        super(props);
        this.state = { showModal: false };
    }

    render() {
        return (
            <div className="">
                {this.props.showModal && (
                    <div className="containerDialog">
                        <div className="containerDialog-animation">
                        <div className="col-10 col-sm-7 col-xl-4 shadow containerDialoginside">
                            <div className="row blue-accordion">
                                <div className="col-12  pt-2 pb-2 fontFifteen">
                                    Alert
                                </div>
                            </div>
                            <div className="row text-center">
                                <div className="col-12 text-dark mt-4 pl-2 pr-2">{this.props.message}</div>
                            </div>

                                <div className="col-12 mt-4 mb-4 text-center font-regular">
                                    <button
                                        type="button"
                                        onClick={this.props.handleNo}
                                        className="btn button button-bg shadow mb-2 mb-xl-0">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                        OK
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

export default AlertBox;
