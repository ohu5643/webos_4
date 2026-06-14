import './style.css';
import WindowManager from './kernel/WindowManager.js';
import { auth } from './firebase/firebase.js';

import {
    signInAnonymously,
    onAuthStateChanged
}
from "firebase/auth";

import FileSystem from './kernel/FileSystem.js';

document.querySelector('#app').innerHTML = `
<div id="desktop">
    <div id="taskbar">
        <div id="start-button">WebOS</div>
    </div>

    <div id="desktop-icons">
        <div class="icon" id="explorer-icon">
    📁
        <span>Explorer</span>
    </div>

    <div class="icon" id="ai-icon">
        🤖
        <span>AI</span>
    </div>

    <div class="icon" id="notepad-icon">
        📝
        <span>Notepad</span>
    </div>
        </div>
</div>
`;

console.log("WebOS Boot Complete");

const wm = new WindowManager();

document
    .getElementById('explorer-icon')
    .addEventListener('dblclick', async () => {

        const user = auth.currentUser;

        if (!user) return;

        const nodes =
            await fs.getNodes(
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
                            node.type === 'folder'
                                ? '📁'
                                : '📄'
                        }
                        ${node.name}
                    </div>
                `
            ).join('');
        
        const win =
            wm.createWindow(
                'Explorer',
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

        const btn =
            win.querySelector(
                '#new-folder'
            );

        btn.addEventListener(
            'click',
            async () => {

                const folderName =
                    prompt(
                        '폴더 이름'
                    );

                if (!folderName) return;

                await fs.createFolder(
                    user.uid,
                    folderName
                );

                win.remove();

                document
                    .getElementById(
                        'explorer-icon'
                    )
                    .dispatchEvent(
                        new Event(
                            'dblclick'
                        )
                    );

            }
        );

        win.querySelector(
    '#new-file'
).addEventListener(
    'click',
    async () => {

        const fileName =
            prompt(
                '파일 이름'
            );

        if (!fileName) return;

        await fs.createFile(
            user.uid,
            fileName
        );

        win.remove();

        document
            .getElementById(
                'explorer-icon'
            )
            .dispatchEvent(
                new Event(
                    'dblclick'
                )
            );

    }
);

    win.querySelectorAll(
    '.file-item'
).forEach(
    item => {

        item.addEventListener(
            'dblclick',
            async () => {

                const type =
                    item.dataset.type;

                const name =
                    item.textContent
                        .replace(
                            '📄',
                            ''
                        )
                        .replace(
                            '📁',
                            ''
                        )
                        .trim();

                if (
                    type !== 'file'
                ) return;

                const file =
                    await fs.getFile(
                        user.uid,
                        name
                    );

                const noteWin =
                    wm.createWindow(
                        name,
                        `
                        <textarea
                            id="editor"
                            style="
                                width:100%;
                                height:300px;
                            "
                        >${file.content || ''}</textarea>

                        <br><br>

                        <button id="save-file">
                            저장
                        </button>
                        `
                    );

                noteWin
                    .querySelector(
                        '#save-file'
                    )
                    .addEventListener(
                        'click',
                        async () => {

                            const content =
                                noteWin
                                .querySelector(
                                    '#editor'
                                )
                                .value;

                            await fs.saveFile(
                                user.uid,
                                name,
                                content
                            );

                            alert(
                                '저장 완료'
                            );

                        }
                    );

            }
        );

    }
);

    });

document
    .getElementById('notepad-icon')
    .addEventListener('dblclick', () => {

        wm.createWindow(
            'Notepad',
            `
            <textarea
                style="
                width:100%;
                height:300px;
                "
            ></textarea>
            `
        );

    });

document
    .getElementById(
        'ai-icon'
    )
    .addEventListener(
        'dblclick',
        () => {

            const aiWin =
    wm.createWindow(
        'AI Assistant',
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

const sendBtn =
    aiWin.querySelector(
        '#send-ai'
    );

sendBtn.addEventListener(
    'click',
    async () => {

        const prompt =
            aiWin.querySelector(
                '#prompt'
            ).value;

        const chat =
            aiWin.querySelector(
                '#chat'
            );

        chat.innerHTML += `
            <div>
                <b>나:</b>
                ${prompt}
            </div>
        `;

        const response =
            await fetch(
                'https://script.google.com/macros/s/AKfycbwClJlHuxKuDWy24RhmejOShOW_KGoB_AXnZXWbRJEvd6EUPGVzUOYgJYmDOg7xPw/exec',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        message: prompt
                    })
                }
            );

        const data =
            await response.json();

        console.log(data);

        const answer =
            data.choices[0]
                .message
                .content;

        chat.innerHTML += `
            <div>
                <b>AI:</b>
                ${answer}
            </div>
        `;

            }
        );

                }
            );

const fs = new FileSystem();

signInAnonymously(auth);

onAuthStateChanged(
    auth,
    async user => {

        console.log("User:", user);

        if (!user) return;

        try {

            await fs.initialize(
                user.uid
            );

            console.log(
                "Filesystem initialized"
            );

        } catch(error) {

            console.error(
                "FS ERROR:",
                error
            );

        }

        console.log(
            "Logged In",
            user.uid
        );

    }
);