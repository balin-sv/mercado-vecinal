<template>
  <div>
    <table-title>Admin Page</table-title>
    <table class="table container">
      <thead>
        <table-header-row :tableHeaders="tableHeaders"> </table-header-row>
      </thead>
      <tbody>
        <table-body-rows
          :tableRows="tableRows"
          :tableHeaders="tableHeaders"
          @clickHandler="clickHandler"
        ></table-body-rows>
      </tbody>
    </table>
    <Modal>
      <Form
        v-if="modalContext == 'edit'"
        :formModel="modalFormModel"
        :context="modalContext"
        formTitle="Registrarse"
      />
      <p v-else>{{ deleteText }}</p>
      <template v-slot:btn>
        <button-custom buttonStyle="btn-success" @click="defineAction">{{
          modalContext == "delete" ? "Eliminar" : "Guaradr Cambios"
        }}</button-custom>
        <button-custom buttonStyle="btn-danger" data-dismiss="modal"
          >Cancelar</button-custom
        >
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth-store.js";
import axios from "axios";
import Modal from "@/components/Modal.vue";
import TableTitle from "@/components/TableTitle.vue";
import TableBodyRows from "@/components/TableBodyRows.vue";
import TableHeaderRow from "@/components/TableHeaderRow.vue";
import ButtonCustom from "@/components/ButtonCustom.vue";
import Form from "@/components/Form.vue";

const tableRows = ref();
const authStore = useAuthStore();
const modalContext = ref(); // modal context
const modalFormModel = ref({});
const itemToDelete = ref();
const deleteText = ref("");

const tableHeaders = ref([
  { value: "vendedorid", title: "vendedorID" },
  { value: "producto", title: "producto" },
  { value: "foto", title: "foto" },
  { value: "stockinicial", title: "stockInicial" },
  { value: "stockdisponible", title: "stockDisponible" },
  { value: "precio", title: "precio" },
  { value: "acciones", title: "acciones" },
]);

const updateItemFormModel = ref({
  producto: {
    tag: "input",
    type: "text",
    placeholder: "Ingrese nombre de producto",
    name: "producto",
    label: "Nombre",
    value: null,
    rules: {
      pattern: {
        value: /.*\S.*/,
        message: "No puede estar vacío",
      },
    },
    errorMsg: null,
    isPayload: true,
  },
  stockinicial: {
    tag: "input",
    type: "number",
    placeholder: "Ingrese cantidad de producto",
    name: "stockinicial",
    label: "Cantidad",
    value: null,
    rules: {
      pattern: {
        value: /.*\S.*/,
        message: "No puede estar vacío",
      },
    },
    errorMsg: null,
    isPayload: true,
    min: 1,
    max: 100,
  },
  precio: {
    tag: "input",
    type: "number",
    placeholder: "Ingrese cantidad de producto",
    name: "precio",
    label: "Precio",
    value: null,
    rules: {
      pattern: {
        value: /.*\S.*/,
        message: "No puede estar vacío",
      },
    },
    errorMsg: null,
    isPayload: true,
    min: 1,
    max: 1000000,
  },
  foto: {
    tag: "input",
    type: "file",
    placeholder: "Agrega foto de producto",
    name: "foto",
    label: "Foto",
    value: null,
    rules: {
      pattern: {
        value: /([a-zA-Z0-9\s_\\.\-\(\):])+(.jpg|.jpeg|.png)$/i,
        message:
          "Debe tener extensión .jpg, .jpeg o .png y no puede pesar mas que 200KB",
      },
    },
    errorMsg: null,
    isPayload: true,
  },
  descripcion: {
    tag: "textarea",
    type: null,
    placeholder: "Descripción del producto",
    name: "descripcion",
    label: "Describe su producto",
    value: null,
    rules: {
      pattern: {
        value: /.*\S.*/,
        message: "No puede estar vacío",
      },
    },
    errorMsg: null,
    isPayload: true,
  },
});

const clickHandler = (item, context) => {
  console.log(item, context);
  modalContext.value = context;
  itemToDelete.value = item;
  switch (context) {
    case "edit":
      openEditModal(item.publicacionid);
      break;
    case "delete":
      openDeleteModal(item.producto);
      break;
    default:
      break;
  }
};

const defineAction = () => {
  switch (modalContext.value) {
    case "edit":
      updatePublication();
      break;
    case "delete":
      deletePublication();
      break;
    default:
      break;
  }
};

const getPublications = async () => {
  const id = authStore.getUser().userid;
  return new Promise(async (resolve, reject) => {
    axios
      .post(
        "http://localhost:5000/user-publicaciones",
        { id },
        { headers: { authToken: authStore.getUserToken() } }
      )
      .then((res) => {
        setTimeout(async () => {
          tableRows.value = res.data.data;
          resolve(true);
        }, 2000);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const openDeleteModal = async (itemName) => {
  deleteText.value = "Desea eliminar el producto: " + itemName;
  $("#modal").modal();
};

const openEditModal = async (id) => {
  try {
    const res = await axios.get(`http://localhost:5000/publicaciones/${id}`, {
      headers: { authToken: authStore.getUserToken() },
    });
    if (res.status === 200) {
      for (const key in updateItemFormModel.value) {
        if (key !== "foto")
          updateItemFormModel.value[key].value = res.data[0][key];
      } // set form values
      modalFormModel.value = updateItemFormModel.value;
      $("#modal").modal();
    } else {
      await getPublications();
    }
  } catch (e) {
    console.log(e);
  }
};

const deletePublication = async () => {
  console.log(itemToDelete.value.publicacionid);
  try {
    const res = await axios.delete(
      `http://localhost:5000/delete-publicacion/${itemToDelete.value.publicacionid}`,
      { headers: { authToken: authStore.getUserToken() } }
    );
    if (res.status === 200) {
      $("#modal").modal("hide");
      await getPublications();
    } else {
      await getPublications();
    }
  } catch (e) {
    console.log(e);
  }
};

const updatePublication = async () => {
  console.log(itemToDelete.value.publicacionid);
  console.log(modalFormModel.value);
  const payload = {};
  for (const key in modalFormModel.value) {
    modalFormModel.value[key].isPayload
      ? (payload[key] = modalFormModel.value[key].value)
      : null;
  }
  console.log(payload);

  try {
    const res = await axios.put(
      `http://localhost:5000/update-publicacion/${itemToDelete.value.publicacionid}`,
      payload,
      { headers: { authToken: authStore.getUserToken() } }
    );
    $("#modal").modal("hide");
    await getPublications();
  } catch (err) {
    console.log(err);
  }
};

await getPublications();
</script>
