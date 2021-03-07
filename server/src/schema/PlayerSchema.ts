import {Schema, type} from '@colyseus/schema';

export class PlayerDirectionSchema extends Schema {
    @type('number') public rotationY: number;
}

export class PlayerCrouchSchema extends Schema {
    @type('boolean') public crouching: boolean;
}

export class PlayerKeySchema extends Schema {
    @type('boolean') public up: boolean;
    @type('boolean') public right: boolean;
    @type('boolean') public down: boolean;
    @type('boolean') public left: boolean;
    @type('boolean') public jump: boolean;
}

export class PlayerPositionSchema extends Schema {
    @type('number') public x: number;
    @type('number') public y: number;
    @type('number') public z: number;
}

export class PlayerSchema extends Schema {

    @type('string') public sessionId: string;
    @type(PlayerPositionSchema) public playerPosition = new PlayerPositionSchema();
    @type(PlayerDirectionSchema) public playerDirection = new PlayerDirectionSchema();
    @type(PlayerKeySchema) public playerKey = new PlayerKeySchema();
    @type(PlayerCrouchSchema) public playerCrouch = new PlayerCrouchSchema();
}
