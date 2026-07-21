(function () {
  'use strict';

  const API_CONTACTOS = '/api/contactos';

  const cuerpoTabla = document.getElementById('cuerpo-tabla');
  const formulario = document.getElementById('form-contacto');
  const mensajeForm = document.getElementById('mensaje-form');
  const botonGuardar = document.getElementById('boton-guardar');
  const botonRecargar = document.getElementById('boton-recargar');
  const buscador = document.getElementById('buscador');
  const dotEstado = document.getElementById('dot-estado');
  const textoEstado = document.getElementById('texto-estado');
  const statusbarTotal = document.getElementById('statusbar-total');
  const statusbarFiltrados = document.getElementById('statusbar-filtrados');

  let contactosCache = [];

  function marcarEstado(ok, texto) {
    dotEstado.classList.remove('dot--ok', 'dot--error');
    dotEstado.classList.add(ok ? 'dot--ok' : 'dot--error');
    textoEstado.textContent = texto;
  }

  function escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
  }

  function pintarTabla(contactos) {
    if (!contactos.length) {
      cuerpoTabla.innerHTML = '<tr><td colspan="4" class="tabla__vacio">No hay contactos que mostrar.</td></tr>';
      return;
    }

    cuerpoTabla.innerHTML = contactos
      .map((contacto, indice) => `
        <tr>
          <td>${indice + 1}</td>
          <td>${escapar(contacto.nombre)}</td>
          <td>${escapar(contacto.apellido)}</td>
          <td>${escapar(contacto.telefono)}</td>
        </tr>
      `)
      .join('');
  }

  function actualizarBarraEstado(totalMostrado) {
    statusbarTotal.textContent = `${contactosCache.length} contacto(s) en total`;
    statusbarFiltrados.textContent =
      totalMostrado === contactosCache.length ? '' : `· ${totalMostrado} coinciden con el filtro`;
  }

  function aplicarFiltro() {
    const termino = buscador.value.trim().toLowerCase();

    if (!termino) {
      pintarTabla(contactosCache);
      actualizarBarraEstado(contactosCache.length);
      return;
    }

    const filtrados = contactosCache.filter((contacto) =>
      [contacto.nombre, contacto.apellido, contacto.telefono]
        .join(' ')
        .toLowerCase()
        .includes(termino)
    );

    pintarTabla(filtrados);
    actualizarBarraEstado(filtrados.length);
  }

  async function cargarContactos() {
    marcarEstado(false, 'Conectando con agenda.php…');
    cuerpoTabla.innerHTML = '<tr><td colspan="4" class="tabla__vacio">Cargando contactos…</td></tr>';

    try {
      const respuesta = await fetch(API_CONTACTOS);
      if (!respuesta.ok) throw new Error('Respuesta no válida del servidor');

      contactosCache = await respuesta.json();
      marcarEstado(true, `Conectado · ${contactosCache.length} contactos`);
      aplicarFiltro();
    } catch (error) {
      marcarEstado(false, 'No se pudo cargar la agenda');
      cuerpoTabla.innerHTML = '<tr><td colspan="4" class="tabla__vacio">Ocurrió un error al cargar los contactos.</td></tr>';
    }
  }

  async function guardarContacto(evento) {
    evento.preventDefault();

    const datos = {
      nombre: formulario.nombre.value.trim(),
      apellido: formulario.apellido.value.trim(),
      telefono: formulario.telefono.value.trim()
    };

    mensajeForm.textContent = '';
    mensajeForm.classList.remove('mensaje--ok', 'mensaje--error');
    botonGuardar.disabled = true;
    botonGuardar.textContent = 'Guardando…';

    try {
      const respuesta = await fetch(API_CONTACTOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const cuerpo = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(cuerpo.mensaje || 'No se pudo guardar el contacto');
      }

      mensajeForm.textContent = 'Contacto guardado correctamente.';
      mensajeForm.classList.add('mensaje--ok');
      formulario.reset();
      formulario.nombre.focus();

      await cargarContactos();
    } catch (error) {
      mensajeForm.textContent = error.message;
      mensajeForm.classList.add('mensaje--error');
    } finally {
      botonGuardar.disabled = false;
      botonGuardar.textContent = 'Guardar contacto';
    }
  }

  formulario.addEventListener('submit', guardarContacto);
  botonRecargar.addEventListener('click', cargarContactos);
  buscador.addEventListener('input', aplicarFiltro);

  cargarContactos();
})();
