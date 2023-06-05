import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { Formik, Field } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import {FontAwesome} from '@expo/vector-icons';
const initialValues = {
  etapa1: {
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  },
  etapa2: {
    nome: '',
    matricula: ''
  }
};

const MyForm = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  

  const avancarEtapa = () => {
    setEtapaAtual(etapaAtual + 1);
  };

  const voltarEtapa = () => {
    setEtapaAtual(etapaAtual - 1);
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setSubmitting(false);
  };

 
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHaspermission] = useState(null);
  
  useEffect(() => {

    (async () => {

        const {status} = await Camera.requestCameraPermissionsAsync();
        setHaspermission (status ==='granted');
    })();
  },[]);

  if(hasPermission === null){
    return <View/>;
  }
  if(hasPermission === false){
    return <Text>Acesso negado!</Text>;
  }


  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, isSubmitting }) => (
        <View style={styles.container}>
          {etapaAtual === 1 && (
            <View>
              <Text style={styles.title}>Endereço</Text>
              {/* Campos de entrada para o endereço */}
              {/* ... */}
              <TouchableOpacity style={styles.button} onPress={avancarEtapa}>
                <Text style={styles.buttonText}>Próxima Etapa</Text>
              </TouchableOpacity>
            </View>
          )}

          {etapaAtual === 2 && (
            <View>
              <Text style={styles.title}>Dados de identificação</Text>
              {/* Campos de entrada para dados de identificação */}
              {/* ... */}
              

              <TouchableOpacity style={styles.button} onPress={voltarEtapa}>
                <Text style={styles.buttonText}>Etapa Anterior</Text>
              </TouchableOpacity>

              
                <View style={styles.cameraContainer}>
                  <Camera style={{flaex:1,backgroundColor:'transparent',flexDirection: 'row'}}>
                    <TouchableOpacity style = {{position: 'absolute', bottom: 20, left : 20}}
                    onPress={()=>{
                        setType(
                            type === Camera.Constants.Type.back
                            ?Camera.Constants.Type.front
                            :Camera.Constants.Type.back
                        );
                    }}
                    >
                        <Text style = {{fontSize: 16 , marginBottom: 13 , color: 'FFF'}}>Trocar</Text>
                </ TouchableOpacity>
                </Camera>
                 <TouchableOpacity style ={styles.buttonCamera}>
                    <FontAwesome name = "camera" size ={20} color = "FFF"/>
                 </TouchableOpacity>
                </View>
              


              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
    aspectRatio: 1,
  },
  buttonCamera:
  {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#121212',
    borderRadius: 10,
    margin: 20,
    height: 50
  },
});

export default MyForm;
