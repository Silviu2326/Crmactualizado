import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Plus, Search, Gift, Star } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  origen: string;
  createdAt: string;
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  origen: string;
}

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { register, handleSubmit } = useForm<LeadFormData>();

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.get('https://fitoffice2-f70b52bef77e.herokuapp.com/api/leads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setLeads(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los leads');
      toast.error('Error al cargar los leads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLead = async (newLead: LeadFormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Transformar los datos al formato requerido
      const leadData = {
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        status: "new",
        origen: newLead.origen || "web"
      };

      console.log('Datos enviados en la petición POST:', leadData);

      const response = await axios.post(
        'https://fitoffice2-f70b52bef77e.herokuapp.com/api/leads',
        leadData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setLeads(prevLeads => [...prevLeads, response.data]);
      setShowNewLeadModal(false);
      toast.success('Lead creado exitosamente');
    } catch (err) {
      toast.error('Error al crear el lead');
      console.error('Error creating lead:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener color basado en el estado
  const getStatusColor = (status: string) => {
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
  const getStatusText = (status: string) => {
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

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const [sortField, setSortField] = useState<keyof Lead | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredSortedLeads = filteredLeads
    .sort((a, b) => {
      if (!sortField) return 0;
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Leads</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewLeadModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Añadir Lead
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar leads..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <Gift className="mx-auto h-12 w-12 text-[#E61D2B] mb-4" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No hay leads todavía</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                ¡Comienza añadiendo tu primer lead!
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowNewLeadModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#E61D2B] hover:bg-[#E61D2B]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E61D2B]"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Añadir Lead
                </button>
              </div>
            </div>
          </div>
        ) : (
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
                    <MoreHorizontal className="h-4 w-4" />
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
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSort('origen')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Origen
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Fecha
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSortedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Gift className="h-4 w-4 mr-2" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 mr-2" />
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
                    {lead.origen}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showNewLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-lg w-full mx-4">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Añadir Nuevo Lead
                </h3>
                <button
                  onClick={() => setShowNewLeadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleCreateLead)} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    {...register('name', { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E61D2B] focus:ring-[#E61D2B]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E61D2B] focus:ring-[#E61D2B]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E61D2B] focus:ring-[#E61D2B]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Origen
                  </label>
                  <select
                    {...register('origen')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E61D2B] focus:ring-[#E61D2B]"
                  >
                    <option value="web">Web</option>
                    <option value="referral">Referido</option>
                    <option value="social">Redes Sociales</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
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
          </div>
        </div>
      )}
    </div>
  );
}
