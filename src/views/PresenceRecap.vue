<template>
  <div>
    <v-row class="ml-2 mb-2">
      <v-col>
        <h2 class="app-heading-thin">Rekap Absen</h2>
      </v-col>
    </v-row>
    <v-row class="ml-2">
      <v-col class="pr-0" cols="12" sm="6">
        <v-date-picker elevation="2" v-model="dates" range></v-date-picker>
      </v-col>
      <v-col class="pl-0" cols="12" sm="6">
        <v-text-field
          v-model="dateRangeText"
          label="Date range"
          prepend-icon="mdi-calendar"
          readonly
        ></v-text-field>
        <v-btn large rounded color="success">
          <v-icon left>mdi-microsoft-excel</v-icon>
          <h4 class="app-text-white app-heading-thin">Download Excel</h4></v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    dates: [new Date(new Date().setDate(1)).toISOString().substr(0, 10)],
  }),
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
  },
};
</script>

<style scoped>
</style>