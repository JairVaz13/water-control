import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
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

const CrearDispensador = ({ navigation }) => {
  const [contenedores, setContenedores] = useState([]);
  const [contenedorSeleccionado, setContenedorSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContenedores = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('No se encontró un token válido.');

        const response = await fetch(`https://water-efficient-control.onrender.com/containers/${token}`);
        if (!response.ok) throw new Error('Error al obtener la lista de contenedores.');

        const data = await response.json();
        setContenedores(data || []);
      } catch (error) {
        console.error('Error al obtener los contenedores:', error);
        setError('No se pudieron cargar los contenedores.');
      }
    };

    fetchContenedores();
  }, []);

  const handleSubmit = async () => {
    if (!contenedorSeleccionado) {
      setError('Por favor selecciona un contenedor.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = await getToken();
      if (!token) throw new Error('No se encontró un token válido.');

      const newDispensador = {
        estado: '0',
        id_recipiente: parseInt(contenedorSeleccionado, 10),
        token,
      };

      const response = await fetch('https://water-efficient-control.onrender.com/dispensadores/crear/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDispensador),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Error al crear el dispensador.');
      }

      const data = await response.json();
      console.log('Dispensador creado:', data);

      setContenedorSeleccionado('');
      Alert.alert('Éxito', 'Dispensador creado con éxito', [
        { text: 'OK', onPress: () => navigation.navigate('Dispensadores') },
      ]);
    } catch (error) {
      console.error('Error al agregar el Dispensador:', error);
      setError(error.message || 'Hubo un error al enviar el formulario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
      <Animatable.Text animation="fadeIn" style={styles.title}>
        Agregar Dispensador a tu alberca
      </Animatable.Text>

      <View style={styles.transparentContainer}>
        <Animatable.View animation="fadeInUp" style={styles.formContainer}>
          <Text style={styles.label}>Contenedor:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={contenedorSeleccionado}
              onValueChange={(itemValue) => setContenedorSeleccionado(itemValue)}
            >
              <Picker.Item label="Selecciona un contenedor" value="" />
              {contenedores.map((contenedor) => (
                <Picker.Item
                  key={contenedor.id_recipiente}
                  label={`${contenedor.tipo || 'Tipo desconocido'} - ${contenedor.id_recipiente}`}
                  value={contenedor.id_recipiente}
                />
              ))}
            </Picker>
          </View>
        </Animatable.View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  transparentContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 25,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
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
    marginTop: 10,
    textAlign: 'center',
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
    backgroundColor: '#00a8cc',
  },
});

export default CrearDispensador;
