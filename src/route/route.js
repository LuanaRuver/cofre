const express = require('express');
const rotas = express();
const {cadastrarUsuario, loginUsuario, cadastrarTransacao,  extratoTransacoes, extratoConsolidado} = require('../controladores/controladores');
const { validador } = require('../controladores/intermediarios');

rotas.post('/usuario', cadastrarUsuario)
rotas.post('/login', loginUsuario)

rotas.use(validador);

rotas.get('/transacao', extratoTransacoes)
rotas.get('/transacao/extrato', extratoConsolidado)
rotas.post('/transacao', cadastrarTransacao)

module.exports = rotas;

