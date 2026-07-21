'use strict';

const AgendaApiError = require('../errors/AgendaApiError');

/**
 * AgendaApiClient: única responsabilidad, hablar HTTP con
 * http://www.raydelto.org/agenda.php (SRP).
 *
 * Expone el mismo "contrato" (listar/guardar) que usará el servicio de
 * negocio, de modo que si mañana el proveedor de datos cambia (otra API,
 * una base de datos, un mock para pruebas), basta con crear otra clase
 * con estos mismos métodos e inyectarla (principio de inversión de
 * dependencias, la "D" de SOLID) sin tocar el resto de la aplicación.
 */
class AgendaApiClient {
  /**
   * @param {string} baseUrl URL del servicio externo
   * @param {number} timeoutMs tiempo máximo de espera por petición
   */
  constructor(baseUrl, timeoutMs = 8000) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Obtiene el listado completo de contactos.
   * @returns {Promise<Array<object>>}
   */
  async listar() {
    const respuesta = await this._peticion('GET');
    const datos = await this._parsearJson(respuesta);
    return Array.isArray(datos) ? datos : [];
  }

  /**
   * Envía un nuevo contacto al servicio externo.
   * @param {{nombre:string, apellido:string, telefono:string}} contacto
   * @returns {Promise<object>} respuesta cruda del proveedor
   */
  async guardar(contacto) {
    const respuesta = await this._peticion('POST', contacto);
    return this._parsearJson(respuesta);
  }

  async _peticion(metodo, cuerpo) {
    const controlador = new AbortController();
    const timer = setTimeout(() => controlador.abort(), this.timeoutMs);

    try {
      const opciones = {
        method: metodo,
        signal: controlador.signal,
        headers: { 'Content-Type': 'application/json' }
      };
      if (cuerpo !== undefined) {
        opciones.body = JSON.stringify(cuerpo);
      }

      const respuesta = await fetch(this.baseUrl, opciones);

      if (!respuesta.ok) {
        throw new AgendaApiError(
          `El servicio de agenda respondió con estado ${respuesta.status}`
        );
      }

      return respuesta;
    } catch (error) {
      if (error instanceof AgendaApiError) throw error;
      throw new AgendaApiError('No se pudo contactar el servicio de agenda', error);
    } finally {
      clearTimeout(timer);
    }
  }

  async _parsearJson(respuesta) {
    const texto = await respuesta.text();
    if (!texto) return null;
    try {
      return JSON.parse(texto);
    } catch (error) {
      throw new AgendaApiError('El servicio de agenda devolvió una respuesta no válida', error);
    }
  }
}

module.exports = AgendaApiClient;
