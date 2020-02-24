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
import React from "react";
import ReactDOM from "react-dom";

import { Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss";
import "./assets/css/demo.css";
import "./assets/sass/lbd/_App.scss";
import "./assets/css/pe-icon-7-stroke.css";

import App from "./App";
import {Router} from "react-router";
import history from "./history";

ReactDOM.render(
  <Router history={history} >
    <App/>
  </Router>,
  document.getElementById("root")
);
