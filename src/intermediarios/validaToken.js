const jwt = require('jsonwebtoken');
const knex = require('../conexao');

const verificaToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(404).json('Token não informado');
  }
  try {
    const token = authorization.replace('Bearer', '').trim();
    const { id } = jwt.verify(token, process.env.JWT_KEY);
    const validaID = await knex('usuario').where('id', id);

    if (!validaID.length) {
      return res.status(404).json('Usuário não encontrado!');
    }

    const obtemRestaurante = await knex('restaurante').where('usuario_id', id);
    const idRestaurante = obtemRestaurante[0].id;
    const { senha, ...dadosUsuario } = validaID[0];

    req.usuario = { ...dadosUsuario, idRestaurante };

    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = verificaToken;
