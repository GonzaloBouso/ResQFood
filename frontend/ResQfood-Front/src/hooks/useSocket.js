import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import io from 'socket.io-client';
import API_BASE_URL from '../api/config';

export const useSocket = (addNotification) => {
  const { isSignedIn, userId } = useAuth();
  // Usamos useRef para mantener la misma instancia del socket entre renders
  const socketRef = useRef(null);

  useEffect(() => {
    // 1. Solo nos conectamos si el usuario ha iniciado sesión y tenemos su ID.
    if (isSignedIn && userId) {
      // Evita crear conexiones duplicadas si el socket ya existe
      if (socketRef.current) return;

      // 2. Creamos la conexión con el servidor de sockets.
      //    La URL debe apuntar a tu backend en Render.
      socketRef.current = io(API_BASE_URL, {
        // 3. Enviamos el clerkUserId para que el backend sepa quiénes somos.
        //    Esto es crucial para que el backend nos envíe notificaciones personales.
        auth: {
          clerkUserId: userId
        }
      });

      const socket = socketRef.current;

      // --- Definimos los "oyentes" de eventos ---

      socket.on('connect', () => {
        console.log('Socket.IO: Conectado al servidor con ID de socket:', socket.id);
      });

      // 4. LA CLAVE: Escuchamos el evento 'nueva_notificacion' que envía el backend.
      socket.on('nueva_notificacion', (notificacion) => {
        console.log('¡Nueva notificación recibida desde el servidor!:', notificacion);
        
        // 5. Llamamos a la función del contexto (que recibimos como argumento)
        //    para añadir la notificación al estado global de la aplicación.
        if (addNotification) {
            addNotification(notificacion); 
        }
      });

      socket.on('disconnect', () => {
        console.log('Socket.IO: Desconectado del servidor.');
      });

      // 6. Función de limpieza: se ejecuta cuando el usuario cierra sesión o se va de la página. para evitar conexiones "zombis".
      return () => {
        console.log('Socket.IO: Desconectando...');
        socket.disconnect();
        socketRef.current = null;
      };
    } else {
        // Si el usuario cierra sesión, nos aseguramos de que el socket se desconecte.
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }
  }, [isSignedIn, userId, addNotification]); // El efecto se re-ejecuta si el estado de login cambia
};