<template>
  <v-container fluid>
    <v-row justify="center">
      <v-toolbar-title>Movies</v-toolbar-title>
    </v-row>
    <v-row v-if="$fetchState.pending">
      <v-container>
        <v-row justify="center">
          <v-progress-circular
            :size="80"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-row>
        <v-row justify="center">
          <h4>Fetching Movies...</h4>
        </v-row>
        <v-row justify="center" class="mt-4">
          <h5>{{fetchHint}}</h5>
        </v-row>
      </v-container>
    </v-row>
    <v-row v-else-if="$fetchState.error">
      <v-container>
        <v-row justify="center">
          <h4>An error while fetching from the backend occurred, make sure its running!</h4>
        </v-row>
      </v-container>
    </v-row>
    <v-row v-else justify="center">
      <v-col>
        <v-list>
          <movie-card
            v-for="(movie, i) of movies"
            :movie="movie"
            :show-view="false"
            :key="'movieCard' + i"
            :loading="loading"
            class="mb-4"
          />
        </v-list>
        <v-spacer/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import MovieCard from "../../components/cards/MovieCard";

  export default {
    name: "index.vue",
    components: {MovieCard},
    data() {
      return {
        movies: [],
        loading: true,
        fetchHint: ""
      };
    },
    async fetch() {
      setTimeout(() => (this.fetchHint = "Hint: The Backend was probably put in sleep mode by Heroku, it takes additional time to wake it up"), 6000);
      this.movies = await this.$repos.movies.all();
      console.log("movies", this.movies);
      this.fetchHint="";
    },
    head() {
      return {
        title: "Movies",
      };
    },
  };
</script>

<style scoped>
</style>
