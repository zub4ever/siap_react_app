import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Dimensions, Image } from 'react-native';
import { Formik, Field } from 'formik';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';

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
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [showCamera, setShowCamera] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [foto_doc_frente, setFotoDocFrente] = useState(null);
  const [foto_doc_verso, setFotoDocVerso] = useState(null);
  const [foto_com_documento, setFotoComDocumento] = useState(null);

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

  const handleCapture = async (camera) => {
    const photo = await camera.takePictureAsync();
    setCapturedPhoto(photo);
    setShowModal(true);
  };

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

              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
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
                  <Text style={styles.buttonText}>Trocar</Text>
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
  buttonCamera: {
    backgroundColor: '#007bff',
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
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 10,
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
});

export default MyForm;
