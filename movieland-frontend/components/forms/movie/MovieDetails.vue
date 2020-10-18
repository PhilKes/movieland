<template>
  <v-card class="dialog-card">
    <v-skeleton-loader type="card" v-if="loading===true"/>
    <template v-else>
      <v-row dense no-gutters>
        <v-col cols="12">
          <movie-card :movie="movie" transparent no-link small/>
        </v-col>
      </v-row>
      <v-row dense no-gutters>
        <v-col cols="12">
          <v-card-title>Grossing and Sold Tickets Last 7 Days</v-card-title>
          <client-only>
            <component :is="apexchart" width="575px" :options="chartOptions"
                       :series="series"
            ></component>
          </client-only>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="$emit('submit',true)">Ok</v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
  import moment from 'moment'
  import Utils from "../../../service/Utils";
  import MovieCard from "../../cards/MovieCard";

  export default {
    name: "MovieDetails",
    components: {MovieCard},
    props: {
      movie: Object,
      stats: Object
    },
    data() {
      let chartOptions = {
        legend: {
          show: false
        },
        yaxis: [
          {
            seriesName: 'Grossing',
            labels: {
              formatter: function (value) {
                return Number(value).toFixed(2) + "$";
              }
            },
          },
          {
            seriesName: 'Tickets sold',
            opposite:true,
            labels: {
              formatter: function (value) {
                return Number(value).toFixed(0);
              }
            },
          },
        ],
        chart: {
          type: 'line',
          width: '500px',
          zoom: {
            enabled: false
          },
        },
        colors: ['var(--v-primary-base)', 'var(--v-secondary-base)',],
        markers: {
          size: 6,
          colors: ['var(--v-primary-lighten2)', 'var(--v-secondary-lighten2)']
        },
        labels: [],
      };
      let series = [{name: 'Grossing', data: []}, {name: 'Tickets', data: []}];
      Object.keys(this.stats).forEach(dateKey => {
        chartOptions.labels.push(moment(dateKey).format("DD.MM"));
        series[0].data.push(this.stats[dateKey].grossing);
        series[1].data.push(this.stats[dateKey].visitors);
      })
      console.log("stats", this.stats)
      return {
        loading: false,
        chartOptions,
        series
      }
    },
    computed: {
      apexchart() {
        return () => {
          if (process.client) {
            return import('vue-apexcharts')
          }
        }
      }
    },

  }
</script>

<style scoped>

</style>
