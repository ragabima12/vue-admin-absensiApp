<template>
  <div>
    <v-row justify="center">
      <v-dialog
        scrollable
        v-model="isShowedDialog"
        persistent
        max-width="600px"
        @click:outside="isClosedDialog"
      >
        <v-card>
          <v-card-title>
            <h4 class="app-heading-thin">Edit Data Orang Tua</h4>
            <v-spacer></v-spacer>
            <v-btn icon @click="isClosedDialog">
              <v-icon color="red">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" v-if="isSuccess">
                  <v-alert dense text type="success">
                    Data orang tua berhasil diperbaharui
                  </v-alert>
                </v-col>
                <v-col cols="12" v-if="errors">
                  <v-alert
                    dense
                    border="left"
                    type="warning"
                    v-for="(error, errorIndex) of errors"
                    :key="errorIndex"
                  >
                    {{ error }}
                  </v-alert>
                </v-col>
              </v-row>
              <v-row class="my-auto">
                <v-col class="pb-0 pt-0" cols="6">
                  <h4>Nama Lengkap</h4>
                  <v-text-field
                    v-model="getSelectedParent.fullname"
                    solo
                    label="Masukan Nama Orang tua"
                    :disabled="isUpdating"
                  ></v-text-field>
                </v-col>
                <v-col class="pt-0 pb-0" cols="6">
                  <h4>NIK</h4>
                  <v-text-field
                    v-model="getSelectedParent.nik"
                    solo
                    label="Masukan NIK"
                    :disabled="isUpdating"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="my-auto">
                <v-col class="pt-0 pb-0" cols="6">
                  <h4>Nomor Telepon</h4>
                  <v-text-field
                    v-model="getSelectedParent.phone_number"
                    solo
                    label="Masukan Nomor Telepon"
                    :disabled="isUpdating"
                  ></v-text-field>
                </v-col>
                <v-col class="pt-0 pb-0" cols="6">
                  <h4>Email</h4>
                  <v-text-field
                    v-model="getSelectedParent.email"
                    solo
                    label="Masukan Email"
                    :disabled="isUpdating"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              text
              color="error"
              @click="deleteParent"
              :loading="isDeleting"
              :disabled="isUpdating"
            >
              <h4 class="app-heading-thin app-text-error">Hapus</h4>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="updateParent"
              :loading="isUpdating"
              :disabled="isDeleting"
            >
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
  data() {
    return {
      isUpdating: false,
      isDeleting: false,
      isSuccess: false,
      errors: [],
    };
  },
  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.isSuccess = false;
      this.errors = [];
      this.$emit("closed", true);
    },

    async updateParent() {
      this.isUpdating = true;
      const parent = this.getSelectedParent;
      let { fullname } = parent;
      if (!fullname)
        this.errors.push("Nama orang tua siswa tidak boleh kosong");
      if (this.errors.length > 0) {
        this.isUpdating = false;
        return false;
      }

      const result = await this.$store.dispatch("updateParentData");
      if (result.isError) {
        this.errors.push(
          `Terjadi kesalahan saat memperbaharui data orang tua ${result.reason}`
        );
        this.isUpdating = false;
        return false;
      }

      this.isUpdating = false;
      this.isSuccess = true;
    },

    async deleteParent() {
      this.isDeleting = true;
      const result = await this.$store.dispatch("deleteParentData");
      if (result.isError) {
        this.errors.push(
          `Terjadi kesalahan saat memperbaharui data orang tua ${result.reason}`
        );
        this.isDeleting = false;
        return false;
      }

      this.isDeleting = false;
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