<template>
  <v-container>
    <v-row justify="center">
      <h4>Manage Users</h4>
    </v-row>
    <v-row v-if="!loading" justify="center">
      <v-data-table
        v-model="selected"
        show-select
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
            <v-text-field
              :disabled="loading"
              v-model="search"
              label="Search Users"
              hide-details
              append-icon="fas fa-search"
            ></v-text-field>
            <v-spacer />
            <!-- <v-btn color="error" @click="deleteUsers" class="mr-2"
                    :disabled="selected.length < 1 ||loading">
               <v-icon>fas fa-trash</v-icon>
             </v-btn>-->
            <v-btn color="success" @click="addUser" :disabled="loading">
              <v-icon>fas fa-plus</v-icon>
            </v-btn>
          </v-toolbar>
        </template>

        <template v-slot:item.roles="{ item }">
          <v-checkbox
            v-for="role in roles"
            dense
            color="secondary"
            :label="role.name"
            hide-details
            :input-value="userHasRole(item, role)"
            @click="toggleUserRole(item, role)"
            class="pa-0 ma-0"
          />
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ item.createdAt | formatDate }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            color="error"
            elevation="0"
            :disabled="loading"
            small
            fab
            @click="deleteUser(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-row>
    <v-row v-else>
      <v-skeleton-loader type="table" />
    </v-row>
  </v-container>
</template>

<script>
import DialogConfirm from "../../components/cards/DialogConfirm";
import RegisterForm from "../../components/forms/RegisterForm";

export default {
  name: "users",
  data() {
    return {
      search: "",
      selected: [],
      users: [],
      headers: [
        {
          value: "id",
          text: "ID",
          sortable: true,
          align: "left",
        },
        {
          value: "username",
          text: "Username",
          sortable: true,
          align: "center",
        },
        {
          value: "email",
          text: "email",
          sortable: true,
          align: "center",
        },
        {
          value: "roles",
          text: "Roles",
          sortable: true,
          align: "center",
        },
        {
          value: "createdAt",
          text: "Register Date",
          sortable: true,
          align: "center",
        },
        {
          value: "actions",
          text: "Actions",
          align: "center",
        },
      ],
      loading: true,
      roles: [
        { id: 1, name: "ROLE_USER" },
        { id: 2, name: "ROLE_ADMIN" },
        { id: 3, name: "ROLE_CASHIER" },
      ],
    };
  },
  async fetch() {
    this.users = await this.$repos.users.all();
    this.loading = false;
  },
  methods: {
    async deleteUser(user) {
      let res = await this.$dialog.showAndWait(DialogConfirm, {
        text: "Are you sure you want to delete this User?<br/>" + user.username,
        title: "Delete user",
        cancel: true,
        submitColor: "error",
      });
      if (res === true) {
        this.loading = true;
        await this.$repos.users.remove(user.id);
        this.users.splice(this.users.indexOf(user), 1);
        this.loading = false;
      }
    },
    async addUser() {
      let registerInfo = await this.$dialog
        .showAndWait(RegisterForm)
        .then((resp) => resp);
      if (!registerInfo) return;
      this.loading = true;
      await this.$repos.users
        .register(registerInfo)
        .then(async (resp) => {
          this.users = await this.$repos.users.all();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.error("register", err.response.data);
          this.$dialog.showAndWait(DialogConfirm, {
            title: "Adding User failed",
            text: `${err.response.data.message}`,
            submitText: "Ok",
            cancel: false,
            width: 300,
          });
        });
    },
    userHasRole(user, role) {
      return user.roles.some((userRole) => userRole.name === role.name);
    },
    toggleUserRole(user, role) {
      if (this.userHasRole(user, role)) {
        user.roles.splice(
          user.roles.findIndex((userRole) => userRole.name === role.name),
          1
        );
      } else {
        user.roles.push(role);
      }
      this.$repos.users.update({ ...user, password: null });
    },
  },
  head() {
    return {
      title: "Users",
    };
  },
};
</script>

<style scoped>
</style>
