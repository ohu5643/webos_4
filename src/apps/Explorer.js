export default class Explorer {

    constructor(fs, wm, auth){

        this.fs = fs;
        this.wm = wm;
        this.auth = auth;

    }

    async open(){

        const user =
            this.auth.currentUser;

        if(!user) return;

        const nodes =
            await this.fs.getNodes(
                user.uid
            );

        const html =
            nodes.map(
                node => `

                <div
                    class="file-item"
                    data-id="${node.id}"
                    data-type="${node.type}"
                >

                    ${
                        node.type === "folder"
                        ? "📁"
                        : "📄"
                    }

                    ${node.name}

                </div>

                `
            ).join("");

        const win =
            this.wm.createWindow(
                "Explorer",

                `
                <button id="new-folder">

                    새 폴더

                </button>

                <button id="new-file">

                    새 파일

                </button>

                <hr>

                <div id="folder-list">

                    ${html}

                </div>
                `
            );

        win
            .querySelector(
                "#new-folder"
            )
            .addEventListener(
                "click",

                async ()=>{

                    const folderName =
                        prompt(
                            "폴더 이름"
                        );

                    if(!folderName) return;

                    await this.fs.createFolder(
                        user.uid,
                        folderName
                    );

                    win.remove();

                    this.open();

                }
            );

        win
            .querySelector(
                "#new-file"
            )
            .addEventListener(
                "click",

                async ()=>{

                    const fileName =
                        prompt(
                            "파일 이름"
                        );

                    if(!fileName) return;

                    await this.fs.createFile(
                        user.uid,
                        fileName
                    );

                    win.remove();

                    this.open();

                }
            );

    }

}