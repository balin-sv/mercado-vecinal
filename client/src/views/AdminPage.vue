<template>
  <div>
    <TableLayout>
      <Table :isAdmin="true" tableTitle="Mis Publicaciones" />
    </TableLayout>
  </div>
</template>
<script setup>
import { ref } from "vue";
import Table from "@/components/Table.vue";
import TableLayout from "@/layouts/TableLayout.vue";
// import { useAuthStore } from "@/stores/auth-store";

// const authStore = useAuthStore();
// const isAdmin = ref(await authStore.getUserRol());
</script>
