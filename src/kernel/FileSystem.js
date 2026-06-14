import {
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc
}
from "firebase/firestore";

import {
    db
}
from "../firebase/firebase.js";

export default class FileSystem {

    async initialize(uid) {

        const ref =
            collection(
                db,
                "users",
                uid,
                "filesystem"
            );

        const snapshot =
            await getDocs(ref);

        if (!snapshot.empty) return;

        const defaults = [
            "Documents",
            "Downloads",
            "Pictures",
            "Desktop"
        ];

        for (const folder of defaults) {

            await setDoc(
                doc(
                    db,
                    "users",
                    uid,
                    "filesystem",
                    folder
                ),
                {
                    name: folder,
                    type: "folder",
                    parent: "root"
                }
            );

        }

        console.log(
            "Filesystem initialized"
        );
    }

    async getNodes(uid) {

        const ref =
            collection(
                db,
                "users",
                uid,
                "filesystem"
            );

        const snapshot =
            await getDocs(ref);

        return snapshot.docs.map(
            doc => ({
                id: doc.id,
                ...doc.data()
            })
        );
    }

    async createFolder(
        uid,
        folderName
    ) {

        await setDoc(
            doc(
                db,
                "users",
                uid,
                "filesystem",
                folderName
            ),
            {
                name: folderName,
                type: "folder",
                parent: "root"
            }
        );

    }

    async createFile(
        uid,
        fileName,
        parent = "root"
    ) {

        await setDoc(
            doc(
                db,
                "users",
                uid,
                "filesystem",
                fileName
            ),
            {
                name: fileName,
                type: "file",
                parent,
                content: ""
            }
        );

    }

    async getFile(
    uid,
    fileName
) {

    const ref =
        doc(
            db,
            "users",
            uid,
            "filesystem",
            fileName
        );

    const snapshot =
        await getDoc(ref);

    return snapshot.data();

}

    async saveFile(
        uid,
        fileName,
        content
    ) {

        await setDoc(
            doc(
                db,
                "users",
                uid,
                "filesystem",
                fileName
            ),
            {
                name: fileName,
                type: "file",
                parent: "root",
                content
            }
        );

    }

}

