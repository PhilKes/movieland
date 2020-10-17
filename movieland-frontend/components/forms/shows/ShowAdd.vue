<template>
  <v-card class="dialog-card">
    <v-card-title>Add New Show</v-card-title>
    <v-container>
      <v-row justify="center">
        <v-expansion-panels v-model="panel" accordion tile>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-chip color="transparent" class="no-hover">
                <v-icon v-if="movieSelected" color="success" dense left size="18">
                  fas fa-check-circle
                </v-icon>
                <h2>Select Movie</h2>
              </v-chip>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <movies-table :existing-movies="movies" ref="searchTable" :repos="repos" single-select
                            @select="onMovieSelect"
                            no-tmdb/>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-chip color="transparent" class="no-hover">
                <v-icon v-if="dateSelected" color="success" dense left size="18">
                  fas fa-check-circle
                </v-icon>
                <h2>Select Date and Time</h2>
              </v-chip>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-spacer/>
                <VueCtkDateTimePicker
                  :text-field-props="{'outlined':true}"
                  :minute-interval="10"
                  color="var(--v-primary-base)"
                  no-button-now
                  inline
                  format="YYYY-MM-DD HH:mm"
                  no-keyboard
                  v-model="date"
                ></VueCtkDateTimePicker>
                <v-spacer/>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" outlined @click="$emit('submit',false)">Cancel</v-btn>
      <v-btn color="success" @click="submit" :disabled="!movieSelected ||!dateSelected">Add</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import moment from 'moment'
  import MoviesTable from "../../tables/MoviesTable";

  export default {
    name: "ShowAdd",
    components: {MoviesTable},
    props: {
      repos: Object,
      movies: Array,
    },
    data() {
      return {
        selected: [],
        loading: true,
        date: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        panel: 0,
        movieSelected: false,
        dateSelected: true,
      }
    },

    methods: {
      submit() {
        this.$emit('submit', this.$refs.searchTable.selected.map(movie => ({
          movId: movie.movId,
          date: moment(this.date)
        })))
      },
      onMovieSelect(movie) {
        this.movieSelected =
          this.$refs.searchTable.selected.length === 1 && movie.value !== false
        || movie.value===true ||this.$refs.searchTable.selected.length >1 && movie.value===false;
        if(this.movieSelected===true)
          this.panel=1;
      }
    }
  }
</script>

<style scoped>

</style>
