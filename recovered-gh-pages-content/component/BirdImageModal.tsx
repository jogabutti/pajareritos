import React from 'react';

interface Props {
  image: string | null;
  alt: string;
  onClose: () => void;
}

const BirdImageModal: React.FC<Props> = ({ image, alt, onClose }) => {
  if (!image) return null;
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
      <img
        src={image}
        alt={alt}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
        }}
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
};

export default BirdImageModal;