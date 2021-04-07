<template>
  <div>
    <v-row>
      <v-col class="ml-3" cols="12">
        <h2 class="app-heading-thin">Konfigurasi Waktu</h2>
      </v-col>
    </v-row>
    <v-row class="pa-0 pb-0 pt-4 px-3">
      <v-col class="pr-0" cols="4">
        <h4 class="app-heading-thin app-text-subheading">
          Waktu Masuk Sekolah
        </h4>
        <v-text-field
          @click="showTimeDialog('presence')"
          readonly
          prepend-inner-icon="mdi-clock"
          solo
          clearable
          label="Waktu Presensi"
          :value="Object.keys(getConfigs).length < 1 ? `Sedang Memuat` :`${getConfigs.min_attendance_time} - ${getConfigs.max_attendance_time}`"
        >
        </v-text-field>
      </v-col>
      <v-col class="pl-0 pr-0 text-center my-auto" cols="1">
        <v-icon>mdi-minus</v-icon>
      </v-col>
      <v-col class="pl-0" cols="4">
        <h4 class="app-heading-thin app-text-subheading">
          Waktu Pulang Sekolah
        </h4>
        <v-text-field
          @click="showTimeDialog('leaving')"
          readonly
          clearable
          prepend-inner-icon="mdi-clock"
          solo
          label="Waktu Pulang"
          :value=" Object.keys(getConfigs).length < 1 ? `Sedang Memuat` : `${getConfigs.min_leaving_time} - ${getConfigs.max_leaving_time}`"
        >
        </v-text-field>
      </v-col>
      <v-col class="pt-10" cols="3"
        ><v-btn @click="submitTime" large color="#15D46D"
          ><h4 class="app-heading-thin app-text-white">Perbarui</h4></v-btn
        ></v-col
      >
    </v-row>

    <TimeDialog
      :mode="mode"
      :isShowedDialog="showTime"
      @closed="showTime = false"
    />
  </div>
</template>

<script>
import TimeDialog from "@/components/dialogs/ShowTime.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      mode: "presence",
      showTime: false,
    };
  },
  components: {
    TimeDialog,
  },
  methods: {
    showTimeDialog(param) {
      this.mode = param;
      this.showTime = true;
    },
    async submitTime() {
      await this.$store.dispatch("updateConfig");
    },
  },
  computed: {
    ...mapGetters(["getConfigs"]),
  },

  async mounted() {
    const emptyConfigs = Object.keys(this.$store.getters.getConfigs).length < 1;
    if (emptyConfigs) await this.$store.dispatch("getConfig");
  },
};
</script>

<style scoped>
</style>