import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBirdLists } from '../hook/useBirdLists';
import { Layout } from '../shared/Layout';

const NuevaLista: React.FC = () => {
  const navigate = useNavigate();
  const { createList } = useBirdLists();
  const [name, setName] = useState('');

  const handleCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const id = createList(name);
    navigate(`/nueva-lista/${id}`);
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <form onSubmit={handleCreate} style={{ width: '100%', maxWidth: 480 }}>
          <h2 style={{ color: 'var(--secondary)', fontFamily: '"Baloo 2", sans-serif', fontWeight: 700 }}>Crear nueva lista</h2>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Nombre de la lista</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Paseo en el Parque"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd' }}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" style={{ padding: '10px 16px', background: 'linear-gradient(90deg, var(--primary) 0%, #2DA69A 100%)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Crear</button>
            <button type="button" onClick={() => navigate('/')} style={{ padding: '10px 16px', borderRadius: 8, background: '#f0f0f0', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NuevaLista;
