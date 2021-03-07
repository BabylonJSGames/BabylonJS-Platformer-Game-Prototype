import Level from "../levels/Level";
import {PlayerSchema} from "../networking/schema/PlayerSchema";
import AbstractPlayer, { MoveDirection } from "./AbstractPlayer";
import { IMoveKeys } from "./PlayerControls";

export default class OtherPlayer extends AbstractPlayer {
    public sessionId: string;

    constructor(sessionId: string, level: Level) {
        super(level, true);
        this.sessionId = sessionId;
    }

    public update(playerSchema: PlayerSchema) {
        const newPos = playerSchema.playerPosition;
        const newDir = playerSchema.playerDirection;
        const newKeys = playerSchema.playerKey;
        const newCrouch = playerSchema.playerCrouch.crouching;

        this.mesh.update();
        const onGround = this.mesh.isOnGround();
        const moveDirection = this.getMoveDirection(newKeys);
        this.mesh.get().position.set(newPos.x, newPos.y, newPos.z);
        this.mesh.get().rotation.y = newDir.rotationY;

        this.handleKeys(newKeys, newCrouch, onGround, moveDirection);
    }

    private handleKeys(keys: IMoveKeys, newCrouch: boolean, onGround: boolean, moveDirection: MoveDirection) {

        // animations
        this.mesh.animator.update(moveDirection, onGround);

        // crouch
        if (newCrouch != this.crouching) {
            this.crouching = newCrouch;
            this.switchMesh(newCrouch);
        }
    }
}
