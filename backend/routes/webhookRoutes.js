import express from 'express';
import { Webhook } from 'svix'; // Librería oficial para verificar firmas
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Ruta: POST /webhooks/clerk
router.post('/clerk', async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Webhook secret no definido en .env');
    return res.status(500).json({ error: 'Webhook secret no configurado' });
  }

  const payload = req.body;
  const headers = req.headers;

  const svix = new Webhook(WEBHOOK_SECRET);

  let event;

  try {
    event = svix.verify(JSON.stringify(payload), headers);
    console.log('Webhook recibido:', event.type);

    // Aquí podés manejar distintos tipos de eventos de Clerk
    switch (event.type) {
      case 'user.created':
        console.log('Usuario creado:', event.data.id);
        // Guardar en DB si hace falta
        break;
      case 'user.deleted':
        console.log('Usuario eliminado:', event.data.id);
        // Eliminar de DB si hace falta
        break;
      // Agregar otros eventos si querés
      default:
        console.log('Evento no manejado:', event.type);
        break;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error al verificar el webhook:', err);
    res.status(400).json({ error: 'Firma no válida' });
  }
});

export default router;
