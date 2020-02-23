'use strict';

const apiKey = 'AIzaSyA_DZWWeB3wGRcUARK-YveczXcU1zq6dbU'; 
const searchURL = 'https://www.googleapis.com/youtube/v3/search';

const randomMovies = ['action movie', 'horror movie', 'classic movie', 'comedy movie', 'drama movie', 'suspense thriller movie', 'romance movie'];


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  $('#search-results').show();
  for (let i = 0; i < responseJson.items.length; i++){
    console.log(responseJson.items[i].snippet.description);
    $('#results-list').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <iframe width="560" height="315" src='https://www.youtube.com/embed/${responseJson.items[i].id.videoId}' frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </li>`
    )};  
  $('#results').removeClass('hidden');
};

function displayRandomResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  $('#search-results').show();
  let theArray = responseJson.items;
  var randomItem = theArray[Math.floor(Math.random() * theArray.length)]
    $('#results-list').append(
      `<li><h3>${randomItem.snippet.title}</h3>
      <p>${randomItem.snippet.description}</p>
      <iframe width="560" height="315" src='https://www.youtube.com/embed/${randomItem.id.videoId}' frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </li>`
    )}; 

  $('#results').removeClass('hidden');


function getYouTubeVideos(query, maxResults=10, isRandom) {
  const params = {
    key: apiKey,
    q: query,
    part: 'snippet',
    maxResults,
    type: 'video'
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if (responseJson.items.length == 0){
        $('#results-list').empty();
        $('#results-list').append(
        `<li><h3>Sorry, no results found.</h3>
          </li>`)
      } else if (isRandom){
        displayRandomResults(responseJson);
      } else {
        displayResults(responseJson)
      } 
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    let searchTerm = $('#js-search-term').val();
    searchTerm = searchTerm + ' review'
    const maxResults = $('#js-max-results').val();
    getYouTubeVideos(searchTerm, maxResults, false);
  });
  $('#random-button').on('click', event => {
    event.preventDefault();
    let searchTerm = randomMovies[Math.floor(Math.random() * randomMovies.length)]
    searchTerm = searchTerm + ' review'
    console.log(searchTerm);
    getYouTubeVideos(searchTerm, 1, true);
  })
}

$(watchForm);