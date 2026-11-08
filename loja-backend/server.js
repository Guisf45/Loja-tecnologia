const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    categoria TEXT NOT NULL,
    descricao TEXT,
    imagem TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    total REAL NOT NULL,
    data TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS itens_pedido (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER,
    produto_id INTEGER,
    quantidade INTEGER,
    FOREIGN KEY(pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY(produto_id) REFERENCES produtos(id)
  )`);

  db.get("SELECT COUNT(*) as count FROM produtos", (err, row) => {
    if (row && row.count === 0) {
      const produtosIniciais = [
        // --- HEADSET ---
        { nome: 'Headset Gamer Redragon Zeus H510', preco: 279.90, categoria: 'headset', descricao: 'Som surround 7.1, microfone removível e acabamento premium.', imagem: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Headset Logitech G435 Lightspeed', preco: 389.00, categoria: 'headset', descricao: 'Sem fio, ultraleve e com conectividade bluetooth/RF.', imagem: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Headset HyperX Cloud Stinger 2', preco: 219.50, categoria: 'headset', descricao: 'Conforto assinatura HyperX com drivers de 50mm.', imagem: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Headset Razer BlackShark V2 X', preco: 310.00, categoria: 'headset', descricao: 'Drivers TriForce de 50mm e isolamento passivo de ruído avançado.', imagem: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Headset JBL Quantum 100', preco: 159.90, categoria: 'headset', descricao: 'Focado em imersão sonora para jogos com microfone boom.', imagem: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500&auto=format&fit=crop&q=60' },

        // --- MOUSE ---
        { nome: 'Mouse Gamer Logitech G203 Lightsync', preco: 129.90, categoria: 'mouse', descricao: 'Sensor de 8000 DPI e iluminação RGB personalizável.', imagem: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Mouse Razer DeathAdder V2 X Hyperspeed', preco: 249.00, categoria: 'mouse', descricao: 'Ergonômico sem fio com bateria de longa duração.', imagem: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Mouse Redragon Cobra M711', preco: 99.90, categoria: 'mouse', descricao: '10.000 DPI, 7 botões programáveis e ajuste macro.', imagem: 'https://images.unsplash.com/photo-1605773527852-c546a8581ea3?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Mouse HyperX Pulsefire Core', preco: 115.00, categoria: 'mouse', descricao: 'Sensor óptico Pixart 3327 e design simétrico leve.', imagem: 'https://images.unsplash.com/photo-1613141692019-2ac827526320?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Mouse Corsair Harpoon RGB Pro', preco: 139.90, categoria: 'mouse', descricao: 'Leve, com empunhaduras laterais emborrachadas.', imagem: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=500&auto=format&fit=crop&q=60' },

        // --- TECLADO ---
        { nome: 'Teclado Mecânico Redragon Kumara K552', preco: 199.90, categoria: 'teclado', descricao: 'Switch Outemu Blue, formato TKL e LED vermelho.', imagem: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Teclado Gamer HyperX Alloy Origins 60', preco: 450.00, categoria: 'teclado', descricao: 'Formato compacto 60% com switches mecânicos HyperX.', imagem: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Teclado Logitech G Pro Mechanical', preco: 699.00, categoria: 'teclado', descricao: 'Desenvolvido para eSports com switches GX Blue.', imagem: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Teclado Fallen Eco Mecânico', preco: 289.90, categoria: 'teclado', descricao: 'Teclado brasileiro projetado por pro players.', imagem: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Teclado Multimídia Usb Basico Bright', preco: 49.90, categoria: 'teclado', descricao: 'Teclado de membrana confortável para escritório e estudos.', imagem: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&auto=format&fit=crop&q=60' },

        // --- MONITOR ---
        { nome: 'Monitor Gamer LG UltraGear 24" 144Hz', preco: 999.00, categoria: 'monitor', descricao: 'Painel IPS, 1ms de resposta e tecnologia FreeSync.', imagem: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Monitor Samsung Odyssey G32 27" 165Hz', preco: 1299.00, categoria: 'monitor', descricao: 'Design imersivo e taxa de atualização ultra rápida.', imagem: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Monitor AOC Hero 27" 144Hz IPS', preco: 1150.00, categoria: 'monitor', descricao: 'Ajuste de altura e rotação com cores vibrantes.', imagem: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Monitor Pichau Centauri 23.8" 75Hz', preco: 599.00, categoria: 'monitor', descricao: 'Ótimo custo-benefício para multitarefas e estudos.', imagem: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Monitor Dell 21.5" Full HD', preco: 649.00, categoria: 'monitor', descricao: 'Foco em produtividade com antirreflexo e proteção ocular.', imagem: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=60' },

        // --- CONTROLE ---
        { nome: 'Controle DualSense Sony PS5 Branco', preco: 389.90, categoria: 'controle', descricao: 'Feedback tátil e gatilhos adaptáveis imersivos.', imagem: 'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Controle Microsoft Xbox Series X|S Carbon Black', preco: 399.00, categoria: 'controle', descricao: 'Ergonomia refinada e gatilhos texturizados.', imagem: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Controle Redragon Harrow G808 Sem Fio', preco: 149.90, categoria: 'controle', descricao: 'Compatível com PC e PS3, dupla vibração.', imagem: 'https://images.unsplash.com/photo-1592840061637-1d16b5fc4257?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Controle Gamesir T4 Pro com Led', preco: 199.00, categoria: 'controle', descricao: 'Suporte para celular e giroscópio integrado.', imagem: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Controle Multilaser Acabamento Emborrachado', preco: 59.90, categoria: 'controle', descricao: 'Opção com fio econômica para computadores.', imagem: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=60' },

        // --- CONSOLE ---
        { nome: 'Console Sony PlayStation 5 825GB', preco: 3699.00, categoria: 'console', descricao: 'Jogos em 4K, carregamento ultrarrápido por SSD.', imagem: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Console Microsoft Xbox Series S 512GB', preco: 2299.00, categoria: 'console', descricao: 'Next-gen totalmente digital em tamanho compacto.', imagem: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Console Nintendo Switch OLED 64GB', preco: 2499.00, categoria: 'console', descricao: 'Tela maior de 7 polegadas e suporte ajustável.', imagem: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b2e?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Console Retrô Game Station 3000 Jogos', preco: 219.00, categoria: 'console', descricao: 'Diversão nostálgica com clássicos de 8 e 16 bits.', imagem: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Console Asus ROG Ally Z1 Extreme', preco: 4599.00, categoria: 'console', descricao: 'PC portátil gamer de alta performance para Windows.', imagem: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop&q=60' },

        // --- COMPUTADORES ---
        { nome: 'PC Gamer Completo Intel Core i5, 16GB, SSD 480GB', preco: 2699.00, categoria: 'computadores', descricao: 'Pronto para jogos e softwares pesados.', imagem: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Computador Ryzen 5 5600G, 16GB RAM, SSD 512GB', preco: 2450.00, categoria: 'computadores', descricao: 'Excelente desempenho gráfico integrado Radeon Vega 7.', imagem: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=60' },
        { nome: 'PC Escritório Core i3, 8GB RAM, SSD 240GB', preco: 1399.00, categoria: 'computadores', descricao: 'Ideal para tarefas diárias, estudos e home office.', imagem: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60' },
        { nome: 'PC Gamer High-End Ryzen 7, RTX 4060, 32GB RAM', preco: 5899.00, categoria: 'computadores', descricao: 'Máxima performance em jogos pesados e Ray Tracing.', imagem: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60' },
        { nome: 'Mini PC Beelink EQ12 Intel N100, 16GB RAM', preco: 1199.00, categoria: 'computadores', descricao: 'Compacto, silencioso e ótimo para servidores ou uso geral.', imagem: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=500&auto=format&fit=crop&q=60' }
      ];

      db.serialize(() => {
        db.run("BEGIN TRANSACTION;");
        produtosIniciais.forEach(p => {
          db.run("INSERT INTO produtos (nome, preco, categoria, descricao, imagem) VALUES (?, ?, ?, ?, ?)", [p.nome, p.preco, p.categoria, p.descricao, p.imagem]);
        });
        db.run("COMMIT;", (err) => {
          if (!err) {
            console.log("Produtos iniciais cadastrados com sucesso!");
          }
        });
      });
    }
  });
});

app.get('/produtos', (req, res) => {
  db.all("SELECT * FROM produtos", [], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    res.json(rows);
  });
});

// Rota de cadastro com verificação explícita de e-mail duplicado
app.post('/usuarios', (req, res) => {
  const { nome, email, senha } = req.body;

  // Primeiro verificamos se o e-mail já existe no banco
  db.get(`SELECT id FROM usuarios WHERE email = ?`, [email], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    if (row) {
      // Se encontrou um usuário com esse e-mail, retorna erro claro
      return res.status(400).json({ erro: "Este e-mail já está cadastrado!" });
    }

    // Se não existe, prossegue com a inserção
    const query = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
    db.run(query, [nome, email, senha], function(err) {
      if (err) {
        return res.status(400).json({ erro: "Erro ao cadastrar usuário." });
      }
      res.json({ id: this.lastID, nome, email });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const query = `SELECT * FROM usuarios WHERE email = ? AND senha = ?`;
  db.get(query, [email, senha], (err, row) => {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    if (row) {
      res.json({ mensagem: "Login bem-sucedido!", usuario: { id: row.id, nome: row.nome, email: row.email } });
    } else {
      res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }
  });
});

app.post('/pedidos', (req, res) => {
  const { usuario_id, total, itens } = req.body;
  const queryPedido = `INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)`;
  db.run(queryPedido, [usuario_id, total], function(err) {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    const pedidoId = this.lastID;
    const queryItem = `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade) VALUES (?, ?, ?)`;
    itens.forEach(item => {
      db.run(queryItem, [pedidoId, item.produto_id, item.quantidade]);
    });
    res.json({ mensagem: "Pedido realizado com sucesso!", pedido_id: pedidoId });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});