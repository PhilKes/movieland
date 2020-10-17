import moment from "moment";

const qs = require('qs');

export default (ctx, inject) => {
  const axios = (ctx.$axios)

  const repositories = {
    movies: {
      all() {
        return axios.$get(`/movies`)
      },

      id(id) {
        return axios.$get(`/movies/${id}`)
      },
      trailer(id) {
        return axios.$get(`/movies/trailer/${id}`)
      },
      add(movie) {
        return axios.$post(`/movies`, movie)
      },
      remove(movId) {
        return axios.$delete(`/movies/${movId}`)
      }
    },
    tmdb: {
      search(search) {
        return axios.$get(`/movies/tmdb`, {params: {name: search}})
      },
      topMovies() {
        return axios.$get(`/movies/tmdb/top`)
      }
    },
    shows: {
      all() {
        return axios.$get(`/shows`)
      },
      add(show){
        return axios.$post('/shows',show)
      },
      remove(showId) {
        return axios.$delete(`/shows/${showId}`)
      },
      removeList(showIds) {
        return axios.$delete('/shows', {
          params: {
            showIds
          },
          paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})

        })
      },
      id(id) {
        return axios.$get(`/shows/${id}`)
      },
      showsOfMovieWeek(movId) {
        return axios.$get(`/shows/movies/${movId}`)
      },
      showInfos(date) {
        return axios.$get(`/shows/infos`, {params: {date: moment(date).format("YYYY-MM-DD")}})
      }
    },
    seats: {
      allOfShow(showId) {
        return axios.$get(`/seats/shows/${showId}`);
      }
    },
    reservations: {
      add(request) {
        return axios.$post(`/reservations`, request);
      },
      userReservation(id) {
        return axios.get(`/reservations/me/id/${id}`).then(resp => resp.data)
      },
      allUserReservations() {
        return axios.get(`/reservations/me/info`).then(resp => resp.data)
      }
    },
    statistics: {
      generateShows(showRequest) {
        return axios.$post(`/statistics/shows`, showRequest);
      },
      generateReservations(reservationRequest) {
        return axios.$post(`/statistics/reservations`, reservationRequest);
      },
      deleteStats(deleteRequest) {
        return axios.$delete(`/statistics/statistics`, {params: deleteRequest});
      },
      getSummary(from, until) {
        return axios.$get(`/statistics/summary`, {
          params: {
            from: moment(from).format("YYYY-MM-DD"),
            until: moment(until).format("YYYY-MM-DD")
          }
        })
      }
    },
    tasks: {
      progress(taskId) {
        return axios.$get(`/tasks/${taskId}`);
      }
    }
  }
  //...

  inject('repos', repositories)
  ctx.$repos = repositories;
}
