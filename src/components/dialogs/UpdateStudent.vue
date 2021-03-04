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
            <h4 class="app-heading-thin">Edit Data Siswa</h4>
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
                    Data siswa berhasil diperbaharui
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
                    v-model="getSelectedStudent.fullname"
                    solo
                    label="Masukan Nama Lengkap"
                    :disabled="isLoading"
                  ></v-text-field>
                </v-col>
                <v-col class="pb-0" cols="6">
                  <h4 class="app-heading-thin app-text-subheading">NISN</h4>
                  <v-text-field
                    v-model="getSelectedStudent.nisn"
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
                    v-model="getSelectedStudent.card_id"
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
                    v-model="getSelectedStudent.major"
                    label="Jurusan"
                    :disabled="isLoading"
                  ></v-select>
                </v-col>
                <v-col cols="5">
                  <h4 class="app-heading-thin app-text-subheading">Kelas</h4>
                  <v-select
                    solo
                    :items="getGrades"
                    v-model="getSelectedStudent.grade"
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
                  {{ getSelectedStudent }}
                  <v-autocomplete
                    v-model="getSelectedStudent.parent"
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
            <v-btn
              @click="deleteStudent"
              :loading="isDeleteLoading"
              text
              color="error"
            >
              <h4 class="app-heading-thin app-text-error">Hapus</h4>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="isDeleteLoading"
              text
              @click="updateStudent"
              :loading="isLoading"
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
      search: "",
      errors: [],
      isLoading: false,
      isDeleteLoading: false,
      isSuccess: false,
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
    async updateStudent() {
      this.isLoading = true;
      this.isSuccess = false;

      this.resetErrors();
      let studentData = this.$store.getters.getSelectedStudent;
      let { fullname, nisn, card_id } = studentData;
      if (!fullname) this.errors.push("Nama siswa tidak boleh kosong");
      if (!nisn) this.errors.push("NISN siswa tidak boleh kosong");

      if (this.errors.length > 0) {
        this.isLoading = false;
        return;
      }
      const result = await this.$store.dispatch("updateStudentData");
      if (result.isError) {
        this.errors.push(
          `Terjadi kesalahan saat memperbaharui data siswa, ${result.reason}`
        );
        this.isLoading = false;
        return;
      }

      this.isLoading = false;
      this.isSuccess = true;
    },
    async deleteStudent() {
      this.isDeleteLoading = true;
      const result = await this.$store.dispatch("deleteStudentData");

      if (result.isError) {
        this.errors.push(
          `Terjadi kesalahan saat menghapus data siswa, ${result.reason}`
        );
        this.isDeleteLoading = false;
        return false;
      }

      this.isDeleteLoading = false;
      this.$emit("closed", true);
    },
  },
  computed: {
    ...mapGetters(["getMajors", "getGrades", "getSelectedStudent"]),
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