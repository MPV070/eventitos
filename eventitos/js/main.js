import { Evento, Participante } from "./objects.js";
import { showModal } from "./ajax.js";

function showSection(sectionId) {
  // Ocultar todas las secciones
  document.getElementById("formulario").classList.add("d-none");
  document.getElementById("datos").classList.add("d-none");

  // Mostrar la sección seleccionada
  document.getElementById(sectionId).classList.remove("d-none");

  // Eliminar la clase activa de todas las pestañas
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => link.classList.remove("active"));

  // Agregar la clase activa a la pestaña seleccionada
  const activeLink = document.querySelector(
    `.nav-link[onclick="showSection('${sectionId}')"]`
  );

  if (activeLink) {
    activeLink.classList.add("active");
  }
}

// Attach showSection to the window object
window.showSection = showSection;

// Function to fetch data with error handling
async function fetchData(type) {
  try {
    const response = await fetch(`./php/main.php?type=${type}`);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const errorText = await response.text();
      console.error("Error text: ", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error('Unexpected content type, expecting JSON. Content received: ', text);
      throw new Error(`Unexpected content type: ${contentType}`);
    }
  } catch (error) {
    console.error('Fetch or JSON parsing error:', error);
    throw error;
  }
}

// Function to display data in tables
async function displayData() {
  try {
    const eventos = await fetchData("eventos");
    const participantes = await fetchData("participantes");

    const eventosTableBody = document.getElementById("eventos-table-body");
    eventosTableBody.innerHTML = ""; // Clear existing rows
    eventos.forEach((evento) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${evento.nombre}</td>
        <td>${evento.descripcion}</td>
        <td><img src="${evento.imagen}" alt="${evento.nombre}" width="100"></td>
        <td>${evento.fecha}</td>
        <td>${evento.hora}</td>
        <td>${evento.lugar}</td>
        <td>${evento.organizador}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="removeEvento(${evento.id})">Eliminar</button>
          <button class="btn btn-warning btn-sm" onclick="editEvento(${evento.id})">Editar</button>
        </td>
      `;
      eventosTableBody.appendChild(row);
    });

    const eventosNombresTableBody = document.getElementById("eventos-nombres-table-body");
    eventosNombresTableBody.innerHTML = ""; // Clear existing rows
    eventos.forEach((evento) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td onclick="showParticipanteForm('${evento.id}', this)">${evento.nombre}</td>
        <td>${evento.fecha}</td>
        <td>${evento.hora}</td>
        <td>${evento.lugar}</td>
        <td>${evento.descripcion}</td>
        <td><img src="${evento.imagen}" alt="${evento.nombre}" width="100"></td>
      `;
      eventosNombresTableBody.appendChild(row);
    });

    const participantesTableBody = document.getElementById(
      "participantes-table-body"
    );
    participantesTableBody.innerHTML = ""; // Clear existing rows
    participantes.forEach((participante) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${participante.nombre}</td>
        <td>${participante.correoElectronico}</td>
        <td>${participante.numAcompanantes}</td>
        <td>${participante.fechaInscripcion}</td>
        <td>${participante.eventoNombre}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="removeParticipante(${participante.id})">Eliminar</button>
        </td>
      `;
      participantesTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error displaying data:', error);
  }
}

// Function to add a new Evento
async function addEvento() {
  const nombre = document.getElementById("evento-nombre").value;
  const fecha = document.getElementById("evento-fecha").value;
  const hora = document.getElementById("evento-hora").value;
  const lugar = document.getElementById("evento-lugar").value;
  const descripcion = document.getElementById("evento-descripcion").value;
  const organizador = document.getElementById("evento-organizador").value;
  const imagen = document.getElementById("evento-imagen").value;

  const nuevoEvento = new Evento(
    nombre,
    descripcion,
    imagen,
    fecha,
    hora,
    lugar,
    organizador
  );

  const details = `
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>Fecha:</strong> ${fecha}</p>
    <p><strong>Hora:</strong> ${hora}</p>
    <p><strong>Lugar:</strong> ${lugar}</p>
    <p><strong>Descripción:</strong> ${descripcion}</p>
    <p><strong>Organizador:</strong> ${organizador}</p>
    <p><strong>Imagen:</strong> <img src="${imagen}" alt="${nombre}" width="100"></p>
  `;

  showModal(
    "¿Estás seguro de que deseas añadir este evento?",
    details,
    async () => {
      try {
        const response = await fetch("./php/main.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "evento", ...nuevoEvento }),
        });

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          const errorText = await response.text();
          console.error("Error text: ", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.status === "success") {
          displayData();
          populateEventosDropdown(); // Reset and update the event selector
          resetEventoForm(); // Reset the form
        }
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  );
}

window.addEvento = addEvento;

// Function to remove an Evento
async function removeEvento(eventoId) {
  showModal(
    "¿Estás seguro de que deseas eliminar este evento?",
    "",
    async () => {
      try {
        const response = await fetch("./php/main.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "removeEvento", id: eventoId }),
        });

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          const errorText = await response.text();
          console.error("Error text: ", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.status === "success") {
          displayData();
        }
      } catch (error) {
        console.error('Error removing event:', error);
      }
    }
  );
}

window.removeEvento = removeEvento;

// Function to remove a Participante
async function removeParticipante(participanteId) {
  showModal(
    "¿Estás seguro de que deseas eliminar este participante?",
    "",
    async () => {
      try {
        const response = await fetch("./php/main.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "removeParticipante", id: participanteId }),
        });

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          const errorText = await response.text();
          console.error("Error text: ", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.status === "success") {
          displayData();
        }
      } catch (error) {
        console.error('Error removing participant:', error);
      }
    }
  );
}

window.removeParticipante = removeParticipante;

// Function to open the edit modal with current event data
function openEditModal(evento) {
  document.getElementById("edit-evento-id").value = evento.id;
  document.getElementById("edit-evento-nombre").value = evento.nombre;
  document.getElementById("edit-evento-fecha").value = evento.fecha;
  document.getElementById("edit-evento-hora").value = evento.hora;
  document.getElementById("edit-evento-lugar").value = evento.lugar;
  document.getElementById("edit-evento-descripcion").value = evento.descripcion;
  document.getElementById("edit-evento-imagen").value = evento.imagen;
  document.getElementById("edit-evento-organizador").value = evento.organizador;
  new bootstrap.Modal(document.getElementById('editEventoModal')).show();
}

// Function to handle the form submission for editing an event
async function handleEditEventoForm(event) {
  event.preventDefault();
  const id = document.getElementById("edit-evento-id").value;
  const nombre = document.getElementById("edit-evento-nombre").value;
  const fecha = document.getElementById("edit-evento-fecha").value;
  const hora = document.getElementById("edit-evento-hora").value;
  const lugar = document.getElementById("edit-evento-lugar").value;
  const descripcion = document.getElementById("edit-evento-descripcion").value;
  const imagen = document.getElementById("edit-evento-imagen").value;
  const organizador = document.getElementById("edit-evento-organizador").value;

  const updatedEvento = new Evento(nombre, descripcion, imagen, fecha, hora, lugar, organizador);

  try {
    const response = await fetch("./php/main.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "updateEvento", id, ...updatedEvento }),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const errorText = await response.text();
      console.error("Error text: ", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.status === "success") {
      const modalElement = document.getElementById('editEventoModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      displayData();
      populateEventosDropdown();
    }
  } catch (error) {
    console.error('Error updating event:', error);
  }
}

// Attach the handleEditEventoForm function to the form submission
document.getElementById("edit-evento-form").addEventListener("submit", handleEditEventoForm);

// Function to edit an Evento
async function editEvento(eventoId) {
  try {
    const eventos = await fetchData("eventos");
    const evento = eventos.find(e => parseInt(e.id, 10) === parseInt(eventoId, 10));

    if (evento) {
      openEditModal(evento);
    }
  } catch (error) {
    console.error('Error fetching event for editing:', error);
  }
}

window.editEvento = editEvento;

// Function to populate eventos dropdown
async function populateEventosDropdown() {
  try {
    const eventos = await fetchData("eventos");
    const eventoSelect = document.getElementById("participante-evento");

    // Clear existing options
    eventoSelect.innerHTML = '<option value="">Seleccione un evento</option>';

    eventos.forEach((evento) => {
      const option = document.createElement("option");
      option.value = evento.id;
      option.textContent = `${evento.nombre} - ${evento.fecha}`;
      eventoSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error populating eventos dropdown:', error);
  }
}

// Function to add a new Participante
async function addParticipante() {
  const nombre = document.getElementById("participante-nombre").value;
  const correoElectronico = document.getElementById(
    "participante-correo"
  ).value;
  const numAcompanantes = document.getElementById(
    "participante-acompanantes"
  ).value;
  const fechaInscripcion = document.getElementById("participante-fecha").value;
  const Idevento = parseInt(
    document.getElementById("participante-evento").value,
    10
  ); // Ensure it's an integer
  const evento = document.getElementById("participante-evento")
    .selectedOptions[0].textContent;
  const registrado = "1";

  const nuevoParticipante = new Participante(
    nombre,
    correoElectronico,
    Idevento,
    numAcompanantes,
    "0",
    fechaInscripcion
  );

  const details = `
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>Correo Electrónico:</strong> ${correoElectronico}</p>
    <p><strong>Número de Acompañantes:</strong> ${numAcompanantes}</p>
    <p><strong>Fecha de Inscripción:</strong> ${fechaInscripcion}</p>
    <p><strong>Evento:</strong> ${evento}</p>
  `;

  showModal(
    "¿Estás seguro de que deseas añadir este participante?",
    details,
    async () => {
      try {
        const response = await fetch("./php/main.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "participante", ...nuevoParticipante }),
        });

        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status}`);
          const errorText = await response.text();
          console.error("Error text: ", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        if (result.status === "success") {
          displayData();
          resetParticipanteForm(); // Reset the form
        }
      } catch (error) {
        console.error('Error adding participant:', error);
      }
    }
  );
}

window.addParticipante = addParticipante;

// Function to show the "Añadir Participante" form
function showParticipanteForm(eventoId, element) {
  document.getElementById("participante-form-container").classList.remove("d-none");
  document.getElementById("participante-evento").value = eventoId;

  // Change the clicked event name to bold and blue
  const eventRows = document.querySelectorAll("#eventos-nombres-table-body td");
  eventRows.forEach((row) => {
    row.style.fontWeight = "normal";
    row.style.color = "inherit";
  });
  element.style.fontWeight = "bold";
  element.style.color = "blue";
}

window.showParticipanteForm = showParticipanteForm;

// Function to filter events by name
function filterEventos() {
  const filter = document.getElementById("search-evento-nombre").value.toLowerCase();
  const rows = document.querySelectorAll("#eventos-nombres-table-body tr");
  rows.forEach((row) => {
    const nombre = row.querySelector("td").textContent.toLowerCase();
    if (nombre.includes(filter)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

window.filterEventos = filterEventos;

// Display data and populate dropdown when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  displayData();
  populateEventosDropdown();
  showSection('formulario'); // Show the formulario section by default
});

function validateEventoForm() {
  const nombre = document.getElementById("evento-nombre").value;
  const fecha = document.getElementById("evento-fecha").value;
  const hora = document.getElementById("evento-hora").value;
  const lugar = document.getElementById("evento-lugar").value;
  const descripcion = document.getElementById("evento-descripcion").value;
  const fechaValida = new Date(fecha) > new Date();
  const isValid = nombre && fecha && hora && lugar && descripcion && fechaValida;
  document.querySelector("#evento-form button").disabled = !isValid;

  const fechaHelp = document.getElementById("fechaHelp");
  if (!fechaValida) {
    fechaHelp.style.display = "block";
  } else {
    fechaHelp.style.display = "none";
  }
}

function validateParticipanteForm() {
  const nombre = document.getElementById("participante-nombre").value;
  const correo = document.getElementById("participante-correo").value;
  const fecha = document.getElementById("participante-fecha").value;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = nombre && correo && fecha && emailPattern.test(correo);
  document.querySelector("#participante-form button").disabled = !isValid;
}

function resetEventoForm() {
  document.getElementById("evento-form").reset();
  validateEventoForm();
}
window.resetEventoForm = resetEventoForm;

function resetParticipanteForm() {
  document.getElementById("participante-form").reset();
  validateParticipanteForm();
}
window.resetParticipanteForm = resetParticipanteForm;

// Attach event listeners to form inputs
document
  .querySelectorAll("#evento-form input, #evento-form textarea")
  .forEach((input) => {
    input.addEventListener("input", validateEventoForm);
  });

document.querySelectorAll("#participante-form input").forEach((input) => {
  input.addEventListener("input", validateParticipanteForm);
});

// Initial validation
validateEventoForm();
validateParticipanteForm();
