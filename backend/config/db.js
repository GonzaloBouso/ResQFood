import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()

const dbURI = process.env.Mongo_URI || 'mongodb://localhost:27017/test'

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión exitosa!')
    } catch (error) {
        console.log('Error de conexión', error.message);
        process.exit(1)
    }
}
export default connectDB