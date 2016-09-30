//parameters needs to be an object

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

function doSearch() {
//making a "parameters" object
  var encodedParameters = handleParameters();
  var url = 'https://itunes.apple.com/search?' + encodedParameters;
  $('head').append('<script src="' + url + '"></script>'); //adding the place where you get the search results into the head
}

function handleParameters(){
    var searchInput = $('#search-input').val();
    //var filterInput = $('#filter').val();
    var attributeInput;

  /*  if (filterInput == "musicArtist"){
      attributeInput = "artistTerm";
    }
    else if (filterInput == "musicTrack"){
      attributeInput = "songTerm";
    }
    else if (filterInput == "album"){
      attributeInput = "albumTerm";
    }*/

    var parameters = {
      term: searchInput,
      country: 'US',
      media: 'music',
      //entity: filterInput,
      //attribute: attributeInput,
    //limit: 20,
      callback: 'handleReturnResults'
    };
  parameters = encode(parameters);
  return parameters;
}




//callback is function that it returns and it puts a data object that holds an array into the parameters, so capture the object in the parameters and get what you need from them
function handleReturnResults(totalResults) {
  console.log(totalResults);
  var rawResults = totalResults.results; //accessing the results property from the returned object then take out each result that you want by accessing individual propterties on every result
  var readyResults = [];
  for (var i = 0; i < rawResults.length; i++) {
    var currentItem = rawResults[i];
    var individualResult = {
      //source: 0,
      trackName: currentItem.trackCensoredName,
      trackUrl: currentItem.trackViewUrl,
      artistName: currentItem.artistName,
      artistUrl: currentItem.artistLinkUrl,
      collectionName: currentItem.collectionCensoredName,
      collectionUrl: currentItem.collectionViewUrl,
      genre: currentItem.primaryGenreName,
      preview: currentItem.previewUrl,
      artwork: currentItem.artworkUrl60,
      albumName: currentItem.collectionName,
      albumUrl: currentItem.collectionViewUrl,
      albumPrice: currentItem.collectionPrice,
      albumExplicitness: currentItem.collectionExplicitness,
      releaseDate: currentItem.releaseDate
    };
    readyResults[i] = individualResult;//not doing anything with this array right now

   //if i want previews, they will have to be in here in order to access the currentItem because they are only on the results array objects
  }
  if($('#sort-choice').val() != "noFilter"){
    var typeChoice = $('#sort-choice').val();
    return readyResults = sortByFilter(readyResults, typeChoice);
  }
  displayResultsInHtml(readyResults);
  $('#myTableBody').pageMe({pagerSelector:'#myPager',showPrevNext:true,hidePageNumbers:false,perPage:10});
}




function displayResultsInHtml(readyResults){
    var htmlToAdd = "";

    //var filterChoice = $('#filter').val();
    readyResults = readyResults.forEach(getDisplayForTrack);

/*  if (filterChoice == "musicArtist"){
    readyResults = readyResults.forEach(getDisplayForArtist); //maybe use this new array for saving results?
  }
  else if (filterChoice == "album"){
    readyResults = readyResults.forEach(getDisplayForAlbum);
  }
  else {
    readyResults = readyResults.forEach(getDisplayForTrack);
  }*/

    function getDisplayForArtist(individual){
        htmlToAdd += '<div class="search-result container"><div class ="row"> <div class="col-sm-4"> <p>Artist:&nbsp;&nbsp; artist'.replace("artist", individual.artistName) + '</div>';
        htmlToAdd += '<div class="col-sm-4"> <a href="preview" target="_blank">'.replace("preview", individual.artistUrl) + 'Preview Artist </a> </div></div>';
        //return html;
    }

    function getDisplayForTrack(individual){
      htmlToAdd += '<tr>';
      htmlToAdd += '<td><img src=artwork>'.replace("artwork", individual.artwork)+'</td>';
      htmlToAdd += '<td>Track:&nbsp;&nbsp; track'.replace("track", individual.trackName) + '</td>';
      htmlToAdd += '<td>Artist:&nbsp;&nbsp;<a href="artistUrl">'.replace("artistUrl", individual.artistUrl) + 'artist'.replace("artist", individual.artistName) + '</a></td>';
      htmlToAdd += '<td>Album Name:&nbsp;&nbsp; album'.replace("album", individual.albumName) + '</td>';
      //htmlToAdd += '<td><a href="artisturl" target="_blank">'.replace("artisturl", individual.artistUrl) + 'ArtistBio </a></td>';
      htmlToAdd += '</tr>';
    }



    function getDisplayForAlbum(individual){
      htmlToAdd += '<div class="myTableBody"><div class ="row"> <div class="col-sm-2"><img src=artwork>'.replace("artwork", individual.artwork)+'</div>';

      htmlToAdd += '<div class="col-sm-3"> Album In Itunes:&nbsp;&nbsp; link'.replace("link", individual.albumUrl) + '</div>';
      htmlToAdd += '<div class="col-sm-2"> Artist:&nbsp;&nbsp;<a href="artistUrl">'.replace("artist", individual.artistUrl) + 'artist'.replace("artist", individual.artistName) + '</a></div>';
      htmlToAdd += '<div class="col-sm-2"> <a href="artisturl" target="_blank">'.replace("artisturl", individual.artistUrl) + 'ArtistBio </a></div></div>';
    }



      htmlToAdd = '<div class="container"><table class="table" id="myTable"><thead><tr><th></th><th>Track</th><th>Artist</th><th>Album</th></tr></thead><tbody id="myTableBody"> ' + htmlToAdd;
      htmlToAdd += '</tbody></table><div class="row"><div class="col-md-12 text-center"><ul class="pagination pagination-xs pager" id="myPager"></ul></div></div></div>';

    $('#itunes-results').html(htmlToAdd);


}

function sortByFilter(readyResults, typeChoice)
{
  sortedResults = readyResults.sort(compare);

  function compare(a, b){

    if (a.typeChoice < b.typeChoice) //this doesn't work need to figure out how to get typeChoice to pull in actual property
      return -1;
    if (a.typeChoice > b.typeChoice)
      return 1;
    return 0;
  }
}

//$('.pagination').pagination({
  //dataSource: [1, 2, 3, 4, 5, 6. 7, ... , 195],
  //callback: function(data, pagination){

  //}
//})
