import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { State, toODataString } from '@progress/kendo-data-query';
import { Grid, GridColumn, GridNoRecords } from '@progress/kendo-react-grid';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { errorToastr, newPageSizes, successToastr } from '../../../HelperMethods';
import Auth from '../../Auth';
import { CREATE_CONTENT_LIBRARY } from '../../Shared/ApiUrls';
import { AppPermissions } from '../../Shared/Constants/AppPermissions';
import ColumnMenu from '../../Shared/GridComponents/ColumnMenu';
import { CellRender, ContentStatusCell, GridNoRecord } from '../../Shared/GridComponents/CommonComponents';
import CompleteSearch from '../../Shared/Search/CompleteSearch';
import RowActions from '../../Shared/Workflow/RowActions';
import { history } from "../../../HelperMethods";
import contentLibraryDataService from "../Services/DataService";
import ConfirmationModal from '../../Shared/ConfirmationModal';
import { ARCHIVE_CONTENT_LIB_CONFIRMATION_MSG, CONTENT_LIB_ARCHIVE_SUCCESS_MSG, CONTENT_LIB_PUBLISH_SUCCESS_MSG, CONTENT_LIB_REMOVE_SUCCESS_MSG, DELETE_CONTENT_LIB_CONFIRMATION_MSG, PUBLISH_CONTENT_LIB_CONFIRMATION_MSG, } from '../../Shared/AppMessages';
import { CustomMenu, DefaultActions, DetailColumnCell, ViewMoreComponent } from './GlobalActions';
import { ContentLibStatus } from '../../Shared/AppConstants';
import { process } from "@progress/kendo-data-query";
import BreadCrumbs from '../../Shared/BreadCrumbs/BreadCrumbs';


export interface ManageContentLibraryProps { }

export interface ManageContentLibraryState {
    onFirstLoad: boolean;
    showLoader: boolean;
    data: any;
    totalCount?: number;
    totalData?: any;
    dataState: any;
    dataCopy?: any;
    showAddNewContentLibrary?: any;
    showDeleteModal?: boolean;
    showPublishModal?: boolean;
    showArchiveModal?: boolean;
    result?: any;
}

class ManageContentLibrary extends React.Component<ManageContentLibraryProps, ManageContentLibraryState>{
    public dataItem: any;
    dataState;
    aggregates = [
    ];
    data = [];
    constructor(props: ManageContentLibraryProps) {
        super(props);
        this.dataState = {
            skip: 0,
            take: 10,
            group: [{ field: "contentType" }],
        };
        this.state = {
            onFirstLoad: true,
            showLoader: true,
            data: [],
            dataState: this.dataState,
        };
    }

    componentDidMount() {
    }

    getContentLibrary = (dataQuery?, dataState?) => {
        var dataCopy: State = {
            take: dataQuery.take,
            skip: dataQuery.skip,
        };
        this.setState({ showLoader: true, onFirstLoad: false, dataState: this.state.dataState });
        this.state.dataState.filter = dataQuery.filter;
        var queryStr = `${toODataString(dataQuery, { utcDates: true })}`;
        contentLibraryDataService.getContentLibrary(queryStr).then((res) => {
            this.data = res.data;
            let dataStateCopy = (this.state.onFirstLoad && dataState==undefined)
                ? this.dataState
                : (!this.state.onFirstLoad && dataState==undefined)
                    ? {
                        skip: 0,
                        take: 10,
                        group: this.state.dataState.group
                    } :
                    {
                        skip: dataState.take==dataState.skip || dataState.take < dataState.skip ? 0 : dataState.skip,
                        take: dataState.take,
                        group: dataState.group
                    };
            this.setState({
                data: res.data,
                result: process(res.data, dataStateCopy),
                dataCopy: dataCopy,
                showLoader: false,
                onFirstLoad: false,
            });
            this.getContentLibraryCount(dataQuery);
        });
    }

    getContentLibraryCount = (dataState) => {
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };

        var queryStr = `${toODataString(finalState, { utcDates: true })}`;
        contentLibraryDataService.getContentLibrary(queryStr).then((res) => {
            this.setState({
                totalCount: res.data.length,
                totalData: res.data,
            });
        });
    };

    onDataStateChange = (changeEvent) => {
        localStorage.setItem("ManageContentLibrary-GridDataState", JSON.stringify(changeEvent.data));
        let dataState2;
        if (changeEvent.data.filter) {
            dataState2 = {
                filter: changeEvent.data.filter,
                skip: changeEvent.data.skip,
                take: changeEvent.data.take,
                group: changeEvent.data.group,
            };
        }
        if (changeEvent.data.sort) {
            dataState2 = {
                sort: changeEvent.data.sort,
                skip: changeEvent.data.skip,
                take: changeEvent.data.take,
                group: changeEvent.data.group,
            };
        }
        if (changeEvent.data.sort==undefined && changeEvent.data.filter==undefined) {
            dataState2 = {
                skip: changeEvent.data.skip,
                take: changeEvent.data.take,
                group: changeEvent.data.group,
            };
        }
        if (this.state.dataState.group.length==changeEvent.data.group.length) {
            return this.setState(
                {
                    dataState: dataState2,
                },
                () => this.getContentLibrary(this.state.dataState, dataState2)
            );
        } else {
            changeEvent.data.group.length <= 2 && changeEvent.data.group.length >= 0
                ? this.setState(this.createAppState(changeEvent.data))
                : errorToastr("Only two columns can be grouped at once!");
        }
    };

    createAppState(dataState) {
        const groups = dataState.group;
        if (groups) {
            groups.map((group) => (group.aggregates = this.aggregates));
        }
        let dataState2 = {
            skip: dataState.skip,
            take: dataState.take,
            group: dataState.group,
        };
        return {
            result: process(this.data, dataState2),
            dataState: dataState2,
        };
    }

    handleActionClick = (action, actionId, rowId, nextStateId?, eventName?, dataItem?) => {
        let change = {};
        let property = `show${action.replace(/ +/g, "").replace(".", "")}Modal`;
        change[property] = true;
        this.setState(change);
        this.dataItem = dataItem;
    }

    ExpandCell = (props) => <DetailColumnCell {...props} expandChange={this.expandChange.bind(this)} />;

    expandChange = (dataItem) => {
        dataItem.expanded = !dataItem.expanded;
        this.forceUpdate();
    };

    deleteContentLib = (id, msg) => {
        this.setState({ showDeleteModal: false });
        contentLibraryDataService.deleteContentLib(id).then((res) => {
            successToastr(msg);
            this.getContentLibrary(this.state.dataState);
        });
    };

    updateContentStatus = (id, statusId, msg) => {
        this.setState({ showPublishModal: false, showArchiveModal: false });
        var data = {
            contentLibId: id,
            statusId: statusId
        }
        contentLibraryDataService.patchContentLib(data).then((res) => {
            successToastr(msg);
            this.getContentLibrary(this.state.dataState);
        })
    }

    render() {
        return (
            <div className="col-11 mx-auto pl-0 pr-0 mt-3  mt-md-0">
                <div className="container-fluid mt-3 mb-3 d-md-block d-none">
                    <div className="row pt-2 pb-2 mt-3 accordianTitleClr mx-auto mb-2">
                        <div className="col-10 col-md-6 fonFifteen paddingLeftandRight">
                            <BreadCrumbs></BreadCrumbs>
                        </div>
                        <div className="col-2 col-md-6">
                            {Auth.hasPermissionV2(AppPermissions.CONTENT_LIBRARY_CREATE) && (
                                <Link to={CREATE_CONTENT_LIBRARY}>
                                    <span className="float-right text-dark">
                                        <FontAwesomeIcon icon={faPlusCircle} className={"mr-1 text-dark"} />
                                        Add New Content
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <CompleteSearch
                        page="ManageContentLibrary"
                        entityType={"Content Library"}
                        placeholder="Search text here!"
                        handleSearch={this.getContentLibrary}
                        onFirstLoad={this.state.onFirstLoad}
                        persistSearchData={true}
                    />
                    <div className="myOrderContainer gridshadow global-action-grid-onlyhead" id="grouping-performance-grid">
                        <Grid
                            resizable={false}
                            reorderable={false}
                            sortable={true}
                            pageable={{ pageSizes: newPageSizes }}
                            groupable={{ footer: "none" }}
                            data={this.state.result}
                            total={this.state.totalCount}
                            onDataStateChange={this.onDataStateChange}
                            {...this.state.dataState}
                            {...this.state.dataCopy}
                            detail={ViewMoreComponent}
                            expandField="expanded"
                            className="kendo-grid-custom lastchild"
                        >
                            <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>

                            <GridColumn
                                field="title"
                                title="Title"
                                cell={(props) => CellRender(props, "Title")}
                                columnMenu={ColumnMenu}
                                filter="text"
                                width="400px"
                            />
                            <GridColumn
                                field="contentType"
                                title="Content Type"
                                cell={(props) => CellRender(props, "Contant Type")}
                                columnMenu={ColumnMenu}
                                filter="text"
                            />
                            <GridColumn
                                field="validTo"
                                title="Expiration Date"
                                format="{0:d}"
                                editor="date"
                                cell={(props) => CellRender(props, "Expiration Date")}
                                columnMenu={ColumnMenu}
                                filter="date"
                            />
                            <GridColumn
                                field="status"
                                title="Status"
                                columnMenu={ColumnMenu}
                                cell={ContentStatusCell}
                            />
                            <GridColumn
                                title="Action"
                                sortable={false}
                                width="70px"
                                cell={(props) => {
                                    if (props.rowType=="groupHeader") {
                                        return <td colSpan={0} className="d-none"></td>;
                                    } return (
                                        <RowActions
                                            dataItem={props.dataItem}
                                            currentState={""}
                                            rowId={props.dataItem.id}
                                            handleClick={this.handleActionClick}
                                            defaultActions={DefaultActions(props)}
                                        />
                                    )
                                }}
                                headerCell={() => CustomMenu(this.state.totalData)}
                            />
                            <GridColumn sortable={false} field="expanded" width="100px" title="View More" cell={this.ExpandCell} />
                        </Grid>
                        <div className="modal-footer justify-content-center border-0">
                            <div className="row mt-2 mb-2 ml-0 mr-0 justify-content-center">
                                <button type="button" className="btn button button-close mr-2 shadow mb-2 mb-xl-0" onClick={() => history.goBack()}>
                                    <FontAwesomeIcon icon={faTimesCircle} className={"mr-1"} /> Close
                                </button>
                            </div>
                        </div>
                    </div>
                    <ConfirmationModal
                        message={DELETE_CONTENT_LIB_CONFIRMATION_MSG()}
                        showModal={this.state.showDeleteModal}
                        handleYes={() => this.deleteContentLib(this.dataItem.id, CONTENT_LIB_REMOVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showDeleteModal: false });
                        }}
                    />

                    <ConfirmationModal
                        message={PUBLISH_CONTENT_LIB_CONFIRMATION_MSG()}
                        showModal={this.state.showPublishModal}
                        handleYes={() => this.updateContentStatus(this.dataItem.id, ContentLibStatus.PUBLISHED, CONTENT_LIB_PUBLISH_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showPublishModal: false });
                        }}
                    />

                    <ConfirmationModal
                        message={ARCHIVE_CONTENT_LIB_CONFIRMATION_MSG()}
                        showModal={this.state.showArchiveModal}
                        handleYes={() => this.updateContentStatus(this.dataItem.id, ContentLibStatus.ARCHIVED, CONTENT_LIB_ARCHIVE_SUCCESS_MSG)}
                        handleNo={() => {
                            this.setState({ showArchiveModal: false });
                        }}
                    />
                </div>
            </div>
        )

    }
}
export default ManageContentLibrary;