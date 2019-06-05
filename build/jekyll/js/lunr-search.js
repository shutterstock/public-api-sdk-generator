(function() {
  function displaySearchResults(results, store, searchPhrase) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];
        if (item.search != 'exclude'){
          appendString += '<li><a class="searchResultHeading" href="' + item.url + '">' + item.title + '</a>';
          appendString += '<p class="searchResultText">' + item.content.substring(0, 150) + '...</p>';

          appendString += '<p>' + getMatchesInContext(results[i], searchPhrase, item) + '</p>';

          appendString += '</li>';
        }
      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<li>No results found</li>';
    }
  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchPhrase = getQueryVariable('query');

  if (searchPhrase) {
    document.getElementById('search-box').setAttribute("value", searchPhrase);

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('category');
      this.field('content');
      this.field('search');
      this.field('keywords', { boost: 10 });
      this.field('tags', { boost: 10 });
      this.metadataWhitelist = ['position'];

      for (var key in window.store) { // Add the data to lunr
        this.add({
          'id': key,
          'title': window.store[key].title,
          'category': window.store[key].category,
          'content': window.store[key].content,
          'search': window.store[key].search,
          'keywords': window.store[key].keywords,
          'tags': window.store[key].tags,
          'position': window.store[key].position
        });
      }
    });

    var results = idx.search(searchPhrase); // Get lunr to perform a search
    displaySearchResults(results, window.store, searchPhrase); // We'll write this in the next section
  }
})();

function getMatchesInContext(result, searchPhrase, item){
  var returnString = '<ul>';
  const searchTerms = searchPhrase.split(" ");
  const resultsPerPageLimit = 7;
  const matchPositionInfo = result.matchData.metadata;

  // Metadata includes position info for each position type, such as content and keywords
  // {"cumul":{"content":{"position":[[5612,10],[5631,10],[5732,10],[5750,11],[5887,10],[5906,10],[6011,10],[6060,10],[6355,10],[6408,10],[6465,10]]},"keywords":{"position":[[35,11],[51,10]]}}}

  // handle keyword matches first
  for (var oneMatchedKeyword in matchPositionInfo){
    for (var oneMatchType in matchPositionInfo[oneMatchedKeyword]){
      if (oneMatchType === 'keywords') {
        //keyword matches
        const keywordArray = item.keywords.split(', ');
        const keywordMatchString = '.*' + oneMatchedKeyword + '.*';
        const keywordMatchRegex = new RegExp(keywordMatchString, 'g');
        for (var oneKeyword in keywordArray) {
          if (keywordArray[oneKeyword].search(keywordMatchRegex) > -1){
            returnString += '<li>Keyword: ' +  keywordArray[oneKeyword] + '</li>';
          }
        }
      }
    }
  }

  //now handle content matches
  var numberOfPrintedResults = 0;
  for (var oneMatchedKeyword in matchPositionInfo){
    for (var oneMatchType in matchPositionInfo[oneMatchedKeyword]){
      if (oneMatchType != 'keywords') {
        for (var oneMatchPosition in matchPositionInfo[oneMatchedKeyword][oneMatchType].position){
          var onePosition = matchPositionInfo[oneMatchedKeyword][oneMatchType].position[oneMatchPosition];
          if (numberOfPrintedResults < resultsPerPageLimit){
            numberOfPrintedResults++;
            returnString += '<li>' + item.content.substring(onePosition[0]-70, onePosition[0]+onePosition[1]+70)  + '</li>';
          }
        }
      }
    }
  }

  returnString += '</ul>';
  return returnString;
}

function highlightMatches(content, searchTerm){

  const matchString = '\\b([\\w-]*' + regexEscape(searchTerm) + '[\\w-]*)\\b';
  const matchRegex = new RegExp(matchString, 'g');
  var matches = matchRegex.exec(content);
  console.log(matches);
  var returnString = content;
  for (var i = 1; i < matches.length; i++){
      returnString = returnString.replace(matches[i], '<span class="searchResultHighlight">'+matches[i]+'</span>');
  }

  return returnString;
}

function regexEscape(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
