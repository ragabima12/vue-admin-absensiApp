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
            <h4 class="app-heading-thin">Tambah Data Siswa</h4>
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
                    Data siswa berhasil dimasukan!
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
                    v-model="student.fullname"
                    solo
                    label="Masukan Nama Lengkap"
                    :disabled="isLoading"
                  ></v-text-field>
                </v-col>
                <v-col class="pb-0" cols="6">
                  <h4 class="app-heading-thin app-text-subheading">NISN</h4>
                  <v-text-field
                    v-model="student.nisn"
                    solo
                    label="Masukan NISN"
                    :disabled="isLoading"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0" cols="12">
                  <h4 class="app-heading-thin app-text-subheading">ID Card</h4>
                  <v-text-field
                    v-model="student.card_id"
                    solo
                    label="Masukan Nama Lengkap"
                    :disabled="isLoading"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5">
                  <h4 class="app-heading-thin app-text-subheading">Jurusan</h4>
                  <v-select
                    solo
                    :items="getMajors"
                    v-model="student.major"
                    label="Jurusan"
                    :disabled="isLoading"
                  ></v-select>
                </v-col>
                <v-col cols="5">
                  <h4 class="app-heading-thin app-text-subheading">Kelas</h4>
                  <v-select
                    solo
                    :items="getGrades"
                    v-model="student.grade"
                    label="Kelas"
                    :disabled="isLoading"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pt-0 pb-0" cols="12">
                  <h4 class="app-heading-thin app-text-subheading">
                    Nama Orangtua
                  </h4>
                  <v-autocomplete
                    v-model="student.parent"
                    :items="getParents"
                    :search-input.sync="search"
                    solo
                    color="blue-grey lighten-2"
                    label="Nama Orangtua"
                    clearable
                    no-filter
                    :disabled="isLoading"
                  >
                    <template v-slot:selection="data">
                      {{ data.item.fullname }}
                    </template>
                    <template v-slot:item="data">
                      <template>
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="data.item.fullname"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-html="data.item.unique_credential"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="storeStudent" :loading="isLoading">
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
      search: "",
      errors: [],
      isLoading: false,
      isSuccess: false,
      student: {
        nisn: null,
        fullname: null,
        card_id: null,
        major: null,
        grade: null,
        parent: null,
      },
    };
  },

  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.errors = [];
      this.search = "";
      this.isSuccess = false;
      this.$emit("closed", true);
    },
    resetErrors() {
      this.errors = [];
    },
    async storeStudent() {
      this.isLoading = true;
      this.isSuccess = false;
      this.resetErrors();

      const student = this.student;
      if (!student.fullname) this.errors.push("Nama siswa tidak boleh kosong");
      if (!student.nisn) this.errors.push("NISN siswa tidak boleh kosong");
      if (isNaN(student.nisn))
        this.errors.push("NISN siswa harus berupa angka");
      if (!student.major) this.errors.push("Jurusan tidak boleh kosong");
      if (!student.grade) this.errors.push("Kelas tidak boleh kosong");

      const isErrors = this.errors.length > 0;
      if (isErrors) {
        this.isLoading = false;
        return false;
      }

      const result = await this.$store.dispatch("storeStudentData", student);
      console.log(result);
      if (result.isError) {
        this.errors.push(
          `Terjadi kesalahan saat memperbaharui data siswa, ${result.reason}`
        );
        this.isLoading = false;
        return false;
      }

      this.isLoading = false;
      this.isSuccess = true;
    },
  },
  computed: {
    ...mapGetters(["getMajors", "getGrades"]),
    getParents() {
      let parents = this.$store.getters.getParents;
      if (this.search) {
        return parents.filter(
          (parent) =>
            parent.fullname.toLowerCase().indexOf(this.search.toLowerCase()) >
              -1 ||
            parent.unique_credential
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) > -1
        );
      }

      return parents;
    },
  },
};
</script>

<style scoped>
</style>