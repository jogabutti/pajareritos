import { useEffect, useState } from 'react';
import { Layout } from '../../shared/Layout';
import BirdList from '../../component/BirdList';
import RegionSelector from '../../component/RegionSelector';
import { useBirdLists } from '../../hook/useBirdLists';
import { useLocation } from 'react-router-dom';
import './Home.css';

interface Props {
  listId: string;
}

export const Home: React.FC<Props> = ({ listId }) => {
  const location = useLocation();
  const { updateList } = useBirdLists();
  const [regionCode, setRegionCode] =  useState(location.state?.regionCode || '');
  const [selected, setSelected] = useState<boolean>(false);
  
  const handleRegionSelect = (code: any) => {
    // normalize: RegionSelector may pass object or code
    const value = typeof code === 'object' ? code.codigo || code.nombre || '' : code;
    setRegionCode(value);
    setSelected(true)
    if (listId) {
      updateList(listId, {
        regionCode: value
      });
    }
  };

   useEffect(() => {
      if (location.state?.regionCode) {
        setRegionCode(location.state.regionCode);
      }
    }, [location.state, regionCode]);
  
  return (
   <Layout>
      <div className="home-header-row">
          <span style={{ fontFamily: 'Baloo 2, sans-serif', fontWeight: 'bold', color: '#fff', background: '#1AB6D9', borderRadius: 16, padding: '12px 32px', letterSpacing: 1 }}>{"¡Vamos a buscar aves!"}</span>
        </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
        <h2>¿En qué región vas a avistar aves?</h2>
        <RegionSelector onSelect={handleRegionSelect} />
          {selected && regionCode && (
            <div style={{ width: '100%', marginTop: 32 }}>
            <BirdList regionCode={regionCode} listId={listId} />
          </div>
        )}
      </div>
    </Layout>
  );
};
