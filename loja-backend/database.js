const sqlite3 = require('sqlite3').verbose();

// Inicia a conexão e cria o arquivo 'banco.sqlite' na sua pasta
const db = new sqlite3.Database('./banco.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Cria as tabelas do seu banco
db.serialize(() => {
    // Tabela de Usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela de usuários:', err.message);
    });

    // Tabela de Produtos
    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL,
            estoque INTEGER NOT NULL,
            imagem TEXT
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela de produtos:', err.message);
    });

    // Tabela de Pedidos
    db.run(`
        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            valor_total REAL NOT NULL,
            forma_pagamento TEXT NOT NULL,
            data DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela de pedidos:', err.message);
    });

    // Tabela de Itens do Pedido
    db.run(`
        CREATE TABLE IF NOT EXISTS itens_pedido (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido_id INTEGER NOT NULL,
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL,
            preco_unitario REAL NOT NULL,
            FOREIGN KEY (pedido_id) REFERENCES pedidos (id),
            FOREIGN KEY (produto_id) REFERENCES produtos (id)
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela de itens_pedido:', err.message);
        } else {
            console.log('Todas as tabelas foram criadas/verificadas com sucesso.');
        }
    });
});

// Exporta o banco para podermos usá-lo em outros arquivos
module.exports = db;