import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { fetchMoviesAction } from '../actions';
import { Icon } from 'react-native-elements';

class ListMusic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            select: 0
        }
    }
    componentDidMount() {
        this.props.onFetchMovies();
    }
    ClickToday = () => {
        this.setState({
            select: 0
        })
        this.props.onFetchMovies();
    }
    ClickMonth = () => {
        this.setState({
            select: 1
        })
    }
    ClickYear = () => {
        this.setState({
            select: 2
        })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#343a40" }}>
                <View style={{ flexDirection: 'row', marginTop: 5, marginHorizontal: 10, justifyContent: 'space-between', paddingVertical: 10, marginBottom: 10 }}>
                    <TouchableOpacity>
                        <Icon name='menu' size={20} color="#517fa4" type='feather' />
                    </TouchableOpacity>
                    <Icon name='library-music' size={30} color="#517fa4" type='FontAwesome' />
                    <TouchableOpacity>
                        <Icon name="search" size={20} color="#517fa4" type='Feather' />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', backgroundColor: '#e12f81', justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 100, paddingTop: 10 }}>
                    <TouchableOpacity onPress={this.ClickToday}>
                        <Text style={{ color: 'white', fontWeight: (this.state.select == 0) ? 'bold' : 'normal' }}> Hôm nay </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.ClickMonth}>
                        <Text style={{ color: 'white', fontWeight: (this.state.select == 1) ? 'bold' : 'normal' }}> Tháng </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.ClickYear}>
                        <Text style={{ color: 'white', fontWeight: (this.state.select == 2) ? 'bold' : 'normal' }}> Năm </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: -80, marginHorizontal: 20, flex: 1, backgroundColor: '#23282c', borderTopLeftRadius: 7, borderTopRightRadius: 7 }}>
                    <FlatList
                        data={this.props.movies}
                        keyExtractor={(item) => item.href}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate('Home', { index: index })
                            }
                            }>
                                <View style={{ flexDirection: 'row', margin: 9 }}>
                                    <Image
                                        source={{ uri: 'https://picsum.photos/200' }}
                                        style={{ width: 60, height: 60 }}
                                    />
                                    <Text numberOfLines={2}
                                        style={{
                                            paddingHorizontal: 9,
                                            flex: 3,
                                            color: 'white',

                                        }}
                                    >
                                        {`${item.title}`}
                                    </Text>
                                    <Icon name='play-circle-outline' size={30} color="#517fa4" type='FontAwesome' />
                                </View>
                                <View style={{ flex: 1, height: 1, backgroundColor: 'grey' }}></View>
                            </TouchableOpacity>
                        }
                    />
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
        }
    };
}


const Musics = connect(mapStateToProps, mapDispatchToProps)(ListMusic);
export default Musics;