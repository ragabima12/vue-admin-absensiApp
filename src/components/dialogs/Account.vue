<template>
  <div>
    <v-dialog
      v-model="isShowedDialog"
      scrollable
      transition="dialog-transition"
      max-width="400px"
    >
      <v-card>
        <v-card-title>
          <h4 class="app-heading-thin">Setting Akun</h4>
          <v-spacer></v-spacer>
          <v-btn icon @click="isClosedDialog">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row class="my-auto">
              <v-col class="text-center" cols="12">
                <v-avatar size="82" color="primary">
                  <span class="white--text headline">
                    {{
                      getUserData.fullname
                        ? getUserData.fullname.substr(0, 2).toUpperCase()
                        : ""
                    }}
                  </span>
                </v-avatar>
              </v-col>
              <v-col cols="12" class="text-center">
                <h2 class="app-heading-thin">
                  {{ getUserData.fullname }}
                </h2>
                <h4 class="app-text-thin app-text-subheading mt-2">
                  @{{ getUserData.username }}
                </h4>
                <v-chip small class="mt-3" color="primary">
                  {{
                    getUserData.previleges == "admin" ? "Admin" : "Super Admin"
                  }}
                </v-chip>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col class="pb-0" cols="12">
                <h4 class="app-text-thin mb-2">Password Lama</h4>
                <v-text-field
                  placeholder="Masukan Password Lama"
                  solo
                ></v-text-field>
              </v-col>
              <v-col class="pb-0" cols="12">
                <h4 class="app-text-thin mb-2">Password Baru</h4>
                <v-text-field
                  placeholder="Masukan Password Baru"
                  solo
                ></v-text-field>
              </v-col>
              <v-col class="pb-0" cols="12">
                <h4 class="app-text-thin mb-2">Konfirmasi Password</h4>
                <v-text-field
                  placeholder="Masukan Konfirmasi Password"
                  solo
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text><h4 class="app-heading-thin">Perbaharui</h4></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.isLoading = false;
      this.isSuccess = false;
      this.errors = [];
      this.$emit("closed", true);
    },
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
};
</script>

<style scoped>
</style>