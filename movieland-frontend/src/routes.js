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
import AdminDashboard from "./webviews/admin/AdminDashboard.jsx";
import UserProfile from "./views/UserProfile.jsx";
import MovieShow from "./webviews/MovieShow";
import MovieList from "./webviews/MovieList";
import {faAddressCard, faFilm, faUser, faVideo} from "@fortawesome/free-solid-svg-icons";
import MovieListEdit from "./webviews/admin/MovieListEdit";
import MovieShowList from "./webviews/admin/MovieShowList";

const adminRoutes = [
  {
    path: "/movies",
    name: "Movies",
    icon: faFilm,
    component: MovieList,
    show: true,
  },
  {
    path: "/movies/edit",
    name: "Manage Movies",
    icon: faFilm,
    component: MovieListEdit,
    show: true,
  },
  {
    path: "/shows",
    name: "Shows",
    icon: faVideo,
    component: MovieShowList,
    show: true,
  },
  {
    path: "/dashboard",
      name: "AdminDashboard",
    icon: faAddressCard,
      component: AdminDashboard,
    show: true,
  },
  {
    path: "/show/:showId",
    name: "Show",
    icon: faVideo,
    component: MovieShow,
    show: false,
  },
    /*
  {
    path: "/table",
    name: "Table List",
    icon: "pe-7s-note2",
    component: TableList,
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "pe-7s-news-paper",
    component: Typography,
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "pe-7s-science",
    component: Icons,
  },*/
];

const userRoutes = [
  {
    path: "/movies",
    name: "Movies",
    icon: faFilm,
    component: MovieList,
    show: true,
  },
  {
    path: "/show/:showId",
    name: "Show",
    icon: faVideo,
    component: MovieShow,
    show: false,
  },
];

export {userRoutes,adminRoutes};
