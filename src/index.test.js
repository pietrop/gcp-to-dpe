const gcpToDpe = require('./index.js');
const gcpTranscript = require('../sample/gcpStt.longrecognition-with-speakers.sample.json');

const res = gcpToDpe(gcpTranscript);

test('gco to dpe - to have paragraphs', () => {
  expect(res.paragraphs).toBeDefined();
});

test('gco to dpe - to have words', () => {
  expect(res.words).toBeDefined();
});

test('gco to dpe - paragraphs speaker', () => {
  res.paragraphs.forEach((p) => {
    expect(p.speaker).toBeDefined();
  });
});

test('gco to dpe - paragraphs start time', () => {
  res.paragraphs.forEach((p) => {
    expect(p.start).toBeDefined();
  });
});

test('gco to dpe - paragraphs end time', () => {
  res.paragraphs.forEach((p) => {
    expect(p.end).toBeDefined();
  });
});

test('gco to dpe - paragraphs speaker is string', () => {
  res.paragraphs.forEach((p) => {
    expect(typeof p.speaker).toBe('string');
  });
});

test('gco to dpe - paragraphs end is number', () => {
  res.paragraphs.forEach((p) => {
    expect(typeof p.end).toBe('number');
  });
});

test('gco to dpe - paragraphs start is number', () => {
  res.paragraphs.forEach((p) => {
    expect(typeof p.start).toBe('number');
  });
});

test('gco to dpe - words start time', () => {
  res.words.forEach((w) => {
    expect(w.start).toBeDefined();
  });
});

test('gco to dpe - words end time', () => {
  res.words.forEach((w) => {
    expect(w.end).toBeDefined();
  });
});

test('gco to dpe - words text is string', () => {
  res.words.forEach((w) => {
    expect(typeof w.text).toBe('string');
  });
});

test('gco to dpe - words end is number', () => {
  res.words.forEach((w) => {
    expect(typeof w.end).toBe('number');
  });
});

test('gco to dpe - words start is number', () => {
  res.words.forEach((w) => {
    expect(typeof w.start).toBe('number');
  });
});
