import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token !== null) {
      console.log('Token recuperado:', token);
      return token; // Aquí devuelves el token
    } else {
      console.log('No se encontró ningún token');
      return null;
    }
  } catch (error) {
    console.error('Error al recuperar el token:', error);
    return null;
  }
};


const CrearContenedor = () => {
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState(1); // Valor mínimo predeterminado
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE_URL = 'https://water-efficient-control.onrender.com/';
   // Token actualizado

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
      // Recuperar el token de AsyncStorage
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
        token
      };
  
      // Realizar la solicitud
      const response = await fetch(`${BASE_URL}containers/crear/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Incluir el token en los headers
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
            // Navigate to Home screen after creation
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
      <Text style={styles.title}>Crear Contenedor</Text>

      <View style={styles.transparentContainer}>
        <View style={styles.formContainer}>
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
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Capacidad en litros:</Text>
          <TextInput
            style={styles.input}
            value={capacidad.toString()}
            onChangeText={(text) => setCapacidad(Number(text))}
            placeholder="Capacidad"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Ubicación:</Text>
          <TextInput
            style={styles.input}
            value={ubicacion}
            onChangeText={setUbicacion}
            placeholder="Ubicación del contenedor"
          />
        </View>

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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  transparentContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fondo translúcido
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  formContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#00a8cc',
  },
});

export default CrearContenedor;
