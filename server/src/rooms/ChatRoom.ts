import {Room, Client} from '@colyseus/core';

export class ChatRoom extends Room {
    maxClients = 64;
    private utc = new Date().toLocaleString();

    // When room is initialized
    onCreate(options: any){
        console.log("ChatRoom created!", options);

        //For chat
        this.onMessage("message", (client, message) => {
            console.log("ChatRoom received message from: ", client.sessionId, ":", message);
            this.broadcast("messages", this.utc +"| " + "message from " + client.sessionId +": "+ message );
        });
    }
    
    // When client successfully join the room
    onJoin (client: Client, options: any, auth: any){
        this.broadcast("messages", this.utc +"| "+ client.sessionId + " joined chat room");
    }

    // When a client leaves the room
    onLeave(client: Client, consented: boolean) {
        this.broadcast("messages", this.utc +"| "+ client.sessionId + " left chat room");
    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() {}
}