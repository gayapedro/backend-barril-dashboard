const express = require('express');
const listarPedidos = require('../controladores/pedidos/listarPedidos');
const saiuEntrega = require('../controladores/pedidos/saiuEntrega');
const obterPedido = require('../controladores/pedidos/obterPedido');

const rotasPedidos = express();

rotasPedidos.put('/entrega', saiuEntrega);
rotasPedidos.get('/pedidos', listarPedidos);
rotasPedidos.get('/pedidos/:id', obterPedido);

module.exports = rotasPedidos;
