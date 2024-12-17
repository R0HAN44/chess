import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
    console.log('New user connected');
    gameManager.addUser(ws);

    // Use the 'close' event instead of 'disconnect'
    ws.on('close', () => {
        console.log('User disconnected');
        gameManager.removeUser(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});