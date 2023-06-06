import React from 'react';
import { View,Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

const ENTRIES = [
    {
        illustration: require('../../imagens/slide1.png'),
    },
    {
        illustration: require('../../imagens/slide2.png'),
    },
    {
        illustration: require('../../imagens/slide3.png'),
    },
];

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Home = ({ navigation }) => {
    const handleLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Swiper style={styles.wrapper} showsButtons={true}>
                {ENTRIES.map((item, index) => (
                    <View style={styles.slide} key={index}>
                        <Image
                            source={item.illustration}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                ))}
            </Swiper>
            {/* Login button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Icon name="user" size={20} color="black" style={styles.loginIcon} />
                <Text style={styles.loginText}>Area Restrita</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    loginButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#41BCFF',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
      },
      loginIcon: {
        marginRight: 5,
      },
      loginText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
});

export default Home;
