<template>
  <div>
    <v-row>
      <v-col class="ml-3" cols="12">
        <h2 class="app-heading-thin">Data Akun</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="mt-3 ml-2 mb-4 pr-0">
        <v-btn @click="showStoreAccount" large color="#15D46D"
          ><v-icon left color="white">mdi-plus</v-icon>
          <h4 class="app-text-white app-heading-thin">Tambah Akun</h4></v-btn
        >
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
          solo
          placeholder="Cari data akun"
          prepend-inner-icon="mdi-magnify"
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
      <v-col cols="4" class="ml-4 pr-0 mt-3">
        <v-select
          v-model="filterByRole"
          :items="[
            { text: 'Admin', value: 'admin' },
            { text: 'Super Admin', value: 'superadmin' },
            { text: 'Parent', value: 'parent' },
          ]"
          solo
          label="Hak Akses"
          clearable
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :loading="isLoading"
          :items-per-page="5"
          :items="accounts"
          :headers="headers"
          loading-text="Mohon tunggu ..."
        >
          <template v-slot:[`item.action`]="{ item }">
            <v-btn color="primary" dense @click="selectAccount(item)"
              >Edit</v-btn
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <StoreAccount
      @closed="showDialogAccount = false"
      :isShowedDialog="showDialogAccount"
    />

    <UpdateAccount
      @closed="showUpdateAccountDialog = false"
      :isShowedDialog="showUpdateAccountDialog"
    />
  </div>
</template>

<script>
import StoreAccount from "@/components/dialogs/StoreAccount";
import UpdateAccount from "@/components/dialogs/UpdateAccount";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      showDialogAccount: false,
      showUpdateAccountDialog: false,
      filterByRole: "",
      isLoading: false,
      search: "",
      headers: [
        {
          text: "No",
          align: "start",
          sortable: false,
          value: "number",
        },
        { text: "Nama Lengkap", value: "fullname" },
        { text: "Username", value: "username" },
        { text: "Email", value: "email" },
        { text: "Nomor Telepon", value: "phone_number" },
        { text: "Hak Akses", value: "account_type" },
        { text: "Aksi", value: "action" },
      ],
    };
  },

  methods: {
    showStoreAccount() {
      this.showDialogAccount = true;
    },
    selectAccount(item) {
      this.showUpdateAccountDialog = true;
      this.$store.commit("setSelectedAccount", item);
    },
  },
  components: {
    StoreAccount,
    UpdateAccount,
  },

  computed: {
    ...mapGetters(["getAccountData", "getSelectedAccount"]),
    accounts() {
      let accounts = this.getAccountData;
      let search = this.search;
      let filter = this.filterByRole;

      // parsing data accounts
      accounts = accounts.map((account, index) => ({
        number: index + 1,
        ...account,
      }));
      if (search)
        accounts = accounts.filter(
          (account) =>
            account.username.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            account.fullname.toLowerCase().indexOf(search.toLowerCase()) > -1
        );

      if (filter)
        accounts = accounts.filter((account) => account.account_type == filter);

      return accounts;
    },
  },
  async mounted() {
    this.isLoading = true;
    const emptyAccount = !this.$store.getters.getAccountData.length;
    if (emptyAccount) await this.$store.dispatch("getAccount");
    this.isLoading = false;
  },
};
</script>
