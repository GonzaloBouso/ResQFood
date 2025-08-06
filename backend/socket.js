import { Clerk } from "@clerk/clerk-sdk-node";

const userSocketMap = new Map();

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

let ioInstance = null;

export function initSockets(io) {
    ioInstance = io;

    //Middleware de autenticacion para Socket.IO
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        console.log('[Socket Auth] Intentando autenticar con token...');

        if (!token) {
            console.error('[Socket Auth] Error: No se proporcionó token.');
            return next(new Error('Authentication error: Token no proporcionado.'));
        }
        try {
            // Verifica el token usando el SDK de Clerk
            const claims = await clerk.verifyToken(token);
            const clerkUserId = claims.sub; // 'sub' es el ID de usuario en el token de Clerk

            // Asocia el clerkUserId al socket
            socket.clerkUserId = clerkUserId;
            console.log(`[Socket Auth] Éxito: Token verificado para clerkUserId: ${clerkUserId}`);
            next();
        } catch (error) {
            console.error('[Socket Auth] Error: Token inválido.', error.message);
            return next(new Error('Authentication error: Token inválido.'));
        }
    });
    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id} (Usuario Clerk: ${socket.clerkUserId})`);

        // Almacenar el mapeo
        userSocketMap.set(socket.clerkUserId, socket.id);

        // Mensaje de bienvenida o lógica inicial
        socket.emit('bienvenida', { message: 'Conectado exitosamente al servidor de notificaciones.' });

        // Limpiar el mapa cuando un usuario se desconecta
        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id} (Usuario Clerk: ${socket.clerkUserId})`);
            if (userSocketMap.get(socket.clerkUserId) === socket.id) {
                userSocketMap.delete(socket.clerkUserId);
            }
        });
    });
}

// Función para obtener la instancia de IO y usarla en los controladores
export function getIoInstance() {
    return ioInstance;
}

// Función para obtener el socket ID de un usuario si está conectado
export function getSocketIdForUser(clerkUserId) {
    return userSocketMap.get(clerkUserId);
}