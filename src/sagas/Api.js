/*
Mr Nguyen Duc Hoang
https://www.youtube.com/c/nguyenduchoang
Email: sunlight4d@gmail.com
Send GET / POST api requests to server
*/
const urlGetMovies = 'http://10.0.129.35:3000/music/today_music';

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
        //  console.log("@@@", responseJson.today.fulfillmentValue);
        // var movies = JSON.parse(responseJson.today);   
        // console.log("@@@", responseJson.today); 
        data = responseJson.today.fulfillmentValue;
        // return responseJson.today.fulfillmentValue;
    })
    // console.log("@@@", data);
  return data;
}
export const Api = {
    getMoviesFromApi
}; 