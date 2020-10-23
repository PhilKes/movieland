<template>
  <DialogCard title="Register" :actions="actions">
    <v-form v-model="valid">
      <v-text-field label="Username" icon="person" v-model="username" :rules="[rules.required]"/>
      <v-text-field label="Email" icon="person" v-model="email" :rules="[rules.required]"/>
      <v-text-field type="password" label="Password" icon="lock" v-model="password" counter
                    :rules="[rules.required,rules.counter,rules.min]"/>
    </v-form>
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
        valid:false,
        username: 'admin',
        email: 'admin@admin.com',
        password: 'admin123',
        rules: {
          required: value => !!value || 'Required.',
          min: value => value.length > 5 || 'Min 6 characters',
          counter: value => value.length <= 20 || 'Max 20 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        },
      }
    },
    computed: {
      actions() {
        return {
          register: {
            disabled: !this.valid,
            flat: false,
            text: 'Register',
            color: 'success',
            handle: () => {
              return {username: this.username, name: this.username, email: this.email, password: this.password}
            }
          }
        }
      }
    }
  }
</script>
