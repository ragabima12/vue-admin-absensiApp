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
                <v-col cols="12">
                  <v-alert v-if="isSuccess" type="success" border="left"
                    >Status kehadiran berhasil diperbaharui</v-alert
                  >
                  <v-alert
                    v-for="(error, errorIndex) of errors"
                    :key="errorIndex"
                    type="error"
                    border="left"
                    >{{ error }}</v-alert
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <h4 class="app-heading-thin app-text-subheading">
                    Masukan Nama Siswa
                  </h4>

                  <v-autocomplete
                    no-filter
                    :search-input.sync="search"
                    v-model="student"
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
                            {{ data.item.nisn }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            {{ data.item.grade }} {{ data.item.major }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col class="" cols="6">
                  <h4 class="app-heading-thin app-text-subheading">
                    Masukan Kategori
                  </h4>
                  <v-select
                    v-model="absenceCategory"
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
                  <v-textarea
                    v-model="absenceDescription"
                    solo
                    label="Masukan Deskripsi"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <h4 class="app-heading-thin app-text-subheading">
                    Masukan Gambar
                  </h4>
                  <v-file-input
                    v-model="imageStore"
                    chips
                    label="Masukan Gambar"
                    multiple
                    solo
                  >
                  </v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :loading="isLoading" @click="sendImagePermission" text>
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
import { isEmpty } from "validator";

export default {
  data() {
    return {
      isSuccess: false,
      isLoading: false,
      search: "",
      errors: [],
      isSuccess: false,
      imageStore: [],
      student: {},
      absenceDescription: "",
      absenceCategory: "izin",
    };
  },
  methods: {
    isClosedDialog() {
      this.errors = [];
      this.search = "";
      this.isSuccess = false;
      this.$emit("closed", true);
    },

    async sendImagePermission() {
      this.isLoading = true;

      this.errors = [];

      const readImage = (fileBlob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(fileBlob);
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = () => {
            reject(false);
          };
        });

      let imageFiles = this.imageStore;
      let isAllowedImages = imageFiles.length <= 3;
      let isEmptyDescription = isEmpty(this.absenceDescription);
      let isEmptyStudent = Object.keys(this.student).length < 1;

      if (isEmptyStudent) {
        this.isLoading = false;
        return this.errors.push("Nama Siswa Tidak Boleh Kosong");
      }

      if (isEmptyDescription) {
        this.isLoading = false;
        return this.errors.push("Deskripsi Tidak Boleh Kosong");
      }

      if (!isAllowedImages) {
        this.isLoading = false;
        return this.errors.push("File Tidak Boleh Lebih Dari 3");
      }

      let base64Images = [];
      for (let image of imageFiles) {
        const base64Image = await readImage(image);
        base64Images.push(base64Image);
      }

      let absenceData = {
        student_id: this.student._id,
        absence_category: this.absenceCategory,
        absence_description: this.absenceDescription,
        absence_attachments: JSON.stringify(base64Images),
      };

      const requestResult = await this.$store.dispatch(
        "storeAbsence",
        absenceData
      );

      if (requestResult.isError) {
        this.isLoading = false;
        return this.errors.push(requestResult.reason);
      }
      this.isLoading = false;
      this.isSuccess = true;
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
        console.log(students);
        return students.filter((student) =>
          student?.fullname && student?.nisn
            ? student.fullname
                .toLowerCase()
                .indexOf(this.search.toLowerCase()) > -1 ||
              student.nisn.toLowerCase().indexOf(this.search.toLowerCase()) > -1
            : false
        );
      }
      return students;
    },
  },
};
</script>

<style>
</style>