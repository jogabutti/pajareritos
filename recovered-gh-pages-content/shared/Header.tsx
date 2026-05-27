import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: '🏠 Volver al inicio', path: '/' },
    { label: 'Nueva lista de aves', path: '/nueva-lista' },
    { label: 'Ver listas anteriores', path: '/listas' },
    { label: 'Aves por región', path: '/region' },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="topbar">
      <button 
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        title="Menú"
      >
        <MenuIcon style={{ color: 'white', fontSize: 28 }} />
      </button>

      <div className="app-title" style={{ color: 'white' }}>Avistadores</div>

      <div style={{ width: 48 }} />

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="menu-dropdown">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              className="menu-item"
              onClick={() => handleMenuClick(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
