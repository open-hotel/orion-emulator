import { WebSocketGateway, OnGatewayConnection } from "@nestjs/websockets";

@WebSocketGateway({ namespace: '/orion' })
export class WebShellGateway implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]) {
    console.log('CONEXAO!')
    return 1
  }
}