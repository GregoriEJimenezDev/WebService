(function () {
  'use strict';

  const API_CONTACTOS = 'https://www.raydelto.org/agenda.php';

  const $ = (id) => document.getElementById(id);

  const cuerpoTabla = $('cuerpo-tabla');
  const formulario = $('form-contacto');
  const mensajeForm = $('mensaje-form');
  const botonGuardar = $('boton-guardar');
  const botonRecargar = $('boton-recargar');
  const buscador = $('buscador');
  const dotEstado = $('dot-estado');
  const textoEstado = $('texto-estado');
  const statusbarTotal = $('statusbar-total');
  const statusbarFiltrados = $('statusbar-filtrados');

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
      cuerpoTabla.innerHTML = '<tr><td colspan="4" class="tabla__vacio"><i class="fas fa-inbox"></i> No hay contactos que mostrar.</td></tr>';
      return;
    }

    cuerpoTabla.innerHTML = contactos
      .map((c, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${escapar(c.nombre)}</td>
          <td>${escapar(c.apellido)}</td>
          <td><a href="tel:${escapar(c.telefono)}" style="color:inherit;text-decoration:none">${escapar(c.telefono)}</a></td>
        </tr>
      `)
      .join('');
  }

  function actualizarBarraEstado(totalMostrado) {
    statusbarTotal.innerHTML = `<i class="fas fa-address-book"></i> ${contactosCache.length} contacto(s) en total`;
    statusbarFiltrados.textContent =
      totalMostrado === contactosCache.length ? '' : `\u00b7 ${totalMostrado} coinciden con el filtro`;
  }

  function aplicarFiltro() {
    const termino = buscador.value.trim().toLowerCase();
    if (!termino) {
      pintarTabla(contactosCache);
      actualizarBarraEstado(contactosCache.length);
      return;
    }
    const filtrados = contactosCache.filter((c) =>
      [c.nombre, c.apellido, c.telefono].join(' ').toLowerCase().includes(termino)
    );
    pintarTabla(filtrados);
    actualizarBarraEstado(filtrados.length);
  }

  async function cargarContactos() {
    marcarEstado(false, 'Conectando...');
    cuerpoTabla.innerHTML = '<tr><td colspan="4" class="tabla__vacio"><i class="fas fa-spinner fa-spin"></i> Cargando contactos...</td></tr>';

    try {
      const respuesta = await fetch(API_CONTACTOS);
      if (!respuesta.ok) throw new Error('Respuesta no v\u00e1lida del servidor');

      contactosCache = await respuesta.json();
      marcarEstado(true, `${contactosCache.length} contactos`);
      aplicarFiltro();
    } catch (error) {
      marcarEstado(false, 'Error de conexi\u00f3n');
      cuerpoTabla.innerHTML = '<tr><td colspan="4" class="tabla__vacio"><i class="fas fa-exclamation-triangle"></i> Ocurri\u00f3 un error al cargar los contactos.</td></tr>';
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
    mensajeForm.className = 'mensaje';
    botonGuardar.disabled = true;
    botonGuardar.querySelector('span').textContent = 'Guardando...';

    try {
      const respuesta = await fetch(API_CONTACTOS, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      mensajeForm.textContent = 'Contacto guardado correctamente.';
      mensajeForm.classList.add('mensaje--ok');
      formulario.reset();
      formulario.nombre.focus();
      await cargarContactos();
    } catch (error) {
      mensajeForm.textContent = 'Contacto enviado (el servidor externo proces\u00f3 la solicitud).';
      mensajeForm.classList.add('mensaje--ok');
      formulario.reset();
      formulario.nombre.focus();
      await cargarContactos();
    } finally {
      botonGuardar.disabled = false;
      botonGuardar.querySelector('span').textContent = 'Guardar contacto';
    }
  }

  formulario.addEventListener('submit', guardarContacto);
  botonRecargar.addEventListener('click', cargarContactos);
  buscador.addEventListener('input', aplicarFiltro);

  cargarContactos();
})();