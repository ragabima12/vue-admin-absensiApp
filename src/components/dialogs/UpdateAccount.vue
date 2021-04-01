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
          <h4 class="app-heading-thin">Edit Akun</h4>
          <v-spacer></v-spacer>
          <v-btn icon @click="isClosedDialog">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
          <v-container>
            <v-row>
              <v-col cols="12">
                <h4 class="app-heading-thin app-text-subheading">
                  Nama Lengkap
                </h4>
                <v-text-field
                  :disabled="isLoading"
                  v-model="selectedAccount.fullname"
                  placeholder="Masukan Nama Lengkap"
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
                  :disabled="
                    isLoading === true ||
                    selectedAccount.account_type === 'parent'
                      ? true
                      : false
                  "
                  :items="[
                    { text: 'Admin', value: 'admin' },
                    { text: 'Super Admin', value: 'superadmin' },
                  ]"
                  v-model="selectedAccount.account_type"
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
                  v-model="selectedAccount.email"
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
                  v-model="selectedAccount.phone_number"
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
          <v-btn :loading="isLoading" @click="updateAccount" text
            ><h4 class="app-heading-thin">Simpan</h4></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      password: "",
      confirmPassword: "",
      isLoading: false,
    };
  },
  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.$emit("closed", true);
    },
    async updateAccount() {
      this.isLoading = true;

      let accountData = {
        "account-id": this.selectedAccount._id,
        fullname: this.selectedAccount.fullname || "",
        email: this.selectedAccount.email || "",
        role: this.selectedAccount.account_type || "",
        "phone-number": this.selectedAccount.phone_number || "",
      };

      if (this.password) {
        if (this.password !== this.confirmPassword) {
          this.$store.commit(
            "setNotification",
            "Konfirmasi password tidak sesuai"
          );
          this.isLoading = false;
          return;
        }

        accountData["password"] = this.password;
      }

      await this.$store.dispatch("updateAccount", accountData);
      this.isLoading = false;
    },
  },
  computed: {
    ...mapGetters({ selectedAccount: "getSelectedAccount" }),
  },
};
</script>

<style>
</style>