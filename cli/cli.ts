#!/usr/bin/env node
import { checkPkgExist } from '../packages/cliHelpers/checkPkgExist.js';
import { generateStats } from '../packages/cliHelpers/generateStats.js';
import { mkdir } from '../packages/cliHelpers/mkdir.js';

const res = checkPkgExist('./package.json', 'loki');
if(res) {
    mkdir('.OdinSnap');
    await generateStats();
}
else {
    console.log('loki doesnt exist');
}