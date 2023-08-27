const {cadastrarUsuarioQuery, buscarUsuarioPorEmail} = require('../data/usuariosData')
const { cadastrarTransacaoQuery, buscarTodasTransacoesQuery } = require('../data/transacoesData')
const { verificarCamposPassados, verificarTipoEntradaOuSaida, objMensagens, validacaoGeral, verificarSaldo} = require('./suporte')
const bcrypt = require('bcrypt')
const validator = require("email-validator");
const jwt = require('jsonwebtoken');
require('dotenv').config()


const cadastrarUsuario = async (req, res) => {
    const {nome, email, senha} = req.body;
    try {
        const verificarCampos = () => verificarCamposPassados([nome, email, senha], res, objMensagens.todosCamposObrigatorios)
        if (validacaoGeral([verificarCampos])) {
            return
        }    
        const senhaEncriptada = await bcrypt.hash(senha, 10)
        if (validator.validate(email)) {
            const {rows} = await cadastrarUsuarioQuery(nome, email, senhaEncriptada)
            const {id} = rows[0]
            return res.status(201).json({id, nome, email})
        } else {
            return res.status(400).json({mensagem: objMensagens.emailInvalido})
        }
    } catch(e) {
        console.log(e.message)
        return res.status(400).json({mensagem: objMensagens.emailJaExiste})
    }
};


const loginUsuario = async (req, res) => {
    try {
        const {email, senha} = req.body
        const verificarCampos = () => verificarCamposPassados([email, senha], res, objMensagens.todosCamposObrigatorios)
        if (validacaoGeral([verificarCampos])) {
            return
        }
        const {rows} = await buscarUsuarioPorEmail(email)
        if (rows.length === 0) {
            return res.status(400).json({message: objMensagens.usuarioSenhaInvalidos})
        }
        const senhaValida = await bcrypt.compare(senha, rows[0].senha)
        if (!senhaValida) {
            return res.status(400).json({message: objMensagens.usuarioSenhaInvalidos})
        }
        const token = jwt.sign({id: rows[0].id}, process.env.senha_jwt)
        return res.status(200).json({usuario: {
            id: rows[0].id,
            nome: rows[0].nome,
            email
        },
        token})
    } catch (e) {
        console.log(e.message)
        return res.status(400).json({ message: 'Erro durante o login' });
    }
}

const cadastrarTransacao = async (req, res) => {
    const {valor, tipo} = req.body
    try {
        const verificarCampos = () => verificarCamposPassados([valor, tipo], res, objMensagens.todosCamposObrigatorios)
        const verificarTipo = () => verificarTipoEntradaOuSaida(tipo, res)
        if (validacaoGeral ([verificarCampos, verificarTipo])) {
            return
        };
        if (tipo == "saida") {
            const extrato = await verificarSaldo(req)
            if (extrato.saldo < valor) {
                return res.status(403).json({mensagem: objMensagens.saldoIndisponivel});
            }
        }
        const retornoCadastro = await cadastrarTransacaoQuery(valor, tipo, req.usuario_id_token)
        return res.status(201).json(retornoCadastro.rows[0])
    } catch (e) {
        console.log(e.message)
        return res.status(401).json({message: objMensagens.tokenInvalido})
    }
};

const extratoTransacoes = async (req, res) => {
    try {
        const extrato = await verificarSaldo(req)
        res.status(200).json({
            "Entrada":extrato.entrada,
            "Saida":extrato.saida,
            "Saldo": extrato.saldo,
        })
    } catch (e) {
        console.log(e.message)
        return res.status(401).json({message: objMensagens.tokenInvalido})
    }
};

const extratoConsolidado = async (req, res) => {
    try {
        const movimentacoes = await buscarTodasTransacoesQuery(req.usuario_id_token);
        const extrato = await verificarSaldo(req)
        return res.status(200).json({
            extrato,
           "movimentacoes": movimentacoes.rows
        })
    } catch (error) {
        return res.status(401).json({message: objMensagens.tokenInvalido})
    }
}


module.exports = {
    cadastrarUsuario,
    loginUsuario,
    cadastrarTransacao,
    extratoTransacoes,
    extratoConsolidado
}