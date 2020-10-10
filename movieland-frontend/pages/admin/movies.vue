<template>
  <v-container>
    <v-row justify="center">
      <h4>Movies Dashboard</h4>
    </v-row>
    <v-row justify="center">
      <v-data-table :loading="loading"
                    :headers="headers"
                    :items="movies"
                    item-key="movie"
                    class="elevation-1" sort-desc sort-by="date"
                    :search="search" :items-per-page="10"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-text-field
              v-model="search"
              label="Search TMDB Movies" hide-details append-icon="fas fa-search"
            ></v-text-field>
            <v-spacer/>
            <v-btn color="success" @click="addMovie">Add Movies</v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.posterUrl="{ item }">
          <v-img :src="item.posterUrl" max-width="80"/>
        </template>

        <template v-slot:item.date="{ item }">
          {{item.date | formatDate}}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="editMovie(item)" class="mr-2">
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn icon @click="deleteMovie(item)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-row>
  </v-container>
</template>

<script>
  import MovieDelete from "../../components/forms/movie/MovieDelete";
  import MovieAdd from "../../components/forms/movie/MovieAdd";
  import Utils from "../../service/Utils";

  export default {
    name: "movies",
    data() {
      return {
        movies: [],
        headers: [
          {
            value: 'posterUrl',
            text: 'Poster',
            sortable: false,
            width: '80px'
          },
          {
            value: 'name',
            text: 'Title',
          },
          {
            value: 'date',
            text: 'Date',
          },
          {text: 'Actions', value: 'actions', sortable: false},
          /* {
             value: 'description',
             text: 'Description',
             sortable: false
           }*/
        ],
        loading: true,
        search: ""
      }
    },
    async fetch() {
      this.movies = await this.$repos.movies.all();
      this.movies.forEach((movie, idx) => {movie.idx = idx;movie.exists=true;});
      console.log("movies", this.movies)
      this.loading = false
    },
    methods: {
      editMovie(movie) {
        console.log("edit movie")
      },
      async deleteMovie(movie) {
        console.log("delete movie")
        let del = await this.$dialog.showAndWait(MovieDelete, {title: movie.name})
        if (del === true) {
          this.loading=true;
          this.$repos.movies.remove(movie.movId).then(resp=>{
            this.movies.splice(movie.idx, 1);
            Utils.initIndex(this.movies)
            this.$dialog.message.success('Movies succesfully removed!',
              {position:'bottom-left',timeout:3000})
            this.loading=false;
          })

        }
      },
      async addMovie() {
        console.log("add movie")
        let newMovies = await this.$dialog.showAndWait(MovieAdd,
          {width: '620', tmdbRepo: this.$repos.tmdb,existingMovies: this.movies})
        if (newMovies !== false) {
          console.log(newMovies)
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
              {position:'bottom-left',timeout:3000})
            this.loading=false;
          })
          //Scroll to new movie
        }
      }
    }
  }
</script>

<style scoped>
</style>
