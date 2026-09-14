import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

export default function App() {
  const [tela, setTela] = useState('produtos');
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const [formLogin, setFormLogin] = useState({ email: '', senha: '' });
  const [formCadastro, setFormCadastro] = useState({ nome: '', email: '', senha: '' });
  const [formaPagamento, setFormaPagamento] = useState('Pix');

  useEffect(() => {
    carregarProdutos();
  }, []);

  function carregarProdutos() {
    api.get('/produtos')
      .then(response => setProdutos(response.data))
      .catch(err => console.error('Erro ao buscar produtos:', err));
  }

  function adicionarAoCarrinho(produto) {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, produto_id: produto.id, quantidade: 1 }]);
    }
    alert('Produto adicionado ao carrinho!');
  }

  function handleLogin(e) {
    e.preventDefault();
    api.post('/login', formLogin)
      .then(res => {
        setUsuarioLogado(res.data.usuario);
        alert('Login realizado com sucesso!');
        setTela('produtos');
      })
      .catch(err => alert(err.response?.data?.erro || 'Erro no login'));
  }

  function handleCadastro(e) {
    e.preventDefault();
    api.post('/usuarios', formCadastro)
      .then(() => {
        alert('Cadastro realizado com sucesso! Faça login.');
        setTela('login');
      })
      .catch(err => alert(err.response?.data?.erro || 'Erro no cadastro'));
  }

  function finalizarPedido() {
    if (!usuarioLogado) {
      alert('Você precisa estar logado para finalizar o pedido!');
      setTela('login');
      return;
    }

    const dadosPedido = {
      usuario_id: usuarioLogado.id,
      forma_pagamento: formaPagamento,
      itens: carrinho
    };

    api.post('/pedidos', dadosPedido)
      .then(res => {
        alert(`Pedido #${res.data.pedido_id} finalizado com sucesso!`);
        setCarrinho([]);
        setTela('produtos');
      })
      .catch(err => alert(err.response?.data?.erro || 'Erro ao finalizar pedido'));
  }

  const valorTotalCarrinho = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '0', padding: '20px', backgroundColor: '#f4f4f9', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222', color: '#fff', padding: '15px 30px', borderRadius: '8px' }}>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setTela('produtos')}>💻 TechStore Facul</h2>
        <div>
          <button onClick={() => setTela('produtos')} style={estiloBotaoNav}>Vitrine</button>
          <button onClick={() => setTela('carrinho')} style={estiloBotaoNav}>Carrinho ({carrinho.length})</button>
          {usuarioLogado ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginLeft: '15px' }}>
              <span style={{ color: '#4ade80' }}>Olá, {usuarioLogado.nome}</span>
              <button 
                onClick={() => {
                  setUsuarioLogado(null);
                  setCarrinho([]);
                  setTela('produtos');
                  alert('Você saiu da sua conta.');
                }} 
                style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => setTela('login')} style={estiloBotaoNav}>Login</button>
              <button onClick={() => setTela('cadastro')} style={estiloBotaoNav}>Cadastrar</button>
            </>
          )}
        </div>
      </header>

      <main style={{ marginTop: '30px' }}>
        {tela === 'produtos' && (
          <div>
            <h2>Vitrine de Produtos</h2>
            {produtos.length === 0 ? (
              <p>Nenhum produto cadastrado ainda. Use o Thunder Client para cadastrar na rota POST /produtos!</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {produtos.map(prod => (
                  <div key={prod.id} style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>{prod.nome}</h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>{prod.descricao}</p>
                    <p style={{ fontWeight: 'bold', color: '#16a34a', fontSize: '18px' }}>R$ {prod.preco.toFixed(2)}</p>
                    <button onClick={() => adicionarAoCarrinho(prod)} style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Adicionar ao Carrinho
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tela === 'carrinho' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
            <h2>Seu Carrinho de Compras</h2>
            {carrinho.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {carrinho.map(item => (
                    <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                      <span>{item.nome} (Qtd: {item.quantidade})</span>
                      <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <h3>Total: R$ {valorTotalCarrinho.toFixed(2)}</h3>
                
                <div style={{ margin: '20px 0' }}>
                  <label>Forma de Pagamento: </label>
                  <select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)} style={{ padding: '8px', marginLeft: '10px' }}>
                    <option value="Pix">Pix</option>
                    <option value="Cartao de Credito">Cartão de Crédito</option>
                    <option value="Boleto">Boleto</option>
                  </select>
                </div>

                <button onClick={finalizarPedido} style={{ padding: '12px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>
                  Finalizar Pedido
                </button>
              </div>
            )}
          </div>
        )}

        {tela === 'login' && (
          <div style={estiloFormContainer}>
            <h2>Entrar na Conta</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
              <input type="email" placeholder="E-mail" value={formLogin.email} onChange={e => setFormLogin({ ...formLogin, email: e.target.value })} style={estiloInput} required />
              <input type="password" placeholder="Senha" value={formLogin.senha} onChange={e => setFormLogin({ ...formLogin, senha: e.target.value })} style={estiloInput} required />
              <button type="submit" style={estiloBotaoForm}>Entrar</button>
            </form>
          </div>
        )}

        {tela === 'cadastro' && (
          <div style={estiloFormContainer}>
            <h2>Criar Novo Usuário</h2>
            <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
              <input type="text" placeholder="Nome Completo" value={formCadastro.nome} onChange={e => setFormCadastro({ ...formCadastro, nome: e.target.value })} style={estiloInput} required />
              <input type="email" placeholder="E-mail" value={formCadastro.email} onChange={e => setFormCadastro({ ...formCadastro, email: e.target.value })} style={estiloInput} required />
              <input type="password" placeholder="Senha" value={formCadastro.senha} onChange={e => setFormCadastro({ ...formCadastro, senha: e.target.value })} style={estiloInput} required />
              <button type="submit" style={estiloBotaoForm}>Cadastrar</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

const estiloBotaoNav = { background: 'transparent', color: '#fff', border: '1px solid #555', padding: '6px 12px', marginLeft: '10px', borderRadius: '4px', cursor: 'pointer' };
const estiloFormContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', padding: '30px', borderRadius: '8px', width: 'fit-content', margin: '0 auto' };
const estiloInput = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' };
const estiloBotaoForm = { padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };