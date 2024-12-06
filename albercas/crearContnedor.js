import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

const CrearContenedor = () => {
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState(1); // Valor mínimo predeterminado
  const [ubicacion, setUbicacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE_URL = 'https://water-efficient-control.onrender.com/';
  const token = '58a6bfc2-67f0-4a8c-bd09-d5e0d2300af1'; // Token actualizado

  const handleSubmit = () => {
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

    const newContainer = {
      tipo,
      capacidad,
      ubicacion,
      token, // Incluir el token en la solicitud
    };

    fetch(`${BASE_URL}containers/crear/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContainer),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || 'Error en el servidor.');
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Contenedor creado:', data);
        // Restablecer campos
        setTipo('');
        setCapacidad(1);
        setUbicacion('');
        setLoading(false);
        Alert.alert('Éxito', 'Contenedor creado con éxito');
      })
      .catch((error) => {
        console.error('Error al crear el contenedor:', error);
        setError(error.message || 'Hubo un error al enviar el formulario.');
        setLoading(false);
      });
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
