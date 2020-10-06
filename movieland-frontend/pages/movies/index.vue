<template>
  <v-container fluid>
    <v-toolbar-title>Movies</v-toolbar-title>

    <!-- <v-list-item v-for="(movie,idx) of movies" :key="'movie'+idx">
       <v-list-item-name>{{movie.name}}</v-list-item-name>
       <v-list-item-action-text>
         Description:{{movie.description}}<br/>
         Start date:{{movie.date}}
       </v-list-item-action-text>
       <v-list-item-action>Shows</v-list-item-action>
     </v-list-item>-->
    <movie-card v-for="movie of movies" :movie="movie" :key="movie.title" class="mb-4"/>

  </v-container>

</template>

<script>
  import MovieCard from "../../components/cards/MovieCard";

  export default {
    name: "index.vue",
    components: {MovieCard},
    data() {
      return {
        movies: [
          /* {
             name: 'Star Wars',
             posterUrl: 'https://i.ebayimg.com/images/g/6CAAAOSwaSheNtg0/s-l1600.jpg',
             description:'A long time ago, in a galaxy far far away',
             director:'George Lucas',
             date: new Date("1977-10-10")
           },
           {
             name: 'Indiana Jones',
             posterUrl: 'https://i.ebayimg.com/images/g/6CAAAOSwaSheNtg0/s-l1600.jpg',
             description:'Harison Ford alone in the desert',
             director: 'Stephen Spielberg',
             date: new Date("1980-10-10")
           },*/
        ]
      }
    },
    async asyncData(context) {
      const movies = await context.$repos.movies.all();
      return {
        movies
      }
    }
  }
</script>

<style scoped>

</style>
