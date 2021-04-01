<template>
  <div>
    <v-dialog
      scrollable
      v-model="isShowedDialog"
      max-width="700px"
      transition="dialog-transition"
      @click:outside="isClosedDialog"
    >
      <v-time-picker v-model="minTime" format="24hr" :max="maxTime">
        <v-spacer></v-spacer>
      </v-time-picker>

      <v-time-picker v-model="maxTime" format="24hr" :min="minTime">
        <v-spacer></v-spacer>
        <v-btn @click="setTimePresence" text color="primary"
          ><h4 class="app-heading-thin">Set Waktu</h4></v-btn
        >
        <v-btn @click="isClosedDialog" text color="error"
          ><h4 class="app-heading-thin app-text-error">Batal</h4></v-btn
        >
      </v-time-picker>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      minTime: "",
      maxTime: "",
    };
  },
  props: ["isShowedDialog", "mode"],
  methods: {
    setTimePresence() {
      if (this.mode === "presence") {
        this.$store.commit("setMinPresence", this.minTime);
        this.$store.commit("setMaxPresence", this.maxTime);
      }

      if (this.mode === "leaving") {
        this.$store.commit("setMinLeaving", this.minTime);
        this.$store.commit("setMaxLeaving", this.maxTime);
      }
      this.$emit("closed", true);
    },
    isClosedDialog() {
      this.minTime = "";
      this.maxTime = "";
      this.$emit("closed", true);
    },
  },
  computed: {
    ...mapGetters(["getConfigs"]),
  },
};
</script>

<style>
</style>