<template>
  <v-container>
    <v-row justify="center">
      <h4>Admin Dashboard</h4>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-row>
          <v-col cols="6" xl="3">
            <stat-card color="success" icon="fas fa-dollar-sign"
                       title="Net Earnings" subtitle="Last 7 Days" :loading="loading"
            >
              {{stats.income | formatDollar}}
            </stat-card>
          </v-col>
          <v-col cols="6" xl="3">
            <stat-card color="secondary" icon="fas fa-calendar-alt"
                       title="Shows" subtitle="Last 7 Days"
                       :value="stats.amtShows" :loading="loading"
            />
          </v-col>
          <v-col cols="6" xl="3">
            <stat-card color="primary" icon="fas fa-film"
                       title="Movies" subtitle="Last 7 Days"
                       :value="stats.amtMovies" :loading="loading"
            />
          </v-col>
          <v-col cols="6" xl="3">
            <stat-card color="orange darken-2" icon="fas fa-user"
                       title="Sold Tickets" subtitle="Last 7 Days"
                       :value="stats.amtSeats" :loading="loading"
            />
          </v-col>
          <v-col cols="6" xl="6">
            <stat-card :img="stats.highestGrossingMovie.posterPath"
                       title="Highest Grossing" subtitle="Last 7 Days" :loading="loading">
              {{stats.highestGrossingMovie.grossing | formatDollar}}
            </stat-card>
          </v-col>
          <v-spacer/>
          <v-col cols="6" xl="6">
            <stat-card :img="stats.lowestGrossingMovie.posterPath"
                       title="Lowest Grossing" subtitle="Last 7 Days" :loading="loading">
              {{stats.lowestGrossingMovie.grossing | formatDollar}}
            </stat-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xl="12">
            <v-card>
              <v-container class="pa-0 ma-0">
                <v-row dense no-gutters justify="center">
                  <v-list-item-title class="mb-4 text-center" style="font-size: 0.8em; font-weight: bold">
                    Ticket Distribution
                  </v-list-item-title>
                </v-row>
                <v-row justify="center">
                    <client-only>
                      <component :is="apexchart" width="400px" :options="chartOptions"
                                 :series="series" style="margin-left: 100px!important;"
                      ></component>
                    </client-only>
                </v-row>
              </v-container>

            </v-card>
          </v-col>
        </v-row>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
  import moment from 'moment'
  import StatCard from "../../components/cards/StatCard";
  import Utils from "../../service/Utils";

  export default {
    name: "dashboard",
    components: {
      StatCard
    },
    data() {
      return {
        stats: {
          income: null,
          amtMovies: null,
          amtShows: null,
          amtSeats: null,
          highestGrossingMovie: {
            posterPath: null,
            grossing: null
          },
          lowestGrossingMovie: {
            posterPath: null,
            grossing: null
          },
          seatsDistribution: {
            ADULT: null,
            CHILD: null,
            DISABLED: null,
            STUDENT: null,
          }
        },
        loading: true,
        series: [],
        chartOptions: {
          legend: {
            position: 'right'
          },
          chart: {
            type: 'pie',
          },
          labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        },
      }
    },
    computed:{
      apexchart() {
        return () => {
          if (process.client) {
            return import('vue-apexcharts')
          }
        }
      }
    },
    async fetch() {
      this.series = [];
      this.chartOptions.labels = [];
      this.stats = await this.$repos.statistics.getSummary(moment().subtract(7, "days"), moment());
      Object.keys(this.stats.seatsDistribution).forEach(seatType => {
        this.chartOptions.labels.push(Utils.capitalize(seatType));
        this.series.push(this.stats.seatsDistribution[seatType]);
      })
      console.log("stats",this.stats)
      this.loading = false;
    }
  }
</script>

<style scoped lang="scss">

</style>
