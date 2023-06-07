import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';

function Inicio({ navigation, route }) {
  const { cpf } = route.params;
  const [serveData, setServeData] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.1.9/api/serve/cpf?cpf=${cpf}`);
        console.log('Enviando requisição:', { cpf: cpf });
        if (response.ok) {
          const data = await response.json();
          setServeData(data);
        } else {
          console.error('Erro na requisição:', response.status);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    };

    fetchData();
  }, [cpf]);

  const handleProvaDeVida = () => {
    navigation.navigate('ProvaVida');
    navigation.navigate('FormProvaVida', { cpf: cpf });

  };

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'rgb(0,206,209)', justifyContent: 'center' }}>
      {/* Renderizar os dados retornados pela API */}
      {serveData && (
        <View style={styles.container}>
          <Text style={[styles.name, { textAlign: 'center' }]}>{serveData.nm_servidor}</Text>
          <View style={styles.infoContainer}>
            <View style={styles.info}>
              <Text style={styles.infoTitle}>Matrícula</Text>
              <Text style={styles.infoText}>{serveData.matricula}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoTitle}>CPF</Text>
              <Text style={styles.infoText}>{serveData.cpf}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.infoTitle}>Data Nascimento</Text>
              <Text style={styles.infoText}>{moment(serveData.data_nascimento).format('DD/MM/YYYY')}</Text>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.cardContainer, { backgroundColor: 'rgb(0, 123, 255)' }]}
        onPress={handleProvaDeVida}
      >
        <Text style={styles.cardText}>Prova de Vida</Text>
      </TouchableOpacity>
    </View>
  );



  //
}
//

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 6,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    backgroundColor: 'rgb(30,144,255)',
    width: '90%',
  },
  name: {
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: 'white',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingBottom: 10,
    marginBottom: 10,
  },
  info: {
    flex: 1,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  infoText: {
    fontSize: 16,
  },
  cardContainer: {
    backgroundColor: 'rgb(0, 123, 255)',
    padding: 10,
    borderRadius: 5,

  },
  cardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



export default Inicio;
