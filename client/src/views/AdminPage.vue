<template>
  <h2>Administrar Publicaciones</h2>
  <Table>
    <template v-slot:thead>
      <table-header-row :tableHeaders="tableHeaders"> </table-header-row>
    </template>
    <table-body-rows
      :tableRows="tableRows"
      :tableHeaders="tableHeaders"
      @clickHandler="clickHandler"
    ></table-body-rows>
  </Table>
  <Modal :context="modalContext">
    <template v-slot:title>
      <span>{{
        modalContext === "edit" ? "Editar publicacion" : "Confirma la accion"
      }}</span>
    </template>
    <Form
      v-if="modalContext == 'edit'"
      :formModel="modalFormModel"
      :context="modalContext"
      formTitle="Registrarse"
    />
    <div v-else>
      <font-awesome-icon size="2xl" icon="fa-solid fa-circle-exclamation" />
      <p class="mt-3">{{ deleteText }}</p>
    </div>

    <template v-slot:btn>
      <button-custom buttonStyle="btn-success" @click="defineAction">{{
        modalContext == "delete" ? "Eliminar" : "Guaradr Cambios"
      }}</button-custom>
      <button-custom buttonStyle="btn-danger" data-dismiss="modal"
        >Cancelar</button-custom
      >
    </template>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

import { useAuthStore } from "@/stores/auth-store.js";
import { useRouter } from "vue-router";

import Modal from "@/components/Modal.vue";
import Table from "@/components/Table.vue";
import TableBodyRows from "@/components/TableBodyRows.vue";
import TableHeaderRow from "@/components/TableHeaderRow.vue";
import ButtonCustom from "@/components/ButtonCustom.vue";
import Form from "@/components/Form.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
library.add(faCircleExclamation);

const router = useRouter();
const authStore = useAuthStore();

const tableRows = ref();
const modalContext = ref(); // modal context
const modalFormModel = ref({});
const itemToDelete = ref();
const deleteText = ref("");

const tableHeaders = ref([
  { value: "seller_id", title: "vendedorID" },
  { value: "publication_name", title: "producto" },
  { value: "photo", title: "foto" },
  { value: "stock_initial", title: "stockInicial" },
  { value: "stock_available", title: "stockDisponible" },
  { value: "price", title: "precio" },
  { value: "acciones", title: "acciones" },
]);

const updateItemFormModel = ref({
  publication_name: {
    tag: "input",
    type: "text",
    placeholder: "Ingrese nombre de producto",
    name: "product-name", //id de input
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
  stock_initial: {
    tag: "input",
    type: "number",
    placeholder: "Ingrese cantidad de producto",
    name: "stock-initial",
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
  price: {
    tag: "input",
    type: "number",
    placeholder: "Ingrese cantidad de producto",
    name: "price",
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
  photo: {
    tag: "input",
    type: "file",
    placeholder: "Agrega foto de producto",
    name: "photo",
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
  description: {
    tag: "textarea",
    type: null,
    placeholder: "Descripción del producto",
    name: "description",
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
  modalContext.value = context;
  itemToDelete.value = item;
  switch (context) {
    case "edit":
      openEditModal(item.publication_id);
      break;
    case "delete":
      openDeleteModal(item.ublication_name);
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
  const id = authStore.getUser().user_id;
  return new Promise(async (resolve, reject) => {
    axios
      .post(
        "https://mercado-api-m4ay.onrender.com/user-publications",
        { id },
        { headers: { authToken: authStore.getUserToken() } }
      )
      .then((res) => {
        setTimeout(async () => {
          tableRows.value = res.data;
          resolve(true);
        }, 2000);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          authStore.logOut();
          router.push("/login");
          resolve(true);
        } else {
          console.log(err);
          reject(err);
        }
      });
  });
};

const openDeleteModal = async (itemName) => {
  deleteText.value = "Desea eliminar el producto " + itemName + "?";
  $("#modal").modal();
};

const openEditModal = async (id) => {
  try {
    const res = await axios.get(
      `https://mercado-api-m4ay.onrender.com/publication/${id}`,
      {
        headers: { authToken: authStore.getUserToken() },
      }
    );
    if (res.status === 200) {
      for (const key in updateItemFormModel.value) {
        if (key !== "photo")
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
  try {
    const res = await axios.delete(
      `https://mercado-api-m4ay.onrender.com/delete-publication/${itemToDelete.value.publication_id}`,
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
  console.log("updatePublication");
  let payload = {};
  for (const key in modalFormModel.value) {
    modalFormModel.value[key].isPayload
      ? (payload[key] = modalFormModel.value[key].value)
      : null;
  }

  payload = {
    ...payload,
    stock_available: payload.stock_initial,
  };
  console.log(payload);

  try {
    const res = await axios.put(
      `https://mercado-api-m4ay.onrender.com/update-publication/${itemToDelete.value.publication_id}`,
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
