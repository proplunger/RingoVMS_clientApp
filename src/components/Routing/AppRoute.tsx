import { Route, RouteProps, Redirect } from "react-router";
import * as React from "react";
import { Helmet } from "react-helmet";
import { RINGO_NEXTGEN } from "../Shared/AppConstants";
export interface IProps extends RouteProps {
    layout: React.ComponentClass<any>;
    pageTitle?: string;
}

export const AppRoute = ({ component: Component, layout: Layout, path: Path, pageTitle: pageTitle, ...rest }: IProps) => {
    return (
        <Route
            {...rest}
            render={(props) => (
                <Layout>
                    <Helmet>
                        <title>{RINGO_NEXTGEN} - {pageTitle}</title>
                    </Helmet>
                    <Component {...props} />
                </Layout>
            )}
        />
    );
};
