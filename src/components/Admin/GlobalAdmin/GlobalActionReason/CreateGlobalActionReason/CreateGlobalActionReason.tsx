
import { faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { filterBy } from '@progress/kendo-data-query';
import { MultiSelect, MultiSelectFilterChangeEvent } from '@progress/kendo-react-dropdowns';
import axios from 'axios';
import { Form, Formik } from 'formik';
import * as React from 'react';
import Collapsible from 'react-collapsible';
import Skeleton from 'react-loading-skeleton';
import { history, successToastr } from '../../../../../HelperMethods';
import { ErrorComponent } from '../../../../ReusableComponents';
import { MANAGE_ACTION_REASON } from '../../../../Shared/ApiUrls';
import { REASON_ACTION_SUCCESS_MSG, REASON_ACTION_UPDATE_SUCCESS_MSG } from '../../../../Shared/AppMessages';
import BreadCrumbs from '../../../../Shared/BreadCrumbs/BreadCrumbs';
import { IDropDownModel } from '../../../../Shared/Models/IDropDownModel';
import { userValidation } from '../../../../Users/CreateUser/validations/validation';
import GlobalAdminDataService from "../../Service/DataService";

export interface CreateGlobalActionReasonProps {
    props: any;
    match: any;
}

export interface CreateGlobalActionReasonState {
    submitted: boolean;
    name?: string;
    description?: string;
    actions: Array<IDropDownModel>;
    selectedActions: any;
    ActionReasonId?: string;
    toggleAll: boolean;
    toggelFirst: boolean;
    showLoader?: boolean;
    actions1?: any;
}

export default class CreateGlobalActionReason extends React.Component<CreateGlobalActionReasonProps, CreateGlobalActionReasonState>{
    constructor(props: CreateGlobalActionReasonProps) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            ActionReasonId: id,
            submitted: false,
            actions: [],
            selectedActions: [],
            toggleAll: false,
            toggelFirst: true,
        }
    }
    componentDidMount() {
        this.getActions();
        const { ActionReasonId } = this.state;
        if (ActionReasonId) {
            this.getActionDetails(ActionReasonId);
        }
    }

    saveReasonAction = () => {
        this.setState({ submitted: true });
        let data = {
            name: this.state.name,
            description: this.state.description,
            selectedActions: this.state.selectedActions.map(x => x.id),
            ActionReasonId: this.state.ActionReasonId,
        };
        if ((this.state.name !=undefined && this.state.name !=null && this.state.name !="") && (this.state.selectedActions !=undefined && this.state.selectedActions !=null && this.state.selectedActions !="")) {
            GlobalAdminDataService.saveReasonAction(data).then((res) => {
                successToastr(REASON_ACTION_SUCCESS_MSG);
                history.push(MANAGE_ACTION_REASON);
            });
        }

    }
    handleUpdate = () => {
        this.setState({ submitted: true });
        let data = {
            name: this.state.name,
            description: this.state.description,
            selectedActions: this.state.selectedActions.map(x => x.id),
            ActionReasonId: this.state.ActionReasonId,
        };
        if ((this.state.name !=undefined &&
            this.state.name !=null &&
            this.state.name !="") && (this.state.selectedActions !=undefined && this.state.selectedActions !=null && this.state.selectedActions !="")
        ) {
            axios
                .put(
                    ` api/admin/actionReason/${this.state.ActionReasonId}`,
                    JSON.stringify(data)
                )
                .then((res) => {
                    successToastr(REASON_ACTION_UPDATE_SUCCESS_MSG);
                    history.push(MANAGE_ACTION_REASON);
                });
        }
    }
    handleActionChange = (e) => {
        if (e.value.hasOwnProperty('length')) {
            this.setState({ selectedActions: e.value });
        }
        else {
            this.setState({ selectedActions: [e.value] });
        }
    }
    //api/workflow/actions	
    getActions = () => {
        GlobalAdminDataService.getActions().then(async res => {
            var data = res.data.filter(x => x.isActionMap==true).map(x => {
                return {
                    id: x.actionId,
                    entityName: x.entityName,
                }
            })
            this.setState({ actions1: data, actions: data });
        });
    }

    getActionDetails(ActionReasonId: string) {
        GlobalAdminDataService.getActionReason(ActionReasonId).then((res) => {
            const { data } = res;
            this.setState({
                name: data.name,
                description: data.description,
                selectedActions: data.actionIds,
            })
        })
    }
    onCollapseOpen = () => {
        this.setState({
            toggleAll: true,
            toggelFirst: true,
        });
    };

    onCollapseClose = () => {
        this.setState({
            toggleAll: false,
            toggelFirst: false,
        });
    };
    filterChange = (event: MultiSelectFilterChangeEvent) => {
        this.setState({
            actions1: filterBy(this.state.actions.slice(), event.filter),
        });
    }
    itemRender = (li, itemProps) => {
        const itemChildren = (
            <span>
                <input
                    type="checkbox"
                    checked={itemProps.selected}
                    onChange={(e) => itemProps.onClick(itemProps.index, e)}
                />
                &nbsp;{li.props.children}
            </span>
        );
        return React.cloneElement(li, li.props, itemChildren);
    };
    render() {
        const {
            toggleAll,
            toggelFirst,
        } = this.state;
        const ActionTriggerName = (
            <span>
                Action Information
            </span>
        );
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="col-12">
                    <div className="row pt-2 pb-2 accordianTitleClr mx-auto mb-3 mt-3">
                        <div className="col-12 col-md-12 fonFifteen paddingLeftandRight">
                            <div className="d-none d-md-block">
                                {/* {this.state.ActionReasonId ? "Edit" : "Add New"} Action Reason */}
                                <BreadCrumbs globalData={{actionReasonId:this.state.ActionReasonId}}></BreadCrumbs>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 ml-0 mr-0">

                    {this.state.showLoader &&
                        Array.from({ length: 4 }).map((item, i) => (
                            <div className="row mx-auto mt-2" key={i}>
                                {Array.from({ length: 3 }).map((item, j) => (
                                    <div className="col-12 col-sm-4 col-lg-4 mt-sm-0  mt-1" key={j}>
                                        <Skeleton width={100} />
                                        <Skeleton height={30} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    {!this.state.showLoader && (
                        <div>
                            <Collapsible
                                trigger={ActionTriggerName}
                                open={toggelFirst}
                                accordionPosition="1"
                                onTriggerOpening={() => this.setState({ toggelFirst: true })}
                                onTriggerClosing={() => this.setState({ toggelFirst: false })}
                            >
                                <div className="row mt-2">
                                    <div className="col-12 col-sm-6 col-lg-6 mt-sm-0  mt-1">
                                        <label className="mb-1 font-weight-bold required">Reason</label>
                                        <input
                                            type="text"
                                            className="form-control "
                                            placeholder="Enter Reason"
                                            value={this.state.name}
                                            maxLength={100}
                                            onChange={(event) => {
                                                this.setState({ name: event.target.value });
                                            }}
                                        />
                                        {this.state.submitted &&
                                            (this.state.name==undefined ||
                                                this.state.name==null ||
                                                this.state.name=="") && <ErrorComponent />}

                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-6 mt-sm-0 mt-1 multiselect">
                                        <label className="mb-1 font-weight-bold required">Action</label>
                                        <MultiSelect
                                            className="form-control disabled"
                                            textField="entityName"
                                            dataItemKey="id"
                                            id="actions"
                                            itemRender={this.itemRender}
                                            data={this.state.actions1}
                                            value={this.state.selectedActions}
                                            onChange={(e) => this.handleActionChange(e)}
                                            placeholder="Select Action..."
                                            onFilterChange={this.filterChange}
                                            filterable={true}
                                            autoClose={false}
                                        />
                                        {this.state.submitted &&
                                            (this.state.selectedActions==undefined ||
                                                this.state.selectedActions==null ||
                                                this.state.selectedActions=="") && <ErrorComponent />}
                                    </div>
                                    <div className="col-12 col-sm-6 col-lg-6  mt-3">
                                        <label className="mb-1 font-weight-bold">Description</label>
                                        <textarea
                                            rows={2}
                                            id=""
                                            maxLength={1000}
                                            value={this.state.description}
                                            className="form-control mt-1"
                                            placeholder="Enter Description"
                                            onChange={(event) => {
                                                this.setState({ description: event.target.value });
                                            }}
                                        />
                                    </div>
                                </div>
                            </Collapsible>
                            <div className="modal-footer justify-content-center border-0 mt-2">
                                <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                    <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                        <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                    </button>
                                    {this.state.ActionReasonId != undefined ? (
                                        <button
                                            type="button"
                                            className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                            onClick={this.handleUpdate}
                                        >
                                            <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                        </button>
                                    ) : (
                                        <React.Fragment>
                                            <button
                                                type="button"
                                                className="btn button button-bg mr-2 shadow mb-2 mb-xl-0"
                                                onClick={this.saveReasonAction}
                                            >
                                                <FontAwesomeIcon icon={faSave} className={"mr-1"} /> Save
                                            </button>
                                        </React.Fragment>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )

    }

}


