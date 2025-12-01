import fs from 'fs';

export function checkPkgExist(JSONfilePath: string, pkgName: string): boolean {
    const data = fs.readFileSync(JSONfilePath, 'utf8');
    const obj = JSON.parse(data);
    
    for (const key in obj) {
        const val = obj[key];
        if (typeof val === 'object') {
            for (const pkg in val) {
                if (pkg === pkgName) {
                    console.log(pkg);
                    return true;
                }
            }
        }
    }
    return false;
}
