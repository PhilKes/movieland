import axios from "axios";
import AuthenticatedRoute from "./AuthenticatedRoute";

class AuthenticationService {


    constructor() {
        this.userName = '';
    }

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
        this.setupaxiosInterceptors(this.createBasicAuthToken(username, password))
    }

    executeJwtAuthenticationService(username, password) {
        return axios.post('api/auth/signin', {usernameOrEmail: username, password: password});
    }

    createJwtAuthHeader(token) {
        return 'Bearer ' + token;
    }

    registerJwtSuccessfulLogin(token) {
        //let basicAuthHeader = 'Basic ' +  window.btoa(username + ":" + password)
        //console.log('registerSuccessfulLogin')
        sessionStorage.setItem("JWT_TOKEN", token);
        this.setupaxiosInterceptors(this.createJwtAuthHeader(token))
    }

    setupaxiosInterceptors(token) {
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
        let token = sessionStorage.getItem("JWT_TOKEN");
        if (token === null) {
            return false
        }
        this.setupaxiosInterceptors(this.createJwtAuthHeader(token))
        return true
    }

    setUserName(username) {
        this.userName = username;
        if (this.isUserLoggedIn()) {

        }
    }
}

export default new AuthenticationService();