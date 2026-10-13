import React, { useState, useEffect } from 'react';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  
  const [telaAtual, setTelaAtual] = useState('loja');
  const [formaPagamento, setFormaPagamento] = useState('cartao');

  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [nomeInput, setNomeInput] = useState('');
  const [modoCadastro, setModoCadastro] = useState(false);

  const categoriasFixas = ['headset', 'mouse', 'teclado', 'monitor', 'controle', 'console', 'computadores'];

  useEffect(() => {
    fetch('http://localhost:3000/produtos')
      .then(res => res.json())
      .then(data => setProdutos(data))
      .catch(err => console.error("Erro ao carregar produtos:", err));
  }, []);

  const produtosFiltrados = categoriaSelecionada
    ? produtos.filter(p => p.categoria.toLowerCase() === categoriaSelecionada.toLowerCase())
    : produtos;

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, senha: senhaInput })
    })
    .then(res => res.json())
    .then(data => {
      if (data.usuario) {
        setUsuarioLogado(data.usuario);
        alert("Login efetuado com sucesso!");
      } else {
        alert(data.erro || "E-mail ou senha incorretos.");
      }
    });
  };

  const handleCadastro = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nomeInput, email: emailInput, senha: senhaInput })
    })
    .then(res => res.json())
    .then(data => {
      if (data.id) {
        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        setModoCadastro(false);
        setNomeInput('');
        setEmailInput('');
        setSenhaInput('');
      } else {
        alert(data.erro || "Erro ao cadastrar.");
      }
    });
  };

  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
  };

  const removerDoCarrinho = (indexParaRemover) => {
    setCarrinho(carrinho.filter((_, index) => index !== indexParaRemover));
  };

  const irParaPagamento = () => {
    if (!usuarioLogado) {
      alert("Você precisa estar logado para finalizar o pedido!");
      return;
    }
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    setTelaAtual('pagamento');
  };

  const confirmarCompra = (e) => {
    e.preventDefault();
    const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    const itensFormatados = carrinho.map(item => ({ produto_id: item.id, quantidade: 1 }));

    fetch('http://localhost:3000/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: usuarioLogado.id, total, itens: itensFormatados })
    })
    .then(res => res.json())
    .then(data => {
      alert(`🎉 ${data.mensagem} Pagamento via ${formaPagamento} aprovado!`);
      setCarrinho([]);
      setTelaAtual('loja');
    })
    .catch(err => alert("Erro ao registrar pedido."));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9', color: '#333' }}>
      
      {/* HEADER */}
      <header style={{ background: '#1e293b', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ cursor: 'pointer', margin: 0, fontSize: '22px' }} onClick={() => setTelaAtual('loja')}>TechStore Facul</h2>
        <div>
          {usuarioLogado ? (
            <span style={{ fontSize: '14px' }}>
              Olá, <b>{usuarioLogado.nome}</b> |&nbsp;
              <button 
                onClick={() => setUsuarioLogado(null)}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Sair
              </button>
            </span>
          ) : (
            <div>
              {modoCadastro ? (
                <form onSubmit={handleCadastro} style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                  <input type="text" placeholder="Nome" value={nomeInput} onChange={e => setNomeInput(e.target.value)} required style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <input type="email" placeholder="E-mail" value={emailInput} onChange={e => setEmailInput(e.target.value)} required style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <input type="password" placeholder="Senha" value={senhaInput} onChange={e => setSenhaInput(e.target.value)} required style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <button type="submit" style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '7px 12px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Cadastrar</button>
                  <button type="button" onClick={() => setModoCadastro(false)} style={{ background: 'transparent', color: '#93c5fd', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Já tenho conta</button>
                </form>
              ) : (
                <form onSubmit={handleLogin} style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                  <input type="email" placeholder="E-mail" value={emailInput} onChange={e => setEmailInput(e.target.value)} required style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <input type="password" placeholder="Senha" value={senhaInput} onChange={e => setSenhaInput(e.target.value)} required style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '7px 12px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Entrar</button>
                  <button type="button" onClick={() => setModoCadastro(true)} style={{ background: 'transparent', color: '#93c5fd', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Criar conta</button>
                </form>
              )}
            </div>
          )}
        </div>
      </header>

      {/* CORPO PRINCIPAL */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* TELA DA LOJA */}
        {telaAtual === 'loja' && (
          <>
            {/* SIDEBAR DE CATEGORIAS */}
            <aside style={{ width: '260px', background: '#ffffff', padding: '20px', borderRight: '1px solid #e2e8f0', boxShadow: '2px 0 5px rgba(0,0,0,0.02)' }}>
              <h3 style={{ color: '#1e293b', marginTop: 0 }}>Categorias</h3>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
                <li 
                  style={{ cursor: 'pointer', padding: '10px 8px', borderRadius: '4px', fontWeight: !categoriaSelecionada ? 'bold' : 'normal', backgroundColor: !categoriaSelecionada ? '#eff6ff' : 'transparent', color: !categoriaSelecionada ? '#1d4ed8' : '#334155', marginBottom: '4px' }}
                  onClick={() => setCategoriaSelecionada(null)}
                >
                  Todos os produtos
                </li>
                {categoriasFixas.map((cat, index) => (
                  <li 
                    key={index}
                    style={{ cursor: 'pointer', padding: '10px 8px', borderRadius: '4px', textTransform: 'capitalize', fontWeight: categoriaSelecionada === cat ? 'bold' : 'normal', backgroundColor: categoriaSelecionada === cat ? '#eff6ff' : 'transparent', color: categoriaSelecionada === cat ? '#1d4ed8' : '#334155', marginBottom: '4px' }}
                    onClick={() => setCategoriaSelecionada(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </aside>

            {/* VITRINE */}
            <main style={{ flex: 1, padding: '25px' }}>
              <h2 style={{ color: '#1e293b', marginTop: 0 }}>{categoriaSelecionada ? `Categoria: ${categoriaSelecionada.toUpperCase()}` : 'Vitrine de Produtos'}</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {produtosFiltrados.length === 0 ? (
                  <p style={{ color: '#64748b' }}>Nenhum produto cadastrado nesta categoria ainda.</p>
                ) : (
                  produtosFiltrados.map(produto => (
                    <div key={produto.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
                      {/* CONTAINER DA IMAGEM AJUSTADO */}
                      <div style={{ background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '140px', borderBottom: '1px solid #e2e8f0', padding: '10px' }}>
                        <img src={produto.imagem} alt={produto.nome} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                      
                      <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '15px' }}>{produto.nome}</h4>
                          <p style={{ color: '#475569', fontSize: '12px', margin: '0 0 12px 0', lineHeight: '1.4' }}>{produto.descricao}</p>
                        </div>
                        <div>
                          <p style={{ fontWeight: 'bold', color: '#16a34a', fontSize: '16px', margin: '0 0 12px 0' }}>R$ {produto.preco.toFixed(2)}</p>
                          <button 
                            onClick={() => adicionarAoCarrinho(produto)}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '9px 12px', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '13px' }}
                          >
                            Adicionar ao Carrinho
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </main>

            {/* CARRINHO */}
            <aside style={{ width: '280px', background: '#ffffff', padding: '20px', borderLeft: '1px solid #e2e8f0', boxShadow: '-2px 0 5px rgba(0,0,0,0.02)' }}>
              <h3 style={{ color: '#1e293b', marginTop: 0 }}>🛒 Carrinho</h3>
              {carrinho.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '14px' }}>Seu carrinho está vazio.</p>
              ) : (
                <div>
                  <ul style={{ paddingLeft: '15px', marginBottom: '15px' }}>
                    {carrinho.map((item, index) => (
                      <li key={index} style={{ fontSize: '13px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#334155' }}>
                        <span>{item.nome} - R$ {item.preco.toFixed(2)}</span>
                        <button 
                          onClick={() => removerDoCarrinho(index)} 
                          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginBottom: '15px' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#0f172a', margin: 0 }}>
                      Total: R$ {carrinho.reduce((acc, item) => acc + item.preco, 0).toFixed(2)}
                    </p>
                  </div>
                  <button 
                    onClick={irParaPagamento}
                    style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px', width: '100%', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                  >
                    Finalizar Pedido
                  </button>
                </div>
              )}
            </aside>
          </>
        )}

        {/* TELA DE PAGAMENTO */}
        {telaAtual === 'pagamento' && (
          <div style={{ flex: 1, padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <button 
              onClick={() => setTelaAtual('loja')} 
              style={{ background: '#64748b', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}
            >
              ← Voltar para a Loja
            </button>
            
            <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h2 style={{ color: '#1e293b', marginTop: 0 }}>💳 Tela de Pagamento</h2>
              <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #e2e8f0' }} />

              <h4 style={{ color: '#334155' }}>Resumo do Pedido:</h4>
              <ul style={{ margin: '10px 0 20px 20px', color: '#475569' }}>
                {carrinho.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{item.nome} — R$ {item.preco.toFixed(2)}</li>
                ))}
              </ul>
              
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>
                Total a Pagar: R$ {carrinho.reduce((acc, item) => acc + item.preco, 0).toFixed(2)}
              </p>

              <form onSubmit={confirmarCompra} style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#334155' }}>Escolha a forma de pagamento:</label>
                <select 
                  value={formaPagamento} 
                  onChange={e => setFormaPagamento(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155' }}
                >
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Pix">Pix</option>
                  <option value="Boleto Bancário">Boleto Bancário</option>
                </select>

                {formaPagamento === 'Cartão de Crédito' && (
                  <div style={{ marginBottom: '20px' }}>
                    <input type="text" placeholder="Número do Cartão" required style={{ width: '100%', padding: '9px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" placeholder="Validade (MM/AA)" required style={{ flex: 1, padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                      <input type="text" placeholder="CVV" required style={{ flex: 1, padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '12px', width: '100%', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                >
                  Confirmar Pagamento
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;