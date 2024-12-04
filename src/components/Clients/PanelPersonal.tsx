import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  User,
  Ruler,
  Scale,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  FileText,
  AlertCircle,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Edit2,
  ChevronDown,
  ChevronUp,
  ClipboardList
} from 'lucide-react';
import Button from '../Common/Button';

interface SocialMedia {
  platform: string;
  username: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface PanelPersonalProps {
  cliente: any;
  onEdit?: () => void;
}

const PanelPersonal: React.FC<PanelPersonalProps> = ({ cliente, onEdit }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const SectionHeader = ({ title, section }: { title: string, section: string }) => (
    <div
      onClick={() => toggleSection(section)}
      className={`flex justify-between items-center p-4 cursor-pointer ${
        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
      }`}
    >
      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {title}
      </h3>
      {expandedSection === section ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </div>
  );

  const renderBasicInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="flex items-center mb-2">
          <User className="mr-2" size={20} />
          <span className="font-medium">Nombre:</span>
          <span className="ml-2">{cliente.nombre || 'No especificado'}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2" size={20} />
          <span className="font-medium">Edad/Fecha Nacimiento:</span>
          <span className="ml-2">{cliente.fechaNacimiento || 'No especificado'}</span>
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="flex items-center mb-2">
          <Mail className="mr-2" size={20} />
          <span className="font-medium">Email:</span>
          <span className="ml-2">{cliente.email || 'No especificado'}</span>
        </div>
        <div className="flex items-center mb-2">
          <Phone className="mr-2" size={20} />
          <span className="font-medium">Teléfono:</span>
          <span className="ml-2">{cliente.telefono || 'No especificado'}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="mr-2" size={20} />
          <span className="font-medium">Dirección:</span>
          <span className="ml-2">{cliente.direccion?.calle || 'No especificado'}</span>
        </div>
      </div>
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h4 className="font-medium mb-2">Redes Sociales</h4>
        <div className="space-y-2">
          {cliente.redesSociales?.map((red: SocialMedia, index: number) => (
            <div key={index} className="flex items-center">
              {red.platform === 'instagram' && <Instagram className="mr-2" size={20} />}
              {red.platform === 'facebook' && <Facebook className="mr-2" size={20} />}
              {red.platform === 'twitter' && <Twitter className="mr-2" size={20} />}
              <span>{red.username}</span>
            </div>
          )) || 'No hay redes sociales especificadas'}
        </div>
      </div>
    </div>
  );

  const renderTags = () => (
    <div className="p-4">
      <div className="flex flex-wrap gap-2">
        <span className={`px-3 py-1 rounded-full ${
          cliente.estado === 'Activo' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {cliente.estado || 'No especificado'}
        </span>
        {cliente.tags?.map((tag: Tag) => (
          <span 
            key={tag.id}
            className={`px-3 py-1 rounded-full`}
            style={{ backgroundColor: tag.color, color: 'white' }}
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );

  const renderPhysiological = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="space-y-2">
          <div className="flex items-center">
            <User className="mr-2" size={20} />
            <span className="font-medium">Género:</span>
            <span className="ml-2">{cliente.genero || 'No especificado'}</span>
          </div>
          <div className="flex items-center">
            <Ruler className="mr-2" size={20} />
            <span className="font-medium">Altura:</span>
            <span className="ml-2">{cliente.altura ? `${cliente.altura} cm` : 'No especificado'}</span>
          </div>
          <div className="flex items-center">
            <Scale className="mr-2" size={20} />
            <span className="font-medium">Peso:</span>
            <span className="ml-2">{cliente.peso ? `${cliente.peso} kg` : 'No especificado'}</span>
          </div>
        </div>
      </div>
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h4 className="font-medium mb-2">Lesiones o Condiciones Médicas</h4>
        <div className="space-y-2">
          {cliente.condicionesMedicas?.map((condicion: string, index: number) => (
            <div key={index} className="flex items-center">
              <AlertCircle className="mr-2" size={20} />
              <span>{condicion}</span>
            </div>
          )) || 'No hay condiciones médicas registradas'}
        </div>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="p-4">
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        {cliente.notas?.map((nota: any, index: number) => (
          <div key={index} className="mb-4 last:mb-0">
            <div className="flex items-start">
              <MessageCircle className="mr-2 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">{new Date(nota.fechaCreacion).toLocaleDateString()}</p>
                <p>{nota.texto}</p>
              </div>
            </div>
          </div>
        )) || 'No hay notas registradas'}
      </div>
    </div>
  );

  const renderQuestionnaire = () => (
    <div className="p-4">
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <Button
          onClick={() => console.log('Ver cuestionario completo')}
          className="w-full justify-center"
        >
          <ClipboardList className="mr-2" size={20} />
          Ver Cuestionario Completo
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Información Personal
        </h2>
        <Button
          onClick={onEdit}
          variant="ghost"
          size="sm"
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Edit2 size={16} className="mr-2" />
          Editar
        </Button>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <SectionHeader title="Información Básica" section="basic" />
        {expandedSection === 'basic' && renderBasicInfo()}

        <SectionHeader title="Información de Contacto" section="contact" />
        {expandedSection === 'contact' && renderContactInfo()}

        <SectionHeader title="Tags" section="tags" />
        {expandedSection === 'tags' && renderTags()}

        <SectionHeader title="Información Fisiológica" section="physiological" />
        {expandedSection === 'physiological' && renderPhysiological()}

        <SectionHeader title="Notas" section="notes" />
        {expandedSection === 'notes' && renderNotes()}

        <SectionHeader title="Cuestionario" section="questionnaire" />
        {expandedSection === 'questionnaire' && renderQuestionnaire()}
      </div>
    </div>
  );
};

export default PanelPersonal;
