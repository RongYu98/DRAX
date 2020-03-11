import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // global css
import '../gui/css/common.css'; // global css
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Login from "./Login";
import Main from "./Main";
import Signup from "./Signup";
import {ProtectedRoute} from "../common/ProtectedRoute";
import {IfAuthenticatedRoute} from "../common/IfAuthenticatedRoute";
import {Not_Found} from "./Not_Found";
import Authenticator from "../common/Authenticator";

class Root extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            valid_initial_session: null
        }
    }

    componentDidMount() {
        // sets if the there was existing initial session only.
        Authenticator.checkAlive().then(()=>{
            this.setState({valid_session: Authenticator.isAuthenticated()});
        });
    }


    render() {
        if(this.state.session === null){
            return (
                <div /> // return blank page until check alive is run
            )
        }
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
                        <Route component={Not_Found}/>
                    </Switch>
                </BrowserRouter>
        )
    }
}

export default Root;