<template>
  <v-container fluid>
    <v-row justify="center">
      <v-toolbar-title>Movies</v-toolbar-title>
    </v-row>
    <v-row justify="center">
      <v-col>
        <v-list>
          <movie-card v-for="(movie,i) of movies" :movie="movie" :show-view="false"
                      :key="'movieCard'+i" :loading="loading" class="mb-4"/>
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
      }
    },
    async fetch() {
      this.movies = await this.$repos.movies.all();
      console.log("movies",this.movies)
      setTimeout(() => this.loading = false, 0);
    }
  }
</script>

<style scoped>

</style>
