const knex = require('../../conexao');
const { uploadImagem, excluiImagem } = require('../../upload/uploads');

async function listarProdutos(req, res) {
  const { id: usuario_id } = req.usuario;
  try {
    const { id: restaurante_id } = await knex('restaurante')
      .where({ usuario_id })
      .first();

    const produtos = await knex('produto').where({ restaurante_id });

    res.status(200).json(produtos);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

async function retornarProdutoPorId(req, res) {
  const { id } = req.params;
  const { id: usuario_id } = req.usuario;

  try {
    const { id: restaurante_id } = await knex('restaurante')
      .where({ usuario_id })
      .first();

    const produtos = await knex('produto').where({ id, restaurante_id });

    if (produtos.length === 0) {
      return res.status(404).json('Não existe produto com id informado.');
    }

    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function inserirProduto(req, res) {
  const {
    nome,
    descricao,
    preco,
    permiteObservacoes: permite_observacoes,
    ativo,
    imagem,
  } = req.body;

  const usuario_id = req.usuario.id;

  if (!nome || !preco) {
    return res.status(404).json('Nome e preço são obrigatórios');
  }

  try {
    const { id: restaurante_id } = await knex('restaurante')
      .where({ usuario_id })
      .first();

    const produtoExiste = await knex('produto').where({ restaurante_id}).andWhere('nome','ilike',nome);

    if (produtoExiste.length > 0) {
      return res.status(400).json('O produto já está cadastrado.');
    }

    const imagemNome = `produtos/${`${nome.replace(' ', '')}${Date.now()}`}`;
    let imagemNova;

    if (imagem) {
      await excluiImagem(imagemNome, res);
      const linkImagem = await uploadImagem(imagemNome, imagem, res);
      imagemNova = linkImagem.replace('co', 'in');
    }

    const produto = await knex('produto').insert({
      restaurante_id,
      nome,
      descricao,
      preco,
      permite_observacoes,
      ativo,
      imagem: imagemNova,
    });

    if (produto.rowCount === 0) {
      return res.status(400).json('Não foi possivel cadastrar o produto');
    }

    return res.status(200).json('Produto inserido com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function alterarProduto(req, res) {
  const {
    nome,
    descricao,
    preco,
    permiteObservacoes: permite_observacoes,
    imagem,
  } = req.body;
  const restaurante_id = req.usuario.id;
  const { id } = req.params;

  if (!nome && !descricao && !preco && !permite_observacoes) {
    return res.status(400).json('Deve-se preencher pelo menos um dos campos.');
  }

  try {
    const produto = await knex('produto').where({ id, restaurante_id });

    if (produto.length === 0) {
      return res.status(404).json('O produto não foi encontrado!');
    }

    const imagemNome = `produtos/${`${nome.replace(' ', '')}${Date.now()}`}`;
    let imagemNova;

    if (imagem) {
      await excluiImagem(imagemNome, res);
      const linkImagem = await uploadImagem(imagemNome, imagem, res);
      imagemNova = linkImagem.replace('co', 'in');
    }

    const queryParaAtualizar = await knex('produto')
      .where({ id })
      .update({
        nome,
        descricao,
        preco,
        permite_observacoes,
        imagem: imagemNova,
      });

    if (queryParaAtualizar.length === 0) {
      return res.status(400).json('Erro na atualização.');
    }

    res.status(200).json('Alteração feita com sucesso!');
  } catch (error) {
    res.status(400).json(error.message);
  }
}

async function removerProduto(req, res) {
  const { id } = req.params;
  const restaurante_id = req.usuario.id;

  try {
    const produto = await knex('produto').where({ id, restaurante_id });

    if (produto.length === 0) {
      return res.status(404).json('O produto não foi encontrado.');
    }

    const queryParaRemover = await knex('produto').where({ id }).del();

    if (queryParaRemover.length === 0) {
      return res.status(400).json('Não foi possivel remover o produto');
    }

    res.status(200).json('Removido com sucesso!');
  } catch (error) {
    res.status(400).json(error.message);
  }
}

async function ativarProduto(req, res) {
  const { id } = req.params;
  const restaurante_id = req.usuario.id;

  try {
    const produto = await knex('produto').where({ id, restaurante_id });

    if (produto.length === 0) {
      return res.status(404).json('O produto não foi encontrado.');
    }

    const queryParaAtivar = await knex('produto')
      .where({ id })
      .update({ ativo: true });

    if (queryParaAtivar.length === 0) {
      return res.status(400).json('Erro ao ativar o produto.');
    }

    res.status(200).json('Produto ativado com sucesso!');
  } catch (error) {
    res.status(400).json(error.message);
  }
}

async function desativarProduto(req, res) {
  const { id } = req.params;
  const restaurante_id = req.usuario.id;

  try {
    const produto = await knex('produto').where({ id, restaurante_id });

    if (produto.length === 0) {
      return res.status(404).json('O produto não foi encontrado.');
    }

    const queryParaAtivar = await knex('produto')
      .where({ id })
      .update({ ativo: false });

    if (queryParaAtivar.length === 0) {
      return res.status(400).json('Erro ao ativar o produto.');
    }

    res.status(200).json('Produto desativado com sucesso!');
  } catch (error) {
    res.status(400).json(error.message);
  }
}

module.exports = {
  listarProdutos,
  retornarProdutoPorId,
  inserirProduto,
  alterarProduto,
  removerProduto,
  ativarProduto,
  desativarProduto,
};
