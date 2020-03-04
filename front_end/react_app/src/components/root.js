import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Login from "./login";
import Main from "./main";
import Signup from "./signup";

class Root extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
                <BrowserRouter>
                    <Switch>
                        <Route  path="/" exact component={Main}/>
                        <Route  path="/login" component={Login}/>
                        <Route  path="/signup" component={Signup}/>
                    </Switch>
                </BrowserRouter>
        )
    }
}

export default Root;