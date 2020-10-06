<template>
  <v-card>
    <v-container>
      <v-row no-gutters dense >
        <back-button url="/" label="Homepage"/>
        <v-spacer/>
          <navigate-button url="/users/me/reservations" label="My Reservations"/>
      </v-row>
      <v-row justify="center">
        <v-card-title>Your User</v-card-title>
      </v-row>
      <v-divider/>
      <v-row>
        <v-col cols="4">
          <v-skeleton-loader type="card" v-if="!$auth.loggedIn"></v-skeleton-loader>
            <v-row v-else no-gutters dense>
              <v-card-text>
                <b>User: </b>
                {{$auth.user.username}}
              </v-card-text>
              <v-card-text>
                <b>Name: </b>
                {{$auth.user.name}} (id:{{$auth.user.id}})
              </v-card-text>
            </v-row>

        </v-col>
      </v-row>
      <v-row>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
  import NavigateButton from "../../../components/buttons/NavigateButton";
  import BackButton from "../../../components/buttons/BackButton";
  export default {
    name: "UserMe",
    components: {BackButton, NavigateButton}
  }
</script>

<style scoped>

</style>
