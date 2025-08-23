import { Server } from 'socket.io';
import { Clerk } from "@clerk/clerk-sdk-node";

const userSocketMap = new Map();
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
let ioInstance = null;

export function initSocket(httpServer) {
    

    ioInstance = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    ioInstance.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        console.log('[Socket Auth] Intentando autenticar con token...');

        if (!token) {
            console.error('[Socket Auth] Error: No se proporcionó token.');
            return next(new Error('Authentication error: Token no proporcionado.'));
        }
        try {
            const claims = await clerk.verifyToken(token);
            const clerkUserId = claims.sub;

            socket.clerkUserId = clerkUserId;
            console.log(`[Socket Auth] Éxito: Token verificado para clerkUserId: ${clerkUserId}`);
            next();
        } catch (error) {
            console.error('[Socket Auth] Error: Token inválido.', error.message);
            return next(new Error('Authentication error: Token inválido.'));
        }
    });

    ioInstance.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id} (Usuario Clerk: ${socket.clerkUserId})`);

        userSocketMap.set(socket.clerkUserId, socket.id);
        socket.emit('bienvenida', { message: 'Conectado exitosamente al servidor de notificaciones.' });

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id} (Usuario Clerk: ${socket.clerkUserId})`);
            if (userSocketMap.get(socket.clerkUserId) === socket.id) {
                userSocketMap.delete(socket.clerkUserId);
            }
        });
    });

    return ioInstance;
}

export function getIoInstance() {
    if (!ioInstance) {
        throw new Error('Socket.IO no ha sido inicializado!');
    }
    return ioInstance;
}

export function getSocketIdForUser(clerkUserId) {
    return userSocketMap.get(clerkUserId);
}