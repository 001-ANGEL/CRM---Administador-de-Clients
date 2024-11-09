

const form = document.querySelector('#formulario')

function connectDB() {
  const openConection = window.indexedDB.open("crm", 2);

  openConection.onerror = () => {
    console.log("Hubo un error");
  };

  openConection.onsuccess = () => {
    DB = openConection.result;
    console.log("Base de datos conectada correctamente");
  };
}

//* Creacion de la alerta
function showAlert(message, messageType) {
  const alert = document.querySelector(".alerta");

  if (!alert) {
    const divMessage = document.createElement("div");
    divMessage.classList.add(
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center",
      "border",
      "alerta"
    );

    if (messageType === "error") {
      divMessage.classList.add("bg-red-100", "border-red-400", "text-red-700");
    } else {
      divMessage.classList.add(
        "bg-green-100",
        "border-green-100",
        "text-green-700"
      );
    }

    divMessage.textContent = message;

    form.appendChild(divMessage);

    setTimeout(() => {
      divMessage.remove();
    }, 3000);
  }
}


