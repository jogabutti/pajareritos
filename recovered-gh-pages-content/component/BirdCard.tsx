import React, { useState, useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import InfoIcon from '@mui/icons-material/Info';
import BirdImageModal from './BirdImageModal';
import { BirdInfo } from './BirdList';

interface Props {
  bird: BirdInfo;
  checked: boolean;
  onClick: () => void;
  onInfo: () => void;
  readOnly?: boolean;
}

const BirdCard: React.FC<Props> = ({ bird, checked, onClick, onInfo, readOnly = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [isWide, setIsWide] = useState<boolean | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const backendUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://pajareritos-backend.vercel.app';

  const playSound = async () => {
    if (audio) {
      audio.play();
      return;
    }
    let recordings: any[] = [];
    // Try backend first
    try {
      const tryBackend = async (q: string) => {
        const res = await fetch(`${backendUrl}/api/bird-sound?query=${encodeURIComponent(q)}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data && data.recordings && data.recordings.length ? data.recordings : null;
      };

      let r = await tryBackend(bird.sciName);
      if (!r) r = await tryBackend(bird.comName);
      if (r && r.length) recordings = r;
    } catch (e) {
      // ignore and fallback to xeno-canto
      console.warn('backend bird-sound failed, falling back to xeno-canto', e);
    }

    // Fallback to xeno-canto directly
    try {
      if (recordings.length === 0) {
        const qc = encodeURIComponent(bird.sciName || bird.comName || '');
        const url = `https://xeno-canto.org/api/2/recordings?query=${qc}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.recordings && data.recordings.length) {
            recordings = data.recordings;
          }
        }
      }

      if (recordings.length > 0) {
        const mp3 = recordings[0].file;
        const audioEl = new window.Audio(mp3);
        setAudio(audioEl);
        audioEl.play();
        return;
      }

      alert('No se encontró sonido para esta especie');
    } catch (err) {
      console.error('Error fetching sound:', err);
      alert('Error al buscar el sonido');
    }
  };

  useEffect(() => {
    if (!bird.image) return;
    const img = new Image();
    img.src = bird.image;
    img.onload = () => {
      setIsWide(img.width > img.height);
    };
  }, [bird.image]);

  return (
    <>
      <div className={`card card-common${checked ? ' marked' : ''}`} data-code={bird.code}>
        {bird.image ? (
          <div className="card-img" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={bird.image}
              alt={bird.comName}
              style={{
                maxWidth: '100%',
                maxHeight: '180px',
                height: isWide === false ? 'auto' : '180px',
                width: isWide === false ? 'auto' : '100%',
                objectFit: isWide === false ? 'contain' : 'cover',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                display: 'block',
              }}
            />
            <button className="image-zoom-btn"
              onClick={e => { e.stopPropagation(); setShowModal(true); }}
              title="Ver imagen grande"
            >
              <SearchIcon />
            </button>
          </div>
        ) : (
          <div className="card-img" style={{ background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="card-subtitle">Sin imagen</span>
          </div>
        )}
        <div className="card-content">
          <div className="card-title">{bird.comName}</div>
          <div className="card-subtitle">{bird.sciName}</div>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
             <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              title="Buscar sonido del ave"
              onClick={e => { e.stopPropagation(); playSound(); }}
            >
              <VolumeUpIcon style={{ color: 'var(--primary)', fontSize: 28 }} />
            </button>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              title="Información del ave"
              onClick={e => { e.stopPropagation(); onInfo(); }}
            >
              <InfoIcon style={{ color: '#FFC107', fontSize: 28 }} />
            </button>
            {!readOnly && (
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                title={checked ? "Desmarcar como vista" : "Marcar como vista"}
                onClick={e => { e.stopPropagation(); onClick(); }}
              >
                <CheckCircleIcon style={{ color: checked ? '#4CAF50' : '#bbb', fontSize: 28 }} />
              </button>
            )}
          </div>
          {audio && (
            <audio
              controls
              style={{ marginTop: 4, width: '100%' }}
              src={audio.src}
              onPlay={e => audio.play()}
              onPause={e => audio.pause()}
            />
          )}
        </div>
      </div>
      <BirdImageModal
        image={showModal ? bird.image || null : null}
        alt={bird.comName}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default BirdCard;