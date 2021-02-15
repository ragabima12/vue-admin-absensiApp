<template>
  <div>
    <v-row>
      <v-col class="ml-3" cols="12">
        <h2 class="app-heading-thin">Data Siswa</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" class="mt-3 ml-2 mb-4 pr-0">
        <v-btn
          dark
          large
          rounded
          color="#15D46D"
          @click="showStoreStudentDialog"
          ><v-icon left>mdi-plus</v-icon>
          <h4 class="app-text-white app-heading-thin">Tambah Siswa</h4>
        </v-btn>
      </v-col>
      <v-col cols="4" class="mt-3 ml-7 pl-0 mb-4 pr-0">
        <v-btn
          @click="showStudentExcelUploadDialog"
          dark
          large
          rounded
          color="#15D46D"
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
          :items="getMajors"
          rounded
          label="Jurusan"
          solo
          @change="tableOptions.page = 1"
        ></v-select>
      </v-col>
      <v-col cols="3" class="ml-4 pr-0 mt-3">
        <v-select
          v-model="filterByGrade"
          :items="getGrades"
          rounded
          label="Kelas"
          solo
          @change="tableOptions.page = 1"
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
          :items="StudentData"
          :items-per-page="5"
          class="elevation-1"
          @click:row="selectStudent"
          :options.sync="tableOptions"
          :loading="isLoadingTable"
          loading-text="Mohon tunggu ..."
        ></v-data-table>
      </v-col>
    </v-row>
    <UpdateStudent
      @closed="showUpdateStudent = false"
      :isShowedDialog="showUpdateStudent"
    />
    <StoreStudent
      @closed="showStoreStudent = false"
      :isShowedDialog="showStoreStudent"
    />
    <StoreExcelData
      @closed="showExcelUpload = false"
      :isShowedDialog="showExcelUpload"
    />
  </div>
</template>

<script>
import StoreExcelData from "@/components/dialogs/StoreStudentsExcel";
import UpdateStudent from "@/components/dialogs/UpdateStudent";
import StoreStudent from "@/components/dialogs/StoreStudent";

import { mapGetters } from "vuex";

export default {
  data() {
    return {
      filterByMajor: "",
      filterByGrade: "",
      searchKeywords: "",
      showUpdateStudent: false,
      showExcelUpload: false,
      showStoreStudent: false,
      tableOptions: {
        page: 1,
      },
      isLoadingTable: true,
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
    selectStudent(studentData) {
      this.$store.commit("setSelectedStudent", studentData);
      this.showUpdateStudent = true;
    },
    clearFilter() {
      this.filterByMajor = "";
      this.filterByGrade = "";
    },
    showStudentExcelUploadDialog() {
      this.showExcelUpload = true;
    },

    showStoreStudentDialog() {
      this.showStoreStudent = true;
    },
  },
  components: {
    UpdateStudent,
    StoreExcelData,
    StoreStudent,
  },
  async mounted() {
    const emptyStudents = !this.$store.getters.getStudents.length;
    if (emptyStudents) await this.$store.dispatch("getStudentData");

    const emptyParents = !this.$store.getters.getParents.length;
    if (emptyParents) await this.$store.dispatch("getParentData");
  },
  computed: {
    StudentData() {
      let studentData = this.$store.getters.getStudents;
      let parentData = this.$store.getters.getParents;

      if (studentData.length > 0) {
        this.isLoadingTable = false;
        let filterByMajor = this.filterByMajor;
        let filterByGrade = this.filterByGrade;
        let searchKeywords = this.searchKeywords;

        if (filterByMajor) {
          studentData = studentData.filter(
            (student) => student.major.indexOf(filterByMajor) > -1
          );
        }

        if (filterByGrade) {
          studentData = studentData.filter(
            (student) => student.grade == filterByGrade
          );
        }

        if (searchKeywords) {
          studentData = studentData.filter(
            (student) =>
              student.fullname
                .toLowerCase()
                .indexOf(searchKeywords.toLowerCase()) > -1
          );
        }

        // Data Numbering
        studentData = studentData.map((student, index) => ({
          number: index + 1,
          ...student,
        }));

        // Matching with pardent data
        studentData = studentData.map((student) => {
          let parent = parentData.filter(
            (parent) => parent._id === student.parent_id
          );
          parent = parent[0];
          let result = { parent: parent, ...student };
          delete result.parent_id;
          return result;
        });

        return studentData;
      }
      this.isLoadingTable = true;
      return [];
    },
    ...mapGetters(["getMajors", "getGrades"]),
  },
};
</script>
