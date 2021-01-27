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
            <h4 class="app-heading-thin">Edit Data siswa</h4>
            <v-spacer></v-spacer>
            <v-btn icon @click="isClosedDialog">
              <v-icon color="red">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col class="pb-0" cols="6">
                  <h4 class="app-heading-thin app-text-subheading">
                    Nama Lengkap
                  </h4>
                  <v-text-field
                    rounded
                    solo
                    label="Masukan Nama Lengkap"
                  ></v-text-field>
                </v-col>
                <v-col class="pb-0" cols="6">
                  <h4 class="app-heading-thin app-text-subheading">NISN</h4>
                  <v-text-field
                    rounded
                    solo
                    label="Masukan NISN"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="5">
                  <h4 class="app-heading-thin app-text-subheading">Jurusan</h4>
                  <v-select
                    rounded
                    solo
                    :items="jurusan"
                    label="Jurusan"
                  ></v-select>
                </v-col>
                <v-col cols="5">
                  <h4 class="app-heading-thin app-text-subheading">Kelas</h4>
                  <v-select
                    rounded
                    solo
                    :items="kelas"
                    label="Kelas"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pt-0" cols="12">
                  <h4 class="app-heading-thin app-text-subheading">
                    Nama Orangtua
                  </h4>
                  <v-autocomplete
                    solo
                    rounded
                    label="Nama Orangtua"
                  ></v-autocomplete>
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
export default {
  data() {
    return {
      kelas: ["10", "11", "12"],
      jurusan: [
        "Multimedia",
        "Otomatisasi & Tata Kelola Perkantoran",
        "Bisnis Daring Pemasaran",
        "Usaha Perjalanan Wisata",
        "Akuntansi Keuangan Lembaga",
        "Manajemen Logistik",
      ],
    };
  },
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