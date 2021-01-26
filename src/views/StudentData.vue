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
      <v-col cols="3" class="ml-4 pr-0 mt-3">
        <v-select rounded label="Jurusan" solo></v-select>
      </v-col>
      <v-col cols="3" class="ml-4 pr-0 mt-3">
        <v-select rounded label="Kelas" solo></v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="4" class="pl-8 mt-4">
        <v-btn dark rounded large color="#15D46D"
          ><v-icon left>mdi-plus</v-icon>
          <h4 class="app-text-white app-heading-thin">Tambah Siswa</h4>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="5"
          class="elevation-1"
          @click:row="rowClick1"
        ></v-data-table>
      </v-col>
    </v-row>

    <CrudDialog
      @closed="showCrudDialog = false"
      :isShowedDialog="showCrudDialog"
    />
  </div>
</template>

<script>
import CrudDialog from "@/components/CrudDialogue";

export default {
  data() {
    return {
      showCrudDialog: false,
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
      ],
      desserts: [
        {
          no: "1",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
        },
        {
          no: "1",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
        },
        {
          no: "1",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
        },
        {
          no: "1",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
        },
        {
          no: "1",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
        },
        {
          no: "1",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
        },
        {
          no: "1",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
        },
        {
          no: "1",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
        },
        {
          no: "1",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
        },
        {
          no: "1",
          nisn: "0022223344657",
          nama_lengkap: "Raga Bima Jati Raksa",
          jurusan: "MM",
          kelas: 11,
        },
      ],
    };
  },
  methods: {
    rowClick1(e) {
      this.showCrudDialog = true;
    },
  },
  components: {
    CrudDialog,
  },
};
</script>

<style scoped>
</style>