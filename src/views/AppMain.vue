<template>
  <div>
    <v-app-bar color="#081120" dark class="px-6" height="82">
      <v-toolbar-title class="mr-8">
        <h3
          class="app-text-white app-heading-thin"
          @click="$router.push('/login')"
        >
          INTENS <span class="app-text-thin">Console</span>
        </h3>
      </v-toolbar-title>
      <v-btn plain color="white"
        ><h4 class="app-text-white app-heading-thin">Dashboard</h4></v-btn
      >
      <v-btn plain color="white"
        ><h4
          class="app-text-white app-heading-thin"
          @click="activePage = `presence`"
        >
          Presensi
        </h4></v-btn
      >
      <v-btn plain color="white"
        ><h4
          class="app-text-white app-heading-thin"
          @click="activePage = `studentData`"
        >
          Data Siswa
        </h4></v-btn
      >
      <v-btn plain color="white"
        ><h4 class="app-text-white app-heading-thin">Konfigurasi</h4></v-btn
      >
      <v-spacer></v-spacer>
      <v-chip color="accent" pill class="pr-6 pl-4 py-6 app-chip-full-rounded">
        <v-avatar color="primary" size="56" class="mr-4">
          <img
            lazy-src="https://picsum.photos/id/11/10/6"
            alt="John"
            src="https://picsum.photos/id/11/500/300"
          />
        </v-avatar>
        <h4 class="app-text-white app-heading-thin">Agis Putra</h4>
      </v-chip>
    </v-app-bar>
    <div class="mt-12">
      <v-row>
        <v-col cols="3" offset="1" v-if="activePage !== `dashboard`"
          ><v-card class="mx-auto" width="300">
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Home</v-list-item-title>
              </v-list-item>

              <v-list-group :value="true" prepend-icon="mdi-account-circle">
                <template v-slot:activator>
                  <v-list-item-title>Users</v-list-item-title>
                </template>

                <v-list-group :value="true" no-action sub-group>
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title>Admin</v-list-item-title>
                    </v-list-item-content>
                  </template>

                  <v-list-item
                    v-for="([title, icon], i) in admins"
                    :key="i"
                    link
                  >
                    <v-list-item-title v-text="title"></v-list-item-title>

                    <v-list-item-icon>
                      <v-icon v-text="icon"></v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list-group>

                <v-list-group no-action sub-group>
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title>Actions</v-list-item-title>
                    </v-list-item-content>
                  </template>

                  <v-list-item
                    v-for="([title, icon], i) in cruds"
                    :key="i"
                    link
                  >
                    <v-list-item-title v-text="title"></v-list-item-title>

                    <v-list-item-icon>
                      <v-icon v-text="icon"></v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list-group>
              </v-list-group>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="8">
          <v-row>
            <v-col cols="10">
              <v-sheet rounded class="px-4 py-4" elevation="1">
                <Presence
                  transition="fade-transition"
                  v-if="activePage === `presence`"
                />
                <StudentData
                  transition="scale-transition"
                  v-if="activePage === `studentData`"
                />
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Presence from "@/views/Presence";
import StudentData from "@/views/StudentData";
export default {
  data: () => ({
    activePage: "dashboard",
    admins: [
      ["Management", "mdi-account-multiple-outline"],
      ["Settings", "mdi-cog-outline"],
    ],
    cruds: [
      ["Create", "mdi-plus-outline"],
      ["Read", "mdi-file-outline"],
      ["Update", "mdi-update"],
      ["Delete", "mdi-delete"],
    ],
  }),
  components: {
    Presence,
    StudentData,
  },
};
</script>

<style scoped>
.app-chip-full-rounded {
  border-radius: 100px !important;
}
</style>
