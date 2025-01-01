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
  Celebration as CelebrationIcon,
  AcUnit as AcUnitIcon,
} from '@mui/icons-material';
import { reporteService, type Reporte } from '../services/reporteService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [showSnow, setShowSnow] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editandoReporte, setEditandoReporte] = useState<string | null>(null);
  const [nuevoReporte, setNuevoReporte] = useState<Partial<Reporte>>({
    resumenFeedback: '',
    categoria: '',
    seccion: '',
    estado: 'Abierto',
    departamentoAsignado: '',
    resumenResolucion: '',
    usuarioNotificado: false,
  });

  const christmasStyles = {
    container: {
      position: 'relative',
      minHeight: '100vh',
      background: isDarkMode
        ? 'linear-gradient(135deg, rgb(20, 30, 40) 0%, rgb(30, 50, 60) 100%)'
        : 'linear-gradient(135deg, #ffe4e4 0%, #e4ffe4 100%)',
      p: 3,
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      color: isDarkMode ? '#ffffff' : '#1a237e',
      '& .MuiSvgIcon-root': {
        animation: 'bounce 2s infinite',
      },
    },
    card: {
      background: isDarkMode
        ? 'rgba(31, 41, 55, 0.9)'
        : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
    },
    snowflake: {
      position: 'absolute',
      color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.7)',
      animation: 'fall linear infinite',
      pointerEvents: 'none',
    },
  };

  const snowflakes = showSnow ? Array.from({ length: 30 }).map((_, i) => ({
    style: {
      left: `${Math.random() * 100}%`,
      top: `-20px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
    }
  })) : [];

  useEffect(() => {
    const styles = `
      @keyframes fall {
        0% {
          transform: translateY(-10vh) rotate(0deg);
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
        }
      }
      
      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

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

  const abrirDialogoEdicion = (reporte: Reporte) => {
    setEditandoReporte(reporte._id);
    setNuevoReporte({
      resumenFeedback: reporte.resumenFeedback,
      categoria: reporte.categoria,
      seccion: reporte.seccion,
      estado: reporte.estado,
      departamentoAsignado: reporte.departamentoAsignado,
      resumenResolucion: reporte.resumenResolucion,
      usuarioNotificado: reporte.usuarioNotificado,
    });
    setDialogoAbierto(true);
  };

  const manejarEnvio = async () => {
    try {
      if (!nuevoReporte.resumenFeedback || !nuevoReporte.categoria || !nuevoReporte.seccion || !nuevoReporte.departamentoAsignado) {
        setError('Por favor, complete todos los campos requeridos');
        return;
      }

      if (editandoReporte) {
        // Actualizar reporte existente
        await reporteService.actualizarReporte(editandoReporte, nuevoReporte);
      } else {
        // Crear nuevo reporte
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
      }

      await cargarReportes();
      cerrarDialogo();
    } catch (err: any) {
      setError(err.message || 'Error al procesar el reporte');
    }
  };

  const cerrarDialogo = () => {
    setDialogoAbierto(false);
    setEditandoReporte(null);
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

  const abrirDialogo = () => {
    setDialogoAbierto(true);
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
    <Box sx={christmasStyles.container}>
      {showSnow && snowflakes.map((snowflake, i) => (
        <AcUnitIcon
          key={i}
          sx={{
            ...christmasStyles.snowflake,
            ...snowflake.style,
            fontSize: Math.random() * 10 + 15,
          }}
        />
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={christmasStyles.title}>
          <CelebrationIcon sx={{ color: isDarkMode ? '#ff4081' : '#e91e63' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Gestión de Reportes
          </Typography>
          <CelebrationIcon sx={{ color: isDarkMode ? '#4caf50' : '#2e7d32' }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Activar/Desactivar nieve">
            <IconButton 
              onClick={() => setShowSnow(!showSnow)}
              sx={{
                color: isDarkMode ? '#4caf50' : '#2e7d32',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                },
              }}
            >
              <AcUnitIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Actualizar reportes">
            <IconButton 
              onClick={cargarReportes}
              sx={{
                color: isDarkMode ? '#ff4081' : '#e91e63',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 64, 129, 0.1)' : 'rgba(233, 30, 99, 0.1)',
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={abrirDialogo}
            sx={{
              background: 'linear-gradient(45deg, #ff4081 30%, #4caf50 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #f50057 30%, #388e3c 90%)',
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
        <Card elevation={3} sx={christmasStyles.card}>
          <CardContent>
            <TableContainer component={Paper} sx={{
              backgroundColor: 'transparent',
              '& .MuiTableCell-root': {
                color: isDarkMode ? '#ffffff' : '#000000',
                borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              },
              '& .MuiTableHead-root .MuiTableCell-root': {
                background: isDarkMode
                  ? 'linear-gradient(45deg, rgba(255, 64, 129, 0.1), rgba(76, 175, 80, 0.1))'
                  : 'linear-gradient(45deg, rgba(233, 30, 99, 0.1), rgba(46, 125, 50, 0.1))',
                fontWeight: 'bold',
              },
              '& .MuiTableRow-root:hover': {
                backgroundColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
              },
            }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{
                      color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                      borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      fontWeight: 600,
                    }}>ID Ticket</TableCell>
                    <TableCell sx={{
                      color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                      borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      fontWeight: 600,
                    }}>Resumen</TableCell>
                    <TableCell sx={{
                      color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                      borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      fontWeight: 600,
                    }}>Categoría</TableCell>
                    <TableCell sx={{
                      color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                      borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      fontWeight: 600,
                    }}>Sección</TableCell>
                    <TableCell sx={{
                      color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                      borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      fontWeight: 600,
                    }}>Estado</TableCell>
                    <TableCell sx={{
                      color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                      borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      fontWeight: 600,
                    }}>Departamento</TableCell>
                    <TableCell sx={{
                      color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                      borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      fontWeight: 600,
                    }}>Fecha Recibido</TableCell>
                    <TableCell sx={{
                      color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                      borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      fontWeight: 600,
                    }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportes.map((reporte) => (
                    <TableRow 
                      key={reporte._id} 
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                        },
                      }}
                    >
                      <TableCell sx={{
                        color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                        borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      }}>{reporte.idTicket}</TableCell>
                      <TableCell sx={{
                        color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                        borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      }}>{reporte.resumenFeedback}</TableCell>
                      <TableCell sx={{
                        color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                        borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      }}>
                        <Chip
                          label={reporte.categoria}
                          size="small"
                          sx={{ backgroundColor: isDarkMode ? 'rgb(55, 65, 81)' : 'rgb(243, 244, 246)' }}
                        />
                      </TableCell>
                      <TableCell sx={{
                        color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                        borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      }}>{reporte.seccion}</TableCell>
                      <TableCell sx={{
                        color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                        borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      }}>
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
                      <TableCell sx={{
                        color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                        borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      }}>{reporte.departamentoAsignado}</TableCell>
                      <TableCell sx={{
                        color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                        borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      }}>
                        {format(new Date(reporte.fechaRecibido), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </TableCell>
                      <TableCell sx={{
                        color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(17, 24, 39)',
                        borderBottomColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(229, 231, 235)',
                      }}>
                        <Tooltip title="Editar reporte">
                          <IconButton size="small" onClick={() => abrirDialogoEdicion(reporte)}>
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

      <Dialog 
        open={dialogoAbierto} 
        onClose={cerrarDialogo}
        PaperProps={{
          style: {
            backgroundColor: isDarkMode ? 'rgb(31, 41, 55)' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            padding: '20px',
            minWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: isDarkMode ? '#ffffff' : '#000000',
          borderBottom: `1px solid ${isDarkMode ? 'rgb(55, 65, 81)' : '#e0e0e0'}`
        }}>
          {editandoReporte ? 'Editar Reporte' : 'Crear Nuevo Reporte'}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkMode ? 'rgb(55, 65, 81)' : 'white',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(156, 163, 175)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563eb',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: isDarkMode ? 'white' : 'rgb(17, 24, 39)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Categoría"
                value={nuevoReporte.categoria}
                onChange={(e) => setNuevoReporte({ ...nuevoReporte, categoria: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkMode ? 'rgb(55, 65, 81)' : 'white',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(156, 163, 175)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563eb',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
                  },
                  '& .MuiSelect-select': {
                    color: isDarkMode ? 'white' : 'rgb(17, 24, 39)',
                  },
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkMode ? 'rgb(55, 65, 81)' : 'white',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(156, 163, 175)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563eb',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
                  },
                  '& .MuiSelect-select': {
                    color: isDarkMode ? 'white' : 'rgb(17, 24, 39)',
                  },
                }}
              >
                {secciones.map((sec) => (
                  <MenuItem key={sec} value={sec}>
                    {sec}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {editandoReporte && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Estado"
                  value={nuevoReporte.estado}
                  onChange={(e) => setNuevoReporte({ ...nuevoReporte, estado: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDarkMode ? 'rgb(55, 65, 81)' : 'white',
                      '& fieldset': {
                        borderColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(156, 163, 175)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
                    },
                    '& .MuiSelect-select': {
                      color: isDarkMode ? 'white' : 'rgb(17, 24, 39)',
                    },
                  }}
                >
                  {estados.map((est) => (
                    <MenuItem key={est} value={est}>
                      {est}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Departamento Asignado"
                value={nuevoReporte.departamentoAsignado}
                onChange={(e) =>
                  setNuevoReporte({ ...nuevoReporte, departamentoAsignado: e.target.value })
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkMode ? 'rgb(55, 65, 81)' : 'white',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(156, 163, 175)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563eb',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
                  },
                  '& .MuiSelect-select': {
                    color: isDarkMode ? 'white' : 'rgb(17, 24, 39)',
                  },
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkMode ? 'rgb(55, 65, 81)' : 'white',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(156, 163, 175)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563eb',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: isDarkMode ? 'white' : 'rgb(17, 24, 39)',
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          p: 2,
          backgroundColor: isDarkMode ? 'rgb(31, 41, 55)' : '#ffffff',
        }}>
          <Button 
            onClick={cerrarDialogo} 
            sx={{
              color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(107, 114, 128, 0.1)' : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={manejarEnvio}
            variant="contained"
            sx={{
              backgroundColor: '#2563eb',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
            }}
          >
            {editandoReporte ? 'Guardar Cambios' : 'Crear Reporte'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reportesweb;
