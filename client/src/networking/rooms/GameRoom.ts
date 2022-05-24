import {Room} from "colyseus"
import Game from "../../Game";
import Player from "../../player/Player";
import {StateHandlerSchema} from "../schema/StateHandlerSchema"
import {PlayerSchema} from "../schema/PlayerSchema";
import Level from "../../levels/Level";

export default class GameRoom {
    private room: Room<StateHandlerSchema>;
    private clientPlayer: Player;
    private level: Level;

    constructor(level: Level) {
        this.level = level;
        this.clientPlayer = level.player;
    };

    public async connect() {
        await this.initJoinOrCreateRoom();
        this.onMessage();
        this.onStateChange();
        this.onAddPlayers();
        this.onRemovePlayers();
    }

    private async initJoinOrCreateRoom() {
        this.room = await Game.client.joinOrCreate<StateHandlerSchema>("GameRoom")   
        console.log(this.room.sessionId, "joined", this.room.name);    
    }

    private onMessage(){
        this.room.onMessage("key", (message) => {
            console.log(message);
        });
    }

    private onStateChange() {
        this.room.onStateChange((state: StateHandlerSchema) => {
            state.players.forEach((player: PlayerSchema, key: string) => {
                //updates other player if key does not equal to sessionID
                if (key !== this.room.sessionId) {
                    this.level.updateOtherPlayer(player);
                }
            });    
        });
    };

    private onAddPlayers(){
        this.room.state.players.onAdd = (player: PlayerSchema) => {
            console.log(player, "has been added at", player.sessionId);
            if(player.sessionId !== this.room.sessionId){
                this.level.addNewOtherPlayer(player);
            }
        };
    }

    private onRemovePlayers() {
        this.room.state.players.onRemove = (player: PlayerSchema) => {
            console.log(player, "has been removed", player.sessionId);
            this.level.removeOtherPlayer(player);
        };
    }


    public updatePlayerToServer(){
        const pos = this.clientPlayer.getPosition();
        const dir = this.clientPlayer.getDirection();
        const keys = this.clientPlayer.controls.keys;

        this.room.send("playerPosition", {x: pos.x, y: pos.y, z: pos.z});
        this.room.send("playerDirection", {rotationY: dir.y});
        this.room.send("playerKey", {up: keys.up, right: keys.right, down: keys.down, left: keys.left, jump: keys.jump});
        this.room.send("playerCrouching", {crouching: this.clientPlayer.crouching});
    }
}
