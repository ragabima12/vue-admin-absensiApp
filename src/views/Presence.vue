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
      <v-col cols="2" class="ml-4 pr-0 mt-3">
        <v-select
          :items="getMajors"
          label="Jurusan"
          solo
          v-model="filter.byMajor"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="2" class="ml-4 pr-0 mt-3">
        <v-select
          :items="getGrades"
          label="Tahun Ajaran"
          solo
          v-model="filter.byGrade"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="3" class="ml-4 pr-0 mt-3">
        <v-select
          :items="[
            { text: 'Izin', value: 'izin' },
            { text: 'Sakit', value: 'sakit' },
            { text: 'Hadir', value: 'hadir' },
            { text: 'Tidak Hadir', value: 'tidak hadir' },
          ]"
          label="Status Kehadiran"
          solo
          v-model="filter.byAttendance"
          clearable
        ></v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="3" class="pl-1 pr-0 mt-4">
        <v-btn @click="showPermissionDialog" width="150" large color="#15D46D">
          <v-icon left color="white">mdi-clipboard-list</v-icon>
          <h4 class="app-text-white app-heading-thin">Buat Izin</h4>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h5 class="app-heading-thin ml-1 mb-4 app-text-subheading">
          Status kehadiran pada {{ todayDate }}
        </h5>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="attendances"
          :items-per-page="5"
          class="elevation-1"
          :loading="isLoading"
          :page.sync="currentPage"
          no-data="Sedang perbaharui kehadiran"
        >
          <template v-slot:[`item.attendance`]="{ item }">
            <v-select
              v-if="['sakit', 'izin'].includes(item.attendance.status)"
              class="mt-6"
              label="Status Kehadiran"
              :items="[
                { text: 'Izin', value: 'izin' },
                { text: 'Sakit', value: 'sakit' },
              ]"
              :value="item.attendance.status"
              readonly
              solo
              dense
            >
            </v-select>

            <v-select
              @change="updateAttendance($event, item)"
              v-else
              class="mt-6"
              label="Status Kehadiran"
              :items="[
                { text: 'Hadir', value: 'hadir' },
                { text: 'Tidak Hadir', value: 'tidak hadir' },
              ]"
              :value="item.attendance.status"
              solo
              dense
            ></v-select>
          </template>
          <template v-slot:[`item.action`]="item">
            <v-btn color="primary" dense @click="showPresenceStatus(item.item)"
              >Tinjau</v-btn
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <PermissionDialog
      :isShowedDialog="showPermission"
      @closed="showPermission = false"
    />

    <PresenceDialogue
      @closed="showPresenceDialog = false"
      :isShowedDialog="showPresenceDialog"
    />
  </div>
</template>

<script>
import Moment from "moment";
import PresenceDialogue from "@/components/dialogs/DetailedPresence";
import PermissionDialog from "@/components/dialogs/StoreAbsence";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      currentPage: 1,
      showPermission: false,
      isLoading: false,
      search: "",
      filter: {
        byMajor: null,
        byGrade: null,
        byAttendance: null,
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
        { text: "Tahun Ajaran", value: "grade" },
        { text: "Status Kehadiran", value: "attendance" },
        { text: "Aksi", value: "action" },
      ],
    };
  },
  methods: {
    showPermissionDialog() {
      this.showPermission = true;
    },
    showPresenceStatus(attendance) {
      this.showPresenceDialog = true;
      this.$store.commit("setSelectedAttendance", attendance);
    },
    updateAttendance(ev, param) {
      console.log(ev, param.card_id);
      let payload = {
        "attendance-status": ev,
        "card-id": param.card_id,
      };
      this.$store.dispatch("updateAttendance", payload);
    },
  },
  components: {
    PresenceDialogue,
    PermissionDialog,
  },
  computed: {
    ...mapGetters([
      "getGrades",
      "getMajors",
      "getStudents",
      "getAttendances",
      "getAbsences",
    ]),
    attendances() {
      let students = this.getStudents;
      let attendances = this.getAttendances;
      let absences = this.getAbsences;
      let search = this.search;
      let filter = this.filter;
      this.currentPage = 1;

      // Parsing student data
      students = students.map((student, index) => ({
        number: index + 1,
        student_id: student._id,
        fullname: student.fullname.toUpperCase(),
        major: student.major,
        grade: student.grade,
        card_id: student.card_id,
      }));

      // Filtering student attendance
      students = students.map((student) => {
        let attendanceData = attendances.filter(
          (attendance) => attendance.student_id === student.student_id
        );

        const isPresence = attendanceData.length > 0;
        if (isPresence) {
          return {
            attendance: {
              status: "hadir",
              detail: attendanceData[0],
            },
            ...student,
          };
        }

        let absenceData = absences.filter(
          (absence) => absence.id_student === student.student_id
        );

        const isAbsence = absenceData.length > 0;
        if (isAbsence) {
          return {
            attendance: {
              status: absenceData[0].absence_category,
              detail: absenceData[0],
            },
            ...student,
          };
        }

        return {
          attendance: {
            status: "tidak hadir",
            detail: null,
          },
          ...student,
        };
      });

      // Filtering student data
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

      if (filter.byAttendance)
        students = students.filter(
          (student) => student.attendance.status === filter.byAttendance
        );

      return students;
    },
    todayDate() {
      return Moment().locale("id").format("LL");
    },
  },
  async mounted() {
    this.isLoading = true;
    const emptyStudents = !this.$store.getters.getStudents.length;
    if (emptyStudents) await this.$store.dispatch("getStudentData");

    const emptyAttendances = !this.$store.getters.getAttendances.length;
    if (emptyAttendances) await this.$store.dispatch("getAttendanceData");

    const emptyAbsences = !(await this.$store.getters.getAbsences.length);
    if (emptyAbsences) await this.$store.dispatch("getAbsenceData");
    this.isLoading = false;
  },
};
</script>

<style scoped>
</style>