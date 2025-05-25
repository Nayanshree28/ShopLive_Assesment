import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: 'products',
})
export class ProductsGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('⚡ WebSocket Gateway ready');
    console.log(`🌐 WebSocket CORS enabled for: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
  }

  emitCreated(product: unknown) {
    this.server.emit('product_created', product);
  }

  emitUpdated(product: unknown) {
    this.server.emit('product_updated', product);
  }
}