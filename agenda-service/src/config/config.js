'use strict';

/**
 * Configuración centralizada de la aplicación.
 * Mantener toda constante de entorno en un único lugar (principio DRY)
 * facilita cambiar el proveedor de datos sin tocar el resto de las capas.
 */
const config = {
  port: process.env.PORT || 3000,
  agendaApi: {
    baseUrl: process.env.AGENDA_API_URL || 'http://www.raydelto.org/agenda.php',
    timeoutMs: 8000
  }
};

module.exports = config;
