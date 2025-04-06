import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      console.log('Token recuperado:', token);
      return token;
    } else {
      console.log('No se encontró ningún token');
      return null;
    }
  } catch (error) {
    console.error('Error al recuperar el token:', error);
    return null;
  }
};

const CrearContenedor = ({ navigation }) => {
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState(1);
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE_URL = 'https://water-efficient-control.onrender.com/';

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!tipo || !ubicacion) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    if (capacidad < 1) {
      setError('La capacidad debe ser al menos 1 litro.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = await getToken();

      if (!token) {
        setError('No se encontró un token válido. Por favor, inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      const newContainer = {
        tipo,
        capacidad,
        ubicacion,
        token,
      };

      // Realizar la solicitud
      const response = await fetch(`${BASE_URL}containers/crear/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newContainer),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el servidor.');
      }

      const data = await response.json();
      console.log('Contenedor creado:', data);

      // Restablecer campos
      setTipo('');
      setCapacidad(1);
      setUbicacion('');
      setLoading(false);
      Alert.alert('Éxito', 'Contenedor creado con éxito', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Contenedores');
          },
        },
      ]);
    } catch (error) {
      console.error('Error al crear el contenedor:', error);
      setError(error.message || 'Hubo un error al enviar el formulario.');
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
      <Animatable.Text animation="fadeIn" style={styles.title}>Crear Contenedor</Animatable.Text>

      <View style={styles.transparentContainer}>
        <Animatable.View animation="fadeInUp" style={styles.formContainer}>
          <Text style={styles.label}>Tipo:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipo}
              onValueChange={(itemValue) => setTipo(itemValue)}
            >
              <Picker.Item label="Selecciona un tipo" value="" />
              <Picker.Item label="Alberca" value="Alberca" />
              <Picker.Item label="Tinaco" value="Tinaco" />
              <Picker.Item label="Contenedor" value="Contenedor" />
            </Picker>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.formContainer}>
          <Text style={styles.label}>Capacidad en litros:</Text>
          <TextInput
            style={styles.input}
            value={capacidad.toString()}
            onChangeText={(text) => setCapacidad(Number(text))}
            placeholder="Capacidad"
            keyboardType="numeric"
            placeholderTextColor="#a3a3a3"
          />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.formContainer}>
          <Text style={styles.label}>Ubicación:</Text>
          <TextInput
            style={styles.input}
            value={ubicacion}
            onChangeText={setUbicacion}
            placeholder="Ubicación del contenedor"
            placeholderTextColor="#a3a3a3"
          />
        </Animatable.View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.actionButton, styles.submitButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar Cambios'}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
    letterSpacing: 1,
  },
  transparentContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fondo translúcido
    padding: 25,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  formContainer: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 10,
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Roboto-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#a3a3a3',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#a3a3a3',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  submitButton: {
    backgroundColor:'#00a8cc', // Vino rojo
  },
});

export default CrearContenedor;
