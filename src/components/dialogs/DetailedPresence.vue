<template>
  <v-row justify="center" v-if="selectedAttendance.attendance">
    <v-dialog
      max-width="400"
      v-model="isShowedDialog"
      @click:outside="isClosedDialog"
    >
      <v-card>
        <v-card-title primary-title>
          <h4 class="app-heading-thin">Status Presensi</h4>
          <v-spacer></v-spacer>
          <v-btn icon @click="isClosedDialog">
            <v-icon color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row v-if="selectedAttendance.attendance.status === 'hadir'">
              <v-col class="mx-auto pt-3 pb-0" cols="12 ">
                <v-img
                  contain
                  height="240"
                  width="full-width"
                  src="@/assets/sudah_tiba_1.svg"
                ></v-img>
              </v-col>
              <v-col class="text-center pt-1" cols="10" offset-lg="1">
                <h2 class="app-heading-thin app-text-line-height">
                  Anak dengan nama {{ selectedAttendance.fullname }} sudah hadir
                  pada
                </h2>
                <v-chip outlined class="mt-3 font-weight-bold" color="primary">
                  <v-icon left>mdi-clock-time-four-outline</v-icon>
                  {{ presentTime }}
                  </v-chip
                >
              </v-col>
            </v-row>

            <v-row
              v-if="selectedAttendance.attendance.status === 'tidak hadir'"
            >
              <v-col class="mx-auto pt-3 pb-0" cols="12 ">
                <v-img
                  contain
                  height="240"
                  width="full-width"
                  src="@/assets/belum_tiba.svg"
                ></v-img>
              </v-col>
              <v-col class="text-center pt-1" cols="10" offset-lg="1">
                <h2 class="app-heading-thin app-text-line-height">
                  Anak dengan nama {{ selectedAttendance.fullname }} tidak hadir
                </h2>
              </v-col>
            </v-row>

            <v-row
              v-if="
                ['sakit', 'izin'].includes(selectedAttendance.attendance.status)
              "
            >
              <v-col class="mx-auto pl-0 pt-3 pb-0" cols="12 ">
                <v-chip color="warning">
                  <v-icon
                    class="pl-2"
                    size="20"
                    left
                    v-text="
                      selectedAttendance.attendance.detail.absence_category ==
                      'izin'
                        ? 'mdi-file-document'
                        : 'mdi-medical-bag'
                    "
                  ></v-icon>
                  <h3 class="app-heading-thin app-text-white pr-2">
                    {{ selectedAttendance.attendance.detail.absence_category }}
                  </h3>
                </v-chip>
                <v-row>
                  <v-col
                    cols="6"
                    class="mt-4 mb-4"
                    v-for="(
                      absenceImage, absenceImageIndex
                    ) of selectedAttendance.attendance.detail
                      .absence_attachments"
                    :key="absenceImageIndex"
                  >
                    <v-hover>
                      <template v-slot:default="{ hover }">
                        <v-card>
                          <v-img
                            height="90"
                            contain
                            :src="`${apiHost}${absenceImage.attachment_url}`"
                          >
                          </v-img>

                          <v-fade-transition>
                            <v-overlay v-if="hover" absolute color="black">
                              <v-btn
                                text
                                @click="
                                  zoomImage(
                                    `${apiHost}${absenceImage.attachment_url}`
                                  )
                                "
                              >
                                <v-icon left>mdi-magnify</v-icon>
                                Perbesar</v-btn
                              >
                            </v-overlay>
                          </v-fade-transition>
                        </v-card>
                      </template>
                    </v-hover>
                  </v-col>
                </v-row>
                <v-card class="mt-1">

                  <v-card-text
                    ><p>
                      {{
                        selectedAttendance.attendance.detail.absence_description
                      }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>

      <v-dialog
        transition="dialog-bottom-transition"
        max-width="100%"
        v-model="zoomImageDialog"
      >
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="primary" dark>
              <h4 class="app-heading-thin app-text-white">Bukti Screenshoot</h4>
              <v-spacer></v-spacer>
              <v-btn icon @click="dialog.value = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card>
              <v-img contain :src="zoomedImageUrl"> </v-img>
            </v-card>
          </v-card>
        </template>
      </v-dialog>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import Moment from "moment";

export default {
  data: () => ({
    zoomImageDialog: false,
    zoomedImageUrl: "",
    imageOverlay: false,
  }),
  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.$emit("closed", true);
    },
    zoomImage(imageUrl) {
      this.zoomedImageUrl = imageUrl;
      this.zoomImageDialog = true;
    },
  },
  computed: {
    ...mapState(["selectedAttendance"]),
    apiHost() {
      return process.env.VUE_APP_API_HOST;
    },
    presentTime() {
      let presentDate = this.selectedAttendance.attendance.detail
        .present_datetime;
      presentDate = Moment(presentDate).format("HH : mm");
      return presentDate;
    },
  },
};
</script>

<style scoped>
</style>