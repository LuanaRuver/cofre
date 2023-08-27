const jwt = require('jsonwebtoken')
const { buscarTodasTransacoes } = require('../data/transacoesData')


const objMensagens = {
    todosCamposObrigatorios: "Todos os campos obrigatórios devem ser informados.",
    tokenInvalido: "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    emailInvalido: "Email no formato inválido.",
    emailJaExiste: "Já existe usuário cadastrado com o e-mail informado.",
    usuarioSenhaInvalidos: "Usuário e/ou senha inválido(s).",
    saldoIndisponivel: "Saldo indisponível"
}

const prepararToken = (auth) => {
    const token = auth.split(' ')[1]
    return jwt.verify(token, process.env.senha_jwt)
}

const verificarCamposPassados = (listaCamposValidar, res, message) => {
    for(let item of listaCamposValidar){
        if(!item || item == null || item == undefined || item == " "){
            res.status(400).json({mensagem: message})
            return true
        }
    }
}

const verificarTipoEntradaOuSaida = (tipo, res) => {
    if(tipo != 'entrada' && tipo != 'saida'){
        res.status(400).json({message: 'Tipo de transação inválida. Utilize Entrada ou Saída'})
        return true
    }
}

const validacaoGeral = (arrayValidacoes) => {
    for(let item of arrayValidacoes){
        if(item()) {
            return true
        }
    }
}

const verificarSaldo = async (req) => {
    const {rows} = await buscarTodasTransacoes(req.usuario_id_token)
    const entrada = rows[0].total == null ? 0 : rows[0].total;
    const saida =  rows[1].total == null ? 0 : rows[1].total;
    const saldo = entrada - saida;
    return {
    saldo,
    entrada,
    saida
    }
}

module.exports = {
    prepararToken,
    verificarCamposPassados,
    verificarTipoEntradaOuSaida,
    objMensagens,
    validacaoGeral,
    verificarSaldo
}