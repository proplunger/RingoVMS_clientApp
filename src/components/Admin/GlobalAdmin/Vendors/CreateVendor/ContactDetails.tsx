import * as React from "react";
import { Grid, GridColumn as Column, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import axios from "axios";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import withValueField from "../../../../Shared/withValueField";
import { CustomHeaderActionCell, MyCommandCell } from "./HelperComponent";
import ColumnMenu from "../../../../Shared/GridComponents/ColumnMenu";
import { KendoFilter, PhoneNumberCell } from "../../../../ReusableComponents";
import userService from "../../../../Users/DataService";
import { GridNoRecord } from "../../../../Shared/GridComponents/CommonComponents";
import { State, toODataString } from "@progress/kendo-data-query";
import WithoutFilterColumnMenu from "../../../../Shared/GridComponents/WithoutFilterColumnMenu";

const isPresent = (value) => value != null && value != undefined;
const CustomDropDownList = withValueField(DropDownList);
const defaultItem = { name: "Select...", id: null };


export interface ContactDetailsProps {
    entityType: string;
    vendorId: string;
    canEdit?: boolean;
}

export interface ContactDetailsState {
    contact: any;
    showLoader?: boolean;
    openConfirm?: boolean;
    filterText: any;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    dataState: any;
    totalCount?: any;
}

const initialDataState = {
    skip: 0,
    take: 5,
};

class ContactDetails extends React.Component<ContactDetailsProps, ContactDetailsState> {
    CustomHeaderActionCellTemplate: any;
    CommandCell;
    public dataItem: any;
    editField = "inEdit";
    private originalLevels;
    constructor(props: ContactDetailsProps) {
        super(props);
        this.state = {
            dataState: initialDataState,
            contact: [],
            showLoader: true,
            filterText: "",
        };

        // this.initializeHeaderCell();
        // this.initializeActionCell();
    }

    componentDidMount() {
        if (this.props.vendorId) {
            this.getContact(initialDataState);

        } else {
            this.setState({ showLoader: false });
        }
    }

    initializeActionCell = () => {
        // this.CommandCell = MyCommandCell({
        //     edit: this.enterEdit,
        //     remove: this.remove,
        //     add: this.add,
        //     discard: this.discard,
        //     update: this.update,
        //     cancel: this.cancel,
        //     editField: this.editField,
        // });
    };

    initializeHeaderCell = () => {
        // this.CustomHeaderActionCellTemplate = CustomHeaderActionCell({
        //     add: this.addNew,
        // });
    };

    getContact = (dataState) => {
        const { vendorId } = this.props;
        if (vendorId) {
            var queryStr = `${toODataString(dataState)}`;
            var queryParams = `vendorId eq ${vendorId}`;
            var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
            userService.getUsers(finalQueryString)
                .then(async res => {
                    this.setState({ contact: res.data, dataState: dataState, showLoader: false });
                    this.originalLevels = res.data;
                    this.getContactCount(dataState);
                });
        }
    }

    getContactCount = (dataState) => {
        const { vendorId } = this.props;
        var finalState: State = {
            ...dataState,
            take: null,
            skip: 0,
        };
        var queryStr = `${toODataString(finalState)}`;
        var queryParams = `vendorId eq ${vendorId}`;
        var finalQueryString = KendoFilter(dataState, queryStr, queryParams);
        userService.getUsers(finalQueryString).then((res) => {
            this.setState({
                totalCount: res.data.length,
            });
        });
    };

    addNew = () => {
        // const newDataItem = { inEdit: true}; 

        // this.setState({
        //     contact: [newDataItem, ...this.state.contact]
        // });
    };

    enterEdit = (dataItem) => {
        // this.setState({
        //     contact: this.state.contact.map(item =>
        //         item.intId ==dataItem.intId ?
        //         { ...item, inEdit: true } : item
        //     )
        // });
    }

    add = dataItem => {
        // if (dataItem.firstName) {
        // dataItem.inEdit = undefined;
        // dataItem.intId = this.generateId
        //     (this.originalLevels);

        // this.originalLevels.unshift(dataItem);
        // this.setState({
        //     contact: [...this.state.contact]
        // });
        // }
    };

    //generateId = data => data.reduce((acc, current) => Math.max(acc, current.intId), 0) + 1;

    remove = (dataItem) => {
        // const data = [ ...this.state.contact ];
        // this.removeItem(data, dataItem);

        // this.setState({ contact:data });
    }

    removeItem(data, item) {
        // let index = data.findIndex(p => p ==item || (item.id && p.id ==item.id));
        // if (index >= 0) {
        //     data.splice(index, 1);
        // }
    }

    update = (dataItem) => {
        // if (dataItem.firstName) {
        // const data = [ ...this.state.contact ];
        // const updatedItem = { ...dataItem, inEdit: undefined };

        // this.updateItem(data, updatedItem); 

        // this.setState({ contact:data });
        // }
    }

    updateItem = (data, item) => {
        // let index = data.findIndex(p => p ==item || (item.id && p.id ==item.id));
        // if (index >= 0) {
        //     data[index] = { ...item };
        // }
    }

    cancel = (dataItem) => {
        // const originalItem = this.originalLevels.find((p) => p.id ==dataItem.id);
        // originalItem["inEdit"] = undefined;
        // const data = this.state.contact.map((item) => item.id ==originalItem.id ? originalItem : item);
        // this.setState({ contact: data });
    }

    discard = dataItem => {
        // const data = [...this.state.contact];
        // this.removeItem(data, dataItem);

        // this.setState({ contact:data });
        // };

        // onDataStateChange = (changeEvent) => {
        //     this.getContact(changeEvent.data);
    };

    updateState = (keyword, props) => {
        // const data = this.state.contact.map((item) =>
        // item.id ==props.dataItem.id
        //     ? { ...item, [props.field]: keyword }
        //     : item
        // );
        // this.setState({ contact: data });
    };

    itemChange = (event) => {
        // const data = this.state.contact.map(item =>
        //     item.intId ==event.dataItem.intId ?
        //     { ...item, [event.field]: event.value } : item
        // );

        // this.setState({ contact: data });
    }

    getContactData() {
        //return this.state.contact;
    }

    onDataStateChange = (changeEvent) => {
        this.getContact(changeEvent.data);
    };

    render() {
        const { canEdit } = this.props;
        return (
            <React.Fragment>
                <div className="">
                    <div className="row mt-2">
                        <div className="col-12" id="nameyoursearch">
                            <div className="createjoborderstep4-a" id="createjoborderstep">
                                <div className="table-responsive tableShadow">
                                    <Grid
                                        className="kendo-grid-custom lastchild global-action-grid-onlyhead"
                                        style={{ height: "auto" }}
                                        sortable={true}
                                        onItemChange={this.itemChange}
                                        onDataStateChange={this.onDataStateChange}
                                        pageable={{ pageSizes: true }}
                                        data={this.state.contact}
                                        {...this.state.dataState}
                                        total={this.state.totalCount}
                                        editField="inEdit"
                                        selectedField="selected"
                                    >
                                        <GridNoRecords>{GridNoRecord(this.state.showLoader)}</GridNoRecords>
                                        <GridColumn
                                            field="firstName"
                                            title="First Name"
                                            columnMenu={ColumnMenu}
                                        />
                                        <GridColumn
                                            field="lastName"
                                            title="Last Name"
                                            columnMenu={ColumnMenu}
                                        />
                                        <GridColumn
                                            field="email"
                                            title="Email"
                                            columnMenu={ColumnMenu}
                                        />
                                        <GridColumn
                                            sortable={false}
                                            filterable={false}
                                            field="address.contactNum1"
                                            title="Phone Number"
                                            cell={(props) => PhoneNumberCell(props, "Mobile Number")}
                                        />
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }

}

export default ContactDetails;