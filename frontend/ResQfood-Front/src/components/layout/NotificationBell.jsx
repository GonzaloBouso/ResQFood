import React, { useContext } from 'react';
import { Bell } from 'lucide-react';
import { ProfileStatusContext } from '../../context/ProfileStatusContext';

const NotificationBell = () => {
  // 1. Obtenemos el contador de notificaciones no leídas desde el contexto global.
  const { unreadCount } = useContext(ProfileStatusContext);

  const handleClick = () => {
    // Por ahora, solo mostrará una alerta.
    // En el futuro, este clic abrirá un menú desplegable con la lista de notificaciones.
    alert(`Tienes ${unreadCount} notificaciones no leídas.`);
    // Aquí podríamos añadir lógica para marcar las notificaciones como leídas.
  };

  return (
    <button 
      onClick={handleClick} 
      className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors focus:outline-none"
      aria-label={`Ver notificaciones. ${unreadCount} no leídas.`}
    >
      <Bell size={22} />
      
      {/* 
        2. Renderizado Condicional:
           Este punto rojo solo se muestra si el contador de no leídas es mayor que cero.
      */}
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
        </span>
      )}
    </button>
  );
};

export default NotificationBell;