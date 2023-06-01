import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function AreaRestrita() {
  return (
    <View style={styles.container}>
      <Text>Página Login</Text>
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