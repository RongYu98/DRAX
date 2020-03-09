import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Login from "./Login";
import Main from "./Main";
import Signup from "./Signup";
import {ProtectedRoute} from "../common/ProtectedRoute";
import {IfAuthenticatedRoute} from "../common/IfAuthenticatedRoute";

class Root extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        // will need to do something here to check if an authenticated session(from cookies or what not) is in place.
        // will probably just make request to server to verify if there is a valid session since cookies can be stale.
        return(
                <BrowserRouter>
                    {/*redirects to /main if landed on / */}
                    <Switch>
                        <Route exact path='/'  component={(props) =>
                            <Redirect {...props} to={
                                {
                                    pathname: "/main",
                                    state: {
                                        from: props.location
                                    }
                                }
                            }/>}
                        />
                        {/* /login and /signed up will redirect to main if already loggined*/}
                        <IfAuthenticatedRoute  path="/login" component={Login}/>
                        <IfAuthenticatedRoute  path="/signup" component={Signup}/>
                        {/*/main will redirect to login if not authenticated else serve the main content*/}
                        <ProtectedRoute path="/main" component={Main}/>
                    </Switch>
                </BrowserRouter>
        )
    }
}

export default Root;