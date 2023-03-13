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
    <div
      :class="[
        'modal-dialog  modal-dialog-centered',
        context === 'edit' ? 'modal-xl' : '',
      ]"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">
            <slot name="title"></slot>
          </h5>
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
          <slot></slot>
        </div>
        <div class="modal-footer">
          <slot name="btn"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  context: {
    type: String,
  },
});
</script>
