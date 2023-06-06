import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Dimensions, Image, ScrollView } from 'react-native';
import { Formik, Field } from 'formik';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useRoute } from "@react-navigation/native";
import moment from 'moment';
import { TextInputMask } from 'react-native-masked-text';


const initialValues = {
  etapa1: {
    cep: '',
    nr_telefone: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  },
  etapa2: {
    nm_servidor: '',
    matricula: '',
    cpf: '',
    data_nascimento: '',
    foto_doc_frente: '',
    foto_doc_verso: '',
    foto_doc_facial: '',
  }
};


const MyForm = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [showCamera, setShowCamera] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [foto_doc_frente, setFotoDocFrente] = useState(null);
  const [foto_doc_verso, setFotoDocVerso] = useState(null);
  const [foto_com_documento, setFotoComDocumento] = useState(null);
  const [servidorData, setServidorData] = useState({});

  const route = useRoute();
  const { cpf } = route.params;

  useEffect(() => {
    console.log("CPF:", cpf); // Exemplo de uso do CPF recuperado
  }, [cpf]);




  const avancarEtapa = () => {
    setEtapaAtual(etapaAtual + 1);
  };

  const voltarEtapa = () => {
    setEtapaAtual(etapaAtual - 1);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('https://172.26.94.98/v1/storeDados/app/react', values);
      console.log(response.data); // Exemplo de uso da resposta da API
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
    setSubmitting(false);
  };
  



  const handleCapture = async (camera) => {
    const photo = await camera.takePictureAsync();
    setCapturedPhoto(photo);
    setShowModal(true);
  };
  const handleSearchCep = async (values, setFieldValue) => {
    const cep = values.etapa1.cep.replace(/\D/g, '');
    try {
      const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      const { data } = response;
      setFieldValue('etapa1.rua', data.street);
      setFieldValue('etapa1.bairro', data.neighborhood);
      setFieldValue('etapa1.cidade', data.city);
      setFieldValue('etapa1.estado', data.state);
    } catch (error) {
      console.error('Erro na busca do CEP:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://172.26.94.98/api/serve/cpf?cpf=${cpf}`);
        console.log('Enviando requisição:', { cpf: cpf });
        if (response.ok) {
          const data = await response.json();
          setServidorData(data);
        } else {
          console.error('Erro na requisição:', response.status);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    };

    fetchData();
  }, [cpf]);

  const handleStorePhoto = () => {
    if (etapaAtual === 2) {
      if (!foto_doc_frente) {
        setFotoDocFrente(capturedPhoto);
      } else if (!foto_doc_verso) {
        setFotoDocVerso(capturedPhoto);
      } else if (!foto_com_documento) {
        setFotoComDocumento(capturedPhoto);
      }
    }
    setShowModal(false);
    setShowCamera(false);
    console.log("Foto capturada:", capturedPhoto);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);



  if (cameraPermission === null) {
    return <View />;
  }

  if (cameraPermission === false) {
    return <Text>Acesso negado à câmera!</Text>;
  }

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <ScrollView>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, isSubmitting, setFieldValue, setservidorData, setSubmitting  }) => (

          <View style={styles.container}>
            {etapaAtual === 1 && (
              <View>
                <Text style={styles.title}>Endereço</Text>
                {/* Exibição do CPF */}

                <Text style={styles.title}>Informações Pessoais</Text>
                <Field name="etapa1.nm_servidor">
                  {({ field }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Nome"
                      onChangeText={field.onChange(field.name)}
                      value={servidorData.nm_servidor}
                      editable={false}
                    />
                  )}
                </Field>

                <View style={styles.infoContainer}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoTitle}>Matrícula</Text>
                    <TextInput
                      style={styles.infoInput}
                      placeholder="Matrícula"
                      value={servidorData?.matricula?.toString() ?? ''}
                      editable={false}
                    />
                  </View>

                  <View style={styles.infoItem}>
                    <Text style={styles.infoTitle}>CPF</Text>
                    <TextInput
                      style={styles.infoInput}
                      placeholder="CPF"
                      value={cpf}
                      editable={false}
                    />
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoTitle}>Data Nascimento</Text>
                    <TextInput
                      style={styles.infoInput}
                      placeholder="Data de Nascimento"
                      value={moment(servidorData?.data_nascimento).format('DD/MM/YYYY')}
                      editable={false}
                    />
                  </View>

                </View>
                <View style={styles.horizontalLine} />

                <Field name="etapa1.nr_telefone">
                  {({ field }) => (
                    <TextInputMask
                      style={styles.input}
                      placeholder="Telefone"
                      type={'cel-phone'}
                      options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99) ',
                      }}
                      onChangeText={field.onChange(field.name)}
                      value={field.value.nr_telefone}
                    />
                  )}
                </Field>


                <View style={styles.horizontalLine} />



                {/* Campos de entrada para o endereço */}
                {/* ... */}
                <Field name="etapa1.cep">
                  {({ field }) => (
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="CEP"
                        onChangeText={field.onChange(field.name)}
                        value={values.etapa1.cep}
                      />
                      <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => handleSearchCep(values, setFieldValue)}
                      >
                        <Text style={styles.searchButtonText}>Buscar CEP</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Field>
                <Field name="etapa1.rua">
                  {({ field }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Rua"
                      onChangeText={field.onChange(field.name)}
                      value={values.etapa1.rua}
                    />
                  )}
                </Field>
                <Field name="etapa1.numero">
                  {({ field }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Número"
                      onChangeText={field.onChange(field.name)}
                      value={values.etapa1.numero}
                    />
                  )}
                </Field>
                <Field name="etapa1.complemento">
                  {({ field }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Complemento"
                      onChangeText={field.onChange(field.name)}
                      value={values.etapa1.complemento}
                    />
                  )}
                </Field>
                <Field name="etapa1.bairro">
                  {({ field }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Bairro"
                      onChangeText={field.onChange(field.name)}
                      value={values.etapa1.bairro}
                    />
                  )}
                </Field>
                <Field name="etapa1.cidade">
                  {({ field }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Cidade"
                      onChangeText={field.onChange(field.name)}
                      value={values.etapa1.cidade}
                    />
                  )}
                </Field>
                <Field name="etapa1.estado">
                  {({ field }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Estado"
                      onChangeText={field.onChange(field.name)}
                      value={values.etapa1.estado}
                    />
                  )}
                </Field>

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



                <TouchableOpacity
                  style={[styles.buttonCamera, foto_doc_frente && styles.buttonCameraGreen]}
                  onPress={() => setShowCamera(true)}
                >
                  <Text style={styles.buttonText}>Frente do documento</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.buttonCamera, foto_doc_verso && styles.buttonCameraGreen]}
                  onPress={() => setShowCamera(true)}
                >
                  <Text style={styles.buttonText}>Verso do documento</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.buttonCamera, foto_com_documento && styles.buttonCameraGreen]}
                  onPress={() => setShowCamera(true)}
                >
                  <Text style={styles.buttonText}>Foto segurando o documento</Text>
                </TouchableOpacity>



                <TouchableOpacity style={styles.button} onPress={voltarEtapa}>
                  <Text style={styles.buttonText}>Etapa Anterior</Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSubmit(values, { setSubmitting })}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>

              </View>
            )}

            <Modal visible={showCamera} animationType="slide">
              <View style={styles.cameraContainer}>
                <Camera
                  style={[styles.camera, { aspectRatio: 1 }]}
                  type={cameraType}
                  ratio="1:1"
                  ref={(ref) => {
                    camera = ref;
                  }}
                >
                  <TouchableOpacity
                    style={styles.flipButton}
                    onPress={() => {
                      setCameraType(
                        cameraType === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back
                      );
                    }}
                  >
                    <View style={styles.flipButton}>
                      <FontAwesome name="exchange" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Trocar</Text>
                    </View>

                  </TouchableOpacity>
                </Camera>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={() => handleCapture(camera)}
                >
                  <FontAwesome name="camera" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </Modal>

            <Modal visible={showModal} animationType="slide">
              <View style={[styles.modalContainer, { width: screenWidth, height: screenHeight }]}>
                {capturedPhoto && (
                  <Image source={{ uri: capturedPhoto.uri }} style={styles.capturedPhoto} />
                )}
                <TouchableOpacity style={styles.button} onPress={handleStorePhoto}>
                  <Text style={styles.buttonText}>Usar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setShowModal(false)}>
                  <Text style={styles.buttonText}>Tirar Outra Foto</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        )}
      </Formik>
    </ScrollView>
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
    justifyContent: 'center', // Adicionado para centralizar verticalmente
    alignItems: 'center', // Adicionado para centralizar horizontalmente
  },

  buttonText: {
    color: '#fff',
    fontSize: 18, // Aumentado o tamanho da fonte
    fontWeight: 'bold',
    textAlign: 'center',
  },

  buttonCamera: {
    backgroundColor: '#41bcff',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  buttonCameraGreen: {
    backgroundColor: 'green',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  flipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10
  },

  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 50,
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturedPhoto: {
    width: '100%',
    height: '80%',
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: 'green',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,

  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18, // Aumentado o tamanho da fonte
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  infoItem: {
    flex: 1,
    marginRight: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    borderColor: 'blue',
    marginBottom: 10,
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
});

export default MyForm;
