import {SERVER_URL, STATUS_OK, DEBUGGING} from "./Constants";

const LOGIN_ENDPOINT = '/login';
class Authenticator{

    constructor() {
        this.authenticated = (DEBUGGING) ? true : false;
    }


    // for logging in users only
    async login(username, password){
        try{
            let body = {username: username, password: password};
            let response = await fetch(
                SERVER_URL + LOGIN_ENDPOINT,
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({username: username , password: password})
                }
            );
            if(!response.ok) throw new Error(response.statusText);
            let response_json = await response.json();
            if(response_json.status !== 200) throw new Error(response_json.result);
            this.authenticated = true;
        } catch (err) {
            return err.message;
        }
    }

    // unimplemented
    async logout(){

    }

    isAuthenticated(){
        return this.authenticated;
    }
}

// exporting a new instance as singleton
export default new Authenticator();