import { useEffect, useState } from 'react';

const API_URL = 'https://corelab-api-1v72.onrender.com';

function App() {
  const [items, setItems] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/items`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Erro ao buscar itens:', err));
  }, []);

  const criarItem = () => {
    if (!nome || !descricao) {
      alert('Preencha o nome e a descrição!');
      return;
    }

    fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao })
    })
      .then(res => res.json())
      .then(novoItem => {
        setItems(prev => [...prev, novoItem]);
        setNome('');
        setDescricao('');
      })
      .catch(err => console.error('Erro ao criar item:', err));
  };

  const apagarItem = (id) => {
    if (!window.confirm('Tem certeza que deseja apagar este item?')) return;

    fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setItems(prev => prev.filter(item => item._id !== id));
      })
      .catch(err => console.error('Erro ao apagar item:', err));
  };

  const editarItem = (id) => {
    const novoNome = prompt('Novo nome:');
    const novaDescricao = prompt('Nova descrição:');

    if (!novoNome || !novaDescricao) {
      alert('Nome e descrição são obrigatórios para editar!');
      return;
    }

    fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: novoNome, descricao: novaDescricao })
    })
      .then(res => res.json())
      .then(itemAtualizado => {
        setItems(prev => prev.map(item => item._id === id ? itemAtualizado : item));
      })
      .catch(err => console.error('Erro ao editar item:', err));
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ece9e6, #ffffff)',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>🌟 Lista de Itens</h1>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map(item => (
            <li key={item._id} style={{
              background: '#f9f9f9',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div>
                <strong>{item.nome}</strong><br />
                <small style={{ color: '#777' }}>{item.descricao}</small>
              </div>
              <div>
                <button onClick={() => editarItem(item._id)} style={buttonStyle('#3498db')}>Editar</button>
                <button onClick={() => apagarItem(item._id)} style={buttonStyle('#e74c3c')}>Apagar</button>
              </div>
            </li>
          ))}
        </ul>

        <h2 style={{ color: '#333' }}>➕ Criar novo item</h2>
        <div style={{ display: 'flex', gap: '5px' }}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            style={inputStyle}
          />
          <button onClick={criarItem} style={buttonStyle('#2ecc71')}>Criar</button>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = (bgColor) => ({
  background: `linear-gradient(45deg, ${bgColor}, #6ab7ff)`,
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '6px 12px',
  cursor: 'pointer',
  transition: '0.3s'
});

const inputStyle = {
  padding: '6px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  flex: 1
};

export default App;

