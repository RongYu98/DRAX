import React from "react";
import {Route, Redirect} from 'react-router-dom';
import authenticator from "./Authenticator";

export const IfAuthenticatedRoute = ({path, component: Component, ...rest}) => {
    let isLoggined = authenticator.isAuthenticated();
    return(
        <Route {...path} render={
            (props) => {
               return (isLoggined) ? <Redirect to={
                   {
                       pathname: "/main",
                       state: {
                           from: props.location
                       }
                   }
               } /> :
                   <Component {...props} {...rest} />
            }
        }
        />
    );
};