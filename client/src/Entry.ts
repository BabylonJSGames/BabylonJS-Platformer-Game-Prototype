import {Engine} from "@babylonjs/core/Engines";
import Game from './Game';

const app = {
    init() {
        const canvasElement = "renderCanvas"; 
        const game = new Game(canvasElement);
        game.start();
    }
}

//Initialize Game
window.addEventListener('DOMContentLoaded', () => {
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            if (Engine.isSupported()) {
                app.init();
            } else {
                console.error("BabylonJS engine not supported");
            }  
        } else {
            console.error("Expected document state 'complete' but received state: " + document.readyState);
        }
    }
});
