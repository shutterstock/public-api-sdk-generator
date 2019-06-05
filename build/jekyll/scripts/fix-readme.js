"use strict";

const fs = require('fs');
const _ = require('lodash');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const readmeFilePath = `${__dirname}/../README.md`;

const readmeFrontMatter = `---
title: Official JavaScript SDK client for the Shutterstock API
permalink: index
---`;

// Correct links in README.md
// from [**createSoundbox**](docs/AudioApi.md#createSoundbox)
// to [**createSoundbox**](docs/AudioApi.html#createSoundbox)
async function fixReadmeLinks(readmeFilePromise) {
  const linksInMasterRegex = /\[(.*?)\]\(docs\/(.*?)\.md#(.*?)\)/g;
  const readmeText = await Promise.resolve(readmeFilePromise);
  const readmeByLines = readmeText.split('\n');
  const fixedReadme = _.map(readmeByLines, (line) => {
    var match;
    var fixedLine = line;
    while (match = linksInMasterRegex.exec(line)) {
      const correctedLink = `[${match[1]}](docs/${match[2]}.html#${match[3]})`;
      fixedLine = fixedLine.replace(match[0], correctedLink);
    }
    return fixedLine;
  });
  return fixedReadme.join('\n');
}

// Add acknowledgement to template creator
async function addAcknowledgement(readmeFilePromise) {
  const readmeText = await Promise.resolve(readmeFilePromise);
  return readmeText + '\n## Acknowledgements\n\nThanks to Tom Johnson of [I\'d Rather Be Writing](https://idratherbewriting.com/) for this Jekyll template.'
}

// Add Jekyll front matter
async function addFrontMatter(readmeFilePromise) {
  const readmeText = await Promise.resolve(readmeFilePromise);
  return readmeText.replace('# Official JavaScript SDK client for the Shutterstock API', readmeFrontMatter);
}

async function writeReadmeFile(readmeFilePromise) {
  const readmeText = await Promise.resolve(readmeFilePromise);
  return writeFile(readmeFilePath, readmeText, 'utf8');
}

_.mixin({
  fixReadmeLinks,
  writeReadmeFile,
  addAcknowledgement,
  readFile,
  addFrontMatter,
});

async function fixReadme() {
  const result = await _.chain(readmeFilePath)
    .readFile('utf8')
    .fixReadmeLinks()
    .addFrontMatter()
    .addAcknowledgement()
    .writeReadmeFile()
    .value();
}

fixReadme();