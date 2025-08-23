
import { transporter } from '../config/email.js';

export class ContactoController {
  static async enviarMensaje(req, res) {
    
    const { nombre, email, mensaje } = req.body;

 
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
      //correos: uno para el admin y otro para el usuario

      // Correo de notificación para el equipo de ResQFood
      const correoAlAdmin = {
        from: `"Contacto ResQFood" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,

        subject: `[Contacto ResQFood] Nuevo Mensaje de: ${nombre}`,
        html: `
          <h1>Nuevo mensaje de contacto</h1>
          <p>Has recibido un nuevo mensaje a través del formulario de contacto de la web.</p>
          <hr>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email del remitente:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <blockquote style="border-left: 4px solid #ccc; padding-left: 1rem; margin-left: 1rem;">
            ${mensaje.replace(/\n/g, '<br>')}
          </blockquote>
        `,
      };

      // Correo de auto-respuesta para el usuario
      const correoAlUsuario = {
        from: `"Soporte ResQFood" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Hemos recibido tu mensaje',
        html: `
          <h1>¡Hola ${nombre}!</h1>
          <p>Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos lo antes posible.</p>
          <p>Este es una copia del mensaje que nos enviaste:</p>
          <blockquote style="border-left: 4px solid #ccc; padding-left: 1rem; margin-left: 1rem;">
            ${mensaje.replace(/\n/g, '<br>')}
          </blockquote>
          <p>Atentamente,<br>El equipo de ResQFood</p>
        `,
      };

      // 4. Envia ambos correos en paralelo
      await Promise.all([
        transporter.sendMail(correoAlAdmin),
        transporter.sendMail(correoAlUsuario)
      ]);

      // 5. Respuesta al frontend con éxito
      res.status(200).json({ message: '¡Mensaje enviado! Gracias por contactarnos.' });

    } catch (error) {
      console.error('Error al enviar el correo de contacto:', error);
      res.status(500).json({ message: 'Hubo un error al enviar tu mensaje. Por favor, inténtalo más tarde.' });
    }
  }
}