'use strict';

const ValidationError = require('../errors/ValidationError');

/**
 * Contacto: modelo de dominio simple.
 * Única responsabilidad: representar y validar los datos de un contacto,
 * sin conocer nada sobre HTTP, Express ni la API externa (SRP).
 */
class Contacto {
  constructor(nombre, apellido, telefono) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
  }

  /**
   * Crea un Contacto a partir de un objeto plano (ej. req.body)
   * y valida que los campos requeridos estén presentes.
   * @param {object} datos
   * @returns {Contacto}
   * @throws {ValidationError}
   */
  static crearDesde(datos = {}) {
    const nombre = String(datos.nombre ?? '').trim();
    const apellido = String(datos.apellido ?? '').trim();
    const telefono = String(datos.telefono ?? '').trim();

    const camposFaltantes = [];
    if (!nombre) camposFaltantes.push('nombre');
    if (!apellido) camposFaltantes.push('apellido');
    if (!telefono) camposFaltantes.push('telefono');

    if (camposFaltantes.length > 0) {
      throw new ValidationError(
        `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}`,
        camposFaltantes
      );
    }

    return new Contacto(nombre, apellido, telefono);
  }

  toJSON() {
    return {
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono
    };
  }
}

module.exports = Contacto;
