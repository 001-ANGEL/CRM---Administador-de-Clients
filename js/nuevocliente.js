(function () {
  let DB;
  const form = document.querySelector("#formulario");

  document.addEventListener("DOMContentLoaded", () => {
    connectDB();

    form.addEventListener("submit", validateClient);
  });

  function connectDB() {
    const openConection = window.indexedDB.open("crm", 2);

    openConection.onerror = () => {
      console.log("Hubo un error");

      form.addEventListener("submit", validateClient);
    };

    openConection.onsuccess = () => {
      DB = openConection.result;
      console.log("Base de datos conectada correctamente");
    };
  }

  function validateClient(event) {
    event.preventDefault();

    //* Leer todos los inputs
    const nameInput = document.querySelector("#nombre").value;
    const emailInput = document.querySelector("#email").value;
    const phoneInput = document.querySelector("#telefono").value;
    const companyInput = document.querySelector("#empresa").value;

    //Validaciones
    if (
      nameInput === "" ||
      emailInput === "" ||
      phoneInput === "" ||
      companyInput === ""
    ) {
      showAlert("Todos los campos son obligatorios", "error");

      return;
    }
    //* Crear un objeto con la informacion

    const client = {
      nombre: nameInput,
      email: emailInput,
      telefono: phoneInput,
      empresa: companyInput,
    };

    client.id = Date.now();

    checkIfEmailExists(client.email, client);
  }

  //* Verificar si el email ya existe
  function checkIfEmailExists(emailInput, client) {
    if (!DB) {
      console.log("Base de datos no disponible");
      return;
    }

    const transaction = DB.transaction("crm", "readonly");
    const objectStore = transaction.objectStore("crm");
    const request = objectStore.index("email").get(emailInput);

    request.onsuccess = (event) => {
      const existingClient = event.target.result;
      console.log("Resultado de la búsqueda de email:", existingClient);

      if (existingClient) {
        showAlert("El email ya está registrado", "error");
      } else {
        createNewClient(client);
      }
    };
  }

  //* Crear un nuevo cliente
  function createNewClient(client) {
    const transaction = DB.transaction("crm", "readwrite");

    const objectStore = transaction.objectStore("crm");

    transaction.onerror = () => {
      showAlert("Ha ocurrido un error", "error");
    };

    transaction.oncomplete = () => {
      showAlert("Cliente agregado correctamente");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    };

    objectStore.add(client);
  }
})();
