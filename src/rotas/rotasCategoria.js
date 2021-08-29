const express = require('express');
const categorias = require('../controladores/categorias/listarCategorias');

const rotasCategoria = express();

rotasCategoria.get('/restaurante/categorias', categorias.listarCategorias);

module.exports = rotasCategoria;
