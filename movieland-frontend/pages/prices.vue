<template>
  <v-container>
    <v-row justify="center">
      <v-card>
        <v-card-title>Ticket Prices</v-card-title>
        <v-list elevation="2">
          <v-list-item two-line>
            <v-list-item-avatar>
              <v-icon>fas fa-child</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Child (< 6 years)</v-list-item-title>
              <v-list-item-subtitle>5.50 $</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-avatar>
              <v-icon>fas fa-user-graduate</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Student</v-list-item-title>
              <v-list-item-subtitle>6.00 $</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-avatar>
              <v-icon>fas fa-user</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Adult</v-list-item-title>
              <v-list-item-subtitle>7.00 $</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-avatar>
              <v-icon>fas fa-wheelchair</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Disabled</v-list-item-title>
              <v-list-item-subtitle>5.50 $</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Prices",
  middleware: ["loggedIn"],
  head() {
    return {
      title: `Ticket Prices`,
    };
  },
};
</script>

<style scoped>
</style>
