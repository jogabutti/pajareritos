import React, { useEffect, useState } from 'react';
import './Home.css';
import { Layout } from '../../public/Layout';
import BirdList from '../../component/BirdList';
import RegionSelector from '../../component/RegionSelector';
import { getMethod } from '../../config/httpService';

const EBIRD_API_KEY = process.env.REACT_APP_EBIRD_API_KEY || '';


export const Home = () => {
  const [regionCode, setRegionCode] = useState('US'); // Código de país por defecto

console.log(regionCode)
  
    useEffect(() => {
      const fetchRegion = async () => {
        const url = `https://api.ebird.org/v2/find?key=${EBIRD_API_KEY}&hotSpotClass=BIRDING_HOTSPOT&q=${regionCode}`;
        const codes = await getMethod<string[]>(url);
        console.log(codes)  
      }
      fetchRegion()
    }, []);
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