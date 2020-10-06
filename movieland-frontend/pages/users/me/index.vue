<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-skeleton-loader type="card" v-if="!$auth.loggedIn"></v-skeleton-loader>
          <v-card v-else>
            <v-card-title>Your User</v-card-title>
            <v-card-text>{{$auth.user.username}}</v-card-text>
            <v-card-text>{{$auth.user.name}} (id:{{$auth.user.id}})</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn color="primary" outlined large link to="/users/me/reservations">
            To my Reservations
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
  export default {
    name: "UserMe"
  }
</script>

<style scoped>

</style>
