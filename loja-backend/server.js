const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados', err.message);
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

  // Tabela de Produtos com suporte à coluna de imagem
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
        { nome: 'Headset Gamer Redragon Zeus H510', preco: 279.90, categoria: 'headset', descricao: 'Som surround 7.1, microfone removível e acabamento premium.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1pD6p3m6u6E8zr0IwspzkE4Yc-JqFDXCIRk7WxKyFdg&s=10' },
        { nome: 'Headset Logitech G435 Lightspeed', preco: 389.00, categoria: 'headset', descricao: 'Sem fio, ultraleve e com conectividade bluetooth/RF.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFWJ7A6Pw1puDDyRXqhIwQlUw5KdgdvCC2UH6i1nwdNg&s=10' },
        { nome: 'Headset HyperX Cloud Stinger 2', preco: 219.50, categoria: 'headset', descricao: 'Conforto assinatura HyperX com drivers de 50mm.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxbYMlyM3Ks4pAV-ml59Xlrh-t8A3HnvlPDSrjvvsxnQ&s=10' },
        { nome: 'Headset Razer BlackShark V2 X', preco: 310.00, categoria: 'headset', descricao: 'Drivers TriForce de 50mm e isolamento passivo de ruído avançado.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD9SWKYaKXgIZEIebfBPIZsXjrxjwzLQZd6OnjjJ9DFA&s=10' },
        { nome: 'Headset JBL Quantum 100', preco: 159.90, categoria: 'headset', descricao: 'Focado em imersão sonora para jogos com microfone boom.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAghdq_rA8rYM9ADm7H9Knyla4Goi0pC7Pck7O53sVMQ&s=10' },

        // --- MOUSE ---
        { nome: 'Mouse Gamer Logitech G203 Lightsync', preco: 129.90, categoria: 'mouse', descricao: 'Sensor de 8000 DPI e iluminação RGB personalizável.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6DxiLym1aNBHSoN82ljWJUOuat0YpkpaLCz7OVvBRuQ&s' },
        { nome: 'Mouse Razer DeathAdder V2 X Hyperspeed', preco: 249.00, categoria: 'mouse', descricao: 'Ergonômico sem fio com bateria de longa duração.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShqXpvdwsHp1rjdZqAsdKaqPmnWIR_Ab4G-v3WwM8jKw&s=10' },
        { nome: 'Mouse Redragon Cobra M711', preco: 99.90, categoria: 'mouse', descricao: '10.000 DPI, 7 botões programáveis e ajuste macro.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY0FMlD2cGsGhKDRLJTXNfMQmIMwwqxu07sHiAaz7NYA&s=10' },
        { nome: 'Mouse HyperX Pulsefire Core', preco: 115.00, categoria: 'mouse', descricao: 'Sensor óptico Pixart 3327 e design simétrico leve.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqM-zL1ZPR9UsYgDRskeEwPrC3J-ygITPx-QuZJVTOyA&s=10' },
        { nome: 'Mouse Corsair Harpoon RGB Pro', preco: 139.90, categoria: 'mouse', descricao: 'Leve, com empunhaduras laterais emborrachadas.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYNUs1nKxADNWiP2KfV2LUBBELWKNapAXkWqJi-vnZzw&s=10' },

        // --- TECLADO ---
        { nome: 'Teclado Mecânico Redragon Kumara K552', preco: 199.90, categoria: 'teclado', descricao: 'Switch Outemu Blue, formato TKL e LED vermelho.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWX7Ts6gn6k5f8L-w-j4O4pkzFz2HXJEeHl8GjggUosA&s=10' },
        { nome: 'Teclado Gamer HyperX Alloy Origins 60', preco: 450.00, categoria: 'teclado', descricao: 'Formato compacto 60% com switches mecânicos HyperX.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVYedUtpsxpDplML1A65VQefgc3EEWw91C0YZ-bSn2Og&s=10' },
        { nome: 'Teclado Logitech G Pro Mechanical', preco: 699.00, categoria: 'teclado', descricao: 'Desenvolvido para eSports com switches GX Blue.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnJZVz00UOKEwJgqP7_3McIhQrvdJ5m391w8p77ZcLFw&s=10' },
        { nome: 'Teclado Fallen Eco Mecânico', preco: 289.90, categoria: 'teclado', descricao: 'Teclado brasileiro projetado por pro players.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJj6mWHxkTVJaymjDXTeCjaJvk4cshYteirmUumPFL3A&s=10' },
        { nome: 'Teclado Multimídia Usb Basico Bright', preco: 49.90, categoria: 'teclado', descricao: 'Teclado de membrana confortável para escritório e estudos.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ5u0gY97U5YglAH2blJoC1EEK5Acgq6cGFGHfriv5mw&s=10' },

        // --- MONITOR ---
        { nome: 'Monitor Gamer LG UltraGear 24" 144Hz', preco: 999.00, categoria: 'monitor', descricao: 'Painel IPS, 1ms de resposta e tecnologia FreeSync.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpv6eLUhpo-GMMsmkuSr7YBRpcUcJOmO6WD0OGO7dU7w&s=10' },
        { nome: 'Monitor Samsung Odyssey G32 27" 165Hz', preco: 1299.00, categoria: 'monitor', descricao: 'Design imersivo e taxa de atualização ultra rápida.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7WofF4udAsmerhXbUhHTk7eNe4g8BOzkp1gbuqe4cOg&s=10' },
        { nome: 'Monitor AOC Hero 27" 144Hz IPS', preco: 1150.00, categoria: 'monitor', descricao: 'Ajuste de altura e rotação com cores vibrantes.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh0N1l_KEN_GHXxXl9yUishnQS3-UrK6UQ_W6VW0bs0w&s=10' },
        { nome: 'Monitor Alienware de 27” 4K 180Hz', preco: 6869.00, categoria: 'monitor', descricao: 'Monitor gamer de 27” com IPS de resolução dupla nativa e alternância dinâmica entre 4K a 180 Hz .', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr2BwE8iTfbTm0ezlhaaZcPokMxVeCBxecNSg_ZFjfqw&s=10' },
        { nome: 'Monitor Dell 21.5" Full HD', preco: 649.00, categoria: 'monitor', descricao: 'Foco em produtividade com antirreflexo e proteção ocular.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmVn6_JCLP8aH5Bz3AIi3GUV_kowbhCy7PYbhgV88jRA&s=10' },

        // --- CONTROLE ---
        { nome: 'Controle DualSense Sony PS5 Branco', preco: 389.90, categoria: 'controle', descricao: 'Feedback tátil e gatilhos adaptáveis imersivos.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdCLIIOcFXldFhttiqHjrx996yPSrEOKDtFm3MYv3MGQ&s=10' },
        { nome: 'Controle Microsoft Xbox Series X|S Carbon Black', preco: 399.00, categoria: 'controle', descricao: 'Ergonomia refinada e gatilhos texturizados.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfXcSYzUP7EuZAhhhoLWKeBZTs2Dtoxz1TY1YzOfd-Sw&s=10' },
        { nome: 'Controle Redragon Harrow G808 Sem Fio', preco: 149.90, categoria: 'controle', descricao: 'Compatível com PC e PS3, dupla vibração.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBiz30eXG3A5j6RYRCe_ADVq_Vjmp0e1J6UZ2NGUuL0Q&s=10' },
        { nome: 'Controle Nintendo Switch 2 PRO ', preco: 599.90, categoria: 'controle', descricao: 'Eleve sua jogabilidade a um nível profissional com o Controle Nintendo Switch 2 Pro', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEwU9z_0YgQ2sqwg5FWZQjTVAvxzLgTznnZ0NSBLyAxQ&s=10' },
        { nome: 'Controle PS5 sem fio DualSense EDGE', preco: 1099.00, categoria: 'controle', descricao: 'Ganhe vantagem no jogo ao criar controles personalizados que garantem seu próprio estilo.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwrKlCpu9ES857gwrEaCsKZL9Wd8xISJZpe7vLeVnkug&s=10' },

        // --- CONSOLE ---
        { nome: 'Console Sony PlayStation 5 825GB', preco: 3699.00, categoria: 'console', descricao: 'Jogos em 4K, carregamento ultrarrápido por SSD.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrcKP1mdoc1yA96OKd62UK2lLCnu427N2kKePvne7MVg&s=10' },
        { nome: 'Console Microsoft Xbox Series S 512GB', preco: 2299.00, categoria: 'console', descricao: 'Next-gen totalmente digital em tamanho compacto.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXCu2X3C3AH47kcRe2O8uWkJrMAfucg7J2IjbDGyDeVw&s=10' },
        { nome: 'Console Nintendo Switch OLED 64GB', preco: 2499.00, categoria: 'console', descricao: 'Tela maior de 7 polegadas e suporte ajustável.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR492J03_6Xs1aBxU998jr116YCQ5Ovg9Ej0CrQqZm0pQ&s=10' },
        { nome: 'Console Ninttendo Switch 2', preco: 4499.00, categoria: 'console', descricao: 'O Nintendo Switch 2 representa a próxima evolução dos consoles, oferecendo uma experiência de jogo imersiva', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIToRqqfBO2gG71K64wy2VZ7PnjA4Yjjvwg23RsuvTnA&s=10' },
        { nome: 'Console Microsoft Xbox Series X', preco: 7499.00, categoria: 'console', descricao: 'Apresentamos o Xbox Series X, nosso console mais rápido e poderoso de todos os tempos.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhm4kbVpP_h4zp5zpEqkMaWj8_pcL6c-9SGaCfxkloSw&s' },

        // --- COMPUTADORES ---
        { nome: 'PC Gamer Completo Intel Core i5, 16GB, SSD 480GB', preco: 2699.00, categoria: 'computadores', descricao: 'Pronto para jogos e softwares pesados.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJneWyHMC_3pHmhc5uK3EKKXfHbXP2uTXTv2ftNGnYWw&s=10' },
        { nome: 'Computador Ryzen 5 5600G, 16GB RAM, SSD 512GB', preco: 2450.00, categoria: 'computadores', descricao: 'Excelente desempenho gráfico integrado Radeon Vega 7.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKq9llDUzxC6PBAQYtKykM6kRDNG72oC-Ca1aUZoyZ8g&s=10' },
        { nome: 'PC Escritório Core i3, 8GB RAM, SSD 240GB', preco: 1399.00, categoria: 'computadores', descricao: 'Ideal para tarefas diárias, estudos e home office.', imagem: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60' },
        { nome: 'PC Gamer High-End Ryzen 7, RTX 4060, 32GB RAM', preco: 5899.00, categoria: 'computadores', descricao: 'Máxima performance em jogos pesados e Ray Tracing.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ685-qBpWRBwSO738GcJNXJ8QqsKy0Ke-2jJr2dZGnWg&s=10' },
        { nome: 'PC Gamer i7, 16gb ram, rtx 3060', preco: 8665.00, categoria: 'computadores', descricao: 'PC gamer pra quem busca alta performance e alto desempenho em jogos full HD.', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCG-BtJJYTW9O_LL7HhSL8e3XzxgkakEpwrdeXI0zNg&s=10' }
      ];

      db.serialize(() => {
        db.run("BEGIN TRANSACTION;");
        produtosIniciais.forEach(p => {
          db.run("INSERT INTO produtos (nome, preco, categoria, descricao, imagem) VALUES (?, ?, ?, ?, ?)", [p.nome, p.preco, p.categoria, p.descricao, p.imagem]);
        });
        db.run("COMMIT;", (err) => {
          if (!err) {
            console.log("Produtos iniciais com imagens cadastrados com sucesso!");
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

app.post('/usuarios', (req, res) => {
  const { nome, email, senha } = req.body;
  const query = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
  db.run(query, [nome, email, senha], function(err) {
    if (err) {
      res.status(400).json({ erro: "E-mail já cadastrado ou dados inválidos." });
      return;
    }
    res.json({ id: this.lastID, nome, email });
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