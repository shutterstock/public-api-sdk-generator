var testString = "A block corresponds to a purchase of one or more allotments. Often, a blockthing results thingblock in a single allotment, su";
const matchString = '\\b([\\w-]*' + 'block' + '[\\w-]*)\\b';
const matchRegex = new RegExp(matchString, 'g');
var matches = testString.match(matchRegex);

console.log(matches);
