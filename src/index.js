const  gcpTranscribeToDraft = require('./stt-adapter-gcp-to-draftjs/index.js');
const draftToDigitalPaperEdit  = require('./draftjs-to-digital-paper-edit/index.js');

/**
 * Converts = require(' gcp transcribe to DPE. 
 * internally it goes via draftJS to do the conversion. 
 * This could be refactored to go directly form gcp to DPE
 * @param {json} gcpTranscript - gcp Transcription Json
 * @returns {json} json transcription in DPE format
 */

const gcpToDpe = (gcpTranscript) => {
    const draftJsTranscript = gcpTranscribeToDraft(gcpTranscript);
    // need to wrap result of conversion in a block for next converter
    const blocks = {   "blocks": draftJsTranscript}
    const dpeTranscript = draftToDigitalPaperEdit(blocks);
    // For some reason the id is undefined :shrug:
    dpeTranscript.words = dpeTranscript.words.map((word,index)=>{
        word.id = index;
        return word;
    })
    return dpeTranscript;
}

module.exports = gcpToDpe;
