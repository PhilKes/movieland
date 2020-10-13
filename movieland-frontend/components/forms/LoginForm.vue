<template>
  <DialogCard title="Login" :actions="actions">
    <v-text-field outlined label="Username" icon="person" v-model="username"/>
    <v-text-field type="password" outlined label="Password"
                  icon="lock" v-model="password"
                  @keyup.enter.native="submitLogin"
    />
  </DialogCard>
</template>
<script>
  export default {
    name: 'LoginForm',
    data() {
      return {
        username: 'admin',
        password: 'admin123'
      }
    },
    methods: {
      submitLogin() {
        this.$emit('submit', {data: {usernameOrEmail: this.username, password: this.password}}
        )
      }
    },
    computed: {
      actions() {
        return {
          register: {
            outlined: true,
            color: 'dark',
            text: 'Register',
            handle() {
              return "register";
            }
          },
          login: {
            flat: false,
            color: 'success',
            text: 'Login',
            handle: () => {
              return {data: {usernameOrEmail: this.username, password: this.password}}
            }
          },
        }
      }
    }
  }
</script>
