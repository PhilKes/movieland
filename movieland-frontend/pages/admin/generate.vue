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
                <v-menu transition="scale-transition" :close-on-content-click="true"
                        min-width="290px" class="mt-4">
                  <template v-slot:activator="{ on, attrs }">
                    <v-combobox hide-details v-model="showsForm.from" label="Start Date" prepend-icon="mdi-calendar"
                                readonly v-bind="attrs" v-on="on"></v-combobox>
                  </template>
                  <v-date-picker v-model="showsForm.from" no-title scrollable></v-date-picker>
                </v-menu>
              </v-col>
              <v-col>
                <v-menu transition="scale-transition" :close-on-content-click="true"
                        min-width="290px" class="mt-4">
                  <template v-slot:activator="{ on, attrs }">
                    <v-combobox hide-details v-model="showsForm.until" label="End Date" prepend-icon="mdi-calendar"
                                readonly v-bind="attrs" v-on="on"></v-combobox>
                  </template>
                  <v-date-picker v-model="showsForm.until" no-title scrollable></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-divider/>
            <v-row>
              <v-col cols="12">
                <v-card-title>
                  <v-checkbox v-model="showsEnabled" dense/>
                  Generate Shows
                </v-card-title>
                <v-form :disabled="!showsEnabled || loading">
                  <v-container>
                    <v-row justify="center">
                      <v-col>
                        <v-text-field v-model.number="showsForm.moviePerDay" type="number" label="Movies per Day"
                                      prepend-icon="fas fa-film"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field v-model.number="showsForm.showsPerMovie" type="number"
                                      prepend-icon="fas fa-calendar-alt"
                                      label="Shows per Movie"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-col>
            </v-row>
            <v-divider/>
            <v-row>
              <v-col cols="12">
                <v-card-title>
                  <v-checkbox v-model="reservationsEnabled" dense/>
                  Generate Reservations
                </v-card-title>
                <v-form :disabled="!reservationsEnabled || loading">
                  <v-container>
                    <v-row justify="center">
                      <v-col>
                        <v-text-field v-model.number="reservationsForm.resPerShow" type="number"
                                      label="Reservations per Show" prepend-icon="fas fa-user"></v-text-field>
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
                  <v-btn v-if="!loading" color="success" :disabled="!reservationsEnabled && !showsEnabled || loading" @click="submitGenerate">
                    Generate
                  </v-btn>
                  <v-progress-linear v-else color="primary" height="10" value="10" striped></v-progress-linear>
                </v-col>
              </v-row>
            </v-card-actions>
        </v-card>

      </v-col>
    </v-row>


  </v-container>
</template>

<script>
  import moment from 'moment';

  export default {
    name: "AdminGenerate",
    data() {
      return {
        showsEnabled: true,
        reservationsEnabled: true,
        showsForm: {
          from: moment().format("YYYY-MM-DD"),
          moviePerDay: 3,
          showsPerMovie: 3,
          until: moment().format("YYYY-MM-DD")
        },
        reservationsForm: {
          from: moment().format("YYYY-MM-DD"),
          resPerShow: 3,
          until: moment().format("YYYY-MM-DD")
        },
        loading: false,
      }
    },
    methods: {
      submitGenerate() {
        console.log("submit shows")
        this.loading = true;
        setTimeout(() => {
          this.loading = false
        }, 2000)
      }
    }
  }
</script>

<style scoped lang="scss">
  .generate-form:disabled {
    background-color: red !important;
  }
</style>
