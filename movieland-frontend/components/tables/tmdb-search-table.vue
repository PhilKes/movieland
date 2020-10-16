<template>
  <v-data-table
    v-model="selected" show-select
    :loading="loading"
    :headers="headers"
    :items="movies"
    item-key="tmdbId" selectable-key="selectable"
    class="elevation-1"
    :items-per-page="10"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field :disabled="loading"
                      v-model="search"
                      label="Search" hide-details
        ></v-text-field>
        <v-btn color="success" @click="searchTmdb" :disabled="search.length<1">
          <v-icon>fas fa-search</v-icon>
        </v-btn>
      </v-toolbar>
    </template>

    <template v-slot:item.name="{ item }">
      <template class="disabled-text">
        {{item.name}}
      </template>
      <v-chip v-if="!item.selectable" disabled>Already Exists</v-chip>
    </template>

    <template v-slot:item.posterUrl="{ item }">
      <v-img :src="item.posterUrl" max-width="50"/>
    </template>

    <template v-slot:item.date="{ item }">
      {{item.date | formatDate}}
    </template>

  </v-data-table>
</template>

<script>
  export default {
    name: "TmdbSearchTable",
    props: {
      existingMovies: Array,
      tmdbRepo:Object
    },
    data() {
      return {
        selected:[],
        movies: [],
        loading: false,
        search: "",
        headers: [
          {
            value: 'posterUrl',
            text: 'Poster',
            sortable: false,
            width: '50px'
          },
          {
            value: 'name',
            text: 'Title',
          },
          {
            value: 'date',
            text: 'Date',
          }
        ],
      }
    },
    async mounted() {
      this.loading = true;
      this.movies = await this.tmdbRepo.topMovies();
      this.initMovieRows();
      this.loading = false;
    },
    /*watch:{
      movies(newMovies){
        console.log("movies changec");
        this.initMovieRows();
      }
    },*/
    methods: {
      async searchTmdb() {
        this.loading = true
        try {
          this.movies= await this.tmdbRepo.search(this.search);
          //this.emit('search',searchedMovies)
        } catch (e) {
          this.$dialog.message.success('TMDB Searched returned an error',
            {position: 'bottom-left', timeout: 3000, color: 'error'})
        }
        this.initMovieRows();
        this.loading = false
      },
      initMovieRows() {
        this.movies.forEach((movie, idx) => {
          movie.movId = idx;
          movie.selectable = true;
          if (this.existingMovies.some(existingMovie => existingMovie.name === movie.name)) {
            console.log("duplicate", movie.name)
            movie.selectable = false;
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
