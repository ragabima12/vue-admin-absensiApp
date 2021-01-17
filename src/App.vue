<template>
  <v-app :class="adaptBackground">
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    currentPath: "",
  }),

  computed: {
    // To change background color dynamicaly
    adaptBackground() {
      if (this.currentPath == "/login") return "app-bg-white";
      return "app-bg-grey";
    },
  },

  watch: {
    $route: function () {
      this.currentPath = this.$router.history.current.path;
    },
  },

  mounted() {
    this.currentPath = this.$router.history.current.path;
  },
};
</script>
<style scoped>
.app-bg-grey {
  background: #e5e7ea !important;
}

.app-bg-white {
  background: white;
}
</style>
