<template>
  <div>
    <v-dialog
      v-model="isShowedDialog"
      scrollable
      max-width="500px"
      transition="dialog-transition"
      @click:outside="isClosedDialog"
    >
      <v-card>
        <v-card-title>
          <h4 class="app-heading-thin">Buat Akun</h4>
          <v-spacer></v-spacer>
          <v-btn icon @click="isClosedDialog">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
          <v-container>
            <v-row>
              <v-col cols="6">
                <h4 class="app-heading-thin app-text-subheading">
                  Nama Lengkap
                </h4>
                <v-text-field
                  :disabled="isLoading"
                  v-model="fullname"
                  placeholder="Masukan Nama Lengkap"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <h4 class="app-heading-thin app-text-subheading">Username</h4>
                <v-text-field
                  :disabled="isLoading"
                  v-model="username"
                  placeholder="Masukan Username"
                  solo
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-0" cols="6">
                <h4 class="app-heading-thin app-text-subheading">Password</h4>
                <v-text-field
                  type="password"
                  :disabled="isLoading"
                  v-model="password"
                  placeholder="Masukan Password"
                  solo
                ></v-text-field>
              </v-col>
              <v-col class="pt-0" cols="6">
                <h4 class="app-heading-thin app-text-subheading">
                  Konfirmasi Password
                </h4>
                <v-text-field
                  type="password"
                  :disabled="isLoading"
                  v-model="confirmPassword"
                  placeholder="Masukan Konfirmasi Password"
                  solo
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-0" cols="12">
                <h4 class="app-heading-thin app-text-subheading">Hak Akses</h4>
                <v-select
                  :disabled="isLoading"
                  :items="[
                    { text: 'Admin', value: 'admin' },
                    { text: 'Super Admin', value: 'superAdmin' },
                  ]"
                  v-model="roles"
                  placeholder="Masukan Hak Akses"
                  solo
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-0" cols="6">
                <h4 class="app-heading-thin app-text-subheading">Email</h4>
                <v-text-field
                  :disabled="isLoading"
                  v-model="email"
                  placeholder="Masukan Email"
                  solo
                ></v-text-field>
              </v-col>
              <v-col class="pt-0" cols="6">
                <h4 class="app-heading-thin app-text-subheading">
                  Masukan Nomor Telepon
                </h4>
                <v-text-field
                  :disabled="isLoading"
                  v-model="phoneNumber"
                  placeholder="Masukan Nomor Telepon"
                  solo
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :loading="isLoading" @click="storeAccount" text
            ><h4 class="app-heading-thin">Simpan</h4></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      fullname: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phoneNumber: "",
      roles: "",
    };
  },
  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.$emit("closed", true);
    },
    async storeAccount() {
      this.isLoading = true;
      const account = {
        fullname: this.fullname,
        username: this.username,
        password: this.password,
        "confirm-password": this.confirmPassword,
        role: this.roles,
        email: this.email,
        "phone-number": this.phoneNumber,
      };
      await this.$store.dispatch("storeAccount", account);
      this.isLoading = false;
    },
  },
};
</script>

<style>
</style>