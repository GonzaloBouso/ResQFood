import User from '../models/User.js';

export class UserController {
    static async createUser(req, res){
        try {
            const nuevoUsuario = new User(req.body);
            await nuevoUsuario.save()
            res.status(200).json(nuevoUsuario)
        } catch (error) {
            console.log('Error al crear usuario:',error);
            res.status(400).json({message:'Error al crear el usuario', error:error.message})
        }
    }
}