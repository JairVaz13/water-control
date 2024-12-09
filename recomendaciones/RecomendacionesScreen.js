import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token || null;
  } catch (error) {
    console.error('Error al recuperar el token:', error);
    return null;
  }
};

const RecomendacionesScreen = ({ navigation }) => { // Recibe navigation aquí
  const [contenedores, setContenedores] = useState([]);
  const [contenedorSeleccionado, setContenedorSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE_URL = 'https://water-efficient-control.onrender.com/';

  useEffect(() => {
    const fetchContenedores = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('No se encontró un token válido.');

        const response = await fetch(`${BASE_URL}containers/${token}`);
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

      const response = await fetch(`${BASE_URL}ia/recommendations?id_recipiente=${contenedorSeleccionado}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el servidor.');
      }

      const data = await response.json();

      Alert.alert(
        'Éxito',
        'Recomendación obtenida con éxito.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MostrarRecomendacion', { recomendacion: data }), // Navegación exitosa
          },
        ]
      );
    } catch (error) {
      console.error('Error al obtener la recomendación:', error);
      setError(error.message || 'Hubo un error al obtener la recomendación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0f8c8c', '#025959', '#012840']} style={styles.container}>
      <Text style={styles.title}>Crear Recomendación</Text>

      <View style={styles.transparentContainer}>
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
                label={`${contenedor.tipo || 'Tipo desconocido'} - ${contenedor.id_recipiente || 'ID desconocido'}`}
                value={contenedor.id_recipiente}
              />
            ))}
          </Picker>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {loading && <ActivityIndicator size="large" color="#fff" />}
        <TouchableOpacity
          style={[styles.actionButton, styles.submitButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Obtener Recomendación'}</Text>
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
  },
  transparentContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#fff',
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

export default RecomendacionesScreen;
