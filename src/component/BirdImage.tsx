import React from 'react';
import Grid from '@mui/material/Grid';      
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


interface BirdInfo {
  code: string;
  title: string;
  extract: string;
  image?: string | null;
}


const BirdImage: React.FC<{
  bird: BirdInfo;
  checked: boolean;
  onClick: () => void;
}> = ({ bird, checked, onClick }) => (
  <Grid size={{xs:12, sm:6, md:4, lg:3}} >
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
            alt={bird.title}
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
            {bird.title}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {bird.extract}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);


export default BirdImage;