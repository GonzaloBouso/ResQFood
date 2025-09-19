import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import io from 'socket.io-client';
import API_BASE_URL from '../api/config';

export const useSocket = (addNotification) => {
  const { isSignedIn, getToken } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    const connectSocket = async () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      
      try {
      
        const token = await getToken();

     
        socketRef.current = io(API_BASE_URL, {
          auth: {
            token
          },
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
          console.log('Socket.IO: Conectado al servidor. ID:', socket.id);
        });
        socket.on('connect_error', (err) => {
          console.error('Socket.IO: Error de conexión -', err.message);
        });
        socket.on('nueva_notificacion', (notificacion) => {
          console.log('Socket.IO: Nueva notificación recibida ->', notificacion);
          if (addNotification) {
            addNotification(notificacion); 
          }
        });
        socket.on('disconnect', (reason) => {
          console.log('Socket.IO: Desconectado del servidor. Razón:', reason);
        });
        
      } catch (error) {
        console.error("Error al obtener el token para la conexión del socket:", error);
      }
    };

    if (isSignedIn) {
      connectSocket();
    }
    
    //  Función de limpieza 
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };

  }, [isSignedIn, getToken, addNotification]);
};