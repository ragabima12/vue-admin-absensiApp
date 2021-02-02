<template>
  <div>
    <v-row>
      <v-col class="pa-0 pt-4 px-6" cols="7">
        <v-text-field
          height="48px"
          solo
          placeholder="Cari nama orangtua"
          rounded
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col class="pa-0 pt-4 px-4" cols="4">
        <v-btn elevation="2" rounded x-large width="100%" color="primary">
          <h5 class="app-text-white app-heading-thin">Cari Orangtua</h5>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="pl-6 mt-4">
        <v-btn @click="buttonPlus" dark rounded large color="#15D46D"
          ><v-icon left>mdi-plus</v-icon>
          <h4 class="app-text-white app-heading-thin">Tambah Orangtua</h4>
        </v-btn>
      </v-col>
      <v-col cols="4" class="pl-6 mt-4">
        <v-btn dark rounded large color="#15D46D"
          ><v-icon left>mdi-microsoft-excel</v-icon>
          <h4 class="app-text-white app-heading-thin">Upload Excel</h4>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mt-5">
        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="5"
          class="elevation-1"
          @click:row="rowClick1"
        ></v-data-table>
      </v-col>
    </v-row>
    <ParentDialog
      @closed="ShowDialogParent = false"
      :isShowedDialog="ShowDialogParent"
    />
  </div>
</template>

<script>
import ParentDialog from "@/components/ParentDialog";

export default {
  data() {
    return {
      ShowDialogParent: false,
      headers: [
        {
          text: "No",
          align: "start",
          sortable: false,
          value: "no",
        },
        { text: "Nama Orangtua", value: "namaOrtu" },
        { text: "NIK", value: "nik" },
      ],
      desserts: [
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
        {
          no: "1",
          namaOrtu: "aahsaparoh",
          nik: "2277366388291",
        },
      ],
    };
  },
  components: {
    ParentDialog,
  },
  methods: {
    rowClick1(e) {
      this.ShowDialogParent = true;
    },
    buttonPlus(e) {
      this.ShowDialogParent = true;
    },
  },
};
</script>

<style scoped>
</style>