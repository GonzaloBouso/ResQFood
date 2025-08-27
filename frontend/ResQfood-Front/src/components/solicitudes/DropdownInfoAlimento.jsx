import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const DropdownInfoAlimento = ({ solicitud }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-md shadow border text-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-4 py-3 flex justify-between items-center font-medium hover:bg-gray-50">
        <span>Información del alimento</span>
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {open && (
        <div className="px-4 py-3 border-t space-y-1">
          <p><strong>Tipo:</strong> {solicitud.tipo}</p>
          <p><strong>Descripción:</strong> {solicitud.descripcion}</p>
          
        </div>
      )}
    </div>
  );
};

export default DropdownInfoAlimento;
