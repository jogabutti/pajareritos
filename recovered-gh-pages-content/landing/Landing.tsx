import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import EggIcon from '@mui/icons-material/Egg';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Layout } from '../shared/Layout';

const Landing = () => {
  const navigate = useNavigate();

  const items = [
    { title: 'Nueva lista de aves', path: '/nueva-lista', icon: EggIcon, emoji: '🐣' },
    { title: 'Ver listas anteriores', path: '/listas', icon: LibraryBooksIcon, emoji: '📚' },
    { title: 'Aves por región', path: '/region', icon: LocationOnIcon, emoji: '🗺️' }
  ];

  return (
    <Layout>
      <Box sx={{ padding: 4 }} className="center">
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            color: 'var(--secondary)',
            fontFamily: '"Baloo 2", sans-serif',
            fontWeight: 700,
            marginBottom: 3,
            textAlign: 'center'
          }}
        >
          Explorá, registrá y jugá con aves de Argentina
        </Typography>

        <Grid container spacing={4} sx={{ marginTop: 1, maxWidth: 1000, margin: '0 auto' }}>
          {items.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.title}>
              <Card 
                className="card-common landing-card"
                sx={{
                  cursor: 'pointer',
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  background: 'linear-gradient(135deg, rgba(27, 139, 126, 0.05) 0%, rgba(0, 78, 137, 0.05) 100%)',
                  border: '2px solid transparent',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 12px 32px rgba(27, 139, 126, 0.25)',
                    borderColor: 'var(--primary)',
                    background: 'linear-gradient(135deg, rgba(27, 139, 126, 0.1) 0%, rgba(0, 78, 137, 0.1) 100%)',
                  }
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontSize: '3.5rem', marginBottom: 2 }}>
                    {item.emoji}
                  </Box>
                  <Typography 
                    variant="h6"
                    sx={{
                      fontFamily: '"Baloo 2", sans-serif',
                      fontWeight: 700,
                      color: 'var(--secondary)',
                      fontSize: '1.1rem'
                    }}
                  >
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default Landing;