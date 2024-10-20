import { Module } from '@nestjs/common';
import { SocketGateway } from './web-socket/web-socket.gateway';

@Module({
  providers: [SocketGateway],
})
export class AppModule {}
