<template>
  <div>
    <v-row>
      <v-dialog
        max-width="600px"
        scrollable
        persistent
        @click:outside="isClosedDialog"
        v-model="isShowedDialog"
      >
        <v-card>
          <v-card-title>
            <h4 class="app-heading-thin">Buat Izin</h4>
            <v-spacer></v-spacer>
            <v-btn icon @click="isClosedDialog">
              <v-icon color="red">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <h4 class="app-heading-thin app-text-subheading">
                    Masukan Nama Siswa
                  </h4>

                  <v-autocomplete
                    no-filter
                    :search-input.sync="search"
                    v-model="getStudents"
                    clearable
                    :items="permissions"
                    solo
                    label="Nama Siswa"
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
                          <v-list-item-subtitle>
                            {{ data.item.grade }} {{ data.item.major }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="6">
                  <h4 class="app-heading-thin app-text-subheading">
                    Masukan Kategori
                  </h4>
                  <v-select
                    :items="[
                      { text: 'Izin', value: 'izin' },
                      { text: 'Sakit', value: 'sakit' },
                    ]"
                    label="Kategori"
                    solo
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="pt-0">
                  <h4 class="app-heading-thin app-text-subheading">
                    Masukan Deskripsi
                  </h4>
                  <v-textarea solo label="Masukan Deskripsi"></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <h4 class="app-heading-thin app-text-subheading">
                    Masukan Gambar
                  </h4>
                  <v-file-input chips label="Masukan Gambar" multiple solo>
                  </v-file-input>
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
      search: "",
      errors: [],
      isSuccess: false,
    };
  },
  methods: {
    isClosedDialog() {
      this.errors = [];
      this.search = "";
      this.isSuccess = false;
      this.$emit("closed", true);
    },
  },
  props: ["isShowedDialog"],
  computed: {
    ...mapGetters(["getStudents", "getAttendances", "getAbsences"]),
    permissions() {
      let students = this.getStudents;
      let attendances = this.getAttendances;
      let absences = this.getAbsences;

      // Filtering Student Data
      students = students.map((student) => {
        let attendanceData =
          attendances.filter((attendance) => {
            attendance.id_card == student.card_id;
          })[0] || null;
        let absenceData =
          absences.filter((absence) => {
            absence.id_student == student.student_id;
          })[0] || null;
        let attendanceStatus = "hadir";

        let notIsPresence = !attendanceData;
        if (notIsPresence) attendanceStatus = "tidak hadir";

        if (absenceData) attendanceStatus = absenceData.absence_category;

        return {
          attendance: attendanceData || null,
          absence: absenceData || null,
          attendance_status: attendanceStatus,
          ...student,
        };
      });

      if (this.search) {
        return students.filter(
          (student) =>
            student.fullname.toLowerCase().indexOf(this.search.toLowerCase()) >
              -1 ||
            student.grade.toLowerCase().indexOf(this.search.toLowerCase()) >
              -1 ||
            student.major.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        );
      }

      return students;
    },
  },
};
</script>

<style>
</style>