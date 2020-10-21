/**
 * GCP does not provide a nanosecond attribute if the word starts at 0 nanosecond
 * @param startSecond
 * @param nanoSecond
 * @returns {number}
 */
const computeTimeInSeconds = (startSecond, nanoSecond) => {
  const NANO_SECOND = 1000000000;
  let seconds = parseFloat(startSecond);

  if (nanoSecond !== undefined) {
    seconds = seconds + parseFloat(nanoSecond / NANO_SECOND);
  }

  return seconds;
};
/**
 * Converts =  gcp STT with speaker info to DPE format.
 * @param {json} gcpTranscript - gcp Transcription Json
 * @returns {json} json transcription in DPE format
 */

const gcpToDpe = (data) => {
  let results;
  try {
    results = data.response.results;
  } catch (e) {
    throw new Error('Invalid input for GCP to DPE converter, expected data.response.results to be present');
  }
  //   console.log(data.response.results);
  const finalResults = results[results.length - 1];
  //   console.log('finalResults', JSON.stringify(finalResults, null, 2));
  const gcpWords = finalResults.alternatives[0].words;
  const words = gcpWords.map((word) => {
    return {
      start: computeTimeInSeconds(word.startTime),
      end: computeTimeInSeconds(word.endTime),
      text: word.word,
    };
  });

  let currentSpeaker = gcpWords[0].speakerTag;
  let currentSpeakerStartTime = gcpWords[0].startTime;
  let currentSpeakerEndTime = gcpWords[gcpWords.length - 1].endTime;

  const paragraphs = [];
  let tmpParagraph = {
    speaker: currentSpeaker,
    start: currentSpeakerStartTime,
    end: currentSpeakerEndTime,
  };
  gcpWords.forEach((word, index, list) => {
    if (index === 0) {
    }
    if (word.speakerTag !== currentSpeaker) {
      currentSpeaker = word.speakerTag;
      //   tmpParagraph.speaker = word.speakerTag;
      tmpParagraph.end = computeTimeInSeconds(word.endTime);
      //   tmpParagraph.end = word.endTime;

      paragraphs.push(tmpParagraph);
      tmpParagraph = {};
      if (gcpWords[index + 1]) {
        tmpParagraph.start = computeTimeInSeconds(gcpWords[index + 1].startTime);
        // tmpParagraph.start = gcpWords[index + 1].startTime;
      }
    } else {
      tmpParagraph.start = computeTimeInSeconds(word.startTime);
      //   tmpParagraph.start = word.startTime;
      //   currentSpeaker = word.speakerTag;
      tmpParagraph.speaker = word.speakerTag;
      //   tmpParagraph.text = word.word;
    }

    // last element
    if (index === list.length - 1) {
      tmpParagraph.end = computeTimeInSeconds(word.endTime);
      //   tmpParagraph.end = word.endTime;
      paragraphs.push(tmpParagraph);
    }
  });
  console.log('finalResults', JSON.stringify(words, null, 2));
  return { words, paragraphs };
};

module.exports = gcpToDpe;
module.exports.computeTimeInSeconds = computeTimeInSeconds;
