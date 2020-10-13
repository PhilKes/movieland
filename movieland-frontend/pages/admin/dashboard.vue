<template>
  <v-container>
    <v-row justify="center">
      <h4>Admin Dashboard</h4>
    </v-row>
    <v-row justify="center">
      <v-col cols="10">
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
          <v-col cols="6" xl="4">
            <stat-card :img="stats.highestGrossingMovie.posterPath"
                       title="Highest Grossing" subtitle="Last 7 Days":loading="loading">
              {{stats.highestGrossingMovie.grossing | formatDollar}}
            </stat-card>
          </v-col>
          <v-spacer/>
          <v-col cols="6" xl="4">
            <stat-card :img="stats.lowestGrossingMovie.posterPath"
                       title="Lowest Grossing" subtitle="Last 7 Days" :loading="loading">
              {{stats.lowestGrossingMovie.grossing | formatDollar}}
            </stat-card>
          </v-col>
        </v-row>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
  import moment from 'moment'
  import StatCard from "../../components/cards/StatCard";

  export default {
    name: "dashboard",
    components: {StatCard},
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
          }
        },
        loading: true
      }
    },
    async fetch() {
      this.stats = await this.$repos.statistics.getSummary(moment().subtract(7, "days"), moment());
      console.log(this.stats)
      this.loading = false;
    }
  }
</script>

<style scoped lang="scss">

</style>
