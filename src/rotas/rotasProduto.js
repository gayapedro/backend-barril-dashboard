const express = require('express');
const rotasProduto = express();
const produtos = require('../controladores/produtos/produtos');

rotasProduto.get('/produtos', produtos.listarProdutos);
rotasProduto.get('/produtos/:id', produtos.retornarProdutoPorId);
rotasProduto.post('/produtos', produtos.inserirProduto);
rotasProduto.put('/produtos/:id', produtos.alterarProduto);
rotasProduto.delete('/produtos/:id', produtos.removerProduto);
rotasProduto.post('/produtos/:id/ativar', produtos.ativarProduto);
rotasProduto.post('/produtos/:id/desativar', produtos.desativarProduto);

module.exports = rotasProduto;
