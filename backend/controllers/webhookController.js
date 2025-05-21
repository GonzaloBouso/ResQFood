// src/controllers/webhookController.js

import { Webhook } from 'svix';
import User from '../models/User.js'; // Asegúrate de que la ruta a tu modelo User sea correcta

// ¡MUY IMPORTANTE! Obtén esto de tu Dashboard de Clerk:
// Webhooks -> Tu Endpoint -> Signing Secret
// Y configúralo en tu archivo .env de backend
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!CLERK_WEBHOOK_SECRET) {
  console.error("FATAL ERROR: CLERK_WEBHOOK_SECRET no está configurado en las variables de entorno.");
  // En un entorno de producción, podrías querer que la aplicación no inicie si falta este secreto.
  // process.exit(1); 
}

export const handleClerkWebhook = async (req, res) => {
  // Primero, verifica que el secreto del webhook esté disponible.
  if (!CLERK_WEBHOOK_SECRET) {
    // Este log es más para el desarrollador durante el inicio.
    // Aquí, en tiempo de ejecución, ya deberíamos haber salido o tenerlo.
    return res.status(500).json({ error: "Webhook secret no configurado en el servidor." });
  }

  // Obtener los headers necesarios para la verificación de Svix
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  // Si alguno de los headers falta, es una petición inválida.
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Faltan headers de svix requeridos." });
  }

  // Obtener el cuerpo crudo (raw body)
  // req.body es un Buffer aquí porque usamos bodyParser.raw({type: 'application/json'}) en la ruta.
  const payload = req.body.toString(); 
  
  // Crear una nueva instancia de Webhook con tu secreto.
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt; // Variable para almacenar el evento verificado.

  // Verificar el payload con los headers.
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verificando la firma del webhook de Clerk:", err.message);
    return res.status(400).json({ error: "Error de verificación de webhook: Firma inválida." });
  }

  // El evento ha sido verificado, ahora puedes procesarlo.
  const eventType = evt.type;
  const eventData = evt.data;

  console.log(`Webhook procesado con tipo de evento: ${eventType}`);

  // Manejar el evento 'user.created'
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url, created_at, updated_at } = eventData;

    // Construir el objeto para el nuevo usuario en tu DB
    const newUserPayload = {
      clerkUserId: id, // Este es el ID de Clerk para el usuario
      email: email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : null,
      nombre: `${first_name || ''} ${last_name || ''}`.trim() || null,
      fotoDePerfilUrl: image_url || null,
      // El 'rol' y 'ubicacion' se completarán en un segundo paso desde el frontend.
      // Tu middleware pre('save') en el modelo User se encargará de inicializar 
      // subdocumentos como 'estadisticasGenerales' si el 'rol' se establece más tarde.
      // 'activo' es true por defecto en tu esquema.
    };
    
    // Opcional: Eliminar campos nulos/vacíos si no son estrictamente necesarios o no tienen un default
    // Object.keys(newUserPayload).forEach(key => (newUserPayload[key] == null || newUserPayload[key] === '') && delete newUserPayload[key]);

    try {
      // Verificar si ya existe un usuario con este clerkUserId (poco probable para user.created, pero buena práctica)
      const existingUser = await User.findOne({ clerkUserId: newUserPayload.clerkUserId });
      if (existingUser) {
        console.warn(`Webhook 'user.created': Usuario con clerkUserId ${newUserPayload.clerkUserId} ya existe. Actualizando datos básicos si es necesario.`);
        // Opcionalmente, podrías actualizar campos como email, nombre, fotoDePerfilUrl si han cambiado,
        // aunque esto es más típico del evento 'user.updated'.
        // Por ahora, solo registramos y respondemos.
        return res.status(200).json({ message: "Usuario ya existía, no se realizaron cambios." });
      }

      // Crear y guardar el nuevo usuario en tu base de datos
      const user = new User(newUserPayload);
      await user.save();
      console.log(`Usuario ${user.clerkUserId} creado exitosamente en la base de datos vía webhook.`);
      return res.status(201).json({ message: "Usuario creado exitosamente vía webhook." });

    } catch (dbError) {
      console.error(`Error al guardar el nuevo usuario (clerkUserId: ${id}) desde el webhook:`, dbError);
      // Manejar errores específicos de la base de datos, como email duplicado
      // (aunque el email de Clerk debería ser único en su sistema, podría haber colisiones si
      // intentas forzar unicidad de email en tu DB y un usuario de Clerk cambia su email
      // a uno que ya tienes asociado a otro clerkUserId).
      if (dbError.code === 11000) { // Código de error de MongoDB para clave duplicada
        return res.status(409).json({ error: "Conflicto de datos, posible clave duplicada.", details: dbError.message });
      }
      return res.status(500).json({ error: "Error interno del servidor al guardar el usuario." });
    }
  } 
  // Manejar el evento 'user.updated'
  else if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url /*, ...otros atributos que te interesen */ } = eventData;
    
    try {
      const userToUpdate = await User.findOne({ clerkUserId: id });
      if (!userToUpdate) {
        console.warn(`Webhook 'user.updated': Usuario con clerkUserId ${id} no encontrado para actualizar.`);
        return res.status(404).json({ error: "Usuario no encontrado para actualizar." });
      }

      // Actualiza los campos que Clerk puede modificar y que te interesan
      if (email_addresses && email_addresses.length > 0) {
        userToUpdate.email = email_addresses[0].email_address;
      }
      userToUpdate.nombre = `${first_name || ''} ${last_name || ''}`.trim() || userToUpdate.nombre; // Mantiene el nombre si no viene
      userToUpdate.fotoDePerfilUrl = image_url || userToUpdate.fotoDePerfilUrl; // Mantiene la foto si no viene
      
      await userToUpdate.save();
      console.log(`Usuario ${userToUpdate.clerkUserId} actualizado exitosamente desde webhook.`);
      return res.status(200).json({ message: "Usuario actualizado exitosamente vía webhook." });

    } catch (dbError) {
      console.error(`Error al actualizar el usuario (clerkUserId: ${id}) desde el webhook:`, dbError);
      return res.status(500).json({ error: "Error interno del servidor al actualizar el usuario." });
    }
  }
  // Manejar el evento 'user.deleted'
  else if (eventType === 'user.deleted') {
    const { id, deleted } = eventData; // 'deleted' es true si fue una eliminación "soft" en Clerk

    if (!id) { // A veces el evento de eliminación solo viene con id y deleted=true
        console.warn("Webhook 'user.deleted': No se proporcionó ID de usuario en los datos del evento.");
        return res.status(400).json({ error: "ID de usuario faltante en el evento de eliminación." });
    }
    
    try {
      const userToDelete = await User.findOne({ clerkUserId: id });
      if (!userToDelete) {
        console.warn(`Webhook 'user.deleted': Usuario con clerkUserId ${id} no encontrado para eliminar/desactivar.`);
        return res.status(404).json({ error: "Usuario no encontrado para eliminar/desactivar." });
      }

      // Decide tu estrategia: eliminar físicamente o marcar como inactivo.
      // Marcar como inactivo es generalmente más seguro.
      userToDelete.activo = false; 
      // También podrías querer limpiar datos sensibles o anonimizar si es necesario por GDPR, etc.
      // userToDelete.email = `deleted-${id}@example.com`; // Ejemplo de anonimización
      // userToDelete.nombre = "Usuario Eliminado";
      await userToDelete.save();

      // O para eliminar físicamente (¡cuidado!):
      // await User.deleteOne({ clerkUserId: id });

      console.log(`Usuario ${id} marcado como inactivo (o eliminado) desde webhook.`);
      return res.status(200).json({ message: "Usuario procesado para eliminación/desactivación vía webhook." });

    } catch (dbError) {
      console.error(`Error al procesar la eliminación del usuario (clerkUserId: ${id}) desde el webhook:`, dbError);
      return res.status(500).json({ error: "Error interno del servidor al procesar la eliminación del usuario." });
    }
  }
  // Puedes añadir más 'else if' para otros tipos de eventos de Clerk si los necesitas.
  else {
    console.log(`Tipo de evento no manejado activamente: ${eventType}`);
  }

  // Responde a Clerk con un status 200 para indicar que recibiste el webhook correctamente,
  // incluso si no manejaste ese tipo de evento específico.
  res.status(200).json({ received: true, eventType: eventType });
};