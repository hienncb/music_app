import React from 'react'
import { View, Image, Text, Slider, TouchableOpacity, Platform, Alert} from 'react-native';
import { connect } from 'react-redux';
import Sound from 'react-native-sound';
// import {Slider} from '@react-native-community/slider'
import { fetchMoviesAction, addMovieAction } from '../actions';

const img_speaker = require('../resources/ui_speaker.png');
const img_pause = require('../resources/ui_pause.png');
const img_play = require('../resources/ui_play.png');
const img_playjumpleft = require('../resources/ui_playjumpleft.png');
const img_playjumpright = require('../resources/ui_playjumpright.png');

class MainContain extends React.Component{

    static navigationOptions = props => ({
        title:props.navigation.state.params.title,
    })

    constructor(props){
        super(props);
        this.state = {
            playState:'paused', //playing, paused
            playSeconds:0,
            duration:0,
            index: this.props.route.params.index ? this.props.route.params.index : 0,
            filepath: 'https://data25.chiasenhac.com/downloads/2112/1/2111250-b3e25ff6/128/Roi%20Mot%20Ngay%20Minh%20Noi%20Ve%20Tinh%20Yeu%20-%20Ho%20N.mp3'
        }
        this.sliderEditing = false;
        // this.props.route.params.index
    }

    componentDidMount(){
        this.play();
        
        this.timeout = setInterval(() => {
            if(this.sound && this.sound.isLoaded() && this.state.playState == 'playing' && !this.sliderEditing){
                this.sound.getCurrentTime((seconds, isPlaying) => {
                    this.setState({playSeconds:seconds});
                })
            }
        }, 100);
    }
    componentWillUnmount(){
        if(this.sound){
            this.sound.release();
            this.sound = null;
        }
        if(this.timeout){
            clearInterval(this.timeout);
        }
    }

    onSliderEditStart = () => {
        this.sliderEditing = true;
    }
    onSliderEditEnd = () => {
        this.sliderEditing = false;
    }
    onSliderEditing = value => {
        if(this.sound){
            this.sound.setCurrentTime(value);
            this.setState({playSeconds:value});
        }
    }

    play = async () => {
        // console.log('@@@@@: ', this.props.route.params.href)
        console.log(this.state.index)
        // this.setState({
        //     filepath: this.props.movies[this.state.index]
        // })
        // if(this.sound){
        //     // this.sound.play(this.playComplete);
        //     this.setState({playState:'playing'});
        // }else{
            // const filepath = 'https://data25.chiasenhac.com/downloads/2112/1/2111675-0f1457d9/128/Yeu%20Ai%20Yeu%20Ai%20De%20Khong%20Phai%20Khoc_%20-%20NB3.mp3';
            // const filepath = this.props.route.params.href;
            console.log('[Play]', this.props.movies[this.state.index]);
    
            this.sound = new Sound(this.props.movies[this.state.index].href, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    Alert.alert('Notice', 'audio file error. (Error code : 1)');
                    this.setState({playState:'paused'});
                }else{
                    this.setState({playState:'playing', duration:this.sound.getDuration()});
                    this.sound.play(this.playComplete);
                }
            });    
        // }
    }
    playComplete = (success) => {
        if(this.sound){
            if (success) {
                console.log('successfully finished playing');
                if(this.state.index < this.props.movies.length){
                    this.setState({
                    index: this.state.index + 1
                    })
                    this.play();
                }
               
                // this.props.movies
            } else {
                console.log('playback failed due to audio decoding errors');
                Alert.alert('Notice', 'audio file error. (Error code : 2)');
            }
            this.setState({playState:'paused', playSeconds:0});
            this.sound.setCurrentTime(0);
        }
    }

    pause = () => {
        if(this.sound){
            this.sound.pause();
        }

        this.setState({playState:'paused'});
    }

    jumpPrev15Seconds = () => {
        this.jumpSeconds(-15);
    }
    jumpNext15Seconds = () => {this.jumpSeconds(15);}
    jumpSeconds = (secsDelta) => {
        if(this.sound){
            this.sound.getCurrentTime((secs, isPlaying) => {
                let nextSecs = secs + secsDelta;
                if(nextSecs < 0) nextSecs = 0;
                else if(nextSecs > this.state.duration) nextSecs = this.state.duration;
                this.sound.setCurrentTime(nextSecs);
                this.setState({playSeconds:nextSecs});
            })
        }
    }

    getAudioTimeString(seconds){
        const h = parseInt(seconds/(60*60));
        const m = parseInt(seconds%(60*60)/60);
        const s = parseInt(seconds%60);

        return ((h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
    }

    render(){

        const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
        const durationString = this.getAudioTimeString(this.state.duration);

        return (
            <View style={{flex:1, justifyContent:'center', backgroundColor:'black'}}>
                <Image source={img_speaker} style={{width:150, height:150, marginBottom:15, alignSelf:'center'}}/>
                <View style={{flexDirection:'row', justifyContent:'center', marginVertical:15}}>
                    <TouchableOpacity onPress={this.jumpPrev15Seconds} style={{justifyContent:'center'}}>
                        <Image source={img_playjumpleft} style={{width:30, height:30}}/>
                        <Text style={{position:'absolute', alignSelf:'center', marginTop:1, color:'white', fontSize:12}}>15</Text>
                    </TouchableOpacity>
                    {this.state.playState == 'playing' && 
                    <TouchableOpacity onPress={this.pause} style={{marginHorizontal:20}}>
                        <Image source={img_pause} style={{width:30, height:30}}/>
                    </TouchableOpacity>}
                    {this.state.playState == 'paused' && 
                    <TouchableOpacity onPress={this.play} style={{marginHorizontal:20}}>
                        <Image source={img_play} style={{width:30, height:30}}/>
                    </TouchableOpacity>}
                    <TouchableOpacity onPress={this.jumpNext15Seconds} style={{justifyContent:'center'}}>
                        <Image source={img_playjumpright} style={{width:30, height:30}}/>
                        <Text style={{position:'absolute', alignSelf:'center', marginTop:1, color:'white', fontSize:12}}>15</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginVertical:15, marginHorizontal:15, flexDirection:'row'}}>
                    <Text style={{color:'white', alignSelf:'center'}}>{currentTimeString}</Text>
                    <Slider
                        onTouchStart={this.onSliderEditStart}
                        // onTouchMove={() => console.log('onTouchMove')}
                        onTouchEnd={this.onSliderEditEnd}
                        // onTouchEndCapture={() => console.log('onTouchEndCapture')}
                        // onTouchCancel={() => console.log('onTouchCancel')}
                        onValueChange={this.onSliderEditing}
                        value={this.state.playSeconds} maximumValue={this.state.duration} maximumTrackTintColor='gray' minimumTrackTintColor='white' thumbTintColor='white' 
                        style={{flex:1, alignSelf:'center', marginHorizontal:Platform.select({ios:5})}}/>
                    <Text style={{color:'white', alignSelf:'center'}}>{durationString}</Text>
                </View>
            </View>
        )
    }
}


const mapStateToProps = (state) => {        
    return {        
        movies: state.movieReducers
    }
};

const mapDispatchToProps = (dispatch) => {
    return {    
        onFetchMovies: () => {                        
            dispatch(fetchMoviesAction());
        }, 
        //Not necessary !   
        // onSuccessFetch: () => {                        
        //     dispatch(fetchSuccessAction());
        // }, 
        onAddMovie: (newMovie) => {                        
            dispatch(addMovieAction(newMovie));
        }
    };
}

const MovieContainer = connect(mapStateToProps, mapDispatchToProps)(MainContain);
export default MovieContainer;