import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { getRegions } from '../config/regionService';


interface Region {
  code: string;
  name: string;
}

interface Props {
  onSelect: (code: string) => void;
}

const RegionSelector: React.FC<Props> = ({ onSelect }) => {
  const [regions, setRegions] = useState<Region[]>([]);

  /* useEffect(() => {
    getRegions('country').then(setRegions);
    // Puedes cambiar 'country' por 'subnational1' para provincias/departamentos
  }, []); */


  return (
    <Autocomplete
      disablePortal
      options={regions}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField {...params} label="Selecciona una región" variant="outlined" />
      )}
      sx={{ width: 300, marginBottom: 2 }}
    />
  );
};

export default RegionSelector;