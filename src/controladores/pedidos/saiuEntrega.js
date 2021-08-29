const knex = require('../../conexao');

const saiuEntrega = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json('É necessário informar o id.');
  }

  try {
    const saiuEntrega = await knex('pedidos')
      .update({ saiu_entrega: true })
      .where('id', id);

    if (saiuEntrega !== 1) {
      return res.status(400).json('Não foi possível atualizar o pedido');
    }
    return res.status(200).json('Status atualizado!');
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = saiuEntrega;
