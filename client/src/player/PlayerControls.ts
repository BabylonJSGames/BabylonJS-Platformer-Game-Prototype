export interface IKeys {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
    crouch: boolean;
    checkpoint: boolean;
    gotoCheckpoint: boolean;
    restart: boolean;
    selectFirstPersonCamera: boolean;
    selectThirdPersonCamera: boolean;
}

// used for receiving other player keys from server where we don't care about all keys
export interface IMoveKeys {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
    crouch: boolean;
}

export default class PlayerControls {

    public keys: IKeys = {
        up: false,
        down: false,
        left: false,
        right: false,
        jump: false,
        crouch: false,
        checkpoint: false,
        gotoCheckpoint: false,
        restart: false,
        selectFirstPersonCamera: false,
        selectThirdPersonCamera: false
    }

    constructor() {
        this.setupListeners();
    }

    private setupListeners() {
        window.onkeydown = (e: KeyboardEvent) => this.handleKey(e.code, true);
        window.onkeyup = (e: KeyboardEvent) => this.handleKey(e.code, false);
    }

    private handleKey(code: string, keydown: boolean) {
        switch (code) {
            case "KeyW":
            case "ArrowUp":
                this.keys.up = keydown;
                break;
            case "KeyA":
            case "ArrowLeft":
                this.keys.left = keydown;
                break;
            case "KeyS":
            case "ArrowDown":
                this.keys.down = keydown;
                break;
            case "KeyD":
            case "ArrowRight":
                this.keys.right = keydown;
                break;
            case "Space":
                this.keys.jump = keydown;
                break;
            case "KeyC":
                this.keys.crouch = keydown;
                break;
            case "KeyT":
                this.keys.checkpoint = keydown;
                break;
            case "KeyV":
                this.keys.gotoCheckpoint = keydown;
                break;
            case "KeyP":
                this.keys.restart = keydown;
                break;
            case "Digit1":
                this.keys.selectFirstPersonCamera = keydown;
                break;
            case "Digit2":
                this.keys.selectThirdPersonCamera = keydown;
                break;
        }
    }
}
