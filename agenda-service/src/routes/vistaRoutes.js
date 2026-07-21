'use strict';

const { Router } = require('express');

/**
 * Ruta encargada únicamente de renderizar la vista del panel (SRP):
 * no contiene lógica de negocio, esa vive en ContactoService.
 */
function crearVistaRoutes() {
  const router = Router();

  router.get('/', (req, res) => {
    res.render('index', { titulo: 'Agenda de Contactos' });
  });

  return router;
}

module.exports = crearVistaRoutes;
