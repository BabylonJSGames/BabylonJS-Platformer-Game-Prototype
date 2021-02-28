import {Engine} from "@babylonjs/core/Engines/engine";
import {Client} from "colyseus.js";

import Level from "./levels/Level";
import GameRoom from "./networking/rooms/GameRoom";
import ChatRoom from "./networking/rooms/ChatRoom";
import Config from "./Config";

export default class Game {
    public static canvas: HTMLCanvasElement;
    public static engine: Engine;
    public static client: Client;
    public static currentLevel: Level;

    private gameRoom: GameRoom;
    private chatRoom: ChatRoom;

    constructor(canvasElement: string) {
        Game.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        Game.engine = new Engine(Game.canvas, true);

        this.init();
    };

    public init() {
        this.setupListeners();
        this.setupSockets();
        Game.currentLevel = new Level(Config.levelName);
        Game.canvas.focus();
    }

    public async start() {
        await Game.currentLevel.build();

        if (Config.useNetworking) {
            this.gameRoom = new GameRoom(Game.currentLevel);
            this.chatRoom = new ChatRoom();
            await Promise.all([this.gameRoom.connect(), this.chatRoom.connect()]);
        }

        this.startGameLoop();
    }

    private startGameLoop() {
        Game.engine.runRenderLoop(() => {
            Game.currentLevel.update();

            if (Config.useNetworking) {
                this.gameRoom.update();
            }

            let fpsLabel = document.getElementById("fps_label");
            fpsLabel.innerHTML = Game.engine.getFps().toFixed() + "FPS";
        });
    }

    private setupListeners() {
        window.addEventListener("resize", function () {
            Game.engine.resize();
        });
    }

    private setupSockets() {
        const hostDevelopment = location.host.replace(/:.*/, ''); // localhost
        const portDevelopment = location.port.slice(0, -1) + 1; // 8081
        let socketAddressDevelopment = location.protocol.replace("http", "ws") + "//" + hostDevelopment;
        if (portDevelopment) {
            socketAddressDevelopment += ':' + portDevelopment;
        }
        if (hostDevelopment === "localhost") {
            Game.client = new Client(socketAddressDevelopment);
        } else {
            Game.client = new Client(Config.socketAddressProduction);
        }

        console.log("DEV HOST: " +hostDevelopment);
        console.log("DEV PORT: " + portDevelopment);
        console.log("DEV SOCKET: " + socketAddressDevelopment);
        console.log("PROD SOCKET: " + Config.socketAddressProduction);
    }
}
