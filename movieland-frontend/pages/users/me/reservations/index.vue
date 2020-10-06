<template>
  <v-card>
    <v-card-title>My Reservations</v-card-title>
    <v-skeleton-loader type="list" v-if="loading"/>
    <v-container v-else>
      <v-row justify="center">
        <v-list elevation="1">
          <v-list-item v-for="reservation of reservations" two-line link nuxt
                       :to="`/users/me/reservations/${reservation.reservation.resId}`">
            <v-list-item-content>
              <v-list-item-title>
                {{reservation.movie.name}}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{reservation.movieShow.date |formatDateTime}}
              </v-list-item-subtitle>

            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-launch</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        reservations: [],
        loading: true
      }
    },
    async fetch() {
      this.reservations = await this.$repos.reservations.allUserReservations();
      console.log(this.reservations)
      this.loading = false;
    },
  }
</script>

<style scoped>

</style>
