import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import API_BASE_URL from '../api/config';
import io from 'socket.io-client';


const initialState = {
  isLoadingUserProfile: true, 
  isProfileComplete: false,
  currentUserRole: null,
  currentUserDataFromDB: null,
  activeSearchLocation: null,
  setActiveSearchLocation: () => {},
  notifications: [],
  unreadCount: 0,
  setNotifications: () => {},
};
export const ProfileStatusContext = createContext(initialState);



export const ProfileStatusProvider = ({ children }) => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();

  const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(true);
  const [currentUserDataFromDB, setCurrentUserDataFromDB] = useState(null);
  const [activeSearchLocation, setActiveSearchLocation] = useState(null);
  const [notifications, setNotifications] = useState([]);


  const fetchUserAndNotifications = useCallback(async () => {
    if (!isSignedIn) {
      setIsLoadingUserProfile(false);
      return;
    }
    
    setIsLoadingUserProfile(true);
    try {
      const token = await getToken();
      
      
      const [profileResponse, notificationsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/usuario/perfil`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/api/notificacion`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!profileResponse.ok) throw new Error('No se pudo cargar el perfil de usuario.');
      if (!notificationsResponse.ok) throw new Error('No se pudieron cargar las notificaciones.');

      const profileData = await profileResponse.json();
      const notificationsData = await notificationsResponse.json();

      setCurrentUserDataFromDB(profileData.user);
      setNotifications(notificationsData.notificaciones || []);

    } catch (error) {
      console.error("Error al cargar datos del perfil o notificaciones:", error);
      
      setCurrentUserDataFromDB(null);
      setNotifications([]);
    } finally {
      setIsLoadingUserProfile(false);
    }
  }, [getToken, isSignedIn]);


  useEffect(() => {
    if (isSignedIn) {
      fetchUserAndNotifications();
    } else {
      
      setCurrentUserDataFromDB(null);
      setNotifications([]);
      setIsLoadingUserProfile(false);
    }
  }, [isSignedIn, fetchUserAndNotifications]);


  useEffect(() => {
    if (!isSignedIn) return;

    const connectSocket = async () => {
      const token = await getToken();
      const socket = io(API_BASE_URL, {
          auth: { token }
      });

      socket.on('connect', () => {
          console.log('Socket.IO: Conectado al servidor desde el Contexto.');
      });

      socket.on('nueva_notificacion', (nuevaNotificacion) => {
          console.log('Socket.IO: Nueva notificación recibida ->', nuevaNotificacion);
          
          setNotifications(prevNotifications => [nuevaNotificacion, ...prevNotifications]);
      });

      
      return () => {
          console.log('Socket.IO: Desconectando...');
          socket.disconnect();
      };
    };

    const cleanupPromise = connectSocket();
    
    return () => {
        cleanupPromise.then(cleanup => cleanup && cleanup());
    };

  }, [isSignedIn, getToken]);


 
  const isProfileComplete = useMemo(() => !!currentUserDataFromDB?.rol, [currentUserDataFromDB]);
  const currentUserRole = useMemo(() => currentUserDataFromDB?.rol || null, [currentUserDataFromDB]);
  const unreadCount = useMemo(() => notifications.filter(n => !n.leida).length, [notifications]);


  const contextValue = useMemo(() => ({
    isLoadingUserProfile,
    isProfileComplete,
    currentUserRole,
    currentUserDataFromDB,
    activeSearchLocation,
    setActiveSearchLocation,
    notifications,
    setNotifications, 
    unreadCount
  }), [
    isLoadingUserProfile, 
    isProfileComplete, 
    currentUserRole, 
    currentUserDataFromDB, 
    activeSearchLocation,
    notifications,
    unreadCount
  ]);

  return (
    <ProfileStatusContext.Provider value={contextValue}>
      {children}
    </ProfileStatusContext.Provider>
  );
};