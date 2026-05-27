import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './BirdList.css';
import './BirdList.extra.css';
import { loadTaxonomy, getBirdInfo, getArgentinianBirdInfo } from '../mapper/birdMapper';
import Grid from '@mui/material/Grid';
import { getMethod } from '../config/httpService';
import BirdCard from './BirdCard';
import BirdInfoModal from './BirdInfoModal';
import { getBirdImageWikipediaCached } from '../utils/wikipediaUtils';
import { useBirdLists } from '../hook/useBirdLists';

export interface BirdInfo {
  code: string;
  comName: string;
  sciName: string;
  image?: string | null;
}

interface BirdListProps {
  regionCode?: string;
  listId?: string;
}

const BirdList: React.FC<BirdListProps> = ({ regionCode, listId }) => {
  const [birds, setBirds] = useState<BirdInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [infoBird, setInfoBird] = useState<BirdInfo | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { getList, toggleBird } = useBirdLists();
  const list = listId ? getList(listId) : null;
  const checkedBirds = list?.birds || [];

  const foundCount = checkedBirds.length;
  console.log("BirdList render - regionCode:", regionCode);

  // 🔥 Fetch aves cuando cambia la región
  useEffect(() => {
    console.log("useEffect ejecutado con:", regionCode);

    if (!regionCode) {
      setLoading(false);
      return;
    }

    setBirds([]);
    setError(null);
    setLoading(true);

    const fetchBirds = async () => {
      try {
        await loadTaxonomy();

        const url = `https://api.ebird.org/v2/product/spplist/${regionCode}`;
        const codes = await getMethod<string[]>(url);

        if (codes && Array.isArray(codes)) {
          const birdInfos: BirdInfo[] = await Promise.all(
            codes.map(async code => {
              const info = getBirdInfo(code);

              let comName = code;
              let sciName = '';
              let image = null;

              if (info) {
                sciName = info.sciName;
                const argInfo = getArgentinianBirdInfo(info.sciName);
                comName = argInfo?.esName || info.comName;
                image = await getBirdImageWikipediaCached(
                  sciName || comName
                );
              }

              return { code, comName, sciName, image };
            })
          );

          setBirds(birdInfos);
        } else {
          setError('No se pudo obtener la lista de aves');
        }
      } catch (err) {
        setError('Error cargando aves');
      } finally {
      setLoading(false);
      }
    };

  fetchBirds();
  }, [regionCode, listId]);

  // 🔥 Toggle ave dentro de la lista activa
  const handleCheck = (code: string) => {
    if (listId) {
      toggleBird(listId, code);
    }
  };

  // 🔎 Buscar ave
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search.trim()) return;

    const idx = birds.findIndex(b =>
      b.comName.toLowerCase().includes(search.trim().toLowerCase()) ||
      b.sciName.toLowerCase().includes(search.trim().toLowerCase())
    );

    if (idx === -1) {
      setError('Ave no encontrada');
      return;
    }

    const code = birds[idx].code;
    const el = document.querySelector(`[data-code="${code}"]`) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('found');
      setTimeout(() => el.classList.remove('found'), 1200);
    }
  };

  if (listId && !list) {
    return <div>Lista no encontrada</div>;
  }

  return (
    <div className="birdlist-root">

      {/* 🔢 Contador - solo mostrar si hay listId */}
      {listId && (
      <div
        className="bird-counter bird-counter-bottom"
        style={{ cursor: 'pointer' }}
        onClick={() =>
          navigate('/aves-marcadas', {
            state: { 
            listId,
            regionCode
          }
          })
        }
      >
        <img
          src={process.env.PUBLIC_URL + '/paloma.png'}
          alt="Paloma"
          className="bird-counter-icon"
        />
        <span className="bird-counter-number">
          {foundCount}
        </span>
      </div>
      )}

      {error && <p>{error}</p>}

      {loading ? (
        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <span style={{
            fontFamily: 'Nunito Sans',
            fontSize: '1.1rem',
            color: '#666'
          }}>
            Cargando aves...
          </span>
        </div>
      ) : (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="flex-start"
          sx={{ width: '100%', maxWidth: 1300 }}
        >
          {birds.map((bird) => (
            <Grid size={{ xs:12, sm:6, md:4, lg:3 }}
              key={bird.code}
            >
              <BirdCard
                bird={bird}
                checked={checkedBirds.includes(bird.code)}
                onClick={() => handleCheck(bird.code)}
                onInfo={() => setInfoBird(bird)}
                readOnly={!listId}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* 🔎 Buscador - solo mostrar si hay listId */}
      {listId && (
      <form
        onSubmit={handleSearch}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.95)',
          padding: '12px 0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.10)'
        }}
      >
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar ave por nombre..."
          style={{
            width: 260,
            fontSize: '1.1rem',
            padding: '8px 16px',
            borderRadius: 24,
            border: '1px solid #ccc',
            outline: 'none',
            marginRight: 8
          }}
        />
        <button
          type="submit"
          style={{
            background: '#1AB6D9',
            color: 'white',
            border: 'none',
            borderRadius: 24,
            padding: '8px 20px',
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
        >
          Buscar
        </button>
      </form>
      )}

      <BirdInfoModal
        bird={infoBird}
        onClose={() => setInfoBird(null)}
      />
    </div>
  );
};

export default BirdList;
