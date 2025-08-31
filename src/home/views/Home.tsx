import React, { useState } from 'react';
import './Home.css';
import { Layout } from '../../public/Layout';
import BirdList from '../../component/BirdList';
import RegionSelector from '../../component/RegionSelector';

export const Home = () => {
  const [regionCode, setRegionCode] = useState('US'); // Código de país por defecto

  return (
    <Layout>
      <h1>Pajareritos</h1>
      <nav>
        <RegionSelector onSelect={setRegionCode} />
        <BirdList /* regionCode={regionCode} */ />
      </nav>
    </Layout>
  );
}