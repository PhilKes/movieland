<template>
  <v-card class="dialog-card">
    <v-card-title>Add New Movie</v-card-title>
    <v-container>
      <v-row justify="center">
      </v-row>
      <v-row justify="center">
       <tmdb-search-table :existing-movies="existingMovies" ref="searchTable"
                          :tmdb-repo="tmdbRepo" />
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" outlined @click="$emit('submit',false)">Cancel</v-btn>
      <v-btn color="success" @click="submit">Add</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import TmdbSearchTable from "../../tables/tmdb-search-table";
  export default {
    name: "MovieAdd",
    components: {TmdbSearchTable},
    props: {
      tmdbRepo: Object,
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
          name: movie.name
        })))
      },

    }
  }
</script>

<style scoped>

</style>
