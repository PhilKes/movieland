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
            :loading="$fetchState.pending"
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
  components: { MovieCard },
  data() {
    return {
      movies: [],
      fetchHint: "",
    };
  },
  methods: {
    async refresh() {
      return await this.$repos.movies.all().catch((err) => {
        console.error("Error fetching movies: ", err.response);
        this.fetchHint =
          "Hint: The Backend was probably put into sleep mode, it takes additional time to wake it up. Will try to reload automatically...";
        return new Promise((resolve) => setTimeout(resolve, 6000)).then(() =>
          this.refresh()
        );
      });
    },
  },
  async fetch() {
    this.movies = await this.refresh();
    console.log("movies", this.movies);
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
