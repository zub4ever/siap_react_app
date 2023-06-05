import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { useNavigation } from '@react-navigation/native';

const Provadevida = () => {
  const navigation = useNavigation();

  const handleFormProvaDeVida = () => {
    navigation.navigate('FormProvaVida');
  };

  return (
    <View>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleFormProvaDeVida}
          >
            <Text style={styles.buttonText}>Realizar prova de vida</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Table borderStyle={styles.tableBorder}>{/* Seus componentes de tabela aqui */}</Table>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 20,
    marginHorizontal: 30,
    shadowColor: '#f8f8f8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Provadevida;
