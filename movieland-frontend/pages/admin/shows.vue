<template>
  <v-container>
    <v-row justify="center">
      <h4>Movie Shows</h4>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-data-table
          :loading="loading"
          :headers="headers"
          :items="movieInfos"
          v-model="selected"
          item-key="movId"
          class="elevation-1"
          sort-desc
          sort-by="date"
          :search="search"
          :items-per-page="10"
          show-select
        >
          <template v-slot:top>
            <template>
              <v-toolbar flat class="pt-2">
                <v-menu
                  transition="scale-transition"
                  :close-on-content-click="true"
                  min-width="290px"
                  class="mt-4"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-combobox
                      hide-details
                      v-model="dateRangeText"
                      label="Date Range"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-combobox>
                  </template>
                  <v-date-picker v-model="dates" no-title scrollable>
                  </v-date-picker>
                </v-menu>
                <v-btn @click="selectToday" color="primary" tile> Today </v-btn>
                <v-btn
                  @click="findShows"
                  color="success"
                  class="mr-2 rounded-tr rounded-br"
                  tile
                >
                  <v-icon>fas fa-search</v-icon>
                </v-btn>
                <v-btn
                  @click="deleteSelectedMovies"
                  color="error"
                  :disabled="selected.length < 1 || loading"
                >
                  <v-icon>fas fa-trash</v-icon>
                </v-btn>
                <v-btn @click="addShow" color="success">
                  <v-icon>fas fa-plus</v-icon>
                </v-btn>
              </v-toolbar>
            </template>
          </template>

          <template v-slot:item.posterUrl="{ item }">
            <v-img :src="item.posterUrl" max-width="80" />
          </template>

          <template v-slot:item.details="{ item }">
            {{ item.name }}<br />
            ({{ item.date | formatDate }})
          </template>

          <template v-slot:item.shows="{ item }">
            <v-row justify="center">
              <v-simple-table
                dense
                style="background-color: transparent"
                v-model="selected"
              >
                <template v-slot:default>
                  <!--    <thead>
                      <tr>
                        <th v-for="(show,idx) of item.shows" style="width: 30px!important;">
                          {{key | formatDateName }}
                        </th>
                      </tr>
                      </thead>-->
                  <tbody>
                    <tr v-for="(show, idx) of item.shows">
                      <td class="border-no-bottom">
                        <v-row
                          dense
                          justify="center"
                          align="center"
                          align-content="center"
                        >
                          <div
                            class="show-item"
                            v-on:click="
                              $router.push(
                                `/movies/${item.movId}/shows/${show.showId}`
                              )
                            "
                          >
                            <p>
                              {{ show.date | formatTime }}
                              <v-btn
                                fab
                                color="error"
                                elevation="0"
                                class="btn-tiny"
                                v-on:click.stop="deleteSingleShow(show)"
                              >
                                <v-icon>fas fa-trash</v-icon>
                              </v-btn>
                            </p>
                          </div>
                        </v-row>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-row>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              fab
              x-small
              color="error"
              class="mr-2"
              elevation="0"
              @click="deleteMovieShows(item)"
            >
              <v-icon>fas fa-trash</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
import DialogConfirm from "../../components/cards/DialogConfirm";
import MovieAdd from "../../components/forms/movie/MovieAdd";
import ShowAdd from "../../components/forms/shows/ShowAdd";

export default {
  name: "AdminShows",
  data() {
    return {
      dates: moment().format("YYYY-MM-DD"),
      movieInfos: [],
      headers: [
        {
          value: "posterUrl",
          text: "Poster",
          sortable: false,
          width: "80px",
          align: "center",
        },
        {
          value: "details",
          text: "Details",
          align: "center",
        },
        {
          value: "shows",
          text: "Shows",
          width: "30%",
          sortable: false,
          align: "center",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      selected: [],
      loading: true,
      search: "",
    };
  },
  async fetch() {},
  mounted() {
    this.findShows();
  },
  methods: {
    async findShows() {
      this.loading = true;
      this.movieInfos = await this.$repos.shows.showInfos(this.dates);
      this.loading = false;
    },
    selectToday() {
      this.dates = moment().format("YYYY-MM-DD");
      this.findShows();
    },
    async deleteSingleShow(show) {
      let res = await this.$dialog.showAndWait(DialogConfirm, {
        text: "Do you really want to delete this show?",
        title: "Delete Show",
        width: "400px",
        submitText: "Delete",
      });
      if (res === true) {
        this.loading = true;
        this.$repos.shows.remove(show.showId).then((resp) => {
          this.findShows();
          this.loading = false;
        });
      }
    },
    async deleteMovieShows(movie) {
      let showTexts = movie.shows
        .map((show) => moment(show.date).format("DD.MM HH:mm [h]"))
        .join("<br/>");
      let res = await this.$dialog.showAndWait(DialogConfirm, {
        text: `Do you really want to delete these shows ?<br/><b>Movie:</b><br/>${movie.name}<br/><b>Dates:</b><br/>${showTexts}`,
        title: "Delete Shows",
        width: "400px",
        submitText: "Delete",
        cancel: true,
      });
      if (res === true) {
        this.loading = true;
        await this.$repos.shows.removeList(
          movie.shows.map((show) => show.showId)
        );
        this.findShows();
      }
    },
    async deleteSelectedMovies() {
      let movNames = this.selected
        .map((movieInfo) => movieInfo.name)
        .join("<br/>");
      let res = await this.$dialog.showAndWait(DialogConfirm, {
        text: `Do you really want to delete all Shows for<br/><b>Dates:</b><br/>${this.dates}<br/><b>Movies:</b><br/>${movNames}<br/>`,
        title: "Delete Shows",
        width: "400px",
        submitText: "Delete",
        cancel: true,
      });
      if (res === true) {
        let shows = [];
        this.selected.forEach((movieInfo) =>
          movieInfo.shows.forEach((show) => shows.push(show.showId))
        );
        this.loading = true;
        await this.$repos.shows.removeList(shows);
        this.selected = [];
        this.findShows();
      }
    },
    async addShow() {
      let allMovies = await this.$repos.movies.all();
      let newShows = await this.$dialog.showAndWait(ShowAdd, {
        width: "800px",
        repos: this.$repos,
        movies: allMovies,
      });
      if (newShows && newShows !== false) {
        this.loading = true;
        let promises = [];
        newShows.forEach((show) => {
          promises.push(this.$repos.shows.add(show));
        });
        Promise.all(promises).then((addedShows) => {
          this.$dialog.message.success("Show succesfully added!", {
            position: "bottom-left",
            timeout: 3000,
          });
          console.debug("Added", addedShows);
          this.findShows();
        });
      }
    },
  },

  computed: {
    dateRangeText() {
      return this.dates;
    },
  },
  head() {
    return {
      title: `Admin Shows for ${this.dates}`,
    };
  },
};
</script>

<style scoped lang="scss">
.v-data-table tbody tr:hover:not(.v-data-table__expanded__content) {
  background: transparent !important;
}

.show-item {
  width: 6em;
  height: 2em;
  text-align: center;
  background-color: rgba(199, 57, 57, 0.3);
  margin-bottom: 0.1rem;

  &:hover {
    //border-radius: 10%;
    cursor: pointer;
    background-color: rgba(199, 57, 57, 0.6);
  }

  p {
    color: darken(red, 30);
  }
}

.show-time {
  background-color: var(--v-primary-lighten2);
  color: var(--v-primary-lighten4);

  &:hover {
    color: var(--v-primary-lighten5);
  }
}
</style>
