const fs = require('fs');
const gcpToDpe = require('./index.js');

const gcpTranscript = require('../sample/gcpSttPunctuation.sample.json');

const res = gcpToDpe(gcpTranscript);

fs.writeFileSync('./sample/dpe-output.json',JSON.stringify(res,null,2) )
console.log(res)