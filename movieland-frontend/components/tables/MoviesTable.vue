<template>
  <v-data-table
    v-model="selected" show-select
    :loading="loading"
    :headers="headers"
    :items="movies"
    :search="noTmdb===true? search: null"
    :item-key="noTmdb!==true? 'tmdbId' : 'movId'" selectable-key="selectable"
    class="elevation-1"
    sort-desc :sort-by="noTmdb!==true? null: 'date'"
    :items-per-page="10"
    :single-select="singleSelect===true? true: false"
    @item-selected="$emit('select',$event)"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field :disabled="loading"
                      v-model="search"
                      :label="noTmdb!==true? 'Search Movies in TMDB': 'Search'"
                      hide-details
                      :append-icon="noTmdb!==true? null:'fas fa-search'"
        ></v-text-field>
        <v-btn v-if="noTmdb!==true" color="success" @click="searchTmdb" :disabled="search.length<1">
          <v-icon>fas fa-search</v-icon>
        </v-btn>
        <v-spacer/>
        <v-btn v-if="canDelete===true" color="error" @click="$emit('delete',selected)" class="mr-2"
               :disabled="selected.length < 1">
          <v-icon>fas fa-trash</v-icon>
        </v-btn>
        <v-btn v-if="canAdd===true" color="success" @click="$emit('add')">
          <v-icon>fas fa-plus</v-icon>
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
      <v-img :src="item.posterUrl" :max-width="large===true? '80': '50'"/>
    </template>

    <template v-slot:item.date="{ item }">
      {{item.date | formatDate}}
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn v-if="canDelete===true" color="error" elevation="0" small fab @click="$emit('delete',[item])">
        <v-icon>
          mdi-delete
        </v-icon>
      </v-btn>
    </template>

  </v-data-table>
</template>

<script>
  export default {
    name: "MoviesTable",
    props: {
      existingMovies: Array,
      repos: Object,
      noTmdb: Boolean,
      canDelete: Boolean,
      canAdd: Boolean,
      large: Boolean,
      singleSelect: Boolean
    },
    data() {
      const headers = [
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
      ];
      if (this.canDelete === true) {
        headers.push({text: 'Actions', value: 'actions', sortable: false});
      }
      return {
        selected: [],
        movies: [],
        loading: true,
        search: "",
        headers,
      }
    },
    mounted() {
      this.loadMovies();
    },
    watch: {
      existingMovies(movies) {
        this.loadMovies();
      }
    },
    methods: {
      async loadMovies() {
        this.loading = true;
        if (this.noTmdb !== true) {
          this.movies = await this.repos.tmdb.topMovies();
          this.initMovieRows();
        } else {
          this.movies = this.existingMovies;
        }
        this.loading = false;
      },
      async searchTmdb() {
        this.loading = true
        try {
          this.movies = await this.repos.tmdb.search(this.search);
          //this.emit('search',searchedMovies)
        } catch (e) {
          this.$dialog.message.success('TMDB Searched returned an error',
            {position: 'bottom-left', timeout: 3000, color: 'error'})
        }
        this.initMovieRows();
        this.loading = false
      },
      initMovieRows() {
        if (this.existingMovies == null)
          return;
        this.movies.forEach((movie, idx) => {
          movie.movId = idx;
          movie.selectable = true;
          if (this.existingMovies.some(existingMovie => existingMovie.name === movie.name)) {
            movie.selectable = false;
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
