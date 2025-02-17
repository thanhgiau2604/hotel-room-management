<template>
  <div class="transition-all duration-300 ease-in-out w-full">
    <div className="p-8">
      <h1 class="font-bold text-center text-2xl">History</h1>
      <div
        class="bg-white p-4 rounded-lg shadow-md mb-8 w-full mx-auto max-w-[500px] text-center mt-2"
      >
        <input type="date" v-model="filterDate" class="p-2 border rounded-md" />
      </div>

      <div class="card px-3">
        <DataTable
          :value="customers"
          paginator
          stripedRows
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]"
        >
          <Column field="name" header="Name" style="width: 25%"></Column>
          <Column
            field="country.name"
            header="Country"
            style="width: 25%"
          ></Column>
          <Column field="company" header="Company" style="width: 25%"></Column>
          <Column
            field="representative.name"
            header="Representative"
            style="width: 25%"
          ></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const filterDate = ref(new Date().toISOString().split("T")[0]);
const customers = ref([
  {
    id: 1000,
    name: "James Butt",
    country: {
      name: "Algeria",
      code: "dz",
    },
    company: "Benton, John B Jr",
    date: "2015-09-13",
    status: "unqualified",
    verified: true,
    activity: 17,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
    balance: 70663,
  },
  {
    id: 1001,
    name: "James Butt 2",
    country: {
      name: "Algeria",
      code: "dz",
    },
    company: "Benton, John B Jr",
    date: "2015-09-13",
    status: "unqualified",
    verified: true,
    activity: 18,
    representative: {
      name: "Ioni Bowcher",
      image: "ionibowcher.png",
    },
    balance: 7063,
  },
]);
</script>
