import React, { useState } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, View, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { HeaderTitle } from '@react-navigation/elements';

import Login from "./AreaRestrita/login";

import Home from "./Home/home";
import Inicio from './AreaRestrita/painel/principal';
import ProvaVida from './AreaRestrita/painel/provadevida';
import FormProvaVida from './AreaRestrita/painel/formProvaVida';
import MyCamera from "./AreaRestrita/painel/formTeste";

const Stack = createStackNavigator();

const Routes = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  const loginHeaderOptions = {
    headerTitleAlign: 'center',
    headerRight: () => (
      <TouchableOpacity style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => setShowModal(true)}>
        <Icon name="user" size={20} color="black" style={{ marginRight: 5 }} />
        <Text style={{ fontWeight: 'bold' }}>Sair</Text>
      </TouchableOpacity>
    ),
  };

  const handleLogout = () => {
    // Aqui você pode adicionar a lógica para realizar o logout do usuário
    // Redirecionar para a tela de login ou limpar as informações de autenticação

    // Exemplo:
    // Limpar as informações de autenticação, como token, usuário logado, etc.

    // Redirecionar para a tela de login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });

    setShowModal(false);
  };

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Inicio"
          component={Inicio}
          options={({ route }) => ({
            headerTitle: (props) => <HeaderTitle {...props}>{route.params.cpf}</HeaderTitle>,
            ...loginHeaderOptions,
          })}
        />
        <Stack.Screen name="ProvaVida" component={ProvaVida} options={{ headerTitle: 'Prova de vida' }} />
        <Stack.Screen name="MyCamera" component={MyCamera} options={{ headerTitle: 'MyCamera' }} />
        <Stack.Screen name="FormProvaVida" component={FormProvaVida} options={{ headerTitle: 'Nova Prova de vida' }} />
      </Stack.Navigator>

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Tem certeza que deseja sair?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'green' }]}
                onPress={() => handleLogout()}
              >
                <Text style={styles.buttonText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => setShowModal(false)}>
                <Text style={styles.buttonText}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Routes;
