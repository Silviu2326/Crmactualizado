import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { reporteService, type Reporte } from '../services/reporteService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const categorias = ['Bug', 'Request', 'UI', 'Performance'];
const estados = ['Abierto', 'En Progreso', 'Resuelto', 'Cerrado'];
const departamentos = ['TI', 'Servicio al Cliente', 'Desarrollo', 'Ventas', 'Marketing'];
const secciones = [
  'Dashboard',
  'Clientes',
  'Rutinas',
  'Dietas',
  'Clases',
  'Economía',
  'Marketing/Campañas',
  'Marketing/Análisis',
  'Contenido',
  'Publicaciones',
  'Perfil',
  'Ajustes',
  'Servicios',
  'Reportes'
];

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'Abierto':
      return '#ff9800';
    case 'En Progreso':
      return '#2196f3';
    case 'Resuelto':
      return '#4caf50';
    case 'Cerrado':
      return '#9e9e9e';
    default:
      return '#e0e0e0';
  }
};

const Reportesweb = () => {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nuevoReporte, setNuevoReporte] = useState<Partial<Reporte>>({
    resumenFeedback: '',
    categoria: '',
    seccion: '',
    estado: 'Abierto',
    departamentoAsignado: '',
    resumenResolucion: '',
    usuarioNotificado: false,
  });

  const cargarReportes = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await reporteService.getReportes();
      setReportes(data);
    } catch (err) {
      setError('Error al cargar los reportes. Por favor, intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  const abrirDialogo = () => {
    setDialogoAbierto(true);
  };

  const cerrarDialogo = () => {
    setDialogoAbierto(false);
    setNuevoReporte({
      resumenFeedback: '',
      categoria: '',
      seccion: '',
      estado: 'Abierto',
      departamentoAsignado: '',
      resumenResolucion: '',
      usuarioNotificado: false,
    });
  };

  const manejarEnvio = async () => {
    try {
      if (!nuevoReporte.resumenFeedback || !nuevoReporte.categoria || !nuevoReporte.seccion || !nuevoReporte.departamentoAsignado) {
        setError('Por favor, complete todos los campos requeridos');
        return;
      }

      const reporteParaEnviar = {
        resumenFeedback: nuevoReporte.resumenFeedback,
        categoria: nuevoReporte.categoria,
        seccion: nuevoReporte.seccion,
        estado: 'Abierto',
        departamentoAsignado: nuevoReporte.departamentoAsignado,
        resumenResolucion: nuevoReporte.resumenResolucion || 'Pendiente de revisión',
        usuarioNotificado: false
      };

      await reporteService.crearReporte(reporteParaEnviar);
      await cargarReportes();
      cerrarDialogo();
    } catch (err: any) {
      setError(err.message || 'Error al crear el reporte');
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Abierto':
        return <ErrorIcon />;
      case 'En Progreso':
        return <ScheduleIcon />;
      case 'Resuelto':
        return <CheckCircleIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Gestión de Reportes
        </Typography>
        <Box>
          <Tooltip title="Actualizar reportes">
            <IconButton onClick={cargarReportes} sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={abrirDialogo}
            sx={{
              backgroundColor: '#1a237e',
              '&:hover': {
                backgroundColor: '#0d47a1',
              },
            }}
          >
            Nuevo Reporte
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Fade in={!cargando}>
        <Card elevation={3}>
          <CardContent>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Ticket</TableCell>
                    <TableCell>Resumen</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Sección</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Departamento</TableCell>
                    <TableCell>Fecha Recibido</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportes.map((reporte) => (
                    <TableRow key={reporte._id} hover>
                      <TableCell>{reporte.idTicket}</TableCell>
                      <TableCell>{reporte.resumenFeedback}</TableCell>
                      <TableCell>
                        <Chip
                          label={reporte.categoria}
                          size="small"
                          sx={{ backgroundColor: '#e3f2fd' }}
                        />
                      </TableCell>
                      <TableCell>{reporte.seccion}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getEstadoIcon(reporte.estado)}
                          label={reporte.estado}
                          size="small"
                          sx={{
                            backgroundColor: getEstadoColor(reporte.estado),
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>{reporte.departamentoAsignado}</TableCell>
                      <TableCell>
                        {format(new Date(reporte.fechaRecibido), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Editar reporte">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Fade>

      {cargando && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      <Dialog open={dialogoAbierto} onClose={cerrarDialogo} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1a237e', color: 'white' }}>
          Crear Nuevo Reporte
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resumen del Feedback"
                value={nuevoReporte.resumenFeedback}
                onChange={(e) =>
                  setNuevoReporte({ ...nuevoReporte, resumenFeedback: e.target.value })
                }
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Categoría"
                value={nuevoReporte.categoria}
                onChange={(e) => setNuevoReporte({ ...nuevoReporte, categoria: e.target.value })}
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Sección"
                value={nuevoReporte.seccion}
                onChange={(e) => setNuevoReporte({ ...nuevoReporte, seccion: e.target.value })}
              >
                {secciones.map((sec) => (
                  <MenuItem key={sec} value={sec}>
                    {sec}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Departamento Asignado"
                value={nuevoReporte.departamentoAsignado}
                onChange={(e) =>
                  setNuevoReporte({ ...nuevoReporte, departamentoAsignado: e.target.value })
                }
              >
                {departamentos.map((dep) => (
                  <MenuItem key={dep} value={dep}>
                    {dep}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resumen de Resolución"
                value={nuevoReporte.resumenResolucion}
                onChange={(e) =>
                  setNuevoReporte({ ...nuevoReporte, resumenResolucion: e.target.value })
                }
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={cerrarDialogo} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={manejarEnvio}
            variant="contained"
            sx={{
              backgroundColor: '#1a237e',
              '&:hover': {
                backgroundColor: '#0d47a1',
              },
            }}
          >
            Crear Reporte
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reportesweb;
