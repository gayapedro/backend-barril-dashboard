const knex = require('../../conexao');

const obterPedido = async (req, res) => {
  const { id } = req.params;
  const { id: id_restaurante } = req.usuario;

  try {
    const pedido = await knex('pedidos')
      .where('id', id)
      .andWhere('id_restaurante', id_restaurante)
      .first();

    if (!pedido) return res.status(404).json('Nenhum pedido encontrado.');

    const produtos = await knex('produtos_pedidos').where('id_pedido', id);

    for (const produto of produtos) {
      const buscaProduto = await knex
        .select('nome', 'imagem')
        .from('produto')
        .where('id', produto.id_produto)
        .first();
      produto.nome = buscaProduto.nome;
      produto.imagem = buscaProduto.imagem;
    }
    pedido.produtos = produtos;

    const cliente = await knex
      .select(
        'id',
        'nome',
        'email',
        'telefone',
        'endereco',
        'cep',
        'complemento'
      )
      .from('cliente')
      .where('id', pedido.id_cliente)
      .first();

    pedido.cliente = cliente;

    return res.status(200).json(pedido);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = obterPedido;
