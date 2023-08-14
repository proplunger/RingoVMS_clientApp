import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { successToastr } from "../../../HelperMethods";
import { kendoLoadingPanel } from "../../ReusableComponents";

export interface ICommentProps {
    entityId: string;
    isPrivate?: boolean;
    entityType?: string;
    isDisabled?: boolean;
    isCommentGrid?: boolean;
    updateCommentGrid?: any;
}

export interface ICommentState {
    comment: string;
    isSaving?: boolean;
}

export class Comment extends Component<ICommentProps, ICommentState> {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            isSaving: false,
        };
    }
    render() {
        return (
            <div className="noteHistoryContainer">
                {this.state.isSaving && kendoLoadingPanel}
                <textarea
                    disabled={this.props.isDisabled}
                    rows={2}
                    id="noteHistoryBox"
                    maxLength={2000}
                    value={this.state.comment}
                    className="form-control noteHistory mt-1"
                    onChange={(event) => {
                        this.setState({ comment: event.target.value });
                    }}
                />
                <div style={{ textAlign: "end", display: this.state.comment.replace(/ +/g, "").length > 0 ? "block" : "none", marginTop: "10px" }}>
                    <span onClick={this.handleAddition.bind(this)} className="mr-2 noteHistorySpan">
                        <FontAwesomeIcon icon={faCheck} className="active-icon-blue cursorElement noteHistoryIcon" style={{ fontSize: "18px" }} />
                    </span>

                    <span onClick={() => this.setState({ comment: "" })} className="mr-1 noteHistorySpan" style={{ padding: "2px 5px" }}>
                        <FontAwesomeIcon icon={faTimes} className="active-icon-blue cursorElement noteHistoryIcon" style={{ fontSize: "18px" }} />
                    </span>
                </div>
            </div>
        );
    }

    private handleAddition() {
        var data = {
            comment: this.state.comment,
            entityId: this.props.entityId,
            isPrivate: this.props.isPrivate,
            entityType: this.props.entityType,
        };
        this.setState({
            isSaving: true,
        });
        axios.post("/api/comments", JSON.stringify(data)).then((res) => {
            if (res) {
                successToastr("Comment has been added successfully.");
                this.setState({
                    comment: "",
                    isSaving: false,
                });
                if(this.props.isCommentGrid==true){
                    this.props.updateCommentGrid();
                }
            }
        }).catch(err => {
            this.setState({ isSaving: false });
        });
    }
}
