<template>
  <v-row justify="center">
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
            <!-- <v-row>
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
                  Anak dengan nama anu tidak hadir
                </h2>
              </v-col>
            </v-row> -->

            <!-- <v-row>
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
                  Anak dengan nama anu sudah hadir pada
                </h2>
                <v-chip outlined class="mt-3 font-weight-bold" color="primary">
                  <v-icon left>mdi-clock-time-four-outline</v-icon> 06 :
                  30</v-chip
                >
              </v-col>
            </v-row> -->

            <v-row>
              <v-col class="mx-auto pl-0 pt-3 pb-0" cols="12 ">
                <v-chip color="warning">
                  <v-icon class="pl-2" size="20" left>mdi-file-document</v-icon>
                  <h3 class="app-heading-thin app-text-white pr-2">Izin</h3>
                </v-chip>
                <v-row>
                  <v-col cols="4"
                    ><v-img
                      height="90"
                      contain
                      src="https://picsum.photos/id/11/500/300"
                    ></v-img
                  ></v-col>

                  <v-col cols="4"
                    ><v-img
                      height="90"
                      contain
                      src="https://picsum.photos/id/11/500/300"
                    ></v-img
                  ></v-col>

                  <v-col cols="4"
                    ><v-img
                      height="90"
                      contain
                      src="https://picsum.photos/id/11/500/300"
                    ></v-img
                  ></v-col>
                </v-row>
                <v-card class="mt-5">
                  <v-card-text
                    ><p>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Et, molestiae consequatur? Nihil, ipsum. Cupiditate libero
                      sunt, ad, aperiam ex nam ratione facilis voluptas magnam
                      optio doloribus corrupti recusandae. Aliquid, in.
                    </p></v-card-text
                  >
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    items: ["Hadir", "Belum Hadir", "Izin", "Sakit"],
  }),
  props: ["isShowedDialog"],
  methods: {
    isClosedDialog() {
      this.$emit("closed", true);
    },
  },
};
</script>

<style scoped>
</style>