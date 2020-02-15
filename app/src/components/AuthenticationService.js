import axios from "axios";
import AuthenticatedRoute from "./AuthenticatedRoute";

/** Service to generate Authorization request + storing JWT Token*/
class AuthenticationService {

    constructor() {
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
        localStorage.setItem("AUTH_USER", username)
        this.setupaxiosInterceptors(this.createBasicAuthToken(username, password))
    }

    /** Post Signin request, returns response with JWT Token  */
    executeJwtAuthenticationService(username, password) {
        return axios.post('api/auth/signin', {usernameOrEmail: username, password: password});
    }

    createJwtAuthHeader(token) {
        return 'Bearer ' + token;
    }

    /** Store JWT Token in localStorage + add auth header to all future axios requests*/
    registerJwtSuccessfulLogin(token) {
        //let basicAuthHeader = 'Basic ' +  window.btoa(username + ":" + password)
        //console.log('registerSuccessfulLogin')
        localStorage.setItem("JWT_TOKEN", token);
        this.setupaxiosInterceptors(this.createJwtAuthHeader(token))

    }

    isAdmin() {

        let token = localStorage.getItem("JWT_TOKEN");
        let payload = this.parseJwt(token);
        return payload.authorities.find(auth => auth.authority === "ROLE_ADMIN") != null;
    }

    parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };

    logoutUser() {
        localStorage.removeItem("JWT_TOKEN");
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
        let token = localStorage.getItem("JWT_TOKEN");
        if (token === null) {
            return false
        }
        this.setupaxiosInterceptors(this.createJwtAuthHeader(token))
        return true
    }

    setUserName(username) {
        localStorage.setItem("USER", username)
    }

    getUserName() {
        return localStorage.getItem("USER");
    }

    //TODO is user ADMIN? -> do not allow e.g /shows to edit shows

}

export default new AuthenticationService();