import {Image, Control, AdvancedDynamicTexture, TextBlock, StackPanel, Rectangle} from "@babylonjs/gui/2D";

export default class FullScreenUI {
    public advancedTexture: AdvancedDynamicTexture;

    constructor() {
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.addCrossHair();
        this.addPlayerControlInfo();
    }

    private addCrossHair() {
        let image = new Image('gunsight', 'assets/images/gunsight.jpg');
        
        image.stretch = Image.STRETCH_UNIFORM;
        image.width = 0.05;
        image.height = 0.05;
        image.left = '0px';
        image.top = '0px';
        image.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        image.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        image.isVisible = true;
        this.advancedTexture.addControl(image);
    }

    private addPlayerControlInfo() {
        const infoFrame = new Rectangle("infoFrame");
        infoFrame.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        infoFrame.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        infoFrame.paddingTop = 15;
        infoFrame.paddingLeft = 15;
        infoFrame.cornerRadius = 15;
        infoFrame.thickness = 2;
        infoFrame.widthInPixels = 370;
        infoFrame.heightInPixels = 285;
        this.advancedTexture.addControl(infoFrame);

        const infoStack = new StackPanel("infoStack");
        infoStack.paddingLeft = 10;
        infoStack.addControl(this.getInfoText("Move with:", "WASD or ARROW KEYS"));
        infoStack.addControl(this.getInfoText("Crouch with:", "C"));
        infoStack.addControl(this.getInfoText("Create checkpoint with:", "T"));
        infoStack.addControl(this.getInfoText("Go to latest checkpoint with:", "V"));
        infoStack.addControl(this.getInfoText("Restart level with:", "P"));
        infoStack.addControl(this.getInfoText("Set to first-person POV with:", "1"));
        infoStack.addControl(this.getInfoText("Set to third-person POV with:", "2"));
        infoFrame.addControl(infoStack);        
    }

    private getInfoText(infoText: string, commandText: string): StackPanel {
        const stack = new StackPanel("infoTextStack");
        stack.isVertical = false;
        stack.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        stack.widthInPixels = 360;
        stack.heightInPixels = 40;

        const infoBlock = new TextBlock("infoText");
        infoBlock.color = "white";
        infoBlock.paddingRight = 5;
        infoBlock.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        infoBlock.fontSize = 20;
        infoBlock.widthInPixels = 180;
        infoBlock.resizeToFit = true;
        infoBlock.heightInPixels = 20;
        infoBlock.text = infoText;
        infoBlock.fontFamily = "Helvetica";
        stack.addControl(infoBlock);

        const commandBlock = new TextBlock("commandText");
        commandBlock.color = "blue";
        commandBlock.heightInPixels = 20;
        commandBlock.widthInPixels = 180;
        commandBlock.resizeToFit = true;
        commandBlock.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
        commandBlock.fontSize = 20;
        commandBlock.text = commandText;
        commandBlock.fontFamily = "Helvetica";
        stack.addControl(commandBlock);
        return stack;
    }
}
