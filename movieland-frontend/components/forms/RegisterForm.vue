<template>
  <DialogCard title="Register" :actions="actions">
    <v-text-field label="Username" icon="person" v-model="username"/>
    <v-text-field label="Email" icon="person" v-model="email"/>
    <v-text-field type="password" label="Password" icon="lock" v-model="password"/>
  </DialogCard>
</template>
<script>
  export default {
    // overlay: 'default',
    //   asyncData () {
    //         return new Promise(resolve => {
    //           setTimeout(resolve, 3000)
    //         })
    // },
    data() {
      return {
        username: 'admin',
        email: 'admin@admin.com',
        password: 'admin123',
      }
    },
    computed: {
      actions() {
        return {
          register: {
            flat: true,
            text: 'Register',
            handle: () => {
              return {username: this.username, name: this.name, email: this.email, password: this.password}
            }
          }
        }
      }
    }
  }
</script>
