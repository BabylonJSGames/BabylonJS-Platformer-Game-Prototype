import express from "express";
import cors from 'cors';
import { createServer } from "http";
import { Server } from "@colyseus/core";
import { monitor } from "@colyseus/monitor";
import { WebSocketTransport } from "@colyseus/ws-transport";

import { GameRoom } from "./rooms/GameRoom";
import { ChatRoom } from "./rooms/ChatRoom";

const port = Number(process.env.PORT || 8081);
const app = express();

app.use(cors({ origin: true }));
app.use(express.json())


const gameServer = new Server({
    transport: new WebSocketTransport({ 
        server: createServer(app)
    }),
})

gameServer.define("ChatRoom", ChatRoom);
gameServer.define("GameRoom", GameRoom);

//useful for simulating latency.
//gameServer.simulateLatency(200);

gameServer.onShutdown(() => {
    console.log("Server is shutting down.");
});

app.use("/colyseus", monitor());

gameServer.listen(port);
console.log("listening on http://localhost:" + port);
