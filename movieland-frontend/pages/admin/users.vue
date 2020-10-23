<template>
  <v-container>
    <v-row justify="center">
      <h4>Manage Users</h4>
    </v-row>
    <v-row v-if="!loading">
      <v-data-table
        v-model="selected" show-select
        :loading="loading"
        :headers="headers"
        :items="users"
        :item-key="'id'"
        class="elevation-1"
         sort-by="username"
        :items-per-page="10"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field :disabled="loading"
                          v-model="search"
                          label="Search Users"
                          hide-details
                          append-icon="fas fa-search"
            ></v-text-field>
            <v-spacer/>
            <v-btn color="error" @click="deleteUsers" class="mr-2"
                   :disabled="selected.length < 1 ||loading">
              <v-icon>fas fa-trash</v-icon>
            </v-btn>
            <v-btn color="success" @click="addUser" :disabled="loading">
              <v-icon>fas fa-plus</v-icon>
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.roles="{ item }">
            <v-checkbox v-for="role in roles" dense color="secondary" :label="role.name" hide-details
                        :input-value="userHasRole(item,role)" @click="toggleUserRole(item,role)"
            class="pa-0 ma-0"/>
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{item.createdAt | formatDate}}
        </template>

       <!-- <template v-slot:item.actions="{ item }">
          <v-btn v-if="canDelete===true" color="error" elevation="0" :disabled="loading"
                 small fab @click="$emit('delete',[item])">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>-->

      </v-data-table>
    </v-row>
    <v-row v-else>
      <v-skeleton-loader type="table"/>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: "users",
    data(){
      return{
        search:"",
        selected:[],
        users:[],
        headers:[
          {
            value: 'id',
            text: 'ID',
            sortable: true,
            align: 'left'
          },
          {
            value: 'username',
            text: 'Username',
            sortable: true,
            align: 'center'
          },
          {
            value: 'email',
            text: 'email',
            sortable: true,
            align: 'center'
          },
          {
            value: 'roles',
            text: 'Roles',
            sortable: true,
            align: 'center'
          },
          {
            value: 'createdAt',
            text: 'Register Date',
            sortable: true,
            align: 'center'
          },
        ],
        loading:true,
        roles:[{id:1,name:'ROLE_USER'},{id:2,name:'ROLE_ADMIN'},{id:3,name:'ROLE_CASHIER'}]
      }
    },
    async fetch(){
      this.users = await this.$repos.users.all();
      this.loading=false;
    },
    methods:{
      deleteUsers(){
      },
      addUser(){

      },
      userHasRole(user,role){
        return user.roles.some(userRole=> userRole.name === role.name)
      },
      toggleUserRole(user,role){
        if(this.userHasRole(user,role)){
          user.roles.splice(user.roles.findIndex(userRole=> userRole.name=== role.name),1)
        }else{
          user.roles.push(role);
        }
      }
    }
  }
</script>

<style scoped>

</style>
