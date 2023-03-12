<template>
  <div
    class="modal fade"
    id="modal"
    data-backdrop="static"
    data-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <!-- <Form
            :isAuthRequired="false"
            formTitle="Registrarse"
            :formModel="formModel"
          /> -->
          <slot></slot>
        </div>
        <div class="modal-footer">
          <slot name="btn"></slot>
          <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-primary">Understood</button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Form from "@/components/Form.vue";
const props = defineProps({
  isAuthRequired: {
    type: Boolean,
  },
  formTitle: {
    type: String,
  },
  formModel: {
    type: Object,
  },
});
</script>
