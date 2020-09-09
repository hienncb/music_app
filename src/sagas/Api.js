import callApi from "./ApiCaller";

// const url = 'https://nets-play-music.herokuapp.com/music/';
const url_today = 'http://192.168.1.2:3000/music/today_music';
const url_year = 'http://192.168.1.2:3000/music/year_music';


function* getTodayMusics(){
    var data = [];
    yield callApi(url_today, 'GET',{data:null}).then(res =>{
        data = res.data.today.fulfillmentValue;
    })
    return data;
}

function* getYearMusics(){
    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@")
    var data = [];
    yield callApi(url_year, 'GET',{data:null}).then(res =>{
        // console.log('@@@@@@@@@@@@@@@@@@@@@', res.data.year.fulfillmentValue);
         data = res.data.year.fulfillmentValue;
    })
    return data;
}

export const Api = {
    getTodayMusics,
    getYearMusics
}; 
