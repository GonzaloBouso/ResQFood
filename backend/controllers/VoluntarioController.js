import { transporter } from '../config/email.js';

export class VoluntarioController {
  static async inscribir(req, res) {
    // 1. Extraemos los datos del cuerpo de la petición
    const { nombre, nacimiento, email, telefono, pais, provincia, ciudad } = req.body;

   
    if (!nombre || !email) {
      return res.status(400).json({ message: 'El nombre y el email son obligatorios.' });
    }

    try {


       const correoAlVoluntario = {
        from: `"ResQFood Voluntariado" <${process.env.EMAIL_USER}>`,
        to: email, 

        subject: '¡Gracias por querer ser voluntario en ResQFood!',
        html: `
          <h1>¡Hola ${nombre}!</h1>
          <p>Hemos recibido tu solicitud para unirte a nuestro equipo de voluntarios. ¡Estamos muy emocionados por tu interés!</p>
          <p>Revisaremos tu información y nos pondremos en contacto contigo pronto.</p>
          <p>¡Gracias de nuevo!</p>
          <p>El equipo de ResQFood.</p>
        `,
      };

      // B. Preparamos el correo de notificación para el administrador
      const correoAlAdmin = {
        from: `"Notificaciones ResQFood" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL, // <-- Usamos la nueva variable del .env
        subject: `Nueva solicitud de voluntariado: ${nombre}`,
        html: `
          <h1>Nueva solicitud de voluntariado recibida</h1>
          <p>Un nuevo voluntario ha llenado el formulario. Aquí están sus datos:</p>
          <ul>
            <li><strong>Nombre:</strong> ${nombre}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Fecha de Nacimiento:</strong> ${nacimiento}</li>
            <li><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</li>
            <li><strong>Ubicación:</strong> ${ciudad}, ${provincia}, ${pais}</li>
          </ul>
        `,
      };

      // C. Enviamos ambos correos en paralelo para mayor eficiencia
      await Promise.all([
        transporter.sendMail(correoAlVoluntario),
        transporter.sendMail(correoAlAdmin)
      ]);
      //  Enviamos un correo de confirmación al voluntario
      await transporter.sendMail({
        from: `"ResQFood Voluntariado" <${process.env.EMAIL_USER}>`,
        to: email, 
        subject: '¡Gracias por querer ser voluntario en ResQFood!',
        html: `
          <h1>¡Hola ${nombre}!</h1>
          <p>Hemos recibido tu solicitud para unirte a nuestro equipo de voluntarios. ¡Estamos muy emocionados por tu interés!</p>
          <p>Revisaremos tu información y nos pondremos en contacto contigo pronto.</p>
          <p><strong>Detalles de tu solicitud:</strong></p>
          <ul>
            <li><strong>Nombre:</strong> ${nombre}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</li>
            <li><strong>Ubicación:</strong> ${ciudad}, ${provincia}, ${pais}</li>
          </ul>
          <p>¡Gracias de nuevo!</p>
          <p>El equipo de ResQFood.</p>
        `,
      });

 
      // 2. Enviamos una respuesta de éxito al frontend
      res.status(200).json({ message: 'Solicitud de voluntariado enviada exitosamente. ¡Revisa tu correo!' });

    } catch (error) {
      console.error('Error al enviar el correo de voluntariado:', error);
      res.status(500).json({ message: 'Hubo un error al procesar tu solicitud. Inténtalo más tarde.' });
    }
  }
}