const express = require('express');
const cors = require('cors');
const db = require('./database'); // Importa a conexão com o banco de dados SQLite

const app = express();

// Configurações básicas
app.use(cors()); // Permite que o Front-end faça requisições para cá
app.use(express.json()); // Permite que a API entenda dados em formato JSON

// Rota de teste inicial
app.get('/', (req, res) => {
    res.send('O servidor da Loja de Tecnologia está rodando perfeitamente!');
});

// --- ROTAS DE USUÁRIOS ---

// Rota para cadastrar um novo usuário
app.post('/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Por favor, preencha todos os campos!' });
    }

    const sql = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
    
    db.run(sql, [nome, email, senha], function(err) {
        if (err) {
            return res.status(400).json({ erro: 'Erro ao cadastrar. E-mail já utilizado?' });
        }
        
        res.status(201).json({ 
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario_id: this.lastID 
        });
    });
});

// Rota para fazer Login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Informe o e-mail e a senha!' });
    }

    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    
    db.get(sql, [email], (err, usuario) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro interno no servidor.' });
        }

        if (!usuario || usuario.senha !== senha) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos!' });
        }

        res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    });
});

// --- ROTAS DE PRODUTOS ---

// Rota para cadastrar um novo produto
app.post('/produtos', (req, res) => {
    const { nome, descricao, preco, estoque, imagem } = req.body;

    if (!nome || !preco || !estoque) {
        return res.status(400).json({ erro: 'Nome, preço e estoque são obrigatórios!' });
    }

    const sql = `INSERT INTO produtos (nome, descricao, preco, estoque, imagem) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [nome, descricao, preco, estoque, imagem], function(err) {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao cadastrar produto.' });
        }
        
        res.status(201).json({ 
            mensagem: 'Produto cadastrado com sucesso!',
            produto_id: this.lastID 
        });
    });
});

// Rota para listar todos os produtos
app.get('/produtos', (req, res) => {
    const sql = `SELECT * FROM produtos`;
    
    db.all(sql, [], (err, linhas) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao buscar produtos.' });
        }
        res.status(200).json(linhas);
    });
});

// --- ROTA DE PEDIDOS (CHECKOUT) ---

app.post('/pedidos', (req, res) => {
    const { usuario_id, forma_pagamento, itens } = req.body;

    if (!usuario_id || !forma_pagamento || !itens || itens.length === 0) {
        return res.status(400).json({ erro: 'Dados do pedido incompletos ou carrinho vazio!' });
    }

    let valor_total = 0;
    for (let item of itens) {
        valor_total += item.preco * item.quantidade;
    }

    const sqlPedido = `INSERT INTO pedidos (usuario_id, valor_total, forma_pagamento) VALUES (?, ?, ?)`;
    
    db.run(sqlPedido, [usuario_id, valor_total, forma_pagamento], function(err) {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao criar o pedido.' });
        }

        const pedido_id = this.lastID;
        const sqlItem = `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)`;
        
        let itensInseridos = 0;
        let erroOcorrido = false;

        itens.forEach(item => {
            db.run(sqlItem, [pedido_id, item.produto_id, item.quantidade, item.preco], (err) => {
                if (err) erroOcorrido = true;
                
                itensInseridos++;

                if (itensInseridos === itens.length) {
                    if (erroOcorrido) {
                        return res.status(500).json({ erro: 'Erro ao salvar alguns itens do pedido.' });
                    }
                    res.status(201).json({
                        mensagem: 'Pedido finalizado com sucesso!',
                        pedido_id: pedido_id,
                        valor_total: valor_total
                    });
                }
            });
        });
    });
});

// Ligando o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor iniciado. Acesse: http://localhost:3000');
});