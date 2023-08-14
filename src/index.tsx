import "bootstrap/dist/css/bootstrap.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import configureStore from "./store/configureStore";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import interceptorService from "../src/components/Interceptor";

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href") as string;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore(history);

navigator.serviceWorker.ready.then((registration) => {
    registration.unregister();
});

interceptorService.setupInterceptors(store);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);
