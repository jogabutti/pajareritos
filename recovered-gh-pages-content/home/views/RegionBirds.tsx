import React, { useState, useEffect } from 'react';
import { Layout } from '../../shared/Layout';
import RegionSelector from '../../component/RegionSelector';
import BirdList from '../../component/BirdList';
import { useLocation } from 'react-router-dom';

const RegionBirds: React.FC = () => {
  const location = useLocation();
  const [regionCode, setRegionCode] = useState<string>(() => {
    const r = location.state?.regionCode;
    return r && typeof r === 'object' ? r.codigo || '' : (r || '');
  });
  const [selected, setSelected] = useState<boolean>(false);

 useEffect(() => {
  if (location.state?.regionCode) {
    const r = location.state.regionCode;
    setRegionCode(typeof r === 'object' ? r.codigo || '' : r);
    setSelected(true); 
  }
}, [location.state]);

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
        <h2 style={{ color: 'var(--secondary)', fontFamily: '"Baloo 2", sans-serif', fontWeight: 700 }}>
          ¿En qué región vas a avistar aves?
        </h2>
        <RegionSelector onSelect={code => { setRegionCode(code); setSelected(true); }} />
        {selected && regionCode && (
          <div style={{ width: '100%', marginTop: 32 }}>
            <BirdList regionCode={regionCode} listId={location.state?.listId} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RegionBirds;
