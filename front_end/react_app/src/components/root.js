import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Login from "./login";
import Main from "./main";
import Signup from "./signup";
import {ProtectedRoute} from "../common/protectedRoute";

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
                        <Route  path="/login" component={Login}/>
                        <Route  path="/signup" component={Signup}/>
                        {/*/main will redirect to login if not authenticated else serve the main main content*/}
                        <ProtectedRoute path="/main" component={Main}/>
                    </Switch>
                </BrowserRouter>
        )
    }
}

export default Root;