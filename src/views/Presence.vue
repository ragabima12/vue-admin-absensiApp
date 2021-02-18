<template>
  <div>
    <v-row>
      <v-col class="ml-3" cols="12">
        <h2 class="app-heading-thin">Data Kehadiran</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="pa-0 pt-4 px-6" cols="7">
        <v-text-field
          v-model="search"
          height="48px"
          solo
          placeholder="Cari nama siswa"
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
          :items="getMajors"
          label="Jurusan"
          solo
          v-model="filter.byMajor"
        ></v-select>
      </v-col>
      <v-col cols="3" class="ml-4 pr-0 mt-3">
        <v-select
          :items="getGrades"
          label="Kelas"
          solo
          v-model="filter.byGrade"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="attendances"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:[`item.attendance_status`]>
            <v-select
              class="mt-6"
              :items="['Sakit', 'Izin', 'Hadir', 'Belum Hadir', 'Alpha']"
              label="Status Kehadiran"
              value="Belum Hadir"
              solo
              dense
            ></v-select>
          </template>

          <template v-slot:[`item.action`]>
            <v-btn color="primary" dense @click="showPresenceStatus"
              >Tinjau</v-btn
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <PresenceDialogue
      @closed="showPresenceDialog = false"
      :isShowedDialog="showPresenceDialog"
    />
  </div>
</template>

<script>
import PresenceDialogue from "@/components/dialogs/UpdatePresence";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      search: "",
      filter: {
        byMajor: null,
        byGrade: null,
      },
      showPresenceDialog: false,
      headers: [
        {
          text: "No",
          align: "start",
          sortable: false,
          value: "number",
        },
        { text: "Nama Lengkap", value: "fullname" },
        { text: "Jurusan", value: "major" },
        { text: "Kelas", value: "grade" },
        { text: "Status Kehadiran", value: "attendance_status" },
        { text: "Aksi", value: "action" },
      ],
    };
  },
  methods: {
    showPresenceStatus() {
      this.showPresenceDialog = true;
    },
  },
  components: {
    PresenceDialogue,
  },
  computed: {
    ...mapGetters(["getGrades", "getMajors", "getStudents"]),
    attendances() {
      let students = this.getStudents;
      let search = this.search;
      let filter = this.filter;

      students = students.map((student, index) => ({
        number: index + 1,
        student_id: student._id,
        fullname: student.fullname.toUpperCase(),
        major: student.major,
        grade: student.grade,
      }));

      if (search)
        students = students.filter(
          (student) =>
            student.fullname.toLowerCase().indexOf(search.toLowerCase()) > -1
        );

      if (filter.byMajor)
        students = students.filter(
          (student) => student.major === filter.byMajor
        );

      if (filter.byGrade)
        students = students.filter(
          (student) => student.grade === filter.byGrade
        );

      return students;
    },
  },
  async mounted() {
    const emptyStudents = !this.$store.getters.getStudents.length;
    if (emptyStudents) await this.$store.dispatch("getStudentData");
  },
};
</script>

<style scoped>
</style>