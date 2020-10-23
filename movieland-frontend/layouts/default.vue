<template>
  <v-app dark>
    <v-app-bar color="primary" style="z-index: 5!important;" dark app>

      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="ml-1 mr-5 hidden-md-and-up">
        <v-icon large>fas fa-bars</v-icon>
      </v-app-bar-nav-icon>
      <img v-if="$vuetify.breakpoint.smAndUp" class="hover-pointer mr-6" @click="$router.push('/')"
           :src="logo" style="height:56px"/>

      <v-toolbar-items>
        <template v-if="$vuetify.breakpoint.mdAndUp">
          <v-btn text link nuxt v-for="(item, i) in routes" :key="i" :to="item.to">
            <v-icon class="mr-2">{{ item.icon }}</v-icon>
            <v-list-item-title v-text="item.title"/>
          </v-btn>
        </template>
      </v-toolbar-items>
      <v-spacer/>
      <v-toolbar-items>
        <template v-if="!$auth.loggedIn">
          <v-btn text @click="$events.$emit('showLogin',null)">
            <v-icon class="mr-2">mdi-login</v-icon>
            <template>Login</template>
          </v-btn>
        </template>
        <template v-else>
          <v-btn text link nuxt to="/users/me">
            <v-icon class="mr-2">mdi-account</v-icon>
            {{$auth.user.username}}
          </v-btn>
          <v-btn text @click="onLogout">
            <v-icon :class="{'mr-2':$vuetify.breakpoint.smAndUp}">mdi-logout</v-icon>
            <template v-if="$vuetify.breakpoint.smAndUp">Logout</template>
          </v-btn>
        </template>
      </v-toolbar-items>


    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app temporary color="primary" dark>
      <v-row justify="center" no-gutters dense class="sidebar-logo">
        <v-col cols="6">
          <v-img :src="logo" class="hover-pointer " @click="$router.push('/')"/>
        </v-col>
      </v-row>
      <v-divider/>
      <v-list>
        <v-list-item v-for="(item, i) in routes" :key="i" :to="item.to" router link nuxt>
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
  import jwt_decode from "jwt-decode";
  import loggedIn from "../middleware/loggedIn";
  import Utils from "../service/Utils";
  import DialogConfirm from "../components/cards/DialogConfirm";

  export default {
    data() {
      return {
        clipped: false,
        drawer: false,
        fixed: false,
        title: 'MovieLand',
        routes: [],
        logo
      }
    },
    mounted() {
      this.updateRoutes();
    },
    methods: {
      async showLoginDialog() {
        let loginInfo = await this.$dialog.showAndWait(LoginForm).then(resp => resp);
        if (!loginInfo)
          throw null;
        if (loginInfo === 'register') {
          this.$events.$emit('showRegister', () => this.showLoginDialog())
          return;
        }
        return await this.$auth.loginWith('local', loginInfo).then(resp => {
          console.log("user", this.$auth.user)
          return this.$auth.user;
        }).catch(err => {
          this.showLoginDialog();
          this.$dialog.showAndWait(DialogConfirm, {
            title: 'Login failed',
            text: 'Your entered Username and Password do not match<br/>Please try again',
            submitText: 'Ok',
            cancel: false,
            width: 300
          })
        })
      },
      async showRegisterDialog() {
        let registerInfo = await this.$dialog.showAndWait(RegisterForm).then(resp => resp);
        if(!registerInfo)
          return false;
        return this.$axios.post('/auth/signup', registerInfo).then(resp => {
          return resp;
        }).catch(err => {
          throw err.response.data;
        })
      },
      async onLogout() {
        await this.$auth.logout()
        this.$router.push('/')
        this.updateRoutes();
      },
      async updateRoutes() {
        let routes = [
          {
            icon: 'fas fa-film',
            title: 'Movies',
            to: '/movies'
          },
          {
            icon: 'fas fa-dollar-sign',
            title: 'Prices',
            to: '/prices'
          },
          {
            icon: 'fas fa-tools',
            title: 'Admin',
            to: '/admin/dashboard',
            roles: ['ROLE_ADMIN']
          }
        ];
        let token = await this.$auth.getToken('local');
        let userInfo = token === false ? {authorities: []} : jwt_decode(Utils.getPureToken(token));
        routes = routes.filter(route => {
          if (route.roles && route.roles.length > 0) {
            return route.roles.some(role => userInfo.authorities.some(auth => auth.authority === role))
          }
          return true;
        });
        console.log("routes", routes)
        this.routes = routes;
      }
    },
    created() {
      this.$events.$on('showLogin', (onSuccess) => {
        this.showLoginDialog().then(res => {
          this.updateRoutes();
          if (typeof onSuccess === 'string' || onSuccess instanceof String)
            this.$router.push(onSuccess);
          else
            onSuccess();
        }).catch(res => {
        })
      });
      this.$events.$on('showRegister', (onSuccessMethod) => {
        this.showRegisterDialog().then(res => {
          console.log("register", res)
          if (res !== false)
            onSuccessMethod();
        }).catch(err => {
          this.$events.$emit('showRegister', () => this.showLoginDialog());
          this.$dialog.showAndWait(DialogConfirm, {
            title: 'Register failed',
            text: `${err.message}<br/>Please try again`,
            submitText: 'Ok',
            cancel: false,
            width: 300
          })
        })
      });
    }
  }
</script>
<style scoped lang="scss">

  .sidebar-logo {
    background-color: rgba(180, 133, 133, 0.08);
  }
</style>
