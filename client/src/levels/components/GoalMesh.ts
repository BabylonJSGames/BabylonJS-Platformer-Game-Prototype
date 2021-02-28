import { MeshBuilder, } from "@babylonjs/core/Meshes/meshBuilder";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { AdvancedDynamicTexture, Button, Container, Control, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui/2D";

import Level from "../Level";

export default class GoalMesh {
    private mesh: AbstractMesh;
    private goalTextMesh: AbstractMesh;
    private level: Level;
    
    constructor(level: Level, mesh: AbstractMesh) {
        this.level = level;
        this.mesh = mesh;
        this.addGoalUI();
    }

    private addGoalUI() {
        const dim =  this.mesh.getBoundingInfo().maximum.multiply(this.mesh.scaling);
        const verticalOffset = 3; // 2 units above top of mesh
        this.goalTextMesh = MeshBuilder.CreatePlane("goalTextPlane", {width: dim.x*4, height: dim.y*4}, this.level.scene);
        this.goalTextMesh.position.set(this.mesh.position.x, this.mesh.position.y + dim.y + verticalOffset, this.mesh.position.z);
        // render this mesh in front of everything
        this.goalTextMesh.renderingGroupId = 1;
        const ui = AdvancedDynamicTexture.CreateForMesh(this.goalTextMesh, 1024, 1024, false);
        const text = new TextBlock();
        text.text = "Goal";
        text.color = "white";
        text.fontSize = 400;
        ui.addControl(text);
    }

    private showGoalPopup() {
        // popup window
        const rectangle = new Rectangle();
        rectangle.background = "#878BFF";
        rectangle.color = "black";
        rectangle.cornerRadius = 20;
        rectangle.thickness = 5;
        rectangle.widthInPixels = 600;
        rectangle.heightInPixels = 400;
        this.level.ui.advancedTexture.addControl(rectangle);

        // stack panel
        const stackPanel = new StackPanel("goalStackpanel");
        stackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        rectangle.addControl(stackPanel);

        // popup text
        const goalText = new TextBlock("goalText");
        goalText.paddingBottomInPixels = 20;
        goalText.fontFamily = "Helvetica";
        goalText.textWrapping = true;
        goalText.lineSpacing = 15;
        goalText.text = "Congratulations, you beat the map!\nYour final time was " +
            this.level.startLevelTimer.timeSpent.toFixed(1) + " seconds.\nYour current position on the leaderboard: 1st";
        goalText.color = "white";
        goalText.fontSize = 24;
        goalText.widthInPixels = 550;
        goalText.heightInPixels = 200;
        stackPanel.addControl(goalText);

        // panel for buttons
        const panel = new StackPanel("goalButtonPanel");
        panel.width = stackPanel.width;
        panel.widthInPixels = 400;
        panel.heightInPixels = 100;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        panel.isVertical = false;
        stackPanel.addControl(panel);

        // restart button
        const restartButton = this.createButton("restartButton", "Restart", panel);
        restartButton.paddingRightInPixels = 15;
        restartButton.onPointerClickObservable.add(() => {
            this.level.restart();
            this.level.setFrozen(false);
            rectangle.dispose();
        });

        // view leaderboard button
        const boardButton = this.createButton("boardButton", "View Leaderboard", panel);
        boardButton.paddingLeftInPixels = 15;
        boardButton.onPointerClickObservable.add(() => {
            // TODO - leaderboard does not exist yet
        });

        // back-to-lobby button
        const backButton = this.createButton("backButton", "Back to lobby", stackPanel);
        backButton.onPointerClickObservable.add(() => {
            // TODO - lobby does not exist yet
        });
    }

    private createButton(name: string, text: string, parent?: Container): Button {
        const button = Button.CreateSimpleButton(name, text);
        button.widthInPixels = 200;
        button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        button.heightInPixels = 60;
        button.cornerRadius = 20;
        button.thickness = 4;
        button.children[0].color = "white";
        button.children[0].fontSize = 20;
        button.color = "black";
        button.background = "#3FA938";
        parent.addControl(button);
        return button;
    }

    public update() {
        // use onGround and onCeiling since apparently intersectsMesh doesn't work very well
        const playerMesh = this.level.player.mesh;
        const onGround = playerMesh.isOnGround() && playerMesh.groundCollisionInfo.pickedMesh.uniqueId == this.mesh.uniqueId;
        const onCeiling = playerMesh.isOnCeiling() && playerMesh.ceilingCollisionInfo.pickedMesh.uniqueId == this.mesh.uniqueId;
        if (onGround || onCeiling || this.mesh.intersectsMesh(playerMesh.get())) {
            this.level.setFrozen(true);
            this.showGoalPopup();
        }
        // rotate goalTextMesh to always face towards the player
        const target = this.goalTextMesh.position.scale(2).subtract(playerMesh.get().position);
        this.goalTextMesh.lookAt(target);
    }
}
