<template>
  <hr class="w-50" />
  <form>
    <div class="form-group row w-50 m-auto">
      <div
        v-for="(field, name, i) in formData"
        class="form-group col-12 col-sm-6"
      >
        <label>{{ field.label }}</label>
        <component
          :is="field.tag"
          :type="field.type"
          :value="field.value"
          @input="field.value = $event.target.value"
          :placeholder="field.placeholder"
          :min="field.min"
          :max="field.max"
          rows="5"
          :class="[
            'form-control m-auto',
            field.errorMsg
              ? 'is-invalid'
              : field.value && !field.errorMsg
              ? 'is-valid'
              : '',
          ]"
        />
        <small class="text-danger">{{ field.errorMsg }}</small>
      </div>
    </div>
    <div class="mb-1 mt-5">
      <button
        @click="
          (e) => {
            e.preventDefault();
            createAccount();
          }
        "
        :class="[
          'btn',
          isFormChecked ? 'btn-primary' : 'btn-secondary disabled',
        ]"
      >
        {{ !isFormChecked ? "Llena los campos" : formTitle }}
      </button>
    </div>
  </form>
</template>
<script setup>
import { useAuthStore } from "@/stores/auth-store.js";
import { useRouter } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";


const props = defineProps({
  isAuthRequired: {
    type: Boolean,
    required: true,
  },
  formTitle: {
    type: String,
    required: true,
  },
  formModel: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["submit"]);

const formData = computed(() => props.formModel);

watch(
  () => formData.value,
  (newVal, prevVal) => {
    for (const key in newVal) {
      if (newVal[key].value == null) {
        continue;
      } else if (
        newVal[key].value &&
        key !== "password_repeat" &&
        newVal[key].type !== "number"
      ) {
        !newVal[key].rules.pattern.value.test(newVal[key].value)
          ? (formData.value[key].errorMsg =
              formData.value[key].rules.pattern.message)
          : (formData.value[key].errorMsg = null);
      } else if (key == "password_repeat") {
        newVal[key].value != newVal.password.value
          ? (formData.value[key].errorMsg = "Las contraseñas no coinciden")
          : (formData.value[key].errorMsg = null);
      } else if (newVal[key].type == "number") {
        console.log(newVal[key].value);
        newVal[key].value < newVal[key].min
          ? (formData.value[key].value = newVal[key].min)
          : null;
        newVal[key].value > newVal[key].max
          ? (formData.value[key].value = newVal[key].max)
          : null;
      } else {
        formData.value[key].errorMsg = null;
      }
    }
  },
  { deep: true }
);

const isFormChecked = computed(() => {
  let res;
  if (formData.value == null) {
    res = false;
  } else {
    let count = 0;
    for (const key in formData.value) {
      if (!formData.value[key].errorMsg && formData.value[key].value) {
        count++;
      }
    }
    count == Object.keys(formData.value).length ? (res = true) : (res = false);
  }
  return res;
});

const createAccount = async () => {
  const payload = {};

  for (const key in formData.value) {
    formData.value[key].isPayload
      ? (payload[key] = formData.value[key].value)
      : null;
    console.log(payload);
  }
  console.log(payload);

  emit("submit", payload);
  // const id = authStore.getUser().userid;
  // try {
  //   const { data } = await axios.post(`http://localhost:5000/new-item`, {
  //     vendedorid: id,
  //     producto: formData.value.producto,
  //     foto: null,
  //     descripcion: formData.value.descripcion,
  //     stockinicial: formData.value.stockInicial,
  //     stockdisponible: formData.value.stockInicial,
  //     precio: formData.value.precio,
  //   });
  //   router.push("/");
  // } catch (e) {
  //   console.log(e);
  // }
};
</script>
