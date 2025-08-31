import React, { ReactNode } from 'react';
import Grid from '@mui/material/Grid';

interface LayoutProps {
  children: ReactNode[];
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <Grid
    container
    direction="row"
    justifyContent="center"
    alignItems="flex-start"
    style={{
      width: '60vw',
      height: '100vh',
      overflowY: 'auto', // Habilita el scroll vertical
      background: '#fafafa',
    }}
  >
    <Grid size = {{xs:12}} style={{ height: '20%', alignContent: 'center', backgroundColor: '#1976d2', color: 'white', textAlign: 'center' }}>
      {children[0]}
    </Grid>
    <Grid size = {{xs:12}} style={{ height: '80%', alignContent: 'center', backgroundColor: '#baebb1ff', color: 'white', textAlign: 'center', overflowY: 'auto' }}>
      {children[1]}
    </Grid>
  </Grid>
);