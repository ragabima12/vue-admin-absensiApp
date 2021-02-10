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
              <v-row class="my-auto">
                <v-col class="pb-0" cols="6">
                  <h4 class="app-heading-thin app-text-subheading">
                    Nama Lengkap
                  </h4>
                  <v-text-field
                    v-model="getSelectedStudent.fullname"
                    rounded
                    solo
                    label="Masukan Nama Lengkap"
                  ></v-text-field>
                </v-col>
                <v-col class="pb-0" cols="6">
                  <h4 class="app-heading-thin app-text-subheading">NISN</h4>
                  <v-text-field
                    v-model="getSelectedStudent.nisn"
                    rounded
                    solo
                    label="Masukan NISN"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0" cols="12">
                  <h4 class="app-heading-thin app-text-subheading">ID Card</h4>
                  <v-text-field
                    v-model="getSelectedStudent.card_id"
                    rounded
                    solo
                    label="Masukan Nama Lengkap"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5">
                  <h4 class="app-heading-thin app-text-subheading">Jurusan</h4>
                  <v-select
                    rounded
                    solo
                    :items="getMajors"
                    v-model="getSelectedStudent.major"
                    label="Jurusan"
                  ></v-select>
                </v-col>
                <v-col cols="5">
                  <h4 class="app-heading-thin app-text-subheading">Kelas</h4>
                  <v-select
                    rounded
                    solo
                    :items="getGrades"
                    v-model="getSelectedStudent.grade"
                    label="Kelas"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pt-0 pb-0" cols="12">
                  <h4 class="app-heading-thin app-text-subheading">
                    Nama Orangtua
                  </h4>
                  <v-autocomplete
                    v-model="parent"
                    :items="parents"
                    solo
                    rounded
                    color="blue-grey lighten-2"
                    label="Nama Orangtua"
                    item-text="name"
                    item-value="name"
                    clearable
                    hide-no-data
                  >
                    <template v-slot:item="data">
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content
                          v-text="data.item"
                        ></v-list-item-content>
                      </template>
                      <template v-else>
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="data.item.name"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-html="data.item.nik"
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
  data() {
    return {
      parent: [],
      name: "Midnight Crew",
      parents: [
        { name: "Sandra Adams", nik: "202001122332" },
        { name: "Ali Connors", nik: "202001122332" },
        { name: "Trevor Hansen", nik: "202001122332" },
        { name: "Tucker Smith", nik: "202001122332" },
        { name: "Britta Holt", nik: "202001122332" },
        { name: "Jane Smith ", nik: "202001122332" },
        { name: "John Smith", nik: "202001122332" },
        { name: "Sandra Williams", nik: "202001122332" },
      ],
    };
  },

  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.$emit("closed", true);
    },
  },
  computed: {
    ...mapGetters([
      "getStudents",
      "getMajors",
      "getGrades",
      "getSelectedStudent",
    ]),
  },
};
</script>

<style scoped>
</style>e