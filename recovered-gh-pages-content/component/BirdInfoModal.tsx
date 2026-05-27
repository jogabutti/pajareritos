import React from 'react';
import { BirdInfo } from './BirdList';

interface Props {
  bird: BirdInfo | null;
  onClose: () => void;
}

const BirdInfoModal: React.FC<Props> = ({ bird, onClose }) => {
  if (!bird) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.7)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: 32,
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          textAlign: 'center'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: 16 }}>{bird.comName}</h2>
        <div style={{ fontStyle: 'italic', marginBottom: 8 }}>{bird.sciName}</div>
        <div style={{ marginBottom: 8 }}>Código: {bird.code}</div>
        <button
          style={{
            marginTop: 16,
            background: '#1AB6D9',
            color: 'white',
            border: 'none',
            borderRadius: 16,
            padding: '8px 24px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default BirdInfoModal;