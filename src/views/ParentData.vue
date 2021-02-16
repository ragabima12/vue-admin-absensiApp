<template>
  <div>
    <v-row>
      <v-col class="ml-3" cols="12">
        <h2 class="app-heading-thin">Data Orang Tua</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="mt-3 ml-2 mb-4 pr-0">
        <v-btn dark large color="#15D46D" @click="showStoreParentDialog"
          ><v-icon left>mdi-plus</v-icon>
          <h4 class="app-text-white app-heading-thin">Tambah Orang Tua</h4>
        </v-btn>
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
          v-model="search"
          height="48px"
          solo
          placeholder="Cari nama orang tua"
          prepend-inner-icon="mdi-magnify"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="mt-5">
        <v-data-table
          :headers="headers"
          :items="parents"
          :items-per-page="5"
          class="elevation-1"
          :loading="isLoadingTable"
        >
          <template v-slot:[`item.email`]="{ item }">
            {{ item.email || "-" }}
          </template>

          <template v-slot:[`item.phone_number`]="{ item }">
            {{ item.phone_number || "-" }}
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-btn color="primary" dense @click="showUpdateParentDialog(item)"
              >Edit</v-btn
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <UpdateParentDialog
      @closed="ShowUpdateDialog = false"
      :isShowedDialog="ShowUpdateDialog"
    />

    <StoreParentDialog
      @closed="ShowStoreDialog = false"
      :isShowedDialog="ShowStoreDialog"
    />
  </div>
</template>

<script>
import UpdateParentDialog from "@/components/dialogs/UpdateParent";
import StoreParentDialog from "@/components/dialogs/StoreParent";

import { mapGetters } from "vuex";

export default {
  data() {
    return {
      search: "",
      ShowUpdateDialog: false,
      ShowStoreDialog: false,
      isLoadingTable: true,
      headers: [
        {
          text: "No",
          align: "start",
          sortable: false,
          value: "number",
        },
        { text: "Nama Orang Tua", value: "fullname" },
        { text: "Nomor Induk Keluarga", value: "unique_credential" },
        { text: "Email", value: "email" },
        { text: "Phone Number", value: "phone_number" },
        { text: "Aksi", value: "action" },
      ],
    };
  },
  components: {
    UpdateParentDialog,
    StoreParentDialog,
  },
  methods: {
    showUpdateParentDialog(parent) {
      let { fullname, unique_credential, id, email, phone_number } = parent;
      parent = {
        id: id,
        fullname: fullname,
        nik: unique_credential,
        email: email,
        phone_number: phone_number,
      };
      this.$store.commit("setSelectedParent", parent);
      this.ShowUpdateDialog = true;
    },
    showStoreParentDialog() {
      this.ShowStoreDialog = true;
    },
  },
  async mounted() {
    const emptyParents = !this.$store.getters.getParents.length;
    if (emptyParents) await this.$store.dispatch("getParentData");
  },

  computed: {
    ...mapGetters(["getParents"]),
    parents() {
      let parents = this.getParents;
      let search = this.search;
      if (parents.length > 0) {
        parents = parents.map((parent, index) => ({
          fullname: parent.fullname.toUpperCase(),
          unique_credential: parent.unique_credential,
          email: parent.email,
          phone_number: parent.phone_number,
          number: index + 1,
          id: parent._id,
        }));

        if (search) {
          parents = parents.filter(
            (parent) =>
              parent.fullname.toLowerCase().indexOf(search.toLowerCase()) >
                -1 ||
              parent.unique_credential
                .toLowerCase()
                .indexOf(search.toLowerCase()) > -1
          );
        }

        this.isLoadingTable = false;
        return parents;
      }
    },
  },
};
</script>

<style scoped>
</style>