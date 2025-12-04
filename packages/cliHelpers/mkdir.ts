import fs from 'node:fs';

export function mkdir(folderName: string) {
    try {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
    } catch (err) {
    console.error(err);
    }
}
