import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { getBirdInfo, getArgentinianBirdInfo } from '../mapper/birdMapper';
import { Layout } from '../shared/Layout';
import BirdCard from './BirdCard';
import { getBirdImageWikipediaCached } from '../utils/wikipediaUtils';
import { useLocation } from 'react-router-dom';
import { useBirdLists } from '../hook/useBirdLists';

export interface BirdInfo {
  code: string;
  comName: string;
  sciName: string;
  image?: string | null;
}


const BirdsMarked: React.FC = () => {
  const { getList } = useBirdLists();
  const { toggleBird } = useBirdLists();
  const [birds, setBirds] = useState<BirdInfo[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const listId = location.state?.listId;
  const list = listId ? getList(listId) : null;
  const regionCode = location.state?.regionCode;

 useEffect(() => {
  if (!list) return;

  const fetchMarkedBirds = async () => {
    const codes = Array.isArray(list.birds) ? list.birds : (list.birds ? Object.keys(list.birds) : []);

    const birdInfos: BirdInfo[] = await Promise.all(
      codes.map(async (code: string) => {
        const info = getBirdInfo(code);

        let comName = code;
        let sciName = '';
        let image = null;

        if (info) {
          sciName = info.sciName;
          const argInfo = getArgentinianBirdInfo(info.sciName);
          comName = argInfo ? argInfo.esName : info.comName;
          image = await getBirdImageWikipediaCached(sciName);
        }

        return { code, comName, sciName, image };
      })
    );

    setBirds(birdInfos);
  };

  fetchMarkedBirds();
}, [list]);


  const handleCheck = (code: string) => {
    if (!listId) return;
    toggleBird(listId, code);
  };

const handleVolver = () => {
    if (listId) {
      navigate('/listas');
    } else {
      navigate('/region');
    }
  };
  return (
    <Layout>
      <div className="birdlist-root">
        <h2 style={{ textAlign: 'center', margin: '32px 0', color: 'var(--secondary)', fontFamily: '"Baloo 2", sans-serif', fontWeight: 700 }}>
          Aves Marcadas
        </h2>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="flex-start"
          sx={{ width: '100%', maxWidth: 1300 }}
        >
          {birds.length === 0 ? (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <span
                style={{
                  fontFamily: 'Nunito Sans',
                  fontSize: '1.1rem',
                  color: '#666'
                }}
              >
                No has marcado ninguna ave.
              </span>
            </div>
          ) : (
            birds.map((bird) => (
              <Grid size={{ xs:12, sm:6, md:4, lg:3 }} key={bird.code}>
                <BirdCard
                  bird={bird}
                  checked={true}
                  onClick={() => handleCheck(bird.code)}
                  onInfo={() => {}}
                />
              </Grid>
            ))
          )}
        </Grid>

        <button
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#1AB6D9',
            color: 'white',
            border: 'none',
            borderRadius: 0,
            padding: '16px 0',
            fontSize: '1.1rem',
            cursor: 'pointer',
            zIndex: 1000,
            width: '100%'
          }}
          onClick={handleVolver}
        >
          ← Volver
        </button>
      </div>
    </Layout>
  );
};

export default BirdsMarked;
