<template>
  <v-card class="mx-auto" max-width="300" tile>
    <v-list shaped>
      <v-subheader>{{ sidebar.title }}</v-subheader>
      <v-list-item-group v-model="sidebar.selectedMenu" color="primary">
        <v-list-item
          v-for="(menu, menuIdx) in sidebar.menus"
          :key="menuIdx"
          @click="menuAction(menu.action)"
        >
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
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },

  methods: {
    menuAction(actionName) {
      const actions = this.$store.getters.getSidebar.actions;
      if (actions.hasOwnProperty(actionName)) actions[actionName].call(this);
    },
  },

  computed: mapState({
    sidebar: "sidebar",
  }),
};
</script>
<style scoped>
</style>