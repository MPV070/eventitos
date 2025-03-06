export class Evento {
  constructor(nombre, descripcion, imagen, fecha, hora, lugar, organizador) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.fecha = fecha;
    this.hora = hora;
    this.lugar = lugar;
    this.organizador = organizador;
    this.id = null;
  }
}

export class Participante {
  constructor(
    nombre,
    correoElectronico,
    eventoId,
    numAcompanantes,
    registrado,
    fechaInscripcion
  ) {
    this.nombre = nombre;
    this.correoElectronico = correoElectronico;
    this.eventoId = eventoId;
    this.numAcompanantes = numAcompanantes;
    this.registrado = registrado;
    this.fechaInscripcion = fechaInscripcion;
  }
}
