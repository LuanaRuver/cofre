const database = require('../infra/database');

const buscarTodasTransacoesQuery = (id) => {
    return database.query('select * from transacoes where usuario_id = $1', [id])
}

const cadastrarTransacaoQuery = (valor, tipo, usuario_id) => {
    return database.query('insert into transacoes (valor, tipo, usuario_id) values ($1, $2, $3) RETURNING *', [valor, tipo, usuario_id])
}

const buscarTodasTransacoes = (usuario_id) => {
    return database.query("SELECT 'entrada' AS tipo, SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) AS total FROM transacoes WHERE usuario_id = $1  UNION ALL  SELECT 'saida' AS tipo, SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) AS total FROM transacoes WHERE usuario_id = $1;", [usuario_id])
}

module.exports = {
    buscarTodasTransacoesQuery,
    cadastrarTransacaoQuery,
    buscarTodasTransacoes,
}
