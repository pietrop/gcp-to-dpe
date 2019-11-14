const fs = require('fs');
const gcpToDpe = require('./index.js');

const gcpTranscript = require('./sample/WSJ8623212922.mp3.json');

const res = gcpToDpe(gcpTranscript);

fs.writeFileSync('./sample/output/dpe.json',JSON.stringify(res,null,2) )
console.log(res)