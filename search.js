//parameters needs to be an object



function search() {
  if($('#search-input').val()!= ""){
  var encodedParameters = handleParameters();
  var url = 'https://itunes.apple.com/search?' + encodedParameters;
  $('head').append('<script src="' + url + '"></script>');
}

}


function handleParameters(){
    var searchInput = $('#search-input').val();
    var filterInput = $('#filter').val();
    var parameters;

    if(filterInput != "noFilter"){
    parameters = {
        term: searchInput,
        country: 'US',
        media: 'music',
        entity: 'musicTrack',
        attribute: filterInput,
        callback: 'handleReturnResults'
    }
  }
  else {
  parameters = {
      term: searchInput,
      country: 'US',
      media: 'music',
      entity: 'musicTrack',
      callback: 'handleReturnResults'
  }
  }

  parameters = encode(parameters);
  return parameters;
}

function encode(parameters) {
  var encodedInput = '';

  for (var key in parameters) {
    encodedInput += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&';
  }
  if (encodedInput.length != 0) {
    encodedInput = encodedInput.slice(0,  -1);
  }

  return encodedInput;
}


function handleReturnResults(totalResults) {
  console.log(totalResults);
  var rawResults = totalResults.results;
  var readyResults = [];

  for (var i = 0; i < rawResults.length; i++) {
    var currentItem = rawResults[i];
    var individualResult = {
      trackName: currentItem.trackCensoredName,
      trackUrl: currentItem.trackViewUrl,
      artistName: currentItem.artistName,
      artistUrl: currentItem.artistViewUrl,
      genre: currentItem.primaryGenreName,
      preview: currentItem.previewUrl,
      artwork: currentItem.artworkUrl60,
      albumName: currentItem.collectionName,
      albumUrl: currentItem.collectionViewUrl,
      albumPrice: currentItem.collectionPrice,
      trackPrice: currentItem.trackPrice,
      releaseDate: new Date(Date.parse(currentItem.releaseDate)).toDateString()
    };
    readyResults[i] = individualResult;


  }

    var typeChoice = $('#sort-choice').val();
    readyResults = sortBySortInput(readyResults, typeChoice);

  document.getElementById("home-content").style.display = "none";
  if (readyResults.length != 0){
      displayResultsInHtml(readyResults);
      $('#myTableBody').pageMe({pagerSelector:'#myPager',showPrevNext:true,hidePageNumbers:false,perPage:10});
    }
    else {
      $('#display-message').html("I'm sorry, your search yielded no results. Please try again with other key words.");
    }

}




function displayResultsInHtml(readyResults){
    var htmlToAdd = "";

    readyResults = readyResults.forEach(getDisplayForTrack);



    function getDisplayForTrack(individual){
      htmlToAdd += '<tr>';
      htmlToAdd += '<td><img src=artwork>'.replace("artwork", individual.artwork)+'</td>';
      htmlToAdd += '<td>Track:&nbsp;&nbsp;<a href="trackUrl" target="_blank">'.replace("trackUrl", individual.trackUrl) + 'track'.replace("track", individual.trackName) + '</a><br>Price: $price&nbsp;&nbsp;'.replace("price", individual.trackPrice) + '</td>';
      htmlToAdd += '<td>Artist:&nbsp;&nbsp;<a href="artistUrl" target="_blank">'.replace("artistUrl", individual.artistUrl) + 'artist'.replace("artist", individual.artistName) + '</a></td>';
      htmlToAdd += '<td>Album Name:&nbsp;&nbsp;<a href="albumUrl" target="_blank">'.replace("albumUrl", individual.albumUrl) + 'album'.replace("album", individual.albumName) + '</a><br>Album Released:&nbsp;&nbsp; date'.replace("date", individual.releaseDate) + '<br>Genre:&nbsp;&nbsp; genre'.replace("genre", individual.genre) + '</td>';
      htmlToAdd += '<td><audio controls src="previewUrl" preload="none"></audio></td>'.replace("previewUrl", individual.preview);
      htmlToAdd += '</tr>';
    }



      var opening = '<div class="container"><table class="table" id="myTable"><thead><tr>';
      var headers = '<th></th><th>Track</th><th>Artist</th><th>Album</th><th>Preview</th></tr></thead>';
      var body = '<tbody id="myTableBody"> ' + htmlToAdd;
      var ending = '</tbody></table><div class="row"><div class="col-md-12 text-center"><ul class="pagination pagination-xs pager" id="myPager"></ul></div></div></div>';
      var finalHtml = opening + headers + body + ending;

    $('#itunes-results').html(finalHtml);


}

function sortBySortInput(readyResults, typeChoice)
{
  if($('#sort-choice').val() == "noFilter"){
    typeChoice = $('#filter').val();
  }

  sortedResults = readyResults.sort(compare);
  return sortedResults;

  function compare(a, b){

    if (a[typeChoice] < b[typeChoice])
      return -1;
    if (a[typeChoice] > b[typeChoice])
      return 1;
    return 0;
  }
}

function sortByFilter(readyResults, filter){

}
