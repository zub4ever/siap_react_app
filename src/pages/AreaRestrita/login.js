import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, StyleSheet, Dimensions, TextInput, Button } from 'react-native';

const { width, height } = Dimensions.get('window');

const MyComponent = ({ navigation }) => {
  const imagem = require('../../imagens/slide1.jpg');
  const [cpf, setCpf] = useState('');
  const [matricula, setMatricula] = useState('');
  const [token, setToken] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Inicio', params: { cpf } }],
      });
    }
  }, [loggedIn, navigation, cpf]);

  const handleLogin = () => {
    const formattedCpf = cpf.replace(/\D/g, ''); // Remove pontos e traço do CPF
    const cpfWithMask = formattedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); // Adiciona pontos e traço ao CPF formatado

    console.log('Enviando requisição:', { cpf: cpfWithMask, matricula });

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: cpfWithMask, matricula }),
    };

    fetch('http://192.168.1.9/api/login', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {

          setToken(data.token);
          setLoggedIn(true);
          setCpf(cpfWithMask); // Atualiza o estado do CPF

        } else {
          // Exibir mensagem de erro ou tomar outra ação em caso de falha no login
        }
      })
      .catch((error) => {
        console.error('Erro na requisição:', error);
      });
  };

  const formatCpf = (value) => {
    const cpfFormatted = value.replace(/\D/g, ''); // Remove pontos e traço do CPF
    const cpfWithMask = cpfFormatted.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    setCpf(cpfWithMask); // Atualiza o estado 'cpf' com o valor formatado
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={imagem} style={styles.image} resizeMode="cover">
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="CPF"
            value={cpf}
            onChangeText={formatCpf}
            keyboardType="numeric"
            maxLength={14}
          />

          <TextInput
            style={styles.input}
            placeholder="Matrícula"
            value={matricula}
            onChangeText={setMatricula}
            keyboardType="numeric"
          />

          <Button title="Login" onPress={handleLogin} />

          {loggedIn && <Text style={styles.tokenText}>{token}</Text>}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tokenText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyComponent;
