<template>
  <h2>Historial de reservas</h2>
  <Table>
    <template v-slot:thead>
      <table-header-row :tableHeaders="tableHeaders"> </table-header-row>
    </template>
    <table-body-rows
      :tableRows="tableRows"
      :tableHeaders="tableHeaders"
    ></table-body-rows>
  </Table>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth-store.js";
import axios from "axios";
import Table from "@/components/Table.vue";
import TableBodyRows from "@/components/TableBodyRows.vue";
import TableHeaderRow from "@/components/TableHeaderRow.vue";
/* add fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* add some free styles */
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

library.add(faCircleExclamation);

const tableRows = ref();
const authStore = useAuthStore();
const modalContext = ref(); // modal context
const modalFormModel = ref({});
const itemToDelete = ref();
const deleteText = ref("");

const tableHeaders = ref([
  { value: "nombre", title: "comprador name" },
  { value: "producto", title: "producto" },
  { value: "foto", title: "foto" },
  { value: "cantidad", title: "cantidad" },
  { value: "precio", title: "precio" },
  { value: "valortotal", title: "valottotal" },
  { value: "fechareserva", title: "fecha" },
  { value: "estado", title: "estado" },
]);

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
  console.log(id);
  console.log(authStore.getUserToken());
  return new Promise(async (resolve, reject) => {
    axios
      .post(
        "http://localhost:5000/user-list",
        { id },
        { headers: { authToken: authStore.getUserToken() } }
      )
      .then((res) => {
        setTimeout(async () => {
          console.log(res.data.data);
          tableRows.value = res.data.data;
          resolve(true);
        }, 2000);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          authStore.logOut();
          router.push("/login");
          resolve(true);
        } else {
          reject(err);
        }
      })
      .finally(() => {
        resolve(true);
      });
  });
};

const openDeleteModal = async (itemName) => {
  deleteText.value = "Desea eliminar el producto " + itemName + "?";
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
