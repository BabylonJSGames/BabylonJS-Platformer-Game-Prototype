import { Control, TextBlock } from "@babylonjs/gui/2D";

import FullScreenUI from "../../ui/FullScreenUI";

export default class Timer {
    public timeSpent: number;

    private ui: FullScreenUI;
    private timerText: TextBlock;
    private paused: boolean;

    constructor(ui: FullScreenUI) {
        this.timeSpent = 0.0;
        this.ui = ui;
        this.show();
    }

    public restart() {
        this.timeSpent = 0;
    }

    public start() {
        window.setInterval(() => {
            if (!this.paused) {
                this.timeSpent += 0.1;
                this.timerText.text = this.timeSpent.toFixed(1);
            }
        }, 100);
    }

    public setPaused(paused: boolean) {
       this.paused = paused;
    }

    private show() {
        const adt = this.ui.advancedTexture;

         // popup text
         this.timerText = new TextBlock("timerText");
         this.timerText.color = "white";
         this.timerText.fontSize = 32;
         this.timerText.widthInPixels = 200;
         this.timerText.heightInPixels = 100;
         this.timerText.fontFamily = "Helvetica";
         this.timerText.text = "0.0";
         this.timerText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
         this.timerText.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
         adt.addControl(this.timerText);
    }
}
