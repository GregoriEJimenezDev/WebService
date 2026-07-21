'use strict';

const path = require('path');
const express = require('express');

const config = require('./config/config');
const AgendaApiClient = require('./services/AgendaApiClient');
const ContactoService = require('./services/ContactoService');
const { crearContactosController, manejadorDeErrores } = require('./controllers/contactosController');
const crearContactosRoutes = require('./routes/contactosRoutes');
const crearVistaRoutes = require('./routes/vistaRoutes');

/**
 * Punto único de "composición": aquí se crean las instancias concretas
 * y se inyectan hacia arriba (repositorio -> servicio -> controlador ->
 * rutas). El resto de la aplicación solo conoce abstracciones.
 */
function crearApp() {
  const app = express();

  // Motor de vistas para el panel estilo administrador clásico
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  // Composición de dependencias
  const repositorioContactos = new AgendaApiClient(
    config.agendaApi.baseUrl,
    config.agendaApi.timeoutMs
  );
  const contactoService = new ContactoService(repositorioContactos);
  const contactosController = crearContactosController(contactoService);

  // Rutas
  app.use('/', crearVistaRoutes());
  app.use('/api/contactos', crearContactosRoutes(contactosController));

  // 404 para cualquier otra ruta de API no definida
  app.use('/api', (req, res) => {
    res.status(404).json({ mensaje: 'Recurso no encontrado' });
  });

  // Manejador de errores centralizado (siempre al final)
  app.use(manejadorDeErrores);

  return app;
}

module.exports = crearApp;
