import React from "react";
import '../gui/css/common.css';
import '../gui/css/login_signup.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../gui/img/logo.png';

class Signup extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='signup_login_container'>
                <div id="bg-outer">
                    <div id="bg-inner">
                    </div>
                    <div className="wrap-form">
                        <form className="form">
                            <span className="form-title">Create Account for</span>
                            <div className="wrap-logo btm-space">
                                <img className="logo" src={Logo} alt="logo" />
                            </div>
                            <div className="btm-space">
                                <div className="wrap-form-input">
                                    <input type="text" name="username" placeholder="Username" minLength={4} maxLength={32} required />
                                </div>
                                <p className="helper">* 4 - 32 characters</p>
                            </div>
                            <div className="btm-space">
                                <div className="wrap-form-input">
                                    <input type="password" name="password" placeholder="Password" minLength={8} maxLength={128} required />
                                </div>
                                <p className="helper">* 8 - 128 characters</p>
                                <p className="helper">* At least 1 number, 1 special character, and both uppercase and lowercase letters</p>
                            </div>
                            <div>
                                <button className="btn btn-primary" type="submit">Sign up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;