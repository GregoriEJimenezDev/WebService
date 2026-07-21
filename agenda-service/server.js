'use strict';

const crearApp = require('./src/app');
const config = require('./src/config/config');

const app = crearApp();

app.listen(config.port, () => {
  console.log(`Servicio de agenda escuchando en http://localhost:${config.port}`);
});
