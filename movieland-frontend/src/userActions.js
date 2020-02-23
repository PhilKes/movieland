/*!

=========================================================
* Light Bootstrap UserDashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import MovieShow from "./webviews/MovieShow";
import {
  faAddressCard,
  faFilm,
  faSignInAlt,
  faSignOutAlt,
  faUser,
  faUserPlus,
  faVideo
} from "@fortawesome/free-solid-svg-icons";
import AuthenticationService from "./service/AuthenticationService";
import Login from "./webviews/Login";
import Logout from "./webviews/Logout";
import Register from "./webviews/Register";
import UserDashboard from "./webviews/UserDashboard";

/** Defines Actions for logged in User / not logged in Visitor*/
const loggedInActions = [
    {
        path: "/user/me",
        name: "Account",
        icon: faUser,
        component: UserDashboard,
        onAction: false
    },
    {
        path: "/logout",
        name: "Logout",
        icon: faSignOutAlt,
        component: Logout,
        onAction: true
    }

];const loggedOutActions = [
  {
    path: "/login",
    name: "Login",
    icon: faSignInAlt,
    component: Login,
    onAction: true
  },
  {
    path: "/register",
    name: "Register",
    icon: faUserPlus,
    component: Register,
    onAction: faFilm
  }
];

export {loggedInActions,loggedOutActions};
