import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function MyCamera() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (!cameraPermission) {
      return;
    }

    const photoData = await camera.takePictureAsync();
    setCapturedPhotos([...capturedPhotos, photoData]);
    setCapturing(false);
  };

  const handleRetakePhoto = (index) => {
    const updatedPhotos = [...capturedPhotos];
    updatedPhotos.splice(index, 1);
    setCapturedPhotos(updatedPhotos);
    setCapturing(true);
  };

  const handleSavePhoto = (index) => {
    // You can perform any necessary logic here when the photo is saved
  };

  const sendPhotos = () => {
    // Perform API call to send the captured photos
    // Use the capturedPhotos array to access the photos to send
    console.log('Sending photos:', capturedPhotos);
  };

  const renderPhotos = () => {
    return capturedPhotos.map((photo, index) => (
      <View key={index} style={styles.photoContainer}>
        <Image source={{ uri: photo.uri }} style={styles.photo} />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => handleRetakePhoto(index)}>
            <Ionicons name="close" size={28} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSavePhoto(index)}>
            <Ionicons name="checkmark" size={28} color="green" />
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {!capturing && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setCapturing(true)}>
            <Text style={styles.buttonText}>Foto Frente Documento</Text>
          </TouchableOpacity>

          {capturedPhotos.length > 0 && (
            <TouchableOpacity style={styles.sendButton} onPress={sendPhotos}>
              <Text style={styles.sendButtonText}>Enviar Fotos</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {cameraPermission && capturing && (
        <View style={styles.cameraViewContainer}>
          <Camera style={styles.camera} type={cameraType} ref={(ref) => (camera = ref)} />

          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Text style={styles.captureButtonText}>Capturar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchCameraButton}
            onPress={() => setCameraType(cameraType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}
          >
            <Text style={styles.switchCameraButtonText}>Virar Câmera</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.photosContainer}>
        {renderPhotos()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'blue',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'green',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  cameraViewContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 15,
  },
  captureButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
  },
  switchCameraButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 15,
  },
  switchCameraButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  photoContainer: {
    alignItems: 'center',
    margin: 5,
  },
  photo: {
    width: width / 3,
    height: width / 3,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default MyCamera;
