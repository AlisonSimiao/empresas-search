import { Module } from '@nestjs/common';
import { SocketGateway } from './web-socket/web-socket.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot(
      (() => {
        const publicDir = resolve('./public');
        const servePath = '/';

        return {
          rootPath: publicDir,
          serveRoot: servePath,
          exclude: ['/api*'],
        };
      })(),
    )
  ],
  providers: [SocketGateway],
})
export class AppModule {}
