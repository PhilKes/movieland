<template>
  <h4>Admin Dashboard</h4>
</template>

<script>
  export default {
    name: "AdminDashboard",
    middleware: ['isAdmin']
  }
</script>

<style scoped>

</style>
