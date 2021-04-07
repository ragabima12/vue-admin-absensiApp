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
                    show-size
                    accept="image/jpeg, image/png"
                    counter
                    :rules="rules"
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
import Compressor from "compressorjs";

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
      rules: [
        (value) =>
          value
            .map((file) => file.size)
            .reduce((currVal, nextVal) => (currVal += nextVal), 0) <
            5 * 1000000 || "Total gambar yang diupload harus kurang dari 5MB",
      ],
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

      const compressImage = (fileBlob) =>
        new Promise((resolve, reject) => {
          new Compressor(fileBlob, {
            quality: 0.3,
            async success(result) {
              resolve(await readImage(result));
            },
            error(err) {
              reject(err);
            },
          });
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
      for (let image of imageFiles) base64Images.push(compressImage(image));
      base64Images = await Promise.all(base64Images);

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
        let attendanceData = attendances.filter(
          (attendance) => attendance.student_id == student._id
        );

        const isPresence = attendanceData.length > 0;
        if (isPresence) {
          return {
            attendance: {
              status: "hadir",
              detail: attendanceData[0],
            },
            ...student,
          };
        }

        let absenceData = absences.filter(
          (absence) => absence.id_student === student._id
        );

        const isAbsence = absenceData.length > 0;
        if (isAbsence) {
          return {
            attendance: {
              status: absenceData[0].absence_category,
              detail: absenceData[0],
            },
            ...student,
          };
        }

        return {
          attendance: {
            status: "tidak hadir",
            detail: null,
          },
          ...student,
        };
      });

      if (this.search) {
        return students.filter((student) =>
          student?.fullname && student?.nisn
            ? student.fullname
                .toLowerCase()
                .indexOf(this.search.toLowerCase()) > -1 ||
              student.nisn.toLowerCase().indexOf(this.search.toLowerCase()) > -1
            : false
        );
      }

      students = students.filter(
        (student) => student.attendance.status === "tidak hadir"
      );

      return students;
    },
  },
};
</script>

<style>
</style>