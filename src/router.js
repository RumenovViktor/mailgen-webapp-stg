import React from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import DrawerNavigator from "./navigation/drawerNavigation";

import Dashboard from "./views/Dashboard";
import EmailTemplatesReport from "./views/EmailTemplatesReport";

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <DrawerNavigator content={<Dashboard />} />
                </Route>
                <Route path="/dashboard">
                    <Dashboard />
                </Route>
                <Route path="/templates">
                    <DrawerNavigator content={<EmailTemplatesReport />} />
                </Route>
            </Switch>
        </Router>
    )
}

export default Routes