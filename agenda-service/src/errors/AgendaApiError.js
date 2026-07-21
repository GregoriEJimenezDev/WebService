'use strict';

/**
 * Error de dominio para fallos al comunicarse con el servicio externo
 * (http://www.raydelto.org/agenda.php). Envuelve el error original para
 * no perder la causa raíz, sin exponer detalles de infraestructura al cliente.
 */
class AgendaApiError extends Error {
  constructor(message, causaOriginal = null) {
    super(message);
    this.name = 'AgendaApiError';
    this.causaOriginal = causaOriginal;
  }
}

module.exports = AgendaApiError;
