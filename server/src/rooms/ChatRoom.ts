import {Room} from 'colyseus';

export class ChatRoom extends Room {
    maxClients = 64;

    // When room is initialized
    onCreate(options: any){
        console.log("ChatRoom created!", options);

        //For chat
        this.onMessage("message", (client, message) => {
            console.log("ChatRoom received message from: ", client.sessionId, ":", message);
            this.broadcast("messages", "proadcast: " + `(${client.sessionId}) ${message}`);
        });
    }
    
    // When client successfully join the room
    onJoin (){}

    // When a client leaves the room
    onLeave() {}

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose() {}
}