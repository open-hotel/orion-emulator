import { WebSocketGateway, MessageBody, ConnectedSocket, OnGatewayInit, WebSocketServer, SubscribeMessage, OnGatewayDisconnect } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io';
import { PathFinder } from '../../packages/core/lib/PathFinder';
import { RoomState, UserState } from './RoomState';
import stairsMock from './stairs.mock'

declare module 'socket.io' {
    interface Socket {
        currentRoom: string
    }
}

@WebSocketGateway()
export class RoomGateway implements OnGatewayInit, OnGatewayDisconnect {
    private server: Server
    private rooms: WeakMap<any, RoomState> = new Map()

    @SubscribeMessage('room:join')
    joinRoom (
        @MessageBody()
        msgBody: { roomId: string },
        @ConnectedSocket()
        socket: Socket
    )
    {
        let roomState = this.rooms.get(msgBody.roomId)
        if (!roomState) {
            roomState =  new RoomState({
                map: stairsMock.map
            })
            this.rooms.set(msgBody.roomId, roomState)
        }
        const room = `rooms/${msgBody.roomId}`
        const userState: UserState = {
            position: [0, 0],
            socketId: socket.id,
            pathBeingFollowed: []
        }
        roomState.users.set(socket.id, userState)
        socket.join(room)
        socket.currentRoom = msgBody.roomId
        socket.emit('room:state', roomState.toJSON())
        socket.to(room).emit('room:join', userState)
    }

    @SubscribeMessage('user:speak')
    speak (
        @MessageBody()
        msgBody: { text: string, roomId: string },
        @ConnectedSocket()
        socket: Socket
    )
    {
        const room = `rooms/${msgBody.roomId}`
        const payload = {
            from: socket.id,
            text: msgBody.text,
            timestamp: Date.now()
        }
        this.server.in(room).emit('user:speak', payload)
    }

    @SubscribeMessage('user:walk')
    walk (
        @MessageBody()
        position: [number, number],
        @ConnectedSocket()
        socket: Socket
    )
    {
        const roomState = this.rooms.get(socket.currentRoom)
        const pathFinder = new PathFinder(roomState.map)

        const user = roomState.users.get(socket.id)
        const [x, y] = user.position
        const [toX, toY] = position

        const path = pathFinder.find({ x, y }, { x: toX, y: toY })
        user.pathBeingFollowed = path
        const room = `rooms/${socket.currentRoom}`
        this.server.in(room).emit('user:walk', { path, socketId: socket.id })
    }

    @SubscribeMessage('user:step')
    userStep (
        @ConnectedSocket()
        socket: Socket
    )
    {
        const roomState = this.rooms.get(socket.currentRoom)
        const user = roomState.users.get(socket.id)
        user.position = user.pathBeingFollowed.shift()
    }

    handleDisconnect (socket: Socket) {
        if (!socket.currentRoom) {
            return
        }
        const room = `rooms/${socket.currentRoom}`
        const roomState = this.rooms.get(socket.currentRoom)
        console.log('disconnect', socket.id, socket.currentRoom)
        roomState.users.delete(socket.id)
        this.server.to(room).emit('user:leave', { socketId: socket.id })
    }

    afterInit (server: Server) {
        this.server = server
        // setInterval(() => {
        //     server.emit('speak', 'Hello World')
        // }, 2000)
    }
}
