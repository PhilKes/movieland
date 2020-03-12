import axios from "axios";
import https from 'https';

/** Service to generate Authorization request + storing JWT Token*/
class AuthenticationService {


    constructor() {
        this.CancelToken = axios.CancelToken;
        this.cancelSource = this.CancelToken.source();
    }

    executeBasicAuthenticationService(username, password) {
        return axios.get('/api/auth', {
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

    isAdmin() {
        let token = sessionStorage.getItem("JWT_TOKEN");
        let payload = this.parseJwt(token);
        return payload.authorities.find(auth => auth.authority === "ROLE_ADMIN") != null;
    }

    isCashier() {
        let token = sessionStorage.getItem("JWT_TOKEN");
        let payload = this.parseJwt(token);
        return payload.authorities.find(auth => auth.authority === "ROLE_CASHIER") != null;
    }

    /*  getLoggedInUserId() {
          let token = sessionStorage.getItem("JWT_TOKEN");
          let payload = this.parseJwt(token);
          return payload.userId;
      }*/

    parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };

    logoutUser() {
        sessionStorage.removeItem("JWT_TOKEN");
        axios.interceptors.request.use(config => config);
    }

    setupaxiosInterceptors(token) {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                config.httpsAgent = agent;
                config.cancelToken = this.cancelSource.token;
                return config
            }
        )
    }

    cancelAllAxios() {
        this.cancelSource.cancel("Cancel all request due to redirect");
        this.CancelToken = axios.CancelToken;
        this.cancelSource = this.CancelToken.source();
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
        sessionStorage.setItem("USER", username)
    }

    getUserName() {
        return sessionStorage.getItem("USER");
    }

    //TODO is user ADMIN? -> do not allow e.g /shows to edit shows

}

export default new AuthenticationService();