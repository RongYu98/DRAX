import React from "react";
import {Route, Redirect} from 'react-router-dom';
import authenticator from "./Authenticator";

export const ProtectedRoute = ({path, component: Component, ...rest}) => {
    return(
        <Route {...path} render={
            (props) => {
                if(authenticator.isAuthenticated()){
                    return <Component {...props} {...rest}/>
                }else{
                    return <Redirect to={
                        {
                            pathname: "/login",
                            state: {
                                from: props.location
                            }
                        }
                    }/>
                }
            }
        }
        />
    );
};