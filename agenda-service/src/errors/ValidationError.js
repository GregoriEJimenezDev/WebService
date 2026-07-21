'use strict';

/**
 * Error de dominio para datos de entrada inválidos.
 * Se distingue de errores técnicos (red, parseo) para que el controlador
 * pueda decidir el código HTTP correcto (400 vs 502) sin conocer detalles
 * internos de la capa de servicio.
 */
class ValidationError extends Error {
  constructor(message, campos = []) {
    super(message);
    this.name = 'ValidationError';
    this.campos = campos;
  }
}

module.exports = ValidationError;
