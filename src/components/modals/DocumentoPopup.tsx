// src/components/modals/DocumentoPopup.tsx

import React from 'react';
import PopupReutilizable from '../Common/PopupReutilizable';
import LicenciaForm from '../Forms/tipos-documento/LicenciaForm';
import ContratoForm from '../Forms/tipos-documento/ContratoForm';
import DocumentoGenericoForm from '../Forms/tipos-documento/DocumentoGenericoForm';

interface DocumentoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  tipoDocumento: 'licencia' | 'contrato' | 'otro';
}

const DocumentoPopup: React.FC<DocumentoPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tipoDocumento,
}) => {
  let FormComponent;

  switch (tipoDocumento) {
    case 'licencia':
      FormComponent = LicenciaForm;
      break;
    case 'contrato':
      FormComponent = ContratoForm;
      break;
    default:
      FormComponent = DocumentoGenericoForm;
  }

  return (
    <PopupReutilizable
      isOpen={isOpen}
      onClose={onClose}
      title={`Añadir ${tipoDocumento.charAt(0).toUpperCase() + tipoDocumento.slice(1)}`}
    >
      <FormComponent
        onSubmit={(formData: any) => {
          onSubmit(formData);
          onClose();
        }}
        onCancel={onClose}
      />
    </PopupReutilizable>
  );
};

export default DocumentoPopup;
