import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async ()=>{
    const dbURI = process.env.Mongo_URI;

    if (!dbURI) {
        console.error('Nose encontró la variable de entorno Mongo_URI');
        process.exit(1);//Finaliza el proceso si no hay URI
    }

    try {
        await mongoose.connect(dbURI);
        console.log('Conexion exitosa!');
    } catch (error) {
        console.error('Error de conexion:', error.message);
        process.exit(1);//finaliza el proceso en caso de error
    }
};

export default connectDB;