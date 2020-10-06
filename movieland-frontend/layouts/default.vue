<template>
  <v-app dark>

    <v-app-bar color="primary" dark fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="ml-1 mr-5">
       <v-icon large>fas fa-bars</v-icon>
      </v-app-bar-nav-icon>
      <v-img class="hover-pointer" @click="$router.push('/')"
        :src="logo" max-height="60" position="start" contain />
      <v-spacer/>
      <template v-if="!$auth.loggedIn">
        <v-btn text @click="showLoginDialog">
          <v-icon class="mr-2">mdi-login</v-icon>
          Login
        </v-btn>
        <v-btn text @click="showRegisterDialog">
          <v-icon class="mr-2">mdi-account-plus</v-icon>
          Register
        </v-btn>
      </template>
      <template v-else>
        <v-btn text link nuxt to="/users/me">
          <v-icon class="mr-2">mdi-account</v-icon>
          {{$auth.user.username}}
        </v-btn>
        <v-btn text @click="$auth.logout()" class="mr-5">
          <v-icon class="mr-2">mdi-logout</v-icon>
          Logout
        </v-btn>
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app temporary color="primary" dark>

      <v-row justify="center" no-gutters dense>
        <v-col cols="6">
          <v-img :src="logo" class="hover-pointer" @click="$router.push('/')" />
        </v-col>

      </v-row>

      <v-divider/>
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
    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
    </v-main>
    <!--    <v-footer
          :absolute="!fixed"
          app
        >
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>-->
  </v-app>
</template>

<script>
  import LoginForm from "../components/forms/LoginForm";
  import RegisterForm from "../components/forms/RegisterForm";
  import logo from "../static/img/movie_land_icon.png"

  export default {
    data() {
      return {
        clipped: false,
        drawer: false,
        fixed: false,
        routes: [
          {
            icon: 'fas fa-film',
            title: 'Movies',
            to: '/movies'
          },
          {
            icon: 'fas fa-dollar-sign',
            title: 'Prices',
            to: '/prices'
          }
        ],
        title: 'MovieLand',
        logo
      }
    },
    methods: {
      async showLoginDialog() {
        let loginInfo = await this.$dialog.showAndWait(LoginForm).then(resp => resp);
        if (!loginInfo)
          throw null;
        return await this.$auth.loginWith('local', loginInfo).then(resp => {
          console.log("user", this.$auth.user)
          return this.$auth.user;
        })
      },
      async showRegisterDialog() {
        let registerInfo = await this.$dialog.showAndWait(RegisterForm).then(resp => resp);
        this.$axios.post('/auth/signup', registerInfo).then(resp => {

        });
        /*   await this.$auth.loginWith('local',loginInfo).then(resp=> {
             console.log(resp)
             console.log("user",this.$auth.user)
           })*/
      }
    },
    mounted() {
      this.$root.$on('showLogin', (onSuccessMethod) => {
        this.showLoginDialog().then(res => {
          onSuccessMethod();
        }).catch(res => {
        })
      });
    }
  }
</script>
