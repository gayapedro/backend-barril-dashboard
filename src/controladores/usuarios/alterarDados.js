const yup = require('yup');
const bcrypt = require('bcrypt');
const knex = require('../../conexao');
const { uploadImagem, excluiImagem } = require('../../upload/uploads');
const { pt } = require('yup-locales');
const { setLocale } = require('yup');
setLocale(pt);

const alterarDados = async (req, res) => {
  const { id, idRestaurante } = req.usuario;
  const schema = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    senha: yup.string(),
    restaurante: yup.object().shape({
      nome: yup.string().required().required(),
      descricao: yup.string(),
      idCategoria: yup.number().required(),
      taxaEntrega: yup.number().required(),
      tempoEntregaEmMinutos: yup.number().required(),
      valorMinimoPedido: yup.number().required(),
      imagem: yup.string(),
    }),
  });

  const { restaurante, ...usuario } = req.body;

  try {
    await schema.validate(req.body);
    let { imagem, ...sobra } = restaurante;
    const verificaEmail = await knex('usuario')
      .where('email', usuario.email)
      .andWhere('id', '!=', id);

    if (verificaEmail.length) {
      return res.status(400).json('O email informado já possui cadastro.');
    }
    const imagemNome = `restaurante/${idRestaurante}`;
    if (imagem) {
      await excluiImagem(imagemNome, res);
      const linkImagem = await uploadImagem(imagemNome, imagem, res);
      imagem = linkImagem.replace('.co', '.in');
    }
    if (usuario.senha) {
      const { senha: senhaAntiga, ...resto } = usuario;
      const senha = await bcrypt.hash(senhaAntiga, 10);
      const novosDados = { ...resto, senha };
      const alterarUsuario = await knex('usuario')
        .update(novosDados)
        .where('id', id);
      if (alterarUsuario !== 1) {
        return res
          .status(400)
          .json('Não foi possível atualizar o cadastro do usuario.');
      }
    } else {
      const alterarUsuario = await knex('usuario')
        .update(usuario)
        .where('id', id);
      if (alterarUsuario !== 1) {
        return res
          .status(400)
          .json('Não foi possível atualizar o cadastro do usuario.');
      }
    }

    const novoRestaurante = {
      nome: sobra.nome,
      descricao: sobra.descricao,
      categoria_id: sobra.idCategoria,
      taxa_entrega: sobra.taxaEntrega,
      tempo_entrega_minutos: sobra.tempoEntregaEmMinutos,
      valor_minimo_pedido: sobra.valorMinimoPedido,
      imagem,
    };
    const alterarRestaurante = await knex('restaurante')
      .update(novoRestaurante)
      .where('usuario_id', id);
    if (alterarRestaurante !== 1) {
      return res
        .status(400)
        .json('Não foi possível atualizar o cadastro do usuario.');
    }
    res.json('Usuario atualizado com sucesso!');
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = alterarDados;
