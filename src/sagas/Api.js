const urlGetMovies = 'https://nets-play-music.herokuapp.com/music/today_music';

function* getMoviesFromApi() {
    var data = [];
    const response = yield fetch(urlGetMovies, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: '',
    }).then((response) => response.json())
    .then((responseJson) => {
        data = responseJson.today.fulfillmentValue;
    })
  return data;
}
export const Api = {
    getMoviesFromApi
}; 