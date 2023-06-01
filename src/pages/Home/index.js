import React from 'react';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';


const width = Dimensions.get('screen').width;

export default function Home() {
    
        return (
            <View style={styles.container}>
              <Text>Página Inicial</Text>
              <StatusBar style="auto" />
            </View>
          );
        }
        
        const styles = StyleSheet.create({
          container: {
            flex: 1,
            backgroundColor: '#61C7FF',
            alignItems: 'center',
            justifyContent: 'center',
          },
        });