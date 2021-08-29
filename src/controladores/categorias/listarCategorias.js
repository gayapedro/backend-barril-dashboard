const knex = require("../../conexao");

async function listarCategorias(req, res){
    try {
      const categorias = await knex('categoria').select('id', 'nome');

      if(categorias.lenght === 0 ){
          return res.status(404).json('Nenhuma categoria foi encontrada.');
      }

      return res.json(categorias);

    } catch (error) {
      res.status(400).json(error.message);
    }
}

module.exports= {listarCategorias};