import { Scene } from "@babylonjs/core/scene";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import "@babylonjs/loaders";
import "@babylonjs/inspector";

import Player from "../player/Player";
import FullScreenUI from "../ui/FullScreenUI";
import GoalMesh from "./components/GoalMesh";
import OtherPlayer from "../player/OtherPlayer";
import Game from "../Game";
import Config from "../Config";
import { PlayerSchema } from "../networking/schema/PlayerSchema";
import Timer from "./components/Timer";
import Spawn from "./components/Spawn";
import AudioManager from "./AudioManager";
import { HemisphericLight, SubMesh } from "@babylonjs/core";

export default class Level {
    public scene: Scene;
    public player: Player;
    public ui: FullScreenUI;
    public audioManager: AudioManager;
    public spawn: Spawn;
    public goal: GoalMesh;
    public otherPlayersMap: Map<string, OtherPlayer>;
    public startLevelTimer: Timer;
    public checkPointLimit: number;

    private isFrozen: boolean
    private fileName: string;

    constructor(fileName: string) {
        this.initializeScene();
        this.setupListeners();

        this.isFrozen = false;
        this.fileName = fileName;
        this.otherPlayersMap = new Map;
        this.checkPointLimit = 5; // how many checkpoints can the player make per level
        this.player = new Player(this);
        this.audioManager = new AudioManager(this.scene);
    }

    private initializeScene() {
        this.scene = new Scene(Game.engine);
        this.scene.collisionsEnabled = true;
        if (Config.showInspector) {
            this.scene.debugLayer.show();
        }
    }

    public async build() {
        await this.importLevel();
        // add a skybox internally to the level
        this.createSkyBox();
        await Promise.all([this.player.build(), this.audioManager.loadAudio()]);
        this.ui = new FullScreenUI();

        this.startLevelTimer = new Timer(this.ui);
        this.startLevelTimer.start();
    }

    private async importLevel() {
        await SceneLoader.AppendAsync("assets/scenes/", this.fileName, this.scene);
        this.applyModifiers();
    }

    private applyModifiers() {
        this.scene.meshes.forEach(mesh => {
            // set colliders and whether we can pick mesh with raycast
            const isCollider = mesh.name.includes("Collider");
            mesh.checkCollisions = isCollider;
            mesh.isPickable = isCollider;
        });

        // If no lightning is added from blender add it manually
        if (this.scene.lights.length == 0) {
            this.setupLighting();
            
        } else {   
            
        }

        this.setupSpawn();
        this.setupGoal();
    }

    private setupSpawn() {
        let spawnMesh = this.scene.getMeshByName("Spawn");
        if (spawnMesh == null) {
            throw new Error("No mesh in scene with a 'Spawn' ID!");
        }
        const spawnPos = spawnMesh.position.clone();
        // get lookAt mesh for initial player view direction
        let lookAtMesh = this.scene.getMeshByName("LookAt");
        let lookAt = Vector3.Zero();
        if (lookAtMesh != null) {
            lookAt = lookAtMesh.position.clone();
        }
        this.spawn = new Spawn(spawnPos, lookAt);
        // destroy spawnMesh and lookAtMesh after they have been retrieved
        spawnMesh.dispose();
        spawnMesh = null;
        // dispose only if LookAt exists as a mesh inside scene
        if(lookAtMesh){
            lookAtMesh.dispose();
            lookAtMesh = null;
        }
    }

    // todo - verify that there is only a single goal mesh
    private setupGoal() {
        const goalMesh = this.scene.getMeshByID("Goal");
        if (goalMesh == null) {
            throw new Error("No mesh in scene with a 'Goal' ID!");
        }
        this.goal = new GoalMesh(this, goalMesh);
    }

    private setupLighting() {
        // setup light
        new HemisphericLight("HemiLight", new Vector3(0, 1, 0), this.scene);
    }

    // called after finishing level
    public setFrozen(frozen: boolean) {
        // player can no longer move if frozen
        this.isFrozen = frozen;
        this.startLevelTimer.setPaused(frozen);
        if (frozen) {
            this.exitPointerLock();
        }
    }

    public async addNewOtherPlayer(playerSchema: PlayerSchema) {
        const otherPlayer = new OtherPlayer(playerSchema.sessionId, this);
        await otherPlayer.build();
        otherPlayer.update(playerSchema);
        this.otherPlayersMap.set(playerSchema.sessionId, otherPlayer);
    }

    public removeOtherPlayer(playerSchema: PlayerSchema) {
        this.otherPlayersMap.get(playerSchema.sessionId).dispose();
        this.otherPlayersMap.delete(playerSchema.sessionId);
    }

    public updateOtherPlayer(playerSchema: PlayerSchema) {
        const otherPlayer = this.otherPlayersMap.get(playerSchema.sessionId);
        if(otherPlayer) {
            otherPlayer.update(playerSchema);
        }
    }

    public update() {
        this.scene.render();
    }

    public restart() {
        this.player.respawn();
        this.startLevelTimer.restart();
    }

    private setupListeners() {
        // Lock cursor
        Game.canvas.addEventListener("click", () => {
            if (!this.isFrozen) {
                this.requestPointerLock();
            }
        }, false);

        // update function for level components
        this.scene.registerBeforeRender(() => {
            if (!this.isFrozen) {
                this.player.update();
                this.goal.update();
            }
        });
    }

    private requestPointerLock() {
        if (Game.canvas.requestPointerLock) {
            Game.canvas.requestPointerLock();
        }
    }

    private exitPointerLock() {
        document.exitPointerLock();
    }

    private createSkyBox() {
        // creating skybox
        let skybox = MeshBuilder.CreateBox("skyBox", { size: 10000.0 }, this.scene);
        let skyboxMaterial = new StandardMaterial("skyboxMaterial", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("assets/textures/skybox", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }
}
