<template>
  <v-app
    v-if="currentPath.toLowerCase().indexOf('/dashboard') > -1"
    :class="adaptBackground"
  >
    <Dashboard :sidebarMenus="sidebarMenus"></Dashboard>
  </v-app>
  <v-app v-else :class="adaptBackground">
    <router-view />
  </v-app>
</template>

<script>
import Dashboard from "@/views/Dashboard";

export default {
  name: "App",

  data: () => ({
    currentPath: "",
    sidebar: {
      title: "",
      menus: [],
      actions: {},
      selectedMenu: 0,
    },
  }),

  methods: {
    async checkRedirection() {
      this.currentPath = this.$router.history.current.path;
      const isLoggedIn = await this.$store.dispatch("isLoggedIn");
      const onLoginPage = this.currentPath.toLowerCase().indexOf("/login") > -1;
      const onDashboardPage =
        this.currentPath.toLowerCase().indexOf("/dashboard") > -1;

      if (onLoginPage && isLoggedIn === true) {
        // Redirect to dashboard
        this.$router.push("/dashboard");
      }
      if (onDashboardPage && isLoggedIn === false) {
        // Redirect to login
        this.$router.push("/login");
      }
      if (onDashboardPage) {
        await this.$store.dispatch("getStudentData");
      }
    },
  },

  computed: {
    // To change background color dynamicaly
    adaptBackground() {
      if (this.currentPath == "/login") return "app-bg-white";
      return "app-bg-grey";
    },

    sidebarMenus() {
      let currentPath = this.currentPath;
      if (currentPath.toLowerCase().indexOf("/dashboard/presence") > -1) {
        this.sidebar.title = "Presensi";
        this.sidebar.menus = [
          {
            text: "Status Presensi",
            icon: "mdi-list-status",
            action: "presence",
          },
          {
            text: "Rekap Presensi",
            icon: "mdi-calendar",
            action: "presenceRecap",
          },
        ];
        this.sidebar.actions = {
          presence() {
            return this.$router.push("/dashboard/presence");
          },
          presenceRecap() {
            return this.$router.push("/dashboard/presence/recap");
          },
        };
      }

      if (currentPath.toLowerCase().indexOf("/dashboard/student") > -1) {
        this.sidebar.title = "Data Siswa";
        this.sidebar.menus = [
          {
            text: "Data Siswa",
            icon: "mdi-list-status",
            action: "studentData",
          },
          {
            text: "Data Orangtua Siswa",
            icon: "mdi-calendar",
            action: "parentData",
          },
        ];
        this.sidebar.actions = {
          studentData() {
            return this.$router.push("/dashboard/student");
          },
          parentData() {
            return this.$router.push("/dashboard/student/parent");
          },
        };
      }
      return this.sidebar;
    },
  },

  watch: {
    $route: async function () {
      this.currentPath = this.$router.history.current.path;
      await this.checkRedirection();
    },
  },

  async mounted() {
    await this.checkRedirection();
  },

  components: {
    Dashboard,
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
