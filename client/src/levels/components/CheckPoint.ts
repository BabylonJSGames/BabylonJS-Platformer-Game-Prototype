import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Control, TextBlock } from "@babylonjs/gui/2D";

import Player from "../../player/Player";

export default class CheckPoint {
    public position: Vector3;
    public cameraRotation: Vector3;

    private player: Player;
    private count: number;
    private limit: number
    private timeoutHandle: number;
    private uiText: TextBlock;

    constructor(player: Player) {
        this.player = player;
        this.count = 0;
        this.limit = this.player.level.checkPointLimit;
        this.set();
    }

    private set() {
        this.position = this.player.mesh.get().position.clone();
        this.cameraRotation = this.player.camera.get().rotation.clone();
    }

    public save(onGround: boolean) {
        // do not make checkpoint if player can not make more checkpoints
        if (this.count >= this.limit) {
            this.showMessage("You have no more checkpoints left!", true);
        }
        // do not allow checkpoint if player is not standing on the ground
        else if (!onGround) {
            this.showMessage("You must be on the ground!", true);
        } else {
            this.set();
            this.count++;
            this.showMessage("Created a new checkpoint (" + this.count + "/" + this.limit + ")");
        }
    }

    public load() {
        this.player.mesh.get().position = this.position.clone();
        this.player.camera.get().position = this.position.clone();
        this.player.camera.get().rotation = this.cameraRotation.clone();
        this.player.hSpeed = 0;
        this.player.vSpeed = 0;
        this.showMessage("Loaded your latest checkpoint!");
    }

    private showMessage(message: string, isError = false) {
        if (this.uiText) {
            this.uiText.dispose();
        }
        this.uiText = new TextBlock("checkpointText");
        this.uiText.color =(isError) ? "red" : "green";
        this.uiText.fontSize = 32;
        this.uiText.widthInPixels = 1000;
        this.uiText.heightInPixels = 100;
        this.uiText.fontFamily = "Helvetica";
        this.uiText.text = message;
        this.uiText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.uiText.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.uiText.top = -100;
        this.player.level.ui.advancedTexture.addControl(this.uiText);

        window.clearTimeout(this.timeoutHandle);
        this.timeoutHandle = window.setTimeout(() => {
            this.uiText.dispose();
            this.uiText = null;
        }, 5000);
    }
}
