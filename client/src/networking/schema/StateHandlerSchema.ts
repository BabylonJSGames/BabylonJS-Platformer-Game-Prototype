import {Schema, type, MapSchema} from '@colyseus/schema';

import {PlayerSchema} from './PlayerSchema';

export class StateHandlerSchema extends Schema {

    @type({map: PlayerSchema})
    players = new MapSchema<PlayerSchema>();

    addPlayer(sessionId: string) {
        this.players.set(sessionId, new PlayerSchema(sessionId));
    }

    getPlayer(sessionId: string): PlayerSchema {
        return this.players.get(sessionId);
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    setKeys(sessionId: string, up: boolean, right: boolean, down: boolean, left: boolean, jump: boolean, crouch: boolean) {
        this.getPlayer(sessionId).playerKey.up = up;
        this.getPlayer(sessionId).playerKey.right = right;
        this.getPlayer(sessionId).playerKey.down = down;
        this.getPlayer(sessionId).playerKey.left = left;
        this.getPlayer(sessionId).playerKey.jump = jump;
        this.getPlayer(sessionId).playerKey.crouch = crouch;
    }

    setPosition(sessionId: string, x: number, y: number, z: number) {
            this.getPlayer(sessionId).playerPosition.x = x;
            this.getPlayer(sessionId).playerPosition.y = y;
            this.getPlayer(sessionId).playerPosition.z = z;
    }

    getPosition(sessionId: string): object {
        const pos = this.getPlayer(sessionId).playerPosition;
        return {'x': pos.x, 'y': pos.y, 'z': pos.z};
    }

    setDirection(sessionId: string, rotationY: number){
        this.getPlayer(sessionId).playerDirection.rotationY = rotationY;
    }

    getDirection(sessionId: string): object {
        return {"rotationY": this.getPlayer(sessionId).playerDirection.rotationY}
    }
}
