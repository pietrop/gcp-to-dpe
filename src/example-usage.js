const fs = require('fs');
const gcpToDpe = require('./index.js');

const gcpTranscript = require('../sample/gcpStt.longrecognition-with-speakers.sample.json');

const res = gcpToDpe(gcpTranscript);

fs.writeFileSync('./sample/output/dpe-output-diarization-long-recognition.json', JSON.stringify(res, null, 2));
console.log(res);
