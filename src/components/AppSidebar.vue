<template>
  <v-card class="mx-auto" max-width="300" tile>
    <v-list shaped>
      <v-subheader>{{ sidebarTitle }}</v-subheader>
      <v-list-item-group v-model="sidebarSelectedMenu" color="primary">
        <v-list-item v-for="(menu, menuIdx) in sidebarMenus" :key="menuIdx">
          <v-list-item-icon>
            <v-icon v-text="menu.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="menu.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>
<script>
export default {
  data() {
    return {};
  },

  computed: {
    sidebarTitle() {
      return this.$store.getters.getSidebar.title;
    },
    sidebarMenus() {
      return this.$store.getters.getSidebar.menus;
    },
    sidebarSelectedMenu() {
      return this.$store.getters.getSidebar.selectedMenu;
    },
  },
};
</script>
<style scoped>
</style>