const formatSpeakerName = (name) => {
  return `SPEAKER_${name}`;
};
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
  const finalResults = results[results.length - 1];
  const gcpWords = finalResults.alternatives[0].words;
  const words = gcpWords.map((word) => {
    return {
      start: computeTimeInSeconds(word.startTime),
      end: computeTimeInSeconds(word.endTime),
      text: word.word,
    };
  });

  let currentSpeaker = gcpWords[0].speakerTag;
  let currentSpeakerStartTime = computeTimeInSeconds(gcpWords[0].startTime);
  let currentSpeakerEndTime = computeTimeInSeconds(gcpWords[gcpWords.length - 1].endTime);

  const paragraphs = [];
  let tmpParagraph = {
    speaker: formatSpeakerName(currentSpeaker),
    start: currentSpeakerStartTime,
    end: currentSpeakerEndTime,
  };
  gcpWords.forEach((word, index, list) => {
    if (index === 0) {
    }
    if (word.speakerTag !== currentSpeaker) {
      currentSpeaker = word.speakerTag;
      tmpParagraph.end = computeTimeInSeconds(word.endTime);

      paragraphs.push(tmpParagraph);
      tmpParagraph = {};
      tmpParagraph.speaker = formatSpeakerName(currentSpeaker);
      // this way skips last speaker time range when it gets to the end
      if (gcpWords[index + 1]) {
        tmpParagraph.start = computeTimeInSeconds(gcpWords[index + 1].startTime);
      }
    } else {
      tmpParagraph.speaker = formatSpeakerName(word.speakerTag);
    }

    // last element
    if (index === list.length - 1) {
      tmpParagraph.end = computeTimeInSeconds(word.endTime);
      paragraphs.push(tmpParagraph);
    }
  });
  return { words, paragraphs };
};

module.exports = gcpToDpe;
module.exports.computeTimeInSeconds = computeTimeInSeconds;
