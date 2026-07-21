'use strict';

const { Router } = require('express');

/**
 * Define las rutas REST de contactos. Recibe el controlador ya construido
 * (inyección de dependencias) en lugar de crearlo aquí dentro.
 * @param {ReturnType<typeof import('../controllers/contactosController').crearContactosController>} controller
 */
function crearContactosRoutes(controller) {
  const router = Router();

  router.get('/', controller.listar);
  router.post('/', controller.almacenar);

  return router;
}

module.exports = crearContactosRoutes;
