import React, { useState, useRef } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ArrowUpDown,
  X,
  Upload,
  AlertCircle,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { CSVValidationModal } from './CSVValidationModal';

// Interfaces y datos iniciales
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: string;
  date: string;
  location: string;
}

const INITIAL_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana.garcia@email.com',
    phone: '+34 612 345 678',
    status: 'new',
    source: 'Formulario Web',
    date: '2024-03-15',
    location: 'Madrid',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+34 623 456 789',
    status: 'contacted',
    source: 'Instagram',
    date: '2024-03-14',
    location: 'Barcelona',
  },
  {
    id: '3',
    name: 'Laura Martínez',
    email: 'laura.martinez@email.com',
    phone: '+34 634 567 890',
    status: 'qualified',
    source: 'Referido',
    date: '2024-03-13',
    location: 'Valencia',
  },
];

interface CSVValidationError {
  row: number;
  errors: string[];
}

interface AddLeadModalProps {
  onClose: () => void;
  onAdd: (lead: Omit<Lead, 'id'>) => void;
}

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [pendingCsvData, setPendingCsvData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Lead | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'all'>(
    'all'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para manejar la ordenación
  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtrar y ordenar los leads
  const filteredLeads = leads
    .filter(
      (lead) =>
        (statusFilter === 'all' || lead.status === statusFilter) &&
        (lead.name.toLowerCase().includes(search.toLowerCase()) ||
          lead.email.toLowerCase().includes(search.toLowerCase()) ||
          lead.phone.includes(search))
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Obtener color basado en el estado
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener texto traducido del estado
  const getStatusText = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'Nuevo';
      case 'contacted':
        return 'Contactado';
      case 'qualified':
        return 'Cualificado';
      case 'lost':
        return 'Perdido';
      default:
        return status;
    }
  };

  // Validaciones
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex =
      /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return phoneRegex.test(phone);
  };

  const validateCSVRow = (
    row: any,
    rowIndex: number
  ): CSVValidationError | null => {
    const errors: string[] = [];

    if (!row.name?.trim()) {
      errors.push('El nombre es obligatorio');
    }

    if (!row.email?.trim() || !validateEmail(row.email)) {
      errors.push('Email inválido');
    }

    if (!row.phone?.trim() || !validatePhone(row.phone)) {
      errors.push('Teléfono inválido');
    }

    if (!['new', 'contacted', 'qualified', 'lost'].includes(row.status)) {
      errors.push('Estado inválido');
    }

    if (!row.location?.trim()) {
      errors.push('La ubicación es obligatoria');
    }

    return errors.length > 0 ? { row: rowIndex + 2, errors } : null;
  };

  // Manejar la carga del archivo CSV
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: CSVValidationError[] = [];
        const newLeads: Lead[] = [];

        results.data.forEach((row: any, index: number) => {
          const validationError = validateCSVRow(row, index);
          if (validationError) {
            errors.push(validationError);
          } else {
            newLeads.push({
              id: `imported-${Date.now()}-${index}`,
              name: row.name.trim(),
              email: row.email.trim(),
              phone: row.phone.trim(),
              status: row.status as Lead['status'],
              source: row.source || 'CSV Import',
              date: row.date || new Date().toISOString().split('T')[0],
              location: row.location.trim(),
            });
          }
        });

        if (errors.length > 0) {
          setCsvHeaders(Object.keys(results.data[0]));
          setPendingCsvData(results.data);
          setShowValidationModal(true);
          toast.error(
            `Se encontraron ${errors.length} errores en el archivo CSV`
          );
          console.error('Validation errors:', errors);
          return;
        }

        setLeads((prevLeads) => [...prevLeads, ...newLeads]);
        toast.success(`${newLeads.length} leads importados correctamente`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      error: (error) => {
        toast.error('Error al procesar el archivo CSV');
        console.error('CSV Parse Error:', error);
      },
    });
  };

  // Confirmar el mapeo de columnas y añadir los leads
  const handleColumnMappingConfirm = (mappings: Record<string, string>) => {
    const newLeads: Lead[] = [];
    const errors: CSVValidationError[] = [];

    pendingCsvData.forEach((row: any, index: number) => {
      const mappedRow: any = {};
      Object.entries(mappings).forEach(([key, value]) => {
        if (value) {
          mappedRow[key] = row[value];
        }
      });

      const validationError = validateCSVRow(mappedRow, index);
      if (validationError) {
        errors.push(validationError);
      } else {
        newLeads.push({
          id: `imported-${Date.now()}-${index}`,
          name: mappedRow.name.trim(),
          email: mappedRow.email.trim(),
          phone: mappedRow.phone.trim(),
          status: mappedRow.status as Lead['status'],
          source: mappedRow.source || 'CSV Import',
          date: mappedRow.date || new Date().toISOString().split('T')[0],
          location: mappedRow.location.trim(),
        });
      }
    });

    if (errors.length > 0) {
      toast.error(`Se encontraron ${errors.length} errores en el archivo CSV`);
      console.error('Validation errors:', errors);
      return;
    }

    setLeads((prevLeads) => [...prevLeads, ...newLeads]);
    toast.success(`${newLeads.length} leads importados correctamente`);
    setShowValidationModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Descargar los leads en formato CSV
  const downloadLeadsCSV = () => {
    const csv = Papa.unparse(
      leads.map((lead) => ({
        nombre: lead.name,
        email: lead.email,
        telefono: lead.phone,
        estado: lead.status,
        origen: lead.source,
        fecha: lead.date,
        ubicacion: lead.location,
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `leads_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descargar una plantilla CSV de muestra
  const downloadSampleCSV = () => {
    const headers = [
      'name',
      'email',
      'phone',
      'status',
      'source',
      'date',
      'location',
    ];
    const sampleData = [
      [
        'Ana García',
        'ana.garcia@email.com',
        '+34 612 345 678',
        'new',
        'CSV Import',
        '2024-03-15',
        'Madrid',
      ],
      [
        'Carlos Rodríguez',
        'carlos.rodriguez@email.com',
        '+34 623 456 789',
        'contacted',
        'CSV Import',
        '2024-03-14',
        'Barcelona',
      ],
    ];

    const csv = Papa.unparse({
      fields: headers,
      data: sampleData,
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Leads</h2>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center gap-2 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Importar CSV
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={downloadSampleCSV}
              className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              Plantilla CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Añadir Lead
            </button>
            <button
              onClick={downloadLeadsCSV}
              className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <Download className="h-4 w-4" />
              Descargar CSV
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar leads..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as Lead['status'] | 'all')
              }
              className="border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Todos los estados</option>
              <option value="new">Nuevos</option>
              <option value="contacted">Contactados</option>
              <option value="qualified">Cualificados</option>
              <option value="lost">Perdidos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Nombre
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contacto
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Estado
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <button
                  onClick={() => handleSort('source')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Origen
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Fecha
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {lead.name}
                  </div>
                  <div className="text-sm text-gray-500">{lead.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-2" />
                      {lead.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2" />
                      {lead.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(
                      lead.status
                    )}`}
                  >
                    {getStatusText(lead.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.source}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(lead.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddLeadModal
            onClose={() => setShowAddModal(false)}
            onAdd={(newLead) => {
              setLeads([...leads, { ...newLead, id: `custom-${Date.now()}` }]);
              setShowAddModal(false);
              toast.success('Lead añadido correctamente');
            }}
          />
        )}
        {showValidationModal && (
          <CSVValidationModal
            onClose={() => setShowValidationModal(false)}
            onConfirm={handleColumnMappingConfirm}
            csvHeaders={csvHeaders}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddLeadModal({ onClose, onAdd }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'new' as Lead['status'],
    source: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl max-w-lg w-full mx-4"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Añadir Nuevo Lead
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Lead['status'],
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="new">Nuevo</option>
                  <option value="contacted">Contactado</option>
                  <option value="qualified">Cualificado</option>
                  <option value="lost">Perdido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origen
                </label>
                <input
                  type="text"
                  required
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Añadir Lead
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
