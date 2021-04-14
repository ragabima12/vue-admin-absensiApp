<template>
  <v-app :class="adaptBackground">
    <Dashboard
      v-if="currentPath.toLowerCase().indexOf('/dashboard') > -1"
      :sidebarMenus="sidebarMenus"
    ></Dashboard>
    <router-view v-else />
    <v-snackbar v-model="notification.isShowed">
      {{ notification.text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="refreshPage"
          >Refresh</v-btn
        >
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import Dashboard from "@/views/Dashboard";
import { mapGetters } from "vuex";

export default {
  name: "App",

  data() {
    return {
      currentPath: "",
      sidebar: {
        title: "",
        menus: [],
        actions: {},
        selectedMenu: 0,
      },
      notification: {
        isShowed: false,
        text: "",
      },
    };
  },

  methods: {
    refreshPage() {
      location.reload();
    },

    async checkIsLoggedIn() {
      this.currentPath = this.$router.history.current.path;
      const isLoggedIn = await this.$store.dispatch("isLoggedIn");
      const onLoginPage = this.currentPath.toLowerCase().indexOf("/login") > -1;
      const onDashboardPage =
        this.currentPath.toLowerCase().indexOf("/dashboard") > -1;
      if (onLoginPage && isLoggedIn) this.$router.push("/dashboard");
      if (onDashboardPage && !isLoggedIn) this.$router.push("/login");
    },

    showNotification(text) {
      this.notification.isShowed = true;
      this.notification.text = text;
    },
  },

  computed: {
    ...mapGetters(["getNotification"]),

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
            return this.$router.push("/dashboard/presence").catch(() => {});
          },
          presenceRecap() {
            return this.$router
              .push("/dashboard/presence/recap")
              .catch(() => {});
          },
        };
      }

      if (currentPath.toLowerCase().indexOf("/dashboard/student") > -1) {
        this.sidebar.title = "Data Siswa";
        this.sidebar.menus = [
          {
            text: "Data Siswa",
            icon: "mdi-account-circle",
            action: "studentData",
          },
        ];
        this.sidebar.actions = {
          studentData() {
            return this.$router.push("/dashboard/student").catch(() => {});
          },
        };
      }
      if (currentPath.toLowerCase().indexOf("/dashboard/config") > -1) {
        this.sidebar.title = "Konfigurasi";
        this.sidebar.menus = [
          {
            text: "Konfigurasi Waktu",
            icon: "mdi-clock-time-four",
            action: "manageClock",
          },
          {
            text: "Konfigurasi Umum",
            icon: "mdi-cog",
            action: "manageGeneral",
          },
        ];
        this.sidebar.actions = {
          manageClock() {
            return this.$router.push("/dashboard/config").catch(() => {});
          },
          manageGeneral() {
            return this.$router
              .push("/dashboard/config/general")
              .catch(() => {});
          },
        };
      }
      if (currentPath.toLowerCase().indexOf("/dashboard/accounts") > -1) {
        this.sidebar.title = "Data Akun";
        this.sidebar.menus = [
          {
            text: "Data Akun",
            icon: "mdi-account",
            action: "accountData",
          },
        ];
        this.sidebar.actions = {
          accountData() {
            return this.$router.push("/dashboard/accounts").catch(() => {});
          },
        };
      }
      return this.sidebar;
    },
  },

  watch: {
    $route: async function () {
      this.currentPath = this.$router.history.current.path;
      await this.checkIsLoggedIn();
    },

    getNotification: function (notificationText) {
      if (typeof notificationText === "string") {
        this.showNotification(notificationText);
      }
    },
  },

  async mounted() {
    await this.checkIsLoggedIn();
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
