<template>
  <v-app>
    <v-navigation-drawer color="secondary" dark permanent fixed style="top:55px!important;" mini-variant
                         expand-on-hover >
      <v-list>
        <v-list-item v-for="(item, i) in routes" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div class="content">
        <nuxt-child/>
    </div>
  </v-app>
</template>

<script>
  export default {
    name: "AdminDashboard",
    middleware: ['isAdmin'],
    data(){
      return{
        routes:[
          {
            icon: 'fas fa-chart-pie',
            title: 'Dashboard',
            to: '/admin/dashboard',
          },
          {
            icon: 'fas fa-film',
            title: 'Movies',
            to: '/admin/movies',
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .content{
    margin-left: 44px!important;
  }
</style>
