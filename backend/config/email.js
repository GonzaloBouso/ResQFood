import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure: true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

transporter.verify().then(()=>{
    console.log('Listo para enviar correos electrónicos.');
}).catch(error => {
    console.log('Error al conectar con el servidor de correo: ', error);
});