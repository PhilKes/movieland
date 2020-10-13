<template>
  <v-card class="dialog-card">
    <v-card-title>Reservation Success</v-card-title>
    <v-card-text>
      <b>Movie:</b> {{showDetails.movieTitle}}<br/>
      <b>Date:</b> {{showDetails.date | formatDateTime}}<br/>
      <b>Total Sum:</b> {{reservation.totalSum}} $
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success" elevation="0" @click="$router.push('/users/me/reservations/' +reservation.resId);$emit('submit',true)">
        To my Reservation
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
  export default {
    props: {
      reservation: Object,
      showDetails: Object
    }
  }
</script>
