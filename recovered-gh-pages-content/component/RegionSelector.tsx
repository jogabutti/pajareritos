import React, { useState, useEffect } from 'react';
import Autocomplete, { AutocompleteChangeReason } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

interface Region {
  codigo: string;
  nombre: string;
  tipo?: string;
  lat?: string;
  lon?: string;
  pais?: string;
  admin?: string;
}

interface Props {
  onSelect: (code: string) => void;
}

const RegionSelector: React.FC<Props> = ({ onSelect }) => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [options, setOptions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/localidad-find'
      : 'https://pajareritos-backend.vercel.app/api/localidad-find';

  // 🔥 Debounce (espera 400ms antes de buscar)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 400);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  // 🔎 Fetch cuando cambia el valor debounced
  useEffect(() => {
    let active = true;

    if (debouncedValue.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);

    fetch(`${API_URL}?q=${encodeURIComponent(debouncedValue)}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setOptions(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (active) setOptions([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedValue, API_URL]);

  
  return (
    <>
      <Autocomplete
        options={options}
        filterOptions={(x) => x} // 🔥 evita doble filtrado
        getOptionLabel={(option) =>
          option.nombre +
          (option.admin ? ', ' + option.admin : '') +
          (option.pais ? ' - ' + option.pais : '')
        }
        loading={loading}
        inputValue={inputValue}
        onInputChange={(_, value) => setInputValue(value)}
        onChange={(_, value) => {
        if (value) {
          const region = value as Region;
          onSelect(region.codigo); 
          //MANDAR A DEMAS DEL CODIGO EL NOMBRE TOODO
        }
      }}

        noOptionsText={
          inputValue.length < 3
            ? 'Escribí al menos 3 letras'
            : loading
            ? 'Buscando...'
            : 'No se encontraron localidades'
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar localidad"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        sx={{ width: '45vw', marginBottom: 2 }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '100%',
          gap: 32,
          marginBottom: 24
        }}
      >
        <div className="birdlist-subtitle" style={{ flex: 1 }}>
          Lista de aves de {inputValue}
        </div>
      </div>
    </>
  );
};

export default RegionSelector;
