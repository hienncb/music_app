import callApi from "./ApiCaller";

// const url = 'https://nets-play-music.herokuapp.com/music/';
const url_today = 'https://music-serverasp.herokuapp.com/music/today_music';
const url_year = 'https://music-serverasp.herokuapp.com/music/year_music';


function* getTodayMusics(){
    var data = [];
    yield callApi(url_today, 'GET',{data:null}).then(res =>{
        // console.log('@@@@@@@@@@@@@@@@@@@@@', res.data.today);
        data = res.data.today;
    })
    return data;
}

function* getYearMusics(){
    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@")
    var data = [];
    yield callApi(url_year, 'GET',{data:null}).then(res =>{
        // console.log('@@@@@@@@@@@@@@@@@@@@@', res.data.year.fulfillmentValue);
         data = res.data.year;
    })
    return data;
}

export const Api = {
    getTodayMusics,
    getYearMusics
}; 
