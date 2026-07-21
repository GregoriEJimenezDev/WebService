'use strict';

const ValidationError = require('../errors/ValidationError');
const AgendaApiError = require('../errors/AgendaApiError');

/**
 * Fábrica del controlador de contactos.
 * Recibe el servicio de negocio por inyección (no lo instancia aquí),
 * de forma que el controlador solo se encarga de traducir HTTP <-> servicio
 * (SRP) y es fácil de probar sustituyendo el servicio por uno falso.
 *
 * @param {import('../services/ContactoService')} contactoService
 */
function crearContactosController(contactoService) {
  return {
    /**
     * GET /api/contactos
     * Lista todos los contactos registrados en la agenda.
     */
    async listar(req, res, next) {
      try {
        const contactos = await contactoService.listarContactos();
        res.status(200).json(contactos);
      } catch (error) {
        next(error);
      }
    },

    /**
     * POST /api/contactos
     * Body JSON: { nombre, apellido, telefono }
     * Almacena un nuevo contacto en la agenda.
     */
    async almacenar(req, res, next) {
      try {
        const contactoCreado = await contactoService.almacenarContacto(req.body);
        res.status(201).json({
          mensaje: 'Contacto almacenado correctamente',
          contacto: contactoCreado
        });
      } catch (error) {
        next(error);
      }
    }
  };
}

/**
 * Middleware de manejo de errores centralizado para las rutas de contactos.
 * Traduce errores de dominio a códigos HTTP apropiados sin filtrar detalles
 * internos al cliente.
 */
function manejadorDeErrores(error, req, res, next) { // eslint-disable-line no-unused-vars
  if (error instanceof ValidationError) {
    return res.status(400).json({ mensaje: error.message, campos: error.campos });
  }
  if (error instanceof AgendaApiError) {
    return res.status(502).json({ mensaje: error.message });
  }
  console.error('Error no controlado:', error);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
}

module.exports = { crearContactosController, manejadorDeErrores };
