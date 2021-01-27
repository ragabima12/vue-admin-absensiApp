<template>
  <v-row justify="center">
    <v-dialog
      max-width="fit-content"
      v-model="isShowedDialog"
      @click:outside="isClosedDialog"
    >
      <v-card>
        <v-card-title primary-title class="mb-3">
          <h4 class="app-heading-thin">Status Presensi</h4>
          <v-spacer></v-spacer>
          <v-btn icon @click="isClosedDialog">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  rounded
                  solo
                  :items="items"
                  label="Status Kehadiran"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="mb-2">
                <v-btn width="100%" large rounded color="primary">Simpan</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    items: ["Hadir", "Belum Hadir", "Izin", "Sakit"],
  }),
  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.$emit("closed", true);
    },
  },
};
</script>

<style scoped>
</style>