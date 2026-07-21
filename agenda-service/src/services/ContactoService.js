'use strict';

const Contacto = require('../models/Contacto');

/**
 * ContactoService: contiene las reglas de negocio de "listar" y
 * "almacenar" contactos.
 *
 * No sabe nada de Express (req/res) ni de que el proveedor de datos sea
 * raydelto.org: solo conoce un "repositorio" con los métodos listar()/
 * guardar(), que recibe por constructor (inyección de dependencias).
 * Esto respeta SRP (una sola razón de cambio: reglas de negocio) y DIP
 * (depende de una abstracción, no de la implementación concreta).
 */
class ContactoService {
  /**
   * @param {{listar: Function, guardar: Function}} repositorioContactos
   */
  constructor(repositorioContactos) {
    this.repositorio = repositorioContactos;
  }

  /**
   * Lista todos los contactos disponibles.
   * @returns {Promise<Array<object>>}
   */
  async listarContactos() {
    return this.repositorio.listar();
  }

  /**
   * Valida y almacena un nuevo contacto.
   * @param {object} datosEntrada datos crudos recibidos del cliente
   * @returns {Promise<object>} contacto creado
   */
  async almacenarContacto(datosEntrada) {
    const contacto = Contacto.crearDesde(datosEntrada);
    await this.repositorio.guardar(contacto.toJSON());
    return contacto.toJSON();
  }
}

module.exports = ContactoService;
