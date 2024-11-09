(function () {
  let DB;
  const clientsList = document.querySelector("#listado-clientes");


  document.addEventListener("DOMContentLoaded", () => {
    createDB();

    if (window.indexedDB.open("crm", 2)) {
      getClients();
    }

    clientsList.addEventListener('click', deleteRecord);
  });

  function deleteRecord(event) {
    if(event.target.classList.contains('eliminar')) {
      const deleteID = Number(event.target.dataset.cliente);

      const confirmar = confirm('Deseas eliminar este cliente?');

      if(confirmar) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.delete(deleteID);

        transaction.oncomplete = () => {
          console.log('Eliminado');

          event.target.parentElement.parentElement.remove();
        };

        transaction.onerror = () => {
          console.log('Ha ocurrido un error');
        };

      }
    }
  }

  //Creacion de la base de datos de indexDB
  function createDB() {
    const createDB = window.indexedDB.open("crm", 2);

    createDB.onerror = () => {
      console.log("Hubo un error");
    };

    createDB.onsuccess = () => {
      console.log("Base de datos creado exitosamente...");

      DB = createDB.result;
    };

    createDB.onupgradeneeded = function (event) {
      const db = event.target.result;

      const objectStore = db.createObjectStore("crm", {
        keyPath: "id",
        autoIncrement: true,
      });

      objectStore.createIndex("nombre", "nombre", { unique: false });
      objectStore.createIndex("email", "email", { unique: true });
      objectStore.createIndex("telefono", "telefono", { unique: false });
      objectStore.createIndex("empresa", "empresa", { unique: false });
      objectStore.createIndex("id", "id", { unique: true });

      console.log("DB Lista y Creada");
    };
  }

  function getClients() {
    const openConection = window.indexedDB.open("crm", 2);

    openConection.onerror = () => {
      console.log("Ha ocurrido un error");
    };

    openConection.onsuccess = () => {
      DB = openConection.result;

      const objectStore = DB.transaction("crm").objectStore("crm");

      objectStore.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;

        if (cursor) {
          const { nombre, empresa, email, telefono, id } = cursor.value;
          clientsList.innerHTML += ` <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
              <p class="text-sm leading-10 text-gray-700"> ${email} </p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
              <p class="text-gray-700">${telefono}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
              <p class="text-gray-600">${empresa}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
              <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
          </td>
      </tr>
  `;

          cursor.continue();
        } else {
          console.log("No hya mas registros");
        }
      };
    };
  }
})();
