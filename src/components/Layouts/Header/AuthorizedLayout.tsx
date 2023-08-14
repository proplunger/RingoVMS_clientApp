import NavMenu from "./NavMenu";
import * as React from "react";
import Footer from "../Footer/Footer";
import { actionCreators } from "../../../store/Global";
import { ApplicationState } from "../../../store";
import { connect } from "react-redux";
import * as GlobalStore from "../../../store/Global";
interface IProps {
    children?: React.ReactNode;
    title ?: any;
}

type Props = IProps & GlobalStore.GlobalState &
typeof GlobalStore.actionCreators;

 class AuthorizedLayout extends React.Component<Props, {}> {
    public render() {
        // actionCreators.updatePageTitle(this.props.title)
       this.props.updatePageName(this.props.title);
        return (
            <div id="authorizedLayout" className="layout">
                <NavMenu />
                <div className="padding-bottom-forall">{this.props.children}</div>
                {/* <div style={{ paddingBottom: "44px" }}>{this.props.children}</div> */}
                <Footer />
            </div>
        );
    }
}
export default connect(
    (state: ApplicationState) => state.global, // Selects which state properties are merged into the component's props
    GlobalStore.actionCreators // Selects which action creators are merged into the component's props
  )(AuthorizedLayout as any);
  