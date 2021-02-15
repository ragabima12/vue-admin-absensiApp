<template>
  <div>
    <v-row justify="center">
      <v-dialog
        scrollable
        v-model="isShowedDialog"
        persistent
        max-width="400px"
        @click:outside="isClosedDialog"
      >
        <v-card>
          <v-card-title>
            <h4 class="app-heading-thin">Edit Data Orangtua</h4>
            <v-spacer></v-spacer>
            <v-btn icon @click="isClosedDialog">
              <v-icon color="red">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row class="my-auto">
                <v-col class="pb-0 pt-0" cols="12">
                  <h4>Nama Lengkap</h4>
                  <v-text-field
                    v-model="getSelectedParent.fullname"
                    solo
                    label="Masukan Nama Orangtua"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="my-auto">
                <v-col class="pt-0 pb-0" cols="12">
                  <h4>NIK</h4>
                  <v-text-field
                    v-model="getSelectedParent.nik"
                    solo
                    label="Masukan NIK"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn text color="error">
              <h4 class="app-heading-thin app-text-error">Hapus</h4>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text>
              <h4 class="app-heading-thin">Simpan</h4>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.$emit("closed", true);
    },
  },

  computed: {
    ...mapGetters(["getSelectedParent"]),
  },
};
</script>

<style scoped>
</style>