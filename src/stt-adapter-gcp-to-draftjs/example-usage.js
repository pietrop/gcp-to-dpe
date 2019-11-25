const gcpSttToDraft = require('./index.js');
const gcpSttTedTalkTranscript = require('./sample/gcpSttPunctuation.sample.json');

console.log('Starting',gcpSttTedTalkTranscript);
console.log(JSON.stringify(gcpSttToDraft(gcpSttTedTalkTranscript), null, 2));
