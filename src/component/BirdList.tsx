import React, { useEffect, useState } from 'react';
import { loadTaxonomy, getBirdInfo, getBirdImage } from '../mapper/birdMapper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getMethod } from '../config/httpService';

const REGION_CODE = 'L2761828';

interface BirdInfo {
  code: string;
  comName: string;
  sciName: string;
  image?: string | null;
}

const BirdImage: React.FC<{
  bird: BirdInfo;
  checked: boolean;
  onClick: () => void;
}> = ({ bird, checked, onClick }) => (
  <Grid size={{xs:12, sm:6, md:4, lg:3}}>
    <Card
      elevation={checked ? 8 : 3}
      sx={{
        borderRadius: 4,
        boxShadow: checked
          ? '0 4px 20px rgba(33,150,243,0.3)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        border: checked ? '2px solid #2196f3' : 'none',
        position: 'relative',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, border 0.2s',
      }}
    >
      <CardActionArea onClick={onClick}>
        {checked && (
          <CheckCircleIcon
            color="primary"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontSize: 32,
              zIndex: 2,
              background: 'white',
              borderRadius: '50%',
            }}
          />
        )}
        {bird.image ? (
          <img
            src={bird.image}
            alt={bird.comName}
            style={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: 200,
              background: '#eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Sin imagen
            </Typography>
          </div>
        )}
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {bird.comName}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {bird.sciName}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);

const BirdList: React.FC = () => {
  const [birds, setBirds] = useState<BirdInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [checkedBirds, setCheckedBirds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchBirds = async () => {
      await loadTaxonomy();
      const url = `https://api.ebird.org/v2/product/spplist/${REGION_CODE}`;
      const codes = await getMethod<string[]>(url);
      if (codes) {
        const birdInfos: BirdInfo[] = await Promise.all(
          codes.map(async code => {
            const info = getBirdInfo(code);
            const image = info ? await getBirdImage(info.sciName) : null;
            return {
              code,
              comName: info?.comName || code,
              sciName: info?.sciName || '',
              image,
            };
          })
        );
        setBirds(birdInfos);
      } else {
        setError('No se pudo obtener la lista de aves');
      }
    };
    fetchBirds();
  }, []);

  const handleCheck = (code: string) => {
    setCheckedBirds(prev => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  return (
    <div>
      <h2>Lista de aves</h2>
      {error && <p>{error}</p>}
      <Grid container spacing={2}>
        {birds.map((bird) => (
          <BirdImage
            key={bird.code}
            bird={bird}
            checked={!!checkedBirds[bird.code]}
            onClick={() => handleCheck(bird.code)}
          />
        ))}
      </Grid>
    </div>
  );
};

export default BirdList;