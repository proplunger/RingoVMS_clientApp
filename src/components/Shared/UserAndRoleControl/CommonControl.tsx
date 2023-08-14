import { faUserCircle, faUserCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { filterBy } from "@progress/kendo-data-query";
import { ListItemProps, MultiSelect, MultiSelectChangeEvent, MultiSelectFilterChangeEvent, MultiSelectPageChangeEvent } from "@progress/kendo-react-dropdowns";
import React from "react";
import { ErrorComponent } from "../../ReusableComponents";
import GlobalService from '../Services/CommonDataService'


export interface CommonControlProps {
    value?: any;
    id?: any;
    handleChange: any;
    submitted?: any;
    errorData?: any;
    disabled?: any;
    handleObjChange?: any;
}

export interface CommonControlState {
    usersAndRoles?: any;
    filteredData?: any;
    total?: number;
    skip: number;
    originalUsersAndRoles?: any;
}

const pageSize = 10;

class CommonControl extends React.Component<CommonControlProps, CommonControlState>{
    constructor(props: CommonControlProps) {
        super(props)
        this.state = {
            usersAndRoles: [],
            skip: 0
        }
    }

    componentDidMount() {
        if(!this.props.disabled){
            this.getUserAndRoles();
        }
    }

    getUserAndRoles = (clientIds=[], userType=[]) => {
        var queryParams = "";
        
        if (clientIds.length)
        {
            queryParams = this.getQueryParams(clientIds, userType);
        }
        
        GlobalService.getUserAndRoles(queryParams).then(async res => {
            this.setState({
                usersAndRoles: res.data,
                filteredData: res.data,
                originalUsersAndRoles: res.data.slice(0, pageSize),
                total: res.data.length
            });

            if (this.props.handleObjChange && this.props.value.length > 0){
                let originalUsersAndRoles = res.data.map((x) => x.id);
                let selectedUsersAndRoles = this.props.value.filter((x) => originalUsersAndRoles.indexOf(x.id) !=-1)
                this.props.handleObjChange({
                    usersAndRoles: selectedUsersAndRoles
                });
            }
        });
    }

    getQueryParams = (clientIds?, userType?) => {
        var queryParams = ""

        if (clientIds.length || userType.length){
            queryParams = `?$filter=clientId eq null`
        }

        if(userType.length){
            queryParams += ` and userTypeId in (${userType.join(',')})`
        }

        if(clientIds.length && userType.length==0){
            queryParams += ` or clientId in ('${clientIds.join("','")}')`
        }else if(userType.length){
            queryParams += ` or (clientId in ('${clientIds.join("','")}')`
        }

        if(userType.length && clientIds.length==0){
            queryParams += ` or userTypeId in (${userType.join(',')})`
        }else if(userType.length){
            queryParams += ` and userTypeId in (${userType.join(',')}))`
        }

        return queryParams;
    }

    handleFilterChange = (event: MultiSelectFilterChangeEvent) => {
        const filter = event.filter;
        (this.state.filteredData as any) = filterBy(this.state.usersAndRoles.slice(), filter);

        const data = this.state.filteredData.slice(0, pageSize);
        this.setState({
            originalUsersAndRoles: data,
            skip: 0,
            total: this.state.filteredData.length
        });
    }

    pageChange = (event: MultiSelectPageChangeEvent) => {
        const skip = event.page.skip;
        const take = event.page.take;
        const filteredData = this.state.filteredData.slice(skip, skip + take);

        this.setState({
            originalUsersAndRoles: filteredData,
            skip: skip
        });
    }

    handlePropObjChange = () => {
        this.setState({ originalUsersAndRoles: [] })
    }

    itemColor = (li: React.ReactElement<HTMLLIElement>, itemProps: ListItemProps) => {
        const entityType = itemProps.dataItem.entityType;

        return React.cloneElement(li, li.props, entityType =="Role" ?
            <span><FontAwesomeIcon className={"nonactive-icon-green-color ml-2 mr-2 user-icon-font"} icon={faUserCog} />{li.props.children}</span>
            : <span><FontAwesomeIcon className={"nonactive-icon-color ml-2 mr-2 user-icon-font"} icon={faUserCircle} />{li.props.children}</span>
        );
    }

    render() {
        return (
            <div className="col-12 multiselect">
                <MultiSelect
                className="form-control disabled"
                data={this.state.originalUsersAndRoles}
                textField="name"
                dataItemKey="id"
                name={this.props.id}
                value={this.props.value}
                onChange={(e) => this.props.handleChange(e)}
                placeholder="Select..."
                itemRender={this.itemColor}
                virtual={{
                    total: this.state.total,
                    pageSize: pageSize,
                    skip: this.state.skip
                }}
                onPageChange={this.pageChange}   
                filterable={true}
                onFilterChange={this.handleFilterChange}
                disabled={this.props.disabled}
                />
                {this.props.submitted && (this.props.errorData==undefined || this.props.errorData==null || this.props.errorData.length <= 0) && <ErrorComponent />}
            </div>
        );
    }
}

export default CommonControl