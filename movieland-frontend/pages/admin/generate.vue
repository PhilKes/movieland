<template>
  <v-container>
    <v-row justify="center">
      <h4>Admin Generate Statistics</h4>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="pa-2" :loading="loading">
          <v-form :disabled="loading">
            <v-row justify="center">
              <v-col>
                <v-menu
                  transition="scale-transition"
                  :close-on-content-click="true"
                  min-width="290px"
                  class="mt-4"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-combobox
                      hide-details
                      v-model="from"
                      label="Start Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-combobox>
                  </template>
                  <v-date-picker
                    v-model="from"
                    no-title
                    scrollable
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col>
                <v-menu
                  transition="scale-transition"
                  :close-on-content-click="true"
                  min-width="290px"
                  class="mt-4"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-combobox
                      hide-details
                      v-model="until"
                      label="End Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-combobox>
                  </template>
                  <v-date-picker
                    v-model="until"
                    no-title
                    scrollable
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col>
                <v-btn-toggle v-model="selMode" color="info darken-2">
                  <v-btn color="info">All</v-btn>
                  <v-btn color="info" @click="openSelectMovies">Select</v-btn>
                </v-btn-toggle>
              </v-col>
              <v-col cols="auto" align-self="center" align="center">
                <v-btn
                  fab
                  elevation="0"
                  x-small
                  color="primary"
                  @click="deleteStats"
                  :disabled="loading"
                >
                  <v-icon>fas fa-trash</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-divider />
            <v-row>
              <v-col cols="12">
                <v-card-title>
                  <v-checkbox v-model="showsEnabled" dense />
                  Generate Shows
                </v-card-title>
                <v-form :disabled="!showsEnabled || loading">
                  <v-container>
                    <v-row justify="center">
                      <v-col>
                        <v-text-field
                          :disabled="selMode === 1"
                          v-model.number="showsForm.moviePerDay"
                          type="number"
                          label="Movies per Day"
                          prepend-icon="fas fa-film"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model.number="showsForm.showsPerMovie"
                          type="number"
                          prepend-icon="fas fa-calendar-alt"
                          label="Shows per Movie"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-col>
            </v-row>
            <v-divider />
            <v-row>
              <v-col cols="12">
                <v-card-title>
                  <v-checkbox v-model="reservationsEnabled" dense />
                  Generate Reservations
                </v-card-title>
                <v-form :disabled="!reservationsEnabled || loading">
                  <v-container>
                    <v-row justify="center">
                      <v-col>
                        <v-text-field
                          v-model.number="reservationsForm.resPerShow"
                          type="number"
                          label="Reservations per Show"
                          prepend-icon="fas fa-user"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-col>
            </v-row>
          </v-form>
          <v-card-actions>
            <v-row>
              <v-col>
                <v-btn
                  v-if="!loading"
                  color="success"
                  :disabled="(!reservationsEnabled && !showsEnabled) || loading"
                  @click="submitGenerate"
                >
                  Generate
                </v-btn>
                <v-progress-linear
                  v-else
                  rounded
                  :value="task.progress"
                  :indeterminate="task.indeterminate"
                  color="primary"
                  height="20"
                >
                  <template v-slot="{ value }">
                    <strong
                      :style="{ color: task.indeterminate ? 'black' : 'white' }"
                      >{{ task.message }}</strong
                    >
                  </template>
                </v-progress-linear>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
import DialogConfirm from "../../components/cards/DialogConfirm";
import MovieSelect from "../../components/forms/movie/MovieSelect";

export default {
  name: "AdminGenerate",
  data() {
    return {
      from: moment().format("YYYY-MM-DD"),
      until: moment().format("YYYY-MM-DD"),
      showsEnabled: true,
      reservationsEnabled: true,
      showsForm: {
        moviePerDay: 3,
        showsPerMovie: 3,
      },
      reservationsForm: {
        resPerShow: 3,
      },
      loading: false,
      task: {
        indeterminate: false,
        progress: 0,
        message: null,
      },
      taskFinished: false,
      taskQueue: [],
      selMode: 0,
      selectedMovies: [],
    };
  },
  watch: {
    taskFinished: function (val) {
      if (val === true) {
        if (this.taskQueue.length > 0) {
          this.taskQueue.pop()();
        }
      }
    },
  },
  methods: {
    submitGenerate() {
      this.loading = true;
      this.task.progress = 0;
      if (this.showsEnabled) {
        this.$repos.statistics
          .generateShows({
            ...this.showsForm,
            from: moment(this.from),
            until: moment(this.until),
            movIds:
              this.selMode === 1
                ? this.selectedMovies.map((movie) => movie.movId)
                : null,
          })
          .then((taskId) => {
            this.taskFinished = false;
            this.taskId = taskId;
            if (this.reservationsEnabled) {
              this.taskQueue.push(this.submitReservationGenerate);
            }
            this.pollTaskProgress(taskId);
          });
      } else if (this.reservationsEnabled) {
        this.submitReservationGenerate();
      }
    },
    submitReservationGenerate() {
      this.loading = true;
      this.task.progress = 0;
      this.$repos.statistics
        .generateReservations({
          ...this.reservationsForm,
          from: moment(this.from),
          until: moment(this.until),
          movIds:
            this.selMode === 1
              ? this.selectedMovies.map((movie) => movie.movId)
              : null,
        })
        .then((taskId) => {
          this.taskFinished = false;
          this.taskId = taskId;
          this.pollTaskProgress(taskId);
        });
    },
    async deleteStats() {
      let res = await this.$dialog.showAndWait(DialogConfirm, {
        text: ` <b>From:</b>${this.from}<br/><b>Until:</b> ${this.until}`,
        title: "Delete Statistics",
        submitText: "Delete",
        width: "400px",
      });
      if (res === true) {
        this.loading = true;
        this.task.message = "Deleting Statistics";
        this.task.indeterminate = true;
        this.$repos.statistics
          .deleteStats({ from: this.from, until: this.until })
          .then((resp) => {
            this.loading = false;
            this.task.indeterminate = false;
          });
      }
    },
    async openSelectMovies() {
      this.loading = true;
      let movies = await this.$repos.movies.all();
      this.loading = false;
      let res = await this.$dialog.showAndWait(MovieSelect, {
        existingMovies: movies,
        repos: this.$repos,
        width: "400px",
      });
      if (res !== false) {
        console.log("selected movies:", res);
        this.selectedMovies = res;
      }
    },
    pollTaskProgress(taskId) {
      setTimeout(() => {
        this.$repos.tasks.progress(taskId).then((task) => {
          this.task.progress =
            (Number(task.progress) / Number(task.progressMax)) * 100;
          this.task.message = task.message;
          if (task.progress !== task.progressMax) this.pollTaskProgress(taskId);
          else {
            this.loading = false;
            this.taskFinished = true;
          }
        });
      }, 200);
    },
  },
  head() {
    return {
      title: `Admin Generate`,
    };
  },
};
</script>

<style scoped lang="scss">
.generate-form:disabled {
  background-color: red !important;
}
</style>
