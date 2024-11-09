(function () {
  let DB;
  let clientID;

  const nombreInput = document.querySelector("#nombre");
  const emailInput = document.querySelector("#email");
  const telefonoInput = document.querySelector("#telefono");
  const empresaInput = document.querySelector("#empresa");

  const form = document.querySelector("#formulario");

  document.addEventListener("DOMContentLoaded", () => {
    connectDB();

    //Actuliza el registro
    form.addEventListener("submit", updateClient);

    //Verificar el id de la url
    //QueryString
    const parametersUrl = new URLSearchParams(window.location.search);
    clientID = parametersUrl.get("id");

    if (clientID) {
      setTimeout(() => {
        getClient(clientID);
      }, 100);
    }
  });

  function updateClient(event) {
    event.preventDefault();

    if (
      nombreInput.value === "" ||
      emailInput.value === "" ||
      telefonoInput.value === "" ||
      empresaInput.value === ""
    ) {
      showAlert("Todos los campos son obligatorios", "error");

      return;
    }

    //Actulizar el cliente
    const updatedClient = {
      nombre: nombreInput.value,
      email: emailInput.value,
      telefono: telefonoInput.value,
      empresa: empresaInput.value,
      id: Number(clientID),
    };

    const transaction = DB.transaction(["crm"], "readwrite");
    const objectStore = transaction.objectStore("crm");

    objectStore.put(updatedClient);

    transaction.oncomplete = () => {
      showAlert("Editado correctamente");

      setTimeout(() => {
        window.location.href = 'index.html'
      }, 3000);
    };

    transaction.onerror = () => {
      showAlert("Hubo un error", "error");

    };
  }

  function getClient(id) {
    const transaction = DB.transaction(["crm"], "readonly");
    const objectStore = transaction.objectStore("crm");

    const client = objectStore.openCursor();
    client.onsuccess = (event) => {
      const cursor = event.target.result;

      if (cursor) {
        if (cursor.value.id === Number(id)) {
          completeForm(cursor.value);
        }
        cursor.continue();
      }
    };
  }
  function completeForm(clienteData) {
    const { nombre, email, telefono, empresa } = clienteData;

    nombreInput.value = nombre;
    emailInput.value = email;
    telefonoInput.value = telefono;
    empresaInput.value = empresa;
  }

  function connectDB() {
    const openConection = window.indexedDB.open("crm", 2);

    openConection.onerror = () => {
      console.log("Hubo un error");
    };

    openConection.onsuccess = () => {
      DB = openConection.result;
    };
  }
})();
