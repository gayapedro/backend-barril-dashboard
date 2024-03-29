require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rotasUsuario = require('./rotas/rotasUsuario');
const rotasProduto = require('./rotas/rotasProduto');
const rotasCategoria = require('./rotas/rotasCategoria');
const rotasPedidos = require('./rotas/rotasPedidos');
const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(rotasCategoria);
app.use(rotasUsuario);
app.use(rotasProduto);
app.use(rotasPedidos);
app.listen(process.env.PORT || 3000);
