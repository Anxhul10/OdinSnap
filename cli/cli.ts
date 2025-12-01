#!/usr/bin/env node
import { checkPkgExist } from '../packages/cliHelpers/checkPkgExist.js';

const res = checkPkgExist('./package.json', 'loki');
if(res) {
    console.log("loki exist");
}
else {
    console.log('loki doesnt exist');
}