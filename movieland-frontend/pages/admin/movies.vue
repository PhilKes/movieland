<template>
  <v-container>
    <v-row justify="center">
      <h4>Movies Dashboard</h4>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <movies-table :existing-movies="movies" no-tmdb large can-delete can-add
                      :repos="$repos" @delete="deleteSelected" @add="addMovie"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import MovieDelete from "../../components/forms/movie/MovieDelete";
  import MovieAdd from "../../components/forms/movie/MovieAdd";
  import Utils from "../../service/Utils";
  import MovieEdit from "../../components/forms/movie/MovieEdit";
  import MoviesTable from "../../components/tables/MoviesTable";

  export default {
    name: "movies",
    components: {MoviesTable},
    data() {
      return {
        movies: [],
        loading: true,
      }
    },
    async fetch() {
      this.movies = await this.$repos.movies.all();
      this.movies.forEach((movie, idx) => {
        movie.idx = idx;
        movie.exists = true;
      });
      console.log("movies", this.movies)
      this.loading = false
    },
    methods: {
      async editMovie(movie) {
        let editedMovie = await this.$dialog.showAndWait(MovieEdit, {movie})
        if (editedMovie !== false) {
          this.loading = true;
          this.$repos.movies.update(editedMovie).then(updatedMovie => {
            updatedMovie.idx=movie.idx;
            this.movies[updatedMovie.idx]=updatedMovie;
            //Utils.initIndex(this.existingMovies)
            this.$dialog.message.success('Movies succesfully updated!',
              {position: 'bottom-left', timeout: 3000})
            console.debug("Updated",editedMovie)
            this.loading = false;
          })
        }
      },
      async deleteSelected(selected) {
        const titles = selected.length === 1 ? selected[0].name : selected.map(movie => movie.name);
        let del = await this.$dialog.showAndWait(MovieDelete, {title: titles})
        if (del === true) {
          this.loading = true;
          let promises = [];
          selected.forEach(delMovie => {
            promises.push(this.$repos.movies.remove(delMovie.movId).then(resp => {
              return delMovie.idx;
            }));
          })
          Promise.all(promises).then(removedIdxs => {
            removedIdxs.forEach(removeIdx =>{
              this.movies.splice(this.movies.findIndex(movie => movie.idx === removeIdx), 1)
            }
            );
            Utils.initIndex(this.movies);
            this.$dialog.message.success('Movies succesfully removed!',
              {position: 'bottom-left', timeout: 3000})
            this.loading = false;
          })
        }
      },
      async addMovie() {
        let newMovies = await this.$dialog.showAndWait(MovieAdd,
          {width: '620', repos: this.$repos, existingMovies: this.movies})
        console.log("newMovies",newMovies)
        if (newMovies && newMovies!==false) {
          this.loading = true;
          let promises = [];
          newMovies.forEach(newMovie => {
            promises.push(this.$repos.movies.add(newMovie).then(addedMovie => {
              this.movies.push(addedMovie)
              return addedMovie
            }));
          });
          Promise.all(promises).then(addedMovies => {
            this.$dialog.message.success('Movies succesfully added!',
              {position: 'bottom-left', timeout: 3000})
            console.debug("Added",addedMovies)
            this.loading = false;
          })
          //Scroll to new movie
        }
      }
    }
  }
</script>

<style scoped>
</style>
