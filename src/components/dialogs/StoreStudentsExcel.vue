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
      fileInput: "",
      isUploading: false,
    };
  },

  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.$emit("closed", true);
    },

    async sendFileExcel() {
      if (this.isUploading) {
        return alert("Sedang mengupload file");
      }
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

      const UploadResult = await Request.UploadExcelFile(
        accessToken,
        base64ExcelFile
      );

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