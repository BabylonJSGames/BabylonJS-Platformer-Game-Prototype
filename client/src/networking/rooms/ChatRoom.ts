import {Room} from "colyseus"

import Game from "../../Game";

export default class ChatRoom {
    private room:  Room;
    private chatBox: HTMLElement = document.getElementById("chat-box");
    private chatInput: HTMLElement = document.getElementById("chat-input");
    private chatForm: HTMLElement = document.getElementById("chat-form");

    constructor() {
    };

    public async connect() {
        await this.initJoinOrCreateRoom();
        this.onsend(this.chatForm, <HTMLInputElement> this.chatInput );
        this.onMessage(this.chatBox);
    }

    private async initJoinOrCreateRoom() {
        this.room = await Game.client.joinOrCreate("ChatRoom");
        console.log(this.room.sessionId, "joined", this.room.name);
    }

    private onsend(chatForm: HTMLElement, chatInput:HTMLInputElement) {
        // prevent player movement while typing in chat
        chatInput.addEventListener('keydown', (evt) => evt.stopPropagation());
        chatInput.addEventListener('keyup', (evt) => evt.stopPropagation());

        chatForm.onsubmit = (evt) => {
            evt.preventDefault();
            this.room.send("message", chatInput.value);
            chatInput.value = ' ';
            //unfocus the input box
            chatInput.blur();
        }
    }

    private onMessage(chatBox: HTMLElement){
        this.room.onMessage("messages", (message) => {
            let xH = chatBox.scrollHeight;
            chatBox.innerHTML += '<p>' + message + '</p>';
            chatBox.scrollTo(0,xH);
        });
    }
}
