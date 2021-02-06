<template>
  <div>
    <v-row>
      <v-col class="ml-3" cols="12">
        <h2 class="app-heading-thin">Data Siswa</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" class="mt-3 ml-2 mb-4 pr-0">
        <v-btn @click="buttonClick" dark large rounded color="#15D46D"
          ><v-icon left>mdi-plus</v-icon>
          <h4 class="app-text-white app-heading-thin">Tambah Siswa</h4>
        </v-btn>
      </v-col>
      <v-col cols="4" class="mt-3 ml-7 pl-0 mb-4 pr-0">
        <v-btn dark large rounded color="#15D46D"
          ><v-icon left>mdi-microsoft-excel</v-icon>
          <h4 class="app-text-white app-heading-thin">Upload Excel</h4>
        </v-btn>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-4 pr-0 mr-0" cols="1">
        <v-icon>mdi-magnify</v-icon>
      </v-col>
      <v-col class="pl-0" cols="10">
        <h4 class="app-heading-thin">Pencarian</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-0 pt-4 px-6" cols="7">
        <v-text-field
          v-model="searchKeywords"
          height="48px"
          solo
          placeholder="Cari nama siswa"
          rounded
          prepend-inner-icon="mdi-magnify"
          clearable
        ></v-text-field>
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
        <v-select
          v-model="filterByMajor"
          :items="getStudentData.majors"
          rounded
          label="Jurusan"
          solo
        ></v-select>
      </v-col>
      <v-col cols="3" class="ml-4 pr-0 mt-3">
        <v-select
          v-model="filterByGrade"
          :items="getStudentData.grades"
          rounded
          label="Kelas"
          solo
        ></v-select>
      </v-col>
      <v-col cols="3" class="pl-0 ml-4 pr-0 mt-5">
        <v-btn
          icon
          color="error"
          v-show="filterByMajor || filterByGrade ? true : false"
          @click="clearFilter"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="getStudentData.students"
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
      filterByMajor: "",
      filterByGrade: "",
      searchKeywords: "",
      showCrudDialog: false,
      headers: [
        {
          text: "No",
          align: "start",
          sortable: false,
          value: "number",
        },
        { text: "NISN", value: "nisn" },
        { text: "Nama Lengkap", value: "fullname" },
        { text: "Jurusan", value: "major" },
        { text: "Kelas", value: "grade" },
      ],
    };
  },
  methods: {
    rowClick1(e) {
      this.showCrudDialog = true;
    },
    buttonClick(e) {
      this.showCrudDialog = true;
    },
    clearFilter() {
      this.filterByMajor = "";
      this.filterByGrade = "";
    },
  },
  components: {
    CrudDialog,
  },
  computed: {
    getStudentData() {
      let studentData = { ...this.$store.getters.getStudentData };
      let filterByMajor = this.filterByMajor;
      let filterByGrade = this.filterByGrade;
      let searchKeywords = this.searchKeywords;

      if (filterByMajor) {
        studentData.students = studentData.students.filter(
          (student) => student.major.indexOf(filterByMajor) > -1
        );
      }

      if (filterByGrade) {
        studentData.students = studentData.students.filter(
          (student) => student.grade == filterByGrade
        );
      }

      if (searchKeywords) {
        studentData.students = studentData.students.filter(
          (student) =>
            student.fullname
              .toLowerCase()
              .indexOf(searchKeywords.toLowerCase()) > -1
        );
      }

      studentData.students = studentData.students.map((student, index) => ({
        number: index + 1,
        ...student,
      }));

      return studentData;
    },
  },
};
</script>
