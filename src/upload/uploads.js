const supabase = require('./supabase');

const uploadImagem = async (nome,imagem,res) => {
    const buffer = Buffer.from(imagem, 'base64');

    try {
        
        const {data , error} = await supabase
            .storage
            .from(process.env.SB_BUCKET)
            .upload(nome,buffer);


        const { publicURL, error : publicError } = supabase
            .storage
            .from(process.env.SB_BUCKET)
            .getPublicUrl(nome);

        if(publicError){
                return res.status(400).json(error.message);
        }
        return publicURL;

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluiImagem = async (nome,res) => {
    try {
        const excluirImagem = await supabase
            .storage
            .from(process.env.SB_BUCKET)
            .remove([nome]);
        
            return true;
    } catch (error) {
        return res.status(400).json(error.message);
    }
    
}

module.exports = {
    uploadImagem,
    excluiImagem};