<template>
  <v-card class="dialog-card">
    <v-card-title>Add New Movie</v-card-title>
    <v-container>
      <v-row justify="center">
      </v-row>
      <v-row justify="center">
       <movies-table :existing-movies="existingMovies" ref="searchTable" no-tmdb
                          :repos="repos" />
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!--<v-btn color="secondary" outlined @click="$emit('submit',false)">Cancel</v-btn>-->
      <v-btn color="success" @click="submit">Ok</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import MoviesTable from "../../tables/MoviesTable";
  export default {
    name: "MovieSelect",
    components: {MoviesTable},
    props: {
      repos: Object,
      existingMovies: Array
    },
    data() {
      return {
        selected: [],
        loading: false
      }
    },

    methods: {

      submit() {
        this.$emit('submit', this.$refs.searchTable.selected.map(movie => ({
          /* tmdbId: movie.tmdbId,*/
          name: movie.name,
          movId: movie.movId
        })))
      },

    }
  }
</script>

<style scoped>

</style>
