/**
 * Converts GCP Speech to Text Json to DraftJs
 * see `sample` folder for example of input and output as well as `example-usage.js`
 */

const generateEntitiesRanges =require('./generate-entities-ranges.js');

const NANO_SECOND = 1000000000;

/**
 * attribute for the sentences object containing the text. eg sentences ={ punct:'helo', ... }
 *  or eg sentences ={ text:'hello', ... }
 * @param sentences
 */
const getBestAlternativeSentence = sentences => {
  if (sentences.alternatives.length === 0) {
    return sentences[0];
  }

  const sentenceWithHighestConfidence = sentences.alternatives.reduce(function(
    prev,
    current
  ) {
    return parseFloat(prev.confidence) > parseFloat(current.confidence)
      ? prev
      : current;
  });

  return sentenceWithHighestConfidence;
};

module.exports.getBestAlternativeSentence = getBestAlternativeSentence;

const trimLeadingAndTailingWhiteSpace = text => {
  return text.trim();
};

module.exports.trimLeadingAndTailingWhiteSpace = trimLeadingAndTailingWhiteSpace;

/**
 * GCP does not provide a nanosecond attribute if the word starts at 0 nanosecond
 * @param startSecond
 * @param nanoSecond
 * @returns {number}
 */
const computeTimeInSeconds = (startSecond, nanoSecond) => {

  let seconds = parseFloat(startSecond);

  if (nanoSecond !== undefined) {
    seconds = seconds + parseFloat(nanoSecond / NANO_SECOND);
  }

  return seconds;
};
 
/**
 * normaliseTimecode
 * @param {*} timecode handle string  and object conversion to second
 * can either be a string, eg "1.300s". or an object, eg
 *  "startTime": {
    "seconds": "12",
    "nanos": 900000000
  },
 * as well as edge case when it's an empty object (most likely a bug with gstt)
 * raise issue on GCP https://issuetracker.google.com/issues/145082856
 * first word missing startTime timestamp, so adding temporary workaround
 * @param {*} attribute    attribute - 'startTime' or 'endTime' string
 * @returns float number of timecode in seconds
 */
const normaliseTimecode = (wordObject, attribute)=>{
  if(typeof wordObject[attribute] === 'string'){
    // "1.300s"
    if((wordObject[attribute]).endsWith("s")){
      const timecodeArray = [ ...wordObject[attribute]]
      // remove 's'
      timecodeArray.pop()
      return parseFloat(timecodeArray.join(''))
    }
    else{
      return parseFloat(timecodeArray.join(''))
    }
  }
  if(typeof wordObject[attribute] === 'object'){
    const timecodeSeconds = wordObject[attribute].seconds || 0;
    const timecodeNanos = wordObject[attribute].nanos || 0;
   return computeTimeInSeconds(timecodeSeconds, timecodeNanos)
  }

  if(typeof wordObject[attribute] === 'undefined'){
    return 0;
  }

  if(typeof wordObject[attribute] === 'number'){
    return wordObject;
  }
}

/**
 * Normalizes words so they can be used in
 * the generic generateEntitiesRanges() method
 **/
const normalizeWord = (currentWord, confidence) => {
  return {
    // start: computeTimeInSeconds(statTimeSeconds, startTimeNanos),
    start: normaliseTimecode(currentWord, 'startTime'),
    // end: computeTimeInSeconds(endTimeSeconds, endTimeNanos),
    end: normaliseTimecode(currentWord, 'endTime'),
    text: currentWord.word,
    confidence: confidence
  };
};

/**
 * groups words list from GCP Speech to Text response.
 * @param {array} sentences - array of sentence objects from GCP STT
 */
const groupWordsInParagraphs = sentences => {
  const results = [];
  let paragraph = {
    words: [],
    text: []
  };

  sentences.forEach((sentence) => {
    const bestAlternative = getBestAlternativeSentence(sentence);
    paragraph.text.push(trimLeadingAndTailingWhiteSpace(bestAlternative.transcript));

    // let speaker;  
    // if(bestAlternative.words[0].speakerTag){
    //   speaker = bestAlternative['words'][0].speakerTag;
    //   console.log(speaker)
    // }

    bestAlternative.words.forEach((word) => {
      paragraph.words.push(normalizeWord(word, bestAlternative.confidence));
    });
    // if(speaker){
    //   paragraph.speaker = speaker;
    // }
    results.push(paragraph);
    paragraph = { words: [], text: [] };
  });

  return results;
};

const gcpSttToDraft = gcpSttJson => {
  const results = [];
  // const speakerLabels = gcpSttJson.results[0]['alternatives'][0]['words'][0]['speakerTag']
  // let speakerSegmentation = typeof(speakerLabels) != 'undefined';

  const wordsByParagraphs = groupWordsInParagraphs(gcpSttJson.results);

  wordsByParagraphs.forEach((paragraph, i) => {
    const draftJsContentBlockParagraph = {
      text: paragraph.text.join(' '),
      type: 'paragraph',
      data: {
        speaker: paragraph.speaker ? `${ paragraph.speaker }` : `TBC ${ i }`,
        words: paragraph.words,
        start: parseFloat(paragraph.words[0].start)
      },
      // the entities as ranges are each word in the space-joined text,
      // so it needs to be compute for each the offset from the beginning of the paragraph and the length
      entityRanges: generateEntitiesRanges(paragraph.words, 'text') // wordAttributeName
    };
    results.push(draftJsContentBlockParagraph);
  });

  return results;
};

module.exports = gcpSttToDraft;
