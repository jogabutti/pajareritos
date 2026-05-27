import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Layout } from "../../shared/Layout";
import { useBirdLists } from "../../hook/useBirdLists";

const Listas: React.FC = () => {
  const navigate = useNavigate();
  const { lists, deleteList } = useBirdLists();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: '',
    name: ''
  });

  /* useEffect(() => {
    const saved = localStorage.getItem("birdLists");
    if (saved) {
      setLists(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = lists.filter(list => list.id !== id);
    setLists(updated);
    localStorage.setItem("birdLists", JSON.stringify(updated));
  };
 */
  const displayRegion = (r: any) => {
    if (!r) return '';
    if (typeof r === 'string') return r;
    if (typeof r === 'object') return r.nombre || r.codigo || JSON.stringify(r);
    return String(r);
  };

  const handleOpen = (list: any) => {
    const regionCode = list && typeof list.regionCode === 'object' ? (list.regionCode?.codigo || '') : list.regionCode;
    navigate('/aves-marcadas', { state: { listId: list.id, regionCode } });
  };

  const handleCreate = () => {
    navigate("/nueva-lista");
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteDialog({ open: true, id, name });
  };

  const handleConfirmDelete = () => {
    deleteList(deleteDialog.id);
    setDeleteDialog({ open: false, id: '', name: '' });
  };

  console.log(lists)
  return (
    <Layout>
      <div style={{ padding: "32px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Mis Listas
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {lists.length === 0 ? (
  <Typography>No tienes listas creadas.</Typography>
    ) : (
      lists.map((list) => (
        <Grid size={{ xs:12, sm:6, md:4, lg:3 }} key={list.id}>
          <Card 
            className="card-common" 
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(27, 139, 126, 0.05) 0%, rgba(0, 78, 137, 0.05) 100%)',
              position: 'relative',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(27, 139, 126, 0.2)',
                transform: 'translateY(-4px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'rgba(211, 47, 47, 0.8)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(211, 47, 47, 1)',
                },
                zIndex: 10
              }}
              onClick={() => handleDeleteClick(list.id, list.name || list.regionName || 'Sin nombre')}
            >
              <CloseIcon />
            </IconButton>
            <CardContent>
              <Typography 
                variant="h6"
                sx={{
                  fontFamily: '"Baloo 2", sans-serif',
                  fontWeight: 700,
                  color: 'var(--secondary)',
                  marginBottom: 1
                }}
              >
                {list.name || list.regionName || "Lista sin nombre"}
              </Typography>

              <Typography 
                variant="body2"
                sx={{ color: 'var(--primary)', fontWeight: 600, marginBottom: 0.5 }}
              >
                📍 {list.regionName || displayRegion(list.regionCode)}
              </Typography>

              <Typography 
                variant="body2"
                sx={{ color: 'var(--positive)', fontWeight: 600, marginBottom: 0.5 }}
              >
                🦅 {Array.isArray(list.birds) ? list.birds.length : (list.birds && typeof list.birds === 'object' ? Object.keys(list.birds).length : 0)} aves marcadas
              </Typography>

              <Typography 
                variant="caption" 
                sx={{ color: '#999', fontSize: '0.8rem' }}
              >
                📅 {list.fecha} {list.hora}
              </Typography>

              <div style={{ marginTop: 16 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background: 'linear-gradient(90deg, var(--primary) 0%, #2DA69A 100%)',
                    color: 'white',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #16755E 0%, #269B90 100%)',
                      boxShadow: '0 4px 12px rgba(27, 139, 126, 0.3)'
                    }
                  }}
                  onClick={() => handleOpen(list)}
                >
                  Ver lista
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))
    )}

        </Grid>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(90deg, var(--primary) 0%, #2DA69A 100%)',
              color: 'white',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(90deg, #16755E 0%, #269B90 100%)',
                boxShadow: '0 4px 12px rgba(27, 139, 126, 0.3)'
              }
            }}
            onClick={handleCreate}
          >
            + Nueva Lista
          </Button>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: '', name: '' })}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            background: 'white'
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Baloo 2", sans-serif', fontWeight: 700, color: 'var(--secondary)', fontSize: '1.3rem' }}>
          ⚠️ Eliminar lista
        </DialogTitle>
        <DialogContent sx={{ minWidth: 320 }}>
          <Typography sx={{ color: 'var(--secondary)', marginBottom: 2, marginTop: 1 }}>
            ¿Estás seguro de que deseas eliminar la lista <strong>"{deleteDialog.name}"</strong>?
          </Typography>
          <Typography sx={{ color: '#d32f2f', fontWeight: 700, fontSize: '0.9rem' }}>
            ⚠️ Esta eliminación es permanente y no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: '', name: '' })}
            sx={{
              color: 'var(--secondary)',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                background: '#f5f5f5'
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              background: '#d32f2f',
              color: 'white',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                background: '#b71c1c'
              }
            }}
          >
            Sí, eliminar para siempre
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Listas;
