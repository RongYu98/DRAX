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
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route  path="/" exact component={Main}/>
                        <Route  path="/login" component={Login}/>
                        <Route  path="/signup" component={Signup}/>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default Root;