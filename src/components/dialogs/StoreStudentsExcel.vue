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
            <h4 class="app-heading-thin">Upload Data Siswa</h4>
            <v-spacer></v-spacer>
            <v-btn icon @click="isClosedDialog">
              <v-icon color="red">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row class="my-auto">
                <v-col cols="6">
                  <h5 class="app-heading-thin mb-2">
                    Unduh template excel dibawah ini
                  </h5>
                  <v-btn
                    target="_blank"
                    href="https://docs.google.com/spreadsheets/d/11bFRk565ptSFHVYxNN0bdq1uCw-0G5RQSjPQ1xrCae0/edit?usp=sharing"
                    dark
                    color="#15D46D"
                    large
                    rounded
                    ><v-icon left>mdi-download</v-icon>
                    <h4 class="app-text-white app-heading-thin">
                      Unduh Template
                    </h4></v-btn
                  >
                </v-col>
              </v-row>
              <v-row class="my-auto">
                <v-col cols="12"
                  ><h5 class="app-heading-thin mb-2">Unggah excel disini</h5>
                  <v-file-input
                    :disabled="isUploading"
                    show-size
                    placeholder="Upload Excel"
                    solo
                    rounded
                    truncate-length="12"
                    ref="uploadExcel"
                    v-model="fileInput"
                  ></v-file-input
                ></v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-expansion-panels
                    v-if="responseErrors.parentErrors.length > 0"
                    accordion
                  >
                    <v-expansion-panel>
                      <v-expansion-panel-header disable-icon-rotate>
                        Ditemukan {{ responseErrors.parentErrors.length }} saat
                        menyimpan data orangtua
                        <template v-slot:actions>
                          <v-icon color="error">mdi-alert-circle</v-icon>
                        </template>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card max-height="400" class="overflow-y-auto">
                          <v-list-item
                            v-for="(
                              parentErr, parentErrIndex
                            ) of responseErrors.studentErrors"
                            :key="parentErrIndex"
                          >
                            <v-list-item-icon>
                              <v-icon color="error">mdi-alert</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-content-title>
                                {{ parentErr.errorType }}
                              </v-list-item-content-title>
                              <v-list-item-content-subtitle>
                                {{ parentErr.reason }}
                              </v-list-item-content-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
                <v-col cols="12">
                  <v-expansion-panels
                    v-if="responseErrors.studentErrors.length > 0"
                    accordion
                  >
                    <v-expansion-panel>
                      <v-expansion-panel-header disable-icon-rotate>
                        Ditemukan {{ responseErrors.studentErrors.length }} saat
                        menyimpan data siswa
                        <template v-slot:actions>
                          <v-icon color="error">mdi-alert-circle</v-icon>
                        </template>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card max-height="250" class="overflow-y-auto">
                          <v-list-item
                            v-for="(
                              studentErr, studentErrIndex
                            ) of responseErrors.studentErrors"
                            :key="studentErrIndex"
                          >
                            <v-list-item-icon>
                              <v-icon color="error">mdi-alert</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-content-title>
                                {{ studentErr.errorType }}
                              </v-list-item-content-title>
                              <v-list-item-content-subtitle>
                                {{ studentErr.reason }}
                              </v-list-item-content-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="isUploading"
              ref="button"
              @click="sendFileExcel"
              text
            >
              <h4 class="app-heading-thin">Simpan</h4>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="infoBar.isShowed">
        {{ infoBar.text }}
      </v-snackbar>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Request from "@/plugins/APIRequests.js";
import Vue from "vue";
import VueCookies from "vue-cookies";

Vue.use(VueCookies);

export default {
  data() {
    return {
      responseErrors: {
        parentErrors: [],
        studentErrors: [],
      },
      fileInput: "",
      isUploading: false,
      infoBar: {
        isShowed: false,
        text: "",
      },
    };
  },

  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.$emit("closed", true);
    },

    async sendFileExcel() {
      const readFile = (fileBlob) =>
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

      let excelFile = this.fileInput;
      const base64ExcelFile = await readFile(excelFile);
      const accessToken = Vue.$cookies.get("access-token");

      this.isUploading = true;

      // Tampilkan pesan sedang upload
      this.infoBar.isShowed = true;
      this.infoBar.text = "Sedang Upload";

      const UploadResult = await Request.UploadExcelFile(
        accessToken,
        base64ExcelFile
      );

      let errorParents = UploadResult.data.data.parentStoreErrors;
      let errorStudents = UploadResult.data.data.studentStoreErrors;

      this.responseErrors.parentErrors = errorParents;
      this.responseErrors.studentErrors = errorStudents;

      console.log(errorParents);

      // Tampilkan pesan selesai
      this.infoBar.isShowed = true;
      this.infoBar.text = "Selesai Upload";
      this.isUploading = false;
    },
  },
  computed: {
    ...mapGetters([]),
  },
};
</script>

<style scoped>
</style>