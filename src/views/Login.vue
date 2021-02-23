<template>
  <v-row>
    <v-col cols="5" class="pb-0" background-color="accent">
      <v-card elevation="0" height="100%" width="100%" tile>
        <v-img
          lazy-src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg9_tmtO1uCMFh0XMsel6K_XwZUGgtzeYdTg&usqp=CAU"
          height="100%"
          width="100%"
          src="https://smkn3bandung.files.wordpress.com/2013/05/tampak-depan.jpg"
          gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
        >
          <v-layout align-center justify-center fill-height>
            <v-flex>
              <v-card-text class="px-8">
                <h1 class="mb-4 app-text-white">
                  Integrated Attendance System <br />
                  SMK Negeri 3 Bandung
                </h1>
                <p class="app-text-white">
                  Sistem presensi terintegrasi SMK Negeri 3 Bandung
                </p>
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-img>
      </v-card>
    </v-col>

    <v-col cols="7">
      <v-layout align-center justify-center fill-height>
        <v-flex>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="8" offset="2">
                  <h2 class="mb-3">INTENS CONSOLE</h2>
                  <v-alert
                    transition="scale-transition"
                    v-for="(error, errorIndex) of isFormErrors"
                    :key="errorIndex"
                    dismissible
                    color="warning"
                    border="left"
                    elevation="2"
                    colored-border
                    icon="mdi-alert"
                  >
                    {{ error }}
                  </v-alert>
                  <h4 class="mb-6 mt-2 app-text-subheading app-heading-thin">
                    Silahkan login terlebih dahulu
                  </h4>
                  <h4 class="mb-2 app-heading-thin">Username</h4>
                  <v-text-field
                    v-model="username.value"
                    :rules="username.errors"
                    label="Masukan username anda"
                    solo
                    required
                    class="app-outline-thin"
                  ></v-text-field>

                  <h4 class="mb-2 app-heading-thin">Password</h4>
                  <v-text-field
                    v-model="password.value"
                    :rules="password.errors"
                    :append-icon="isShowed ? `mdi-eye` : `mdi-eye-off`"
                    :type="isShowed ? `text` : `password`"
                    name="input-10-1"
                    label="Masukan password anda"
                    solo
                    required
                    @click:append="isShowed = !isShowed"
                  ></v-text-field>
                  <v-btn
                    :loading="isSubmitted"
                    :disabled="isSubmitted"
                    color="#1664D8"
                    class="white--text mt-4"
                    large
                    width="100%"
                    @click="submitForm"
                  >
                    <b>Login</b>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-flex>
      </v-layout>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Home",

  data() {
    return {
      username: {
        errors: [],
        value: "",
      },
      password: {
        errors: [],
        value: "",
      },
      isShowed: false,
      isSubmitted: false,
      isFormErrors: [],
    };
  },

  methods: {
    resetErrors() {
      this.username.errors = [];
      this.password.errors = [];
    },

    async submitForm() {
      this.isSubmitted = true;
      this.resetErrors();

      const isValid = this.inputValidation();
      if (!isValid) {
        this.isSubmitted = false;
        return;
      }
      const response = await this.$store.dispatch("login", {
        username: this.username.value,
        password: this.password.value,
      });

      if (response.isError) {
        this.isFormErrors.push(response.reason);
        this.isSubmitted = false;
        return;
      }
      this.$router.push("/dashboard");
      this.isSubmitted = false;
    },

    inputValidation() {
      const isEmptyUsername = !this.username.value;
      const isEmptyPassword = !this.password.value;
      if (isEmptyUsername) {
        this.username.errors.push("Username tidak boleh kosong");
        return false;
      }
      if (isEmptyPassword) {
        this.password.errors.push("Password tidak boleh kosong");
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
.v-application {
  background: white;
}
</style>
