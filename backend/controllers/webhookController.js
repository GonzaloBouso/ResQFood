// src/controllers/webhookController.js
import { Webhook } from 'svix';
import User from '../models/User.js';

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!CLERK_WEBHOOK_SECRET) {
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.error("FATAL ERROR: CLERK_WEBHOOK_SECRET no está configurado en las variables de entorno.");
  console.error("Por favor, revisa tu archivo .env en la raíz del backend.");
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

}

export const handleClerkWebhook = async (req, res) => {
  console.log("\n[WEBHOOK_HANDLER] Nueva solicitud de webhook recibida.");

  if (!CLERK_WEBHOOK_SECRET) {
    console.error("[WEBHOOK_HANDLER] ERROR CRÍTICO: CLERK_WEBHOOK_SECRET no disponible en tiempo de ejecución.");
    return res.status(500).json({ error: "Configuración incorrecta: Webhook secret no configurado en el servidor." });
  }

  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  console.log(`[WEBHOOK_HANDLER] Headers Svix: id=${svix_id}, timestamp=${svix_timestamp}, signature=${svix_signature ? 'Presente' : 'AUSENTE!'}`);

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.warn("[WEBHOOK_HANDLER] ADVERTENCIA: Faltan uno o más headers de Svix requeridos.");
    return res.status(400).json({ error: "Petición inválida: Faltan headers de svix requeridos." });
  }

  const payload = req.body.toString(); 
  console.log("[WEBHOOK_HANDLER] Payload recibido (inicio):", payload.substring(0, 200) + "..."); 

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);
  let evt; 

  try {
    console.log("[WEBHOOK_HANDLER] Intentando verificar firma del webhook...");
    evt = wh.verify(payload, { 
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
    console.log("[WEBHOOK_HANDLER] ¡Firma del webhook verificada exitosamente!");
  } catch (err) {
    console.error("[WEBHOOK_HANDLER] ERROR AL VERIFICAR FIRMA DEL WEBHOOK:", err.message);
  
    return res.status(400).json({ error: "Error de verificación de webhook: Firma inválida." });
  }

  // <<< USAR evt DESPUÉS DE QUE HA SIDO ASIGNADO EN EL TRY SI LA VERIFICACIÓN FUE EXITOSA >>>
  const eventType = evt.type;
  const eventData = evt.data;

  console.log(`[WEBHOOK_HANDLER] Evento verificado. Tipo: ${eventType}`);
  

  // --- MANEJO DEL EVENTO 'user.created' ---
  if (eventType === 'user.created') {
    console.log("✅ [WEBHOOK_HANDLER | user.created] Evento 'user.created' recibido.");
    console.log("[WEBHOOK_HANDLER | user.created] Datos completos del evento (eventData):", JSON.stringify(eventData, null, 2));

    const { id, email_addresses, first_name, last_name, image_url } = eventData;

    const primaryEmail = email_addresses?.find(email => email.id === eventData.primary_email_address_id)?.email_address || 
                         (email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : null);

    const newUserPayload = {
      clerkUserId: id,
      email: primaryEmail,
      nombre: `${first_name || ''} ${last_name || ''}`.trim() || null, 
      fotoDePerfilUrl: image_url || null,
    };
    console.log("[WEBHOOK_HANDLER | user.created] Payload para nuevo usuario construido:", JSON.stringify(newUserPayload, null, 2));

    if (!newUserPayload.clerkUserId) {
        console.error("[WEBHOOK_HANDLER | user.created] ERROR CRÍTICO: Falta clerkUserId (id) en los datos del evento. No se puede crear usuario.");
        return res.status(400).json({ error: "Datos corruptos del webhook: clerkUserId faltante." });
    }
    if (!newUserPayload.email) {
        console.warn("[WEBHOOK_HANDLER | user.created] ADVERTENCIA: Email no encontrado en los datos del evento. clerkUserId:", newUserPayload.clerkUserId);
       
    }

    try {
      console.log(`[WEBHOOK_HANDLER | user.created] Buscando si ya existe usuario con clerkUserId: ${newUserPayload.clerkUserId}...`);
      const existingUser = await User.findOne({ clerkUserId: newUserPayload.clerkUserId });

      if (existingUser) {
        console.warn(`[WEBHOOK_HANDLER | user.created] ADVERTENCIA: Usuario con clerkUserId ${newUserPayload.clerkUserId} YA EXISTE en la DB. Saltando creación.`);
       
        return res.status(200).json({ message: "Usuario ya existía, no se realizaron cambios desde user.created." });
      }
      console.log(`[WEBHOOK_HANDLER | user.created] Usuario con clerkUserId ${newUserPayload.clerkUserId} no existe. Procediendo a crear...`);
      
      console.log("[WEBHOOK_HANDLER | user.created] Creando instancia de User con payload...");

      const user = new User(newUserPayload);

      console.log("[WEBHOOK_HANDLER | user.created] Instancia de User creada (antes de pre-save hook):", JSON.stringify(user.toObject(), null, 2));
      
      console.log("[WEBHOOK_HANDLER | user.created] Intentando user.save()...");

      await user.save(); 

      console.log("✅ [WEBHOOK_HANDLER | user.created] ¡ÉXITO! user.save() completado.");
      console.log("[WEBHOOK_HANDLER | user.created] Documento guardado:", JSON.stringify(user.toJSON(), null, 2));

      return res.status(201).json({ message: "Usuario creado exitosamente vía webhook.", userId: user._id, clerkUserId: user.clerkUserId });

    } catch (dbError) {

      console.error(`❌ [WEBHOOK_HANDLER | user.created] ERROR DURANTE user.save() o búsqueda previa (clerkUserId: ${id}):`);
      console.error("[WEBHOOK_HANDLER | user.created] Tipo de Error:", dbError.name); 
      console.error("[WEBHOOK_HANDLER | user.created] Mensaje de Error:", dbError.message);

      if (dbError.code) { 

          console.error("[WEBHOOK_HANDLER | user.created] Código de Error DB:", dbError.code);
          console.error("[WEBHOOK_HANDLER | user.created] Detalle de Clave Duplicada (si aplica):", dbError.keyValue);

      }
      if (dbError.errors) { 
          console.error("[WEBHOOK_HANDLER | user.created] Errores de Validación de Mongoose:", JSON.stringify(dbError.errors, null, 2));
      }
      console.error("[WEBHOOK_HANDLER | user.created] Stack de Error Completo:\n", dbError.stack);
      
      let statusCode = 500;
      let responseError = { error: "Error interno del servidor al guardar el usuario.", details: dbError.message };
      if (dbError.name === 'ValidationError') {
          statusCode = 400;
          responseError = { error: "Error de validación al crear usuario.", errors: dbError.errors };
      } else if (dbError.code === 11000) {
          statusCode = 409;
          responseError = { error: "Conflicto de datos, posible clave duplicada.", details: dbError.keyValue };
      }
      return res.status(statusCode).json(responseError);
    }
  }

  // --- MANEJO DEL EVENTO 'user.updated' ---
  else if (eventType === 'user.updated') {
    console.log("🔄 [WEBHOOK_HANDLER | user.updated] Evento 'user.updated' recibido.");
    const { id, email_addresses, first_name, last_name, image_url } = eventData;
    
    try {
      console.log(`[WEBHOOK_HANDLER | user.updated] Buscando usuario para actualizar con clerkUserId: ${id}...`);
      const userToUpdate = await User.findOne({ clerkUserId: id });

      if (!userToUpdate) {
        console.warn(`[WEBHOOK_HANDLER | user.updated] ADVERTENCIA: Usuario con clerkUserId ${id} no encontrado para actualizar.`);
        return res.status(404).json({ error: "Usuario no encontrado para actualizar." });
      }
      console.log(`[WEBHOOK_HANDLER | user.updated] Usuario encontrado. Datos ANTES de actualizar:`, userToUpdate.toJSON());

      const primaryEmail = email_addresses?.find(email => email.id === eventData.primary_email_address_id)?.email_address || 
                           (email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : userToUpdate.email);

      userToUpdate.email = primaryEmail;
      userToUpdate.nombre = `${first_name || ''} ${last_name || ''}`.trim() || userToUpdate.nombre;
      userToUpdate.fotoDePerfilUrl = image_url || userToUpdate.fotoDePerfilUrl;
      
      if (userToUpdate.isModified()) {
        await userToUpdate.save();
        console.log("🔄 [WEBHOOK_HANDLER | user.updated] ¡ÉXITO! Usuario ACTUALIZADO en la DB. clerkUserId:", userToUpdate.clerkUserId);
        console.log("[WEBHOOK_HANDLER | user.updated] Documento actualizado:", userToUpdate.toJSON());
      } else {
        console.log("[WEBHOOK_HANDLER | user.updated] No hubo cambios detectados. No se guardó.");
      }
      return res.status(200).json({ message: "Usuario actualizado (o sin cambios) exitosamente vía webhook." });

    } catch (dbError) {
      console.error(`❌ [WEBHOOK_HANDLER | user.updated] ERROR al actualizar usuario (clerkUserId: ${id}):`, dbError);
      return res.status(500).json({ error: "Error interno del servidor al actualizar el usuario.", details: dbError.message });
    }
  }
 
  // --- MANEJO DEL EVENTO 'user.deleted' ---
  else if (eventType === 'user.deleted') {
    console.log("🗑️ [WEBHOOK_HANDLER | user.deleted] Evento 'user.deleted' recibido.");
    const { id } = eventData; 

    if (!id) {
        console.warn("[WEBHOOK_HANDLER | user.deleted] ADVERTENCIA: No se proporcionó clerkUserId en 'user.deleted'.");
        return res.status(400).json({ error: "ID de usuario faltante en el evento de eliminación." });
    }
    
    try {
      console.log(`[WEBHOOK_HANDLER | user.deleted] Buscando usuario para marcar como inactivo con clerkUserId: ${id}...`);
      const userToDelete = await User.findOne({ clerkUserId: id });

      if (!userToDelete) {
        console.warn(`[WEBHOOK_HANDLER | user.deleted] ADVERTENCIA: Usuario con clerkUserId ${id} no encontrado para eliminar/desactivar.`);
        return res.status(404).json({ error: "Usuario no encontrado para procesar eliminación." });
      }

      userToDelete.activo = false;
      await userToDelete.save();
      console.log("🗑️ [WEBHOOK_HANDLER | user.deleted] ¡ÉXITO! Usuario marcado como INACTIVO en la DB. clerkUserId:", id);
      return res.status(200).json({ message: "Usuario procesado para desactivación vía webhook." });

    } catch (dbError) {
      console.error(`❌ [WEBHOOK_HANDLER | user.deleted] ERROR al procesar la eliminación (clerkUserId: ${id}):`, dbError);
      return res.status(500).json({ error: "Error interno del servidor al procesar la eliminación.", details: dbError.message });
    }
  }
 
  else {
    console.log(`[WEBHOOK_HANDLER] Tipo de evento no manejado activamente: ${eventType}. Respondiendo con éxito genérico.`);
  }

  res.status(200).json({ received: true, message: `Evento ${eventType} procesado o ignorado.` });
};