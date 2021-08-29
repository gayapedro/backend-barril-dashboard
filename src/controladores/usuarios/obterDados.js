const knex = require('../../conexao');

const obterDados = async (req,res) => {
    const {id} = req.usuario;
    try {
        const dadosRestaurante = await knex('restaurante')
        .join('categoria','categoria.id','restaurante.categoria_id')
        .select('restaurante.nome as restaurante_nome',
        'restaurante.descricao',
        'restaurante.taxa_entrega',
        'restaurante.tempo_entrega_minutos',
        'restaurante.valor_minimo_pedido',
        'restaurante.imagem as restaurante_imagem',
        'categoria.nome as categoria_nome',
        'categoria.id as categoria_id',
        'categoria.imagem as categoria_imagem',
        )
        .where('usuario_id',id);

        if(dadosRestaurante.length !== 1){
            res.status(400).json('Erro ao obter dados');
        }

        dadosUsuario = {...req.usuario,...dadosRestaurante[0]};

        res.json(dadosUsuario);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = obterDados;