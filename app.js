const inputMensaje = document.getElementById("inputMensaje");
const btnEnviar = document.getElementById("btnEnviar");
const chatArea = document.getElementById("chatArea");
const bienvenida = document.getElementById("bienvenida");
const btnNuevoChat = document.getElementById("btnNuevoChat");
const historialLista = document.getElementById("historialLista");

// URL de tu backend
const API_URL = "http://127.0.0.1:8000";

// Enviar mensaje al presionar Enter
inputMensaje.addEventListener("keypress", (e) => {
  if (e.key === "Enter") enviarMensaje();
});

btnEnviar.addEventListener("click", enviarMensaje);

async function enviarMensaje() {
  const texto = inputMensaje.value.trim();
  if (!texto) return;

  // Oculta el logo de bienvenida
  bienvenida.style.display = "none";

  // Muestra el mensaje del usuario
  agregarMensaje(texto, "usuario");
  inputMensaje.value = "";

  // Muestra indicador de carga
  const cargando = document.createElement("div");
  cargando.classList.add("mensaje-cargando");
  cargando.textContent = "Pensando...";
  chatArea.appendChild(cargando);
  chatArea.scrollTop = chatArea.scrollHeight;

  try {
    const respuesta = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto: texto }),
    });

    const datos = await respuesta.json();
    chatArea.removeChild(cargando);
    agregarMensaje(datos.respuesta, "ia");

    // Agrega al historial sidebar
    agregarAlHistorial(texto);
  } catch (error) {
    chatArea.removeChild(cargando);
    agregarMensaje("Error al conectar con el servidor.", "ia");
  }
}

function agregarMensaje(texto, tipo) {
  const div = document.createElement("div");
  div.classList.add(tipo === "usuario" ? "mensaje-usuario" : "mensaje-ia");
  div.textContent = texto;
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function agregarAlHistorial(texto) {
  const li = document.createElement("li");
  li.textContent = texto.length > 25 ? texto.substring(0, 25) + "..." : texto;
  li.classList.add("activo");
  // Quita activo de los demás
  document
    .querySelectorAll(".historial-lista li")
    .forEach((i) => i.classList.remove("activo"));
  historialLista.prepend(li);
}

btnNuevoChat.addEventListener("click", () => {
  chatArea.innerHTML = "";
  bienvenida.style.display = "flex";
  chatArea.appendChild(bienvenida);
  historialLista
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("activo"));
});
