import axios from "axios";
import AuthenticatedRoute from "./AuthenticatedRoute";

class AuthenticationService {
    executeBasicAuthenticationService(username, password) {
        return axios.get('api/auth', {
                headers: {authorization: this.createBasicAuthToken(username, password)}
            }
        );
    }

    createBasicAuthToken(username, password) {
        return 'Basic ' + window.btoa(username + ":" + password)
    }

    registerSuccessfulLogin(username, password) {
        //let basicAuthHeader = 'Basic ' +  window.btoa(username + ":" + password)
        //console.log('registerSuccessfulLogin')
        sessionStorage.setItem("AUTH_USER", username)
        this.setupAxiosInterceptors(this.createBasicAuthToken(username, password))
    }

    setupAxiosInterceptors(token) {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                return config
            }
        )
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem("AUTH_USER")
        if (user === null) {
            console.log("not logged in");
            return false
        }
        return true
    }
}

export default new AuthenticationService();