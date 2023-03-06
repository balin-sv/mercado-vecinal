<template>
  <div>
    <FormLayout>
      <template #page-title> </template>
      <Form :isAuthRequired="true" formTitle="Cambiar datos personales" />
    </FormLayout>
  </div>
</template>
<script setup>
import Form from "@/components/Form.vue";
import FormLayout from "@/layouts/FormLayout.vue";
</script>
