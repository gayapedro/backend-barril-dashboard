const express = require('express');
const validaToken = require('../intermediarios/validaToken');
const cadastro = require('../controladores/usuarios/cadastro');
const obterDados = require('../controladores/usuarios/obterDados');
const alterarDados = require('../controladores/usuarios/alterarDados');
const login = require('../controladores/usuarios/login');
const rotasUsuario = express();

rotasUsuario.post('/usuarios',cadastro);
rotasUsuario.post('/login',login);
rotasUsuario.use(validaToken);
rotasUsuario.get('/usuarios', obterDados);
rotasUsuario.put('/usuarios', alterarDados);

module.exports = rotasUsuario;