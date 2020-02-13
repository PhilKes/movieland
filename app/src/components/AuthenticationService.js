import axios from "axios";
import AuthenticatedRoute from "./AuthenticatedRoute";

/** Service to generate Authorization request + storing JWT Token*/
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
        sessionStorage.setItem("AUTH_USER", username)
        this.setupaxiosInterceptors(this.createBasicAuthToken(username, password))
    }

    /** Post Signin request, returns response with JWT Token  */
    executeJwtAuthenticationService(username, password) {
        return axios.post('api/auth/signin', {usernameOrEmail: username, password: password});
    }

    createJwtAuthHeader(token) {
        return 'Bearer ' + token;
    }

    /** Store JWT Token in sessionStorage + add auth header to all future axios requests*/
    registerJwtSuccessfulLogin(token) {
        //let basicAuthHeader = 'Basic ' +  window.btoa(username + ":" + password)
        //console.log('registerSuccessfulLogin')
        sessionStorage.setItem("JWT_TOKEN", token);
        this.setupaxiosInterceptors(this.createJwtAuthHeader(token))
    }

    logoutUser() {
        sessionStorage.removeItem("JWT_TOKEN");
        axios.interceptors.request.use(config => config);
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

}

export default new AuthenticationService();