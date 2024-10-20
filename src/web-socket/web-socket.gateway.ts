import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as extract from './../../utils/extract'
import { error } from 'console';

type TNotificacaoType  = 'error' | 'warn' | 'success' | 'log'

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  static notificacao(message: string, type: TNotificacaoType, client: Socket){
    client.emit('notification', JSON.stringify({message, type}))
  }

  // Método para escutar eventos do cliente
  @SubscribeMessage('search')
  async handleMessage(
    @MessageBody() data: string, 
    @ConnectedSocket() client: Socket
  ) {
      const response: {type: 'novas' | 'maiores', estado: string} = JSON.parse(data)
    
      await extract.exec(
        { 
          sigla: response.estado,
          tipo: response.type 
        }, 
        (msg: string, type: TNotificacaoType) =>{ 
          console.log(msg, type)
          SocketGateway.notificacao(msg, type, client) 
        },
        (empresa: Record<string, any>) => {
          client.emit('empresa', JSON.stringify(empresa))
        }
      )
      .catch(e => {
        console.log('catch event', error)
        SocketGateway.notificacao(e.message, 'error', client)
      })
    
      
    
    
  }

  // Opcional: Quando um cliente se conecta, você pode logar o ID do socket
  handleConnection(client: Socket) {
    console.log('Cliente conectado: ', client.id);
  }
}
