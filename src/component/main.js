import React from 'react'
import { View, Image, Text, TouchableOpacity, Platform, Alert, BackHandler, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Sound from 'react-native-sound';
import { fetchMoviesAction, addMovieAction } from '../actions';
import { Icon } from 'react-native-elements';
import Slider from '@react-native-community/slider';
class MainContain extends React.Component {

    static navigationOptions = props => ({
        title: props.navigation.state.params.title,
    })

    constructor(props) {
        super(props);
        this.state = {
            playState: 'paused', //playing, paused
            playSeconds: 0,
            duration: 0,
            loop: false,
            random: false,
            index: this.props.route.params.index ? this.props.route.params.index : 0,
            filepath: 'https://data25.chiasenhac.com/downloads/2112/1/2111250-b3e25ff6/128/Roi%20Mot%20Ngay%20Minh%20Noi%20Ve%20Tinh%20Yeu%20-%20Ho%20N.mp3',
            CurrentTime: 0, 
            img: false
        }
        this.sliderEditing = false;
    }

    componentDidMount() {
        this.play();
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.timeout = setInterval(() => {
            if (this.sound && this.sound.isLoaded() && this.state.playState == 'playing' && !this.sliderEditing) {
                this.sound.getCurrentTime((seconds, isPlaying) => {
                    this.setState({ playSeconds: seconds });
                })
            }
        }, 1000);
    }
    componentWillUnmount() {
        if (this.sound) {
            this.sound.release();
            this.sound = null;
        }
        if (this.timeout) {
            clearInterval(this.timeout);
        }
        this.backHandler.remove();
    }

    onSliderEditStart = () => {
        this.sliderEditing = true;
    }
    onSliderEditEnd = () => {
        this.sliderEditing = false;
    }
    onSliderEditing = value => {
        if (this.sound) {
            this.sound.setCurrentTime(value);
            this.setState({ playSeconds: value });
        }
    }

    play = async () => {
        // console.log(this.state.index)
        this.sound = new Sound(this.props.movies[this.state.index].href, '', (error) => {
            if (error || !this.sound.getDuration()) {
                // console.log('failed to load the sound', error);
                // Alert.alert('Notice', 'audio file error. (Error code : 1)');
                this.setState({ playState: 'paused' });
            } else {
                this.sound.setCurrentTime(this.state.playSeconds);
                if (this.state.playSeconds == this.state.duration) {
                    this.sound.play(this.playComplete);
                }
                this.setState({ playState: 'playing', duration: this.sound.getDuration() });
                this.sound.play(this.playComplete);
            }
        });
    }
    playComplete = (success) => {
        if (this.sound) {
            if (success) {
                if (this.state.index < this.props.movies.length - 1) {
                    this.setState({
                        index: this.state.index + 1
                    })
                    this.play();
                } else {
                    this.setState({
                        index: 0
                    })
                    if (this.state.loop == true) {
                        this.play();
                    }
                }

            } else {
            }
            this.setState({ playState: 'paused', playSeconds: 0 });
            this.sound.setCurrentTime(0);
        }
    }

    pause = () => {
        if (this.sound) {
            this.sound.pause();
        }
        this.sound.getCurrentTime((secs, isPlaying) => {
            this.sound.setCurrentTime(secs);
            this.setState({ playSeconds: secs });
        })
        this.setState({ playState: 'paused' });
    }

    jumpPrev15Seconds = () => {
        this.jumpSeconds(-15);
    }
    jumpNext15Seconds = () => { this.jumpSeconds(15); }
    jumpSeconds = (secsDelta) => {
        if (this.sound) {
            this.sound.getCurrentTime((secs, isPlaying) => {
                let nextSecs = secs + secsDelta;
                if (nextSecs < 0) nextSecs = 0;
                else if (nextSecs > this.state.duration) nextSecs = this.state.duration;
                this.sound.setCurrentTime(nextSecs);
                this.setState({ playSeconds: nextSecs });
            })
        }
    }

    calculate(index) {
        this.sound.setCurrentTime(0);
        this.sound.pause();
        if (this.state.index < this.props.movies.length - 1) {
            this.setState({
                index: this.state.index + index,
                playState: 'playing',
                playSeconds: 0
            })
        }
    }

    nextPlay = async () => {
        await this.calculate(1);
        this.play();
    }

    backPlay = async () => {
        await this.calculate(-1);
        this.play();
    }

    selectSong = async (index) =>{
        await this.sound.setCurrentTime(0);
        await this.sound.pause();
        await this.setState({
            index: index,
            playState: 'playing',
            playSeconds: 0
        })
        await this.play();
    }

    getAudioTimeString(seconds) {
        const m = parseInt(seconds % (60 * 60) / 60);
        const s = parseInt(seconds % 60);

        return ((m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
    }
    playLoop = () => {
        this.setState({
            loop: !this.state.loop
        })
    }
    playRandom = () => {
        this.setState({
            random: !this.state.random
        })
    }

    transferImg = () => {
        this.setState({
            img: !this.state.img
        })
    }

    back = ()=>{
        // console.log("@@@@@@@@@@@@@@");
        this.props.navigation.navigate('List');
    }

    backAction = () => {
        console.log('disconnect')
        return true;
    };

    render() {
        const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
        const durationString = this.getAudioTimeString(this.state.duration);
        return (
            <View numberOfLines={2} style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black', paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, marginHorizontal: 10 }}>
                    <TouchableOpacity onPress={this.back}>
                        <Icon name='chevron-left' size={20} color='#e12f81' type='font-awesome-5' />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon name='library-music' size={30} color="#e12f81" type='FontAwesome' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.transferImg}>
                        <Icon name={!this.state.img ? 'clipboard-list' : 'images'} size={20} color='#e12f81' type='font-awesome-5' />
                    </TouchableOpacity>
                </View>
                <View style={{ display: !this.state.img ? 'none' : 'flex', flex: 1 }}>
                    <FlatList
                        data={this.props.movies}
                        keyExtractor={(item) => item.href}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity onPress={() => {
                              this.selectSong(index);
                            }
                            }>
                                <View style={{ flexDirection: 'row', margin: 9 }}>
                                    <Image
                                        source={{ uri: item.img }}
                                        style={{ width: 60, height: 60 }}
                                    />
                                    <Text numberOfLines={2}
                                        style={{
                                            paddingHorizontal: 9,
                                            flex: 3,
                                            color: 'white',

                                        }}
                                    >
                                        {item.title.slice(4)}
                                    </Text>
                                    <Icon name='play-circle-outline' size={30} color="#517fa4" type='FontAwesome' />
                                </View>
                                <View style={{ flex: 1, height: 1, backgroundColor: 'grey' }}></View>
                            </TouchableOpacity>
                        }
                    />
                </View>
                <View style={{ display: this.state.img ? 'none' : 'flex', flex: 1 }}>
                    <Image
                        source={{ uri: this.props.movies[this.state.index].img }}
                        style={{ width: '100%', height: '100%', marginBottom: 15, alignSelf: 'center' }} />
                </View>
                <View style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, marginHorizontal: 10 }}>
                        <TouchableOpacity onPress={this.playLoop}>
                            <Icon name='loop' size={20} color={this.state.loop ? '#e12f81' : 'white'} type='simple-line-icon' />
                        </TouchableOpacity>
                        <Text style={{ color: 'white', alignSelf: 'center', fontSize: 15 }}>
                            {this.props.movies[this.state.index].title.slice(4)}
                        </Text>
                        <TouchableOpacity onPress={this.playRandom}>
                            <Icon name='random' size={20} color={this.state.random ? '#e12f81' : 'white'} type='font-awesome' />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginVertical: 15, marginHorizontal: 15, flexDirection: 'row' }}>
                        <Text style={{ color: 'white', alignSelf: 'center' }}>{currentTimeString}</Text>
                        <Slider
                            style={{ width: 200, height: 40 }}
                            minimumValue={0}
                            maximumValue={this.state.duration}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                            onValueChange={this.onSliderEditing}
                            onSlidingStart={this.onSliderEditStart}
                            onSlidingComplete={this.onSliderEditEnd}
                            value={this.state.playSeconds}
                            maximumTrackTintColor='gray'
                            style={{ flex: 1, alignSelf: 'center', marginHorizontal: Platform.select({ ios: 5 }) }}
                        />
                        <Text style={{ color: 'white', alignSelf: 'center' }}>{durationString}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 15 }}>
                        <TouchableOpacity onPress={this.backPlay}>
                            <Icon name='step-backward' size={30} color="white" type='font-awesome-5' />
                        </TouchableOpacity>
                        {this.state.playState == 'playing' &&
                            <TouchableOpacity onPress={this.pause} style={{ marginHorizontal: 60 }}>
                                <Icon name='pause' size={30} color="white" type='AntDesign' />
                            </TouchableOpacity>}
                        {this.state.playState == 'paused' &&
                            <TouchableOpacity onPress={this.play} style={{ marginHorizontal: 60 }}>
                                <Icon name='play' size={30} color="white" type='font-awesome-5' />
                            </TouchableOpacity>}
                        <TouchableOpacity onPress={this.nextPlay}>
                            <Icon name='step-forward' size={30} color="white" type='font-awesome-5' />
                        </TouchableOpacity>
                    </View>
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


