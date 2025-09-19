import { Clerk } from "@clerk/clerk-sdk-node";

const userSocketMap = new Map();
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
let ioInstance = null;


export function configureSocket(io) {
    ioInstance = io; 

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: Token no proporcionado.'));
        }
        try {
            const claims = await clerk.verifyToken(token);
            socket.clerkUserId = claims.sub;
            next();
        } catch (error) {
            return next(new Error('Authentication error: Token inválido.'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id} (Usuario Clerk: ${socket.clerkUserId})`);
        userSocketMap.set(socket.clerkUserId, socket.id);
        socket.on('disconnect', () => {
            if (userSocketMap.get(socket.clerkUserId) === socket.id) {
                userSocketMap.delete(socket.clerkUserId);
            }
        });
    });
}


export function getIoInstance() {
    if (!ioInstance) throw new Error('Socket.IO no ha sido inicializado!');
    return ioInstance;
}

export function getSocketIdForUser(clerkUserId) {
    return userSocketMap.get(clerkUserId);
}