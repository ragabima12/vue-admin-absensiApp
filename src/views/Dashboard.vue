<template>
  <div>
    <v-menu
      :position-x="accountDialog.position_x"
      :position-y="accountDialog.position_y"
      v-model="accountDialog.isShowed"
      :min-width="accountDialog.width"
      absolute
      offset-y
    >
      <v-list>
        <a href="#" class="app-nolink">
          <v-list-item
            v-for="(menuItem, menuItemindex) of menuItems.menus"
            :key="menuItemindex"
          >
            <v-list-item-title @click="onMenuClick(menuItem.action)">
              <h4 class="app-heading-thin">
                {{ menuItem.title }}
              </h4>
            </v-list-item-title>
          </v-list-item>
        </a>
      </v-list>
    </v-menu>

    <v-app-bar color="#081120" dark class="px-6" height="82">
      <v-toolbar-title class="mr-8">
        <h3
          class="app-text-white app-heading-thin"
          @click="$router.push('/login')"
        >
          INTENS <span class="app-text-thin">Console</span>
        </h3>
      </v-toolbar-title>
      <v-btn plain color="white" @click="NavigateTo(`/dashboard`)"
        ><h4 class="app-text-white app-heading-thin">Dashboard</h4></v-btn
      >
      <v-btn plain color="white" @click="NavigateTo(`/dashboard/presence`)"
        ><h4 class="app-text-white app-heading-thin">Presensi</h4></v-btn
      >
      <v-btn plain color="white" @click="NavigateTo(`/dashboard/student`)"
        ><h4 class="app-text-white app-heading-thin">Data Siswa</h4></v-btn
      >
      <v-btn plain color="white"
        ><h4 class="app-text-white app-heading-thin">Konfigurasi</h4></v-btn
      >
      <v-spacer></v-spacer>
      <v-chip
        color="accent"
        pill
        class="pr-6 pl-4 py-6 app-chip-full-rounded"
        ref="account"
        @click="AccountDialog"
      >
        <v-avatar color="primary" size="56" class="mr-4">
          <img
            lazy-src="https://picsum.photos/id/11/10/6"
            alt="John"
            src="https://picsum.photos/id/11/500/300"
          />
        </v-avatar>
        <h4 class="app-text-white app-heading-thin">{{ getUserFullname }}</h4>
      </v-chip>
    </v-app-bar>
    <div class="mt-12">
      <v-row>
        <v-col cols="3" offset="1"
          ><v-card class="mx-auto" width="300" elevation="0">
            <AppSidebar></AppSidebar>
          </v-card>
        </v-col>
        <v-col cols="8">
          <v-row>
            <v-col cols="10">
              <v-sheet rounded class="px-4 py-4" elevation="1">
                <router-view />
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueCookies from "vue-cookies";
import AppSidebar from "@/components/AppSidebar";
import { mapState } from "vuex";

Vue.use(VueCookies);

export default {
  data: () => ({
    accountDialog: {
      isShowed: false,
      width: 200,
      position_x: 0,
      position_y: 0,
    },
    menuItems: {
      title: "",
      menus: [
        {
          title: "Pengaturan Akun",
          action: "accountSetting",
        },
        {
          title: "Keluar",
          action: "logout",
        },
      ],
      menuActions: {
        logout() {
          Vue.$cookies.remove("access-token");
          Vue.$cookies.remove("refresh-token");
          this.$router.push("/login");
        },
      },
    },
  }),
  methods: {
    AccountDialog() {
      const accountChip = this.$refs["account"].$el;
      const { x, y, width } = accountChip.getBoundingClientRect();
      this.accountDialog.position_x = x;
      this.accountDialog.position_y = y + 64;
      this.accountDialog.width = width;
      this.accountDialog.isShowed = !this.accountDialog.isShowed;
    },
    NavigateTo(path) {
      this.$router.push(path).catch(() => {});
    },
    onMenuClick(actionName) {
      const actions = this.menuItems.menuActions;
      const actionIncluded = Object.keys(actions).includes(actionName);
      if (!actionIncluded)
        return console.warn(
          `action "${actionName}" not included on menu actions`
        );
      actions[actionName].call(this);
    },
  },
  computed: mapState({
    getUserFullname: (state) => state.userData.fullname,
  }),
  components: {
    AppSidebar,
  },
  props: ["sidebarMenus"],
  watch: {
    sidebarMenus: {
      handler(menu) {
        this.$store.commit("setSidebar", menu);
      },
      deep: true,
    },
  },

  mounted() {
    this.$store.commit("setSidebar", this.sidebarMenus);
  },
};
</script>

<style scoped>
.app-chip-full-rounded {
  border-radius: 100px !important;
}
</style>
