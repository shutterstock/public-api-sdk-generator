"use strict";

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const docFolderPath = `${__dirname}/../docs`;

// Replace H1s with Jekyll front matter.
// README.md gets front matter in fix-readme.js.

async function addFrontMatter() {

  const docFileNames = fs.readdirSync(docFolderPath)
    .filter(fileName => fileName.endsWith('.md'));

  const docFilePromises = _.map(docFileNames, (docFileName) => {
    const className = docFileName.split('.md')[0];
    const permalink = 'docs/' + className;
    var frontMatter = `---\ntitle: shutterstock-api.${className}\npermalink: ${permalink}\n`;

    if (!docFileName.endsWith('Api.md')) {
      // This is a model file, don't show an internal TOC for it
      frontMatter += 'toc: false\n';
    }
    frontMatter += '---';

    const H1Regex = /^#\s.*$/m;

    return readFile(path.join(docFolderPath, docFileName), 'utf8')
      .then((fileData) => {
        const editedFileData = fileData.replace(H1Regex, frontMatter);
        return writeFile(path.join(docFolderPath, docFileName), editedFileData, 'utf8');
      });
    
  });

  const result = await Promise.all(docFilePromises);
}

addFrontMatter();