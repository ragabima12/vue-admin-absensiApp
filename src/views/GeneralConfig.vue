<template>
  <div>
    <v-row>
      <v-col class="ml-3" cols="12">
        <h2 class="app-heading-thin">Konfigurasi Umum</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-3 pt-6 pb-0" cols="12">
        <h4 class="app-heading-thin app-text-subheading">Tingkatan Awal</h4>
        <p class="app-heading-thin app-text-subheading mb-1">
          Tingkatan digunakan untuk menentukan jenjang kelas
        </p>
      </v-col>
      <v-col class="ml-3" cols="3">
        <v-text-field
          v-model="firstGradeAlias"
          solo
          label="Tingkatan Awal"
          min="1"
          type="number"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-3" cols="12">
        <h4 class="app-heading-thin app-text-subheading">Hari Libur</h4>
        <p class="app-heading-thin app-text-subheading mb-1">
          Hari libur digunakan untuk menghitung jumlah alfa siswa
        </p>
      </v-col>
      <v-col class="ml-3 pt-0" cols="4">
        <v-select
          v-model="daysOff"
          multiple
          solo
          :items="dayList"
          clearable
          label="Hari libur"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-3 pt-0" cols="4">
        <v-btn color="#15D46D" class="mb-4" large>
          <h4 class="app-heading-thin app-text-white">Simpan</h4>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstGradeAlias: 10,
      daysOff: [6, 7],
      dayList: [
        {
          text: "Senin",
          value: 1,
        },
        {
          text: "Selasa",
          value: 2,
        },
        {
          text: "Rabu",
          value: 3,
        },
        {
          text: "Kamis",
          value: 4,
        },
        {
          text: "Jumat",
          value: 5,
        },
        {
          text: "Sabtu",
          value: 6,
        },
        {
          text: "Minggu",
          value: 7,
        },
      ],
    };
  },
  methods: {},
};
</script>

<style>
</style>