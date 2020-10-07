<template>
  <v-card>
    <v-skeleton-loader type="list" v-if="loading"/>
    <v-container v-else>
      <v-row no-gutters dense>
        <v-col>
          <back-button label="My User" :url="`/users/me`" />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-card-title>My Reservations</v-card-title>
      </v-row>
      <v-divider />
      <v-row justify="center">
        <v-list >
          <v-list-item v-for="reservation of reservations" two-line link nuxt
                       :to="`/users/me/reservations/${reservation.reservation.resId}`">
            <v-list-item-avatar rounded size="100" >
              <v-img :src="reservation.movie.posterUrl"></v-img>
            </v-list-item-avatar>
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
    middleware:['loggedIn'],
    data() {
      return {
        reservations: [],
        loading: true
      }
    },
    async fetch() {
      this.reservations = await this.$repos.reservations.allUserReservations();
      this.reservations.sort((r1,r2)=> r1.movieShow.date-r2.movieShow.date)
      console.log(this.reservations)
      this.loading = false;
    },
  }
</script>

<style scoped lang="scss">

</style>
