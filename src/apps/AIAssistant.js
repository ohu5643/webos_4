export default class AIAssistant {

    constructor(wm){

        this.wm = wm;

    }

    open(){

        const aiWin =
            this.wm.createWindow(

                "AI Assistant",

                `

                <div
                    id="chat"

                    style="
                        height:300px;
                        overflow:auto;
                        border:1px solid #555;
                        margin-bottom:10px;
                        padding:5px;
                    "

                ></div>

                <textarea
                    id="prompt"

                    style="
                        width:100%;
                        height:80px;
                    "

                ></textarea>

                <button id="send-ai">

                    전송

                </button>

                `
            );

    }

}