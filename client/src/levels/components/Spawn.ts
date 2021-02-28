import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export default class Spawn {
    public lookAt: Vector3;
    public spawnPoint: Vector3;

    constructor(spawnPoint: Vector3, lookAt: Vector3) {
        this.lookAt = lookAt;
        this.spawnPoint = spawnPoint;
    }

    public clone(): Spawn {
        return new Spawn(this.spawnPoint.clone(), this.lookAt.clone());
    }
}
