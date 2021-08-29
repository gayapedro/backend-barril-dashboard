const knex = require('../../conexao');

async function listarPedidos(req, res) {
  const { id } = req.usuario;
  console.log(id);

  try {
    const pedidos = await knex('pedidos')
      .where('id_restaurante', id)
      .orderBy('id', 'asc');

    if (pedidos.length === 0) {
      return res.status(404).json('Nenhum pedido encontrado!');
    }

    for (const pedido of pedidos) {
      const produtosBusca = await knex('produtos_pedidos').where(
        'id_pedido',
        pedido.id
      );
      for (const produto of produtosBusca) {
        const produtoNome = await knex
          .select('nome')
          .from('produto')
          .where('id', produto.id_produto)
          .first();
        produto.nome = produtoNome.nome;
      }
      pedido.produtos = produtosBusca;

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
    }

    return res.status(200).json(pedidos);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = listarPedidos;
