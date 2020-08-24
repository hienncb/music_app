import React from 'react'
import { View, Text, FlatList, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { fetchMoviesAction } from '../actions';

class ListMusic extends React.Component{
    componentDidMount(){
        this.props.onFetchMovies();       
    }
    render(){
        return(
            <View style={{flex: 1}}>
                 <FlatList
                    data={this.props.movies}
                    keyExtractor={(item) => item.href}
                    renderItem={({ item, index }) =>
                    <TouchableOpacity onPress={() =>{
                            // this.props.navigation.setParams({ href: item.href });
                            this.props.navigation.navigate('Home',  { index: index })
                        }
                      }>
                        <Text numberOfLines = {1}
                            style={{
                            padding: 10,
                            fontWeight: 'bold',
                            fontSize: 17, 
                            color: 'white',
                            backgroundColor: (index === 0 || index === 1 || index == 2) ? 'dodgerblue' : 'mediumseagreen'
                        }}>
                            {`${item.title}`}
                        </Text>
                    </TouchableOpacity>
                    }
                />
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