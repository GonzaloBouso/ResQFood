import { useEffect, useState } from 'react';
import API_BASE_URL from '../api/config';

export default function useRecepcionesFinalizadas(userId, getToken) {
  const [items, setItems]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true); setError(null);
      try {
        const token = await getToken();
        const res = await fetch(
          `${API_BASE_URL}/api/entrega/usuario/${userId}/historial-recepciones`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `Error ${res.status}`);
        }
        const data = await res.json();
        setItems(data.recepciones || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoad(false);
      }
    };
    if (userId) fetchData();
  }, [userId, getToken]);

  return { items, loading, error };
}
