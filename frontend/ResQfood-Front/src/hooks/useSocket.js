import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import io from 'socket.io-client';
import API_BASE_URL from '../api/config';

export const useSocket = (addNotification) => {
  // 1. Obtenemos 'getToken' para la autenticación y 'isSignedIn' para saber si conectar.
  const { isSignedIn, getToken } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    // 2. Definimos la función de conexión DENTRO del useEffect.
    const connectSocket = async () => {
      try {
        // Obtenemos el token de sesión de Clerk.
        const token = await getToken();

        // Si ya hay un socket, lo desconectamos antes de crear uno nuevo.
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        
        // Creamos la conexión y le pasamos el token en la sección 'auth'.
        socketRef.current = io(API_BASE_URL, {
          auth: {
            token
          },
          // Opciones adicionales para mejorar la reconexión
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        const socket = socketRef.current;

        // --- Definimos los "oyentes" de eventos ---

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

        socket.on('disconnect', () => {
          console.log('Socket.IO: Desconectado del servidor.');
        });
        
      } catch (error) {
        console.error("Error al obtener el token para la conexión del socket:", error);
      }
    };

    // 3. Lógica de ejecución del efecto.
    if (isSignedIn) {
      connectSocket(); // Si el usuario está logueado, intentamos conectar.
    } else {
      // Si el usuario no está logueado (o cierra sesión), nos aseguramos de desconectar.
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
    
    // 4. Función de limpieza.
    //    Esto asegura que cuando el componente que usa el hook se desmonte,
    //    la conexión del socket se cierre limpiamente.
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };

  // 5. El array de dependencias correcto.
  //    El efecto se re-ejecutará solo si 'isSignedIn', 'getToken', o 'addNotification' cambian.
  }, [isSignedIn, getToken, addNotification]);
};