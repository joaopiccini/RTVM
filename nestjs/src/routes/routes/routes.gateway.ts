import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoutesGateway {
  @SubscribeMessage('new-points')
  handleMessage(
    client: Socket,
    payload: { route_id: string; lat: number; lng: number },
  ): string {
    client.broadcast.emit('admin-new-point', payload);
    client.broadcast.emit(`new-point/${payload.route_id}`, payload);
    return 'Hello world!';
  }
}
