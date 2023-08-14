import * as React from "react";
import { RouteComponentProps } from "react-router";


interface IProps {
    children: any;
}

type Props = IProps & RouteComponentProps<any> ;

export default class GuestLayout extends React.Component<Props, {}> {
    public render() {

        return <div id="guestLayout" className="layout">
                <div className="container container-content">
                    {this.props.children}
                </div>
            </div>;
    }
}