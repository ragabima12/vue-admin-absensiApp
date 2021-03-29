<template>
  <div>
    <v-row>
      <v-col class="ml-3" cols="12">
        <h2 class="app-heading-thin">Konfigurasi Waktu</h2>
      </v-col>
    </v-row>
    <v-row class="pa-0 pt-4 px-3">
      <v-col cols="4">
        <h4 class="app-heading-thin app-text-subheading">
          Waktu Masuk Sekolah
        </h4>
        <v-dialog
          ref="dialog"
          v-model="modal2"
          :return-value.sync="time"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              solo
              v-model="time"
              label="Picker in dialog"
              prepend-inner-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker v-if="modal2" v-model="time" full-width>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal2 = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(time)">
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: null,

      modal2: false,
    };
  },
};
</script>

<style scoped>
</style>