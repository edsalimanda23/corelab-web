import { useEffect, useState } from 'react';

const API_URL = 'https://corelab-api-1v72.onrender.com';

function App() {
  const [items, setItems] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cor, setCor] = useState('#ffffff');

  useEffect(() => {
    fetch(`${API_URL}/items`)
      .then(res => res.json())
      .then(data => {
        const ordenado = data.sort((a, b) => b.favorito - a.favorito);
        setItems(ordenado);
      });
  }, []);

  const criarItem = () => {
    if (!nome || !descricao) {
      alert('Preencha o nome e a descrição!');
      return;
    }

    fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao, cor })
    })
      .then(res => res.json())
      .then(novoItem => {
        setItems(prev => [...prev, novoItem].sort((a, b) => b.favorito - a.favorito));
        setNome('');
        setDescricao('');
        setCor('#ffffff');
      });
  };

  const toggleFavorito = (id) => {
    fetch(`${API_URL}/items/${id}/favorito`, { method: 'PUT' })
      .then(res => res.json())
      .then(itemAtualizado => {
        setItems(prev => {
          const atualizados = prev.map(i => i._id === id ? itemAtualizado : i);
          return atualizados.sort((a, b) => b.favorito - a.favorito);
        });
      });
  };

  const mudarCor = (id) => {
    const novaCor = prompt('Digite a nova cor (ex: #ff0000):');
    if (!novaCor) return;

    fetch(`${API_URL}/items/${id}/cor`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cor: novaCor })
    })
      .then(res => res.json())
      .then(itemAtualizado => {
        setItems(prev => prev.map(i => i._id === id ? itemAtualizado : i));
      });
  };

  const apagarItem = (id) => {
    if (!window.confirm('Apagar item?')) return;
    fetch(`${API_URL}/items/${id}`, { method: 'DELETE' })
      .then(() => setItems(prev => prev.filter(i => i._id !== id)));
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: 'auto' }}>
      <h1>🌟 Lista de Itens</h1>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(item => (
          <li key={item._id} style={{
            background: item.cor,
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px'
          }}>
            <strong>{item.nome}</strong> - {item.descricao}
            {item.favorito && ' ⭐'}
            <div>
              <button onClick={() => toggleFavorito(item._id)}>Favorito</button>
              <button onClick={() => mudarCor(item._id)}>Cor</button>
              <button onClick={() => apagarItem(item._id)}>Apagar</button>
            </div>
          </li>
        ))}
      </ul>

      <h2>Criar novo item</h2>
      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
      <input type="color" value={cor} onChange={e => setCor(e.target.value)} />
      <button onClick={criarItem}>Criar</button>
    </div>
  );
}

export default App;

