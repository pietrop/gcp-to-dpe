# GCP To DPE

This module provides a way to convert from GCP(Google Cloud Platform) STT To [DPE format](https://github.com/bbc/digital-paper-edit).
Note that this assumes that speaker diarization info is present in GCP STT result.

## Setup

<!-- _stack - optional_
_How to build and run the code/app_ -->

Fork this repository + git clone + cd into folder + npm install

## Usage

on npm [gcp-to-dpe](https://www.npmjs.com/package/gcp-to-dpe)

```
npm install gcp-to-dpe
```

```js
const gcpToDpe = require('gcp-to-dpe');
const gcpTranscript = require('../sample/gcpSttPunctuation.sample.json');

const res = gcpToDpe(gcpTranscript);
// do something with dpe json
```

see [`src/example-usage.js`](./src/example-usage.js) for more.

<!-- ## System Architecture -->
<!-- _High level overview of system architecture_ -->

<!-- ## Documentation

There's a [docs](./docs) folder in this repository.

[docs/notes](./docs/notes) contains dev draft notes on various aspects of the project. This would generally be converted either into ADRs or guides when ready.

[docs/adr](./docs/adr) contains [Architecture Decision Record](https://github.com/joelparkerhenderson/architecture_decision_record).

> An architectural decision record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

We are using [this template for ADR](https://gist.github.com/iaincollins/92923cc2c309c2751aea6f1b34b31d95) -->

## Development env

 <!-- _How to run the development environment_ -->

- npm > `6.1.0`
- [Node 10 - dubnium](https://scotch.io/tutorials/whats-new-in-node-10-dubnium)

Node version is set in node version manager [`.nvmrc`](https://github.com/creationix/nvm#nvmrc)

<!-- _Coding style convention ref optional, eg which linter to use_ -->

<!-- _Linting, github pre-push hook - optional_ -->

## Build

<!-- _How to run build_ -->

_NA_

## Tests

<!-- _How to carry out tests_ -->

```
npm run test
```

## Deployment

<!-- _How to deploy the code/app into test/staging/production_ -->

To publish to npm

```
npm run publish:public
```
