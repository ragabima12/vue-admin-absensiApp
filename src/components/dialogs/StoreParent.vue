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
            <h4 class="app-heading-thin">Tambah Data Orang Tua</h4>
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
                    Data orang tua berhasil dimasukan!
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
                <v-col class="pb-0" cols="6">
                  <h4 class="app-heading-thin app-text-subheading">
                    Nama Lengkap
                  </h4>
                  <v-text-field
                    v-model="parent.fullname"
                    solo
                    label="Masukan Nama Lengkap"
                    :disabled="isLoading"
                  ></v-text-field>
                </v-col>
                <v-col class="pb-0" cols="6">
                  <h4 class="app-heading-thin app-text-subheading">
                    Nomor Induk Keluarga
                  </h4>
                  <v-text-field
                    v-model="parent.nik"
                    solo
                    label="Masukan NIK"
                    :disabled="isLoading"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0" cols="6">
                  <h4 class="app-heading-thin app-text-subheading">
                    Nomor Telepon
                  </h4>
                  <v-text-field
                    v-model="parent.phone_number"
                    solo
                    label="Masukan Nomor Telepon"
                    :disabled="isLoading"
                  ></v-text-field>
                </v-col>

                <v-col class="pb-0" cols="6">
                  <h4 class="app-heading-thin app-text-subheading">Email</h4>
                  <v-text-field
                    v-model="parent.email"
                    solo
                    label="Masukan Email"
                    :disabled="isLoading"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="storeParent" :loading="isLoading">
              <h4 class="app-heading-thin">Simpan</h4>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { isNumeric, isLength, isEmail, isMobilePhone } from "validator";

export default {
  data() {
    return {
      search: "",
      errors: [],
      isLoading: false,
      isSuccess: false,
      parent: {
        nik: null,
        fullname: null,
        phone_number: null,
        email: null,
      },
    };
  },

  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.isLoading = false;
      this.isSuccess = false;
      this.errors = [];
      this.$emit("closed", true);
    },
    resetErrors() {
      this.errors = [];
    },
    async storeParent() {
      this.isLoading = true;
      this.isSuccess = false;
      this.resetErrors();

      let { nik, fullname, phone_number, email } = this.parent;

      if (!fullname) this.errors.push("Nama orang tua tidak boleh kosong");
      if (!nik) this.errors.push("NIK tidak boleh kosong");

      if (nik) {
        const isValidNik =
          isNumeric(nik) && isLength(nik, { min: 16, max: 16 });
        if (!isValidNik) this.errors.push("NIK harus berupa 16 digit angka");
      }
      if (phone_number) {
        const isValidPhoneNumber = isMobilePhone(phone_number, ["id-ID"]);
        if (!isValidPhoneNumber) this.errors.push("Nomor telepon tidak sesuai");
      }

      if (email) {
        const isValidEmail = isEmail(email);
        if (!isValidEmail) this.errors.push("Email tidak sesuai");
      }

      const isErrors = this.errors.length > 0;
      if (isErrors) {
        this.isLoading = false;
        return false;
      }

      const result = await this.$store.dispatch("storeParentData", this.parent);
      if (result.isError) {
        this.errors.push(
          `Terjadi kesalahan saat menambahkan data orang tua, ${result.reason}`
        );
        this.isLoading = false;
        return false;
      }

      this.isLoading = false;
      this.isSuccess = true;
      this.$emit("closed", true);
    },
  },
  computed: {},
};
</script>

<style scoped>
</style>