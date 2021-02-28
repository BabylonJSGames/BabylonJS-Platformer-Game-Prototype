import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder, } from "@babylonjs/core/Meshes/meshBuilder";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { PickingInfo } from "@babylonjs/core/Collisions/pickingInfo";
import { Ray } from "@babylonjs/core/Culling/ray";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import Config from "../Config";
import PlayerAnimator from "./PlayerAnimator";

// How many units away from roof/ground before we detect a collision?
const ROOF_COLLISION_THRESHOLD = 0.1;
const GROUND_COLLISION_THRESHOLD = 0.1;

// this class is a wrapper for the mesh class, and you can get the base mesh object by calling get()
export default class PlayerMesh {
    public scene: Scene;
    public ellipsoidMesh: Mesh;
    public animator: PlayerAnimator;
    public groundCollisionInfo: PickingInfo;
    public ceilingCollisionInfo: PickingInfo;

    private mesh: AbstractMesh;
    private isOtherPlayer: boolean;
    private height: number;
    private width: number;
    private name: string;

    constructor(name: string, modelFileName: string, height: number, width: number, modelScaling: number, animationSpeedRatio: number, scene: Scene, isOtherPlayer: boolean) {
        this.scene = scene;
        this.height = height;
        this.width = width;
        this.name = name;
        this.isOtherPlayer = isOtherPlayer;
        this.animator = new PlayerAnimator(this, name, modelFileName, modelScaling, animationSpeedRatio);
    }

    public async build() {
        this.mesh = MeshBuilder.CreateCylinder(this.name, {height: this.height, diameter: this.width});
        this.mesh.isPickable = false;
        this.mesh.checkCollisions = !this.isOtherPlayer;
        this.mesh.isVisible = false;

        // babylonjs uses ellipsoids to simulate mesh collisions when moving with camera, see: https://doc.babylonjs.com/divingDeeper/cameras/camera_collisions
        // sets the ellipsoid of this mesh to its bounding box
        if (!this.isOtherPlayer) {
            this.setEllipsoidToBoundingBox();
            if (Config.debugPlayer) {
                this.drawCollisionEllipsoid();
            }
        }

        // import and build animated models
        await this.animator.build();
    }

    public update() {
        this.groundCollisionInfo = this.castRayToGround();
        this.ceilingCollisionInfo = this.castRayToCeiling();
    }

    public get(): AbstractMesh {
        return this.mesh;
    }

    public setVisible(visible: boolean) {
        // set visibility for all children (and not the parent mesh)
        this.mesh.getChildMeshes().forEach(child => {
            child.isVisible = visible;
        });
    }

    public isOnGround(verticalOffset = 0): boolean {
        let onGround = false;
        const compareWith = this.mesh.getBoundingInfo().minimum.y + this.mesh.position.y + verticalOffset;
        if(this.groundCollisionInfo && this.groundCollisionInfo.hit) {
            const pickedY = this.groundCollisionInfo.pickedPoint.y;
            onGround = (pickedY + GROUND_COLLISION_THRESHOLD) >= compareWith;

        }
        return onGround;
    }

    public isOnCeiling(verticalOffset = 0): boolean {
        let onCeiling = false;
        const compareWith = this.mesh.getBoundingInfo().maximum.y + this.mesh.position.y + verticalOffset;
        if(this.ceilingCollisionInfo && this.ceilingCollisionInfo.hit) {
            const pickedY = this.ceilingCollisionInfo.pickedPoint.y;
            onCeiling = pickedY < (compareWith + ROOF_COLLISION_THRESHOLD);

        }
        return onCeiling;
    }

    public setToGroundLevel() {
        this.groundCollisionInfo = this.castRayToGround();
        if (this.isOnGround()) {
            const pickedY = this.groundCollisionInfo.pickedPoint.y;
            this.mesh.position.y =
                pickedY + GROUND_COLLISION_THRESHOLD - this.mesh.getBoundingInfo().minimum.y;
        }
    }

    private castRayToGround(): PickingInfo {
        // we want to cast from top of mesh to ensure the pickedY is the correct mesh
        // otherwise you will sometimes experience the ray cast to go straight through
        // we do something similar with castRayToCeiling
        const castFrom = this.mesh.position.clone();
        castFrom.y += this.mesh.getBoundingInfo().maximum.y - 0.2;
        const ray = new Ray(castFrom, new Vector3(0, -1, 0));
        return this.mesh.getScene().pickWithRay(ray);
    }

    private castRayToCeiling(): PickingInfo {
        const castFrom = this.mesh.position.clone();
        castFrom.y += this.mesh.getBoundingInfo().minimum.y + 0.2;
        const ray = new Ray(castFrom, new Vector3(0, 1, 0));
        return this.mesh.getScene().pickWithRay(ray);
    }

    public setEnabled(enabled: boolean) {
        this.mesh.setEnabled(enabled);
        this.animator.setEnabled(enabled);
        if (this.ellipsoidMesh != null) {
            this.ellipsoidMesh.setEnabled(enabled);
        }
    }

    private drawCollisionEllipsoid() {
        this.mesh.refreshBoundingInfo();    
        
        const ellipsoidMesh = MeshBuilder.CreateSphere("collisionEllipsoid", { 
            diameterX: this.mesh.ellipsoid.x * 2,
            diameterZ: this.mesh.ellipsoid.z * 2,
            diameterY: this.mesh.ellipsoid.y * 2
            }, this.mesh.getScene());
        
            ellipsoidMesh.position = this.mesh.getAbsolutePosition().add(this.mesh.ellipsoidOffset);

        const material = new StandardMaterial("collider", this.mesh.getScene());
        material.wireframe = true;
        material.diffuseColor = Color3.Yellow();
        ellipsoidMesh.material = material;
        ellipsoidMesh.visibility = .3;
 
        ellipsoidMesh.isPickable = false;
        ellipsoidMesh.checkCollisions = false;
        this.ellipsoidMesh = ellipsoidMesh;
    }

    private setEllipsoidToBoundingBox() {
        const bb = this.mesh.getBoundingInfo().boundingBox;
        this.mesh.ellipsoid = bb.maximumWorld.subtract(bb.minimumWorld).scale(0.5);
    }

    public dispose() {
        this.mesh.dispose();
        if (this.ellipsoidMesh != null){
            this.ellipsoidMesh.dispose();
        }
        this.mesh = null;
        this.ellipsoidMesh = null;
    }
}
