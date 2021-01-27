<template>
  <div>
    <v-row>
      <v-col class="pa-0 pt-4 px-6" cols="7">
        <v-text-field
          height="48px"
          solo
          placeholder="Cari nama siswa"
          rounded
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col class="pa-0 pt-4 px-4" cols="3">
        <v-btn elevation="2" rounded x-large width="100%" color="primary">
          <h5 class="app-text-white app-heading-thin">Cari Siswa</h5>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-4 pr-0 mr-0" cols="1">
        <v-icon>mdi-filter-variant</v-icon>
      </v-col>
      <v-col class="pl-0" cols="10">
        <h4 class="app-heading-thin">Filter</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="ml-4 pr-0 mt-3">
        <v-select :items="jurusan" rounded label="Jurusan" solo></v-select>
      </v-col>
      <v-col cols="4" class="ml-4 pr-0 mt-3">
        <v-select :items="kelas" rounded label="Kelas" solo></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="5"
          class="elevation-1"
          @click:row="rowClick"
        ></v-data-table>
      </v-col>
    </v-row>

    <PresenceDialogue
      @closed="showPresenceDialog = false"
      :isShowedDialog="showPresenceDialog"
    />
  </div>
</template>

<script>
import PresenceDialogue from "@/components/PresenceDialogue";

export default {
  data() {
    return {
      jurusan: ["OTKP", "MM", "AKL", "UPW", "BDP", "MANLOG"],
      kelas: ["10", "11", "12"],
      showPresenceDialog: false,
      sidebar: {
        title: "Presensi",
        menus: [
          { text: "Status Presensi", icon: "mdi-list-status" },
          { text: "Rekap Presensi", icon: "mdi-calendar" },
        ],
        selectedMenu: 0,
      },
      headers: [
        {
          text: "No",
          align: "start",
          sortable: false,
          value: "no",
        },
        { text: "NISN", value: "nisn" },
        { text: "Nama Lengkap", value: "nama_lengkap" },
        { text: "Jurusan", value: "jurusan" },
        { text: "Kelas", value: "kelas" },
        { text: "Status Kehadiram", value: "status_kehadiran" },
      ],
      desserts: [
        {
          no: "1",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
          status_kehadiran: "Hadir",
        },
        {
          no: "2",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
          status_kehadiran: "Hadir",
        },
        {
          no: "3",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
          status_kehadiran: "Hadir",
        },
        {
          no: "4",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
          status_kehadiran: "Hadir",
        },
        {
          no: "5",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
          status_kehadiran: "Hadir",
        },
        {
          no: "6",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
          status_kehadiran: "Hadir",
        },
        {
          no: "7",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
          status_kehadiran: "Hadir",
        },
        {
          no: "8",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
          status_kehadiran: "Hadir",
        },
        {
          no: "9",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
          status_kehadiran: "Hadir",
        },
        {
          no: "10",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
          status_kehadiran: "Hadir",
        },
      ],
    };
  },
  methods: {
    rowClick(e) {
      this.showPresenceDialog = true;
    },
  },
  mounted() {
    this.$store.commit("setSidebar", this.sidebar);
  },
  components: {
    PresenceDialogue,
  },
};
</script>

<style scoped>
</style>