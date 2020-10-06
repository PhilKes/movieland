<template>
  <movie-details-card :movie="movie" :shows="shows"/>
</template>

<script>
  import MovieDetailsCard from "../../../components/cards/MovieDetailsCard";

  export default {
    name: "MovieDetails",
    components: {
      MovieDetailsCard
    },
    data: () => ({
      movie: null,
      shows: []
    }),
    async fetch() {
      console.log(this.$route.params.movId, this.$route.params.showId)
      this.movie = await this.$repos.movies.id(this.$route.params.movId);
      this.shows = await this.$repos.shows.showsOfMovieWeek(this.$route.params.movId);
      this.shows.forEach(show => show.date = new Date(show.date));
      console.log(this.movie, this.shows)
    }
  }
</script>

<style scoped>

</style>
